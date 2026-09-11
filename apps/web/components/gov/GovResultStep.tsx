'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Copy,
  Check,
  Building2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface GovResultStepProps {
  govId: string;
  email: string;
}

export const GovResultStep: React.FC<GovResultStepProps> = ({
  govId,
  email,
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
      <div className="relative mb-5">
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

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3A5F] leading-tight mb-2">
        Your GOV ID is Ready
      </h2>

      <p className="text-xs leading-relaxed text-[#5C574F] max-w-[320px] mb-6">
        Your identity record has been verified and registered on the ARTHAX sovereign authority ledger.
      </p>

      {/* Official Government Credential Plaque */}
      <div className="w-full rounded-2xl bg-white border border-[#3368A0]/20 shadow-md overflow-hidden mb-6 text-left">
        {/* Plaque Top Header Ribbon */}
        <div className="bg-gradient-to-r from-[#1E3A5F] via-[#3368A0] to-[#A8742A] px-4 py-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#A8742A]" />
            <span className="font-mono text-xs font-semibold tracking-wider uppercase">
              Official Identity Record
            </span>
          </div>
          <span className="text-[10px] font-mono bg-white/15 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Plaque Details */}
        <div className="p-5 space-y-4">
          {/* Main GOV ID Display with Copy */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C574F] block mb-1">
              Assigned Sovereign GOV ID
            </span>
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F2EFE7]/80 border border-[#3368A0]/15">
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[#1E3A5F]">
                {govId || 'GOV-4829-7316'}
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

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#3368A0]/10 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#5C574F] uppercase tracking-wider block">
                Registered Email
              </span>
              <span className="font-semibold text-[#1E3A5F] truncate block mt-0.5">
                {maskedEmail || 'citizen@domain.com'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#5C574F] uppercase tracking-wider block">
                Verification standard
              </span>
              <span className="font-semibold text-[#287A55] block mt-0.5">
                Level-3 Certified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Advisory Notice */}
      <div className="w-full p-3.5 rounded-2xl bg-[#C8DFDB]/20 border border-[#3368A0]/15 flex items-start gap-2.5 text-xs text-[#5C574F] text-left mb-6">
        <Sparkles className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
        <span>
          <strong>Next Step:</strong> Proceed to the ARTHAX registration flow to link this GOV&nbsp;ID to your personal bank ledger account.
        </span>
      </div>

      {/* Primary CTA: Continue to ARTHAX Onboarding */}
      <Link
        href="/user"
        className="group w-full py-4 px-6 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-md no-underline"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 70%, #2A588B 100%)',
        }}
        id="gov-continue-arthax-cta"
      >
        <span>Continue to ARTHAX User Portal</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};
