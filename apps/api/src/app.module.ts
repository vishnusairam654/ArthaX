import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { CentralBankController } from "./central-bank/central-bank.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { LedgerModule } from "./ledger/ledger.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LedgerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.test", ".env"],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
      }),
    }),
  ],
  controllers: [AuthController, CentralBankController],
})
export class AppModule {}
