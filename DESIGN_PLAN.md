# ARTHAX Design Plan — "The Ledger Gazette"

> Authored from: `arthax-design-tokens`, `anti-ai-design`, `arthax-layout-and-motion`,
> `material-rounded-smooth`, `arthax-brand-identity`, `arthax-security-ux`,
> `arthax-transaction-states`, `gsap-animation-design` + the standing rules in [`AGENTS.md`](./AGENTS.md).

---

## 1. The big idea

**ARTHAX is a living financial gazette — money presented as front-page news.**

Every fintech app looks like every other fintech app: dark dashboard, glass cards, violet gradients,
numbers in boxes. ARTHAX does the opposite. It is **light-first, warm, editorial** — it treats money
the way a fine newspaper treats a headline:

- **Warm Ivory (`#F2EFE7`) paper** is the canvas — not white, not dark. It reads as *printed*, calm,
  trustworthy. A subtle grain texture (3–5% opacity) sits over hero surfaces so nothing feels sterile.
- **Fraunces serif carries the voice.** Balances, portfolio values, and portal titles are set as
  *oversized editorial headlines* — the number IS the graphic, not text trapped inside a card.
- **Arth Gold is ink, not decoration.** Gold appears only where actual money appears: balances,
  rewards, currency glyphs, certificate seals. If a pixel of gold isn't attached to an amount, it's wrong.
- **One unified session, six distinct rooms.** All portals share the same paper-and-ink foundation,
  but each leads with its own accent so a single screenshot tells you where you are.

Design personality in three words: **Calm. Precise. Human.**

Anti-AI stance (deliberate breaks of the convergence families):

| AI-default family | Our break |
|---|---|
| Dark zinc + violet gradient | Warm ivory base, no gradients-as-decoration anywhere |
| Hero → bento → pricing → FAQ | No marketing-section flow exists — these are working portals |
| Everything-in-a-card | Typographic grouping + rules/hairlines; cards only for genuinely repeated data |
| Uniform `rounded-xl p-6` | Hierarchical radius scale (4/8/12/16/28), asymmetric padding tuned per density |
| Generic copy ("Get Started") | Domain copy: "Settle transfer", "Ledger entry #AX-2481", Sanskrit-rooted bank stories |
| Fade-in-up everywhere | Varied motion vocabulary per moment (see §4) |

---

## 2. Foundation tokens (Phase 4 deliverable)

### Color

```css
:root {
  /* palette */
  --color-deep-blue: #3368A0;
  --color-soft-blue: #66A3BF;
  --color-sage-mint: #C8DFDB;
  --color-warm-ivory: #F2EFE7;
  --color-arth-gold: #A8742A;
  --color-arth-gold-soft: #E9D9BE;
  --color-charcoal: #252624;

  /* semantic layer (components reference THESE only) */
  --surface-base: var(--color-warm-ivory);
  --surface-raised: #FFFFFF;
  --surface-accent: var(--color-sage-mint);
  --text-primary: var(--color-charcoal);
  --text-on-brand: #FFFFFF;
  --brand-primary: var(--color-deep-blue);
  --brand-secondary: var(--color-soft-blue);
  --currency-accent: var(--color-arth-gold);
  --currency-surface: var(--color-arth-gold-soft);
  --color-loss: #B5482E;          /* terracotta — losses, failures, security failures */
}
```

Contrast is pre-audited (WCAG AA): charcoal-on-ivory 13.2:1, deep-blue-on-ivory 5.0:1,
white-on-deep-blue 5.8:1. Gold is **large-text/icons/borders only** on light surfaces.

### Typography

| Token | Font | Use |
|---|---|---|
| `--font-display` | Fraunces | Headlines, balances, portal titles, document headers |
| `--font-body` | Cantarell | Body, labels, table data, forms |
| `--font-accent` | Amarante | Wordmark + celebratory/reward moments ONLY |

Type scale runs display-lg 48px down to micro 12px. Balances render at display sizes in
Fraunces with tabular figures.

### Shape · elevation · motion (restrained Material)

- Radius hierarchy: 0 / 4 (chips) / 8 (inputs) / 12 (buttons, rows) / 16 (cards) / 28 (sheets, heroes) / full (pills).
- Elevation capped at level 1–2 everywhere except Shop (may use 3–4). Depth comes from **border + surface shift**, not shadow weight.
- Easing: standard `cubic-bezier(0.2,0,0,1)`; entrances decelerate, exits accelerate. Durations 100/200/350/500ms.
- State layers (hover 8% / pressed 12% overlays), press-scale 0.98. **Ripple: Shop only.**
- `prefers-reduced-motion`: opacity-only fallbacks, no scroll-jacking, final states rendered immediately.

