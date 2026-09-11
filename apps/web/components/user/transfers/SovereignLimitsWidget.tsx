'use client';

import React from 'react';
import { Sliders, ShieldCheck, Gauge } from 'lucide-react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';

interface SovereignLimitsWidgetProps {
  isMasked: boolean;
  dailyUsed?: number;
  dailyLimit?: number;
  singleTxCap?: number;
}

export const SovereignLimitsWidget: React.FC<SovereignLimitsWidgetProps> = ({
  isMasked,
  dailyUsed = 41000.00,
  dailyLimit = 50000.00,
  singleTxCap = 25000.00
}) => {
  const percentage = Math.min(100, Math.round((dailyUsed / dailyLimit) * 100));
  const remaining = Math.max(0, dailyLimit - dailyUsed);

  return (
    <div className="bg-white border border-[#74777F]/20 p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-[#A8742A]" />
        <h2 className="font-serif text-base sm:text-lg font-bold text-[#022448]">
          Sovereign Limits &amp; Circuit Breakers
        </h2>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {/* Daily Outflow Allowance */}
        <div className="p-3.5 bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-[#121C28]">
            <span className="font-sans font-semibold">Daily Outflow Allowance</span>
            <span className="tabular-nums font-bold">
              <AnimatedMaskedValue 
                value={dailyUsed.toLocaleString('en-US', { minimumFractionDigits: 2 })} 
                isMasked={isMasked} 
                maskString="••••••" 
              /> / {dailyLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
            </span>
          </div>

          <div className="w-full h-2 bg-[#EEF4FF] rounded-full overflow-hidden border border-[#74777F]/15">
            <div 
              className="h-full bg-[#1E3A5F] rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="text-right text-[11px] text-[#74777F]">
            <AnimatedMaskedValue 
              value={remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })} 
              isMasked={isMasked} 
              maskString="••••••" 
            /> ARTH remaining today
          </div>
        </div>

        {/* Single Transaction Cap */}
        <div className="p-3 bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl flex items-center justify-between">
          <span className="text-[#43474E] font-sans">Single Transaction Cap:</span>
          <span className="font-serif text-sm font-bold text-[#022448] tabular-nums">
            {singleTxCap.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
          </span>
        </div>

        {/* Circuit Breaker Status */}
        <div className="p-3 bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl flex items-center justify-between">
          <span className="text-[#43474E] font-sans">Circuit Breaker Status:</span>
          <span className="px-2.5 py-0.5 bg-[#A8F5BF]/60 text-[#002110] border border-[#10B981]/30 rounded-full text-[11px] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#10B981]" />
            Normal (0 Latency)
          </span>
        </div>
      </div>
    </div>
  );
};
