# ARTHAX — MASTER SYSTEM SPECIFICATION & PROJECT BLUEPRINT

> **Document Status**: Canonical Master Specification  
> **Authority**: Overrides and consolidates all prior drafts (`ARTHAX_PROJECT_CONTEXT.md`, `ARTHAX_AI_DEVELOPMENT_WORKFLOW.md`, `AGENTS.md`).  
> **Audience**: AI Engineering Team, Product Owner, UI Designers (Stitch MCP).

---

## Table of Contents
1. [Executive Summary & World Concept](#1-executive-summary--world-concept)
2. [The Core Identity Chain & Dual-Password Model](#2-the-core-identity-chain--dual-password-model)
3. [Economic Model & Core Double-Entry Ledger](#3-economic-model--core-double-entry-ledger)
4. [The Six Portals Deep Specification](#4-the-six-portals-deep-specification)
5. [Design System, Tokens & Anti-AI Standards](#5-design-system-tokens--anti-ai-standards)
6. [Asset Library Registry & Exact Mapping Rules](#6-asset-library-registry--exact-mapping-rules)
7. [System Architecture & Monorepo Layout](#7-system-architecture--monorepo-layout)
8. [The 15-Agent Team & 32-Skill System](#8-the-15-agent-team--32-skill-system)
9. [14-Phase Implementation Roadmap](#9-14-phase-implementation-roadmap)
10. [Stitch MCP UI Workflow & Component Protocol](#10-stitch-mcp-ui-workflow--component-protocol)

---

## 1. Executive Summary & World Concept

**ARTHAX** is a fictional digital financial ecosystem / financial-world simulation.

It is **not** a generic fintech SaaS dashboard, a crypto token project, or a disconnected marketing template. It is designed to look, feel, and function as **one coherent, living financial universe**.

### Core Tenets
1. **One Connected Financial World**: A citizen in ARTHAX experiences seamless continuity whether checking government bank regulations, depositing salary in a commercial bank, trading equities on the central exchange, or buying a pet avatar in the shop.
2. **Deep Architectural Integrity**: Real double-entry accounting enforces every ledger transaction. The shop and stock market do not maintain independent or synthetic money balances; all value movement flows through the same core financial engine.
3. **Anti-AI Craftsmanship**: ARTHAX deliberately rejects AI-scaffolded visual cliches: purple/indigo gradients, floating generic 3D blobs, uniform rounded bento grids, and generic marketing copy. The aesthetic is **Clear, Calm, Precise, Distinctive, and Human**.

---

## 2. The Core Identity Chain & Dual-Password Model

### 2.1 The Identity Chain
```text
Email (OTP verification)
  ↓
GOV ID (Unique national identifier, e.g., GOV-XXXX-XXXX)
  ↓
ARTHAX User (One unified session across all 6 portals)
  ↓
Financial Password (Required for sensitive money actions)
  ↓
Multiple Bank Accounts (Across 5 licensed commercial banks)
```

### 2.2 Key Identity Invariants
- **1 Email ↔ 1 GOV ID ↔ 1 ARTHAX User ↔ Many Bank Accounts**.
- **Single Unified Session**: Logging in once grants access across all six portals. Users do **not** log into commercial banks with separate user accounts; bank context is switched within the unified session.
- **Banks do not issue user passwords**: Bank credentials belong exclusively to commercial bank employees/admins (`BANK_ADMIN`), which are pre-provisioned.
- **Purpose-Driven Banking**: Users open bank accounts intentionally based on purpose (e.g., Salary, Savings, Business, Fixed Deposit). Users are **not** assigned accounts in every bank automatically.

### 2.3 Dual-Password Isolation
ARTHAX enforces strict separation between identity authentication and financial execution:

| Credential | Scope & Purpose | Reset & Verification Flow |
|---|---|---|
| **GOV Password** | Authenticates identity and grants general read/browsing access across portals. | Email OTP → Verify OTP → Reset GOV Password. |
| **Financial Password** | Required for step-up authentication on every money-moving or high-risk action (transfers, stock trades, FD creation, shop purchases). | Email OTP + GOV Password verification → Reset Financial Password. |

#### Security Invariants:
- GOV Password and Financial Password **never share the same visual treatment** and **never appear on the same screen** outside Account Security Settings.
- Financial Password inputs must enforce `autocomplete="off"` and must **never** be logged in plain text or server traces.
- Password hashing uses **Argon2id** with strict work factor parameters.

---

## 3. Economic Model & Core Double-Entry Ledger

### 3.1 Single Currency: ARTH
- ARTHAX operates on **one and only one currency: ARTH**.
- Represented internally as **integer minor units** (preventing floating-point arithmetic errors).
- **Prohibited**: Secondary tokens, coins, diamonds, shop points, or loyalty credits.
- All pricing (banking fees, stocks, taxes, pet avatars, frames, banners, task rewards) settles directly in ARTH.

### 3.2 Double-Entry Ledger Invariant
Every journal transaction must satisfy:
$$\sum \text{Debits} = \sum \text{Credits}$$

- **Append-Only Immutability**: The `LEDGER_ENTRY` table is strictly append-only. `UPDATE` and `DELETE` queries are prohibited at the database permissions level.
- **Auditable Corrections**: Any ledger mistake or transaction rollback must be executed as a new compensating reversal transaction.
- **Single Source of Truth**: Banking, Stock Trading, Shop Purchasing, and Rewards all call the exported Core Ledger service (`Financial Engineer`). No domain writes to its own isolated balance store.

### 3.3 Transaction Lifecycle & State Machine
Every monetary movement progresses through explicit states:

```text
PENDING
  ↓
VALIDATING   (Balance check, permission check, limit check)
  ↓
AUTHORIZED   (Step-up Financial Password verified)
  ↓
PROCESSING   (Ledger journal entries created)
  ↓
SETTLING     (CLS inter-bank clearing or internal reconciliation)
  ↓
COMPLETED    (Terminal success state)
```
**Alternative Terminal States**:
- `FAILED`: Insufficient balance, invalid account, or validation error.
- `REVERSED`: Transaction refunded or rolled back via compensating entries.
- `CANCELLED`: User or system cancelled before settlement.

### 3.4 Central Settlement Layer (CLS)
- Facilitates inter-bank clearing and settlement between distinct commercial banks (e.g., Nava Bank → Setu Bank).
- Maintains inter-bank clearing accounts and net settlement records.
- Prevents cross-bank liquidity imbalances and handles settlement failure recovery.

---

## 4. The Six Portals Deep Specification

```text
                             ┌──────────────────────────────┐
                             │     Central Guide Board      │
                             │   (Public Orientation)       │
                             └──────────────┬───────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
 ┌─────────────┴─────────────┐ ┌────────────┴────────────┐ ┌─────────────┴─────────────┐
 │    Central Bank Portal    │ │       User Portal       │ │       Stock Portal        │
 │ (Regulatory & Oversight)  │ │   (Personal Finance)    │ │   (Equities & Tax)        │
 └─────────────┬─────────────┘ └────────────┬────────────┘ └─────────────┬─────────────┘
               │                            │                            │
 ┌─────────────┴─────────────┐              │              ┌─────────────┴─────────────┐
 │        Bank Portal        │              │              │           Shop            │
 │    (5 Commercial Banks)   │              │              │    (Virtual Economy)      │
 └───────────────────────────┘              │              └───────────────────────────┘
                                            │
                             ┌──────────────┴───────────────┐
                             │       Shared Mailbox         │
                             │         (/mailbox)           │
                             └──────────────────────────────┘
```

### 4.1 Central Guide Board (Public)
- **Role**: Public orientation, education, policy explanation, and system launcher.
- **Audience**: All public visitors and onboarded citizens.
- **Key Features**:
  - Interactive walkthrough of the ARTHAX financial system.
  - Live public ticker (bank interest rates, major stock movements, central bank announcements).
  - Guides on how banking, taxes, and stock trading work.
  - Direct launch links to all other portals.
- **Visual Personality**: High-impact editorial layout, oversized typography, subtle ambient landing background.

### 4.2 Central Bank Portal (Regulatory Authority)
- **Role**: The apex financial regulator and monetary authority of ARTHAX.
- **Audience**: Central Bank Governors and Auditors (`CENTRAL_BANK_ADMIN`).
- **Key Features**:
  - Commercial Bank Registry (application, charter approval, suspension, liquidation).
  - Monetary policy controls (reserve requirements, base interest rate corridors).
  - Capital market administration and listing approvals.
  - CLS settlement monitoring and real-time inter-bank liquidity oversight.
  - System-wide audit reports, money supply (M0/M1) tracking, and tax collection records.
- **Visual Personality**: Formal institutional gravity, deep blue surfaces, crisp data tables, strict security indicators.

### 4.3 Bank Portal (Commercial Operations)
- **Role**: Operational interface for individual commercial banks.
- **Audience**: Bank Managers and Officers (`BANK_ADMIN`).
- **The 5 Commercial Banks**:
  1. **Nava Bank**: Modern digital-first retail bank.
  2. **Samaya Bank**: Heritage wealth management and high-yield savings.
  3. **Setu Bank**: Infrastructure and inter-business trade financing.
  4. **Sthira Bank**: Conservative, security-focused institutional bank.
  5. **Vayu Bank**: Agile, high-frequency consumer transactions and micro-loans.
- **Key Features**:
  - Parameterized architecture: The same portal code renders the specific branding, rates, and accounts for the active bank.
  - Customer directory and account lifecycle management.
  - Fixed Deposit (FD) scheme configuration (rates, durations, penalties).
  - Loan product management and disbursement approval workflows.
  - Commercial fee schedules and transaction monitoring.

### 4.4 User Portal (Personal Finance Command Center)
- **Role**: Unified dashboard for ARTHAX citizens.
- **Audience**: Authenticated users (`USER`).
- **Key Features**:
  - **Total Net Worth & Balance Overview**: Aggregate wealth in ARTH across all connected banks (masked by default with click-to-reveal).
  - **Multi-Bank Switcher**: Instant switching of active banking context without re-login.
  - **Money Transfer Suite**:
    - User-to-User Transfer (via GOV ID or Account Number).
    - Own-Account Transfer (instant movement between connected banks).
  - **Fixed Deposits**: Compare bank FD rates, open new FDs, view maturity projections and accrued interest.
  - **Investment Snapshot**: Real-time value of stock portfolio holdings.
  - **Unified Mailbox (`/mailbox`)**: Central communication hub for transaction receipts, FD maturity notices, security alerts, and system notices.

### 4.5 Stock Portal (Centralized Capital Market)
- **Role**: The fictional equities exchange of ARTHAX.
- **Audience**: Investors (`USER`) and Exchange Admins.
- **The 10 Listed Companies**:
  1. **Anvik Ind**: Industrial manufacturing and heavy machinery.
  2. **Arka Energy**: Renewable solar, wind, and grid infrastructure.
  3. **Aroha Foods**: Organic agriculture and packaged food distribution.
  4. **Jala Water**: Municipal and industrial water filtration systems.
  5. **Kshiti Infra**: Real estate, bridges, and smart city developments.
  6. **Meru Capital**: Venture financing, merchant banking, and asset management.
  7. **Nila Systems**: Cloud computing, AI, and cybersecurity enterprise software.
  8. **Prava Retail**: Nationwide omni-channel supermarket and retail chain.
  9. **Tarang Mobility**: Electric vehicles, high-speed rail, and transit logistics.
  10. **Veda Health**: Pharmaceuticals, biotech diagnostics, and hospital networks.
- **Key Features**:
  - Simulated continuous trading and price mechanics.
  - Order Book (Limit & Market buy/sell orders).
  - Portfolio tracking: Average buy price, current valuation, unrealized P&L.
  - **Capital Gains Tax Engine**: Tax is computed **strictly on net profit** upon trade realization, never on gross proceeds.
  - Data Visualization: Flat, precise financial charts (never 3D or distracting physics).

### 4.6 Shop & Virtual Economy (ARTH Marketplace)
- **Role**: Expressive consumer marketplace powered by ARTH.
- **Audience**: Citizens (`USER`).
- **The 4 Specialized Stores**:
  1. **Pet Store**: 8 official financial companion pets with bounded perks:
     - *Saver Fox* (savings bonus), *Archive Cat* (record discounts), *Flow Otter* (transfer fee rebates), *Wealth Elephant* (FD bonus), *Settlement Crane* (settlement speed), *Tax Tortoise* (tax calculation rebate), *Market Bull* (brokerage rebate), *Ledger Owl* (audit clarity).
     - Strict rule: Pet perks provide modest percentage discounts/rebates; they **never** mint unbounded or free ARTH.
  2. **Avatar Store**: 8 professional persona collectibles (*Analyst, Builder, Businessman/woman, Creator, Entrepreneur, Investor, Retired Investor, Student*).
  3. **Frame Store**: 7 profile badge frames with distinct rarity tiers:
     - **Gold**: `gold.png`
     - **Epic**: `Aurora.png`, `Nova.png`
     - **Rare**: `orbit.png`, `pluse.png`
     - **Normal**: `leaf.png`, `vertex.png`
  4. **Banner Store**: Collectible profile backgrounds across standard rarity tiers.
- **Technical Note**: Shop items feature interactive Three.js 3D previews with guaranteed WebGL error fallbacks.

---

## 5. Design System, Tokens & Anti-AI Standards

### 5.1 Canonical Typography
- **Headings & Display**: **Fraunces** (Warm, distinctive serif with an expressive italic axis; conveys financial gravitas).
- **Body & UI**: **Cantarell** (Humanist sans-serif; optimized for dense data tables, forms, and ledger feeds).
- **Rare Accent / Wordmark**: **Amarante** (Used exclusively for the ARTHAX wordmark and celebratory reward banners; never for UI body or labels).

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cantarell:ital,wght@0,400;0,700;1,400;1,700&family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Amarante&display=swap" rel="stylesheet">
```

### 5.2 Canonical Color Palette (Tokens)

```css
:root {
  /* Brand Primary Palette */
  --color-deep-blue: #3368A0;      /* Primary actions, hero headers, active emphasis */
  --color-soft-blue: #66A3BF;      /* Secondary links, interactive highlights, chart lines */
  --color-sage-mint: #C8DFDB;      /* Soft structural tints, subtle card accents */
  --color-off-white: #F2EFE7;      /* Base page canvas across all six portals */

  /* Brand Accent — Arth Gold */
  --color-arth-gold: #A8742A;      /* Currency badge, active nav marker, reward moments */
  --color-arth-gold-soft: #E9D9BE; /* Muted gold surface fill */

  /* Typography (Charcoal / Ink) */
  --color-ink: #262320;            /* Primary copy, labels, table figures (WCAG AA compliant) */
  --color-ink-soft: #5C574F;       /* Secondary copy, captions, timestamps */

  /* Semantic State Colors */
  --color-positive: #287A55;       /* Financial gains, completed transactions, success */
  --color-loss: #B5482E;           /* Resolved terracotta red: losses, failure, security alerts */
  --color-warning: #A8742A;        /* Pending reviews, warnings */
  --color-info: #496C80;           /* Neutral informational banners */

  /* Font Variables */
  --font-display: 'Fraunces', ui-serif, Georgia, serif;
  --font-body: 'Cantarell', ui-sans-serif, system-ui, sans-serif;
  --font-accent: 'Amarante', cursive;
}
```

### 5.3 Portal Distinctiveness Rule
Every portal must possess a clear leading accent and personality so that **any portal can be recognized in a single screenshot**:
- **Central Guide Board**: Editorial asymmetry, deep blue hero typography, warm ivory canvas.
- **Central Bank Portal**: Deep Blue dominance, formal architectural borders, Arth Gold regulatory seal.
- **Bank Portal**: Commercial blue header, parameterized bank logo and primary brand tint.
- **User Portal**: Clean, calm, cardless balance presentation, warm ink text, gold balance counter.
- **Stock Portal**: Dense financial layout, monochrome typography with green/terracotta delta tickers.
- **Shop**: Rich playful depth, Three.js 3D lighting, card elevations level 3–4.

### 5.4 Anti-AI Design Guardrails (Skill 16)
1. **No Formulaic Skeletons**: Do not default to `Hero → 3-Card Bento → Generic Features → Big CTA`. Construct layouts around authentic domain hierarchy.
2. **Container Overuse Prohibition**: Do not nest cards inside cards inside cards with redundant shadows. Use whitespace, subtle dividers, and typography scales for grouping.
3. **Third-Party Component Re-Theming**: Unmodified Shadcn, React Bits, or Kokonut UI components are strictly forbidden. All components must pass through Component Librarian to receive ARTHAX tokens and rounded-smooth styling.
4. **Complete State Coverage**: Every interactive element must supply: `Default`, `Hover`, `Active`, `Focus`, `Loading`, `Error`, `Empty`, and `Disabled`.
5. **Masked Financial Data**: All account numbers and ARTH balances render masked by default with explicit click-to-reveal.

---

## 6. Asset Library Registry & Exact Mapping Rules

All approved visual assets reside in `assets/`. **Zero Tolerance Rule**: Never fabricate, placeholder-substitute, or generate missing assets. If an asset is missing, **STOP AND ASK THE HUMAN PRODUCT OWNER**.

### 6.1 Brand & Identity (`assets/brand/`)
- `currency_symbol.png`: The official ARTH currency glyph.
- `favicon.png`: System-wide favicon.
- `primary_watermark.png`, `watermark_2.png`, `watermark_3.png`: Editorial background watermarks.

### 6.2 Portal Hero Imagery (`assets/portals/`)
- `central_guide.png`: Central Guide Board hero visual.
- `central_bank.png`: Central Bank regulatory visual.
- `banks.png`: Commercial Bank portal visual.
- `user.png`: User Portal dashboard visual.
- `stocks.png`: Stock Portal market visual.
- `shop.png`: Shop marketplace visual.

### 6.3 Commercial Banks (`assets/banks/`)
- `nava_bank.png`: Nava Bank brand emblem.
- `samaya_bank.png`: Samaya Bank brand emblem.
- `setu_bank.png`: Setu Bank brand emblem.
- `sthira_bank.png`: Sthira Bank brand emblem.
- `vayu_bank.png`: Vayu Bank brand emblem.

### 6.4 Transaction State Mapping (9 States → 6 Icons) (`assets/icons/`)
| Ledger State | Canonical Asset | Visual Behavior |
|---|---|---|
| `PENDING`, `VALIDATING`, `AUTHORIZED` | `pending.png` | Soft amber pulse animation |
| `PROCESSING`, `SETTLING` | `processing.png` | Smooth rotating sync motion |
| `FINALYZING` | `finalyzing.png` | Settling checkpoint animation |
| `COMPLETED` | `completed.png` | Solid positive green check |
| `FAILED`, `CANCELLED` | `failed.png` | Terracotta red failure state |
| `REVERSED` | `reversed.png` | Reversal/counter-entry indicator |

### 6.5 Empty States (`assets/illustrations/`)
- No Connected Bank Account: `no_bank_account.png`
- No Ledger Transactions: `no_transactions.png`
- No Active Fixed Deposits: `no_FD.png`
- No Stock Portfolio Holdings: `no_stocks.png`
- Empty Item Inventory: `empty_inventory.png`
- Empty Notification Mailbox: `empty_mailbox.png`

### 6.6 Shop Collections (`assets/shop/`)
- **Pets** (`assets/shop/pets/`): `Archive Cat`, `Flow Otter`, `Ledger Owl`, `Market Bull`, `Saver Fox`, `Settlement Crane`, `Tax Tortoise`, `Wealth Elephant`.
- **Avatars** (`assets/shop/avatars/`): `analyst`, `builder`, `businessman`, `creator`, `entrepreneur`, `investor`, `retired_investor`, `student`.
- **Frames** (`assets/shop/frames/`):
  - **Gold**: `gold.png`
  - **Epic**: `Aurora.png`, `Nova.png`
  - **Rare**: `orbit.png`, `pluse.png`
  - **Normal**: `leaf.png`, `vertex.png`
- **Banners** (`assets/shop/banners/`): Full collection of themed banner backgrounds.

### 6.7 Listed Stock Companies (`assets/stocks/`)
- **Logos** (`assets/stocks/logo/`): `anvik_ind.png`, `arka_energy.png`, `aroha_foods.png`, `jala_water.png`, `kshiti_infra.png`, `meru_capital.png`, `nila_systems.png`, `prava_retail.png`, `tarang_mobility.png`, `veda_health.png`.
- **Banners** (`assets/stocks/banner/`): Header imagery for all 10 companies.

### 6.8 Official Financial Documents (`assets/og/`)
- `fd_certificate.png`: High-value Fixed Deposit certificate.
- `receipt.png`: Transfer / transaction proof receipt.
- `statement.png`: Monthly bank account statement template.
- `statement_confirmation.png`: Official account verification certificate.
- `tax_document.png`: Annual capital gains tax report.
- `trade_confirmation.png`: Stock order execution confirmation slip.

---

## 7. System Architecture & Monorepo Layout

ARTHAX is organized as a Turborepo + pnpm monorepo enforcing Domain-Driven Design (DDD) module boundaries.

```text
arthax/
├── apps/
│   ├── web/                    # Next.js 14+ (App Router, 6 Route Groups)
│   │   ├── app/
│   │   │   ├── (guide)/        # Central Guide Board
│   │   │   ├── (central-bank)/ # Central Bank Portal
│   │   │   ├── (bank)/         # Commercial Bank Portal
│   │   │   ├── (user)/         # User Portal & /mailbox
│   │   │   ├── (stocks)/       # Stock Exchange Portal
│   │   │   └── (shop)/         # Shop & Marketplace
│   │   ├── components/         # Portal-agnostic layout components
│   │   ├── features/           # Domain-specific UI features
│   │   └── providers/          # Auth, Theme, Motion providers
│   └── api/                    # NestJS modular monolith
│       └── src/
│           ├── identity/       # GOV ID, User, Auth, OTP, RBAC
│           ├── ledger/         # Core Double-Entry Ledger, Journal Entries
│           ├── settlement/     # CLS Inter-bank Clearing & Settlement
│           ├── banking/        # Commercial Bank accounts, FDs, Loans
│           ├── central-bank/   # Regulatory registry, policies, charters
│           ├── stocks/         # Order matching, trades, tax computation
│           ├── shop/           # Catalog, pet powers, inventory
│           ├── mailbox/        # Notifications, alerts, messages
│           └── audit/          # Compliance logs, balance reconciliation
├── packages/
│   ├── ui/                     # @arthax/ui — Curated, token-themed UI primitives
│   ├── tokens/                 # @arthax/tokens — Color, typography, motion tokens
│   ├── types/                  # @arthax/types — DB-to-UI shared contract
│   └── validation/             # @arthax/validation — Zod validation schemas
├── config/
│   ├── database/               # PostgreSQL schema (Prisma/Drizzle), seeds, migrations
│   ├── docker/                 # Container configs for local dev and deployment
│   └── docs/                   # Architectural Decision Records (ADRs)
├── .agents/
│   ├── skills/                 # 32 Antigravity workspace skills
│   └── agents/                 # 15 Antigravity specialized agent definitions
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## 8. The 15-Agent Team & 32-Skill System

### 8.1 The 15 Specialized Agents
The engineering effort is divided among 15 distinct specialist agents:

1. **Chief Architect** (`01-chief-architect.md`): Monorepo structure, DDD boundaries, build sequence enforcement.
2. **Backend Engineer** (`02-backend.md`): NestJS domain modules, non-financial CRUD, wiring services to Core Ledger.
3. **Frontend Engineer** (`03-frontend.md`): Next.js route groups, portal pages, consuming `@arthax/ui` and typed APIs.
4. **Financial Engineer** (`04-financial-engineer.md`): Core Double-Entry Ledger, CLS settlement, banking math, stock trading, and tax engines.
5. **Identity & Security** (`05-identity-security.md`): Identity chain, GOV vs Financial password isolation, OTP, RBAC, step-up auth guards.
6. **Database Engineer** (`06-database.md`): Schema migrations, 10-step table creation order, deterministic seeds, `@arthax/types` sync.
7. **Design Director** (`07-design-director.md`): Design tokens, typographic scale, motion orchestration specs, UX state matrices.
8. **Anti-AI Reviewer** (`08-anti-ai-reviewer.md`): Independent forensic review of all UI output; audits against generic layouts and container overuse.
9. **QA Engineer** (`09-qa.md`): Risk-scaled integration tests, E2E test suites, PR gates, WCAG AA accessibility verification.
10. **Financial Auditor** (`10-financial-auditor.md`): Independent verification of ledger balance integrity ($\sum \text{Debits} = \sum \text{Credits}$), CLS reconciliation.
11. **DevOps Engineer** (`11-devops.md`): Docker environments, CI/CD caching, automated ledger imbalance alerting.
12. **Documentation Agent** (`12-documentation.md`): Architectural Decision Records (ADRs), onboarding guides, API specifications.
13. **Integration Specialist** (`13-integration.md`): Cross-portal seam verification, unified single session experience, cross-domain notifications.
14. **Motion & 3D Specialist** (`14-motion-3d-specialist.md`): GSAP timelines, Three.js shop previews, Anime.js micro-interactions.
15. **Component Librarian** (`15-component-librarian.md`): Re-theming third-party patterns (Shadcn, React Bits, Kokonut) into `@arthax/ui`.

### 8.2 The 32 Modular Skills Matrix
All skills are located in `.agents/skills/`:

| Skill ID & Folder | Name | Primary Owner | Scope |
|---|---|---|---|
| `01-architecture` | `architecture` | Chief Architect | Monorepo layout, module boundary invariants. |
| `02-project-planning` | `project-planning` | Chief Architect | 14-phase build sequencing, database creation order. |
| `03-backend-engineering` | `backend-engineering` | Backend Engineer | NestJS DDD architecture, service wiring. |
| `04-financial-ledger` | `financial-ledger` | Financial Engineer | Double-entry ledger, transaction state machine. |
| `05-settlement-cls` | `settlement-cls` | Financial Engineer | Central settlement layer, inter-bank clearing. |
| `06-banking-domain` | `banking-domain` | Financial Engineer | Commercial banks, FDs, loans, interest models. |
| `07-investment-market` | `investment-market` | Financial Engineer | Stock order matching, trades, portfolio valuation. |
| `08-tax-financial-rules` | `tax-financial-rules` | Financial Engineer | Profit-based capital gains tax, banking fees. |
| `09-identity-authentication` | `identity-authentication` | Identity & Security | GOV ID, OTP verification, session management. |
| `10-security` | `security` | Identity & Security | Dual passwords, step-up auth, RBAC guards. |
| `11-audit-compliance` | `audit-compliance` | Financial Auditor | Regulatory reporting, audit log specifications. |
| `12-database-engineering` | `database-engineering` | Database Engineer | Schema migrations, append-only constraints. |
| `13-data-modeling` | `data-modeling` | Database Engineer | Entity relationships, `@arthax/types` contracts. |
| `14-frontend-engineering` | `frontend-engineering` | Frontend Engineer | Next.js portal route groups, stateful components. |
| `15-design-system` | `design-system` | Design Director | Atomic components, design system architecture. |
| `16-anti-ai-design` | `anti-ai-design` | Anti-AI Reviewer | Forensic anti-AI checklist (pre and post-build). |
| `17-motion-gsap` | `motion-gsap` | Motion & 3D Specialist | GSAP scroll reveals, page transition timelines. |
| `18-ux-interaction` | `ux-interaction` | Design Director | 8-state component matrices, specialized patterns. |
| `19-testing-qa` | `testing-qa` | QA Engineer | Integration suites, domain-risk test scaling. |
| `20-financial-verification` | `financial-verification` | Financial Auditor | Raw entry stream re-derivation, CLS audit. |
| `21-accessibility` | `accessibility` | QA & Design Director | WCAG AA compliance, focus rings, reduced motion. |
| `22-devops` | `devops` | DevOps Engineer | Docker compose, CI pipelines, secret safety. |
| `23-observability` | `observability` | DevOps Engineer | Real-time ledger imbalance paging, error metrics. |
| `24-code-quality` | `code-quality` | QA Engineer | PR-gate checklist, linting, architectural guards. |
| `25-documentation` | `documentation` | Documentation Agent | ADR authorship, README maintenance, API specs. |
| `26-3d-webgl-engineering` | `3d-webgl-engineering` | Motion & 3D Specialist | Three.js Shop item previews, WebGL fallbacks. |
| `27-ambient-motion-vanta` | `ambient-motion-vanta` | Motion & 3D Specialist | Subtle Guide landing ambient motion (landing only). |
| `28-component-library-curation`| `component-library-curation`| Component Librarian | Rebuilding third-party patterns in `@arthax/ui`. |
| `29-micro-interaction-anime` | `micro-interaction-anime`| Motion & 3D Specialist | Numerical counters, subtle button feedback. |
| `30-awwards-designer` | `awwwards-designer` | Creative Reviewer | SOTD-caliber visual polish, typography mastery. |
| `31-arthax-design-tokens` | `arthax-design-tokens` | Design Director | Canonical color, font, and spacing tokens. |
| `32-material-rounded-smooth` | `material-rounded-smooth` | Design Director | Elevation levels, radii curves, easing curves. |

---

## 9. 14-Phase Implementation Roadmap

The system must be constructed in strict dependency order:

- **Phase 0 — Local Environment**: Docker, Postgres, pnpm, toolchains.
- **Phase 1 — Monorepo Foundation**: Turborepo, packages scaffolding, DDD boundaries.
- **Phase 2 — Core Identity & Auth**: GOV ID, Email OTP, dual passwords, sessions, RBAC.
- **Phase 3 — Core Ledger + CLS**: Double-entry journal engine, transaction states, CLS settlement.
- **Phase 4 — Design System Foundation**: Design tokens, `@arthax/ui` primitives, Anti-AI review gate.
- **Phase 5 — Banking Domain**: 5 commercial banks, accounts, FDs, loans, bank operations.
- **Phase 6 — User Portal**: Personal dashboard, net worth, transfers, bank switcher.
- **Phase 7 — Stock Market & Tax**: 10 companies, order book, trade execution, profit tax engine.
- **Phase 8 — Shop & Virtual Economy**: Pet store, avatars, frames, banners, ARTH checkout.
- **Phase 9 — Mailbox & Notifications**: Central messaging hub at `/mailbox`.
- **Phase 10 — Financial Audit & Compliance**: Independent ledger re-derivation, CLS audit.
- **Phase 11 — ARTHAX World Integration**: Cross-portal seamless session and data flow verification.
- **Phase 12 — QA & Accessibility**: E2E suites, WCAG AA compliance audit.
- **Phase 13 — DevOps & Hardening**: CI/CD pipelines, automated ledger alerts, production ADRs.

---

## 10. Stitch MCP UI Workflow & Component Protocol

When the user provides the **Stitch MCP connection**, all UI generation, design inspection, and screen iteration will follow this rigorous protocol:

### 10.1 UI Generation Workflow
```text
User / Task Spec
       ↓
Design Director Specs Tokens & Layout
       ↓
Stitch MCP Generates / Modifies UI Screen
       ↓
Component Librarian Filters Primitives into @arthax/ui
       ↓
Anti-AI Reviewer Forensic Audit Gate
       ↓
Final React/Next.js Code in apps/web
```

### 10.2 Mandatory Constraints for Stitch MCP Prompts
Whenever feeding prompts or tasks into Stitch MCP:
1. **Enforce Canonical Tokens**:
   - Palette: Deep Blue (`#3368A0`), Soft Blue (`#66A3BF`), Sage Mint (`#C8DFDB`), Off-White (`#F2EFE7`), Arth Gold (`#A8742A`), Ink (`#262320`), Terracotta Loss (`#B5482E`).
   - Fonts: Fraunces (Headings), Cantarell (Body/Tables).
2. **Inject Real Assets**:
   - Use absolute paths or asset registry references to `assets/` (e.g., specific bank logos, empty states, transaction icons).
   - Never allow Stitch MCP to generate placeholder wireframe boxes or random generic images.
3. **Specify Explicit States**:
   - Every screen layout must demonstrate handling for default, loading, empty, and error states.
4. **Enforce Cardless Narrative**:
   - Prompts must instruct Stitch MCP: *"Do not wrap every metric in a card. Use editorial spacing, asymmetric typography, and high-contrast numerical hierarchy."*
