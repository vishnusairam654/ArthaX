import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  ForbiddenException,
  ServiceUnavailableException,
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

    // Enforce immutable append-only invariant and fail-closed financial writes at runtime
    if (typeof (this as any).$use === 'function') {
      (this as any).$use(async (params: any, next: any) => {
        const appendOnlyModels = ['TransactionEntry', 'SystemLog', 'SecurityEvent'];
        const forbiddenActions = ['update', 'updateMany', 'delete', 'deleteMany', 'upsert'];

        if (params.model && appendOnlyModels.includes(params.model)) {
          if (forbiddenActions.includes(params.action)) {
            throw new ForbiddenException(
              `[SOVEREIGN INVARIANT VIOLATION] Model '${params.model}' is strictly append-only. Operation '${params.action}' is rejected by sovereign decree.`,
            );
          }
        }

        const financialModels = [
          'Transaction',
          'TransactionEntry',
          'BankAccount',
          'LedgerAccount',
          'Settlement',
          'UserFd',
          'Loan',
          'UserLoan',
          'Trade',
          'Order',
        ];
        const writeActions = ['create', 'createMany', 'update', 'updateMany', 'delete', 'deleteMany', 'upsert'];

        if (params.model && financialModels.includes(params.model) && writeActions.includes(params.action)) {
          if (!this.isConnected) {
            throw new ServiceUnavailableException(
              `[FAIL CLOSED] Financial write on '${params.model}.${params.action}' rejected: Sovereign PostgreSQL database is unavailable. Ledger transactions require durable ACID persistence.`,
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
   * Asserts that database is online for any financial write.
   * INVARIANT: ALL financial writes MUST fail closed when PostgreSQL is unavailable.
   */
  assertFinancialWriteSafe(operationName: string) {
    if (!this.isConnected) {
      this.logger.error(`[FAIL CLOSED] Financial write '${operationName}' rejected: PostgreSQL database is offline.`);
      throw new ServiceUnavailableException(
        `Financial write '${operationName}' rejected: Sovereign PostgreSQL database is unavailable. Ledger transactions require durable ACID persistence and cannot be executed in transient memory.`,
      );
    }
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
