'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Clock, 
  Lock,
  Layers,
  FileKey
} from 'lucide-react';

export const SecurityShowcaseSection: React.FC = () => {
  const [tierAOpen, setTierAOpen] = useState<boolean>(false);
  const [tierBOpen, setTierBOpen] = useState<boolean>(false);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-[#3368A0]/15" id="security">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 border border-[#A8742A]/30 text-[#A8742A] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <span>SECURITY FRAMEWORK</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#3368A0] font-normal tracking-tight">
          Strict Separation of Powers: The Dual-Password Standard
        </h2>
        <p className="font-body text-sm text-[#262320]/75 mt-2">
          In the ARTHAX paradigm, identity authentication is mathematically separated from asset disposition to eliminate session hijacking risk. Click either tier below to inspect architectural protocols.
        </p>
      </div>

      {/* Two-Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* TIER A: Sovereign Identity (Government Password) */}
        <div 
          onClick={() => setTierAOpen(!tierAOpen)}
          className={`bg-white rounded-3xl border transition-all duration-300 p-8 shadow-sm cursor-pointer select-none hover:shadow-lg ${
            tierAOpen ? 'border-[#3368A0] ring-1 ring-[#3368A0]/30' : 'border-[#3368A0]/20 hover:border-[#3368A0]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-full bg-[#3368A0]/10 text-[#3368A0] font-mono text-xs font-semibold">
              TIER A // SOVEREIGN IDENTITY
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#3368A0]/10 flex items-center justify-center text-[#3368A0]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-[#3368A0] font-medium mb-1">
              The Government Password
            </h3>
            <ChevronDown 
              className={`w-5 h-5 text-[#262320]/60 transition-transform duration-300 ${
                tierAOpen ? 'rotate-180 text-[#3368A0]' : ''
              }`} 
            />
          </div>

          <p className="font-body text-sm text-[#262320]/75 leading-relaxed mb-6 mt-2">
            Governs authentication into the sovereign network, accessing read-only ledger telemetry, profile attestations, and civic governance.
          </p>

          <div className="space-y-3.5 pt-2 font-body text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="text-[#262320]">
                Authenticates into citizen user portal and commercial terminals
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="text-[#262320]">
                Unlocks non-financial civic communications and official notice inbox
              </span>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-4 h-4 text-[#B5482E] shrink-0 mt-0.5" />
              <span className="text-[#B5482E] font-medium">
                Strictly CANNOT authorize transfer of capital or trade execution
              </span>
            </div>
          </div>

          {/* Expandable Accordion Specs Drawer */}
          <div 
            className={`transition-all duration-400 overflow-hidden ${
              tierAOpen ? 'max-h-60 mt-6 pt-5 border-t border-[#3368A0]/15 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="text-xs font-mono text-[#262320]/80 space-y-2.5 bg-[#F2EFE7]/60 p-4 rounded-2xl border border-[#3368A0]/10">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#262320]/60 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#3368A0]" />
                  Algorithm:
                </span>
                <span className="text-[#3368A0] font-semibold">Argon2id + RSA-4096 Salt</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#262320]/60 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#3368A0]" />
                  Session Expiry:
                </span>
                <span className="text-[#3368A0] font-semibold">8 Hours or Tab Closure</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#262320]/60 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#3368A0]" />
                  Operational Scope:
                </span>
                <span className="text-emerald-800 font-semibold">Read-Only Telemetry & Civic Voting</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#3368A0]/15 font-mono text-[11px] text-[#262320]/60 flex justify-between items-center">
            <span>Entropy: 14+ Chars • Salted PBKDF2</span>
            <span className="text-[11px] text-[#3368A0] underline font-body font-semibold">
              {tierAOpen ? 'Hide Architecture' : 'Inspect Specs'}
            </span>
          </div>
        </div>

        {/* TIER B: Liquid Disposition (Financial PIN) */}
        <div 
          onClick={() => setTierBOpen(!tierBOpen)}
          className={`bg-white rounded-3xl border transition-all duration-300 p-8 shadow-sm cursor-pointer select-none hover:shadow-lg ${
            tierBOpen ? 'border-[#A8742A] ring-1 ring-[#A8742A]/30' : 'border-[#A8742A]/30 hover:border-[#A8742A]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-full bg-[#A8742A]/10 text-[#A8742A] border border-[#A8742A]/30 font-mono text-xs font-semibold">
              TIER B // LIQUID DISPOSITION
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#A8742A]/10 flex items-center justify-center text-[#A8742A]">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-[#3368A0] font-medium mb-1">
              The Financial PIN / Key
            </h3>
            <ChevronDown 
              className={`w-5 h-5 text-[#A8742A] transition-transform duration-300 ${
                tierBOpen ? 'rotate-180 text-[#A8742A]' : ''
              }`} 
            />
          </div>

          <p className="font-body text-sm text-[#262320]/75 leading-relaxed mb-6 mt-2">
            A high-security cryptographic credential required strictly at the precise instant of balance reduction, order execution, and vault withdrawals.
          </p>

          <div className="space-y-3.5 pt-2 font-body text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
              <span className="text-[#262320] font-medium">
                Mandatory for any debit transaction above 0.00 ARTH
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
              <span className="text-[#262320]">
                Required for capital market limit bids, FD creation, and vault unlocks
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
              <span className="text-[#262320]">
                Executed inside isolated secure enclave with zero session storage
              </span>
            </div>
          </div>

          {/* Expandable Accordion Specs Drawer */}
          <div 
            className={`transition-all duration-400 overflow-hidden ${
              tierBOpen ? 'max-h-60 mt-6 pt-5 border-t border-[#A8742A]/20 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="text-xs font-mono text-[#262320]/80 space-y-2.5 bg-[#A8742A]/5 p-4 rounded-2xl border border-[#A8742A]/20">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#262320]/60 flex items-center gap-1.5">
                  <FileKey className="w-3.5 h-3.5 text-[#A8742A]" />
                  Signature Standard:
                </span>
                <span className="text-[#A8742A] font-semibold">Ed25519 Ephemeral Enclave</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#262320]/60 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#A8742A]" />
                  Memory Persistence:
                </span>
                <span className="text-[#B5482E] font-semibold font-mono">0ms (Immediate Zeroization)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#262320]/60 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#A8742A]" />
                  Hardware Anchor:
                </span>
                <span className="text-[#A8742A] font-semibold">FIPS 140-3 Level 4 Secure HSM</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#A8742A]/20 font-mono text-[11px] text-[#A8742A] font-medium flex justify-between items-center">
            <span>Zero Session Caching • Single-Shot Cryptographic</span>
            <span className="text-[11px] text-[#A8742A] underline font-body font-semibold">
              {tierBOpen ? 'Hide Architecture' : 'Inspect Specs'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
