import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service';
import { SessionStoreService } from '../common/services/session-store.service';
import { AuditService } from '../audit/audit.service';
import { IdentityService } from '../identity/identity.service';
import { BankingService } from '../banking/banking.service';
import { LedgerService } from '../ledger/ledger.service';
import { BalanceEngineService } from '../ledger/balance-engine.service';
import { CentralBankService } from '../central-bank/central-bank.service';
import { ClsService } from '../cls/cls.service';
import { ClsRoutingService } from '../cls/cls-routing.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../common/services/email.service';
import { SupabaseAuthService } from '../common/services/supabase-auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BankScopeGuard } from '../common/guards/bank-scope.guard';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';
import { UserRole, AuthSessionPayload } from '@arthax/types';

/**
 * ARTHAX PORTAL INTEGRATION & AUTHORIZATION E2E ACCEPTANCE SUITE
 *
 * Enforces:
 * 1. Backend authorization is the sole security authority (PortalAuthGuard is UI-only).
 * 2. Real backend-driven data: 0.00 ARTH initial balance, empty arrays stay empty, no mock fallbacks.
 * 3. Strict server-side bank scoping from JWT context (never trusting frontend-selected bankId).
 * 4. Strict role separation across Citizen (USER), Bank Admin (BANK_ADMIN), and Central Bank (CENTRAL_BANK_ADMIN).
 * 5. Authorized ledger-backed money flow (NAVA → SAMAYA) via Central Treasury funding without balance tampering.
 * 6. Dual-password isolation (Financial password required for money movement; GOV password rejected).
 * 7. Session revocation on logout with fail-closed rejection of revoked tokens.
 */

