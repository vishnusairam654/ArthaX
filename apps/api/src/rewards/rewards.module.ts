import { Module } from '@nestjs/common';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { LedgerModule } from '../ledger/ledger.module';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [LedgerModule, IdentityModule],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
