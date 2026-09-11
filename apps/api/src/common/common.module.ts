import { Global, Module } from '@nestjs/common';
import { SessionStoreService } from './services/session-store.service';

@Global()
@Module({
  providers: [SessionStoreService],
  exports: [SessionStoreService],
})
export class CommonModule {}
