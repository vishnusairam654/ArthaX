import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { BalanceEngineService } from './balance-engine.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  TransactionType,
  TransactionScope,
  TransactionEntryType,
  TransactionDto,
} from '@arthax/types';

export class PostEntryDto {
  ledgerAccountId: string;
  entryType: TransactionEntryType;
  amountMinor: string;
}

export class PostTransactionHttpDto {
  referenceNumber?: string;
  type: TransactionType;
  scope: TransactionScope;
  amountMinor: string;
  feesMinor?: string;
  taxMinor?: string;
  initiatedBy?: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  metadata?: Record<string, unknown>;
  entries: PostEntryDto[];
}

export class ReverseTransactionHttpDto {
  reason: string;
}

@Controller('ledger')
@UseGuards(JwtAuthGuard)
export class LedgerController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly balanceEngine: BalanceEngineService,
  ) {}

  /**
   * POST /api/v1/ledger/transactions
   * Executes an atomic, balanced double-entry transaction.
   * MANDATORY: Idempotency-Key header is strictly required on financial writes.
   */
  @Post('transactions')
  async recordTransaction(
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: PostTransactionHttpDto,
  ): Promise<TransactionDto> {
    if (!idempotencyKey || !idempotencyKey.trim()) {
      throw new BadRequestException(
        'Missing mandatory [Idempotency-Key] header. Financial writes require an idempotency key to prevent accidental duplicate execution.',
      );
    }

    if (!body.entries || !Array.isArray(body.entries) || body.entries.length < 2) {
      throw new BadRequestException('A double-entry transaction must contain at least 2 entries');
    }

    let parsedAmountMinor: bigint;
    try {
      parsedAmountMinor = BigInt(body.amountMinor);
    } catch {
      throw new BadRequestException(`Invalid amountMinor: [${body.amountMinor}]`);
    }

    const parsedEntries = body.entries.map((e, index) => {
      try {
        return {
          ledgerAccountId: e.ledgerAccountId,
          entryType: e.entryType,
          amountMinor: BigInt(e.amountMinor),
        };
      } catch {
        throw new BadRequestException(`Invalid amountMinor on entry #${index + 1}: [${e.amountMinor}]`);
      }
    });

    return await this.ledgerService.recordBalancedTransaction({
      idempotencyKey: idempotencyKey.trim(),
      referenceNumber: body.referenceNumber,
      type: body.type,
      scope: body.scope || 'INTERNAL',
      amountMinor: parsedAmountMinor,
      feesMinor: body.feesMinor ? BigInt(body.feesMinor) : 0n,
      taxMinor: body.taxMinor ? BigInt(body.taxMinor) : 0n,
      initiatedBy: body.initiatedBy,
      sourceAccountId: body.sourceAccountId,
      destinationAccountId: body.destinationAccountId,
      metadata: body.metadata,
      entries: parsedEntries,
    });
  }

  /**
   * GET /api/v1/ledger/transactions/:id
   * Retrieves transaction by ID or reference number with full immutable entries.
   */
  @Get('transactions/:id')
  async getTransaction(@Param('id') id: string): Promise<TransactionDto> {
    return await this.ledgerService.getTransaction(id);
  }

  /**
   * POST /api/v1/ledger/transactions/:id/reverse
   * Reverses a COMPLETED transaction by creating balanced contra-entries.
   */
  @Post('transactions/:id/reverse')
  async reverseTransaction(
    @Param('id') id: string,
    @Body() body: ReverseTransactionHttpDto,
  ): Promise<TransactionDto> {
    if (!body?.reason || !body.reason.trim()) {
      throw new BadRequestException('A non-empty reversal reason is strictly required.');
    }
    return await this.ledgerService.reverseTransaction(id, body.reason.trim());
  }

  /**
   * GET /api/v1/ledger/accounts/:id/balance
   * Returns account balance details (both snapshot and verified raw calculation).
   */
  @Get('accounts/:id/balance')
  async getAccountBalance(@Param('id') id: string) {
    return await this.ledgerService.getAccountBalance(id);
  }

  /**
   * POST /api/v1/ledger/accounts/:id/reconcile
   * Triggers explicit balance snapshot reconciliation against raw ledger entries.
   */
  @Post('accounts/:id/reconcile')
  async reconcileAccount(@Param('id') id: string) {
    return await this.balanceEngine.reconcileAccount(id);
  }

  /**
   * GET /api/v1/ledger/integrity
   * Central Bank / Financial Auditor macroeconomic double-entry verification.
   * Proves global SUM(Debits) === SUM(Credits) across all completed transactions.
   */
  @Get('integrity')
  async verifyGlobalIntegrity() {
    return await this.balanceEngine.verifyGlobalLedgerIntegrity();
  }
}
