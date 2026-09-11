---
name: investment-market
description: Stock engine — live feed, order book, trade execution, portfolio tracking, company analytics, and trade profit/tax. Use for anything under the Stock Portal, market data handling, buy/sell order logic, or portfolio calculations. Trigger this before Tax & Financial Rules (skill 08) since trade execution generates the events that tax rules apply to.
---

# Investment / Market (ARTHAX)

## Overview
The Stock Portal covers Market live-feed, Companies, Stock Details, Buy/Sell, Orders, Portfolio, and Profit/Tax — all trading exclusively in ARTH.

## Core components
- **Live feed**: price/volume updates for listed companies — needs to be fast but doesn't need to touch the ledger until a trade executes.
- **Order book**: pending buy/sell orders, matched by standard price-time priority unless the project spec says otherwise.
- **Trade execution**: on a match, generates a `STOCK_BUY`/`STOCK_SELL` transaction that posts through the Core Ledger (skill 04) exactly like any other transaction — trade execution is not a separate money-movement system.
- **Portfolio**: derived view over `USER_PORTFOLIO`/`TRADE_HISTORY`, rebuildable from trade history the same way balance snapshots are rebuildable from ledger entries.
- **Company analytics**: read-only aggregation over trade/price history — no write path back into the ledger.
- **Profit/Tax**: realized gain/loss calculation per trade or per tax period, using rules from skill 08.

## Rules
1. A trade match is itself a `TRANSACTION` with `TRANSACTION_ENTRY` rows (buyer debit ARTH/credit shares, seller debit shares/credit ARTH) — don't invent a parallel bookkeeping structure for stocks.
2. Order book state (pending/partially-filled/filled/cancelled) is separate from transaction lifecycle (skill 04) — an order can sit PENDING in the book for a long time before it ever becomes a ledger transaction; don't conflate the two state machines.
3. Portfolio and market charts stay flat and precise (Recharts/D3-class tooling, per the design system's skill 17/15) — no 3D visualization of financial data; 3D is reserved for Shop (skill 26).
4. Profit/tax calculation must be reproducible from trade history alone — don't cache a final number without keeping the inputs that produced it, since Financial Auditor (skill 20) needs to independently re-derive it.

## Common mistakes
- Letting the live feed's polling/websocket layer write directly to portfolio balances instead of only updating display state until a trade actually executes.
- Computing tax at trade time and never revisiting it if tax rules (skill 08) change retroactively for a period.
- Mixing order-book state and transaction-lifecycle state into one enum.

## Handoff
Owned by **Financial Engineer**, built in phase 7 (skill 02) after Banking Domain. Tax logic delegates to skill 08; UI delegates to **Frontend** + **Design Director**.
