// ============================================================================
// ARTHAX Central Bank Portal — Authoritative Central Data & TypeScript Schema
// ============================================================================
// Level 3: Sovereign Monetary Authority & Regulatory Command Center
// Invariant: 1 ARTH = 1.0000 Sovereign Unit (Double-entry Core Ledger)
// Palette Identity: Deep Slate Teal (#946726 / #2A2012), Ivory Canvas (#F6F8F7), Arth Gold (#A8742A)
// All financial/tax values are explicitly marked as PROVISIONAL DEMO BENCHMARKS.
// ============================================================================

export const DEMO_POLICY_NOTICE =
  'PROVISIONAL DEMO BENCHMARK — Under Sovereign Board Review (Non-Final System Constant)';

// ─── 1. System Macro Overview Telemetry ──────────────────────────────────────

export interface CentralBankMacroStats {
  totalCirculation: number; // in ARTH
  totalCirculationNote: string;
  activeBanksCount: number;
  totalRegisteredAccounts: number;
  totalCommercialDeposits: number;
  dailyTransactionVolume: number;
  interbankSettlementVolume: number;
  clsHealthStatus: 'Optimal' | 'Degraded' | 'Halted';
  marketStatus: 'Open' | 'Closed' | 'Halted' | 'Pre-Market';
  totalTaxCollectedYTD: number;
  pendingRegulatoryApprovals: number;
  activeSystemAlerts: number;
  coreLedgerSyncRate: number; // 99.999%
  lastAuditBlockHeight: number;
  currentEpoch: number;
  emergencyBreakerActive: boolean;
}

export const MOCK_CENTRAL_BANK_STATS: CentralBankMacroStats = {
  totalCirculation: 150_000_000,
  totalCirculationNote: 'Provisional Demo Supply Cap',
  activeBanksCount: 5,
  totalRegisteredAccounts: 12_346,
  totalCommercialDeposits: 73_420_000,
  dailyTransactionVolume: 14_892_100,
  interbankSettlementVolume: 8_410_250,
  clsHealthStatus: 'Optimal',
  marketStatus: 'Open',
  totalTaxCollectedYTD: 4_821_950,
  pendingRegulatoryApprovals: 7,
  activeSystemAlerts: 3,
  coreLedgerSyncRate: 99.999,
  lastAuditBlockHeight: 1_842_904,
  currentEpoch: 4821,
  emergencyBreakerActive: false,
};

// ─── 2. Commercial Bank Registry & Monitoring ────────────────────────────────

export type BankRegulatoryStatus = 'Active' | 'Pending' | 'Suspended' | 'Closed';

export interface CommercialBankRecord {
  id: string; // 'nava' | 'samaya' | 'setu' | 'sthira' | 'vayu'
  name: string;
  shortName: string;
  licenseNumber: string;
  logo: string;
  status: BankRegulatoryStatus;
  establishedDate: string;
  customerCount: number;
  accountCount: number;
  totalDeposits: number;
  totalAssets: number;
  dailyTxVolume: number;
  // Regulatory & Prudential Ratios (Provisional demo benchmarks)
  crrRatio: number; // Cash Reserve Ratio % (e.g. 12.0%)
  slrRatio: number; // Statutory Liquidity Ratio % (e.g. 18.2%)
  carRatio: number; // Capital Adequacy Ratio % (e.g. 15.4%)
  reserveCompliance: 'Compliant' | 'Watchlist' | 'Deficient';
  liquidityBuffer: number; // In ARTH
  failedTxRate24h: number; // %
  slaUptime30d: number; // %
  ownership: string;
  governingDirector: string;
  licensedProducts: string[];
  lastExamDate: string;
  recentAuditFlag?: string;
}

export const MOCK_COMMERCIAL_BANKS: CommercialBankRecord[] = [
  {
    id: 'nava',
    name: 'NAVA Sovereign Bank',
    shortName: 'NAVA',
    licenseNumber: 'CB-LIC-2024-001',
    logo: '/assets/banks/nava_bank.png',
    status: 'Active',
    establishedDate: '2024-01-15',
    customerCount: 1_842,
    accountCount: 3_156,
    totalDeposits: 18_420_000,
    totalAssets: 24_850_000,
    dailyTxVolume: 3_820_000,
    crrRatio: 12.4,
    slrRatio: 19.1,
    carRatio: 15.8,
    reserveCompliance: 'Compliant',
    liquidityBuffer: 3_500_000,
    failedTxRate24h: 0.04,
    slaUptime30d: 99.98,
    ownership: 'Sovereign Institutional Consortium (60%), Citizen Trust (40%)',
    governingDirector: 'Elena Rostova, CFA',
    licensedProducts: ['Demand Accounts', 'Tier-1 FDs', 'Commercial Loans', 'Trade Credit'],
    lastExamDate: '2026-08-12',
  },
  {
    id: 'samaya',
    name: 'SAMAYA Stewardship Bank',
    shortName: 'SAMAYA',
    licenseNumber: 'CB-LIC-2024-002',
    logo: '/assets/banks/samaya_bank.png',
    status: 'Active',
    establishedDate: '2024-03-22',
    customerCount: 1_310,
    accountCount: 2_480,
    totalDeposits: 14_100_000,
    totalAssets: 19_200_000,
    dailyTxVolume: 2_450_000,
    crrRatio: 12.1,
    slrRatio: 18.5,
    carRatio: 14.9,
    reserveCompliance: 'Compliant',
    liquidityBuffer: 2_600_000,
    failedTxRate24h: 0.06,
    slaUptime30d: 99.94,
    ownership: 'Samaya Heritage Trust & Municipal Endowment',
    governingDirector: 'Julian Vance, Ph.D.',
    licensedProducts: ['Generational FDs', 'Savings Accounts', 'Mortgage Facilities'],
    lastExamDate: '2026-07-28',
  },
  {
    id: 'setu',
    name: 'SETU Commerce Bank',
    shortName: 'SETU',
    licenseNumber: 'CB-LIC-2024-003',
    logo: '/assets/banks/setu_bank.png',
    status: 'Active',
    establishedDate: '2024-02-10',
    customerCount: 1_620,
    accountCount: 2_910,
    totalDeposits: 16_800_000,
    totalAssets: 21_600_000,
    dailyTxVolume: 3_120_000,
    crrRatio: 12.8,
    slrRatio: 18.8,
    carRatio: 16.2,
    reserveCompliance: 'Compliant',
    liquidityBuffer: 3_100_000,
    failedTxRate24h: 0.03,
    slaUptime30d: 99.99,
    ownership: 'Inter-Sovereign Commerce Guild (Public-Private)',
    governingDirector: 'Aria Chen, FRM',
    licensedProducts: ['Corporate Clearing', 'Treasury Operations', 'Merchant Accounts'],
    lastExamDate: '2026-08-30',
  },
  {
    id: 'sthira',
    name: 'STHIRA Reserve Bank',
    shortName: 'STHIRA',
    licenseNumber: 'CB-LIC-2024-004',
    logo: '/assets/banks/sthira_bank.png',
    status: 'Active',
    establishedDate: '2024-04-05',
    customerCount: 980,
    accountCount: 1_740,
    totalDeposits: 11_200_000,
    totalAssets: 15_400_000,
    dailyTxVolume: 1_680_000,
    crrRatio: 11.9, // borderline
    slrRatio: 17.9,
    carRatio: 14.1,
    reserveCompliance: 'Watchlist',
    liquidityBuffer: 1_850_000,
    failedTxRate24h: 0.12,
    slaUptime30d: 99.82,
    ownership: 'Sthira Capital Foundation',
    governingDirector: 'Marcus Sterling',
    licensedProducts: ['High-Yield Fixed Term', 'Institutional Escrow', 'Public Works Bonds'],
    lastExamDate: '2026-09-01',
    recentAuditFlag: 'Liquidity buffer ratio touched 11.9% during peak settlement cycle (provisional min 12.0%). Remediated within 4 hours.',
  },
  {
    id: 'vayu',
    name: 'VAYU Settlement Bank',
    shortName: 'VAYU',
    licenseNumber: 'CB-LIC-2024-005',
    logo: '/assets/banks/vayu_bank.png',
    status: 'Active',
    establishedDate: '2024-05-18',
    customerCount: 1_150,
    accountCount: 2_060,
    totalDeposits: 12_900_000,
    totalAssets: 17_100_000,
    dailyTxVolume: 3_822_100,
    crrRatio: 13.2,
    slrRatio: 20.4,
    carRatio: 17.0,
    reserveCompliance: 'Compliant',
    liquidityBuffer: 2_950_000,
    failedTxRate24h: 0.02,
    slaUptime30d: 99.99,
    ownership: 'Vayu Algorithmic Clearing Network',
    governingDirector: 'Dr. Tariq Al-Mansoor',
    licensedProducts: ['High-Frequency Clearing', 'Micro-Settlements', 'FX Gateway'],
    lastExamDate: '2026-08-19',
  },
];

