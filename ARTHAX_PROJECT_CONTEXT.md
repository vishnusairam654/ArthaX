# ARTHAX — Project Context & Build Instructions

## 1. What ARTHAX Is

ARTHAX is a fictional digital financial ecosystem / financial-world simulation.

It is not a simple banking dashboard. It is a connected financial world containing a Central Bank, multiple commercial banks, a unified user identity, a centralized stock market, a single ARTH currency, a virtual shop economy, rewards, notifications, and a core financial ledger.

The product should feel like **one coherent financial world**, not six unrelated websites.

---

## 2. Core Concept

The identity chain is:

```text
Email
  ↓
GOV ID
  ↓
ARTHAX User
  ↓
Multiple Bank Accounts
  ↓
Unified Financial World
```

Important rules:

- One Email → One GOV ID.
- One GOV ID → One ARTHAX User.
- One ARTHAX User → Many bank relationships/accounts.
- The user has one main login across all banks.
- Banks do not require separate user passwords.
- Users choose banks/accounts based on purpose.
- Users are not automatically given accounts in every bank.
- GOV itself is currently out of scope except for identity/GOV ID requirements.

---

## 3. Current Product Scope

There are six actual portals:

1. Central Guide Board
2. Central Bank Portal
3. Bank Portal
4. User Portal
5. Stock Portal
6. Shop

Shared systems such as Identity/Auth, Core Ledger, CLS, Notifications, Audit, Database and Design System are infrastructure, not separate portals.

---

# 4. Portal Responsibilities

## 4.1 Central Guide Board

Public entry point and orientation layer.

Responsibilities:
- Explain ARTHAX
- Explain how the financial world works
- Explain banking
- Explain multiple banks
- Explain ARTH currency
- Explain stock market
- Explain shop
- Explain rules and policies
- Link to all main portals
- Show important public announcements/information

The Guide Board is informational/navigation focused.

---

## 4.2 Central Bank Portal

The highest financial authority in the ARTHAX world.

Responsibilities:
- Bank registry
- New bank registration/application
- Bank approval
- Bank rejection
- Bank suspension
- Bank closure
- Bank monitoring
- Financial policies
- Interest-rate rules
- Reserve/financial rules
- Transaction rules
- Tax rules
- Stock market administration
- CLS / settlement oversight
- Financial reports
- Audit and regulatory records

Central Bank and GOV are separate entities. GOV is not part of the current Central Bank implementation.

---

## 4.3 Bank Portal

Operational portal for individual commercial banks.

Initial world contains approximately 4–5 fictional banks.

The same portal architecture is reused for all banks; bank context determines the data.

Responsibilities:
- Bank dashboard
- Customers
- Customer accounts
- Account types
- Account purposes
- Transactions
- Fixed deposits
- Loans
- Interest rates
- Fees
- Limits
- Bank products
- Bank configuration
- Bank announcements
- Reports

New banks require Central Bank approval.

Bank admin access is private and pre-provisioned. Users cannot self-register as bank administrators.

---

## 4.4 User Portal

Unified personal financial dashboard.

Responsibilities:
- Total ARTH
- Total net worth
- All bank balances
- Connected banks
- Bank switching
- Account management
- Transfers
- Fixed deposits
- Stock portfolio
- Rewards
- Mailbox
- Notifications
- Shop access
- Profile/settings

The user stays inside one main session when switching between banks.

---

## 4.5 Stock Portal

Centralized capital market.

Responsibilities:
- Market overview
- Company listings
- Stock details
- Stock prices
- Search
- Trading sessions
- Buy/sell orders
- Trades
- Order history
- Portfolio
- Holdings
- Profit/loss
- Investment history
- Investment taxation

The Stock Portal is centrally managed rather than owned by an individual bank.

---

## 4.6 Shop

Virtual marketplace using the same ARTH currency as banking and investing.

Separate stores:
- Pet Store
- Avatar Store
- Frame Store
- Banner Store
- Future specialized stores

Shop purchases use ARTH directly.

There are NO separate coins or tokens.

---

# 5. Currency — ARTH

