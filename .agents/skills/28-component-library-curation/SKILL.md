---
name: component-library-curation
description: The discipline of taking Shadcn/React Bits/Kokonut UI patterns and rebuilding them inside @arthax/ui's token system rather than shipping defaults. Use before any third-party component pattern is adopted anywhere in ARTHAX — this is a required step, not an optional polish pass, and it happens before Frontend ever touches the pattern.
---

# Component Library Curation (ARTHAX)

## Overview
Shadcn/ui, React Bits, and Kokonut UI are reference/base sources, not drop-in component libraries for ARTHAX. This skill's job is re-theming every adopted pattern through `@arthax/ui`'s token system (skill 15) before Frontend (skill 14) ever imports it into a portal.

## Sources and how to use them
- **Shadcn/ui**: base primitives for `@arthax/ui` (button, input, dialog, etc.) — every component must be re-themed through Sections 5.2/5.4/5.5 design tokens before use. Unmodified Shadcn defaults are one of the clearest AI-scaffolding tells (skill 16), directly against the "Distinctive, not Template-like" principle.
- **React Bits / Kokonut UI**: reference libraries for interaction *patterns* (text reveals, animated empty states, layout ideas) — never drop-in components. Extract the pattern, rebuild it inside the ARTHAX token system with the same discipline as Shadcn.

## Workflow
1. Identify the pattern needed (e.g., "empty state with an animated illustration").
2. Study the reference implementation from React Bits/Kokonut/Shadcn for the interaction mechanics, not the visual styling.
3. Rebuild inside `@arthax/ui` using skill 15's tokens (colors, type, spacing) and skill 17/29's motion principles rather than the reference's default styling/easing.
4. Land it in `@arthax/ui` before Frontend consumes it in any portal — Frontend should never be the first place a re-themed pattern gets used.

## Rules
1. This is a gate, not a suggestion: Frontend importing an unmodified third-party component directly into a portal is a process failure, not just a style nitpick.
2. Component Librarian sits between Frontend and Anti-AI Reviewer in the pipeline — patterns pass through here first specifically so unmodified defaults never make it into a portal in the first place, rather than being caught and reworked after the fact.
3. When a reference pattern doesn't fit ARTHAX's token system cleanly, that's a signal to simplify or rebuild from scratch rather than force-fit — don't compromise the design system's coherence for a convenient pattern match.

## Common mistakes
- Frontend importing `shadcn/ui`'s default button styling directly "temporarily" and it never getting re-themed.
- Treating React Bits/Kokonut as a components-to-copy source rather than a patterns-to-study source.
- Re-theming colors but leaving default spacing/type scale untouched, producing a half-curated component.

## Handoff
Owned by **Component Librarian**, working in phase 4 (skill 02) before Frontend uses any base component. Works hand-in-hand with **Anti-AI Reviewer** (skill 16).
