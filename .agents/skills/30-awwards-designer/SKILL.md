---
name: awwwards-designer
description: >
  Use whenever the goal is a site that could genuinely win Site of the Day on Awwwards, CSSDA, or FWA — not
  just a clean, competent one. Trigger on "make this Awwwards-worthy," "SOTD-caliber," "award-winning site,"
  "feel like [Cuberto/Ueno/Locomotive/Resn/Buck]," "agency-site feel," "portfolio for recruiters," or any
  build/review of Konoha Legacy, The Wander Script, or a portfolio where the bar is award-level craft, not
  conversion or app usability. Also trigger to critique, score, or "jury" a site against Awwwards criteria.
  Do NOT use for conversion-focused marketing pages, dashboards, or internal tools — those want clarity and
  speed, not spectacle. Two modes: BUILD (design/implement toward the 4 weighted judging criteria) and AUDIT
  (score an existing site with a Tell → Evidence → Fix report). Includes a spawnable subagent for
  independent, fresh-eyes jury-style critique.
---

# Awwwards-Caliber Design

## Why this skill exists, and the one fact that changes how you should use it

Everyone's mental model of "Awwwards site" is the same four ingredients: smooth scroll, huge kinetic type,
a custom cursor, grain texture. That mental model is now the problem, not the goal — more on that below.

The actual Awwwards jury scores every submission on four weighted criteria. This is the published rubric,
not a guess:

| Criterion  | Weight | What it actually measures |
|---|---|---|
| **Design** | **40%** | Typographic system, color/palette control, layout and grid sophistication, visual craft and polish |
| **Usability** | **30%** | Navigation clarity, performance, mobile quality, accessibility, whether custom interactions still communicate affordance |
| **Creativity** | **20%** | Originality of concept — a genuine idea tied to the subject, not a stock effect applied to any subject |
| **Content** | **10%** | Real copy (not lorem ipsum), copy quality, content-design integration |

**Design + Usability = 70% of the score. Creativity — the part everyone chases — is only 20%.** Most
submissions that fail don't fail on creativity; they fail because all the budget went into a hero animation
and the site is slow, confusing to navigate, or broken on a mid-tier Android phone. Internalize this before
you internalize anything else in this file: build toward the whole rubric, not toward the reel.

The corollary that matters just as much: because "smooth scroll + huge type + magnetic cursor + grain" is now
the default template for anyone chasing this look, jurors have seen it thousands of times. Stacking all four
at once, with no idea underneath them, reads as generic to an experienced juror the same way a violet gradient
on black reads as generic to anyone who's seen a hundred SaaS landing pages. The technique catalog below
(`references/technique-catalog.md`) flags which moves are still fresh, which are now table stakes, and which
have curdled into cliché — use it to check your own instincts, especially if your first idea is "add grain and
a custom cursor."

## Two modes

- **BUILD mode** — designing or implementing a new site (or a section of one) where the explicit goal is
  award-level craft. Work through the process below before writing code.
- **AUDIT mode** — scoring an existing site or codebase against the four criteria, Tell → Evidence → Fix
  style, the same way you'd review before submitting or before showing it to a recruiter. See
  `references/audit-checklist.md`.

Both modes share the same rubric and the same technique catalog — the difference is whether you're producing
the design or grading one.

---

## BUILD mode

### Step 1: Find the one real idea (this is your Creativity budget — spend it deliberately)

Before any visual work, answer: **what is the one thing about this subject that a generic template couldn't
know?** Award-winning creativity almost never comes from a stock effect (parallax, grain, a 3D blob) applied
to arbitrary content — it comes from a mechanic that only makes sense for *this* subject. A shipping company's
site that lets you drag a container across a map to see freight routes. A type foundry's site where the nav
itself is set in the typeface being sold, live, as you hover. Konoha Legacy's petal system, tied to the actual
in-world material (falling sakura), rather than a generic particle effect bolted onto any hero.

If you can't articulate the one real idea in a sentence, you don't have one yet — don't proceed to visual
craft on top of a borrowed effect. Read `references/technique-catalog.md` here: it's organized so you can
check whether your instinct is still fresh or already a cliché, and it pairs every technique with the kind
of subject it actually serves, precisely so you don't reach for "custom cursor" just because it's the
Awwwards signifier.

### Step 2: Design system pass (this is 40% of the score — do not shortchange it for motion)

Before any animation code, lock:

- **Type system**: a display face with real personality (not the same 3-4 fonts every generator reaches for)
  and a body face that pairs deliberately with it. Set an actual fluid type scale (clamp()-based, not fixed
  breakpoints) and commit to weight/width/spacing choices that carry the page's tone. Jurors read type
  control first — it's the fastest tell of craft versus template.
- **Color**: 4-6 named values with a clear role for each (not "primary/secondary/accent" left vague). If the
  palette is one you'd produce for any brief — near-black with one bright accent, or warm cream with a
  terracotta accent — that's a default, not a choice. Justify every value against the subject.
