'use client';

import React from 'react';
import { Coins, BarChart3, Plus, ArrowRight } from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';
import { AnimatedProgressBar } from './AnimatedProgressBar';

interface FixedDepositsPreviewProps {
  isMasked: boolean;
}

export const FixedDepositsPreview: React.FC<FixedDepositsPreviewProps> = ({ isMasked }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 space-y-5" id="fixed-deposits">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[#74777F]">
            Term Deposits
          </span>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#022448]">
              Fixed Deposits (FD) Vaults
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="font-sans text-xs text-[#74777F]">Locked Value</span>
          <p className="font-mono text-base font-bold text-[#121C28] flex items-baseline justify-end gap-1">
            <AnimatedMaskedValue value="280,520.45" isMasked={isMasked} maskString="••••••••" />{' '}
            <span className="text-xs font-normal text-[#43474E]">ARTH</span>
          </p>
        </div>
      </div>

      {/* FD Cards */}
      <div className="space-y-3">
        {/* FD Card 1 */}
        <div className="bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl p-4 space-y-2 hover:border-[#1E3A5F]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-[#121C28]">
              Samaya Sovereign FD #04
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-mono text-[10px] font-bold">
              6.85% APY
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#43474E] font-mono pt-1">
            <span className="inline-flex items-baseline gap-1">
              Principal: <AnimatedMaskedValue value="150,000.00" isMasked={isMasked} maskString="••••••" /> ARTH
            </span>
            <span className="font-semibold text-[#121C28]">Maturing in 42 days</span>
          </div>

          {/* Animated Progress bar */}
          <div className="mt-1">
            <AnimatedProgressBar value={76} variant="primary" height="sm" title="Maturing: 76%" />
          </div>

          <div className="flex items-center justify-between font-mono text-xs pt-1">
            <span className="text-[#74777F]">Accrued to date</span>
            <span className="text-[#10B981] font-semibold">
              <AnimatedMaskedValue value="+3,710.20 ARTH" isMasked={isMasked} maskString="••••" />
            </span>
          </div>
        </div>

        {/* FD Card 2 */}
        <div className="bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl p-4 space-y-2 hover:border-[#1E3A5F]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-[#121C28]">
              Sthira Institutional Term #12
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-mono text-[10px] font-bold">
              7.20% APY
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#43474E] font-mono pt-1">
            <span className="inline-flex items-baseline gap-1">
              Principal: <AnimatedMaskedValue value="130,520.45" isMasked={isMasked} maskString="••••••" /> ARTH
            </span>
            <span className="font-semibold text-[#121C28]">Maturing in 180 days</span>
          </div>

          {/* Animated Progress bar */}
          <div className="mt-1">
            <AnimatedProgressBar value={32} variant="secondary" height="sm" title="Maturing: 32%" />
          </div>

          <div className="flex items-center justify-between font-mono text-xs pt-1">
            <span className="text-[#74777F]">Accrued to date</span>
            <span className="text-[#10B981] font-semibold">
              <AnimatedMaskedValue value="+2,110.80 ARTH" isMasked={isMasked} maskString="••••" />
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <button 
          type="button" 
          className="text-[#1E3A5F] font-sans text-xs font-semibold hover:underline flex items-center gap-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Compare Bank Rates</span>
        </button>
        <button 
          type="button" 
          className="px-4 py-2 bg-[#022448] text-white rounded-full font-sans text-xs font-medium hover:bg-[#1E3A5F] transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Fixed Deposit</span>
        </button>
      </div>
    </div>
  );
};
