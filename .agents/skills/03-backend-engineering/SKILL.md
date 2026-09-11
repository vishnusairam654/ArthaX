---
name: backend-engineering
description: NestJS DDD module conventions for apps/api — controllers, services, DTOs, guards, and general-purpose backend work that isn't ledger-critical (notifications, shop, rewards). Use whenever writing or reviewing NestJS modules, API endpoints, DTOs, or wiring non-financial services. Do not use for ledger/settlement math — that's skill 04.
---

# Backend Engineering (ARTHAX)

## Overview
`apps/api` is a NestJS DDD implementation. Each domain (`identity/`, `central-bank/`, `ledger/`, `stocks/`, plus modules like `notifications/`, `shop/`, `rewards/`) is a self-contained NestJS module.

## Module conventions
- One module per domain: `module.ts`, `controller.ts`, `service.ts`, `dto/`, `guards/` (where needed).
- Controllers stay thin — validation via DTOs (`class-validator` or `@arthax/validation` Zod schemas), business logic in services.
- Services never talk to another domain's repository directly — go through that domain's exported service or an application-layer orchestrator.
- Guards enforce RBAC (skill 10) at the controller level; don't duplicate auth checks deep in service logic unless it's a genuinely different authorization concern (e.g., resource ownership).

## What belongs here vs. Financial Engineer
- **Here**: notifications, shop catalog/inventory CRUD, rewards campaign/points logic, general account settings, mailbox/messaging.
- **Not here**: anything that writes a ledger entry, calculates interest/tax, or touches settlement — even if it's triggered by a Backend-owned feature (e.g., a Shop purchase still calls into the Ledger's service, it doesn't write entries itself).

## Standard workflow for a new endpoint
1. Confirm domain ownership against skill 01 (Architecture) and this skill's boundary rule above.
2. Define/extend the DTO and corresponding `@arthax/types` interface.
3. Write the service method with explicit error cases (not just the happy path).
4. Add the guard/RBAC check.
5. Add integration test coverage (skill 19) for the endpoint, including the DDD-boundary constraint (does it call Ledger through the service, not the repository?).

## Common mistakes
- A "quick" direct database write to `LEDGER_ENTRY` from a Shop or Rewards service instead of calling the Financial Engineer's ledger service.
- Fat controllers doing validation and business logic inline.
- Skipping DTO validation because "the frontend already validates it."

## Handoff
Owned by **Backend** agent. Wires non-ledger-critical services into the core built by **Financial Engineer**; coordinates with **Database** (skill 12/13) on schema and **Identity & Security** (skill 09/10) on guards.