- **Grid and layout**: does the layout do something the content specifically calls for, or is it a generic
  centered-column-with-cards structure? Asymmetry, unconventional column spans, and off-grid moments read as
  intentional craft *only* when they still resolve into a legible hierarchy — misalignment without a
  legible reason reads as sloppy, not bold.
- **Signature element**: the one visual or interaction detail this page will be remembered by, that embodies
  the Step 1 idea. Everything else in the design system should support this, not compete with it.

### Step 3: Motion and interaction pass (part of Creativity, but also gates Usability)

Choreograph motion around the idea from Step 1, not as decoration layered on top:

- Page-load sequences, scroll-triggered reveals, and hover micro-interactions should each answer "what does
  this teach the user or reveal about the subject?" — if the honest answer is "nothing, it just looks nice,"
  cut it or replace it with something that does.
- Every custom interaction still needs to communicate itself. A custom cursor still needs to change state
  over clickable elements. A magnetic button still needs to look like a button before it's touched. Awwwards
  jurors specifically penalize creative interactions that leave users unsure what's interactive — that's a
  Usability deduction, not just a nitpick.
- Respect `prefers-reduced-motion` for every non-essential animation. This is checked, and shipping without
  it is an easy, unforced Usability loss.
- Reference `references/technique-catalog.md` for implementation notes (libraries, performance budget, and
  the accessibility caveat) on: smooth scroll, scroll-driven pinning/storytelling, page transitions, split-text
  reveals, magnetic elements, custom cursors, WebGL/shader hero moments, kinetic type, grain/noise, marquees,
  and preloaders.

### Step 4: Usability pass (30% of the score — treat this as non-negotiable, not a final checklist)

Do this explicitly, not as an afterthought after the motion work is done:

- **Navigation**: can a first-time visitor find the primary action within a few seconds, even inside an
  unconventional layout? Unconventional navigation is fine; navigation that requires guessing is not.
- **Performance**: heavy WebGL/particle/video work needs a real performance budget — lazy-load below-fold
  3D scenes, compress and lazy-load imagery, and measure actual load time, not just "it feels smooth on my
  machine." Awwwards explicitly scores performance as part of usability, not as a separate technical bonus.
- **Mobile**: award-winning desktop experiences frequently degrade on mobile because the signature interaction
  doesn't translate. Design the mobile version as its own pass — a simplified but still intentional
  experience — rather than letting a desktop-first build fall back to unstyled defaults on small screens.
- **Accessibility basics**: semantic structure, focus states, alt text, sufficient contrast even inside a
  moody dark palette, keyboard reachability for custom interactive elements. These are usually invisible to
  a casual glance but are exactly what an experienced juror checks for.

### Step 5: Content pass (10% — lowest weight, but a hard floor)

Real copy, not lorem ipsum — jurors treat placeholder text as a signal the project isn't finished. Copy
should read as considered and specific to the subject, not generic marketing language. This is the smallest
slice of the score, so don't over-invest here at the expense of Steps 2-4, but shipping without it is an easy
way to lose points for free.

### Step 6: Self-score before calling it done

Score your own build 0-10 on each criterion, weight it (0.4 / 0.3 / 0.2 / 0.1), and sum. If Design or
Usability is below 7, that's the higher-leverage place to keep working — not another pass on the hero
animation. See `references/judging-rubric.md` for what a juror is actually checking inside each 0-10 score,
and `references/audit-checklist.md` for the full scoring worksheet.

---

## AUDIT mode

