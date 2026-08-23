---
name: arthax-layout-and-motion
description: >
  Antidote to the default "card grid, that's it" output — the single most common failure of
  AI-assisted UI generation. Owns layout pattern selection (when a card is right vs. wrong), background
  treatment (never flat by default), an expanded motion vocabulary beyond uniform fade-in-up, and the
  hard rule for when an asset is missing: ask, never fabricate or silently downgrade. Load this
  alongside arthax-design-tokens and anti-ai-design on every single frontend task — this is not
  optional or situational.
---

# ARTHAX Layout & Motion — No Default Cards

## Name the failure precisely

"Cards, a block, that's it" is what happens when every section — hero, feature list, empty state,
portal selector, pricing, testimonials — gets laid out as a uniform grid of identically-sized rounded
rectangles, each holding an icon, a title, and two lines of description, evenly spaced, same elevation,
same everything. It's not that cards are bad. It's that they're the *default autopilot* output of every
popular scaffold (shadcn starter grids, Tailwind templates, most AI code-gen), applied to content that
doesn't call for repetition at all — a hero doesn't repeat, a portal selector isn't inventory, an empty
state isn't a list. Using the repeated-unit pattern on non-repeated content is the actual tell, more
than the card shape itself.

**The rule going forward: before laying out any section, name which of these two buckets the content
is in, out loud, before touching code.**

- **Comparable repeated data** (10 stock listings, 5 banks, transaction rows, shop inventory) — a
  repeated unit is *correct* here. Don't force asymmetry onto genuinely comparable items just to avoid
  the word "card." The job here is making the repeated unit itself well-crafted (real hover states,
  real information density, not lazy padding-and-shadow), not eliminating repetition.
- **Narrative/hero/single-focus content** (Guide Board landing, portal selector, empty states,
  onboarding, a balance/portfolio-value moment, any "first impression" screen) — this is where the
  default card-grid instinct is actively wrong. Use one of the patterns below instead.

## Layout pattern library — concrete, not abstract

| Pattern | What it is | Where it fits in ARTHAX |
|---|---|---|
| Full-bleed editorial section | Content and background share the full viewport width, type overlaps imagery, no containing box | Guide Board hero; Stock Portal individual company detail page (banner bleeds full-width behind overlaid logo/stats) |
| Broken/asymmetric grid | Deliberately uneven sizes and offsets — not a uniform 3-column grid, more like a masonry with intent | Shop banner browsing (gold-tier items rendered larger, breaking the grid rhythm); Guide Board portal-selector if you don't go full-bleed |
| Oversized typography as the graphic | The number/word IS the visual centerpiece, not text inside a card | ARTH balance on User Portal home, portfolio value on Stock Portal — GSAP count-up on load, huge scale, no box around it |
| Horizontal scroll gallery | Native or scroll-jacked horizontal movement instead of a vertical grid | Shop pet carousel, Stock Portal watchlist strip |
| Split-screen sticky | One side pins while the other scrolls independently | Bank comparison (Bank Portal), any explainer section on Guide Board |
| Marquee/ticker strip | Continuous horizontal motion, real financial-app convention | Live-feeling stock price ticker; also legitimately more alive than a static number |
| Layered depth composition | Background illustration/brand asset bleeds behind foreground UI rather than being boxed into its own container | Empty states — illustration sits behind the headline/CTA rather than stacked neatly above it |
| Diagonal/angled section dividers | Section transitions cut at an angle instead of a straight horizontal line | Guide Board section breaks |
| Mask/reveal imagery | Image reveals via clip-path or mask animation on scroll, not a plain fade | Bank logos, stock banners appearing as you scroll into that section |

## Backgrounds — never flat by default

Every hero, portal landing, and major CTA section needs a deliberate background call, not `bg-white`
or a single flat token color:

- **Gradient mesh** — soft multi-stop blend across the existing palette (Deep Blue → Soft Blue → Sage
  Mint), not a hard two-color linear gradient
- **Grain/noise texture overlay** — low-opacity, adds tactile depth without adding a new color
- **Animated SVG blobs/waves** — slow GSAP-driven drift, cheap and effective on restrained portals
  where full 3D would be too much
