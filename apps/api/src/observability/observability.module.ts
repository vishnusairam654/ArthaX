import { Module, forwardRef } from '@nestjs/common';
import { HealthController } from './health.controller';
import { LedgerWatcherService } from './ledger-watcher.service';
import { PrismaModule } from '../database/prisma.module';
import { LedgerModule } from '../ledger/ledger.module';
import { CentralBankModule } from '../central-bank/central-bank.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => LedgerModule),
    forwardRef(() => CentralBankModule),
    AuditModule,
  ],
  controllers: [HealthController],
  providers: [LedgerWatcherService],
  exports: [LedgerWatcherService],
})
export class ObservabilityModule {}
