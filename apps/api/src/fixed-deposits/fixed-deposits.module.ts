import { Module } from '@nestjs/common';
import { FixedDepositsService } from './fixed-deposits.service';
import { FixedDepositsController } from './fixed-deposits.controller';
import { PrismaModule } from '../database/prisma.module';
import { LedgerModule } from '../ledger/ledger.module';
import { AuditModule } from '../audit/audit.module';
import { ShopModule } from '../shop/shop.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    LedgerModule,
    AuditModule,
    ShopModule,
    NotificationsModule,
  ],
  controllers: [FixedDepositsController],
  providers: [FixedDepositsService],
  exports: [FixedDepositsService],
})
export class FixedDepositsModule {}
