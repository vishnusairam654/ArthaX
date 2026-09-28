'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Copy,
  Check,
  Building2,
  Sparkles,
  Coins,
  BookOpen,
  LogIn,
} from 'lucide-react';

interface GovResultStepProps {
  govId: string;
  email: string;
  citizenName?: string;
  profession?: string;
  onSignIn?: () => void;
}

export const GovResultStep: React.FC<GovResultStepProps> = ({
  govId,
  email,
  citizenName,
  profession,
  onSignIn,
}) => {
  const [copied, setCopied] = useState(false);

  // Mask email: first char + dots + domain
  const maskedEmail = (() => {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    return `${local[0]}${'•'.repeat(Math.min(local.length - 1, 4))}@${domain}`;
  })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(govId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Verified Sovereign Seal Header */}
      <div className="relative mb-4">
        <div className="absolute inset-0 -m-2 rounded-2xl bg-[#287A55]/15 blur-xs" />
        <div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #287A55 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#287A55]/10 border border-[#287A55]/20 text-[#287A55] text-xs font-mono mb-2">
        <span className="w-2 h-2 rounded-full bg-[#287A55] animate-pulse" />
        <span>Sovereign Identity Issued</span>
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3A5F] leading-tight mb-1">
        Citizen Account Created
      </h2>

      <p className="text-xs leading-relaxed text-[#5C574F] max-w-sm mb-5">
        Your sovereign identity is immutably registered on the ARTHAX authority ledger. Your initial 5,000.00 ARTH creation grant has been credited.
      </p>

      {/* Official Government Credential Plaque */}
      <div className="w-full rounded-2xl bg-white border border-[#3368A0]/20 shadow-md overflow-hidden mb-5 text-left">
        {/* Plaque Top Header Ribbon */}
        <div className="bg-gradient-to-r from-[#1E3A5F] via-[#3368A0] to-[#A8742A] px-4 py-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#A8742A]" />
            <span className="font-mono text-xs font-semibold tracking-wider uppercase">
              Official Identity Record
            </span>
          </div>
          <span className="text-[10px] font-mono bg-white/15 px-2 py-0.5 rounded-full font-bold">
            Active Tier-1
          </span>
        </div>

        {/* Plaque Details */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Main GOV ID Display with Copy */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C574F] block mb-1">
              Assigned Sovereign GOV ID
            </span>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F2EFE7]/80 border border-[#3368A0]/15">
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[#1E3A5F]">
                {govId || 'GOV-2000-0042'}
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shadow-2xs active:scale-95"
                style={{
                  backgroundColor: copied ? '#287A55' : '#1E3A5F',
                  color: '#FFFFFF',
                }}
                aria-label="Copy GOV ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Citizen Name & Bonus Callout */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#3368A0]/10 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#5C574F] uppercase tracking-wider block">
                Citizen Name
              </span>
              <span className="font-semibold text-[#1E3A5F] truncate block mt-0.5">
                {citizenName || email.split('@')[0]}
              </span>
              {profession && (
                <span className="text-[10px] text-[#5C574F] block mt-0.5 truncate">
                  {profession}
                </span>
              )}
            </div>
            <div>
              <span className="text-[10px] text-[#5C574F] uppercase tracking-wider block">
                Creation Grant
              </span>
              <span className="font-semibold text-[#A8742A] flex items-center gap-1 mt-0.5">
                <Coins className="w-3.5 h-3.5" />
                +5,000.00 ARTH
              </span>
              <span className="text-[10px] text-[#287A55] block mt-0.5">
                Cleared &amp; Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Advisory */}
      <div className="w-full p-3 rounded-xl bg-[#C8DFDB]/20 border border-[#3368A0]/15 flex items-start gap-2.5 text-xs text-[#5C574F] text-left mb-6">
        <Sparkles className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
        <span>
          <strong>Onboarding Pathway:</strong> Explore the <strong>Central Monetary Guide</strong> to understand our 5 chartered banks, monetary treaties, and double-entry settlement architecture.
        </span>
      </div>

      {/* Dual CTAs: Proceed to Central Guide & Sign In */}
      <div className="w-full space-y-2.5">
        <Link
          href="/guide"
          className="group w-full py-3.5 px-6 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-md no-underline"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 70%, #2A588B 100%)',
          }}
          id="gov-proceed-guide-cta"
        >
          <BookOpen className="w-4 h-4" />
          <span>Proceed to Central Guide</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {onSignIn ? (
          <button
            type="button"
            onClick={onSignIn}
            className="w-full py-3 px-6 rounded-2xl text-xs font-mono font-medium text-[#1E3A5F] bg-white hover:bg-[#EEF4FF] border border-[#3368A0]/20 flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Access Portals</span>
          </button>
        ) : (
          <Link
            href="/user"
            className="w-full py-3 px-6 rounded-2xl text-xs font-mono font-medium text-[#1E3A5F] bg-white hover:bg-[#EEF4FF] border border-[#3368A0]/20 flex items-center justify-center gap-2 transition-all shadow-2xs no-underline"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Open User Portal Directly</span>
          </Link>
        )}
      </div>
    </div>
  );
};
