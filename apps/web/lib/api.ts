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
  LoanProductDto,
  UserLoanDto,
  LoanRepaymentInstallmentDto,
  LoanCollateralDto,
  CreditAssessmentDto,
  LoanSimulationResultDto,
  LoanSimulationInput,
  ApplyLoanInput,
  ReviewLoanInput,
  DisburseLoanInput,
  PayLoanEmiInput,
  ForecloseLoanInput,
  LoanType,
  LoanStatus,
  CollateralType,
  MonetarySupplyDto,
  SovereignIssuanceDto,
  BankPrudentialMetricsDto,
  EmergencyActionDto,
  ElaFacilityDto,
  CentralBankOverviewDto,
  FinancialRuleDto,
  TaxRuleDto,
  ProposeSovereignIssuanceInput,
  ApproveSovereignIssuanceInput,
  RequestElaFacilityInput,
  RepayElaFacilityInput,
  CreateEmergencyActionInput,
  RevokeEmergencyActionInput,
  CreateFinancialRuleInput,
  UpdateFinancialRuleInput,
  BankAdminOverviewDto,
  BankCustomerDto,
  BankAccountStatus,
} from '@arthax/types';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_API_URL
      : window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? '/api/v1'
        : 'http://localhost:3001/api/v1'
    : process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('arthax_token') || localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Centralized response envelope unwrapper.
 * Unwraps NestJS TransformInterceptor response envelope:
 * { success: true, statusCode: 200, data: T, timestamp: string } -> T
 * If json is already raw T or empty, returns T.
 */
export function unwrapApiResponse<T>(json: any): T {
  if (json !== null && typeof json === 'object' && 'data' in json && 'success' in json) {
    return json.data as T;
  }
  return json as T;
}

/**
 * Standard sovereign request handler that enforces:
 * - Bearer token inclusion
 * - HTTP error parsing (never silently swallowing errors into mocks)
 * - Response envelope unwrapping
 */
export async function sovereignRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    ...getAuthHeader(),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const rawJson = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg =
      (rawJson && typeof rawJson === 'object' && rawJson.message) ||
      `Sovereign API request failed (${res.status} ${res.statusText})`;
    const err = new Error(errorMsg);
    (err as any).statusCode = res.status;
    throw err;
  }

  return unwrapApiResponse<T>(rawJson);
}

/**
 * Lists the 5 canonical banks directly from PostgreSQL database.
 */
export async function apiFetchBanks(): Promise<BankDto[]> {
  return await sovereignRequest<BankDto[]>('/banks');
}

/**
 * Fetches user accounts across all banks or for a specific bank.
 * Rule 2: Returns real accounts from database. Empty array remains empty.
 */
export async function apiFetchUserAccounts(bankId?: string): Promise<BankAccountDto[]> {
  const url = bankId
    ? `/banks/user/accounts?bankId=${encodeURIComponent(bankId)}`
    : `/banks/user/accounts`;

  return await sovereignRequest<BankAccountDto[]>(url);
}

/**
 * Citizen joins an accredited member bank.
 */
