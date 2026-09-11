'use client';

import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

interface StockCompanyScopeProps {
  symbol: string;
}

export const StockCompanyScope: React.FC<StockCompanyScopeProps> = ({ symbol }) => {
  return (
    <div className="space-y-4">
      {/* Scope Section */}
      <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="space-y-1">
          <h3 className="font-serif text-lg text-[#022448] font-bold">
            Operational Scope &amp; Strategic Architecture
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#43474E] leading-relaxed">
            Operates as the core institutional defense and deep-space communications infrastructure conglomerate chartered by the SETU Depository Authority. The enterprise engineers resilient sovereign orbital mesh routers, high-aperture quantum telemetry relays, and atomic sensor arrays deployed across vital national corridors. All infrastructure assets are clearing-house secured under DvP asset collateralization charters.
          </p>
        </div>

        {/* Revenue Attribution Bar */}
        <div className="space-y-2 pt-2 border-t border-[#74777F]/15">
          <div className="flex justify-between items-center text-xs font-semibold text-[#121C28]">
            <span>Segment Revenue Attribution</span>
            <span className="text-[#5C574F] font-mono">Consolidated: 780M ARTH</span>
          </div>

          <div className="h-3 w-full rounded-full flex overflow-hidden shadow-inner bg-[#E5EFFF]">
            <div className="h-full bg-[#022448]" style={{ width: '52%' }} title="Space Defense Telecom (52%)" />
            <div className="h-full bg-[#1E3A5F]" style={{ width: '31%' }} title="Orbital Radar & Sensors (31%)" />
            <div className="h-full bg-[#A8742A]" style={{ width: '17%' }} title="Quantum Mesh Licensing (17%)" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#022448]" />
              <span className="text-[#121C28] font-medium">Space Defense Telecom (52%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A5F]" />
              <span className="text-[#121C28] font-medium">Orbital Radar &amp; Sensors (31%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8742A]" />
              <span className="text-[#121C28] font-medium">Quantum Mesh Licensing (17%)</span>
            </div>
          </div>
        </div>

        {/* Executive Leadership Desk */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#022448] text-white flex items-center justify-center font-bold text-sm shadow-2xs font-serif">
              RV
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-[#121C28] font-bold">Dr. Rajesh Varma</span>
              <span className="text-[11px] text-[#5C574F]">Managing Director &amp; CEO (Ex-SETU)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-sm shadow-2xs font-serif">
              AS
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-[#121C28] font-bold">Aruna Subramanian</span>
              <span className="text-[11px] text-[#5C574F]">Chief Orbital Scientist (Ph.D. Quantum)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Filings Card */}
      <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#74777F]/15">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#287A55]" />
            <h3 className="font-serif text-base text-[#022448] font-bold">
              Section 18-C Attestations &amp; Depository Ledgers
            </h3>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#287A55]/10 text-[#287A55] font-bold">
            AUDIT: UNQUALIFIED PASS
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-[#121C28]">Q4 Merkle Financial Attestation Hash</div>
              <span className="font-mono text-[#5C574F] text-[11px]">
                SHA-256: 0x9e88a1b32d0c64ef819774f28aa66c...
              </span>
            </div>
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-white border border-[#74777F]/20 text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-all font-semibold text-xs shadow-2xs cursor-pointer"
            >
              Verify Cryptographic Proof
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/10 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-[#121C28]">Sovereign Debt Service Stasis Confirmation</div>
              <span className="text-[#287A55] font-medium text-[11px]">
                Debt Coverage Ratio: 4.88x (Zero Default Risk Flag)
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#5C574F]">SEBI Tier-1 Registry</span>
          </div>
        </div>
      </div>
    </div>
  );
};
