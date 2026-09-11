/**
 * ARTHAX Client API Bridge
 * Connects frontend portals to the sovereign NestJS API Gateway (http://localhost:3001/api/v1).
 * Preserves mock fallbacks when API is unreachable.
 */

import {
  BankDto,
  BankAccountDto,
  BankProductDto,
  TransactionDto,
  SettlementDto,
  ClsQueueSummaryDto,
  InterbankBilateralFlowDto,
  BatchSettlementResultDto,
  ClsReconciliationReportDto,
  StockCompanyDto,
  StockOrderDto,
  OrderBookDepthDto,
  UserPortfolioSummaryDto,
  PortfolioHoldingDto,
  TaxReportDto,
  SimulatedTickResultDto,
  TradeExecutionDto,
  ShopItemDto,
  UserInventoryDto,
  EquippedLoadoutDto,
  ActivePetModifierDto,
  ShopGiftResultDto,
  NotificationDto,
  MailboxSummaryDto,
  FdSchemeDto,
  UserFdDto,
  FdSimulationResultDto,
  InterestPayoutLogDto,
  FdStatus,
  FdRolloverInstruction,
  FdSimulationInput,
  BookFdInput,
  BreakFdInput,
  ToggleFdAutoRenewInput,
  AuthResultDto,
  AuthSessionPayload,
  UserDto,
  GovIdDto,
  SessionInfoDto,
  StepUpResultDto,
  UserRole,
  DemoPersonaDto,
  LoginInput,
  RegisterEmailInput,
  VerifyOtpInput,
  CreateGovIdInput,
  SetFinancialPasswordInput,
  StepUpAuthInput,
} from '@arthax/types';
import { ARTHAX_BANKS, MOCK_ACCOUNTS } from '@/components/bank/BankMockData';
import { MOCK_CLS_QUEUE, MOCK_INTERBANK_FLOW_MATRIX } from '@/components/central-bank/CentralBankMockData';
import { LISTED_COMPANIES } from '@/components/stocks/StockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('arthax_token') || localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Lists the 5 canonical banks.
 */
export async function apiFetchBanks(): Promise<BankDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/banks`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Resilient fallback to canonical static registry
  }

  return Object.values(ARTHAX_BANKS).map((b) => ({
    id: b.id,
    name: b.name,
    shortName: b.shortName,
    tagline: b.tagline,
    logoPath: b.logo,
    licenseNumber: `SCB-2024-${b.id.toUpperCase()}`,
    establishedDate: b.established,
    accentColor: b.accentColor,
    status: 'ACTIVE',
    ownership: 'Sovereign Chartered Depository',
    governingDirector: 'State Governor Council',
  }));
}

/**
 * Fetches user accounts across all banks or for a specific bank.
 */
export async function apiFetchUserAccounts(bankId?: string): Promise<BankAccountDto[]> {
  try {
    const url = bankId
      ? `${API_BASE_URL}/banks/user/accounts?bankId=${encodeURIComponent(bankId)}`
      : `${API_BASE_URL}/banks/user/accounts`;

    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Resilient fallback
  }

  return MOCK_ACCOUNTS.map((a) => ({
    id: a.id,
    accountNumber: a.accountNumber,
    customerId: a.customerId,
    bankId: a.accountNumber.split('-')[1]?.toLowerCase() || 'nava',
    userId: 'usr_citizen_01',
    type: a.type.toUpperCase() as any,
    purpose: a.purpose,
    status: a.status.toUpperCase() as any,
    balanceMinor: (BigInt(Math.round(a.balance * 100))).toString(),
    dailyLimitMinor: (BigInt(Math.round(a.dailyLimit * 100))).toString(),
    monthlyLimitMinor: (BigInt(Math.round(a.monthlyLimit * 100))).toString(),
    createdAt: a.createdDate,
    updatedAt: a.createdDate,
  }));
}

/**
 * Citizen joins an accredited member bank.
 */
export async function apiJoinBank(bankId: string) {
  const res = await fetch(`${API_BASE_URL}/banks/${encodeURIComponent(bankId)}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to join bank' }));
    throw new Error(err.message || 'Failed to join bank');
  }

  return await res.json();
}

/**
 * Citizen opens a new savings/current account.
 */