ARTHAX has exactly one currency:

**ARTH**

ARTH is used everywhere:
- Bank balances
- Transfers
- Fixed deposits
- Stock trading/value
- Taxes
- Rewards
- Shop purchases
- Pets
- Avatars
- Frames
- Banners
- Gifts

Do not introduce:
- Coins
- Tokens
- Shop-only currency
- Secondary reward currency

All financial and shop value uses ARTH.

The exact decision about fractional ARTH units should be made before the ledger numeric type is finalized. Do not silently invent fractional rules.

---

# 6. Identity & Authentication

## 6.1 GOV ID Registration

Flow:

```text
Email
 ↓
OTP sent to email
 ↓
Verify OTP
 ↓
Create GOV ID
 ↓
Create GOV password
 ↓
GOV identity created
```

Rules:
- One email can have one GOV ID.
- GOV ID is unique.
- Email verification is mandatory.
- GOV password is for identity/general account access.

## 6.2 ARTHAX Main Banking Login

After GOV ID creation:

```text
GOV ID
 ↓
ARTHAX User
 ↓
Financial password setup
 ↓
Choose primary banking purpose
 ↓
Recommended bank/account
 ↓
Create first bank account
```

Possible first-account purposes:
- Salary
- Savings
- Daily spending
- Business
- Investment
- Fixed Deposit
- Other

The user is not given all bank accounts by default.

## 6.3 Financial Password

Financial password is separate from GOV password.

It is used for sensitive actions such as:
- Money transfers
- Stock trades
- FD operations
- Shop purchases
- Gift purchases
- Other high-risk financial actions

Forgot-password flow:

```text
GOV ID / registered email
 ↓
OTP to registered email
 ↓
Verification
 ↓
Reset password
```

High-risk operations may require step-up authentication using Financial Password + OTP/MFA.

## 6.4 Admin Authentication

Central Bank and commercial Bank admin portals are private.

Rules:
- No public admin registration.
- Credentials are pre-provisioned and controlled by the project owner.
- Only authorized credentials can access these portals.

Initial roles:
- USER
- CENTRAL_BANK_ADMIN
- BANK_ADMIN

More roles may be added later if required.

---

# 7. Banking Model

A user can have multiple banks and multiple accounts.

Example:

```text
ARTHAX User
├── Bank A → Salary Account
├── Bank B → Savings Account
├── Bank C → Fixed Deposit
└── Bank D → Business/Current Account
```

The user can:
- Add a new bank
- Choose purpose
- See recommended account/bank options
- Create the account
- Switch bank context
- View balances
- Transfer money

No separate bank login is created for the user.

---

# 8. Core Financial Ledger

The Core Financial Ledger is the single source of truth for all ARTH money movement.

ALL of these must use the same ledger:
- Banking
- User transfers
- Inter-bank transfers
- Fixed deposits
- Stocks
- Taxes
- Shop purchases
- Rewards

Core concepts:
- Financial accounts
- Ledger accounts
- Transactions
- Transaction entries
- Debits
- Credits
- Settlements
- Balance snapshots
- Reconciliation

## Double-entry rule

Every completed transaction must balance:

```text
Total Debits = Total Credits
```

Never create a second money system for the Shop, Stocks or Rewards.

---

# 9. Transaction Lifecycle

Core states:

```text
PENDING
→ VALIDATING
→ AUTHORIZED
→ PROCESSING
→ SETTLING
→ COMPLETED
```

Alternative/terminal states:
- FAILED
- REVERSED
- CANCELLED

The system must preserve financial integrity across all states.

---

# 10. CLS — Central Settlement Layer

CLS handles inter-bank clearing and settlement.

Example:

```text
Bank A
  ↓
CLS
  ↓
Bank B
```

Responsibilities:
- Inter-bank transfer routing
- Clearing
- Settlement
- Settlement status
- Failed settlement handling
- Reconciliation
- Reversal handling
- Settlement records

CLS is separate from the UI and separate from bank-specific tables.

---

# 11. Money Transfer

Supported flows:

### User → User
```text
User A
 ↓
Bank A
 ↓
CLS (if required)
 ↓
Bank B
 ↓
User B
```

### User → Own Account
```text
Bank A Account
 ↓
CLS / transfer engine if required
 ↓
Bank B Account
```

The user can manage all money from one unified page.

---

# 12. Fixed Deposits

Features:
- FD products
- Different rates by bank
- Compare FD options
- Choose amount
- Choose duration
- Create FD
- Interest calculation
- Interest records
- Maturity date
- Maturity amount
- Maturity notifications
- Early withdrawal rules
- FD history

---

# 13. Loans

Bank Portal can support:
- Loan products
- Loan applications
- Approval
- Disbursement
- Interest rates
- Repayment
- Loan status
- Loan history

Loans should use the same ARTH financial ledger.

---

# 14. Stock Market

The stock market is fictional and centrally managed.

Initial data can be simulated; no real market data dependency is required for the core product.

Features:
- Company listings
- Stock listings
- Prices
- Market status
- Search
- Buy
- Sell
- Orders
- Trades
- Holdings
- Portfolio value
- Profit/loss
- Trading history
- Investment tax calculation

---

# 15. Stock Tax

Tax is applied to investment PROFIT, not the entire sale value.

Example:

```text
Buy = 100,000 ARTH
Sell = 130,000 ARTH
Profit = 30,000 ARTH
Tax applies to the 30,000 profit
```

Support:
- Short-term investment rules
- Long-term investment rules
- Profit calculation
- Taxable profit
- Net profit

---

# 16. Rewards & Tasks

Users can earn ARTH through controlled activities.

Features:
- Daily tasks
- Weekly tasks
- Monthly tasks
- Milestones
- Bonuses
- Financial education activities
- Special events
- Reward history
- Reward transactions

Rewards are paid in ARTH.

---

# 17. Shop & Gamification

The Shop is the most playful area of ARTHAX.

Stores:
- Pet Store
- Avatar Store
- Frame Store
- Banner Store

The Shop should still share the ARTHAX system identity but may be more expressive than banking screens.

## Rarity system

If rarity is used, do not introduce new hues outside the ARTHAX palette.

Use existing palette through weight/treatment:
- Normal
- Rare
- Epic
- Gold

Gold should remain the highest-value treatment.

---

# 18. Official Pets

The current official 8 pets are:

1. Saver Fox
2. Archive Cat
3. Flow Otter
4. Wealth Elephant
5. Settlement Crane
6. Tax Tortoise
7. Market Bull
8. Ledger Owl

Each pet has a financial-persona identity.

Each pet should have:
- icon
- thumbnail
- main image

One active pet → one active financial power.

Examples of possible powers:
- FD interest bonus
- Tax/fee reduction
- Other controlled modifiers

Pets must never generate uncontrolled or unlimited money.

---

# 19. Avatar Store

Avatar system is persona-based, not random artwork.

Current personas include:
- Analyst
- Builder
- Businessman / Businesswoman
- Creator
- Entrepreneur
- Investor
- Retired Investor
- Student

The avatar system should feel like a coherent ARTHAX collectible/profile system.

---

# 20. Frames

Current frame collection includes:
- Aurora
- Gold
- Leaf
- Nova
- Orbit
- Pulse
- Vertex

Frame treatment should remain consistent with ARTHAX tokens.

---

# 21. Profile Banners

Banners are collectible profile assets.

Current library has multiple rarity tiers:
- Normal
- Rare
- Epic
- Gold

Do not invent new colors just for rarity.

---

# 22. Mailbox & Notifications

Mailbox is a shared user-facing communication system, not a separate portal.

Sources can include:
- Central Bank
- Bank
- Stock Market
- ARTHAX System
- Rewards
- Security

Examples:
- Transfer received
- Security alert
- Reward unlocked
- FD maturity
- Market alert
- Central announcement
- Shop purchase

---

# 23. Empty States

Existing specific empty-state assets are:
- no_bank_account.png
- no_transactions.png
- no_FD.png
- no_stocks.png
- empty_inventory.png
- empty_mailbox.png

