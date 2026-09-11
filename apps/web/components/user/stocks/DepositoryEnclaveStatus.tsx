'use client';

import React from 'react';
import { ShieldCheck, Lock, Zap, Server, CheckCircle2 } from 'lucide-react';

export const DepositoryEnclaveStatus: React.FC = () => {
  return (
    <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xs border border-[#74777F]/20 mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#E5EFFF] text-[#1E3A5F] flex items-center justify-center">
              <Server className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif text-lg text-[#022448] font-bold">
                SETU Depository &amp; Atomic DvP Clearing
              </h3>
              <span className="font-mono text-xs text-[#287A55] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Node SETU #003 — Synchronized
              </span>
            </div>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#5C574F] leading-relaxed">
            All registered equity certificates are held in cryptographic safe-custody under ISO 20022 pacs.008 protocol. Securities exchange simultaneously with ARTH settlement via atomic Delivery-versus-Payment rails with zero counterparty settlement risk.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto font-mono text-xs">
          <div className="bg-[#F8F9FF] p-3 rounded-xl border border-[#74777F]/15">
            <span className="text-[#5C574F] block text-[10px] uppercase">Finality Latency</span>
            <div className="text-sm font-bold text-[#121C28] flex items-center gap-1 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-[#A8742A]" /> 380ms
            </div>
            <span className="text-[10px] text-[#287A55]">Deterministic</span>
          </div>

          <div className="bg-[#F8F9FF] p-3 rounded-xl border border-[#74777F]/15">
            <span className="text-[#5C574F] block text-[10px] uppercase">Ringfence Security</span>
            <div className="text-sm font-bold text-[#121C28] flex items-center gap-1 mt-0.5">
              <Lock className="w-3.5 h-3.5 text-[#1E3A5F]" /> 100% Core
            </div>
            <span className="text-[10px] text-[#287A55]">Zero Rehypothecation</span>
          </div>

          <div className="bg-[#F8F9FF] p-3 rounded-xl border border-[#74777F]/15 col-span-2 sm:col-span-1">
            <span className="text-[#5C574F] block text-[10px] uppercase">Depository Seal</span>
            <div className="text-sm font-bold text-[#1E3A5F] flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Tier-1 Vault
            </div>
            <span className="text-[10px] text-[#5C574F]">Cert #8491-IN</span>
          </div>
        </div>
      </div>
    </section>
  );
};
