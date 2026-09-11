# ARTHAX Design Vision & Architecture Manifest

> **Core Brand Essence:** Trustworthy financial infrastructure with a modern human character.
> **Visual Identity Benchmark:** A handcrafted, Tier-1 digital financial ecosystem—rigorously engineered to feel bespoke, intentional, and authoritative, explicitly avoiding generic SaaS templates or synthetic AI aesthetics.

---

## 1. Master Design Principles

### ❌ Strict Prohibitions ("Anti-AI & Anti-Template" Rules)
* **No "Card Soup":** Never place 4–6 identical rectangular cards in a monotonous 3-column grid. Avoid the `Card / Card / Card / Card` pattern.
* **No Template Gradient Blobs:** Avoid garish neon gradients, saturated mesh backgrounds, and excessive purple/pink glassmorphism.
* **No Heavy Elevation:** Avoid harsh dropshadows (`box-shadow: 0 20px 25px rgba(0,0,0,0.25)`). Use soft tonal contrast, hairline borders (`1px solid rgba(0,0,0,0.06)`), and restrained elevation (Shadow 1–2 max).
* **No Stock Illustrations or Cartoon Mascots:** No generic flat vectors, 3D clay hands holding credit cards, or emoji-heavy badges.
* **No Stock Tailwind Look:** Avoid unconsidered default Tailwind palettes and standard border radiuses applied indiscriminately.

### ✅ Explicit Mandates
* **Structural Layout Diversity:** Every viewport section uses a distinct visual layout rhythm:
  * Asymmetric split heroes with editorial typography.
  * Continuous multi-step horizontal and vertical timeline tracks.
  * Institutional balance panels with embedded micro-charts.
  * Direct comparison matrices and connected ledger flows.
  * Data density balanced by generous whitespace (`gap-8` to `gap-16`).
* **Typography as Graphic Architecture:** High-contrast scale with editorial dignity. Large, calm headlines paired with crisp geometric metadata and monospaced financial tickers.
* **Micro-Hairlines & Architectural Surfaces:** Layering off-whites (`#F2EFE7`, `#FAFAFA`, `#F5F7FA`) with hairline dividers (`rgba(51, 104, 160, 0.08)`) creates structured depth without visual noise.
* **Subtle Geometric ARTHAX Motifs:** Delicate SVG vector flow marks, currency guilloche-inspired hairline watermarks, and golden accent geometry (`#A8742A`).

---

## 2. Color System & Semantic Palette

```
Surface Base:
  ├── Canvas Background:  #FBFBF9 / #F2EFE7 (Warm Light Off-White)
  ├── Surface Primary:    #FFFFFF (Crisp White Container / Panel)
  ├── Surface Secondary:  #F7F8FA (Subtle Slate Tint)
  └── Surface Inactive:   #ECEFF3

Brand & Structural Hierarchy:
  ├── Primary Deep Blue:  #3368A0 / #1E3A5F (Institutional Anchor)
  ├── Royal Indigo:       #2A3B6A (Secondary Depth)
  ├── Arth Gold Accent:   #A8742A (Reserved: active states, financial yields, brand insignia)
  └── Soft Gold Tint:     #F4EDE0 (Gold background wash / pill highlight)

Semantic Tokens:
  ├── Positive / Emerald: #287A55 (Net gains, verified signatures, balanced ledger)
  ├── Negative / Crimson: #B94A43 (Debits, policy infractions, liabilities)
  ├── Warning / Amber:    #A8742A / #D97706 (Pending CLS clearing, KYC requirements)
  └── Info / Slate Blue:  #496C80 (Metadata, ledger references, status flags)
```

---

## 3. Typography & Numerical Precision

* **Primary Editorial Display:** *Fraunces* or *Geist Serif / Plus Jakarta Display* — warm, human, authoritative.
* **Secondary UI & Mechanics:** *Geist*, *Inter*, or *Cantarell* — geometric, ultra-legible at 11–13px micro scales.
* **Financial Data & Ledger Engine:** Tabular figures (`font-variant-numeric: tabular-nums; font-family: 'Geist Mono', monospace;`) for all balances, currency units (ARTH), transaction IDs, and settlement hashes.

---

## 4. Portal-Specific Identities (One Core System, Six Dialects)

| Portal | Archetype & Atmosphere | Defining Layout & UI Components |
| :--- | :--- | :--- |
| **1. Central Guide Board** | *Public Entry & Architectural Overview* | Editorial split-screen, narrative ecosystem diagram, live macroeconomic ticker, interactive portal route map. |
| **2. User Portal** | *Personal Financial Sanctuary* | Unified net-worth aggregate panel, bank switcher tray, dual-credential vault badge, quick-transfer split drawer, transaction stream. |
| **3. Commercial Bank Portal** | *Operational Ledger Engine* | High-density audit tables, loan disbursement queue, fixed deposit maturity schedules, inter-bank clearing pipelines. |
| **4. Central Bank Oversight** | *Sovereign Authority & Settlement (CLS)* | Monochromatic executive balance sheet, reserve ratio sliders, tax rule engine, real-time clearing health graph, bank charter status. |
| **5. Stock & Capital Markets** | *Real-Time Trading Floor* | Order-book depth visualization, candle & line volume charts, instantaneous buy/sell execution dock, portfolio P&L matrix. |
| **6. The Shop & Gamification** | *Bespoke Financial Artifacts* | Prestige vault inventory, pet power modifier chips (interest yield boosters), collectible frame showcase, all denominated in ARTH. |

---

## 5. Motion, Physics & Interactivity Spec

* **Entrance & Page Transitions:** Staggered opacity & translate-Y (`y: 12 → 0`, `duration: 0.4s`, `ease: cubic-bezier(0.16, 1, 0.3, 1)`).
* **Financial Counters:** Rolling animated numeric increments on balance refreshes.
* **Bank Switching:** Kinetic panel slide with subtle cross-fade rather than abrupt DOM swaps.
* **State Verification:** Step-up security modal with distinct Financial Password PIN dials and tactile feedback.
* **Accessibility:** Full `prefers-reduced-motion` compliance across all transitions and canvas background interactions.
