import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './database/prisma.module';
import { AuditModule } from './audit/audit.module';
import { IdentityModule } from './identity/identity.module';
import { LedgerModule } from './ledger/ledger.module';
import { BankingModule } from './banking/banking.module';
import { StocksModule } from './stocks/stocks.module';
import { CentralBankModule } from './central-bank/central-bank.module';
import { ShopModule } from './shop/shop.module';
import { RewardsModule } from './rewards/rewards.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ClsModule } from './cls/cls.module';
import { FixedDepositsModule } from './fixed-deposits/fixed-deposits.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    CommonModule,
    PrismaModule,
    AuditModule,
    IdentityModule,
    LedgerModule,
    BankingModule,
    ClsModule,
    StocksModule,
    CentralBankModule,
    ShopModule,
    RewardsModule,
    NotificationsModule,
    FixedDepositsModule,
    ObservabilityModule,
  ],
})
export class AppModule {}
