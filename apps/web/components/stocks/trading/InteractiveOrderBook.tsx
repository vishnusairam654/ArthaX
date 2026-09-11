'use client';

import React from 'react';
import { SAMPLE_ORDER_BOOK } from '../StockData';

interface InteractiveOrderBookProps {
  onSelectPrice?: (price: number) => void;
}

export const InteractiveOrderBook: React.FC<InteractiveOrderBookProps> = ({
  onSelectPrice,
}) => {
  const { bids, asks } = SAMPLE_ORDER_BOOK;

  return (
    <div className="bg-white rounded-2xl border border-[#173F35]/12 p-4 sm:p-5 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-[#173F35]/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <h3 className="font-serif font-bold text-sm text-[#173F35]">
            Level-2 Order Book Depth
          </h3>
        </div>
        <div className="text-[11px] font-mono text-[#717975] flex items-center gap-2">
          <span>SPREAD: <strong className="text-[#1A1C18]">0.10 ARTH</strong> (0.07%)</span>
        </div>
      </div>

      {/* Ladder Header */}
      <div className="grid grid-cols-3 text-[10px] font-mono uppercase tracking-wider text-[#717975] px-2 py-1 bg-[#FAF8F5] rounded-lg">
        <span>Price (ARTH)</span>
        <span className="text-right">Size (Shs)</span>
        <span className="text-right">Total (ARTH)</span>
      </div>

      {/* Asks (Sells) — Red */}
      <div className="flex flex-col gap-1 text-xs font-mono">
        {asks.slice(0, 5).reverse().map((ask, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrice && onSelectPrice(ask.price)}
            className="relative grid grid-cols-3 items-center px-2 py-1 rounded hover:bg-[#B94A43]/10 cursor-pointer transition"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#B94A43]/10 rounded"
              style={{ width: `${ask.depthPercent}%` }}
            />
            <span className="relative z-10 font-bold text-[#B94A43]">{ask.price.toFixed(2)}</span>
            <span className="relative z-10 text-right text-[#1A1C18]">{ask.qty.toLocaleString('en-US')}</span>
            <span className="relative z-10 text-right text-[#717975]">{ask.total.toLocaleString('en-US')}</span>
          </div>
        ))}
      </div>

      {/* Mid Market Price Divider */}
      <div className="py-2 px-3 bg-[#DCEEE8]/50 border-y border-[#2F7468]/20 flex items-center justify-between font-mono text-xs my-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#173F35] uppercase font-sans">Last Traded Price:</span>
          <span className="font-bold text-sm text-[#173F35]">142.50 ARTH</span>
        </div>
        <span className="text-[11px] text-[#287A55] font-semibold flex items-center">
          +4.12% ↑
        </span>
      </div>

      {/* Bids (Buys) — Green */}
      <div className="flex flex-col gap-1 text-xs font-mono">
        {bids.slice(0, 5).map((bid, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrice && onSelectPrice(bid.price)}
            className="relative grid grid-cols-3 items-center px-2 py-1 rounded hover:bg-[#287A55]/10 cursor-pointer transition"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#287A55]/10 rounded"
              style={{ width: `${bid.depthPercent}%` }}
            />
            <span className="relative z-10 font-bold text-[#287A55]">{bid.price.toFixed(2)}</span>
            <span className="relative z-10 text-right text-[#1A1C18]">{bid.qty.toLocaleString('en-US')}</span>
            <span className="relative z-10 text-right text-[#717975]">{bid.total.toLocaleString('en-US')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
