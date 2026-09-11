'use client';

import React from 'react';
import { Lock, ShieldAlert, Check, X, Shield, KeyRound, ArrowRight } from 'lucide-react';

export function GovDualPasswordSection() {
  return (
    <section className="w-full py-16 sm:py-20 border-t border-[#3368A0]/10 bg-[#F8F9FF] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 text-[#A8742A] text-xs font-mono mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Dual-Password Isolation Doctrine</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E3A5F] tracking-tight leading-tight mb-3">
            Cryptographic Separation of Powers
          </h2>
          <p className="text-sm text-[#5C574F] leading-relaxed">
            ARTHAX strictly isolates identity authentication from monetary authorization. A compromise of your identity password cannot move your funds.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Column 1: GOV Password */}
          <div className="rounded-3xl bg-white border border-[#3368A0]/20 p-7 sm:p-9 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3368A0]" />
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#3368A0]/10 text-[#3368A0] flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#3368A0]/10 text-[#3368A0]">
                  SET ON THIS GATEWAY
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#1E3A5F] mb-2">
                GOV Password (Identity)
              </h3>
              <p className="text-xs leading-relaxed text-[#5C574F] mb-6">
                Created on this Government Gateway. Governs read-only identity attestation, portal login, viewing balances, and account profile management.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2.5 text-[#287A55]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Allows portal authentication & session creation</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#287A55]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Enables read-only account dashboard inspection</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#B5482E]">
                  <X className="w-4 h-4 shrink-0" />
                  <span>CANNOT authorize bank transfers or withdrawals</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#B5482E]">
                  <X className="w-4 h-4 shrink-0" />
                  <span>CANNOT execute stock orders or redeem assets</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#3368A0]/10 text-[11px] font-mono text-[#5C574F]">
              Auth Scope: <strong className="text-[#1E3A5F]">Identity Authority Only (0-Tx)</strong>
            </div>
          </div>

          {/* Column 2: Financial Password */}
          <div className="rounded-3xl bg-white border border-[#A8742A]/25 p-7 sm:p-9 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#A8742A]" />
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#A8742A]/10 text-[#A8742A] flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#A8742A]/10 text-[#A8742A]">
                  CONFIGURED IN USER PORTAL
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#1E3A5F] mb-2">
                Financial Password (Vault)
              </h3>
              <p className="text-xs leading-relaxed text-[#5C574F] mb-6">
                Established inside the User Portal security settings. Never revealed to the GOV Gateway, stored with separate cryptographic salting.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2.5 text-[#287A55]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Authorizes inter-bank DvP liquid transfers</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#287A55]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Authorizes stock trades, FD booking & Shop purchases</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#287A55]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Enforces Step-Up verification on sensitive actions</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#287A55]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Never cached or stored in browser session storage</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#A8742A]/15 text-[11px] font-mono text-[#5C574F]">
              Auth Scope: <strong className="text-[#A8742A]">Ledger Write & Money Movement</strong>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
