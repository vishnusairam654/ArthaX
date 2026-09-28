'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Building2, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';

interface SimpleProcessSectionProps {
  onOpenGovModal?: () => void;
}

export function SimpleProcessSection({ onOpenGovModal }: SimpleProcessSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-20" id="how-it-works">
      {/* Section Header */}
      <div className="max-w-2xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 border border-[#A8742A]/30 text-[#A8742A] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <span>SIMPLE PROCESS</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
          How It Works in 3 Easy Steps
        </h2>
        <p className="font-body text-sm text-[#262320]/75 mt-2">
          No complicated setup or hidden requirements. Here is how your money and accounts work on ARTHAX.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1 */}
        <div className="p-7 rounded-3xl bg-white border border-[#3368A0]/15 shadow-sm flex flex-col justify-between hover:border-[#3368A0]/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#022448]/10 text-[#022448] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#022448]" />
              </div>
              <span className="font-mono text-xs font-bold text-[#3368A0] bg-[#3368A0]/10 px-2.5 py-1 rounded-full">
                STEP 01
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-[#022448] mb-2">
              Sign In With Your ID
            </h3>
            <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-6">
              Use your single Government ID and password to log in. You have one unified account that gives you safe access across all portals.
            </p>
          </div>
          <div className="pt-4 border-t border-[#3368A0]/10 flex items-center gap-2 text-xs font-body text-[#022448] font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>One login for all services</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-7 rounded-3xl bg-white border border-[#3368A0]/15 shadow-sm flex flex-col justify-between hover:border-[#A8742A]/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#A8742A]/10 text-[#A8742A] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#A8742A]" />
              </div>
              <span className="font-mono text-xs font-bold text-[#A8742A] bg-[#A8742A]/10 px-2.5 py-1 rounded-full">
                STEP 02
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-[#022448] mb-2">
              Choose Your Bank
            </h3>
            <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-6">
              Open accounts across any of the 5 partner banks: Nava for payroll, Samaya for savings, Setu for trade, Sthira for vaults, or Vayu for daily spending.
            </p>
          </div>
          <div className="pt-4 border-t border-[#3368A0]/10 flex items-center gap-2 text-xs font-body text-[#022448] font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Switch banks without extra logins</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-7 rounded-3xl bg-white border border-[#3368A0]/15 shadow-sm flex flex-col justify-between hover:border-emerald-600/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                STEP 03
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-[#022448] mb-2">
              Transfer, Invest &amp; Shop
            </h3>
            <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-6">
              Send money to friends and businesses instantly, buy and sell shares on the stock exchange, or pick up custom avatars and pets in the shop.
            </p>
          </div>
          <div className="pt-4 border-t border-[#3368A0]/10 flex items-center gap-2 text-xs font-body text-[#022448] font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Instant settlement in ARTH currency</span>
          </div>
        </div>

      </div>

      {/* Direct Quick Launch Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/user"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-body font-semibold text-white bg-[#022448] hover:bg-[#16365C] shadow-sm transition active:scale-97"
        >
          <span>Open User Portal</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#A8742A]" />
        </Link>
        {onOpenGovModal && (
          <button
            onClick={onOpenGovModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-body font-semibold text-[#022448] bg-white hover:bg-[#F2EFE7] border border-[#3368A0]/20 shadow-xs transition active:scale-97 cursor-pointer"
          >
            <span>Connect GOV ID</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default SimpleProcessSection;