// ─── 3. CLS / Central Settlement Layer Telemetry ─────────────────────────────

export type ClsLifecycleStage =
  | 'VALIDATING'
  | 'AUTHORIZED'
  | 'PROCESSING'
  | 'SETTLING'
  | 'FINALYZING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED';

export interface InterbankSettlementItem {
  id: string; // e.g. 'CLS-2026-98101'
  ledgerBatchRef: string; // 'BATCH-8491-9102'
  sourceBank: string; // 'nava' | 'samaya' | 'setu' | 'sthira' | 'vayu'
  destinationBank: string;
  amount: number;
  stage: ClsLifecycleStage;
  timestamp: string;
  clearingLatencyMs: number;
  feeLevy: number; // Central tax levy
  failureReason?: string;
  reversalTxId?: string;
  timeline: {
    stage: ClsLifecycleStage;
    time: string;
    note: string;
  }[];
}

export const MOCK_CLS_QUEUE: InterbankSettlementItem[] = [
  {
    id: 'CLS-2026-98101',
    ledgerBatchRef: 'BATCH-8491-9102',
    sourceBank: 'nava',
    destinationBank: 'vayu',
    amount: 450_000,
    stage: 'SETTLING',
    timestamp: '2026-09-08 17:28:12',
    clearingLatencyMs: 24,
    feeLevy: 225,
    timeline: [
      { stage: 'VALIDATING', time: '17:28:12.102', note: 'Signatures verified across both nodes' },
      { stage: 'AUTHORIZED', time: '17:28:12.115', note: 'Central Bank reserve balance lock acquired' },
      { stage: 'PROCESSING', time: '17:28:12.122', note: 'Debit leg posted to NAVA central reserve' },
      { stage: 'SETTLING', time: '17:28:12.126', note: 'Credit leg posting to VAYU central reserve' },
    ],
  },
  {
    id: 'CLS-2026-98102',
    ledgerBatchRef: 'BATCH-8491-9103',
    sourceBank: 'setu',
    destinationBank: 'samaya',
    amount: 1_200_000,
    stage: 'FINALYZING',
    timestamp: '2026-09-08 17:27:54',
    clearingLatencyMs: 31,
    feeLevy: 600,
    timeline: [
      { stage: 'VALIDATING', time: '17:27:54.020', note: 'Dual-entry invariant pre-check passed' },
      { stage: 'AUTHORIZED', time: '17:27:54.032', note: 'Reserve requirement headroom confirmed' },
      { stage: 'PROCESSING', time: '17:27:54.041', note: 'Atomic two-phase commit initialized' },
      { stage: 'SETTLING', time: '17:27:54.048', note: 'Ledger journal entries synchronized' },
      { stage: 'FINALYZING', time: '17:27:54.051', note: 'Awaiting cryptographic signature receipt' },
    ],
  },
  {
    id: 'CLS-2026-98103',
    ledgerBatchRef: 'BATCH-8491-9104',
    sourceBank: 'vayu',
    destinationBank: 'sthira',
    amount: 280_000,
    stage: 'COMPLETED',
    timestamp: '2026-09-08 17:26:10',
    clearingLatencyMs: 18,
    feeLevy: 140,
    timeline: [
      { stage: 'VALIDATING', time: '17:26:10.012', note: 'Verified by central validator node' },
      { stage: 'AUTHORIZED', time: '17:26:10.019', note: 'Authorized by Governor consensus pool' },
      { stage: 'PROCESSING', time: '17:26:10.024', note: 'Debited from VAYU buffer' },
      { stage: 'SETTLING', time: '17:26:10.027', note: 'Credited to STHIRA buffer' },
      { stage: 'FINALYZING', time: '17:26:10.029', note: 'Dual double-entry hash reconciled' },
      { stage: 'COMPLETED', time: '17:26:10.030', note: 'Final settlement immutable receipt recorded' },
    ],
  },
  {
    id: 'CLS-2026-98104',
    ledgerBatchRef: 'BATCH-8491-9105',
    sourceBank: 'sthira',
    destinationBank: 'nava',
    amount: 850_000,
    stage: 'FAILED',
    timestamp: '2026-09-08 17:22:45',
    clearingLatencyMs: 110,
    feeLevy: 0,
    failureReason: 'STHIRA intra-hour settlement buffer constraint triggered (threshold benchmark 12.0% CRR)',
    reversalTxId: 'REV-98104-AUTO',
    timeline: [
      { stage: 'VALIDATING', time: '17:22:45.010', note: 'Validation commenced' },
      { stage: 'FAILED', time: '17:22:45.120', note: 'Rejected: Reserve threshold breach prevented' },
      { stage: 'REVERSED', time: '17:22:45.125', note: 'Funds restored to originating escrow' },
    ],
  },
  {
    id: 'CLS-2026-98105',
    ledgerBatchRef: 'BATCH-8491-9106',
    sourceBank: 'samaya',
    destinationBank: 'setu',
    amount: 620_000,
    stage: 'COMPLETED',
    timestamp: '2026-09-08 17:20:15',
    clearingLatencyMs: 22,
    feeLevy: 310,
    timeline: [
      { stage: 'VALIDATING', time: '17:20:15.011', note: 'Checked' },
      { stage: 'COMPLETED', time: '17:20:15.033', note: 'Fully cleared' },
    ],
  },
  {
    id: 'CLS-2026-98106',
    ledgerBatchRef: 'BATCH-8491-9107',
    sourceBank: 'nava',
    destinationBank: 'setu',
    amount: 3_100_000,
    stage: 'COMPLETED',
    timestamp: '2026-09-08 17:15:02',
    clearingLatencyMs: 28,
    feeLevy: 1_550,
    timeline: [
      { stage: 'VALIDATING', time: '17:15:02.010', note: 'High value clearance tier-1 pass' },
      { stage: 'COMPLETED', time: '17:15:02.038', note: 'Gross settlement confirmed' },
    ],
  },
];

