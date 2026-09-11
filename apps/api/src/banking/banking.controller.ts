import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Headers,
  UseGuards,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { BankingService } from './banking.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BankScopeGuard } from '../common/guards/bank-scope.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  TransferRequestSchema,
  TransferRequestInput,
  OpenAccountSchema,
  OpenAccountInput,
  UpdateCustomerStatusSchema,
  UpdateCustomerStatusInput,
  UpdateAccountStatusSchema,
  UpdateAccountStatusInput,
  UpdateAccountLimitsSchema,
  UpdateAccountLimitsInput,
} from '@arthax/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('banks')
@UseGuards(JwtAuthGuard)
export class BankingController {
  constructor(private readonly bankingService: BankingService) {}

  // ===========================================================================
  // 1. PUBLIC / CITIZEN BANK DISCOVERY
  // ===========================================================================

  @Get()
  async listBanks() {
    return this.bankingService.listBanks();
  }

  @Get(':bankId/details')
  async getBank(@Param('bankId') bankId: string) {
    return this.bankingService.getBank(bankId);
  }

  @Get(':bankId/products')
  async listBankProducts(@Param('bankId') bankId: string) {
    return this.bankingService.listBankProducts(bankId);
  }

  // ===========================================================================
  // 2. CITIZEN BANK RELATIONSHIPS & ACCOUNTS
  // ===========================================================================

  @Post(':bankId/join')
  async joinBank(
    @CurrentUser('sub') userId: string,
    @Param('bankId') bankId: string,
  ) {
    return this.bankingService.joinBank(userId, bankId);
  }

  @Post('accounts')
  @UsePipes(new ZodValidationPipe(OpenAccountSchema))
  async openAccount(
    @CurrentUser('sub') userId: string,
    @Body() body: OpenAccountInput,
  ) {
    return this.bankingService.openAccount(userId, body);
  }

  @Get('user/accounts')
  async listUserAccounts(
    @CurrentUser('sub') userId: string,
    @Query('bankId') bankId?: string,
  ) {
    return this.bankingService.listUserAccounts(userId, bankId);
  }

  @Get('accounts/:id')
  async getAccountDetails(
    @CurrentUser('sub') userId: string,
    @Param('id') accountId: string,
  ) {
    return this.bankingService.getAccountDetails(userId, accountId);
  }

  @Get('accounts/:id/transactions')
  async getAccountTransactions(
    @CurrentUser('sub') userId: string,
    @Param('id') accountId: string,
  ) {
    return this.bankingService.getAccountTransactions(userId, accountId);
  }

  // ===========================================================================
  // 3. INTRA-BANK TRANSFERS (MANDATORY IDEMPOTENCY KEY)
  // ===========================================================================

  @Post('transfers')
  @UsePipes(new ZodValidationPipe(TransferRequestSchema))
  async executeTransfer(
    @CurrentUser('sub') userId: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: TransferRequestInput,
  ) {
    if (!idempotencyKey || !idempotencyKey.trim()) {
      throw new BadRequestException(
        'Missing mandatory [Idempotency-Key] header. Financial transfers require an idempotency key to prevent double execution.',
      );
    }
    return this.bankingService.executeIntraBankTransfer(userId, body, idempotencyKey.trim());
  }

  // ===========================================================================
  // 4. BANK ADMIN SCOPED OPERATIONS (/bank PORTAL)
  // ===========================================================================

  @Get('admin/overview')
  @UseGuards(BankScopeGuard)
  async getBankAdminOverview(@CurrentUser('bankId') assignedBankId: string) {
    return this.bankingService.getBankAdminOverview(assignedBankId);
  }

  @Get('admin/customers')
  @UseGuards(BankScopeGuard)
  async listBankAdminCustomers(@CurrentUser('bankId') assignedBankId: string) {
    return this.bankingService.listBankAdminCustomers(assignedBankId);
  }

  @Get('admin/customers/:id')
  @UseGuards(BankScopeGuard)
  async getBankAdminCustomer(
    @CurrentUser('bankId') assignedBankId: string,
    @Param('id') customerId: string,
  ) {
    return this.bankingService.getBankAdminCustomer(assignedBankId, customerId);
  }

  @Patch('admin/customers/:id/status')
  @UseGuards(BankScopeGuard)
  @UsePipes(new ZodValidationPipe(UpdateCustomerStatusSchema))
  async updateCustomerStatus(
    @CurrentUser('bankId') assignedBankId: string,
    @Param('id') customerId: string,
    @Body() body: UpdateCustomerStatusInput,
  ) {
    return this.bankingService.updateCustomerStatus(assignedBankId, customerId, body);
  }

  @Get('admin/accounts')
  @UseGuards(BankScopeGuard)
  async listBankAdminAccounts(@CurrentUser('bankId') assignedBankId: string) {
    return this.bankingService.listBankAdminAccounts(assignedBankId);
  }

  @Patch('admin/accounts/:id/status')
  @UseGuards(BankScopeGuard)
  @UsePipes(new ZodValidationPipe(UpdateAccountStatusSchema))
  async updateBankAccountStatus(
    @CurrentUser('bankId') assignedBankId: string,
    @Param('id') accountId: string,
    @Body() body: UpdateAccountStatusInput,
  ) {
    return this.bankingService.updateBankAccountStatus(assignedBankId, accountId, body);
  }

  @Patch('admin/accounts/:id/limits')
  @UseGuards(BankScopeGuard)
  @UsePipes(new ZodValidationPipe(UpdateAccountLimitsSchema))
  async updateBankAccountLimits(
    @CurrentUser('bankId') assignedBankId: string,
    @Param('id') accountId: string,
    @Body() body: UpdateAccountLimitsInput,
  ) {
    return this.bankingService.updateBankAccountLimits(assignedBankId, accountId, body);
  }

  @Get('admin/transactions')
  @UseGuards(BankScopeGuard)
  async listBankAdminTransactions(@CurrentUser('bankId') assignedBankId: string) {
    return this.bankingService.listBankAdminTransactions(assignedBankId);
  }
}
