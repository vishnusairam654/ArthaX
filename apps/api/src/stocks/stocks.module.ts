import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { MarketEngineService } from './market-engine.service';
import { OrderMatchingService } from './order-matching.service';
import { TaxEngineService } from './tax-engine.service';
import { ReservationService } from './reservation.service';
import { LedgerModule } from '../ledger/ledger.module';
import { IdentityModule } from '../identity/identity.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule, LedgerModule, IdentityModule],
  controllers: [StocksController],
  providers: [
    StocksService,
    MarketEngineService,
    OrderMatchingService,
    TaxEngineService,
    ReservationService,
  ],
  exports: [
    StocksService,
    MarketEngineService,
    OrderMatchingService,
    TaxEngineService,
    ReservationService,
  ],
})
export class StocksModule {}
