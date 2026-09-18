# ADR-005: Commercial Loan Reducing-Balance Amortization with Terminal Residual Absorption

**Status**: ACCEPTED / INVARIANT  
**Date**: 2026-09-02  
**Deciders**: Commercial Credit Lead, Core Ledger Architect  

---

## Context
Fixed Equated Monthly Installment (EMI) loan schedules calculate payment using the standard reducing-balance formula:
$$\text{EMI} = P \times r \times \frac{(1 + r)^n}{(1 + r)^n - 1}$$
When computed using floating-point math, rounding errors accumulate across 12 to 360 monthly installments. If naive integer rounding is applied to each installment, the final remaining principal balance after the last scheduled payment is rarely exactly zero—frequently ending in $+1$, $-1$, or small residual fractional minor units. Leaving residual un-repaid principal breaks ledger closure invariants and prevents clean contract completion.

---

## Decision
ARTHAX implements **exact integer-minor-unit reducing-balance amortization with terminal installment residual absorption**:
1. All monthly interest charges are derived directly from remaining principal in minor units:
   $$\text{interest}_{\text{minor}} = \text{round}\left(\frac{\text{principalRemaining}_{\text{minor}} \times \text{monthlyRate}}{100}\right)$$
2. For installments $1$ through $n - 1$:
   $$\text{principalComponent} = \min(\text{emiAmount} - \text{interestComponent}, \text{principalRemaining})$$
3. **Terminal Residual Absorption (Installment $n$)**:
   - The final installment principal component is explicitly set to the exact outstanding principal balance:
     $$\text{principalComponent}_n \equiv \text{principalRemaining}$$
     $$\text{emiAmount}_n = \text{principalComponent}_n + \text{interestComponent}_n$$
   - This ensures $\text{principalRemaining}$ is guaranteed to reach exactly $0$ upon completion.
4. **Foreclosure Accounting**:
   - Early settlement charges remaining principal plus a 2% prepayment fee posted through the Core Ledger in a single atomic transaction.

---

## Consequences
### Positive
- **Exact Ledger Zero-Out**: Eliminates orphan sub-cent balances and ensures clean lifecycle transitions from `ACTIVE` to `CLOSED`.
- **Transparency**: Borrowers receive a completely deterministic amortization schedule with clear principal/interest splits.

### Negative / Trade-Offs
- The final monthly payment may vary slightly (by a few minor units) from preceding payments to absorb rounding accumulation.
