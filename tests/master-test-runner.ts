import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

interface SuiteDefinition {
  phase: string;
  name: string;
  specPath: string;
  description: string;
}

const SUITES: SuiteDefinition[] = [
  {
    phase: 'Phase 2A',
    name: 'Identity & Real Database Auth',
    specPath: 'src/identity/identity.spec.ts',
    description: 'PostgreSQL GovId/User models, Argon2id isolation, Redis sessions, killswitch & rate limits',
  },
  {
    phase: 'Phase 2B',
    name: 'Runtime Persistence & Fail-Closed',
    specPath: 'src/database/persistence-failclosed.spec.ts',
    description: 'PostgreSQL 44-table verification, restart survival, ledger writes, fail-closed isolation',
  },
  {
    phase: 'Phase 4',
    name: 'Core Double-Entry Ledger',
    specPath: 'src/ledger/ledger.spec.ts',
    description: 'Debit/Credit invariants, 9-state machine, reversal contra-entries, non-negative balance',
  },
  {
    phase: 'Phase 5',
    name: 'Commercial Banking Domain',
    specPath: 'src/banking/banking.spec.ts',
    description: '5 canonical banks, customer join, account opening, daily limit, BankScopeGuard',
  },
  {
    phase: 'Phase 6',
    name: 'Central Settlement Layer (CLS)',
    specPath: 'src/cls/cls.spec.ts',
    description: 'RTGS 2-legged settlement, batch execution atomicity, rollback contra-refunds',
  },
  {
    phase: 'Phase 7',
    name: 'Stock Market & Tax Engine',
    specPath: 'src/stocks/stocks.spec.ts',
    description: '10 canonical tickers, circuit limits, DvP matching, 15% CGT, loss offsets',
  },
  {
    phase: 'Phase 8',
    name: 'Shop & Virtual Economy',
    specPath: 'src/shop/shop.spec.ts',
    description: '45 canonical items, frame rarity tiers, ledger debit, single-pet loadout, bouny',
  },
  {
    phase: 'Phase 9',
    name: 'Notifications & Mailbox',
    specPath: 'src/notifications/notifications.spec.ts',
    description: 'Deterministic dispatch, tenant isolation, unread count, immutable financial facts',
  },
  {
    phase: 'Phase 10',
    name: 'Fixed Deposits & Yield Engine',
    specPath: 'src/fixed-deposits/fixed-deposits.spec.ts',
    description: 'Quarterly compounding, pet yield boost (+0.25%), statutory lock-in, pre-closure',
  },
  {
    phase: 'Phase 11',
    name: 'ARTHAX World Integration',
    specPath: 'src/integration/world-integration.spec.ts',
    description: 'Unified cross-portal session, step-up security, cross-domain event envelopes',
  },
  {
    phase: 'Phase 12A',
    name: 'Commercial Credit & Lending',
    specPath: 'src/banking/loans/loans.spec.ts',
    description: 'Credit scoring (300-850), DTI (<50%), collateral lien, reducing EMI, foreclosure',
  },
  {
    phase: 'Phase 12B',
    name: 'Central Bank Policy & Governance',
    specPath: 'src/central-bank/central-bank.spec.ts',
    description: 'Dual invariants (M0 + ledger), Maker-Checker, CRR/SLR/CAR, ELA haircut, circuit breakers',
  },
  {
    phase: 'Phase 13',
    name: 'Cross-Portal End-to-End Journey',
    specPath: 'src/e2e/arthax-world.e2e.spec.ts',
    description: 'Complete 9-stage multi-persona financial lifecycle across all 6 portals',
  },
  {
    phase: 'Phase 13',
    name: 'Concurrency & Race Conditions',
    specPath: 'src/concurrency/concurrency.spec.ts',
    description: 'Overdraft races, order-matching races, short-selling guards, lien races, idempotency burst',
  },
  {
    phase: 'Phase 13',
    name: 'Security Fault-Injection Matrix',
    specPath: 'src/security/fault-injection.spec.ts',
    description: 'Step-up auth bypass, multi-tenant RBAC boundaries, ledger invariant tamper, freeze matrix',
  },
  {
    phase: 'Phase 13',
    name: 'WCAG 2.1 AA Accessibility Audit',
    specPath: '../../tests/a11y/wcag-audit.spec.ts',
    description: 'Relative luminance contrast engine, Arth Gold Rule 7 proof, keyboard focus, table a11y',
  },
  {
    phase: 'Phase 14',
    name: 'DevOps & Production Hardening',
    specPath: 'src/devops/production-hardening.spec.ts',
    description: 'Healthcheck probes, sliding-window rate limiting, security headers, ledger watcher alerting',
  },
];

