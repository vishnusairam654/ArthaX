import { Module } from '@nestjs/common';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';
import { BalanceEngineService } from './balance-engine.service';
import { AuditModule } from '../audit/audit.module';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [IdentityModule, AuditModule],
  controllers: [LedgerController],
  providers: [LedgerService, BalanceEngineService],
  exports: [LedgerService, BalanceEngineService],
})
export class LedgerModule {}
