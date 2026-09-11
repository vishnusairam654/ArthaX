# ARTHAX — Agent & Skill Rules

This file binds all work in this repository. Source documents:
[ARTHAX_PROJECT_CONTEXT.md](./ARTHAX_PROJECT_CONTEXT.md),
[phases.md](./phases.md), and
`.agents/agents/_shared-reference.md`.

## Frontend rules

1. Load `arthax-design-tokens`, `anti-ai-design`, and `arthax-layout-and-motion` before writing any UI code. No exceptions.
2. Before laying out any section, state whether it's comparable-repeated-data (cards/lists are correct) or narrative/hero/single-focus content (cards are the wrong default).
3. Every hero/portal-landing/major-CTA section needs a deliberate background decision — never a flat single-color default.
4. If a design calls for an asset not already in [`assets/`](./assets) (cross-check `arthax-brand-identity`, `arthax-shop-gamification`, `arthax-empty-states`, `arthax-transaction-states` first), STOP and ask for it by name, dimensions, and style. Never fabricate a placeholder image or silently substitute a gradient/solid block.
5. All colors and fonts come from CSS variables defined by `arthax-design-tokens` (mirrored in `@arthax/tokens`). No inline hex, no arbitrary Tailwind color classes, no font-family outside Fraunces/Cantarell/Amarante.
6. Amarante is a rare accent font — wordmark and celebratory/reward moments only. Default to Fraunces for headings, Cantarell for body/UI.
7. Arth Gold (`#A8742A`) is a currency signal, not a UI color — balances, icons, borders, badge fills only. Never small body text on Warm Ivory/Charcoal (fails WCAG AA).
8. Radius, elevation, easing come from `material-rounded-smooth`. Elevation stays level 1–2 across Bank/Central Bank/User/Stock portals; Shop may go level 3–4.
9. Vary motion technique by what's being revealed — one animation engine per concern (GSAP owns scroll/timeline).
10. Run the `anti-ai-design` build-mode checklist before marking any screen done; audit mode before any demo.
11. Each portal has one leading accent color — portals must be distinguishable in a single screenshot.
12. Semantic colors are added through tokens only. Resolved: **`--color-loss: #B5482E`** (terracotta) for loss/failure/security-failure states.
13. Every interactive component ships loading, empty, error, and disabled states — not just the happy path.
14. Never CSS-hide a permission-gated control — it must not render into the DOM for roles that can't use it, gated by the same check as the underlying API action.
15. Account numbers and balances render masked by default with an explicit click-to-reveal — never unmasked on load.
16. GOV Password and Financial Password fields never share identical visual treatment and never both appear on screen outside account-security settings.
17. Financial Password inputs use `autocomplete="off"` and their values are never logged.

## Architecture invariants (backend)

- One currency (**ARTH**, integer minor units) everywhere. No secondary currencies or shop points.
- Single double-entry ledger: every journal entry satisfies Σ debits = Σ credits.
- `1 Email → 1 GOV ID → 1 ARTHAX User → Many Bank Accounts`. One unified session across all 6 portals.
- Dual-password isolation is enforced server-side (login accepts only GOV password; money actions require step-up Financial Password verification).

## Resolved design decisions

| Decision | Resolution |
|---|---|
| Loss/negative color token | `--color-loss: #B5482E` (terracotta red family) |
| Transaction-state icon mapping (9 states, 6 icons) | VALIDATING + AUTHORIZED → `pending.png`; PROCESSING + SETTLING → `processing.png`; FINALYZING → `finalyzing.png`; COMPLETED / FAILED / REVERSED → own icons; CANCELLED → `failed.png` variant styling |
| Avatar frame rarity tiers | `gold.png` → Gold; `Aurora.png`, `Nova.png` → Epic; `orbit.png`, `pluse.png` → Rare; `leaf.png`, `vertex.png` → Normal |
| Mailbox location | Section of the User Portal at `/mailbox` with unread badge in User Portal nav |

## Known missing assets (do not fabricate)

- Security shield/lock icon (security-specific states)
- Notification icon coverage beyond the 6 existing ones, if new categories appear
- Any asset referenced but absent from `assets/` — STOP & ASK HUMAN
