# **ARTHAX Ecosystem Architecture**

This document outlines the unified monorepo structure for **ARTHAX**, a comprehensive financial ecosystem. The architecture is designed for extreme scalability, modularity, and high-performance frontend/backend separation using a Turbo-powered workspace.

# **1\. Project Visual Structure**

arthax/

├── apps/

│   ├── web/                         \# Next.js Application (Portals & Shop)

│   │   ├── app/

│   │   │   ├── (public)/            \# Unauthenticated routes & Guide

│   │   │   ├── (auth)/              \# Identity management (Login/Reg)

│   │   │   ├── user/                \# User Portal

│   │   │   ├── central-bank/        \# Central Bank Oversight Portal

│   │   │   ├── banks/               \# Commercial Bank Portal

│   │   │   ├── stocks/              \# Trading & Market Portal

│   │   │   └── shop/                \# Customization & Inventory

│   │   ├── components/              \# Modular UI library (Atomic Design)

│   │   ├── features/                \# Domain-specific business logic

│   │   ├── hooks/                   \# Custom React hooks

│   │   ├── lib/                     \# Utility functions & SDKs

│   │   ├── providers/               \# Context & State providers

│   │   └── styles/                  \# Global CSS & Tailwind config

│   │

│   └── api/                         \# NestJS Backend (Core Engine)

│       └── src/

│           ├── identity/            \# Auth & RBAC logic

│           ├── central-bank/        \# Regulatory & Settlement logic

│           ├── ledger/              \# Core Transactional Engine

│           ├── stocks/              \# Market data & Trade execution

│           └── \[modules...\]/        \# Domain-driven NestJS modules

│

├── packages/                        \# Shared Workspace Packages

│   ├── ui/                          \# Shared UI primitives (Shadcn/Custom)

│   ├── design-system/               \# Brand tokens & Themes

│   ├── types/                       \# Shared TypeScript definitions

│   └── validation/                  \# Zod/Class-validator schemas

│

├── config/                          \# Infrastructure & Data Layer

│   ├── database/                    \# Prisma/Drizzle schema & seeds

│   ├── docker/                      \# Containerization configs

│   └── docs/                        \# Architecture & API Specs

│

├── tests/                           \# Global E2E & Integration suites

├── pnpm-workspace.yaml              \# Workspace management

├── turbo.json                       \# Build pipeline optimization

└── README.md                        \# Project onboarding

# **2\. Application Core Modules**

## **A. The Web Application (`apps/web`)**

The frontend leverages Next.js **Route Groups** to isolate complex portals while sharing a unified design system.

| Portal | Core Responsibilities | Key Features |
| :---- | :---- | :---- |
| **User Portal** | Personal Finance Management | Portfolio, Transfers, FD Management, Settings |
| **Central Bank** | Monetary Oversight | Settlement, Regulations, Taxation, Audit Logs |
| **Bank Portal** | Operational Banking | Customer Accounts, Loan Processing, Transactions |
| **Stock Portal** | Capital Markets | Market Live-Feed, Trade Execution, Company Analytics |
| **Shop** | Ecosystem Gamification | Avatars, Frames, Inventory, Virtual Assets |

## **B. The API Backend (`apps/api`)**

The backend is a **Domain-Driven Design (DDD)** NestJS implementation. It serves as the single source of truth for the ledger and regulatory compliance.

* **Identity:** Handles JWT, MFA, and Role-Based Access Control.  
* **Ledger & Settlement:** The high-performance engine for internal and inter-bank clearing.  
* **Market Engine:** Real-time data processing for stocks and valuation.

# **3\. Shared Resources (`packages/`)**

To ensure consistency across the `web` and `api` apps, shared logic is extracted into internal packages:

* **`@arthax/ui`**: A controlled library of React components.  
* **`@arthax/types`**: Shared interfaces that ensure type safety from the Database to the UI.  
* **`@arthax/validation`**: Centralized logic for data integrity (e.g., ensuring a transaction amount is never negative).

# **4\. Infrastructure & DevOps**

* **Database:** Managed under `config/database/` including migrations and deterministic seed data for development.  
* **Documentation:** Stored in `config/docs/` using Markdown, ensuring the technical decisions (ADRs) are version-controlled alongside the code.  
* **Workflows:** GitHub Actions configured in `.github/` for CI/CD, linting, and automated testing.

