import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MarketEngineService } from './market-engine.service';
import { OrderMatchingService } from './order-matching.service';
import { TaxEngineService } from './tax-engine.service';
import { ReservationService } from './reservation.service';
import { StocksService } from './stocks.service';
import { PrismaService } from '../database/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';

/**
 * ARTHAX Phase 7: Stock Market & Tax Rules Engine Invariant Suite
 */
async function runStocksTests() {
  console.log('=================================================================');
  console.log('  ARTHAX STOCK MARKET & TAX RULES ENGINE — PHASE 7 INVARIANT SUITE');
  console.log('=================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details ? '- ' + details : ''}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // MOCK PRISMA & LEDGER
  // ---------------------------------------------------------------------------
  const mockPrisma = {
    isConnected: false,
    user: {
      findUnique: async () => null,
    },
    bankAccount: {
      findUnique: async () => null,
    },
    stockTicker: {
      create: async () => {},
    },
    taxEvent: {
      create: async () => {},
    },
  } as unknown as PrismaService;

  const mockLedgerService = {
    recordBalancedTransaction: async (req: any) => {
      return {
        id: 'tx_mock',
        referenceNumber: req.referenceNumber,
        status: 'COMPLETED',
        amountMinor: req.amountMinor.toString(),
      };
    },
  } as unknown as LedgerService;

  // Initialize service graph
  const reservationService = new ReservationService();
  const taxEngineService = new TaxEngineService(mockPrisma);
  const marketEngineService = new MarketEngineService(mockPrisma);
  const orderMatchingService = new OrderMatchingService(
    mockPrisma,
    mockLedgerService,
    reservationService,
    taxEngineService,
    marketEngineService,
  );
  const stocksService = new StocksService(
    mockPrisma,
    marketEngineService,
    orderMatchingService,
    taxEngineService,
    reservationService,
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: 10 Canonical Companies Discovery & Quoting
  // ---------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: 10 Canonical Companies Discovery & Quoting ---');

  const companies = await stocksService.listCompanies();
  assert('Exactly 10 canonical sovereign stock companies listed', companies.length === 10);

  const expectedSymbols = [
    'NILA', 'ARKA', 'TRNG', 'VEDA', 'MERU',
    'KSHT', 'AROHA', 'ANVIK', 'JALA', 'PRAVA',
  ];
  const foundSymbols = companies.map((c) => c.symbol);
  const allSymbolsPresent = expectedSymbols.every((s) => foundSymbols.includes(s));
  assert('All 10 canonical ticker symbols present', allSymbolsPresent);

  // Check integer minor units pricing on canonical companies
  const nila = await stocksService.getCompany('NILA');
  assert('NILA price in integer minor units (142.50 ARTH = 14250n)', nila.currentPriceMinor === '14250');

  const arka = await stocksService.getCompany('ARKA');
  assert('ARKA price in integer minor units (218.00 ARTH = 21800n)', arka.currentPriceMinor === '21800');

  const meru = await stocksService.getCompany('MERU');
  assert('MERU price in integer minor units (490.00 ARTH = 49000n)', meru.currentPriceMinor === '49000');

  // Verify daily circuit band is +/- 10%
  // Opening: 14250 -> 10% band is 1425 -> low = 12825, high = 15675
  assert('NILA circuit low is exactly -10% (12825n)', nila.circuitLimitLowMinor === '12825');
  assert('NILA circuit high is exactly +10% (15675n)', nila.circuitLimitHighMinor === '15675');

  // Test simulated market price drift with 5-factor model
  const tickResult = await stocksService.simulateTick('NILA', {
    symbol: 'NILA',
    orderBookPressure: 0.5,
    marketSentiment: 0.2,
  });
  assert('Simulated market tick returns updated priceMinor', BigInt(tickResult.newPriceMinor) > 0n);
  assert('Tick respects circuit limits without breaker trigger under moderate drift', !tickResult.circuitBreakerActive);

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Pre-Trade Cash & Share Reservations
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Pre-Trade Cash & Share Reservations ---');

  const citizenCashAcct = 'acct_citizen_cash_01';
  // Seed account with 30,000 minor units (300.00 ARTH)
  stocksService.seedAccountBalance(citizenCashAcct, 30000n);

  // BUY 1 share of NILA @ 14250n limit. Total required = 14250 + buyerFee(14n) = 14264n.
  const buyRes1 = await stocksService.placeOrder('usr_citizen_01', {
    symbol: 'NILA',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 1,
    priceMinor: '14250',
    sourceAccountId: citizenCashAcct,
    financialPassword: 'any',
  });
  assert('First BUY order successfully accepted and cash reserved', buyRes1.order.status === 'OPEN');
  assert('Cash reservation recorded on order', buyRes1.order.reservedAmountMinor === '14264');

  // Now remaining unreserved cash is 30000 - 14264 = 15736n.
  // Second BUY order for 2 shares requires 2 * 14250 + fee = 28500 + 28 = 28528n > 15736n.
  let secondBuyRejected = false;
  try {
    await stocksService.placeOrder('usr_citizen_01', {
      symbol: 'NILA',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 2,
      priceMinor: '14250',
      sourceAccountId: citizenCashAcct,
      financialPassword: 'any',
    });
  } catch (err: any) {
    secondBuyRejected = err instanceof BadRequestException && err.message.includes('Insufficient available funds');
  }
  assert('Second BUY order exceeding unreserved cash is strictly rejected', secondBuyRejected);

  // Test Share Reservation for SELL: Seed user with 50 shares of TRNG
  stocksService.seedHolding('usr_trader_01', 'TRNG', 50, 8000n);

  // Place SELL order for 40 shares of TRNG
  const sellRes1 = await stocksService.placeOrder('usr_trader_01', {
    symbol: 'TRNG',
    side: 'SELL',
    type: 'LIMIT',
    quantity: 40,
    priceMinor: '8500',
    sourceAccountId: 'acct_trader_01',
    financialPassword: 'any',
  });
  assert('First SELL order successfully accepted and shares reserved', sellRes1.order.status === 'OPEN');
  assert('Shares reservation recorded on order', sellRes1.order.reservedShares === 40);

  // Now remaining available unreserved shares = 50 - 40 = 10 shares.
  // Second SELL order for 20 shares exceeds 10 available shares -> short selling prohibited!
  let oversellRejected = false;
  try {
    await stocksService.placeOrder('usr_trader_01', {
      symbol: 'TRNG',
      side: 'SELL',
      type: 'LIMIT',
      quantity: 20,
      priceMinor: '8500',
      sourceAccountId: 'acct_trader_01',
      financialPassword: 'any',
    });
  } catch (err: any) {
    oversellRejected = err instanceof BadRequestException && err.message.includes('Short selling is strictly prohibited');
  }
  assert('Overselling shares beyond unreserved holding strictly rejected (Short Selling Prohibited)', oversellRejected);

  // Test Cancelling Order releases reservation immediately
  await stocksService.cancelOrder('usr_trader_01', sellRes1.order.id);
  const holdingAfterCancel = await stocksService.getHolding('usr_trader_01', 'TRNG');
  assert('Cancelled SELL order releases reserved shares back to available balance', holdingAfterCancel?.availableShares === 50);

  // Cancel first BUY order to restore cash
  await stocksService.cancelOrder('usr_citizen_01', buyRes1.order.id);
  const reservedCashAfterCancel = reservationService.getReservedCash(citizenCashAcct);
  assert('Cancelled BUY order releases reserved cash back to citizen balance', reservedCashAfterCancel === 0n);

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: Circuit Limits & Order Rejections
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Circuit Limits & Order Rejections ---');

  // NILA Opening is 14250n, Circuit: [12825n, 15675n]
  // Invariant 7: Orders outside statutory band must be rejected (BadRequestException), NEVER silently clamped
  stocksService.seedAccountBalance('acct_circuit_test', 1000000n);

  let aboveCircuitRejected = false;
  try {
    await stocksService.placeOrder('usr_circuit_01', {
      symbol: 'NILA',
      side: 'BUY',
      type: 'LIMIT',
      quantity: 1,
      priceMinor: '16000', // Above 15675
      sourceAccountId: 'acct_circuit_test',
      financialPassword: 'any',
    });
  } catch (err: any) {
    aboveCircuitRejected = err instanceof BadRequestException && err.message.includes('violates upper circuit limit');
  }
  assert('BUY order above upper circuit limit (16000n > 15675n) strictly rejected', aboveCircuitRejected);

  // Seed user with shares to test lower circuit sell
  stocksService.seedHolding('usr_circuit_02', 'NILA', 10, 14000n);
  let belowCircuitRejected = false;
  try {
    await stocksService.placeOrder('usr_circuit_02', {
      symbol: 'NILA',
      side: 'SELL',
      type: 'LIMIT',
      quantity: 1,
      priceMinor: '12000', // Below 12825
      sourceAccountId: 'acct_circuit_test',
      financialPassword: 'any',
    });
  } catch (err: any) {
    belowCircuitRejected = err instanceof BadRequestException && err.message.includes('violates lower circuit limit');
  }
  assert('SELL order below lower circuit limit (12000n < 12825n) strictly rejected', belowCircuitRejected);

  // Within circuit band (e.g. 14500n) is accepted
  const validCircuitOrder = await stocksService.placeOrder('usr_circuit_01', {
    symbol: 'NILA',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 1,
    priceMinor: '14500',
    sourceAccountId: 'acct_circuit_test',
    financialPassword: 'any',
  });
  assert('Order within circuit band (14500n) is accepted onto order book', validCircuitOrder.order.status === 'OPEN');
  await stocksService.cancelOrder('usr_circuit_01', validCircuitOrder.order.id);

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Order Matching & Atomic Settlement
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Order Matching & Atomic Settlement ---');

  // Setup: Seller seeds 10 shares of KSHT (opening price 9200n)
  const sellerId = 'usr_maker_seller';
  const buyerId = 'usr_taker_buyer';
  const sellerAcc = 'acct_seller_ksht';
  const buyerAcc = 'acct_buyer_ksht';

  stocksService.seedAccountBalance(sellerAcc, 100000n);
  stocksService.seedAccountBalance(buyerAcc, 200000n);
  stocksService.seedHolding(sellerId, 'KSHT', 10, 9000n); // Bought previously at 9000n

  // Maker places resting SELL order: 10 KSHT @ 9300n
  const makerSell = await stocksService.placeOrder(sellerId, {
    symbol: 'KSHT',
    side: 'SELL',
    type: 'LIMIT',
    quantity: 10,
    priceMinor: '9300',
    sourceAccountId: sellerAcc,
    financialPassword: 'any',
  });
  assert('Maker resting SELL order staged in book', makerSell.order.status === 'OPEN');

  // Taker places incoming BUY order: 10 KSHT @ 9400n limit
  const takerBuy = await stocksService.placeOrder(buyerId, {
    symbol: 'KSHT',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 10,
    priceMinor: '9400',
    sourceAccountId: buyerAcc,
    financialPassword: 'any',
  });

  assert('Taker BUY matches and executes trade immediately', takerBuy.trades.length === 1);
  const executedTrade = takerBuy.trades[0];

  // Invariant 8: Tripartite Price Separation (trade executes at maker's resting price: 9300n, not taker's 9400n)
  assert('Trade executes at Maker resting price (9300n)', executedTrade.executionPriceMinor === '9300');
  assert('Trade executed full quantity (10 shares)', executedTrade.quantity === 10);
  assert('Taker order status marked FILLED', takerBuy.order.status === 'FILLED');

  // Check Double-entry math:
  // Gross value = 10 * 9300 = 93000n
  // Buyer fee (0.10%) = 93n
  // Seller fee (0.10%) = 93n
  // Realized profit for seller = 10 * (9300 - 9000) = 3000n
  // CGT Tax on profit (15%) = (3000 * 15) / 100 = 450n
  // Debits = BuyerDebit(93000 + 93 = 93093n)
  // Credits = SellerCredit(93000 - 93 - 450 = 92457n) + FeePool(186n) + TaxAuthority(450n)
  // Sum Credits = 92457 + 186 + 450 = 93093n === Sum Debits!
  assert('Bilateral exchange fees charged at 0.10% (93n)', executedTrade.buyerFeeMinor === '93' && executedTrade.sellerFeeMinor === '93');
  assert('Equities CGT levied at 15% on realized profit (450n)', executedTrade.taxLevyMinor === '450');

  // Verify Buyer portfolio updated with new shares and cost basis
  const buyerHolding = await stocksService.getHolding(buyerId, 'KSHT');
  assert('Buyer portfolio holding incremented to 10 shares', buyerHolding?.shares === 10);
  assert('Buyer average cost basis established at execution price (9300n)', buyerHolding?.averageBuyPriceMinor === '9300');

  // Verify Seller portfolio decremented
  const sellerHolding = await stocksService.getHolding(sellerId, 'KSHT');
  assert('Seller portfolio holding decremented to 0 shares', sellerHolding?.shares === 0 || sellerHolding === null);

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: Weighted-Average Cost Basis & Tax Loss Offsets
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Weighted-Average Cost Basis & Tax Loss Offsets ---');

  const investorId = 'usr_investor_cgt';
  // Step A: Buy 100 shares @ 10000n, then Buy 100 shares @ 20000n
  // Weighted Average Cost Basis = (100 * 10000 + 100 * 20000) / 200 = 15000n
  stocksService.seedHolding(investorId, 'AROHA', 100, 10000n);
  // Simulate second purchase of 100 shares @ 20000n via seed / matching
  orderMatchingService['updateBuyerPortfolio'](investorId, 'AROHA', 100, 20000n);

  const arohaHolding = await stocksService.getHolding(investorId, 'AROHA');
  assert('Total shares combined to 200', arohaHolding?.shares === 200);
  assert('Weighted-average cost basis correctly computed ((100*10000 + 100*20000)/200 = 15000n)', arohaHolding?.averageBuyPriceMinor === '15000');

  // Step B: Realized Loss Trade (Sell 50 shares @ 12000n when avg cost basis is 15000n)
  // Loss = 50 * (12000 - 15000) = -150,000 minor units
  // Invariant 4: ZERO tax on loss; loss carried forward to offset pool
  const lossTaxResult = await taxEngineService.calculateCapitalGainsTax(
    investorId,
    'AROHA',
    50,
    12000n,
    15000n,
  );
  assert('Trade at loss results in ZERO tax levy', lossTaxResult.taxAmountMinor === 0n);
  assert('Loss of 150,000 minor units added to carried loss offset pool', lossTaxResult.offsetAddedMinor === 150000n);
  assert('Carried loss offset balance updated to 150,000n', lossTaxResult.newCarriedLossOffsetMinor === 150000n);

  // Step C: Subsequent Gain Trade (Sell 50 shares @ 18000n when avg cost basis is 15000n)
  // Realized profit = 50 * (18000 - 15000) = 150,000 minor units
  // Carried loss offset of 150,000 is available!
  // Net Taxable Gain = max(0, 150,000 - 150,000) = 0!
  // Tax = 0!
  const gainTaxResult = await taxEngineService.calculateCapitalGainsTax(
    investorId,
    'AROHA',
    50,
    18000n,
    15000n,
  );
  assert('Carried loss offset of 150,000n applied against realized gain', gainTaxResult.offsetAppliedMinor === 150000n);
  assert('Net taxable gain reduced to 0n by offset', gainTaxResult.netTaxableGainMinor === 0n);
  assert('Tax levied is 0n after offset consumption', gainTaxResult.taxAmountMinor === 0n);
  assert('Carried loss offset balance reduced to 0n', gainTaxResult.newCarriedLossOffsetMinor === 0n);

  // Step D: Verify Tax Report and Statutory Citation
  const taxReport = await stocksService.getTaxReport(investorId);
  assert('Tax report cites statutory rule TAX-EQUITY-CGT:v1.2.0', taxReport.ruleCode === 'TAX-EQUITY-CGT' && taxReport.ruleVersion === 'v1.2.0');

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: MARKET Order Immediate-or-Cancel (Fill-and-Kill)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: MARKET Order Immediate-or-Cancel (Fill-and-Kill) ---');

  // Setup order book with only 5 shares available on ask side for VEDA (price 31200n)
  const vedaSeller = 'usr_veda_seller';
  const vedaBuyer = 'usr_veda_buyer';
  stocksService.seedAccountBalance('acct_veda_buyer', 1000000n);
  stocksService.seedHolding(vedaSeller, 'VEDA', 5, 31000n);

  // Seller places 5 shares @ 31200n
  await stocksService.placeOrder(vedaSeller, {
    symbol: 'VEDA',
    side: 'SELL',
    type: 'LIMIT',
    quantity: 5,
    priceMinor: '31200',
    sourceAccountId: 'acct_veda_seller',
    financialPassword: 'any',
  });

  // Buyer submits MARKET BUY order for 15 shares (only 5 shares of liquidity exist!)
  const marketBuy = await stocksService.placeOrder(vedaBuyer, {
    symbol: 'VEDA',
    side: 'BUY',
    type: 'MARKET',
    quantity: 15,
    sourceAccountId: 'acct_veda_buyer',
    financialPassword: 'any',
  });

  // Invariant 5: Fills 5 shares; cancels remaining 10 shares immediately
  assert('MARKET order fills available 5 shares', marketBuy.trades.length === 1 && marketBuy.trades[0].quantity === 5);
  assert('MARKET order unfilled remainder cancelled immediately (PARTIALLY_FILLED)', marketBuy.order.status === 'PARTIALLY_FILLED' && marketBuy.order.filledQuantity === 5);
  const remainingReservedCash = reservationService.getReservedCash('acct_veda_buyer');
  assert('Surplus reservation for unfilled remainder released back to buyer', remainingReservedCash === 0n);

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: Concurrency & Race Condition Invariants
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Concurrency & Race Condition Invariants ---');

  // Scenario 1: Two simultaneous BUY orders racing for the same limited cash balance
  const raceBuyerAcc = 'acct_race_cash_01';
  // Account has 20,000 minor units. Each order costs 14,264 minor units (cannot fund both!)
  stocksService.seedAccountBalance(raceBuyerAcc, 20000n);

  const p1 = stocksService.placeOrder('usr_race_buyer', {
    symbol: 'NILA',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 1,
    priceMinor: '14250',
    sourceAccountId: raceBuyerAcc,
    financialPassword: 'any',
  });

  const p2 = stocksService.placeOrder('usr_race_buyer', {
    symbol: 'NILA',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 1,
    priceMinor: '14250',
    sourceAccountId: raceBuyerAcc,
    financialPassword: 'any',
  });

  const raceResults = await Promise.allSettled([p1, p2]);
  const fulfilledCount = raceResults.filter((r) => r.status === 'fulfilled').length;
  const rejectedCount = raceResults.filter((r) => r.status === 'rejected').length;

  assert('Racing concurrent BUY orders: exactly one succeeds and one is rejected', fulfilledCount === 1 && rejectedCount === 1);

  // Clean up order
  const successfulOrder = (raceResults.find((r) => r.status === 'fulfilled') as any)?.value?.order;
  if (successfulOrder) {
    await stocksService.cancelOrder('usr_race_buyer', successfulOrder.id);
  }

  // Scenario 2: Two simultaneous SELL orders racing for the same limited shares
  const raceSeller = 'usr_race_seller';
  stocksService.seedHolding(raceSeller, 'MERU', 5, 49000n); // Owns only 5 shares

  const s1 = stocksService.placeOrder(raceSeller, {
    symbol: 'MERU',
    side: 'SELL',
    type: 'LIMIT',
    quantity: 5,
    priceMinor: '49500',
    sourceAccountId: 'acct_race_seller',
    financialPassword: 'any',
  });

  const s2 = stocksService.placeOrder(raceSeller, {
    symbol: 'MERU',
    side: 'SELL',
    type: 'LIMIT',
    quantity: 5,
    priceMinor: '49500',
    sourceAccountId: 'acct_race_seller',
    financialPassword: 'any',
  });

  const sellRaceResults = await Promise.allSettled([s1, s2]);
  const sellFulfilled = sellRaceResults.filter((r) => r.status === 'fulfilled').length;
  const sellRejected = sellRaceResults.filter((r) => r.status === 'rejected').length;

  assert('Racing concurrent SELL orders: exactly one succeeds and one is rejected (no double-pledging)', sellFulfilled === 1 && sellRejected === 1);

  const successfulSell = (sellRaceResults.find((r) => r.status === 'fulfilled') as any)?.value?.order;
  if (successfulSell) {
    await stocksService.cancelOrder(raceSeller, successfulSell.id);
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 8: Idempotency Protection
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 8: Idempotency Protection ---');

  stocksService.seedAccountBalance('acct_idem_user', 500000n);
  const idemKey = 'IDEM-ORDER-999-STOCKS';

  const orderPayload = {
    symbol: 'JALA',
    side: 'BUY' as const,
    type: 'LIMIT' as const,
    quantity: 2,
    priceMinor: '12800',
    sourceAccountId: 'acct_idem_user',
    financialPassword: 'any',
  };

  const initialPlacement = await stocksService.placeOrder('usr_idem_01', orderPayload, idemKey);
  assert('Initial order placed with idempotency key', initialPlacement.order.status === 'OPEN');

  // Replay identical payload with same key
  const replayPlacement = await stocksService.placeOrder('usr_idem_01', orderPayload, idemKey);
  assert('Replay with identical idempotency key returns cached order', replayPlacement.order.id === initialPlacement.order.id);
  assert('Replay response flagged with isIdempotentReplay: true', replayPlacement.isIdempotentReplay === true);

  // Conflicting payload with same key
  let conflictDetected = false;
  try {
    await stocksService.placeOrder(
      'usr_idem_01',
      {
        ...orderPayload,
        quantity: 5, // Changed quantity!
      },
      idemKey,
    );
  } catch (err: any) {
    conflictDetected = err instanceof ConflictException && err.message.includes('Idempotency conflict');
  }
  assert('Conflicting payload with same idempotency key rejected with ConflictException', conflictDetected);

  // Clean up order
  await stocksService.cancelOrder('usr_idem_01', initialPlacement.order.id);

  console.log('\n=================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runStocksTests().catch((err) => {
  console.error('Fatal error in Stocks test suite:', err);
  process.exit(1);
});
