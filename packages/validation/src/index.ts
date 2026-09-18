import { z } from 'zod';

/**
 * @arthax/validation — Zod Validation Schemas for API Input Validation
 */

// -----------------------------------------------------------------------------
// 1. Identity & Auth Schemas
// -----------------------------------------------------------------------------

export const RegisterEmailSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid sovereign or institutional email address')
    .max(255),
});

export type RegisterEmailInput = z.infer<typeof RegisterEmailSchema>;

export const VerifyOtpSchema = z.object({
  email: z.string().email().max(255),
  code: z
    .string()
    .regex(/^\d{6}$/, 'OTP must be a 6-digit numeric verification code'),
});

export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export const CreateGovIdSchema = z.object({
  email: z.string().email().max(255),
  otpCode: z.string().regex(/^\d{6}$/),
  govPassword: z
    .string()
    .min(10, 'GOV Password must be at least 10 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});

export type CreateGovIdInput = z.infer<typeof CreateGovIdSchema>;

export const SetFinancialPasswordSchema = z.object({
  financialPassword: z
    .string()
    .min(8, 'Financial Password must be at least 8 characters')
    .max(128)
    .regex(/[0-9]/, 'Must contain at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special symbol'),
  displayName: z.string().min(2).max(100).optional(),
});

export type SetFinancialPasswordInput = z.infer<typeof SetFinancialPasswordSchema>;

export const LoginSchema = z.object({
  govIdOrEmail: z.string().min(3).max(255),
  govPassword: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const StepUpAuthSchema = z.object({
  financialPassword: z.string().min(1, 'Financial password is required for verification'),
});

export type StepUpAuthInput = z.infer<typeof StepUpAuthSchema>;

// -----------------------------------------------------------------------------
// 2. Transfers & Financial Movement Schemas
// -----------------------------------------------------------------------------

export const TransferRequestSchema = z.object({
  sourceAccountId: z.string().uuid('Valid source bank account ID required'),
  destinationAccountNumber: z
    .string()
    .regex(/^ARTH-[A-Z0-9]+-\d+$/, 'Invalid ARTH account number format (e.g. ARTH-NAVA-001)'),
  amountMinor: z
    .string()
    .regex(/^\d+$/, 'Amount must be positive integer minor units')
    .refine((val) => BigInt(val) > 0n, 'Transfer amount must be greater than zero'),
  financialPassword: z.string().min(1, 'Financial password required for step-up verification'),
  memo: z.string().max(200).optional(),
  idempotencyKey: z.string().uuid('Idempotency key required').optional(),
});

export type TransferRequestInput = z.infer<typeof TransferRequestSchema>;

// -----------------------------------------------------------------------------
// 3. Bank & Account Schemas
// -----------------------------------------------------------------------------

export const OpenAccountSchema = z.object({
  bankId: z.string().min(1),
  accountType: z.enum(['SAVINGS', 'CURRENT']),
  purpose: z.string().min(2).max(100),
  financialPassword: z.string().min(1),
});

export type OpenAccountInput = z.infer<typeof OpenAccountSchema>;

export const JoinBankSchema = z.object({
  bankId: z.string().min(1, 'Bank ID is required'),
});

export type JoinBankInput = z.infer<typeof JoinBankSchema>;

export const UpdateCustomerStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'CLOSED']),
});

export type UpdateCustomerStatusInput = z.infer<typeof UpdateCustomerStatusSchema>;

export const UpdateAccountStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'FROZEN', 'DORMANT', 'CLOSED']),
});

export type UpdateAccountStatusInput = z.infer<typeof UpdateAccountStatusSchema>;

export const UpdateAccountLimitsSchema = z.object({
  dailyLimitMinor: z.string().regex(/^\d+$/, 'Limit must be integer minor units').optional(),
  monthlyLimitMinor: z.string().regex(/^\d+$/, 'Limit must be integer minor units').optional(),
});

