'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Download, 
  Sliders, 
  AlertOctagon,
  TrendingUp,
  Star,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface FdCertificateHeroProps {
  depositId: string;
  isMasked: boolean;
  onOpenLiquidationModal: () => void;
  onOpenMandateModal: () => void;
}

export const FdCertificateHero: React.FC<FdCertificateHeroProps> = ({
  depositId,
  isMasked,
  onOpenLiquidationModal,
  onOpenMandateModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Sub-Header & Breadcrumb Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-[#5C574F]">
            <Link 
              href="/user/fixed-deposits" 
              className="hover:text-[#022448] transition-colors flex items-center gap-1 text-[#1E3A5F] font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Term Reserves</span>
            </Link>
            <span className="text-[#74777F]/40">/</span>
            <span>Fixed Deposits</span>
            <span className="text-[#74777F]/40">/</span>
            <span className="font-semibold text-[#121C28]">Certificate #{depositId}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#022448] font-bold tracking-tight">
              SAMAYA Sovereign Growth Term
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#287A55]/10 text-[#287A55] font-mono text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#287A55] animate-pulse"></span>
              Active &amp; Accruing Yield
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-mono text-xs border border-[#74777F]/15">
              <Lock className="w-3.5 h-3.5 text-[#1E3A5F]" />
              ISO-Pacs.008 Encrypted Contract • Seal #8812-SAM-CERT
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F8F9FF] text-[#1E3A5F] border border-[#74777F]/20 font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
          <button 
            type="button"
            onClick={onOpenMandateModal}
            className="px-3.5 py-1.5 rounded-full bg-[#E5EFFF] hover:bg-[#D9E3F4] text-[#1E3A5F] font-medium text-xs flex items-center gap-1.5 border border-[#74777F]/20 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure Mandate</span>
          </button>
          <button 
            type="button"
            onClick={onOpenLiquidationModal}
            className="px-3.5 py-1.5 rounded-full bg-[#022448] text-white hover:bg-[#1E3A5F] font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>Simulate Liquidation</span>
          </button>
        </div>
      </div>

      {/* Primary Certificate Hero Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#74777F]/20 shadow-xs relative overflow-hidden">
        {/* Soft Background Ambient Wash */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#E5EFFF]/60 to-[#FDF8F0]/40 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Left: Core Balances & Metrics (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                    Principal Commitment
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-medium border border-[#74777F]/15">
                    100% Core Ledger Backed
                  </span>
                </div>
                <span className="font-sans text-xs text-[#5C574F]">
                  Benchmark USD Parity:{' '}
                  <strong className="text-[#121C28]">
                    {isMasked ? '$•••••• USD' : '$100,012.00 USD'}
                  </strong>
                </span>
              </div>

              <div className="pt-1">
                <AnimatedMaskedValue
                  value="100,000.00"
                  isMasked={isMasked}
                  maskString="••••••••"
                  className="font-serif text-3xl sm:text-5xl text-[#022448] font-bold tracking-tight"
                  suffix={<span className="font-mono text-base text-[#A8742A] font-semibold ml-2">ARTH</span>}
                />
              </div>
            </div>

            {/* Mid metrics 3-column banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15">
                <span className="font-mono text-xs text-[#5C574F] block mb-1">Accrued Interest to Date</span>
                <div className="flex items-baseline gap-1">
                  <AnimatedMaskedValue
                    value="+5,420.00"
                    isMasked={isMasked}
                    maskString="••••••"
                    className="font-serif text-xl text-[#287A55] font-bold"
                    suffix={<span className="font-mono text-xs font-medium text-[#287A55] ml-1">ARTH</span>}
                  />
                </div>
                <span className="font-sans text-[11px] text-[#5C574F] mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#287A55]" />
                  Real-time compounding
                </span>
              </div>

              <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15">
                <span className="font-mono text-xs text-[#5C574F] block mb-1">Gross Realized Yield</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-xl text-[#022448] font-bold">7.45%</span>
                  <span className="font-mono text-xs font-semibold text-[#1E3A5F]">APY</span>
                </div>
                <span className="font-sans text-[11px] text-[#5C574F] mt-1.5 flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#A8742A]" />
                  Tier-1 Resident bonus (+0.35%)
                </span>
              </div>

              <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15">
                <span className="font-mono text-xs text-[#5C574F] block mb-1">Projected Payout at Maturity</span>
                <div className="flex items-baseline gap-1">
                  <AnimatedMaskedValue
                    value="107,450.00"
                    isMasked={isMasked}
                    maskString="••••••••"
                    className="font-serif text-xl text-[#022448] font-bold"
                    suffix={<span className="font-mono text-xs font-medium text-[#5C574F] ml-1">ARTH</span>}
                  />
                </div>
                <span className="font-sans text-[11px] text-[#5C574F] mt-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#1E3A5F]" />
                  14 Nov 2025 (174 Days remaining)
                </span>
              </div>
            </div>

            {/* Progress Bar & Tenure Timeline */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-[#022448]">Tenure Elapsed: 52.4%</span>
                  <span className="font-mono text-[#5C574F]">(191 / 365 Days)</span>
                </div>
                <span className="font-mono text-[#5C574F]">Terminal Date: 14 Nov 2025</span>
              </div>

              <div className="w-full bg-[#E5EFFF] h-2.5 rounded-full overflow-hidden relative">
                <div className="bg-[#1E3A5F] h-full rounded-full transition-all duration-700" style={{ width: '52.4%' }} />
              </div>

              <div className="flex justify-between items-center font-sans text-xs text-[#5C574F] pt-1">
                <div className="flex flex-col">
                  <span className="font-semibold text-[#121C28]">14 Nov 2024</span>
                  <span className="text-[11px] font-mono">Inception • 100k ARTH</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#1E3A5F]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F]"></span> Today (Day 191)
                  </span>
                  <span className="text-[11px] font-mono text-[#287A55] font-semibold">
                    {isMasked ? '+•••• ARTH' : '+5,420.00 ARTH Yield'}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-[#121C28]">14 Nov 2025</span>
                  <span className="text-[11px] font-mono">
                    {isMasked ? 'Maturity • •••••• ARTH' : 'Maturity • 107,450.00 ARTH'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Certified Sovereign Institution Seal & Bank Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#F8F9FF] rounded-2xl p-6 border border-[#74777F]/15 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#5C574F] font-semibold">
                  Underwriting Node
                </span>
                <span className="inline-flex items-center gap-1 font-sans text-xs text-[#287A55] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Institutional Node
                </span>
              </div>

              {/* Bank Logo Container */}
              <div className="bg-white p-4 rounded-xl border border-[#74777F]/15 shadow-2xs flex items-center justify-center">
                <Image 
                  src="/assets/banks/samaya_bank.png" 
                  alt="SAMAYA Bank Sovereign Emblem" 
                  width={140} 
                  height={50} 
                  className="h-10 w-auto object-contain"
                />
              </div>

              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Charter Status:</span>
                  <span className="font-medium text-[#1E3A5F]">Primary Liquidity Reserve #002</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Custody Region:</span>
                  <span className="font-medium text-[#121C28]">Node IN-DELHI-02 (Cold Vault)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">CLS Liquidity Ratio:</span>
                  <span className="font-medium text-[#287A55] font-mono font-bold">241.8% Basel-X</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#74777F]/15">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#121C28]">
                  <ShieldCheck className="w-4 h-4 text-[#1E3A5F]" />
                  <span>Monetary Charter Sec. 14-A</span>
                </div>
                <span className="font-mono text-[10px] text-[#A8742A] uppercase font-bold">100% Indemnified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
