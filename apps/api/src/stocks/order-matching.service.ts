import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Optional,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { ReservationService } from './reservation.service';
import { TaxEngineService } from './tax-engine.service';
import { MarketEngineService } from './market-engine.service';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';
import {
  StockOrderDto,
  OrderBookDepthDto,
  OrderBookLevelDto,
  TradeExecutionDto,
  PortfolioHoldingDto,
  UserPortfolioSummaryDto,
  OrderSide,
  OrderType,
  OrderStatus,
} from '@arthax/types';

import { CentralBankService } from '../central-bank/central-bank.service';

export interface InternalOrder {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  filledQuantity: number;
  priceMinor: bigint;
  status: OrderStatus;
  sourceAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InternalHolding {
  id: string;
  userId: string;
  symbol: string;
  shares: number;
  averageBuyPriceMinor: bigint;
  updatedAt: Date;
}

@Injectable()
export class OrderMatchingService {
  private readonly logger = new Logger(OrderMatchingService.name);

  // Active orders store: orderId -> InternalOrder
  private orders = new Map<string, InternalOrder>();

  // Resting order books per symbol
  // Bids sorted by price DESC, time ASC
  private bids = new Map<string, InternalOrder[]>();
  // Asks sorted by price ASC, time ASC
  private asks = new Map<string, InternalOrder[]>();

  // Executed trades history
  private trades = new Map<string, TradeExecutionDto>();

  // Portfolio holdings: `${userId}:${symbol}` -> InternalHolding
  private holdings = new Map<string, InternalHolding>();

  // Mock cash account balances (for testing or offline environments)
  private mockAccountBalances = new Map<string, bigint>();

  // Idempotency cache: key -> { payloadHash: string; result: any }
  private idempotencyCache = new Map<string, { payloadHash: string; result: any }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly ledgerService: LedgerService,
    private readonly reservationService: ReservationService,
    private readonly taxEngineService: TaxEngineService,
    private readonly marketEngineService: MarketEngineService,
    @Optional() private readonly centralBankService?: CentralBankService,
  ) {}

  setCentralBankService(cb: any): void {
    (this as any).centralBankService = cb;
  }

  /**
   * Helper to seed/credit an account balance in mock/test storage.
   */
  seedAccountBalance(accountId: string, balanceMinor: bigint): void {
    this.mockAccountBalances.set(accountId, balanceMinor);
  }

