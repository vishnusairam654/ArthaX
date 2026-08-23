---
name: arthax-design-tokens
description: >
  Owns ARTHAX's canonical brand tokens — color palette and typography — and how they map to UI roles
  (surfaces, text, accents, portals). Use this skill whenever writing CSS variables, Tailwind config,
  choosing text/background color pairs, setting font-family, or making any visual decision for ARTHAX
  (Central Guide Board, Central Bank Portal, Bank Portal, User Portal, Stock Portal, Shop). This is the
  token source of truth — material-rounded-smooth governs shape/motion and anti-ai-design governs
  composition/authenticity; both assume this skill supplies the actual color and font values.
---

# ARTHAX Design Tokens

Confirmed source: `Color_Palette.png` (4-step swatch) cross-checked against the ARTHAX Project Report's
Design Direction section, plus a font selection screenshot. Values below are sampled/measured, not
eyeballed.

## Color tokens

| Token | Hex | Role |
|---|---|---|
| `--color-deep-blue` | `#3368A0` | Primary brand color — nav, primary buttons, links, Central Bank identity |
| `--color-soft-blue` | `#66A3BF` | Secondary/supporting blue — secondary actions, chart lines, hover states |
| `--color-sage-mint` | `#C8DFDB` | Light accent surface — success states, subtle section backgrounds, tags |
| `--color-warm-ivory` | `#F2EFE7` | Base background — the "light-first, warm" canvas the report calls for |
| `--color-arth-gold` | `#A8742A` | ARTH currency accent — reserve this for money/reward moments specifically, not general UI |
| `--color-arth-gold-soft` | `#E9D9BE` | Gold-family surface — badge backgrounds, reward card fills |
| `--color-charcoal` | `#252624` | Primary text color — not pure black, keeps the warm palette coherent |

```css
:root {
  --color-deep-blue: #3368A0;
  --color-soft-blue: #66A3BF;
  --color-sage-mint: #C8DFDB;
  --color-warm-ivory: #F2EFE7;
  --color-arth-gold: #A8742A;
  --color-arth-gold-soft: #E9D9BE;
  --color-charcoal: #252624;

  /* semantic layer — reference these in components, not raw colors */
  --surface-base: var(--color-warm-ivory);
  --surface-raised: #FFFFFF;
  --surface-accent: var(--color-sage-mint);
  --text-primary: var(--color-charcoal);
  --text-on-brand: #FFFFFF;
  --brand-primary: var(--color-deep-blue);
  --brand-secondary: var(--color-soft-blue);
  --currency-accent: var(--color-arth-gold);
  --currency-surface: var(--color-arth-gold-soft);
}
```

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'deep-blue': '#3368A0',
      'soft-blue': '#66A3BF',
      'sage-mint': '#C8DFDB',
      'warm-ivory': '#F2EFE7',
      'arth-gold': '#A8742A',
      'arth-gold-soft': '#E9D9BE',
      charcoal: '#252624',
    },
  },
},
```

### Contrast — measured, not assumed

Checked against WCAG 2.1 AA (4.5:1 normal text, 3:1 large text/18px+ or 14px bold, 3:1 UI components):

| Pair | Ratio | Verdict |
|---|---|---|
| Charcoal on Warm Ivory | 13.23:1 | Passes everywhere — default body text pair |
| Deep Blue on Warm Ivory | 5.04:1 | Passes AA normal text — safe for links/labels on base surface |
| Charcoal on Sage Mint | 10.88:1 | Passes everywhere |
| Charcoal on Soft Blue | 5.47:1 | Passes AA normal text |
| White on Deep Blue | 5.79:1 | Passes AA normal text — safe for primary button labels |
| Deep Blue on Sage Mint | 4.14:1 | **Large text / bold labels only**, not small body copy |
| Arth Gold on Warm Ivory | 3.52:1 | **Large text / icons / borders only** — don't set small gold body text on ivory |
| Arth Gold on Charcoal | 3.76:1 | **Large text only** |
| White on Arth Gold | 4.04:1 | **Large text only** — a gold reward button needs an 18px+ or bold label, not 14px regular |

Practical rule: gold is a currency *signal*, not a text color — use it for icons, large numerals (ARTH balances), borders, and badge fills, and keep small body/UI text in charcoal or deep blue.

## Typography tokens

Confirmed selection (font picker screenshot): **Amarante**, **Cantarell**, **Fraunces**.

| Font | Role | Why |
|---|---|---|
| **Fraunces** | Display / headings (H1–H3, portal titles) | Optical-size serif with real character — already the report's typography direction; keep it for anything that needs to feel premium and "financial-editorial" rather than SaaS-generic |
| **Cantarell** | Body / UI text (paragraphs, labels, table data, forms) | Humanist sans with a large x-height, reads cleanly at small sizes in data-dense tables (Bank Portal, Stock Portal), and — unlike Inter/Roboto — doesn't read as an AI-generated-UI default |
| **Amarante** | Rare decorative accent only | A heavy display slab-serif with strong personality. Do not use for headings or body — it's too loud at paragraph scale and will fight Fraunces. Reserve it for one-off moments: the ARTHAX wordmark treatment, a Shop portal seasonal banner, celebratory reward/milestone screens. If you're not sure whether a use case qualifies, it doesn't — default to Fraunces. |

```css
:root {
  --font-display: 'Fraunces', serif;
  --font-body: 'Cantarell', sans-serif;
  --font-accent: 'Amarante', serif; /* rare use only — see table above */
}
```

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Cantarell:wght@400;700&family=Amarante&display=swap" rel="stylesheet">
```

