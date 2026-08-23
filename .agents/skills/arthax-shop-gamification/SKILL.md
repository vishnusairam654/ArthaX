---
name: arthax-shop-gamification
description: >
  Owns the Shop portal's reward economy — avatars, rarity-tiered profile banners, avatar frames, and
  the 8 financial-persona pet companions. This is the one part of ARTHAX explicitly licensed to be
  playful (per arthax-design-tokens' per-portal mapping) and it's over half the asset library (60+ of
  116 images), so it deserves its own rules rather than inheriting the restrained financial-app
  treatment. Use whenever building profile customization, the shop grid, inventory, or an
  unlock/reveal moment.
---

# ARTHAX Shop & Gamification System

## What you actually have

- **Avatars** — 8 personas × 2 genders (Analyst, Builder, Businessman/woman, Creator, Entrepreneur,
  Investor, Retired Investor, Student). A persona system, not random art — each maps to a financial
  archetype a user might identify with.
- **Banners** — 16 profile banners across 4 rarity tiers: `normal` (7), `rare` (3), `epic` (2), `gold`
  (2). This is a gacha/loot-tier structure whether it was named that intentionally or not — treat it
  as one.
- **Frames** — 7 cosmetic avatar borders (Aurora, gold, leaf, Nova, orbit, pulse, vertex) — no rarity
  grouping in the filenames, so either they're all one tier or you need to decide a tier mapping.
- **Pets** — 8 companions, each shipped as `icon` / `thumbnail` / `main_image` (or `main` for
  Settlement Crane — one naming inconsistency to normalize in code, not in the asset folder): Archive
  Cat, Flow Otter, Ledger Owl, Market Bull, Saver Fox, Settlement Crane, Tax Tortoise, Wealth Elephant.
  These aren't random animals — each is themed to a financial behavior (the Owl for record-keeping,
  the Bull for markets, the Tortoise for tax — slow and deliberate, the Fox for saving — clever, the
  Elephant for wealth — never forgets/accumulates). Lean into that in copy and unlock flavor text, not
  just the art.

## Rarity color coding — reuse tokens, don't add new hues

The instinct here is to reach for the standard gacha palette (gray/blue/purple/gold for
normal/rare/epic/legendary). Don't — `arthax-design-tokens` has no purple, and adding one just for the
Shop breaks the single-token-source rule the rest of the project depends on. Differentiate rarity
through **weight and treatment** of the existing palette instead:

| Tier | Border | Glow/shadow | Reveal motion |
|---|---|---|---|
| Normal | 1px Charcoal at 20% opacity | none | Quick fade + scale (0.3s) |
| Rare | 2px Soft Blue | soft blue glow, low opacity | Fade + scale + slight overshoot (0.5s) |
| Epic | 2px Deep Blue | stronger blue glow | Anticipation dip, then scale-in with overshoot (0.8s) |
| Gold | 3px Arth Gold | gold glow + subtle particle/shimmer (GSAP, not a GIF) | Full sequence: anticipation → flash → reveal → settle (1.2-1.5s) — this is the one moment in the entire app where a flash-of-brand-color effect is earned |

This keeps every rarity tier visually distinct while staying inside the 7-token palette — reserve
Arth Gold exclusively for the top tier so it keeps meaning "best," consistent with its currency-signal
role everywhere else in the app.

Frames have no stated rarity — simplest fix is to treat all 7 as one "cosmetic" tier (Rare-equivalent
treatment) unless you want to explicitly grade them, in which case that's a Token & Theming Agent
decision, not something to improvise per-component.

## The reveal/unboxing moment

This is the single highest-leverage animation investment in the Shop, because it's the one interaction
in all of ARTHAX that's supposed to produce genuine delight rather than calm confidence. Use GSAP
timelines, scaled by rarity per the table above:

```js
function revealItem(item, rarityTier) {
  const tl = gsap.timeline();
  const durations = { normal: 0.3, rare: 0.5, epic: 0.8, gold: 1.3 };
  const d = durations[rarityTier];

  if (rarityTier === 'gold') {
    tl.to(card, { scale: 0.95, duration: d * 0.15 })      // anticipation
      .to(glowLayer, { opacity: 1, duration: d * 0.1 })    // flash
      .to(card, { scale: 1.05, duration: d * 0.4, ease: "back.out(1.7)" }) // reveal
      .to(card, { scale: 1, duration: d * 0.35, ease: "power2.out" });     // settle
  } else {
    tl.from(card, { scale: 0.9, opacity: 0, duration: d, ease: "back.out(1.4)" });
  }
  return tl;
}
```

Respect `prefers-reduced-motion` here more than anywhere else in the app — a gold-tier reveal with a
flash effect is exactly the kind of thing that needs an instant, static fallback for photosensitivity
and vestibular sensitivity, per `gsap-animation-design`.

## Three-asset-per-pet usage rule

Don't reuse one image size for everything — each of the three files has a distinct job:

- **`icon`** — small (24-32px), used inline next to a username or as an equipped-pet badge in nav/header
- **`thumbnail`** — shop grid and inventory grid cards (roughly card-sized, the browsing view)
- **`main_image`** / **`main`** — the full detail/equip screen where someone decides to select it; this
  is where the persona flavor text (see above) belongs, next to the largest render of the pet

## Where Amarante and fuller Material treatment are licensed

Per `arthax-design-tokens` and `material-rounded-smooth`, the Shop is the one portal where you can use
the decorative Amarante font (banner section headers, "NEW!" tags) and go up to elevation level 3-4
with optional ripple on interactive cards — the financial-restraint rules from the rest of the app
don't apply here. Don't let that license bleed into the actual purchase-confirmation moment, though
("You spent 500 ARTH") — that single screen should snap back to the same calm, precise treatment as a
real transaction, because it is one.

## Empty state

`assets/illustrations/empty_inventory.png` covers the case where a user has bought nothing yet — see
`arthax-empty-states` for how that illustration pairs with the shop's first-visit flow.
