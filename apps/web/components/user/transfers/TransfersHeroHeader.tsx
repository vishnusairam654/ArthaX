'use client';

import React from 'react';
import { ArrowRightLeft, Wallet, Zap, ShieldCheck } from 'lucide-react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';

interface TransfersHeroHeaderProps {
  isMasked: boolean;
  availableBalance?: number;
  maxTxLimit?: number;
  activeAccountName?: string;
  activeAccountCode?: string;
}

export const TransfersHeroHeader: React.FC<TransfersHeroHeaderProps> = ({
  isMasked,
  availableBalance = 142500.00,
  maxTxLimit = 25000.00,
  activeAccountName = 'NAVA Sovereign Payroll',
  activeAccountCode = '#ARTH-9021-001'
}) => {
  return (
    <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
      {/* Narrative & Institutional Context */}
      <div className="space-y-2.5 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-[#dbe1ff] text-[#031847] rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 shadow-xs">
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#1E3A5F]" />
            Sovereign Settlement Engine v4.8
          </span>
          <span className="text-[#43474E] font-mono text-xs flex items-center gap-1">
            <span className="text-[#74777F]">•</span>
            <span>pacs.008.001.08 Validated</span>
          </span>
          <span className="text-[#10B981] font-mono text-xs hidden sm:flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ISO 20022 Enclave Ready</span>
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#022448] font-bold tracking-tight">
          Transfers &amp; DvP Settlement Terminal
        </h1>

        <p className="font-sans text-xs sm:text-sm text-[#43474E] leading-relaxed max-w-2xl">
          Deterministic ISO 20022 payment clearance, own-account liquidity sweeps, and atomic Delivery-versus-Payment (DvP) equity settlement across federated domestic nodes.
        </p>
      </div>

      {/* Outflow Pool Stat Plaque */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-[#74777F]/20 p-4 sm:p-5 rounded-2xl shadow-xs shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#022448] flex items-center justify-center text-white shadow-xs">
            <Wallet className="w-5 h-5 text-[#A8742A]" />
          </div>
          <div>
            <div className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold">
              Available Outflow Pool
            </div>
            <div className="font-serif text-xl sm:text-2xl text-[#022448] font-bold tabular-nums">
              <AnimatedMaskedValue 
                value={availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                isMasked={isMasked} 
                maskString="••••••••" 
              />{' '}
              <span className="font-sans text-xs text-[#74777F] font-normal">ARTH</span>
            </div>
          </div>
        </div>

        <div className="h-10 w-px bg-[#74777F]/20 hidden sm:block"></div>

        <div className="text-left sm:text-right space-y-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EEF4FF] text-[#1E3A5F] rounded-md font-mono text-[11px] font-medium border border-[#74777F]/15">
            <Zap className="w-3 h-3 text-[#A8742A]" />
            Max Tx: {maxTxLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
          </span>
          <div className="font-mono text-[11px] text-[#74777F]">
            {activeAccountName} ({activeAccountCode})
          </div>
        </div>
      </div>
    </section>
  );
};
