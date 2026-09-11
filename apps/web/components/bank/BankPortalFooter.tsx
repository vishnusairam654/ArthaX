'use client';

import React from 'react';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

export const BankPortalFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#1C1736] text-[#8B82B0] border-t border-[#2D2654] text-xs font-sans">
      <div className="px-6 py-6 space-y-5">
        {/* Row 1: Bank identity + compliance badges */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#2D2654] pb-5">
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-sm">ARTHAX Bank Portal</span>
              <span className="px-2 py-0.5 rounded bg-[#2D2654] text-[#D4CEF0] font-mono text-[10px] font-semibold uppercase">
                Operations Console
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8B82B0]">
              Private operational interface for ARTHAX commercial banks. All data governed by the Central Settlement Layer and sovereign double-entry ledger protocol.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <div className="bg-[#2D2654] border border-[#3B3278]/30 px-3 py-2 rounded-xl text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <div>
                <div className="text-[9px] text-[#8B82B0] uppercase">Compliance</div>
                <div className="font-semibold">CLS Audited</div>
              </div>
            </div>

            <div className="bg-[#2D2654] border border-[#3B3278]/30 px-3 py-2 rounded-xl text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#A8742A]" />
              <div>
                <div className="text-[9px] text-[#8B82B0] uppercase">Session</div>
                <div className="font-semibold">Encrypted & Timed</div>
              </div>
            </div>

            <div className="bg-[#2D2654] border border-[#3B3278]/30 px-3 py-2 rounded-xl text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#66A3BF]" />
              <div>
                <div className="text-[9px] text-[#8B82B0] uppercase">Version</div>
                <div className="font-semibold">v2.4.1-sovereign</div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Regulatory + support */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6B6290]">
          <div>
            © 2025–2026 ARTHAX Sovereign Financial System. Authorized personnel only. All operations audited.
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>Support: ops@arthax.sovereign</span>
            <span className="text-[#2D2654]">•</span>
            <span>Session timeout: 30 min</span>
            <span className="text-[#2D2654]">•</span>
            <span className="text-[#10B981]">MFA Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
