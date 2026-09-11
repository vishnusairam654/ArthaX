// ================================================================
// ARTHAX Bank Portal — Centralized Mock Data & TypeScript Interfaces
// ================================================================
// All data operates in ARTH currency (single currency invariant).
// Account numbers follow ARTH-XXXX-XXX pattern.
// Transaction lifecycle: Pending → Validating → Authorized → Processing → Settling → Completed
// (with failure/reversal/cancellation branches)
// ================================================================

// ─── Bank Identity ────────────────────────────────────────────────

export interface BankIdentity {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  logo: string;
  established: string;
  branchCount: number;
  accentColor: string;
  totalAssets: number;
  totalDeposits: number;
  customerCount: number;
  activeAccounts: number;
}

export const ARTHAX_BANKS: Record<string, BankIdentity> = {
  nava: {
    id: 'nava',
    name: 'NAVA Bank',
    shortName: 'NAVA',
    tagline: 'Pioneering Sovereign Banking',
    logo: '/assets/banks/nava_bank.png',
    established: '2024-01-15',
    branchCount: 12,
    accentColor: '#3B3278',
    totalAssets: 24_850_000,
    totalDeposits: 18_420_000,
    customerCount: 1_842,
    activeAccounts: 3_156,
  },
  samaya: {
    id: 'samaya',
    name: 'SAMAYA Bank',
    shortName: 'SAMAYA',
    tagline: 'Time-Tested Financial Stewardship',
    logo: '/assets/banks/samaya_bank.png',
    established: '2024-03-22',
    branchCount: 8,
    accentColor: '#3B3278',
    totalAssets: 19_200_000,
    totalDeposits: 14_100_000,
    customerCount: 1_310,
    activeAccounts: 2_480,
  },
  setu: {
    id: 'setu',
    name: 'SETU Bank',
    shortName: 'SETU',
    tagline: 'Bridging Sovereign Commerce',
    logo: '/assets/banks/setu_bank.png',
    established: '2024-02-10',
    branchCount: 10,
    accentColor: '#3B3278',
    totalAssets: 21_600_000,
    totalDeposits: 16_800_000,
    customerCount: 1_620,
    activeAccounts: 2_910,
  },
  sthira: {
    id: 'sthira',
    name: 'STHIRA Bank',
    shortName: 'STHIRA',
    tagline: 'Stability in Every Ledger',
    logo: '/assets/banks/sthira_bank.png',
    established: '2024-04-05',
    branchCount: 6,
    accentColor: '#3B3278',
    totalAssets: 15_400_000,
    totalDeposits: 11_200_000,
    customerCount: 980,
    activeAccounts: 1_740,
  },
  vayu: {
    id: 'vayu',
    name: 'VAYU Bank',
    shortName: 'VAYU',
    tagline: 'Swift Sovereign Settlements',
    logo: '/assets/banks/vayu_bank.png',
    established: '2024-05-18',
    branchCount: 7,
    accentColor: '#3B3278',
    totalAssets: 17_100_000,
    totalDeposits: 12_900_000,
    customerCount: 1_150,
    activeAccounts: 2_060,
  },
};

// ─── Staff Identity ───────────────────────────────────────────────

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  initials: string;
}

export const ACTIVE_STAFF: StaffMember = {
  id: 'STAFF-001',
  name: 'Ravi Kumar',
  role: 'Operations Manager',
  department: 'Operations',
  initials: 'RK',
};

// ─── Customers ────────────────────────────────────────────────────

export type CustomerStatus = 'Active' | 'Suspended' | 'KYC Pending' | 'Closed';

export interface BankCustomer {
  id: string;
  govId: string;
  arthaxUserId: string;
  name: string;
  email: string;
  status: CustomerStatus;
  joinedDate: string;
  accountCount: number;
  totalBalance: number;
  fdHoldings: number;
  loanOutstanding: number;
  lastActivity: string;
  tier: string;
}

export const MOCK_CUSTOMERS: BankCustomer[] = [
  {
    id: 'CUST-0001',
    govId: 'GOV-AX-78291',
    arthaxUserId: 'AX-USR-1001',
    name: 'Ananya Sharma',
    email: 'ananya.s@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-02-14',
    accountCount: 3,
    totalBalance: 284_500,
    fdHoldings: 150_000,
    loanOutstanding: 0,
    lastActivity: '2026-09-08 11:42:18',
    tier: 'Tier-1',
  },
  {
    id: 'CUST-0002',
    govId: 'GOV-AX-45102',
    arthaxUserId: 'AX-USR-1002',
    name: 'Vikram Desai',
    email: 'vikram.d@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-03-08',
    accountCount: 2,
    totalBalance: 142_800,
    fdHoldings: 50_000,
    loanOutstanding: 25_000,
    lastActivity: '2026-09-08 09:15:30',
    tier: 'Tier-2',
  },
  {
    id: 'CUST-0003',
    govId: 'GOV-AX-91034',
    arthaxUserId: 'AX-USR-1003',
    name: 'Priya Nair',
    email: 'priya.n@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-04-22',
    accountCount: 2,
    totalBalance: 98_200,
    fdHoldings: 0,
    loanOutstanding: 45_000,
    lastActivity: '2026-09-07 16:28:45',
    tier: 'Tier-2',
  },
  {
    id: 'CUST-0004',
    govId: 'GOV-AX-33781',
    arthaxUserId: 'AX-USR-1004',
    name: 'Arjun Mehta',
    email: 'arjun.m@arthax.sovereign',
    status: 'Suspended',
    joinedDate: '2024-05-15',
    accountCount: 1,
    totalBalance: 12_400,
    fdHoldings: 0,
    loanOutstanding: 0,
    lastActivity: '2026-08-20 08:10:00',
    tier: 'Tier-3',
  },
  {
    id: 'CUST-0005',
    govId: 'GOV-AX-62450',
    arthaxUserId: 'AX-USR-1005',
    name: 'Lakshmi Iyer',
    email: 'lakshmi.i@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-01-28',
    accountCount: 4,
    totalBalance: 512_900,
    fdHoldings: 300_000,
    loanOutstanding: 0,
    lastActivity: '2026-09-08 12:05:11',
    tier: 'Tier-1',
  },
  {
    id: 'CUST-0006',
    govId: 'GOV-AX-88120',
    arthaxUserId: 'AX-USR-1006',
    name: 'Rohan Kapoor',
    email: 'rohan.k@arthax.sovereign',
    status: 'KYC Pending',
    joinedDate: '2026-09-01',
    accountCount: 0,
    totalBalance: 0,
    fdHoldings: 0,
    loanOutstanding: 0,
    lastActivity: '2026-09-01 14:22:00',
    tier: 'Pending',
  },
  {
    id: 'CUST-0007',
    govId: 'GOV-AX-11298',
    arthaxUserId: 'AX-USR-1007',
    name: 'Sanya Gupta',
    email: 'sanya.g@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-06-10',
    accountCount: 2,
    totalBalance: 67_300,
    fdHoldings: 25_000,
    loanOutstanding: 18_000,
    lastActivity: '2026-09-07 19:44:22',
    tier: 'Tier-2',
  },
  {
    id: 'CUST-0008',
    govId: 'GOV-AX-55671',
    arthaxUserId: 'AX-USR-1008',
    name: 'Deepak Rao',
    email: 'deepak.r@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-07-03',
    accountCount: 3,
    totalBalance: 189_400,
    fdHoldings: 100_000,
    loanOutstanding: 60_000,
    lastActivity: '2026-09-08 10:30:55',
    tier: 'Tier-1',
  },
  {
    id: 'CUST-0009',
    govId: 'GOV-AX-20445',
    arthaxUserId: 'AX-USR-1009',
    name: 'Meera Joshi',
    email: 'meera.j@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-08-19',
    accountCount: 1,
    totalBalance: 34_100,
    fdHoldings: 0,
    loanOutstanding: 0,
    lastActivity: '2026-09-06 11:18:42',
    tier: 'Tier-3',
  },
  {
    id: 'CUST-0010',
    govId: 'GOV-AX-72984',
    arthaxUserId: 'AX-USR-1010',
    name: 'Karthik Sundaram',
    email: 'karthik.s@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-03-30',
    accountCount: 2,
    totalBalance: 245_600,
    fdHoldings: 200_000,
    loanOutstanding: 0,
    lastActivity: '2026-09-08 08:55:10',
    tier: 'Tier-1',
  },
  {
    id: 'CUST-0011',
    govId: 'GOV-AX-41587',
    arthaxUserId: 'AX-USR-1011',
    name: 'Nisha Patel',
    email: 'nisha.p@arthax.sovereign',
    status: 'Closed',
    joinedDate: '2024-04-12',
    accountCount: 0,
    totalBalance: 0,
    fdHoldings: 0,
    loanOutstanding: 0,
    lastActivity: '2026-07-15 10:00:00',
    tier: 'Closed',
  },
  {
    id: 'CUST-0012',
    govId: 'GOV-AX-98312',
    arthaxUserId: 'AX-USR-1012',
    name: 'Aditya Bhat',
    email: 'aditya.b@arthax.sovereign',
    status: 'Active',
    joinedDate: '2024-09-05',
    accountCount: 2,
    totalBalance: 78_900,
    fdHoldings: 0,
    loanOutstanding: 32_000,
    lastActivity: '2026-09-08 07:22:18',
    tier: 'Tier-2',
  },
];

