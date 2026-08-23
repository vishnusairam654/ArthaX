import { ForbiddenException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hash, verify } from "@node-rs/argon2";
import type { Role, User } from "@prisma/client";
import { randomBytes, randomInt } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const REG_TOKEN_TTL_S = 15 * 60;
const SESSION_TTL_S = 7 * 24 * 60 * 60;

export const SESSION_COOKIE = "arthax_session";

export interface SessionPayload {
  sub: string;
  email: string;
  role: Role;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // ---------- Email OTP ----------

  async requestOtp(
    email: string,
    purpose: "REGISTRATION" | "LOGIN",
  ): Promise<{ delivered: string | null }> {
    const normalized = email.trim().toLowerCase();
    await this.prisma.emailOtp.updateMany({
      where: { email: normalized, purpose, consumedAt: null },
      data: { consumedAt: new Date() },
    });

    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    await this.prisma.emailOtp.create({
      data: {
        email: normalized,
        purpose,
        codeHash: await hash(code),
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
    });

    const devMode = process.env.EMAIL_OTP_DEV_MODE === "true";
    if (devMode) {
      this.logger.log(`DEV OTP for ${normalized} (${purpose}): ${code}`);
      return { delivered: code };
    }
    // Real SMTP delivery lands with the Phase 9 notification engine.
    this.logger.log(`OTP dispatched to ${normalized} (${purpose})`);
    return { delivered: null };
  }

  /** Verifies an OTP. Returns a short-lived registration token for new users. */
  async verifyOtp(
    email: string,
    code: string,
  ): Promise<{ result: "verified"; registrationToken?: string }> {
    const normalized = email.trim().toLowerCase();
    const record = await this.prisma.emailOtp.findFirst({
      where: { email: normalized, consumedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired code");
    }
    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      throw new ForbiddenException("Too many attempts");
    }

    const ok = await verify(record.codeHash, code).catch(() => false);
    if (!ok) {
      await this.prisma.emailOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException("Invalid or expired code");
    }

    await this.prisma.emailOtp.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });

    const existing = await this.prisma.user.findUnique({ where: { email: normalized } });
    if (existing) {
      return { result: "verified" };
    }
    const registrationToken = await this.jwt.signAsync(
      { email: normalized, scope: "registration" },
      { expiresIn: REG_TOKEN_TTL_S },
    );
    return { result: "verified", registrationToken };
  }

  // ---------- Registration (1 Email -> 1 GOV ID -> 1 User) ----------

  async register(
    registrationToken: string,
    govPassword: string,
    financialPassword?: string,
  ): Promise<{ user: User; govId: string }> {
    let payload: { email?: string; scope?: string };
    try {
      payload = await this.jwt.verifyAsync(registrationToken);
    } catch {
      throw new UnauthorizedException("Registration token invalid or expired");
    }
    if (payload.scope !== "registration" || !payload.email) {
      throw new UnauthorizedException("Registration token invalid or expired");
    }
    const email = payload.email;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ForbiddenException("An ARTHAX user already exists for this email");
    }

    const govHash = await hash(govPassword);
    const finHash = financialPassword ? await hash(financialPassword) : null;

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({ data: { email } });
      const govId = await this.generateUniqueGovId(tx);
      await tx.govId.create({
        data: { id: govId, userId: created.id },
      });
      await tx.credential.create({
        data: { userId: created.id, govPasswordHash: govHash, financialPasswordHash: finHash },
      });
      return created;
    });

    const gov = await this.prisma.govId.findUniqueOrThrow({ where: { userId: user.id } });
    return { user, govId: gov.id };
  }

  private async generateUniqueGovId(tx: Pick<PrismaService, "govId">): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = `AX${new Date().getFullYear()}-${randomBytes(5).toString("hex").toUpperCase()}`;
      const clash = await tx.govId.findUnique({ where: { id: candidate } });
      if (!clash) return candidate;
    }
    throw new Error("Failed to generate unique GOV ID");
  }

  // ---------- Login / Sessions ----------

  async login(email: string, password: string): Promise<{ token: string; user: SessionPayload }> {
    const normalized = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalized },
      include: { credential: true },
    });
    if (!user?.credential) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const ok = await verify(user.credential.govPasswordHash, password).catch(() => false);
    if (!ok) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return { token: this.signSession(user), user: this.toSession(user) };
  }

  /**
   * Step-up verification for sensitive financial actions.
   * ONLY the Financial Password is accepted here — the GOV password is
   * rejected by design.
   */
  async verifyFinancialPassword(
    userId: string,
    financialPassword: string,
  ): Promise<{ verified: boolean }> {
    const credential = await this.prisma.credential.findUnique({ where: { userId } });
    if (!credential?.financialPasswordHash) {
      throw new ForbiddenException("No Financial Password set");
    }
    const ok = await verify(credential.financialPasswordHash, financialPassword).catch(() => false);
    if (!ok) {
      throw new UnauthorizedException("Invalid Financial Password");
    }
    return { verified: true };
  }

  async setFinancialPassword(
    userId: string,
    govPassword: string,
    newPassword: string,
  ): Promise<void> {
    const credential = await this.prisma.credential.findUnique({ where: { userId } });
    if (!credential) throw new UnauthorizedException();
    const ok = await verify(credential.govPasswordHash, govPassword).catch(() => false);
    if (!ok) throw new UnauthorizedException("GOV password confirmation failed");
    await this.prisma.credential.update({
      where: { userId },
      data: { financialPasswordHash: await hash(newPassword) },
    });
  }

  async me(userId: string): Promise<SessionPayload & { govId: string | null }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { govId: true },
    });
    if (!user) throw new UnauthorizedException();
    return { ...this.toSession(user), govId: user.govId?.id ?? null };
  }

  // ---------- Session tokens ----------

  signSession(user: User): string {
    return this.jwt.sign(this.toSession(user), { expiresIn: SESSION_TTL_S });
  }

  verifySession(token: string): SessionPayload {
    try {
      return this.jwt.verify<SessionPayload>(token);
    } catch {
      throw new UnauthorizedException("Session invalid or expired");
    }
  }

  private toSession(user: User): SessionPayload {
    return { sub: user.id, email: user.email, role: user.role };
  }
}