- **Brand imagery as background, not inline** — portal hero images and stock banners (from
  `arthax-brand-identity`) used full-bleed with a gradient overlay for text legibility, rather than
  placed as a small inline `<img>` next to a heading
- **Three.js/Vanta.js ambient** — reserved for Guide Board and Shop per the existing per-portal
  restraint rules; don't let this leak into Bank/Stock/Central Bank data screens

## Motion vocabulary — vary the technique, don't repeat one animation everywhere

The other half of "boring" is using the same `fade-in-up, stagger 0.1s` on literally every element on
every screen. Vary by what's actually being revealed:

- **Scroll:** pin-and-reveal for hero stats, horizontal scroll-jack for galleries, parallax for
  background layers moving slower than foreground, scale-on-scroll for feature imagery, character/line
  text-splitting for headlines, staggered mask-reveal for image grids
- **Hover:** magnetic buttons (element shifts toward cursor position), tilt/3D perspective on
  interactive cards driven by mouse position, image zoom + overlay reveal, underline-draw on links,
  icon morph on button hover
- **Buttons specifically:** fill-sweep (background color wipes in from an edge, not a flat color
  swap), border-draw, icon slide/rotate on hover, tactile press-scale on click, loading state built
  into the button itself for submissions rather than a separate spinner replacing it
- **Transitions:** view-transition feel between portals rather than a hard page reload; staggered
  element choreography on route change so a new screen assembles itself rather than just appearing

All of this still routes through `gsap-animation-design` for the actual implementation details (easing
tokens, `prefers-reduced-motion`, target environment) — this skill decides *which* technique fits
*which* moment; that skill governs *how* to build it correctly.

## Before / after — three concrete ARTHAX screens

**Guide Board portal selector.** Autopilot version: 6 equal rounded cards in a 3×2 grid, icon + title +
description each. Instead: 6 portal names set in huge Fraunces type, arranged asymmetrically (not a
grid), each name's hover crossfades the full-viewport background to that portal's hero image with a
gradient overlay, description text reveals via mask on hover rather than always being visible. This is
the highest-value screen in the whole app to get this right — it's the first thing anyone sees.

**Stock Portal listing.** Autopilot version: grid of 10 identical stock cards. Instead: a live-feeling
ticker marquee at the top (motion, not static), and the actual list as a genuinely dense data table
(the correct repeated-unit pattern here) with inline sparkline mini-charts, where hovering a row
expands its height to reveal more detail rather than navigating away.

**Shop banners.** Autopilot version: uniform grid of banner cards. Instead: the rarity-tiered
asymmetric grid from `arthax-shop-gamification` — gold-tier items rendered visibly larger, breaking
grid rhythm on purpose, with the reveal/unboxing motion from that skill on first view.

## Hard rule: missing assets get asked for, never faked

This is non-negotiable, independent of everything above:

- **Never** invent a placeholder image URL (no `picsum.photos`, no `unsplash random`, no fake CDN
  path) and never leave a silent solid-color `<div>` standing in for a described photograph or
  illustration without flagging it.
- **Never** silently downgrade a specified visual (e.g. "full-bleed photographic hero background") to
  a plain gradient just because no image was supplied — that ships a different, smaller design than
  what was actually asked for, disguised as the same thing.
- **Before** assuming an asset doesn't exist, check it against the existing library first —
  `arthax-brand-identity`, `arthax-shop-gamification`, `arthax-empty-states`, and
  `arthax-transaction-states` between them catalog all 116 existing files. Most needs are already
  covered.
- **If** a design genuinely calls for something outside that library — a new illustration, a
  photographic background, a texture — stop and ask for it explicitly: name the exact need (subject,
  approximate dimensions/aspect ratio, style — photographic vs. illustrated vs. abstract/generative,
  and where it's used) rather than proceeding with a stand-in.
- **While waiting**, an acceptable placeholder is one that visibly announces itself as unfinished —
  e.g. a labeled block reading `NEEDS ASSET: hero background, 1920×1080, abstract data-visualization
  style` — never a plausible-looking fake that could be mistaken for finished work.
