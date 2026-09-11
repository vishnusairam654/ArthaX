import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { FixedDepositsService } from './fixed-deposits.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  FdSimulationSchema,
  FdSimulationSchemaInput,
  BookFdSchema,
  BookFdSchemaInput,
  BreakFdSchema,
  BreakFdSchemaInput,
  ToggleFdAutoRenewSchema,
  ToggleFdAutoRenewSchemaInput,
} from '@arthax/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { FdStatus } from '@arthax/types';

@Controller('fixed-deposits')
@UseGuards(JwtAuthGuard)
export class FixedDepositsController {
  constructor(private readonly fdService: FixedDepositsService) {}

  /**
   * Discovers active Fixed Deposit schemes offered across the 5 sovereign banks.
   * Optional bankId query filter.
   */
  @Get('schemes')
  async listSchemes(@Query('bankId') bankId?: string) {
    return this.fdService.listSchemes(bankId);
  }

  /**
   * Retrieves single FD scheme details including lock-in, APY tiers, and deposit limits.
   */
  @Get('schemes/:id')
  async getSchemeById(@Param('id') id: string) {
    return this.fdService.getSchemeById(id);
  }

  /**
   * Simulates quarterly compounded maturity yield with active pet modifier bonus.
   */
  @Post('simulate')
  @UsePipes(new ZodValidationPipe(FdSimulationSchema))
  async simulateYield(
    @Body() input: FdSimulationSchemaInput,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.fdService.simulateYield(input, userId);
  }

  /**
   * Books an FD certificate atomically.
   * Debits customer account, credits sys_fd_pool, and generates unique certificate.
   * Requires step-up Financial Password.
   */
  @Post('book')
  @UsePipes(new ZodValidationPipe(BookFdSchema))
  async bookFd(
    @CurrentUser('sub') userId: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() input: BookFdSchemaInput,
  ) {
    return this.fdService.bookFd(userId, input, idempotencyKey);
  }

  /**
   * Retrieves citizen's fixed deposit certificates portfolio.
   * Strict tenant isolation: returns only caller's certificates with real-time accrued interest.
   */
  @Get('my-fds')
  async listMyFds(
    @CurrentUser('sub') userId: string,
    @Query('bankId') bankId?: string,
    @Query('status') status?: FdStatus,
  ) {
    return this.fdService.listUserFds(userId, bankId, status);
  }

  /**
   * Retrieves single FD certificate details with real-time interest evaluation.
   */
  @Get('my-fds/:id')
  async getMyFdById(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.fdService.getUserFdById(userId, id);
  }

  /**
   * Prematurely liquidates an active FD certificate.
   * Enforces lock-in days threshold; recalculates yield with preclosure penalty.
   * Payout disbursed from sys_fd_pool to target account.
   * Requires step-up Financial Password.
   */
  @Post('my-fds/:id/break')
  @UsePipes(new ZodValidationPipe(BreakFdSchema))
  async breakFd(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() input: BreakFdSchemaInput,
  ) {
    return this.fdService.breakFd(userId, id, input);
  }

  /**
   * Updates auto-renew toggle and rollover instructions.
   */
  @Patch('my-fds/:id/auto-renew')
  @UsePipes(new ZodValidationPipe(ToggleFdAutoRenewSchema))
  async toggleAutoRenew(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() input: ToggleFdAutoRenewSchemaInput,
  ) {
    return this.fdService.toggleAutoRenew(userId, id, input);
  }

  /**
   * Retrieves interest payout logs for audit reconciliation.
   */
  @Get('my-fds/:id/payout-logs')
  async getPayoutLogs(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.fdService.getPayoutLogs(userId, id);
  }
}
