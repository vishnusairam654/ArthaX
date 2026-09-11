'use client';

import React from 'react';
import { ListFilter } from 'lucide-react';

const ASKS = [
  { price: '260.40', size: '1,840', total: '479.1k', depthPercent: 82 },
  { price: '260.30', size: '1,210', total: '315.0k', depthPercent: 60 },
  { price: '260.20', size: '940', total: '244.6k', depthPercent: 44 },
  { price: '260.15', size: '680', total: '176.9k', depthPercent: 32 },
  { price: '260.10', size: '320', total: '83.2k', depthPercent: 18 },
];

const BIDS = [
  { price: '260.05', size: '450', total: '117.0k', depthPercent: 22 },
  { price: '260.00', size: '1,050', total: '273.0k', depthPercent: 52 },
  { price: '259.95', size: '1,680', total: '436.7k', depthPercent: 75 },
  { price: '259.90', size: '890', total: '231.3k', depthPercent: 42 },
  { price: '259.80', size: '2,140', total: '556.0k', depthPercent: 95 },
];

export const StockOrderBookLadder: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#74777F]/20 p-4 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
        <div className="flex items-center gap-1.5">
          <ListFilter className="w-4 h-4 text-[#1E3A5F]" />
          <span className="font-serif text-sm font-bold text-[#022448]">
            Level 2 Live Order Book
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#5C574F]">
          Spread: 0.05 ARTH (0.02%)
        </span>
      </div>

      {/* Column Labels */}
      <div className="grid grid-cols-3 text-[11px] font-semibold text-[#5C574F] px-1 font-mono">
        <span>Price (ARTH)</span>
        <span className="text-right">Size (Units)</span>
        <span className="text-right">Total (ARTH)</span>
      </div>

      {/* ASKS (Terracotta Red) */}
      <div className="flex flex-col gap-1 font-mono text-xs">
        {ASKS.map((ask, idx) => (
          <div key={idx} className="relative grid grid-cols-3 px-1.5 py-0.5 rounded overflow-hidden">
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#B5482E]/15 transition-all"
              style={{ width: `${ask.depthPercent}%` }}
            />
            <span className="text-[#B5482E] font-bold z-10">{ask.price}</span>
            <span className="text-right text-[#121C28] z-10">{ask.size}</span>
            <span className="text-right text-[#5C574F] z-10">{ask.total}</span>
          </div>
        ))}
      </div>

      {/* Mid Market Spread Strip */}
      <div className="py-1 px-2 my-1 bg-[#F8F9FF] rounded-lg border border-[#74777F]/15 flex items-center justify-between font-mono text-xs">
        <span className="text-[#5C574F] text-[11px]">MID MARKET SPOT</span>
        <span className="font-bold text-[#022448]">260.06 ARTH</span>
      </div>

      {/* BIDS (Emerald Green) */}
      <div className="flex flex-col gap-1 font-mono text-xs">
        {BIDS.map((bid, idx) => (
          <div key={idx} className="relative grid grid-cols-3 px-1.5 py-0.5 rounded overflow-hidden">
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#287A55]/15 transition-all"
              style={{ width: `${bid.depthPercent}%` }}
            />
            <span className="text-[#287A55] font-bold z-10">{bid.price}</span>
            <span className="text-right text-[#121C28] z-10">{bid.size}</span>
            <span className="text-right text-[#5C574F] z-10">{bid.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