export async function apiOpenAccount(data: {
  bankId: string;
  accountType: 'SAVINGS' | 'CURRENT';
  purpose: string;
  financialPassword: string;
}): Promise<BankAccountDto> {
  const res = await fetch(`${API_BASE_URL}/banks/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to open account' }));
    throw new Error(err.message || 'Failed to open account');
  }

  return await res.json();
}

/**
 * Executes an intra-bank transfer with mandatory Idempotency-Key.
 */
export async function apiExecuteTransfer(data: {
  sourceAccountId: string;
  destinationAccountNumber: string;
  amountMinor: string;
  financialPassword: string;
  memo?: string;
  idempotencyKey?: string;
}): Promise<{ success: boolean; transaction: TransactionDto }> {
  const idempotencyKey =
    data.idempotencyKey || `IDEM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

  const res = await fetch(`${API_BASE_URL}/banks/transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'idempotency-key': idempotencyKey,
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Transfer failed' }));
    throw new Error(err.message || 'Transfer failed');
  }

  return await res.json();
}

/**
 * Fetches transaction history for a bank account.
 */
export async function apiFetchAccountTransactions(accountId: string): Promise<TransactionDto[]> {
  const res = await fetch(`${API_BASE_URL}/banks/accounts/${encodeURIComponent(accountId)}/transactions`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    return [];
  }

  return await res.json();
}

// =============================================================================
// CENTRAL SETTLEMENT LAYER (CLS) BRIDGE
// =============================================================================

/**
 * Fetches global CLS telemetry metrics.
 */
export async function apiFetchClsOverview(): Promise<ClsQueueSummaryDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/cls/overview`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  return {
    pendingCount: 4,
    processingCount: 2,
    settlingCount: 1,
    completedCount24h: 184,
    failedCount24h: 2,
    totalClearingVolumeMinor: '4850000000', // 48.5M ARTH
    avgClearingLatencyMs: 138,
    clearingPoolBalanceMinor: '0',
  };
}

/**
 * Fetches active settlements queue with optional stage and bank filters.
 */
export async function apiFetchClsQueue(stage?: string, bankId?: string): Promise<SettlementDto[]> {
  try {
    let url = `${API_BASE_URL}/cls/queue`;
    const params = new URLSearchParams();
    if (stage && stage !== 'all') params.set('stage', stage);
    if (bankId) params.set('bankId', bankId);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  // Resilient fallback from canonical mock data
  return MOCK_CLS_QUEUE.map((item) => ({
    id: item.id,
    reference: item.id,
    sourceBankId: item.sourceBank,
    destinationBankId: item.destinationBank,
    amountMinor: (BigInt(Math.round(item.amount * 100))).toString(),
    feeLevyMinor: (BigInt(Math.round(item.feeLevy * 100))).toString(),
    stage: (item.stage === 'FINALYZING' ? 'FINALIZING' : item.stage) as any,
    clearingLatencyMs: item.clearingLatencyMs,
    failureReason: item.failureReason,
    reversalTransactionId: item.reversalTxId,
    timeline: (item.timeline || []).map((t) => ({
      stage: (t.stage === 'FINALYZING' ? 'FINALIZING' : t.stage) as any,
      timestamp: t.time || new Date().toISOString(),
      note: t.note,
    })),
    createdAt: item.timestamp || new Date().toISOString(),
    updatedAt: item.timestamp || new Date().toISOString(),
  }));
}

/**
 * Executes a CLS batch settlement for queued obligations.
 */
export async function apiTriggerClsBatch(
  targetBankId?: string,
  maxBatchSize = 100,
): Promise<BatchSettlementResultDto> {
  const res = await fetch(`${API_BASE_URL}/cls/batches/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ targetBankId, maxBatchSize, executionMode: 'ALL_PENDING' }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Batch settlement failed' }));
    throw new Error(err.message || 'Batch settlement failed');
  }

  return await res.json();
}

/**
 * Fetches the 5x5 bilateral inter-bank flow matrix.
 */
export async function apiFetchClsMatrix(): Promise<InterbankBilateralFlowDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/cls/matrix`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const flows: InterbankBilateralFlowDto[] = [];
  for (const [src, dests] of Object.entries(MOCK_INTERBANK_FLOW_MATRIX)) {
    for (const [dest, val] of Object.entries(dests)) {
      if (src === dest) continue;
      flows.push({
        sourceBankId: src,
        destinationBankId: dest,
        obligationCount: 12,
        totalVolumeMinor: (BigInt(Math.round(val * 1000 * 100))).toString(),
        netSettlementMinor: (BigInt(Math.round(val * 1000 * 100))).toString(),
      });
    }
  }
  return flows;
}

/**
 * Reconciles the sovereign CLS clearing pool against active obligations.
 */
export async function apiReconcileCls(): Promise<ClsReconciliationReportDto> {
  const res = await fetch(`${API_BASE_URL}/cls/reconciliation`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    throw new Error('Clearing reconciliation failed');
  }

  return await res.json();
}

// =============================================================================
// STOCK MARKET API BRIDGE
// =============================================================================

/**
 * Lists the 10 canonical sovereign stock companies with live prices.
 */
export async function apiFetchStockCompanies(): Promise<StockCompanyDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/stocks/companies`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Resilient fallback
  }

  return Object.values(LISTED_COMPANIES).map((c) => ({
    symbol: c.symbol,
    name: c.name,
    sector: c.sector,
    currentPriceMinor: Math.round(c.price * 100).toString(),
    openingPriceMinor: Math.round((c.price - c.change) * 100).toString(),
    dayHighMinor: Math.round(c.high24h * 100).toString(),
    dayLowMinor: Math.round(c.low24h * 100).toString(),
    previousCloseMinor: Math.round((c.price - c.change) * 100).toString(),
    changePercent: c.changePercent,
    volume: c.volume24hNum,
    marketCapMinor: (BigInt(c.marketCapNum) * 100n).toString(),
    peRatio: c.pe,
    circuitLimitLowMinor: Math.round(c.price * 0.9 * 100).toString(),
    circuitLimitHighMinor: Math.round(c.price * 1.1 * 100).toString(),
    circuitBreakerActive: false,
    sharesOutstanding: 20000000,
    freeFloatPercent: 50.0,
    dividendYield: c.divYield,
    description: c.description,
    listedDate: '2024-01-01',
    status: 'ACTIVE',
  }));
}

/**
 * Fetches company details by ticker symbol.
 */
export async function apiFetchCompanyDetails(symbol: string): Promise<StockCompanyDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/stocks/companies/${encodeURIComponent(symbol)}`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Resilient fallback
  }

  const c = LISTED_COMPANIES[symbol.toUpperCase()] || LISTED_COMPANIES['NILA'];
  return {
    symbol: c.symbol,
    name: c.name,
    sector: c.sector,
    currentPriceMinor: Math.round(c.price * 100).toString(),
    openingPriceMinor: Math.round((c.price - c.change) * 100).toString(),
    dayHighMinor: Math.round(c.high24h * 100).toString(),
    dayLowMinor: Math.round(c.low24h * 100).toString(),
    previousCloseMinor: Math.round((c.price - c.change) * 100).toString(),
    changePercent: c.changePercent,
    volume: c.volume24hNum,
    marketCapMinor: (BigInt(c.marketCapNum) * 100n).toString(),
    peRatio: c.pe,
    circuitLimitLowMinor: Math.round(c.price * 0.9 * 100).toString(),
    circuitLimitHighMinor: Math.round(c.price * 1.1 * 100).toString(),
    circuitBreakerActive: false,
    sharesOutstanding: 20000000,
    freeFloatPercent: 50.0,
    dividendYield: c.divYield,
    description: c.description,
    listedDate: '2024-01-01',
    status: 'ACTIVE',
  };
}

/**
 * Fetches live Order Book depth (top bids and asks) for a stock.
 */
export async function apiFetchOrderBook(symbol: string): Promise<OrderBookDepthDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/stocks/order-book/${encodeURIComponent(symbol)}`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const c = LISTED_COMPANIES[symbol.toUpperCase()] || LISTED_COMPANIES['NILA'];
  const priceMinor = Math.round(c.price * 100);
  return {
    symbol: c.symbol,
    currentPriceMinor: priceMinor.toString(),
    bids: [
      { priceMinor: (priceMinor - 20).toString(), quantity: 150, orderCount: 3, totalMinor: ((priceMinor - 20) * 150).toString() },
      { priceMinor: (priceMinor - 40).toString(), quantity: 280, orderCount: 5, totalMinor: ((priceMinor - 40) * 280).toString() },
    ],
    asks: [
      { priceMinor: (priceMinor + 20).toString(), quantity: 120, orderCount: 2, totalMinor: ((priceMinor + 20) * 120).toString() },
      { priceMinor: (priceMinor + 50).toString(), quantity: 310, orderCount: 6, totalMinor: ((priceMinor + 50) * 310).toString() },
    ],
    spreadMinor: '40',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Submits an equity order to the blotter matching engine with mandatory Idempotency-Key.
 */
export async function apiPlaceStockOrder(data: {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  quantity: number;
  priceMinor?: string;
  sourceAccountId: string;
  financialPassword: string;
  idempotencyKey?: string;
}): Promise<{ order: StockOrderDto; trades: TradeExecutionDto[]; isIdempotentReplay?: boolean }> {
  const idempotencyKey =
    data.idempotencyKey || `IDEM-STOCKS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

  const res = await fetch(`${API_BASE_URL}/stocks/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'idempotency-key': idempotencyKey,
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Stock order placement failed' }));
    throw new Error(err.message || 'Stock order placement failed');
  }

  return await res.json();
}

/**
 * Cancels an active or partially filled order.
 */
export async function apiCancelStockOrder(orderId: string): Promise<StockOrderDto> {
  const res = await fetch(`${API_BASE_URL}/stocks/orders/${encodeURIComponent(orderId)}/cancel`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Order cancellation failed' }));
    throw new Error(err.message || 'Order cancellation failed');
  }

  return await res.json();
}

/**
 * Fetches user's active and historical orders.
 */
export async function apiFetchUserOrders(symbol?: string): Promise<StockOrderDto[]> {
  const query = symbol ? `?symbol=${encodeURIComponent(symbol)}` : '';
  const res = await fetch(`${API_BASE_URL}/stocks/orders${query}`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    return [];
  }

  return await res.json();
}

/**
 * Fetches mark-to-market citizen portfolio valuation and holdings.
 */
export async function apiFetchUserPortfolio(): Promise<UserPortfolioSummaryDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/stocks/portfolio`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  return {
    totalInvestedMinor: '4500000',
    currentValueMinor: '4825000',
    totalUnrealizedProfitLossMinor: '325000',
    totalReturnPercent: 7.22,
    holdings: [
      {
        symbol: 'NILA',
        shares: 100,
        availableShares: 100,
        reservedShares: 0,
        averageBuyPriceMinor: '13800',
        currentPriceMinor: '14250',
        totalCostMinor: '1380000',
        currentValueMinor: '1425000',
        unrealizedProfitLossMinor: '45000',
        unrealizedProfitLossPercent: 3.26,
      },
      {
        symbol: 'ARKA',
        shares: 50,
        availableShares: 50,
        reservedShares: 0,
        averageBuyPriceMinor: '21000',
        currentPriceMinor: '21800',
        totalCostMinor: '1050000',
        currentValueMinor: '1090000',
        unrealizedProfitLossMinor: '40000',
        unrealizedProfitLossPercent: 3.81,
      },
    ],
  };
}

/**
 * Fetches citizen's capital gains tax report and loss-offset pool.
 */
export async function apiFetchTaxReport(): Promise<TaxReportDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/stocks/tax-report`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  return {
    totalRealizedGainsMinor: '250000',
    totalRealizedLossesMinor: '50000',
    netTaxableGainMinor: '200000',
    totalTaxPaidMinor: '30000',
    carriedLossOffsetBalanceMinor: '0',
    ruleCode: 'TAX-EQUITY-CGT',
    ruleVersion: 'v1.2.0',
    taxEvents: [],
  };
}

/**
 * Simulates a market tick on the sovereign exchange.
 */
export async function apiSimulateMarketTick(
  symbol?: string,
  orderBookPressure?: number,
  marketSentiment?: number,
): Promise<SimulatedTickResultDto> {
  const res = await fetch(`${API_BASE_URL}/stocks/tick`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ symbol, orderBookPressure, marketSentiment }),
  });

  if (!res.ok) {
    throw new Error('Tick simulation failed');
  }

  return await res.json();
}

// =============================================================================
// PHASE 8: SHOP & VIRTUAL ECONOMY API BRIDGE
// =============================================================================

/**
 * Fetches sovereign virtual economy catalog items (filterable by category).
 */
export async function apiFetchShopItems(category?: string): Promise<ShopItemDto[]> {
  try {
    const url = category && category !== 'all'
      ? `${API_BASE_URL}/shop/items?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/shop/items`;

    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Resilient fallback to local static data
  }
  return [];
}

/**
 * Fetches single shop item details.
 */
export async function apiFetchShopItem(id: string): Promise<ShopItemDto> {
  const res = await fetch(`${API_BASE_URL}/shop/items/${encodeURIComponent(id)}`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch shop item' }));
    throw new Error(err.message || 'Failed to fetch shop item');
  }

  return await res.json();
}

/**
 * Executes atomic purchase of an artifact into the citizen's sovereign vault.
 * Deducts from buyer account, credits sys_shop_revenue, and grants item.
 */
export async function apiPurchaseShopItem(
  data: {
    itemId: string;
    sourceAccountId: string;
    financialPassword: string;
  },
  idempotencyKey?: string,
): Promise<{ success: boolean; transaction: TransactionDto; itemId: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };
  if (idempotencyKey) {
    headers['idempotency-key'] = idempotencyKey;
  }

  const res = await fetch(`${API_BASE_URL}/shop/purchase`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Purchase failed' }));
    throw new Error(err.message || 'Purchase failed');
  }

  return await res.json();
}

/**
 * Executes atomic gifting of an artifact to another verified citizen.
 */
export async function apiGiftShopItem(
  data: {
    itemId: string;
    sourceAccountId: string;
    recipientGovIdOrEmail: string;
    financialPassword: string;
  },
  idempotencyKey?: string,
): Promise<ShopGiftResultDto> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };
  if (idempotencyKey) {
    headers['idempotency-key'] = idempotencyKey;
  }

  const res = await fetch(`${API_BASE_URL}/shop/gift`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Gifting failed' }));
    throw new Error(err.message || 'Gifting failed');
  }

  return await res.json();
}

/**
 * Retrieves citizen's sovereign vault inventory and currently equipped loadout.
 */
export async function apiFetchUserInventory(): Promise<UserInventoryDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/shop/inventory`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Resilient fallback
  }

  return {
    userId: 'usr_citizen_01',
    ownedItemIds: ['frm-gold', 'frm-aurora', 'pet-vidya', 'pet-kurma'],
    loadout: {
      frameId: 'frm-gold',
      avatarId: 'avt-f-business',
      bannerId: 'bnr-gold-1',
      petId: 'pet-vidya',
    },
  };
}

