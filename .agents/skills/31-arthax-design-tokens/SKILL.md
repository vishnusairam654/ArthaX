---
name: arthax-design-tokens
description: Enforces ARTHAX's canonical fonts (Fraunces + Cantarell) and color palette (Deep Blue, Soft Blue, Sage Mint, Off White, Arth Gold) across every screen, component, and portal in the project. Use this skill whenever writing, editing, or reviewing ANY ARTHAX UI code — components, pages, Tailwind config, CSS, Shadcn theme files, charts, or design mockups — even if the user doesn't explicitly mention colors or fonts. Also use when a task would otherwise require picking a color or typeface, to prevent defaulting to generic Tailwind colors (blue-500, slate-900, etc.), system fonts, or unmodified Shadcn theme values. Trigger on mentions of "design system," "tokens," "theme," "styling," "palette," or any of the six portal names.
---

# ARTHAX Design Tokens

ARTHAX has one canonical palette and one canonical type system, defined in `ARTHAX_Project_Architecture.md` Section 5. This skill exists so no agent — Frontend, Design Director, Motion & 3D Specialist, or otherwise — ever reaches for a default Tailwind color, a system font stack, or an unmodified Shadcn theme value instead of these tokens.

**Rule:** if you're about to write a hex code, a Tailwind color class, or a `font-family`, stop and check this file first. Every color and font in ARTHAX traces back to the table below — no exceptions, no "just for now" placeholders.

## Fonts

| Role | Typeface | Notes |
|---|---|---|
| Primary (display/headings) | **Fraunces** | Serif with an italic axis. Use for Display and Page Heading sizes (48–64px / 32–40px). Italic weights read as the ARTHAX "voice" — reserve for headlines and hero figures, not body copy. |
| Secondary (body/UI) | **Cantarell** | Sans, used from Section Heading down through Micro (22px and below). Handles dense UI: tables, forms, ledger lines, navigation. |

Google Fonts import:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cantarell:ital,wght@0,400;0,700;1,400;1,700&family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
```

```css
--font-display: 'Fraunces', ui-serif, Georgia, serif;
--font-body: 'Cantarell', ui-sans-serif, system-ui, sans-serif;
```

Never substitute Inter, Manrope, Space Grotesk, or any other typeface into ARTHAX screens — those were exploration options from earlier design conversations and were not selected. Fraunces + Cantarell is final.

## Colors

**Primary palette**

| Token | Name | Hex | RGB |
|---|---|---|---|
| `--color-deep-blue` | Deep Blue | `#3368A0` | 51, 104, 160 |
| `--color-soft-blue` | Soft Blue | `#66A3BF` | 102, 163, 191 |
| `--color-sage-mint` | Sage Mint | `#C8DFDB` | 200, 223, 219 |
| `--color-off-white` | Off White | `#F2EFE7` | 242, 239, 231 |

**Brand accent — Arth Gold** (use selectively: active states, financial figures, brand details, selected navigation, rewards — never as a base UI color)

| Token | Name | Hex |
|---|---|---|
| `--color-arth-gold` | Arth Gold | `#A8742A` |
| `--color-arth-gold-soft` | Arth Gold Soft | `#E9D9BE` |

**Semantic colors** (financial states — use these, not Tailwind's default red/green/amber)

| Token | Role | Hex |
|---|---|---|
| `--color-positive` | Gains, success, completed | `#287A55` |
| `--color-negative` | Losses, errors, failed | `#B94A43` |
| `--color-warning` | Caution, pending review | `#A8742A` |
| `--color-info` | Neutral information | `#496C80` |

**Text (derived, not in the original swatch set)**

The palette doesn't define a body-text color, and Deep Blue on Off White only clears WCAG AA at large/bold sizes (~3.6:1) — it fails for regular body text. The architecture doc calls for "charcoal typography," so use a warm charcoal derived from the palette rather than pure black:

| Token | Role | Hex |
|---|---|---|
| `--color-ink` | Primary text | `#262320` |
| `--color-ink-soft` | Secondary/muted text | `#5C574F` |

If you land on a different charcoal, keep it warm (not blue-black) so it sits naturally against Off White — and re-check contrast before shipping.

**Light mode only.** Per the doc, dark mode is "not the primary identity" — don't build a dark theme unless explicitly asked, and don't let a UI library's default dark variant leak in.

## Drop-in tokens

CSS custom properties (`globals.css` or equivalent):

```css
:root {
  --color-deep-blue: #3368A0;
  --color-soft-blue: #66A3BF;
  --color-sage-mint: #C8DFDB;
  --color-off-white: #F2EFE7;
  --color-arth-gold: #A8742A;
  --color-arth-gold-soft: #E9D9BE;
  --color-positive: #287A55;
  --color-negative: #B94A43;
  --color-warning: #A8742A;
  --color-info: #496C80;
  --color-ink: #262320;
  --color-ink-soft: #5C574F;

  --font-display: 'Fraunces', ui-serif, Georgia, serif;
  --font-body: 'Cantarell', ui-sans-serif, system-ui, sans-serif;
}
```

Tailwind config extension:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'deep-blue': '#3368A0',
      'soft-blue': '#66A3BF',
      'sage-mint': '#C8DFDB',
      'off-white': '#F2EFE7',
      'arth-gold': '#A8742A',
      'arth-gold-soft': '#E9D9BE',
      positive: '#287A55',
      negative: '#B94A43',
      warning: '#A8742A',
      info: '#496C80',
      ink: '#262320',
      'ink-soft': '#5C574F',
    },
    fontFamily: {
      display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      body: ['Cantarell', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  },
},
```

Use semantic Tailwind classes (`bg-off-white`, `text-ink`, `font-display`) in components — never raw hex values inline, and never Tailwind's built-in palette (`blue-500`, `slate-900`, `emerald-600`) as a substitute for the tokens above, even temporarily.

## Applying colors by role, not habit

- **Deep Blue** — primary headline/hero text (large sizes only, per the contrast note above), primary buttons, key data emphasis.
- **Soft Blue** — secondary actions, links, chart accents, hover states on Deep Blue elements.
- **Sage Mint** — card/section backgrounds, subtle surface tint, success-adjacent backgrounds (not text — too light for AA at body size).
- **Off White** — base page background across all six portals.
- **Arth Gold** — sparingly: reward moments, active nav state, brand flourishes. If more than one element per screen uses it, that's a sign it's being overused.
- **Ink / Ink Soft** — all body copy, labels, table data.

## Before shipping any ARTHAX screen, check

- No hex values outside this file's table appear in the code.
- No Tailwind default color classes (`blue-`, `slate-`, `gray-`, `emerald-`, etc.) are used anywhere.
- Fraunces only appears at Section Heading size and above; Cantarell handles everything smaller.
- Body text uses `--color-ink` or `--color-ink-soft`, never `--color-deep-blue` at small sizes.
- Dark mode isn't present unless explicitly requested for that task.
- Arth Gold shows up deliberately, not as a default accent color.

If a task seems to call for a color or font not listed here, that's a signal to ask before inventing one — not to reach for a framework default.
