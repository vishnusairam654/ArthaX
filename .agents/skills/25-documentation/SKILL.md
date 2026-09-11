---
name: documentation
description: ADRs stored in config/docs/, onboarding README, and API specs kept alongside the code. Use whenever a significant architectural decision is made, a new contributor needs onboarding material, or an API surface needs documenting. Trigger this any time skill 01/02 decisions get made — they should produce an ADR, not just live in someone's memory.
---

# Documentation (ARTHAX)

## Overview
Documentation lives under `config/docs/` and version-controls alongside the code — decisions and API shapes should be discoverable without archaeology through Git history or chat logs.

## What to document
- **ADRs (Architecture Decision Records)**: any decision from Chief Architect (skill 01/02) that future contributors would otherwise have to reverse-engineer — why NestJS DDD boundaries are drawn where they are, why GOV/Financial password separation exists, why ledger entries are append-only.
- **Onboarding README**: how to get the monorepo running locally (Docker, env vars, seed data from skill 12), the build order (skill 02) so a new contributor understands why Identity comes before Ledger comes before Banking.
- **API specs**: kept alongside `apps/api/src/[module]/`, describing each domain's public interface — what Banking/Stocks/Shop are allowed to call on Ledger, for instance, reinforcing skill 01's boundary rules in a form new contributors can actually read.

## Rules
1. An ADR is short — context, decision, consequences. It's not a design essay; it's a record of *why*, for someone who wasn't in the room.
2. API specs document the *intended* boundary (what Banking is allowed to call on Ledger), which doubles as a checkable contract for skill 24's PR gates.
3. Documentation updates ship in the same PR as the decision/change they describe, not as a follow-up that may never happen.

## Common mistakes
- ADRs written after the fact, retroactively rationalizing a decision instead of capturing the actual reasoning and trade-offs considered at the time.
- Onboarding README that goes stale because setup steps changed and nobody updated it.
- API specs describing what an endpoint *does* but not what it's *not allowed to do* (the boundary constraints from skill 01 that matter most for a system like this).

## Handoff
Owned by **Documentation**. Runs throughout the build but finalized last (phase 13, skill 02), though ADRs should be captured as decisions happen, not retroactively at the end.
