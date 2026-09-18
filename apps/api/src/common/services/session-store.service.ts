import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../../database/prisma.service';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

@Injectable()
export class SessionStoreService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SessionStoreService.name);
  private redis: Redis | null = null;
  public isRedisConnected = false;

  // In-memory fallback stores with TTL (used for rate-limiting when Redis is unavailable)
  private revokedSessionIds = new Set<string>();
  private rateLimitCounters = new Map<string, { count: number; resetAt: number }>();
  private accountLockouts = new Map<string, { failedAttempts: number; lockedUntil: number }>();

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 2,
        retryStrategy: (times) => {
          if (times > 5) return null; // Stop retrying after 5 attempts if redis is down
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });

      this.redis.on('connect', () => {
        this.isRedisConnected = true;
        this.logger.log('Connected to ARTHAX Redis sovereign cache');
      });

      this.redis.on('close', () => {
        this.isRedisConnected = false;
      });

      this.redis.on('error', (err) => {
        this.isRedisConnected = false;
        this.logger.warn(`Redis client notice: ${err.message}`);
      });

      await this.redis.connect();
    } catch (err) {
      this.isRedisConnected = false;
      this.logger.warn(
        `Redis connection deferred (Redis offline): ${(err as Error).message}. Rate-limiting in degraded mode.`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      try {
        await this.redis.quit();
      } catch {
        this.redis.disconnect();
      }
      this.isRedisConnected = false;
    }
  }

  /**
   * Revokes a session so that any subsequent requests with this session token are rejected.
   * Persists revocation to both Redis and PostgreSQL.
   */
  async revokeSession(sessionId: string): Promise<void> {
    this.revokedSessionIds.add(sessionId);

    // 1. Write to Redis revocation cache if available
    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.set(`revoked:${sessionId}`, '1', 'EX', 7 * 86400); // 7-day TTL matching refresh token
      } catch (err) {
        this.logger.warn(`Failed writing session revocation to Redis: ${(err as Error).message}`);
      }
    }

    // 2. Persist directly to PostgreSQL Session table
    if (this.prisma.isConnected) {
      try {
        await this.prisma.session.updateMany({
          where: { id: sessionId },
          data: { revoked: true },
        });
      } catch (err) {
        this.logger.warn(`Failed marking session revoked in PostgreSQL: ${(err as Error).message}`);
      }
    }

    this.logger.log(`Session revoked across storage layers: ${sessionId}`);
  }

  /**
   * Checks if a session has been explicitly revoked or invalidated.
   * INVARIANT: Fails closed for security session state if both Redis and PostgreSQL are unavailable.
   */
  async isSessionRevoked(sessionId: string): Promise<boolean> {
    // 1. Fast path: check in-process set
    if (this.revokedSessionIds.has(sessionId)) {
      return true;
    }

    // 2. Check Redis revocation cache
    if (this.isRedisConnected && this.redis) {
      try {
        const val = await this.redis.get(`revoked:${sessionId}`);
        if (val === '1') {
          this.revokedSessionIds.add(sessionId);
          return true;
        }
      } catch (err) {
        this.logger.warn(`Redis session lookup failed: ${(err as Error).message}`);
      }
    }

    // 3. Authoritative verification: Check PostgreSQL Session table
    if (this.prisma.isConnected) {
      try {
        const session = await this.prisma.session.findUnique({
          where: { id: sessionId },
        });

        // If session record does not exist in persistent database or is marked revoked or expired
        if (!session || session.revoked || session.expiresAt < new Date()) {
          this.revokedSessionIds.add(sessionId);
          return true;
        }

        return false;
      } catch (err) {
        this.logger.error(`PostgreSQL session check failed: ${(err as Error).message}`);
      }
    }

    // 4. Fail-closed: If both persistent PostgreSQL and Redis are offline, do not allow arbitrary access
    if (!this.prisma.isConnected && !this.isRedisConnected) {
      throw new ServiceUnavailableException(
        '[FAIL CLOSED] Session validation offline: Sovereign database and Redis are unavailable. Access rejected by security decree.',
      );
    }

    return false;
  }

  /**
   * Checks and enforces rate limits for sensitive operations (e.g. login, OTP).
   * Temporary fallback to memory store acceptable when Redis is offline.
   */
  async checkRateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<RateLimitResult> {
    if (this.isRedisConnected && this.redis) {
      try {
        const redisKey = `ratelimit:${key}`;
        const current = await this.redis.incr(redisKey);
        if (current === 1) {
          await this.redis.expire(redisKey, windowSeconds);
        }
        const ttl = await this.redis.ttl(redisKey);
        return {
          allowed: current <= maxRequests,
          remaining: Math.max(0, maxRequests - current),
          resetSeconds: ttl > 0 ? ttl : windowSeconds,
        };
      } catch (err) {
        this.logger.warn(`Redis rate-limit query failed, falling back to local memory: ${(err as Error).message}`);
      }
    }

    // In-memory fallback
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
   * Tracks failed authentication attempts for brute-force and account lockout protection.
   */
  async recordFailedAuth(
    identifier: string,
    maxAttempts: number = 5,
    lockoutDurationSeconds: number = 900, // 15 minutes
  ): Promise<{ locked: boolean; lockedUntilMs?: number; remainingAttempts: number }> {
    const key = `lockout:${identifier.toLowerCase()}`;

    if (this.isRedisConnected && this.redis) {
      try {
        const countKey = `${key}:count`;
        const lockedKey = `${key}:locked`;

        const isLocked = await this.redis.get(lockedKey);
        if (isLocked) {
          const ttl = await this.redis.ttl(lockedKey);
          return { locked: true, lockedUntilMs: Date.now() + ttl * 1000, remainingAttempts: 0 };
        }

        const count = await this.redis.incr(countKey);
        if (count === 1) {
          await this.redis.expire(countKey, lockoutDurationSeconds);
        }

        if (count >= maxAttempts) {
          await this.redis.set(lockedKey, '1', 'EX', lockoutDurationSeconds);
          await this.redis.del(countKey);
          this.logger.warn(`[SECURITY LOCKOUT] Account locked in Redis due to brute-force threshold: ${identifier}`);
          return {
            locked: true,
            lockedUntilMs: Date.now() + lockoutDurationSeconds * 1000,
            remainingAttempts: 0,
          };
        }

        return {
          locked: false,
          remainingAttempts: Math.max(0, maxAttempts - count),
        };
      } catch (err) {
        this.logger.warn(`Redis lockout tracking failed: ${(err as Error).message}`);
      }
    }

    // In-memory fallback
    const now = Date.now();
    let record = this.accountLockouts.get(identifier.toLowerCase());

    if (!record || (record.lockedUntil > 0 && now > record.lockedUntil)) {
      record = { failedAttempts: 1, lockedUntil: 0 };
    } else {
      record.failedAttempts += 1;
    }

    if (record.failedAttempts >= maxAttempts) {
      record.lockedUntil = now + lockoutDurationSeconds * 1000;
      this.accountLockouts.set(identifier.toLowerCase(), record);
      this.logger.warn(`[SECURITY LOCKOUT] Account locked due to brute-force threshold: ${identifier}`);
      return { locked: true, lockedUntilMs: record.lockedUntil, remainingAttempts: 0 };
    }

    this.accountLockouts.set(identifier.toLowerCase(), record);
    return {
      locked: false,
      remainingAttempts: maxAttempts - record.failedAttempts,
    };
  }

  /**
   * Checks if an account is currently locked out.
   */
  async isAccountLocked(identifier: string): Promise<{ locked: boolean; retryAfterSeconds: number }> {
    const key = `lockout:${identifier.toLowerCase()}`;

    if (this.isRedisConnected && this.redis) {
      try {
        const lockedKey = `${key}:locked`;
        const isLocked = await this.redis.get(lockedKey);
        if (isLocked) {
          const ttl = await this.redis.ttl(lockedKey);
          return { locked: true, retryAfterSeconds: Math.max(1, ttl) };
        }
        return { locked: false, retryAfterSeconds: 0 };
      } catch (err) {
        this.logger.warn(`Redis isAccountLocked query failed: ${(err as Error).message}`);
      }
    }

    const now = Date.now();
    const record = this.accountLockouts.get(identifier.toLowerCase());

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
    const key = `lockout:${identifier.toLowerCase()}`;

    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.del(`${key}:count`, `${key}:locked`);
      } catch (err) {
        this.logger.warn(`Redis resetFailedAuth failed: ${(err as Error).message}`);
      }
    }

    this.accountLockouts.delete(identifier.toLowerCase());
  }
}
