import { Module } from '@nestjs/common';
import { CentralBankController } from './central-bank.controller';
import { CentralBankService } from './central-bank.service';
import { IdentityModule } from '../identity/identity.module';
import { LedgerModule } from '../ledger/ledger.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [IdentityModule, LedgerModule, AuditModule, NotificationsModule, PrismaModule],
  controllers: [CentralBankController],
  providers: [CentralBankService],
  exports: [CentralBankService],
})
export class CentralBankModule {}
