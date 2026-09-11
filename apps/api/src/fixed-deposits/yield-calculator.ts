import { BadRequestException } from '@nestjs/common';
import { ActivePetModifierDto } from '@arthax/types';

export interface CompoundCalculationResult {
  principalMinor: bigint;
  maturityAmountMinor: bigint;
  totalInterestMinor: bigint;
  annualizedApy: number;
  tenureDays: number;
  compoundingFrequency: 'QUARTERLY';
}

export interface AccrualCalculationResult {
  principalMinor: bigint;
  accruedInterestMinor: bigint;
  currentValueMinor: bigint;
  elapsedDays: number;
  tenureDays: number;
  isMatured: boolean;
}

export interface PreclosurePenaltyResult {
  principalMinor: bigint;
  contractApy: number;
  penaltyRate: number;
  effectiveApy: number;
  elapsedDays: number;
  tenureDays: number;
  grossInterestMinor: bigint;
  payoutAmountMinor: bigint;
}

export class YieldCalculator {
  /**
   * Exact Quarterly Compounding Formula:
   * A = P * (1 + r / 4)^(4 * (tenureDays / 365))
   *
   * @param principalMinor Principal in integer minor units (> 0)
   * @param apyPercent Annual Percentage Yield in percent (e.g., 7.2 for 7.20%)
   * @param tenureDays Tenure in integer days (> 0)
   */
  static calculateQuarterlyCompound(
    principalMinor: bigint,
    apyPercent: number,
    tenureDays: number,
  ): CompoundCalculationResult {
    if (principalMinor <= 0n) {
      throw new BadRequestException('Principal must be greater than zero');
    }
    if (apyPercent < 0) {
      throw new BadRequestException('APY cannot be negative');
    }
    if (tenureDays <= 0) {
      throw new BadRequestException('Tenure days must be greater than zero');
    }

    const r = apyPercent / 100.0;
    const n = 4.0; // Quarterly
    const t = tenureDays / 365.0;

    // A = P * (1 + r / 4)^(4 * t)
    const factor = Math.pow(1.0 + r / n, n * t);
    const maturityAmountNum = Math.round(Number(principalMinor) * factor);
    const maturityAmountMinor = BigInt(maturityAmountNum);
    const totalInterestMinor = maturityAmountMinor - principalMinor;

    return {
      principalMinor,
      maturityAmountMinor,
      totalInterestMinor: totalInterestMinor > 0n ? totalInterestMinor : 0n,
      annualizedApy: apyPercent,
      tenureDays,
      compoundingFrequency: 'QUARTERLY',
    };
  }

  /**
   * Calculates accrued yield up to an evaluation date.
   */
  static calculateDailyAccrual(
    principalMinor: bigint,
    apyPercent: number,
    startDate: Date,
    maturityDate: Date,
    asOfDate: Date = new Date(),
  ): AccrualCalculationResult {
    const totalTenureMs = maturityDate.getTime() - startDate.getTime();
    const totalTenureDays = Math.max(1, Math.round(totalTenureMs / 86400000));

    const elapsedMs = asOfDate.getTime() - startDate.getTime();
    const rawElapsedDays = Math.floor(elapsedMs / 86400000);
    const elapsedDays = Math.max(0, Math.min(totalTenureDays, rawElapsedDays));

    const isMatured = asOfDate.getTime() >= maturityDate.getTime();

    if (elapsedDays === 0) {
      return {
        principalMinor,
        accruedInterestMinor: 0n,
        currentValueMinor: principalMinor,
        elapsedDays: 0,
        tenureDays: totalTenureDays,
        isMatured: false,
      };
    }

    const r = apyPercent / 100.0;
    const n = 4.0;
    const tElapsed = elapsedDays / 365.0;

    const factor = Math.pow(1.0 + r / n, n * tElapsed);
    const currentValNum = Math.round(Number(principalMinor) * factor);
    const currentValueMinor = BigInt(currentValNum);
    const accruedInterestMinor =
      currentValueMinor > principalMinor ? currentValueMinor - principalMinor : 0n;

    return {
      principalMinor,
      accruedInterestMinor,
      currentValueMinor,
      elapsedDays,
      tenureDays: totalTenureDays,
      isMatured,
    };
  }

  /**
   * Enforces lock-in and computes penalized early closure yield.
   *
   * Invariant:
   * 1. If elapsedDays < lockInDays, early closure is forbidden.
   * 2. When allowed, penalized APY = max(0, contractApy - preclosurePenaltyRate).
   * 3. Interest earned is re-derived strictly at penalized APY for elapsed days.
   */
  static calculatePreclosurePayout(
    principalMinor: bigint,
    contractApy: number,
    penaltyRate: number,
    lockInDays: number,
    startDate: Date,
    asOfDate: Date = new Date(),
  ): PreclosurePenaltyResult {
    const elapsedMs = asOfDate.getTime() - startDate.getTime();
    const elapsedDays = Math.max(0, Math.floor(elapsedMs / 86400000));

    if (elapsedDays < lockInDays) {
      throw new BadRequestException(
        `Preclosure rejected: Statutory lock-in period of ${lockInDays} days has not elapsed (${elapsedDays} days elapsed). Fixed deposit funds cannot be liquidated prior to lock-in expiry.`,
      );
    }

    const effectiveApy = Math.max(0, contractApy - penaltyRate);
    const r = effectiveApy / 100.0;
    const n = 4.0;
    const tElapsed = elapsedDays / 365.0;

    const factor = Math.pow(1.0 + r / n, n * tElapsed);
    const payoutNum = Math.round(Number(principalMinor) * factor);
    const payoutAmountMinor = BigInt(payoutNum);
    const grossInterestMinor =
      payoutAmountMinor > principalMinor ? payoutAmountMinor - principalMinor : 0n;

    return {
      principalMinor,
      contractApy,
      penaltyRate,
      effectiveApy,
      elapsedDays,
      tenureDays: elapsedDays,
      grossInterestMinor,
      payoutAmountMinor,
    };
  }

  /**
   * Applies downstream Pet Modifier APY boost.
   * Enforces zero stacking: only the active pet companion modifier is evaluated.
   */
  static applyPetBooster(
    baseApy: number,
    petModifier: ActivePetModifierDto | null | undefined,
  ): { finalApy: number; boostApplied: number; petName?: string } {
    if (
      petModifier &&
      petModifier.modifierType === 'FD_YIELD_BOOST' &&
      typeof petModifier.valuePercent === 'number' &&
      petModifier.valuePercent > 0
    ) {
      // Bound the booster between 0.05% and 0.50%
      const boost = Math.min(0.5, Math.max(0, petModifier.valuePercent));
      const finalApy = Number((baseApy + boost).toFixed(2));
      return {
        finalApy,
        boostApplied: boost,
        petName: petModifier.name,
      };
    }

    return {
      finalApy: Number(baseApy.toFixed(2)),
      boostApplied: 0,
    };
  }
}