async function main() {
  console.log('╔═════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                     ARTHAX SOVEREIGN FINANCIAL ECOSYSTEM MASTER TEST RUNNER                 ║');
  console.log('║                            Executing All 17 Invariant Suites Across Monorepo (664 Tests)    ║');
  console.log('╚═════════════════════════════════════════════════════════════════════════════════════════════╝\n');

  const workspaceRoot = fs.existsSync(path.resolve(process.cwd(), 'apps/api'))
    ? process.cwd()
    : path.resolve(process.cwd(), '../..');
  const apiDir = path.resolve(workspaceRoot, 'apps/api');
  let totalTestsPassed = 0;
  let totalSuitesPassed = 0;
  let totalSuitesFailed = 0;
  const startTime = Date.now();

  const resultsTable: { phase: string; domain: string; tests: number; durationMs: number; status: string }[] = [];

  for (const suite of SUITES) {
    process.stdout.write(`▶ Running [${suite.phase}] ${suite.name}... `);
    const suiteStart = Date.now();
    try {
      const output = execSync(
        `pnpm exec ts-node -r reflect-metadata ${suite.specPath}`,
        { cwd: apiDir, stdio: ['pipe', 'pipe', 'pipe'], encoding: 'utf8' }
      );

      const durationMs = Date.now() - suiteStart;
      // Extract test count from output
      const passMatches = output.match(/PASS/g);
      const testCount = passMatches ? passMatches.length : 0;
      totalTestsPassed += testCount;
      totalSuitesPassed++;

      console.log(`\x1b[32m✔ PASSED\x1b[0m (${testCount} tests in ${(durationMs / 1000).toFixed(2)}s)`);
      resultsTable.push({
        phase: suite.phase,
        domain: suite.name,
        tests: testCount,
        durationMs,
        status: 'PASSED',
      });
    } catch (err: any) {
      const durationMs = Date.now() - suiteStart;
      totalSuitesFailed++;
      console.log(`\x1b[31m✖ FAILED\x1b[0m in ${(durationMs / 1000).toFixed(2)}s`);
      console.error(err.stdout || err.stderr || err.message);
      resultsTable.push({
        phase: suite.phase,
        domain: suite.name,
        tests: 0,
        durationMs,
        status: 'FAILED',
      });
    }
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n=================================================================================================');
  console.log('                                 MASTER REGRESSION AUDIT RESULTS');
  console.log('=================================================================================================');
  console.log('| Phase      | Domain Name                              | Invariants Verified | Status    |');
  console.log('|------------|------------------------------------------|---------------------|-----------|');
  for (const r of resultsTable) {
    const phaseCol = r.phase.padEnd(10);
    const domainCol = r.domain.padEnd(40);
    const countCol = String(r.tests).padStart(8) + ' tests        ';
    const statusCol = r.status === 'PASSED' ? '\x1b[32m✔ PASSED\x1b[0m   ' : '\x1b[31m✖ FAILED\x1b[0m   ';
    console.log(`| ${phaseCol} | ${domainCol} | ${countCol} | ${statusCol} |`);
  }
  console.log('=================================================================================================');
  console.log(`TOTAL SUITES:    ${SUITES.length} (${totalSuitesPassed} Passed, ${totalSuitesFailed} Failed)`);
  console.log(`TOTAL TESTS:     \x1b[32m${totalTestsPassed} PASSED\x1b[0m / \x1b[31m${totalSuitesFailed} FAILED\x1b[0m`);
  console.log(`TOTAL DURATION:  ${totalDuration}s`);
  console.log('=================================================================================================\n');

  if (totalSuitesFailed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Master test runner aborted with error:', err);
  process.exit(1);
});