// Bank-to-Bank Daily Flow Matrix (In Thousands ARTH)
export const MOCK_INTERBANK_FLOW_MATRIX: Record<string, Record<string, number>> = {
  nava: { nava: 0, samaya: 840, setu: 1420, sthira: 520, vayu: 1040 },
  samaya: { nava: 610, samaya: 0, setu: 950, sthira: 410, vayu: 480 },
  setu: { nava: 1180, samaya: 790, setu: 0, sthira: 350, vayu: 800 },
  sthira: { nava: 480, samaya: 390, setu: 410, sthira: 0, vayu: 400 },
  vayu: { nava: 1250, samaya: 620, setu: 980, sthira: 470, vayu: 0 },
};

// ─── 4. Versioned Financial Rules & Monetary Policy Engine ──────────────────

export type PolicyStatus = 'Current' | 'Scheduled' | 'Previous' | 'Draft';

export interface FinancialRuleRecord {
  id: string;
  code: string; // e.g. 'POL-CRR-01'
  title: string;
  category: 'Monetary Policy' | 'Reserve Requirement' | 'Transaction Limit' | 'Prudential Rule';
  version: string; // 'v2.4.0'
  status: PolicyStatus;
  effectiveDate: string;
  expiryDate?: string;
  changedBy: string; // 'Governor Council Resolution #412'
  changeRationale: string;
  valueDescription: string;
  valueNumeric?: number;
  unit: string;
  isDemoBenchmark: boolean;
  historyCount: number;
}

export const MOCK_FINANCIAL_RULES: FinancialRuleRecord[] = [
  {
    id: 'FR-001',
    code: 'POL-BASE-RATE',
    title: 'Central Bank Sovereign Policy Base Rate',
    category: 'Monetary Policy',
    version: 'v2.4.0',
    status: 'Current',
    effectiveDate: '2026-07-01',
    changedBy: 'Monetary Policy Committee (Minute #26-07)',
    changeRationale: 'Provisional baseline policy rate anchoring commercial lending spreads and FD schemes.',
    valueDescription: '4.25% p.a. [Demo Policy Benchmark]',
    valueNumeric: 4.25,
    unit: '%',
    isDemoBenchmark: true,
    historyCount: 5,
  },
  {
    id: 'FR-001-SCHED',
    code: 'POL-BASE-RATE',
    title: 'Central Bank Sovereign Policy Base Rate',
    category: 'Monetary Policy',
    version: 'v2.5.0-RC1',
    status: 'Scheduled',
    effectiveDate: '2026-10-01',
    changedBy: 'Monetary Policy Committee (Draft Order #26-09)',
    changeRationale: 'Anticipated 25 bps hike in response to surging sovereign commerce velocity.',
    valueDescription: '4.50% p.a. [Scheduled Revision Benchmark]',
    valueNumeric: 4.50,
    unit: '%',
    isDemoBenchmark: true,
    historyCount: 5,
  },
  {
    id: 'FR-002',
    code: 'POL-CRR-MANDATE',
    title: 'Cash Reserve Ratio (CRR) Requirement',
    category: 'Reserve Requirement',
    version: 'v2.1.0',
    status: 'Current',
    effectiveDate: '2026-01-01',
    changedBy: 'Bank Supervision Directorate',
    changeRationale: 'Standard prudential safety floor for commercial depository institutions.',
    valueDescription: '12.00% of Total Commercial Deposit Liabilities [Provisional Benchmark]',
    valueNumeric: 12.0,
    unit: '%',
    isDemoBenchmark: true,
    historyCount: 3,
  },
  {
    id: 'FR-003',
    code: 'POL-SLR-MANDATE',
    title: 'Statutory Liquidity Ratio (SLR) Requirement',
    category: 'Reserve Requirement',
    version: 'v2.0.0',
    status: 'Current',
    effectiveDate: '2025-11-15',
    changedBy: 'Sovereign Treasury Board',
    changeRationale: 'Mandates liquid government debt/cash reserves to buffer cross-bank settlement bursts.',
    valueDescription: '18.00% of Net Demand & Time Liabilities [Provisional Benchmark]',
    valueNumeric: 18.0,
    unit: '%',
    isDemoBenchmark: true,
    historyCount: 2,
  },
  {
    id: 'FR-004',
    code: 'POL-TX-LIMIT-SINGLE',
    title: 'Maximum Single Inter-Bank Wire Limit',
    category: 'Transaction Limit',
    version: 'v3.0.0',
    status: 'Current',
    effectiveDate: '2026-03-15',
    changedBy: 'CLS Risk Council',
    changeRationale: 'Automated circuit cap above which multi-sig Central Bank approval is required.',
    valueDescription: '5,000,000 ARTH per single transfer [Provisional Benchmark]',
    valueNumeric: 5_000_000,
    unit: 'ARTH',
    isDemoBenchmark: true,
    historyCount: 4,
  },
  {
    id: 'FR-005',
    code: 'POL-RETAIL-DAILY-CAP',
    title: 'Retail Citizen Daily Aggregate Transfer Cap',
    category: 'Transaction Limit',
    version: 'v2.2.0',
    status: 'Current',
    effectiveDate: '2026-04-01',
    changedBy: 'Fraud & Anti-Money Laundering Bureau',
    changeRationale: 'Restricts unverified velocity; accounts with elevated biometric clearance exempt.',
    valueDescription: '250,000 ARTH / 24-hour cycle [Provisional Benchmark]',
    valueNumeric: 250_000,
    unit: 'ARTH',
    isDemoBenchmark: true,
    historyCount: 3,
  },
  {
    id: 'FR-006',
    code: 'POL-CAR-BASE',
    title: 'Commercial Bank Capital Adequacy Ratio (CAR)',
    category: 'Prudential Rule',
    version: 'v1.9.4',
    status: 'Current',
    effectiveDate: '2025-09-01',
    changedBy: 'Prudential Regulation Authority',
    changeRationale: 'Minimum regulatory capital against risk-weighted assets.',
    valueDescription: '14.00% Tier-1 Capital Benchmark [Provisional Benchmark]',
    valueNumeric: 14.0,
    unit: '%',
    isDemoBenchmark: true,
    historyCount: 2,
  },
  {
    id: 'FR-007-DRAFT',
    code: 'POL-INST-LTV-CAP',
    title: 'Institutional Commercial Loan-to-Value (LTV) Cap',
    category: 'Prudential Rule',
    version: 'v1.0.0-DRAFT',
    status: 'Draft',
    effectiveDate: 'Unassigned (Target 2027-01-01)',
    changedBy: 'Macroprudential Taskforce',
    changeRationale: 'Proposes ceiling on secured commercial real estate lending to temper asset inflation.',
    valueDescription: '70.00% of Appraised Asset Valuation [Draft Policy Value]',
    valueNumeric: 70.0,
    unit: '%',
    isDemoBenchmark: true,
    historyCount: 1,
  },
  {
    id: 'FR-008-PREV',
    code: 'POL-BASE-RATE',
    title: 'Central Bank Sovereign Policy Base Rate (Previous Cycle)',
    category: 'Monetary Policy',
    version: 'v2.3.8',
    status: 'Previous',
    effectiveDate: '2025-12-01',
    expiryDate: '2026-06-30',
    changedBy: 'Monetary Policy Committee (Minute #25-12)',
    changeRationale: 'Historical baseline during Phase 2 ecosystem expansion.',
    valueDescription: '4.00% p.a. [Superseded Benchmark]',
    valueNumeric: 4.00,
    unit: '%',
    isDemoBenchmark: true,
    historyCount: 5,
  },
];

