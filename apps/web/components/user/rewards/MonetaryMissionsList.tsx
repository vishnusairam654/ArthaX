'use client';

import React, { useState } from 'react';
import { CheckCircle2, Award, Zap, ArrowRight } from 'lucide-react';

export const MonetaryMissionsList: React.FC = () => {
  const [claimedTrade, setClaimedTrade] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#74777F]/20 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-[#74777F]/15 pb-4">
        <div>
          <h2 className="font-serif text-lg text-[#022448] font-bold">
            Daily &amp; Weekly Monetary Missions
          </h2>
          <p className="font-sans text-xs text-[#5C574F]">
            Civic ledger activities eligible for automated Section 18-C bounty grants
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-[#E5EFFF] text-[#1E3A5F] rounded-full">
          Cycle 24/28
        </span>
      </div>

      <div className="space-y-3 font-sans">
        {/* Task 1: Completed */}
        <div className="p-3.5 rounded-xl border border-[#74777F]/15 bg-[#F8F9FF] flex items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-[#287A55]/10 text-[#287A55] flex items-center justify-center mt-0.5 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#121C28]">Maintain &gt;50k ARTH Term Reserve across 2 Banks</p>
              <span className="text-[11px] text-[#74777F] font-mono">Proof-of-Reserve verified by SETU Node</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono font-medium text-[#287A55] bg-[#287A55]/10 border border-[#287A55]/20 shrink-0">
            Claimed +50.00 ARTH
          </span>
        </div>

        {/* Task 2: Ready to Claim */}
        <div className="p-3.5 rounded-xl border-2 border-[#A8742A]/40 bg-[#FDF8F0] flex items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-[#A8742A]/20 text-[#A8742A] flex items-center justify-center mt-0.5 font-bold text-xs shrink-0 font-mono">
              1/1
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-[#121C28]">Execute 1 Atomic Stock Trade via SETU Depository</p>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#A8742A]/20 text-[#A8742A] font-mono">
                  READY
                </span>
              </div>
              <span className="text-[11px] text-[#5C574F] font-mono">Completed today: 500 NILA Systems Shs Bought</span>
            </div>
          </div>

          {!claimedTrade ? (
            <button
              type="button"
              onClick={() => setClaimedTrade(true)}
              className="px-3 py-1.5 bg-[#A8742A] hover:bg-[#C28935] text-white font-bold text-xs rounded-lg shadow-2xs transition-all font-mono shrink-0 cursor-pointer"
            >
              Claim +75.00 ARTH
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded text-xs font-mono font-medium text-[#287A55] bg-[#287A55]/10 border border-[#287A55]/20 shrink-0">
              Claimed +75.00 ARTH
            </span>
          )}
        </div>

        {/* Task 3: Completed */}
        <div className="p-3.5 rounded-xl border border-[#74777F]/15 bg-[#F8F9FF] flex items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-[#287A55]/10 text-[#287A55] flex items-center justify-center mt-0.5 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#121C28]">Double-Sign ZK Audit Proof via Biometric PIN</p>
              <span className="text-[11px] text-[#74777F] font-mono">Hash 0x9fa12b8c... committed to block #28,102,490</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono font-medium text-[#287A55] bg-[#287A55]/10 border border-[#287A55]/20 shrink-0">
            Claimed +25.00 ARTH
          </span>
        </div>

        {/* Task 4: Incomplete */}
        <div className="p-3.5 rounded-xl border border-[#74777F]/15 bg-white flex items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-[#E5EFFF] text-[#1E3A5F] flex items-center justify-center mt-0.5 font-bold text-xs shrink-0 font-mono">
              0/1
            </div>
            <div>
              <p className="text-xs font-semibold text-[#121C28]">Enable Direct Sweep to NAVA Sovereign Payroll</p>
              <span className="text-[11px] text-[#74777F] font-mono">Automate daily yield harvest into sovereign account</span>
            </div>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 border border-[#74777F]/30 hover:border-[#1E3A5F] text-[#1E3A5F] font-medium text-xs rounded-lg hover:bg-[#E5EFFF] transition-all font-mono shrink-0 cursor-pointer"
          >
            Activate (+100 ARTH)
          </button>
        </div>
      </div>

      <div className="pt-2 text-center">
        <a href="#all-tasks" className="text-xs font-semibold text-[#1E3A5F] hover:underline inline-flex items-center gap-1 font-sans">
          <span>View All 14 Sovereign Civic Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