---

**Architectural Note:** This monorepo utilizes **pnpm** for efficient dependency linking and **Turborepo** to cache builds and tests, ensuring the development experience remains fast even as the codebase grows.

# **5\. ARTHAX Design System v1**

## **1\. Design Philosophy**

**Core feeling:** Trustworthy financial infrastructure with a modern human character.  
**Five principles:** Clear, Calm, Precise, Distinctive, Human.  
**Avoid:** Futuristic, Neon, Over-glossy, Glass-heavy, Template-like.

## **2\. Color System**

**Primary Palette:**

* Deep Blue: \#3368A0  
* Soft Blue: \#66A3BF  
* Sage Mint: \#C8DFDB  
* Off White: \#F2EFE7

**ARTHAX Brand Accent (Arth Gold):**

* Arth Gold: \#A8742A  
* Arth Gold Soft: \#E9D9BE

(Use selectively for active states, financial figures, brand details, selected navigation, and rewards.)

### **Semantic Colors**

* Positive: \#287A55  
* Negative: \#B94A43  
* Warning: \#A8742A  
* Info: \#496C80

## **3\. Dark Mode**

Not the primary identity. Light mode is the primary visual language.

## **4\. Typography**

* **Primary:** Fraunces.  
* **Secondary:** Cantarell.  
* **Hierarchy:** Contextual ranges (Display 48–64px, Page Heading 32–40px, Section Heading 22–28px, Card Heading 16–20px, Body 14–16px, Supporting 13–14px, Micro 11–12px). Use contextual variation rather than rigid scales.

## **5\. Spacing & Border Radius**

* **Spacing:** Scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96). Apply contextually (e.g., dense tables vs. hero sections).  
* **Border Radius:** Hierarchical (4px compact, 8px inputs, 12px buttons, 16px panels, 20px containers, 24px hero).

## **6\. Visual Identity & Components**

* **Shadows:** Restrained (Shadow 1-3). Prioritize border \+ contrast.  
* **Containers:** Only use when providing meaningful grouping.  
* **Tables:** Optimize for readability on desktop.  
* **Icons:** Use Lucide but vary by context, size, and role.  
* **ARTHAX Motifs:** Subtle geometric marks based on 'Artha/Flow' for loading states, empty states, and dividers.  
* **Components:** Specialized components (e.g., AccountBalance, BankSwitcher) over generic cards.  
* **States:** Define full state-logic (Default, Hover, Active, Loading, etc.) for all components.  
* **Animation:** Use GSAP/Motion via shared package; prioritize physical, precise, and soft motion.

## **7\. Accessibility & Tokens**

* **Accessibility:** WCAG AA contrast, keyboard focus, reduced motion, semantic HTML.  
* **Tokens:** Centralized semantic tokens (e.g., surface-primary, text-primary, border-subtle) instead of hardcoded values.

**Design Identity:** Warm light surfaces \+ restrained Arth Gold \+ charcoal typography \+ contextual layouts \+ subtle geometry \+ precise motion \+ strong financial information hierarchy. Consistency in system, variation in composition.

# **6\. ARTHAX Identity & Authentication**

## **6.1 Identity Hierarchy & Rules**

* **Identity Anchor**: The GOV ID serves as the primary unique anchor, mapped 1:1 with an email address.  
* **User Identity**: The ARTHAX User is the primary financial identity, linked 1:1 to the GOV ID.  
* **Relationships**:  
  * 1 Email ↔ 1 GOV ID  
  * 1 GOV ID ↔ 1 ARTHAX User  
  * 1 ARTHAX User ↔ Many bank accounts

## **6.2 Authentication Flows**

* **Registration**: Email Verification (OTP) → GOV ID Creation → GOV Password.  
* **Main Account Setup**: Post-registration, the user establishes a **Financial Password** (separate from GOV password) and selects an initial banking purpose (e.g., Salary, Savings, Investment) which dictates bank recommendations.  
* **Session Model**: A unified session persists across all portals (User, Bank, Stocks, Shop). Step-up authentication (Financial Password \+ OTP/MFA) is strictly required for sensitive actions.

## **6.3 Security Architecture**

* **Credential Separation**:  
  * **GOV Password**: Used for identity and general account access.  
  * **Financial Password**: Required exclusively for high-value operations (transfers, stock trades, FD creation).  
