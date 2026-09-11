import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  PlaceStockOrderSchema,
  PlaceStockOrderInput,
  SimulateMarketTickSchema,
  SimulateMarketTickInput,
} from '@arthax/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('stocks')
@UseGuards(JwtAuthGuard)
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  /**
   * Retrieves all 10 canonical sovereign stock companies with institutional pricing.
   */
  @Get('companies')
  async listCompanies() {
    return this.stocksService.listCompanies();
  }

  /**
   * Retrieves specific company details by ticker symbol.
   */
  @Get('companies/:symbol')
  async getCompany(@Param('symbol') symbol: string) {
    return this.stocksService.getCompany(symbol);
  }

  /**
   * Retrieves live Order Book depth (top bids and asks ladder) for a stock.
   */
  @Get('order-book/:symbol')
  async getOrderBookDepth(@Param('symbol') symbol: string) {
    return this.stocksService.getOrderBookDepth(symbol);
  }

  /**
   * Places an equity order with mandatory pre-trade reservations and matching.
   * Supports Idempotency-Key header for duplicate protection.
   */
  @Post('orders')
  @UsePipes(new ZodValidationPipe(PlaceStockOrderSchema))
  async placeOrder(
    @CurrentUser('sub') userId: string,
    @Body() body: PlaceStockOrderInput,
    @Headers('idempotency-key') idempotencyKey?: string,
    @Headers('x-idempotency-key') xIdempotencyKey?: string,
  ) {
    const key = idempotencyKey || xIdempotencyKey;
    return this.stocksService.placeOrder(userId, body, key);
  }

  /**
   * Cancels an open or partially filled order and releases reservations.
   */
  @Post('orders/:id/cancel')
  async cancelOrder(
    @CurrentUser('sub') userId: string,
    @Param('id') orderId: string,
  ) {
    return this.stocksService.cancelOrder(userId, orderId);
  }

  /**
   * Retrieves user's blotter orders.
   */
  @Get('orders')
  async listOrders(
    @CurrentUser('sub') userId: string,
    @Query('symbol') symbol?: string,
  ) {
    return this.stocksService.listOrders(userId, symbol);
  }

  /**
   * Retrieves single order by ID.
   */
  @Get('orders/:id')
  async getOrder(@Param('id') orderId: string) {
    return this.stocksService.getOrder(orderId);
  }

  /**
   * Retrieves user's live portfolio summary with mark-to-market valuation.
   */
  @Get('portfolio')
  async getUserPortfolio(@CurrentUser('sub') userId: string) {
    return this.stocksService.getUserPortfolio(userId);
  }

  /**
   * Retrieves user's holding for a specific company.
   */
  @Get('portfolio/:symbol')
  async getHolding(
    @CurrentUser('sub') userId: string,
    @Param('symbol') symbol: string,
  ) {
    return this.stocksService.getHolding(userId, symbol);
  }

  /**
   * Retrieves citizen's capital gains tax report with carried loss offsets.
   */
  @Get('tax-report')
  async getTaxReport(@CurrentUser('sub') userId: string) {
    return this.stocksService.getTaxReport(userId);
  }

  /**
   * Simulates a market tick with 5-factor model and circuit clamping.
   */
  @Post('tick')
  @UsePipes(new ZodValidationPipe(SimulateMarketTickSchema))
  async simulateTick(@Body() body: SimulateMarketTickInput) {
    return this.stocksService.simulateTick(body.symbol, body);
  }
}
