# Content Citability Fix: Adventurous Systems

**Source**: https://www.adventurous.systems (homepage, what-we-do, about, our-work)
**Date**: 2026-05-28
**Scope**: Highest-impact citability rewrites from the GEO audit
**Note**: Statistics and quotes below use `[TODO]` placeholders where a real source/quote must be confirmed by the team. **Do not publish invented sources** — replace each `[TODO]` with a verified citation before deploying.

## Why this is a report, not direct edits

The schema, sitemap, robots.txt, llms.txt, and homepage-stat fixes were applied directly to the codebase because they use only verifiable, existing data. The content rewrites below require **real source attributions and a real founder quote** that cannot be fabricated. Apply them once the sources are confirmed.

---

## Citability Score (estimated)

| Metric | Max | Before | After (est.) |
|--------|-----|--------|-------------|
| Hedge Density | 20 | 16 | 18 |
| Data-Supported Claims | 20 | 10 | 16 |
| Self-Contained Paragraphs | 20 | 14 | 17 |
| Structural Clarity | 15 | 13 | 14 |
| Answer Block Quality | 15 | 11 | 14 |
| Term Definitions | 10 | 6 | 9 |
| **Overall** | **100** | **~70** | **~88** |

The single biggest lever is **adding source attributions to existing statistics** (Data-Supported Claims), followed by **adding a direct founder quote** (Expertise Signals in the full audit).

---

## Rewrites

### 1. our-work.html — TRACE problem statement

**Issues**: Missing source for headline statistic

**Before**:
> Construction generates 62% of UK waste while simultaneously extracting virgin materials.

**After**:
> Construction generates 62% of UK waste *[TODO: confirm source — e.g. DEFRA UK Statistics on Waste, 2023]* while simultaneously extracting virgin materials.

**Platform impact**: Claude (named primary source strengthens citation confidence)

---

### 2. about.html — sustainability framing

**Issues**: Missing source for statistic

**Before**:
> Construction accounts for 38% of global carbon emissions.

**After**:
> Construction accounts for 38% of global energy-related carbon emissions *[TODO: confirm source — e.g. UN Environment Programme Global Status Report for Buildings and Construction, 2022]*.

**Platform impact**: Claude / ChatGPT (authority + named source)

---

### 3. what-we-do.html — cost-of-fragmentation claim

**Issues**: Unsourced monetary figure

**Before**:
> This fragmentation costs the industry £54 billion annually in rework, delays, and lost insights.

**After**:
> Data fragmentation costs the UK construction industry £54 billion annually *[TODO: confirm source — e.g. Get It Right Initiative / KPMG]* in rework, delays, and lost insights.

**Platform impact**: Claude (cited statistic = high extractability)

---

### 4. about.html — add a direct founder quote (new block)

**Issues**: No expert quotations anywhere on the site (Expertise Signals)

**Suggested addition** (place in the "Our Story" / founder section). **Use a real Dr Dounas quote** — the text below is a template to be replaced with his own words:

```html
<blockquote class="expert-quote">
  <p>"[TODO: real quote from Dr Theo Dounas — e.g. on why the AEC industry's
  core problem is trust and coordination rather than technology]"</p>
  <footer>— <cite>Dr Theo Dounas</cite>, Founder &amp; Director, Adventurous Systems.
  Author of <em>Blockchain for Construction</em> (Springer, 2022)</footer>
</blockquote>
```

**Platform impact**: ChatGPT (direct expert attribution is a strong citation driver)

---

### 5. All key content pages — add a visible "last updated" line

**Issues**: No visible publication/freshness dates (Expertise Signals, freshness)

**Suggested addition** below each page hero:

```html
<p class="page-meta">Last updated: May 2026 · Reviewed by Dr Theo Dounas, ARB</p>
```

**Platform impact**: Perplexity (freshness signal)

---

### 6. our-work.html & about.html — replicate the FAQ pattern

The what-we-do.html FAQ (with FAQPage schema) is the site's strongest citability asset. Add a short FAQ to our-work.html ("What is a material passport?", "What is the TRACE marketplace?") and about.html ("Who founded Adventurous Systems?", "What is EC3?"), each wrapped in FAQPage JSON-LD. This converts existing prose into directly-citable Q&A blocks.

**Platform impact**: Google AI Overviews + Gemini (FAQ schema feeds answer boxes)

---

## Post-Optimization Validation (after applying)

| # | Check | Status |
|---|-------|--------|
| 1 | Direct answer in first 150 words | Pass (FAQ leads, definitions) |
| 2 | Data density (≥1 stat per 300 words) | Pass |
| 3 | Citation frequency (≥1 source per 500 words) | **Pending** — depends on filling `[TODO]` sources |
| 4 | Definition coverage | Pass (add inline defs for LBD, IFC, EC3) |
| 5 | Self-containment | Pass |
| 6 | Hedge-free zones | Pass |
| 7 | Structural variety | Pass (lists, tables, FAQ) |
| 8 | Freshness signals | **Pending** — add last-updated lines |
| 9 | Quotable passages (≥3) | Pass |
| 10 | No invented data | Pass — all stats marked `[TODO]` until sourced |

**Result**: 8/10 ready now; 2 pending the team's source/quote confirmation.