Type scale (pairs with `material-rounded-smooth`'s spacing discipline — don't just use browser defaults):

```css
--text-display-lg: 3rem;    /* 48px — hero/portal landing titles, Fraunces */
--text-display-md: 2.25rem; /* 36px — section headers, Fraunces */
--text-heading: 1.5rem;     /* 24px — card/panel titles, Fraunces */
--text-body-lg: 1.125rem;   /* 18px — lead paragraphs, Cantarell */
--text-body: 1rem;          /* 16px — default body/UI, Cantarell */
--text-small: 0.875rem;     /* 14px — table cells, metadata, Cantarell */
--text-micro: 0.75rem;      /* 12px — timestamps, badges, Cantarell */
```

## Per-portal accent mapping

The report's six portals shouldn't all look identical — use the same base palette but let one color lead per portal so a screenshot alone tells you which portal it's from:

| Portal | Leading accent | Notes |
|---|---|---|
| Central Guide Board | Deep Blue | Neutral entry point — most restrained, sets the baseline |
| Central Bank Portal | Deep Blue + Charcoal | Authority tone — minimal gold, no playful accents |
| Bank Portal | Soft Blue | Operational, slightly lighter than Central Bank |
| User Portal | Deep Blue + Arth Gold (sparingly, for balances) | Personal workspace — gold appears here more than anywhere except Shop |
| Stock Portal | Soft Blue + Sage Mint (gains) / a defined red-family token for losses (not yet in this palette — needs one addition) | You'll need a semantic `--color-loss` since nothing in the current 7 tokens reads as "down" |
| Shop | Arth Gold + Sage Mint | The one portal where Amarante and more playful motion are licensed |

Flag: there's currently no red/negative token in the confirmed palette. Add one before building Stock Portal loss states or transaction-failure UI — pulling an arbitrary red in later is exactly the kind of untracked addition `anti-ai-design`'s token-discipline check would flag.

## Using this with the other skills

- **material-rounded-smooth** supplies radius/elevation/motion — pair its tokens with the colors above; that skill's own "Using this on ARTHAX" section already assumes these exact hex values.
- **anti-ai-design** — Cantarell + Fraunces already gets you out of the Inter-default trap for free; don't undo that by falling back to Inter anywhere "temporary."
- **gsap-animation-design** — when animating currency/reward moments, use `--currency-accent` sparingly and let motion (not color spam) carry the celebration.
