#!/usr/bin/env python3
"""Validate the built GitHub Pages artifact and hotfix invariants."""

from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path('.')
BUILD = ROOT / 'dist'
SITE = 'https://www.adventurous.systems'
SITEMAP_NS = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
SOCIAL_IMAGE_SUFFIXES = {'.png', '.svg'}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[tuple[str, str]] = []
        self.meta: list[dict[str, str]] = []
        self.canonicals: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {key.lower(): value or '' for key, value in attrs}
        if tag == 'a' and attr.get('href'):
            self.links.append(('href', attr['href']))
        if tag in {'img', 'script'} and attr.get('src'):
            self.links.append(('src', attr['src']))
        if tag == 'link' and attr.get('href'):
            self.links.append(('href', attr['href']))
            if 'canonical' in attr.get('rel', '').split():
                self.canonicals.append(attr['href'])
        if tag == 'meta':
            self.meta.append(attr)


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)
    print(f'[FAIL] {message}')


def ok(message: str) -> None:
    print(f'[OK] {message}')


def parse_html(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding='utf-8'))
    return parser


def meta_content(parser: PageParser, key: str, value: str) -> list[str]:
    return [
        meta['content']
        for meta in parser.meta
        if meta.get(key) == value and meta.get('content')
    ]


def built_html(failures: list[str]) -> list[Path]:
    files = sorted(BUILD.glob('*.html'))
    if not files:
        fail('dist contains no HTML pages; run npm run build first', failures)
    return files


def expected_url(path: Path) -> str:
    return f'{SITE}/' if path.name == 'index.html' else f'{SITE}/{path.name}'


def check_sitemap(files: list[Path], failures: list[str]) -> None:
    sitemap = BUILD / 'sitemap.xml'
    if not sitemap.exists():
        fail('dist/sitemap.xml is missing', failures)
        return

    tree = ET.parse(sitemap)
    locs = {el.text for el in tree.findall('.//sm:loc', SITEMAP_NS) if el.text}
    expected = {expected_url(path) for path in files}
    site_locs = {url for url in locs if url.startswith(SITE)}

    missing = sorted(expected - site_locs)
    extra = sorted(site_locs - expected)
    if missing:
        fail(f'sitemap missing built HTML pages: {missing}', failures)
    if extra:
        fail(f'sitemap contains pages absent from the build: {extra}', failures)
    if not missing and not extra:
        ok('sitemap exactly covers built HTML pages')


def check_social_asset(url: str, page: Path, failures: list[str]) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in {'http', 'https'} or parsed.netloc not in {
        'www.adventurous.systems',
        'adventurous.systems',
    }:
        fail(f'{page} social image must use the production site: {url}', failures)
        return

    suffix = Path(parsed.path).suffix.lower()
    if suffix not in SOCIAL_IMAGE_SUFFIXES:
        fail(f'{page} social image must be PNG or SVG: {url}', failures)
        return

    target = BUILD / unquote(parsed.path).lstrip('/')
    if not target.is_file():
        fail(f'{page} social image is missing from dist: {target}', failures)


def check_html_metadata(files: list[Path], failures: list[str]) -> None:
    start_count = len(failures)
    for path in files:
        parser = parse_html(path)
        canonical = expected_url(path)
        if parser.canonicals != [canonical]:
            fail(f'{path} canonical must be exactly {canonical}: {parser.canonicals}', failures)

        og_images = meta_content(parser, 'property', 'og:image')
        twitter_images = meta_content(parser, 'name', 'twitter:image')
        if len(og_images) != 1:
            fail(f'{path} must have exactly one og:image', failures)
        else:
            check_social_asset(og_images[0], path, failures)
        if len(twitter_images) != 1:
            fail(f'{path} must have exactly one twitter:image', failures)
        else:
            check_social_asset(twitter_images[0], path, failures)

    if len(failures) == start_count:
        ok('canonical and social metadata checks passed')


def resolve_built_target(page: Path, link: str) -> Path | None:
    parsed = urlparse(link)
    if parsed.scheme or parsed.netloc or link.startswith(('mailto:', 'tel:', '#')):
        return None

    raw_path = unquote(parsed.path)
    if not raw_path:
        return None
    if raw_path == './':
        raw_path = 'index.html'

    if raw_path.startswith('/'):
        target = BUILD / raw_path.lstrip('/')
    else:
        target = page.parent / raw_path

    if raw_path.endswith('/'):
        target /= 'index.html'
    return target.resolve()