Use this to review an existing site (Ram's own project, or a reference site) the way a jury would, before it
ships or gets shown to a recruiter.

1. **Score each criterion 0-10** using the detailed breakdown in `references/judging-rubric.md` — don't just
   eyeball an overall impression, work through each criterion's sub-checks.
2. **Compute the weighted total**: `(Design × 0.4) + (Usability × 0.3) + (Creativity × 0.2) + (Content × 0.1)`.
   Published reference points: Awwwards' own Honorable Mention threshold is 6.5+; recent Site of the Day
   scores have been reported in roughly the 7.4-8.6 range (this second figure is an observed pattern from
   published winners, not an official published threshold — treat it as a rough calibration point, not a
   guarantee).
3. **Report Tell → Evidence → Fix** for every finding, not just a verdict. A tell without a fix wastes the
   audit. Follow the format and severity model in `references/audit-checklist.md`.
4. **Check for cliché convergence**: if the site stacks several now-common Awwwards signifiers (smooth scroll
   library, grain overlay, magnetic buttons, oversized kinetic type, custom cursor) with no distinguishing
   idea underneath, flag that explicitly — it's a Creativity deduction even though each individual technique
   is legitimate in isolation. This is the same "any one thing is fine, five things from the same family is
   a tell" logic that applies to generic SaaS-template detection, applied to the Awwwards-template family
   instead.
5. **Weight your fix recommendations by score impact.** A Usability fix (30% weight) that takes an hour
   almost always beats a Creativity flourish (20% weight) that takes a day. Say so explicitly when you
   recommend next steps — don't just list findings in the order you noticed them.

For an independent, fresh-eyes version of this review — useful because whoever built the site is too close to
judge it fairly — spawn the subagent in `agents/awwwards-critic.md` via the Task tool rather than doing the
audit yourself in the same context you built it in.

---

## Reference files

- `references/judging-rubric.md` — juror-level detail on what each of the four criteria actually checks,
  with the sub-questions a real jury member works through. Read this before scoring anything in AUDIT mode,
  and before Step 6 of BUILD mode.
- `references/technique-catalog.md` — inventory of ~15 signature Awwwards-era techniques (smooth scroll,
  WebGL hero moments, custom cursors, split-text reveals, scroll-pinning, magnetic elements, grain/noise,
  kinetic type, page transitions, preloaders, marquees, and more), each with what it's for, when it's still
  fresh versus cliché, a lightweight implementation approach, and the performance/accessibility caveat.
  Consult this in Step 1 and Step 3 of BUILD mode, and when flagging cliché convergence in AUDIT mode.
- `references/audit-checklist.md` — the full scoring worksheet, Tell → Evidence → Fix format, and severity
  model for AUDIT mode.
- `agents/awwwards-critic.md` — instructions for a spawnable subagent that performs an independent jury-style
  critique of a site or codebase, for use with Claude Code's Task tool.


---

# awwwards-critic.md

---
name: awwwards-critic
description: >
  Independent, fresh-eyes jury-style critique of a website against Awwwards judging criteria (Design 40%,
  Usability 30%, Creativity 20%, Content 10%). Use this subagent specifically when the person building the
  site is too close to it to judge it fairly — spawn it in a separate context so it has no memory of design
  decisions or rationale from the build conversation, the same way a real jury has never seen the brief.
  Give it a URL or a local path to the built site/codebase.
tools: Read, Grep, Glob, Bash, WebFetch
model: sonnet
---

# Awwwards Critic

You are one juror on an Awwwards-style panel, reviewing a website you have never seen before and have no
context on beyond what's in front of you. You do not know why any decision was made, what the deadline was,
or what the person hoped you'd say. Score it the way an actual juror would score a cold submission.

## Setup

Before scoring anything, read the three reference files bundled with this skill:

- `../references/judging-rubric.md` — the detailed sub-questions behind each of the four criteria
- `../references/technique-catalog.md` — the technique inventory and cliché-risk assessment
- `../references/audit-checklist.md` — the evidence-gathering steps, scoring math, and report format

If you were given a URL, use `WebFetch` to load the live page and, where possible, view its rendered content;
if you were given a local path, use `Read`/`Glob`/`Grep` to inspect the codebase directly — check for
component/section structure, animation libraries in use, alt text and semantic markup, and any
`prefers-reduced-motion` handling.

## What to do

1. **Gather evidence first, per `audit-checklist.md` Step 1.** Don't score from a skim. If you have browser
   access, actually try the primary flow and resize to a mobile viewport. If you're reading code, actually
   check for the specific things listed there (WebGL context count, alt text, focus styles, reduced-motion
   handling) rather than assuming.
2. **Score all four criteria 0-10**, using the sub-questions in `judging-rubric.md`, and write one to two
   sentences of justification per score before moving on — don't let everything default to a flat "pretty
   good, 7."
3. **Compute the weighted total** and compare against the calibration points in `judging-rubric.md` (6.5+
   Honorable Mention is the official threshold; ~7.4-8.6 is the observed recent Site of the Day range).
4. **Run the convergence check** from `technique-catalog.md`'s closing section: count how many high-
   cliché-risk techniques are stacked together with no stated underlying idea, and report it as an explicit
   Creativity finding if the pattern is present.
5. **Write every finding as Tell → Evidence → Fix**, per `audit-checklist.md` Step 4. No finding without a
   concrete fix.
6. **Rank your top 3-5 recommended fixes by score impact** (weight × plausible score movement), not by the
   order you noticed them.

## Output format

Return exactly this structure:

```markdown
# Jury Review: [site name or URL]

## Scores
| Criterion | Score /10 | Weighted | Justification |
|---|---|---|---|
| Design (40%) | | | |
| Usability (30%) | | | |
| Creativity (20%) | | | |
| Content (10%) | | | |
| **Total** | | **/10** | |

**Tier**: [Below recognition threshold / Honorable Mention range / Site of the Day range]

## Convergence check
[Present / not present, with the specific techniques stacked if present]

## Top strengths
- [1-3 genuine strengths, specific, not generic praise]

## Findings (ranked by score impact)
### 1. [Finding title] — [criterion, severity: Blocking/Score-moving/Polish]
**Tell**: ...
**Evidence**: ...
**Fix**: ...

[repeat for remaining findings]

## Bottom line
[2-3 sentences: is this ready to submit/ship, and what's the single highest-leverage next step]
```

## Guardrails

- You are not the person who built this site, and you should write as if you have no stake in defending any
  decision in it. Do not soften a low score because the underlying idea is interesting — an interesting idea
  with poor execution still scores on execution.
- Do not recommend adding more techniques from the catalog as a fix for a low Creativity score. If the
  finding is "no real idea underneath the effects," the fix is identifying that idea, not layering on a
  sixth effect.
- Do not let a strong Design score pull your Usability score up by association — score them independently,
  they measure different things.
- If you cannot access the live site or the code (network/permission issue), say so plainly and score only
  what you can actually verify, flagging every criterion you had to estimate rather than observe.


---

# audit-checklist.md

# Audit Checklist and Report Format

Use this worksheet in AUDIT mode (SKILL.md) and inside the `awwwards-critic` subagent. The goal is a report
someone can act on directly — a score with no fix is a diagnosis, not an audit.

## Step 1: Gather evidence before scoring

Don't score from a first impression. Actually check:

- **View the live site or run the build locally** if you have computer/browser access. Click through the
  primary flow, not just the hero.
- **Resize to a mobile viewport** (or check on a real device) — a huge share of Usability deductions only
  show up here.
- **Check `prefers-reduced-motion` behavior** — toggle it in devtools/OS settings and reload; if nothing
  changes, that's a specific, citable finding.
- **Read the actual copy** on every screen, not just the hero — placeholder or generic text elsewhere is as
  much a Content deduction as it is in the hero.
- **Count the techniques from `technique-catalog.md`** present on the page, and note which are load-bearing
  to an idea versus decorative.
- **If reviewing code directly**, check for: multiple WebGL contexts stacked unnecessarily, missing
  `alt` text, missing focus styles, unthrottled scroll/mousemove listeners, and whether animations tie to a
  `matchMedia('(prefers-reduced-motion: reduce)')` check anywhere in the codebase.

## Step 2: Score each criterion 0-10

Use the sub-questions in `judging-rubric.md`. Write down the score and the one or two sentences that justify
it before moving to the next criterion — this prevents the common failure of scoring everything a flat 7
because nothing stood out either way.

## Step 3: Compute the weighted total

`Total = (Design × 0.4) + (Usability × 0.3) + (Creativity × 0.2) + (Content × 0.1)`

Report the per-criterion breakdown alongside the total, always — the total alone hides which criterion needs
the next hour of work.

## Step 4: Write findings as Tell → Evidence → Fix

For every finding, structure it in three parts:

- **Tell**: the specific, nameable issue (not "the design feels generic" — name what's generic about it).
- **Evidence**: what you actually observed that supports it (a specific screen, a specific interaction, a
  specific measurement if you have one).
- **Fix**: a concrete next action, not just "improve this." If the fix is "reduce grain/cursor/marquee
  convergence," say which techniques to drop or which idea should replace them, referencing
  `technique-catalog.md` where relevant.

Example:

> **Tell**: Custom cursor doesn't change state over any interactive element.
> **Evidence**: Cursor remains a plain 12px dot when hovering the primary CTA, nav links, and project cards
> alike — no size, color, or label change anywhere in the flow.
> **Fix**: Add a `:hover` state on the cursor element scoped to `a, button, [role="button"]` that grows the
> dot and/or shows a short label ("View," "Open"). This is a direct, low-effort Usability fix — the cursor
> stays, it just needs to start communicating again.

## Step 5: Rank fixes by score impact, not by discovery order

A one-line Usability fix (30% weight) generally outranks a half-day Creativity addition (20% weight) in terms
of score-per-effort. Present the top 3-5 fixes ordered by (criterion weight × how much the fix would plausibly
move that criterion's score), not in the order you happened to notice them while reviewing.

## Severity model

Use this to triage when there are many findings:

- **Blocking**: breaks core navigation, breaks on mobile entirely, autoplays audio, or has no reduced-motion
  fallback for a core animation. Fix before anything else.
- **Score-moving**: a specific, citable gap against one of the rubric sub-questions (missing alt text,
  placeholder copy, an unstated idea behind the hero effect). Most findings land here.
- **Polish**: valid but marginal — would move a score by a few tenths of a point at most (a slightly
  inconsistent transition easing, a spacing inconsistency in a rarely-seen state).

Report Blocking and Score-moving findings in full detail. Group Polish findings into a short list rather than
writing a full Tell/Evidence/Fix for each — spending equal words on a missing `alt` tag and a fully broken
mobile nav buries the finding that actually matters.

## Convergence flag (Creativity deduction, not a separate criterion)

If the audit surfaces five or more techniques from `technique-catalog.md`'s "high cliché risk" list (custom
cursor, smooth scroll, split-text hero, magnetic buttons, grain) stacked together with no stated idea tying
them to the subject, report this as its own finding under Creativity, explicitly — this is a distinct,
nameable deduction ("stacks the standard Awwwards-template signifiers with no underlying concept"), not just
a vague "feels generic."

## What NOT to do in an audit

- Don't score everything a flat number because the site is "fine overall" — the whole point of per-criterion
  scoring is to surface where the fine average is hiding an actual weak spot.
- Don't recommend adding more techniques from the catalog as a fix for a low Creativity score — the fix for
  "no real idea" is finding the idea (SKILL.md Step 1), not adding a sixth effect.
- Don't let a strong Design score excuse skipping the Usability checks — they're scored independently and
  weighted almost as heavily (30% vs 40%).


---

# judging-rubric.md

# Judging Rubric: What Each Criterion Actually Checks

This is the detail layer behind the four-criteria table in SKILL.md. Use it to score a build (AUDIT mode)
or to self-check before shipping (BUILD mode Step 6). Each criterion below is scored 0-10; multiply by its
weight and sum for the total.

Source note: the four criteria and their weights (Design 40%, Usability 30%, Creativity 20%, Content 10%)
are Awwwards' own published evaluation system. The sub-questions under each criterion are a synthesis of
how experienced jurors and winning studios describe what they're actually checking — treat the weights as
fact and the sub-questions as a reliable working model, not a verbatim published checklist.

---

## Design — 40%

This is not "does it look nice." It's craft and control, specifically:

- **Typographic system**: Is there an actual type scale with intentional weights and spacing, or did the
  hierarchy happen by accident (bigger = more important, nothing else considered)? Do the display and body
  faces feel chosen for this project, or are they the same 3-4 fonts every AI-generated site reaches for?
- **Color discipline**: Are the palette values named and role-assigned (not just "looks good together"), and
  do they hold up across every state — hover, focus, disabled, error, dark/light if both exist?
- **Layout and grid**: Does the layout have a coherent underlying grid even where it breaks that grid for
  effect? Intentional asymmetry reads as craft; unexplained misalignment reads as sloppiness.
- **Imagery and asset treatment**: Are images/video treated consistently (crop ratios, color grading,
  compression quality) or does each asset look like it arrived from a different source with no unifying pass?
- **Consistency across the whole surface**: Does the polish extend to every screen and every state (empty,
  loading, error, 404), or does it fall off outside the hero and the two screens shown in the pitch?

Score low (0-4) if the site looks like a template with a new color applied. Score high (8-10) if you could
identify the studio or subject from the type and color choices alone, with no logo visible.

## Usability — 30%

The most commonly underweighted criterion by people chasing "Awwwards style." Sub-checks:

- **Navigation clarity**: Can a first-time visitor find the primary action or destination within a few
  seconds? This must hold even with unconventional nav patterns (horizontal scroll, hidden menus, custom
  cursors) — creative navigation that requires trial-and-error to understand is a deduction here, not a
  Creativity bonus.
- **Performance / Core Web Vitals**: Load time, time-to-interactive, and smoothness of scroll/animation on
  a mid-tier device, not just the developer's machine. Heavy WebGL or particle work with no lazy-loading or
  budget is a direct usability cost, not a separate "technical" bonus category.
- **Mobile quality**: Awwwards evaluates mobile experience as part of usability (and has a separate Mobile
  Excellence recognition). A desktop-first build that degrades to unstyled defaults on mobile scores low here
  regardless of desktop polish.
- **Accessibility basics**: Semantic HTML, focus states, alt text, sufficient contrast, keyboard reachability
  of custom interactive elements, and `prefers-reduced-motion` support for non-essential animation.
- **Affordance inside custom interactions**: Does a custom cursor still signal "this is clickable"? Does a
  magnetic button still look like a button before it's touched? Novel interaction patterns need to still
  communicate themselves without a tutorial.

Score low (0-4) if the site is slow, confusing to navigate, or breaks on mobile — regardless of how good the
hero animation is. Score high (8-10) if the experience is fast, clear, and accessible even while doing
something unconventional.

## Creativity — 20%

The smallest of the three "craft" criteria, and the one most often mistaken for the whole competition.

- **Originality of concept**: Is there a genuine idea specific to this subject, or is this a stock effect
  (parallax hero, 3D blob, particle field) that could be swapped onto any other brief with the same visual
  result? The test: could you describe the "one real idea" in a single sentence, and does that sentence
  reference the actual subject matter?
- **Risk that serves the user**: Judges reward bold choices, but only when the risk still serves
  comprehension or delight rather than working against it. A disorienting interaction that doesn't teach the
  user anything about the subject is risk without payoff.
- **Freshness relative to the current Awwwards vocabulary**: Smooth scroll, grain overlays, magnetic buttons,
  and custom cursors were creative signals five years ago; today they're common enough that stacking several
  at once with no underlying idea reads as derivative rather than bold. See `technique-catalog.md` for a
  working list of what's still fresh versus now-standard.

Score low (0-4) if the "creative" element is an off-the-shelf effect applied without regard to subject.
Score high (8-10) if the mechanic could only make sense for this specific subject and a visitor would
remember it specifically (not just "that site had cool animations").

## Content — 10%

Lowest weight, but treated as a hard floor by jurors — a site that fails here signals an unfinished
submission regardless of how polished everything else is.

- **Real content, not placeholder**: Lorem ipsum, "Company Name," or obviously fake testimonials at
  submission time is treated as a sign the project wasn't finished.
- **Copy quality**: Is the writing specific and purposeful, or generic marketing language that could belong
  to any company in the category?
- **Content-design integration**: Does the copy feel like it was written for these exact layout slots, or
  does it feel pasted into a template built for different, longer or shorter, text?
- **Localization quality** (if applicable): Machine-translated copy is obvious to multilingual reviewers and
  reads as a red flag on an otherwise polished submission.

---

## Putting it together

`Total = (Design × 0.4) + (Usability × 0.3) + (Creativity × 0.2) + (Content × 0.1)`, each criterion scored
0-10, giving a total out of 10.

Rough calibration points (the first is Awwwards' own published threshold; the second is an observed pattern
from recent published winners, not an official cutoff — state this distinction when quoting it):

| Total score | Tier |
|---|---|
| 6.5+ | Honorable Mention (official published threshold) |
| ~7.4-8.6 | Typical recent Site of the Day range (observed, not officially published) |
| Below 6.5 | Not yet at recognition level on any platform |

When self-scoring or auditing, always show the per-criterion breakdown, not just the total — a 7.8 total
made of Design 9 / Usability 4 / Creativity 9 / Content 8 has a completely different fix priority than a 7.8
made of even 7-8s across the board, even though the totals are close.


---

# technique-catalog.md

# Technique Catalog

Fifteen techniques that recur across Awwwards/FWA/CSSDA winners. For each: what it does, when it still reads
as fresh versus when it's now a cliché, a lightweight implementation approach, and the performance or
accessibility caveat you must handle or lose Usability points for the win you just made on Creativity.

**How to use this list**: it's not a menu to pick five items from. Pick the ones that serve the Step 1 idea
from SKILL.md (the one real thing about this subject) and skip the rest. The "cliché risk" column exists so
you notice when you're reaching for a technique because it signals "Awwwards" rather than because it serves
this specific subject.

---

### 1. Custom cursor
**What**: Replace the system cursor with a styled element that reacts to context (grows over links, shows
a label, follows with lag/spring physics).
**Cliché risk: high.** A plain dot-that-grows-on-hover with no other idea is now the single most common
"this is an Awwwards site" signifier — jurors have seen it thousands of times.
**Still fresh when**: the cursor itself carries subject-specific information (shows the next project's name,
becomes a magnifying glass over an image, changes into a drag handle only where dragging is possible).
**Implementation**: track pointer position in a `mousemove` listener, position a fixed-position element with
`transform: translate3d()` (never `top`/`left`, for performance), add spring easing via a small physics loop
or a library like `Popmotion`/`GSAP`'s `quickTo`.
**Caveat**: must be disabled entirely on touch devices (no persistent pointer), and the underlying element
still needs a real `:hover`/`:focus` state for keyboard and screen-reader users — the custom cursor is a
visual enhancement, never the only affordance.

### 2. Smooth scroll (Lenis, Locomotive Scroll, or native)
**What**: Replaces native scroll with an eased, momentum-based scroll for a more "cinematic" feel.
**Cliché risk: medium-high** on its own; it's table stakes now, not a differentiator, but its absence is
rarely noticed while its mishandling (janky, fights native scroll gestures) is.
**Still fresh when**: paired with scroll-driven storytelling (see #3) where the easing is doing narrative
work, not just adding drag to an otherwise ordinary page.
**Implementation**: `Lenis` is the current lightweight standard; wire its `scroll` event into GSAP's
`ScrollTrigger` for synced animation. Avoid re-implementing this from scratch — the edge cases (nested
scroll containers, iOS momentum conflicts) are already solved.
**Caveat**: breaks native scroll-to-anchor, browser find-on-page scroll position, and screen reader scroll
behavior if not configured carefully. Always provide a `prefers-reduced-motion` fallback to native scroll.

### 3. Scroll-driven storytelling / pinning
**What**: Pin a section in the viewport while scroll progress drives an animation sequence (a product
rotating, a story unfolding panel by panel, a data visualization building up).
**Cliché risk: low**, when the sequence actually reveals information — this is one of the more durable
techniques because it's inherently tied to content rather than decoration.
**Still fresh when**: the scroll progress maps to something meaningful (chronology, a process, a build-up)
rather than an arbitrary parallax drift.
**Implementation**: GSAP `ScrollTrigger` with `pin: true` and a `scrub` value tied to a timeline; for 3D
work, drive a Three.js/R3F camera or object property from the same scroll progress value.
**Caveat**: pinned sections must have an explicit fallback height calculation or they break on resize/
orientation change; test on real mobile devices where viewport height changes as the browser chrome hides.

### 4. WebGL / shader hero moments (Three.js, R3F, raw GLSL)
**What**: A 3D scene, shader-driven background, or particle system as the page's centerpiece.
**Cliché risk: medium.** Generic "floating 3D blob with a gradient" scenes are now common enough to read as
default; a scene built from the subject's actual geometry or material reads as intentional.
**Still fresh when**: the 3D content is native to the subject (Konoha Legacy's petals being built from the
actual in-world material rather than a stock particle library is the right instinct) or when it responds
meaningfully to user input rather than looping ambiently.
**Implementation**: for particle systems, instanced/billboarded planes are far cheaper than individual
meshes — build inside a single shared WebGL context rather than layering a second canvas library (Vanta,
tsParticles) on top of an existing Three.js/R3F scene; multiple WebGL contexts on one page is a common,
avoidable performance mistake.
**Caveat**: budget a fallback (static image or simplified CSS animation) for devices without WebGL2 or with
`prefers-reduced-motion`, and lazy-init the scene until it's near-viewport rather than on initial page load.

### 5. Split-text / character reveal
**What**: Text splits into characters, words, or lines that animate in individually (stagger fade-up, mask
reveal, etc.) on load or scroll.
**Cliché risk: high** as a default hero treatment — it's become the "this is a creative agency site"
shorthand almost as much as the custom cursor.
**Still fresh when**: the reveal pattern itself encodes meaning (letters assembling in reading order for a
manuscript-themed site, or scattering/reforming for a chaos-to-order narrative) rather than being applied
uniformly to every heading on the page regardless of content.
**Implementation**: `SplitType` or GSAP's `SplitText` plugin to split DOM text into spans, then stagger with
GSAP timelines.
**Caveat**: splitting text breaks native text selection and can break screen readers reading the text as
individual characters instead of words — always re-set `aria-label` on the container to the full original
string, and restore selectable, unsplit text after the animation completes if feasible.

### 6. Magnetic elements
**What**: Buttons or interactive elements that visually "pull" toward the cursor as it approaches.
**Cliché risk: high** as a bare hover effect with no other purpose; it's a strong "template" tell when
applied to every button on the page uniformly.
**Still fresh when**: reserved for one or two genuinely primary actions rather than every clickable element,
so it reads as emphasis rather than a global stylistic tic.
**Implementation**: track distance from cursor to element center, apply a capped `transform: translate()`
proportional to proximity with spring easing (GSAP `quickTo` again, or a small custom RAF loop).
**Caveat**: must not fire on touch devices, and the element's actual click target should not shrink or
become harder to hit as a side effect of the transform.

### 7. Grain / noise overlays
**What**: A subtle film-grain or noise texture layered over flat color areas to add tactility.
**Cliché risk: very high.** This is currently one of the fastest ways to signal "generic Awwwards-adjacent
template" — it's cheap to add and has been added everywhere as a result.
**Still fresh when**: it's not present at all, or when it's doing specific tonal work tied to the subject
(a genuinely analog/print-inspired brand) rather than applied as a default finishing touch to any dark
palette.
**Implementation**: a single tiled PNG/SVG noise texture with low opacity via `mix-blend-mode`, or a tiny
fragment shader for animated grain.
**Caveat**: none functionally significant, but treat its presence as a flag to double-check the rest of the
palette isn't also converging on the generic dark-plus-single-accent look.

### 8. Kinetic / oversized typography
**What**: Very large display type, often animated (marquee-scrolling, scaling with scroll, or with variable
font weight/width tied to interaction).
**Cliché risk: high** as a bare hero treatment on its own; medium when it's doing real information work.
**Still fresh when**: variable font axes are tied to something meaningful (scroll velocity, cursor
proximity, data values) rather than being a static oversized headline with a fade-in.
**Implementation**: `clamp()`-based fluid type sizing for the static case; for animated weight/width, use a
true variable font and animate the `font-variation-settings` custom properties directly (cheaper than
swapping font files).
**Caveat**: extremely large type at small viewport widths needs its own scale, not a naive linear
`clamp()` down to mobile — test the actual reading experience on a phone, not just that it doesn't overflow.

### 9. Page transitions (view transitions, Barba.js-style)
**What**: A custom animated transition between pages/routes instead of a hard reload or default SPA swap.
**Cliché risk: medium.** A generic fade/wipe is now expected rather than remarkable; a transition that
carries shared visual elements between pages (a shared-element/morph transition) still reads as craft.
**Still fresh when**: an element persists visually across the transition (an image, a title) rather than the
whole viewport simply fading to black and back.
**Implementation**: the native View Transitions API where browser support allows, with a JS-driven
(Barba.js, or hand-rolled) fallback for broader support; for SPA frameworks, coordinate exit/enter animations
through the router's lifecycle rather than faking it with CSS alone.
**Caveat**: must not break the browser back button, must not trap users if a transition fails partway
(always have a timeout that forces navigation through), and needs a reduced-motion fallback to an instant
transition.

### 10. Preloaders / intro sequences
**What**: A branded loading sequence (percentage counter, logo animation, or narrative intro) shown before
the main content is revealed.
**Cliché risk: medium-high**, especially a bare percentage-counter-then-wipe with no other content.
**Still fresh when**: it's doing real work (actually gating on asset load, or setting up the narrative for
what follows) rather than being an artificial delay added purely for ceremony.
**Implementation**: tie the preloader's progress genuinely to asset loading (image/font/3D-asset promises)
rather than a fixed timer, so slow connections see accurate progress instead of a lie.
**Caveat**: never force a preloader delay on repeat visits or on fast connections — check for a cached-asset
short-circuit, and always provide a skip mechanism. An artificial delay is a direct, self-inflicted Usability
score loss.

### 11. Marquee / ticker elements
**What**: Continuously scrolling horizontal text or logo strips.
**Cliché risk: medium.** Fine as a supporting element (client logos, a tag list); a cliché when used as a
primary hero device with no other content.
**Implementation**: CSS `@keyframes` translateX loop for simple cases; GSAP for velocity tied to scroll
speed for more dynamic marquees.
**Caveat**: pause on hover/focus so the content is actually readable, and respect `prefers-reduced-motion`
by freezing to a static state rather than an instant jump.

### 12. Asymmetric / off-grid layout
**What**: Deliberately broken grid alignment, overlapping elements, or unconventional column spans.
**Cliché risk: low**, because it's genuinely harder to execute well than the effects above, which keeps
volume down — but a common failure mode is asymmetry with no underlying logic, which reads as sloppy rather
than bold.
**Still fresh when**: there's a legible underlying grid the design breaks intentionally and consistently,
so the "break" reads as a rule rather than randomness.
**Implementation**: CSS Grid with explicit named lines/areas even for the "broken" layout, so the
irregularity is authored precisely rather than approximated with manual offsets.
**Caveat**: test at every breakpoint — asymmetric desktop layouts frequently have no real mobile equivalent
and collapse into an unstyled mess rather than a redesigned, still-intentional mobile layout.

### 13. Sound design
**What**: Ambient audio, interaction sound effects, or a toggleable soundtrack.
**Cliché risk: low** (rare because it's genuinely risky), but execution risk is high.
**Still fresh when**: used sparingly and skippable, tied to a subject where sound is native to the content
(music, film, audio product) rather than bolted onto an unrelated brief.
**Implementation**: Web Audio API or a lightweight library (Howler.js), always defaulting to muted with an
explicit, visible opt-in — never autoplay with sound.
**Caveat**: autoplaying audio is one of the fastest ways to lose a visitor entirely, and is broadly blocked
by browsers by default regardless of design intent.

### 14. Easter eggs
**What**: Hidden interactions (konami-code style triggers, console messages, secret pages) that reward
curious users without being part of the primary flow.
**Cliché risk: low**, precisely because most sites skip them entirely.
**Still fresh when**: tied to the subject's personality rather than a generic "you found it!" message.
**Implementation**: keep genuinely optional and non-blocking — an easter egg must never sit on the critical
path to a primary action.
**Caveat**: never let an easter egg degrade the base experience for users who don't find it (extra unused
JS is fine; extra unused layout shift or blocking scripts are not).

### 15. Custom scrollbar / progress indicators
**What**: A styled scroll progress bar or custom scrollbar replacing the OS default.
**Cliché risk: medium.** A thin top-of-page progress bar is now common enough to be neutral rather than a
differentiator; a fully custom scrollbar track/thumb is higher effort and lower frequency.
**Implementation**: CSS `scrollbar-color`/`::-webkit-scrollbar` for light custom styling; a `scroll` event
listener driving a separate progress element for a progress-bar pattern.
**Caveat**: a fully hidden or fully custom scrollbar removes a familiar wayfinding cue — make sure page
length and position are still communicable some other way (a section counter, a mini-map nav) if you remove
the standard scrollbar entirely.

---

## The convergence check

None of the above is disqualifying on its own. The disqualifying pattern is **five or more of these,
especially #1, #2, #5, #6, and #7 together, with no idea from Step 1 of SKILL.md underneath them.** That
specific combination (custom cursor + smooth scroll + split-text hero + magnetic buttons + grain) is common
enough now to be its own recognizable "template," the same way dark-mode-plus-violet-gradient is a
recognizable SaaS template. Run this check explicitly in AUDIT mode, and check your own instincts against it
in BUILD mode Step 1 before committing to a technique list.

