---
name: motion-gsap
description: The shared motion package — physical/precise/soft principles, load sequences, scroll reveals, and hover microinteractions using GSAP. Use for any orchestrated, larger-scale animation work (page load sequences, scroll-triggered reveals, timeline-based transitions). For small isolated details (counters, button feedback) use skill 29 (Anime.js) instead — don't blur the two.
---

# Motion / GSAP (ARTHAX)

## Overview
GSAP owns the *orchestration* layer of motion — timelines, sequencing, scroll-triggered reveals — as distinct from Anime.js's small, tasteful micro-interactions (skill 29).

## Principles
- **Physical**: motion should feel like it obeys real-world physics (easing, momentum) rather than linear/mechanical timing.
- **Precise**: financial UI is trust-sensitive — motion clarifies state changes (a balance updating, a transaction completing) rather than decorating for its own sake.
- **Soft**: avoid aggressive, attention-grabbing animation on a portal people use to manage real money.

## Use cases
- **Load sequences**: staged reveal of dashboard elements on portal entry.
- **Scroll reveals**: content entering as the user scrolls, used sparingly — not on every section of every portal.
- **Hover microinteractions** *at the orchestration level* (e.g., a card expanding with dependent child animations) — simple single-property hover feedback belongs in skill 29 instead.

## Rules
1. GSAP is for anything involving a *timeline* or *sequence* of more than one animated property/element. If it's one element, one property, one trigger — that's Anime.js's job (skill 29), not GSAP's.
2. Respect `prefers-reduced-motion` (skill 21) — every GSAP sequence needs a reduced-motion fallback that either skips or drastically shortens the animation, not just "disable everything" as an afterthought.
3. No single screen combines GSAP timelines with a Vanta background (skill 27) *and* a Three.js preview (skill 26) *and* unmodified component-library motion simultaneously — see the architecture doc's explicit guardrail on this.
4. Motion decisions are made against the token system by Design Director, not added because the library happens to be available.

## Common mistakes
- Using GSAP for a single button hover state (over-engineering; use skill 29).
- Scroll-triggered reveals on every section of a dense financial dashboard, creating motion fatigue.
- No reduced-motion fallback tested.

## Handoff
Owned by **Design Director** for direction, implemented by **Motion & 3D Specialist**. Every output gets an Anti-AI Reviewer (skill 16) pass before shipping.
