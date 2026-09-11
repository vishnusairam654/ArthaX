---
name: design-system
description: The @arthax/design-system tokens — Fraunces + Cantarell type scale, the blue/teal/sage/cream palette plus Arth Gold accent, spacing/radius scale, and the Artha/Flow motif. Use whenever choosing colors, type, spacing, or visual identity decisions for any ARTHAX screen. This is the token authority — no screen should hardcode a color or font outside these tokens.
---

# Design System (ARTHAX v1)

## Philosophy
Core feeling: trustworthy financial infrastructure with a modern human character. Five principles: **Clear, Calm, Precise, Distinctive, Human**. Avoid: futuristic, neon, over-glossy, glass-heavy, template-like.

## Color system
**Primary palette**
- Deep Blue `#3368A0`
- Soft Blue `#66A3BF`
- Sage Mint `#C8DFDB`
- Off White `#F2EFE7`

**Arth Gold (brand accent)** — use selectively for active states, financial figures, brand details, selected navigation, rewards. Not a general-purpose color.
- Arth Gold `#A8742A`
- Arth Gold Soft `#E9D9BE`

**Semantic colors**
- Positive `#287A55`
- Negative `#B94A43`
- Warning `#A8742A`
- Info `#496C80`

## Typography
Fraunces (display/headings) + Cantarell (body/UI) — a defined type scale, not ad-hoc font-size values per component.

## Rules
1. Every color, spacing, and radius value used in a component traces back to a token — no inline hex codes or magic pixel values in component code.
2. Arth Gold is an accent, not a primary action color — if a whole screen is gold, that's a violation of "use selectively."
3. Semantic colors (positive/negative/warning/info) are reserved for their meaning — don't reuse "Positive" green for a decorative purpose.
4. "Distinctive, not template-like" is a real constraint: Component Librarian (skill 28) and Anti-AI Reviewer (skill 16) exist specifically to catch unmodified Shadcn defaults or generic AI-generated layouts that ignore this palette/type identity.

## Handoff
Owned by **Design Director**, established in phase 4 (skill 02) before real screens get built. Feeds skill 17 (Motion), skill 18 (UX/Interaction), skill 14 (Frontend implementation), and is the checklist Anti-AI Reviewer (skill 16) audits against.
