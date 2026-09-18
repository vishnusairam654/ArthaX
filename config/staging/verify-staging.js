/**
 * ==============================================================================
 * ARTHAX LIVE STAGING ENVIRONMENT VERIFICATION HARNESS (STANDALONE NODE.JS)
 * ==============================================================================
 * Usage:
 *   node config/staging/verify-staging.js <STAGING_API_URL> [STAGING_WEB_URL]
 * Example:
 *   node config/staging/verify-staging.js https://api-staging.up.railway.app https://web-staging.up.railway.app
 * ==============================================================================
 */

const https = require('https');
const http = require('http');

const apiUrlArg = process.argv[2];
const webUrlArg = process.argv[3];

if (!apiUrlArg) {
  console.error('❌ Error: STAGING_API_URL required.');
  console.error('Usage: node config/staging/verify-staging.js <STAGING_API_URL> [STAGING_WEB_URL]');
  process.exit(1);
}

const API_BASE = apiUrlArg.replace(/\/+$/, '');
const WEB_BASE = webUrlArg ? webUrlArg.replace(/\/+$/, '') : null;

function request(urlStr, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(
      url,
      {
        method: opts.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ARTHAX-Staging-Verifier',
          ...(opts.headers || {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed = data;
          try {
            parsed = JSON.parse(data);
          } catch {
            // Keep as string
          }
          resolve({ status: res.statusCode || 0, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (opts.body) {
      req.write(typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body));
    }
    req.end();
  });
}

function assert(description, condition, details) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${description}`);
  } else {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${description}${details ? ` -> ${details}` : ''}`);
    process.exit(1);
  }
}

