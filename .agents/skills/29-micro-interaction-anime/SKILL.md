---
name: micro-interaction-anime
description: Small, tasteful interaction details using Anime.js — counters, button feedback, motif animation — kept deliberately separate from GSAP's larger orchestration role. Use for any single-element, single-property animation trigger. If it involves a timeline or sequence of multiple elements, that's skill 17 (GSAP) instead.
---

# Micro-interaction / Anime.js (ARTHAX)

## Overview
Anime.js handles small, isolated animation details — the opposite end of the motion spectrum from GSAP's orchestration (skill 17). Keeping them separate is deliberate: it stops "animate everything" from becoming the default posture across the app.

## Use cases
- **Counters**: a balance or number ticking up/down to a new value on update.
- **Button feedback**: press/success/error micro-feedback on a single interactive element.
- **Motif animation**: small, brand-motif-driven flourishes (e.g., the Artha/Flow motif from skill 15) applied to an icon or small UI element, not a whole section.

## Rules
1. Scope discipline: one element, one or two properties, one trigger. The moment a "micro-interaction" needs to sequence multiple elements or stages, it has become a GSAP job (skill 17) — move it there rather than building an ad hoc timeline in Anime.js.
2. Financial figures (balance counters, especially) should animate precisely — the final displayed value must always be exactly correct, never left mid-tween if state changes again before the animation completes (cancel/restart cleanly).
3. Respect `prefers-reduced-motion` (skill 21) — counters can jump directly to the final value, button feedback can use an instant state change instead of a tween.
4. Don't apply micro-interactions to every single element by default — per skill 16's anti-template discipline, motion should be motivated by what actually benefits from feedback (a submit button, a balance update), not applied uniformly because the library is available.

## Common mistakes
- A balance counter animation that gets interrupted by a new balance update and displays a stale/incorrect intermediate value.
- Using Anime.js to build what is actually a multi-stage sequence better suited to GSAP.
- Applying hover/press feedback to every element on a page indiscriminately, creating visual noise.

## Handoff
Owned by **Motion & 3D Specialist**, directed by **Design Director**. Anti-AI Reviewer (skill 16) checks that GSAP and Anime.js roles haven't blurred together on a given screen.