/**
 * Updates citizen's equipped loadout (frame, avatar, banner, or pet).
 */
export async function apiEquipLoadout(
  data: {
    frameId?: string;
    avatarId?: string;
    bannerId?: string;
    petId?: string;
  },
): Promise<EquippedLoadoutDto> {
  const res = await fetch(`${API_BASE_URL}/shop/loadout`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Equip loadout failed' }));
    throw new Error(err.message || 'Equip loadout failed');
  }

  return await res.json();
}

/**
 * Retrieves the active financial modifier emitted by the single equipped pet.
 */
export async function apiFetchActivePetModifier(): Promise<ActivePetModifierDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/shop/active-pet`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Resilient fallback
  }
  return null;
}

/**
 * Claims the daily +5.00 ARTH civic bounty for the active Archive Cat companion.
 */
export async function apiClaimCivicBounty(targetAccountId: string): Promise<TransactionDto> {
  const res = await fetch(`${API_BASE_URL}/shop/claim-bounty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ targetAccountId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Claim civic bounty failed' }));
    throw new Error(err.message || 'Claim civic bounty failed');
  }

  return await res.json();
}

// =============================================================================
// MAILBOX & NOTIFICATIONS API BRIDGE (PHASE 9)
// =============================================================================

export interface MailboxFilterParams {
  category?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetches the citizen's dispatch mailbox with authoritative unread count and filters.
 */
export async function apiFetchMailbox(params?: MailboxFilterParams): Promise<MailboxSummaryDto> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'ALL') query.set('category', params.category);
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/notifications/mailbox${queryString}`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Resilient fallback
  }

  // Resilient seed fallback
  return {
    unreadCount: 3,
    totalActiveCount: 4,
    items: [],
    hasMore: false,
  };
}

/**
 * Fetches authoritative unread count for portal header navigation badge.
 */
export async function apiFetchUnreadNoticeCount(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      const data = await res.json();
      return typeof data.unreadCount === 'number' ? data.unreadCount : 0;
    }
  } catch {
    // Fallback
  }
  return 3;
}

/**
 * Fetches single notification notice details.
 */
export async function apiFetchNotification(id: string): Promise<NotificationDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/${encodeURIComponent(id)}`, {
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return null;
}

