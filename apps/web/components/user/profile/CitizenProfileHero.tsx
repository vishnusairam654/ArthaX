'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Fingerprint, ShieldCheck, Lock, Award, Eye, EyeOff, CheckCircle2, Sparkles, Copy, Check } from 'lucide-react';

interface CitizenProfileHeroProps {
  isMasked?: boolean;
}

export function CitizenProfileHero({ isMasked: initialMasked = true }: CitizenProfileHeroProps) {
  const [isTaxIdRevealed, setIsTaxIdRevealed] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const citizenHash = 'ARTH-CTZN-849102-IN';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(citizenHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#022448] via-[#1E3A5F] to-[#0D1726] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-[#1E3A5F]">
      {/* Guilloche & Gold Ambient Light Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#A8742A]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-[#66A3BF]/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C8DFDB_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Side: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Framed Profile Picture */}
          <div className="relative shrink-0">
            {/* Ambient gold glow */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#A8742A] to-[#C59A45] opacity-40 blur-sm pointer-events-none" />

            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#FAF8F5] border-2 border-[#A8742A]/60 shadow-lg">
              {/* Avatar Base Image */}
              <Image
                src="/assets/shop/avatars/Female/Analyst.png"
                alt="Ananya Sharma"
                fill
                sizes="128px"
                className="object-cover object-top"
                priority
              />

              {/* Gold Filigree Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src="/assets/shop/frames/gold.png"
                  alt="Gold Filigree Frame"
                  fill
                  sizes="128px"
                  className="object-contain scale-110"
                />
              </div>
            </div>

            {/* Online / Active Enclave Indicator */}
            <div
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#022448] border-2 border-white flex items-center justify-center shadow-xs"
              title="Active Resident Session"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Citizen Bio & Identifiers */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/20 border border-[#A8F5BF]/40 text-[#A8F5BF] font-mono text-[11px] font-semibold flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                Tier-1 Biometric Verified
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#C8DFDB] font-mono text-[11px] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C59A45]" />
                ISO 20022 Registered
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5]/10 text-white/90 font-mono text-[11px]">
                Active Enclave
              </span>
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Ananya Sharma
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#C8DFDB] mt-0.5">
                Senior Financial Analyst • Corporate Escrow Signatory &amp; Syndicate Trustee
              </p>
            </div>

            {/* Identifiers Grid */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-300">
              <div className="bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="text-[#C59A45] font-semibold">GOV-ID:</span>
                <span className="text-white font-bold">#8491-904-IN</span>
              </div>

              <div className="bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="text-slate-400">CITIZEN HASH:</span>
                <span className="text-slate-200 select-all">{citizenHash}</span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="hover:text-white transition-colors cursor-pointer text-slate-400"
                  title="Copy Citizen Hash"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="text-slate-400">TAX PAN:</span>
                <span className="text-white">
                  {isTaxIdRevealed ? 'ABCDE 8491A' : '•••••••• 491A'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsTaxIdRevealed(!isTaxIdRevealed)}
                  className="text-slate-400 hover:text-white cursor-pointer ml-1"
                  title={isTaxIdRevealed ? "Hide PAN" : "Reveal PAN"}
                >
                  {isTaxIdRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Civic Score & Merit Plaque */}
        <div className="w-full lg:w-auto shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4 font-sans min-w-[260px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8DFDB]">
              Civic Standing
            </span>
            <span className="px-2 py-0.5 rounded bg-[#A8742A]/20 text-[#E9D9BE] border border-[#A8742A]/30 text-[10px] font-bold uppercase tracking-wide">
              Level 3 Anchor
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl font-bold text-[#E9D9BE]">98.4</span>
              <span className="font-mono text-xs text-slate-300">/ 100 Score</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#A8742A] to-emerald-400 h-full rounded-full" style={{ width: '98.4%' }} />
            </div>
            <span className="text-[11px] text-[#C8DFDB] block pt-1">
              Top 0.5% Sovereign Citizen Standing
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Parity Rating</span>
              <span className="text-white font-semibold">AAA+ Reserve</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase">Epoch Joined</span>
              <span className="text-white font-semibold">#24 (Jan 2024)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