def check_internal_links(files: list[Path], failures: list[str]) -> None:
    start_count = len(failures)
    build_root = BUILD.resolve()

    for page in files:
        parser = parse_html(page)
        for kind, link in parser.links:
            target = resolve_built_target(page, link)
            if target is None:
                continue
            try:
                target.relative_to(build_root)
            except ValueError:
                fail(f'{page} has escaping internal {kind}: {link}', failures)
                continue
            if not target.exists():
                fail(f'{page} has broken internal {kind}: {link}', failures)

    if len(failures) == start_count:
        ok('built internal links and assets resolve')


def check_required_sources(failures: list[str]) -> None:
    start_count = len(failures)
    required = [
        ROOT / 'src/js/analytics.js',
        ROOT / 'privacy.html',
        ROOT / 'terms.html',
        ROOT / 'public/images/og-image.png',
        BUILD / 'privacy.html',
        BUILD / 'terms.html',
    ]
    for path in required:
        if not path.is_file():
            fail(f'missing required hotfix file: {path}', failures)

    projects_path = ROOT / 'src/components/data/projects.json'
    try:
        projects = json.loads(projects_path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f'cannot read project data: {exc}', failures)
        projects = {}

    for project in projects.get('projects', []):
        image = project.get('image', '').lstrip('/')
        if not image or not (ROOT / 'public' / image).is_file():
            fail(f'project image missing: {project.get("id")} -> {image}', failures)

    if len(failures) == start_count:
        ok('required legal, analytics, and project assets exist')


def check_analytics_config(failures: list[str]) -> None:
    start_count = len(failures)
    env = (ROOT / '.env.example').read_text(encoding='utf-8')
    for key in [
        'VITE_UMAMI_SCRIPT_URL',
        'VITE_UMAMI_WEBSITE_ID',
        'VITE_UMAMI_HOST_URL',
        'VITE_UMAMI_DOMAINS',
    ]:
        if key not in env:
            fail(f'.env.example missing {key}', failures)

    analytics = (ROOT / 'src/js/analytics.js').read_text(encoding='utf-8')
    main = (ROOT / 'src/js/main.js').read_text(encoding='utf-8')
    for symbol in ['initAnalytics', 'trackEvent', 'sanitizeEventData']:
        if symbol not in analytics:
            fail(f'analytics wrapper missing {symbol}', failures)
    if main.count('initAnalytics();') != 1:
        fail('main.js must initialize analytics exactly once', failures)

    if len(failures) == start_count:
        ok('analytics integration and environment contract checked')


def public_source_text() -> str:
    paths = [
        *sorted(ROOT.glob('*.html')),
        *sorted((ROOT / 'src').rglob('*.js')),
        *sorted((ROOT / 'src').rglob('*.json')),
        ROOT / 'public/llms.txt',
    ]
    return '\n'.join(
        path.read_text(encoding='utf-8')
        for path in paths
        if path.is_file()
    )


def check_identity(failures: list[str]) -> None:
    text = public_source_text()
    forbidden = {
        'SC815558': 'obsolete Companies House identifier',
        'linkedin.com/in/theodounas/': 'non-canonical founder LinkedIn URL',
    }
    for value, label in forbidden.items():
        if value in text:
            fail(f'{label} remains in public source: {value}', failures)

    for required in ['company/15359850', 'linkedin.com/in/theodoredounas/']:
        if required not in text:
            fail(f'required canonical identity is missing: {required}', failures)

    if not any(value in text for value in forbidden) and all(
        value in text for value in ['company/15359850', 'linkedin.com/in/theodoredounas/']
    ):
        ok('company and founder identity references are consistent')


def check_robots_and_llms(failures: list[str]) -> None:
    start_count = len(failures)
    robots = BUILD / 'robots.txt'
    llms = BUILD / 'llms.txt'
    if not robots.is_file():
        fail('dist/robots.txt is missing', failures)
    elif f'Sitemap: {SITE}/sitemap.xml' not in robots.read_text(encoding='utf-8'):
        fail('robots.txt has missing or incorrect sitemap directive', failures)

    if not llms.is_file():
        fail('dist/llms.txt is missing', failures)
    elif 'Adventurous Systems' not in llms.read_text(encoding='utf-8'):
        fail('dist/llms.txt is incomplete', failures)

    if len(failures) == start_count:
        ok('robots and llms files checked')


def main() -> int:
    failures: list[str] = []
    files = built_html(failures)
    if files:
        check_sitemap(files, failures)
        check_html_metadata(files, failures)
        check_internal_links(files, failures)
    check_required_sources(failures)
    check_analytics_config(failures)
    check_identity(failures)
    check_robots_and_llms(failures)

    if failures:
        print(f'\n{len(failures)} site check failure(s)')
        return 1
    print('\nAll site checks passed')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