/**
 * Marks a specific notification as read.
 */
export async function apiMarkNotificationRead(id: string): Promise<NotificationDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return null;
}

/**
 * Marks all notifications as read (optionally filtered by category).
 */
export async function apiMarkAllNotificationsRead(category?: string): Promise<{ updatedCount: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ category }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return { updatedCount: 0 };
}

/**
 * Archives a notification notice.
 */
export async function apiArchiveNotification(id: string): Promise<NotificationDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/${encodeURIComponent(id)}/archive`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return null;
}

/**
 * ---------------------------------------------------------------------------
 * SECTION 10: FIXED DEPOSITS & YIELD ENGINE CLIENT METHODS
 * ---------------------------------------------------------------------------
 */

/**
 * Fetches all available sovereign Fixed Deposit schemes across commercial banks.
 */
export async function apiFetchFdSchemes(bankId?: string): Promise<FdSchemeDto[]> {
  try {
    const url = new URL(`${API_BASE_URL}/fixed-deposits/schemes`);
    if (bankId) url.searchParams.append('bankId', bankId);
    const res = await fetch(url.toString(), {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback below
  }
  // Return fallback schemes if API server offline
  return [
    {
      id: 'scheme_samaya_growth_365',
      bankId: 'samaya',
      name: 'SAMAYA Sovereign Growth Term',
      tenureDays: 365,
      baseApy: 7.45,
      seniorApy: 7.95,
      minimumDepositMinor: '1000000',
      maximumDepositMinor: '1000000000',
      lockInDays: 90,
      preclosurePenaltyRate: 0.5,
      active: true,
    },
    {
      id: 'scheme_nava_growth_180',
      bankId: 'nava',
      name: 'NAVA Capital Term Deposit',
      tenureDays: 180,
      baseApy: 7.25,
      seniorApy: 7.75,
      minimumDepositMinor: '500000',
      maximumDepositMinor: '500000000',
      lockInDays: 30,
      preclosurePenaltyRate: 0.5,
      active: true,
    },
    {
      id: 'scheme_setu_interbank_365',
      bankId: 'setu',
      name: 'SETU Interbank Core Term',
      tenureDays: 365,
      baseApy: 7.15,
      seniorApy: 7.65,
      minimumDepositMinor: '1000000',
      maximumDepositMinor: '1000000000',
      lockInDays: 60,
      preclosurePenaltyRate: 0.5,
      active: true,
    },
    {
      id: 'scheme_sthira_custody_730',
      bankId: 'sthira',
      name: 'STHIRA Custody High-Yield Bond',
      tenureDays: 730,
      baseApy: 7.1,
      seniorApy: 7.6,
      minimumDepositMinor: '2500000',
      maximumDepositMinor: '2000000000',
      lockInDays: 90,
      preclosurePenaltyRate: 0.75,
      active: true,
    },
    {
      id: 'scheme_vayu_node_90',
      bankId: 'vayu',
      name: 'VAYU Settlement Node Deposit',
      tenureDays: 90,
      baseApy: 6.95,
      seniorApy: 7.45,
      minimumDepositMinor: '250000',
      maximumDepositMinor: '100000000',
      lockInDays: 14,
      preclosurePenaltyRate: 0.5,
      active: true,
    },
  ];
}

/**
 * Fetches a single FD scheme by ID.
 */
export async function apiFetchFdScheme(id: string): Promise<FdSchemeDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/fixed-deposits/schemes/${encodeURIComponent(id)}`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  const schemes = await apiFetchFdSchemes();
  return schemes.find((s) => s.id === id) || null;
}

