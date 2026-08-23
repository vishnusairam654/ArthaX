/**
 * Typed environment access for ARTHAX.
 * Values come from process.env (populated from .env in Phase 1+ runtime).
 */

function optional(key: string): string | undefined {
  return process.env[key];
}

export function requireEnv(key: string): string {
  const value = optional(key);
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: optional("NODE_ENV") ?? "development",
  appUrl: optional("APP_URL") ?? "http://localhost:3000",
  port: Number(optional("PORT") ?? 3000),
} as const;
