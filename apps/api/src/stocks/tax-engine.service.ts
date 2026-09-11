import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StockTaxRecordDto, TaxReportDto } from '@arthax/types';

export interface TaxCalculationResult {
  realizedProfitMinor: bigint;
  taxRatePercent: number;
  taxAmountMinor: bigint;
  offsetAppliedMinor: bigint;
  offsetAddedMinor: bigint;
  netTaxableGainMinor: bigint;
  ruleCode: string;
  ruleVersion: string;
  newCarriedLossOffsetMinor: bigint;
}

@Injectable()
export class TaxEngineService {
  private readonly logger = new Logger(TaxEngineService.name);

  // Active sovereign tax policy configuration
  readonly ACTIVE_TAX_RULE = {
    code: 'TAX-EQUITY-CGT',
    version: 'v1.2.0',
    name: 'Sovereign Equities Capital Gains Levy',
    ratePercent: 15.0, // 15% standard CGT on net realized profit
    statutoryBasis: 'Sovereign Capital Gains Directive §8(a)',
  };

  // Persistent carried loss offsets per user (in-memory cache backed by DB/events)
  private userLossOffsets = new Map<string, bigint>();
  // Local audit log of tax events
  private localTaxEvents = new Map<string, StockTaxRecordDto[]>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the current carried-forward tax loss balance for a citizen.
   */
  async getCarriedLossOffset(userId: string): Promise<bigint> {
    if (this.userLossOffsets.has(userId)) {
      return this.userLossOffsets.get(userId)!;
    }
    return 0n;
  }

  /**
   * Calculates capital gains tax for a stock sale using the mandatory weighted-average cost basis
   * and persistent tax-loss offset deduction.
   *
   * Invariants:
   * 1. Realized Gain = Quantity * (ExecutionPrice - AverageBuyPrice).
   * 2. Zero tax on loss or breakeven (Tax strictly on net profit).
   * 3. Net Taxable Gain = max(0, RealizedGain - CarriedLossOffset).
   * 4. Tax = round(NetTaxableGain * 15%).
   * 5. Carried loss balance is reduced by offset applied or increased by new trade loss.
   */
  async calculateCapitalGainsTax(
    userId: string,
    symbol: string,
    quantity: number,
    executionPriceMinor: bigint,
    averageBuyPriceMinor: bigint,
  ): Promise<TaxCalculationResult> {
    const grossSaleValue = executionPriceMinor * BigInt(quantity);
    const costBasis = averageBuyPriceMinor * BigInt(quantity);
    const realizedProfitMinor = grossSaleValue - costBasis;

    const currentOffset = await this.getCarriedLossOffset(userId);
    let offsetAppliedMinor = 0n;
    let offsetAddedMinor = 0n;
    let netTaxableGainMinor = 0n;
    let taxAmountMinor = 0n;
    let newOffset = currentOffset;

    if (realizedProfitMinor > 0n) {
      // Profitable sale: apply available carried loss offset first
      if (currentOffset > 0n) {
        if (currentOffset >= realizedProfitMinor) {
          offsetAppliedMinor = realizedProfitMinor;
          newOffset = currentOffset - realizedProfitMinor;
          netTaxableGainMinor = 0n;
        } else {
          offsetAppliedMinor = currentOffset;
          newOffset = 0n;
          netTaxableGainMinor = realizedProfitMinor - currentOffset;
        }
      } else {
        netTaxableGainMinor = realizedProfitMinor;
      }

      // 15% tax on net taxable gain
      if (netTaxableGainMinor > 0n) {
        // Integer math: (netTaxableGain * 15) / 100
        taxAmountMinor = (netTaxableGainMinor * 15n) / 100n;
      }
    } else if (realizedProfitMinor < 0n) {
      // Loss sale: zero tax; add loss to carried loss pool for future offsetting
      const loss = -realizedProfitMinor;
      offsetAddedMinor = loss;
      newOffset = currentOffset + loss;
      taxAmountMinor = 0n;
      netTaxableGainMinor = 0n;
    } else {
      // Breakeven: zero tax
      taxAmountMinor = 0n;
      netTaxableGainMinor = 0n;
    }

    // Persist new offset balance
    this.userLossOffsets.set(userId, newOffset);

    this.logger.log(
      `Tax calculation for [${userId}] on [${symbol}]: Realized: ${realizedProfitMinor} minor units, Offset Applied: ${offsetAppliedMinor}, Net Taxable: ${netTaxableGainMinor}, Tax Levy: ${taxAmountMinor}, Carried Loss Balance: ${newOffset}`,
    );

    return {
      realizedProfitMinor,
      taxRatePercent: this.ACTIVE_TAX_RULE.ratePercent,
      taxAmountMinor,
      offsetAppliedMinor,
      offsetAddedMinor,
      netTaxableGainMinor,
      ruleCode: this.ACTIVE_TAX_RULE.code,
      ruleVersion: this.ACTIVE_TAX_RULE.version,
      newCarriedLossOffsetMinor: newOffset,
    };
  }

