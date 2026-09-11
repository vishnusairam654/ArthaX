'use client';

import React from 'react';
import {
  FileText,
  Activity,
  ArrowRight,
  Building2,
  Lock,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface TransferQuantumHeroProps {
  transferId: string;
  isMasked: boolean;
}

export const TransferQuantumHero: React.FC<TransferQuantumHeroProps> = ({
  transferId,
  isMasked,
}) => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-white border border-[#74777F]/20 p-6 md:p-8 shadow-xs mb-8">
      {/* Background radial glows */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#E5EFFF]/60 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#F2EFE7]/80 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Quantum & Purpose Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#74777F]">
                Settlement Remittance Quantum
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F2EFE7] border border-[#A8742A]/30 text-[#8D5F22] font-mono text-[11px] font-semibold">
                Sovereign Peg 1:1 USD
              </span>
            </div>

            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-serif text-4xl md:text-5xl text-[#022448] tracking-tight font-normal">
                <AnimatedMaskedValue value="5,000.00" isMasked={isMasked} currency="ARTH" />
              </span>
              <span className="font-mono text-xs text-[#74777F] ml-1">
                ($5,001.00 USD equivalent at block stamp)
              </span>
            </div>

            <p className="font-sans text-sm text-[#43474E] flex items-center gap-2 mt-1">
              <FileText className="w-4 h-4 text-[#022448] shrink-0" />
              <span>
                DvP Tranche Settlement —{' '}
                <strong className="text-[#121C28] font-semibold">
                  NILA Systems Equity Allocation
                </strong>
              </span>
              <span className="font-mono text-xs text-[#1E3A5F] bg-[#E5EFFF] px-2 py-0.5 rounded">
                Mandate #SETU-EQ-2025-0814
              </span>
            </p>
          </div>

          {/* Telemetry Pill */}
          <div className="bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl p-4 flex flex-col gap-1.5 self-start lg:self-auto min-w-[240px]">
            <div className="flex items-center justify-between text-[#74777F] text-xs font-mono">
              <span>CLS Real-Time Rail</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                380ms Finality
              </span>
            </div>
            <div className="font-serif text-sm font-semibold text-[#022448]">
              RTGS DvP Atomic
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#74777F]">
              <span>Proof Protocol</span>
              <span className="text-[#A8742A] font-medium">ZK-STARK FIPS-140</span>
            </div>
          </div>
        </div>

        {/* Counterparty Route Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15 items-center">
          {/* Debited Source */}
          <div className="md:col-span-5 flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white border border-[#74777F]/15 flex items-center justify-center text-[#022448] shrink-0 shadow-2xs">
              <Wallet className="w-5 h-5 text-[#022448]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#B5482E] font-bold">
                  Source Debited
                </span>
                <span className="w-1 h-1 rounded-full bg-[#74777F]" />
                <span className="font-mono text-[10px] text-[#74777F]">NAVA Reserve #001</span>
              </div>
              <span className="font-serif font-semibold text-sm text-[#121C28] truncate">
                NAVA Sovereign Payroll
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#74777F]">
                <span>#ARTH-9021-001</span>
                <span>•</span>
                <span>Node: IN-MUMBAI-01</span>
              </div>
            </div>
          </div>

          {/* Directional Flow Indicator */}
          <div className="md:col-span-2 flex flex-col items-center justify-center py-2 md:py-0">
            <div className="w-full flex items-center justify-center relative">
              <div className="h-0.5 w-full bg-[#E5EFFF]" />
              <div className="absolute px-3 py-1 rounded-full bg-[#022448] text-white font-mono text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
                <Lock className="w-3 h-3 text-[#F9BB6A]" />
                <span>DvP Swap</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-[#74777F] mt-1.5">
              Escrow Hash #EQ-2891
            </span>
          </div>

          {/* Credited Destination */}
          <div className="md:col-span-5 flex items-start gap-3.5 md:justify-end md:text-right">
            <div className="flex flex-col min-w-0 md:items-end order-2 md:order-1">
              <div className="flex items-center gap-1.5 md:justify-end">
                <span className="font-mono text-[10px] text-[#74777F]">SETU Depository #003</span>
                <span className="w-1 h-1 rounded-full bg-[#74777F]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 font-bold">
                  Destination Credited
                </span>
              </div>
              <span className="font-serif font-semibold text-sm text-[#121C28] truncate">
                NSE Sovereign Custody
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#74777F] md:justify-end">
                <span>#SETU-CUST-8821</span>
                <span>•</span>
                <span>Node: SETU-CLEARING-09</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-white border border-[#74777F]/15 flex items-center justify-center text-[#1E3A5F] shrink-0 shadow-2xs order-1 md:order-2">
              <Building2 className="w-5 h-5 text-[#1E3A5F]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
