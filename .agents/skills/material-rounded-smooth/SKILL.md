---
name: material-rounded-smooth
description: Applies a Material Design-inspired shape and motion system — a hierarchical rounded-corner scale, soft layered elevation, and smooth easing/duration tokens for transitions and interaction feedback. Use this skill whenever building or styling UI that should feel "rounded," "smooth," "soft," or "Material," whenever writing CSS transitions/animations, border-radius values, box-shadow/elevation, or button/card/input/chip components — even if the user just says "make it smoother" or "round the corners" without naming Material Design explicitly. Works alongside project-specific token skills (e.g. arthax-design-tokens) — this skill governs shape and motion, not brand color or typeface.
---

# Material, Rounded & Smooth

This is a shape-and-motion system, not a color system. It governs corner radius, elevation, and how things move — pair it with whatever token skill owns colors and fonts for the current project.

**Core idea:** "rounded" means a deliberate hierarchical radius scale, not one `rounded-xl` slapped on every surface. "Smooth" means purposeful easing and duration, not `transition-all` with the browser default. Both of those defaults are exactly the kind of thing that makes an interface look templated — vary radius by component role, and animate specific properties on purpose.

## Shape scale

Based on Material 3's shape tokens — small controls get tight corners, large surfaces get generous ones, nothing gets 0 or fully-round by accident.

| Token | Value | Use for |
|---|---|---|
| `--radius-none` | 0px | Dividers, table cell edges |
| `--radius-xs` | 4px | Chips, badges, compact controls |
| `--radius-sm` | 8px | Inputs, small buttons, tags |
| `--radius-md` | 12px | Default buttons, list items |
| `--radius-lg` | 16px | Cards, panels, modals |
| `--radius-xl` | 28px | Large sheets, hero containers, bottom sheets |
| `--radius-full` | 9999px | Pills, FABs, avatars, toggle tracks |

```css
:root {
  --radius-none: 0px;
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 28px;
  --radius-full: 9999px;
}
```

```js
// tailwind.config.js
theme: {
  extend: {
    borderRadius: {
      xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '28px', full: '9999px',
    },
  },
},
```

## Elevation (soft, layered — not flat drop-shadows)

Material treats elevation as depth, not decoration. Keep shadows soft, low-opacity, and stack them (a tight shadow + a diffuse one) rather than one hard shadow.

```css
--elevation-0: none;
--elevation-1: 0 1px 2px rgba(0,0,0,0.06), 0 1px 1px rgba(0,0,0,0.04);
--elevation-2: 0 2px 6px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
--elevation-3: 0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.05);
--elevation-4: 0 8px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);
```

Raise elevation on state change (resting card at level 1, hovered/dragged at level 2–3) rather than assigning a fixed heavy shadow to everything — the *change* in elevation is what reads as responsive, not the shadow itself.

## Motion — easing and duration

The single biggest lever for "smooth." Default CSS `ease` and linear timing read as mechanical; these curves read as physical.

```css
--ease-standard: cubic-bezier(0.2, 0, 0, 1);       /* default — most transitions */
--ease-decelerate: cubic-bezier(0, 0, 0, 1);        /* elements entering/appearing */
--ease-accelerate: cubic-bezier(0.3, 0, 1, 1);      /* elements exiting/dismissing */
--ease-emphasized: cubic-bezier(0.3, 0, 0.1, 1);    /* hero moments, primary CTAs — springier */

--duration-short: 100ms;      /* micro feedback: press, toggle, small state change */
--duration-medium: 200ms;     /* default — most transitions */
--duration-long: 350ms;       /* panels, sheets, drawers */
--duration-xlong: 500ms;      /* full page/section transitions, complex choreography */
```

Rules of thumb:
- Animate `transform` and `opacity`, not `width`/`height`/`top`/`left` — those trigger layout recalculation and never feel smooth no matter what easing you pick.
- Never use `transition: all` — name the properties. It's both a performance issue and it animates things you didn't intend to.
- Entering elements decelerate (start fast, settle softly). Exiting elements accelerate (start slow, leave quickly). This asymmetry alone is most of what makes motion feel "smooth" rather than robotic.
- Always respect `prefers-reduced-motion` — collapse to opacity-only or instant state changes when it's set.

```css
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

## Interaction feedback (state layers)

Material's pattern for hover/press feedback is a semi-transparent overlay of the foreground color, not a hardcoded darker background:

```css
--state-hover-opacity: 0.08;
--state-focus-opacity: 0.12;
--state-pressed-opacity: 0.12;
```

```css
.btn {
  position: relative;
  transition: transform var(--duration-short) var(--ease-standard);
}
.btn::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  background: currentColor;
  opacity: 0;
  transition: opacity var(--duration-short) var(--ease-standard);
}
.btn:hover::after { opacity: var(--state-hover-opacity); }
.btn:active { transform: scale(0.98); }
.btn:active::after { opacity: var(--state-pressed-opacity); }
```

**Ripple effect** (optional — genuinely optional, not a default): a full Material ripple-on-click is a distinct, recognizably "Android app" flourish. It fits playful/consumer surfaces well. Skip it on anything transactional or data-dense — the scale/opacity feedback above is usually enough there.

## Component patterns

| Component | Radius | Elevation | Motion |
|---|---|---|---|
| Filled button | `--radius-full` or `--radius-md` | 0 resting, 1 on hover | scale 0.98 on press, `--duration-short` |
| Card | `--radius-lg` | 0–1 resting, 2 on hover | elevation transition `--duration-medium` |
| Input | `--radius-sm` | 0 | focus ring fades in over `--duration-short` |
| Chip/tag | `--radius-full` | 0 | background fade `--duration-short` |
| Modal/sheet | `--radius-xl` (top corners for bottom sheets) | 4 | enters with `--ease-decelerate`, exits with `--ease-accelerate`, `--duration-long` |

## Using this on ARTHAX

ARTHAX's own doc already sets "Shadows: Restrained (Shadow 1-3), prioritize border + contrast" and explicitly avoids "Over-glossy, Glass-heavy." A full Material treatment (deep elevation, ripple) would fight that brief, so run the **restrained variant** there:

- Use the full shape scale as-is — it already lines up closely with ARTHAX's existing radius spec (4/8/12/16/20/24px), this just adds the `full` pill token ARTHAX doesn't currently define, useful for chips and the rewards/gamification surfaces.
- Cap elevation at `--elevation-1`/`--elevation-2`. For depth, prefer a border plus a slightly shifted surface tone (a token like `--surface-raised` one step lighter/darker than the base) over a visible shadow — that's the "border + contrast" instruction from the doc, implemented.
- Keep all the motion and easing tokens — smooth, physical transitions are fully compatible with "Calm, Precise, Human." This is where "smooth" actually lives for ARTHAX: fast, decelerate-eased entrances on the Ledger and User Portal, not visual weight.
- Skip ripple entirely on Bank, Central Bank, User, and Stock portals. It's a reasonable fit for the Shop portal's gamified surfaces if you want it there.

For KONOHA, portfolio work, or anything without that fintech-calm constraint, the fuller treatment (deeper elevation, ripple, more expressive emphasized easing) applies without the restraint above.

## Before shipping

- Radius varies by component role — not one value copy-pasted everywhere.
- No `transition: all` anywhere in the codebase.
- Entrances decelerate, exits accelerate — check this is actually asymmetric, not the same curve both ways.
- `prefers-reduced-motion` is handled.
- If this is ARTHAX: elevation stays at 1–2, ripple is off outside the Shop portal.
