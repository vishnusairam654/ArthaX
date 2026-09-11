---
name: 3d-webgl-engineering
description: Three.js/React Three Fiber scene setup for the Shop's avatar/pet/frame previews, with performance budgets so 3D never blocks ledger interactions on lower-end devices. Use only for Shop customization/inventory 3D previews. Never use for financial data visualization — market charts and portfolio data stay flat (skill 07), per the architecture doc's explicit rule.
---

# 3D / WebGL Engineering (ARTHAX)

## Overview
Three.js is reserved for genuinely 3D moments — Shop's avatar/pet/frame previews — and nowhere else. This is an explicit architectural constraint, not just a stylistic default.

## Scope
- Avatar preview/customization in Shop.
- Pet preview (including any active "pet powers" visual representation, per skill 08's gamification note).
- Frame preview for profile/account customization.

## Rules
1. **Hard boundary**: never use Three.js/R3F for financial data (market charts, portfolio breakdowns, ledger visualizations). Those stay flat and precise using Recharts/D3-class tooling (skill 07) — 3D adds interpretive noise to numbers people are trusting with real money.
2. **Performance budget**: 3D scenes must be lazy-loaded (not part of the initial Shop bundle) and must not block or degrade ledger-adjacent interactions elsewhere in the app — a heavy WebGL scene in Shop shouldn't cause jank if a user has a transfer modal open in another tab/context.
3. Provide a fallback (static image or simplified preview) for lower-end devices or when WebGL context creation fails — never let Shop become unusable because a 3D scene failed to initialize.
4. Keep scene complexity (poly count, texture size) budgeted explicitly per asset type (avatar/pet/frame) rather than growing unbounded as more items are added to the catalog.

## Common mistakes
- A market chart or portfolio widget rendered in Three.js because "it looks cool" — this directly violates the architecture doc's design philosophy (skill 15's Clear/Calm/Precise principles for financial data).
- No fallback path when WebGL isn't available (older devices, restrictive browser settings).
- 3D assets loaded eagerly on Shop entry instead of on-demand per item.

## Handoff
Owned by **Motion & 3D Specialist**, implementing what **Design Director** directs. Every output gets an Anti-AI Reviewer (skill 16) pass, and performance budgets should be verified against skill 19/23 monitoring.