// ─── Accounts ─────────────────────────────────────────────────────

export type AccountType = 'Savings' | 'Current';
export type AccountStatus = 'Active' | 'Suspended' | 'Frozen' | 'Closed' | 'Dormant';

export interface BankAccount {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  type: AccountType;
  purpose: string;
  balance: number;
  status: AccountStatus;
  createdDate: string;
  transactionCount: number;
  dailyLimit: number;
  monthlyLimit: number;
}

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'ACC-001', accountNumber: 'ARTH-9021-001', customerId: 'CUST-0001', customerName: 'Ananya Sharma', type: 'Savings', purpose: 'Primary Savings', balance: 184_500, status: 'Active', createdDate: '2024-02-14', transactionCount: 248, dailyLimit: 50_000, monthlyLimit: 500_000 },
  { id: 'ACC-002', accountNumber: 'ARTH-9021-002', customerId: 'CUST-0001', customerName: 'Ananya Sharma', type: 'Current', purpose: 'Business Operations', balance: 82_000, status: 'Active', createdDate: '2024-06-10', transactionCount: 112, dailyLimit: 100_000, monthlyLimit: 1_000_000 },
  { id: 'ACC-003', accountNumber: 'ARTH-9021-003', customerId: 'CUST-0001', customerName: 'Ananya Sharma', type: 'Savings', purpose: 'Emergency Fund', balance: 18_000, status: 'Active', createdDate: '2025-01-20', transactionCount: 14, dailyLimit: 25_000, monthlyLimit: 200_000 },
  { id: 'ACC-004', accountNumber: 'ARTH-4412-001', customerId: 'CUST-0002', customerName: 'Vikram Desai', type: 'Savings', purpose: 'Primary Savings', balance: 102_800, status: 'Active', createdDate: '2024-03-08', transactionCount: 186, dailyLimit: 50_000, monthlyLimit: 500_000 },
  { id: 'ACC-005', accountNumber: 'ARTH-4412-002', customerId: 'CUST-0002', customerName: 'Vikram Desai', type: 'Current', purpose: 'Trading Settlement', balance: 40_000, status: 'Active', createdDate: '2024-08-15', transactionCount: 94, dailyLimit: 75_000, monthlyLimit: 750_000 },
  { id: 'ACC-006', accountNumber: 'ARTH-8831-001', customerId: 'CUST-0003', customerName: 'Priya Nair', type: 'Savings', purpose: 'Primary Savings', balance: 58_200, status: 'Active', createdDate: '2024-04-22', transactionCount: 132, dailyLimit: 50_000, monthlyLimit: 500_000 },
  { id: 'ACC-007', accountNumber: 'ARTH-8831-002', customerId: 'CUST-0003', customerName: 'Priya Nair', type: 'Savings', purpose: 'Loan Repayment', balance: 40_000, status: 'Active', createdDate: '2024-09-01', transactionCount: 28, dailyLimit: 25_000, monthlyLimit: 200_000 },
  { id: 'ACC-008', accountNumber: 'ARTH-1190-001', customerId: 'CUST-0004', customerName: 'Arjun Mehta', type: 'Savings', purpose: 'Primary Savings', balance: 12_400, status: 'Suspended', createdDate: '2024-05-15', transactionCount: 45, dailyLimit: 0, monthlyLimit: 0 },
  { id: 'ACC-009', accountNumber: 'ARTH-7740-001', customerId: 'CUST-0005', customerName: 'Lakshmi Iyer', type: 'Savings', purpose: 'Primary Savings', balance: 212_900, status: 'Active', createdDate: '2024-01-28', transactionCount: 310, dailyLimit: 100_000, monthlyLimit: 1_000_000 },
  { id: 'ACC-010', accountNumber: 'ARTH-7740-002', customerId: 'CUST-0005', customerName: 'Lakshmi Iyer', type: 'Current', purpose: 'Business', balance: 145_000, status: 'Active', createdDate: '2024-03-15', transactionCount: 198, dailyLimit: 150_000, monthlyLimit: 1_500_000 },
  { id: 'ACC-011', accountNumber: 'ARTH-7740-003', customerId: 'CUST-0005', customerName: 'Lakshmi Iyer', type: 'Savings', purpose: 'Investment Reserve', balance: 105_000, status: 'Active', createdDate: '2024-07-20', transactionCount: 56, dailyLimit: 75_000, monthlyLimit: 750_000 },
  { id: 'ACC-012', accountNumber: 'ARTH-7740-004', customerId: 'CUST-0005', customerName: 'Lakshmi Iyer', type: 'Savings', purpose: 'Tax Reserve', balance: 50_000, status: 'Active', createdDate: '2025-01-10', transactionCount: 12, dailyLimit: 25_000, monthlyLimit: 200_000 },
  { id: 'ACC-013', accountNumber: 'ARTH-2204-001', customerId: 'CUST-0007', customerName: 'Sanya Gupta', type: 'Savings', purpose: 'Primary Savings', balance: 42_300, status: 'Active', createdDate: '2024-06-10', transactionCount: 88, dailyLimit: 50_000, monthlyLimit: 500_000 },
  { id: 'ACC-014', accountNumber: 'ARTH-2204-002', customerId: 'CUST-0007', customerName: 'Sanya Gupta', type: 'Current', purpose: 'Freelance Income', balance: 25_000, status: 'Active', createdDate: '2024-11-05', transactionCount: 42, dailyLimit: 50_000, monthlyLimit: 500_000 },
  { id: 'ACC-015', accountNumber: 'ARTH-5519-001', customerId: 'CUST-0008', customerName: 'Deepak Rao', type: 'Savings', purpose: 'Primary Savings', balance: 89_400, status: 'Active', createdDate: '2024-07-03', transactionCount: 156, dailyLimit: 50_000, monthlyLimit: 500_000 },
  { id: 'ACC-016', accountNumber: 'ARTH-5519-002', customerId: 'CUST-0008', customerName: 'Deepak Rao', type: 'Current', purpose: 'Business', balance: 60_000, status: 'Active', createdDate: '2024-10-01', transactionCount: 78, dailyLimit: 75_000, monthlyLimit: 750_000 },
  { id: 'ACC-017', accountNumber: 'ARTH-5519-003', customerId: 'CUST-0008', customerName: 'Deepak Rao', type: 'Savings', purpose: 'Education Fund', balance: 40_000, status: 'Active', createdDate: '2025-03-15', transactionCount: 8, dailyLimit: 25_000, monthlyLimit: 200_000 },
  { id: 'ACC-018', accountNumber: 'ARTH-3301-001', customerId: 'CUST-0009', customerName: 'Meera Joshi', type: 'Savings', purpose: 'Primary Savings', balance: 34_100, status: 'Active', createdDate: '2024-08-19', transactionCount: 62, dailyLimit: 50_000, monthlyLimit: 500_000 },
  { id: 'ACC-019', accountNumber: 'ARTH-6688-001', customerId: 'CUST-0010', customerName: 'Karthik Sundaram', type: 'Savings', purpose: 'Primary Savings', balance: 145_600, status: 'Active', createdDate: '2024-03-30', transactionCount: 204, dailyLimit: 75_000, monthlyLimit: 750_000 },
  { id: 'ACC-020', accountNumber: 'ARTH-6688-002', customerId: 'CUST-0010', customerName: 'Karthik Sundaram', type: 'Current', purpose: 'Consulting Income', balance: 100_000, status: 'Active', createdDate: '2024-06-18', transactionCount: 134, dailyLimit: 100_000, monthlyLimit: 1_000_000 },
  { id: 'ACC-021', accountNumber: 'ARTH-8842-001', customerId: 'CUST-0012', customerName: 'Aditya Bhat', type: 'Savings', purpose: 'Primary Savings', balance: 48_900, status: 'Active', createdDate: '2024-09-05', transactionCount: 76, dailyLimit: 50_000, monthlyLimit: 500_000 },
  { id: 'ACC-022', accountNumber: 'ARTH-8842-002', customerId: 'CUST-0012', customerName: 'Aditya Bhat', type: 'Savings', purpose: 'Side Project', balance: 30_000, status: 'Dormant', createdDate: '2025-02-20', transactionCount: 4, dailyLimit: 25_000, monthlyLimit: 200_000 },
];

