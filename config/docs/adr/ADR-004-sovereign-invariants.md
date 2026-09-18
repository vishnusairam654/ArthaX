# ADR-004: Dual Macroeconomic Invariants & Dual-Control Maker-Checker Architecture

**Status**: ACCEPTED / INVARIANT  
**Date**: 2026-08-25  
**Deciders**: Chief Monetary Economist, Chief Architect  

---

## Context
A standard double-entry ledger enforces only that $\sum \text{Debits} \equiv \sum \text{Credits}$. However, this invariant alone **does not guarantee that base currency was not created out of thin air or unconstitutionally destroyed**. A fraudulent transaction posting `DEBIT sys_mint_authority` and `CREDIT private_account` is perfectly balanced from a double-entry perspective, yet it creates unauthorized monetary supply.

Furthermore, permitting a single administrator to unilaterally mint or burn sovereign money creates an unacceptable risk of catastrophic fraud or human error.

---

## Decision
ARTHAX establishes two distinct, independently verified macroeconomic invariants and an administrative Maker-Checker protocol:
1. **Invariant 1: Double-Entry Ledger Invariant**:
   $$\sum \text{All Completed Debits} \equiv \sum \text{All Completed Credits}$$
2. **Invariant 2: Base Money Supply Continuity ($M0$)**:
   $$M0_{\text{current}} \equiv M0_{\text{initial}} + \sum \text{Mints} - \sum \text{Burns}$$
   - Any money expansion must come from the dedicated sovereign account `sys_mint_authority`.
   - Any deflationary burn must transfer to `sys_demurrage_burn` from unencumbered Treasury funds.
3. **Dual-Control (Maker-Checker) Threshold**:
   - Any sovereign issuance exceeding **1,000,000.00 ARTH** ($100,000,000$ minor units) cannot be executed by a single officer.
   - Stage 1 (Maker): Stages the proposal in state `PROPOSED`.
   - Stage 2 (Checker): An independent Central Bank officer verifies the justification, passes Financial Password step-up, and signs off. Self-approval is rejected by system invariant.

---

## Consequences
### Positive
- **Macroeconomic Integrity**: Impossible to expand or shrink the money supply without updating authoritative $M0$ records.
- **Insider Threat Mitigation**: Large-scale rogue currency creation requires collusion of multiple independent verified officers.

### Negative / Trade-Offs
- **Operational Latency**: Large mint/burn transactions require multi-party coordination and asynchronous approval workflows.