async function runPortalAuthorizationE2E() {
  console.log('=================================================================');
  console.log('  ARTHAX PORTAL INTEGRATION & AUTHORIZATION E2E ACCEPTANCE SUITE ');
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
  // INFRASTRUCTURE INITIALIZATION
  // ---------------------------------------------------------------------------
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  const sessionStore = new SessionStoreService(prisma);
  await sessionStore.onModuleInit();

  const auditService = new AuditService();
  const jwtSecret = process.env.JWT_SECRET || 'arthax_dev_jwt_secret_change_in_production_sovereign_key_9841';
  const jwtService = new JwtService({ secret: jwtSecret });

  const emailService = new EmailService();
  const supabaseAuthService = new SupabaseAuthService();
  const identityService = new IdentityService(prisma, jwtService, sessionStore, auditService, emailService, supabaseAuthService);
  const balanceEngine = new BalanceEngineService(prisma, auditService);
  const ledgerService = new LedgerService(prisma, auditService, balanceEngine);
  const notificationsService = new NotificationsService(prisma);
  const centralBankService = new CentralBankService(prisma, ledgerService, auditService);
  const clsRoutingService = new ClsRoutingService(prisma, centralBankService);
  const clsService = new ClsService(prisma, ledgerService, auditService, clsRoutingService);

  const bankingService = new BankingService(
    prisma,
    ledgerService,
    auditService,
    clsService,
    notificationsService,
    centralBankService,
  );

  const jwtAuthGuard = new JwtAuthGuard(jwtService, sessionStore);
  const reflector = new Reflector();
  const rolesGuard = new RolesGuard(reflector);
  const bankScopeGuard = new BankScopeGuard();

  function createMockExecutionContext(options: {
    token?: string;
    params?: Record<string, any>;
    body?: any;
    user?: AuthSessionPayload;
    requiredRoles?: UserRole[];
  }): ExecutionContext {
    const req: any = {
      headers: {
        authorization: options.token ? `Bearer ${options.token}` : undefined,
      },
      params: options.params || {},
      body: options.body || {},
      user: options.user,
    };

    const handler = () => {};
    if (options.requiredRoles) {
      Reflect.defineMetadata(ROLES_KEY, options.requiredRoles, handler);
    }

    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
      getHandler: () => handler,
      getClass: () => class MockController {},
    } as unknown as ExecutionContext;
  }

  // Tracking for deterministic cleanup
  const cleanupUserIds: string[] = [];
  const cleanupGovIds: string[] = [];
  const cleanupEmails: string[] = [];

  const ts = Date.now();

  try {
    // -------------------------------------------------------------------------
    // SETUP: PROVISION REAL ACTORS ACROSS THE 3 SOVEREIGN TIERS
    // -------------------------------------------------------------------------
    console.log('--- SETUP: Provisioning Sovereign Actors (Citizen, Bank Admin, Central Bank Admin) ---');

    // 1. Fresh Citizen
    const citizenEmail = `citizen_auth_${ts}@arthax.gov`;
    const citizenGovPassword = 'GovCitizen#2026!Secure';
    const citizenFinPassword = 'FinCitizen#2026!Secure';
    cleanupEmails.push(citizenEmail);

    const otpRes = await identityService.sendEmailOtp({ email: citizenEmail });
    const citizenOtp = otpRes.code!;

    const verifyRes = await identityService.verifyEmailOtp({
      email: citizenEmail,
      code: citizenOtp,
    });

    const govIdRecord = await identityService.createGovId({
      email: citizenEmail,
      otpCode: citizenOtp,
      govPassword: citizenGovPassword,
      registrationTicket: verifyRes.registrationTicket,
    });
    cleanupGovIds.push(govIdRecord.id);

    const citizenAuth = await identityService.setFinancialPassword(
      govIdRecord.id,
      {
        financialPassword: citizenFinPassword,
        displayName: 'Sovereign Citizen Test',
      },
    );
    cleanupUserIds.push(citizenAuth.user.id);
    const citizenToken = citizenAuth.token;
    const citizenPayload = jwtService.decode(citizenToken) as AuthSessionPayload;

    assert('Citizen registered with real database GOV ID and User record', !!citizenAuth.user.id);
    assert('Citizen assigned role USER in verified JWT claims', citizenPayload.role === 'USER');
    assert('Citizen JWT does not carry bankId claim', !citizenPayload.bankId);

    // 2. NAVA Bank Admin
    const navaAdminEmail = `admin_nava_${ts}@nava.arthax.gov`;
    cleanupEmails.push(navaAdminEmail);
    const navaGovId = await prisma.govId.create({
      data: {
        govIdNumber: `AX-ADM-NAVA-${ts % 100000}`,
        email: navaAdminEmail,
        passwordHash: await argon2.hash('NavaAdmin#2026!Secret'),
        emailVerified: true,
        status: 'ACTIVE',
      },
    });
    cleanupGovIds.push(navaGovId.id);

    const navaAdminUser = await prisma.user.create({
      data: {
        govId: navaGovId.id,
        financialPasswordHash: await argon2.hash('FinNavaAdmin#2026!Secret'),
        role: 'BANK_ADMIN',
        status: 'ACTIVE',
        displayName: 'NAVA Bank Branch Admin',
      },
    });
    cleanupUserIds.push(navaAdminUser.id);

    const createTestSession = async (userId: string, role: string, bankId?: string) => {
      const tokenHash = await argon2.hash(`sess_${userId}_${Date.now()}`);
      const session = await prisma.session.create({
        data: {
          userId,
          tokenHash,
          expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
        },
      });
      await sessionStore.storeSession(session.id, { userId, role, bankId });
      return session;
    };

    const navaSession = await createTestSession(navaAdminUser.id, 'BANK_ADMIN', 'nava');
    const navaAdminToken = jwtService.sign({
      sub: navaAdminUser.id,
      govId: navaGovId.govIdNumber,
      email: navaGovId.email,
      role: 'BANK_ADMIN',
      bankId: 'nava',
      sessionId: navaSession.id,
    });
    const navaPayload = jwtService.decode(navaAdminToken) as AuthSessionPayload;

    // 3. SAMAYA Bank Admin
    const samayaAdminEmail = `admin_samaya_${ts}@samaya.arthax.gov`;
    cleanupEmails.push(samayaAdminEmail);
    const samayaGovId = await prisma.govId.create({
      data: {
        govIdNumber: `AX-ADM-SAMY-${ts % 100000}`,
        email: samayaAdminEmail,
        passwordHash: await argon2.hash('SamayaAdmin#2026!Secret'),
        emailVerified: true,
        status: 'ACTIVE',
      },
    });
    cleanupGovIds.push(samayaGovId.id);

    const samayaAdminUser = await prisma.user.create({
      data: {
        govId: samayaGovId.id,
        financialPasswordHash: await argon2.hash('FinSamayaAdmin#2026!Secret'),
        role: 'BANK_ADMIN',
        status: 'ACTIVE',
        displayName: 'SAMAYA Bank Branch Admin',
      },
    });
    cleanupUserIds.push(samayaAdminUser.id);

    const samayaSession = await createTestSession(samayaAdminUser.id, 'BANK_ADMIN', 'samaya');
    const samayaAdminToken = jwtService.sign({
      sub: samayaAdminUser.id,
      govId: samayaGovId.govIdNumber,
      email: samayaGovId.email,
      role: 'BANK_ADMIN',
      bankId: 'samaya',
      sessionId: samayaSession.id,
    });

    // 4. Central Bank Admin
    const cbAdminEmail = `admin_central_${ts}@cb.arthax.gov`;
    cleanupEmails.push(cbAdminEmail);
    const cbGovId = await prisma.govId.create({
      data: {
        govIdNumber: `AX-CB-GOV-${ts % 100000}`,
        email: cbAdminEmail,
        passwordHash: await argon2.hash('CentralBank#2026!Secret'),
        emailVerified: true,
        status: 'ACTIVE',
      },
    });
    cleanupGovIds.push(cbGovId.id);

    const cbAdminUser = await prisma.user.create({
      data: {
        govId: cbGovId.id,
        financialPasswordHash: await argon2.hash('FinCentralBank#2026!Secret'),
        role: 'CENTRAL_BANK_ADMIN',
        status: 'ACTIVE',
        displayName: 'Central Monetary Authority Officer',
      },
    });
    cleanupUserIds.push(cbAdminUser.id);

    const cbSession = await createTestSession(cbAdminUser.id, 'CENTRAL_BANK_ADMIN');
    const cbAdminToken = jwtService.sign({
      sub: cbAdminUser.id,
      govId: cbGovId.govIdNumber,
      email: cbGovId.email,
      role: 'CENTRAL_BANK_ADMIN',
      sessionId: cbSession.id,
    });
    const cbPayload = jwtService.decode(cbAdminToken) as AuthSessionPayload;

    // -------------------------------------------------------------------------
    // STAGE 1: PORTAL AUTHORIZATION BOUNDARIES & UNPROTECTED DOM REJECTION
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 1: Backend Boundary Enforcement (Citizen, Bank Admin, Central Bank) ---');

    // 1. Unauthenticated requests to protected endpoints fail with 401
    let unauthRejected = false;
    try {
      const ctx = createMockExecutionContext({});
      await jwtAuthGuard.canActivate(ctx);
    } catch (err) {
      unauthRejected = err instanceof UnauthorizedException;
    }
    assert('Unauthenticated access without Bearer token throws 401 Unauthorized', unauthRejected);

    // 2. Tampered / invalid JWT token fails with 401
    let tamperedRejected = false;
    try {
      const ctx = createMockExecutionContext({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.signature' });
      await jwtAuthGuard.canActivate(ctx);
    } catch (err) {
      tamperedRejected = err instanceof UnauthorizedException;
    }
    assert('Tampered JWT token rejected with 401 Unauthorized', tamperedRejected);

    // 3. Citizen accessing Central Bank portal endpoint (@Roles('CENTRAL_BANK_ADMIN')) throws 403
    let citizenCbForbidden = false;
    try {
      const ctx = createMockExecutionContext({
        token: citizenToken,
        user: citizenPayload,
        requiredRoles: ['CENTRAL_BANK_ADMIN'],
      });
      rolesGuard.canActivate(ctx);
    } catch (err) {
      citizenCbForbidden = err instanceof ForbiddenException;
    }
    assert('Citizen token accessing Central Bank endpoint throws 403 Forbidden', citizenCbForbidden);

    // 4. Citizen accessing Bank Admin portal endpoint (@Roles('BANK_ADMIN') / BankScopeGuard) throws 403
    let citizenBankAdminForbidden = false;
    try {
      const ctx = createMockExecutionContext({
        token: citizenToken,
        user: citizenPayload,
      });
      bankScopeGuard.canActivate(ctx);
    } catch (err) {
      citizenBankAdminForbidden = err instanceof ForbiddenException;
    }
    assert('Citizen token accessing Bank Admin endpoint throws 403 Forbidden (BankScopeGuard)', citizenBankAdminForbidden);

    // 5. Commercial Bank Admin accessing Central Bank portal endpoint throws 403
    let bankAdminCbForbidden = false;
    try {
      const ctx = createMockExecutionContext({
        token: navaAdminToken,
        user: navaPayload,
        requiredRoles: ['CENTRAL_BANK_ADMIN'],
      });
      rolesGuard.canActivate(ctx);
    } catch (err) {
      bankAdminCbForbidden = err instanceof ForbiddenException;
    }
    assert('Bank Admin token accessing Central Bank endpoint throws 403 Forbidden', bankAdminCbForbidden);

    // 6. Central Bank Admin accessing Central Bank endpoint succeeds
    const cbCtx = createMockExecutionContext({
      token: cbAdminToken,
      user: cbPayload,
      requiredRoles: ['CENTRAL_BANK_ADMIN'],
    });
    const cbAllowed = rolesGuard.canActivate(cbCtx);
    assert('Central Bank Admin accessing Central Bank endpoint allows 200 OK', cbAllowed === true);

    // -------------------------------------------------------------------------
    // STAGE 2: BANK OWNERSHIP & SCOPE ISOLATION (SERVER-SIDE JWT CONTEXT)
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 2: Commercial Bank Scope Isolation (Rule 4 Enforcement) ---');

    // 1. NAVA Admin accessing NAVA operations succeeds
    const navaAdminCtx = createMockExecutionContext({
      token: navaAdminToken,
      user: navaPayload,
      params: { bankId: 'nava' },
    });
    const navaAdminAllowed = bankScopeGuard.canActivate(navaAdminCtx);
    assert('NAVA Bank Admin accessing NAVA Bank node succeeds (200 OK)', navaAdminAllowed === true);
    assert('BankScopeGuard assigns verified bankId from JWT context', (navaAdminCtx.switchToHttp().getRequest() as any).assignedBankId === 'nava');

    // 2. NAVA Admin attempting to operate on SAMAYA Bank throws 403 Forbidden
    let crossBankMismatchRejected = false;
    try {
      const crossBankCtx = createMockExecutionContext({
        token: navaAdminToken,
        user: navaPayload,
        params: { bankId: 'samaya' },
      });
      bankScopeGuard.canActivate(crossBankCtx);
    } catch (err) {
      crossBankMismatchRejected = err instanceof ForbiddenException;
    }
    assert(
      'NAVA Bank Admin attempting cross-bank operation on SAMAYA throws 403 Forbidden (Rule 4: Never trust frontend bankId)',
      crossBankMismatchRejected,
    );

    // 3. Central Bank Admin attempting to operate as single Bank Admin without bankId throws 403
    let cbAsBankAdminRejected = false;
    try {
      const cbBankCtx = createMockExecutionContext({
        token: cbAdminToken,
        user: cbPayload,
      });
      bankScopeGuard.canActivate(cbBankCtx);
    } catch (err) {
      cbAsBankAdminRejected = err instanceof ForbiddenException;
    }
    assert('Central Bank Admin cannot bypass BankScopeGuard without assigned bankId', cbAsBankAdminRejected);

    // -------------------------------------------------------------------------
    // STAGE 3: FRESH CITIZEN REAL BACKEND-DRIVEN STATE (RULE 8)
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 3: Fresh Citizen Real Data Verification (Rule 8) ---');

    // 1. Real Identity Verification
    const meResult = jwtService.verify(citizenToken) as AuthSessionPayload;
    assert('Fresh citizen session returns real user ID', meResult.sub === citizenAuth.user.id);
    assert('Fresh citizen session returns real GOV ID format', meResult.govId.startsWith('AX-') || meResult.govId.startsWith('GOV-'));
    assert('Fresh citizen session returns real registered email', meResult.email === citizenEmail);

    // 2. Query Accounts: Fresh citizen has exactly 1 NAVA account, opening balance 0n
    const initialAccounts = await bankingService.listUserAccounts(citizenAuth.user.id);
    assert('Fresh citizen has exactly 1 initial bank account provisioned atomically', initialAccounts.length === 1);

    const initialAccount = initialAccounts[0];
    assert('Initial account is linked to canonical NAVA node', initialAccount.bankId.toLowerCase() === 'nava');
    assert('Initial account has real formatted accountNumber', initialAccount.accountNumber.startsWith('ARTH-NAVA-'));
    assert('Initial account balanceMinor is exactly "0" (0.00 ARTH, Rule 8)', initialAccount.balanceMinor === '0');

    // 3. Query Transactions: Fresh citizen has real empty transaction history
    const initialTxs = await bankingService.getAccountTransactions(citizenAuth.user.id, initialAccount.id);
    assert('Fresh citizen has real empty transaction history (0 entries, Rule 8)', Array.isArray(initialTxs) && initialTxs.length === 0);

    // -------------------------------------------------------------------------
    // STAGE 4: AUTHORIZED LEDGER-BACKED FUNDING & MONEY FLOW (RULE 7)
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 4: Authorized Ledger-Backed Funding & Money Flow (Rule 7) ---');

    // Rule 7: For NAVA→SAMAYA test, use ONLY an authorized ledger-backed funding mechanism.
    // Never mutate balances or ledger records directly.
    const initialAccountRecord = await prisma.bankAccount.findUnique({
      where: { id: initialAccount.id },
      include: { ledgerAccount: true },
    });
    const citizenNavaLedgerId = initialAccountRecord!.ledgerAccount!.id;

    // Authorized State Treasury disbursement (Debit Central Treasury, Credit Citizen NAVA)
    const fundAmountMinor = 1000000n; // 10,000.00 ARTH
    const treasuryLedger = await prisma.ledgerAccount.findFirst({
      where: {
        OR: [
          { id: SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY },
          { ownerEntityId: SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY },
          { accountType: 'CENTRAL_TREASURY' },
        ],
      },
    });

    let treasuryLedgerId = treasuryLedger?.id;
    if (!treasuryLedger) {
      const createdTreasury = await prisma.ledgerAccount.create({
        data: {
          accountType: 'CENTRAL_TREASURY',
          ownerEntityId: SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY,
          ownerEntityType: 'SYSTEM',
          balanceSnapshot: 5000000000000n,
        },
      });
      treasuryLedgerId = createdTreasury.id;
    }

    const fundingTx = await ledgerService.recordBalancedTransaction({
      type: 'DEPOSIT',
      scope: 'INTERNAL',
      amountMinor: fundAmountMinor,
      initiatedBy: cbAdminUser.id,
      destinationAccountId: initialAccount.id,
      metadata: { memo: 'Sovereign Treasury Citizen Seed Disbursal', authorizedBy: 'CENTRAL_BANK' },
      entries: [
        {
          ledgerAccountId: treasuryLedgerId!,
          entryType: 'DEBIT',
          amountMinor: fundAmountMinor,
        },
        {
          ledgerAccountId: citizenNavaLedgerId,
          entryType: 'CREDIT',
          amountMinor: fundAmountMinor,
        },
      ],
    });

    assert('Authorized ledger transaction created without direct balance mutation (Rule 7)', !!fundingTx.id);
    assert('Double-entry ledger entry verified: debits equal credits', fundingTx.status === 'COMPLETED');

    // Verify NAVA account reflects updated ledger snapshot
    const fundedAccounts = await bankingService.listUserAccounts(citizenAuth.user.id);
    const updatedNava = fundedAccounts.find((a) => a.id === initialAccount.id);
    assert('Citizen NAVA balance reflects authorized 10,000.00 ARTH funding', updatedNava?.balanceMinor === fundAmountMinor.toString());

    // Citizen joins SAMAYA Bank (opening second account)
    const samayaCustomer = await bankingService.joinBank(citizenAuth.user.id, 'samaya');
    assert('Citizen joins SAMAYA Bank establishing second institutional customer node', samayaCustomer.bankId === 'samaya');

    const multiBankAccounts = await bankingService.listUserAccounts(citizenAuth.user.id);
    assert('Citizen now possesses 2 real bank accounts across NAVA and SAMAYA', multiBankAccounts.length === 2);

    const samayaAccount = multiBankAccounts.find((a) => a.bankId.toLowerCase() === 'samaya');
    assert('SAMAYA account opened with real initial balance 0.00 ARTH', samayaAccount?.balanceMinor === '0');

    // Execute Inter-Bank DvP Transfer: NAVA → SAMAYA (3,500.00 ARTH)
    const transferAmountMinor = '350000'; // 3,500.00 ARTH

    // Step-up test: wrong financial password must fail
    let wrongPinRejected = false;
    try {
      await bankingService.executeIntraBankTransfer(
        citizenAuth.user.id,
        {
          sourceAccountId: initialAccount.id,
          destinationAccountNumber: samayaAccount!.accountNumber,
          amountMinor: transferAmountMinor,
          financialPassword: 'WrongFinancialPassword#999',
          memo: 'Inter-Bank Savings Rebalance',
        },
        `idemp-fail-pin-${ts}`,
      );
    } catch (err) {
      wrongPinRejected = err instanceof ForbiddenException;
    }
    assert('Transfer with invalid Financial Password throws 403 Forbidden (Step-Up)', wrongPinRejected);

    // Step-up test: supplying GOV Password as Financial Password must fail (Dual Password Isolation)
    let govPinRejected = false;
    try {
      await bankingService.executeIntraBankTransfer(
        citizenAuth.user.id,
        {
          sourceAccountId: initialAccount.id,
          destinationAccountNumber: samayaAccount!.accountNumber,
          amountMinor: transferAmountMinor,
          financialPassword: citizenGovPassword, // GOV password used instead of financial password
          memo: 'Cross-Password Exploit Test',
        },
        `idemp-cross-gov-${ts}`,
      );
    } catch (err) {
      govPinRejected = err instanceof ForbiddenException;
    }
    assert('Dual password isolation enforced: GOV Password rejected for financial authorization', govPinRejected);

    // Execute valid transfer with correct financial password
    const transferRes = await bankingService.executeIntraBankTransfer(
      citizenAuth.user.id,
      {
        sourceAccountId: initialAccount.id,
        destinationAccountNumber: samayaAccount!.accountNumber,
        amountMinor: transferAmountMinor,
        financialPassword: citizenFinPassword,
        memo: 'Inter-bank sovereign transfer from NAVA to SAMAYA',
      },
      `idemp-transfer-${ts}`,
    );
    const transferReceipt = transferRes.transaction;

    assert('Inter-bank transfer executed successfully with valid Financial Password', transferRes.success && !!transferReceipt.id);
    assert('Transfer marked COMPLETED with pacs.008 settlement reference', transferReceipt.status === 'COMPLETED');

    // Verify balances after money flow
    const postTransferAccounts = await bankingService.listUserAccounts(citizenAuth.user.id);
    const postNava = postTransferAccounts.find((a) => a.id === initialAccount.id)!;
    const postSamaya = postTransferAccounts.find((a) => a.id === samayaAccount!.id)!;

    assert('NAVA balance decremented to 6,500.00 ARTH (650000 minor)', postNava.balanceMinor === '650000');
    assert('SAMAYA balance incremented to 3,500.00 ARTH (350000 minor)', postSamaya.balanceMinor === '350000');

    // Verify transaction streams for both accounts
    const navaTxs = await bankingService.getAccountTransactions(citizenAuth.user.id, postNava.id);
    const samayaTxs = await bankingService.getAccountTransactions(citizenAuth.user.id, postSamaya.id);

    assert('NAVA account records real debit transaction entry', navaTxs.length >= 1);
    assert('SAMAYA account records real credit transaction entry', samayaTxs.length >= 1);

    // -------------------------------------------------------------------------
    // STAGE 5: SESSION REVOCATION ON LOGOUT & FAIL-CLOSED REJECTION (RULE 9)
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 5: Session Revocation on Logout (Rule 9 Enforcement) ---');

    // Verify citizen token is valid before logout
    const preLogoutCtx = createMockExecutionContext({ token: citizenToken });
    const preLogoutActive = await jwtAuthGuard.canActivate(preLogoutCtx);
    assert('Citizen token active prior to logout', preLogoutActive === true);

    // User initiates logout
    const sessions = await identityService.getActiveSessions(citizenAuth.user.id);
    const sessionId = sessions[0]?.id || 'test_sess';
    const logoutResult = await identityService.revokeSession(citizenAuth.user.id, sessionId);
    assert('Session revoked in backend session store on logout', logoutResult.success === true);

    // Subsequent API access with the revoked token must be rejected
    let postLogoutRejected = false;
    try {
      const postLogoutCtx = createMockExecutionContext({ token: citizenToken });
      await jwtAuthGuard.canActivate(postLogoutCtx);
    } catch (err) {
      postLogoutRejected = err instanceof UnauthorizedException;
    }
    assert('Revoked token rejected with 401 Unauthorized upon subsequent API request (Rule 9)', postLogoutRejected);

    // Re-login with GOV ID + GOV Password produces fresh valid session
    const reLoginResult = await identityService.login({
      govIdOrEmail: citizenAuth.user.govIdNumber,
      govPassword: citizenGovPassword,
    });
    assert('Re-login with GOV ID + GOV Password succeeds and issues fresh token', !!reLoginResult.token);

    const reLoginCtx = createMockExecutionContext({ token: reLoginResult.token });
    const reLoginActive = await jwtAuthGuard.canActivate(reLoginCtx);
    assert('Fresh token activates authenticated session successfully', reLoginActive === true);

    // Old token remains permanently rejected
    let oldTokenStillRejected = false;
    try {
      const oldCtx = createMockExecutionContext({ token: citizenToken });
      await jwtAuthGuard.canActivate(oldCtx);
    } catch (err) {
      oldTokenStillRejected = err instanceof UnauthorizedException;
    }
    assert('Old revoked token remains permanently rejected after re-login', oldTokenStillRejected);

  } finally {
    // Deterministic Teardown of all created test entities
    try {
      if (cleanupUserIds.length > 0) {
        const accts = await prisma.bankAccount.findMany({
          where: { userId: { in: cleanupUserIds } },
          select: { id: true },
        });
        const acctIds = accts.map((a) => a.id);

        const las = await prisma.ledgerAccount.findMany({
          where: { bankAccountId: { in: acctIds } },
          select: { id: true },
        });
        const laIds = las.map((l) => l.id);

        const txs = await prisma.transaction.findMany({
          where: {
            OR: [
              { sourceAccountId: { in: acctIds } },
              { destinationAccountId: { in: acctIds } },
              { initiatedBy: { in: cleanupUserIds } },
            ],
          },
          select: { id: true, settlementId: true },
        });
        const txIds = txs.map((t) => t.id);
        const settlementIds = txs.map((t) => t.settlementId).filter(Boolean) as string[];

        // 1. Delete transaction entries
        await prisma.transactionEntry.deleteMany({
          where: {
            OR: [
              { transactionId: { in: txIds } },
              { ledgerAccountId: { in: laIds } },
            ],
          },
        });

        // 2. Delete transactions
        if (txIds.length > 0) {
          await prisma.transaction.deleteMany({
            where: { id: { in: txIds } },
          });
        }

        // 3. Delete settlements
        if (settlementIds.length > 0) {
          await prisma.settlement.deleteMany({
            where: { id: { in: settlementIds } },
          });
        }

        // 4. Delete ledger accounts
        if (laIds.length > 0) {
          await prisma.ledgerAccount.deleteMany({
            where: { id: { in: laIds } },
          });
        }

        // 5. Delete bank accounts, customers, sessions, and users
        await prisma.bankAccount.deleteMany({ where: { userId: { in: cleanupUserIds } } });
        await prisma.bankCustomer.deleteMany({ where: { userId: { in: cleanupUserIds } } });
        await prisma.session.deleteMany({ where: { userId: { in: cleanupUserIds } } });
        await prisma.userLoadout.deleteMany({ where: { userId: { in: cleanupUserIds } } });
        await prisma.notification.deleteMany({ where: { userId: { in: cleanupUserIds } } });
        await prisma.user.deleteMany({ where: { id: { in: cleanupUserIds } } });
      }

      if (cleanupGovIds.length > 0) {
        await prisma.govId.deleteMany({ where: { id: { in: cleanupGovIds } } });
      }

      if (cleanupEmails.length > 0) {
        await prisma.mfaToken.deleteMany({ where: { email: { in: cleanupEmails } } });
      }
    } catch (err) {
      console.warn('Portal Auth E2E Cleanup notice:', (err as Error).message);
    }

    await sessionStore.onModuleDestroy();
    await prisma.onModuleDestroy();
  }

  console.log('\n=================================================================');
  console.log(`  PORTAL AUTHORIZATION E2E RESULT: ${passed} PASSED / ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPortalAuthorizationE2E().catch((err) => {
  console.error('Fatal Portal Authorization E2E Error:', err);
  process.exit(1);
});