// ─── 5. Versioned Tax & Investment Rules ─────────────────────────────────────

export interface TaxRuleRecord {
  id: string;
  code: string; // 'TAX-TX-LEVY'
  title: string;
  category: 'Settlement Tax' | 'Capital Gains' | 'Holding Horizon' | 'Withholding' | 'Investment Limit';
  version: string;
  status: PolicyStatus;
  effectiveDate: string;
  expiryDate?: string;
  changedBy: string;
  changeRationale: string;
  rateDescription: string;
  thresholdOrRate: string;
  isDemoBenchmark: boolean;
  notes: string;
}

export const MOCK_TAX_RULES: TaxRuleRecord[] = [
  {
    id: 'TR-001',
    code: 'TAX-CLS-LEVY',
    title: 'Standard CLS Inter-Bank Settlement Levy',
    category: 'Settlement Tax',
    version: 'v2.0.0',
    status: 'Current',
    effectiveDate: '2026-01-01',
    changedBy: 'Sovereign Revenue Directorate',
    changeRationale: 'Minimal friction tax funding Central Settlement infrastructure and ledger audit nodes.',
    rateDescription: '0.05% on settled inter-bank principal [Provisional Demo Benchmark]',
    thresholdOrRate: '0.05%',
    isDemoBenchmark: true,
    notes: 'Exempts internal same-bank customer transfers and Central Treasury operations.',
  },
  {
    id: 'TR-002',
    code: 'TAX-STOCK-PROFIT',
    title: 'Realized Equities Capital Gains Tax (Profit-Only)',
    category: 'Capital Gains',
    version: 'v3.1.0',
    status: 'Current',
    effectiveDate: '2026-02-15',
    changedBy: 'Sovereign Revenue Act #48',
    changeRationale: 'Strict profit-only realization rule: levied exclusively on net positive trade gains.',
    rateDescription: '15.00% on net realized trade profit [Provisional Demo Benchmark]',
    thresholdOrRate: '15.00%',
    isDemoBenchmark: true,
    notes: 'Zero tax on loss transactions; capital losses carried forward for up to 4 calendar quarters.',
  },
  {
    id: 'TR-003',
    code: 'TAX-HOLDING-HORIZON',
    title: 'Short-Term vs Long-Term Holding Threshold',
    category: 'Holding Horizon',
    version: 'v2.0.0',
    status: 'Current',
    effectiveDate: '2026-01-01',
    changedBy: 'Sovereign Securities Commission',
    changeRationale: 'Incentivizes long-term patient capital in sovereign infrastructure enterprises.',
    rateDescription: '365 Days threshold (Long-term gains discounted to 5.00%) [Provisional]',
    thresholdOrRate: '365 Days',
    isDemoBenchmark: true,
    notes: 'Holding period tracked immutably by Core Ledger share certificate lots.',
  },
  {
    id: 'TR-004',
    code: 'TAX-DIVIDEND-WITHHOLD',
    title: 'Corporate Dividend Withholding Tax',
    category: 'Withholding',
    version: 'v1.4.0',
    status: 'Current',
    effectiveDate: '2025-10-01',
    changedBy: 'Ministry of Finance Order',
    changeRationale: 'Withheld at distribution source prior to deposit into citizen accounts.',
    rateDescription: '10.00% withheld at corporate disbursement [Provisional Demo Benchmark]',
    thresholdOrRate: '10.00%',
    isDemoBenchmark: true,
    notes: 'Applies to all listed equities paying quarterly or annual cash dividends in ARTH.',
  },
  {
    id: 'TR-005',
    code: 'RULE-MKT-CIRCUIT-1',
    title: 'Market-Wide Circuit Breaker Level-1 (Warning)',
    category: 'Investment Limit',
    version: 'v2.2.0',
    status: 'Current',
    effectiveDate: '2026-03-01',
    changedBy: 'Exchange Oversight Council',
    changeRationale: 'Mandates 15-minute trading cooldown if composite index shifts by >= 5.0%.',
    rateDescription: '±5.00% intraday swing in Sovereign Equities Index [Provisional]',
    thresholdOrRate: '±5.00%',
    isDemoBenchmark: true,
    notes: 'Level-2 at ±10.0% (30-min halt); Level-3 at ±15.0% (full day suspension).',
  },
  {
    id: 'TR-006-DRAFT',
    code: 'TAX-HIGH-VAL-SURCHARGE',
    title: 'High-Value Transfer Surcharge',
    category: 'Settlement Tax',
    version: 'v1.0.0-DRAFT',
    status: 'Draft',
    effectiveDate: 'Target 2027-01-01',
    changedBy: 'Fiscal Committee',
    changeRationale: 'Proposes 0.10% surcharge on individual wire transactions exceeding 2,000,000 ARTH.',
    rateDescription: '0.10% surcharge above 2M threshold [Draft Policy Concept]',
    thresholdOrRate: '0.10% > 2M ARTH',
    isDemoBenchmark: true,
    notes: 'Currently in public commentary period with commercial bank treasurers.',
  },
  {
    id: 'TR-007-PREV',
    code: 'TAX-STOCK-PROFIT',
    title: 'Realized Equities Capital Gains Tax (Initial Beta Phase)',
    category: 'Capital Gains',
    version: 'v3.0.0',
    status: 'Previous',
    effectiveDate: '2025-06-01',
    expiryDate: '2026-02-14',
    changedBy: 'Interim Sovereign Council',
    changeRationale: 'Pre-statutory flat levy before refined 4-quarter loss offset provisions were enacted.',
    rateDescription: '12.50% flat net realized gain [Superseded]',
    thresholdOrRate: '12.50%',
    isDemoBenchmark: true,
    notes: 'Archived historical rule row for retrospective tax recalculations.',
  },
];

