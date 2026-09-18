import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BankScopeGuard } from '../../common/guards/bank-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  ApplyLoanInput,
  ReviewLoanInput,
  DisburseLoanInput,
  PayLoanEmiInput,
  ForecloseLoanInput,
  LoanSimulationInput,
} from '@arthax/validation';

@Controller()
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  // ---------------------------------------------------------------------------
  // CITIZEN PUBLIC / DISCOVERY ENDPOINTS
  // ---------------------------------------------------------------------------

  @Get('loans/products')
  async listProducts(@Query('bankId') bankId?: string) {
    return this.loansService.listLoanProducts(bankId);
  }

  @Post('loans/simulate')
  async simulate(@Body() input: LoanSimulationInput) {
    return this.loansService.simulateLoan(input);
  }

  // ---------------------------------------------------------------------------
  // CITIZEN AUTHENTICATED ENDPOINTS
  // ---------------------------------------------------------------------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('loans/apply')
  async apply(
    @Request() req: any,
    @Body() input: ApplyLoanInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.loansService.applyForLoan(req.user.sub, input, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('loans/my-loans')
  async getMyLoans(@Request() req: any) {
    return this.loansService.getCitizenLoans(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('loans/:id')
  async getLoan(@Request() req: any, @Param('id') id: string) {
    return this.loansService.getLoanById(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('loans/:id/disburse')
  async disburse(
    @Request() req: any,
    @Param('id') id: string,
    @Body() input: DisburseLoanInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.loansService.disburseLoan(req.user.sub, id, input, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('loans/:id/repay-emi')
  async repayEmi(
    @Request() req: any,
    @Param('id') id: string,
    @Body() input: PayLoanEmiInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.loansService.repayEmi(req.user.sub, id, input, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post('loans/:id/foreclose')
  async foreclose(
    @Request() req: any,
    @Param('id') id: string,
    @Body() input: ForecloseLoanInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.loansService.forecloseLoan(req.user.sub, id, input, idempotencyKey);
  }

  // ---------------------------------------------------------------------------
  // BANK OFFICER / ADMIN ENDPOINTS (SCOPED BY BANK)
  // ---------------------------------------------------------------------------

  @UseGuards(JwtAuthGuard, RolesGuard, BankScopeGuard)
  @Roles('BANK_ADMIN')
  @Get('bank/:bankId/loans/queue')
  async getBankLoanQueue(@Param('bankId') bankId: string) {
    return this.loansService.getBankLoansQueue(bankId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, BankScopeGuard)
  @Roles('BANK_ADMIN')
  @Post('bank/:bankId/loans/:id/review')
  async reviewLoan(
    @Request() req: any,
    @Param('bankId') bankId: string,
    @Param('id') id: string,
    @Body() input: ReviewLoanInput,
  ) {
    return this.loansService.reviewLoan(req.user.sub, bankId, id, input);
  }
}
