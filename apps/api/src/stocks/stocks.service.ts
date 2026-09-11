import {
  Injectable,
  Logger,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service';
import { MarketEngineService } from './market-engine.service';
import { OrderMatchingService } from './order-matching.service';
import { TaxEngineService } from './tax-engine.service';
import { ReservationService } from './reservation.service';
import {
  StockCompanyDto,
  StockOrderDto,
  OrderBookDepthDto,
  UserPortfolioSummaryDto,
  PortfolioHoldingDto,
  TaxReportDto,
  SimulatedTickResultDto,
  TradeExecutionDto,
} from '@arthax/types';
import { PlaceStockOrderInput, SimulateMarketTickInput } from '@arthax/validation';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly marketEngineService: MarketEngineService,
    private readonly orderMatchingService: OrderMatchingService,
    private readonly taxEngineService: TaxEngineService,
    private readonly reservationService: ReservationService,
  ) {}

  /**
   * Retrieves all 10 canonical sovereign listed companies with integer minor-unit pricing.
   */
  async listCompanies(): Promise<StockCompanyDto[]> {
    return this.marketEngineService.listCompanies();
  }

  /**
   * Retrieves single company details by ticker symbol.
   */
  async getCompany(symbol: string): Promise<StockCompanyDto> {
    return this.marketEngineService.getCompany(symbol);
  }

  /**
   * Retrieves live Order Book depth (top bids and asks) for a stock.
   */
  async getOrderBookDepth(symbol: string): Promise<OrderBookDepthDto> {
    return this.orderMatchingService.getOrderBookDepth(symbol);
  }

  /**
   * Places an equity order on the sovereign blotter with mandatory step-up financial password verification.
   */
  async placeOrder(
    userId: string,
    input: PlaceStockOrderInput,
    idempotencyKey?: string,
  ): Promise<{ order: StockOrderDto; trades: TradeExecutionDto[]; isIdempotentReplay?: boolean }> {
    // 1. Step-up Financial Password verification
    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.financialPasswordHash) {
        const isPasswordValid = await argon2.verify(
          user.financialPasswordHash,
          input.financialPassword,
        );
        if (!isPasswordValid) {
          throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
        }
      }
    }

    // 2. Delegate to OrderMatchingService
    return this.orderMatchingService.placeAndMatchOrder(
      userId,
      {
        symbol: input.symbol,
        side: input.side,
        type: input.type,
        quantity: input.quantity,
        priceMinor: input.priceMinor,
        sourceAccountId: input.sourceAccountId,
      },
      idempotencyKey,
    );
  }

  /**
   * Cancels an open or partially filled order and releases reservations.
   */
  async cancelOrder(userId: string, orderId: string): Promise<StockOrderDto> {
    return this.orderMatchingService.cancelOrder(userId, orderId);
  }

  /**
   * Retrieves all blotter orders for a user or symbol.
   */
  async listOrders(userId?: string, symbol?: string): Promise<StockOrderDto[]> {
    return this.orderMatchingService.listOrders(userId, symbol);
  }

  /**
   * Retrieves specific order by ID.
   */
  async getOrder(orderId: string): Promise<StockOrderDto> {
    return this.orderMatchingService.getOrder(orderId);
  }

  /**
   * Retrieves mark-to-market citizen portfolio summary.
   */
  async getUserPortfolio(userId: string): Promise<UserPortfolioSummaryDto> {
    return this.orderMatchingService.getUserPortfolio(userId);
  }

  /**
   * Retrieves holding for a specific company.
   */
  async getHolding(userId: string, symbol: string): Promise<PortfolioHoldingDto | null> {
    return this.orderMatchingService.getHolding(userId, symbol);
  }

  /**
   * Generates citizen capital gains tax and loss-offset report.
   */
  async getTaxReport(userId: string): Promise<TaxReportDto> {
    return this.taxEngineService.getTaxReport(userId);
  }

  /**
   * Simulates market price drift using 5-factor model and circuit clamping.
   */
  async simulateTick(
    symbol?: string,
    input?: SimulateMarketTickInput,
  ): Promise<SimulatedTickResultDto> {
    const sym = symbol || input?.symbol || 'NILA';
    return this.marketEngineService.simulateTick(sym, {
      orderBookPressure: input?.orderBookPressure,
      marketSentiment: input?.marketSentiment,
    });
  }

  // --- Testing & Initial Provisioning Helpers ---

  seedHolding(userId: string, symbol: string, shares: number, averageBuyPriceMinor: bigint): void {
    this.orderMatchingService.seedHolding(userId, symbol, shares, averageBuyPriceMinor);
  }

  seedAccountBalance(accountId: string, balanceMinor: bigint): void {
    this.orderMatchingService.seedAccountBalance(accountId, balanceMinor);
  }
}
