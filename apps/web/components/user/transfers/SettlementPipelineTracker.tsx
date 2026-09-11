'use client';

import React from 'react';
import Image from 'next/image';
import { 
  GitBranch, 
  History, 
  KeyRound, 
  ShieldCheck, 
  Check, 
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';

export interface SettlementPipelineTrackerProps {
  currentStage?: number; // 1 to 6
  isSettling?: boolean;
}

export const SettlementPipelineTracker: React.FC<SettlementPipelineTrackerProps> = ({
  currentStage = 4,
  isSettling = false
}) => {
  const stages = [
    {
      step: 1,
      name: '1. Pending',
      detail: 'Validated Ingress',
      iconType: 'pending'
    },
    {
      step: 2,
      name: '2. Validating',
      detail: 'KYC & Enclave Key',
      iconType: 'pending'
    },
    {
      step: 3,
      name: '3. Authorized',
      detail: 'Resident PIN Signed',
      iconType: 'authorized'
    },
    {
      step: 4,
      name: '4. Processing',
      detail: 'CLS Routing Active',
      iconType: 'processing'
    },
    {
      step: 5,
      name: '5. Settling',
      detail: 'Atomic Ledger Lock',
      iconType: 'processing'
    },
    {
      step: 6,
      name: '6. Completed',
      detail: 'Irreversible Block',
      iconType: 'completed'
    }
  ];

  return (
    <section className="bg-white border border-[#74777F]/20 p-5 sm:p-6 rounded-3xl shadow-xs space-y-5">
      {/* Pipeline Header & Telemetry Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] flex items-center justify-center text-[#1E3A5F]">
            <GitBranch className="w-4 h-4 text-[#A8742A]" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#022448] flex items-center gap-2">
              <span>Deterministic Settlement Pipeline</span>
              <span className="text-[#74777F] font-mono text-xs font-normal hidden sm:inline">
                (AtomicDvP-Protocol-T0)
              </span>
            </h2>
            <p className="font-sans text-xs text-[#43474E] hidden sm:block">
              Six-stage ISO 20022 clearing sequence with cryptographic non-repudiation
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-[#F8F9FF] border border-[#74777F]/15 text-[#43474E] rounded-full flex items-center gap-1.5 shadow-xs">
            <History className="w-3.5 h-3.5 text-[#66A3BF]" />
            <span>Reversible window: <strong className="text-[#022448]">120s</strong></span>
          </span>
          <span className="px-3 py-1 bg-[#F8F9FF] border border-[#74777F]/15 text-[#43474E] rounded-full flex items-center gap-1.5 shadow-xs">
            <KeyRound className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>HSM Double-Signed</span>
          </span>
          <span className="px-3 py-1 bg-[#A8F5BF]/50 border border-[#10B981]/30 text-[#002110] rounded-full flex items-center gap-1.5 font-semibold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Zero Divergence</span>
          </span>
        </div>
      </div>

      {/* 6-Stage Visual Stepper Tracker */}
      <div className="relative pt-1 pb-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          {stages.map((stage) => {
            const isCompleted = stage.step < currentStage;
            const isCurrent = stage.step === currentStage;
            const isPending = stage.step > currentStage;

            return (
              <div 
                key={stage.step}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-[#022448] text-white border-[#022448] shadow-md ring-2 ring-[#A8742A]/40' 
                    : isCompleted
                      ? 'bg-[#F2F7F4] border-[#10B981]/25 text-[#121C28]'
                      : 'bg-[#F8F9FF] border-[#74777F]/15 text-[#74777F] opacity-75'
                }`}
              >
                {/* Stage Icon */}
                <div className="mb-2 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-full bg-white text-[#022448] flex items-center justify-center shadow-xs animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#A8742A]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#E5EFFF] text-[#43474E] flex items-center justify-center font-mono text-xs font-bold">
                      {stage.step}
                    </div>
                  )}
                </div>

                {/* Stage Names */}
                <span className={`font-sans text-xs font-semibold ${isCurrent ? 'text-white' : 'text-[#121C28]'}`}>
                  {stage.name}
                </span>
                <span className={`font-mono text-[10px] mt-0.5 ${isCurrent ? 'text-[#adc8f5]' : 'text-[#74777F]'}`}>
                  {stage.detail}
                </span>

                {/* Live tag for current stage */}
                {isCurrent && (
                  <span className="mt-2 px-2 py-0.5 rounded-full bg-[#A8742A] text-white font-mono text-[9px] uppercase tracking-wider font-semibold">
                    {isSettling ? 'Live Dispatch' : 'Active Rail'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
