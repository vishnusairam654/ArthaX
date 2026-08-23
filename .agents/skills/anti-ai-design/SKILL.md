---
name: anti-ai-design
description: >
  Use this skill whenever building, styling, or reviewing a UI (landing page, dashboard, portfolio, app screen)
  where the goal is that it must NOT look AI-generated, templated, or "vibe-coded." Trigger on phrases like
  "make it look human-made," "doesn't look AI generated," "de-slop this," "audit my UI for AI tells," "why does
  this look like v0/Lovable/Bolt," or any request to review an existing project (e.g. Proxy Bank, Doctalk,
  WanderWay, Konoha Legacy) for design authenticity before showing it to a recruiter or shipping it. Also
  trigger proactively any time you are about to generate new frontend UI for the user — run the pre-build
  checklist before writing code, not just after. Works alongside the frontend-design skill — frontend-design
  tells you how to make deliberate choices, this skill tells you the specific, checkable tells that give away
  AI generation so you can verify you actually avoided them.
---

# Anti-AI Design

## Why this exists

Generative UI tools (v0, Bolt.new, Lovable, Claude Artifacts, Cursor) don't fail on any single visual choice — they fail on **statistical convergence**. Any one of "dark theme," "violet accent," "shadcn/ui," or "8px grid" is completely normal in human-made products too. What gives away AI generation is the *co-occurrence* of many of these defaults at once, combined with visual polish that doesn't extend into interaction depth. This skill exists to make that co-occurrence check concrete and repeatable, instead of relying on a vague "it feels off" impression.

Use this skill in two modes:

- **Build mode** — before/while writing new UI, run the pre-build checklist so the defaults never accumulate in the first place.
- **Audit mode** — for existing code (Ram's own projects, or anything he's about to ship/demo), score it against the indicator tables in `references/forensic-indicators.md` and report a verdict with specific, fixable findings — the same way the uploaded forensic report does, but pointed at making a fix list instead of just a diagnosis.

Don't just flag problems — for every tell you find, give the specific fix. A list of "here's what's wrong" without "here's what to do about it" wastes the audit.

## The core insight: it's never one thing

Never reject a design for using a single common pattern (dark mode, Tailwind, rounded corners, Inter font) in isolation — plenty of well-regarded human products use all of these. The diagnostic signal is **density of convergence**: how many independent AI-favored defaults stack on top of each other in the same interface. One or two = normal modern web dev. Five or more from the same "family" (see below) = statistically almost certainly AI-scaffolded, human-polished, or copy-pasted from a generator's example gallery without modification.

The families, from `references/forensic-indicators.md`, condensed:

1. **Section flow** — Hero w/ centered badge → 3-col feature grid → logo ribbon → bento grid → 3-tier pricing → accordion FAQ → floating CTA footer, followed rigidly and in full.
2. **Chromatic signature** — near-black zinc/gray-950 base + violet-to-indigo or cyan gradient accent + `border-white/10` glass cards + top-centered radial glow.
3. **Component provenance** — unmodified shadcn/ui + Radix primitives + Lucide icons + `cn()` (`clsx` + `tailwind-merge`) helper, with zero custom variants or tokens.
4. **Spacing mechanics** — everything on a strict 8px scale, identical `rounded-xl`/`rounded-2xl` on every surface regardless of scale, isotropic padding everywhere.
5. **Copy defaults** — generic CTAs ("Get Started Today," "Start Free Trial"), generic placeholders (`name@example.com`), generic empty states ("No data found").
6. **Container overuse** — every piece of content wrapped in its own bordered, rounded, floating card instead of using typographic grouping.
7. **Interaction shallowness** — the "60–70% wall": happy path looks complete, but loading/skeleton states, validation, network/timeout recovery, and cross-screen state persistence are thin or absent.
8. **Code-level tells** — long un-abstracted inline Tailwind class strings repeated per-node, static mock arrays defined inside components, inline multi-line SVGs instead of shared assets, boilerplate config files untouched from CLI defaults.

If you count 5+ of these families present at once in something you're building or reviewing, treat it as a real signal, not a vibe, and work through the checklist below.

## Build mode: pre-build and mid-build checklist

Run this before generating UI code, and again as a self-check before presenting it.

