'use client';

import React from 'react';
import { HandCoins, Calculator, Plus, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';

interface LoansHeroBannerProps {
  onOpenCalculator: () => void;
  onOpenApplication: () => void;
}

export const LoansHeroBanner: React.FC<LoansHeroBannerProps> = ({
  onOpenCalculator,
  onOpenApplication,
}) => {
  return (
    <section className="relative overflow-hidden rounded-[28px] border-2 border-[#1E3A5F]/20 bg-linear-to-br from-[#0F1B2B] via-[#1E3A5F] to-[#2A4D77] text-white p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_-12px_rgba(15,27,43,0.35)]">
      {/* Decorative background grid and ambient lighting */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#FAF8F5 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#A8742A]/20 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-24 w-80 h-80 rounded-full bg-[#3B3278]/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono tracking-wider text-[#FAF8F5]">
            <Sparkles className="w-3.5 h-3.5 text-[#F9BB6A]" />
            <span>SOVEREIGN CREDIT &amp; LENDING PROTOCOL • PHASE 12A</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
            Institutional Credit Facilities &amp; Sovereign Mortgages
          </h1>

          <p className="text-sm sm:text-base text-[#FAF8F5]/85 font-sans leading-relaxed">
            Transparent, non-predatory liquidity backed by the double-entry Core Ledger. 
            Enjoy reducing-balance rates from <span className="text-[#F9BB6A] font-semibold">5.50% APY</span>, zero hidden fees, 
            and automated post-commit settlement across our 5 chartered commercial banks.
          </p>

          {/* Key assurance badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#FAF8F5]/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Zero Shadow Ledger Accounting</span>
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-[#F9BB6A]" />
              <span>Reducing-Balance EMI Math</span>
            </span>
            <span className="flex items-center gap-1.5">
              <HandCoins className="w-4 h-4 text-[#60A5FA]" />
              <span>Pledged Collateral Lien Protection</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={onOpenCalculator}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-all backdrop-blur-xs cursor-pointer shadow-xs hover:shadow-sm"
          >
            <Calculator className="w-4 h-4 text-[#F9BB6A]" />
            <span>Simulate EMI</span>
          </button>

          <button
            type="button"
            onClick={onOpenApplication}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#A8742A] hover:bg-[#8F6122] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer transform active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Facility</span>
          </button>
        </div>
      </div>
    </section>
  );
};