// ─── Transactions ─────────────────────────────────────────────────

export type TransactionStatus =
  | 'Pending'
  | 'Validating'
  | 'Authorized'
  | 'Processing'
  | 'Settling'
  | 'Finalizing'
  | 'Completed'
  | 'Failed'
  | 'Reversed'
  | 'Cancelled';

export type TransactionType = 'Transfer' | 'Deposit' | 'Withdrawal' | 'Interest' | 'Fee' | 'Tax' | 'Loan Disbursement' | 'Loan Repayment' | 'FD Booking' | 'FD Maturity';

export type TransactionScope = 'Internal' | 'Inter-bank';

export interface BankTransaction {
  id: string;
  senderAccount: string;
  senderName: string;
  receiverAccount: string;
  receiverName: string;
  amount: number;
  type: TransactionType;
  scope: TransactionScope;
  dateTime: string;
  status: TransactionStatus;
  fees: number;
  tax: number;
  settlementRef: string;
  ledgerRef: string;
  failureReason?: string;
}

export const MOCK_TRANSACTIONS: BankTransaction[] = [
  { id: 'TX-240908-001', senderAccount: 'ARTH-9021-001', senderName: 'Ananya Sharma', receiverAccount: 'ARTH-4412-001', receiverName: 'Vikram Desai', amount: 15_000, type: 'Transfer', scope: 'Internal', dateTime: '2026-09-08 11:42:18', status: 'Completed', fees: 5, tax: 0, settlementRef: 'CLS-INT-90821', ledgerRef: 'LED-28102510' },
  { id: 'TX-240908-002', senderAccount: 'ARTH-7740-002', senderName: 'Lakshmi Iyer', receiverAccount: 'EXT-SAMAYA-3301', receiverName: 'External - SAMAYA', amount: 45_000, type: 'Transfer', scope: 'Inter-bank', dateTime: '2026-09-08 10:15:44', status: 'Settling', fees: 25, tax: 0, settlementRef: 'CLS-IB-44102', ledgerRef: 'LED-28102488' },
  { id: 'TX-240908-003', senderAccount: 'SYSTEM', senderName: 'Bank System', receiverAccount: 'ARTH-6688-001', receiverName: 'Karthik Sundaram', amount: 1_245, type: 'Interest', scope: 'Internal', dateTime: '2026-09-08 00:01:00', status: 'Completed', fees: 0, tax: 124, settlementRef: 'INT-AUTO-09081', ledgerRef: 'LED-28102401' },
  { id: 'TX-240908-004', senderAccount: 'ARTH-5519-001', senderName: 'Deepak Rao', receiverAccount: 'ARTH-9021-002', receiverName: 'Ananya Sharma', amount: 8_500, type: 'Transfer', scope: 'Internal', dateTime: '2026-09-08 09:32:11', status: 'Completed', fees: 5, tax: 0, settlementRef: 'CLS-INT-90814', ledgerRef: 'LED-28102478' },
  { id: 'TX-240908-005', senderAccount: 'ARTH-8831-001', senderName: 'Priya Nair', receiverAccount: 'ARTH-8831-002', receiverName: 'Priya Nair', amount: 5_000, type: 'Transfer', scope: 'Internal', dateTime: '2026-09-08 08:10:30', status: 'Completed', fees: 0, tax: 0, settlementRef: 'CLS-INT-90808', ledgerRef: 'LED-28102455' },
  { id: 'TX-240908-006', senderAccount: 'ARTH-2204-001', senderName: 'Sanya Gupta', receiverAccount: 'EXT-SETU-7712', receiverName: 'External - SETU', amount: 22_000, type: 'Transfer', scope: 'Inter-bank', dateTime: '2026-09-08 07:55:22', status: 'Processing', fees: 25, tax: 0, settlementRef: 'CLS-IB-44098', ledgerRef: 'LED-28102449' },
  { id: 'TX-240907-007', senderAccount: 'ARTH-4412-002', senderName: 'Vikram Desai', receiverAccount: 'EXT-VAYU-1120', receiverName: 'External - VAYU', amount: 12_000, type: 'Transfer', scope: 'Inter-bank', dateTime: '2026-09-07 16:42:00', status: 'Failed', fees: 25, tax: 0, settlementRef: 'CLS-IB-44085', ledgerRef: 'LED-28102390', failureReason: 'Insufficient funds in clearing pool' },
  { id: 'TX-240907-008', senderAccount: 'LOAN-SYSTEM', senderName: 'Loan Disbursement', receiverAccount: 'ARTH-8842-001', receiverName: 'Aditya Bhat', amount: 32_000, type: 'Loan Disbursement', scope: 'Internal', dateTime: '2026-09-07 14:20:00', status: 'Completed', fees: 100, tax: 0, settlementRef: 'LN-DISB-0012', ledgerRef: 'LED-28102378' },
  { id: 'TX-240907-009', senderAccount: 'ARTH-8831-002', senderName: 'Priya Nair', receiverAccount: 'LOAN-SYSTEM', receiverName: 'Loan Repayment', amount: 3_750, type: 'Loan Repayment', scope: 'Internal', dateTime: '2026-09-07 10:00:00', status: 'Completed', fees: 0, tax: 0, settlementRef: 'LN-REP-0045', ledgerRef: 'LED-28102355' },
  { id: 'TX-240907-010', senderAccount: 'ARTH-9021-001', senderName: 'Ananya Sharma', receiverAccount: 'FD-SYSTEM', receiverName: 'FD Booking', amount: 50_000, type: 'FD Booking', scope: 'Internal', dateTime: '2026-09-07 09:15:00', status: 'Completed', fees: 0, tax: 0, settlementRef: 'FD-BK-0008', ledgerRef: 'LED-28102340' },
  { id: 'TX-240906-011', senderAccount: 'ARTH-6688-002', senderName: 'Karthik Sundaram', receiverAccount: 'ARTH-3301-001', receiverName: 'Meera Joshi', amount: 7_800, type: 'Transfer', scope: 'Internal', dateTime: '2026-09-06 15:30:00', status: 'Completed', fees: 5, tax: 0, settlementRef: 'CLS-INT-90752', ledgerRef: 'LED-28102298' },
  { id: 'TX-240906-012', senderAccount: 'ARTH-7740-001', senderName: 'Lakshmi Iyer', receiverAccount: 'EXT-STHIRA-5540', receiverName: 'External - STHIRA', amount: 85_000, type: 'Transfer', scope: 'Inter-bank', dateTime: '2026-09-06 14:00:00', status: 'Reversed', fees: 25, tax: 0, settlementRef: 'CLS-IB-44070', ledgerRef: 'LED-28102280' },
  { id: 'TX-240906-013', senderAccount: 'SYSTEM', senderName: 'Fee Collection', receiverAccount: 'BANK-FEE-POOL', receiverName: 'Bank Fee Pool', amount: 480, type: 'Fee', scope: 'Internal', dateTime: '2026-09-06 00:05:00', status: 'Completed', fees: 0, tax: 0, settlementRef: 'FEE-AUTO-09061', ledgerRef: 'LED-28102210' },
  { id: 'TX-240905-014', senderAccount: 'ARTH-9021-002', senderName: 'Ananya Sharma', receiverAccount: 'ARTH-5519-002', receiverName: 'Deepak Rao', amount: 18_500, type: 'Transfer', scope: 'Internal', dateTime: '2026-09-05 11:22:00', status: 'Completed', fees: 5, tax: 0, settlementRef: 'CLS-INT-90701', ledgerRef: 'LED-28102188' },
  { id: 'TX-240905-015', senderAccount: 'FD-SYSTEM', senderName: 'FD Maturity', receiverAccount: 'ARTH-7740-001', receiverName: 'Lakshmi Iyer', amount: 106_500, type: 'FD Maturity', scope: 'Internal', dateTime: '2026-09-05 00:01:00', status: 'Completed', fees: 0, tax: 650, settlementRef: 'FD-MAT-0003', ledgerRef: 'LED-28102150' },
  { id: 'TX-240908-016', senderAccount: 'ARTH-5519-002', senderName: 'Deepak Rao', receiverAccount: 'EXT-NAVA-EXT', receiverName: 'External - NAVA Branch', amount: 30_000, type: 'Transfer', scope: 'Inter-bank', dateTime: '2026-09-08 12:05:00', status: 'Pending', fees: 25, tax: 0, settlementRef: 'CLS-IB-44110', ledgerRef: 'LED-28102520' },
  { id: 'TX-240908-017', senderAccount: 'ARTH-2204-002', senderName: 'Sanya Gupta', receiverAccount: 'ARTH-6688-001', receiverName: 'Karthik Sundaram', amount: 4_200, type: 'Transfer', scope: 'Internal', dateTime: '2026-09-08 11:00:00', status: 'Validating', fees: 5, tax: 0, settlementRef: 'CLS-INT-90825', ledgerRef: 'LED-28102515' },
  { id: 'TX-240904-018', senderAccount: 'ARTH-3301-001', senderName: 'Meera Joshi', receiverAccount: 'EXT-SAMAYA-8810', receiverName: 'External - SAMAYA', amount: 6_000, type: 'Transfer', scope: 'Inter-bank', dateTime: '2026-09-04 16:40:00', status: 'Cancelled', fees: 0, tax: 0, settlementRef: 'CLS-IB-44055', ledgerRef: 'LED-28102100' },
];