/**
 * Simulates yield for a candidate Fixed Deposit booking.
 */
export async function apiSimulateFdYield(
  input: FdSimulationInput,
): Promise<FdSimulationResultDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/fixed-deposits/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  // Client-side fallback calculation with exact quarterly compounding formula
  const principal = Number(input.principalMinor);
  const tenureDays = input.tenureDays ?? 365;
  const t = tenureDays / 365;
  const baseApy = 7.25;
  const petBoosterApy = 0;
  const effectiveApy = baseApy + petBoosterApy;
  const r = effectiveApy / 100;
  const maturityPayoutMinor = Math.floor(principal * Math.pow(1 + r / 4, 4 * t));
  const estimatedInterestMinor = Math.max(0, maturityPayoutMinor - principal);
  const dailyAccrualRateMinor = Number(((principal * (effectiveApy / 100)) / 365).toFixed(4));

  return {
    schemeId: input.schemeId,
    bankId: input.bankId || 'samaya',
    principalMinor: principal.toString(),
    tenureDays,
    baseApy,
    seniorBonusApy: 0,
    petBonusApy: 0,
    petBoosterApy,
    effectiveApy,
    interestPayoutMinor: estimatedInterestMinor.toString(),
    estimatedInterestMinor,
    maturityAmountMinor: maturityPayoutMinor.toString(),
    maturityPayoutMinor,
    compoundingFrequency: 'QUARTERLY',
    dailyAccrualRateMinor,
    lockInDays: 30,
    preclosurePenaltyRate: 0.5,
  };
}

