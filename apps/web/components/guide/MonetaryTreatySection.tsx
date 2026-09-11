'use client';

import React, { useState } from 'react';
import { Scale, Fingerprint } from 'lucide-react';

export function MonetaryTreatySection() {
  const [activeTab, setActiveTab] = useState<'ledger' | 'currency' | 'identity'>('ledger');

  return (
    <section className="py-20 md:py-28 bg-surface-container-low/60 border-y border-ink/10 relative" id="ledger-engine">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft-blue/20 text-deep-blue text-xs font-mono font-bold tracking-wider uppercase mb-3">
            <Scale className="w-3.5 h-3.5 text-deep-blue" />
            <span>SECTION 03 • MONETARY & ARCHITECTURAL TREATY</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-deep-blue font-normal tracking-tight">
            The Three Inviolable Laws of the ARTHAX Financial Ecosystem.
          </h2>
          <p className="font-body text-base sm:text-lg text-ink-soft mt-3 leading-relaxed">
            Every transaction, bank deposit, market execution, and shop acquisition is governed by structural,
            mathematically enforced protocol invariants.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-surface-container rounded-2xl w-fit mb-8 border border-ink/10">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ledger'
                ? 'bg-surface-container-lowest text-deep-blue shadow-xs font-bold'
                : 'text-ink-soft hover:text-deep-blue'
            }`}
          >
            1. Core Double-Entry Ledger
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'currency'
                ? 'bg-surface-container-lowest text-deep-blue shadow-xs font-bold'
                : 'text-ink-soft hover:text-deep-blue'
            }`}
          >
            2. Single Currency Standard (ARTH)
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'identity'
                ? 'bg-surface-container-lowest text-deep-blue shadow-xs font-bold'
                : 'text-ink-soft hover:text-deep-blue'
            }`}
          >
            3. Dual-Password Identity Chain
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {activeTab === 'ledger' && (
            <>
              <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-3xl border border-ink/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-deep-blue/10 text-deep-blue flex items-center justify-center font-bold font-mono">
                      Σ
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-deep-blue font-semibold">
                        Double-Entry Conservation Law
                      </h3>
                      <span className="text-xs font-mono text-ink-muted">INVARIANT LAW #1</span>
                    </div>
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed mb-6">
                    Money can never be minted, altered, or erased in transit. Every economic action produces balanced
                    atomic entries. The central ledger is append-only: mistakes are resolved exclusively by compensating
                    reversals, guaranteeing permanent cryptographic auditability.
                  </p>

                  <div className="bg-off-white p-5 rounded-2xl border border-ink/10 font-mono text-xs space-y-3">
                    <div className="flex justify-between items-center text-ink-soft pb-2 border-b border-ink/10">
                      <span className="text-ink font-bold">TRANSACTION PROTOCOL ENFORCEMENT</span>
                      <span className="text-positive font-bold">STRICT_ZERO_SUM</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl border border-ink/10">
                        <span className="text-[10px] text-ink-muted block uppercase">DEBIT ENTRY</span>
                        <span className="text-sm font-bold text-deep-blue block mt-1">+100,000 ARTH</span>
                        <span className="text-[11px] text-ink-soft">Destination: User Payroll Acct</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-ink/10">
                        <span className="text-[10px] text-ink-muted block uppercase">CREDIT ENTRY</span>
                        <span className="text-sm font-bold text-loss block mt-1">-100,000 ARTH</span>
                        <span className="text-[11px] text-ink-soft">Source: NAVA Commercial Vault</span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-positive font-bold">
                      Net Journal Delta: 0.0000 ARTH [BALANCED]
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-xs font-mono text-ink-muted">
                  <span>Enforced at PostgreSQL DB Constraint Level</span>
                  <span className="text-deep-blue font-bold">Article IV, Para 2</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-6 bg-surface-container-lowest rounded-3xl border border-ink/10 shadow-xs">
                  <h4 className="font-display text-lg text-deep-blue font-semibold mb-2">Immutable History</h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    Tables reject all SQL <code className="font-mono bg-ink/5 px-1 py-0.5 rounded">UPDATE</code> and{' '}
                    <code className="font-mono bg-ink/5 px-1 py-0.5 rounded">DELETE</code> commands. Transactions are
                    strictly additive.
                  </p>
                </div>
                <div className="p-6 bg-surface-container-lowest rounded-3xl border border-ink/10 shadow-xs">
                  <h4 className="font-display text-lg text-deep-blue font-semibold mb-2">Single Source of Truth</h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    Banking, Stock trades, Shop purchases, and Milestone rewards all funnel through one central ledger
                    interface. No separate wallet silos.
                  </p>
                </div>
                <div className="p-6 bg-surface-container-lowest rounded-3xl border border-ink/10 shadow-xs">
                  <h4 className="font-display text-lg text-deep-blue font-semibold mb-2">Continuous Reconciliation</h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    Automated background worker reconciles Total Debits vs Total Credits every 60 seconds with instant
                    alerting for anomalies.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'currency' && (
            <>
              <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-3xl border border-ink/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-arth-gold/15 text-arth-gold flex items-center justify-center font-bold text-xl font-accent">
                      A
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-deep-blue font-semibold">The ARTH Monetary Standard</h3>
                      <span className="text-xs font-mono text-ink-muted">INVARIANT LAW #2</span>
                    </div>
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed mb-6">
                    ARTH is the exclusive legal tender across all 6 portals. ARTHAX explicitly bans secondary coins,
                    points, tokenized loyalty currencies, or shop-only credits. Every price is anchored directly in
                    standardized integer minor units.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-off-white rounded-xl border border-ink/10">
                      <span className="text-xs font-medium text-ink">Commercial Bank Accounts</span>
                      <span className="text-xs font-mono font-bold text-deep-blue">Settled in ARTH</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-off-white rounded-xl border border-ink/10">
                      <span className="text-xs font-medium text-ink">Capital Market & Stock Trades</span>
                      <span className="text-xs font-mono font-bold text-deep-blue">Settled in ARTH</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-off-white rounded-xl border border-ink/10">
                      <span className="text-xs font-medium text-ink">Virtual Marketplace (Pets, Avatars, Frames)</span>
                      <span className="text-xs font-mono font-bold text-deep-blue">Settled in ARTH</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-off-white rounded-xl border border-ink/10">
                      <span className="text-xs font-medium text-ink">Fixed Deposit Interest & Capital Gains Tax</span>
                      <span className="text-xs font-mono font-bold text-deep-blue">Settled in ARTH</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-xs font-mono text-ink-muted">
                  <span>Zero Decimal Floating Point Drift</span>
                  <span className="text-arth-gold font-bold">Strict Integer Arithmetic</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-6 bg-surface-container-lowest rounded-3xl border border-ink/10 shadow-xs">
                  <h4 className="font-display text-lg text-deep-blue font-semibold mb-2">No Shop Token Inflation</h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    Unlike gaming ecosystems that introduce fake gems or coins, buying a pet or frame requires spending
                    real ARTH from your bank account balance.
                  </p>
                </div>
                <div className="p-6 bg-surface-container-lowest rounded-3xl border border-ink/10 shadow-xs">
                  <h4 className="font-display text-lg text-deep-blue font-semibold mb-2">Tax On Profit Only</h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    Equities tax applies exclusively to realized net gains, never gross trading volume, ensuring genuine
                    fiscal realism.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'identity' && (
            <>
              <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-3xl border border-ink/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-positive/10 text-positive flex items-center justify-center font-bold">
                      <Fingerprint className="w-5 h-5 text-positive" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-deep-blue font-semibold">
                        The Sovereign Identity Chain
                      </h3>
                      <span className="text-xs font-mono text-ink-muted">INVARIANT LAW #3</span>
                    </div>
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed mb-6">
                    Citizens possess one unified identity across all institutions. You never register separate
                    usernames or passwords per bank. Dual-password architecture ensures general browsing cannot
                    compromise financial execution.
                  </p>

                  <div className="bg-off-white p-5 rounded-2xl border border-ink/10 font-mono text-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-deep-blue text-white flex items-center justify-center text-[10px] font-bold">
                        1
                      </span>
                      <span className="text-ink font-semibold">Email Verification via One-Time Passcode</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-deep-blue text-white flex items-center justify-center text-[10px] font-bold">
                        2
                      </span>
                      <span className="text-ink font-semibold">GOV ID + GOV Password (Identity Portal Access)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-arth-gold text-white flex items-center justify-center text-[10px] font-bold">
                        3
                      </span>
                      <span className="text-ink font-semibold">Financial Password (Isolated High-Risk Actions)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-positive text-white flex items-center justify-center text-[10px] font-bold">
                        4
                      </span>
                      <span className="text-ink font-semibold">
                        Multi-Bank Account Enrollment (Purpose-Driven Banking)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-xs font-mono text-ink-muted">
                  <span>Server-Side Isolation Enforced</span>
                  <span className="text-positive font-bold">Argon2id Hashed</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-6 bg-surface-container-lowest rounded-3xl border border-ink/10 shadow-xs">
                  <h4 className="font-display text-lg text-deep-blue font-semibold mb-2">Step-Up Security</h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    Executing a transfer or stock trade mandates Financial Password re-verification plus OTP, preventing
                    session hijacking.
                  </p>
                </div>
                <div className="p-6 bg-surface-container-lowest rounded-3xl border border-ink/10 shadow-xs">
                  <h4 className="font-display text-lg text-deep-blue font-semibold mb-2">Masked Balances</h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    Net worth and balances load masked by default with intentional click-to-reveal for shoulder-surfing
                    defense.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default MonetaryTreatySection;
