# ARTHAX — Shared Reference & Invariants

This file is the single shared reference for all 15 ARTHAX agents. It binds common invariants, resolved decisions, and essential design tokens across all engineering and design work.

---

## 1. System Invariants (Non-Negotiable)

### 1.1 Currency
- **One Currency Everywhere**: **ARTH** (strictly integer minor units).
- **No Secondary Currencies**: Zero coins, tokens, or shop-only reward points.
- All purchases (Shop), investments (Stocks), deposits (Banks), and rewards post in ARTH.

### 1.2 Core Financial Ledger
- **Single Double-Entry Ledger**: Every journal entry satisfies $\sum \text{Debits} = \sum \text{Credits}$.
- **Append-Only Immutability**: Ledger tables (`LEDGER_ENTRY`) are immutable. No updates or deletes. Corrections occur exclusively through compensating reversal transactions.
- **Strict Transaction Lifecycle**:
  ```text
  PENDING → VALIDATING → AUTHORIZED → PROCESSING → SETTLING → COMPLETED
  (Terminal alternative states: FAILED, REVERSED, CANCELLED)
  ```
- **Direct Ledger Writes Prohibited**: All money-moving domains (Banking, Stocks, Shop, Rewards) MUST call the Core Ledger service interface owned by Financial Engineer. Never write directly to ledger tables.

### 1.3 Identity & Session
- **Identity Chain**:
  ```text
  Email (OTP verification)
    ↓
  GOV ID (Unique national identifier; GOV Password)
    ↓
  ARTHAX User (One unified session across all 6 portals)
    ↓
  Financial Password (Sensitive money actions step-up)
    ↓
  Multiple Bank Accounts (Across 5 commercial banks)
  ```
- **Dual-Password Isolation**:
  - **GOV Password**: Authenticates identity and general portal navigation.
  - **Financial Password**: Required exclusively for money movements (transfers, trades, FD creation, shop purchases).
  - Both passwords never appear on the same screen outside security settings.
  - Financial password inputs use `autocomplete="off"` and are NEVER logged.
- **Single Unified Session**: Users log in once and seamlessly switch bank accounts across all 6 portals without re-authenticating.

---

## 2. The Six Portals

| Portal | Role | Leading Identity & Accent |
|---|---|---|
| **Central Guide Board** | Public orientation layer, policy explanation, ARTH currency explainer, news ticker, portal launcher | Deep Blue / Editorial layout with subtle ambient landing background |
| **Central Bank Portal** | Highest regulatory authority: commercial bank charter approvals, reserve ratios, interest rate guidelines, CLS oversight | Formal regulatory, Deep Blue with Arth Gold accents |
| **Bank Portal** | Operational commercial bank interface for 5 licensed banks (*Nava, Samaya, Setu, Sthira, Vayu*); accounts, FDs, loans | Commercial institutional, parameterized by selected bank profile |
| **User Portal** | Personal wealth command center; total net worth, multi-bank switcher, transfers, portfolio overview, `/mailbox` messaging | Clean personal finance; balances masked by default with click-to-reveal |
| **Stock Portal** | Centrally managed fictional capital market (10 listed companies); order book, trades, holdings, profit-only capital gains tax | High-clarity financial data; flat precise charting (never 3D) |
| **Shop** | Virtual economy marketplace; Pet Store (8 pets), Avatar Store (8 personas), Frame Store (7 frames), Banner Store | Expressive gamified design; Three.js item previews with performance fallbacks |

---

## 3. Design Tokens & Visual Language

