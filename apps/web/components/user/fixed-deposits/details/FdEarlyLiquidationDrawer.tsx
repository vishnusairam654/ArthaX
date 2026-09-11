'use client';

import React from 'react';
import { AlertTriangle, Zap, Wallet, ArrowRight } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface FdEarlyLiquidationDrawerProps {
  isMasked: boolean;
  onRequestLiquidation: () => void;
}

export const FdEarlyLiquidationDrawer: React.FC<FdEarlyLiquidationDrawerProps> = ({
  isMasked,
  onRequestLiquidation,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#74777F]/20 shadow-2xs flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#A8742A]" />
            <h2 className="font-serif text-lg text-[#022448] font-bold">
              Early Liquidation Policy
            </h2>
          </div>
          <span className="font-mono text-xs text-[#287A55] bg-[#287A55]/10 px-2 py-0.5 rounded-full font-semibold">
            Post-90d Threshold Met
          </span>
        </div>

        <p className="font-sans text-xs text-[#5C574F] leading-relaxed">
          Term reserves may be liquidated prematurely into liquid ARTH balances subject to the Central Bank early termination schedule.
        </p>

        <div className="space-y-2.5 pt-1">
          {/* Rule Item 1 */}
          <div className="flex items-center justify-between p-3 bg-[#F8F9FF] rounded-xl border border-[#74777F]/10 text-xs">
            <span className="text-[#5C574F]">Tenure Elapsed Penalty:</span>
            <span className="font-mono font-semibold text-[#B5482E]">-0.50% APY Forfeiture</span>
          </div>

          {/* Rule Item 2: Cashout Value */}
          <div className="flex items-center justify-between p-3.5 bg-[#E5EFFF]/60 rounded-xl border border-[#1E3A5F]/20">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#1E3A5F]" />
              <div>
                <span className="font-sans text-xs font-semibold text-[#121C28] block">Immediate Cashout</span>
                <span className="font-sans text-[10px] text-[#5C574F]">Principal + Net Adjusted Yield</span>
              </div>
            </div>
            <div className="text-right">
              <AnimatedMaskedValue
                value="104,875.00"
                isMasked={isMasked}
                maskString="••••••••"
                className="font-mono text-sm sm:text-base text-[#022448] font-bold"
                suffix={<span className="text-xs font-normal text-[#5C574F] ml-1">ARTH</span>}
              />
            </div>
          </div>

          {/* Rule Item 3: Velocity */}
          <div className="p-3 bg-[#F8F9FF] rounded-xl border border-[#74777F]/10 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#1E3A5F] font-semibold text-[11px]">
              <Zap className="w-3.5 h-3.5 text-[#A8742A]" />
              <span>Settlement Velocity: 380ms (CLS Atomic DvP)</span>
            </div>
            <p className="text-[11px] text-[#5C574F] leading-relaxed">
              Settles instantaneously to Primary Sovereign Vault via DvP ledger rails upon Resident PIN authentication.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onRequestLiquidation}
          type="button"
          className="w-full py-2.5 px-4 bg-[#F8F9FF] hover:bg-[#B5482E] hover:text-white text-[#B5482E] border border-[#B5482E]/30 rounded-full font-sans text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Request Early Liquidation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
