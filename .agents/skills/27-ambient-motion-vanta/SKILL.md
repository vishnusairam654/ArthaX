---
name: ambient-motion-vanta
description: Where WebGL ambient backgrounds (Vanta.js) are and aren't appropriate across the six ARTHAX portals, plus performance/battery cost — this is the library most likely to be overused. Use before adding any ambient/background motion effect, and treat "should I use Vanta here" as a question with a usually-no default answer.
---

# Ambient Motion / Vanta.js (ARTHAX)

## Overview
Vanta.js provides animated WebGL backgrounds. It's explicitly flagged in the architecture doc as the library most likely to be overused across ARTHAX's six portals — this skill's default answer to "can I add a Vanta background here" is no, justify the yes.

## Where it might be appropriate
- The public Guide Board / marketing entry point — a low-stakes, non-transactional surface where ambient motion supports the "modern human character" brand feeling (skill 15) without competing with financial data.
- Possibly a login/landing screen before the user is inside any portal doing real work.

## Where it is not appropriate
- Any screen inside User Portal, Bank Portal, Central Bank Portal, or Stock Portal where the user is reading balances, transaction history, or making financial decisions — ambient background motion here competes with the "Clear, Calm, Precise" principles (skill 15) and adds cognitive noise to a trust-sensitive context.
- Any screen already using GSAP timelines (skill 17) or a Three.js preview (skill 26) — the architecture doc's guardrail explicitly warns against stacking more than 2-3 of this library surface on one screen.

## Rules
1. Performance/battery cost is real — Vanta renders continuously in the background, which is a meaningful cost on mobile/lower-end devices. Any use must be justified against this cost, not added because it's visually appealing in isolation.
2. Respect `prefers-reduced-motion` (skill 21) — ambient backgrounds are exactly the kind of effect that should fully disable, not just slow down, under this preference.
3. If used, pause/stop the effect when the tab/window isn't visible (Page Visibility API) to avoid wasting resources on an unseen animation.

## Common mistakes
- Adding a Vanta background to a portal dashboard "to make it feel less static," directly undermining trust-focused design principles.
- Leaving Vanta running when the tab is backgrounded, burning battery/CPU for nothing.
- Combining Vanta with GSAP and Three.js on the same screen, tipping it into "over-produced."

## Handoff
Owned by **Motion & 3D Specialist**, directed by **Design Director**. Anti-AI Reviewer (skill 16) should specifically flag any Vanta usage inside a portal (not the public Guide) as a finding requiring justification.
