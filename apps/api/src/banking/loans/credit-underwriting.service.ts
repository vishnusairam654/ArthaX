import { Injectable, Logger } from '@nestjs/common';
import { CreditAssessmentDto } from '@arthax/types';

export interface AssessApplicantInput {
  userId: string;
  requestedPrincipalMinor: bigint;
  monthlyIncomeMinor?: bigint;
  bankAccountBalanceMinor?: bigint;
  fdHoldingsMinor?: bigint;
  portfolioValueMinor?: bigint;
  activeLoanCount?: number;
  existingMonthlyEmiMinor?: bigint;
  collateralType?: string;
  collateralAppraisedValueMinor?: bigint;
}

@Injectable()
export class CreditUnderwritingService {
  private readonly logger = new Logger(CreditUnderwritingService.name);

  /**
   * Evaluates citizen creditworthiness, computes sovereign credit score (300-850),
   * and derives risk tier, allowable sanction limit, and collateral requirements.
   */
  assessApplicant(input: AssessApplicantInput): CreditAssessmentDto {
    let score = 650; // Neutral baseline
    const reasons: string[] = [];

    const balance = input.bankAccountBalanceMinor ?? 1000000n; // 10,000.00 ARTH default
    const fdHoldings = input.fdHoldingsMinor ?? 0n;
    const portfolioValue = input.portfolioValueMinor ?? 0n;
    const activeLoans = input.activeLoanCount ?? 0;
    const monthlyIncome = input.monthlyIncomeMinor ?? 500000n; // 5,000.00 ARTH default
    const existingEmi = input.existingMonthlyEmiMinor ?? 0n;

    // 1. Account Liquidity & Savings Factor (+/- 60 points)
    if (balance >= 5000000n) {
      score += 60;
      reasons.push('Substantial depository liquidity buffer (> 50,000.00 ARTH)');
    } else if (balance >= 2000000n) {
      score += 35;
      reasons.push('Healthy depository balance (> 20,000.00 ARTH)');
    } else if (balance < 50000n) {
      score -= 40;
      reasons.push('Depository balance near statutory minimum');
    }

    // 2. Fixed Deposit Asset Longevity (+50 points)
    if (fdHoldings >= 2500000n) {
      score += 50;
      reasons.push('Long-term term deposit contracts active in sovereign vault');
    } else if (fdHoldings > 0n) {
      score += 25;
      reasons.push('Active fixed deposit savings history');
    }

    // 3. Equities Portfolio Net Worth (+40 points)
    if (portfolioValue >= 5000000n) {
      score += 40;
      reasons.push('High-value diversified equities portfolio');
    } else if (portfolioValue > 0n) {
      score += 20;
      reasons.push('Active market investment participant');
    }

    // 4. Existing Indebtedness & Active Loans Burden (-40 per facility)
    if (activeLoans === 0) {
      score += 20;
      reasons.push('Zero active debt encumbrances');
    } else if (activeLoans >= 3) {
      score -= 110;
      reasons.push('Multiple concurrent credit facilities (> 2 active facilities)');
    } else {
      score -= activeLoans * 30;
      reasons.push(`Existing debt servicing on ${activeLoans} facility`);
    }

    // Clamp score within standard bounds (300 - 850)
    score = Math.max(300, Math.min(850, score));

    // 5. Debt-to-Income (DTI) Ratio Check
    // Total proposed obligations should not exceed 45% of monthly income
    // Rough estimate of proposed EMI: 3% of principal per month
    const estimatedNewEmi = (input.requestedPrincipalMinor * 3n) / 100n;
    const totalObligations = existingEmi + estimatedNewEmi;
    const dtiRatio = monthlyIncome > 0n ? Number(totalObligations) / Number(monthlyIncome) : 1.0;

    // Determine Tier
    let tier: CreditAssessmentDto['tier'] = 'TIER_3_FAIR';
    let recommendedRate = 9.5;
    let maxSanctionAmountMinor = 10000000n; // 100,000.00 ARTH
    let collateralRequired = false;

    if (score >= 750) {
      tier = 'TIER_1_EXCELLENT';
      recommendedRate = 7.5;
      maxSanctionAmountMinor = 50000000n; // 500,000.00 ARTH
      collateralRequired = false;
    } else if (score >= 680) {
      tier = 'TIER_2_GOOD';
      recommendedRate = 8.75;
      maxSanctionAmountMinor = 25000000n; // 250,000.00 ARTH
      collateralRequired = false;
    } else if (score >= 550) {
      tier = 'TIER_3_FAIR';
      recommendedRate = 10.5;
      maxSanctionAmountMinor = 10000000n; // 100,000.00 ARTH
      collateralRequired = true;
      reasons.push('Collateral pledge required for Tier-3 credit rating');
    } else {
      tier = 'SUBPRIME';
      recommendedRate = 13.0;
      maxSanctionAmountMinor = 3000000n; // 30,000.00 ARTH
      collateralRequired = true;
      reasons.push('Subprime credit profile: 150% collateral mandatory');
    }

    // Eligibility decision
    let eligible = true;
    if (dtiRatio > 0.50) {
      eligible = false;
      reasons.push(`Debt-to-Income ratio (${(dtiRatio * 100).toFixed(1)}%) exceeds maximum statutory threshold of 50.0%`);
    } else if (input.requestedPrincipalMinor > maxSanctionAmountMinor && !input.collateralAppraisedValueMinor) {
      eligible = false;
      reasons.push(`Requested principal exceeds maximum unsecured sanction limit for ${tier}`);
    }

    // If collateral is provided, verify appraisal ratio
    if (collateralRequired && input.collateralAppraisedValueMinor) {
      const minRequiredCollateral = (input.requestedPrincipalMinor * 120n) / 100n;
      if (input.collateralAppraisedValueMinor >= minRequiredCollateral) {
        eligible = true;
        reasons.push('Sufficient asset collateral pledged to secure facility');
      } else {
        eligible = false;
        reasons.push(
          `Pledged collateral value (${input.collateralAppraisedValueMinor}) is below 120% requirement (${minRequiredCollateral})`,
        );
      }
    }

    return {
      creditScore: score,
      tier,
      maxSanctionAmountMinor: maxSanctionAmountMinor.toString(),
      debtToIncomeRatio: Number(dtiRatio.toFixed(3)),
      activeDebtCount: activeLoans,
      recommendedRate,
      collateralRequired,
      eligible,
      reasons,
    };
  }
}
