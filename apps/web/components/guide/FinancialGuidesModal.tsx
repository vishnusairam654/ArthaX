'use client';

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Building2, 
  Receipt, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface FinancialGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: 'banking' | 'taxes' | 'trading';
}

export function FinancialGuidesModal({ isOpen, onClose, initialTopic = 'banking' }: FinancialGuidesModalProps) {
  const [activeTopic, setActiveTopic] = useState<'banking' | 'taxes' | 'trading'>(initialTopic);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#022448]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guides-modal-title"
    >
      <div 
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl border border-[#3368A0]/20 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#F2EFE7]/80 border-b border-[#3368A0]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#022448] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4 text-[#A8742A]" />
            </div>
            <div>
              <h2 id="guides-modal-title" className="font-display text-lg sm:text-xl font-semibold text-[#022448]">
                Sovereign Financial Educational Guides
              </h2>
              <span className="font-mono text-[10px] text-[#A8742A] uppercase tracking-wider block">
                Charter 409-C Educational Curriculum
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#E5E0D4] text-[#262320]/70 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-[#3368A0]"
            aria-label="Close Educational Guide Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 bg-[#F8F9FF] border-b border-[#3368A0]/10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTopic('banking')}
            className={`px-4 py-2 rounded-t-xl text-xs font-body font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTopic === 'banking'
                ? 'bg-white text-[#022448] border-[#022448] shadow-2xs'
                : 'text-[#262320]/60 border-transparent hover:text-[#022448]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. How Banking Works</span>
          </button>
          <button
            onClick={() => setActiveTopic('taxes')}
            className={`px-4 py-2 rounded-t-xl text-xs font-body font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTopic === 'taxes'
                ? 'bg-white text-[#022448] border-[#022448] shadow-2xs'
                : 'text-[#262320]/60 border-transparent hover:text-[#022448]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>2. How Taxes Work</span>
          </button>
          <button
            onClick={() => setActiveTopic('trading')}
            className={`px-4 py-2 rounded-t-xl text-xs font-body font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTopic === 'trading'
                ? 'bg-white text-[#022448] border-[#022448] shadow-2xs'
                : 'text-[#262320]/60 border-transparent hover:text-[#022448]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>3. How Stock Trading &amp; DvP Work</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* ================= TOPIC 1: BANKING ================= */}
          {activeTopic === 'banking' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#A8742A] font-bold uppercase tracking-wider">
                    MODULE 01 // CITIZEN FINANCIAL TOPOLOGY
                  </span>
                  <h3 className="font-display text-2xl text-[#022448] font-semibold mt-0.5">
                    How Commercial Banking Operates in ARTHAX
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#3368A0]/10 text-[#3368A0] font-mono text-[10px] font-bold">
                  UNIFIED SESSION
                </span>
              </div>

              <p className="font-body text-sm text-[#262320]/80 leading-relaxed">
                In traditional finance, opening an account at multiple banks requires repeating KYC questionnaires, 
                remembering separate credentials, and managing disjointed accounts. ARTHAX institutes a singular double-entry paradigm:
              </p>

              {/* Invariant Formula Card */}
              <div className="p-4 rounded-2xl bg-[#F2EFE7] border border-[#3368A0]/15 flex items-center justify-between">
                <span className="font-mono text-xs text-[#022448] font-bold">
                  1 Email ➔ 1 GOV ID ➔ 1 Citizen User ➔ 5 Commercial Banks
                </span>
                <span className="text-[10px] font-mono text-[#A8742A] font-semibold">TREATY 409-C INVARIANT</span>
              </div>

              {/* 3 Core Mechanisms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#F8F9FF] border border-[#3368A0]/15 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#3368A0]/10 text-[#3368A0] flex items-center justify-center font-bold">1</div>
                  <h4 className="font-display text-sm font-semibold text-[#022448]">Multi-Bank Switcher</h4>
                  <p className="font-body text-xs text-[#262320]/75 leading-relaxed">
                    Citizens can switch between Nava (Payroll), Samaya (Savings), Setu (Infrastructure), Sthira (Vault), and Vayu (Retail) in one click without logging out.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F9FF] border border-[#3368A0]/15 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#A8742A]/10 text-[#A8742A] flex items-center justify-center font-bold">2</div>
                  <h4 className="font-display text-sm font-semibold text-[#022448]">Fixed Term Deposits</h4>
                  <p className="font-body text-xs text-[#262320]/75 leading-relaxed">
                    Lock liquid ARTH into term deposits with fixed APY yields (5.9% – 7.8% APY benchmark). Accrued interest is settled strictly on schedule directly to your checking ledger.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F9FF] border border-[#3368A0]/15 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold">3</div>
                  <h4 className="font-display text-sm font-semibold text-[#022448]">Collateralized Loans</h4>
                  <p className="font-body text-xs text-[#262320]/75 leading-relaxed">
                    Commercial bank credit is backed by statutory liquidity ratios (CRR &amp; SLR) supervised by the Central Bank to ensure solvent reserves.
                  </p>
                </div>
              </div>

              {/* Regulatory Notice Box */}
              <div className="p-4 rounded-xl bg-[#FDF8F0] border border-[#A8742A]/30 text-xs font-body text-[#262320]/80 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#022448] block">Statutory Separation of Powers:</strong>
                  The commercial bank portal is accessed strictly by licensed bank officers. Citizens manage their personal bank accounts, deposits, and transfers exclusively through the <strong>User Portal</strong>.
                </div>
              </div>
            </div>
          )}

          {/* ================= TOPIC 2: TAXES ================= */}
          {activeTopic === 'taxes' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#A8742A] font-bold uppercase tracking-wider">
                    MODULE 02 // FISCAL INTEGRITY &amp; LEVIES
                  </span>
                  <h3 className="font-display text-2xl text-[#022448] font-semibold mt-0.5">
                    How System-Wide Taxes Work in ARTHAX
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#A8742A]/15 text-[#A8742A] font-mono text-[10px] font-bold">
                  PROVISIONAL DEMO BENCHMARK
                </span>
              </div>

              <p className="font-body text-sm text-[#262320]/80 leading-relaxed">
                ARTHAX operates on a principle of transparent, automated, protocol-enforced fiscal realism.
                Unlike traditional jurisdictions with opaque annual filings, tax rules in ARTHAX execute automatically at settlement:
              </p>

              {/* Tax Rule Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Rule 1 */}
                <div className="p-5 rounded-2xl bg-[#F8F9FF] border border-[#3368A0]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#022448]">
                      0.05% CLS Settlement Levy
                    </span>
                    <span className="text-[10px] font-mono bg-[#3368A0]/10 text-[#3368A0] px-2 py-0.5 rounded font-semibold">
                      INTER-BANK
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#262320]/75 leading-relaxed">
                    A micro-transaction levy of 0.05% applied to inter-bank clearing movements. Automatically withheld by the Central Settlement Layer and routed to sovereign stability reserves.
                  </p>
                  <div className="p-2.5 bg-white rounded-lg font-mono text-[11px] text-[#262320]/70 border border-[#3368A0]/10">
                    Example: 10,000 ARTH transfer ➔ 5.00 ARTH protocol tax
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="p-5 rounded-2xl bg-[#F8F9FF] border border-[#3368A0]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#022448]">
                      15% Realized Stock Profit Tax
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-600/10 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                      NET GAINS ONLY
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#262320]/75 leading-relaxed">
                    Equities tax applies <strong>exclusively to net realized profit</strong> upon order closure, never gross trade value. If a trade executes at a loss, zero tax is withheld.
                  </p>
                  <div className="p-2.5 bg-white rounded-lg font-mono text-[11px] text-[#262320]/70 border border-[#3368A0]/10">
                    Buy @ 100 ➔ Sell @ 150 (Gain 50) ➔ Tax = 7.50 ARTH
                  </div>
                </div>
              </div>

              {/* Patient Capital Exemption Showcase */}
              <div className="p-5 rounded-2xl bg-[#F2EFE7] border border-[#A8742A]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#022448] font-semibold text-sm">
                  <Clock className="w-4 h-4 text-[#A8742A]" />
                  <span>The 365-Day Patient Capital Sovereign Incentive</span>
                </div>
                <p className="font-body text-xs text-[#262320]/80 leading-relaxed">
                  Under statutory monetary policy, equity positions held continuously for more than <strong>365 calendar days</strong> receive a 100% tax exemption upon liquidation. ARTHAX explicitly rewards patient capital and penalizes speculative day-trading churn.
                </p>
                <span className="font-mono text-[10px] text-[#A8742A] block pt-1">
                  [DEMO BENCHMARK: Subject to Central Bank Board Review]
                </span>
              </div>
            </div>
          )}

          {/* ================= TOPIC 3: TRADING & DvP ================= */}
          {activeTopic === 'trading' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#A8742A] font-bold uppercase tracking-wider">
                    MODULE 03 // EQUITIES &amp; DVP CONSENSUS
                  </span>
                  <h3 className="font-display text-2xl text-[#022448] font-semibold mt-0.5">
                    How Stock Trading &amp; DvP Settlement Work
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-800 font-mono text-[10px] font-bold">
                  SUB-400MS FINALITY
                </span>
              </div>

              <p className="font-body text-sm text-[#262320]/80 leading-relaxed">
                Traditional stock markets require T+2 business days for clearinghouses to settle cash and share certificates.
                The ARTHAX Sovereign Equities Exchange operates on an <strong>Atomic Delivery-versus-Payment (DvP)</strong> standard:
              </p>

              {/* DvP Steps */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#F8F9FF] border border-[#3368A0]/15 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#022448] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    A
                  </div>
                  <div>
                    <strong className="font-display text-sm text-[#022448] block">Instant Dual Lock</strong>
                    <p className="font-body text-xs text-[#262320]/75 mt-0.5">
                      The buyer's ARTH balance and the seller's verified stock shares are staged into an atomic ledger commitment simultaneously.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FF] border border-[#3368A0]/15 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#A8742A] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    B
                  </div>
                  <div>
                    <strong className="font-display text-sm text-[#022448] block">Zero Counterparty Risk</strong>
                    <p className="font-body text-xs text-[#262320]/75 mt-0.5">
                      If either counterparty defaults or lacks available balance, the entire batch transaction reverts instantly. No partial deliveries or counterparty failures.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FF] border border-[#3368A0]/15 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    C
                  </div>
                  <div>
                    <strong className="font-display text-sm text-[#022448] block">No Synthetic Leverage</strong>
                    <p className="font-body text-xs text-[#262320]/75 mt-0.5">
                      Unbacked short-selling and unhedged derivative leverage are constitutionally banned. Every share traded is tied to genuine corporate capitalization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-4 rounded-2xl bg-[#F2EFE7] border border-[#3368A0]/15 flex items-center justify-between">
                <div>
                  <span className="font-display text-xs font-bold text-[#022448] block">
                    Inspect the 10 Listed Sovereign Equities
                  </span>
                  <span className="text-[11px] font-body text-[#262320]/70">
                    Explore order books, financials, and company profiles on the exchange.
                  </span>
                </div>
                <a
                  href="/stocks"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#022448] hover:bg-[#1E3A5F] text-white font-body text-xs font-semibold rounded-full shadow-xs transition"
                >
                  <span>Open Stock Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A8742A]" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F2EFE7]/80 border-t border-[#3368A0]/15 flex items-center justify-between text-xs font-mono text-[#262320]/65">
          <span>Charter 409-C Educational Public Asset</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#022448] text-white font-body font-medium hover:bg-[#1E3A5F] transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinancialGuidesModal;