---

## 3. Global chrome (shared across all six portals)

- **Top bar**: Warm Ivory, hairline bottom rule (no shadow). Left: ARTHAX wordmark (Amarante, small)
  + `currency_symbol.png`. Center-right: portal name in small caps Cantarell. Right: identity chip +
  masked session indicator.
- **Bank logos are participants, never the platform**: they appear only at choose/confirm-bank moments
  (selector, account card header, "via Nava Bank" transaction line), always visually secondary to the
  ARTHAX mark.
- **Security UX baked into chrome**: balances masked by default across all money surfaces —
  eye-toggle reveals via GSAP digit-scramble (not just unblur). Account numbers show `•••• 4821`
  with click-to-reveal. GOV Password and Financial Password fields get visibly different treatments
  (identity glyph vs shield context, different helper copy) and never co-appear outside security settings.
- **Transaction status**: 6-icon set mapped to the 9-state machine per `AGENTS.md`; live state
  changes animate icon-to-icon with a short crossfade + label swap.
- Every interactive component ships loading / empty / error / disabled states before it's "done."
  Empty states use the official illustrations layered *behind* headline + CTA (depth composition),
  never stacked neatly above them.

---

## 4. Motion system (GSAP owns scroll/timeline)

| Moment | Technique | Where |
|---|---|---|
| Balance reveal | Count-up + digit-scramble on mask toggle | User Portal, Bank detail |
| Portal switch | Staggered assembly choreography (not fade) | All portal route changes |
| Ticker | Continuous CSS/GSAP marquee | Stock Portal |
| Scroll reveal | Pin-and-reveal stats; parallax backgrounds (slower than foreground) | Guide Board |
| Image reveal | Clip-path/mask wipes on banners & bank logos | Guide Board, Stock detail |
| Buttons | Fill-sweep hover, press-scale, built-in loading morph | Everywhere |
| Step-up modal | Quick scale+fade (150ms) — friction by design, don't decorate it | Money actions |
| Reward/unlock | Confetti-free; gold shine sweep + scale-pop (Amarante label) | Shop |
| Reduced motion | All of the above collapse to instant/opacity | System setting |

---

## 5. The six rooms

### 5.1 Central Guide Board — Deep Blue — *"the front page"* (narrative content)

- **Hero**: `central_guide.png` full-bleed with gradient-mesh overlay (Deep Blue → Soft Blue →
  transparent) + grain. Headline in 64px Fraunces. This is the only spectacle surface besides Shop.
- **Portal selector**: NOT a card grid. Six portal names in huge Fraunces, arranged asymmetrically;
  hovering a name crossfades the viewport background to that portal's hero image and mask-reveals
  its description. Keyboard-navigable, real links.
- Section breaks cut at slight angles; announcements run as a slow ticker strip above the footer.
- Explainer sections use split-screen sticky (text pins, illustration scrolls).
- Empty/error states reuse the 404 illustrations layered behind type.

### 5.2 Central Bank Portal — Deep Blue + Charcoal — *"the registry hall"* (mixed)

- Header banner (`central_bank.png`) at restrained height, charcoal overlay, no playfulness.
- Bank registry: a genuinely dense, well-crafted data table (correct repeated-unit) — approval state
  chips, suspension actions, monetary-policy parameter panel styled like a formal notice board
  (hairline rules, small caps, no cards-within-cards).
- Admin actions gated by RBAC rendering (never rendered for unauthorized roles).
- Tone: minimal gold (zero unless showing reserve figures), zero decorative motion beyond state layers.

### 5.3 Bank Portal — Soft Blue — *"the branch office"* (mixed)

- Bank comparison screen: split-screen sticky — left pins the two banks' identities (logos, story
  copy leaning into Sanskrit names: Sthira = stability, Vayu = speed…), right scrolls the term/rate
  comparison rows.
- Customer accounts & ledger views: dense tables, inline status icons, per-bank scoped queries.
- Account opening flow: purpose selection as a stepped narrative (Salary/Savings/Daily/Business/FD)
  with the recommendation engine's pick highlighted via gold border — not a card grid.
- FD & loans: maturity timers as thin progress arcs; interest accrual counts up live.

### 5.4 User Portal — Deep Blue + Arth Gold — *"the personal desk"* (narrative + repeated)

