'use client';

import React, { useState } from 'react';
import { Scale, CheckCircle2, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

export function MonetaryTreatySection() {
  const [activeTab, setActiveTab] = useState<'ledger' | 'currency' | 'identity'>('ledger');

  return (
    <section className="py-20 md:py-28 bg-[#F0F4F8]/60 border-y border-[#3368A0]/15 relative" id="ledger-engine">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3368A0]/10 text-[#022448] text-xs font-mono font-bold tracking-wider uppercase mb-3">
            <Scale className="w-3.5 h-3.5 text-[#3368A0]" />
            <span>HOW THE PLATFORM WORKS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
            Three Core Rules That Keep Your Money Safe
          </h2>
          <p className="font-body text-base text-[#262320]/75 mt-3 leading-relaxed">
            The platform is built on three simple principles designed to protect your funds and keep every transaction clear and accurate.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#E5E0D4]/70 rounded-2xl w-fit mb-8 border border-[#3368A0]/15">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-white text-[#022448] shadow-xs font-bold'
                : 'text-[#262320]/70 hover:text-[#022448]'
            }`}
          >
            1. Balanced Transfers
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'currency'
                ? 'bg-white text-[#022448] shadow-xs font-bold'
                : 'text-[#262320]/70 hover:text-[#022448]'
            }`}
          >
            2. One Currency (ARTH)
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'identity'
                ? 'bg-white text-[#022448] shadow-xs font-bold'
                : 'text-[#262320]/70 hover:text-[#022448]'
            }`}
          >
            3. One Account, Multiple Banks
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {activeTab === 'ledger' && (
            <>
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#3368A0]/15 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#022448]/10 text-[#022448] flex items-center justify-center font-bold">
                      <Scale className="w-5 h-5 text-[#022448]" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-[#022448] font-semibold">
                        Every Transfer Stays Balanced
                      </h3>
                      <span className="text-xs font-body text-[#262320]/60">Rule 1: Money is never lost or duplicated</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#262320]/75 leading-relaxed mb-6">
                    Whenever you send or receive money, the amount deducted from one account exactly equals the amount credited to the other. Both accounts update at the same time so your balance is always accurate.
                  </p>

                  <div className="bg-[#F8F9FF] p-5 rounded-2xl border border-[#3368A0]/15 text-xs space-y-3">
                    <div className="flex justify-between items-center text-[#262320]/70 pb-2 border-b border-[#3368A0]/10 font-medium">
                      <span>HOW A TRANSFER WORKS</span>
                      <span className="text-emerald-700 font-semibold">BALANCED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white rounded-xl border border-[#3368A0]/15">
                        <span className="text-[10px] text-[#262320]/60 block uppercase font-medium">SENDER ACCOUNT</span>
                        <span className="text-sm font-bold text-[#B5482E] block mt-1">-100 ARTH</span>
                        <span className="text-[11px] text-[#262320]/70">Deducted from balance</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#3368A0]/15">
                        <span className="text-[10px] text-[#262320]/60 block uppercase font-medium">RECIPIENT ACCOUNT</span>
                        <span className="text-sm font-bold text-emerald-700 block mt-1">+100 ARTH</span>
                        <span className="text-[11px] text-[#262320]/70">Added to balance</span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-emerald-700 font-medium">
                      Both accounts update together immediately
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#3368A0]/15 flex items-center justify-between text-xs text-[#262320]/60">
                  <span>Protected against double spending</span>
                  <span className="text-[#022448] font-medium">Instant Confirmation</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-6 bg-white rounded-3xl border border-[#3368A0]/15 shadow-xs">
                  <h4 className="font-display text-lg text-[#022448] font-semibold mb-2">Permanent Transaction History</h4>
                  <p className="text-xs text-[#262320]/75 leading-relaxed">
                    Every transfer is recorded permanently. If an issue ever occurs, transactions can be safely refunded with a clear record.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-[#3368A0]/15 shadow-xs">
                  <h4 className="font-display text-lg text-[#022448] font-semibold mb-2">One Single Balance</h4>
                  <p className="text-xs text-[#262320]/75 leading-relaxed">
                    Banking, stock trades, and shop purchases all update your account directly. You don't need to juggle multiple wallets.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-[#3368A0]/15 shadow-xs">
                  <h4 className="font-display text-lg text-[#022448] font-semibold mb-2">Continuous Verification</h4>
                  <p className="text-xs text-[#262320]/75 leading-relaxed">
                    Automated background checks run continuously to guarantee that all deposit and withdrawal records match perfectly.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'currency' && (
            <>
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#3368A0]/15 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-[#A8742A]/15 text-[#A8742A] flex items-center justify-center font-bold text-xl">
                      A
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-[#022448] font-semibold">The ARTH Currency Standard</h3>
                      <span className="text-xs font-body text-[#262320]/60">Rule 2: One unified currency across all services</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#262320]/75 leading-relaxed mb-6">
                    ARTH is the only currency used across the platform. There are no secondary tokens, points, or game credits. Prices and balances are always in real ARTH.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-[#F8F9FF] rounded-xl border border-[#3368A0]/15">
                      <span className="text-xs font-medium text-[#262320]">Bank Accounts &amp; Savings</span>
                      <span className="text-xs font-semibold text-[#022448]">Priced in ARTH</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-[#F8F9FF] rounded-xl border border-[#3368A0]/15">
                      <span className="text-xs font-medium text-[#262320]">Stock Market &amp; Equities</span>
                      <span className="text-xs font-semibold text-[#022448]">Traded in ARTH</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-[#F8F9FF] rounded-xl border border-[#3368A0]/15">
                      <span className="text-xs font-medium text-[#262320]">Shop (Avatars, Pets, Frames)</span>
                      <span className="text-xs font-semibold text-[#022448]">Purchased in ARTH</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-[#F8F9FF] rounded-xl border border-[#3368A0]/15">
                      <span className="text-xs font-medium text-[#262320]">Fixed Deposit Earnings</span>
                      <span className="text-xs font-semibold text-[#022448]">Paid in ARTH</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#3368A0]/15 flex items-center justify-between text-xs text-[#262320]/60">
                  <span>No currency conversions needed</span>
                  <span className="text-[#A8742A] font-semibold">Direct Value</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-6 bg-white rounded-3xl border border-[#3368A0]/15 shadow-xs">
                  <h4 className="font-display text-lg text-[#022448] font-semibold mb-2">No Artificial Tokens</h4>
                  <p className="text-xs text-[#262320]/75 leading-relaxed">
                    Unlike platforms with gems or points that lose value, every item in the shop is purchased directly with your regular bank balance.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-[#3368A0]/15 shadow-xs">
                  <h4 className="font-display text-lg text-[#022448] font-semibold mb-2">Tax on Profit Only</h4>
                  <p className="text-xs text-[#262320]/75 leading-relaxed">
                    Stock investment taxes only apply to actual net gains when you sell at a profit, never on your losses or initial investment.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'identity' && (
            <>
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#3368A0]/15 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-[#022448] font-semibold">
                        One Account, All Banks
                      </h3>
                      <span className="text-xs font-body text-[#262320]/60">Rule 3: One unified login for your entire financial life</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#262320]/75 leading-relaxed mb-6">
                    You have one central login across the entire platform. You don't need to register separate accounts, usernames, or passwords for each bank.
                  </p>

                  <div className="bg-[#F8F9FF] p-5 rounded-2xl border border-[#3368A0]/15 font-body text-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-[#022448] text-white flex items-center justify-center text-[10px] font-bold">
                        1
                      </span>
                      <span className="text-[#262320] font-medium">Verify your email with a one-time code</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-[#022448] text-white flex items-center justify-center text-[10px] font-bold">
                        2
                      </span>
                      <span className="text-[#262320] font-medium">Sign in with your Government Password to view accounts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-[#A8742A] text-white flex items-center justify-center text-[10px] font-bold">
                        3
                      </span>
                      <span className="text-[#262320] font-medium">Use your Financial Password only when sending money or trading</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                        4
                      </span>
                      <span className="text-[#262320] font-medium">Access any of the 5 partner banks seamlessly</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#3368A0]/15 flex items-center justify-between text-xs text-[#262320]/60">
                  <span>Seamless single sign-on</span>
                  <span className="text-emerald-700 font-semibold">Protected &amp; Private</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-6 bg-white rounded-3xl border border-[#3368A0]/15 shadow-xs">
                  <h4 className="font-display text-lg text-[#022448] font-semibold mb-2">Step-Up Confirmation</h4>
                  <p className="text-xs text-[#262320]/75 leading-relaxed">
                    Sending money or making an investment requires entering your Financial Password, so no one can spend your money by accident.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-[#3368A0]/15 shadow-xs">
                  <h4 className="font-display text-lg text-[#022448] font-semibold mb-2">Masked Balances</h4>
                  <p className="text-xs text-[#262320]/75 leading-relaxed">
                    Balances are hidden by default when your screen loads, allowing you to reveal them with a single click when you are in private.
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
