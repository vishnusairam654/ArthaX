---
name: code-quality
description: Linting, review standards, PR gates, and consistency across the ARTHAX monorepo. Use when reviewing a PR, setting up lint/format tooling, or checking whether code follows the conventions set by skill 01 (Architecture). This is the enforcement mechanism for the standard Chief Architect sets.
---

# Code Quality (ARTHAX)

## Overview
Consistency across a 6-portal, 2-app, multi-package monorepo doesn't happen by accident — this skill is the enforcement layer for the architecture (skill 01) and general engineering conventions (skill 03).

## PR gate checklist
1. **Boundary check**: does the change respect DDD module boundaries (skill 01)? No cross-domain internal imports.
2. **Type safety**: does a schema/DTO change also update `@arthax/types` (skill 13) in the same PR?
3. **Ledger discipline**: if the PR touches money movement, does it post through the Core Ledger service (skill 04) rather than writing entries directly?
4. **Test coverage**: does the PR include tests appropriate to its domain's risk level (skill 19)?
5. **Design system compliance**: for UI PRs, are tokens (skill 15) used correctly, with no inline magic values?
6. **Financial sign-off**: for PRs touching skill 04/05/08, has Financial Auditor reviewed independently (skill 20)?

## Linting/formatting
- Consistent ESLint/Prettier config shared at the workspace root, extended (not overridden) per app/package.
- No `any` in TypeScript without an explicit justifying comment — especially in `@arthax/types` and ledger code.
- Consistent naming: DDD module folders lowercase-kebab, matching the domain names used throughout the roster (identity, central-bank, ledger, stocks).

## Common mistakes
- Approving a PR that adds a new shared utility duplicating something already in `packages/`.
- Merging a ledger-touching PR without Financial Auditor's independent review, treating it as "just code review."
- Lint config drift between apps causing inconsistent style across the monorepo.

## Handoff
Owned by **QA** alongside skill 19. Enforces the standard **Chief Architect** sets via skill 01; applies to every PR, every agent's output.