// ─── Fixed Deposits ───────────────────────────────────────────────

export type FDStatus = 'Active' | 'Matured' | 'Premature Withdrawal' | 'Renewed' | 'Pending';

export interface FDScheme {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  tenureMonths: number;
  interestRate: number;
  compounding: string;
  isActive: boolean;
}

export interface FixedDeposit {
  id: string;
  customerId: string;
  customerName: string;
  schemeId: string;
  schemeName: string;
  principal: number;
  interestRate: number;
  tenureMonths: number;
  startDate: string;
  maturityDate: string;
  interestAccrued: number;
  maturityAmount: number;
  status: FDStatus;
  sourceAccount: string;
  certificateRef: string;
}

export const MOCK_FD_SCHEMES: FDScheme[] = [
  { id: 'FDS-001', name: 'Sovereign Shield 90D', minAmount: 10_000, maxAmount: 500_000, tenureMonths: 3, interestRate: 5.25, compounding: 'Quarterly', isActive: true },
  { id: 'FDS-002', name: 'Sovereign Shield 180D', minAmount: 10_000, maxAmount: 1_000_000, tenureMonths: 6, interestRate: 6.00, compounding: 'Quarterly', isActive: true },
  { id: 'FDS-003', name: 'Sovereign Shield 1Y', minAmount: 25_000, maxAmount: 2_000_000, tenureMonths: 12, interestRate: 6.75, compounding: 'Quarterly', isActive: true },
  { id: 'FDS-004', name: 'Sovereign Shield 2Y', minAmount: 25_000, maxAmount: 5_000_000, tenureMonths: 24, interestRate: 7.10, compounding: 'Quarterly', isActive: true },
  { id: 'FDS-005', name: 'Sovereign Shield 5Y', minAmount: 50_000, maxAmount: 10_000_000, tenureMonths: 60, interestRate: 7.50, compounding: 'Quarterly', isActive: true },
  { id: 'FDS-006', name: 'Flexi Deposit 30D', minAmount: 5_000, maxAmount: 200_000, tenureMonths: 1, interestRate: 4.50, compounding: 'Monthly', isActive: false },
];