export type UpdateAccountLimitsInput = z.infer<typeof UpdateAccountLimitsSchema>;

export const AddBeneficiarySchema = z.object({
  accountId: z.string().uuid(),
  beneficiaryName: z.string().min(2).max(100),
  accountNumber: z.string().regex(/^ARTH-[A-Z0-9]+-\d+$/),
  bankId: z.string().min(1),
  nickname: z.string().max(50).optional(),
});

export type AddBeneficiaryInput = z.infer<typeof AddBeneficiarySchema>;

// -----------------------------------------------------------------------------
// 4. Fixed Deposits Schemas
// -----------------------------------------------------------------------------

export const CreateFdSchema = z.object({
  sourceAccountId: z.string().uuid(),
  schemeId: z.string().min(1),
  principalMinor: z
    .string()
    .regex(/^\d+$/)
    .refine((val) => BigInt(val) >= 100000n, 'Minimum FD is 1,000.00 ARTH (100,000 minor units)'),
  financialPassword: z.string().min(1),
});

export type CreateFdInput = z.infer<typeof CreateFdSchema>;

// (Section 4 CreateFdSchema retained for legacy compatibility)

// -----------------------------------------------------------------------------
// 5. Stock Market Schemas
// -----------------------------------------------------------------------------

export const PlaceStockOrderSchema = z
  .object({
    symbol: z.string().min(2).max(10).toUpperCase(),
    side: z.enum(['BUY', 'SELL']),
    type: z.enum(['LIMIT', 'MARKET']).default('LIMIT'),
    quantity: z.number().int().positive('Order quantity must be at least 1 share'),
    priceMinor: z.string().regex(/^\d+$/).optional(),
    sourceAccountId: z.string().min(1),
    financialPassword: z.string().min(1),
  })
  .refine(
    (data) => {
      if (data.type === 'LIMIT') {
        return data.priceMinor && BigInt(data.priceMinor) > 0n;
      }
      return true;
    },
    {
      message: 'Limit orders must specify a positive limit price (priceMinor)',
      path: ['priceMinor'],
    },
  );

export type PlaceStockOrderInput = z.infer<typeof PlaceStockOrderSchema>;

export const CancelStockOrderSchema = z.object({
  orderId: z.string().min(1),
});

export type CancelStockOrderInput = z.infer<typeof CancelStockOrderSchema>;

export const SimulateMarketTickSchema = z.object({
  symbol: z.string().min(2).max(10).toUpperCase().optional(),
  orderBookPressure: z.number().min(-1.0).max(1.0).default(0),
  marketSentiment: z.number().min(-1.0).max(1.0).default(0),
});

export type SimulateMarketTickInput = z.infer<typeof SimulateMarketTickSchema>;

// -----------------------------------------------------------------------------
// 6. Shop & Customization Schemas
// -----------------------------------------------------------------------------

export const ShopPurchaseSchema = z.object({
  itemId: z.string().min(1),
  sourceAccountId: z.string().min(1, 'Source account ID is required'),
  financialPassword: z.string().min(1, 'Financial password is required'),
});

export type ShopPurchaseInput = z.infer<typeof ShopPurchaseSchema>;

export const ShopGiftSchema = z.object({
  itemId: z.string().min(1),
  recipientGovIdOrEmail: z.string().min(3, 'Recipient GovId or Email is required'),
  sourceAccountId: z.string().min(1, 'Source account ID is required'),
  financialPassword: z.string().min(1, 'Financial password is required'),
});

export type ShopGiftInput = z.infer<typeof ShopGiftSchema>;

export const EquipLoadoutSchema = z.object({
  frameId: z.string().optional(),
  avatarId: z.string().optional(),
  bannerId: z.string().optional(),
  petId: z.string().optional(),
});

export type EquipLoadoutInput = z.infer<typeof EquipLoadoutSchema>;

// -----------------------------------------------------------------------------
// 7. Central Bank Governance Schemas
// -----------------------------------------------------------------------------

