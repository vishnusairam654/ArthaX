'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, ArrowRight, LogIn, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

interface GovLandingProps {
  onCreateGovId: () => void;
  onSignIn: () => void;
}

export const GovLanding: React.FC<GovLandingProps> = ({
  onCreateGovId,
  onSignIn,
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Sovereign Seal Plaque */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -m-2.5 rounded-3xl bg-gradient-to-br from-[#3368A0]/15 via-[#A8742A]/10 to-transparent blur-xs pointer-events-none" />
        <div
          className="relative w-20 h-20 rounded-2xl flex items-center justify-center p-3 shadow-md"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 60%, #496C80 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <div className="w-full h-full rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Image
              src="/assets/brand/navbar_logo.png"
              alt="Government Emblem"
              width={40}
              height={40}
              className="object-contain filter drop-shadow-sm"
              priority
            />
          </div>
        </div>
      </div>

      {/* Title & Hierarchy */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3368A0]/8 border border-[#3368A0]/15 text-[#1E3A5F] text-xs font-mono mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A8742A]" />
        <span>Sovereign Identity Protocol</span>
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E3A5F] leading-tight mb-2.5">
        Government Identity Gateway
      </h1>

      <p className="text-sm leading-relaxed text-[#5C574F] max-w-[340px] mb-6">
        Establish your sovereign identity record. Verify your email and receive your unique GOV&nbsp;ID — the root credential of your ARTHAX account.
      </p>

      {/* Protocol Architecture Invariant Pill */}
      <div className="w-full bg-[#F2EFE7]/80 rounded-2xl p-3.5 mb-6 border border-[#3368A0]/10 text-left space-y-2">
        <div className="text-[11px] font-mono font-semibold text-[#1E3A5F] uppercase tracking-wider flex items-center justify-between">
          <span>Identity Architecture Rule</span>
          <span className="text-[#A8742A] font-bold">1:1:1 Invariant</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono pt-1">
          <div className="p-2 rounded-xl bg-white border border-[#3368A0]/10 shadow-2xs">
            <div className="text-[#5C574F] text-[10px]">Step 1</div>
            <div className="font-semibold text-[#1E3A5F] text-[11px] truncate">1 Email</div>
          </div>
          <div className="p-2 rounded-xl bg-[#C8DFDB]/40 border border-[#3368A0]/20 shadow-2xs">
            <div className="text-[#3368A0] text-[10px]">Authority</div>
            <div className="font-bold text-[#1E3A5F] text-[11px] truncate">1 GOV ID</div>
          </div>
          <div className="p-2 rounded-xl bg-white border border-[#3368A0]/10 shadow-2xs">
            <div className="text-[#5C574F] text-[10px]">Ledger</div>
            <div className="font-semibold text-[#1E3A5F] text-[11px] truncate">1 ARTHAX</div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onCreateGovId}
        className="group w-full py-4 px-6 rounded-2xl font-sans text-sm font-semibold text-white flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-md"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 70%, #2A588B 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
        id="gov-create-id-cta"
      >
        <span>Create GOV ID</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5 w-full">
        <div className="flex-1 h-px bg-[#3368A0]/15" />
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#5C574F]/70">
          or access credential
        </span>
        <div className="flex-1 h-px bg-[#3368A0]/15" />
      </div>

      {/* Secondary Action Button (Sign In) */}
      <button
        onClick={onSignIn}
        className="group w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-medium text-[#1E3A5F] bg-[#3368A0]/5 hover:bg-[#3368A0]/10 border border-[#3368A0]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        id="gov-sign-in-cta"
      >
        <LogIn className="w-4 h-4 text-[#3368A0]" />
        <span>Already have a GOV ID? <strong>Sign In</strong></span>
      </button>
    </div>
  );
};