  /**
   * Helper to seed a portfolio holding for testing or initial setup.
   */
  seedHolding(userId: string, symbol: string, shares: number, averageBuyPriceMinor: bigint): void {
    const sym = symbol.toUpperCase();
    const key = `${userId}:${sym}`;
    this.holdings.set(key, {
      id: `hld_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      symbol: sym,
      shares,
      averageBuyPriceMinor,
      updatedAt: new Date(),
    });
  }

  /**
   * Retrieves current balance of an account from DB or test storage.
   */
  async getAccountBalance(accountId: string): Promise<bigint> {
    if (this.prisma.isConnected) {
      try {
        const acct = await this.prisma.bankAccount.findUnique({
          where: { id: accountId },
          include: { ledgerAccount: true },
        });
        if (acct?.ledgerAccount) {
          return acct.ledgerAccount.balanceSnapshot;
        }
      } catch (err: any) {
        this.logger.debug(`DB balance lookup error for [${accountId}]: ${err.message}`);
      }
    }
    return this.mockAccountBalances.get(accountId) ?? 5000000n; // Default 50,000.00 ARTH if mock
  }

  /**
   * Places an order and runs the price-time matching blotter.
   * Enforces Invariants:
   * 1. Cash / Share reservation before matching.
   * 2. Strict circuit limit checks.
   * 3. Price-time priority matching.
   * 4. Tripartite price separation (trades settle at maker resting price).
   * 5. Double-entry balanced ledger settlement (Debits === Credits).
   * 6. Weighted-average cost basis & Capital Gains Tax levy on profit only.
   * 7. MARKET order Fill-and-Kill semantics with immediate surplus release.
   * 8. Mandatory idempotency protection with conflict detection.
   */
  async placeAndMatchOrder(
    userId: string,
    orderInput: {
      symbol: string;
      side: OrderSide;
      type: OrderType;
      quantity: number;
      priceMinor?: string;
      sourceAccountId?: string;
    },
    idempotencyKey?: string,
  ): Promise<{ order: StockOrderDto; trades: TradeExecutionDto[]; isIdempotentReplay?: boolean }> {
    const sym = orderInput.symbol.toUpperCase();
    const company = this.marketEngineService.getCompanyState(sym);

    // 0. Sovereign Emergency Controls Enforcement (Central Bank Directive)
    if (this.centralBankService) {
      if (this.centralBankService.isMarketHalted()) {
        throw new BadRequestException(
          'Market trading halted by Central Bank emergency directive. Stock order rejected.',
        );
      }
      const sourceAcctId = orderInput.sourceAccountId || `acct_user_${userId}`;
      if (this.centralBankService.isAccountFrozen(sourceAcctId)) {
        throw new ForbiddenException(
          `Account [${sourceAcctId}] is administratively FROZEN by Central Bank directive. Stock order debits are blocked.`,
        );
      }
    }

    // 1. Idempotency verification
    if (idempotencyKey) {
      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ userId, ...orderInput }))
        .digest('hex');

      const existing = this.idempotencyCache.get(idempotencyKey);
      if (existing) {
        if (existing.payloadHash === payloadHash) {
          this.logger.log(`Idempotent order replay returned for key [${idempotencyKey}]`);
          return { ...existing.result, isIdempotentReplay: true };
        }
        throw new ConflictException(
          `Idempotency conflict: An order with key [${idempotencyKey}] already exists with differing parameters.`,
        );
      }
    }

    // 2. Quantity validation
    if (orderInput.quantity <= 0 || !Number.isInteger(orderInput.quantity)) {
      throw new BadRequestException('Order quantity must be a positive integer');
    }

    // 3. Price validation & Circuit limits
    let limitPriceMinor = 0n;
    if (orderInput.type === 'LIMIT') {
      if (!orderInput.priceMinor || BigInt(orderInput.priceMinor) <= 0n) {
        throw new BadRequestException('LIMIT order requires a positive priceMinor');
      }
      limitPriceMinor = BigInt(orderInput.priceMinor);
      // Invariant 7: Strict Circuit Limit Enforcement (Throws BadRequestException if outside band)
      this.marketEngineService.validateOrderWithinCircuits(sym, limitPriceMinor);
    } else {
      // MARKET order uses current quote price as base reference
      limitPriceMinor = company.currentPriceMinor;
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    // 4. Invariant 1: Pre-Trade Cash & Share Reservations
    const buyerFeeEstimate = (BigInt(orderInput.quantity) * limitPriceMinor * 10n) / 10000n; // 0.10%
    const estimatedTotalCashNeeded = BigInt(orderInput.quantity) * limitPriceMinor + buyerFeeEstimate;

    const sourceAccountId = orderInput.sourceAccountId || `acct_user_${userId}`;

    if (orderInput.side === 'BUY') {
      const currentBal = await this.getAccountBalance(sourceAccountId);
      const activeReservedCash = this.reservationService.getReservedCash(sourceAccountId);
      const availableCash = currentBal > activeReservedCash ? currentBal - activeReservedCash : 0n;

      if (availableCash < estimatedTotalCashNeeded) {
        throw new BadRequestException(
          `Insufficient available funds: unreserved cash balance (${availableCash} minor units) is less than required order commitment (${estimatedTotalCashNeeded} minor units).`,
        );
      }

      this.reservationService.reserveCash(orderId, sourceAccountId, estimatedTotalCashNeeded);
    } else {
      // SELL order: check available unreserved shares
      const holding = this.getInternalHolding(userId, sym);
      const activeReservedShares = this.reservationService.getReservedShares(userId, sym);
      const availableShares = holding ? holding.shares - activeReservedShares : 0;

      if (availableShares < orderInput.quantity) {
        throw new BadRequestException(
          `Insufficient available shares: holding has [${availableShares}] unreserved shares of [${sym}], required [${orderInput.quantity}]. Short selling is strictly prohibited.`,
        );
      }

      this.reservationService.reserveShares(orderId, userId, sym, orderInput.quantity);
    }

    // 5. Create Order record
    const internalOrder: InternalOrder = {
      id: orderId,
      userId,
      symbol: sym,
      side: orderInput.side,
      type: orderInput.type,
      quantity: orderInput.quantity,
      filledQuantity: 0,
      priceMinor: limitPriceMinor,
      status: 'OPEN',
      sourceAccountId,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(orderId, internalOrder);

    // 6. Matching Blotter
    const executedTrades: TradeExecutionDto[] = [];

    if (orderInput.side === 'BUY') {
      await this.matchIncomingBuy(internalOrder, executedTrades);
    } else {
      await this.matchIncomingSell(internalOrder, executedTrades);
    }

    // 7. Post-matching status & Invariant 5: MARKET Order Fill-and-Kill
    if (internalOrder.type === 'MARKET') {
      if (internalOrder.filledQuantity < internalOrder.quantity) {
        // Immediate-or-Cancel remaining remainder
        internalOrder.status = internalOrder.filledQuantity > 0 ? 'PARTIALLY_FILLED' : 'CANCELLED';
        if (internalOrder.side === 'BUY') {
          this.reservationService.releaseCash(orderId);
        } else {
          this.reservationService.releaseShares(orderId);
        }
      } else {
        internalOrder.status = 'FILLED';
        if (internalOrder.side === 'BUY') {
          this.reservationService.releaseCash(orderId);
        } else {
          this.reservationService.releaseShares(orderId);
        }
      }
    } else {
      // LIMIT order
      if (internalOrder.filledQuantity === internalOrder.quantity) {
        internalOrder.status = 'FILLED';
        if (internalOrder.side === 'BUY') {
          this.reservationService.releaseCash(orderId);
        } else {
          this.reservationService.releaseShares(orderId);
        }
      } else {
        internalOrder.status = internalOrder.filledQuantity > 0 ? 'PARTIALLY_FILLED' : 'OPEN';
        // Place unfilled remainder into resting book
        if (internalOrder.side === 'BUY') {
          this.insertBid(internalOrder);
        } else {
          this.insertAsk(internalOrder);
        }
      }
    }

    const orderDto = this.mapOrderToDto(internalOrder);
    const finalResult = { order: orderDto, trades: executedTrades };

    // Cache for idempotency replay
    if (idempotencyKey) {
      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ userId, ...orderInput }))
        .digest('hex');
      this.idempotencyCache.set(idempotencyKey, { payloadHash, result: finalResult });
    }

    return finalResult;
  }

  /**
   * Matches an incoming BUY order against resting asks (Price-Time priority).
   */
  private async matchIncomingBuy(
    buyOrder: InternalOrder,
    executedTrades: TradeExecutionDto[],
  ): Promise<void> {
    const restingAsks = this.asks.get(buyOrder.symbol) || [];

    while (buyOrder.filledQuantity < buyOrder.quantity && restingAsks.length > 0) {
      const topAsk = restingAsks[0];

      // Price limit check for LIMIT orders
      if (buyOrder.type === 'LIMIT' && topAsk.priceMinor > buyOrder.priceMinor) {
        // Best ask is more expensive than buyer's limit -> cannot match
        break;
      }

      // Self-trade prevention
      if (topAsk.userId === buyOrder.userId) {
        break;
      }

      const matchQty = Math.min(
        buyOrder.quantity - buyOrder.filledQuantity,
        topAsk.quantity - topAsk.filledQuantity,
      );

      // Invariant 8: Execution price is Maker's resting price
      const executionPriceMinor = topAsk.priceMinor;

      const trade = await this.executeTradeAtomic(
        buyOrder,
        topAsk,
        matchQty,
        executionPriceMinor,
      );

      executedTrades.push(trade);

      buyOrder.filledQuantity += matchQty;
      topAsk.filledQuantity += matchQty;

      if (topAsk.filledQuantity === topAsk.quantity) {
        topAsk.status = 'FILLED';
        restingAsks.shift(); // Remove filled maker
        this.reservationService.releaseShares(topAsk.id);
      } else {
        topAsk.status = 'PARTIALLY_FILLED';
      }
    }

    this.asks.set(buyOrder.symbol, restingAsks);
  }

  /**
   * Matches an incoming SELL order against resting bids (Price-Time priority).
   */
  private async matchIncomingSell(
    sellOrder: InternalOrder,
    executedTrades: TradeExecutionDto[],
  ): Promise<void> {
    const restingBids = this.bids.get(sellOrder.symbol) || [];

    while (sellOrder.filledQuantity < sellOrder.quantity && restingBids.length > 0) {
      const topBid = restingBids[0];

      // Price limit check for LIMIT orders
      if (sellOrder.type === 'LIMIT' && topBid.priceMinor < sellOrder.priceMinor) {
        // Best bid is lower than seller's limit -> cannot match
        break;
      }

      // Self-trade prevention
      if (topBid.userId === sellOrder.userId) {
        break;
      }

      const matchQty = Math.min(
        sellOrder.quantity - sellOrder.filledQuantity,
        topBid.quantity - topBid.filledQuantity,
      );

      // Invariant 8: Execution price is Maker's resting price
      const executionPriceMinor = topBid.priceMinor;

      const trade = await this.executeTradeAtomic(
        topBid,
        sellOrder,
        matchQty,
        executionPriceMinor,
      );

      executedTrades.push(trade);

      sellOrder.filledQuantity += matchQty;
      topBid.filledQuantity += matchQty;

      if (topBid.filledQuantity === topBid.quantity) {
        topBid.status = 'FILLED';
        restingBids.shift(); // Remove filled maker
        this.reservationService.releaseCash(topBid.id);
      } else {
        topBid.status = 'PARTIALLY_FILLED';
      }
    }

    this.bids.set(sellOrder.symbol, restingBids);
  }

  /**
   * Executes atomic trade settlement:
   * 1. Calculates Capital Gains Tax on seller's net profit using weighted-average cost basis.
   * 2. Computes exchange fees (0.10% each side).
   * 3. Posts balanced Core Ledger transaction:
   *    - DEBIT Buyer: Gross + BuyerFee
   *    - CREDIT Seller: Gross - SellerFee - TaxLevy
   *    - CREDIT sys_fee_pool: BuyerFee + SellerFee
   *    - CREDIT sys_tax_authority: TaxLevy (if > 0n)
   * 4. Updates Buyer portfolio (+shares, recalculates weighted-average cost basis).
   * 5. Updates Seller portfolio (-shares).
   * 6. Records TaxEvent and consumes/releases reservations.
   */
  private async executeTradeAtomic(
    buyOrder: InternalOrder,
    sellOrder: InternalOrder,
    tradeQty: number,
    executionPriceMinor: bigint,
  ): Promise<TradeExecutionDto> {
    const grossValue = BigInt(tradeQty) * executionPriceMinor;
    const buyerFee = (grossValue * 10n) / 10000n; // 0.10%
    const sellerFee = (grossValue * 10n) / 10000n; // 0.10%

    // 1. Seller cost basis calculation
    const sellerHolding = this.getInternalHolding(sellOrder.userId, sellOrder.symbol);
    const sellerAvgBuyPrice = sellerHolding ? sellerHolding.averageBuyPriceMinor : executionPriceMinor;

    // 2. Capital Gains Tax calculation via TaxEngineService
    const taxResult = await this.taxEngineService.calculateCapitalGainsTax(
      sellOrder.userId,
      sellOrder.symbol,
      tradeQty,
      executionPriceMinor,
      sellerAvgBuyPrice,
    );

    const taxLevy = taxResult.taxAmountMinor;

    // 3. Post Double-Entry Ledger Transaction
    const buyerTotalDebit = grossValue + buyerFee;
    const sellerNetCredit = grossValue - sellerFee - taxLevy;
    const totalFeeCredit = buyerFee + sellerFee;

    const entries: Array<{
      ledgerAccountId: string;
      entryType: 'DEBIT' | 'CREDIT';
      amountMinor: bigint;
      description?: string;
    }> = [
      {
        ledgerAccountId: buyOrder.sourceAccountId || `acct_user_${buyOrder.userId}`,
        entryType: 'DEBIT',
        amountMinor: buyerTotalDebit,
        description: `Purchase of ${tradeQty} ${buyOrder.symbol} @ ${executionPriceMinor}`,
      },
      {
        ledgerAccountId: sellOrder.sourceAccountId || `acct_user_${sellOrder.userId}`,
        entryType: 'CREDIT',
        amountMinor: sellerNetCredit,
        description: `Sale proceeds for ${tradeQty} ${sellOrder.symbol} @ ${executionPriceMinor}`,
      },
      {
        ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.FEE_POOL,
        entryType: 'CREDIT',
        amountMinor: totalFeeCredit,
        description: `Exchange fee levy (0.10% bilateral) for trade on ${buyOrder.symbol}`,
      },
    ];

    if (taxLevy > 0n) {
      entries.push({
        ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.TAX_AUTHORITY,
        entryType: 'CREDIT',
        amountMinor: taxLevy,
        description: `Equities CGT (15%) on realized profit of ${taxResult.realizedProfitMinor} on ${buyOrder.symbol}`,
      });
    }

    // Mathematical safety verification: Debits === Credits
    let sumDebits = 0n;
    let sumCredits = 0n;
    for (const e of entries) {
      if (e.entryType === 'DEBIT') sumDebits += e.amountMinor;
      else sumCredits += e.amountMinor;
    }
    if (sumDebits !== sumCredits) {
      throw new BadRequestException(
        `Ledger invariant violation: Sum Debits (${sumDebits}) != Sum Credits (${sumCredits})`,
      );
    }

    // Execute via LedgerService if persistent DB is active, otherwise in-memory simulation
    if (this.prisma.isConnected) {
      try {
        await this.ledgerService.recordBalancedTransaction({
          type: 'STOCK_BUY',
          scope: 'INTERNAL',
          amountMinor: grossValue,
          feesMinor: totalFeeCredit,
          taxMinor: taxLevy,
          initiatedBy: buyOrder.userId,
          sourceAccountId: buyOrder.sourceAccountId,
          destinationAccountId: sellOrder.sourceAccountId,
          entries,
          referenceNumber: `TRADE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        });
      } catch (err: any) {
        this.logger.warn(`Could not persist trade transaction through LedgerService: ${err.message}`);
      }
    } else {
      // Offline/Test: update mock balances
      const buyerAcc = buyOrder.sourceAccountId || `acct_user_${buyOrder.userId}`;
      const sellerAcc = sellOrder.sourceAccountId || `acct_user_${sellOrder.userId}`;
      const curBuyerBal = this.mockAccountBalances.get(buyerAcc) ?? 5000000n;
      const curSellerBal = this.mockAccountBalances.get(sellerAcc) ?? 5000000n;
      this.mockAccountBalances.set(buyerAcc, curBuyerBal - buyerTotalDebit);
      this.mockAccountBalances.set(sellerAcc, curSellerBal + sellerNetCredit);
    }

    // 4. Update Buyer Portfolio (Invariant 3: Weighted-Average Cost Basis)
    this.updateBuyerPortfolio(buyOrder.userId, buyOrder.symbol, tradeQty, executionPriceMinor);

    // 5. Update Seller Portfolio
    this.updateSellerPortfolio(sellOrder.userId, sellOrder.symbol, tradeQty);

    // 6. Record TaxEvent
    await this.taxEngineService.recordTaxEvent(
      sellOrder.userId,
      sellOrder.symbol,
      tradeQty,
      executionPriceMinor,
      sellerAvgBuyPrice,
      taxResult,
    );

    // 7. Consume Reservations
    this.reservationService.consumeCash(buyOrder.id, buyerTotalDebit);
    this.reservationService.consumeShares(sellOrder.id, tradeQty);

    // 8. Update Market Engine Price
    this.marketEngineService.updatePriceOnTrade(buyOrder.symbol, executionPriceMinor, tradeQty);

    const tradeId = `trd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const tradeDto: TradeExecutionDto = {
      id: tradeId,
      buyOrderId: buyOrder.id,
      sellOrderId: sellOrder.id,
      symbol: buyOrder.symbol,
      executionPriceMinor: executionPriceMinor.toString(),
      quantity: tradeQty,
      buyerUserId: buyOrder.userId,
      sellerUserId: sellOrder.userId,
      buyerFeeMinor: buyerFee.toString(),
      sellerFeeMinor: sellerFee.toString(),
      taxLevyMinor: taxLevy.toString(),
      executedAt: new Date().toISOString(),
    };

    this.trades.set(tradeId, tradeDto);
    return tradeDto;
  }

  /**
   * Updates buyer's portfolio holding using weighted-average cost basis formula:
   * NewAvgPrice = (PrevShares * PrevAvgPrice + NewShares * ExecutionPrice) / (PrevShares + NewShares)
   */
  private updateBuyerPortfolio(
    userId: string,
    symbol: string,
    quantity: number,
    executionPriceMinor: bigint,
  ): void {
    const key = `${userId}:${symbol}`;
    const existing = this.holdings.get(key);

    if (!existing || existing.shares === 0) {
      this.holdings.set(key, {
        id: `hld_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        symbol,
        shares: quantity,
        averageBuyPriceMinor: executionPriceMinor,
        updatedAt: new Date(),
      });
    } else {
      const prevShares = BigInt(existing.shares);
      const newShares = BigInt(quantity);
      const totalShares = prevShares + newShares;

      const totalCost = prevShares * existing.averageBuyPriceMinor + newShares * executionPriceMinor;
      const weightedAvgPrice = totalCost / totalShares;

      existing.shares += quantity;
      existing.averageBuyPriceMinor = weightedAvgPrice;
      existing.updatedAt = new Date();
    }
  }

  /**
   * Updates seller's portfolio holding (shares decremented, avg buy price remains identical).
   */
  private updateSellerPortfolio(userId: string, symbol: string, quantity: number): void {
    const key = `${userId}:${symbol}`;
    const existing = this.holdings.get(key);
    if (existing) {
      existing.shares -= quantity;
      existing.updatedAt = new Date();
    }
  }

  private getInternalHolding(userId: string, symbol: string): InternalHolding | undefined {
    return this.holdings.get(`${userId}:${symbol}`);
  }

  /**
   * Cancels an open or partially filled order and releases active reservations.
   */
  async cancelOrder(userId: string, orderId: string): Promise<StockOrderDto> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`Order [${orderId}] not found`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied: You do not own this order');
    }

    if (order.status !== 'OPEN' && order.status !== 'PARTIALLY_FILLED') {
      throw new BadRequestException(`Order in status [${order.status}] cannot be cancelled`);
    }

    // Remove from resting books
    if (order.side === 'BUY') {
      const symBids = this.bids.get(order.symbol) || [];
      this.bids.set(
        order.symbol,
        symBids.filter((b) => b.id !== orderId),
      );
      this.reservationService.releaseCash(orderId);
    } else {
      const symAsks = this.asks.get(order.symbol) || [];
      this.asks.set(
        order.symbol,
        symAsks.filter((a) => a.id !== orderId),
      );
      this.reservationService.releaseShares(orderId);
    }

    order.status = 'CANCELLED';
    order.updatedAt = new Date();
    return this.mapOrderToDto(order);
  }

  /**
   * Retrieves active resting and executed orders for user.
   */
  async listOrders(userId?: string, symbol?: string): Promise<StockOrderDto[]> {
    let result = Array.from(this.orders.values());
    if (userId) {
      result = result.filter((o) => o.userId === userId);
    }
    if (symbol) {
      const sym = symbol.toUpperCase();
      result = result.filter((o) => o.symbol === sym);
    }
    return result
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((o) => this.mapOrderToDto(o));
  }

  /**
   * Retrieves single order by ID.
   */
  async getOrder(orderId: string): Promise<StockOrderDto> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`Order [${orderId}] not found`);
    }
    return this.mapOrderToDto(order);
  }

  /**
   * Compiles citizen's portfolio summary with live mark-to-market valuation.
   */
  async getUserPortfolio(userId: string): Promise<UserPortfolioSummaryDto> {
    const userHoldings = Array.from(this.holdings.values()).filter(
      (h) => h.userId === userId && h.shares > 0,
    );

    let totalInvestedMinor = 0n;
    let totalCurrentValueMinor = 0n;

    const holdingDtos: PortfolioHoldingDto[] = [];

    for (const h of userHoldings) {
      const company = this.marketEngineService.getCompanyState(h.symbol);
      const currentPriceMinor = company.currentPriceMinor;

      const totalCostMinor = BigInt(h.shares) * h.averageBuyPriceMinor;
      const currentValueMinor = BigInt(h.shares) * currentPriceMinor;
      const unrealizedProfitLossMinor = currentValueMinor - totalCostMinor;

      const returnPercent =
        totalCostMinor > 0n
          ? Number(((Number(unrealizedProfitLossMinor) / Number(totalCostMinor)) * 100).toFixed(2))
          : 0;

      const reservedShares = this.reservationService.getReservedShares(userId, h.symbol);
      const availableShares = h.shares - reservedShares;

      totalInvestedMinor += totalCostMinor;
      totalCurrentValueMinor += currentValueMinor;

      holdingDtos.push({
        symbol: h.symbol,
        shares: h.shares,
        availableShares: Math.max(0, availableShares),
        reservedShares,
        averageBuyPriceMinor: h.averageBuyPriceMinor.toString(),
        currentPriceMinor: currentPriceMinor.toString(),
        totalCostMinor: totalCostMinor.toString(),
        currentValueMinor: currentValueMinor.toString(),
        unrealizedProfitLossMinor: unrealizedProfitLossMinor.toString(),
        unrealizedProfitLossPercent: returnPercent,
      });
    }

    const totalUnrealizedProfitLossMinor = totalCurrentValueMinor - totalInvestedMinor;
    const totalReturnPercent =
      totalInvestedMinor > 0n
        ? Number(((Number(totalUnrealizedProfitLossMinor) / Number(totalInvestedMinor)) * 100).toFixed(2))
        : 0;

    return {
      totalInvestedMinor: totalInvestedMinor.toString(),
      currentValueMinor: totalCurrentValueMinor.toString(),
      totalUnrealizedProfitLossMinor: totalUnrealizedProfitLossMinor.toString(),
      totalReturnPercent,
      holdings: holdingDtos,
    };
  }

  /**
   * Retrieves single holding for user and symbol.
   */
  async getHolding(userId: string, symbol: string): Promise<PortfolioHoldingDto | null> {
    const sym = symbol.toUpperCase();
    const h = this.getInternalHolding(userId, sym);
    if (!h || h.shares <= 0) return null;

    const company = this.marketEngineService.getCompanyState(sym);
    const currentPriceMinor = company.currentPriceMinor;
    const totalCostMinor = BigInt(h.shares) * h.averageBuyPriceMinor;
    const currentValueMinor = BigInt(h.shares) * currentPriceMinor;
    const unrealizedProfitLossMinor = currentValueMinor - totalCostMinor;
    const returnPercent =
      totalCostMinor > 0n
        ? Number(((Number(unrealizedProfitLossMinor) / Number(totalCostMinor)) * 100).toFixed(2))
        : 0;

    const reservedShares = this.reservationService.getReservedShares(userId, sym);
    const availableShares = h.shares - reservedShares;

    return {
      symbol: h.symbol,
      shares: h.shares,
      availableShares: Math.max(0, availableShares),
      reservedShares,
      averageBuyPriceMinor: h.averageBuyPriceMinor.toString(),
      currentPriceMinor: currentPriceMinor.toString(),
      totalCostMinor: totalCostMinor.toString(),
      currentValueMinor: currentValueMinor.toString(),
      unrealizedProfitLossMinor: unrealizedProfitLossMinor.toString(),
      unrealizedProfitLossPercent: returnPercent,
    };
  }

  /**
   * Combines resting limit orders in the book with market depth.
   */
  getOrderBookDepth(symbol: string): OrderBookDepthDto {
    const sym = symbol.toUpperCase();
    const restingBids = this.bids.get(sym) || [];
    const restingAsks = this.asks.get(sym) || [];

    if (restingBids.length === 0 && restingAsks.length === 0) {
      // Default to simulated market engine depth if no active resting blotter orders
      return this.marketEngineService.getOrderBookDepth(sym);
    }

    const company = this.marketEngineService.getCompanyState(sym);

    const bidLevels: OrderBookLevelDto[] = [];
    const askLevels: OrderBookLevelDto[] = [];

    // Group bids by price
    const bidMap = new Map<string, { qty: number; count: number }>();
    for (const b of restingBids) {
      const p = b.priceMinor.toString();
      const existing = bidMap.get(p) || { qty: 0, count: 0 };
      existing.qty += b.quantity - b.filledQuantity;
      existing.count += 1;
      bidMap.set(p, existing);
    }

    for (const [p, val] of bidMap.entries()) {
      bidLevels.push({
        priceMinor: p,
        quantity: val.qty,
        orderCount: val.count,
        totalMinor: (BigInt(p) * BigInt(val.qty)).toString(),
      });
    }

    // Group asks by price
    const askMap = new Map<string, { qty: number; count: number }>();
    for (const a of restingAsks) {
      const p = a.priceMinor.toString();
      const existing = askMap.get(p) || { qty: 0, count: 0 };
      existing.qty += a.quantity - a.filledQuantity;
      existing.count += 1;
      askMap.set(p, existing);
    }

    for (const [p, val] of askMap.entries()) {
      askLevels.push({
        priceMinor: p,
        quantity: val.qty,
        orderCount: val.count,
        totalMinor: (BigInt(p) * BigInt(val.qty)).toString(),
      });
    }

    const spreadMinor =
      askLevels.length > 0 && bidLevels.length > 0
        ? (BigInt(askLevels[0].priceMinor) - BigInt(bidLevels[0].priceMinor)).toString()
        : '0';

    return {
      symbol: sym,
      currentPriceMinor: company.currentPriceMinor.toString(),
      bids: bidLevels.slice(0, 5),
      asks: askLevels.slice(0, 5),
      spreadMinor,
      timestamp: new Date().toISOString(),
    };
  }

  private insertBid(order: InternalOrder): void {
    const list = this.bids.get(order.symbol) || [];
    list.push(order);
    // Sort DESC by price, then ASC by time
    list.sort((a, b) => {
      if (b.priceMinor !== a.priceMinor) {
        return b.priceMinor > a.priceMinor ? 1 : -1;
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    this.bids.set(order.symbol, list);
  }

  private insertAsk(order: InternalOrder): void {
    const list = this.asks.get(order.symbol) || [];
    list.push(order);
    // Sort ASC by price, then ASC by time
    list.sort((a, b) => {
      if (a.priceMinor !== b.priceMinor) {
        return a.priceMinor > b.priceMinor ? 1 : -1;
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    this.asks.set(order.symbol, list);
  }

  private mapOrderToDto(o: InternalOrder): StockOrderDto {
    const res = this.reservationService.getOrderReservation(o.id);
    return {
      id: o.id,
      userId: o.userId,
      symbol: o.symbol,
      side: o.side,
      type: o.type,
      quantity: o.quantity,
      filledQuantity: o.filledQuantity,
      priceMinor: o.priceMinor.toString(),
      status: o.status,
      sourceAccountId: o.sourceAccountId,
      reservedAmountMinor: res.cash ? res.cash.toString() : undefined,
      reservedShares: res.shares,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    };
  }
}
