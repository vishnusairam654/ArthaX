/**
 * ARTH — the single canonical currency of the ARTHAX ecosystem.
 *
 * Invariant: exactly one currency exists across banking, stock market,
 * shop, rewards, and taxes. No coins, secondary tokens, or shop points.
 *
 * All monetary amounts are stored as integer minor units (1 ARTH = 100 cents)
 * to avoid floating-point drift in ledger arithmetic.
 */

export const ARTH_SYMBOL = "ARTH" as const;
export const ARTH_MINOR_UNITS_PER_UNIT = 100n;

/** An amount of ARTH in minor units (cents). Always an integer. */
export type ArthMinor = bigint;

export function arth(units: number): ArthMinor {
  return BigInt(Math.round(units * Number(ARTH_MINOR_UNITS_PER_UNIT)));
}

export function toArthUnits(minor: ArthMinor): number {
  return Number(minor) / Number(ARTH_MINOR_UNITS_PER_UNIT);
}
