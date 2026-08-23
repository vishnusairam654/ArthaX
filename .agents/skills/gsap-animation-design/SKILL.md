---
name: gsap-animation-design
description: Use this skill whenever the user wants a frontend build to feel polished, alive, or "designed" through motion — smooth transitions, scroll animations, hover microinteractions, page/section reveals, animated hero sections, or a landing page/dashboard/portfolio that should not look like a static default. Trigger on any mention of GSAP, ScrollTrigger, anime.js, Vanta.js, Three.js backgrounds, Framer-Motion-style transitions, or references to component/design-inspiration sources like 21st.dev, shadcn/ui, react bits, kokonut UI, craft UI, dice UI, or "tasteful" / "premium" / "modern SaaS" UI. Also trigger any time the user is building a React or HTML artifact, or a real frontend project, and asks for it to "feel smooth", have "nice animations", or generally look like it came from a design studio rather than a tutorial. Don't wait for the user to name GSAP explicitly — if they're asking for polished motion or premium visual taste in a UI, this skill applies.
---

# GSAP & Motion-Design Skill

## What this skill is for

Most default UI output is animation-free or uses one flat CSS transition — it reads as a wireframe, not a product. This skill exists to close that gap: give Claude a concrete toolkit (real libraries, real code patterns) plus a taste framework (what "premium" motion actually looks like) so animated builds are deliberate instead of decorative.

Read this skill fully before writing animation code. Also check the `frontend-design` skill for layout/typography/color tokens — the two are complementary: that skill covers *what things look like*, this one covers *how things move*.

## First, figure out the environment — this changes everything

The single biggest failure mode is picking a library that doesn't actually work in the target output. Check which of these applies before writing a line of code:

| Target | What's actually available |
|---|---|
| **HTML artifact** (`.html`, renders inline in claude.ai) | Full CDN access via `cdnjs.cloudflare.com`. GSAP, ScrollTrigger, anime.js, Vanta.js, and Three.js are all real, loadable libraries here via `<script>` tags. This is the best target for anything GSAP-heavy. |
| **React artifact** (`.jsx`, renders inline in claude.ai) | Only a fixed allow-list of packages can be imported (see the artifact system instructions) — `three` is on it, but **GSAP, anime.js, and Vanta.js are not importable here**. Don't write `import gsap from 'gsap'` in a React artifact — it will fail. For React artifacts, use CSS transitions/keyframes, the Web Animations API, or `three` directly for 3D. |
| **Real project files** (Claude Code, Cowork, or files written to disk for the user to run) | No restrictions — `npm install gsap`, `three`, `@studio-freight/lenis`, etc. all work normally. This is where the full library list below is fair game, including copy-paste component sources. |

If it's ambiguous which target the user wants, default to an HTML artifact when they just want to see something in chat, or ask if they're setting up a real project.

## The toolkit, and what each library is actually for

These fall into two different categories — don't treat them the same way:

**Real animation/rendering engines** (code you import and call):
- **GSAP** (+ ScrollTrigger, ScrollSmoother, SplitText plugins) — the core workhorse for timelines, scroll-linked animation, and staggered reveals. Default to this for anything described as "smooth" or "scroll-triggered."
- **anime.js** — lighter-weight alternative to GSAP for simpler property/SVG animations when a full timeline isn't needed.
- **Three.js** — real 3D scenes/backgrounds/objects.
- **Vanta.js** — pre-built animated backgrounds (waves, fog, net, birds) built on Three.js/p5 — fast way to get an ambient animated background without hand-writing a shader.

**Design/component inspiration sources** (not npm packages — these are galleries of copy-paste React components and design patterns):
- **21st.dev, react bits, kokonut UI, craft UI, dice UI** — community component galleries, mostly React + Tailwind + Framer Motion, oriented around exactly this kind of polished micro-interaction. Treat these as a *style reference*, not a dependency: draw on the patterns they popularize (glassmorphism cards, magnetic buttons, animated borders, marquees, spotlight-follow-cursor effects) and hand-write the equivalent, since Claude generally can't fetch their live source directly.
- **shadcn/ui** — real, installable component primitives (already in the artifact allow-list); pair its structural components with GSAP/CSS for motion.
- If the user says "taste" — read that as a request to raise the aesthetic bar generally (spacing, restraint, one strong idea per section) rather than a specific library; see the Taste section below.

## Core GSAP patterns

Load order matters: GSAP core, then plugins, then register them before use.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>gsap.registerPlugin(ScrollTrigger);</script>
```

**Entrance/stagger reveal** (the single most useful pattern — use for hero text, card grids, list items):
```js
gsap.from(".card", {
  opacity: 0,
  y: 40,
  duration: 0.8,
  stagger: 0.12,
  ease: "power3.out",
  scrollTrigger: { trigger: ".card-grid", start: "top 80%" }
});
```

**Scroll-pinned/scrubbed section** (image or panel that animates as the user scrolls through it):
```js
gsap.to(".pin-target", {
  scrollTrigger: { trigger: ".section", start: "top top", end: "+=1000", scrub: 1, pin: true }
});
```

**Timeline for a coordinated sequence** (hero load-in with multiple elements in order):
```js
const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.7 } });
tl.from(".hero-eyebrow", { opacity: 0, y: 12 })
  .from(".hero-title", { opacity: 0, y: 20 }, "-=0.4")
  .from(".hero-cta", { opacity: 0, scale: 0.9 }, "-=0.3");
```

Notes on quality, not just syntax:
- `power2.out`/`power3.out` reads as natural deceleration — use it as the default ease instead of `linear` or the bouncy eases, which read as cheap unless the brand is playful.
- Stagger values between 0.06–0.15s feel like one coordinated motion; above ~0.25s each element reads as separate and slow.
- Respect `prefers-reduced-motion` — wrap non-essential motion in a media query check, or use GSAP's `matchMedia()`, so the build isn't hostile to users who've asked for less motion.

## Taste: what makes motion feel premium vs. cheap

Libraries don't produce taste by themselves — this is the judgment layer:

- **Motion should support hierarchy, not compete with it.** Animate the thing the user's eye should land on first; don't animate every element with equal intensity.
- **One idea per section.** A hero with a parallax background *and* staggered text *and* a marquee is noise. Pick the one motion idea that section needs.
- **Micro > macro for interaction feedback.** Buttons, cards, and links should have a small, fast (150–250ms) response to hover/press — that's what makes a UI feel "alive" more than any big scroll animation does.
- **Easing over speed.** A slower animation with the right ease reads as more expensive than a fast linear one.
- **Silence is a design choice.** Not every element needs to move — a static, well-typeset section next to an animated one gives the motion somewhere to land.

## When building a full page/artifact

1. Confirm the target environment (table above) before choosing libraries.
2. Check `frontend-design` skill for layout/type/color tokens.
3. Pick one hero motion idea, one scroll-reveal pattern for content sections, and consistent hover/press feedback on interactive elements — don't reach for every technique in this file at once.
4. If the user mentioned a specific inspiration source (e.g. "like 21st.dev"), describe which pattern you're drawing from and build a hand-written equivalent rather than claiming to import it directly.
