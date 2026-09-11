import { Injectable, Logger } from '@nestjs/common';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

@Injectable()
export class SessionStoreService {
  private readonly logger = new Logger(SessionStoreService.name);

  // In-memory fallback stores with TTL
  private revokedSessionIds = new Set<string>();
  private rateLimitCounters = new Map<string, { count: number; resetAt: number }>();
  private accountLockouts = new Map<string, { failedAttempts: number; lockedUntil: number }>();

  /**
   * Revokes a session so that any subsequent requests with this session token are rejected.
   */
  async revokeSession(sessionId: string): Promise<void> {
    this.revokedSessionIds.add(sessionId);
    this.logger.log(`Session revoked: ${sessionId}`);
  }

  /**
   * Checks if a session has been explicitly revoked.
   */
  async isSessionRevoked(sessionId: string): Promise<boolean> {
    return this.revokedSessionIds.has(sessionId);
  }

  /**
   * Checks and enforces rate limits for sensitive operations (e.g. login, OTP).
   */
  async checkRateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.rateLimitCounters.get(key);

    if (!entry || now > entry.resetAt) {
      this.rateLimitCounters.set(key, {
        count: 1,
        resetAt: now + windowSeconds * 1000,
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetSeconds: windowSeconds,
      };
    }

    if (entry.count >= maxRequests) {
      const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetSeconds,
      };
    }

    entry.count += 1;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  /**
   * Tracks failed authentication attempts for account lockout protection.
   */
  async recordFailedAuth(
    identifier: string,
    maxAttempts: number = 5,
    lockoutDurationSeconds: number = 900, // 15 minutes
  ): Promise<{ locked: boolean; lockedUntilMs?: number; remainingAttempts: number }> {
    const now = Date.now();
    let record = this.accountLockouts.get(identifier);

    if (!record || (record.lockedUntil > 0 && now > record.lockedUntil)) {
      record = { failedAttempts: 1, lockedUntil: 0 };
    } else {
      record.failedAttempts += 1;
    }

    if (record.failedAttempts >= maxAttempts) {
      record.lockedUntil = now + lockoutDurationSeconds * 1000;
      this.accountLockouts.set(identifier, record);
      this.logger.warn(`Account locked due to brute-force threshold: ${identifier}`);
      return { locked: true, lockedUntilMs: record.lockedUntil, remainingAttempts: 0 };
    }

    this.accountLockouts.set(identifier, record);
    return {
      locked: false,
      remainingAttempts: maxAttempts - record.failedAttempts,
    };
  }

  /**
   * Checks if an account is currently locked out.
   */
  async isAccountLocked(identifier: string): Promise<{ locked: boolean; retryAfterSeconds: number }> {
    const now = Date.now();
    const record = this.accountLockouts.get(identifier);

    if (record && record.lockedUntil > now) {
      return {
        locked: true,
        retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000),
      };
    }

    return { locked: false, retryAfterSeconds: 0 };
  }

  /**
   * Clears failed attempt tracking on successful authentication.
   */
  async resetFailedAuth(identifier: string): Promise<void> {
    this.accountLockouts.delete(identifier);
  }
}
