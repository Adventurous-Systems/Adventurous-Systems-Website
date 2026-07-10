#!/usr/bin/env python3
"""Validate JSON-LD syntax in every built public HTML page."""

from __future__ import annotations

import json
import re
from pathlib import Path

SCRIPT_RE = re.compile(
    r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>([\s\S]*?)</script>',
    re.IGNORECASE,
)


def check_file(filepath: Path) -> bool:
    content = filepath.read_text(encoding="utf-8")
    matches = list(SCRIPT_RE.finditer(content))

    if not matches:
        print(f"{filepath}: INVALID - no JSON-LD blocks found")
        return False

    valid = True
    for index, match in enumerate(matches, start=1):
        json_str = match.group(1).strip()
        try:
            json.loads(json_str)
            print(f"{filepath} block {index}: valid")
        except json.JSONDecodeError as exc:
            print(f"{filepath} block {index}: INVALID - {exc}")
            valid = False
    return valid


def main() -> int:
    files = sorted(Path('dist').glob('*.html'))
    if not files:
        print('dist: INVALID - no built HTML files found; run npm run build first')
        return 1
    all_valid = all([check_file(path) for path in files])
    print('All JSON-LD blocks valid:', all_valid)
    return 0 if all_valid else 1


if __name__ == '__main__':
    raise SystemExit(main())
