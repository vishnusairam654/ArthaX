---
name: build-modern-web-projects
description: Use as the entry-point skill for any web development task — building or redesigning a marketing site, landing page, pricing page, portfolio, dashboard, or app UI. Routes to the right narrower skill (layout, motion, WebGL, copy) and enforces a consistent discovery → structure → design system → motion → asset honesty → performance/accessibility → validation workflow. Covers HTML/CSS/JS, Tailwind, GSAP, and Three.js stacks.
---

# Build Modern Web Projects (Master Skill)

This is the entry point for web-development work. It doesn't replace the narrower skills in this
library — it sequences them. Read this first, then jump into the specific skill(s) named in each
step for deeper recipes.

Treat "high quality" as an acceptance bar (semantic, accessible, performant, honestly sourced),
never as an awards claim.

---

## 0. Classify the task first

Before doing anything, decide which lane you're in — it changes which steps matter:

| Task type | Primary goal | Skip |
|---|---|---|
| Marketing / landing page | Conversion (one offer → one action) | Game-dev, deep app-state work |
| Portfolio / editorial site | Narrative + craft | Pricing/objection-handling structure |
| Pricing page | Plan clarity + objection handling | Hero motion narrative |
| Product UI / dashboard / app | Usability, state, data density | Awwwards-style hero moments |
| Playable / game-like experience | See `game-development/README.md` in this library | Most of this skill |

If it's ambiguous, ask the user which lane before designing.

---

## 1. Discovery (ask if missing, don't assume)

Gather the same four buckets regardless of lane:

1. **Purpose** — one primary action, the offer, what counts as "done"/converted.
2. **Audience** — who they are, what problem they have, top 2–3 objections, where traffic/users come from.
3. **Proof & assets** — logos, testimonials, numbers, screenshots, product video, existing brand assets.
4. **Constraints** — voice (casual vs professional), design direction, stack (plain HTML/CSS/JS, React/Next, Tailwind), mobile priority, reduced-motion requirements, deadline/scope.

Don't rebuild the whole page/app for every iteration — work section by section and change 1–2
things per pass. Specs beat vibes: write a compact direction (visual thesis, hero focal point,
type hierarchy, color system, section order, motion narrative) before writing code.

---

## 2. Structure and copy

For marketing/landing pages, use this section order as the default skeleton (see the `landing-page`
and `pricing-page` skills for full copywriting templates and FAQ/SEO checklists):

**Above the fold:** headline (outcome + audience) → subheadline (the "how") → one primary CTA →
one proof signal (logo strip / stat / short testimonial) → hero visual.

**Mid page:** problem → solution → benefits (3–5, outcome-driven, not feature-driven) → how it
works (3 steps) → social proof.

**Bottom:** FAQ (6–12 Q/A) → risk reversal (trial, guarantee, cancel anytime) → final CTA
(same as top).

Copy rules:
- One primary CTA above the fold — never compete with a second CTA.
- Benefits are outcomes, not mechanisms: "Cut weekly reporting from 4 hours to 15 minutes," not
  "streamline your workflow."
- Weak CTAs to avoid: "Learn more," "Submit." Prefer "Start free trial," "Book a demo."
- Put proof next to the claim it supports, not only in a bottom testimonial wall.

For pricing pages specifically: lead with the plan most users should pick, make feature
differences scannable (not just checkmarks), and answer "why would I pick the plan below/above
this one" explicitly — see the `pricing-page` skill.

---

## 3. Pick one design system, not a mood board

This library ships ~30 named visual-style skills (e.g. `clean-minimal-beige-light-mode`,
`dark-glass-clean-layout`, `editorial-tech`, `orange-clean-paper-saas`, `high-contrast-skeuomorphic-clean`)
and ~8 layout-system skills (e.g. `agency-grid-layout-minimal`, `split-layout-technical`,
`framed-grid-layout`). Select **one** compatible visual style and **one** layout system, name them
explicitly in your direction doc, and don't combine unrelated aesthetics in the same build.

Baseline system defaults (works with plain CSS or Tailwind, see `tailwindcss` skill for utility
patterns):
- Spacing scale: 8px base grid (8/16/24/32/48/64/96).
- Type scale: cap at 2–3 weights, one display face + one text face; tracking tight on large display type.
- Color: one neutral ramp + one accent, restrained gradient use, dark/light via a single class-based
  strategy (`dark:` variants), never mixed with a second theming approach.
- Radius/shadow: pick one corner-radius token and one shadow depth system and reuse everywhere —
  don't let every component invent its own.

Reject by default: generic gradient blobs, glass applied to every surface, stock bento grids
without content reason, decorative media with no narrative role.

---

## 4. Build the motion system

Use GSAP as the primary animation system for anything beyond a CSS hover/focus state
(see the `gsap` and `animation-systems` skills for full recipes).

