'use client';

import React from 'react';
import { Zap, Shield, Key } from 'lucide-react';

export const ResidentBanner: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EEF4FF] border border-[#74777F]/20 px-5 py-3 rounded-2xl shadow-xs">
      <div className="flex items-center gap-3 font-sans text-xs">
        <span className="flex h-2.5 w-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
        <span className="font-semibold text-[#121C28]">Resident Settlement Session Active</span>
        <span className="text-[#74777F]/40">•</span>
        <span className="font-mono text-[#43474E] text-[11px] flex items-center gap-1">
          <Key className="w-3 h-3 text-[#1E3A5F]" />
          ENCLAVE SEC-KEY: 0x9DF2...B831
        </span>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="px-3 py-1 bg-[#DFE9FA] text-[#121C28] text-[11px] font-medium rounded-full border border-[#74777F]/20">
          Domestic Sovereign Tier-1
        </span>
        <span className="px-3 py-1 bg-[#DBE1FF] text-[#031847] text-[11px] font-semibold rounded-full flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#1E3A5F]" />
          DvP Finality Sub-second
        </span>
      </div>
    </div>
  );
};
