'use client';

import React from 'react';
import { Award, Zap, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface RewardsHeroBannerProps {
  isMasked: boolean;
  onClaimAll: () => void;
}

export const RewardsHeroBanner: React.FC<RewardsHeroBannerProps> = ({
  isMasked,
  onClaimAll,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#021B38] via-[#052952] to-[#0D3B70] text-white shadow-md border border-[#1E3A5F] p-6 sm:p-8 lg:p-10 mb-8">
      {/* Decorative Circles */}
      <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#A8742A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#287A55]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-[#FFDDB6]">
            <Award className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>SOVEREIGN REWARD PROTOCOL</span>
            <span className="text-white/40">•</span>
            <span>Section 18-C Civic Merit</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-[#A8F5BF] font-mono bg-[#287A55]/20 px-2.5 py-1 rounded-full border border-[#287A55]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#287A55] animate-pulse" />
            Epoch #93 Settled
          </div>
        </div>

        {/* Main Figures & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <p className="font-mono text-xs uppercase tracking-wider text-[#ADC8F5] font-semibold">
              Available Sovereign Reward Balance
            </p>
            <div className="flex items-baseline space-x-3">
              <AnimatedMaskedValue
                value="4,850.00"
                isMasked={isMasked}
                maskString="••••••"
                className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white"
                suffix={<span className="text-2xl font-serif text-[#A8742A] font-bold ml-2">ARTH</span>}
              />
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-sans pt-1">
              Equivalent to <strong className="text-white">{isMasked ? '$•••• USD' : '$4,850.00 USD'}</strong> at 1:1 Parity •{' '}
              <span className="text-[#A8F5BF] font-semibold">
                Yield Boost Multiplier Active: 1.25x
              </span>
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
            <button
              onClick={onClaimAll}
              type="button"
              className="px-5 py-3 rounded-full bg-[#A8742A] hover:bg-[#C28935] text-white font-sans font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Claim All to NAVA Payroll</span>
            </button>

            <a
              href="#reward-ledger"
              className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-sans font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-[#ADC8F5]" />
              <span>Tax Exemption Log</span>
            </a>
          </div>
        </div>

        {/* Metric Chips Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] font-mono uppercase tracking-wide text-white/70 block">Lifetime Earned</span>
            <AnimatedMaskedValue
              value="18,400.00"
              isMasked={isMasked}
              maskString="••••••"
              className="text-base sm:text-lg font-bold text-white font-mono mt-0.5"
              suffix={<span className="text-xs text-[#A8742A] ml-1">ARTH</span>}
            />
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] font-mono uppercase tracking-wide text-white/70 block">Active APY Multiplier</span>
            <div className="text-base sm:text-lg font-bold text-[#A8F5BF] font-mono mt-0.5">
              +0.45% <span className="text-xs font-normal text-white/80">on FDs</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] font-mono uppercase tracking-wide text-white/70 block">Current Merit Tier</span>
            <div className="text-base sm:text-lg font-bold text-[#FFDDB6] flex items-center gap-1.5 mt-0.5">
              Vanguard <span className="text-xs font-mono text-white/70 font-normal">(Tier 3/5)</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] font-mono uppercase tracking-wide text-white/70 block">Next Milestone Payout</span>
            <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-sans">
              In 4 Days <span className="text-xs font-mono text-white/70 font-normal">(Epoch #94)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