* **Administrative Access**: Portals for Central Bank and Commercial Banks are restricted to pre-provisioned, non-public credentials.

## **6.4 Identity Entities (Data Layer)**

* **GOV\_ID**: gov\_id, email, password\_hash, email\_verified, status.  
* **USER**: user\_id, gov\_id, financial\_password\_hash, status.  
* **BANK\_CUSTOMER**: user\_id, bank\_id, customer\_id, joined\_at.  
* **BANK\_ACCOUNT**: account\_id, user\_id, bank\_id, account\_type, purpose, status.

## **6.5 Initial Role-Based Access Control (RBAC)**

* **User**: Standard individual portal access.  
* **Central Bank Admin**: Regulatory oversight and settlement management.

**Bank Admin**: Commercial bank operational management.

# **7\. ARTHAX Database Schema**

## **7.1 Tables by Domain**

* **Identity:** GOV\_ID, USER, SESSION, MFA\_TOKEN  
* **Banking:** BANK, BANK\_CUSTOMER, BANK\_ACCOUNT, BENEFICIARY  
* **Ledger:** LEDGER\_ENTRY, TRANSACTION\_BATCH, INTERNAL\_SETTLEMENT  
* **Fixed Deposits:** FD\_SCHEME, USER\_FD, INTEREST\_PAYOUT\_LOG  
* **Central Bank:** REGULATORY\_POLICY, INTERBANK\_CLEARING, TAX\_RULE  
* **Stocks:** STOCK\_TICKER, ORDER\_BOOK, USER\_PORTFOLIO, TRADE\_HISTORY  
* **Shop:** SHOP\_ITEM, USER\_INVENTORY, TRANSACTION\_SHOP  
* **Rewards:** REWARD\_CAMPAIGN, USER\_POINTS, REDEMPTION\_LOG  
* **Communication:** NOTIFICATION, OTP\_LOG, IN\_APP\_MESSAGE  
* **Audit:** SYSTEM\_LOG, COMPLIANCE\_REPORT, SECURITY\_EVENT

## **7.2 Creation Order & Dependencies**

1. 1\. Core Identity (GOV\_ID, USER)  
2. 2\. Financial Entities (BANK, CENTRAL\_BANK)  
3. 3\. Customer Relationships (BANK\_CUSTOMER, BANK\_ACCOUNT)  
4. 4\. Core Ledger (LEDGER\_ENTRY)  
5. 5\. Transactional Layer (TRANSACTIONS)  
6. 6\. Specialized Banking (FIXED\_DEPOSITS, LOANS)  
7. 7\. Market Infrastructure (STOCKS, PORTFOLIO)  
8. 8\. Gamification (SHOP, REWARDS)  
9. 9\. Support Systems (COMMUNICATION, NOTIFICATIONS)  
10. 10\. Oversight Layer (AUDIT, COMPLIANCE)

# **8\. Core Financial Ledger Architecture**

The Ledger is the single source of truth for all money movement in ARTHAX, operating on the principle of a single, unified currency system (ARTH).

## **8.1 Key Ledger Components**

* **Accounts**: Financial accounts represented in the ledger (e.g., Bank Savings, Tax Account, Central Settlement).  
* **Ledger Accounts**: Internal identifiers for every money-holding entity (User, Bank, Market, Tax Authority).  
* **Transactions**: Represents the business event (e.g., USER\_TRANSFER, STOCK\_BUY).  
* **Transaction Entries**: The atomic double-entry records. A single transaction may involve multiple entries (Debits/Credits) that must balance (Total Debits \= Total Credits).  
* **Settlements**: Distinct from the transaction; tracks the reconciliation and clearing state between banks (e.g., CLS/Clearing).  
* **Balance Snapshots**: Fast-access cached balances, rebuilt/reconciled from the ledger.

## **8.2 Transaction Lifecycle**

Transactions follow a strict state machine:  
PENDING → VALIDATING → AUTHORIZED → PROCESSING → SETTLING → COMPLETED (or FAILED/REVERSED/CANCELLED).

## **8.3 Architectural Rules**

* **Single Source of Truth**: Never mix ledger systems; all operations (Banking, Stocks, Shop, Rewards) share the same CORE LEDGER.  
* **Double-Entry Integrity**: Every transaction must be balanced.  
* **Separation**: Keep ledger logic distinct from UI or bank-specific tables.

