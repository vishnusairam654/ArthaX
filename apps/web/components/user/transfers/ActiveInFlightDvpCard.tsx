'use client';

import React from 'react';
import { ArrowRight, Clock, ShieldCheck, Activity, Layers } from 'lucide-react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';

interface ActiveInFlightDvpCardProps {
  isMasked: boolean;
  onOpenAuditTrail: (hash: string) => void;
  txHash?: string;
  amount?: number;
  progressPercent?: number;
  stageLabel?: string;
}

export const ActiveInFlightDvpCard: React.FC<ActiveInFlightDvpCardProps> = ({
  isMasked,
  onOpenAuditTrail,
  txHash = 'tx.cls.20250524.890124',
  amount = 5000.00,
  progressPercent = 83,
  stageLabel = 'Stage 5 of 6'
}) => {
  return (
    <div className="bg-white border border-[#74777F]/20 p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
          </span>
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#022448]">
            Active In-Flight DvP
          </h2>
        </div>
        <span className="px-2.5 py-0.5 bg-[#dbe1ff] text-[#031847] rounded-full font-mono text-[11px] font-semibold">
          {stageLabel}
        </span>
      </div>

      {/* In-Flight Transaction Container */}
      <div className="p-4 bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-sans text-[11px] text-[#74777F] uppercase tracking-wider block">
              Hash Reference
            </span>
            <div className="font-mono text-xs text-[#022448] font-bold mt-0.5">
              {txHash}
            </div>
          </div>
          <div className="text-right">
            <div className="font-serif text-lg font-bold text-[#022448] tabular-nums">
              <AnimatedMaskedValue 
                value={amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} 
                isMasked={isMasked} 
                maskString="••••••" 
              />{' '}
              <span className="font-sans text-xs text-[#74777F] font-normal">ARTH</span>
            </div>
            <div className="font-mono text-[10px] text-[#10B981] font-semibold flex items-center justify-end gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Escrow Locked</span>
            </div>
          </div>
        </div>

        {/* Radar Indicator Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between font-mono text-[11px] text-[#43474E]">
            <span>Settlement Progress</span>
            <span className="font-bold text-[#022448]">{progressPercent}% Finalized</span>
          </div>
          <div className="w-full h-2 bg-[#EEF4FF] rounded-full overflow-hidden border border-[#74777F]/15">
            <div 
              className="h-full bg-[#022448] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Telemetry metadata rows */}
        <div className="pt-2 border-t border-[#74777F]/15 space-y-1.5 font-mono text-xs text-[#43474E]">
          <div className="flex justify-between">
            <span className="text-[#74777F]">Protocol Rail:</span>
            <span className="text-[#022448] font-medium text-[11px]">ISO 20022 pacs.008.001.08</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#74777F]">Counterparty:</span>
            <span className="text-[#022448] font-medium text-[11px]">NSE Sovereign Clearing</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#74777F]">Target Block:</span>
            <span className="text-[#1E3A5F] font-semibold text-[11px]">#28,102,512</span>
          </div>
        </div>

        {/* Audit link trigger */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onOpenAuditTrail(txHash)}
            className="w-full py-2 bg-white hover:bg-[#EEF4FF] border border-[#74777F]/20 text-[#022448] rounded-xl font-sans text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>View Live Settlement Audit Trail</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#A8742A]" />
          </button>
        </div>
      </div>
    </div>
  );
};