Rules:
- Use the correct illustration for the correct screen.
- Do not replace these with generic "No data found" states.
- Empty state must have useful copy.
- Add CTA only when a real next action exists.
- Empty-state animation should be subtle.

---

# 24. Transaction Status UI

Existing transaction-status assets cover:
- Completed
- Failed
- Finalyzing / Settling
- Pending
- Processing
- Reversed

The internal ledger may also have Validating, Authorized and Cancelled.

For user-facing UI, these may be collapsed into the closest existing visual state unless a full timeline view is intentionally designed.

Always keep the UI aligned with the real ledger state machine.

---

# 25. Design Direction

ARTHAX must NOT look AI-generated, template-generated, or vibe-coded.

Core visual feeling:
- Clear
- Calm
- Precise
- Distinctive
- Human

Avoid:
- Generic SaaS layouts
- Excessive card grids
- Excessive bento patterns
- Purple/indigo AI aesthetic
- Neon
- Heavy glassmorphism
- Generic 3D blobs
- Synthetic stock photography
- Uniform rounded cards everywhere
- Formulaic AI marketing copy
- Generic iconography everywhere
- Shallow interaction states

The Anti-AI skill is mandatory before and after frontend work.

---

# 26. Layout Rules

Repeated data is allowed to use repeated structures:
- Stock rows
- Transaction rows
- Bank listings
- Shop inventory

Narrative/single-focus content should not automatically become card grids:
- Guide hero
- Portal introduction
- Balance/wealth moment
- Onboarding
- Empty states
- Important financial moments

Use context-appropriate layouts such as:
- Full-bleed editorial
- Asymmetric grid
- Oversized typography
- Horizontal galleries
- Split-screen sticky areas
- Tickers
- Layered depth
- Mask/reveal imagery

Do not force asymmetry where repeated data genuinely needs repetition.

---

# 27. Motion Rules

Motion should communicate change, hierarchy and interaction.

Do not animate everything.

Motion may include:
- Portal transitions
- Balance count-up
- Bank switching
- Transfer flow
- Settlement flow
- Stock trade feedback
- FD creation
- Shop reveal
- Hover feedback
- Loading states
- Empty states

Use GSAP/Motion through the shared animation system.

Respect reduced motion.

The Shop can use stronger reward/reveal motion than financial dashboards.

---

# 28. Design Tokens

Current canonical tokens:

```text
Deep Blue       #3368A0
Soft Blue       #66A3BF
Sage Mint       #C8DFDB
Warm Ivory      #F2EFE7
Arth Gold       #A8742A
Arth Gold Soft  #E9D9BE
Charcoal        #252624
```

Semantic roles should be used instead of scattered raw color values.

Typography currently uses:
- Fraunces for display/headings
- Cantarell for body/UI
- Amarante only for rare decorative/shop moments

Do not change these without an explicit design decision.

Accessibility:
- WCAG AA
- Semantic HTML
- Keyboard focus
- Reduced motion
- Sufficient contrast

---

# 29. Assets

The project has a defined asset library.

Important identity assets:
- ARTH currency symbol
- favicon
- watermarks
- bank logos
- portal images
- stock company logos/banners
- financial document assets
- empty-state illustrations
- transaction-state icons
- shop assets

Asset rule:

**If an ARTHAX-branded asset is required but does not exist, ASK the user. Never silently fabricate or replace it with a random generated/stock asset.**

The asset library should remain coherent and intentional.

---

# 30. Current Asset Gaps / Planned Assets

Known missing or separately planned assets:

1. Compact ARTHAX navigation logo/wordmark
2. Stock negative/loss signal
3. Notification-type icon set if the notification UI requires it
4. True Open Graph/social sharing preview image
5. Generic 404/system-error illustration

Do not create more assets without a concrete screen/use-case need.

---

# 31. Technical Architecture

Current preferred structure:

```text
arthax/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   ├── design-system/
│   ├── animations/
│   ├── types/
│   └── validation/
├── config/
│   ├── database/
│   ├── docker/
│   └── docs/
├── tests/
├── .agents/
│   ├── skills/
│   └── agents/
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

Frontend:
- Next.js
- TypeScript
- Tailwind CSS

Backend:
- NestJS
- TypeScript
- Modular / DDD-oriented monolith initially

Database:
- PostgreSQL
- Prisma

Development infrastructure:
- Docker Desktop
- Local PostgreSQL
- Local Redis when required

Potential shared services:
- Neon
- Upstash
- Resend
- Vercel
- GitHub Actions

Do not prematurely split into microservices.

---

# 32. Database Domains

Recommended logical database domains:

```text
identity
banking
ledger
fixed_deposits
central_bank
stocks
shop
rewards
communication

audit
```

Important identity entities:
- GOV_ID
- USER
- SESSION
- MFA/OTP-related records

Banking entities:
- BANK
- BANK_CUSTOMER
- BANK_ACCOUNT
- BENEFICIARY

Ledger entities:
- LEDGER_ACCOUNT
- TRANSACTION
- TRANSACTION_ENTRY
- SETTLEMENT
- BALANCE_SNAPSHOT

Additional domains:
- FD products/deposits/interest records
- Stock/company/order/trade/portfolio records
- Shop items/inventory/purchases
- Reward campaigns/completions/reward transactions
- Mailbox/notification records
- Audit/security logs

---

# 33. Database Build Order

Build in dependency order:

1. Core Identity
2. Financial entities / banks
3. Customer relationships / bank accounts
4. Core Ledger
5. Transaction and Settlement layer
6. Fixed Deposits and Loans
7. Market / Stocks / Portfolio
8. Shop and Rewards
9. Communication / Notifications
10. Audit / Compliance

Do not build Stock Portal before the core ledger exists.
Do not build Shop money handling outside the core ledger.

---

# 34. Security Rules

Security is part of the product architecture, not a later add-on.

Required concepts:
- Password hashing with Argon2id
- OTP verification
- Session security
- Rate limiting
- Separate GOV and financial authentication concerns
- Step-up authentication for sensitive financial actions
- RBAC
- Secure admin credentials
- Audit logs
- Account locks where appropriate
- No public admin registration
- No secrets committed to repository

---

# 35. Development Phases

## Phase 0 — Local Environment
- Node.js
- pnpm
- Docker
- Git
- Base accounts/services

## Phase 1 — Workspace Scaffold
- Monorepo
- Turborepo
- Next.js web app
- NestJS API
- Shared packages
- Config

## Phase 2 — Core Identity
- GOV ID
- Email OTP
- GOV password
- ARTHAX user
- Financial password
- Sessions
- Security foundation

## Phase 3 — Ledger + CLS
- Core ledger
- Double-entry integrity
- Transactions
- Settlement
- Reconciliation

## Phase 4 — Design System
- Tokens
- Shared UI
- Shapes
- Elevation
- Motion foundation
- Anti-AI visual foundation

## Phase 5 — Banking Domain
- Banks
- Bank accounts
- Customer relationships
- FDs
- Loans
- Bank admin portal

## Phase 6 — User Portal
- Unified dashboard
- Bank management
- Transfers
- FD views
- User financial experience

## Phase 7 — Stocks + Tax
- Market
- Companies
- Orders
- Trades
- Portfolio
- Profit
- Tax rules

## Phase 8 — Shop + Rewards
- Stores
- Pets
- Avatars
- Frames
- Banners
- Inventory
- Rewards

## Phase 9 — Notifications
- Mailbox
- Notifications
- Email events
- Announcements

## Phase 10 — Financial Audit
- Ledger verification
- Transaction integrity
- Settlement checks
- Tax verification

## Phase 11 — ARTHAX World Integration
- Cross-portal workflows
- Identity → banking → ledger → stocks → shop
- Unified user experience

## Phase 12 — QA + Accessibility
- Unit tests
- Integration tests
- E2E
- Accessibility
- Responsive behavior
- Error/retry validation

## Phase 13 — DevOps + Documentation
- CI/CD
- Production deployment
- Monitoring
- Final documentation

Do not jump ahead to future phases unless there is a clear dependency reason.

---

# 36. AI Agent Rules

ARTHAX uses skills and agents.

A **skill** is reusable knowledge/rules.

An **agent** is a worker that applies one or more skills.

Current design/frontend agents:

1. ARTHAX Director
2. ARTHAX Frontend Builder
3. ARTHAX Visual Director
4. ARTHAX Motion Agent
5. ARTHAX Asset Agent
6. ARTHAX Design Auditor

Later backend/financial agents may include:
- Backend Engineer
- Database Engineer
- Financial Engineer
- Security Engineer
- QA/Financial Auditor
- DevOps Engineer

Do not create one agent per feature.

---

# 37. Agent Collaboration Rules

Typical frontend workflow:

```text
User request
 ↓