// ─── 6. Sovereign Currency & ARTH Monetary Supply ────────────────────────────

export interface CurrencySupplyBreakdown {
  totalIssuedM0: number; // 150M ARTH (Provisional Demo Benchmark)
  bankStatutoryReserves: number; // ~48.2M ARTH
  bankOperationalLiquidity: number; // ~39.95M ARTH
  citizenLiquidWallets: number; // ~42.6M ARTH
  sovereignTreasuryVault: number; // ~19.25M ARTH
  burnedOrRetiredYTD: number; // 240,000 ARTH
  velocityOfMoneyM1: number; // 3.82x
  lastIssuanceDate: string;
}

export const MOCK_CURRENCY_SUPPLY: CurrencySupplyBreakdown = {
  totalIssuedM0: 150_000_000,
  bankStatutoryReserves: 48_200_000,
  bankOperationalLiquidity: 39_950_000,
  citizenLiquidWallets: 42_600_000,
  sovereignTreasuryVault: 19_250_000,
  burnedOrRetiredYTD: 240_000,
  velocityOfMoneyM1: 3.82,
  lastIssuanceDate: '2026-06-15',
};

export interface MonetaryEventRecord {
  id: string;
  type: 'Issuance (Mint)' | 'Retirement (Burn)' | 'Reserve Allocation' | 'Emergency Liquidity Injection';
  amount: number;
  blockRef: string;
  timestamp: string;
  authorizedBy: string;
  targetAccount: string;
  legalDecree: string;
}

export const MOCK_MONETARY_EVENTS: MonetaryEventRecord[] = [
  {
    id: 'MNT-2026-004',
    type: 'Reserve Allocation',
    amount: 5_000_000,
    blockRef: 'BLK-1840102-ARTH',
    timestamp: '2026-08-01 09:00:00',
    authorizedBy: 'Governor Board Quorum (7 of 7)',
    targetAccount: 'VAULT-SETU-RESERVE-01',
    legalDecree: 'Decree #26-088: Expansion of Commerce Settlement Facilities',
  },
  {
    id: 'MNT-2026-003',
    type: 'Retirement (Burn)',
    amount: 120_000,
    blockRef: 'BLK-1812900-ARTH',
    timestamp: '2026-07-15 14:30:00',
    authorizedBy: 'Chief Comptroller of Currency',
    targetAccount: 'SOVEREIGN-SINK-NULL-00',
    legalDecree: 'Quarterly Deflationary Fee Burn from Realized Transaction Levies',
  },
  {
    id: 'MNT-2026-002',
    type: 'Issuance (Mint)',
    amount: 15_000_000,
    blockRef: 'BLK-1750000-ARTH',
    timestamp: '2026-06-15 10:00:00',
    authorizedBy: 'Supreme Monetary Council',
    targetAccount: 'CENTRAL-TREASURY-ALLOC-A',
    legalDecree: 'Fiscal Year 2026 Tranche B Monetary Backing Resolution',
  },
];

// ─── 7. Stock Market Oversight & Equities Surveillance ───────────────────────

export interface CompanyOversightRecord {
  symbol: string; // 'VAK' | 'CHK' | 'JVA' | 'PRN' | 'SAM' | 'NVA'
  name: string;
  marketPrice: number;
  marketCap: number;
  dailyVolume: number;
  dailyChangePercent: number;
  listingStatus: 'Active' | 'Under Surveillance' | 'Trading Halted' | 'Delisted';
  regulatoryStanding: 'Fully Compliant' | 'Pending Filing' | 'Inquiry Opened';
  circuitBreakerActive: boolean;
  sharesOutstanding: number;
  freeFloatPercent: number;
  dividendYield: number;
  lastFilingDate: string;
  activeInquiryNote?: string;
}

