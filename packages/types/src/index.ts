/**
 * @arthax/types — The DB-to-UI Type Safety Contract for ARTHAX
 *
 * All financial amounts are integer minor units (1 ARTH = 100 minor units).
 * This package is shared across apps/api, apps/web, and all packages.
 */

// =============================================================================
// 1. Currency & Minor Units Math Helpers
// =============================================================================

export const ARTH_SCALE = 100n; // 1 ARTH = 100 minor units
export const ARTH_SCALE_NUM = 100;

export type MinorUnits = bigint;

/**
 * Converts float/decimal ARTH amount to integer minor units.
 * Example: 142.50 ARTH -> 14250n minor units
 */
export function arthToMinorUnits(arth: number): bigint {
  return BigInt(Math.round(arth * ARTH_SCALE_NUM));
}

/**
 * Converts integer minor units to float ARTH amount for UI display.
 * Example: 14250n minor units -> 142.50 ARTH
 */
export function minorUnitsToArth(units: bigint | number | string): number {
  const bigVal = typeof units === 'bigint' ? units : BigInt(units);
  return Number(bigVal) / ARTH_SCALE_NUM;
}

/**
 * Formats minor units as human-readable ARTH string with commas and 2 decimals.
 * Example: 14250n -> "142.50"
 */
export function formatArth(units: bigint | number | string): string {
  const val = minorUnitsToArth(units);
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

// =============================================================================
// 2. Identity & Authentication
// =============================================================================

export type UserRole = 'USER' | 'BANK_ADMIN' | 'CENTRAL_BANK_ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'LOCKED' | 'CLOSED';

export type GovIdStatus = 'ACTIVE' | 'SUSPENDED' | 'LOCKED';

export interface GovIdDto {
  id: string;
  govIdNumber: string; // e.g. "GOV-4819-2041"
  email: string;
  emailVerified: boolean;
  status: GovIdStatus;
  createdAt: string;
}

export interface UserDto {
  id: string;
  govId: string;
  govIdNumber: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface AuthSessionPayload {
  sub: string; // User ID
  govId: string;
  email: string;
  role: UserRole;
  bankId?: string; // Set for BANK_ADMIN
}

export interface AuthResultDto {
  token: string;
  user: UserDto;
  sessionExpiresAt: string;
}

export interface StepUpResultDto {
  verified: boolean;
  stepUpToken: string;
  expiresInSeconds: number;
}

export interface SessionInfoDto {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt: string;
  isCurrent?: boolean;
}

export interface LoginInput {
  govIdOrEmail: string;
  govPassword: string;
}

export interface RegisterEmailInput {
  email: string;
}

export interface VerifyOtpInput {
  email: string;
  otpCode: string;
}

export interface CreateGovIdInput {
  email: string;
  govPassword: string;
}

export interface SetFinancialPasswordInput {
  financialPassword: string;
  displayName?: string;
}

export interface StepUpAuthInput {
  financialPassword: string;
}


// =============================================================================
// 3. Core Ledger & Double-Entry Invariants
// =============================================================================

export type LedgerAccountType =
  | 'BANK_ACCOUNT'
  | 'BANK_RESERVE'
  | 'CENTRAL_TREASURY'
  | 'TAX_AUTHORITY'
  | 'FEE_POOL'
  | 'STOCK_EXCHANGE'
  | 'SHOP_REVENUE'
  | 'REWARD_POOL'
  | 'LOAN_POOL'
  | 'FD_POOL'
  | 'CLS_CLEARING';

export type TransactionType =
  | 'TRANSFER'
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'INTEREST'
  | 'FEE'
  | 'TAX'
  | 'LOAN_DISBURSEMENT'
  | 'LOAN_REPAYMENT'
  | 'FD_BOOKING'
  | 'FD_MATURITY'
  | 'STOCK_BUY'
  | 'STOCK_SELL'
  | 'SHOP_PURCHASE'
  | 'REWARD'
  | 'REVERSAL'
  | 'MINT'
  | 'BURN';

/**
 * Strict 9-state transaction lifecycle state machine.
 * Transitions:
 * PENDING -> VALIDATING -> AUTHORIZED -> PROCESSING -> SETTLING -> FINALIZING -> COMPLETED
 * Terminal non-completed states: FAILED, REVERSED, CANCELLED
 */
export type TransactionStatus =
  | 'PENDING'
  | 'VALIDATING'
  | 'AUTHORIZED'
  | 'PROCESSING'
  | 'SETTLING'
  | 'FINALIZING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED'
  | 'CANCELLED';

export type TransactionEntryType = 'DEBIT' | 'CREDIT';

export type TransactionScope = 'INTERNAL' | 'INTER_BANK';

export interface LedgerEntryDto {
  id: string;
  transactionId: string;
  ledgerAccountId: string;
  entryType: TransactionEntryType;
  amountMinor: string; // Stringified bigint for JSON safety
  createdAt: string;
}

export interface TransactionDto {
  id: string;
  referenceNumber: string; // e.g. "TX-260910-001"
  type: TransactionType;
  status: TransactionStatus;
  scope: TransactionScope;
  amountMinor: string; // Stringified bigint
  feesMinor: string;
  taxMinor: string;
  initiatedBy?: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  settlementId?: string;
  failureReason?: string;
  metadata?: Record<string, unknown>;
  entries?: LedgerEntryDto[];
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// 4. Central Settlement Layer (CLS)
// =============================================================================

export type SettlementStage =
  | 'VALIDATING'
  | 'AUTHORIZED'
  | 'PROCESSING'
  | 'SETTLING'
  | 'FINALIZING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED';

export type SettlementExecutionMode = 'RTGS' | 'BATCH';

export interface SettlementTimelineEvent {
  stage: SettlementStage;
  timestamp: string;
  note?: string;
  transactionId?: string;
}

export interface SettlementDto {
  id: string;
  reference: string;
  sourceBankId: string;
  destinationBankId: string;
  amountMinor: string;
  feeLevyMinor: string;
  stage: SettlementStage;
  clearingLatencyMs?: number;
  failureReason?: string;
  reversalTransactionId?: string;
  timeline?: SettlementTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface ClsQueueSummaryDto {
  pendingCount: number;
  processingCount: number;
  settlingCount: number;
  completedCount24h: number;
  failedCount24h: number;
  totalClearingVolumeMinor: string;
  avgClearingLatencyMs: number;
  clearingPoolBalanceMinor: string;
}

export interface InterbankBilateralFlowDto {
  sourceBankId: string;
  destinationBankId: string;
  obligationCount: number;
  totalVolumeMinor: string;
  netSettlementMinor: string;
}

export interface BatchSettlementResultDto {
  batchId: string;
  totalProcessed: number;
  successfulCount: number;
  failedCount: number;
  totalVolumeMinor: string;
  settlementIds: string[];
}

export interface ClsReconciliationReportDto {
  isReconciled: boolean;
  clearingPoolBalanceMinor: string;
  activeObligationsMinor: string;
  deltaMinor: string;
  unsettledSettlementCount: number;
  checkedAt: string;
}

// =============================================================================
// 5. Commercial Banking
// =============================================================================

export type BankId = 'nava' | 'samaya' | 'setu' | 'sthira' | 'vayu';

export interface BankDto {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  logoPath: string;
  licenseNumber: string;
  establishedDate: string;
  accentColor: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CLOSED';
  ownership: string;
  governingDirector: string;
}

export interface BankProductDto {
  id: string;
  bankId: string;
  name: string;
  category: string;
  description: string;
  minBalanceMinor: string;
  features?: Record<string, unknown>;
  active: boolean;
}

export interface BankAdminOverviewDto {
  bankId: string;
  bankName: string;
  totalAssetsMinor: string;
  totalDepositsMinor: string;
  customerCount: number;
  activeAccountsCount: number;
  todayTransactionCount: number;
  todayVolumeMinor: string;
  status: string;
}

export type BankAccountType = 'SAVINGS' | 'CURRENT';

export type BankAccountStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'FROZEN'
  | 'CLOSED'
  | 'DORMANT';

export interface BankAccountDto {
  id: string;
  accountNumber: string; // e.g. "ARTH-NAVA-001"
  customerId: string;
  bankId: string;
  userId: string;
  type: BankAccountType;
  purpose: string;
  status: BankAccountStatus;
  balanceMinor: string; // Cached snapshot in minor units
  dailyLimitMinor: string;
  monthlyLimitMinor: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankCustomerDto {
  id: string;
  userId: string;
  bankId: string;
  customerNumber: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'KYC_PENDING' | 'CLOSED';
  tier: string;
  joinedAt: string;
  accounts?: BankAccountDto[];
}

export type FdStatus = 'ACTIVE' | 'MATURED' | 'BROKEN' | 'PENDING';

export interface FdSchemeDto {
  id: string;
  bankId: string;
  name: string;
  tenureDays: number;
  baseApy: number; // e.g. 7.2 for 7.2%
  seniorApy: number;
  minimumDepositMinor: string;
  maximumDepositMinor: string;
  lockInDays: number;
  preclosurePenaltyRate: number; // e.g. 1.0 for 1%
  active: boolean;
}

export type FdRolloverInstruction = 'NONE' | 'PRINCIPAL_ONLY' | 'PRINCIPAL_AND_INTEREST';

export interface UserFdDto {
  id: string;
  userId: string;
  accountId: string;
  bankId: string;
  schemeId: string;
  certificateNumber: string;
  depositNumber?: string;
  principalMinor: string;
  maturityAmountMinor: string;
  maturityPayoutMinor?: string | number;
  apy: number;
  effectiveApy?: number;
  petBoosterApy?: number;
  status: FdStatus;
  startDate: string;
  maturityDate: string;
  interestPayoutFrequency: 'MONTHLY' | 'QUARTERLY' | 'AT_MATURITY';
  accruedInterestMinor: string;
  autoRenew: boolean;
  rolloverInstruction: FdRolloverInstruction;
  closedAt?: string | null;
  payoutAmountMinor?: string | null;
  payoutTxId?: string | null;
  schemeName?: string;
  bankName?: string;
  tenureDays?: number;
  lockInDays?: number;
  preclosurePenaltyRate?: number;
  certificateHash?: string;
  createdAt?: string;
}

export interface FdSimulationInput {
  bankId?: string;
  schemeId: string;
  principalMinor: string | number;
  tenureDays: number;
  seniorCitizen?: boolean;
}

export interface FdSimulationResultDto {
  schemeId: string;
  bankId: string;
  principalMinor: string | number;
  tenureDays: number;
  baseApy: number;
  seniorBonusApy?: number;
  petBonusApy?: number;
  petBoosterApy?: number;
  effectiveApy: number;
  interestPayoutMinor?: string | number;
  estimatedInterestMinor?: string | number;
  maturityAmountMinor?: string | number;
  maturityPayoutMinor?: string | number;
  compoundingFrequency: 'QUARTERLY';
  lockInDays: number;
  preclosurePenaltyRate?: number;
  projectedMaturityDate?: string;
  dailyAccrualRateMinor?: number;
}

export interface BookFdInput {
  sourceAccountId?: string;
  accountId?: string;
  schemeId: string;
  principalMinor: string | number;
  tenureDays?: number;
  autoRenew?: boolean;
  rolloverInstruction?: FdRolloverInstruction;
  financialPassword: string;
  seniorCitizen?: boolean;
}

export interface BreakFdInput {
  targetAccountId?: string;
  destinationAccountId?: string;
  financialPassword: string;
}

export interface ToggleFdAutoRenewInput {
  autoRenew: boolean;
  rolloverInstruction?: FdRolloverInstruction;
}

export interface InterestPayoutLogDto {
  id: string;
  userFdId: string;
  userId: string;
  transactionId: string;
  grossAmountMinor: string;
  taxWithheldMinor: string;
  netAmountMinor: string;
  payoutDate: string;
  payoutType: 'MATURITY' | 'PERIODIC' | 'PRE_CLOSURE';
}

// =============================================================================
// 6. Equities & Stock Market
// =============================================================================

export type OrderType = 'LIMIT' | 'MARKET' | 'STOP';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus =
  | 'OPEN'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REJECTED';

export interface StockCompanyDto {
  symbol: string; // e.g. "ANVIK", "ARKA", "NILA"
  name: string;
  sector: string;
  currentPriceMinor: string; // Integer minor units (e.g. 14250 for 142.50 ARTH)
  openingPriceMinor: string;
  dayHighMinor: string;
  dayLowMinor: string;
  previousCloseMinor: string;
  changePercent: number;
  volume: number;
  marketCapMinor: string;
  peRatio: number;
  circuitLimitLowMinor: string;
  circuitLimitHighMinor: string;
  circuitBreakerActive: boolean;
  sharesOutstanding: number;
  freeFloatPercent: number;
  dividendYield: number;
  description: string;
  listedDate: string;
  status: 'ACTIVE' | 'HALTED' | 'DELISTED';
}

export interface StockOrderDto {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  filledQuantity: number;
  priceMinor: string;
  status: OrderStatus;
  sourceAccountId?: string;
  reservedAmountMinor?: string;
  reservedShares?: number;
  isIdempotentReplay?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderBookLevelDto {
  priceMinor: string;
  quantity: number;
  orderCount: number;
  totalMinor: string;
}

export interface OrderBookDepthDto {
  symbol: string;
  currentPriceMinor: string;
  bids: OrderBookLevelDto[];
  asks: OrderBookLevelDto[];
  spreadMinor: string;
  timestamp: string;
}

export interface PortfolioHoldingDto {
  symbol: string;
  shares: number;
  availableShares: number;
  reservedShares: number;
  averageBuyPriceMinor: string;
  currentPriceMinor: string;
  totalCostMinor: string;
  currentValueMinor: string;
  unrealizedProfitLossMinor: string;
  unrealizedProfitLossPercent: number;
}

export interface UserPortfolioSummaryDto {
  totalInvestedMinor: string;
  currentValueMinor: string;
  totalUnrealizedProfitLossMinor: string;
  totalReturnPercent: number;
  holdings: PortfolioHoldingDto[];
}

export interface TradeExecutionDto {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  symbol: string;
  executionPriceMinor: string;
  quantity: number;
  buyerUserId: string;
  sellerUserId: string;
  buyerFeeMinor: string;
  sellerFeeMinor: string;
  taxLevyMinor: string;
  executedAt: string;
}

export interface StockTaxRecordDto {
  id: string;
  userId: string;
  symbol: string;
  sharesSold: number;
  sellPriceMinor: string;
  buyPriceMinor: string;
  realizedProfitMinor: string;
  taxRatePercent: number;
  taxAmountMinor: string;
  offsetAppliedMinor: string;
  offsetAddedMinor?: string;
  ruleCitation?: string;
  executedAt: string;
}

export interface TaxReportDto {
  totalRealizedGainsMinor: string;
  totalRealizedLossesMinor: string;
  netTaxableGainMinor: string;
  totalTaxPaidMinor: string;
  carriedLossOffsetBalanceMinor: string;
  ruleCode: string;
  ruleVersion: string;
  taxEvents: StockTaxRecordDto[];
}

export interface SimulatedTickResultDto {
  symbol: string;
  previousPriceMinor: string;
  newPriceMinor: string;
  changePercent: number;
  volume: number;
  circuitBreakerActive: boolean;
  timestamp: string;
}

// Market Price Simulation Parameters (Decision 4 Model)
export interface MarketPriceModelInput {
  symbol: string;
  basePriceMinor: bigint;
  orderBookPressure: number; // -1.0 to 1.0
  companyVolatility: number; // 0.01 to 0.15
  marketSentiment: number;   // -0.5 to 0.5
  controlledNoise: number;   // Gaussian noise factor
}

// =============================================================================
// 7. Shop & Customization Inventory
// =============================================================================

export type RarityTier = 'normal' | 'rare' | 'epic' | 'gold';
export type ShopCategory = 'all' | 'pets' | 'avatars' | 'frames' | 'banners' | 'inventory';
export type ShopItemStatus = 'ACTIVE' | 'DISABLED' | 'RETIRED';
export type ItemOwnershipType = 'UNIQUE_PER_USER' | 'CONSUMABLE';

export interface ShopItemDto {
  id: string;
  name: string;
  category: 'pet' | 'avatar' | 'frame' | 'banner';
  rarity: RarityTier;
  priceMinor: string; // In minor units
  image: string;
  secondaryImage?: string;
  rank?: string;
  role?: string;
  gender?: 'female' | 'male';
  powerTitle?: string;
  powerDescription?: string;
  attireSpec?: string;
  accreditation?: string;
  covenantSection?: string;
  perks?: string[];
  status?: ShopItemStatus;
  ownershipType?: ItemOwnershipType;
}

export interface EquippedLoadoutDto {
  frameId?: string;
  avatarId?: string;
  bannerId?: string;
  petId?: string;
}

export interface UserInventoryDto {
  userId: string;
  ownedItemIds: string[];
  loadout: EquippedLoadoutDto;
}

export interface ActivePetModifierDto {
  petId: string;
  name: string;
  modifierType:
    | 'FD_YIELD_BOOST'
    | 'EQUITIES_BROKERAGE_DISCOUNT'
    | 'WIRE_FEE_CASHBACK'
    | 'PRIORITY_CLS_CLEARING'
    | 'ZERO_GAS_CLEARING'
    | 'EARLY_FD_BREAK_PENALTY_SHIELD'
    | 'CIVIC_BOUNTY_LIMIT';
  valuePercent?: number;
  bountyMinor?: string;
  powerTitle: string;
  powerDescription: string;
  downstreamDomain: 'BANKING' | 'STOCKS' | 'CLS' | 'REWARDS';
}

export interface ShopGiftResultDto {
  success: boolean;
  transactionId: string;
  recipientUserId: string;
  recipientIdentifier: string;
  itemId: string;
  message: string;
  isIdempotentReplay?: boolean;
}

// =============================================================================
// 8. Central Bank & Governance
// =============================================================================

export interface FinancialRuleDto {
  id: string;
  key: string;
  title: string;
  currentValue: number;
  unit: string;
  category: 'Monetary Policy' | 'Prudential Requirements' | 'Transaction Limits' | 'System Controls';
  description: string;
  version: string;
  lastModified: string;
  modifiedBy: string;
  effectiveDate: string;
  statutoryBasis: string;
}

export interface TaxRuleDto {
  id: string;
  name: string;
  code: string;
  category: 'Equities' | 'Transactions' | 'Fixed Deposits' | 'Corporate';
  ratePercent: number;
  thresholdMinor: string;
  description: string;
  version: string;
  effectiveFrom: string;
}

export type AuditSeverity = 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';

export interface AuditLogDto {
  id: string;
  timestamp: string;
  eventType:
    | 'POLICY_CHANGE'
    | 'BANK_ACTION'
    | 'SETTLEMENT_OVERRIDE'
    | 'SECURITY_EVENT'
    | 'COMPLIANCE_NOTICE'
    | 'MONETARY_EVENT';
  actorId: string;
  actorRole: string;
  targetEntity: string;
  action: string;
  severity: AuditSeverity;
  ipAddress?: string;
  sessionHash?: string;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
}

export interface MonetarySupplyDto {
  m0SupplyMinor: string;
  m1SupplyMinor: string;
  inCirculationMinor: string;
  centralTreasuryMinor: string;
  centralBankReservesMinor: string;
  commercialBankReservesMinor: string;
  vaultRestrictedMinor: string;
  activeEpoch: string;
  ledgerInvariantSatisfied: boolean;
  supplyInvariantSatisfied: boolean;
}

export type SovereignIssuanceStatus = 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
export type SovereignOperationType = 'MINT' | 'BURN';

export interface SovereignIssuanceDto {
  issuanceId: string;
  operation: SovereignOperationType;
  amountMinor: string;
  reason: string;
  authorizedBy: string; // Maker
  checkerBy?: string | null; // Checker
  ruleVersion: string;
  timestamp: string;
  idempotencyKey: string;
  status: SovereignIssuanceStatus;
  executedTransactionId?: string | null;
  executedAt?: string | null;
}

export type BankPrudentialStatus = 'COMPLIANT' | 'WATCHLIST' | 'DEFICIENT' | 'NON_COMPLIANT' | 'MORATORIUM';

export interface BankPrudentialMetricsDto {
  bankId: string;
  bankName: string;
  ndtlMinor: string; // Net Demand and Time Liabilities
  crrRequiredMinor: string;
  crrMaintainedMinor: string;
  crrRatioPercent: number;
  crrBenchmarkPercent: number;
  slrRatioPercent: number;
  slrBenchmarkPercent: number;
  carRatioPercent: number;
  carBenchmarkPercent: number;
  complianceStatus: BankPrudentialStatus;
  penaltyAssessedMinor: string;
  lastAuditedAt: string;
}

export type EmergencyActionType = 'MARKET_HALT' | 'BANK_MORATORIUM' | 'ACCOUNT_FREEZE' | 'LIQUIDITY_INJECTION';
export type EmergencyActionStatus = 'REQUESTED' | 'AUTHORIZED' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface EmergencyActionDto {
  actionId: string;
  actionType: EmergencyActionType;
  target: string; // e.g. "MARKET:ALL" or "BANK:vayu" or "ACCOUNT:ARTH-NAVA-001"
  reason: string;
  authorizedBy: string;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
  status: EmergencyActionStatus;
}

export type ElaFacilityStatus = 'ACTIVE' | 'SETTLED' | 'DEFAULTED';

export interface ElaFacilityDto {
  facilityId: string;
  bankId: string;
  amountMinor: string;
  collateralAssetId: string;
  collateralAppraisedMinor: string;
  haircutPercent: number; // e.g. 20.0
  effectiveLtvPercent: number; // e.g. 80.0
  interestRateApy: number; // e.g. 6.25 (base 4.25 + 200 bps penalty spread)
  tenureDays: number;
  maturityDate: string;
  repaidMinor: string;
  status: ElaFacilityStatus;
  disbursedTransactionId: string;
  createdAt: string;
}

export interface CentralBankOverviewDto {
  m0SupplyMinor: string;
  m1SupplyMinor: string;
  activeCommercialBanks: number;
  clsSettlementHealthPercent: number;
  avgClearingLatencyMs: number;
  statutoryReserveRatioPercent: number;
  basePolicyRateApy: number;
  ledgerInvariantSatisfied: boolean;
  supplyInvariantSatisfied: boolean;
  activeEmergencyActionsCount: number;
}

export interface ProposeSovereignIssuanceInput {
  operation: 'MINT' | 'BURN';
  amountMinor: string;
  reason: string;
  ruleVersion?: string;
  financialPassword: string;
}

export interface ApproveSovereignIssuanceInput {
  issuanceId: string;
  financialPassword: string;
}

export interface RequestElaFacilityInput {
  bankId: string;
  amountMinor: string;
  collateralAssetId: string;
  collateralAppraisedMinor: string;
  tenureDays?: number;
  financialPassword: string;
}

export interface RepayElaFacilityInput {
  facilityId: string;
  amountMinor: string;
  sourceAccountId: string;
  financialPassword: string;
}

export interface CreateEmergencyActionInput {
  actionType: EmergencyActionType;
  target: string;
  reason: string;
  durationMinutes?: number;
  financialPassword: string;
}

export interface RevokeEmergencyActionInput {
  actionId: string;
  reason: string;
  financialPassword: string;
}

export interface CreateFinancialRuleInput {
  key: string;
  title: string;
  currentValue: number;
  unit: string;
  category: 'Monetary Policy' | 'Prudential Requirements' | 'Transaction Limits' | 'System Controls';
  description: string;
  statutoryBasis: string;
  effectiveDate?: string;
  financialPassword: string;
}

export interface UpdateFinancialRuleInput {
  currentValue?: number;
  status?: 'ACTIVE' | 'PENDING' | 'DEPRECATED' | 'REPLACED';
  effectiveDate?: string;
  statutoryBasis?: string;
  reason: string;
  financialPassword: string;
}

// =============================================================================
// 9. Mailbox & Notifications (Phase 9)
// =============================================================================

export type NotificationCategory =
  | 'TRANSFER'
  | 'SETTLEMENT'
  | 'STOCK'
  | 'SHOP'
  | 'FD'
  | 'LOAN'
  | 'REWARD'
  | 'SYSTEM'
  | 'SECURITY'
  | 'POLICY';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface NotificationDto {
  id: string;
  userId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  summary: string;
  content: string;
  templateCode: string;
  templateVersion: number;
  sourceDomain: 'BANKING' | 'CLS' | 'STOCKS' | 'SHOP' | 'CENTRAL_BANK' | 'SECURITY' | 'FIXED_DEPOSIT' | 'FD';
  sourceType: string;
  sourceId: string;
  eventId: string;
  metadata?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MailboxSummaryDto {
  unreadCount: number;
  totalActiveCount: number;
  items: NotificationDto[];
  hasMore: boolean;
}

export interface DispatchNotificationInput {
  userId: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  title: string;
  summary: string;
  content: string;
  templateCode: string;
  templateVersion?: number;
  sourceDomain: 'BANKING' | 'CLS' | 'STOCKS' | 'SHOP' | 'CENTRAL_BANK' | 'SECURITY' | 'FIXED_DEPOSIT' | 'FD';
  sourceType: string;
  sourceId: string;
  eventId: string;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// 9. World Integration & Cross-Domain Event Contracts
// =============================================================================

export interface CrossDomainEventEnvelope {
  eventId: string;
  correlationId: string;
  sourceDomain: 'IDENTITY' | 'LEDGER' | 'BANKING' | 'CLS' | 'STOCKS' | 'SHOP' | 'FIXED_DEPOSITS' | 'CENTRAL_BANK';
  sourceType: string;
  sourceId: string;
  occurredAt: string;
  payload?: Record<string, unknown>;
}

export interface IntegrationCorrelationDto {
  correlationId: string;
  rootEventId: string;
  originDomain: string;
  causationId?: string;
  dispatchedAt: string;
}

export interface DemoPersonaDto {
  id: 'citizen' | 'bank_officer' | 'governor';
  displayName: string;
  govIdNumber: string;
  email: string;
  role: UserRole;
  bankId?: string;
  title: string;
  badge: string;
}

// =============================================================================
// 10. Commercial Lending & Credit Facilities (Phase 12A)
// =============================================================================

export type LoanType =
  | 'PERSONAL'
  | 'BUSINESS'
  | 'EDUCATION'
  | 'HOUSING'
  | 'VEHICLE'
  | 'COLLATERAL_CREDIT';

export type LoanStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'DISBURSED'
  | 'ACTIVE'
  | 'PAYMENT_DUE'
  | 'OVERDUE'
  | 'DELINQUENT'
  | 'FORECLOSING'
  | 'CLOSED'
  | 'REJECTED'
  | 'CANCELLED';

export type CollateralType = 'FIXED_DEPOSIT' | 'STOCK_HOLDINGS' | 'SOVEREIGN_GUARANTEE';

export interface LoanProductDto {
  id: string;
  bankId: string;
  name: string;
  category: LoanType;
  description: string;
  baseInterestRate: number; // e.g. 8.50%
  minPrincipalMinor: string;
  maxPrincipalMinor: string;
  minTenureMonths: number;
  maxTenureMonths: number;
  processingFeePercent: number; // e.g. 0.5%
  collateralRequired: boolean;
  minCollateralRatioPercent?: number; // e.g. 120%
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface LoanRepaymentInstallmentDto {
  installmentNumber: number;
  dueDate: string;
  principalMinor: string;
  interestMinor: string;
  totalAmountMinor: string;
  totalDueMinor?: string;
  remainingPrincipalMinor: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'WAIVED';
  paidAt?: string | null;
  transactionId?: string | null;
}

export interface LoanCollateralDto {
  id: string;
  loanId: string;
  collateralType: CollateralType;
  assetReferenceId: string; // e.g. FD certificate number or stock symbol
  appraisedValueMinor: string;
  lienStatus: 'ACTIVE' | 'RELEASED' | 'INVOKED';
  lockedAt: string;
  releasedAt?: string | null;
}

export interface UserLoanDto {
  id: string;
  contractNumber: string; // e.g. LN-NAVA-2026-XXXXXX
  userId: string;
  bankId: string;
  productId: string;
  productName: string;
  disbursementAccountId: string;
  repaymentAccountId: string;
  loanType: LoanType;
  status: LoanStatus;
  principalMinor: string;
  interestRate: number;
  tenureMonths: number;
  monthlyEmiMinor: string;
  outstandingPrincipalMinor: string;
  totalRepaidPrincipalMinor: string;
  totalRepaidInterestMinor: string;
  nextPaymentDueDate?: string | null;
  installments: LoanRepaymentInstallmentDto[];
  collaterals: LoanCollateralDto[];
  appliedAt: string;
  approvedAt?: string | null;
  disbursedAt?: string | null;
  closedAt?: string | null;
  rejectionReason?: string | null;
  approvedByStaffId?: string | null;
  overdueDays?: number;
  latePenaltyInterestMinor?: string;
}

export interface CreditAssessmentDto {
  creditScore: number; // 300 - 850
  tier: 'TIER_1_EXCELLENT' | 'TIER_2_GOOD' | 'TIER_3_FAIR' | 'SUBPRIME';
  maxSanctionAmountMinor: string;
  debtToIncomeRatio: number;
  activeDebtCount: number;
  recommendedRate: number;
  collateralRequired: boolean;
  eligible: boolean;
  reasons: string[];
}

export interface LoanSimulationResultDto {
  requestedPrincipalMinor: string;
  annualInterestRate: number;
  tenureMonths: number;
  monthlyEmiMinor: string;
  totalInterestMinor: string;
  totalRepaymentMinor: string;
  processingFeeMinor: string;
  schedule: LoanRepaymentInstallmentDto[];
}

export interface LoanSimulationInput {
  productId: string;
  principalMinor: string;
  tenureMonths: number;
}

export interface ApplyLoanInput {
  bankId: string;
  productId: string;
  requestedPrincipalMinor: string;
  tenureMonths: number;
  purpose: string;
  disbursementAccountId: string;
  repaymentAccountId: string;
  collateralType?: CollateralType;
  collateralAssetId?: string;
  collateralPledgedValueMinor?: string;
}

export interface ReviewLoanInput {
  action: 'APPROVE' | 'REJECT';
  sanctionedPrincipalMinor?: string;
  interestRateApy?: number;
  rejectionReason?: string;
  underwriterNotes?: string;
}

export interface DisburseLoanInput {
  financialPassword: string;
  disbursementAccountId?: string;
}

export interface PayLoanEmiInput {
  financialPassword: string;
  installmentNumber: number;
  sourceAccountId?: string;
}

export interface ForecloseLoanInput {
  financialPassword: string;
  sourceAccountId?: string;
}

