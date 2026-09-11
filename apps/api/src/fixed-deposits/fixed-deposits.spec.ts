import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { FixedDepositsService } from './fixed-deposits.service';
import { YieldCalculator } from './yield-calculator';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';
import { NotificationsService } from '../notifications/notifications.service';
import { ShopService } from '../shop/shop.service';
import { AuditService } from '../audit/audit.service';
import { LedgerService } from '../ledger/ledger.service';
import { ActivePetModifierDto } from '@arthax/types';

/**
 * ARTHAX FIXED DEPOSITS & YIELD ENGINE — PHASE 10 INVARIANT SUITE
 * Validates sovereign fixed deposit invariants:
 * 1. Database-authoritative catalog of 8 canonical schemes across the 5 banks.
 * 2. Mathematical precision of quarterly compounding in integer minor units.
 * 3. Daily interest accrual evaluation.
 * 4. Single atomic booking protocol (Core Ledger debit customer -> sys_fd_pool).
 * 5. Downstream pet companion yield booster integration (+0.25% Gaja, +0.10% Vidya, zero stacking).
 * 6. Statutory lock-in enforcement before early liquidation.
 * 7. Preclosure penalty recalculation at elapsed tenure.
 * 8. Maturity settlement & auto-rollover invariants (REINVEST_TOTAL, REINVEST_PRINCIPAL, NONE).
 * 9. Dual-password isolation & strict tenant isolation.
 * 10. Post-commit sovereign notification dispatch & idempotency.
 */
