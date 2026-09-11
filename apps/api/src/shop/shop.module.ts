import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { LedgerModule } from '../ledger/ledger.module';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [LedgerModule, IdentityModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
