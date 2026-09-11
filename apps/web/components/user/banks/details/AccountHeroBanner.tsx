'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Shield,
  CheckCircle2,
  Copy,
  Check,
  Send,
  QrCode,
  FileText,
  Sliders,
  Lock,
  ArrowUpRight,
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface AccountHeroBannerProps {
  accountId: string;
  isMasked: boolean;
  onOpenTransfer: () => void;
  onOpenQr: () => void;
}

export const AccountHeroBanner: React.FC<AccountHeroBannerProps> = ({
  accountId,
  isMasked,
  onOpenTransfer,
  onOpenQr,
}) => {
  const [copiedIban, setCopiedIban] = useState(false);

  const handleCopyIban = () => {
    navigator.clipboard.writeText('arthax.nava.cls.8491-904-in.001');
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[#74777F]/20 p-6 md:p-8 shadow-xs mb-8">
      {/* Background glow */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#1E3A5F]/10 via-[#A8742A]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Left: Identity, Badges & Balance */}
        <div className="flex flex-col gap-5 max-w-2xl">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15">
              <div className="w-6 h-6 relative shrink-0">
                <Image
                  src="/assets/banks/NAVA.png"
                  alt="NAVA Bank"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-serif font-bold text-sm tracking-tight text-[#022448]">NAVA</span>
              <span className="text-[10px] font-mono text-[#74777F] tracking-wider uppercase font-semibold">
                Chartered Node
              </span>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-[#C8DFDB] text-[#022448] font-mono text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Enclave</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-sans text-xs">
              Salary &amp; Direct Institutional Inflow
            </span>
          </div>

          {/* Primary Balance */}
          <div>
            <span className="font-mono text-xs text-[#74777F] uppercase tracking-wider block mb-1">
              Available Liquidity Balance
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#022448] tracking-tight">
                <AnimatedMaskedValue value="142,500.00" isMasked={isMasked} currency="ARTH" />
              </h1>
              <span className="font-mono text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-semibold ml-2">
                +4.85% APY Staking Tier
              </span>
            </div>
          </div>

          {/* Specs & Hashes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15">
              <div className="flex items-center justify-between text-[#74777F] text-xs mb-1">
                <span>Total Ledger Balance</span>
                <span className="font-mono text-[10px]">INCL. ESCROW</span>
              </div>
              <p className="font-mono text-sm font-bold text-[#121C28]">
                <AnimatedMaskedValue value="147,500.00" isMasked={isMasked} currency="ARTH" />
              </p>
              <p className="font-sans text-[11px] text-[#74777F] mt-0.5">
                Includes 5,000.00 ARTH locked statutory reserve
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15">
              <div className="flex items-center justify-between text-[#74777F] text-xs mb-1">
                <span>Sovereign IBAN / CLS Hash</span>
                <button
                  type="button"
                  onClick={handleCopyIban}
                  className="hover:text-[#022448] transition-colors cursor-pointer"
                  title="Copy Hash"
                >
                  {copiedIban ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-[#022448] font-semibold truncate select-all">
                arthax.nava.cls.8491-904-in.001
              </p>
              <p className="font-mono text-[10px] text-[#74777F] mt-0.5">
                Sub-ledger Path: SHA256/Node-IN01
              </p>
            </div>
          </div>
        </div>

        {/* Right: Outflow Rules & Risk Limits Gauge */}
        <div className="w-full lg:w-84 flex flex-col gap-3.5 p-4 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-serif font-semibold text-sm text-[#121C28]">
              Outflow Rules &amp; Limits
            </span>
            <span className="font-mono text-[10px] text-[#022448] bg-[#E5EFFF] px-2 py-0.5 rounded-full font-bold uppercase">
              Daily Quota
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-[#74777F]">Consumed (18%)</span>
              <span className="text-[#121C28] font-semibold">
                <AnimatedMaskedValue value="9,000.00" isMasked={isMasked} /> / 50,000.00 ARTH
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5EFFF] overflow-hidden">
              <div className="h-full bg-[#022448] rounded-full" style={{ width: '18%' }} />
            </div>
            <p className="text-[11px] font-sans text-[#74777F] mt-1.5">
              41,000.00 ARTH remaining window resets in 07h 42m
            </p>
          </div>

          {/* Rule Badges */}
          <div className="space-y-2 pt-1 font-sans text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#74777F]/10">
              <span className="flex items-center gap-1.5 text-[#43474E]">
                <Shield className="w-3.5 h-3.5 text-[#022448]" />
                Single Tx Ceiling
              </span>
              <span className="font-mono font-bold text-[#022448]">25,000.00 ARTH</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#74777F]/10">
              <span className="flex items-center gap-1.5 text-[#43474E]">
                <Lock className="w-3.5 h-3.5 text-[#A8742A]" />
                Dual-Pass Enclave Auth
              </span>
              <span className="font-mono font-bold text-[#A8742A]">Req &gt; 10,000 ARTH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="pt-6 mt-6 border-t border-[#74777F]/15 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onOpenTransfer}
          className="h-10 px-5 rounded-full bg-[#022448] hover:bg-[#1E3A5F] text-white transition-all flex items-center gap-2 font-sans font-semibold text-xs shadow-2xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-[#F9BB6A]" />
          <span>Initiate Transfer / Send ARTH</span>
        </button>

        <button
          type="button"
          onClick={onOpenQr}
          className="h-10 px-4 rounded-full bg-[#E5EFFF] hover:bg-[#D9E3F4] text-[#022448] transition-all flex items-center gap-2 font-sans font-semibold text-xs cursor-pointer border border-[#74777F]/15"
        >
          <QrCode className="w-4 h-4 text-[#1E3A5F]" />
          <span>Deposit &amp; Proof QR</span>
        </button>

        <button
          type="button"
          onClick={() => alert('Exporting signed ISO 20022 statements in PDF/Audit format...')}
          className="h-10 px-4 rounded-full bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#43474E] transition-all flex items-center gap-2 font-sans text-xs cursor-pointer border border-[#74777F]/15"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Statement / Tax Proof</span>
        </button>

        <button
          type="button"
          onClick={() => alert('Configuring single-transaction ceilings and hardware authorization rules.')}
          className="h-10 px-4 rounded-full bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#43474E] transition-all flex items-center gap-2 font-sans text-xs ml-auto cursor-pointer border border-[#74777F]/15"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Outflow Rules</span>
        </button>
      </div>
    </div>
  );
};
