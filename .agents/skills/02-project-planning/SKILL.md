---
name: project-planning
description: Governs the ARTHAX build order — the Section 7.2 database creation order and the phased sequencing across the six portals and 15 agents. Use this when sequencing work, deciding what to build next, resolving "is it safe to build X before Y" questions, or planning a sprint/phase for ARTHAX. Trigger whenever dependency ordering between Identity, Ledger, Banking, Stocks, Shop, or Audit is in question.
---

# Project Planning (ARTHAX)

## Overview
ARTHAX has hard dependency ordering — money-moving features cannot be safely built before the ledger exists, and the ledger cannot be safely built before identity exists. This skill encodes that order so nothing gets built out of sequence.

## Database creation order (Section 7.2)
1. Core Identity — GOV_ID, USER
2. Financial Entities — BANK, CENTRAL_BANK
3. Customer Relationships — BANK_CUSTOMER, BANK_ACCOUNT
4. Core Ledger — LEDGER_ENTRY
5. Transactional Layer — TRANSACTIONS
6. Specialized Banking — FIXED_DEPOSITS, LOANS
7. Market Infrastructure — STOCKS, PORTFOLIO
8. Gamification — SHOP, REWARDS
9. Support Systems — COMMUNICATION, NOTIFICATIONS
10. Oversight Layer — AUDIT, COMPLIANCE

## Build order (agent sequencing)
1. Chief Architect — scaffold workspace, lock module boundaries
2. Identity & Security + Database — Core Identity layer
3. Financial Engineer — Core Ledger + Settlement (get this right before anything else touches it)
4. Design Director + Frontend foundations, Component Librarian themes the base, Motion & 3D Specialist builds orchestration, Anti-AI Reviewer checkpoint — before real screens get built
5. Financial Engineer + Backend — Banking Domain, Bank Portal + Central Bank Portal
6. Frontend — User Portal, once ledger and banks are live
7. Financial Engineer — Investment/Market + Tax Rules — Stock Portal
8. Backend — Shop + Rewards (Gamification)
9. Backend — Notifications
10. Financial Auditor — first full audit/verification pass, then continuous
11. Integration — wire the unified "ARTHAX World" experience across all six portals
12. QA + Accessibility — full regression + a11y pass
13. DevOps + Documentation — hardening, runs throughout, finalized last

## Rules
- Never let a "gamification" or "nice to have" feature (Shop, Rewards, avatar customization) jump ahead of Core Ledger + Settlement in priority. Scope creep toward these before the ledger is solid is the single most common failure mode in a project like this.
- A phase is not "done" until Financial Auditor (a *different* agent than Financial Engineer) has signed off on anything touching money.
- Design/motion foundations (phase 4) happen before real screens, not screen-by-screen — this avoids re-theming work later.

## Common mistakes
- Building Stock Portal or Shop before the Core Ledger's double-entry invariant is verified.
- Skipping the Anti-AI Reviewer checkpoint at the end of phase 4 because "there's nothing to review yet" — the design system + component base is exactly what needs reviewing then.
- Treating Financial Auditor as optional or informal instead of a distinct, independent phase.

## Handoff
Owned by **Chief Architect**. Referenced by every agent to know what "next" means; **Integration** leans on it heavily at the seams between domains.
