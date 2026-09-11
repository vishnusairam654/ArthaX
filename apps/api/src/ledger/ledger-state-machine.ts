import { TransactionStatus } from '@arthax/types';
import { BadRequestException } from '@nestjs/common';

/**
 * Enforces the strict 9-state ARTHAX transaction lifecycle:
 * PENDING -> VALIDATING -> AUTHORIZED -> PROCESSING -> SETTLING -> FINALIZING -> COMPLETED
 * Terminal non-completed states: FAILED, REVERSED, CANCELLED
 */
export class LedgerStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
    PENDING: ['VALIDATING', 'CANCELLED', 'FAILED'],
    VALIDATING: ['AUTHORIZED', 'CANCELLED', 'FAILED'],
    AUTHORIZED: ['PROCESSING', 'FAILED'],
    PROCESSING: ['SETTLING', 'FAILED'],
    SETTLING: ['FINALIZING', 'FAILED'],
    FINALIZING: ['COMPLETED', 'FAILED'],
    COMPLETED: ['REVERSED'],
    FAILED: [],
    REVERSED: [],
    CANCELLED: [],
  };

  public static readonly LINEAR_PIPELINE: readonly TransactionStatus[] = [
    'PENDING',
    'VALIDATING',
    'AUTHORIZED',
    'PROCESSING',
    'SETTLING',
    'FINALIZING',
    'COMPLETED',
  ] as const;

  public static canTransition(from: TransactionStatus, to: TransactionStatus): boolean {
    const allowed = this.ALLOWED_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  public static assertTransition(from: TransactionStatus, to: TransactionStatus): void {
    if (!this.canTransition(from, to)) {
      throw new BadRequestException(
        `Invalid transaction state transition from ${from} to ${to}. State progression must strictly follow the ARTHAX lifecycle invariant.`,
      );
    }
  }

  public static isTerminal(status: TransactionStatus): boolean {
    return status === 'COMPLETED' || status === 'FAILED' || status === 'REVERSED' || status === 'CANCELLED';
  }
}
