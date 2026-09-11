---
name: anti-ai-design
description: The forensic checklist for avoiding templated, AI-generated-looking output — section flow, chromatic signature, container overuse, code-level tells. Use this proactively before generating any new ARTHAX UI, and reactively whenever reviewing Frontend or Design Director's output before it ships. This is the same discipline already applied to Proxy Bank/WanderWay — run it every time, not just when asked.
---

# Anti-AI Design (ARTHAX)

## Overview
This skill is a review pass, not a style guide (that's skill 15). Its job is to catch the specific, checkable tells that make a UI look AI-scaffolded rather than designed, and to run *before* new UI is generated, not just after.

## Pre-build checklist (run before writing new UI)
- Is this screen's layout genuinely informed by the Design System's palette/type identity (skill 15), or would it look the same with any palette swapped in? If it's palette-agnostic, it's probably template-like.
- Are more than 2-3 of the wide library surface (GSAP, Vanta, Three.js, Shadcn-derived components) about to be combined on one screen? The architecture doc's own guardrail says this reads as over-produced, not trustworthy.
- Is a Shadcn/React Bits/Kokonut component about to be used unmodified, or has it gone through Component Librarian (skill 28) re-theming first?

## Post-build forensic checklist (run before shipping)
- **Section flow**: does the page read as a generic hero → features-grid → testimonials → CTA template, or does it have a structure that's actually motivated by ARTHAX's content (e.g., a Bank Portal dashboard's layout should follow banking information hierarchy, not a marketing-page skeleton)?
- **Chromatic signature**: is Arth Gold used selectively as specified (skill 15), or has the palette collapsed into generic blue-on-white with no accent discipline?
- **Container overuse**: are there redundant nested cards/panels/shadows wrapping content that doesn't need visual containment — a classic AI-generated-UI tell?
- **Code-level tells**: inline arbitrary hex values instead of tokens, default Tailwind spacing scale used verbatim instead of the design system's scale, unmodified third-party component markup left in place.

## Rules
1. This is a checkpoint in the build order (skill 02, end of phase 4) — not optional, not skippable "because there's nothing to review yet." The design system and component base *is* what needs reviewing at that point.
2. Every output from Motion & 3D Specialist (skill 14 agent) gets a pass here before shipping — stacked animation libraries are exactly what tips a UI into looking over-produced.
3. Findings should be specific and actionable (which section, which token violated, which component unmodified) — not a vague "this looks AI-generated" verdict.

## Handoff
Owned by **Anti-AI Reviewer**. Reviews **Frontend**, **Design Director**, **Motion & 3D Specialist**, and **Component Librarian** output. This agent's only job is this skill — keep it independent from the agents whose work it reviews, same discipline as Financial Auditor being separate from Financial Engineer.
