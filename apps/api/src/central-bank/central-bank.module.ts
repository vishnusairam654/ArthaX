import { Module } from '@nestjs/common';
import { CentralBankController } from './central-bank.controller';
import { CentralBankService } from './central-bank.service';
import { IdentityModule } from '../identity/identity.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [IdentityModule, LedgerModule],
  controllers: [CentralBankController],
  providers: [CentralBankService],
  exports: [CentralBankService],
})
export class CentralBankModule {}
