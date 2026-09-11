import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { BankingService } from './banking.service';
import { PrismaService } from '../database/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { AuditService } from '../audit/audit.service';

/**
 * ARTHAX Phase 5: Banking Domain Invariant Verification Suite
 */
async function runBankingTests() {
  console.log('=================================================================');
  console.log('  ARTHAX BANKING DOMAIN — PHASE 5 INVARIANT VERIFICATION SUITE');
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

  const defaultFinHash = await argon2.hash('FinSecret#2026');

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: Canonical 5 Banks & Product Catalogs
  // ---------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Canonical 5 Banks & Products ---');

  const mockPrisma = {
    isConnected: false,
  } as unknown as PrismaService;

  const mockLedger = {} as unknown as LedgerService;
  const mockAudit = {
    logEvent: async () => ({ id: 'AUD-001' } as any),
  } as unknown as AuditService;

  const bankingService = new BankingService(mockPrisma, mockLedger, mockAudit);

  const banks = await bankingService.listBanks();
  const bankIds = banks.map((b) => b.id);

  assert(
    'Exactly 5 canonical banks returned',
    banks.length === 5,
    `Found ${banks.length}`,
  );
  assert(
    'All canonical bank IDs match [nava, samaya, setu, sthira, vayu]',
    ['nava', 'samaya', 'setu', 'sthira', 'vayu'].every((id) => bankIds.includes(id)),
  );
  assert(
    'All 5 banks have status ACTIVE',
    banks.every((b) => b.status === 'ACTIVE'),
  );

  const navaProducts = await bankingService.listBankProducts('nava');
  assert(
    'NAVA bank products catalog returned',
    navaProducts.length >= 2 && navaProducts.some((p) => p.category === 'SAVINGS'),
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Customer Join & Account Provisioning Invariants
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Customer Join & Account Provisioning Invariants ---');

  let createdCustomerData: any = null;
  let createdAccountData: any = null;
  let createdLedgerData: any = null;

  const mockTx = {
    bankCustomer: {
      create: async ({ data }: any) => {
        createdCustomerData = data;
        return { ...data, id: 'cust_001', joinedAt: new Date() };
      },
    },
    bankAccount: {
      create: async ({ data }: any) => {
        createdAccountData = data;
        return {
          ...data,
          id: 'acct_001',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
    },
    ledgerAccount: {
      create: async ({ data }: any) => {
        createdLedgerData = data;
        return {
          ...data,
          id: 'ldg_001',
          createdAt: new Date(),
        };
      },
    },
  };

  const mockPrismaJoin = {
    isConnected: true,
    bankCustomer: {
      findUnique: async () => null, // Not yet a customer
    },
    $transaction: async (fn: any) => fn(mockTx),
  } as unknown as PrismaService;

  const joinService = new BankingService(mockPrismaJoin, mockLedger, mockAudit);
  const joinResult = await joinService.joinBank('usr_test_01', 'nava');

  assert(
    'Customer number follows CUST-<BANK>-XXXX format',
    /^CUST-NAVA-\d{4}$/.test(joinResult.customerNumber),
  );
  assert(
    'Customer status initialized to ACTIVE',
    joinResult.status === 'ACTIVE',
  );
  assert(
    '1 BankAccount automatically created on join',
    createdAccountData && createdAccountData.bankId === 'nava' && createdAccountData.type === 'SAVINGS',
  );
  assert(
    'Exactly 1 matching LedgerAccount created with opening balance = 0n',
    createdLedgerData && createdLedgerData.balanceSnapshot === 0n && createdLedgerData.bankAccountId === 'acct_001',
  );

  // Test 2.2: Duplicate active join rejection
  const mockPrismaDuplicate = {
    isConnected: true,
    bankCustomer: {
      findUnique: async () => ({
        id: 'cust_existing',
        status: 'ACTIVE',
      }),
    },
  } as unknown as PrismaService;

  const dupService = new BankingService(mockPrismaDuplicate, mockLedger, mockAudit);
  try {
    await dupService.joinBank('usr_test_01', 'nava');
    assert('Duplicate customer join rejected', false, 'Should have thrown BadRequestException');
  } catch (e) {
    assert(
      'Duplicate active customer join rejected (BadRequestException)',
      e instanceof BadRequestException && e.message.includes('already an active customer'),
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: Account Opening Invariants & Step-Up Security
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Account Opening & Step-Up Security ---');

  const mockPrismaOpen = {
    isConnected: true,
    user: {
      findUnique: async () => ({
        id: 'usr_test_01',
        financialPasswordHash: defaultFinHash,
      }),
    },
    bankCustomer: {
      findUnique: async () => ({
        id: 'cust_001',
        status: 'ACTIVE',
      }),
    },
    $transaction: async (fn: any) => fn(mockTx),
  } as unknown as PrismaService;

  const openService = new BankingService(mockPrismaOpen, mockLedger, mockAudit);

  // Test 3.1: Valid step-up password creates account
  const openResult = await openService.openAccount('usr_test_01', {
    bankId: 'nava',
    accountType: 'CURRENT',
    purpose: 'Commercial Trading Float',
    financialPassword: 'FinSecret#2026',
  });

  assert(
    'Account successfully opened with step-up verification',
    openResult.type === 'CURRENT' && openResult.purpose === 'Commercial Trading Float',
  );
  assert(
    'New account has balance 0',
    openResult.balanceMinor === '0',
  );

  // Test 3.2: Invalid financial password rejected
  try {
    await openService.openAccount('usr_test_01', {
      bankId: 'nava',
      accountType: 'SAVINGS',
      purpose: 'Savings',
      financialPassword: 'WrongPassword!',
    });
    assert('Invalid financial password rejected', false, 'Should have thrown ForbiddenException');
  } catch (e) {
    assert(
      'Invalid financial password rejected (ForbiddenException)',
      e instanceof ForbiddenException && e.message.includes('Step-up authorization failed'),
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Customer Status Effects on Operations
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Customer Status Effects ---');

  // Test 4.1: Suspended customer cannot open accounts
  const mockPrismaSuspended = {
    isConnected: true,
    user: {
      findUnique: async () => ({
        id: 'usr_test_01',
        financialPasswordHash: defaultFinHash,
      }),
    },
    bankCustomer: {
      findUnique: async () => ({
        id: 'cust_suspended',
        status: 'SUSPENDED',
      }),
    },
  } as unknown as PrismaService;

  const suspendedService = new BankingService(mockPrismaSuspended, mockLedger, mockAudit);
  try {
    await suspendedService.openAccount('usr_test_01', {
      bankId: 'nava',
      accountType: 'SAVINGS',
      purpose: 'Attempt',
      financialPassword: 'FinSecret#2026',
    });
    assert('Suspended customer account opening blocked', false, 'Should have thrown ForbiddenException');
  } catch (e) {
    assert(
      'CUSTOMER SUSPENDED blocks new account opening (ForbiddenException)',
      e instanceof ForbiddenException && e.message.includes('SUSPENDED'),
    );
  }

  // Test 4.2: Closed customer relationship blocks account opening
  const mockPrismaClosed = {
    isConnected: true,
    user: {
      findUnique: async () => ({
        id: 'usr_test_01',
        financialPasswordHash: defaultFinHash,
      }),
    },
    bankCustomer: {
      findUnique: async () => ({
        id: 'cust_closed',
        status: 'CLOSED',
      }),
    },
  } as unknown as PrismaService;

  const closedService = new BankingService(mockPrismaClosed, mockLedger, mockAudit);
  try {
    await closedService.openAccount('usr_test_01', {
      bankId: 'nava',
      accountType: 'SAVINGS',
      purpose: 'Attempt',
      financialPassword: 'FinSecret#2026',
    });
    assert('Closed customer account opening blocked', false, 'Should have thrown ForbiddenException');
  } catch (e) {
    assert(
      'CUSTOMER CLOSED blocks new account opening (ForbiddenException)',
      e instanceof ForbiddenException && e.message.includes('CLOSED'),
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: Intra-Bank Transfers (The Critical Boundary)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Intra-Bank Transfers vs Inter-Bank Boundary ---');

  const sourceAcctNava = {
    id: 'acct_nava_src',
    accountNumber: 'ARTH-NAVA-101',
    bankId: 'nava',
    userId: 'usr_alice',
    status: 'ACTIVE',
    dailyLimitMinor: 5000000n, // 50,000.00 ARTH
    customer: { status: 'ACTIVE' },
    ledgerAccount: { id: 'ldg_nava_src', balanceSnapshot: 1000000n },
  };

  const destAcctNava = {
    id: 'acct_nava_dst',
    accountNumber: 'ARTH-NAVA-202',
    bankId: 'nava', // Same bank
    userId: 'usr_bob',
    status: 'ACTIVE',
    dailyLimitMinor: 5000000n,
    customer: { status: 'ACTIVE' },
    ledgerAccount: { id: 'ldg_nava_dst', balanceSnapshot: 500000n },
  };

  const destAcctSamaya = {
    id: 'acct_samaya_dst',
    accountNumber: 'ARTH-SAMY-303',
    bankId: 'samaya', // Different bank!
    userId: 'usr_charlie',
    status: 'ACTIVE',
    dailyLimitMinor: 5000000n,
    customer: { status: 'ACTIVE' },
    ledgerAccount: { id: 'ldg_samaya_dst', balanceSnapshot: 500000n },
  };

  let ledgerCallPayload: any = null;
  const mockWorkingLedger = {
    recordBalancedTransaction: async (req: any) => {
      ledgerCallPayload = req;
      return {
        id: 'tx_transfer_001',
        referenceNumber: req.referenceNumber,
        status: 'COMPLETED',
        amountMinor: req.amountMinor.toString(),
        entries: req.entries,
      };
    },
  } as unknown as LedgerService;

  const mockPrismaTransfer = {
    isConnected: true,
    user: {
      findUnique: async () => ({
        id: 'usr_alice',
        financialPasswordHash: defaultFinHash,
      }),
    },
    bankAccount: {
      findUnique: async ({ where }: any) => {
        if (where.id === 'acct_nava_src') return sourceAcctNava;
        if (where.accountNumber === 'ARTH-NAVA-101') return sourceAcctNava;
        if (where.accountNumber === 'ARTH-NAVA-202') return destAcctNava;
        if (where.accountNumber === 'ARTH-SAMY-303') return destAcctSamaya;
        return null;
      },
    },
    transaction: {
      findMany: async () => [], // No debits today yet
    },
  } as unknown as PrismaService;

  const transferService = new BankingService(mockPrismaTransfer, mockWorkingLedger, mockAudit);

  // Test 5.1: Intra-bank transfer (NAVA -> NAVA) succeeds
  const transferResult = await transferService.executeIntraBankTransfer(
    'usr_alice',
    {
      sourceAccountId: 'acct_nava_src',
      destinationAccountNumber: 'ARTH-NAVA-202',
      amountMinor: '250000', // 2,500.00 ARTH
      financialPassword: 'FinSecret#2026',
      memo: 'Intra-bank bill split',
    },
    'IDEM-TRANSFER-001',
  );

  assert(
    'Intra-bank transfer (NAVA -> NAVA) succeeds',
    transferResult.success === true,
  );
  assert(
    'Transfer posted through Core Ledger with scope INTERNAL',
    ledgerCallPayload && ledgerCallPayload.scope === 'INTERNAL' && ledgerCallPayload.type === 'TRANSFER',
  );
  assert(
    'Transfer created 2 balanced entries (DEBIT source, CREDIT destination)',
    ledgerCallPayload.entries.length === 2 &&
      ledgerCallPayload.entries[0].entryType === 'DEBIT' &&
      ledgerCallPayload.entries[1].entryType === 'CREDIT',
  );

  // Test 5.2: Inter-bank transfer (NAVA -> SAMAYA) is strictly rejected in Phase 5
  try {
    await transferService.executeIntraBankTransfer(
      'usr_alice',
      {
        sourceAccountId: 'acct_nava_src',
        destinationAccountNumber: 'ARTH-SAMY-303',
        amountMinor: '250000',
        financialPassword: 'FinSecret#2026',
      },
      'IDEM-TRANSFER-002',
    );
    assert('Inter-bank transfer rejected in Phase 5', false, 'Should have thrown BadRequestException');
  } catch (e) {
    assert(
      'Inter-bank transfer (NAVA -> SAMAYA) strictly rejected (requires CLS in Phase 6)',
      e instanceof BadRequestException && e.message.includes('requires Central Settlement Layer (CLS)'),
    );
  }

  // Test 5.3: Self-transfer to same account rejected
  try {
    await transferService.executeIntraBankTransfer(
      'usr_alice',
      {
        sourceAccountId: 'acct_nava_src',
        destinationAccountNumber: 'ARTH-NAVA-101',
        amountMinor: '10000',
        financialPassword: 'FinSecret#2026',
      },
      'IDEM-TRANSFER-003',
    );
    assert('Self-transfer rejected', false, 'Should have thrown BadRequestException');
  } catch (e) {
    assert(
      'Self-transfer to same account rejected (BadRequestException)',
      e instanceof BadRequestException && e.message.includes('same account'),
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: Cumulative Daily Limit Enforcement
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Cumulative Daily Limit Enforcement ---');

  // Daily limit is 50,000.00 ARTH (5,000,000 minor units).
  // Mock that 45,000.00 ARTH (4,500,000 minor units) has already been transferred today.
  const mockPrismaLimits = {
    isConnected: true,
    user: {
      findUnique: async () => ({
        id: 'usr_alice',
        financialPasswordHash: defaultFinHash,
      }),
    },
    bankAccount: {
      findUnique: async ({ where }: any) => {
        if (where.id === 'acct_nava_src') return sourceAcctNava;
        if (where.accountNumber === 'ARTH-NAVA-202') return destAcctNava;
        return null;
      },
    },
    transaction: {
      findMany: async () => [
        { amountMinor: 4500000n }, // 45,000 ARTH already debited today
      ],
    },
  } as unknown as PrismaService;

  const limitService = new BankingService(mockPrismaLimits, mockWorkingLedger, mockAudit);

  // Attempting to transfer 6,000.00 ARTH (600,000 minor units) -> 45,000 + 6,000 = 51,000 > 50,000 limit!
  try {
    await limitService.executeIntraBankTransfer(
      'usr_alice',
      {
        sourceAccountId: 'acct_nava_src',
        destinationAccountNumber: 'ARTH-NAVA-202',
        amountMinor: '600000',
        financialPassword: 'FinSecret#2026',
      },
      'IDEM-TRANSFER-004',
    );
    assert('Cumulative daily limit enforced', false, 'Should have thrown BadRequestException');
  } catch (e) {
    assert(
      'Cumulative daily limit enforced (4,500,000 + 600,000 > 5,000,000 limit)',
      e instanceof BadRequestException && e.message.includes('Cumulative daily limit exceeded'),
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: Defense-in-Depth Bank Admin Scoping
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Defense-in-Depth Bank Admin Scoping ---');

  const mockPrismaAdmin = {
    isConnected: true,
    bankCustomer: {
      findUnique: async ({ where }: any) => {
        if (where.id === 'cust_samaya_01') {
          return { id: 'cust_samaya_01', bankId: 'samaya', customerNumber: 'CUST-SAMY-01' };
        }
        if (where.id === 'cust_nava_01') {
          return { id: 'cust_nava_01', bankId: 'nava', customerNumber: 'CUST-NAVA-01' };
        }
        return null;
      },
    },
    bankAccount: {
      findUnique: async ({ where }: any) => {
        if (where.id === 'acct_samaya_01') {
          return { id: 'acct_samaya_01', bankId: 'samaya', accountNumber: 'ARTH-SAMY-001' };
        }
        if (where.id === 'acct_nava_01') {
          return { id: 'acct_nava_01', bankId: 'nava', accountNumber: 'ARTH-NAVA-001' };
        }
        return null;
      },
      update: async ({ data }: any) => ({
        id: 'acct_nava_01',
        bankId: 'nava',
        accountNumber: 'ARTH-NAVA-001',
        customerId: 'cust_nava_01',
        userId: 'usr_test_01',
        type: 'SAVINGS',
        purpose: 'Sovereign Treasury',
        dailyLimitMinor: 5000000n,
        monthlyLimitMinor: 50000000n,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
        ledgerAccount: { balanceSnapshot: 1000n },
      }),
    },
  } as unknown as PrismaService;

  const adminService = new BankingService(mockPrismaAdmin, mockWorkingLedger, mockAudit);

  // Test 7.1: NAVA admin accessing SAMAYA customer is rejected inside service layer
  try {
    await adminService.getBankAdminCustomer('nava', 'cust_samaya_01');
    assert('Cross-bank customer access rejected', false, 'Should have thrown ForbiddenException');
  } catch (e) {
    assert(
      'Cross-bank customer query rejected inside service layer (ForbiddenException)',
      e instanceof ForbiddenException && e.message.includes('Cross-bank authorization rejected'),
    );
  }

  // Test 7.2: NAVA admin updating SAMAYA account status is rejected inside service layer
  try {
    await adminService.updateBankAccountStatus('nava', 'acct_samaya_01', { status: 'FROZEN' });
    assert('Cross-bank account mutation rejected', false, 'Should have thrown ForbiddenException');
  } catch (e) {
    assert(
      'Cross-bank account mutation rejected inside service layer (ForbiddenException)',
      e instanceof ForbiddenException && e.message.includes('Cross-bank authorization rejected'),
    );
  }

  // Test 7.3: NAVA admin updating NAVA account status succeeds
  const updatedNavaAcct = await adminService.updateBankAccountStatus('nava', 'acct_nava_01', {
    status: 'FROZEN',
  });
  assert(
    'Authorized bank admin successfully updates assigned bank account status',
    updatedNavaAcct.status === 'FROZEN',
  );

  // ---------------------------------------------------------------------------
  // Final Scoreboard
  // ---------------------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runBankingTests().catch((err) => {
  console.error('Fatal banking test error:', err);
  process.exit(1);
});