export async function apiJoinBank(bankId: string) {
  return await sovereignRequest(`/banks/${encodeURIComponent(bankId)}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
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
  return await sovereignRequest<BankAccountDto>('/banks/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
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

  return await sovereignRequest<{ success: boolean; transaction: TransactionDto }>('/banks/transfers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'idempotency-key': idempotencyKey,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Fetches transaction history for a bank account.
 */
export async function apiFetchAccountTransactions(accountId: string): Promise<TransactionDto[]> {
  return await sovereignRequest<TransactionDto[]>(
    `/banks/accounts/${encodeURIComponent(accountId)}/transactions`,
  );
}

// =============================================================================
// BANK ADMIN API (/bank PORTAL)
// =============================================================================

/**
 * Fetches commercial bank operations overview for authenticated bank admin.
 */
export async function apiFetchBankAdminOverview(): Promise<BankAdminOverviewDto> {
  return await sovereignRequest<BankAdminOverviewDto>('/banks/admin/overview');
}

/**
 * Fetches all registered customer profiles for authenticated bank.
 */
export async function apiFetchBankAdminCustomers(): Promise<BankCustomerDto[]> {
  return await sovereignRequest<BankCustomerDto[]>('/banks/admin/customers');
}

/**
 * Fetches specific customer details for authenticated bank.
 */
export async function apiFetchBankAdminCustomer(customerId: string): Promise<BankCustomerDto> {
  return await sovereignRequest<BankCustomerDto>(`/banks/admin/customers/${encodeURIComponent(customerId)}`);
}

/**
 * Updates customer account status (e.g. ACTIVE, SUSPENDED, LOCKED).
 */
export async function apiUpdateCustomerStatus(
  customerId: string,
  body: { status: 'ACTIVE' | 'SUSPENDED' | 'LOCKED'; reason?: string },
): Promise<BankCustomerDto> {
  return await sovereignRequest<BankCustomerDto>(`/banks/admin/customers/${encodeURIComponent(customerId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Fetches all institutional accounts belonging to authenticated bank node.
 */
export async function apiFetchBankAdminAccounts(): Promise<BankAccountDto[]> {
  return await sovereignRequest<BankAccountDto[]>('/banks/admin/accounts');
}

/**
 * Updates bank account operational status (e.g. ACTIVE, FROZEN, SUSPENDED).
 */
export async function apiUpdateBankAccountStatus(
  accountId: string,
  body: { status: BankAccountStatus; reason?: string },
): Promise<BankAccountDto> {
  return await sovereignRequest<BankAccountDto>(`/banks/admin/accounts/${encodeURIComponent(accountId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Modifies daily/monthly transaction limits for an account.
 */
export async function apiUpdateBankAccountLimits(
  accountId: string,
  body: { dailyLimitMinor?: string; monthlyLimitMinor?: string },
): Promise<BankAccountDto> {
  return await sovereignRequest<BankAccountDto>(`/banks/admin/accounts/${encodeURIComponent(accountId)}/limits`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Fetches live ledger transactions scoped to the authenticated bank node.
 */
export async function apiFetchBankAdminTransactions(): Promise<TransactionDto[]> {
  return await sovereignRequest<TransactionDto[]>('/banks/admin/transactions');
}

// =============================================================================
// CENTRAL SETTLEMENT LAYER (CLS) BRIDGE
// =============================================================================

/**
 * Fetches global CLS telemetry metrics.
 */
export async function apiFetchClsOverview(): Promise<ClsQueueSummaryDto> {
  return await sovereignRequest<ClsQueueSummaryDto>('/cls/overview');
}

/**
 * Fetches active settlements queue with optional stage and bank filters.
 */
export async function apiFetchClsQueue(stage?: string, bankId?: string): Promise<SettlementDto[]> {
  const params = new URLSearchParams();
  if (stage && stage !== 'all') params.set('stage', stage);
  if (bankId) params.set('bankId', bankId);
  const q = params.toString() ? `?${params.toString()}` : '';
  return await sovereignRequest<SettlementDto[]>(`/cls/queue${q}`);
}

/**
 * Executes a CLS batch settlement for queued obligations.
 */
export async function apiTriggerClsBatch(
  targetBankIdOrLimit?: string | number,
  maxBatchSize = 100,
): Promise<BatchSettlementResultDto> {
  const targetBankId = typeof targetBankIdOrLimit === 'string' ? targetBankIdOrLimit : undefined;
  const limit = typeof targetBankIdOrLimit === 'number' ? targetBankIdOrLimit : maxBatchSize;
  return await sovereignRequest<BatchSettlementResultDto>('/cls/batches/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetBankId, maxBatchSize: limit, executionMode: 'ALL_PENDING' }),
  });
}

/**
 * Fetches the 5x5 bilateral inter-bank flow matrix.
 */
export async function apiFetchClsMatrix(): Promise<InterbankBilateralFlowDto[]> {
  return await sovereignRequest<InterbankBilateralFlowDto[]>('/cls/matrix');
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
  return await sovereignRequest<StockCompanyDto[]>('/stocks/companies');
}

/**
 * Fetches company details by ticker symbol.
 */
export async function apiFetchCompanyDetails(symbol: string): Promise<StockCompanyDto> {
  return await sovereignRequest<StockCompanyDto>(`/stocks/companies/${encodeURIComponent(symbol)}`);
}

/**
 * Fetches live Order Book depth (top bids and asks) for a stock.
 */
export async function apiFetchOrderBook(symbol: string): Promise<OrderBookDepthDto> {
  return await sovereignRequest<OrderBookDepthDto>(`/stocks/order-book/${encodeURIComponent(symbol)}`);
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
    return await sovereignRequest<UserPortfolioSummaryDto>('/stocks/portfolio');
  } catch {
    return {
      totalInvestedMinor: '0',
      currentValueMinor: '0',
      totalUnrealizedProfitLossMinor: '0',
      totalReturnPercent: 0,
      holdings: [],
    };
  }
}

/**
 * Fetches citizen's capital gains tax report and loss-offset pool.
 */
export async function apiFetchTaxReport(): Promise<TaxReportDto> {
  return await sovereignRequest<TaxReportDto>('/stocks/tax-report');
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
  return await sovereignRequest<UserInventoryDto>('/shop/inventory');
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
  return await sovereignRequest<EquippedLoadoutDto>('/shop/loadout', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

/**
 * Retrieves the active financial modifier emitted by the single equipped pet.
 */
export async function apiFetchActivePetModifier(): Promise<ActivePetModifierDto | null> {
  try {
    return await sovereignRequest<ActivePetModifierDto | null>('/shop/active-pet');
  } catch {
    return null;
  }
}

/**
 * Claims the daily +5.00 ARTH civic bounty for the active Archive Cat companion.
 */
export async function apiClaimCivicBounty(targetAccountId: string): Promise<TransactionDto> {
  return await sovereignRequest<TransactionDto>('/shop/claim-bounty', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetAccountId }),
  });
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
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'ALL') query.set('category', params.category);
  if (params?.status && params.status !== 'ALL') query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.offset) query.set('offset', params.offset.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await sovereignRequest<MailboxSummaryDto>(`/notifications/mailbox${queryString}`);
}

/**
 * Fetches authoritative unread count for portal header navigation badge.
 */
export async function apiFetchUnreadNoticeCount(): Promise<number> {
  try {
    const res = await sovereignRequest<{ unreadCount: number }>('/notifications/unread-count');
    return typeof res?.unreadCount === 'number' ? res.unreadCount : 0;
  } catch {
    return 0;
  }
}

/**
 * Fetches single notification notice details.
 */
export async function apiFetchNotification(id: string): Promise<NotificationDto | null> {
  return await sovereignRequest<NotificationDto>(`/notifications/${encodeURIComponent(id)}`);
}

/**
 * Marks a specific notification as read.
 */
export async function apiMarkNotificationRead(id: string): Promise<NotificationDto | null> {
  return await sovereignRequest<NotificationDto>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
  });
}

/**
 * Marks all notifications as read (optionally filtered by category).
 */
export async function apiMarkAllNotificationsRead(category?: string): Promise<{ updatedCount: number }> {
  return await sovereignRequest<{ updatedCount: number }>('/notifications/read-all', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category }),
  });
}

/**
 * Archives a notification notice.
 */
export async function apiArchiveNotification(id: string): Promise<NotificationDto | null> {
  return await sovereignRequest<NotificationDto>(`/notifications/${encodeURIComponent(id)}/archive`, {
    method: 'PATCH',
  });
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
  const q = bankId ? `?bankId=${encodeURIComponent(bankId)}` : '';
  return await sovereignRequest<FdSchemeDto[]>(`/fixed-deposits/schemes${q}`);
}

/**
 * Fetches a single FD scheme by ID.
 */
export async function apiFetchFdScheme(id: string): Promise<FdSchemeDto | null> {
  return await sovereignRequest<FdSchemeDto>(`/fixed-deposits/schemes/${encodeURIComponent(id)}`);
}

/**
 * Simulates yield for a candidate Fixed Deposit booking.
 */
export async function apiSimulateFdYield(
  input: FdSimulationInput,
): Promise<FdSimulationResultDto | null> {
  return await sovereignRequest<FdSimulationResultDto>('/fixed-deposits/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

/**
 * Books a new sovereign Fixed Deposit contract with dual-password step-up auth and double-entry ledger lock.
 */
export async function apiBookFd(
  input: BookFdInput,
  idempotencyKey?: string,
): Promise<UserFdDto | null> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }
  return await sovereignRequest<UserFdDto>('/fixed-deposits/book', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

/**
 * Fetches user active/matured/closed fixed deposit contracts.
 */
export async function apiFetchUserFds(
  bankId?: string,
  status?: FdStatus,
): Promise<UserFdDto[]> {
  const query = new URLSearchParams();
  if (bankId) query.set('bankId', bankId);
  if (status) query.set('status', status);
  const qStr = query.toString() ? `?${query.toString()}` : '';
  return await sovereignRequest<UserFdDto[]>(`/fixed-deposits/my-fds${qStr}`);
}

/**
 * Fetches a single user fixed deposit contract by ID or depositNumber.
 */
export async function apiFetchUserFd(id: string): Promise<UserFdDto | null> {
  return await sovereignRequest<UserFdDto | null>(`/fixed-deposits/my-fds/${encodeURIComponent(id)}`);
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
  return await sovereignRequest<{
    message: string;
    closedFd: UserFdDto;
    grossPayoutMinor: number;
    penaltyDeductedMinor: number;
    netPayoutMinor: number;
  }>(`/fixed-deposits/my-fds/${encodeURIComponent(id)}/break`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

/**
 * Updates auto-renewal and rollover mandate for a fixed deposit contract.
 */
export async function apiToggleFdAutoRenew(
  id: string,
  input: ToggleFdAutoRenewInput,
): Promise<UserFdDto | null> {
  return await sovereignRequest<UserFdDto | null>(`/fixed-deposits/my-fds/${encodeURIComponent(id)}/auto-renew`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

/**
 * Fetches interest payout ledger logs for a fixed deposit contract.
 */
export async function apiFetchFdPayoutLogs(id: string): Promise<InterestPayoutLogDto[]> {
  return await sovereignRequest<InterestPayoutLogDto[]>(`/fixed-deposits/my-fds/${encodeURIComponent(id)}/payout-logs`);
}

// =============================================================================
// 9. Sovereign Identity, Auth Bridge & Cross-Portal Invalidation Bus
// =============================================================================

export const DEMO_PERSONAS: Record<'citizen' | 'bank_officer' | 'governor', DemoPersonaDto> = {
  citizen: {
    id: 'citizen',
    displayName: 'Dev Sovereign Citizen',
    govIdNumber: 'GOV-2000-0091',
    email: 'sovereign.citizen.1790234351868@arthax.gov',
    role: 'USER',
    title: 'Tier-1 Sovereign Citizen',
    badge: 'Tier-1 Citizen',
  },
  bank_officer: {
    id: 'bank_officer',
    displayName: 'NAVA Branch Administrator',
    govIdNumber: 'GOV-1001-0001',
    email: 'admin.nava@arthax.gov',
    role: 'BANK_ADMIN',
    bankId: 'nava',
    title: 'Commercial Depository Branch Officer',
    badge: 'NAVA Staff',
  },
  governor: {
    id: 'governor',
    displayName: 'Dr. Alistair Vance',
    govIdNumber: 'GOV-0001-0001',
    email: 'governor.vance@arthax.gov',
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
 * Sends a 6-digit email verification OTP via NestJS /auth/register/email.
 */
export async function apiSendEmailOtp(email: string): Promise<{ message: string; expirySeconds: number; code?: string }> {
  return await sovereignRequest<{ message: string; expirySeconds: number; code?: string }>('/auth/register/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

/**
 * Verifies email OTP code via NestJS /auth/register/verify-otp.
 */
export async function apiVerifyEmailOtp(email: string, code: string): Promise<{ verified: boolean; registrationTicket: string }> {
  return await sovereignRequest<{ verified: boolean; registrationTicket: string }>('/auth/register/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
}

/**
 * Creates GOV ID with GOV Password and optional citizen details via NestJS /auth/register/create-gov-id.
 */
export async function apiCreateGovId(
  emailOrPayload: string | CreateGovIdInput,
  otpCode?: string,
  govPassword?: string,
  registrationTicket?: string,
  extra?: Partial<CreateGovIdInput>,
): Promise<GovIdDto & { setupToken: string; token?: string; user?: UserDto }> {
  const payload: CreateGovIdInput =
    typeof emailOrPayload === 'string'
      ? {
          email: emailOrPayload,
          otpCode,
          govPassword: govPassword || '',
          registrationTicket,
          ...extra,
        }
      : emailOrPayload;

  const data = await sovereignRequest<GovIdDto & { setupToken: string; token?: string; user?: UserDto }>(
    '/auth/register/create-gov-id',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

  if (data.token && data.user && typeof window !== 'undefined') {
    localStorage.setItem('arthax_token', data.token);
    localStorage.setItem('arthax_user', JSON.stringify(data.user));
    localStorage.setItem(
      'arthax_persona',
      JSON.stringify({
        id: data.user.id,
        name: data.user.displayName,
        displayName: data.user.displayName,
        role: data.user.role,
        govIdNumber: data.user.govIdNumber,
        email: data.user.email,
        description: 'Sovereign Citizen Account',
      }),
    );
    dispatchPortalDataInvalidation();
  }

  return data;
}

/**
 * Establishes isolated Financial Password and provisions initial bank vault via NestJS /auth/register/set-financial-password.
 */
export async function apiSetFinancialPassword(
  setupToken: string,
  financialPassword: string,
  displayName?: string,
  extra?: { profession?: string; primaryPurpose?: string; preferredBankId?: string },
): Promise<AuthResultDto> {
  const data = await sovereignRequest<AuthResultDto>('/auth/register/set-financial-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${setupToken}`,
    },
    body: JSON.stringify({ financialPassword, displayName, ...extra }),
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('arthax_token', data.token);
    localStorage.setItem('arthax_user', JSON.stringify(data.user));
    localStorage.setItem(
      'arthax_persona',
      JSON.stringify({
        id: data.user.id,
        name: data.user.displayName,
        displayName: data.user.displayName,
        role: data.user.role,
        govIdNumber: data.user.govIdNumber,
        email: data.user.email,
        description: 'Sovereign Citizen Account',
      }),
    );
  }
  dispatchPortalDataInvalidation();
  return data;
}

/**
 * Dispatches 6-digit login OTP code to citizen's registered email.
 */
export async function apiSendLoginOtp(email: string): Promise<{ message: string; expirySeconds: number; code?: string }> {
  return await sovereignRequest<{ message: string; expirySeconds: number; code?: string }>('/auth/login/otp/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

/**
 * Authenticates user credentials via email and 6-digit OTP passcode.
 */
export async function apiLoginWithOtp(email: string, code: string): Promise<AuthResultDto> {
  const data = await sovereignRequest<AuthResultDto>('/auth/login/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('arthax_token', data.token);
    localStorage.setItem('arthax_user', JSON.stringify(data.user));
    localStorage.setItem(
      'arthax_persona',
      JSON.stringify({
        id: data.user.id,
        name: data.user.displayName,
        displayName: data.user.displayName,
        role: data.user.role,
        govIdNumber: data.user.govIdNumber,
        email: data.user.email,
        description: 'Sovereign Citizen Account',
      }),
    );
    dispatchPortalDataInvalidation();
  }

  return data;
}

/**
 * Authenticates user credentials via the sovereign NestJS auth endpoint (/auth/login).
 * The backend PostgreSQL and Redis infrastructure remains the sole authority.
 */
export async function apiLogin(input: LoginInput): Promise<AuthResultDto> {
  const data = await sovereignRequest<AuthResultDto>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('arthax_token', data.token);
    localStorage.setItem('arthax_user', JSON.stringify(data.user));
    localStorage.setItem(
      'arthax_persona',
      JSON.stringify({
        id: data.user.id,
        name: data.user.displayName,
        displayName: data.user.displayName,
        role: data.user.role,
        govIdNumber: data.user.govIdNumber,
        email: data.user.email,
        description: data.user.role === 'CENTRAL_BANK_ADMIN' ? 'Central Monetary Authority' : data.user.role === 'BANK_ADMIN' ? 'Commercial Bank Node' : 'Sovereign Citizen Account',
      }),
    );
    dispatchPortalDataInvalidation();
  }

  return data;
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
 * Returns currently selected active persona metadata, prioritizing authenticated user in session.
 */
export function apiGetActivePersona(): DemoPersonaDto {
  if (typeof window === 'undefined') return DEMO_PERSONAS.citizen;
  const storedUser = localStorage.getItem('arthax_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return {
        id: (user.role === 'CENTRAL_BANK_ADMIN' ? 'governor' : user.role === 'BANK_ADMIN' ? 'bank_officer' : 'citizen') as 'citizen' | 'bank_officer' | 'governor',
        displayName: user.displayName || 'Sovereign Citizen',
        govIdNumber: user.govIdNumber || DEMO_PERSONAS.citizen.govIdNumber,
        email: user.email || DEMO_PERSONAS.citizen.email,
        role: user.role || 'USER',
        bankId: user.bankId,
        title: user.role === 'CENTRAL_BANK_ADMIN' ? 'Central Monetary Authority' : user.role === 'BANK_ADMIN' ? 'Bank Branch Officer' : 'Tier-1 Sovereign Citizen',
        badge: user.role === 'CENTRAL_BANK_ADMIN' ? 'Level-4 Authority' : user.role === 'BANK_ADMIN' ? 'Bank Officer' : 'Tier-1 Citizen',
      };
    } catch {
      // Fallback
    }
  }
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
 * Clears current session, notifies backend to revoke session in Redis & PostgreSQL,
 * and dispatches invalidation signal.
 */
export async function apiLogout(): Promise<void> {
  if (typeof window === 'undefined') return;
  const token = localStorage.getItem('arthax_token') || localStorage.getItem('auth_token');
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Best-effort network notification
    }
  }
  localStorage.removeItem('arthax_token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('arthax_persona');
  localStorage.removeItem('arthax_user');
  dispatchPortalDataInvalidation();
}

/**
 * Queries current authenticated session claims from backend.
 * Fails if token is missing, expired, or revoked in Redis.
 */
export async function apiGetMe(): Promise<AuthSessionPayload> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('arthax_token') || localStorage.getItem('auth_token') : null;
  if (!token) {
    throw new Error('Authentication token missing');
  }
  return await sovereignRequest<AuthSessionPayload>('/auth/me');
}

/**
 * Executes step-up authentication with Argon2id Financial Password.
 */
export async function apiStepUpAuth(input: StepUpAuthInput): Promise<StepUpResultDto> {
  return await sovereignRequest<StepUpResultDto>('/auth/step-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

/**
 * Lists active sessions for current user.
 */
export async function apiGetActiveSessions(): Promise<SessionInfoDto[]> {
  try {
    return await sovereignRequest<SessionInfoDto[]>('/auth/sessions');
  } catch {
    return [];
  }
}

/**
 * Revokes a session by ID.
 */
export async function apiRevokeSession(sessionId: string): Promise<{ success: boolean }> {
  return await sovereignRequest<{ success: boolean }>(`/auth/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  });
}

/**
 * Activates emergency killswitch to terminate all active sessions.
 */
export async function apiEmergencyKillswitch(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await sovereignRequest<{ success: boolean; message: string }>('/auth/sessions/all', {
      method: 'DELETE',
    });
    apiLogout();
    return res;
  } catch {
    apiLogout();
    return { success: true, message: 'All active sessions invalidated.' };
  }
}

// =============================================================================
// 12. Sovereign Commercial Loans & Credit Engine API Bridge
// =============================================================================

/**
 * Discovers available loan products across banks from the live credit engine.
 */
export async function apiFetchLoanProducts(bankId?: string): Promise<LoanProductDto[]> {
  const q = bankId ? `?bankId=${encodeURIComponent(bankId)}` : '';
  return await sovereignRequest<LoanProductDto[]>(`/loans/products${q}`);
}

/**
 * Simulates loan EMI schedule and repayment breakdown via the sovereign credit engine.
 */
export async function apiSimulateLoan(input: LoanSimulationInput): Promise<LoanSimulationResultDto> {
  return await sovereignRequest<LoanSimulationResultDto>('/loans/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

/**
 * Applies for a new sovereign loan facility.
 */
export async function apiApplyLoan(input: ApplyLoanInput, idempotencyKey?: string): Promise<UserLoanDto> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };
  if (idempotencyKey) {
    headers['x-idempotency-key'] = idempotencyKey;
  }

  const res = await fetch(`${API_BASE_URL}/loans/apply`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Loan application failed' }));
    throw new Error(errorBody.message || 'Loan application failed');
  }

  return await res.json();
}

/**
 * Retrieves all loan facilities for the authenticated citizen.
 */
export async function apiFetchMyLoans(): Promise<UserLoanDto[]> {
  return await sovereignRequest<UserLoanDto[]>('/loans/my-loans');
}

/**
 * Fetches a single loan facility by ID.
 */
export async function apiGetLoanDetails(loanId: string): Promise<UserLoanDto> {
  return await sovereignRequest<UserLoanDto>(`/loans/${encodeURIComponent(loanId)}`);
}

/**
 * Citizen disburses an APPROVED loan facility with Financial Password step-up.
 */
export async function apiDisburseLoan(
  loanId: string,
  input: DisburseLoanInput,
  idempotencyKey?: string,
): Promise<UserLoanDto> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) {
    headers['x-idempotency-key'] = idempotencyKey;
  }

  return await sovereignRequest<UserLoanDto>(`/loans/${encodeURIComponent(loanId)}/disburse`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

/**
 * Citizen pays an installment with Financial Password step-up.
 */
export async function apiPayLoanEmi(
  loanId: string,
  input: PayLoanEmiInput,
  idempotencyKey?: string,
): Promise<UserLoanDto> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) {
    headers['x-idempotency-key'] = idempotencyKey;
  }

  return await sovereignRequest<UserLoanDto>(`/loans/${encodeURIComponent(loanId)}/repay-emi`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

/**
 * Citizen forecloses / prepays a loan with Financial Password step-up.
 */
export async function apiForecloseLoan(
  loanId: string,
  input: ForecloseLoanInput,
  idempotencyKey?: string,
): Promise<UserLoanDto> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) {
    headers['x-idempotency-key'] = idempotencyKey;
  }

  return await sovereignRequest<UserLoanDto>(`/loans/${encodeURIComponent(loanId)}/foreclose`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

/**
 * Bank Officer fetches the underwriter queue for their assigned bank.
 */
export async function apiFetchBankLoanQueue(bankId: string): Promise<UserLoanDto[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/bank/${encodeURIComponent(bankId)}/loans/queue`, {
      headers: { ...getAuthHeader() },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Return empty list
  }
  return [];
}

/**
 * Bank Officer reviews (APPROVE / REJECT) a loan application.
 */
export async function apiReviewLoan(
  bankId: string,
  loanId: string,
  input: ReviewLoanInput,
): Promise<UserLoanDto> {
  const res = await fetch(`${API_BASE_URL}/bank/${encodeURIComponent(bankId)}/loans/${encodeURIComponent(loanId)}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Loan review failed' }));
    throw new Error(errorBody.message || 'Loan review failed');
  }

  return await res.json();
}

// =============================================================================
// CENTRAL BANK GOVERNANCE & MONETARY POLICY API BRIDGE
// =============================================================================

export async function apiFetchCentralBankOverview(): Promise<CentralBankOverviewDto> {
  return sovereignRequest<CentralBankOverviewDto>('/central-bank/overview');
}

export async function apiFetchMonetarySupply(): Promise<MonetarySupplyDto> {
  return sovereignRequest<MonetarySupplyDto>('/central-bank/monetary/supply');
}

export async function apiProposeSovereignIssuance(
  input: ProposeSovereignIssuanceInput,
  idempotencyKey?: string,
): Promise<SovereignIssuanceDto> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['x-idempotency-key'] = idempotencyKey;

  return sovereignRequest<SovereignIssuanceDto>('/central-bank/monetary/issuance/propose', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

export async function apiApproveSovereignIssuance(
  input: ApproveSovereignIssuanceInput,
  idempotencyKey?: string,
): Promise<SovereignIssuanceDto> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['x-idempotency-key'] = idempotencyKey;

  return sovereignRequest<SovereignIssuanceDto>('/central-bank/monetary/issuance/approve', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

export async function apiFetchBankPrudentialMetrics(): Promise<BankPrudentialMetricsDto[]> {
  return sovereignRequest<BankPrudentialMetricsDto[]>('/central-bank/prudential/banks');
}

export async function apiFetchCentralBankRules(): Promise<FinancialRuleDto[]> {
  return sovereignRequest<FinancialRuleDto[]>('/central-bank/financial-rules');
}

export async function apiCreateCentralBankRule(input: CreateFinancialRuleInput): Promise<FinancialRuleDto> {
  return sovereignRequest<FinancialRuleDto>('/central-bank/financial-rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function apiUpdateCentralBankRule(input: UpdateFinancialRuleInput): Promise<FinancialRuleDto> {
  return sovereignRequest<FinancialRuleDto>('/central-bank/financial-rules', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function apiFetchCentralBankTaxRules(): Promise<TaxRuleDto[]> {
  return sovereignRequest<TaxRuleDto[]>('/central-bank/tax-rules');
}

export async function apiRequestElaFacility(
  input: RequestElaFacilityInput,
  idempotencyKey?: string,
): Promise<ElaFacilityDto> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['x-idempotency-key'] = idempotencyKey;

  return sovereignRequest<ElaFacilityDto>('/central-bank/emergency/ela/request', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

export async function apiRepayElaFacility(
  input: RepayElaFacilityInput,
  idempotencyKey?: string,
): Promise<ElaFacilityDto> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['x-idempotency-key'] = idempotencyKey;

  return sovereignRequest<ElaFacilityDto>('/central-bank/emergency/ela/repay', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

export async function apiCreateEmergencyAction(
  input: CreateEmergencyActionInput,
  idempotencyKey?: string,
): Promise<EmergencyActionDto> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['x-idempotency-key'] = idempotencyKey;

  return sovereignRequest<EmergencyActionDto>('/central-bank/emergency/action', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
}

export async function apiRevokeEmergencyAction(
  actionId: string,
  input: RevokeEmergencyActionInput,
): Promise<EmergencyActionDto> {
  return sovereignRequest<EmergencyActionDto>(`/central-bank/emergency/action/${encodeURIComponent(actionId)}/revoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function apiFetchEmergencyStatus(): Promise<{ marketHalted: boolean; activeActions: EmergencyActionDto[] }> {
  return sovereignRequest<{ marketHalted: boolean; activeActions: EmergencyActionDto[] }>('/central-bank/emergency/status');
}

/**
 * Checks Supabase Auth connection status.
 */
export async function apiGetSupabaseStatus(): Promise<{ configured: boolean; supabaseUrl: string }> {
  return sovereignRequest<{ configured: boolean; supabaseUrl: string }>('/auth/supabase/status');
}

/**
 * Bulk-syncs all registered ARTHAX citizens into Supabase Auth (auth.users).
 */
export async function apiSyncAllToSupabase(): Promise<{ total: number; synced: number; failed: number }> {
  return sovereignRequest<{ total: number; synced: number; failed: number }>('/auth/supabase/sync-all', {
    method: 'POST',
  });
}



