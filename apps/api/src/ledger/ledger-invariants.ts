import { BadRequestException } from '@nestjs/common';
import { TransactionEntryType } from '@arthax/types';

export const ARTH_MINOR_UNIT_MULTIPLIER = 100n;

export interface PostEntryInstruction {
  ledgerAccountId: string;
  entryType: TransactionEntryType;
  amountMinor: bigint;
}

export const SOVEREIGN_SYSTEM_ACCOUNTS = {
  CENTRAL_TREASURY: 'sys_central_treasury',
  FEE_POOL: 'sys_fee_pool',
  TAX_AUTHORITY: 'sys_tax_authority',
  SHOP_REVENUE: 'sys_shop_revenue',
  REWARD_POOL: 'sys_reward_pool',
  CLS_CLEARING: 'sys_cls_clearing',
  FD_POOL: 'sys_fd_pool',
} as const;

/**
 * Validates double-entry fundamental invariant:
 * 1. At least 2 balanced entries.
 * 2. Every entry amount must be strictly > 0 integer minor units.
 * 3. Total Debits === Total Credits.
 */
export function assertDoubleEntryBalance(entries: PostEntryInstruction[]): {
  totalDebits: bigint;
  totalCredits: bigint;
} {
  if (!entries || entries.length < 2) {
    throw new BadRequestException('A double-entry transaction must contain at least 2 entries');
  }

  let totalDebits = 0n;
  let totalCredits = 0n;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (typeof entry.amountMinor !== 'bigint' || entry.amountMinor <= 0n) {
      throw new BadRequestException(
        `Entry #${i + 1} has invalid amount: must be positive integer minor units (> 0n).`,
      );
    }

    if (entry.entryType === 'DEBIT') {
      totalDebits += entry.amountMinor;
    } else if (entry.entryType === 'CREDIT') {
      totalCredits += entry.amountMinor;
    } else {
      throw new BadRequestException(`Invalid entryType: ${(entry as any).entryType}`);
    }
  }

  if (totalDebits !== totalCredits) {
    throw new BadRequestException(
      `Double-entry invariant violation: Total Debits (${totalDebits.toString()}) must equal Total Credits (${totalCredits.toString()})`,
    );
  }

  return { totalDebits, totalCredits };
}

/**
 * Enforces non-negative balance protection for standard deposit / cash accounts.
 * Prevents unauthorized overdrafts.
 */
export function assertNonNegativeBalance(
  currentBalance: bigint,
  debitAmount: bigint,
  accountRef?: string,
): void {
  if (currentBalance < debitAmount) {
    const refText = accountRef ? ` for account [${accountRef}]` : '';
    throw new BadRequestException(
      `Insufficient funds${refText}: current balance (${currentBalance.toString()} minor units) is less than required debit (${debitAmount.toString()} minor units).`,
    );
  }
}

/**
 * Converts ARTH decimal string/number to integer minor units (1 ARTH = 100 minor units).
 */
export function toMinorUnits(arth: string | number): bigint {
  const num = typeof arth === 'string' ? parseFloat(arth) : arth;
  if (isNaN(num)) {
    throw new BadRequestException(`Invalid ARTH numerical value: ${arth}`);
  }
  return BigInt(Math.round(num * 100));
}

/**
 * Formats integer minor units to 2-decimal ARTH string.
 */
export function fromMinorUnits(minorUnits: bigint): string {
  const isNegative = minorUnits < 0n;
  const absVal = isNegative ? -minorUnits : minorUnits;
  const major = absVal / 100n;
  const minor = absVal % 100n;
  const formatted = `${major.toString()}.${minor.toString().padStart(2, '0')}`;
  return isNegative ? `-${formatted}` : formatted;
}
