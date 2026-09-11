'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Layers, Activity } from 'lucide-react';
import { ListedCompany } from '../StockData';

interface InteractiveCandleChartProps {
  company: ListedCompany;
}

export const InteractiveCandleChart: React.FC<InteractiveCandleChartProps> = ({
  company,
}) => {
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [showIndicators, setShowIndicators] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'candlestick' | 'depth'>('candlestick');

  // Simulated candlestick candles based on company price
  const basePrice = company.price;
  const candleDeltas = [
    { o: -2.4, h: 0.8, l: -3.2, c: -0.8, vol: 180 },
    { o: -0.8, h: 1.5, l: -1.2, c: 1.2, vol: 240 },
    { o: 1.2, h: 2.8, l: 0.5, c: 2.1, vol: 310 },
    { o: 2.1, h: 3.4, l: 1.8, c: 1.9, vol: 290 },
    { o: 1.9, h: 2.5, l: 0.2, c: 0.6, vol: 210 },
    { o: 0.6, h: 1.8, l: -0.4, c: 1.5, vol: 260 },
    { o: 1.5, h: 3.2, l: 1.1, c: 2.8, vol: 420 },
    { o: 2.8, h: 4.1, l: 2.3, c: 3.6, vol: 380 },
    { o: 3.6, h: 4.8, l: 3.0, c: 3.2, vol: 320 },
    { o: 3.2, h: 5.2, l: 2.8, c: 4.6, vol: 490 },
    { o: 4.6, h: 6.0, l: 4.0, c: 5.64, vol: 580 },
  ];

  const minPrice = basePrice - 4;
  const maxPrice = basePrice + 7;
  const priceRange = maxPrice - minPrice;

  const getY = (val: number) => {
    const norm = (val - minPrice) / priceRange;
    return 240 - norm * 200; // between 40 and 240px
  };

  return (
    <div className="bg-white rounded-2xl border border-[#173F35]/12 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Chart Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#173F35]/10">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {['1M', '5M', '15M', '1H', '1D', '1W'].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#173F35] text-white shadow-xs'
                  : 'text-[#4A534F] hover:bg-[#FAF8F5] hover:text-[#173F35]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Technical Indicators Pill Strip */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setShowIndicators(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              showIndicators 
                ? 'bg-[#DCEEE8] border-[#2F7468]/30 text-[#173F35]' 
                : 'bg-[#FAF8F5] border-transparent text-[#717975]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>EMA(20): {(basePrice * 0.985).toFixed(2)}</span>
          </button>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-[#287A55]/10 text-[#287A55] font-semibold border border-[#287A55]/20">
            RSI(14): 62.8 [Bullish]
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[320px] sm:h-[360px] bg-[#FAF8F5] border border-[#173F35]/10 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Horizontal Price Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-30">
          {[maxPrice, maxPrice - 2.5, maxPrice - 5, minPrice].map((p, idx) => (
            <div key={idx} className="w-full flex items-center justify-between text-[10px] font-mono text-[#717975]">
              <span>{p.toFixed(2)} ARTH</span>
              <div className="w-full ml-3 border-b border-dashed border-[#173F35]/30" />
            </div>
          ))}
        </div>

        {/* Candlesticks & Volume Rendering */}
        <div className="relative w-full h-full flex items-end">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1100 280">
            {/* EMA Smooth Line */}
            {showIndicators && (
              <path
                d="M 50 180 Q 250 160 500 135 T 1050 90"
                fill="none"
                stroke="#2F7468"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            )}

            {/* Candlesticks */}
            {candleDeltas.map((c, i) => {
              const x = 50 + i * 95;
              const open = basePrice + c.o;
              const close = basePrice + c.c;
              const high = basePrice + c.h;
              const low = basePrice + c.l;

              const yOpen = getY(open);
              const yClose = getY(close);
              const yHigh = getY(high);
              const yLow = getY(low);

              const isBullish = close >= open;
              const color = isBullish ? '#287A55' : '#B94A43';
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(4, Math.abs(yClose - yOpen));

              // Volume bar height (0 to 60px)
              const volHeight = (c.vol / 600) * 55;

              return (
                <g key={i} className="hover:opacity-80 transition cursor-pointer">
                  {/* Volume Bar */}
                  <rect
                    x={x - 14}
                    y={280 - volHeight}
                    width={28}
                    height={volHeight}
                    fill={color}
                    opacity="0.25"
                    rx="2"
                  />

                  {/* Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.5"
                  />

                  {/* Candle Body */}
                  <rect
                    x={x - 12}
                    y={bodyTop}
                    width={24}
                    height={bodyHeight}
                    fill={color}
                    rx="3"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Volume Indicator Label */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#717975] pt-1 border-t border-[#173F35]/10">
          <span>VOL (24H): {company.volume24h} Shares</span>
          <span className="text-[#2F7468] font-semibold">T+0 Continuous Auction Active</span>
        </div>
      </div>
    </div>
  );
};
