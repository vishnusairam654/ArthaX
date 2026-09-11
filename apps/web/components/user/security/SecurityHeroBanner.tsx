'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Fingerprint
} from 'lucide-react';

interface SecurityHeroBannerProps {
  onOpenKillswitch: () => void;
  onExportAuditProof: () => void;
  isStasisActive?: boolean;
}

export const SecurityHeroBanner: React.FC<SecurityHeroBannerProps> = ({
  onOpenKillswitch,
  onExportAuditProof,
  isStasisActive = false,
}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#022448] via-[#1E3A5F] to-[#0A1D33] text-white p-6 md:p-8 shadow-md border border-[#1E3A5F]/40">
      {/* Subtle ambient decorative grid / pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} 
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top telemetry status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              FIPS 140-3 LEVEL 4 HSM ACTIVE
            </span>
            <span className="text-white/30">|</span>
            <span className="text-slate-300 flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-[#C8DFDB]" />
              HARDWARE ATTESTATION: #IN-8491-X
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">STATE HASH:</span>
            <span className="text-white font-semibold tracking-wider">0x9F4B...28A1</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200 text-[11px]">
              28,102,510 BLK
            </span>
          </div>
        </div>

        {/* Middle row: Title & Emergency Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C8DFDB] font-semibold">
                SOVEREIGN CITIZEN ENCLAVE COCKPIT
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#A8742A]/30 text-[#FFDDB6] border border-[#A8742A]/40 font-bold">
                TIER-1 VERIFIED
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Security &amp; Enclave Settings
            </h1>
            <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed">
              Manage multi-factor cryptographic credentials, enclave hardware attestation, and isolated Tier-B Financial PIN authentication protecting interbank DvP settlements.
            </p>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={onExportAuditProof}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-sans font-medium border border-white/15 transition-all shadow-xs hover:scale-[1.02]"
              title="Generate a signed cryptographic proof of security compliance"
            >
              <FileText className="w-4 h-4 text-[#C8DFDB]" />
              <span>Export Audit Proof</span>
            </button>

            <button
              onClick={onOpenKillswitch}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all shadow-xs hover:scale-[1.02] ${
                isStasisActive
                  ? 'bg-[#B5482E] text-white ring-2 ring-[#B5482E]/50 animate-pulse'
                  : 'bg-[#B5482E]/20 hover:bg-[#B5482E]/30 text-[#FFDAD6] border border-[#B5482E]/40'
              }`}
              title="Immediately freeze all outbound transfers and revoke sessions"
            >
              <AlertTriangle className="w-4 h-4 text-[#FFDAD6]" />
              <span>{isStasisActive ? 'Account Stasis Engaged' : 'Emergency Killswitch'}</span>
            </button>
          </div>
        </div>

        {/* Bottom row: 4 Telemetry Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Posture Score */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Overall Posture
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-white">98</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold ml-1">Grade A+</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* HSM Enclave State */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Enclave Module
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-sans text-sm font-semibold text-white">Sealed &amp; Armed</span>
              </div>
              <span className="text-[10px] font-mono text-[#C8DFDB]">ECDSA P-384 + Argon2id</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1E3A5F]/80 border border-[#66A3BF]/30 flex items-center justify-center text-[#66A3BF]">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          {/* Credential Separation */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Credential Isolation
              </span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-sans text-sm font-semibold text-white">Rule 16 Compliant</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300">Dual-Salted Hashing</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#A8742A]/20 border border-[#A8742A]/40 flex items-center justify-center text-[#FFDDB6]">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* Session Coherence */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Active Session Nodes
              </span>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-sans text-sm font-semibold text-white">3 Verified Devices</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300">All Nodes TLS 1.3</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <Fingerprint className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