# **9\. ARTHAX Portal Architecture**

The ARTHAX ecosystem is divided into six primary portals, each serving a specific domain within the financial world while remaining connected via a unified core.

1. **Central Guide Board (Public Entry):** Information and Navigation (What is ARTHAX, How it works, Central Bank, Banks, Stocks, Shops).  
2. **Central Bank Portal (Highest Authority):** Overview, Bank Registry, Approval, Monitoring, CLS/Settlement, Rules (Financial/Tax/Stock), Audit.  
3. **Bank Portal (Operational):** Overview, Customers, Accounts, Transactions, FDs, Loans, Products, Settings. (Note: Same architecture serves Bank A, B, and C).  
4. **User Portal (Personal Finance):** Overview, My Banks, Accounts, Transfers, FDs, Stocks, Rewards, Mailbox, Shop, Settings. (One-login unified experience).  
5. **Stock Portal (Market):** Market, Companies, Stock Details, Buy/Sell, Orders, Portfolio, Profit/Tax.  
6. **Shop (Marketplace):** Home, Pet Store, Avatar Store, Frame Store, Banner Store, Inventory (Uses ARTH only).

## **9.1 Connectivity & Experience**

Underneath the specialized interfaces, the Core Ledger, Identity/Auth, Notifications, and Audit systems are shared infrastructure rather than separate portal-specific logic. It is essential that the user perceives the ecosystem as a single, unified **"ARTHAX World"** rather than six disconnected applications.  
**Core Data Backbone:**

# **10\. Feature Specifications**

## **10.1 Identity & Authentication**

* **GOV ID:** Email registration, One Email ↔ One GOV ID, OTP verification, GOV ID generation, GOV password creation, Uniqueness, Status management, Forgot password flows.  
* **ARTHAX User Identity:** One GOV ID ↔ One ARTHAX User, Financial password creation/reset (separate from GOV password), unified session management, secure logout.  
* **Sensitive Actions:** Financial password required for transfers, stock trades, FD ops, shop/gift purchases. Step-up verification for high-risk actions.

## **10.2 User Portal & Banking**

* **Dashboard:** Net worth, total balances (Bank/FD/Stock), recent activity, quick actions.  
* **Bank Management:** Add/remove banks, select by purpose (Salary/Savings/Investment), switch active bank, view products.  
* **Account Management:** Create accounts by purpose, view balances, account history, status, limits.  
* **Money Management:** Own-account/User-to-user transfers, consolidated activity view.

## **10.3 Core Financial Engine**

* **Central Settlement Layer (CLS):** Inter-bank routing, debit/credit processing, settlement records, failed settlement handling, reconciliation.  
* **Core Ledger:** Double-entry integrity (Total Debits \= Total Credits), transaction lifecycle (Pending, Validating, Authorized, Processing, Settling, Completed, Failed, Reversed, Cancelled), snapshot management.

## **10.4 Central Bank Portal**

* **Oversight:** Dashboard (Banks, accounts, volume, circulation), Bank registry (Apply/Approve/Suspend/Close), Monitoring (Health, risk, reports).  
* **Rules:** Financial policy, interest rates, reserve requirements, transaction limits, tax/investment rules, CLS management, audit trail.

## **10.5 Market & Gamification**

* **Stock Portal:** Market live-feed, trading sessions, company listings, buy/sell orders, portfolio management, profit/tax calculation.  
* **Shop:** Specialized stores (Pets, Avatars, Frames, Banners), Inventory management, Pet powers (active financial modifiers), use of ARTH currency exclusively.  
* **Rewards:** Task-based earnings (paid in ARTH), milestones, reward transaction history.

## **10.6 Support & Operations**

* **Communication:** Centralized Mailbox (Central Bank/Bank/Market/System messages), priority/read-status.  
* **Notifications:** Transaction, security, FD maturity, trade, and announcement alerts.  
* **Audit & Security:** Comprehensive tracking (Logins, transfers, admin actions, system events), session management, rate limiting, account locks.

## **10.7 UX & Future Readiness**

* **Responsive Design:** Skeleton states, error/retry handling, success states, keyboard accessibility.  
* **Future GOV Extensibility:** Prepared for later expansion into citizen services, employment, and government taxation (distinct from current ARTHAX build).

GOV Identity → ARTHAX User → Bank Customer → Bank Account → Ledger → Transactions