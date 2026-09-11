'use client';

import React from 'react';
import { Award, Percent, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';

export const StockFundamentalsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-1 border-b border-[#74777F]/15">
        <h3 className="font-serif text-base text-[#022448] font-bold">
          Key Fundamental &amp; Valuation Metrics
        </h3>
        <span className="font-mono text-[11px] text-[#287A55] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Audited Core Filings
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C574F]">P/E MULTIPLE</span>
          <div className="font-mono text-base font-bold text-[#121C28] mt-1">24.8x</div>
          <span className="text-[11px] text-[#5C574F] font-sans">Sector: 28.2x</span>
        </div>

        <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C574F]">MARKET CAP</span>
          <div className="font-mono text-base font-bold text-[#022448] mt-1">1.82B ARTH</div>
          <span className="text-[11px] text-[#287A55] font-sans">Tier-1 Sovereign</span>
        </div>

        <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C574F]">DIVIDEND YIELD</span>
          <div className="font-mono text-base font-bold text-[#287A55] mt-1">3.45%</div>
          <span className="text-[11px] text-[#5C574F] font-sans">Annual Distribution</span>
        </div>

        <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C574F]">ROCE (3Y AVG)</span>
          <div className="font-mono text-base font-bold text-[#121C28] mt-1">21.4%</div>
          <span className="text-[11px] text-[#287A55] font-sans">High Capital Return</span>
        </div>

        <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C574F]">BOOK VALUE</span>
          <div className="font-mono text-base font-bold text-[#121C28] mt-1">142.10 ARTH</div>
          <span className="text-[11px] text-[#5C574F] font-sans">P/B: 1.83</span>
        </div>

        <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10">
          <span className="font-mono text-[10px] uppercase font-bold text-[#5C574F]">DEBT-TO-EQUITY</span>
          <div className="font-mono text-base font-bold text-[#287A55] mt-1">0.18</div>
          <span className="text-[11px] text-[#5C574F] font-sans">Minimal Leverage</span>
        </div>
      </div>
    </div>
  );
};