export const MOCK_FIXED_DEPOSITS: FixedDeposit[] = [
  { id: 'FD-0001', customerId: 'CUST-0001', customerName: 'Ananya Sharma', schemeId: 'FDS-003', schemeName: 'Sovereign Shield 1Y', principal: 100_000, interestRate: 6.75, tenureMonths: 12, startDate: '2026-03-15', maturityDate: '2027-03-15', interestAccrued: 3_375, maturityAmount: 106_750, status: 'Active', sourceAccount: 'ARTH-9021-001', certificateRef: 'FD-CERT-AX-0001' },
  { id: 'FD-0002', customerId: 'CUST-0001', customerName: 'Ananya Sharma', schemeId: 'FDS-001', schemeName: 'Sovereign Shield 90D', principal: 50_000, interestRate: 5.25, tenureMonths: 3, startDate: '2026-09-07', maturityDate: '2026-12-07', interestAccrued: 0, maturityAmount: 50_656, status: 'Pending', sourceAccount: 'ARTH-9021-001', certificateRef: 'FD-CERT-AX-0002' },
  { id: 'FD-0003', customerId: 'CUST-0002', customerName: 'Vikram Desai', schemeId: 'FDS-002', schemeName: 'Sovereign Shield 180D', principal: 50_000, interestRate: 6.00, tenureMonths: 6, startDate: '2026-06-01', maturityDate: '2026-12-01', interestAccrued: 1_500, maturityAmount: 51_500, status: 'Active', sourceAccount: 'ARTH-4412-001', certificateRef: 'FD-CERT-AX-0003' },
  { id: 'FD-0004', customerId: 'CUST-0005', customerName: 'Lakshmi Iyer', schemeId: 'FDS-004', schemeName: 'Sovereign Shield 2Y', principal: 200_000, interestRate: 7.10, tenureMonths: 24, startDate: '2025-09-01', maturityDate: '2027-09-01', interestAccrued: 14_200, maturityAmount: 214_200, status: 'Active', sourceAccount: 'ARTH-7740-001', certificateRef: 'FD-CERT-AX-0004' },
  { id: 'FD-0005', customerId: 'CUST-0005', customerName: 'Lakshmi Iyer', schemeId: 'FDS-003', schemeName: 'Sovereign Shield 1Y', principal: 100_000, interestRate: 6.75, tenureMonths: 12, startDate: '2025-09-05', maturityDate: '2026-09-05', interestAccrued: 6_750, maturityAmount: 106_750, status: 'Matured', sourceAccount: 'ARTH-7740-003', certificateRef: 'FD-CERT-AX-0005' },
  { id: 'FD-0006', customerId: 'CUST-0007', customerName: 'Sanya Gupta', schemeId: 'FDS-001', schemeName: 'Sovereign Shield 90D', principal: 25_000, interestRate: 5.25, tenureMonths: 3, startDate: '2026-07-15', maturityDate: '2026-10-15', interestAccrued: 328, maturityAmount: 25_328, status: 'Active', sourceAccount: 'ARTH-2204-001', certificateRef: 'FD-CERT-AX-0006' },
  { id: 'FD-0007', customerId: 'CUST-0008', customerName: 'Deepak Rao', schemeId: 'FDS-005', schemeName: 'Sovereign Shield 5Y', principal: 100_000, interestRate: 7.50, tenureMonths: 60, startDate: '2025-01-10', maturityDate: '2030-01-10', interestAccrued: 12_500, maturityAmount: 137_500, status: 'Active', sourceAccount: 'ARTH-5519-001', certificateRef: 'FD-CERT-AX-0007' },
  { id: 'FD-0008', customerId: 'CUST-0010', customerName: 'Karthik Sundaram', schemeId: 'FDS-004', schemeName: 'Sovereign Shield 2Y', principal: 200_000, interestRate: 7.10, tenureMonths: 24, startDate: '2026-01-15', maturityDate: '2028-01-15', interestAccrued: 9_466, maturityAmount: 214_200, status: 'Active', sourceAccount: 'ARTH-6688-001', certificateRef: 'FD-CERT-AX-0008' },
];

// ─── Loans ────────────────────────────────────────────────────────

export type LoanStatus = 'Application' | 'Under Review' | 'Approved' | 'Active' | 'Overdue' | 'Rejected' | 'Closed' | 'Suspended';
export type LoanType = 'Personal' | 'Business' | 'Education' | 'Housing' | 'Vehicle';

export interface BankLoan {
  id: string;
  customerId: string;
  customerName: string;
  type: LoanType;
  principal: number;
  interestRate: number;
  tenureMonths: number;
  outstandingBalance: number;
  monthlyEmi: number;
  paidInstallments: number;
  totalInstallments: number;
  status: LoanStatus;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  approvedBy?: string;
  targetAccount: string;
}

export const MOCK_LOANS: BankLoan[] = [
  { id: 'LN-0001', customerId: 'CUST-0002', customerName: 'Vikram Desai', type: 'Personal', principal: 50_000, interestRate: 9.50, tenureMonths: 24, outstandingBalance: 25_000, monthlyEmi: 2_295, paidInstallments: 12, totalInstallments: 24, status: 'Active', applicationDate: '2025-08-10', approvalDate: '2025-08-15', disbursementDate: '2025-08-20', approvedBy: 'Ravi Kumar', targetAccount: 'ARTH-4412-001' },
  { id: 'LN-0002', customerId: 'CUST-0003', customerName: 'Priya Nair', type: 'Education', principal: 80_000, interestRate: 7.25, tenureMonths: 36, outstandingBalance: 45_000, monthlyEmi: 2_480, paidInstallments: 16, totalInstallments: 36, status: 'Active', applicationDate: '2025-04-01', approvalDate: '2025-04-10', disbursementDate: '2025-04-15', approvedBy: 'Ravi Kumar', targetAccount: 'ARTH-8831-001' },
  { id: 'LN-0003', customerId: 'CUST-0007', customerName: 'Sanya Gupta', type: 'Personal', principal: 30_000, interestRate: 10.00, tenureMonths: 18, outstandingBalance: 18_000, monthlyEmi: 1_815, paidInstallments: 7, totalInstallments: 18, status: 'Active', applicationDate: '2026-02-10', approvalDate: '2026-02-18', disbursementDate: '2026-02-22', approvedBy: 'Ravi Kumar', targetAccount: 'ARTH-2204-001' },
  { id: 'LN-0004', customerId: 'CUST-0008', customerName: 'Deepak Rao', type: 'Business', principal: 150_000, interestRate: 8.75, tenureMonths: 48, outstandingBalance: 60_000, monthlyEmi: 3_718, paidInstallments: 30, totalInstallments: 48, status: 'Active', applicationDate: '2024-03-20', approvalDate: '2024-04-01', disbursementDate: '2024-04-05', approvedBy: 'Ravi Kumar', targetAccount: 'ARTH-5519-002' },
  { id: 'LN-0005', customerId: 'CUST-0012', customerName: 'Aditya Bhat', type: 'Personal', principal: 32_000, interestRate: 9.50, tenureMonths: 12, outstandingBalance: 32_000, monthlyEmi: 2_800, paidInstallments: 0, totalInstallments: 12, status: 'Active', applicationDate: '2026-09-05', approvalDate: '2026-09-07', disbursementDate: '2026-09-07', approvedBy: 'Ravi Kumar', targetAccount: 'ARTH-8842-001' },
  { id: 'LN-0006', customerId: 'CUST-0009', customerName: 'Meera Joshi', type: 'Housing', principal: 500_000, interestRate: 7.00, tenureMonths: 120, outstandingBalance: 500_000, monthlyEmi: 5_805, paidInstallments: 0, totalInstallments: 120, status: 'Under Review', applicationDate: '2026-09-06', targetAccount: 'ARTH-3301-001' },
  { id: 'LN-0007', customerId: 'CUST-0002', customerName: 'Vikram Desai', type: 'Vehicle', principal: 120_000, interestRate: 8.50, tenureMonths: 60, outstandingBalance: 120_000, monthlyEmi: 2_457, paidInstallments: 0, totalInstallments: 60, status: 'Application', applicationDate: '2026-09-08', targetAccount: 'ARTH-4412-001' },
  { id: 'LN-0008', customerId: 'CUST-0004', customerName: 'Arjun Mehta', type: 'Personal', principal: 20_000, interestRate: 12.00, tenureMonths: 12, outstandingBalance: 0, monthlyEmi: 0, paidInstallments: 0, totalInstallments: 12, status: 'Rejected', applicationDate: '2026-08-15', targetAccount: 'ARTH-1190-001' },
  { id: 'LN-0009', customerId: 'CUST-0008', customerName: 'Deepak Rao', type: 'Education', principal: 60_000, interestRate: 7.25, tenureMonths: 36, outstandingBalance: 60_000, monthlyEmi: 1_860, paidInstallments: 0, totalInstallments: 36, status: 'Application', applicationDate: '2026-09-07', targetAccount: 'ARTH-5519-003' },
  { id: 'LN-0010', customerId: 'CUST-0003', customerName: 'Priya Nair', type: 'Personal', principal: 15_000, interestRate: 10.50, tenureMonths: 12, outstandingBalance: 8_200, monthlyEmi: 1_325, paidInstallments: 6, totalInstallments: 12, status: 'Overdue', applicationDate: '2026-02-01', approvalDate: '2026-02-08', disbursementDate: '2026-02-12', approvedBy: 'Ravi Kumar', targetAccount: 'ARTH-8831-001' },
];

// ─── Products ─────────────────────────────────────────────────────

export type ProductCategory = 'Savings Account' | 'Current Account' | 'FD Scheme' | 'Loan Product' | 'Transfer Service';