export const MOCK_COMPANIES_OVERSIGHT: CompanyOversightRecord[] = [
  {
    symbol: 'VAK',
    name: 'Vakratunda Heavy Foundry',
    marketPrice: 142.5,
    marketCap: 42_750_000,
    dailyVolume: 3_240_000,
    dailyChangePercent: +2.4,
    listingStatus: 'Active',
    regulatoryStanding: 'Fully Compliant',
    circuitBreakerActive: false,
    sharesOutstanding: 300_000,
    freeFloatPercent: 45.0,
    dividendYield: 4.8,
    lastFilingDate: '2026-08-15',
  },
  {
    symbol: 'CHK',
    name: 'Chakra Kinetic Energy',
    marketPrice: 98.2,
    marketCap: 34_370_000,
    dailyVolume: 2_890_000,
    dailyChangePercent: -1.2,
    listingStatus: 'Active',
    regulatoryStanding: 'Fully Compliant',
    circuitBreakerActive: false,
    sharesOutstanding: 350_000,
    freeFloatPercent: 50.0,
    dividendYield: 5.2,
    lastFilingDate: '2026-08-10',
  },
  {
    symbol: 'JVA',
    name: 'Jiva Biopharm Laboratories',
    marketPrice: 215.0,
    marketCap: 32_250_000,
    dailyVolume: 4_100_000,
    dailyChangePercent: +6.8, // Volatility alert
    listingStatus: 'Under Surveillance',
    regulatoryStanding: 'Inquiry Opened',
    circuitBreakerActive: false,
    sharesOutstanding: 150_000,
    freeFloatPercent: 40.0,
    dividendYield: 2.1,
    lastFilingDate: '2026-07-30',
    activeInquiryNote: 'Automated surveillance triggered: Single-session volume surged +340% ahead of clinical patent disclosure.',
  },
  {
    symbol: 'PRN',
    name: 'Prana Atmospheric Agritech',
    marketPrice: 64.0,
    marketCap: 16_000_000,
    dailyVolume: 920_000,
    dailyChangePercent: +0.5,
    listingStatus: 'Active',
    regulatoryStanding: 'Fully Compliant',
    circuitBreakerActive: false,
    sharesOutstanding: 250_000,
    freeFloatPercent: 60.0,
    dividendYield: 3.5,
    lastFilingDate: '2026-08-28',
  },
  {
    symbol: 'SAM',
    name: 'Samaya Financial Holdings',
    marketPrice: 180.0,
    marketCap: 36_000_000,
    dailyVolume: 1_850_000,
    dailyChangePercent: -0.3,
    listingStatus: 'Active',
    regulatoryStanding: 'Fully Compliant',
    circuitBreakerActive: false,
    sharesOutstanding: 200_000,
    freeFloatPercent: 35.0,
    dividendYield: 6.0,
    lastFilingDate: '2026-08-01',
  },
  {
    symbol: 'NVA',
    name: 'Nava Digital Infrastructure',
    marketPrice: 88.0,
    marketCap: 22_000_000,
    dailyVolume: 2_400_000,
    dailyChangePercent: +1.1,
    listingStatus: 'Active',
    regulatoryStanding: 'Pending Filing',
    circuitBreakerActive: false,
    sharesOutstanding: 250_000,
    freeFloatPercent: 55.0,
    dividendYield: 3.0,
    lastFilingDate: '2026-06-30',
    activeInquiryNote: 'Quarterly compliance filing 14 days overdue; extension granted until September 15.',
  },
];

// ─── 8. Authoritative System-Wide Reports ────────────────────────────────────

export type ReportCategory =
  | 'Banking'
  | 'Money Supply'
  | 'Transactions'
  | 'Inter-bank Settlement'
  | 'Fixed Deposits'
  | 'Loans'
  | 'Stocks'
  | 'Tax'
  | 'Fees'
  | 'Market'
  | 'Bank Performance'
  | 'Compliance';

export interface RegulatoryReportItem {
  id: string;
  title: string;
  category: ReportCategory;
  period: string; // 'August 2026' | 'Q2 2026' | 'Daily T+0'
  generatedAt: string;
  fileSizeBytes: number;
  securityClearance: 'Confidential' | 'Board Restricted' | 'Public Gazette';
  summary: string;
  format: 'PDF' | 'CSV' | 'JSON';
}

export const MOCK_REGULATORY_REPORTS: RegulatoryReportItem[] = [
  {
    id: 'REP-2026-M08-CLS',
    title: 'Monthly Central Settlement Layer (CLS) Clearing & Netting Report',
    category: 'Inter-bank Settlement',
    period: 'August 2026',
    generatedAt: '2026-09-01 02:00:00',
    fileSizeBytes: 2_480_000,
    securityClearance: 'Board Restricted',
    summary: 'Comprehensive audit of 184,200 inter-bank settlement instructions across Nava, Samaya, Setu, Sthira, and Vayu. 99.98% first-pass completion.',
    format: 'PDF',
  },
  {
    id: 'REP-2026-M08-M1',
    title: 'Macroeconomic Currency Circulation & M0/M1 Money Supply Audit',
    category: 'Money Supply',
    period: 'August 2026',
    generatedAt: '2026-09-02 04:30:00',
    fileSizeBytes: 1_850_000,
    securityClearance: 'Confidential',
    summary: 'Detailed ledger reconciliation proving zero unaccounted currency minting. Invariant verified: Total Debits == Total Credits across all nodes.',
    format: 'PDF',
  },
  {
    id: 'REP-2026-W36-TAX',
    title: 'Weekly Sovereign Revenue & Realized Capital Gains Tax Assessment',
    category: 'Tax',
    period: 'Week 36 (Aug 31 - Sep 06)',
    generatedAt: '2026-09-07 00:15:00',
    fileSizeBytes: 890_000,
    securityClearance: 'Public Gazette',
    summary: 'Total tax levied: 114,800 ARTH across transaction settlement fees (52,400 ARTH) and realized equity profits (62,400 ARTH).',
    format: 'CSV',
  },
  {
    id: 'REP-2026-M08-PRUD',
    title: 'Commercial Bank Capital & Prudential Reserves Stress Test',
    category: 'Bank Performance',
    period: 'August 2026',
    generatedAt: '2026-09-03 10:00:00',
    fileSizeBytes: 3_200_000,
    securityClearance: 'Board Restricted',
    summary: 'Stress analysis under 30% sudden liquidity withdrawal scenario. All 5 banks sustained required CRR above 10.5% threshold.',
    format: 'PDF',
  },
  {
    id: 'REP-2026-Q2-EQT',
    title: 'Quarterly Sovereign Equities Market Integrity & Insider Trading Review',
    category: 'Market',
    period: 'Q2 2026',
    generatedAt: '2026-07-05 08:00:00',
    fileSizeBytes: 4_100_000,
    securityClearance: 'Confidential',
    summary: 'Full order-book reconstruction for VAK, CHK, JVA, PRN, SAM, NVA. Two flagged volume anomalies investigated and cleared.',
    format: 'PDF',
  },
  {
    id: 'REP-2026-M08-COMP',
    title: 'Comprehensive Regulatory Non-Compliance & Incident Logbook',
    category: 'Compliance',
    period: 'August 2026',
    generatedAt: '2026-09-01 01:00:00',
    fileSizeBytes: 1_120_000,
    securityClearance: 'Board Restricted',
    summary: 'Registry of all warning notices, SLA degradation penalties, and reserve warning advisories issued to licensed banks.',
    format: 'CSV',
  },
];