- **Home hero**: net worth as THE graphic — 96px Fraunces count-up on load, no box around it,
  sitting directly on ivory with grain. Masked-by-default; eye-toggle scrambles digits to reveal.
- Connected banks: horizontal snap-scroll rail of slim account cards (bank logo secondary, purpose
  tag, masked number) — instant context switching without page reload.
- Transfer flow: focused sheet (radius-xl top corners), amount typed directly into a huge Fraunces
  field; Financial Password step-up appears as quick modal mid-flow; success lands on a receipt-style
  confirmation using the transaction-status timeline.
- Transaction history: filterable table with live status badges; row hover expands inline detail
  (ledger entries, CLS path if cross-bank) rather than navigating away.
- FD portfolio view + mailbox at `/mailbox` with unread badge in this portal's nav.

### 5.5 Stock Portal — Soft Blue + Sage/Terracotta — *"the exchange floor"* (repeated data)

- Live ticker marquee across the top (real simulated prices, gains in sage-mint-tagged cells,
  losses in `--color-loss`).
- Listing: dense data table — logo thumb, ticker, price, sparkline mini-chart, day change. Row hover
  expands height revealing sector info + quick trade buttons (no navigation).
- Company detail: banner bleeds full-width behind overlaid logo + key stats (editorial treatment);
  buy/sell panel requires step-up verification; trade confirmation renders document-style.
- Capital-gains tax shown explicitly at sell time: profit highlighted, tax line separated — never
  tax-on-total.

### 5.6 Shop — Arth Gold + Sage Mint — *"the bazaar"* (the one playful room)

- Only portal licensed for elevation 3–4, ripple, Amarante accents, and richer ambient motion.
- Banners: rarity-tiered asymmetric grid — gold items render visibly larger, breaking rhythm.
  First-view unlock uses shine-sweep + scale-pop reveal.
- Pets: horizontal carousel with tilt-on-hover; active pet wears a gold ring; power modifiers shown
  as honest bounded percentages.
- Avatars/frames: Normal→Gold tiers per resolved mapping; checkout debits ARTH through the ledger
  with step-up confirmation; balance display uses currency-surface token.

---

## 6. Component library (Phase 4 atoms)

Button (primary/secondary/ghost/destructive × loading/disabled) · Input (+mask variants) ·
Currency display (masked/reveal/count-up) · StatusBadge (9-state icon mapping) · DataTable
(dense mode, expandable rows) · Sheet/Modal (step-up variant) · Tabs/Rail · TickerStrip ·
Sparkline · EmptyState (illustration-behind-type) · Toast · ProgressArc · ReceiptDocument ·
PortalShell (per-portal accent theming via one `data-portal` attribute + CSS vars).

Stack: Next.js App Router + Tailwind (tokens via CSS vars, no arbitrary colors) + GSAP/ScrollTrigger.
Structural primitives from shadcn/Radix are allowed but must be re-skinned through the token layer —
stock themes never ship.

---

## 7. Build order

1. **P4a** — Token infra (`@arthax/tokens` populated, CSS vars, Tailwind theme, fonts local from
   `assets/fonts`) + global chrome + PortalShell.
2. **P4b** — Atom library with all four states each; Storybook-style demo route (dev-only).
3. **P4c** — Guide Board (the showcase; anti-AI audit gate here first).
4. Then feature phases pull components: P5 banking → P6 user portal → P7 stocks → P8 shop → P9 mailbox.

Each phase ends with the anti-ai-design build-mode checklist; demos additionally get audit mode.

---

## 8. Known gaps (STOP & ASK HUMAN when reached)

- Security shield/lock icon — needed for step-up/security states; not in library yet.
- Any new notification categories beyond the 6 existing icons.
- Watermark split assumed: `primary_watermark` → documents; others → low-opacity texture (5–8%).
  Confirm before printing features ship.

---

## 9. Decisions this plan locks in

| Question | Decision |
|---|---|
| Overall aesthetic | Warm editorial "financial gazette", light-first |
| Balance presentation | Oversized Fraunces numerals on paper, masked by default |
| Cards | Only for comparable repeated data; typographic grouping elsewhere |
| Backgrounds | Grain + gradient mesh + brand imagery full-bleed; never flat single color on heroes |
| Per-portal identity | Deep Blue / Deep Blue+Charcoal / Soft Blue / Deep Blue+Gold / Soft Blue+Sage-Terracotta / Gold+Sage |
| Playfulness boundary | Shop only; everything else calm |
