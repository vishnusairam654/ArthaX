'use client';

import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export const MeritTiersAndBadges: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#74777F]/20 shadow-2xs flex flex-col justify-between space-y-5">
      <div>
        <div className="flex items-center justify-between border-b border-[#74777F]/15 pb-4">
          <div>
            <h2 className="font-serif text-lg text-[#022448] font-bold">
              Quarterly Milestone Tiers
            </h2>
            <p className="font-sans text-xs text-[#5C574F]">Pathway to Sovereign Elder Status</p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-[#FDF8F0] text-[#A8742A] border border-[#A8742A]/30 font-mono text-xs font-semibold">
            Tier 3 / 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs font-medium font-sans">
            <span className="text-[#121C28] font-semibold">Current: Vanguard (Tier 3)</span>
            <span className="text-[#5C574F] font-mono">72% to Tier 4 (Chancellor)</span>
          </div>

          <div className="w-full h-3 bg-[#E5EFFF] rounded-full overflow-hidden p-0.5 border border-[#74777F]/15">
            <div
              className="h-full bg-gradient-to-r from-[#1E3A5F] via-[#3368A0] to-[#A8742A] rounded-full transition-all duration-500"
              style={{ width: '72%' }}
            />
          </div>

          <p className="text-[11px] text-[#5C574F] pt-1 font-sans">
            Next unlock: <strong className="text-[#121C28]">Exclusive Shop Companions &amp; +0.60% FD APY Boost Perk</strong>
          </p>
        </div>

        {/* Badges Grid */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#74777F] font-mono mb-3">
            Earned Sovereign Accreditations
          </h3>

          <div className="grid grid-cols-2 gap-2.5 font-sans">
            <div className="p-3 rounded-xl border border-[#A8742A]/20 bg-[#FDF8F0] flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#A8742A]/15 text-[#A8742A] flex items-center justify-center font-bold text-xs shrink-0">
                100k
              </span>
              <div>
                <div className="text-xs font-semibold text-[#A8742A]">First 100k Club</div>
                <div className="text-[10px] text-[#5C574F] font-mono">Verified Reserve</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#287A55]/20 bg-[#287A55]/10 flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#287A55]/20 text-[#287A55] flex items-center justify-center font-bold text-xs shrink-0">
                DvP
              </span>
              <div>
                <div className="text-xs font-semibold text-[#287A55]">DvP Pioneer</div>
                <div className="text-[10px] text-[#5C574F] font-mono">Atomic Settlement</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#1E3A5F]/20 bg-[#E5EFFF] flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#1E3A5F]/15 text-[#1E3A5F] flex items-center justify-center font-bold text-xs shrink-0">
                100%
              </span>
              <div>
                <div className="text-xs font-semibold text-[#1E3A5F]">Zero Failures</div>
                <div className="text-[10px] text-[#5C574F] font-mono">100% Finality Score</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-purple-200 bg-purple-50 flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                STK
              </span>
              <div>
                <div className="text-xs font-semibold text-purple-900">Civic Staker</div>
                <div className="text-[10px] text-purple-700 font-mono">Consensus Anchor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
