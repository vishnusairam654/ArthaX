import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('ARTHAX-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global route prefix
  app.setGlobalPrefix('api/v1');

  // Global filters & interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  const port = process.env.API_PORT || 3001;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`  ARTHAX SOVEREIGN FINANCIAL ENGINE ACTIVE`);
  logger.log(`  API Gateway: http://localhost:${port}/api/v1`);
  logger.log(`  CORS Allowed: ${corsOrigin}`);
  logger.log(`  Invariant: 1 ARTH = 100 minor units (integers only)`);
  logger.log(`  Double-Entry Ledger: Balanced journal enforcement on`);
  logger.log(`=======================================================`);
}

bootstrap();