**Before writing any code:**
- State the product's actual domain and the one thing this screen needs to let the person do. Let that drive layout choices instead of defaulting to the canonical SaaS section sequence — most non-landing-page UI (dashboards, tools, internal apps) has no business following the hero→bento→pricing→FAQ→CTA shape at all.
- Pick a palette and 2 typefaces *before* touching Tailwind's default scale, and write down why — see the frontend-design skill for the token-system process. If the honest answer is "because it's the default," change it.
- Decide up front what real content/data will populate the UI. Placeholder-driven design is where generic copy and mock arrays sneak in.

**While building:**
- Don't wrap every content unit in its own bordered rounded card by reflex. Ask whether a typographic grouping (heading + rule + list) would read better before reaching for `<Card>`.
- Avoid identical `rounded-xl`/`p-6`/`gap-6` everywhere. Vary padding ratios and radii deliberately based on component role and density, not by copy-pasting the same className block.
- Extract repeated Tailwind class strings into a component or `cva()` variant once you're using them more than twice — long inline utility strings on every node are one of the clearest code-level tells.
- Write real microcopy for this product's domain, not generic SaaS copy. If you can imagine the exact same button text on ten other apps, rewrite it.
- Build the states a real product needs: loading/skeleton, empty, error, disabled, and — where the app has multi-step flows — persistence across navigation. This is the single highest-leverage fix, because interaction depth is the hardest thing for a generator to fake and the easiest tell for a human reviewer to spot.
- Check contrast (WCAG AA, 4.5:1 for body text) instead of trusting `text-zinc-500` on `bg-zinc-950` by default — that pairing under-shoots the ratio.
- Use real interactive elements (`<button>`, proper `<a>`) with keyboard support instead of `<div onClick>`. This is both an accessibility fix and a "looks handcrafted" signal, since generators frequently skip it.

**Before showing the result:**
- Count the families from the section above that are present. If 5+, go back and deliberately break at least two of them (usually: section flow and container overuse are the cheapest to fix and the highest-signal to break).

## Audit mode: reviewing existing work

When Ram asks you to review a project (Proxy Bank, Doctalk, WanderWay, Konoha Legacy, or anything else) for "does this look AI-generated":

1. **Read the actual code and rendered UI**, don't guess from memory of typical AI output. Check component files, Tailwind config, and if available, package.json dependencies and commit history.
2. **Score it against `references/forensic-indicators.md`** — walk the twelve diagnostic categories, note the concrete evidence for each (not a vibe — cite the file/line, class, or copy string), and compute a rough weighted likelihood the way the reference doc does.
3. **Report like a code review, not a verdict.** Structure findings as: Tell → Evidence → Fix. Order by leverage (interaction-depth and code-structure fixes usually matter more than swapping an accent color).
4. **Be honest about severity.** Not every finding is equally damning — a shared shadcn/ui dependency alone is not evidence; five converging defaults plus shallow interaction states is. Don't inflate the score to seem thorough, and don't downplay real convergence to be agreeable — per Ram's stated preference, give the accurate read even if the answer is "yes, this looks templated."
5. **Give a prioritized fix list**, not just a score. End with the 3–5 changes that would move the needle most, not an exhaustive rewrite of every minor item.

Full indicator tables, the color/typography/spacing specifics, tool-fingerprint mapping (v0 vs Bolt vs Lovable signatures), and the confidence-scoring formula are in `references/forensic-indicators.md` — read it when doing a real audit; the summary above is enough for build-mode self-checks.


---

# forensic-indicators.md

# Forensic Indicators Reference

Distilled from a UI/UX forensic report on detecting AI-generated interfaces. Use this during **audit mode** for a thorough pass; `SKILL.md` has the condensed version for build-mode self-checks.

Evidence is not all equally strong. When scoring, weight findings by tier:

- **Strong evidence** — code/AST-level patterns (un-abstracted class strings, inline mock arrays, inline multi-line SVGs), commit histories that introduce entire multi-view apps in one or two commits, missing core states/security config.
- **Moderate evidence** — rigid adherence to the canonical section flow, heavy violet/dark-mode palette use, universal 8px spacing, default Lucide icons, generic marketing copy.
- **Weak evidence on its own** — Inter font, standard Tailwind utilities, rounded cards, "modern minimalist" styling. These alone prove nothing; human developers use the same libraries AI models were trained on. Only count them when they co-occur with moderate/strong evidence.

## 1. Layout and section flow

Canonical AI landing-page sequence: centered hero with badge pill → 3-column feature grid → logo/metric ribbon → bento grid → 3-tier pricing (center card elevated) → accordion FAQ → floating centered CTA footer. Strict, complete adherence to this exact sequence is a moderate-to-strong tell. Human execution usually breaks the sequence somewhere for content reasons (asymmetric anchor, narrative section, a real data table instead of a metric ribbon).

