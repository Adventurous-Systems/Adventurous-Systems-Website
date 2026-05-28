# GEO Audit Report: Adventurous Systems

**URL**: https://www.adventurous.systems
**Date**: 2026-05-28
**Business Type**: Agency (Professional Services)
**Scoring Model**: v2

---

## GEO Score: 57/100 (Grade C: Developing)

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Technical Accessibility | 87/100 | 20% | 17.4 |
| Content Citability | 66/100 | 35% | 23.1 |
| Structured Data | 59/100 | 20% | 11.8 |
| Entity & Brand | 18/100 | 25% | 4.5 |
| **Composite** | | | **57/100** |

*Scores reflect Agency business-type adjustments (Expertise Signals +15%, Entity Recognition +15%, Organization/Person schema +10%).*

Adventurous Systems has an **excellent technical foundation** — AI crawlers have full access, the site is server-side rendered static HTML, loads in under 100ms, and carries comprehensive structured data. The site is held back by a single dominant weakness: **brand entity signals (18/100)**. The founder, Dr Theo Dounas, possesses substantial verifiable authority (543 Google Scholar citations, a Springer book, EC-3 board secretary) that is **completely disconnected** from the Adventurous Systems brand across the web. Connecting that established authority to the brand, plus fixing a broken sitemap and adding source citations to content, would move this site from C to B within 30 days.

---

## Critical Issues

### 1. Founder's authority is disconnected from the brand entity
**Impact: ~15 points (Entity & Brand)** — This is the single highest-leverage issue in the entire audit.

Dr Theo Dounas has strong, verifiable entity signals: 543 Google Scholar citations (h-index 11), author of *Blockchain for Construction* (Springer, 2022), secretary of the EC-3 board, profiles on ResearchGate, Heriot-Watt research portal, Construction Blockchain Consortium, and 5+ other platforms. **None of these mention "Adventurous Systems."** The work and the brand are decoupled, so AI systems cannot transfer the founder's authority to the company.

**Fix**: Update every external bio (ResearchGate, Google Scholar, Heriot-Watt portal, Construction Blockchain Consortium, Chameleon Events speaker page, university profiles) to read "Founder & Director, Adventurous Systems" with a link to https://www.adventurous.systems. Effort: Low–Medium, mostly self-service.

### 2. Sitemap and robots.txt point to a dead domain
**Impact: ~Critical for both SEO indexing and AI discovery.**

`sitemap.xml` lists all URLs under `https://adventuroussystems.co.uk/` and `robots.txt` ends with `Sitemap: https://adventuroussystems.co.uk/sitemap.xml`. That domain returns **no indexed content** (confirmed via `site:` search). Any crawler following the sitemap hits dead links. This is almost certainly why only the homepage of `adventurous.systems` is currently indexed — the 6 inner pages are not being discovered.

**Fix**:
- Rewrite all `<loc>` entries in [public/sitemap.xml](public/sitemap.xml) to `https://www.adventurous.systems/...`
- Update the `Sitemap:` directive in [public/robots.txt](public/robots.txt) to `https://www.adventurous.systems/sitemap.xml`
- Add the missing `blog.html` entry to the sitemap

---

## High Priority Issues

| Issue | Dimension | Impact | Fix |
|-------|-----------|--------|-----|
| No `llms.txt` file (404) | Technical | −7 raw | Create `/public/llms.txt` summarising the business, services, and key page URLs. Use the `geo-fix-llmstxt` companion agent. |
| Blog page has zero crawlable content | Citability / Schema | −8 (Article schema) + content | blog.html loads from Substack via JS; crawlers/AI see an empty page. Render 3–5 article summaries as static HTML with dates and bylines. |
| No source attribution on key statistics | Citability | −3 to −4 | "62% of UK waste", "38% of global carbon emissions", "£54 billion annually" are unsourced. Add inline citations, e.g. *(DEFRA, 2023)*. |
| No `BreadcrumbList` schema on any page | Schema | −5 | Add BreadcrumbList JSON-LD to all inner pages. |
| Missing `contactPoint` in Organization schema | Schema | −4 | Add `contactPoint` with `systems@adventurous.systems`. |
| Missing `speakable` property | Schema | −5 | Add `SpeakableSpecification` to WebPage schemas (hero title + intro selectors). |
| Zero industry-directory / review-platform presence | Brand | −13 | Create Clutch, DesignRush, Google Business Profile, and Trustpilot listings. |
| No expert quotes / testimonials anywhere | Citability | −3 | Add 2–3 attributed blockquotes from Dr Dounas (ideal AI citation targets). |

