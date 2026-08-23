import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import { hash } from "@node-rs/argon2";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { AuthService } from "./auth.service";

describe("AuthService (unit)", () => {
  let service: AuthService;
  let prisma: {
    emailOtp: { updateMany: Mock; create: Mock; findFirst: Mock; update: Mock };
    user: { findUnique: Mock; create: Mock };
    govId: { findUnique: Mock; findUniqueOrThrow: Mock; create: Mock };
    credential: { findUnique: Mock; create: Mock; update: Mock };
    $transaction: Mock;
  };
  let jwt: {
    sign: Mock;
    signAsync: Mock;
    verify: Mock;
    verifyAsync: Mock;
  };

  const makeUser = (over: Partial<Record<string, unknown>> = {}) =>
    ({
      id: "u1",
      email: "a@b.dev",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
      credential: {
        userId: "u1",
        govPasswordHash: "govhash",
        financialPasswordHash: null,
        updatedAt: new Date(),
      },
      ...over,
    }) as never;

  beforeEach(() => {
    prisma = {
      emailOtp: {
        updateMany: vi.fn().mockResolvedValue({ count: 0 }),
        create: vi.fn().mockResolvedValue({}),
        findFirst: vi.fn(),
        update: vi.fn().mockResolvedValue({}),
      },
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      govId: {
        findUnique: vi.fn().mockResolvedValue(null),
        findUniqueOrThrow: vi.fn().mockResolvedValue({ id: "AX2026-AAAA" }),
        create: vi.fn().mockResolvedValue({}),
      },
      credential: {
        findUnique: vi.fn(),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
      },
      $transaction: vi.fn(),
    };
    jwt = {
      sign: vi.fn().mockReturnValue("signed"),
      signAsync: vi.fn().mockResolvedValue("regtoken"),
      verify: vi.fn(),
      verifyAsync: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new AuthService(prisma as any, jwt as unknown as JwtService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("registration invariant: 1 email -> 1 user", () => {
    it("rejects registration when the email already exists", async () => {
      jwt.verifyAsync.mockResolvedValue({ email: "a@b.dev", scope: "registration" });
      prisma.user.findUnique.mockResolvedValue(makeUser());
      await expect(service.register("tok", "Password1!", undefined)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("creates user, GOV ID and credentials atomically for a new email", async () => {
      jwt.verifyAsync.mockResolvedValue({ email: "new@b.dev", scope: "registration" });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockImplementation(async (fn) =>
        fn({
          user: prisma.user,
          govId: prisma.govId,
          credential: prisma.credential,
        }),
      );
      prisma.user.create.mockResolvedValue({ id: "u2", email: "new@b.dev", role: "USER" });

      const result = await service.register("tok", "Password1!", "Finance1!");
      expect(result.user.email).toBe("new@b.dev");
      expect(result.govId).toBe("AX2026-AAAA");
      const credCreate = prisma.credential.create.mock.calls[0]?.[0];
      expect(credCreate?.data?.financialPasswordHash).toBeTruthy();
    });
  });

  describe("OTP lifecycle", () => {
    it("rejects expired OTPs", async () => {
      prisma.emailOtp.findFirst.mockResolvedValue({
        id: "o1",
        codeHash: "h",
        attempts: 0,
        expiresAt: new Date(Date.now() - 1000),
      });
      await expect(service.verifyOtp("a@b.dev", "123456")).rejects.toThrow(UnauthorizedException);
    });

    it("locks out after max attempts", async () => {
      prisma.emailOtp.findFirst.mockResolvedValue({
        id: "o1",
        codeHash: "h",
        attempts: 5,
        expiresAt: new Date(Date.now() + 60_000),
      });
      await expect(service.verifyOtp("a@b.dev", "123456")).rejects.toThrow(ForbiddenException);
    });

    it("returns a registration token only when no user exists", async () => {
      prisma.emailOtp.findFirst.mockResolvedValue({
        id: "o1",
        codeHash: await hash("123456"),
        attempts: 0,
        expiresAt: new Date(Date.now() + 60_000),
      });
      prisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await service.verifyOtp("fresh@b.dev", "123456");
      expect(res.registrationToken).toBe("regtoken");
    });
  });

  describe("dual-password isolation", () => {
    it("login verifies against the GOV hash only", async () => {
      prisma.user.findUnique.mockResolvedValue(
        makeUser({
          credential: {
            userId: "u1",
            govPasswordHash: "$argon2id$gov",
            financialPasswordHash: "$argon2id$fin",
            updatedAt: new Date(),
          },
        }),
      );
      await expect(service.login("a@b.dev", "wrong")).rejects.toThrow(UnauthorizedException);
    });

    it("step-up rejects a missing Financial Password", async () => {
      prisma.credential.findUnique.mockResolvedValue({ financialPasswordHash: null });
      await expect(service.verifyFinancialPassword("u1", "whatever")).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
