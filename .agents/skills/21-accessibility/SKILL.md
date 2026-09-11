---
name: accessibility
description: WCAG AA contrast, keyboard focus, reduced motion, and semantic HTML. Use for any UI review or component build to check accessibility compliance across the six ARTHAX portals. Co-owned by Design Director/Frontend and QA — trigger this alongside skill 18 (UX/Interaction), not as a separate late-stage pass.
---

# Accessibility (ARTHAX)

## Overview
WCAG AA is the baseline standard across all six portals — this is financial software, and accessibility failures here are both an inclusion failure and, in many jurisdictions, a compliance risk.

## Requirements
- **Contrast**: all text/background pairs meet WCAG AA (4.5:1 normal text, 3:1 large text). Verify the design system's palette (skill 15) combinations explicitly — Sage Mint on Off White, for example, needs checking, not assuming.
- **Keyboard focus**: every interactive element reachable and operable via keyboard alone, with a visible focus indicator that isn't just the browser default removed with nothing replacing it.
- **Reduced motion**: every GSAP sequence (skill 17) and micro-interaction (skill 29) respects `prefers-reduced-motion`, with a defined fallback, not just "turn everything off."
- **Semantic HTML**: real `<button>`, `<nav>`, `<table>` (for tabular financial data), proper heading hierarchy, form labels — not divs-with-onClick everywhere.

## Rules
1. Accessibility is checked at component-build time (paired with skill 18's state matrix), not only in a final phase-12 pass — catching it early is much cheaper than retrofitting.
2. Financial data tables (transaction history, order book, portfolio) use real `<table>` markup with proper headers — screen reader users need to navigate these by row/column, not just linearly.
3. Loading states need `aria-busy`; error states need `aria-live` regions so screen reader users are notified without needing to poll.
4. Admin portals (Central Bank, Bank) get the same standard as public-facing portals — internal tooling accessibility matters too.

## Common mistakes
- Focus indicator removed via CSS reset with no replacement.
- A financial data grid built with styled `<div>`s instead of `<table>`, unusable with a screen reader.
- Reduced-motion media query checked for GSAP but forgotten for Anime.js micro-interactions (skill 29) or Vanta backgrounds (skill 27).

## Handoff
Co-owned by **Design Director**/**Frontend** and **QA**. Full a11y regression pass in phase 12 (skill 02), but enforced continuously at build time.
