---
name: ux-interaction
description: Full component state logic — Default/Hover/Active/Loading/Error/Empty — and specialized components (AccountBalance, BankSwitcher) over generic cards. Use for any component design/review that needs to reason about interaction states, or when deciding whether a generic card component is sufficient vs. a purpose-built one. Trigger this any time a new UI component is being specified, not just at final review.
---

# UX / Interaction (ARTHAX)

## Overview
Every interactive component needs its full state matrix designed, not just the happy-path default. And ARTHAX prefers specialized, purpose-built components over generic containers wherever the content has real semantic meaning (money, account identity).

## Required states per component
- **Default**
- **Hover**
- **Active/Pressed**
- **Loading** — for anything that fetches or submits (balance refresh, transfer submit, trade execution)
- **Error** — distinguish validation errors (user can fix) from system errors (retry needed) with different messaging
- **Empty** — a portal with no accounts yet, no transactions yet, no portfolio holdings yet, all need designed empty states, not a blank div

## Specialized over generic
- `AccountBalance` — not a generic `<Card>` with a number in it. It needs its own component that understands currency formatting (ARTH), sign/color semantics (skill 15's positive/negative), and loading/stale-data states.
- `BankSwitcher` — not a generic `<Dropdown>`. It's specific to the multi-bank relationship (skill 06/13) and should reflect account purpose, bank branding constraints, and active-bank state clearly.
- The general rule: if a piece of UI represents a core domain concept (money, identity, a transaction state), give it a named, purpose-built component rather than composing generic primitives ad hoc each time it's used — this is also what keeps the UI from reading as templated (skill 16).

## Rules
1. A component spec isn't complete until all six states above are accounted for, even if some are "same as default" — that should be a stated decision, not an omission.
2. Loading states on money-related actions must prevent double-submission (disable, not just show a spinner) — this is a UX rule with a financial-integrity consequence (skill 04).
3. Error states must be specific enough to be actionable ("Transfer limit exceeded — see your daily limit" not "Something went wrong").

## Common mistakes
- Shipping a component with only Default and Hover designed, discovering Loading/Error/Empty gaps in QA.
- Reusing a generic `<Card>` for AccountBalance across the whole app instead of building the specialized component once.
- A submit button that isn't disabled during Loading, allowing duplicate transaction submission.

## Handoff
Owned by **Design Director**; co-owned with **QA** on skill 21 (Accessibility) since state coverage and a11y overlap (e.g., loading states need `aria-busy`, error states need `aria-live`).
