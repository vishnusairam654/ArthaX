---
name: arthax-brand-identity
description: >
  Owns how named brand/entity assets get used — watermarks, the ARTH currency symbol, favicon, the 5
  bank logos, 6 portal hero images, 10 stock company banner/logo pairs, and the printable financial
  documents (certificates, receipts, statements, tax docs). Use whenever a screen needs to represent
  "which bank," "which portal," "which stock," or produce a downloadable/printable document — these
  are identity and authenticity signals, not decorative images.
---

# ARTHAX Brand & Entity Identity

## Brand marks — `assets/brand/`

- **`currency_symbol.png`** — the ARTH glyph. Pair with `--currency-accent` (Arth Gold) contexts from
  `arthax-design-tokens`: balances, prices, reward amounts. Don't use it purely decoratively — every
  appearance should sit next to an actual number.
- **`favicon.png`** — browser tab only, standard usage.
- **`primary_watermark.png` / `watermark_2.png` / `watermark_3.png`** — three watermark variants
  strongly suggests they're not interchangeable. Reasonable default mapping until confirmed otherwise:
  `primary_watermark` for official documents (certificates, statements — see below), and the other two
  as lighter-weight marks for empty-state backgrounds or loading screens, at low opacity (5-8%) so they
  read as texture, not as competing content. Confirm this split rather than guessing per-file if it
  matters for the demo.

## Bank identity — `assets/banks/`

Five banks, each with its own logo: Nava, Samaya, Setu, Sthira, Vayu. Worth knowing (these read as
intentional Sanskrit-rooted names, which is a nice worldbuilding detail worth carrying into any bank
description copy): Nava (new), Samaya (time), Setu (bridge), Sthira (stable), Vayu (wind/air) — each
name already hints at that bank's positioning (Sthira as the conservative/stable option, Vayu as
fast/agile transfers, Setu as the connector, etc.), which is a free source of personality if the copy
leans into it rather than treating all 5 banks as visually/verbally identical.

Usage rule: a bank's own logo appears at the point where the user is choosing or confirming *which*
bank (bank selector, account card header, transaction detail "via [Bank]" line). It should never
replace or compete with the ARTHAX brand mark — ARTHAX is the platform, the bank is a participant on
it, and the visual hierarchy should say that clearly (bank logo smaller/secondary, ARTHAX identity
primary in nav/chrome).

## Portal hero images — `assets/portals/`

Six images (banks, central_bank, central_guide, shop, stocks, user) map directly to the lane system
already established: `central_guide.png` is the one true landing-page hero — full-bleed, part of the
Awwwards-treatment entry experience. The other five are functional-portal headers — use them at a
restrained size (a header banner, not full-viewport), consistent with those portals' "calm, precise"
treatment rather than the Guide Board's spectacle.

## Stock listings — `assets/stocks/`

Ten companies, each with a `banner` and a `logo`. Company names carry the same Sanskrit-rooted
theming as the banks (Arka/sun, Aroha/ascent, Meru/mountain, Tarang/wave, Veda/knowledge, Jala/water,
Kshiti/earth) — worth leaning into for sector flavor if you write company blurbs (Arka Energy as a
solar/power company practically names itself).

Usage split: `logo` is the compact identifier — stock list rows, portfolio holdings, search results
(small, square-ish context). `banner` is the detail-view hero — the individual stock's dedicated page,
where there's room for a wider image. Don't use banner-sized assets in list rows; it'll dominate the
data-dense Stock Portal layout that's supposed to prioritize the price/chart information per the
report's own design direction.

## Printable/downloadable documents — `assets/og/`

`fd_certificate`, `receipt`, `statement`, `statement_confirmation`, `tax_document`,
`trade_confirmation` — these are a different design problem from the rest of the app. They're meant to
be downloaded, printed, or screenshotted and trusted outside the live UI, so they should follow
document conventions, not app-UI conventions:

- Formal layout — more whitespace, clear header/footer structure, not a card-based UI pattern
- `primary_watermark` present (subtle, background) as an authenticity signal
- Fraunces used more heavily than in-app (headers, the amount, the certificate title) since these are
  the one place ARTHAX's "financial-editorial" register per the report can go further than the
  in-app Fraunces/Cantarell balance
- Actually producing these as downloadable files is a `docx` or `pdf` skill task (Claude Code side),
  not a live-UI component — this skill covers their visual/brand treatment, not their generation
  pipeline
- The transaction-status timeline from `arthax-transaction-states` is a natural component to embed in
  `receipt`/`statement_confirmation`/`trade_confirmation` — the same state history, formatted for a
  static document instead of a live UI

## Cross-reference

For the shop's own visual system (avatars, banners, frames, pets) see `arthax-shop-gamification` — it's
deliberately excluded here since it plays by different rules (playful, rarity-tiered) than the
identity assets in this file (authoritative, one-to-one with a real entity).