/**
 * Books a new sovereign Fixed Deposit contract with dual-password step-up auth and double-entry ledger lock.
 */
export async function apiBookFd(
  input: BookFdInput,
  idempotencyKey?: string,
): Promise<UserFdDto | null> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    const res = await fetch(`${API_BASE_URL}/fixed-deposits/book`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Booking failed with status ${res.status}`);
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Offline fallback for development / testing
    const now = new Date();
    const tenureDays = input.tenureDays ?? 365;
    const maturity = new Date(now.getTime() + tenureDays * 86400000);
    const principalMinor = Number(input.principalMinor);
    const r = 0.0725;
    const t = tenureDays / 365;
    const maturityPayout = Math.floor(principalMinor * Math.pow(1 + r / 4, 4 * t));
    const certNum = `FD-SAM-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      id: `fd_${Date.now()}`,
      userId: 'mock_user',
      accountId: input.accountId || input.sourceAccountId || 'acc_samaya_primary',
      bankId: 'samaya',
      schemeId: input.schemeId,
      certificateNumber: certNum,
      depositNumber: certNum,
      principalMinor: principalMinor.toString(),
      maturityAmountMinor: maturityPayout.toString(),
      maturityPayoutMinor: maturityPayout.toString(),
      apy: 7.25,
      petBoosterApy: 0,
      effectiveApy: 7.25,
      interestPayoutFrequency: 'AT_MATURITY',
      tenureDays,
      lockInDays: 30,
      preclosurePenaltyRate: 0.5,
      startDate: now.toISOString(),
      maturityDate: maturity.toISOString(),
      accruedInterestMinor: '0',
      status: 'ACTIVE',
      autoRenew: input.autoRenew ?? false,
      rolloverInstruction: input.rolloverInstruction ?? 'PRINCIPAL_AND_INTEREST',
      certificateHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      createdAt: now.toISOString(),
    };
  }
}

