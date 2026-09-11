'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface SectorAllocationStripProps {
  isMasked: boolean;
}

const SECTORS = [
  { name: 'Tech & Infra', percent: 34, amount: '130,033 ARTH', color: '#022448' },
  { name: 'Clean Power & Utilities', percent: 26, amount: '99,437 ARTH', color: '#1B6D44' },
  { name: 'Asset Mgmt & Financials', percent: 22, amount: '84,139 ARTH', color: '#825A22' },
  { name: 'Heavy Engineering', percent: 12, amount: '45,894 ARTH', color: '#455F87' },
  { name: 'Agritech & Food', percent: 6, amount: '22,947 ARTH', color: '#A8742A' },
];

export const SectorAllocationStrip: React.FC<SectorAllocationStripProps> = ({ isMasked }) => {
  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xs border border-[#74777F]/20 space-y-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#022448]">
              Sector Allocation &amp; Prudential Weighting
            </h2>
            <span title="Audited against Central Bank single-sector equity concentration cap">
              <Info className="w-4 h-4 text-[#74777F]" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5">
            Sovereign risk weighting verified against Central Bank Prudential Equities Limit (Max 40% single sector limit).
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#287A55]/10 text-[#287A55] border border-[#287A55]/20 text-xs font-semibold self-start md:self-auto font-mono">
          <ShieldCheck className="w-4 h-4 text-[#287A55]" />
          <span>Compliance: Optimal (Prudential Limits Verified)</span>
        </div>
      </div>

      {/* Segmented Visual Bar */}
      <div className="w-full h-3.5 rounded-full bg-[#E5EFFF] overflow-hidden flex shadow-inner">
        {SECTORS.map((s, idx) => (
          <div
            key={idx}
            className="h-full transition-all hover:opacity-90 cursor-pointer"
            style={{ width: `${s.percent}%`, backgroundColor: s.color }}
            title={`${s.name} (${s.percent}%)`}
          />
        ))}
      </div>

      {/* Sector Metrics Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        {SECTORS.map((s, idx) => (
          <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
            <span className="w-3 h-3 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: s.color }} />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#121C28] truncate">{s.name}</div>
              <div className="text-[11px] text-[#5C574F] font-mono">
                {s.percent}% • {isMasked ? '••••• ARTH' : s.amount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
