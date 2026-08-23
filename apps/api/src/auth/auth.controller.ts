import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { AuthService, SESSION_COOKIE } from "./auth.service";
import { JwtAuthGuard } from "./guards/auth.guards";
import { CurrentUser } from "./guards/current-user.decorator";
import type { LoginDto, RegisterDto, RequestOtpDto, StepUpDto, VerifyOtpDto } from "./dto/auth.dto";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("otp/request")
  @HttpCode(200)
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.auth.requestOtp(dto.email, "REGISTRATION");
  }

  @Post("otp/verify")
  @HttpCode(200)
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.email, dto.code);
  }

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, govId } = await this.auth.register(
      dto.registrationToken,
      dto.govPassword,
      dto.financialPassword,
    );
    const token = this.auth.signSession(user);
    res.cookie(SESSION_COOKIE, token, COOKIE_OPTS);
    return { userId: user.id, govId };
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.auth.login(dto.email, dto.password);
    res.cookie(SESSION_COOKIE, token, COOKIE_OPTS);
    return user;
  }

  @Post("logout")
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(SESSION_COOKIE, { path: "/" });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: { sub: string }) {
    return this.auth.me(user.sub);
  }

  /** Step-up verification for sensitive financial actions. */
  @UseGuards(JwtAuthGuard)
  @Post("financial/verify")
  @HttpCode(200)
  verifyFinancialPassword(@CurrentUser() user: { sub: string }, @Body() dto: StepUpDto) {
    return this.auth.verifyFinancialPassword(user.sub, dto.financialPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post("financial/set")
  setFinancialPassword(
    @CurrentUser() user: { sub: string },
    @Body() body: { govPassword: string; newPassword: string },
  ) {
    return this.auth.setFinancialPassword(user.sub, body.govPassword, body.newPassword);
  }
}