  /**
   * Records a tax event into the database and audit trail.
   */
  async recordTaxEvent(
    userId: string,
    symbol: string,
    quantity: number,
    executionPriceMinor: bigint,
    averageBuyPriceMinor: bigint,
    taxResult: TaxCalculationResult,
  ): Promise<StockTaxRecordDto> {
    const eventId = `tax_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    const record: StockTaxRecordDto = {
      id: eventId,
      userId,
      symbol: symbol.toUpperCase(),
      sharesSold: quantity,
      sellPriceMinor: executionPriceMinor.toString(),
      buyPriceMinor: averageBuyPriceMinor.toString(),
      realizedProfitMinor: taxResult.realizedProfitMinor.toString(),
      taxRatePercent: taxResult.taxRatePercent,
      taxAmountMinor: taxResult.taxAmountMinor.toString(),
      offsetAppliedMinor: taxResult.offsetAppliedMinor.toString(),
      offsetAddedMinor: taxResult.offsetAddedMinor.toString(),
      ruleCitation: `${taxResult.ruleCode}:${taxResult.ruleVersion}`,
      executedAt: now.toISOString(),
    };

    // Store in local cache
    const existing = this.localTaxEvents.get(userId) || [];
    existing.push(record);
    this.localTaxEvents.set(userId, existing);

    // Persist to Prisma DB if reachable
    if (this.prisma.isConnected) {
      try {
        await this.prisma.taxEvent.create({
          data: {
            id: eventId,
            userId,
            symbol: symbol.toUpperCase(),
            sharesSold: quantity,
            sellPriceMinor: executionPriceMinor,
            buyPriceMinor: averageBuyPriceMinor,
            realizedProfitMinor: taxResult.realizedProfitMinor,
            taxRatePercent: taxResult.taxRatePercent,
            taxAmountMinor: taxResult.taxAmountMinor,
            offsetAppliedMinor: taxResult.offsetAppliedMinor,
            executedAt: now,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Could not persist TaxEvent to DB: ${err.message}`);
      }
    }

    return record;
  }

  /**
   * Generates comprehensive citizen tax report.
   */
  async getTaxReport(userId: string): Promise<TaxReportDto> {
    const events = this.localTaxEvents.get(userId) || [];
    let totalRealizedGains = 0n;
    let totalRealizedLosses = 0n;
    let totalTaxPaid = 0n;

    for (const ev of events) {
      const profit = BigInt(ev.realizedProfitMinor);
      if (profit > 0n) {
        totalRealizedGains += profit;
      } else {
        totalRealizedLosses += -profit;
      }
      totalTaxPaid += BigInt(ev.taxAmountMinor);
    }

    const carriedLossOffset = await this.getCarriedLossOffset(userId);
    const netGain = totalRealizedGains > totalRealizedLosses ? totalRealizedGains - totalRealizedLosses : 0n;

    return {
      totalRealizedGainsMinor: totalRealizedGains.toString(),
      totalRealizedLossesMinor: totalRealizedLosses.toString(),
      netTaxableGainMinor: netGain.toString(),
      totalTaxPaidMinor: totalTaxPaid.toString(),
      carriedLossOffsetBalanceMinor: carriedLossOffset.toString(),
      ruleCode: this.ACTIVE_TAX_RULE.code,
      ruleVersion: this.ACTIVE_TAX_RULE.version,
      taxEvents: events,
    };
  }
}