ARTHAX Director
 ↓
Visual Director / Frontend Builder / Asset Agent
 ↓
Motion Agent
 ↓
Design Auditor
 ↓
Fixes if necessary
 ↓
Accepted result
```

Director should determine scope and delegate.

Builder should implement.

Visual Director should protect the design system.

Motion Agent should add purposeful motion.

Asset Agent should protect asset integrity.

Design Auditor should reject generic/AI-looking output and incomplete UX states.

---

# 38. Anti-AI Design Gate

Every new frontend screen should be checked before and after implementation.

Check for:
- Generic section flow
- Excessive cards
- Excessive bento layout
- Default shadcn appearance
- Generic icons
- Generic copy
- Uniform radius/padding everywhere
- Shallow state handling
- Desktop-first layout failures
- Fake/mock content that looks generic
- Unnecessary decorative effects

A single common pattern is not automatically bad.

The problem is accumulation of many generic patterns together.

Fix the specific issue rather than randomly making the UI irregular.

---

# 39. What AI Agents Must NOT Do

Do not:
- Invent new currencies
- Add random token/coin systems
- Create separate passwords for each bank user account
- Create separate user login systems for every bank
- Make GOV part of the current financial portal system
- Create random extra portals
- Create independent money systems for Stocks or Shop
- Bypass the core ledger
- Modify financial balances without ledger logic
- Fabricate missing ARTHAX assets without asking
- Replace real assets with generic stock/AI assets silently
- Add unnecessary microservices
- Add infrastructure before its phase
- Rewrite the entire application when only one feature was requested
- Introduce arbitrary design colors or fonts without following the canonical tokens
- Use generic AI marketing copy
- Ignore loading/error/retry/empty states
- Skip security or audit requirements for sensitive financial flows

---

# 40. What Agents Should Optimize For

Primary goals:

1. Financial correctness
2. Security
3. Data integrity
4. Clear architecture
5. Domain-specific UX
6. ARTHAX visual identity
7. Real interaction depth
8. Accessibility
9. Responsive behavior
10. Maintainability
11. Performance
12. Visual originality

Do not optimize for:
- Maximum number of components
- Maximum number of animations
- Maximum number of agents
- Maximum number of dependencies
- Maximum visual complexity

---

# 41. Final Mental Model

ARTHAX is:

```text
                    ARTHAX
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      GOV ID       CORE FINANCE      WORLD
        │              │              │
        │        ┌─────┼─────┐    ┌───┼────┐
        │        │     │     │    │   │    │
      User     Banks  CLS  Stocks Shop Rewards
        │        │     │     │    │   │
        └────────┴─────┴─────┴────┴───┘
                       │
                   ARTH LEDGER
                       │
                 SINGLE CURRENCY
```

The experience should feel like **one connected financial world**.

When uncertain about a design or architecture decision:

1. Check this document.
2. Check the relevant ARTHAX skill.
3. Check the existing project architecture.
4. Preserve existing conventions.
5. Ask the user when the decision is not defined.

**Do not silently invent project rules.**

---

# 42. Current Build Status

The project is currently preparing the development foundation.

Immediate direction:
- Finalize local environment
- Scaffold monorepo
- Establish agent/skill directories
- Establish identity/auth foundation
- Establish database foundation
- Establish core ledger before dependent financial features

The full feature set is defined, but implementation should follow the phase order.
