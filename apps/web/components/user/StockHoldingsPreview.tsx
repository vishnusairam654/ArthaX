'use client';

import React from 'react';
import Image from 'next/image';
import { TrendingUp, ArrowRight, LineChart } from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';

interface StockHoldingsPreviewProps {
  isMasked: boolean;
}

interface StockHoldingItem {
  id: string;
  name: string;
  shares: number;
  value: string;
  gain: string;
  logo: string;
}

const stocks: StockHoldingItem[] = [
  {
    id: 'nila',
    name: 'NILA Systems',
    shares: 120,
    value: '61,500.00',
    gain: '+18.2%',
    logo: '/assets/stocks/logo/nila_systems.png',
  },
  {
    id: 'meru',
    name: 'Meru Capital',
    shares: 80,
    value: '72,400.00',
    gain: '+9.4%',
    logo: '/assets/stocks/logo/meru_capital.png',
  },
  {
    id: 'arka',
    name: 'Arka Energy',
    shares: 150,
    value: '51,980.00',
    gain: '+4.1%',
    logo: '/assets/stocks/logo/arka_energy.png',
  },
];

export const StockHoldingsPreview: React.FC<StockHoldingsPreviewProps> = ({ isMasked }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 space-y-5" id="stock-portfolio">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#74777F]">
            Equity Portal
          </span>
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#022448]">
              Sovereign Stock Holdings
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="font-sans text-xs text-[#74777F]">Unrealized P/L</span>
          <p className="font-mono text-xs sm:text-sm font-bold text-[#10B981]">
            <AnimatedMaskedValue value="+23,480 ARTH" isMasked={isMasked} maskString="••••••" /> (+14.45%)
          </p>
        </div>
      </div>

      {/* Capital Allocation Strip */}
      <div className="grid grid-cols-2 gap-3 bg-[#F8F9FF] border border-[#74777F]/15 p-3 rounded-2xl font-mono text-xs">
        <div>
          <span className="text-[#74777F] block">Invested Capital</span>
          <div className="font-bold text-[#121C28] mt-0.5 flex items-baseline gap-1">
            <AnimatedMaskedValue value="162,400.00" isMasked={isMasked} maskString="••••••••" /> ARTH
          </div>
        </div>
        <div>
          <span className="text-[#74777F] block">Market Valuation</span>
          <div className="font-bold text-[#1E3A5F] mt-0.5 flex items-baseline gap-1">
            <AnimatedMaskedValue value="185,880.00" isMasked={isMasked} maskString="••••••••" /> ARTH
          </div>
        </div>
      </div>

      {/* Stock Cards List */}
      <div className="space-y-2">
        {stocks.map((stock) => (
          <div
            key={stock.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 hover:bg-[#EEF4FF] hover:border-[#1E3A5F]/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#74777F]/20 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
                <img
                  src={stock.logo}
                  alt={stock.name}
                  loading="eager"
                  className="object-contain max-h-7 w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold text-[#121C28]">
                  {stock.name}
                </span>
                <span className="font-mono text-[11px] text-[#43474E]">
                  {stock.shares} Shares Held
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-xs font-bold text-[#121C28] flex items-baseline justify-end gap-1">
                <AnimatedMaskedValue value={stock.value} isMasked={isMasked} maskString="••••••" /> ARTH
              </div>
              <span className="font-mono text-[11px] text-[#10B981] font-semibold">
                {stock.gain}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action to Stock Portal */}
      <a
        href="/stocks"
        className="w-full py-2.5 px-4 rounded-full bg-[#DBE1FF] text-[#031847] hover:bg-[#B4C5FD] font-sans text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
      >
        <span>Launch Full Stock Portal Trading Terminal</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};
