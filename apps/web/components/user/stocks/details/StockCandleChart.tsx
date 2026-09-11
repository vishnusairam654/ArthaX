'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const StockCandleChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1M');

  return (
    <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-2xs space-y-4">
      {/* Chart Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#74777F]/15">
        <div className="flex items-center gap-1.5 font-sans text-xs">
          {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-full font-mono text-xs transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#022448] text-white font-bold shadow-2xs'
                  : 'text-[#5C574F] hover:bg-[#E5EFFF] hover:text-[#022448]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-bold">
            MA(20): 254.20
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#287A55]/10 text-[#287A55] font-bold">
            RSI(14): 62.4 [Bullish]
          </span>
        </div>
      </div>

      {/* SVG Candlestick Canvas */}
      <div className="relative w-full h-[320px] sm:h-[360px] bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
        {/* Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
          <div className="w-full flex justify-between text-[10px] font-mono text-[#5C574F]">
            <span>270.00 ARTH</span>
            <div className="w-full ml-3 border-b border-dashed border-[#74777F]/30" />
          </div>
          <div className="w-full flex justify-between text-[10px] font-mono text-[#5C574F]">
            <span>260.00 ARTH</span>
            <div className="w-full ml-3 border-b border-dashed border-[#74777F]/30" />
          </div>
          <div className="w-full flex justify-between text-[10px] font-mono text-[#5C574F]">
            <span>250.00 ARTH</span>
            <div className="w-full ml-3 border-b border-dashed border-[#74777F]/30" />
          </div>
          <div className="w-full flex justify-between text-[10px] font-mono text-[#5C574F]">
            <span>240.00 ARTH</span>
            <div className="w-full ml-3 border-b border-dashed border-[#74777F]/30" />
          </div>
          <div className="w-full flex justify-between text-[10px] font-mono text-[#5C574F]">
            <span>230.00 ARTH</span>
            <div className="w-full ml-3 border-b border-dashed border-[#74777F]/30" />
          </div>
        </div>

        {/* Candlestick SVG */}
        <svg className="w-full h-64 overflow-visible z-10" preserveAspectRatio="none" viewBox="0 0 900 240">
          {/* Moving Average Line */}
          <path
            d="M 30 200 Q 180 180, 320 160 T 600 110 T 870 70"
            fill="none"
            stroke="#287A55"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* EMA 50 Line */}
          <path
            d="M 30 220 Q 240 210, 450 180 T 870 110"
            fill="none"
            stroke="#74777F"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Candlestick bars sequence */}
          <line stroke="#287A55" strokeWidth="1.5" x1="40" x2="40" y1="180" y2="230" />
          <rect fill="#287A55" height="30" rx="1" width="12" x="34" y="190" />

          <line stroke="#287A55" strokeWidth="1.5" x1="85" x2="85" y1="170" y2="215" />
          <rect fill="#287A55" height="25" rx="1" width="12" x="79" y="180" />

          <line stroke="#B5482E" strokeWidth="1.5" x1="130" x2="130" y1="175" y2="210" />
          <rect fill="#B5482E" height="20" rx="1" width="12" x="124" y="185" />

          <line stroke="#287A55" strokeWidth="1.5" x1="175" x2="175" y1="150" y2="195" />
          <rect fill="#287A55" height="30" rx="1" width="12" x="169" y="160" />

          <line stroke="#287A55" strokeWidth="1.5" x1="220" x2="220" y1="135" y2="180" />
          <rect fill="#287A55" height="25" rx="1" width="12" x="214" y="145" />

          <line stroke="#B5482E" strokeWidth="1.5" x1="265" x2="265" y1="140" y2="175" />
          <rect fill="#B5482E" height="15" rx="1" width="12" x="259" y="150" />

          <line stroke="#287A55" strokeWidth="1.5" x1="310" x2="310" y1="120" y2="165" />
          <rect fill="#287A55" height="28" rx="1" width="12" x="304" y="130" />

          <line stroke="#287A55" strokeWidth="1.5" x1="355" x2="355" y1="110" y2="150" />
          <rect fill="#287A55" height="26" rx="1" width="12" x="349" y="120" />

          <line stroke="#B5482E" strokeWidth="1.5" x1="400" x2="400" y1="115" y2="155" />
          <rect fill="#B5482E" height="20" rx="1" width="12" x="394" y="125" />

          <line stroke="#287A55" strokeWidth="1.5" x1="445" x2="445" y1="95" y2="140" />
          <rect fill="#287A55" height="30" rx="1" width="12" x="439" y="105" />

          <line stroke="#287A55" strokeWidth="1.5" x1="490" x2="490" y1="80" y2="125" />
          <rect fill="#287A55" height="25" rx="1" width="12" x="484" y="90" />

          <line stroke="#B5482E" strokeWidth="1.5" x1="535" x2="535" y1="85" y2="130" />
          <rect fill="#B5482E" height="20" rx="1" width="12" x="529" y="95" />

          <line stroke="#287A55" strokeWidth="1.5" x1="580" x2="580" y1="70" y2="115" />
          <rect fill="#287A55" height="25" rx="1" width="12" x="574" y="80" />

          <line stroke="#287A55" strokeWidth="1.5" x1="625" x2="625" y1="55" y2="105" />
          <rect fill="#287A55" height="30" rx="1" width="12" x="619" y="65" />

          <line stroke="#B5482E" strokeWidth="1.5" x1="670" x2="670" y1="65" y2="105" />
          <rect fill="#B5482E" height="20" rx="1" width="12" x="664" y="75" />

          <line stroke="#287A55" strokeWidth="1.5" x1="715" x2="715" y1="50" y2="90" />
          <rect fill="#287A55" height="26" rx="1" width="12" x="709" y="58" />

          <line stroke="#287A55" strokeWidth="1.5" x1="760" x2="760" y1="40" y2="82" />
          <rect fill="#287A55" height="24" rx="1" width="12" x="754" y="50" />

          <line stroke="#287A55" strokeWidth="1.5" x1="805" x2="805" y1="28" y2="75" />
          <rect fill="#287A55" height="32" rx="1" width="12" x="799" y="38" />

          {/* Active Spot Candle */}
          <line stroke="#287A55" strokeWidth="2" x1="850" x2="850" y1="18" y2="65" />
          <rect fill="#287A55" height="34" rx="1" width="12" x="844" y="24" />

          {/* Crosshair Target and Value Tag */}
          <line stroke="#287A55" strokeDasharray="3 3" strokeWidth="1.5" x1="0" x2="900" y1="41" y2="41" />
          <rect fill="#022448" height="24" rx="4" width="115" x="780" y="28" />
          <text fill="#ffffff" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" textAnchor="middle" x="837" y="44">
            260.06 ARTH
          </text>
        </svg>

        {/* Volume Histogram Base Strip */}
        <div className="h-14 w-full flex items-end justify-between px-2 pt-2 border-t border-[#74777F]/15 z-10">
          <div className="flex items-end gap-1.5 h-full w-full">
            {[40, 55, 30, 60, 80, 45, 65, 70, 35, 90, 85, 40, 75, 65, 80, 50, 70, 95, 85].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t ${i % 3 === 2 ? 'bg-[#B5482E]/30' : 'bg-[#287A55]/30'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
