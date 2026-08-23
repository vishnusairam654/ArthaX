import { ForbiddenException } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import { describe, expect, it, vi } from "vitest";
import type { Role } from "@prisma/client";
import { JwtAuthGuard, RolesGuard, type AuthedRequest } from "./guards/auth.guards";

describe("RBAC (unit)", () => {
  const makeCtx = (user?: AuthedRequest["user"]) => {
    const req = {
      headers: {},
      cookies: {},
      user,
    } as unknown as AuthedRequest;
    return {
      switchToHttp: () => ({ getRequest: () => req }),
      getHandler: () => undefined,
      getClass: () => undefined,
    } as never;
  };

  it("RolesGuard allows a matching role", () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(["CENTRAL_BANK_ADMIN"]) };
    const guard = new RolesGuard(reflector as unknown as Reflector);
    expect(guard.canActivate(makeCtx({ sub: "1", email: "c@x", role: "CENTRAL_BANK_ADMIN" }))).toBe(
      true,
    );
  });

  it("RolesGuard blocks USER from admin-only routes", () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(["CENTRAL_BANK_ADMIN"]) };
    const guard = new RolesGuard(reflector as unknown as Reflector);
    expect(() => guard.canActivate(makeCtx({ sub: "1", email: "u@x", role: "USER" }))).toThrow(
      ForbiddenException,
    );
  });

  it("RolesGuard blocks BANK_ADMIN from Central Bank routes", () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(["CENTRAL_BANK_ADMIN"]) };
    const guard = new RolesGuard(reflector as unknown as Reflector);
    expect(() =>
      guard.canActivate(makeCtx({ sub: "2", email: "b@x", role: "BANK_ADMIN" satisfies Role })),
    ).toThrow(ForbiddenException);
  });

  it("JwtAuthGuard rejects requests without any token", () => {
    const auth = {
      verifySession: vi.fn(),
    };
    const guard = new JwtAuthGuard(auth as never);
    expect(() => guard.canActivate(makeCtx(undefined))).toThrow(ForbiddenException);
  });
});
