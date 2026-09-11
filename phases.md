# ARTHAX — Phased Build Roadmap

This document defines the canonical 14-phase build sequence for the ARTHAX financial ecosystem. Development must advance phase by phase; money-moving features and user portals must never leapfrog foundational identity and ledger integrity.

---

## Build Phase Matrix

| Phase | Name | Owning Agents | Primary Skills | Key Deliverables & Gating Criteria |
|---|---|---|---|---|
| **Phase 0** | **Local Environment** | DevOps, Chief Architect | `devops` (22) | Node.js, pnpm, Docker, PostgreSQL, environment variables (`.env.example`). |
| **Phase 1** | **Monorepo Foundation** | Chief Architect | `architecture` (01), `project-planning` (02) | Turborepo scaffold: `apps/web`, `apps/api`, `packages/` (`@arthax/types`, `@arthax/tokens`, `@arthax/validation`, `@arthax/ui`), `config/`. DDD module boundaries locked. |
| **Phase 2** | **Core Identity & Auth** | Identity & Security, Database | `identity-authentication` (09), `security` (10), `database-engineering` (12), `data-modeling` (13) | `GOV_ID`, `USER`, Email OTP flow, Argon2id hashing, GOV Password vs Financial Password separation, session management, RBAC guards. |
| **Phase 3** | **Core Ledger + Settlement (CLS)** | Financial Engineer, Database, QA | `financial-ledger` (04), `settlement-cls` (05), `database-engineering` (12), `testing-qa` (19) | Append-only `LEDGER_ACCOUNT`, `TRANSACTION`, `TRANSACTION_ENTRY`, `SETTLEMENT`. Double-entry invariant ($\sum \text{Debits} = \sum \text{Credits}$) with DB-level constraints. Transaction state machine (`PENDING` → `COMPLETED`). |
| **Phase 4** | **Design System + UI Foundation** | Design Director, Component Librarian, Motion & 3D Specialist, Anti-AI Reviewer | `design-system` (15), `arthax-design-tokens` (31), `material-rounded-smooth` (32), `component-library-curation` (28), `motion-gsap` (17), `anti-ai-design` (16) | Tokens in CSS/Tailwind (`@arthax/tokens`), Fraunces + Cantarell type stack, curated palette + terracotta `--color-loss: #B5482E`, re-themed `@arthax/ui` primitives, GSAP foundations. **Mandatory Anti-AI Reviewer audit gate before real screens are built.** |
| **Phase 5** | **Banking Domain** | Financial Engineer, Backend, Database | `banking-domain` (06), `backend-engineering` (03), `database-engineering` (12) | 5 Commercial Banks (*Nava, Samaya, Setu, Sthira, Vayu*). Bank accounts, customer relationships, Fixed Deposits (FDs), loans, interest calculation engines. Bank operational portal + Central Bank administration. |
| **Phase 6** | **User Portal** | Frontend, Design Director, Anti-AI Reviewer | `frontend-engineering` (14), `ux-interaction` (18), `anti-ai-design` (16) | Unified personal financial dashboard. Net worth summary, multi-bank account switching, transfer flows (User-to-User, Own-Account), FD viewer, balance reveal masking. |
| **Phase 7** | **Stock Market + Tax Rules** | Financial Engineer, Backend, Frontend | `investment-market` (07), `tax-financial-rules` (08), `frontend-engineering` (14) | Centrally managed simulated market. 10 listed companies. Order book, matching engine, trade settlement posting to Core Ledger, capital gains tax calculated strictly on *profit*. Flat, precise charting (never 3D). |
| **Phase 8** | **Shop & Virtual Economy** | Backend, Component Librarian, Motion & 3D Specialist, Frontend | `backend-engineering` (03), `3d-webgl-engineering` (26), `frontend-engineering` (14) | Pet Store (8 pets with bounded financial modifiers), Avatar Store (8 personas), Frame Store (7 frames with resolved rarity tiers), Banner Store. All purchases debit ARTH directly via Core Ledger. Three.js item previews with performance fallback. |
| **Phase 9** | **Mailbox & Notifications** | Backend, Frontend | `backend-engineering` (03), `frontend-engineering` (14) | User Portal `/mailbox` section. System alerts, transfer notifications, trade confirmations, FD maturity alerts, unread badge in navigation. |
| **Phase 10** | **Financial Audit & Compliance** | Financial Auditor | `audit-compliance` (11), `financial-verification` (20) | Independent verification of double-entry ledger from raw entry stream (never cached balances), CLS settlement reconciliation, rule version re-computation, `SYSTEM_LOG` and compliance reporting. |
| **Phase 11** | **ARTHAX World Integration** | Integration | `project-planning` (02), `backend-engineering` (03), `data-modeling` (13), `testing-qa` (19) | Verification of seamless single-session experience across all 6 portals. Cross-portal state synchronization (e.g. transfer in User Portal reflects in Bank Portal and Ledger instantly). |
| **Phase 12** | **QA & Accessibility** | QA, Design Director | `testing-qa` (19), `accessibility` (21), `code-quality` (24) | End-to-end regression suites, negative-path and concurrency tests, WCAG AA accessibility audit (keyboard focus, screen reader landmarks, reduced motion fallback, contrast checks). |
| **Phase 13** | **DevOps & Production Hardening** | DevOps, Documentation | `devops` (22), `observability` (23), `documentation` (25) | Docker production configurations, CI/CD pipelines with non-skippable ledger test gates, automated ledger imbalance alerting (paging alerts, not passive dashboards), ADR collection, onboarding documentation. |

---

## Non-Negotiable Sequencing Rules
1. **Never build Stock Portal or Shop before Core Ledger is verified.** All value movement in ARTHAX flows through the double-entry engine.
2. **Never build financial actions before Identity & Auth is secure.** Step-up authentication (Financial Password + OTP) must be functional.
3. **Phase 4 (Design System) is a hard checkpoint.** Real portal screens are not generated until `@arthax/ui` base primitives are re-themed and audited by Anti-AI Reviewer.
4. **Financial Auditor is an independent gate.** Financial Engineer cannot certify their own ledger math or settlement logic.
