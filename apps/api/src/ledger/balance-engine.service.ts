import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface ReconciliationResult {
  ledgerAccountId: string;
  isReconciled: boolean;
  corrected: boolean;
  rawBalanceMinor: string;
  snapshotBalanceMinor: string;
  deltaMinor: string;
  checkedAt: string;
}

export interface GlobalIntegrityResult {
  isBalanced: boolean;
  totalDebitsMinor: string;
  totalCreditsMinor: string;
  imbalanceMinor: string;
  entryCount: number;
  checkedAt: string;
}

@Injectable()
export class BalanceEngineService {
  private readonly logger = new Logger(BalanceEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Derives real-time account balance directly from the immutable raw entry stream.
   * Net Balance = SUM(CREDIT) - SUM(DEBIT) for all COMPLETED transactions.
   */
  async calculateRawBalance(ledgerAccountId: string, prismaClient?: any): Promise<bigint> {
    const client = prismaClient || this.prisma;

    const entries = await client.transactionEntry.findMany({
      where: {
        ledgerAccountId,
        transaction: {
          status: 'COMPLETED',
        },
      },
      select: {
        entryType: true,
        amountMinor: true,
      },
    });

    let rawBalance = 0n;
    for (const entry of entries) {
      if (entry.entryType === 'CREDIT') {
        rawBalance += entry.amountMinor;
      } else if (entry.entryType === 'DEBIT') {
        rawBalance -= entry.amountMinor;
      }
    }

    return rawBalance;
  }

  /**
   * Reconciles cached balanceSnapshot against raw immutable entry stream.
   * If drift is detected, snapshot is corrected atomically and a security audit event is emitted.
   */
  async reconcileAccount(ledgerAccountId: string): Promise<ReconciliationResult> {
    const account = await this.prisma.ledgerAccount.findUnique({
      where: { id: ledgerAccountId },
    });

    if (!account) {
      throw new NotFoundException(`Ledger account [${ledgerAccountId}] not found`);
    }

    const rawBalance = await this.calculateRawBalance(ledgerAccountId);
    const snapshotBalance = account.balanceSnapshot;
    const delta = rawBalance - snapshotBalance;
    const isReconciled = delta === 0n;

    let corrected = false;
    if (!isReconciled) {
      this.logger.warn(
        `Balance drift detected on account [${ledgerAccountId}]! Snapshot: ${snapshotBalance}, Raw: ${rawBalance}, Delta: ${delta}. Reconciling...`,
      );

      await this.prisma.ledgerAccount.update({
        where: { id: ledgerAccountId },
        data: {
          balanceSnapshot: rawBalance,
          snapshotAt: new Date(),
        },
      });
      corrected = true;

      await this.auditService.logEvent({
        eventType: 'SECURITY_EVENT',
        actorId: 'BALANCE_ENGINE',
        actorRole: 'SYSTEM',
        targetEntity: `LEDGER_ACCOUNT:${ledgerAccountId}`,
        action: `Balance snapshot drift corrected. Previous snapshot: ${snapshotBalance}, Derived raw: ${rawBalance}, Drift: ${delta}`,
        severity: 'CRITICAL',
      });
    }

    return {
      ledgerAccountId,
      isReconciled,
      corrected,
      rawBalanceMinor: rawBalance.toString(),
      snapshotBalanceMinor: snapshotBalance.toString(),
      deltaMinor: delta.toString(),
      checkedAt: new Date().toISOString(),
    };
  }

  /**
   * Verifies global sovereign macroeconomic balance:
   * SUM(All COMPLETED Debits) === SUM(All COMPLETED Credits) across the entire economy.
   */
  async verifyGlobalLedgerIntegrity(): Promise<GlobalIntegrityResult> {
    const completedEntries = await this.prisma.transactionEntry.findMany({
      where: {
        transaction: {
          status: 'COMPLETED',
        },
      },
      select: {
        entryType: true,
        amountMinor: true,
      },
    });

    let totalDebits = 0n;
    let totalCredits = 0n;

    for (const entry of completedEntries) {
      if (entry.entryType === 'DEBIT') {
        totalDebits += entry.amountMinor;
      } else if (entry.entryType === 'CREDIT') {
        totalCredits += entry.amountMinor;
      }
    }

    const isBalanced = totalDebits === totalCredits;
    const imbalance = totalDebits - totalCredits;

    if (!isBalanced) {
      this.logger.error(
        `CRITICAL SOVEREIGN IMBALANCE: Global Debits (${totalDebits}) != Global Credits (${totalCredits})! Imbalance: ${imbalance}`,
      );

      await this.auditService.logEvent({
        eventType: 'SECURITY_EVENT',
        actorId: 'BALANCE_ENGINE',
        actorRole: 'SYSTEM',
        targetEntity: 'GLOBAL_LEDGER',
        action: `Global sovereign ledger imbalance detected! Debits: ${totalDebits}, Credits: ${totalCredits}, Imbalance: ${imbalance}`,
        severity: 'CRITICAL',
      });
    }

    return {
      isBalanced,
      totalDebitsMinor: totalDebits.toString(),
      totalCreditsMinor: totalCredits.toString(),
      imbalanceMinor: imbalance.toString(),
      entryCount: completedEntries.length,
      checkedAt: new Date().toISOString(),
    };
  }
}