Other layout tells:
- Bento grids used decoratively (fake toggles, decorative progress rings, synthetic timeline nodes) rather than because the content is genuinely a dashboard of live values.
- Every section internally centered (`items-center text-center mx-auto max-w-3xl`) with no compositional asymmetry across the whole page.
- Every informational unit isolated in its own floating bordered card instead of continuous typographic grouping.

## 2. Typography

- Font stack: Inter, Geist, Plus Jakarta Sans, DM Sans, Montserrat, or system sans — used with zero bespoke modification, is the algorithmic default.
- Monotypic hierarchy: one font family, weight-only variation, paired with a generic mono (JetBrains Mono) for badges — lacks editorial pairing (e.g. a display serif against a geometric sans).
- Strict adherence to Tailwind's default type scale (`text-xs` → `text-5xl`) with no manual adjustment for line length or context.
- Universal `tracking-tight` on all headings and `leading-relaxed` on all body copy, applied uniformly rather than tuned per block.
- Headings engineered to wrap at exactly two lines on a 1440px viewport — a sign of token-count optimization rather than natural copy length.
- Copy pattern: action verb + abstract noun ("Accelerate Your Workflow," "Empower Your Data") combined with a gradient text overlay.

## 3. Color

- Base surface: near-black neutral (`#09090b` zinc-950 or `#030712` gray-950) + pure white text, with no warm/cool organic undertone.
- Primary accent: indigo-to-violet gradient (`#6366f1` → `#a855f7`) or electric cyan (`#06b6d4`) — statistically dominant across AI-generated templates (~68% prevalence vs ~22% in handcrafted baselines, per the source report's estimates).
- Borders: semi-transparent white (`border-white/10`) or `border-zinc-800` over translucent card backgrounds (glassmorphism-on-dark).
- Ambient lighting: top-centered radial gradient in the hero (`radial-gradient(ellipse_at_top, rgba(120,119,198,0.15), transparent_50%)`) — a near-ubiquitous pattern in generated heroes specifically.
- Dark + purple/indigo is the single most over-represented scheme; pure neutral monochrome and bespoke multi-brand chroma systems are comparatively rare in AI output and comparatively common in handcrafted work.

## 4. Spacing and dimensioning

- Strict 8px scale (`p-2/4/6/8`, `gap-6/8`) applied with zero contextual/optical adjustment.
- Uniform container widths (`max-w-5xl`, `max-w-7xl`) across every section regardless of content type.
- Identical border radius (`rounded-xl`/`rounded-2xl`) on cards, inputs, badges, and modals regardless of component scale.
- Isotropic card padding (same value on all four sides) rather than asymmetric padding tuned for scanning dense data.

## 5. Component and ecosystem provenance

Typical layered stack in AI output:
- Presentation: shadcn/ui `Card`, `Badge`, `Button`, `Dialog`, `Accordion`.
- Micro-effects: Aceternity UI (`BackgroundBeams`, `SparklesCore`, `GlowingBorder`, `InfiniteMovingCards`).
- Headless primitives: Radix UI (`@radix-ui/react-slot`, `-dialog`, `-dropdown-menu`).
- Styling: Tailwind via `cn()` (`clsx` + `tailwind-merge`).
- Icons: Lucide React, imported unmodified.

Tool fingerprint mapping (approximate confidence from the source report):
- **v0 by Vercel** — component-isolated modules, strict shadcn/ui, Next.js App Router + Tailwind + Lucide. High match confidence.
- **Bolt.new** — full-stack scaffolds, mock backend controllers, in-memory arrays, WebContainer hooks. Moderate-high confidence.
- **Lovable** — complete SaaS page sets, integrated Supabase auth, Framer Motion. High confidence.
- **Claude Artifacts / ChatGPT Canvas** — single-file components, inline SVGs, no external deps. Lower confidence signature (more variable).
- **Relume / Framer AI** — section-focused marketing patterns, pre-composed layout blocks. Moderate confidence.

Using shadcn/ui or Radix alone is **not** evidence — they're standard modern React tooling used by human developers too. The tell is *total absence of customization*: no modified tokens, no custom variants, no design-system layer on top of the primitives.

## 6. Microcopy

| Pattern | Generic (AI-flavored) | Domain-specific (human-flavored) |
|---|---|---|
| CTA | "Get Started Today," "Start Free Trial" | "Deploy Cluster," "Generate API Key" |
| Input placeholder | `name@example.com`, "Enter project name..." | `usr_live_...`, "Filter by cluster ID or tag" |
| Validation | "Please fill in this field" | "Email must match registered SSO domain" |
| Empty state | "No data found. Your items will appear here." | "No active nodes detected in us-east-1. Review provisioning logs." |

Generic copy in isolation isn't damning (sometimes generic is genuinely correct for the audience), but paired with other tells it reinforces the pattern.

## 7. Interaction depth ("the 60–70% product wall")

The gap between visual polish and functional depth is one of the strongest tells, because it's expensive to fake and cheap to check:

| Dimension | Typical AI-generated completeness | Typical handcrafted completeness |
|---|---|---|
| Happy path | Complete | Complete |
| Hover/active states | Basic CSS transitions only | Customized focus rings, tactile feedback |
| Loading/skeleton | Static spinner or absent | Contextual skeletons, optimistic UI |
| Input validation | Basic HTML5 only | Inline async validation, error recovery |
| Timeout/network recovery | Missing | Retry/backoff, offline indicators |
| State persistence | Context amnesia across screens | Real state management (Context/Redux/Zustand) |

If an interface looks fully polished but breaks down the moment you check for error states, retries, or persistence across navigation, that's a strong signal regardless of how the visuals score.

## 8. Accessibility and responsiveness

- Multi-column bento/metric layouts collapse to a single vertical stack on mobile without any re-prioritization of hierarchy.
- Wide tables overflow horizontally instead of transforming into a card/list view on small viewports.
- `text-zinc-500` on `bg-zinc-950` yields roughly 2.8:1 contrast — fails WCAG AA's 4.5:1 threshold for body text.
- `<div onClick>` used instead of `<button>`, missing `tabIndex`/`onKeyDown`/ARIA roles — common even in codebases built on Radix, because generators bypass the accessible primitives with ad hoc wrappers.

## 9. Code-level / AST tells

These are the strongest and most checkable category:

- Long, un-abstracted inline Tailwind class strings repeated on many nodes instead of extracted into a component or `cva()` variant.
- Static mock data (`const items = [{ id: 1, ... }]`) defined directly inside UI component files rather than in a data layer.
- Full multi-line inline `<svg>` markup embedded per-component instead of shared, imported assets.
- Everything (data model, component, sub-elements) bundled into one large file rather than split across a modular architecture.
- Universal `import { cn } from "@/lib/utils"` with no other utility abstraction anywhere in the codebase.

## 10. Repository / commit telemetry (when available)

- An entire multi-view frontend introduced in one or two initial commits, with no incremental/debugging history.
- Config files (`tailwind.config.ts`, `components.json`) matching CLI defaults untouched.
- Dependency list matching the standard generative stack almost exactly: `@radix-ui/*`, `lucide-react`, `tailwind-merge`, `clsx`, `class-variance-authority`, with nothing added or removed.

## 11. Confounders — do not treat these as evidence on their own

Human developers legitimately use the same tools AI was trained on. Don't flag these in isolation:

- Using shadcn/ui or Tailwind at all (standard modern practice).
- Dark theme with a violet/indigo accent (a genuinely popular contemporary aesthetic).
- Following a hero → features → pricing → FAQ flow when the product actually is a SaaS page selling a plan.
- Using Inter or another standard sans font.

What turns these into evidence is **co-occurrence with the moderate/strong tells above** — especially total absence of customization, shallow interaction states, or code-level markers.

## 12. Scoring approach

If a numeric estimate is useful (e.g. the user wants a "likelihood" number), use a weighted average across the twelve categories above (layout, typography, color, spacing, components, copy, container use, interaction depth, accessibility, code-level, repo telemetry, "too-perfect" regularity), scoring each 0–10 for how strongly it matches the AI-default pattern, then reporting the weighted mean as a rough percentage. Treat this as a communication aid, not a precise instrument — the qualitative Tell → Evidence → Fix list in the audit is more useful to Ram than the number itself.

Rough interpretation bands:
- 0–25%: little to no generative signal; treat as handcrafted.
- 26–40%: minor AI-assisted boilerplate on an otherwise handcrafted core.
- 41–60%: genuinely ambiguous/hybrid — flag specific ambiguous areas rather than forcing a verdict.
- 61–75%: probable AI scaffolding with human edits on top.
- 76%+: strongly AI-generated; treat the fix list as a priority, not a nice-to-have.