// ─── 9. Official Announcements & Communications Hub ─────────────────────────

export type AnnouncementAudience =
  | 'All Citizens (User Mailbox)'
  | 'Commercial Banks Only'
  | 'Exchange Participants'
  | 'Public Gazette'
  | 'Central Bank Internal';

export type AnnouncementStatus = 'Published' | 'Scheduled' | 'Draft';

export interface OfficialAnnouncement {
  id: string;
  title: string;
  category: 'Monetary Policy' | 'Tax Directive' | 'Emergency Notice' | 'Market Halt' | 'Routine Update';
  audience: AnnouncementAudience;
  status: AnnouncementStatus;
  publishedAt: string;
  authorCouncil: string;
  summary: string;
  fullBody: string;
  reachesCitizenMailbox: boolean;
  priority: 'Normal' | 'High' | 'Emergency';
}

export const MOCK_ANNOUNCEMENTS: OfficialAnnouncement[] = [
  {
    id: 'ANN-2026-042',
    title: 'Directive #26-42: Scheduled Base Policy Rate Review for Q4',
    category: 'Monetary Policy',
    audience: 'Commercial Banks Only',
    status: 'Published',
    publishedAt: '2026-09-05 11:00:00',
    authorCouncil: 'Sovereign Monetary Policy Directorate',
    summary: 'Formal notice to commercial bank treasurers regarding upcoming policy benchmark adjustments.',
    fullBody: 'In accordance with statutory powers vested under Sovereign Charter Act 14, commercial banks are hereby notified that the Monetary Policy Committee has placed the Base Policy Rate under scheduled review for the forthcoming fiscal quarter.',
    reachesCitizenMailbox: false,
    priority: 'Normal',
  },
  {
    id: 'ANN-2026-041',
    title: 'Citizen Gazette: Realized Profit Tax Clarification for Equities Traders',
    category: 'Tax Directive',
    audience: 'All Citizens (User Mailbox)',
    status: 'Published',
    publishedAt: '2026-09-02 09:30:00',
    authorCouncil: 'Sovereign Revenue Bureau',
    summary: 'Dispatched to citizen mailboxes explaining capital loss offset rules on the Sovereign Equities Exchange.',
    fullBody: 'Citizens are advised that the 15% realized equity capital gains tax operates under strict net profit rules. Unsold positions, unrealized gains, and loss-making trades incur zero tax liability. Unused losses may be offset against subsequent gains within four quarters.',
    reachesCitizenMailbox: true,
    priority: 'Normal',
  },
  {
    id: 'ANN-2026-040',
    title: 'Emergency System Notice: CLS Buffer Stress Test Scheduled for 03:00 UTC',
    category: 'Emergency Notice',
    audience: 'Commercial Banks Only',
    status: 'Scheduled',
    publishedAt: '2026-09-10 03:00:00',
    authorCouncil: 'Chief Technology Officer & CLS Orchestration Lead',
    summary: 'Automated synthetic load test across all 5 commercial bank nodes.',
    fullBody: 'A mandatory non-disruptive clearing throughput drill will be executed at low-traffic epoch 4840. Commercial bank API endpoints must sustain 5,000 synthetic settlement instructions per second without latency degradation.',
    reachesCitizenMailbox: false,
    priority: 'High',
  },
  {
    id: 'ANN-2026-039',
    title: 'Draft Resolution on Green Energy Infrastructure Reserve Exemption',
    category: 'Routine Update',
    audience: 'Public Gazette',
    status: 'Draft',
    publishedAt: 'Pending Board Ratification',
    authorCouncil: 'Sustainable Finance Working Group',
    summary: 'Proposed amendment to allow commercial banks a 100 bps CRR rebate on verified clean agritech loans.',
    fullBody: 'Subject to public comment and subsequent board ratification, licensed banks financing certified green initiatives will qualify for reduced cash reserve requirements.',
    reachesCitizenMailbox: false,
    priority: 'Normal',
  },
];

// ─── 10. Forensic Audit & Compliance Logbook ────────────────────────────────

export type AuditSeverity = 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';

export interface AuditLogItem {
  id: string; // 'AUD-849102'
  timestamp: string;
  eventType: 'POLICY_CHANGE' | 'BANK_ACTION' | 'SETTLEMENT_OVERRIDE' | 'SECURITY_EVENT' | 'COMPLIANCE_NOTICE';
  actorId: string; // 'GOV-SEAL-01' | 'AUDITOR-VANCE' | 'CLS-SYS-ROUTER'
  actorRole: string; // 'Governor' | 'Chief Auditor' | 'CLS Orchestrator'
  targetEntity: string; // 'NAVA Bank' | 'POL-BASE-RATE' | 'CLS-98104'
  action: string;
  severity: AuditSeverity;
  ipAddress: string;
  sessionHash: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
}

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-849102',
    timestamp: '2026-09-08 16:45:12',
    eventType: 'BANK_ACTION',
    actorId: 'GOV-COUNCIL-01',
    actorRole: 'Governor',
    targetEntity: 'STHIRA Bank',
    action: 'Issued formal liquidity buffer advisory following intraday CRR deviation',
    severity: 'WARNING',
    ipAddress: '10.0.1.4 (Central Vault Gateway)',
    sessionHash: '0x84f1a09...c18b',
    beforeState: { complianceStatus: 'Compliant', crrRatio: 12.0 },
    afterState: { complianceStatus: 'Watchlist', crrRatio: 11.9, advisoryIssued: true },
  },
  {
    id: 'AUD-849101',
    timestamp: '2026-09-08 15:20:00',
    eventType: 'POLICY_CHANGE',
    actorId: 'SEC-COMMISSION-CHAIR',
    actorRole: 'Securities Commissioner',
    targetEntity: 'POL-BASE-RATE',
    action: 'Staged scheduled policy rate revision v2.5.0-RC1 for October 1st',
    severity: 'NOTICE',
    ipAddress: '10.0.1.12 (Commission Terminal)',
    sessionHash: '0x43ba912...e491',
    beforeState: { scheduledVersion: null, currentRate: 4.25 },
    afterState: { scheduledVersion: 'v2.5.0-RC1', targetRate: 4.50, effectiveDate: '2026-10-01' },
  },
  {
    id: 'AUD-849100',
    timestamp: '2026-09-08 14:11:34',
    eventType: 'SECURITY_EVENT',
    actorId: 'AUTH-GATEWAY-DEAMON',
    actorRole: 'System Daemon',
    targetEntity: 'CENTRAL-ADMIN-PORTAL',
    action: 'Blocked 3 consecutive failed administrative credential challenges from unauthorized IP',
    severity: 'CRITICAL',
    ipAddress: '198.51.100.44 (External Node)',
    sessionHash: 'SESSION-REJECTED-BLOCKED',
    beforeState: { failedAttempts: 2, lockStatus: false },
    afterState: { failedAttempts: 3, lockStatus: true, sourceSubnetBlocked: true },
  },
  {
    id: 'AUD-849099',
    timestamp: '2026-09-08 12:00:15',
    eventType: 'SETTLEMENT_OVERRIDE',
    actorId: 'CLS-ORCHESTRATOR',
    actorRole: 'Automated Sequencer',
    targetEntity: 'CLS-2026-98104',
    action: 'Executed automated atomic rollback on failed settlement batch to protect STHIRA reserve floor',
    severity: 'WARNING',
    ipAddress: '10.0.2.8 (CLS High-Speed Cluster)',
    sessionHash: '0x992a014...77bc',
    beforeState: { stage: 'VALIDATING', amount: 850_000 },
    afterState: { stage: 'FAILED', reversalId: 'REV-98104-AUTO', principalRestored: true },
  },
  {
    id: 'AUD-849098',
    timestamp: '2026-09-08 09:30:00',
    eventType: 'COMPLIANCE_NOTICE',
    actorId: 'CHIEF-AUDITOR-KAUR',
    actorRole: 'Chief Financial Auditor',
    targetEntity: 'JIVA Biopharm (JVA)',
    action: 'Placed equities ticker under formal surveillance for volume anomaly inquiry',
    severity: 'NOTICE',
    ipAddress: '10.0.1.7 (Surveillance Console)',
    sessionHash: '0x18ab774...32ef',
    beforeState: { surveillanceStatus: 'Normal' },
    afterState: { surveillanceStatus: 'Under Surveillance', inquiryCaseId: 'INQ-JVA-2026-01' },
  },
];

