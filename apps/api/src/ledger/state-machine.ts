import type { TransactionState } from "@prisma/client";

/**
 * ARTHAX transaction state machine.
 * PENDING -> VALIDATING -> AUTHORIZED -> PROCESSING -> SETTLING -> COMPLETED
 * Any pre-terminal state may go FAILED or CANCELLED.
 * COMPLETED may become REVERSED (via a compensating reversal transaction).
 */
const TRANSITIONS: Record<TransactionState, TransactionState[]> = {
  PENDING: ["VALIDATING", "FAILED", "CANCELLED"],
  VALIDATING: ["AUTHORIZED", "FAILED", "CANCELLED"],
  AUTHORIZED: ["PROCESSING", "FAILED", "CANCELLED"],
  PROCESSING: ["SETTLING", "COMPLETED", "FAILED"],
  SETTLING: ["COMPLETED", "FAILED"],
  COMPLETED: ["REVERSED"],
  FAILED: [],
  REVERSED: [],
  CANCELLED: [],
};

export const TERMINAL_STATES: readonly TransactionState[] = [
  "COMPLETED",
  "FAILED",
  "REVERSED",
  "CANCELLED",
];

export function canTransition(from: TransactionState, to: TransactionState): boolean {
  return TRANSITIONS[from].includes(to);
}

export function assertTransition(from: TransactionState, to: TransactionState): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal transaction transition: ${from} -> ${to}`);
  }
}

export function isTerminal(state: TransactionState): boolean {
  return TERMINAL_STATES.includes(state);
}