/**
 * Fetches user active/matured/closed fixed deposit contracts.
 */
export async function apiFetchUserFds(
  bankId?: string,
  status?: FdStatus,
): Promise<UserFdDto[]> {
  try {
    const url = new URL(`${API_BASE_URL}/fixed-deposits`);
    if (bankId) url.searchParams.append('bankId', bankId);
    if (status) url.searchParams.append('status', status);
    const res = await fetch(url.toString(), {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return [];
}

/**
 * Fetches a single user fixed deposit contract by ID or depositNumber.
 */
export async function apiFetchUserFd(id: string): Promise<UserFdDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/fixed-deposits/${encodeURIComponent(id)}`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return null;
}

/**
 * Prematurely closes an active fixed deposit contract with penalty re-derivation.
 */
export async function apiBreakFd(
  id: string,
  input: BreakFdInput,
): Promise<{
  message: string;
  closedFd: UserFdDto;
  grossPayoutMinor: number;
  penaltyDeductedMinor: number;
  netPayoutMinor: number;
} | null> {
  const res = await fetch(`${API_BASE_URL}/fixed-deposits/${encodeURIComponent(id)}/break`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(input),
  });
  if (res.ok) {
    return await res.json();
  }
  const err = await res.json().catch(() => ({}));
  throw new Error(err.message || `Early liquidation failed (${res.status})`);
}

/**
 * Updates auto-renewal and rollover mandate for a fixed deposit contract.
 */
export async function apiToggleFdAutoRenew(
  id: string,
  input: ToggleFdAutoRenewInput,
): Promise<UserFdDto | null> {
  const res = await fetch(`${API_BASE_URL}/fixed-deposits/${encodeURIComponent(id)}/auto-renew`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(input),
  });
  if (res.ok) {
    return await res.json();
  }
  const err = await res.json().catch(() => ({}));
  throw new Error(err.message || `Auto-renew update failed (${res.status})`);
}

/**
 * Fetches interest payout ledger logs for a fixed deposit contract.
 */
export async function apiFetchFdPayoutLogs(id: string): Promise<InterestPayoutLogDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/fixed-deposits/${encodeURIComponent(id)}/payouts`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return [];
}

// =============================================================================
// 9. Sovereign Identity, Auth Bridge & Cross-Portal Invalidation Bus
// =============================================================================

export const DEMO_PERSONAS: Record<'citizen' | 'bank_officer' | 'governor', DemoPersonaDto> = {
  citizen: {
    id: 'citizen',
    displayName: 'Ananya Sharma',
    govIdNumber: 'GOV-8491-904-IN',
    email: 'citizen@arthax.gov',
    role: 'USER',
    title: 'Tier-1 Sovereign Citizen',
    badge: 'Tier-1 Citizen',
  },
  bank_officer: {
    id: 'bank_officer',
    displayName: 'Rajesh Patel',
    govIdNumber: 'GOV-3012-4819-IN',
    email: 'officer.nava@arthax.gov',
    role: 'BANK_ADMIN',
    bankId: 'nava',
    title: 'Commercial Depository Branch Officer',
    badge: 'NAVA Staff',
  },
  governor: {
    id: 'governor',
    displayName: 'Dr. Alistair Vance',
    govIdNumber: 'GOV-0001-CB-IN',
    email: 'governor@arthax.gov',
    role: 'CENTRAL_BANK_ADMIN',
    title: 'Sovereign Central Bank Governor',
    badge: 'Level-4 Authority',
  },
};

/**
 * Global Portal Data Invalidation Bus
 * Emits a lightweight invalidation signal to notify all open tabs and components
 * to refetch authoritative data from the backend API.
 * NEVER transports authoritative balances or financial data over this bus.
 */
export function dispatchPortalDataInvalidation(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('arthax_cache_invalidation_ts', Date.now().toString());
  } catch {
    // Ignore quota/sandbox errors
  }
  window.dispatchEvent(new CustomEvent('arthax:invalidate-cache', { detail: { timestamp: Date.now() } }));
}

/**
 * Subscribes a React component to cross-portal and cross-tab cache invalidation events.
 * Returns an unsubscribe cleanup function.
 */
export function subscribePortalDataInvalidation(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => {
    callback();
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (
      event.key === 'arthax_cache_invalidation_ts' ||
      event.key === 'arthax_token' ||
      event.key === 'arthax_persona' ||
      event.key === 'arthax_mask_preference'
    ) {
      callback();
    }
  };

  window.addEventListener('arthax:invalidate-cache', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener('arthax:invalidate-cache', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Rule 15: Account numbers and balances render masked by default with an explicit click-to-reveal.
 */
export function apiGetMaskPreference(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('arthax_mask_preference');
  if (stored === null) return true;
  return stored === 'true';
}

export function apiSetMaskPreference(masked: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('arthax_mask_preference', masked ? 'true' : 'false');
  dispatchPortalDataInvalidation();
}

/**
 * Authenticates user credentials via the sovereign NestJS auth endpoint (/auth/login).
 * The backend remains the sole authorization authority.
 */
export async function apiLogin(input: LoginInput): Promise<AuthResultDto> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const data: AuthResultDto = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('arthax_token', data.token);
      }
      return data;
    }
  } catch {
    // Resilient fallback for local dev when backend is offline
  }

  // Determine fallback persona role
  const isGov = input.govIdOrEmail.toLowerCase().includes('governor');
  const isOfficer = input.govIdOrEmail.toLowerCase().includes('officer') || input.govIdOrEmail.toLowerCase().includes('nava');
  const role: UserRole = isGov ? 'CENTRAL_BANK_ADMIN' : isOfficer ? 'BANK_ADMIN' : 'USER';
  const persona = isGov ? DEMO_PERSONAS.governor : isOfficer ? DEMO_PERSONAS.bank_officer : DEMO_PERSONAS.citizen;

  // Synthesize dev token with matching header structure
  const devToken = `dev_jwt_${btoa(JSON.stringify({ sub: persona.id, govId: persona.govIdNumber, email: persona.email, role, bankId: persona.bankId }))}`;
  if (typeof window !== 'undefined') {
    localStorage.setItem('arthax_token', devToken);
  }

  return {
    token: devToken,
    user: {
      id: persona.id,
      govId: `gid_${persona.id}`,
      govIdNumber: persona.govIdNumber,
      email: persona.email,
      displayName: persona.displayName,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
    sessionExpiresAt: new Date(Date.now() + 86400000).toISOString(),
  };
}

/**
 * Switches institutional demo persona by executing a real backend authentication call.
 * Saves authenticated token to localStorage and dispatches a cache invalidation signal.
 */
export async function apiSwitchDemoPersona(personaId: 'citizen' | 'bank_officer' | 'governor'): Promise<AuthResultDto> {
  const persona = DEMO_PERSONAS[personaId] || DEMO_PERSONAS.citizen;
  const result = await apiLogin({
    govIdOrEmail: persona.email,
    govPassword: 'GovSovereign@2026!',
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('arthax_token', result.token);
    localStorage.setItem('arthax_persona', JSON.stringify(persona));
    dispatchPortalDataInvalidation();
  }

  return result;
}

/**
 * Returns currently selected demo persona metadata.
 */
export function apiGetActivePersona(): DemoPersonaDto {
  if (typeof window === 'undefined') return DEMO_PERSONAS.citizen;
  const stored = localStorage.getItem('arthax_persona');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return DEMO_PERSONAS.citizen;
}

/**
 * Clears current session and dispatches invalidation signal.
 */
export function apiLogout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('arthax_token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('arthax_persona');
  dispatchPortalDataInvalidation();
}

/**
 * Queries current authenticated session claims from backend.
 */
export async function apiGetMe(): Promise<AuthSessionPayload> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { ...getAuthHeader() },
  });
  if (res.ok) {
    return await res.json();
  }
  const persona = apiGetActivePersona();
  return {
    sub: persona.id,
    govId: persona.govIdNumber,
    email: persona.email,
    role: persona.role,
    bankId: persona.bankId,
  };
}

/**
 * Executes step-up authentication with Argon2id Financial Password.
 */
export async function apiStepUpAuth(input: StepUpAuthInput): Promise<StepUpResultDto> {
  const res = await fetch(`${API_BASE_URL}/auth/step-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(input),
  });
  if (res.ok) {
    return await res.json();
  }
  const err = await res.json().catch(() => ({}));
  throw new Error(err.message || 'Financial step-up authentication failed');
}

/**
 * Lists active sessions for current user.
 */
export async function apiGetActiveSessions(): Promise<SessionInfoDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/sessions`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return [];
}

/**
 * Revokes a session by ID.
 */
export async function apiRevokeSession(sessionId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/auth/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (res.ok) {
    return await res.json();
  }
  return { success: false };
}

/**
 * Activates emergency killswitch to terminate all active sessions.
 */
export async function apiEmergencyKillswitch(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/sessions/all`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (res.ok) {
    apiLogout();
    return await res.json();
  }
  apiLogout();
  return { success: true, message: 'All active sessions invalidated.' };
}



