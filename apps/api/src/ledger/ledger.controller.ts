import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TransactionEngineService, type TransferCommand } from "./transaction-engine.service";
import { LedgerService } from "./ledger.service";
import type { CoreTransaction } from "@prisma/client";
import { CreateTransferDto, ReverseDto } from "./dto/ledger.dto";
import { JwtAuthGuard } from "../auth/guards/auth.guards";
import { UseGuards } from "@nestjs/common";

/** BigInt-safe JSON shape for API responses. */
function serializeTx(tx: CoreTransaction) {
  return {
    ...tx,
    amountMinor: tx.amountMinor.toString(),
    feeMinor: tx.feeMinor.toString(),
  };
}

@Controller("ledger")
@UseGuards(JwtAuthGuard)
export class LedgerController {
  constructor(
    private readonly engine: TransactionEngineService,
    private readonly ledger: LedgerService,
  ) {}

  @Post("transfers")
  async transfer(@Body() dto: CreateTransferDto) {
    const cmd: TransferCommand = {
      idempotencyKey: dto.idempotencyKey,
      amountMinor: BigInt(dto.amountMinor),
      fromLedgerAccountId: dto.fromLedgerAccountId,
      toLedgerAccountId: dto.toLedgerAccountId,
      reference: dto.reference,
    };
    return serializeTx(await this.engine.executeTransfer(cmd));
  }

  @Get("transactions/:id")
  async transaction(@Param("id") id: string) {
    const tx = await this.engine.getTransactionDetail(id);
    if (!tx) return null;
    return {
      ...serializeTx(tx),
      journalEntries: tx.journalEntries.map((e) => ({
        id: e.id,
        description: e.description,
        postings: e.postings.map((p) => ({
          ...p,
          amountMinor: p.amountMinor.toString(),
        })),
      })),
      events: tx.events,
    };
  }

  @Post("transactions/:id/reverse")
  async reverse(@Param("id") id: string, @Body() dto: ReverseDto) {
    return serializeTx(await this.engine.reverse(id, dto.idempotencyKey));
  }

  @Get("accounts/:id/balance")
  async balance(@Param("id") id: string) {
    return { accountId: id, balanceMinor: (await this.ledger.getBalanceMinor(id)).toString() };
  }

  /** Reconciliation probe: must always be "0". */
  @Get("reconciliation/net")
  async net() {
    return { ledgerNetMinor: (await this.ledger.globalLedgerNet()).toString() };
  }
}
