'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, KeyRound, ShieldAlert, ArrowRight, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export function DualPasswordEnclaveCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-[#1E3A5F] uppercase tracking-widest font-bold">
            <Lock className="w-4 h-4 text-[#1E3A5F]" />
            <span>Cryptographic Architecture</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-[#022448] mt-0.5">
            Dual-Password Isolation Enclave
          </h2>
          <p className="font-sans text-xs text-slate-600 mt-0.5">
            Server-side isolation separating portal identity login from monetary transaction execution.
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold rounded-full flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          FIPS 140-3 Compliant
        </span>
      </div>

      {/* Two Column Visual Enclave Representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enclave 1: GOV Password (Identity & Access) */}
        <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center text-[#1E3A5F]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-sm">GOV Password</h3>
                  <span className="font-sans text-[10px] text-slate-400 block">Identity Enclave</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ACTIVE
              </span>
            </div>

            <p className="font-sans text-xs text-slate-600 leading-relaxed">
              Authenticates citizen identity across all 6 ARTHAX portals. Grants read-only portfolio telemetry and citizen dashboard access.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] space-y-1 text-slate-500">
            <div className="flex justify-between">
              <span>Isolation Boundary:</span>
              <span className="text-slate-800 font-semibold">Web Identity Enclave</span>
            </div>
            <div className="flex justify-between">
              <span>Last Rotated:</span>
              <span className="text-slate-800 font-semibold">14 Days Ago</span>
            </div>
            <div className="flex justify-between">
              <span>Session Type:</span>
              <span className="text-emerald-700 font-semibold">Unified Cross-Portal</span>
            </div>
          </div>
        </div>

        {/* Enclave 2: Financial PIN / Password (Step-Up Settlement) */}
        <div className="bg-[#FDF8F0] border border-[#A8742A]/30 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#A8742A]/15 flex items-center justify-center text-[#A8742A]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#022448] text-sm">Financial Password (PIN)</h3>
                  <span className="font-sans text-[10px] text-[#A8742A] block">Monetary Settlement Enclave</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#A8742A] bg-amber-50 border border-[#A8742A]/30 px-2 py-0.5 rounded-full">
                ARMED
              </span>
            </div>

            <p className="font-sans text-xs text-slate-600 leading-relaxed">
              Required for step-up verification before transferring funds, executing DvP orders, or minting sovereign virtual assets. Never stored in browser.
            </p>
          </div>

          <div className="pt-3 border-t border-[#A8742A]/20 font-mono text-[11px] space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>HSM Protection:</span>
              <span className="text-[#022448] font-semibold">FIPS 140-3 Level 4</span>
            </div>
            <div className="flex justify-between">
              <span>Failed Attempts:</span>
              <span className="text-emerald-700 font-semibold">0 / 3 Allowed</span>
            </div>
            <div className="flex justify-between">
              <span>Enclave Input Spec:</span>
              <span className="text-[#A8742A] font-semibold">autocomplete=&quot;off&quot;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Link */}
      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans text-slate-500">
        <div className="flex items-center gap-2 text-emerald-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dual-password isolation guarantees zero single-point account compromise.</span>
        </div>

        <Link
          href="/user/security"
          className="font-semibold text-[#022448] hover:text-[#A8742A] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Manage in Security Settings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
