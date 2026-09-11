'use client';

import React from 'react';
import { 
  Building, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Coins, 
  PlusCircle, 
  RefreshCw,
  FileText,
  Scale
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface StockPortfolioHeroProps {
  isMasked: boolean;
  onOpenTradeModal: () => void;
}

export const StockPortfolioHero: React.FC<StockPortfolioHeroProps> = ({
  isMasked,
  onOpenTradeModal,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#021B38] via-[#052952] to-[#0D3B70] text-white shadow-md border border-[#1E3A5F] p-6 sm:p-8 lg:p-10 mb-8">
      {/* Decorative Sovereign Atmospheric Glows */}
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#66A3BF]/10 pointer-events-none blur-3xl" />
      <div className="absolute right-1/3 -bottom-24 w-80 h-80 rounded-full bg-[#A8742A]/10 pointer-events-none blur-2xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        {/* Hero Left Content */}
        <div className="space-y-4 max-w-3xl">
          {/* Route Badge & Clearance Status */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#ADC8F5] font-mono text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md border border-white/10">
              <Building className="w-3.5 h-3.5 text-[#A8742A]" />
              <span>Sovereign Equity Registry</span>
            </span>
            <span className="text-white/40">•</span>
            <span className="inline-flex items-center gap-1 text-[#A8F5BF] font-mono text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Irrevocable DvP Clearance</span>
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/70 font-mono text-[11px]">Vault Cert: #SETU-EQ-2025-8491</span>
          </div>

          {/* Headline Metric */}
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-widest text-[#ADC8F5]/80 font-medium">
              Total Portfolio Valuation
            </p>
            <div className="flex flex-wrap items-baseline gap-3">
              <AnimatedMaskedValue
                value="382,450.00"
                isMasked={isMasked}
                maskString="••••••••"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white"
                suffix={<span className="text-2xl sm:text-3xl font-serif text-[#ADC8F5] font-light ml-2">ARTH</span>}
              />
              <span className="text-xs sm:text-sm text-white/70 font-sans tracking-normal">
                ({isMasked ? '$•••••• USD Parity' : '$382,495.00 USD Parity'}, 100% Ringfence-Backed)
              </span>
            </div>
          </div>

          {/* Micro Metric Bento Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Metric 1: All-Time P&L */}
            <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl p-3.5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-mono font-medium text-white/70 uppercase tracking-wider">All-Time P&amp;L</div>
              <AnimatedMaskedValue
                value="+48,920.00"
                isMasked={isMasked}
                maskString="••••••"
                className="text-base sm:text-lg font-bold text-[#A8F5BF] mt-1"
                suffix={<span className="text-xs text-[#A8F5BF] ml-1">ARTH</span>}
              />
              <div className="text-[11px] font-medium text-[#A8F5BF] mt-0.5 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14.65% Total ROI
              </div>
            </div>

            {/* Metric 2: 24h Gain */}
            <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl p-3.5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-mono font-medium text-white/70 uppercase tracking-wider">24h Gain / Loss</div>
              <AnimatedMaskedValue
                value="+2,340.00"
                isMasked={isMasked}
                maskString="••••••"
                className="text-base sm:text-lg font-bold text-[#A8F5BF] mt-1"
                suffix={<span className="text-xs text-[#A8F5BF] ml-1">ARTH</span>}
              />
              <div className="text-[11px] font-medium text-[#A8F5BF] mt-0.5 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +0.61% Today
              </div>
            </div>

            {/* Metric 3: Invested Capital */}
            <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl p-3.5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-mono font-medium text-white/70 uppercase tracking-wider">Invested Capital</div>
              <AnimatedMaskedValue
                value="333,530.00"
                isMasked={isMasked}
                maskString="••••••"
                className="text-base sm:text-lg font-bold text-white mt-1"
                suffix={<span className="text-xs text-white/60 ml-1">ARTH</span>}
              />
              <div className="text-[11px] text-white/60 mt-0.5 font-sans">Principal Base</div>
            </div>

            {/* Metric 4: Projected Dividend */}
            <div className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl p-3.5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-mono font-medium text-white/70 uppercase tracking-wider">Projected Dividend</div>
              <div className="text-base sm:text-lg font-bold text-[#FFDDB6] mt-1 font-mono">
                4.12% <span className="text-xs font-normal">APY</span>
              </div>
              <div className="text-[11px] text-[#FFDDB6]/90 mt-0.5 font-mono">
                {isMasked ? '••••• ARTH/yr' : '15,756.00 ARTH / yr'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px] shrink-0">
          <button
            onClick={onOpenTradeModal}
            type="button"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#022448] font-sans font-semibold text-xs sm:text-sm hover:bg-[#EEF4FF] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#A8742A]" />
            <span>Execute Buy Order</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white/15 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#ADC8F5]" />
            <span>Direct Market Sweep</span>
          </button>

          <div className="flex items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-white/70">
            <a href="#tax-statement" className="hover:text-white underline underline-offset-4 flex items-center gap-1 font-sans">
              <FileText className="w-3.5 h-3.5" />
              <span>Tax P&amp;L Statement</span>
            </a>
            <span className="text-white/30">•</span>
            <a href="#dvp-rules" className="hover:text-white underline underline-offset-4 flex items-center gap-1 font-sans">
              <Scale className="w-3.5 h-3.5" />
              <span>DvP Rules</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
