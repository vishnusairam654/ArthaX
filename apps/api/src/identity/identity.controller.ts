import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UsePipes,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { IdentityService } from './identity.service';
import {
  RegisterEmailSchema,
  RegisterEmailInput,
  VerifyOtpSchema,
  VerifyOtpInput,
  CreateGovIdSchema,
  CreateGovIdInput,
  SetFinancialPasswordSchema,
  SetFinancialPasswordInput,
  LoginSchema,
  LoginInput,
  StepUpAuthSchema,
  StepUpAuthInput,
} from '@arthax/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthSessionPayload } from '@arthax/types';

@Controller('auth')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @Post('register/email')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(RegisterEmailSchema))
  async sendEmailOtp(@Body() body: RegisterEmailInput, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    return this.identityService.sendEmailOtp(body, ip);
  }

  @Post('register/verify-otp')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(VerifyOtpSchema))
  async verifyEmailOtp(@Body() body: VerifyOtpInput) {
    return this.identityService.verifyEmailOtp(body);
  }

  @Post('register/create-gov-id')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(CreateGovIdSchema))
  async createGovId(@Body() body: CreateGovIdInput, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    return this.identityService.createGovId(body, ip);
  }

  @Post('register/set-financial-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(SetFinancialPasswordSchema))
  async setFinancialPassword(
    @CurrentUser('sub') userId: string,
    @Body() body: SetFinancialPasswordInput,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    return this.identityService.setFinancialPassword(userId, body, ip);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() body: LoginInput, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown-Client';
    return this.identityService.login(body, ip, userAgent);
  }

  @Post('step-up')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(StepUpAuthSchema))
  async stepUp(
    @CurrentUser('sub') userId: string,
    @Body() body: StepUpAuthInput,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    return this.identityService.verifyStepUp(userId, body, ip);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: AuthSessionPayload) {
    return user;
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@CurrentUser('sub') userId: string) {
    return this.identityService.getActiveSessions(userId);
  }

  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async revokeSession(
    @CurrentUser('sub') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.identityService.revokeSession(userId, sessionId);
  }

  @Delete('sessions/all')
  @UseGuards(JwtAuthGuard)
  async emergencyKillswitch(@CurrentUser('sub') userId: string) {
    return this.identityService.emergencyKillswitch(userId);
  }
}
