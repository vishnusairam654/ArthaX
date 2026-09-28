import { Global, Module } from '@nestjs/common';
import { SessionStoreService } from './services/session-store.service';
import { EmailService } from './services/email.service';
import { SupabaseAuthService } from './services/supabase-auth.service';

@Global()
@Module({
  providers: [SessionStoreService, EmailService, SupabaseAuthService],
  exports: [SessionStoreService, EmailService, SupabaseAuthService],
})
export class CommonModule {}

