---
name: arthax-security-ux
description: >
  Owns frontend security and trust patterns — the GOV Password / Financial Password separation and
  step-up verification, RBAC-aware rendering (not just CSS-hiding), masking of sensitive data (account
  numbers, balances), secure form hygiene, and session/idle handling. Use whenever building login,
  step-up verification, any RBAC-gated control, account/balance display, or session-timeout UI. This is
  frontend UX for security, not the actual auth/encryption implementation — that's backend scope.
---

# ARTHAX Security & Trust UX

## The two-password system needs two visibly different fields

The report separates a **GOV Password** (identity) from a **Financial Password** (money actions). If
both render as identical password inputs with the same label style, users will build the wrong muscle
memory and the separation stops meaning anything in practice.

- Give them genuinely distinct visual treatment — different icon (identity vs. a lock/shield for
  financial), different helper text ("Your GOV Password protects your identity" vs. "Your Financial
  Password authorizes money movement"), and never let them appear on the same screen at the same time
  outside of account-security settings.
- **Step-up verification**: any high-value or sensitive action (transfer above a threshold, adding a
  new linked bank, changing the Financial Password itself) re-prompts for the Financial Password in a
  focused modal — not a full page navigation, not silently skipped. Keep the entrance animation light
  and quick (this is a friction point by design; don't add friction to the friction with a slow
  animation) — a simple scale+fade via `gsap-animation-design`'s standard modal pattern is enough.

## RBAC-aware rendering — never CSS-hide a permission gate

`display: none` or `visibility: hidden` on a control the current role can't use is inspectable in
dev tools and looks like an oversight in a demo, not a security boundary — because it isn't one; it's
cosmetic. The actual rule: a control the current user's role can't act on should not render into the
DOM at all, gated by the same role/permission check that gates the underlying action, not a separate
UI-only check that can drift out of sync with it.

Per-bank scoping matters here specifically for Bank Admin roles (flagged in the original report
analysis): a Bank Admin at Nava Bank should never have another bank's customer data present in
component state, even briefly during a data-fetch race — scope the query itself, don't fetch broad and
filter client-side.

## Masking sensitive data by default

- **Account numbers**: masked by default (`•••• 4821` pattern), with an explicit, deliberate reveal
  action (click/tap, not hover — hover-reveal is discoverable by anyone glancing at the screen).
- **Balances**: consider an eye-toggle to blur/unblur the whole balance, the same pattern most real
  banking apps use for public-space safety. It's also a genuinely nice, cheap animation moment — a
  blur transition or digit-scramble-to-real-number reveal via GSAP reads as considered, not decorative.
- Neither of these should be optional-later — treat masked-by-default as the baseline for the User
  Portal, Bank Portal, and Central Bank Portal from the first build, not a hardening pass at the end.

## Form hygiene

- `autocomplete="off"` (or the specific non-financial values) on the Financial Password field — don't
  let a browser offer to save it alongside a regular login password.
- Never log Financial Password field values, even in development console output — this is an easy one
  to violate accidentally with a stray `console.log(formValues)` during debugging.
- Never put account IDs, transaction IDs, or any token in a URL query parameter — use path params or
  keep them in request bodies. Query params end up in browser history and server logs.
- Show a visible cooldown/lockout countdown after repeated failed login or step-up attempts, rather
  than silently allowing unlimited rapid retries from the UI side — this is both a real hardening
  measure and a legitimate design moment (a countdown timer is more honest and more interesting than a
  generic "too many attempts" text).

## Session & trust signals

- Idle-timeout warning: a modal with a visible countdown before auto-logout, not a silent kick — give
  the user a chance to stay logged in. This needs its own designed state, not a generic alert().
- Logout should have a brief, clear confirmation step on shared/ambiguous contexts, and should
  actually clear sensitive UI state (masked balances, cached account data) immediately, not just
  redirect while state lingers in memory until unmount.
- Device/login notifications (new device login, Financial Password changed) belong in whatever surface
  ends up owning notifications — still flagged as unplaced in the open-items list; this skill assumes
  that surface exists but doesn't resolve where.

## Security-specific error states need their own treatment

A failed step-up verification (wrong Financial Password) is a different kind of error than a network
timeout — it's a real, expected part of the flow, not a system failure. Give it a calm-but-serious
visual register distinct from generic red error states, once the missing `--color-loss`/error token is
resolved (flagged in `arthax-design-tokens`). This also surfaces a likely 6th missing asset beyond the
five already flagged: a dedicated shield/lock icon for security-specific states, distinct from the 6
transaction-status icons, which are all about money movement, not identity/access events.

## Cross-references

- `arthax-transaction-states` — step-up verification is the natural gate immediately before a transfer
  enters the `Processing` state; wire the two together rather than treating them as separate flows.
- `arthax-design-tokens` — the missing error/loss token blocks a correct visual treatment here too, not
  just Stock Portal losses.
- `anti-ai-design` — security failure states are exactly the kind of non-happy-path state that skill's
  "60-70% wall" warns gets skipped; treat this skill's states as required, not optional polish.