export const UpdateFinancialRuleSchema = z.object({
  key: z.string().min(1),
  newValue: z.number(),
  reason: z.string().min(10, 'Statutory reason must be at least 10 characters'),
  effectiveDate: z.string().datetime().optional(),
  financialPassword: z.string().min(1),
});

export type UpdateFinancialRuleInput = z.infer<typeof UpdateFinancialRuleSchema>;

export const CreateFinancialRuleSchema = z.object({
  key: z.string().min(3).regex(/^[A-Z0-9_-]+$/, 'Rule key must be uppercase identifier (e.g. POL-BASE-RATE)'),
  title: z.string().min(5).max(150),
  currentValue: z.number(),
  unit: z.string().min(1).max(30),
  category: z.enum(['Monetary Policy', 'Prudential Requirements', 'Transaction Limits', 'System Controls']),
  description: z.string().min(10).max(500),
  statutoryBasis: z.string().min(5).max(150),
  effectiveDate: z.string().datetime().optional(),
  financialPassword: z.string().min(1, 'Financial password required to create sovereign policy rule'),
});

export type CreateFinancialRuleInput = z.infer<typeof CreateFinancialRuleSchema>;

export const CircuitBreakerToggleSchema = z.object({
  symbol: z.string().min(2).max(10).toUpperCase(),
  halt: z.boolean(),
  reason: z.string().min(5),
  financialPassword: z.string().min(1),
});

export type CircuitBreakerToggleInput = z.infer<typeof CircuitBreakerToggleSchema>;

export const ProposeSovereignIssuanceSchema = z.object({
  operation: z.enum(['MINT', 'BURN']),
  amountMinor: z.string().regex(/^\d+$/, 'Amount must be positive integer minor units'),
  reason: z.string().min(10, 'Statutory justification must be at least 10 characters'),
  ruleVersion: z.string().default('v1.0.0'),
  financialPassword: z.string().min(1, 'Financial password required for sovereign proposal'),
});

export type ProposeSovereignIssuanceInput = z.infer<typeof ProposeSovereignIssuanceSchema>;

export const ApproveSovereignIssuanceSchema = z.object({
  issuanceId: z.string().min(1, 'Issuance ID is required'),
  financialPassword: z.string().min(1, 'Financial password required for checker authorization'),
});

export type ApproveSovereignIssuanceInput = z.infer<typeof ApproveSovereignIssuanceSchema>;

export const RequestElaFacilitySchema = z.object({
  bankId: z.string().min(1, 'Commercial bank ID is required'),
  amountMinor: z.string().regex(/^\d+$/, 'ELA amount must be positive integer minor units'),
  collateralAssetId: z.string().min(1, 'Verified collateral asset reference ID is required'),
  collateralAppraisedMinor: z.string().regex(/^\d+$/, 'Appraised collateral value is required'),
  tenureDays: z.number().int().min(7).max(180).default(30),
  financialPassword: z.string().min(1, 'Financial password required for ELA authorization'),
});

export type RequestElaFacilityInput = z.infer<typeof RequestElaFacilitySchema>;

export const RepayElaFacilitySchema = z.object({
  facilityId: z.string().min(1, 'ELA Facility ID is required'),
  amountMinor: z.string().regex(/^\d+$/, 'Repayment amount must be positive integer minor units'),
  sourceAccountId: z.string().min(1, 'Source repayment account ID is required'),
  financialPassword: z.string().min(1, 'Financial password required for ELA repayment'),
});

export type RepayElaFacilityInput = z.infer<typeof RepayElaFacilitySchema>;

export const CreateEmergencyActionSchema = z.object({
  actionType: z.enum(['MARKET_HALT', 'BANK_MORATORIUM', 'ACCOUNT_FREEZE', 'LIQUIDITY_INJECTION']),
  target: z.string().min(1, 'Target identifier required (e.g. MARKET:ALL, BANK:vayu, ACCOUNT:ARTH-NAVA-001)'),
  reason: z.string().min(10, 'Statutory justification must be at least 10 characters'),
  durationMinutes: z.number().int().min(1).max(10080).default(60), // Default 1 hour, max 7 days
  financialPassword: z.string().min(1, 'Financial password required for emergency action'),
});

