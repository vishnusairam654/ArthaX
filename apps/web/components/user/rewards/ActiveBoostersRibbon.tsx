'use client';

import React from 'react';
import { Zap, ShieldCheck, Percent, Clock } from 'lucide-react';

export const ActiveBoostersRibbon: React.FC = () => {
  return (
    <section className="space-y-3 mb-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#5C574F] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#A8742A]" />
          <span>Active Sovereign Buffs &amp; Protocol Boosters (3 Active)</span>
        </h2>
        <span className="font-mono text-xs text-[#74777F]">Refreshes every block</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Booster Card 1 */}
        <div className="bg-white rounded-2xl p-4 border border-[#74777F]/20 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5EFFF] border border-[#1E3A5F]/20 flex items-center justify-center text-[#1E3A5F] shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#121C28]">Stasis Reserve Booster</div>
              <div className="text-[11px] text-[#5C574F]">Applied on Samaya FD (+0.30% APY)</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#287A55]/10 text-[#287A55] border border-[#287A55]/20">
            Active
          </span>
        </div>

        {/* Booster Card 2 */}
        <div className="bg-white rounded-2xl p-4 border border-[#74777F]/20 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#287A55]/10 border border-[#287A55]/20 flex items-center justify-center text-[#287A55] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#121C28]">DvP Settlement Velocity</div>
              <div className="text-[11px] text-[#5C574F]">Priority queue placement in CLS</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#287A55]/10 text-[#287A55] border border-[#287A55]/20">
            Sub-12ms
          </span>
        </div>

        {/* Booster Card 3 */}
        <div className="bg-white rounded-2xl p-4 border border-[#74777F]/20 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF8F0] border border-[#A8742A]/25 flex items-center justify-center text-[#A8742A] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#121C28]">Sovereign Citizen Cashback</div>
              <div className="text-[11px] text-[#5C574F]">1.5% ARTH rebate on institutional wires</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A8742A]/10 text-[#A8742A] border border-[#A8742A]/25">
            Perpetual
          </span>
        </div>
      </div>
    </section>
  );
};