### 3.1 Color Palette
```css
:root {
  /* Brand Primary */
  --color-deep-blue: #3368A0;
  --color-soft-blue: #66A3BF;
  --color-sage-mint: #C8DFDB;
  --color-off-white: #F2EFE7; /* Base page background across all 6 portals */

  /* Brand Accent — Arth Gold (Currency, active nav, selective badges only; never body text) */
  --color-arth-gold: #A8742A;
  --color-arth-gold-soft: #E9D9BE;

  /* Typography */
  --color-ink: #262320;       /* Primary text */
  --color-ink-soft: #5C574F;  /* Secondary/muted text */

  /* Semantic State Tokens */
  --color-positive: #287A55;  /* Gains, completed, success */
  --color-loss: #B5482E;      /* Losses, errors, failed states (Terracotta) */
  --color-warning: #A8742A;   /* Caution, pending review */
  --color-info: #496C80;      /* Neutral informational highlights */

  /* Fonts */
  --font-display: 'Fraunces', ui-serif, Georgia, serif;
  --font-body: 'Cantarell', ui-sans-serif, system-ui, sans-serif;
  --font-accent: 'Amarante', cursive; /* Rare wordmark & reward moments only */
}
```

### 3.2 Anti-AI Design Guardrails
- **Layout**: Avoid generic template skeletons (hero → 3-card grid → features → CTA).
- **Containment**: Avoid redundant nested card wrappers and gratuitous bento grids.
- **States**: Every interactive component must implement the 7 core states: Default, Hover, Active, Focus, Loading, Error, Empty, and Disabled.
- **Third-Party Primitives**: Unmodified Shadcn/React Bits/Kokonut components must NEVER ship directly to a portal. They must be re-themed through `@arthax/ui` by Component Librarian.

---

## 4. Canonical Asset Mappings

### 4.1 Transaction States (9 States → 6 Icons)
- `VALIDATING` + `AUTHORIZED` → `assets/icons/pending.png`
- `PROCESSING` + `SETTLING` → `assets/icons/processing.png`
- `FINALYZING` → `assets/icons/finalyzing.png`
- `COMPLETED` → `assets/icons/completed.png`
- `FAILED` → `assets/icons/failed.png`
- `REVERSED` → `assets/icons/reversed.png`
- `CANCELLED` → `assets/icons/failed.png` (with muted/variant styling)

### 4.2 Empty States
- No Bank Account → `assets/illustrations/no_bank_account.png`
- No Transactions → `assets/illustrations/no_transactions.png`
- No Fixed Deposits → `assets/illustrations/no_FD.png`
- No Stocks / Holdings → `assets/illustrations/no_stocks.png`
- Empty Inventory → `assets/illustrations/empty_inventory.png`
- Empty Mailbox → `assets/illustrations/empty_mailbox.png`

### 4.3 Frame Rarity Tiers
- **Gold Tier**: `assets/shop/frames/gold.png`
- **Epic Tier**: `assets/shop/frames/Aurora.png`, `assets/shop/frames/Nova.png`
- **Rare Tier**: `assets/shop/frames/orbit.png`, `assets/shop/frames/pluse.png`
- **Normal Tier**: `assets/shop/frames/leaf.png`, `assets/shop/frames/vertex.png`

### 4.4 Commercial Banks (5)
`Nava Bank`, `Samaya Bank`, `Setu Bank`, `Sthira Bank`, `Vayu Bank` (Logos in `assets/banks/`).

### 4.5 Listed Stock Companies (10)
`Anvik Ind`, `Arka Energy`, `Aroha Foods`, `Jala Water`, `Kshiti Infra`, `Meru Capital`, `Nila Systems`, `Prava Retail`, `Tarang Mobility`, `Veda Health` (Logos and banners in `assets/stocks/`).

### 4.6 Official Pets (8)
`Archive Cat`, `Flow Otter`, `Ledger Owl`, `Market Bull`, `Saver Fox`, `Settlement Crane`, `Tax Tortoise`, `Wealth Elephant` (In `assets/shop/pets/`).

### 4.7 ASSET RULE (ZERO-TOLERANCE)
If any required asset is absent from `assets/`, **STOP AND ASK HUMAN**. Never synthesize, generate, or substitute a placeholder image or arbitrary solid block.
