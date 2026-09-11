'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Wifi } from 'lucide-react';

export const StockPortalTelemetryBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('14:38:12 UTC');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toUTCString().slice(17, 25) + ' UTC'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside 
      aria-label="Live Institutional Market Telemetry" 
      className="h-8 w-full bg-[#112822] text-[#B7C7C1] border-b border-[#1C3E34] px-4 sm:px-6 flex items-center justify-between text-xs font-mono tracking-tight select-none z-50 shrink-0"
    >
      {/* Left ticker cluster */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="font-bold text-white tracking-wider">AUCTION SESSION #420</span>
        </div>

        <span className="text-[#1C3E34]">|</span>

        <div className="flex items-center gap-1">
          <span className="text-[#82AA9D]">CIRCUIT BREAKER:</span>
          <span className="font-bold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded text-[10px] tracking-wide">
            NORMAL / STABLE
          </span>
        </div>

        <span className="text-[#1C3E34] hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[#82AA9D]">CLS DvP LATENCY:</span>
          <span className="font-semibold text-white">0.84ms (SETU Rail)</span>
        </div>

        <span className="text-[#1C3E34] hidden md:inline">|</span>

        <div className="hidden md:flex items-center gap-1">
          <span className="text-[#82AA9D]">MERKLE STATE:</span>
          <span className="text-[#DCEEE8] font-semibold">#28,102,510</span>
        </div>

        <span className="text-[#1C3E34] hidden lg:inline">|</span>

        <div className="hidden lg:flex items-center gap-1">
          <span className="text-[#82AA9D]">USD/ARTH:</span>
          <span className="text-white font-semibold tabular-nums">1.0000</span>
        </div>
      </div>

      {/* Right telemetry indicators */}
      <div className="hidden sm:flex items-center gap-3 text-xs pl-3 shrink-0">
        <span className="flex items-center gap-1 text-[11px] font-medium text-[#10B981]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SETU Depository Synced</span>
        </span>
        <span className="text-[#1C3E34]">•</span>
        <span className="font-mono text-[11px] text-[#82AA9D]">{currentTime}</span>
      </div>
    </aside>
  );
};
