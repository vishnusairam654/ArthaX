import { BadRequestException } from '@nestjs/common';
import { SettlementStage } from '@arthax/types';

/**
 * Permitted transitions for the Central Settlement Layer lifecycle.
 *
 * Sequence:
 * VALIDATING -> AUTHORIZED -> PROCESSING (held in sys_cls_clearing) -> SETTLING -> FINALIZING -> COMPLETED
 *
 * Controlled aborts:
 * - VALIDATING / AUTHORIZED can transition to FAILED (pre-ledger abort).
 * - PROCESSING / SETTLING can transition to FAILED / REVERSED (requires contra-refund from sys_cls_clearing).
 * - FINALIZING can transition to FAILED (if destination credit fails, triggers contra-refund).
 * - COMPLETED, FAILED, and REVERSED are terminal states.
 */
export const ALLOWED_SETTLEMENT_TRANSITIONS: Record<SettlementStage, SettlementStage[]> = {
  VALIDATING: ['AUTHORIZED', 'FAILED'],
  AUTHORIZED: ['PROCESSING', 'FAILED'],
  PROCESSING: ['SETTLING', 'FINALIZING', 'COMPLETED', 'FAILED', 'REVERSED'],
  SETTLING: ['FINALIZING', 'COMPLETED', 'FAILED', 'REVERSED'],
  FINALIZING: ['COMPLETED', 'FAILED', 'REVERSED'],
  COMPLETED: [], // Terminal: in-place mutations forbidden; requires compensating transaction
  FAILED: [],    // Terminal
  REVERSED: [],  // Terminal
};

export function assertSettlementTransition(
  currentStage: SettlementStage,
  targetStage: SettlementStage,
): void {
  if (currentStage === targetStage) {
    return;
  }

  const allowedTargets = ALLOWED_SETTLEMENT_TRANSITIONS[currentStage];
  if (!allowedTargets || !allowedTargets.includes(targetStage)) {
    throw new BadRequestException(
      `Illegal CLS settlement stage transition: cannot move from ${currentStage} to ${targetStage}.`,
    );
  }
}

export function isTerminalSettlementStage(stage: SettlementStage): boolean {
  return stage === 'COMPLETED' || stage === 'FAILED' || stage === 'REVERSED';
}

export function isHeldInClearingPool(stage: SettlementStage): boolean {
  return stage === 'PROCESSING' || stage === 'SETTLING' || stage === 'FINALIZING';
}