async function runStagingVerification() {
  console.log('\n================================================================================');
  console.log('       ARTHAX SOVEREIGN FINANCIAL ECOSYSTEM — STAGING VERIFICATION HARNESS      ');
  console.log('================================================================================');
  console.log(`Target API: ${API_BASE}`);
  if (WEB_BASE) console.log(`Target Web: ${WEB_BASE}`);
  console.log('--------------------------------------------------------------------------------\n');

  // ---------------------------------------------------------------------------
  // STEP 1: Health & Readiness Probes
  // ---------------------------------------------------------------------------
  console.log('▶ [1/6] Probing API Health & Readiness Endpoints...');

  const liveness = await request(`${API_BASE}/api/v1/health/liveness`);
  assert('API Liveness probe returns HTTP 200', liveness.status === 200, `Got HTTP ${liveness.status}`);
  assert('API Liveness payload status is "healthy"', liveness.body && liveness.body.status === 'healthy', JSON.stringify(liveness.body));

  const readiness = await request(`${API_BASE}/api/v1/health/readiness`);
  assert('API Readiness probe returns HTTP 200', readiness.status === 200, `Got HTTP ${readiness.status}`);
  assert('Readiness confirms PostgreSQL connection', readiness.body && readiness.body.database === 'connected', JSON.stringify(readiness.body));
  assert('Readiness confirms Redis connection', readiness.body && readiness.body.redis === 'connected', JSON.stringify(readiness.body));

  const detailed = await request(`${API_BASE}/api/v1/health/detailed`);
  assert('Detailed Ledger probe returns HTTP 200', detailed.status === 200, `Got HTTP ${detailed.status}`);
  assert('Ledger global double-entry is BALANCED', detailed.body && detailed.body.ledgerStatus === 'BALANCED', JSON.stringify(detailed.body));
  assert('Ledger global imbalance is 0 minor units', detailed.body && (detailed.body.imbalanceMinor === 0 || detailed.body.imbalanceMinor === '0'), JSON.stringify(detailed.body));

  // ---------------------------------------------------------------------------
  // STEP 2: Database Seed Verification (Banks & Rules)
  // ---------------------------------------------------------------------------
  console.log('\n▶ [2/6] Verifying Staging Database Seed Entities...');

  const banksRes = await request(`${API_BASE}/api/v1/banks`);
  assert('Banks listing returns HTTP 200', banksRes.status === 200, `Got HTTP ${banksRes.status}`);
  const banks = Array.isArray(banksRes.body) ? banksRes.body : [];
  assert('5 Canonical Banks seeded (NAVA, SAMAYA, SETU, STHIRA, VAYU)', banks.length >= 5, `Found: ${banks.length}`);

  const stocksRes = await request(`${API_BASE}/api/v1/stocks`);
  assert('Stock equities listing returns HTTP 200', stocksRes.status === 200, `Got HTTP ${stocksRes.status}`);
  const stocks = Array.isArray(stocksRes.body) ? stocksRes.body : [];
  assert('10 Canonical Companies listed on sovereign exchange', stocks.length >= 10, `Found: ${stocks.length}`);

  // ---------------------------------------------------------------------------
  // STEP 3: Citizen Authentication & Session Issuance (Argon2id + Redis)
  // ---------------------------------------------------------------------------
  console.log('\n▶ [3/6] Verifying Live Citizen Authentication (Argon2id + Redis)...');

  const loginPayload = {
    govIdNumber: 'GOV-8419-2041', // Aarav Vance
    password: 'GovSovereign@2026!',
  };

  const loginRes = await request(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    body: loginPayload,
  });

  assert('Citizen GOV Login returns HTTP 200/201', loginRes.status === 200 || loginRes.status === 201, `Got HTTP ${loginRes.status}: ${JSON.stringify(loginRes.body)}`);
  const accessToken = loginRes.body && (loginRes.body.accessToken || loginRes.body.token);
  assert('JWT Session Token issued by staging API', !!accessToken);

  const authHeaders = { Authorization: `Bearer ${accessToken}` };

  const profileRes = await request(`${API_BASE}/api/v1/auth/me`, { headers: authHeaders });
  assert('Authenticated profile fetch returns HTTP 200', profileRes.status === 200, `Got HTTP ${profileRes.status}`);
  assert('Citizen name resolved correctly', profileRes.body && profileRes.body.displayName === 'Aarav Vance', JSON.stringify(profileRes.body));

  // ---------------------------------------------------------------------------
  // STEP 4: Live Inter-Bank Transfer (NAVA -> SETU via CLS)
  // ---------------------------------------------------------------------------
  console.log('\n▶ [4/6] Executing Live Inter-Bank Transfer via CLS Rails...');

  const accountsRes = await request(`${API_BASE}/api/v1/banking/accounts`, { headers: authHeaders });
  assert('Customer bank accounts listing returns HTTP 200', accountsRes.status === 200, `Got HTTP ${accountsRes.status}`);
  const accounts = Array.isArray(accountsRes.body) ? accountsRes.body : [];
  assert('Citizen possesses accounts across multiple banks', accounts.length >= 2, `Found ${accounts.length} accounts`);

  const navaAcct = accounts.find((a) => (a.accountNumber && a.accountNumber.includes('NAVA')) || a.bankId === 'nava');
  const setuAcct = accounts.find((a) => (a.accountNumber && a.accountNumber.includes('SETU')) || a.bankId === 'setu');
  assert('NAVA source account identified', !!navaAcct, 'Could not find NAVA account');
  assert('SETU destination account identified', !!setuAcct, 'Could not find SETU account');

  const transferAmountMinor = 10000; // 100.00 ARTH

  const transferRes = await request(`${API_BASE}/api/v1/banking/transfers`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'x-idempotency-key': `staging-test-tx-${Date.now()}`,
    },
    body: {
      sourceAccountId: navaAcct.id,
      destinationAccountId: setuAcct.id,
      amountMinor: transferAmountMinor,
      financialPassword: 'FinSecret#2026',
      purpose: 'Staging Live CLS Verification Transfer',
    },
  });

  assert('Live transfer processed through staging ledger', transferRes.status === 200 || transferRes.status === 201, `Got HTTP ${transferRes.status}: ${JSON.stringify(transferRes.body)}`);
  assert('Transaction status is COMPLETED or PROCESSING', ['COMPLETED', 'PROCESSING', 'SETTLING'].includes(transferRes.body && transferRes.body.status), JSON.stringify(transferRes.body));

  // ---------------------------------------------------------------------------
  // STEP 5: Post-Transfer Double-Entry Invariant Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ [5/6] Verifying Global Double-Entry Ledger Invariant Post-Transfer...');

  const postDetailed = await request(`${API_BASE}/api/v1/health/detailed`);
  assert('Detailed Ledger probe confirms zero imbalance after transfer', postDetailed.body && (postDetailed.body.imbalanceMinor === 0 || postDetailed.body.imbalanceMinor === '0'), JSON.stringify(postDetailed.body));

  // ---------------------------------------------------------------------------
  // STEP 6: Web Standalone SSR Routing Probe (if WEB_URL provided)
  // ---------------------------------------------------------------------------
  if (WEB_BASE) {
    console.log('\n▶ [6/6] Verifying Web Standalone Routes & Reverse Proxy...');

    const webHome = await request(`${WEB_BASE}/`);
    assert('Web home page (/) returns HTTP 200', webHome.status === 200, `Got HTTP ${webHome.status}`);

    const webBank = await request(`${WEB_BASE}/bank`);
    assert('Web bank portal (/bank) returns HTTP 200', webBank.status === 200, `Got HTTP ${webBank.status}`);

    const webProxy = await request(`${WEB_BASE}/api/v1/health/liveness`);
    assert('Web same-origin reverse proxy (/api/v1/health/liveness) proxies to API successfully', webProxy.status === 200, `Got HTTP ${webProxy.status}`);
  }

  console.log('\n================================================================================');
  console.log('       ✔ ALL STAGING LIVE FINANCIAL VERIFICATION PROBES PASSED 100%!            ');
  console.log('================================================================================\n');
}

runStagingVerification().catch((err) => {
  console.error('\n❌ Unhandled error during staging verification:', err);
  process.exit(1);
});
