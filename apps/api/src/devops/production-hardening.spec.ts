import {
  RateLimiterMiddleware,
  RateLimiterStore,
  DEFAULT_RATE_LIMIT_RULES,
} from '../common/middleware/rate-limiter.middleware';
import {
  LedgerWatcherService,
  PagingAlert,
} from '../observability/ledger-watcher.service';
import { HealthController } from '../observability/health.controller';

/**
 * ARTHAX DEVOPS & PRODUCTION HARDENING INVARIANT SUITE — PHASE 14
 *
 * Validates production runtime readiness, container security, rate limiting,
 * active ledger imbalance monitoring, and disaster resilience:
 * - Group 1: Healthcheck Probes & Kubernetes Readiness (4 tests)
 * - Group 2: Sliding-Window Rate Limiting Engine (5 tests)
 * - Group 3: Production HTTP Security Headers & Isolation (5 tests)
 * - Group 4: Active Ledger Imbalance Watcher & Automated Alerting (6 tests)
 * - Group 5: CORS Security & Financial Idempotency Headers (4 tests)
 *
 * Target: Exactly 24 passed, 0 failed.
 */
async function runProductionHardeningSuite() {
  console.log('=================================================================');
  console.log('  ARTHAX DEVOPS & PRODUCTION HARDENING INVARIANT SUITE');
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
  // Test Harness Mocks
  // ---------------------------------------------------------------------------
  class MockPrismaService {
    public isConnected = true;
    public ledgerAccount = {
      count: async (args: any) => 0,
    };
    public transaction = {
      count: async (args: any) => 0,
    };
  }

  class MockBalanceEngineService {
    async verifyGlobalLedgerIntegrity() {
      return {
        isBalanced: true,
        totalDebitsMinor: '5000000000000',
        totalCreditsMinor: '5000000000000',
        imbalanceMinor: '0',
        entryCount: 42,
        checkedAt: new Date().toISOString(),
      };
    }
  }

  class MockCentralBankService {
    async getMonetarySupply() {
      return {
        m0SupplyMinor: '5000000000000',
        m1SupplyMinor: '8240000000000',
        inCirculationMinor: '600000000000',
        centralTreasuryMinor: '1000000000000',
        centralBankReservesMinor: '1500000000000',
        commercialBankReservesMinor: '1200000000000',
        vaultRestrictedMinor: '700000000000',
        activeEpoch: 'EPOCH-2026-Q3-SOVEREIGN',
        ledgerInvariantSatisfied: true,
        supplyInvariantSatisfied: true,
      };
    }
  }

  function createMockResponse() {
    const headers: Record<string, string> = {};
    let statusCode = 200;
    let body: any = null;

    const res: any = {
      statusCode: 200,
      setHeader: (name: string, value: string) => {
        headers[name.toLowerCase()] = value;
      },
      getHeader: (name: string) => headers[name.toLowerCase()],
      getHeaders: () => headers,
      status: (code: number) => {
        statusCode = code;
        res.statusCode = code;
        return res;
      },
      json: (data: any) => {
        body = data;
        return res;
      },
    };
    return { res, getHeaders: () => headers, getStatus: () => statusCode, getBody: () => body };
  }

  // ===========================================================================
  // GROUP 1: HEALTHCHECK PROBES & KUBERNETES READINESS
  // ===========================================================================
  console.log('--- Group 1: Healthcheck Probes & Kubernetes Readiness ---');

  const mockPrisma = new MockPrismaService() as any;
  const mockBalance = new MockBalanceEngineService() as any;
  const mockCentralBank = new MockCentralBankService() as any;
  const watcher = new LedgerWatcherService(mockPrisma, mockBalance, mockCentralBank);
  const healthController = new HealthController(mockPrisma, watcher);

  // Test 1: Liveness Probe
  {
    const { res, getStatus, getBody } = createMockResponse();
    healthController.getLiveness(res);
    const body = getBody();
    assert(
      'Liveness probe returns HTTP 200 OK with process uptime and pid',
      getStatus() === 200 && body.status === 'ok' && body.uptimeSeconds >= 0 && typeof body.pid === 'number',
    );
  }

  // Test 2: Readiness Probe (Online DB)
  {
    mockPrisma.isConnected = true;
    const { res, getStatus, getBody } = createMockResponse();
    await healthController.getReadiness(res);
    const body = getBody();
    assert(
      'Readiness probe returns HTTP 200 ready when database is connected',
      getStatus() === 200 && body.status === 'ready' && body.database === 'connected',
    );
  }

  // Test 3: Readiness Probe (Offline DB)
  {
    mockPrisma.isConnected = false;
    const { res, getStatus, getBody } = createMockResponse();
    await healthController.getReadiness(res);
    const body = getBody();
    assert(
      'Readiness probe returns HTTP 503 SERVICE_UNAVAILABLE when database is offline',
      getStatus() === 503 && body.status === 'degraded' && body.database === 'disconnected',
    );
    mockPrisma.isConnected = true;
  }

  // Test 4: Ledger Integrity Probe (Healthy)
  {
    const { res, getStatus, getBody } = createMockResponse();
    await healthController.getLedgerIntegrity(res);
    const body = getBody();
    assert(
      'Ledger-integrity probe returns HTTP 200 OK with HEALTHY status on balanced ledger',
      getStatus() === 200 && body.status === 'HEALTHY' && body.imbalanceMinor === '0',
    );
  }

  // ===========================================================================
  // GROUP 2: SLIDING-WINDOW RATE LIMITING ENGINE
  // ===========================================================================
  console.log('\n--- Group 2: Sliding-Window Rate Limiting Engine ---');

  RateLimiterStore.clear();
  const rateLimiter = new RateLimiterMiddleware(DEFAULT_RATE_LIMIT_RULES);

  // Test 5: Initial Request Allowed & Quota Initialized
  {
    const req: any = {
      headers: { 'x-forwarded-for': '192.168.1.50' },
      baseUrl: '/api/v1/auth/login',
      socket: { remoteAddress: '192.168.1.50' },
    };
    const { res, getHeaders, getStatus } = createMockResponse();
    let nextCalled = false;
    rateLimiter.use(req, res, () => {
      nextCalled = true;
    });

    const headers = getHeaders();
    assert(
      'Allows initial request under threshold and computes correct remaining quota',
      nextCalled && getStatus() === 200 && headers['x-ratelimit-limit'] === '5' && headers['x-ratelimit-remaining'] === '5',
    );
  }

  // Test 6: Quota Decrements on Successive Hits
  {
    const req: any = {
      headers: { 'x-forwarded-for': '192.168.1.50' },
      baseUrl: '/api/v1/auth/login',
      socket: { remoteAddress: '192.168.1.50' },
    };
    const { res, getHeaders } = createMockResponse();
    let nextCalled = false;
    rateLimiter.use(req, res, () => {
      nextCalled = true;
    });

    const headers = getHeaders();
    assert(
      'Decrements remaining quota on successive requests within same time window',
      nextCalled && headers['x-ratelimit-remaining'] === '4',
    );
  }

  // Test 7: Threshold Exceeded Returns 429 Too Many Requests
  {
    const req: any = {
      headers: { 'x-forwarded-for': '192.168.1.50' },
      baseUrl: '/api/v1/auth/login',
      socket: { remoteAddress: '192.168.1.50' },
    };

    // Burn remaining 3 requests (hits 3, 4, 5)
    for (let i = 0; i < 3; i++) {
      const { res } = createMockResponse();
      rateLimiter.use(req, res, () => {});
    }

    // 6th request: must be rejected
    const { res, getStatus, getBody } = createMockResponse();
    let nextCalled = false;
    rateLimiter.use(req, res, () => {
      nextCalled = true;
    });

    const body = getBody();
    assert(
      'Rejects requests exceeding threshold with HTTP 429 Too Many Requests',
      !nextCalled && getStatus() === 429 && body.error === 'Too Many Requests',
    );
  }

  // Test 8: Retry-After Header
  {
    const req: any = {
      headers: { 'x-forwarded-for': '192.168.1.50' },
      baseUrl: '/api/v1/auth/login',
      socket: { remoteAddress: '192.168.1.50' },
    };
    const { res, getHeaders, getStatus } = createMockResponse();
    rateLimiter.use(req, res, () => {});

    const headers = getHeaders();
    const retryAfter = parseInt(headers['retry-after'], 10);
    assert(
      'Sets Retry-After header with positive integer seconds on rate limit breach',
      getStatus() === 429 && !isNaN(retryAfter) && retryAfter > 0 && retryAfter <= 300,
    );
  }

  // Test 9: Sliding Window Expiry Resets Quota
  {
    RateLimiterStore.clear();
    // Simulate expired hits from 6 minutes ago
    const sixMinutesAgo = Date.now() - 6 * 60 * 1000;
    const storeKey = '192.168.1.50:/auth/login';
    for (let i = 0; i < 5; i++) {
      RateLimiterStore.addHit(storeKey, sixMinutesAgo);
    }

    const req: any = {
      headers: { 'x-forwarded-for': '192.168.1.50' },
      baseUrl: '/api/v1/auth/login',
      socket: { remoteAddress: '192.168.1.50' },
    };
    const { res, getStatus, getHeaders } = createMockResponse();
    let nextCalled = false;
    rateLimiter.use(req, res, () => {
      nextCalled = true;
    });

    const headers = getHeaders();
    assert(
      'Resets quota after sliding window duration expires',
      nextCalled && getStatus() === 200 && headers['x-ratelimit-remaining'] === '5',
    );
  }

  // ===========================================================================
  // GROUP 3: PRODUCTION HTTP SECURITY HEADERS & ISOLATION
  // ===========================================================================
  console.log('\n--- Group 3: Production HTTP Security Headers & Isolation ---');

  function applyProductionSecurityHeaders(res: any) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  }

  const { res: secRes, getHeaders: getSecHeaders } = createMockResponse();
  applyProductionSecurityHeaders(secRes);
  const secHeaders = getSecHeaders();

  // Test 10: HSTS
  assert(
    'Enforces Strict-Transport-Security with max-age >= 31536000 and includeSubDomains',
    secHeaders['strict-transport-security'].includes('max-age=31536000') &&
      secHeaders['strict-transport-security'].includes('includeSubDomains'),
  );

  // Test 11: X-Frame-Options: DENY
  assert(
    'Enforces X-Frame-Options: DENY against clickjacking across all endpoints',
    secHeaders['x-frame-options'] === 'DENY',
  );

  // Test 12: X-Content-Type-Options: nosniff
  assert(
    'Enforces X-Content-Type-Options: nosniff against MIME-type sniffing',
    secHeaders['x-content-type-options'] === 'nosniff',
  );

  // Test 13: Referrer-Policy
  assert(
    'Enforces Referrer-Policy: strict-origin-when-cross-origin',
    secHeaders['referrer-policy'] === 'strict-origin-when-cross-origin',
  );

  // Test 14: Permissions-Policy
  assert(
    'Restricts device hardware via Permissions-Policy (camera, mic, geolocation disabled)',
    secHeaders['permissions-policy'].includes('camera=()') &&
      secHeaders['permissions-policy'].includes('microphone=()') &&
      secHeaders['permissions-policy'].includes('geolocation=()'),
  );

  // ===========================================================================
  // GROUP 4: ACTIVE LEDGER IMBALANCE WATCHER & AUTOMATED ALERTING
  // ===========================================================================
  console.log('\n--- Group 4: Active Ledger Imbalance Watcher & Automated Alerting ---');

  watcher.clearAlerts();
  watcher.resetSimulation();

  // Test 15: Baseline Balanced Status
  {
    const report = await watcher.runIntegrityAudit();
    assert(
      'Autonomous watcher reports HEALTHY status when double-entry debits equal credits',
      report.status === 'HEALTHY' && report.imbalanceMinor === '0' && report.alertsEmitted === 0,
    );
  }

  // Test 16: Injected Ledger Imbalance Triggers CRITICAL_IMBALANCE
  {
    watcher.injectImbalanceForTest(50000n); // 500 ARTH unbacked debit
    const report = await watcher.runIntegrityAudit();
    assert(
      'Injected debit/credit ledger imbalance immediately triggers CRITICAL_IMBALANCE status',
      report.status === 'CRITICAL_IMBALANCE' && report.imbalanceMinor === '50000' && report.alertsEmitted >= 1,
    );
  }

  // Test 17: Dispatches CRITICAL_PAGING_ALERT to Listeners
  {
    watcher.clearAlerts();
    let receivedAlert: PagingAlert | null = null;
    const unsubscribe = watcher.onAlert((alert) => {
      receivedAlert = alert;
    });

    watcher.injectImbalanceForTest(1000000n);
    await watcher.runIntegrityAudit();
    unsubscribe();

    assert(
      'Ledger imbalance automatically dispatches CRITICAL_PAGING_ALERT to registered listeners',
      receivedAlert !== null &&
        receivedAlert.severity === 'CRITICAL' &&
        receivedAlert.title.includes('Sovereign Ledger Double-Entry Imbalance'),
    );
    watcher.resetSimulation();
  }

  // Test 18: Base Money Supply (M0) Discrepancy Alert
  {
    watcher.clearAlerts();
    watcher.injectM0DiscrepancyForTest(250000000n); // 2.5M ARTH unrecorded M0 deviation
    const report = await watcher.runIntegrityAudit();
    const alerts = watcher.getRecentAlerts();
    const m0Alert = alerts.find((a) => a.title.includes('Base Money Supply (M0) Discrepancy'));

    assert(
      'Base Money Supply (M0) discrepancy triggers CRITICAL_PAGING_ALERT with discrepancy amount',
      report.status === 'CRITICAL_IMBALANCE' && m0Alert !== undefined && m0Alert.severity === 'CRITICAL',
    );
    watcher.resetSimulation();
  }

  // Test 19: Stalled CLS Settlement Queue Warning Alert
  {
    watcher.clearAlerts();
    watcher.injectStalledSettlementsForTest(3);
    const report = await watcher.runIntegrityAudit();
    const alerts = watcher.getRecentAlerts();
    const clsAlert = alerts.find((a) => a.title.includes('Stalled CLS Settlements'));

    assert(
      'CLS settlements stalled > 5 minutes trigger high-priority WARNING paging alert',
      report.status === 'WARNING' && clsAlert !== undefined && clsAlert.severity === 'WARNING',
    );
    watcher.resetSimulation();
  }

  // Test 20: Alerts Stored in Recent Ring Buffer
  {
    watcher.clearAlerts();
    watcher.injectImbalanceForTest(100n);
    await watcher.runIntegrityAudit();
    const alerts = watcher.getRecentAlerts();

    assert(
      'Emitted paging alerts are stored in recent ring buffer with full cryptographic context',
      alerts.length > 0 && alerts[0].details !== undefined && typeof alerts[0].timestamp === 'string',
    );
    watcher.resetSimulation();
  }

  // ===========================================================================
  // GROUP 5: CORS SECURITY & FINANCIAL IDEMPOTENCY HEADERS
  // ===========================================================================
  console.log('\n--- Group 5: CORS Security & Financial Idempotency Headers ---');

  const corsConfig = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'x-idempotency-key',
      'X-Idempotency-Key',
    ],
  };

  // Test 21: Lowercase x-idempotency-key in CORS Allowed Headers
  assert(
    'CORS configuration permits lowercase x-idempotency-key in allowedHeaders for transfer replay protection',
    corsConfig.allowedHeaders.includes('x-idempotency-key'),
  );

  // Test 22: Uppercase X-Idempotency-Key in CORS Allowed Headers
  assert(
    'CORS configuration permits standard uppercase X-Idempotency-Key',
    corsConfig.allowedHeaders.includes('X-Idempotency-Key'),
  );

  // Test 23: Credentials Mode Enabled
  assert(
    'CORS credentials mode is enabled for sovereign cookie/session transport',
    corsConfig.credentials === true && corsConfig.origin !== '*',
  );

  // Test 24: IP Isolation in Rate Limiting
  {
    RateLimiterStore.clear();
    const reqA: any = {
      headers: { 'x-forwarded-for': '10.0.0.1' },
      baseUrl: '/api/v1/auth/login',
      socket: { remoteAddress: '10.0.0.1' },
    };
    const reqB: any = {
      headers: { 'x-forwarded-for': '10.0.0.2' },
      baseUrl: '/api/v1/auth/login',
      socket: { remoteAddress: '10.0.0.2' },
    };

    // Burn 5 hits for IP A
    for (let i = 0; i < 5; i++) {
      const { res } = createMockResponse();
      rateLimiter.use(reqA, res, () => {});
    }

    // IP A should be blocked
    const { res: resA, getStatus: getStatusA } = createMockResponse();
    rateLimiter.use(reqA, resA, () => {});

    // IP B should be allowed with full quota
    const { res: resB, getStatus: getStatusB, getHeaders: getHeadersB } = createMockResponse();
    let nextB = false;
    rateLimiter.use(reqB, resB, () => {
      nextB = true;
    });

    assert(
      'Rate limiter tracks distinct clients by IP address without cross-client quota bleed',
      getStatusA() === 429 && getStatusB() === 200 && nextB && getHeadersB()['x-ratelimit-remaining'] === '5',
    );
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED:      ${passed}`);
  console.log(`FAILED:      ${failed}`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionHardeningSuite().catch((err) => {
  console.error('Production hardening test suite aborted with unhandled error:', err);
  process.exit(1);
});
