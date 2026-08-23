import { Module } from "@nestjs/common";
import { LedgerController } from "./ledger.controller";
import { LedgerService } from "./ledger.service";
import { TransactionEngineService } from "./transaction-engine.service";

@Module({
  controllers: [LedgerController],
  providers: [LedgerService, TransactionEngineService],
  exports: [LedgerService, TransactionEngineService],
})
export class LedgerModule {}
