---
name: architecture
description: Enforces the ARTHAX monorepo structure (apps/, packages/, config/) and module boundaries. Use this whenever creating new files/folders, deciding where code belongs, wiring a new NestJS domain module, adding a shared package, or reviewing whether a change respects DDD boundaries between apps/api domains. Trigger any time a directory layout decision, workspace convention, or "where does this go" question comes up for ARTHAX.
---

# Architecture (ARTHAX)

## Overview
ARTHAX is a Turborepo + pnpm monorepo. This skill is the source of truth for where code lives and which layers are allowed to depend on which.

## Canonical layout
```
arthax/
├── apps/
│   ├── web/            # Next.js — portals, route groups, components, features, hooks, lib, providers, styles
│   └── api/             # NestJS — src/identity, central-bank, ledger, stocks, [domain modules]
├── packages/            # @arthax/ui, @arthax/design-system, @arthax/types, @arthax/validation
├── config/              # database (Prisma/Drizzle + seeds), docker, docs (ADRs)
├── tests/                # global E2E/integration
├── pnpm-workspace.yaml
└── turbo.json
```

## Rules
1. **Domain-driven modules in apps/api**: each NestJS module (`identity/`, `central-bank/`, `ledger/`, `stocks/`, etc.) owns its own controllers, services, DTOs, guards. No domain module reaches into another domain's internals — cross-domain calls go through exported services/interfaces only.
2. **packages/ is the only place for cross-cutting shared code.** If two apps need the same type, validation schema, or UI primitive, it belongs in `@arthax/types`, `@arthax/validation`, or `@arthax/ui` — never duplicated, never imported directly from one app into another.
3. **`@arthax/types` is the DB-to-UI contract.** Any change to a Prisma/Drizzle schema that changes shape must be reflected here before frontend work depends on it.
4. **config/ is infrastructure, not application code.** Database schema/seeds, Docker, and docs live here so they version alongside the code without polluting `apps/`.
5. **Six portals, one web app.** User, Central Bank, Bank, Stocks, Shop, and the public Guide are Next.js Route Groups inside `apps/web/app/`, not separate apps — they share the design system and auth session.
6. **Ledger logic never lives in a portal-specific module.** See skill 04 — this is the most commonly violated boundary in a system like this.

## Workflow for a new feature
1. Identify which domain(s) it touches (identity, ledger, banking, stocks, shop, etc.)
2. Confirm the NestJS module already exists under `apps/api/src/` or scaffold it per DDD conventions (see skill 03)
3. Add/extend shared types in `@arthax/types` before writing UI that consumes them
4. Place frontend work in the correct route group under `apps/web/app/`
5. If the feature needs a new shared package, justify it against existing packages first — don't create a 5th shared package for something `@arthax/utils`-shaped

## Common mistakes
- Importing a service directly from another app's `src/` instead of through a shared package or documented API boundary.
- Putting ledger math inside a bank-portal-specific service "just for this feature."
- Creating a new top-level folder outside `apps/`, `packages/`, `config/`, `tests/` without an ADR (skill 25).

## Handoff
Owned by **Chief Architect**. Every other agent should check this skill before deciding file placement; violations get flagged by **Code Quality** (skill 24) at PR time.
