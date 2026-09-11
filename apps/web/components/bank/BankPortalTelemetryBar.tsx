'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

export const BankPortalTelemetryBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside
      aria-label="Bank Operational Telemetry"
      className="h-9 w-full bg-[#1C1736]/95 backdrop-blur-md text-[#B0A8D0] border border-[#2D2654]/70 rounded-2xl sm:rounded-3xl px-4 sm:px-6 flex items-center justify-between text-xs font-mono tracking-tight select-none z-50 shrink-0 shadow-md shadow-[#1C1736]/15"
    >
      {/* Left status cluster */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="font-bold text-white tracking-wider">BANK OPERATIONS ONLINE</span>
        </div>

        <span className="text-[#2D2654]">|</span>

        <div className="flex items-center gap-1">
          <span className="text-[#8B82B0]">PENDING APPROVALS:</span>
          <span className="font-bold text-[#A8742A] bg-[#A8742A]/15 px-1.5 py-0.5 rounded text-[10px] tracking-wide">
            6 ITEMS
          </span>
        </div>

        <span className="text-[#2D2654] hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[#8B82B0]">TODAY TX VOL:</span>
          <span className="font-semibold text-white">248,500 ARTH</span>
        </div>

        <span className="text-[#2D2654] hidden md:inline">|</span>

        <div className="hidden md:flex items-center gap-1">
          <span className="text-[#8B82B0]">CLS STATUS:</span>
          <span className="font-bold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded text-[10px]">
            SYNCED
          </span>
        </div>

        <span className="text-[#2D2654] hidden lg:inline">|</span>

        <div className="hidden lg:flex items-center gap-1">
          <span className="text-[#8B82B0]">LEDGER STATE:</span>
          <span className="text-[#D4CEF0] font-semibold">#28,102,520</span>
        </div>
      </div>

      {/* Right indicators */}
      <div className="hidden sm:flex items-center gap-3 text-xs pl-3 shrink-0">
        <span className="flex items-center gap-1 text-[11px] font-medium text-[#10B981]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CLS Connected</span>
        </span>
        <span className="text-[#2D2654]">•</span>
        <span className="font-mono text-[11px] text-[#8B82B0]">{currentTime}</span>
      </div>
    </aside>
  );
};
