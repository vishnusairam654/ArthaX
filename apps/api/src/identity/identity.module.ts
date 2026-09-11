import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'arthax_dev_jwt_secret_change_in_production_sovereign_key_9841',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService, JwtModule],
})
export class IdentityModule {}
