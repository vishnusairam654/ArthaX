import { Module } from '@nestjs/common';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';
import { LoansController } from './loans/loans.controller';
import { LoansService } from './loans/loans.service';
import { CreditUnderwritingService } from './loans/credit-underwriting.service';
import { LedgerModule } from '../ledger/ledger.module';
import { IdentityModule } from '../identity/identity.module';
import { ClsModule } from '../cls/cls.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [LedgerModule, IdentityModule, ClsModule, NotificationsModule],
  controllers: [BankingController, LoansController],
  providers: [BankingService, LoansService, CreditUnderwritingService],
  exports: [BankingService, LoansService, CreditUnderwritingService],
})
export class BankingModule {}