---

## Medium Priority Issues

- **Only 2 `sameAs` links** (LinkedIn, Substack) in Organization schema — add 1+ more (GitHub, ResearchGate, X) to reach the 3+ threshold. *(−4 Schema)*
- **Homepage credential numbers render as `0`** without JavaScript (£375k+, 30+, 20+) — AI crawlers that don't execute JS see zeros. Render real values in HTML and let JS handle only the count-up animation. *(−3 Citability)*
- **`og:image` references a non-existent `og-image.png`** (only `.svg` exists); social platforms require raster images. *(−1 Technical)*
- **FAQ content exists on only one page** (what-we-do.html) — replicate the pattern on about.html and our-work.html. *(−2 Citability)*
- **No visible publication / "last updated" dates** on content pages. *(−2 Citability)*
- **No `HowTo` schema on assessment.html** — the AI Readiness Assessment is an ideal HowTo candidate. *(−3 Schema)*
- **Substack does not link back** to the main site, and **NAP is inconsistent** (London virtual office vs. Scotland operations). *(Brand)*

---

## Detailed Analysis

### 1. Technical Accessibility (87/100)

#### Sub-scores
- AI Crawler Access: 35/35
- Rendering & Content Delivery: 15/22
- Speed & Accessibility: 16/18
- Meta & Header Signals: 11/13
- Multimedia Accessibility: 10/12

This is the site's strongest dimension. **AI crawler access is perfect** — robots.txt explicitly allows GPTBot, Google-Extended, ClaudeBot, PerplexityBot, ChatGPT-User, and anthropic-ai, with `User-agent: * / Allow: /` covering everything else. No restrictive `X-Robots-Tag` headers or `noai` meta tags. The site is **fully server-side rendered** static HTML (9/9), served over HTTP/2 with gzip compression and a **97ms response time**. HTTPS, mobile viewport, canonical URLs, title tags, meta descriptions, and `lang="en"` are all present and correct.

Points lost: missing `llms.txt` (−7), the broken sitemap (−2, scored here as a malformed sitemap), the `og:image` raster issue (−1), and functional-but-generic image alt text (−1).

### 2. Content Citability (66/100)

#### Sub-scores
- Answer Block Quality: 12/20
- Self-Containment: 13/18
- Statistical Density: 9/17
- Structural Clarity: 14/17
- Expertise Signals: 8/13 *(after +15% Agency adjustment)*
- AI Query Alignment: 10/15

