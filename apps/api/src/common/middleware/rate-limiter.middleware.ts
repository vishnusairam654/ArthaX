import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface RateLimitRule {
  pathPrefix: string;
  windowMs: number;
  maxRequests: number;
  description: string;
}

export const DEFAULT_RATE_LIMIT_RULES: RateLimitRule[] = [
  {
    pathPrefix: '/auth/login',
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 5,
    description: 'Brute-force protection for citizen & officer authentication',
  },
  {
    pathPrefix: '/auth/otp',
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 3,
    description: 'Anti-exhaustion limit for sovereign OTP delivery and verification',
  },
  {
    pathPrefix: '/transfers',
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
    description: 'High-frequency transaction throttle for sovereign transfers',
  },
  {
    pathPrefix: '/api/v1/transfers',
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
    description: 'High-frequency transaction throttle for sovereign transfers',
  },
];

export class RateLimiterStore {
  private static records: Map<string, number[]> = new Map();

  public static getHits(key: string, windowMs: number, now: number = Date.now()): number[] {
    const cutoff = now - windowMs;
    const timestamps = this.records.get(key) || [];
    const valid = timestamps.filter((t) => t > cutoff);
    this.records.set(key, valid);
    return valid;
  }

  public static addHit(key: string, timestamp: number = Date.now()): void {
    const hits = this.records.get(key) || [];
    hits.push(timestamp);
    this.records.set(key, hits);
  }

  public static clear(): void {
    this.records.clear();
  }

  public static deleteKey(key: string): void {
    this.records.delete(key);
  }
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private rules: RateLimitRule[];
  private defaultWindowMs: number;
  private defaultMax: number;

  constructor(
    rules: RateLimitRule[] = DEFAULT_RATE_LIMIT_RULES,
    defaultWindowMs: number = 60 * 1000,
    defaultMax: number = 120,
  ) {
    this.rules = rules;
    this.defaultWindowMs = defaultWindowMs;
    this.defaultMax = defaultMax;
  }

  use(req: Request, res: Response, next: NextFunction): void {
    // Determine client identifier (IP or authenticated subject)
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = clientIp.split(',')[0].trim();
    const normalizedPath = req.baseUrl || req.path || req.originalUrl || '';

    // Match rule by path prefix
    const matchedRule = this.rules.find((r) => normalizedPath.includes(r.pathPrefix));
    const windowMs = matchedRule ? matchedRule.windowMs : this.defaultWindowMs;
    const maxRequests = matchedRule ? matchedRule.maxRequests : this.defaultMax;
    const ruleKey = matchedRule ? matchedRule.pathPrefix : 'general';

    const storeKey = `${cleanIp}:${ruleKey}`;
    const now = Date.now();

    const hits = RateLimiterStore.getHits(storeKey, windowMs, now);

    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    const remaining = Math.max(0, maxRequests - hits.length);
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    const resetTime = hits.length > 0 ? Math.ceil((hits[0] + windowMs) / 1000) : Math.ceil((now + windowMs) / 1000);
    res.setHeader('X-RateLimit-Reset', resetTime.toString());

    if (hits.length >= maxRequests) {
      const oldestHit = hits[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldestHit + windowMs - now) / 1000));

      res.setHeader('Retry-After', retryAfterSeconds.toString());
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message: `Rate limit of ${maxRequests} requests per ${Math.round(windowMs / 1000)}s exceeded for ${matchedRule ? matchedRule.description : 'endpoint'}.`,
        retryAfter: retryAfterSeconds,
      });
      return;
    }

    RateLimiterStore.addHit(storeKey, now);
    next();
  }
}