export interface BankProduct {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  interestRate?: number;
  fees: number;
  minBalance?: number;
  maxLimit?: number;
  eligibility: string;
  isActive: boolean;
  customerCount: number;
}

export const MOCK_PRODUCTS: BankProduct[] = [
  { id: 'PROD-001', name: 'Sovereign Savings', category: 'Savings Account', description: 'Standard savings account with competitive interest rates and full CLS integration.', interestRate: 4.00, fees: 0, minBalance: 1_000, eligibility: 'All verified ARTHAX citizens', isActive: true, customerCount: 1_240 },
  { id: 'PROD-002', name: 'Premium Savings', category: 'Savings Account', description: 'High-yield savings with priority CLS settlement and enhanced daily limits.', interestRate: 4.75, fees: 50, minBalance: 25_000, eligibility: 'Tier-1 and Tier-2 citizens', isActive: true, customerCount: 380 },
  { id: 'PROD-003', name: 'Business Current', category: 'Current Account', description: 'Zero-interest current account for business operations with high transaction limits.', fees: 100, minBalance: 10_000, maxLimit: 1_500_000, eligibility: 'Verified business entities', isActive: true, customerCount: 290 },
  { id: 'PROD-004', name: 'Standard Current', category: 'Current Account', description: 'Basic current account for daily operational needs.', fees: 25, minBalance: 5_000, maxLimit: 500_000, eligibility: 'All verified citizens', isActive: true, customerCount: 520 },
  { id: 'PROD-005', name: 'Sovereign Shield FD', category: 'FD Scheme', description: 'Term deposit product family with tenures from 90 days to 5 years.', interestRate: 7.50, fees: 0, minBalance: 10_000, eligibility: 'All account holders', isActive: true, customerCount: 460 },
  { id: 'PROD-006', name: 'Personal Loan', category: 'Loan Product', description: 'Unsecured personal loan for individual needs.', interestRate: 10.00, fees: 200, maxLimit: 200_000, eligibility: 'Tier-1 and Tier-2 with 6+ months history', isActive: true, customerCount: 180 },
  { id: 'PROD-007', name: 'Business Loan', category: 'Loan Product', description: 'Working capital and expansion financing for sovereign businesses.', interestRate: 8.75, fees: 500, maxLimit: 1_000_000, eligibility: 'Business account holders with 1Y+ history', isActive: true, customerCount: 45 },
  { id: 'PROD-008', name: 'Education Loan', category: 'Loan Product', description: 'Subsidized education financing for sovereign citizens.', interestRate: 7.25, fees: 100, maxLimit: 500_000, eligibility: 'All verified citizens with education proof', isActive: true, customerCount: 62 },
  { id: 'PROD-009', name: 'Instant Transfer', category: 'Transfer Service', description: 'Real-time internal transfers with CLS finality under 500ms.', fees: 5, maxLimit: 100_000, eligibility: 'All active accounts', isActive: true, customerCount: 1_680 },
  { id: 'PROD-010', name: 'Inter-bank Transfer', category: 'Transfer Service', description: 'Cross-bank transfers through the Central Settlement Layer.', fees: 25, maxLimit: 500_000, eligibility: 'Active accounts with CLS clearance', isActive: true, customerCount: 890 },
];

// ─── Operations Queue ─────────────────────────────────────────────

export type OperationPriority = 'Critical' | 'High' | 'Normal' | 'Low';
export type OperationType = 'Loan Approval' | 'Account Request' | 'FD Processing' | 'Transaction Exception' | 'Customer Request' | 'Limit Change' | 'KYC Review';

export interface OperationItem {
  id: string;
  type: OperationType;
  title: string;
  description: string;
  priority: OperationPriority;
  customerId?: string;
  customerName?: string;
  referenceId: string;
  createdAt: string;
  assignee: string;
  status: 'Pending' | 'In Progress' | 'Escalated';
}

export const MOCK_OPERATIONS: OperationItem[] = [
  { id: 'OPS-001', type: 'Loan Approval', title: 'Housing Loan Application Review', description: 'Meera Joshi applied for a housing loan of 500,000 ARTH. Requires senior approval.', priority: 'High', customerId: 'CUST-0009', customerName: 'Meera Joshi', referenceId: 'LN-0006', createdAt: '2026-09-06 10:00:00', assignee: 'Ravi Kumar', status: 'Pending' },
  { id: 'OPS-002', type: 'Loan Approval', title: 'Vehicle Loan Application', description: 'Vikram Desai applied for a vehicle loan of 120,000 ARTH.', priority: 'Normal', customerId: 'CUST-0002', customerName: 'Vikram Desai', referenceId: 'LN-0007', createdAt: '2026-09-08 08:30:00', assignee: 'Ravi Kumar', status: 'Pending' },
  { id: 'OPS-003', type: 'Transaction Exception', title: 'Failed Inter-bank Settlement', description: 'Transfer TX-240907-007 to VAYU failed due to insufficient clearing pool. Requires manual reconciliation.', priority: 'Critical', customerName: 'Vikram Desai', referenceId: 'TX-240907-007', createdAt: '2026-09-07 16:45:00', assignee: 'Ravi Kumar', status: 'Escalated' },
  { id: 'OPS-004', type: 'KYC Review', title: 'New Customer KYC Verification', description: 'Rohan Kapoor submitted KYC documents for verification. Pending identity check.', priority: 'Normal', customerId: 'CUST-0006', customerName: 'Rohan Kapoor', referenceId: 'CUST-0006', createdAt: '2026-09-01 14:22:00', assignee: 'Ravi Kumar', status: 'Pending' },
  { id: 'OPS-005', type: 'FD Processing', title: 'FD Maturity Processing', description: 'FD-0005 for Lakshmi Iyer matured on 2026-09-05. Principal + interest credited. Awaiting renewal decision.', priority: 'Normal', customerId: 'CUST-0005', customerName: 'Lakshmi Iyer', referenceId: 'FD-0005', createdAt: '2026-09-05 00:01:00', assignee: 'Ravi Kumar', status: 'In Progress' },
  { id: 'OPS-006', type: 'Customer Request', title: 'Account Reactivation Request', description: 'Arjun Mehta requests reactivation of suspended account ARTH-1190-001.', priority: 'Normal', customerId: 'CUST-0004', customerName: 'Arjun Mehta', referenceId: 'ACC-008', createdAt: '2026-09-07 09:00:00', assignee: 'Ravi Kumar', status: 'Pending' },
  { id: 'OPS-007', type: 'Limit Change', title: 'Daily Limit Increase Request', description: 'Deepak Rao requests daily transfer limit increase from 50,000 to 100,000 ARTH.', priority: 'Low', customerId: 'CUST-0008', customerName: 'Deepak Rao', referenceId: 'ACC-015', createdAt: '2026-09-08 10:30:00', assignee: 'Ravi Kumar', status: 'Pending' },
  { id: 'OPS-008', type: 'Loan Approval', title: 'Education Loan Application', description: 'Deepak Rao applied for an education loan of 60,000 ARTH.', priority: 'Normal', customerId: 'CUST-0008', customerName: 'Deepak Rao', referenceId: 'LN-0009', createdAt: '2026-09-07 15:00:00', assignee: 'Ravi Kumar', status: 'Pending' },
  { id: 'OPS-009', type: 'Transaction Exception', title: 'Reversed Inter-bank Transfer', description: 'TX-240906-012 to STHIRA was reversed. Customer notified. Requires investigation.', priority: 'High', customerName: 'Lakshmi Iyer', referenceId: 'TX-240906-012', createdAt: '2026-09-06 14:30:00', assignee: 'Ravi Kumar', status: 'In Progress' },
  { id: 'OPS-010', type: 'FD Processing', title: 'New FD Booking Confirmation', description: 'FD-0002 booked by Ananya Sharma for 50,000 ARTH (90D scheme). Pending certificate generation.', priority: 'Low', customerId: 'CUST-0001', customerName: 'Ananya Sharma', referenceId: 'FD-0002', createdAt: '2026-09-07 09:15:00', assignee: 'Ravi Kumar', status: 'Pending' },
];