**Defaults (don't reinvent per project):**
- Micro (hover/press): 120–200ms
- UI state change (toggle/select): 180–260ms
- Small transitions (popover/toast): 220–320ms
- Section entrance: 400–800ms
- Hero sequence: 800–1600ms, built as a labeled timeline with internal beats
- Stagger: 40–90ms per element; reduce on mobile
- Easing: `power2.out` / `expo.out` family for entrances, faster `ease-in` for exits; avoid
  elastic/bounce unless the brand is explicitly playful

**Choreography pattern:** hero visual animates first → headline next → CTA last. On scroll,
trigger a section's reveal around 20–30% visibility and animate once — don't replay on every
re-entry into view.

**Rules, not suggestions:**
- Animate `transform` and `opacity` (`autoAlpha` in GSAP) only. Avoid animating `top/left/width/height`.
- Pick exactly one smooth-scroll engine (Lenis or Locomotive Scroll) if you use one at all — never
  both — and wire it correctly to ScrollTrigger, refreshing after fonts/images/media load.
- Always support `prefers-reduced-motion: reduce`: bypass smooth scroll and scrubbed/pinned
  timelines, render final states immediately rather than just shortening durations.
- Clean up: `gsap.context()` + revert on unmount in SPA/React; kill ScrollTriggers on teardown.
- Keep an unsplit accessible name for staggered/split text — decorative split spans get hidden
  from assistive tech, links and meaningful inline markup never get split, and the unsplit content
  must render without JavaScript.

---

## 5. Add WebGL / Three.js only with a job to do

This library has heavy WebGL coverage (`threejs`, `webgl-3d-object`, `globe-gl`, `globe-particles`, `matterjs`,
`vantajs`, `cobejs`, `unicorn-studio`, `add-shader-cursor-trail`, and more) — treat all of it as
opt-in, not default.

- Use it only when spatial depth, texture transition, displacement, or pointer response
  materially supports the concept — never as ambient background noise.
- Give the canvas one job and keep it subordinate to real content and controls.
- Cap device pixel ratio (1–2), pause rendering when offscreen or the tab is hidden, throttle
  pointer input, avoid per-frame allocation.
- Ship a static poster/fallback frame and fully replace the canvas under reduced motion or WebGL
  failure — the page must be complete without it.
- Dispose everything on teardown: animation frames, observers, listeners, render targets,
  textures, geometries, materials, renderer. Handle context loss gracefully.

---

## 6. Keep assets honest

- Never illustrate with model-authored SVG/CSS/canvas paths pretending to be art. Use original
  generated or properly licensed transparent-PNG imagery for illustrative elements. Authored brand
  marks, interface icons, data graphics, and a justified WebGL shader canvas are fine.
- Every avatar is a real photo — never initials, illustrated heads, faceless silhouettes, or
  generated people presented as real customers/staff.
- Interface icons: a consistent icon set (e.g. Solar via Iconify). Real company logos only in
  truthful contexts; placeholder/"Logo Ipsum" marks only when explicitly disclosed as fictional —
  never as proof. Skip the logo wall entirely when there's no honest proof to show.
- Never invent testimonials, partnerships, or stats. Keep provenance notes for sourced media.

---

## 7. Performance and accessibility (non-negotiable)

- Responsive images, lazy-load below the fold, bounded blur, no continuously animated offscreen content.
- Full keyboard navigation with a visible focus state on every interactive element.
- Page remains usable with JavaScript, WebGL, or media playback unavailable — ship real static fallbacks.
- Respect `prefers-reduced-motion` everywhere motion is added, not just in the hero.
- Don't build class names dynamically in Tailwind (`"text-" + color`) unless safelisted — it silently
  breaks in production because unused classes get purged.

---

## 8. Validate before handoff

- Run the production build; fix every failure, don't ship warnings.
- Check desktop and mobile breakpoints.
- Verify keyboard nav, visible focus, touch behavior, no-JS fallback, `prefers-reduced-motion` behavior.
- Confirm exactly one smooth-scroll engine is initialized (if any) and ScrollTrigger integration is correct.
- Search the rendered output and source for placeholder copy, copied reference identity, unsupported
  claims, misleading logos, uncredited media, and inaccessible split text.
- Report back: chosen layout/visual-style skill, asset sources, motion stack, WebGL decision (if any),
  what was validated, and any known limitation.

---

## 9. Route to a narrower skill

This master skill sequences the workflow; go to the named skill folder for the actual recipe once
you know what you need:

- **Structure/copy:** `landing-page`, `pricing-page`
- **Styling:** `tailwindcss`
- **Motion:** `gsap`, `animation-systems`, `animation-on-scroll`, `gsap-scrolltrigger-storytelling`,
  `cinematic-gsap-lenis-motion-system`, `staggered-word-reveal`, `masked-reveal`, `marquee-loop`
- **WebGL/3D:** `threejs`, `webgl-3d-object`, `globe-gl`, `globe-particles`, `matterjs`, `vantajs`,
  `cobejs`, `unicorn-studio`, `add-shader-cursor-trail`, `webgl-laser`, `background-grid-webgl`
- **CSS detailing:** `beautiful-shadows`, `css-border-gradient`, `css-alpha-masking`,
  `progressive-blur`, `corner-diagonals`, `corner-lasers`, `container-lines`, `gooey-blob-system`
- **Layout systems:** `agency-grid-layout-minimal`, `split-layout-technical`, `framed-grid-layout`,
  `image-first-grid-layout`, `editorial-tech`, `book-serif-index`, `nested-container-frames`,
  `technical-wireframe-info-layout`
- **Visual style/mood:** any of the ~20 named mood skills (`dark-glass-clean-layout`,
  `clean-minimal-beige-light-mode`, `orange-clean-paper-saas`, `high-contrast-skeuomorphic-clean`,
  `mesh-gradient-dark-blue-clean`, etc.) — pick exactly one.
- **Full-site orchestration / premium builds:** `build-awwwards-quality-sites` (the most complete
  single skill — read it if the ask is "make this look premium/interactive/cinematic").
- **Asset sourcing:** `aura-asset-images`, `unsplash-asset-images`.
- **Game-like / playable interfaces:** see `agent-skills/game-development/README.md` — a separate
  skill tree (combat, enemies, inventory, VFX, audio, ship/QA) for Three.js browser games rather
  than marketing sites.

Prefer the smallest relevant set of skills. Don't load skills you don't need.

---

## What's out of scope here

This library is weighted almost entirely toward frontend visual/motion craft (81 of ~123 skills)
plus copy/conversion structure. It does not cover backend architecture, databases, auth, APIs, or
infra — bring your own conventions (or an existing project skill) for those, and use this skill
only for the client-facing layer.