export type CreateEmergencyActionInput = z.infer<typeof CreateEmergencyActionSchema>;

export const RevokeEmergencyActionSchema = z.object({
  actionId: z.string().min(1, 'Action ID is required'),
  reason: z.string().min(5, 'Revocation justification required'),
  financialPassword: z.string().min(1, 'Financial password required for emergency revocation'),
});

export type RevokeEmergencyActionInput = z.infer<typeof RevokeEmergencyActionSchema>;

// -----------------------------------------------------------------------------
// 8. Central Settlement Layer (CLS) Schemas
// -----------------------------------------------------------------------------

export const ExecuteBatchSettlementSchema = z.object({
  targetBankId: z.string().optional(),
  maxBatchSize: z.number().int().positive().max(500).default(100),
  executionMode: z.enum(['ALL_PENDING', 'SPECIFIC_BANK']).default('ALL_PENDING'),
});

export type ExecuteBatchSettlementInput = z.infer<typeof ExecuteBatchSettlementSchema>;

export const EmergencySettlementActionSchema = z.object({
  action: z.enum(['CANCEL', 'REFUND', 'COMPENSATE']),
  reason: z.string().min(5, 'A valid regulatory/operational reason must be provided'),
  operatorPasscode: z.string().min(1, 'Central Bank operator authorization required'),
});

export type EmergencySettlementActionInput = z.infer<typeof EmergencySettlementActionSchema>;

// -----------------------------------------------------------------------------
// 9. Mailbox & Notification Schemas
// -----------------------------------------------------------------------------