The **what-we-do.html page is the standout** — a structured FAQ (with FAQPage schema), clear definition blocks, and strong service descriptions. Heading hierarchy and semantic HTML are excellent across all pages, with good use of lists. The main weaknesses are **statistical density** (good numbers, but most lack source attribution) and **expertise signals** (the founder's credentials are stated organisationally but there are no direct expert quotations and no visible content dates).

#### Top Citable Passages
1. *"A digital twin in construction is a dynamic, data-rich virtual representation of a physical built asset — a building, bridge, or infrastructure system. Unlike a static BIM model, a digital twin continuously integrates real-time data from IoT sensors, satellite imagery, maintenance systems, and operational records."* — what-we-do.html
2. *"Construction generates 62% of UK waste while simultaneously extracting virgin materials. Reuse could significantly reduce both, but current systems lack the trust infrastructure to operate at scale."* — our-work.html
3. *"Our AI Readiness Assessment is a structured two-week engagement that evaluates your organisation across six dimensions: Data Infrastructure, Process Maturity, Technical Capability, Governance Frameworks, Use Case Viability, and Organisational Readiness."* — what-we-do.html

#### Improvement Opportunities
- **Add source citations**: "…costs the industry **£54 billion annually** *(Get It Right Initiative / KPMG, 2018)*."
- **Add an expert blockquote** to about.html: *"The AEC industry doesn't have a technology problem — it has a trust and coordination problem…"* — Dr Theo Dounas.
- **Render homepage stats in HTML**: change `data-target` spans from `0` to the real value so crawlers see "£375k+".

### 3. Structured Data (59/100)

#### Sub-scores
- Core Identity Schema: 19/30 *(after +10% Organization adjustment)*
- Content Schema: 3/25
- AI-Boost Schema: 17/25
- Schema Quality: 20/20

The site has a **genuinely good structured-data foundation** — all JSON-LD, all valid, all required properties present (20/20 quality). The homepage carries Organization + WebSite + WebPage; about.html has AboutPage + two Person schemas; what-we-do.html has four Service schemas plus a valid FAQPage; our-work.html has ResearchProject, Book, and ScholarlyArticle schemas. The gaps are in **Content Schema** (no Article/BlogPosting, no `speakable`, no `datePublished`/`dateModified`) and missing **BreadcrumbList** site-wide. blog.html and assessment.html have **no structured data at all**.

> **Note**: The Brand analysis flagged "no schema.org markup on the site." That is incorrect — direct page fetches confirm extensive, valid JSON-LD. The real gap is brand *signals off-site*, not on-site schema.

#### Ready-to-Use JSON-LD (priority additions)
```json
// Add to Organization (index.html)
"contactPoint": {
  "@type": "ContactPoint",
  "email": "systems@adventurous.systems",
  "contactType": "customer service",
  "availableLanguage": ["English"]
}
```
```json
// Add to each inner page
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.adventurous.systems/"},
    {"@type": "ListItem", "position": 2, "name": "What We Do", "item": "https://www.adventurous.systems/what-we-do.html"}
  ]
}
```
```json
// Add to WebPage schemas
"speakable": {
  "@type": "SpeakableSpecification",
  "cssSelector": [".page-hero__title", ".page-hero__intro"]
}
```
*(The `geo-fix-schema` companion agent can generate the full set, including HowTo for assessment.html and a CollectionPage for blog.html.)*

### 4. Entity & Brand (18/100)

#### Sub-scores
- Entity Recognition: 2/30
- Third-Party Presence: 6/25
- Community Signals: 3/25
- Cross-Source Consistency: 7/20

This is the **critical weakness**. The brand is new (incorporated Dec 2023, Companies House #15359850) and has minimal independent web presence: no Wikipedia/Wikidata entry, no Crunchbase, no industry directories, no review platforms, no Reddit/YouTube/GitHub presence under the brand name, and no Google Knowledge Panel. The LinkedIn company page (168 followers) is the only active third-party profile that links back to the site.

The paradox: the **founder** is highly authoritative, but that authority lives entirely under "Theo Dounas" with no link to "Adventurous Systems." Bridging the two (Critical Issue #1) is the fastest path to improving this dimension.

#### Platform Presence Map
| Platform | Status | Quality |
|----------|--------|---------|
| Website | ✅ | Complete, valid schema |
| LinkedIn | ✅ | Active, links back (168 followers) |
| Companies House | ✅ | Official registration |
| Substack | ✅ | Exists, dormant, no backlink |
| Google Scholar (founder) | ✅ | Strong (543 citations) — but no brand link |
| ResearchGate (founder) | ✅ | Good — but no brand link |
| Wikipedia / Wikidata | ❌ | None |
| Crunchbase | ❌ | None |
| Clutch / DesignRush | ❌ | None |
| G2 / Capterra / Trustpilot | ❌ | None |
| Reddit | ❌ | None |
| YouTube (brand) | ❌ | Founder appears in 3rd-party videos only |
| GitHub (brand org) | ❌ | None (related: ArchiDAO, TopologicPy) |
| Twitter/X | ❌ | None |

---

## Platform-Specific Recommendations

| Platform | Key Bias | Priority Signal |
|----------|----------|-----------------|
| **ChatGPT** | Authority-heavy; Wikipedia ≈ 48% of citations | Entity recognition, Wikidata presence |
| **Perplexity** | Freshness-heavy; Reddit ≈ 47% of citations | Recency, community discussion |
| **Gemini** | Brand-site preference; 52% from brand domains | Organization schema, brand consistency |
| **Google AI Overviews** | Ranking signals + structured data | Technical SEO, schema, E-E-A-T |
| **Claude** | Primary sources; high attribution accuracy | Original research, cited statistics |

### ChatGPT Optimization
- Create a **Wikidata entry** for Adventurous Systems Ltd (instance of: software company), linking to Companies House and the founder. Lower notability bar than Wikipedia and achievable now.
- Connect the founder's Google Scholar / Springer authority to the brand (Critical Issue #1).

### Perplexity Optimization
- Build genuine **Reddit** presence in r/BIM, r/AEC, r/digitaltwin, r/blockchain (insights, not promotion).
- Add **visible dates** and freshen content; render the blog as crawlable HTML.

### Gemini Optimization
- The Organization schema is already strong — **add `contactPoint`, `BreadcrumbList`, and a 3rd `sameAs`** to push it over the line.
- Fix the sitemap domain so Gemini can discover all brand-domain pages.

### Claude Optimization
- Add **source citations** to every statistic — Claude strongly prefers attributable primary sources.
- Add **direct expert quotations** from Dr Dounas as self-contained, citable passages.

*Only ~11% of domains are cited by both ChatGPT and Perplexity — platform-specific work compounds.*

---

## Traditional SEO Findings (Supplement)

Beyond the GEO dimensions, these classic SEO issues were identified:

1. **Broken sitemap domain (Critical)** — `sitemap.xml` references `adventuroussystems.co.uk`, which serves no content. This is a migration artifact and the most damaging SEO issue on the site.
2. **Poor index coverage** — a `site:adventurous.systems` search returns only the homepage; the 6 inner pages are not indexed, consistent with the broken sitemap blocking discovery.
3. **Blog has no crawlable content** — JS-only rendering from Substack means search engines index an empty page.
4. **`og:image` raster missing** — social/SEO previews will fail on platforms that reject SVG; some inner pages also use relative `./images/...` paths instead of absolute URLs.
5. **Homepage hero stats invisible to non-JS crawlers** — count-up numbers render as `0` in source HTML.
6. **Title slightly long** — homepage title ~76 chars (ideal <60, acceptable <80).

**SEO quick fix order**: (1) sitemap + robots.txt domain, (2) add blog.html to sitemap, (3) render blog summaries server-side, (4) create a raster og-image with absolute URLs, (5) submit corrected sitemap in Google Search Console.

---

## Quick Wins

Top 5 changes with the biggest impact for the least effort:

1. **Fix the sitemap + robots.txt domain** to `www.adventurous.systems` and add `blog.html` — restores crawl discovery of all pages. *(~Critical SEO + 2 Technical)*
2. **Add `contactPoint`, `BreadcrumbList` (all pages), and a 3rd `sameAs`** to the schema — *(~+11 Schema raw)*
3. **Add Adventurous Systems to the founder's external bios** (ResearchGate, Scholar, Heriot-Watt, EC-3, etc.) — *(~+10–15 Brand raw)*
4. **Add source citations + 2 expert blockquotes** to content pages — *(~+5 Citability raw)*
5. **Create `llms.txt`** summarising the business and key pages — *(+7 Technical raw)*

---

## 30-Day Roadmap

### Week 1: Foundation (Critical fixes)
- Rewrite sitemap.xml + robots.txt to the correct domain; add blog.html; resubmit in Search Console.
- Create `/public/llms.txt` (use `geo-fix-llmstxt`).
- Render homepage credential numbers as static HTML.

### Week 2: Content & Schema
- Add `contactPoint`, `BreadcrumbList`, `speakable`, and a 3rd `sameAs` (use `geo-fix-schema`).
- Add source citations to all statistics; add 2–3 expert blockquotes (use `geo-fix-content`).
- Render 3–5 blog summaries server-side with dates/bylines + BlogPosting schema.

### Week 3: Authority (Brand building)
- Update all of Dr Dounas's external bios to name and link Adventurous Systems.
- Create a Wikidata entry; set up Google Business Profile, Clutch, and DesignRush listings.

### Week 4: Optimization
- Create a brand GitHub org and surface open-source claims; activate the Substack with a backlink.
- Begin genuine Reddit/community participation; verify all fixes re-crawled; set a re-audit baseline with `geo-monitor`.

---

## Diagnostic vs. Measurement

This audit identifies **what to fix** (diagnostic). [AIvsRank.com](https://aivsrank.com?ref=geo-audit) measures **how visible you actually are** across AI platforms — tracking real mentions in ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews. Together they give the complete picture.

---

*Generated by [geo-audit](https://github.com/Cognitic-Labs/geoskills) — an open-source GEO diagnostic skill*
*Scoring methodology based on research from Princeton, Georgia Tech, BrightEdge, and 101 industry sources*

<!-- GEO-AUDIT-META
scoring_model: v2
url: https://www.adventurous.systems
date: 2026-05-28
business_type: Agency
geo_score: 57
grade: C
technical: 87
citability: 66
schema: 59
brand: 18
GEO-AUDIT-META -->
