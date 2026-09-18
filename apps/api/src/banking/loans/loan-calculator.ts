import { BadRequestException } from '@nestjs/common';
import { LoanRepaymentInstallmentDto } from '@arthax/types';

export class LoanCalculator {
  /**
   * Calculates monthly Equated Monthly Installment (EMI) using reducing balance method.
   * EMI = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
   *
   * @param principalMinor Principal in integer minor units (> 0)
   * @param annualRatePercent Annual Interest Rate in percent (e.g. 8.5 for 8.50%)
   * @param tenureMonths Tenure in months (1 - 360)
   */
  static calculateMonthlyEmi(
    principalMinor: bigint,
    annualRatePercent: number,
    tenureMonths: number,
  ): bigint {
    if (principalMinor <= 0n) {
      throw new BadRequestException('Principal must be strictly positive');
    }
    if (tenureMonths <= 0 || !Number.isInteger(tenureMonths)) {
      throw new BadRequestException('Tenure months must be a positive integer');
    }
    if (annualRatePercent < 0) {
      throw new BadRequestException('Interest rate cannot be negative');
    }

    if (annualRatePercent === 0) {
      return principalMinor / BigInt(tenureMonths);
    }

    const monthlyRate = annualRatePercent / (12 * 100);
    const n = tenureMonths;
    const factor = Math.pow(1 + monthlyRate, n);
    const emiFloat = Number(principalMinor) * ((monthlyRate * factor) / (factor - 1));

    return BigInt(Math.round(emiFloat));
  }

  /**
   * Generates a deterministic reducing-balance amortization schedule.
   * Guarantees that terminal installment absorbs cent rounding deltas so outstanding principal reaches exactly 0.
   */
  static generateAmortizationSchedule(
    principalMinor: bigint,
    annualRatePercent: number,
    tenureMonths: number,
    startDate: Date = new Date(),
  ): LoanRepaymentInstallmentDto[] {
    const emiMinor = this.calculateMonthlyEmi(principalMinor, annualRatePercent, tenureMonths);
    const monthlyRate = annualRatePercent / (12 * 100);
    const schedule: LoanRepaymentInstallmentDto[] = [];

    let currentBalance = principalMinor;

    for (let k = 1; k <= tenureMonths; k++) {
      // Calculate due date (1 month increments)
      const dueDate = new Date(startDate.getTime());
      dueDate.setMonth(dueDate.getMonth() + k);
      const dueDateIso = dueDate.toISOString().split('T')[0];

      // Monthly interest: outstanding * monthlyRate
      const interestMinor = BigInt(Math.round(Number(currentBalance) * monthlyRate));

      let principalComponent: bigint;
      let totalInstallment: bigint;

      if (k === tenureMonths) {
        // Final installment absorbs any cent deltas
        principalComponent = currentBalance;
        totalInstallment = principalComponent + interestMinor;
        currentBalance = 0n;
      } else {
        principalComponent = emiMinor - interestMinor;
        if (principalComponent > currentBalance) {
          principalComponent = currentBalance;
        }
        totalInstallment = principalComponent + interestMinor;
        currentBalance = currentBalance - principalComponent;
      }

      schedule.push({
        installmentNumber: k,
        dueDate: dueDateIso,
        principalMinor: principalComponent.toString(),
        interestMinor: interestMinor.toString(),
        totalAmountMinor: totalInstallment.toString(),
        remainingPrincipalMinor: currentBalance.toString(),
        status: 'PENDING',
        paidAt: null,
        transactionId: null,
      });
    }

    return schedule;
  }

  /**
   * Calculates payoff amount and statutory early-closure charges for foreclosure.
   */
  static calculateForeclosureAmount(
    outstandingPrincipalMinor: bigint,
    accruedInterestMinor: bigint,
    penaltyRatePercent: number = 2.0, // Statutory 2% early foreclosure fee
  ): { totalPayoffMinor: bigint; penaltyMinor: bigint } {
    if (outstandingPrincipalMinor <= 0n) {
      return { totalPayoffMinor: 0n, penaltyMinor: 0n };
    }

    const penaltyMinor = (outstandingPrincipalMinor * BigInt(Math.round(penaltyRatePercent * 100))) / 10000n;
    const totalPayoffMinor = outstandingPrincipalMinor + accruedInterestMinor + penaltyMinor;

    return { totalPayoffMinor, penaltyMinor };
  }

  /**
   * Calculates daily statutory late interest on overdue installment after grace period.
   *
   * @param overdueInstallmentMinor Amount overdue in minor units
   * @param daysOverdue Number of calendar days elapsed since due date
   * @param penaltyApy Statutory overdue penalty rate (default 24% APY)
   * @param gracePeriodDays Number of grace days before penalty begins (default 5 days)
   */
  static calculateOverdueLateFee(
    overdueInstallmentMinor: bigint,
    daysOverdue: number,
    penaltyApy: number = 24.0,
    gracePeriodDays: number = 5,
  ): bigint {
    if (daysOverdue <= gracePeriodDays || overdueInstallmentMinor <= 0n) {
      return 0n;
    }

    const chargeableDays = daysOverdue - gracePeriodDays;
    const lateFee =
      (overdueInstallmentMinor * BigInt(Math.round(penaltyApy * 100)) * BigInt(chargeableDays)) /
      (10000n * 365n);

    return lateFee;
  }
}
