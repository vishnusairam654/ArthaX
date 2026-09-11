'use client';

import React from 'react';
import { Activity, ShieldCheck, Landmark, Gem } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface AccountAnalyticsSidebarProps {
  isMasked: boolean;
}

const FLOW_DAYS = [
  { day: '18 May', height: 48, isPeak: false },
  { day: '19 May', height: 32, isPeak: false },
  { day: '20 May', height: 94, isPeak: true, isPositive: true },
  { day: '21 May', height: 40, isPeak: false },
  { day: '22 May', height: 25, isPeak: false },
  { day: '23 May', height: 72, isPeak: false, isCurrent: true },
  { day: 'Today', height: 52, isPeak: false },
];

export const AccountAnalyticsSidebar: React.FC<AccountAnalyticsSidebarProps> = ({ isMasked }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* 7-Day Net Flow Chart Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#74777F]/20 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif font-semibold text-[#121C28] text-base leading-tight">
              Liquidity Velocity
            </h2>
            <p className="font-mono text-xs text-[#74777F]">7-day net clearing telemetry</p>
          </div>
          <Activity className="w-5 h-5 text-[#022448]" />
        </div>

        {/* Inline Bar Visualization */}
        <div className="h-36 w-full flex items-end justify-between gap-1.5 pt-4 pb-2 px-1 border-b border-[#74777F]/10">
          {FLOW_DAYS.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
              <div
                className={`w-full transition-all rounded-t ${
                  item.isPositive
                    ? 'bg-emerald-600/80 group-hover:bg-emerald-600'
                    : item.isCurrent
                    ? 'bg-[#022448] group-hover:bg-[#1E3A5F]'
                    : 'bg-[#E5EFFF] group-hover:bg-[#022448]'
                }`}
                style={{ height: `${item.height}px` }}
              />
              <span className="font-mono text-[10px] text-[#74777F]">{item.day}</span>
            </div>
          ))}
        </div>

        {/* 7-Day Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 font-sans text-xs">
          <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
            <span className="text-[#74777F] block text-[11px]">Total Inflows (7d)</span>
            <span className="text-emerald-700 font-mono font-bold text-sm">
              <AnimatedMaskedValue value="+35,400.00" isMasked={isMasked} suffix=" ARTH" />
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
            <span className="text-[#74777F] block text-[11px]">Total Outflows (7d)</span>
            <span className="text-rose-700 font-mono font-bold text-sm">
              <AnimatedMaskedValue value="-8,200.00" isMasked={isMasked} suffix=" ARTH" />
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Settlement Metadata Note */}
      <div className="p-5 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-[#022448]">
          <Landmark className="w-4 h-4" />
          <span className="font-serif font-semibold text-sm">Sovereign Direct Payroll Mandate</span>
        </div>
        <p className="font-sans text-xs text-[#43474E] leading-relaxed">
          This primary settlement account operates under Reserve Bank of India &amp; ARTHAX Federal Gateway Charter #2024-IN. Automated pacs.008 institutional salary releases occur bi-monthly at 00:00 UTC.
        </p>
        <div className="pt-2 border-t border-[#74777F]/10 flex items-center justify-between text-xs font-mono text-[#74777F]">
          <span>Routing: <strong className="text-[#121C28]">NAVA-IN-MUM</strong></span>
          <span>BIC: <strong className="text-[#121C28]">NAVACLSIN01</strong></span>
        </div>
      </div>

      {/* Proof of Reserve Visual Badge */}
      <div className="p-4 rounded-2xl bg-white border border-[#74777F]/20 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#F2EFE7] border border-[#A8742A]/20 flex items-center justify-center shrink-0">
          <Gem className="w-5 h-5 text-[#A8742A]" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-semibold text-xs text-[#121C28]">
            Statutory Escrow Intact
          </span>
          <span className="font-sans text-[11px] text-[#74777F] leading-tight mt-0.5">
            5,000.00 ARTH backed 1:1 against Central Vault Sovereign T-Bills.
          </span>
        </div>
      </div>
    </div>
  );
};
