---
name: devops
description: Docker configs, GitHub Actions CI/CD, and environment/workspace management for the ARTHAX Turborepo. Use for anything involving containerization, CI pipeline authorship, environment variable management, or deployment configuration.
---

# DevOps (ARTHAX)

## Overview
Infrastructure lives under `config/docker/` and `.github/` for workflows, on top of the pnpm + Turborepo workspace.

## Responsibilities
- **Docker**: containerize `apps/api` and `apps/web` separately; local dev compose file for Postgres + Redis (if used for caching/queues) + the two apps.
- **CI/CD (GitHub Actions)**: lint → typecheck → test → build pipeline, scoped per-package via Turborepo's caching so a Shop-only change doesn't re-run the full Ledger test suite unnecessarily — but *never* skip Ledger/Settlement tests based on a "didn't touch that file" heuristic alone, since shared package changes can affect them indirectly.
- **Environment management**: separate env configs per environment (local/staging/prod), secrets never committed, `.env.example` kept current as the source of truth for required variables.
- **Workspace**: `pnpm-workspace.yaml` and `turbo.json` correctness — new packages/apps registered properly, build pipeline dependencies (`dependsOn`) reflect actual code dependencies so Turborepo's cache doesn't serve stale artifacts.

## Rules
1. CI must run the full test suite (skill 19) including financial verification checks (skill 20) where automatable, on every PR touching `apps/api/src/ledger`, `apps/api/src/central-bank`, or `config/database`.
2. Never deploy a schema migration (skill 12) and application code that depends on it in a way that has an unsafe window — prefer the expand/contract pattern from skill 12 specifically to make deploys safe.
3. Secrets (DB credentials, JWT signing keys, financial password pepper) are never in the repo, even in `.env.example` — only variable *names* go there.

## Common mistakes
- CI cache configuration that lets a stale build artifact ship for the ledger package.
- Docker compose missing a service another app silently depends on in dev, causing "works on my machine."
- No separation between staging and prod secrets/config.

## Handoff
Owned by **DevOps** alongside skill 23. Runs throughout the build but finalized/hardened last (phase 13, skill 02).
