import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import cookieParser from "cookie-parser";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("Auth flow (integration, real DB)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const email = `e2e-${Date.now()}@arthax.test`;
  const govPassword = "GovPass123!";
  const finPassword = "FinPass456!";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma?.user.deleteMany({ where: { email } });
    await app?.close();
  });

  it("completes the full lifecycle: OTP -> verify -> register -> session", async () => {
    // 1. Request OTP (dev mode echoes the code)
    const otp = await request(app.getHttpServer()).post("/auth/otp/request").send({ email });
    expect(otp.status).toBe(200);
    expect(otp.body.delivered).toMatch(/^\d{6}$/);

    // 2. Verify OTP -> registration token
    const verified = await request(app.getHttpServer())
      .post("/auth/otp/verify")
      .send({ email, code: otp.body.delivered });
    expect(verified.status).toBe(200);
    const registrationToken = verified.body.registrationToken;
    expect(registrationToken).toBeTruthy();

    // 3. Register with dual passwords
    const reg = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ registrationToken, govPassword, financialPassword: finPassword });
    expect(reg.status).toBe(201);
    expect(reg.body.govId).toMatch(/^AX\d{4}-/);

    // 4. Session works
    const me = await request(app.getHttpServer())
      .get("/auth/me")
      .set("Cookie", reg.headers["set-cookie"]);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe(email);
    expect(me.body.role).toBe("USER");
  });

  it("enforces the invariant: same email can never register twice", async () => {
    const otp = await request(app.getHttpServer()).post("/auth/otp/request").send({ email });
    const verified = await request(app.getHttpServer())
      .post("/auth/otp/verify")
      .send({ email, code: otp.body.delivered });
    const reg = await request(app.getHttpServer()).post("/auth/register").send({
      registrationToken: verified.body.registrationToken,
      govPassword,
      financialPassword: finPassword,
    });
    // Existing email never receives a registration token, so the API rejects
    // (400/401/403) — a second registration can never succeed.
    expect([400, 401, 403, 409]).toContain(reg.status);
  });

  it("dual-password isolation: Financial Password cannot log in", async () => {
    const finLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: finPassword });
    expect(finLogin.status).toBe(401);

    const govLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: govPassword });
    expect(govLogin.status).toBe(200);
  });

  it("step-up accepts only the Financial Password", async () => {
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: govPassword });
    const cookie = login.headers["set-cookie"];

    const wrong = await request(app.getHttpServer())
      .post("/auth/financial/verify")
      .set("Cookie", cookie)
      .send({ financialPassword: govPassword });
    expect(wrong.status).toBe(401);

    const right = await request(app.getHttpServer())
      .post("/auth/financial/verify")
      .set("Cookie", cookie)
      .send({ financialPassword: finPassword });
    expect(right.status).toBe(200);
    expect(right.body.verified).toBe(true);
  });

  it("RBAC boundary: USER cannot access Central Bank registry", async () => {
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: govPassword });
    const res = await request(app.getHttpServer())
      .get("/central-bank/registry")
      .set("Cookie", login.headers["set-cookie"]);
    expect(res.status).toBe(403);
  });

  it("RBAC: Central Bank admin CAN access the registry", async () => {
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "central.admin@arthax.dev", password: "Admin@123" });
    expect(login.status).toBe(200);
    const res = await request(app.getHttpServer())
      .get("/central-bank/registry")
      .set("Cookie", login.headers["set-cookie"]);
    expect(res.status).toBe(200);
  });
});
