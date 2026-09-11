import { Module } from '@nestjs/common';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';
import { LedgerModule } from '../ledger/ledger.module';
import { IdentityModule } from '../identity/identity.module';
import { ClsModule } from '../cls/cls.module';

@Module({
  imports: [LedgerModule, IdentityModule, ClsModule],
  controllers: [BankingController],
  providers: [BankingService],
  exports: [BankingService],
})
export class BankingModule {}
