'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  ArrowRightLeft, 
  Coins, 
  LineChart, 
  PieChart, 
  Lock, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';
import { AnimatedProgressBar } from './AnimatedProgressBar';

interface NetWorthHeroPlaqueProps {
  isMasked: boolean;
  onToggleMask: () => void;
}

export const NetWorthHeroPlaque: React.FC<NetWorthHeroPlaqueProps> = ({ isMasked, onToggleMask }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-[#74777F]/20 p-6 md:p-8 lg:p-10 shadow-sm">
      {/* Subtle Atmospheric Gradients */}
      <div className="absolute -right-24 -top-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#1E3A5F]/5 via-[#DBE1FF]/20 to-transparent pointer-events-none blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#533300]/5 pointer-events-none blur-2xl"></div>

      <div className="relative z-10 flex flex-col gap-8">
        {/* Top Header Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#74777F]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center text-[#1E3A5F] shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#1E3A5F]">
                  Sovereign Monolith &amp; Vault Treasury
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] text-[11px] font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  CLS Certified
                </span>
              </div>
              <p className="text-xs text-[#43474E] font-mono mt-0.5">
                ISO 20022 pacs.008 • Basel III Capital Reserve 104.28%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF4FF] border border-[#74777F]/20 text-xs font-mono text-[#43474E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Ledger #28,102,510</span>
            <span className="text-[#74777F]/40">•</span>
            <span>SHA-256 Validated</span>
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Wealth Figures & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EFFF] text-[#43474E] text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#1E3A5F]"></span>
                <span className="font-medium text-[#121C28]">Tier-1 Sovereign Reserve Account</span>
                <span className="text-[#74777F]/40">|</span>
                <span>pacs.008.001.09</span>
              </div>

              {/* Main Net Worth Metric with Click-to-Reveal */}
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
                    <Image 
                      src="/assets/brand/currency_symbol.png" 
                      alt="ARTH Symbol" 
                      width={48}
                      height={48}
                      className="object-contain filter drop-shadow-xs"
                    />
                  </div>

                  {/* Stable-width balance container ensures ARTH label and Eye button stay in the EXACT same position */}
                  <div className="inline-flex items-baseline min-w-[240px] sm:min-w-[320px] md:min-w-[380px]">
                    <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#022448] tracking-tight">
                      <AnimatedMaskedValue 
                        value="842,520.45" 
                        isMasked={isMasked} 
                        maskString="••••••••"
                      />
                    </span>
                    <span className="text-xl md:text-2xl font-serif font-medium text-[#4C5D8E] ml-2.5">
                      ARTH
                    </span>
                  </div>

                  {/* Eye Mask Toggle Button - Anchored, Never Jumps on Click */}
                  <button
                    onClick={onToggleMask}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 border cursor-pointer ${
                      isMasked 
                        ? 'bg-[#A8742A]/10 border-[#A8742A]/30 text-[#A8742A] hover:bg-[#A8742A]/20 hover:scale-105 active:scale-95' 
                        : 'bg-[#EEF4FF] border-[#74777F]/25 text-[#1E3A5F] hover:bg-[#E5EFFF] hover:scale-105 active:scale-95'
                    }`}
                    title={isMasked ? "Click to reveal balances" : "Click to mask sensitive balances"}
                    aria-label={isMasked ? "Reveal sovereign balances" : "Mask sensitive balances"}
                  >
                    {isMasked ? (
                      <EyeOff className="w-4.5 h-4.5 text-[#A8742A] transition-transform duration-200" />
                    ) : (
                      <Eye className="w-4.5 h-4.5 text-[#1E3A5F] transition-transform duration-200" />
                    )}
                  </button>
                </div>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EEF4FF] text-[#43474E] text-xs font-mono">
                  <span>≈ </span>
                  <AnimatedMaskedValue 
                    value="$842,520.45" 
                    isMasked={isMasked} 
                    maskString="••••••••"
                  />
                  <span> USD-EQ (1.0000 Peg)</span>
                </div>
              </div>

              {/* Performance / Compliance Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                  <AnimatedMaskedValue 
                    value="+124.80 ARTH" 
                    isMasked={isMasked} 
                    maskString="••••••"
                  />
                  <span> (+0.015% 24h)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5EFFF] text-[#121C28] font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
                  <span>+5.42% Net APY Yield</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DBE1FF]/70 text-[#031847]">
                  <Shield className="w-3.5 h-3.5 text-[#1E3A5F]" />
                  <span>104.28% Parity</span>
                </div>
              </div>
            </div>

            {/* M3 Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#transfer-terminal"
                className="h-11 px-6 bg-[#022448] text-white font-sans font-medium text-xs rounded-full shadow-xs hover:bg-[#1E3A5F] transition-all inline-flex items-center gap-2 group active:scale-95"
              >
                <ArrowRightLeft className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Initiate DvP Transfer</span>
              </a>
              <a
                href="#fixed-deposits"
                className="h-11 px-5 bg-[#DBE1FF] text-[#031847] font-sans font-medium text-xs rounded-full hover:bg-[#B4C5FD] transition-all inline-flex items-center gap-2 active:scale-95"
              >
                <Coins className="w-4 h-4 text-[#1E3A5F]" />
                <span>Open High-Yield Term FD</span>
              </a>
              <a
                href="#stock-portfolio"
                className="h-11 px-4 border border-[#74777F]/30 text-[#121C28] hover:bg-[#EEF4FF] transition-all font-sans font-medium text-xs rounded-full inline-flex items-center gap-2 active:scale-95"
              >
                <LineChart className="w-4 h-4 text-[#4C5D8E]" />
                <span>Capital Markets</span>
              </a>
            </div>
          </div>

          {/* Right Column: Asset Class Allocation Card */}
          <div className="lg:col-span-5 bg-[#F8F9FF] border border-[#74777F]/25 rounded-2xl p-5 md:p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#1E3A5F]" />
                  <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#121C28]">
                    Asset Class Allocation
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#10B981] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                  Real-Time Rail Active
                </span>
              </div>

              {/* Segmented Liquidity Spectrum Bar */}
              <div className="space-y-1.5">
                <AnimatedProgressBar
                  height="lg"
                  segments={[
                    {
                      id: 'liquid',
                      label: 'Liquid Balances',
                      value: 40.9,
                      gradient: 'bg-gradient-to-r from-[#022448] via-[#1E3A5F] to-[#3368A0]',
                      tooltip: 'Liquid Balances: 40.9%',
                    },
                    {
                      id: 'vault',
                      label: 'Fixed Term',
                      value: 33.3,
                      gradient: 'bg-gradient-to-r from-[#6080B8] via-[#85A7E2] to-[#ADC8F5]',
                      tooltip: 'Fixed Term: 33.3%',
                    },
                    {
                      id: 'markets',
                      label: 'Capital Markets',
                      value: 22.1,
                      gradient: 'bg-gradient-to-r from-[#2B4366] via-[#455F87] to-[#66A3BF]',
                      tooltip: 'Capital Markets: 22.1%',
                    },
                    {
                      id: 'relics',
                      label: 'Shop & Relics',
                      value: 3.7,
                      gradient: 'bg-gradient-to-r from-[#C27A23] via-[#E8A548] to-[#F9BB6A]',
                      tooltip: 'Shop & Relics: 3.7%',
                    },
                  ]}
                />
                <div className="flex justify-between items-center text-[10px] text-[#43474E] font-mono">
                  <span>Liquid: 40.9%</span>
                  <span>FD Vaults: 33.3%</span>
                  <span>Stocks: 22.1%</span>
                  <span>Relics: 3.7%</span>
                </div>
              </div>
            </div>

            {/* Allocation Quadrants */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#74777F]/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#43474E]">
                  <span className="flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-[#022448]"></span>Liquid
                  </span>
                  <span className="font-mono font-medium text-[#1E3A5F] text-[11px]">40.9%</span>
                </div>
                <div className="font-mono font-bold text-xs sm:text-sm text-[#121C28] flex items-baseline gap-1">
                  <AnimatedMaskedValue 
                    value="345,120.00" 
                    isMasked={isMasked} 
                    maskString="••••••••"
                  />
                  <span className="text-[10px] font-normal text-[#43474E]">ARTH</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#74777F]/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#43474E]">
                  <span className="flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-[#ADC8F5]"></span>Term Vault
                  </span>
                  <span className="font-mono font-medium text-[#4C5D8E] text-[11px]">33.3%</span>
                </div>
                <div className="font-mono font-bold text-xs sm:text-sm text-[#121C28] flex items-baseline gap-1">
                  <AnimatedMaskedValue 
                    value="280,520.45" 
                    isMasked={isMasked} 
                    maskString="••••••••"
                  />
                  <span className="text-[10px] font-normal text-[#43474E]">ARTH</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#74777F]/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#43474E]">
                  <span className="flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-[#455F87]"></span>Equities
                  </span>
                  <span className="font-mono font-medium text-[#10B981] text-[11px]">+14.45%</span>
                </div>
                <div className="font-mono font-bold text-xs sm:text-sm text-[#121C28] flex items-baseline gap-1">
                  <AnimatedMaskedValue 
                    value="185,880.00" 
                    isMasked={isMasked} 
                    maskString="••••••••"
                  />
                  <span className="text-[10px] font-normal text-[#43474E]">ARTH</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#74777F]/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-[#43474E]">
                  <span className="flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-[#F9BB6A]"></span>Relics &amp; Vault
                  </span>
                  <span className="font-mono font-medium text-[#A8742A] text-[11px]">+0.85% APY</span>
                </div>
                <div className="font-mono font-bold text-xs sm:text-sm text-[#121C28] flex items-baseline gap-1">
                  <AnimatedMaskedValue 
                    value="31,000.00" 
                    isMasked={isMasked} 
                    maskString="••••••••"
                  />
                  <span className="text-[10px] font-normal text-[#43474E]">ARTH</span>
                </div>
              </div>
            </div>

            {/* Bottom Ledger Hash Verification */}
            <div className="pt-2 border-t border-[#74777F]/15 flex items-center justify-between text-[11px] text-[#43474E] font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#1E3A5F]" />
                Consolidated Enclave
              </span>
              <a href="#ledger" className="text-[#1E3A5F] font-semibold hover:underline flex items-center gap-0.5">
                <span>View Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