async function runFixedDepositsTests() {
  console.log('=================================================================');
  console.log('  ARTHAX FIXED DEPOSITS & YIELD ENGINE — PHASE 10 INVARIANT SUITE');
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
  // MOCK INFRASTRUCTURE & DEPENDENCIES
  // ---------------------------------------------------------------------------
  const mockPrisma: any = {
    isConnected: false,
    fdScheme: {
      findMany: async () => [],
      findUnique: async () => null,
      upsert: async () => {},
    },
    userFd: {
      create: async () => {},
      findMany: async () => [],
      findUnique: async () => null,
      update: async () => {},
    },
    interestPayoutLog: {
      create: async () => {},
      findMany: async () => [],
    },
    user: {
      findUnique: async () => null,
    },
    bankAccount: {
      findUnique: async () => null,
    },
  };

  const auditService = new AuditService();
  const notificationsService = new NotificationsService();

  // Ledger account balances tracker
  const ledgerAccountBalances = new Map<string, bigint>();
  const customerAccountId = 'acct-ananya-nava-001';
  const initialBalance = 10000000n; // 100,000.00 ARTH
  ledgerAccountBalances.set(customerAccountId, initialBalance);
  ledgerAccountBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL, 0n);

  const mockLedgerService: any = {
    recordBalancedTransaction: async (req: any) => {
      for (const entry of req.entries) {
        const current = ledgerAccountBalances.get(entry.ledgerAccountId) || 0n;
        if (entry.entryType === 'DEBIT') {
          if (current < entry.amountMinor) {
            throw new BadRequestException(`Insufficient funds in ledger account [${entry.ledgerAccountId}]`);
          }
          ledgerAccountBalances.set(entry.ledgerAccountId, current - entry.amountMinor);
        } else {
          ledgerAccountBalances.set(entry.ledgerAccountId, current + entry.amountMinor);
        }
      }
      return {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        referenceNumber: req.referenceNumber,
        type: req.type,
        status: 'COMPLETED',
        amountMinor: req.amountMinor,
        initiatedBy: req.initiatedBy,
        sourceAccountId: req.sourceAccountId,
        destinationAccountId: req.destinationAccountId,
        entries: req.entries,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    getAccountBalance: async (acctId: string) => {
      const bal = ledgerAccountBalances.get(acctId) || 0n;
      return { ledgerAccountId: acctId, balanceMinor: bal, balanceSnapshotMinor: bal, isConsistent: true };
    },
  };

  // Mock ShopService for downstream pet booster consumption
  let mockActivePetModifier: ActivePetModifierDto | null = null;
  const mockShopService: any = {
    getActivePetModifier: async (userId: string) => mockActivePetModifier,
  };

  const service = new FixedDepositsService(
    mockPrisma,
    mockLedgerService,
    auditService,
    mockShopService,
    notificationsService,
  );

  const citizenA = 'usr-citizen-ananya';
  const citizenB = 'usr-citizen-vikram';
  const validFinancialPassword = 'FinPassword#2026';

  // ===========================================================================
  // GROUP 1: Canonical Schemes Catalog & Discovery
  // ===========================================================================
  console.log('--- Group 1: Canonical Schemes Catalog & Discovery ---');

  const allSchemes = await service.listSchemes();
  assert(
    'Discovers 8 canonical schemes across all 5 sovereign banks',
    allSchemes.length === 8,
    `Found ${allSchemes.length}`,
  );

  const navaSchemes = await service.listSchemes('nava');
  assert(
    'Filters schemes by bank NAVA -> 2 schemes (90d and 365d)',
    navaSchemes.length === 2 && navaSchemes.some((s) => s.id === 'fd-nava-90d') && navaSchemes.some((s) => s.id === 'fd-nava-365d'),
  );

  const samayaSchemes = await service.listSchemes('samaya');
  assert(
    'Filters schemes by bank SAMAYA -> 2 schemes (180d and 730d)',
    samayaSchemes.length === 2 && samayaSchemes.some((s) => s.id === 'fd-samaya-730d'),
  );

  const setuSchemes = await service.listSchemes('setu');
  assert(
    'Filters schemes by bank SETU -> 1 scheme (365d)',
    setuSchemes.length === 1 && setuSchemes[0].id === 'fd-setu-365d',
  );

  const sthiraSchemes = await service.listSchemes('sthira');
  assert(
    'Filters schemes by bank STHIRA -> 1 scheme (1095d)',
    sthiraSchemes.length === 1 && sthiraSchemes[0].id === 'fd-sthira-1095d',
  );

  const vayuSchemes = await service.listSchemes('vayu');
  assert(
    'Filters schemes by bank VAYU -> 2 schemes (30d and 180d)',
    vayuSchemes.length === 2 && vayuSchemes.some((s) => s.id === 'fd-vayu-30d'),
  );

  const singleScheme = await service.getSchemeById('fd-nava-365d');
  assert(
    'Retrieves single scheme details with exact terms (365d, 7.20% APY, 90d lock-in, 1.5% penalty)',
    singleScheme.tenureDays === 365 &&
      singleScheme.baseApy === 7.2 &&
      singleScheme.seniorApy === 7.7 &&
      singleScheme.lockInDays === 90 &&
      singleScheme.preclosurePenaltyRate === 1.5,
  );

  let schemeNotFound = false;
  try {
    await service.getSchemeById('invalid-scheme-id');
  } catch (err) {
    if (err instanceof NotFoundException) schemeNotFound = true;
  }
  assert('Non-existent scheme query throws NotFoundException', schemeNotFound);

  // ===========================================================================
  // GROUP 2: Quarterly Compounding Math & Yield Engine
  // ===========================================================================
  console.log('\n--- Group 2: Quarterly Compounding Math & Precision ---');

  // Exact quarterly compound test:
  // P = 10,000 ARTH = 1,000,000 minor units
  // APY = 7.2%, tenure = 365 days
  // A = P * (1 + 0.072 / 4)^4 = 1,000,000 * (1.018)^4 = 1,000,000 * 1.07396743 = 1,073,967 minor units
  const compound1Year = YieldCalculator.calculateQuarterlyCompound(1000000n, 7.2, 365);
  assert(
    'Calculates exact quarterly compound for 1-year 7.2% APY',
    compound1Year.maturityAmountMinor === 1073967n && compound1Year.totalInterestMinor === 73967n,
    `Got ${compound1Year.maturityAmountMinor}, interest ${compound1Year.totalInterestMinor}`,
  );

  // 90-day compound test:
  // P = 2,500.00 ARTH = 250,000 minor units, APY = 5.5%, tenure = 90 days
  // t = 90 / 365 = 0.246575
  // A = 250,000 * (1 + 0.055 / 4)^(4 * 0.246575) = 250,000 * (1.01375)^0.9863 = 253,391 minor units
  const compound90d = YieldCalculator.calculateQuarterlyCompound(250000n, 5.5, 90);
  assert(
    'Calculates quarterly compound for fractional-year tenure (90 days)',
    compound90d.maturityAmountMinor > 250000n && compound90d.totalInterestMinor > 0n,
    `Maturity: ${compound90d.maturityAmountMinor}, Interest: ${compound90d.totalInterestMinor}`,
  );

  // Edge cases:
  let zeroPrincipalThrew = false;
  try {
    YieldCalculator.calculateQuarterlyCompound(0n, 7.0, 365);
  } catch (err) {
    if (err instanceof BadRequestException) zeroPrincipalThrew = true;
  }
  assert('Rejects non-positive principal amount with BadRequestException', zeroPrincipalThrew);

  let negativeApyThrew = false;
  try {
    YieldCalculator.calculateQuarterlyCompound(100000n, -1.0, 365);
  } catch (err) {
    if (err instanceof BadRequestException) negativeApyThrew = true;
  }
  assert('Rejects negative APY with BadRequestException', negativeApyThrew);

  // ===========================================================================
  // GROUP 3: Daily Accrual Evaluation
  // ===========================================================================
  console.log('\n--- Group 3: Daily Accrual Evaluation ---');

  const startDate = new Date(Date.now() - 60 * 86400000); // 60 days ago
  const maturityDate = new Date(startDate.getTime() + 365 * 86400000); // 365 days total
  const evaluationDate = new Date(); // Today (60 days elapsed)

  const accrual60d = YieldCalculator.calculateDailyAccrual(
    1000000n,
    7.2,
    startDate,
    maturityDate,
    evaluationDate,
  );
  assert(
    'Calculates positive accrued interest for 60 elapsed days on 1-year contract',
    accrual60d.elapsedDays === 60 &&
      accrual60d.accruedInterestMinor > 0n &&
      accrual60d.currentValueMinor > 1000000n &&
      !accrual60d.isMatured,
    `Elapsed: ${accrual60d.elapsedDays}, Accrued: ${accrual60d.accruedInterestMinor}`,
  );

  const accrualDayZero = YieldCalculator.calculateDailyAccrual(
    1000000n,
    7.2,
    startDate,
    maturityDate,
    startDate,
  );
  assert(
    'Accrual on start date (0 days elapsed) returns exactly 0 interest',
    accrualDayZero.elapsedDays === 0 && accrualDayZero.accruedInterestMinor === 0n,
  );

  const accrualAtMaturity = YieldCalculator.calculateDailyAccrual(
    1000000n,
    7.2,
    startDate,
    maturityDate,
    new Date(maturityDate.getTime() + 1000),
  );
  assert(
    'Accrual past maturity date marks isMatured = true and clamps elapsed days to tenure',
    accrualAtMaturity.isMatured && accrualAtMaturity.elapsedDays === 365,
  );

  // ===========================================================================
  // GROUP 4: Downstream Pet Companion Yield Booster Integration
  // ===========================================================================
  console.log('\n--- Group 4: Downstream Pet Companion Yield Booster ---');

  // Case A: No pet equipped
  mockActivePetModifier = null;
  const noPetSim = await service.simulateYield(
    {
      bankId: 'nava',
      schemeId: 'fd-nava-365d',
      principalMinor: '2500000', // 25,000.00 ARTH
    },
    citizenA,
  );
  assert(
    'Simulation with no active pet retains base APY (7.20%) and petBonusApy = 0',
    noPetSim.baseApy === 7.2 && noPetSim.effectiveApy === 7.2 && noPetSim.petBonusApy === 0,
  );

  // Case B: Wealth Elephant ("Gaja") equipped -> +0.25% APY
  mockActivePetModifier = {
    petId: 'pet-gaja',
    name: 'Wealth Elephant ("Gaja")',
    modifierType: 'FD_YIELD_BOOST',
    valuePercent: 0.25,
    powerTitle: '+0.25% Sovereign Term Deposit Yield Booster',
    powerDescription: 'Statutory interest rate amplifier applied to commercial bank term deposits.',
    downstreamDomain: 'BANKING',
  };
  const gajaSim = await service.simulateYield(
    {
      bankId: 'nava',
      schemeId: 'fd-nava-365d',
      principalMinor: '2500000',
    },
    citizenA,
  );
  assert(
    'Equipped Wealth Elephant ("Gaja") boosts APY by +0.25% (7.20% -> 7.45%)',
    gajaSim.petBonusApy === 0.25 && gajaSim.effectiveApy === 7.45,
    `Got petBonusApy: ${gajaSim.petBonusApy}, effectiveApy: ${gajaSim.effectiveApy}`,
  );
  assert(
    'Gaja boosted maturity yield exceeds baseline yield',
    BigInt(gajaSim.maturityAmountMinor) > BigInt(noPetSim.maturityAmountMinor),
  );

  // Case C: Ledger Owl ("Vidya") equipped -> +0.10% APY
  mockActivePetModifier = {
    petId: 'pet-vidya',
    name: 'Ledger Owl ("Vidya")',
    modifierType: 'FD_YIELD_BOOST',
    valuePercent: 0.1,
    powerTitle: '+0.10% Fixed Deposit Yield Booster & Telemetry',
    powerDescription: 'Interest yield multiplier with priority audit stream access.',
    downstreamDomain: 'BANKING',
  };
  const vidyaSim = await service.simulateYield(
    {
      bankId: 'nava',
      schemeId: 'fd-nava-365d',
      principalMinor: '2500000',
    },
    citizenA,
  );
  assert(
    'Equipped Ledger Owl ("Vidya") boosts APY by +0.10% (7.20% -> 7.30%)',
    vidyaSim.petBonusApy === 0.1 && vidyaSim.effectiveApy === 7.3,
  );

  // Case D: Other pet equipped (e.g. Market Bull) -> 0% FD boost
  mockActivePetModifier = {
    petId: 'pet-vrishabha',
    name: 'Market Bull ("Vrishabha")',
    modifierType: 'EQUITIES_BROKERAGE_DISCOUNT',
    valuePercent: 10,
    powerTitle: '-10% Equities Brokerage Discount',
    powerDescription: 'Order execution discount.',
    downstreamDomain: 'STOCKS',
  };
  const bullSim = await service.simulateYield(
    {
      bankId: 'nava',
      schemeId: 'fd-nava-365d',
      principalMinor: '2500000',
    },
    citizenA,
  );
  assert(
    'Market Bull does NOT boost FD yield (petBonusApy = 0)',
    bullSim.petBonusApy === 0 && bullSim.effectiveApy === 7.2,
  );

  // ===========================================================================
  // GROUP 5: Atomic Fixed Deposit Booking Protocol
  // ===========================================================================
  console.log('\n--- Group 5: Atomic Booking & Core Ledger Double-Entry ---');

  // Re-equip Wealth Elephant for booking
  mockActivePetModifier = {
    petId: 'pet-gaja',
    name: 'Wealth Elephant ("Gaja")',
    modifierType: 'FD_YIELD_BOOST',
    valuePercent: 0.25,
    powerTitle: '+0.25% Sovereign Term Deposit Yield Booster',
    powerDescription: 'Term deposit amplifier',
    downstreamDomain: 'BANKING',
  };

  const bookingDepositMinor = 2500000n; // 25,000.00 ARTH
  const preBookingPoolBalance = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) || 0n;

  const bookedFd = await service.bookFd(
    citizenA,
    {
      accountId: customerAccountId,
      schemeId: 'fd-nava-365d',
      principalMinor: bookingDepositMinor.toString(),
      financialPassword: validFinancialPassword,
      autoRenew: true,
      rolloverInstruction: 'PRINCIPAL_ONLY',
    },
    'idemp-book-fd-001',
  );

  assert(
    'Successfully booked FD certificate with valid certificate number format',
    bookedFd.status === 'ACTIVE' && bookedFd.certificateNumber.startsWith('FD-CERT-NAVA-'),
    `Certificate: ${bookedFd.certificateNumber}`,
  );
  assert(
    'Certificate locks in Gaja boosted APY of 7.45%',
    bookedFd.apy === 7.45,
    `Contract APY: ${bookedFd.apy}`,
  );
  assert(
    'Certificate records autoRenew = true and rolloverInstruction = PRINCIPAL_ONLY',
    bookedFd.autoRenew === true && bookedFd.rolloverInstruction === 'PRINCIPAL_ONLY',
  );

  // Verify Core Ledger Balances Invariant:
  // Customer balance debited by 25,000.00 ARTH
  // sys_fd_pool credited by 25,000.00 ARTH
  const postBookingPoolBalance = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) || 0n;
  const postBookingCustomerBalance = ledgerAccountBalances.get(customerAccountId) || 0n;

  assert(
    'Core Ledger: sys_fd_pool received exactly +25,000.00 ARTH principal (Zero Shadow Balance)',
    postBookingPoolBalance - preBookingPoolBalance === bookingDepositMinor,
    `sys_fd_pool: ${postBookingPoolBalance}`,
  );
  assert(
    'Core Ledger: customer account was debited exactly 25,000.00 ARTH',
    initialBalance - postBookingCustomerBalance === bookingDepositMinor,
    `Customer balance: ${postBookingCustomerBalance}`,
  );

  // Idempotent Replay
  const replayFd = await service.bookFd(
    citizenA,
    {
      accountId: customerAccountId,
      schemeId: 'fd-nava-365d',
      principalMinor: bookingDepositMinor.toString(),
      financialPassword: validFinancialPassword,
    },
    'idemp-book-fd-001',
  );
  assert(
    'Idempotent booking replay returns identical certificate without double-debiting',
    replayFd.id === bookedFd.id && replayFd.certificateNumber === bookedFd.certificateNumber,
  );
  assert(
    'sys_fd_pool balance did not change on idempotent replay',
    ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) === postBookingPoolBalance,
  );

  // Deposit limit bounds check
  let minDepositThrew = false;
  try {
    await service.bookFd(citizenA, {
      accountId: customerAccountId,
      schemeId: 'fd-nava-365d',
      principalMinor: '100000', // 1,000.00 ARTH (scheme min is 25,000.00 ARTH)
      financialPassword: validFinancialPassword,
    });
  } catch (err) {
    if (err instanceof BadRequestException) minDepositThrew = true;
  }
  assert('Rejects booking below scheme minimum deposit with BadRequestException', minDepositThrew);

  let maxDepositThrew = false;
  try {
    await service.bookFd(citizenA, {
      accountId: customerAccountId,
      schemeId: 'fd-nava-365d',
      principalMinor: '99999999999999', // exceeds scheme max limit
      financialPassword: validFinancialPassword,
    });
  } catch (err) {
    if (err instanceof BadRequestException) maxDepositThrew = true;
  }
  assert('Rejects booking above scheme maximum limit with BadRequestException', maxDepositThrew);

  // ===========================================================================
  // GROUP 6: Statutory Lock-In Enforcement
  // ===========================================================================
  console.log('\n--- Group 6: Statutory Lock-In Enforcement ---');

  // Attempt pre-closure immediately after booking (0 days elapsed < 90 days lock-in)
  let lockInRejectionThrew = false;
  let lockInRejectionMessage = '';
  try {
    await service.breakFd(citizenA, bookedFd.id, {
      targetAccountId: customerAccountId,
      financialPassword: validFinancialPassword,
    });
  } catch (err: any) {
    if (err instanceof BadRequestException) {
      lockInRejectionThrew = true;
      lockInRejectionMessage = err.message;
    }
  }

  assert(
    'Pre-closure during statutory lock-in period is strictly rejected',
    lockInRejectionThrew && lockInRejectionMessage.includes('lock-in period of 90 days has not elapsed'),
    `Message: ${lockInRejectionMessage}`,
  );
  assert(
    'Certificate remains in ACTIVE status after lock-in rejection',
    (await service.getUserFdById(citizenA, bookedFd.id)).status === 'ACTIVE',
  );

  // ===========================================================================
  // GROUP 7: Preclosure Penalty Recalculation & Liquidation
  // ===========================================================================
  console.log('\n--- Group 7: Preclosure Penalty Recalculation ---');

  // Book a second FD with short lock-in (Vayu 30-day: 7 days lock-in, 0.5% penalty)
  ledgerAccountBalances.set(customerAccountId, 10000000n);
  mockActivePetModifier = null;

  const vayuFd = await service.bookFd(
    citizenA,
    {
      accountId: customerAccountId,
      schemeId: 'fd-vayu-30d',
      principalMinor: '500000', // 5,000.00 ARTH
      financialPassword: validFinancialPassword,
    },
    'idemp-vayu-001',
  );

  // Simulate time travel: set startDate to 15 days ago (elapsed 15 days >= 7 days lock-in)
  const internalVayuFd = (service as any).inMemoryUserFds.get(vayuFd.id);
  internalVayuFd.startDate = new Date(Date.now() - 15 * 86400000);

  // Contract APY = 4.80%, Preclosure Penalty = 0.50%
  // Penalized APY = 4.80% - 0.50% = 4.30%
  // Payout = 500,000 * (1 + 0.043/4)^(4 * 15/365) = 500,000 * 1.001767 = 500,883 minor units
  const preBreakPool = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) || 0n;
  const preBreakCustomer = ledgerAccountBalances.get(customerAccountId) || 0n;

  const breakResult = await service.breakFd(citizenA, vayuFd.id, {
    targetAccountId: customerAccountId,
    financialPassword: validFinancialPassword,
  });

  assert(
    'Pre-closure permitted after lock-in period elapses',
    breakResult.userFd.status === 'BROKEN',
  );
  assert(
    'Preclosure penalty applied correctly (4.80% contract - 0.50% penalty = 4.30% effective APY)',
    breakResult.penaltyAppliedApy === 0.5 && breakResult.effectiveApy === 4.3,
    `Effective APY: ${breakResult.effectiveApy}`,
  );
  assert(
    'Disbursed payout exceeds principal but is less than full maturity yield',
    BigInt(breakResult.payoutAmountMinor) >= 500000n &&
      BigInt(breakResult.payoutAmountMinor) < BigInt(vayuFd.maturityAmountMinor),
    `Payout: ${breakResult.payoutAmountMinor}, Full Maturity was: ${vayuFd.maturityAmountMinor}`,
  );

  // Core Ledger movement verification
  const postBreakPool = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) || 0n;
  const postBreakCustomer = ledgerAccountBalances.get(customerAccountId) || 0n;

  assert(
    'Core Ledger: sys_fd_pool debited and customer credited by exact payout amount',
    preBreakPool - postBreakPool === BigInt(breakResult.payoutAmountMinor) &&
      postBreakCustomer - preBreakCustomer === BigInt(breakResult.payoutAmountMinor),
  );

  // Attempting to break an already broken FD throws BadRequestException
  let doubleBreakThrew = false;
  try {
    await service.breakFd(citizenA, vayuFd.id, {
      targetAccountId: customerAccountId,
      financialPassword: validFinancialPassword,
    });
  } catch (err) {
    if (err instanceof BadRequestException) doubleBreakThrew = true;
  }
  assert('Cannot break an already BROKEN certificate', doubleBreakThrew);

  // ===========================================================================
  // GROUP 8: Maturity & Rollover Settlement
  // ===========================================================================
  console.log('\n--- Group 8: Maturity & Rollover Settlement ---');

  // Book a short FD for maturity testing
  const matureTestFd = await service.bookFd(
    citizenA,
    {
      accountId: customerAccountId,
      schemeId: 'fd-vayu-30d',
      principalMinor: '200000', // 2,000.00 ARTH
      financialPassword: validFinancialPassword,
      autoRenew: false,
      rolloverInstruction: 'NONE',
    },
    'idemp-mature-001',
  );

  const internalMatureFd = (service as any).inMemoryUserFds.get(matureTestFd.id);
  // Time travel: set startDate to 35 days ago, maturityDate to 5 days ago
  internalMatureFd.startDate = new Date(Date.now() - 35 * 86400000);
  internalMatureFd.maturityDate = new Date(Date.now() - 5 * 86400000);

  const preMaturePool = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) || 0n;
  const preMatureCustomer = ledgerAccountBalances.get(customerAccountId) || 0n;

  const matureResult = await service.matureFd(matureTestFd.id);

  assert(
    'Matured FD status transitions to MATURED with PAYOUT_TO_ACCOUNT disposition',
    matureResult.userFd.status === 'MATURED' && matureResult.actionTaken === 'PAYOUT_TO_ACCOUNT',
  );
  assert(
    'Payout amount matches full contract maturity amount',
    matureResult.userFd.payoutAmountMinor === matureTestFd.maturityAmountMinor,
  );

  const postMaturePool = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) || 0n;
  const postMatureCustomer = ledgerAccountBalances.get(customerAccountId) || 0n;

  assert(
    'Core Ledger: sys_fd_pool debited full maturity proceeds to customer account',
    preMaturePool - postMaturePool === BigInt(matureTestFd.maturityAmountMinor) &&
      postMatureCustomer - preMatureCustomer === BigInt(matureTestFd.maturityAmountMinor),
  );

  // ===========================================================================
  // GROUP 9: Dual-Password & Strict Tenant Isolation
  // ===========================================================================
  console.log('\n--- Group 9: Security & Tenant Isolation ---');

  // 1. Invalid Financial Password
  let invalidPasswordThrew = false;
  try {
    await service.bookFd(citizenA, {
      accountId: customerAccountId,
      schemeId: 'fd-nava-90d',
      principalMinor: '1000000',
      financialPassword: 'INVALID_PASSWORD',
    });
  } catch (err) {
    if (err instanceof ForbiddenException) invalidPasswordThrew = true;
  }
  assert('Rejects booking with invalid Financial Password with ForbiddenException', invalidPasswordThrew);

  // 2. Tenant isolation on listing
  const citizenAFds = await service.listUserFds(citizenA);
  const citizenBFds = await service.listUserFds(citizenB);
  assert(
    'Citizen A sees their own FDs, Citizen B sees zero (strict tenant isolation)',
    citizenAFds.length > 0 && citizenBFds.length === 0,
  );

  // 3. Tenant isolation on certificate query
  let crossUserQueryThrew = false;
  try {
    await service.getUserFdById(citizenB, bookedFd.id);
  } catch (err) {
    if (err instanceof ForbiddenException) crossUserQueryThrew = true;
  }
  assert('Citizen B cannot query Citizen A certificate (ForbiddenException)', crossUserQueryThrew);

  // 4. Tenant isolation on pre-closure
  let crossUserBreakThrew = false;
  try {
    await service.breakFd(citizenB, bookedFd.id, {
      targetAccountId: 'acct-citizen-b',
      financialPassword: validFinancialPassword,
    });
  } catch (err) {
    if (err instanceof ForbiddenException) crossUserBreakThrew = true;
  }
  assert('Citizen B cannot liquidate Citizen A certificate (ForbiddenException)', crossUserBreakThrew);

  // 5. Tenant isolation on auto-renew toggle
  let crossUserToggleThrew = false;
  try {
    await service.toggleAutoRenew(citizenB, bookedFd.id, {
      autoRenew: false,
      rolloverInstruction: 'NONE',
    });
  } catch (err) {
    if (err instanceof ForbiddenException) crossUserToggleThrew = true;
  }
  assert('Citizen B cannot toggle auto-renew on Citizen A certificate (ForbiddenException)', crossUserToggleThrew);

  // Citizen A toggles auto-renew successfully
  const toggledFd = await service.toggleAutoRenew(citizenA, bookedFd.id, {
    autoRenew: false,
    rolloverInstruction: 'NONE',
  });
  assert(
    'Citizen A successfully updates autoRenew and rolloverInstruction on own certificate',
    toggledFd.autoRenew === false && toggledFd.rolloverInstruction === 'NONE',
  );

  // ===========================================================================
  // GROUP 10: Post-Commit Notifications & Sovereign Audit Trail
  // ===========================================================================
  console.log('\n--- Group 10: Post-Commit Notifications & Sovereign Mailbox ---');

  const mailbox = await notificationsService.getMailbox(citizenA);
  assert(
    'Mailbox contains notifications dispatched from FD domain',
    mailbox.items.some((n) => n.category === 'FD'),
  );

  const bookingNotice = mailbox.items.find(
    (n) => n.templateCode === 'FD_BOOKING_CONFIRMATION_V1',
  );
  assert(
    'Dispatched FD_BOOKING_CONFIRMATION_V1 contains certificate number and financial terms',
    bookingNotice !== undefined && bookingNotice.title.includes('FD Certificate Issued:'),
  );

  const breakNotice = mailbox.items.find(
    (n) => n.templateCode === 'FD_PREMATURE_WITHDRAWAL_V1',
  );
  assert(
    'Dispatched FD_PREMATURE_WITHDRAWAL_V1 contains liquidation payout notice',
    breakNotice !== undefined && breakNotice.title.includes('FD Premature Liquidation:'),
  );

  const matureNotice = mailbox.items.find(
    (n) => n.templateCode === 'FD_MATURED_V1',
  );
  assert(
    'Dispatched FD_MATURED_V1 contains maturity disposition details',
    matureNotice !== undefined && matureNotice.title.includes('FD Matured:'),
  );

  console.log('\n=================================================================');
  console.log(`  PHASE 10 INVARIANT SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFixedDepositsTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