// ─── Notifications ────────────────────────────────────────────────

export type NotificationCategory = 'System' | 'Transaction' | 'Settlement' | 'Customer' | 'FD' | 'Loan' | 'Central Bank' | 'Security';

export interface BankNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  priority: OperationPriority;
  timestamp: string;
  isRead: boolean;
  referenceId?: string;
}

export const MOCK_NOTIFICATIONS: BankNotification[] = [
  { id: 'NOTIF-001', category: 'Settlement', title: 'CLS Settlement Failure Alert', message: 'Inter-bank transfer TX-240907-007 to VAYU failed settlement. Clearing pool insufficient. Manual intervention required.', priority: 'Critical', timestamp: '2026-09-07 16:45:00', isRead: false, referenceId: 'TX-240907-007' },
  { id: 'NOTIF-002', category: 'Loan', title: 'Loan Application Received', message: 'Housing loan application LN-0006 from Meera Joshi (500,000 ARTH) requires approval.', priority: 'High', timestamp: '2026-09-06 10:00:00', isRead: false, referenceId: 'LN-0006' },
  { id: 'NOTIF-003', category: 'FD', title: 'FD Maturity Alert', message: 'FD-0005 for Lakshmi Iyer matured on 2026-09-05. Credited 106,750 ARTH to ARTH-7740-003.', priority: 'Normal', timestamp: '2026-09-05 00:01:00', isRead: true, referenceId: 'FD-0005' },
  { id: 'NOTIF-004', category: 'Central Bank', title: 'Reserve Requirement Update', message: 'Central Bank has updated the minimum reserve requirement from 8% to 8.5%, effective 2026-10-01.', priority: 'High', timestamp: '2026-09-04 09:00:00', isRead: true },
  { id: 'NOTIF-005', category: 'Customer', title: 'New Customer Registration', message: 'Rohan Kapoor (GOV-AX-88120) registered. KYC verification pending.', priority: 'Normal', timestamp: '2026-09-01 14:22:00', isRead: true, referenceId: 'CUST-0006' },
  { id: 'NOTIF-006', category: 'Transaction', title: 'Large Transfer Alert', message: 'Lakshmi Iyer initiated a 85,000 ARTH inter-bank transfer to STHIRA. Subsequently reversed.', priority: 'High', timestamp: '2026-09-06 14:00:00', isRead: false, referenceId: 'TX-240906-012' },
  { id: 'NOTIF-007', category: 'System', title: 'Scheduled Maintenance Window', message: 'CLS infrastructure maintenance scheduled for 2026-09-15 02:00-04:00 UTC. Inter-bank settlements will be queued.', priority: 'Normal', timestamp: '2026-09-03 11:00:00', isRead: true },
  { id: 'NOTIF-008', category: 'Security', title: 'Suspicious Login Attempt', message: 'Multiple failed login attempts detected for staff account STAFF-003. Account temporarily locked.', priority: 'Critical', timestamp: '2026-09-08 03:15:00', isRead: false },
  { id: 'NOTIF-009', category: 'Loan', title: 'Loan Overdue Alert', message: 'Personal loan LN-0010 for Priya Nair is overdue by 15 days. EMI of 1,325 ARTH unpaid.', priority: 'High', timestamp: '2026-09-08 00:05:00', isRead: false, referenceId: 'LN-0010' },
  { id: 'NOTIF-010', category: 'Central Bank', title: 'Quarterly Compliance Report Due', message: 'Q3 2026 compliance report submission deadline: 2026-09-30. Begin data preparation.', priority: 'Normal', timestamp: '2026-09-01 09:00:00', isRead: true },
];

// ─── Audit Log ────────────────────────────────────────────────────

export type AuditActionType = 'Admin Action' | 'Account Change' | 'Transaction Action' | 'Loan Decision' | 'FD Action' | 'Login/Session' | 'Config Change' | 'Security Event';

