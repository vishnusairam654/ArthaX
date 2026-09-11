import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@arthax/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? [
              { emit: 'stdout', level: 'info' },
              { emit: 'stdout', level: 'warn' },
              { emit: 'stdout', level: 'error' },
            ]
          : [{ emit: 'stdout', level: 'error' }],
    });

    // Enforce immutable append-only invariant at runtime if middleware hook is active
    if (typeof (this as any).$use === 'function') {
      (this as any).$use(async (params: any, next: any) => {
        const appendOnlyModels = ['TransactionEntry', 'AuditLog', 'SystemLog', 'SecurityEvent'];
        const forbiddenActions = ['update', 'updateMany', 'delete', 'deleteMany', 'upsert'];

        if (params.model && appendOnlyModels.includes(params.model)) {
          if (forbiddenActions.includes(params.action)) {
            throw new ForbiddenException(
              `[SOVEREIGN INVARIANT VIOLATION] Model '${params.model}' is strictly append-only. Operation '${params.action}' is rejected by sovereign decree.`,
            );
          }
        }

        return next(params);
      });
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Connected to ARTHAX PostgreSQL sovereign database');
    } catch (err) {
      this.isConnected = false;
      this.logger.warn(
        `Database connection deferred (PostgreSQL offline). API running in resilient local state: ${(err as Error).message}`,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.isConnected = false;
  }

  /**
   * Enforces append-only invariant on ledger entry and audit log writes.
   * Double-entry ledger entries cannot be mutated or deleted.
   */
  assertAppendOnly(operation: string, model: string) {
    const forbidden = ['update', 'delete', 'upsert'];
    if (forbidden.some((f) => operation.toLowerCase().includes(f))) {
      throw new ForbiddenException(
        `[SOVEREIGN INVARIANT VIOLATION] Model '${model}' is strictly append-only. Operation '${operation}' is rejected by sovereign decree.`,
      );
    }
  }
}
