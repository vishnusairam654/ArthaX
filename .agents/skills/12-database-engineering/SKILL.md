---
name: database-engineering
description: Prisma/Drizzle schema authorship, migrations, the 10-step table creation order, and deterministic seeds. Use for anything involving schema.prisma changes, migration authoring, or seed script work under config/database/. Trigger before writing any migration that touches Identity, Ledger, or Banking tables — ordering mistakes here cascade.
---

# Database Engineering (ARTHAX)

## Overview
Schema lives under `config/database/` (Prisma or Drizzle). Migrations must respect the 10-step creation order from skill 02/Section 7.2, because later domains have foreign-key dependencies on earlier ones.

## Creation order (repeat from skill 02, this is the skill that executes it)
1. Core Identity (GOV_ID, USER)
2. Financial Entities (BANK, CENTRAL_BANK)
3. Customer Relationships (BANK_CUSTOMER, BANK_ACCOUNT)
4. Core Ledger (LEDGER_ENTRY)
5. Transactional Layer (TRANSACTIONS)
6. Specialized Banking (FIXED_DEPOSITS, LOANS)
7. Market Infrastructure (STOCKS, PORTFOLIO)
8. Gamification (SHOP, REWARDS)
9. Support Systems (COMMUNICATION, NOTIFICATIONS)
10. Oversight Layer (AUDIT, COMPLIANCE)

## Rules
1. Every migration is additive-first — prefer expand/contract (add new column/table, backfill, migrate reads, then drop old) over destructive in-place changes on tables with live financial data.
2. Ledger and audit tables (`LEDGER_ENTRY`, `SYSTEM_LOG`, etc.) get append-only constraints at the schema level where the DB supports it (no UPDATE/DELETE grants, or a trigger that rejects them) — don't rely on application code alone to enforce immutability.
3. Seeds must be deterministic — same seed run twice produces the same data/IDs, so tests and local dev are reproducible. Use fixed UUIDs or a seeded RNG, not `Math.random()`/`uuid()` unpinned.
4. Foreign keys should exist and be enforced by the database wherever the domain model implies a relationship (skill 13) — don't rely on application-level "soft" referential integrity for anything financial.
5. Money amounts use a fixed-precision/integer-minor-unit type, never floating point (see skill 04).

## Common mistakes
- A migration that creates a table before its dependency (e.g., `USER_FD` before `FD_SCHEME` exists).
- Seed data with random/non-deterministic IDs, breaking reproducible test fixtures.
- Adding a nullable "just in case" column without a plan for when it's populated, on a financial table.

## Handoff
Owned by **Database**, built in phase 2 (skill 02) alongside Identity & Security. Coordinates closely with skill 13 (Data Modeling) on relationships and with **Financial Engineer** on ledger-specific schema constraints.
