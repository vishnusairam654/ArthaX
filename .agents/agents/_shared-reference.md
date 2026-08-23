# Shared Reference — ARTHAX Frontend / Design Agent Cluster

Every agent file in this folder points back here for the skill stack, component allow-list, and
standing rules, rather than repeating them. Read this once; it applies to all seven agents.

## Skill stack

**Foundation — load on every frontend task, no exceptions:**

| Skill | Owns |
|---|---|
| `arthax-design-tokens` | Color palette, typography, per-portal accent mapping |
| `anti-ai-design` | The AI-slop checklist (build mode + audit mode) |
| `arthax-layout-and-motion` | Layout pattern selection, background treatment, motion vocabulary, the asset-request rule |

**Process/craft — situational, but common:**

| Skill | Owns | Load it when |
|---|---|---|
| `material-rounded-smooth` | Corner radius scale, elevation, easing/duration | Any component with shape, shadow, or a CSS transition |
| `gsap-animation-design` | Motion library choice, GSAP/ScrollTrigger patterns, target-environment rules | Any scroll reveal, hero animation, or "make it feel alive" request |
| `frontend-design` | General taste/aesthetic-commitment process | New screens/flows with no existing pattern to extend |
| `build-modern-web-projects` | Discovery → structure → design system → motion → validation sequencing | Entry point for a new page/portal from scratch |

**Content/domain — load for the specific asset system or flow involved:**

| Skill | Owns | Load it when |
|---|---|---|
| `arthax-transaction-states` | The 6 status icons, ledger state-machine mapping, processing/receipt UI | Any transfer, FD, trade, or settlement flow with live status |
| `arthax-shop-gamification` | Avatars, rarity-tiered banners, frames, pet companions | Any Shop portal, profile customization, or inventory/reveal work |
| `arthax-empty-states` | The 6 empty-state illustrations and their screen mapping | Any list/grid screen — check before shipping the empty case |
| `arthax-brand-identity` | Watermarks, currency symbol, 5 bank logos, portal heroes, stock banner/logo pairs, printable documents | Any screen representing a specific bank, portal, stock, or generating a receipt/certificate |
| `arthax-security-ux` | Two-password separation, step-up verification, RBAC rendering, data masking, session handling | Any auth flow, permission-gated control, or sensitive-data display |

## Component library allow-list

| Category | Use | Don't |
|---|---|---|
| Structural components | shadcn/ui (Radix-based) | Building unstyled primitives from scratch when shadcn already has the pattern |
| Motion inspiration / copy-paste patterns | React Bits, Kokonut UI | Importing as live dependencies — hand-adapt to ARTHAX tokens, don't ship their default theme |
| Timeline/scroll animation | GSAP + ScrollTrigger | anime.js as a second animation engine — pick one workhorse |
| 3D/ambient backgrounds | Three.js, Vanta.js | Heavy 3D on data-dense screens (Bank/Stock Portal tables) — reserve for Guide Board/Shop |
| Micro-interaction/page transitions (React) | Framer Motion | Framer Motion and GSAP fighting over the same element — GSAP owns scroll/timeline, Framer Motion owns component enter/exit if used at all |

## Standing rules (paste into AGENTS.md at repo root)

```
ARTHAX Frontend Rules

1. Load arthax-design-tokens, anti-ai-design, and arthax-layout-and-motion before writing any UI
   code. No exceptions.
2. Before laying out any section, state whether it's comparable-repeated-data (cards/list are correct)
   or narrative/hero/single-focus content (cards are the wrong default — use a pattern from
   arthax-layout-and-motion instead).
3. Every hero/portal-landing/major-CTA section needs a deliberate background decision — never a flat
   single-color default.
4. If a design calls for an asset not already in the library (cross-check arthax-brand-identity,
   arthax-shop-gamification, arthax-empty-states, arthax-transaction-states first), STOP and ask for
   it by name, dimensions, and style. Never fabricate a placeholder image URL or silently substitute a
   plain gradient/solid block for a specified photo or illustration.
5. All colors and fonts come from CSS variables defined in arthax-design-tokens. No inline hex, no
   arbitrary Tailwind color classes, no font-family outside Fraunces/Cantarell/Amarante.
6. Amarante is a rare accent font — wordmark and celebratory/reward moments only. Default to Fraunces
   for headings and Cantarell for body/UI. If unsure, use Cantarell.
7. Arth Gold (#A8742A) is a currency signal, not a UI color. Use it for balances, icons, borders, badge
   fills. Never as small body/label text on Warm Ivory or Charcoal — it fails WCAG AA at that size.
8. Radius, elevation, and easing come from material-rounded-smooth. Elevation stays at level 1-2 across
   Bank/Central Bank/User/Stock portals; the Shop portal may go fuller (level 3-4, optional ripple).
9. Vary motion technique by what's being revealed — don't apply the same fade-in-up/stagger to every
   element on every screen. One animation engine per concern.
10. Before marking any screen done, run the anti-ai-design build-mode checklist. Before any demo or
    recruiter-facing view, run audit mode.
11. Each of the six portals gets one leading accent color — no portal should be visually
    indistinguishable from another in a screenshot.
12. Add a --color-loss token (and any other missing semantic color) through the Token & Theming Agent
    before building Stock Portal loss states, transaction-failure UI, or security-failure states.
13. Every interactive component needs loading, empty, error, and disabled states before it's considered
    complete — not just the happy path.
14. Never CSS-hide a permission-gated control (display:none/visibility:hidden) — it must not render at
    all for a role that can't use it. RBAC-render logic must match the underlying permission check.
15. Account numbers and balances render masked by default across User, Bank, and Central Bank Portal,
    with an explicit reveal action — never unmasked on load.
16. The GOV Password and Financial Password fields never share identical visual treatment, and never
    both appear on screen outside account-security settings.
```

## Open items — RESOLVED (see root AGENTS.md "Resolved design decisions")

All formerly-open decisions are now resolved and binding via the root `AGENTS.md`:

- ~~No `--color-loss`/negative-state token~~ → **Resolved: `--color-loss: #B5482E`** (terracotta).
- ~~6 icons vs ~9 transaction states~~ → **Resolved: collapse mapping** — VALIDATING + AUTHORIZED reuse
  `pending.png`; PROCESSING/SETTLING share `processing.png`; CANCELLED uses a `failed.png` variant styling.
- ~~Frame cosmetics have no rarity tier~~ → **Resolved: tiers assigned** — gold.png → Gold; Aurora/Nova → Epic;
  orbit/pluse → Rare; leaf/vertex → Normal.
- ~~Mailbox surface unplaced~~ → **Resolved: User Portal section** at `/mailbox` with unread nav badge.
- The three watermark variants' intended split (official documents vs. background texture) is a
  reasonable-default guess, not confirmed.
- A dedicated shield/lock icon for security-specific states doesn't exist in the current asset library —
  STOP & ASK HUMAN if a design requires it.
- `build-modern-web-projects` references a larger skill library not present in this session
  (`build-awwwards-quality-sites`, `unsplash-asset-images`, others) — confirm those don't conflict with
  rule 4 above before any agent auto-invokes one.
