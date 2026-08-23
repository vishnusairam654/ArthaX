/**
 * Identity domain types.
 *
 * Invariant: 1 Email -> 1 GOV ID -> 1 ARTHAX User -> Many Bank Accounts.
 * One unified session across all portals.
 */

export type UserRole = "USER" | "BANK_ADMIN" | "CENTRAL_BANK_ADMIN";

export interface EmailIdentity {
  /** Lowercase, unique across the entire system. */
  email: string;
  emailVerified: boolean;
}

export interface GovId {
  /** Unique government identifier issued once per verified email. */
  id: string;
  userId: string;
}

export interface ArthaxUser {
  id: string;
  govId: GovId;
  email: EmailIdentity["email"];
  role: UserRole;
  createdAt: string;
}

/** Dual-password architecture: GOV (login) and Financial passwords are isolated. */
export interface CredentialPair {
  /** Hash of the GOV password — used for login only. */
  govPasswordHash: string;
  /**
   * Hash of the Financial Password — used to authorize transfers, trades,
   * and purchases. Never accepted as a login credential.
   */
  financialPasswordHash: string | null;
}