// ─── 11. Infrastructure, System Health & Security Surveillance ──────────────

export interface SystemServiceNode {
  id: string;
  name: string;
  role: string;
  status: 'Healthy' | 'Degraded' | 'Offline';
  latencyMs: number;
  uptimePercent: number;
  version: string;
  lastHeartbeat: string;
}

export const MOCK_SYSTEM_NODES: SystemServiceNode[] = [
  {
    id: 'NODE-LEDGER-01',
    name: 'Double-Entry Core Ledger Sequencer',
    role: 'Primary Invariant Validator (Σ Debits == Σ Credits)',
    status: 'Healthy',
    latencyMs: 3,
    uptimePercent: 99.999,
    version: 'v4.18.2-sovereign',
    lastHeartbeat: '1s ago',
  },
  {
    id: 'NODE-CLS-01',
    name: 'CLS Inter-Bank Clearing Cluster',
    role: 'Atomic Multi-Bank Routing & Settlement Protocol',
    status: 'Healthy',
    latencyMs: 8,
    uptimePercent: 99.995,
    version: 'v3.12.0',
    lastHeartbeat: '2s ago',
  },
  {
    id: 'NODE-HSM-VAULT',
    name: 'Sovereign Cryptographic HSM Vault',
    role: 'Air-Gapped Multi-Sig Governor Key Management',
    status: 'Healthy',
    latencyMs: 14,
    uptimePercent: 100.0,
    version: 'FIPS-140-3 Level 4',
    lastHeartbeat: '5s ago',
  },
  {
    id: 'NODE-SURVEILLANCE',
    name: 'Equities & Order Book Integrity Monitor',
    role: 'Real-Time Anomaly Detection & Circuit Trigger Engine',
    status: 'Healthy',
    latencyMs: 12,
    uptimePercent: 99.98,
    version: 'v2.8.4',
    lastHeartbeat: '3s ago',
  },
  {
    id: 'NODE-DATABASE-REPLICA',
    name: 'PostgreSQL Distributed Audit Sync',
    role: 'Immutable Append-Only Audit Stream Replication',
    status: 'Healthy',
    latencyMs: 5,
    uptimePercent: 99.99,
    version: 'PG-16.4-sovereign',
    lastHeartbeat: '1s ago',
  },
];

// ─── 12. Central Bank Institutional Settings & Role Matrix ───────────────────

export interface CentralBankSettingsData {
  institutionName: string;
  charterId: string;
  sovereignSeat: string;
  currentGovernor: string;
  deputyGovernor: string;
  auditBoardQuorumCount: number; // e.g. 5 of 7 required for emergency breaker
  sessionTimeoutMinutes: number;
  dualPasswordEnforced: boolean;
  stepUpAuthRequiredForRules: boolean;
  ipWhitelistEnforced: boolean;
  activeAdminSessions: {
    id: string;
    adminName: string;
    role: string;
    ip: string;
    connectedSince: string;
    device: string;
  }[];
}

export const MOCK_CENTRAL_BANK_SETTINGS: CentralBankSettingsData = {
  institutionName: 'Central Monetary Authority of ARTHAX',
  charterId: 'SOV-CHARTER-AUTH-2024-001',
  sovereignSeat: 'Capital Central Reserve Complex, Sector 01',
  currentGovernor: 'Dr. Alistair Vance, Governor of the Central Bank',
  deputyGovernor: 'Amira Patel, Deputy Governor of Prudential Oversight',
  auditBoardQuorumCount: 5,
  sessionTimeoutMinutes: 15,
  dualPasswordEnforced: true,
  stepUpAuthRequiredForRules: true,
  ipWhitelistEnforced: true,
  activeAdminSessions: [
    {
      id: 'SESS-001',
      adminName: 'Alistair Vance (Governor)',
      role: 'Sovereign Governor (Full Authority)',
      ip: '10.0.1.2',
      connectedSince: '2026-09-08 14:10',
      device: 'Secured Hardware Console #01',
    },
    {
      id: 'SESS-002',
      adminName: 'Harpreet Kaur (Chief Auditor)',
      role: 'Chief Auditor (Read / Audit / Sign)',
      ip: '10.0.1.7',
      connectedSince: '2026-09-08 15:45',
      device: 'Auditor Workstation Alpha',
    },
    {
      id: 'SESS-003',
      adminName: 'CLS Orchestrator Subsystem',
      role: 'Automated Settlement Machine',
      ip: '10.0.2.1',
      connectedSince: '2026-09-08 00:00',
      device: 'CLS Core Server Appliance',
    },
  ],
};