export interface AuditEntry {
  id: string;
  actionType: AuditActionType;
  action: string;
  targetType: string;
  targetId: string;
  staffId: string;
  staffName: string;
  timestamp: string;
  beforeValue?: string;
  afterValue?: string;
  ipAddress: string;
  sessionRef: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export const MOCK_AUDIT_LOG: AuditEntry[] = [
  { id: 'AUD-001', actionType: 'Loan Decision', action: 'Loan Application Rejected', targetType: 'Loan', targetId: 'LN-0008', staffId: 'STAFF-001', staffName: 'Ravi Kumar', timestamp: '2026-08-20 11:30:00', beforeValue: 'Under Review', afterValue: 'Rejected', ipAddress: '10.0.1.42', sessionRef: 'SESS-AX-4421', severity: 'Warning' },
  { id: 'AUD-002', actionType: 'Account Change', action: 'Account Suspended', targetType: 'Account', targetId: 'ACC-008', staffId: 'STAFF-001', staffName: 'Ravi Kumar', timestamp: '2026-08-20 08:15:00', beforeValue: 'Active', afterValue: 'Suspended', ipAddress: '10.0.1.42', sessionRef: 'SESS-AX-4418', severity: 'Warning' },
  { id: 'AUD-003', actionType: 'Loan Decision', action: 'Loan Approved & Disbursed', targetType: 'Loan', targetId: 'LN-0005', staffId: 'STAFF-001', staffName: 'Ravi Kumar', timestamp: '2026-09-07 14:10:00', beforeValue: 'Under Review', afterValue: 'Active', ipAddress: '10.0.1.42', sessionRef: 'SESS-AX-5580', severity: 'Info' },
  { id: 'AUD-004', actionType: 'Login/Session', action: 'Staff Login', targetType: 'Staff', targetId: 'STAFF-001', staffId: 'STAFF-001', staffName: 'Ravi Kumar', timestamp: '2026-09-08 07:00:00', ipAddress: '10.0.1.42', sessionRef: 'SESS-AX-5620', severity: 'Info' },
  { id: 'AUD-005', actionType: 'Config Change', action: 'Daily Transfer Limit Updated', targetType: 'Product', targetId: 'PROD-009', staffId: 'STAFF-001', staffName: 'Ravi Kumar', timestamp: '2026-09-02 16:00:00', beforeValue: '75,000 ARTH', afterValue: '100,000 ARTH', ipAddress: '10.0.1.42', sessionRef: 'SESS-AX-5410', severity: 'Info' },
  { id: 'AUD-006', actionType: 'Security Event', action: 'Failed Login Attempt (3x)', targetType: 'Staff', targetId: 'STAFF-003', staffId: 'UNKNOWN', staffName: 'Unknown', timestamp: '2026-09-08 03:15:00', ipAddress: '192.168.1.100', sessionRef: 'SESS-FAILED', severity: 'Critical' },
  { id: 'AUD-007', actionType: 'Transaction Action', action: 'Transaction Reversed', targetType: 'Transaction', targetId: 'TX-240906-012', staffId: 'SYSTEM', staffName: 'CLS Automated', timestamp: '2026-09-06 14:05:00', beforeValue: 'Settling', afterValue: 'Reversed', ipAddress: 'SYSTEM', sessionRef: 'CLS-AUTO', severity: 'Warning' },
  { id: 'AUD-008', actionType: 'FD Action', action: 'FD Maturity Processed', targetType: 'Fixed Deposit', targetId: 'FD-0005', staffId: 'SYSTEM', staffName: 'FD Automated', timestamp: '2026-09-05 00:01:00', beforeValue: 'Active', afterValue: 'Matured', ipAddress: 'SYSTEM', sessionRef: 'FD-AUTO', severity: 'Info' },
  { id: 'AUD-009', actionType: 'Account Change', action: 'Customer Closed', targetType: 'Customer', targetId: 'CUST-0011', staffId: 'STAFF-001', staffName: 'Ravi Kumar', timestamp: '2026-07-15 10:00:00', beforeValue: 'Active', afterValue: 'Closed', ipAddress: '10.0.1.42', sessionRef: 'SESS-AX-4200', severity: 'Info' },
  { id: 'AUD-010', actionType: 'Admin Action', action: 'New Product Created', targetType: 'Product', targetId: 'PROD-010', staffId: 'STAFF-001', staffName: 'Ravi Kumar', timestamp: '2026-08-01 14:00:00', beforeValue: 'N/A', afterValue: 'Inter-bank Transfer Active', ipAddress: '10.0.1.42', sessionRef: 'SESS-AX-4310', severity: 'Info' },
];

// ─── Reports Summary Data ─────────────────────────────────────────

export interface ReportSummary {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export const MOCK_REPORT_CATEGORIES = [
  {
    id: 'deposits',
    name: 'Deposits',
    metrics: [
      { label: 'Total Deposits', value: '18,420,000', change: '+3.2%', isPositive: true },
      { label: 'New Deposits (30d)', value: '1,245,000', change: '+8.1%', isPositive: true },
      { label: 'Avg Deposit Size', value: '42,800', change: '-1.2%', isPositive: false },
    ] as ReportSummary[],
  },
  {
    id: 'transactions',
    name: 'Transactions',
    metrics: [
      { label: 'Monthly Volume', value: '4,218', change: '+12.5%', isPositive: true },
      { label: 'Monthly Value', value: '8,450,000', change: '+6.8%', isPositive: true },
      { label: 'Failed Rate', value: '0.8%', change: '-0.2%', isPositive: true },
      { label: 'Avg Settlement Time', value: '420ms', change: '-15ms', isPositive: true },
    ] as ReportSummary[],
  },
  {
    id: 'interbank',
    name: 'Inter-bank',
    metrics: [
      { label: 'Outbound Volume', value: '892', change: '+4.1%', isPositive: true },
      { label: 'Inbound Volume', value: '1,024', change: '+7.3%', isPositive: true },
      { label: 'Settlement Success', value: '99.2%', change: '+0.1%', isPositive: true },
    ] as ReportSummary[],
  },
  {
    id: 'fd',
    name: 'Fixed Deposits',
    metrics: [
      { label: 'Total FD Value', value: '825,000', change: '+5.4%', isPositive: true },
      { label: 'Active FDs', value: '7', change: '+2', isPositive: true },
      { label: 'Avg Interest Rate', value: '6.62%', change: '0%', isPositive: true },
      { label: 'Maturities Next 90d', value: '2', change: '', isPositive: true },
    ] as ReportSummary[],
  },
  {
    id: 'loans',
    name: 'Loans',
    metrics: [
      { label: 'Total Outstanding', value: '180,000', change: '+32,000', isPositive: false },
      { label: 'Active Loans', value: '6', change: '+1', isPositive: true },
      { label: 'Overdue Rate', value: '10%', change: '+10%', isPositive: false },
      { label: 'Monthly Collections', value: '14,600', change: '+2,800', isPositive: true },
    ] as ReportSummary[],
  },
  {
    id: 'revenue',
    name: 'Revenue & Fees',
    metrics: [
      { label: 'Interest Income', value: '124,800', change: '+8.2%', isPositive: true },
      { label: 'Fee Income', value: '18,400', change: '+3.1%', isPositive: true },
      { label: 'Tax Collected', value: '7,740', change: '+2.4%', isPositive: true },
    ] as ReportSummary[],
  },
];

// ─── Settings / Bank Config ───────────────────────────────────────

export interface BankConfig {
  bankId: string;
  bankName: string;
  established: string;
  branches: number;
  defaultDailyLimit: number;
  defaultMonthlyLimit: number;
  transferFeeInternal: number;
  transferFeeInterBank: number;
  loanProcessingFee: number;
  fdPrematureWithdrawalPenalty: number;
  minSavingsBalance: number;
  minCurrentBalance: number;
  sessionTimeoutMinutes: number;
  passwordPolicyMinLength: number;
  mfaEnabled: boolean;
}

export const MOCK_BANK_CONFIG: BankConfig = {
  bankId: 'nava',
  bankName: 'NAVA Bank',
  established: '2024-01-15',
  branches: 12,
  defaultDailyLimit: 50_000,
  defaultMonthlyLimit: 500_000,
  transferFeeInternal: 5,
  transferFeeInterBank: 25,
  loanProcessingFee: 200,
  fdPrematureWithdrawalPenalty: 1.0,
  minSavingsBalance: 1_000,
  minCurrentBalance: 5_000,
  sessionTimeoutMinutes: 30,
  passwordPolicyMinLength: 12,
  mfaEnabled: true,
};

// ─── Central Bank Policy (Read-Only) ──────────────────────────────

export interface CentralBankPolicy {
  reserveRequirement: number;
  baseInterestRate: number;
  maxLoanToValueRatio: number;
  transactionTaxRate: number;
  interBankSettlementWindow: string;
  complianceReportingFrequency: string;
  lastUpdated: string;
}

export const CENTRAL_BANK_POLICY: CentralBankPolicy = {
  reserveRequirement: 8.5,
  baseInterestRate: 5.00,
  maxLoanToValueRatio: 80,
  transactionTaxRate: 0.1,
  interBankSettlementWindow: 'T+0 (Real-time via CLS)',
  complianceReportingFrequency: 'Quarterly',
  lastUpdated: '2026-09-04',
};

// ─── Helper Functions ─────────────────────────────────────────────

export function getStatusColor(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'Active':
    case 'Completed':
    case 'Approved':
      return { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', border: 'border-[#10B981]/20' };
    case 'Pending':
    case 'Validating':
    case 'Under Review':
    case 'Application':
    case 'KYC Pending':
      return { bg: 'bg-[#A8742A]/10', text: 'text-[#A8742A]', border: 'border-[#A8742A]/20' };
    case 'Processing':
    case 'Settling':
    case 'Finalizing':
    case 'In Progress':
    case 'Authorized':
      return { bg: 'bg-[#3B3278]/10', text: 'text-[#3B3278]', border: 'border-[#3B3278]/20' };
    case 'Failed':
    case 'Rejected':
    case 'Overdue':
    case 'Suspended':
      return { bg: 'bg-[#B5482E]/10', text: 'text-[#B5482E]', border: 'border-[#B5482E]/20' };
    case 'Reversed':
    case 'Cancelled':
    case 'Closed':
      return { bg: 'bg-[#74777F]/10', text: 'text-[#74777F]', border: 'border-[#74777F]/20' };
    case 'Frozen':
    case 'Dormant':
      return { bg: 'bg-[#496C80]/10', text: 'text-[#496C80]', border: 'border-[#496C80]/20' };
    case 'Matured':
    case 'Renewed':
      return { bg: 'bg-[#1E3A5F]/10', text: 'text-[#1E3A5F]', border: 'border-[#1E3A5F]/20' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
  }
}

export function getPriorityColor(priority: OperationPriority): { bg: string; text: string } {
  switch (priority) {
    case 'Critical':
      return { bg: 'bg-[#B5482E]/10', text: 'text-[#B5482E]' };
    case 'High':
      return { bg: 'bg-[#A8742A]/10', text: 'text-[#A8742A]' };
    case 'Normal':
      return { bg: 'bg-[#3B3278]/10', text: 'text-[#3B3278]' };
    case 'Low':
      return { bg: 'bg-[#74777F]/10', text: 'text-[#74777F]' };
  }
}

export function formatArth(amount: number): string {
  return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