export const MailboxQuerySchema = z.object({
  category: z
    .enum([
      'ALL',
      'TRANSFER',
      'SETTLEMENT',
      'STOCK',
      'SHOP',
      'FD',
      'LOAN',
      'REWARD',
      'SYSTEM',
      'SECURITY',
      'POLICY',
    ])
    .default('ALL'),
  status: z.enum(['ALL', 'UNREAD', 'READ', 'ARCHIVED']).default('ALL'),
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type MailboxQueryInput = z.infer<typeof MailboxQuerySchema>;

export const DispatchNotificationSchema = z.object({
  userId: z.string().uuid(),
  category: z.enum([
    'TRANSFER',
    'SETTLEMENT',
    'STOCK',
    'SHOP',
    'FD',
    'LOAN',
    'REWARD',
    'SYSTEM',
    'SECURITY',
    'POLICY',
  ]),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  content: z.string().min(1),
  templateCode: z.string().min(1).max(100),
  templateVersion: z.number().int().positive().default(1),
  sourceDomain: z.enum(['BANKING', 'CLS', 'STOCKS', 'SHOP', 'CENTRAL_BANK', 'SECURITY']),
  sourceType: z.string().min(1).max(50),
  sourceId: z.string().min(1).max(100),
  eventId: z.string().min(1).max(100),
  metadata: z.record(z.unknown()).optional(),
});

export type DispatchNotificationPayload = z.infer<typeof DispatchNotificationSchema>;

// -----------------------------------------------------------------------------
// 10. Fixed Deposits & Yield Engine Schemas (Phase 10)
// -----------------------------------------------------------------------------

export const FdSimulationSchema = z.object({
  bankId: z.string().min(1),
  schemeId: z.string().min(1),
  principalMinor: z.string().regex(/^\d+$/, 'Principal must be a positive integer minor units string'),
  tenureDays: z.number().int().positive().optional(),
  seniorCitizen: z.boolean().default(false),
});

export type FdSimulationSchemaInput = z.infer<typeof FdSimulationSchema>;

export const BookFdSchema = z.object({
  accountId: z.string().min(1, 'Source account ID is required'),
  schemeId: z.string().min(1, 'Scheme ID is required'),
  principalMinor: z.string().regex(/^\d+$/, 'Principal must be a positive integer minor units string'),
  autoRenew: z.boolean().default(false),
  rolloverInstruction: z.enum(['NONE', 'PRINCIPAL_ONLY', 'PRINCIPAL_AND_INTEREST']).default('NONE'),
  financialPassword: z.string().min(1, 'Financial password is required for term deposit booking'),
  seniorCitizen: z.boolean().default(false),
});

export type BookFdSchemaInput = z.infer<typeof BookFdSchema>;

export const BreakFdSchema = z.object({
  targetAccountId: z.string().min(1, 'Target account ID is required for liquidated funds disbursement'),
  financialPassword: z.string().min(1, 'Financial password is required for early liquidation'),
});

export type BreakFdSchemaInput = z.infer<typeof BreakFdSchema>;

export const ToggleFdAutoRenewSchema = z.object({
  autoRenew: z.boolean(),
  rolloverInstruction: z.enum(['NONE', 'PRINCIPAL_ONLY', 'PRINCIPAL_AND_INTEREST']).default('NONE'),
});

export type ToggleFdAutoRenewSchemaInput = z.infer<typeof ToggleFdAutoRenewSchema>;

// -----------------------------------------------------------------------------
// 11. Commercial Lending & Credit Facilities Schemas (Phase 12A)
// -----------------------------------------------------------------------------

export const LoanSimulationSchema = z.object({
  bankId: z.string().min(1, 'Bank ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  principalMinor: z.string().regex(/^\d+$/, 'Principal must be a positive integer minor units string'),
  tenureMonths: z.number().int().min(1).max(360),
});

export type LoanSimulationInput = z.infer<typeof LoanSimulationSchema>;

export const ApplyLoanSchema = z.object({
  bankId: z.string().min(1, 'Bank ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  requestedPrincipalMinor: z.string().regex(/^\d+$/, 'Principal must be positive integer minor units'),
  tenureMonths: z.number().int().min(1).max(360),
  purpose: z.string().min(3).max(255),
  disbursementAccountId: z.string().min(1, 'Disbursement account ID is required'),
  repaymentAccountId: z.string().min(1, 'Repayment account ID is required'),
  collateralType: z.enum(['FIXED_DEPOSIT', 'STOCK_HOLDINGS', 'SOVEREIGN_GUARANTEE']).optional(),
  collateralAssetId: z.string().optional(),
});

export type ApplyLoanInput = z.infer<typeof ApplyLoanSchema>;

export const ReviewLoanSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'REQUEST_CHANGES']),
  approvedPrincipalMinor: z.string().regex(/^\d+$/).optional(),
  approvedInterestRate: z.number().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
  rejectionReason: z.string().max(500).optional(),
});

export type ReviewLoanInput = z.infer<typeof ReviewLoanSchema>;

export const DisburseLoanSchema = z.object({
  financialPassword: z.string().min(1, 'Financial password required for disbursement acceptance'),
  disbursementAccountId: z.string().min(1, 'Target account required for credit disbursement'),
});

export type DisburseLoanInput = z.infer<typeof DisburseLoanSchema>;

export const PayLoanEmiSchema = z.object({
  installmentNumber: z.number().int().positive(),
  amountMinor: z.string().regex(/^\d+$/, 'Repayment amount must be positive integer minor units'),
  sourceAccountId: z.string().min(1, 'Source repayment account ID required'),
  financialPassword: z.string().min(1, 'Financial password required for step-up verification'),
});

export type PayLoanEmiInput = z.infer<typeof PayLoanEmiSchema>;

export const ForecloseLoanSchema = z.object({
  sourceAccountId: z.string().min(1, 'Source account required for loan payoff'),
  financialPassword: z.string().min(1, 'Financial password required for early foreclosure'),
});

export type ForecloseLoanInput = z.infer<typeof ForecloseLoanSchema>;

