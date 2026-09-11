---
name: testing-qa
description: Global E2E/integration suite conventions and coverage standards per domain. Use when writing tests, defining coverage requirements for a new feature, or reviewing whether a PR has adequate test coverage. Distinct from skill 20 (Financial Verification) — this is code-path/behavior coverage, not independent financial correctness sign-off.
---

# Testing / QA (ARTHAX)

## Overview
Tests live under `tests/` for global E2E/integration, with unit tests colocated per app/package. Coverage standards scale with domain risk — ledger/settlement code needs far more rigorous coverage than a Shop catalog listing.

## Coverage standards by domain (risk-scaled)
- **Ledger/Settlement (skill 04/05)**: exhaustive — every state transition, every failure/reversal path, concurrency/race conditions on balance updates, idempotency of retries. This is the domain where a missed edge case has direct financial consequences.
- **Identity/Security (skill 09/10)**: every negative path — wrong role, wrong scope, locked account, expired session, step-up auth bypass attempts — not just the happy login path.
- **Banking/Investment (skill 06/07)**: standard integration coverage of CRUD + the money-moving paths that route through skill 04.
- **Backend general (skill 03), Shop/Rewards**: standard coverage, less exhaustive edge-casing acceptable here.
- **Frontend (skill 14)**: component state coverage (skill 18's six states) plus critical user flows E2E (registration, transfer, trade, FD creation).

## Conventions
1. E2E tests exercise real flows across portals where the "ARTHAX World" experience matters (skill 13, Integration's domain) — e.g., a transfer initiated in User Portal should be verifiable from Bank Portal's transaction view.
2. Every bug fix gets a regression test before the fix is considered complete, not after.
3. Test data uses the deterministic seeds from skill 12 — no test that depends on random/unseeded data.
4. Money-related test assertions check exact amounts (integer minor units), never approximate/floating comparisons.

## Common mistakes
- Testing only the happy path on a state machine (skill 04) that has five failure states worth exercising.
- E2E tests that are flaky due to unseeded random data, eroding trust in the suite over time.
- Treating 80% line coverage as sufficient on ledger code where the missing 20% is exactly the concurrency edge case that matters.

## Handoff
Owned by **QA**, co-owns skill 21 (Accessibility). Runs as phase 12 (skill 02) full regression pass, but standards apply continuously — this isn't a phase-gate-only concern.
