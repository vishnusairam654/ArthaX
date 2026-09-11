import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { LedgerModule } from '../ledger/ledger.module';
import { AuditModule } from '../audit/audit.module';
import { ClsService } from './cls.service';
import { ClsRoutingService } from './cls-routing.service';
import { ClsController } from './cls.controller';

@Module({
  imports: [PrismaModule, LedgerModule, AuditModule],
  controllers: [ClsController],
  providers: [ClsService, ClsRoutingService],
  exports: [ClsService, ClsRoutingService],
})
export class ClsModule {}
