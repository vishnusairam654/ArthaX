# ARTHAX — Master Phase Roadmap & Development Tracking

This document is the **master phase tracking roadmap** for the development of ARTHAX. All work proceeds sequentially phase-by-phase as defined in [ARTHAX_AI_DEVELOPMENT_WORKFLOW.md](file:///c:/Users/hp/OneDrive/Desktop/ArthaX-Fin/ARTHAX_AI_DEVELOPMENT_WORKFLOW.md) and [ARTHAX_PROJECT_CONTEXT.md](file:///c:/Users/hp/OneDrive/Desktop/ArthaX-Fin/ARTHAX_PROJECT_CONTEXT.md).

---

## Global Architectural Invariants

- **Identity**: `1 Email` → `1 GOV ID` → `1 ARTHAX User` → `Many Bank Accounts`. One unified session across all portals.
- **Currency**: Exactly one currency (**ARTH**) across banking, stock market, shop, rewards, and taxes. No coins, secondary tokens, or shop points.
- **Ledger**: Single double-entry core financial ledger ($\sum \text{Debits} = \sum \text{Credits}$).
- **Portals**: 6 distinct portals (Central Guide Board, Central Bank Portal, Bank Portal, User Portal, Stock Portal, Shop).
- **Design & Asset Honesty**: Strictly adhere to anti-AI design guidelines and utilize only curated assets from [`assets/`](file:///c:/Users/hp/OneDrive/Desktop/ArthaX-Fin/assets). If an asset is missing: **STOP & ASK HUMAN**.

---

## Phase Status Summary

| Phase | Description | Status | Lead Agent |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Local Environment & Project Tooling | `NOT STARTED` | ARTHAX Director |
| **Phase 1** | Monorepo Foundation & Shared Core Architecture | `NOT STARTED` | ARTHAX Backend Engineer |
| **Phase 2** | Identity, GOV ID & Unified Authentication | `NOT STARTED` | ARTHAX Security Engineer |
| **Phase 3** | Core Financial Ledger & CLS Settlement Layer | `NOT STARTED` | ARTHAX Financial Engineer |
| **Phase 4** | Design System, Token Infrastructure & UI Shells | `NOT STARTED` | ARTHAX Visual Director / Frontend Builder |
| **Phase 5** | Banking Domain, Commercial Banks & Accounts | `NOT STARTED` | ARTHAX Backend / Financial Engineer |
| **Phase 6** | User Portal & Personal Finance Dashboard | `NOT STARTED` | ARTHAX Frontend Builder |
| **Phase 7** | Stock Market & Investment Taxation Rules | `NOT STARTED` | ARTHAX Financial / Backend Engineer |
| **Phase 8** | Shop Marketplace, Gamification & Pet Personas | `NOT STARTED` | ARTHAX Frontend Builder |
| **Phase 9** | Mailbox & Unified Notification Engine | `NOT STARTED` | ARTHAX Backend / Frontend Builder |
| **Phase 10** | Financial Audit, Invariant Verification & Security | `NOT STARTED` | ARTHAX Financial Auditor / QA |
| **Phase 11** | ARTHAX World Integration & End-to-End Simulation | `NOT STARTED` | ARTHAX Director |
| **Phase 12** | Quality Assurance, Accessibility & Anti-AI Audit | `NOT STARTED` | ARTHAX Design Auditor / QA |
| **Phase 13** | DevOps, Build Optimization, Documentation & Deployment | `NOT STARTED` | ARTHAX DevOps Engineer |

---

## Phase 0: Local Environment & Tooling

- **Objective**: Establish development tooling, workspace scripts, environment configurations, and validation hooks.
- **Lead Agent**: `ARTHAX Director`
- **Specialists**: `ARTHAX DevOps Engineer`
- **Required Skills**: `build-modern-web-projects`

### Tasks
- [ ] Verify Node.js, package manager (pnpm / npm / yarn), and TypeScript workspace toolchain.
- [ ] Establish environment variable templates (`.env.example`) and secrets management guidelines.
- [ ] Configure linting, code formatting (Prettier/ESLint), and Git hooks.
- [ ] Configure asset path resolution and static resource access verification for [`assets/`](file:///c:/Users/hp/OneDrive/Desktop/ArthaX-Fin/assets).

### Phase 0 Completion Gate
- [ ] Node / TypeScript environment runs cleanly without errors.
- [ ] Linting and formatting rules validated.
- [ ] Git commit checkpoint created.

---

## Phase 1: Monorepo Foundation & Shared Core Architecture

- **Objective**: Set up monorepo / modular project structure separating apps, shared libraries, domain types, and data models.
- **Lead Agent**: `ARTHAX Director`
- **Specialists**: `ARTHAX Backend Engineer`, `ARTHAX Frontend Builder`
- **Required Skills**: `build-modern-web-projects`

### Tasks
- [ ] Initialize monorepo workspace (e.g. Next.js web application + backend services/packages).
- [ ] Create shared core packages: `@arthax/types`, `@arthax/tokens`, `@arthax/config`.
- [ ] Define canonical TypeScript interfaces for Users, Accounts, Ledger, Portals, and ARTH currency.
- [ ] Configure local dev server scripts and build verification.

### Phase 1 Completion Gate
- [ ] Monorepo builds cleanly across all packages.
- [ ] Shared type definitions importable in frontend and backend targets.
- [ ] Git commit checkpoint created.

---

## Phase 2: Identity, GOV ID & Unified Authentication

- **Objective**: Implement the unified authentication pipeline from Email OTP to GOV ID registration and dual-password architecture (GOV Password + Financial Password).
- **Lead Agent**: `ARTHAX Security Engineer`
- **Specialists**: `ARTHAX Backend Engineer`, `ARTHAX Database Engineer`
- **Required Skills**: `build-modern-web-projects`

### Tasks
- [ ] Database schema for Identity: Users, GOV IDs, Email verification tokens, Credentials.
- [ ] Implement Email OTP registration & verification flow.
- [ ] Implement unique GOV ID generation and GOV account password hashing (Argon2 / bcrypt).
- [ ] Implement Financial Password creation and secure storage (separate from GOV password).
- [ ] Implement unified session management (JWT / secure cookies) supporting all 6 portals.
- [ ] Implement Role-Based Access Control (RBAC): `USER`, `BANK_ADMIN`, `CENTRAL_BANK_ADMIN`.
- [ ] Pre-provision private credentials for Central Bank & Commercial Bank administrators.

### Phase 2 Completion Gate
- [ ] `1 Email` → `1 GOV ID` → `1 ARTHAX User` invariant fully enforced with zero duplicates.
- [ ] Dual password isolation verified (Financial Password cannot be used as login; Login password cannot execute trades/transfers).
- [ ] Unit & integration tests for Auth / RBAC passing 100%.
- [ ] Git commit checkpoint created.

---

## Phase 3: Core Financial Ledger & CLS Settlement Layer

- **Objective**: Build the single source of truth for all ARTH money movements with double-entry guarantees and inter-bank clearing/settlement (CLS).
- **Lead Agent**: `ARTHAX Financial Engineer`
- **Specialists**: `ARTHAX Database Engineer`, `ARTHAX Backend Engineer`, `ARTHAX Financial Auditor`
- **Required Skills**: `arthax-transaction-states`

### Tasks
- [ ] Schema design for Ledger: Accounts, Journal Entries, Ledger Postings, Balance Snapshots.
- [ ] Double-entry transaction engine: atomic execution where $\sum \text{Debits} = \sum \text{Credits}$.
- [ ] Transaction state machine: `PENDING` → `VALIDATING` → `AUTHORIZED` → `PROCESSING` → `SETTLING` → `COMPLETED` (plus `FAILED`, `REVERSED`, `CANCELLED`).
- [ ] Implement CLS (Central Settlement Layer) for multi-bank clearing, routing, and inter-bank settlement.
- [ ] Implement idempotent transaction processing and distributed transaction locks.
- [ ] Implement audit trail logging and balance reconciliation jobs.

### Phase 3 Completion Gate
- [ ] Double-entry balance invariant mathematically proven across 10,000 simulated concurrent transactions.
- [ ] Zero money creation / zero money destruction verified.
- [ ] Reversal and failure recovery mechanics verified with rollback tests.
- [ ] Git commit checkpoint created.

---

## Phase 4: Design System, Token Infrastructure & UI Shells

- **Objective**: Implement the ARTHAX design token system, CSS variables, Material-rounded smooth styles, anti-AI layout patterns, and shared portal shell layouts.
- **Lead Agent**: `ARTHAX Visual Director`
- **Specialists**: `ARTHAX Frontend Builder`, `ARTHAX Motion Agent`, `ARTHAX Asset Agent`
- **Required Skills**: `arthax-design-tokens`, `material-rounded-smooth`, `anti-ai-design`, `arthax-layout-and-motion`, `arthax-brand-identity`, `gsap-animation-design`

### Tasks
- [ ] Configure design tokens (colors, typography, spacing, elevations, corner radii) matching official palette.
- [ ] Integrate custom typography (Cinzel, Outfit, Geist / Space Grotesk) and brand watermarks.
- [ ] Build reusable UI atom library (buttons, inputs, modal dialogs, status badges, currency displays).
- [ ] Build portal navigation shells for all 6 portals with distinctive visual personalities.
- [ ] Asset verification: Connect bank logos, portal hero images, stock banners, pet illustrations, and transaction icons from [`assets/`](file:///c:/Users/hp/OneDrive/Desktop/ArthaX-Fin/assets).
- [ ] Set up GSAP / motion baseline respecting `prefers-reduced-motion`.

### Phase 4 Completion Gate
- [ ] Design token coverage complete without hardcoded color/spacing overrides.
- [ ] Anti-AI audit passes: zero generic SaaS bento cards, authentic visual hierarchy.
- [ ] All 6 portal shells responsive on mobile, tablet, and desktop.
- [ ] Git commit checkpoint created.

---

## Phase 5: Banking Domain, Commercial Banks & Accounts

- **Objective**: Implement commercial bank models (4–5 fictional banks), account opening workflows, purpose recommendations, fixed deposits (FD), and loans.
- **Lead Agent**: `ARTHAX Backend Engineer`
- **Specialists**: `ARTHAX Financial Engineer`, `ARTHAX Frontend Builder`
- **Required Skills**: `arthax-design-tokens`, `arthax-brand-identity`, `arthax-empty-states`, `arthax-transaction-states`

### Tasks
- [ ] Seed official commercial banks with specific profiles, interest rates, fee tiers, and branding.
- [ ] Bank account creation workflow with purpose selection (Salary, Savings, Daily Spending, Business, FD).
- [ ] Bank recommendation engine suggesting optimal bank based on selected purpose.
- [ ] Central Bank administration portal (bank registry, approvals, suspensions, monetary policy).
- [ ] Commercial Bank portal (customer lists, accounts, ledger view, transaction history).
- [ ] Fixed Deposit (FD) module: term durations, maturity calculation, interest accumulation, premature withdrawal rules.
- [ ] Loan module: applications, disbursement through ledger, repayment schedules.

### Phase 5 Completion Gate
- [ ] User can hold multiple accounts across different banks within a single session.
- [ ] All account balance updates pass strictly through the Core Financial Ledger.
- [ ] Central Bank oversight actions functional.
- [ ] Git commit checkpoint created.

---

## Phase 6: User Portal & Personal Finance Dashboard

- **Objective**: Build the unified personal financial headquarters allowing multi-bank switching, total net worth aggregation, transfers, and asset overviews.
- **Lead Agent**: `ARTHAX Frontend Builder`
- **Specialists**: `ARTHAX Visual Director`, `ARTHAX Motion Agent`, `ARTHAX Design Auditor`
- **Required Skills**: `arthax-design-tokens`, `arthax-layout-and-motion`, `material-rounded-smooth`, `anti-ai-design`, `arthax-empty-states`, `arthax-transaction-states`, `gsap-animation-design`

### Tasks
- [ ] Net Worth & Total ARTH overview hero (non-generic editorial presentation).
- [ ] Connected bank accounts view with instantaneous bank context switching.
- [ ] Money Transfer interface (User → User, Own Account → Own Account) with step-up Financial Password verification.
- [ ] Transaction history table with real-time status badges and filterable ledger logs.
- [ ] Fixed Deposit portfolio view with maturity timers and interest tracking.
- [ ] Integrated empty states using official illustrations (`no_bank_account.png`, `no_transactions.png`, `no_FD.png`).

### Phase 6 Completion Gate
- [ ] Full transfer flow executable with authentic ledger state transitions.
- [ ] Empty states and error states validated visually.
- [ ] Anti-AI audit passed for personal finance views.
- [ ] Git commit checkpoint created.

---

## Phase 7: Stock Market & Investment Taxation Rules

- **Objective**: Build the centralized stock exchange, order matching/simulation, company listings, portfolio tracking, and profit-based capital gains tax engine.
- **Lead Agent**: `ARTHAX Financial Engineer`
- **Specialists**: `ARTHAX Backend Engineer`, `ARTHAX Frontend Builder`
- **Required Skills**: `arthax-brand-identity`, `arthax-design-tokens`, `arthax-empty-states`, `arthax-layout-and-motion`

### Tasks
- [ ] Seed 10 stock market listings with company profiles, ticker symbols, sector data, and banner assets.
- [ ] Market price simulation engine with trading sessions, price fluctuation, and volume data.
- [ ] Buy and Sell order execution integrated with Core Financial Ledger (deduct/credit ARTH).
- [ ] Stock portfolio view: holdings, average buy price, current valuation, unrealized P&L.
- [ ] Capital Gains Tax engine: tax calculated strictly on investment profit (not total sale value), handling short-term vs long-term rates.
- [ ] Stock market empty state integration (`no_stocks.png`).

### Phase 7 Completion Gate
- [ ] Tax calculation mathematically validated: strictly taxed on net gain upon sale.
- [ ] Stock purchase and sale settlements cleanly reflected in ledger.
- [ ] Stock Portal UI responsive, readable, and authentic.
- [ ] Git commit checkpoint created.

---

## Phase 8: Shop Marketplace, Gamification & Pet Personas

- **Objective**: Build the virtual marketplace using ARTH currency for Pets, Personas, Frames, and Profile Banners with financial power modifiers.
- **Lead Agent**: `ARTHAX Frontend Builder`
- **Specialists**: `ARTHAX Visual Director`, `ARTHAX Motion Agent`
- **Required Skills**: `arthax-shop-gamification`, `arthax-brand-identity`, `arthax-design-tokens`, `gsap-animation-design`, `arthax-empty-states`

### Tasks
- [ ] Pet Store: Catalog of the 8 official financial pets (Saver Fox, Archive Cat, Flow Otter, Wealth Elephant, Settlement Crane, Tax Tortoise, Market Bull, Ledger Owl).
- [ ] Pet Powers engine: Activate 1 active pet at a time to apply bounded modifiers (e.g. FD interest bonus, tax reduction).
- [ ] Avatar Persona Store: 8 personas (Analyst, Builder, Businessman, Creator, Entrepreneur, Investor, Retired Investor, Student).
- [ ] Frame & Profile Banner Stores: Multi-tier rarity system (Normal, Rare, Epic, Gold) conforming to ARTHAX palette.
- [ ] Unified checkout engine: Purchases debited directly in ARTH via ledger with Financial Password confirmation.
- [ ] User Inventory & Profile Customization view (`empty_inventory.png` handling).

### Phase 8 Completion Gate
- [ ] Zero secondary currencies: 100% of shop transactions execute in ARTH.
- [ ] Pet modifier limits enforced (no infinite money generation).
- [ ] Collectible unlock animations and inventory state management verified.
- [ ] Git commit checkpoint created.

---

## Phase 9: Mailbox & Unified Notification Engine

- **Objective**: Implement the centralized communication system delivering system, financial, security, market, and Central Bank notifications.
- **Lead Agent**: `ARTHAX Backend Engineer`
- **Specialists**: `ARTHAX Frontend Builder`
- **Required Skills**: `arthax-design-tokens`, `arthax-empty-states`, `material-rounded-smooth`

### Tasks
- [ ] Notification dispatch service emitting events from Ledger, Auth, Stock Market, and Banks.
- [ ] Notification categories: `SECURITY`, `FINANCIAL`, `MARKET`, `REWARD`, `SYSTEM`.
- [ ] Mailbox UI with read/unread tracking, message filtering, and official notification icons.
- [ ] Empty state integration (`empty_mailbox.png`).
- [ ] Real-time notification badge updates across user session.

### Phase 9 Completion Gate
- [ ] Critical financial events (transfers, logins, FD maturity, tax deductions) trigger notifications reliably.
- [ ] Notification preferences and deletion/archival fully operational.
- [ ] Git commit checkpoint created.

---

## Phase 10: Financial Audit, Invariant Verification & Security Review

- **Objective**: Comprehensive stress testing of all mathematical, financial, cryptographic, and role invariants across the entire platform.
- **Lead Agent**: `ARTHAX Financial Auditor`
- **Specialists**: `ARTHAX Security Engineer`, `ARTHAX QA`
- **Required Skills**: `arthax-transaction-states`

### Tasks
- [ ] Double-entry balance integrity verification across all accounts in the system.
- [ ] Concurrent transaction race condition testing (double-spending prevention).
- [ ] Security audit: penetration testing on OTP validation, password brute-forcing, and Financial Password step-up bypass.
- [ ] RBAC boundary verification (preventing regular users from accessing Bank Admin or Central Bank APIs).
- [ ] Tax engine and pet modifier audit (verifying calculations against regulatory benchmarks).

### Phase 10 Completion Gate
- [ ] Zero ledger discrepancies detected.
- [ ] Security audit produces zero critical or high vulnerabilities.
- [ ] Formal audit report generated.
- [ ] Git commit checkpoint created.

---

## Phase 11: ARTHAX World Integration & End-to-End Simulation

- **Objective**: Interconnect all 6 portals into a seamless, living financial world simulation with the Central Guide Board as the orientation anchor.
- **Lead Agent**: `ARTHAX Director`
- **Specialists**: `ARTHAX Frontend Builder`, `ARTHAX Visual Director`
- **Required Skills**: `arthax-brand-identity`, `arthax-design-tokens`, `anti-ai-design`, `gsap-animation-design`

### Tasks
- [ ] Central Guide Board completion (ecosystem explainer, interactive guide, portal gateway, announcements).
- [ ] Seamless inter-portal navigation maintaining persistent user identity and active bank context.
- [ ] Printable financial document generation (Account Statements, FD Certificates, Tax Receipts) using official watermarks and signatures.
- [ ] Simulated world activity (background stock trades, market updates, central bank policy announcements).

### Phase 11 Completion Gate
- [ ] Complete user lifecycle executable from Guide Board → Registration → Banking → Stocks → Shop → Audit without friction.
- [ ] Document generation renders crisp, printable outputs.
- [ ] Git commit checkpoint created.

---

## Phase 12: Quality Assurance, Accessibility & Anti-AI Design Audit

- **Objective**: Full-spectrum UX polish, responsive testing across all viewports, WCAG 2.1 AA accessibility auditing, and final anti-AI design certification.
- **Lead Agent**: `ARTHAX Design Auditor`
- **Specialists**: `ARTHAX Motion Agent`, `ARTHAX QA`
- **Required Skills**: `anti-ai-design`, `a11y-debugging`, `frontend-design`, `material-rounded-smooth`

### Tasks
- [ ] Run full Anti-AI audit checklist against every portal screen (removing generic cards, fixing padding monotony, tuning typography).
- [ ] WCAG 2.1 AA compliance audit (color contrast, keyboard navigation, ARIA roles, focus rings).
- [ ] Motion audit: ensure smooth 60fps animations and proper `prefers-reduced-motion` compliance.
- [ ] Responsive audit across 320px, 768px, 1024px, 1440px, and 1920px viewports.

### Phase 12 Completion Gate
- [ ] Zero "Needs Work" flags on Anti-AI audit.
- [ ] Zero critical a11y violations.
- [ ] Cross-browser and responsive layout verified.
- [ ] Git commit checkpoint created.

---

## Phase 13: DevOps, Build Optimization, Documentation & Deployment

- **Objective**: Production build optimization, Core Web Vitals optimization, complete technical documentation, and deployment preparation.
- **Lead Agent**: `ARTHAX DevOps Engineer`
- **Specialists**: `ARTHAX Director`
- **Required Skills**: `debug-optimize-lcp`, `build-modern-web-projects`

### Tasks
- [ ] Next.js / TypeScript production bundle optimization and tree-shaking.
- [ ] Image optimization and lazy-loading for all assets in [`assets/`](file:///c:/Users/hp/OneDrive/Desktop/ArthaX-Fin/assets).
- [ ] Largest Contentful Paint (LCP) and Core Web Vitals profiling.
- [ ] Complete API documentation, architectural diagrams, and administrator runbooks.
- [ ] Production build and staging deployment validation.

### Phase 13 Completion Gate
- [ ] Production build passes with 0 errors.
- [ ] Documentation complete and validated.
- [ ] Final project milestone checkpoint created.
