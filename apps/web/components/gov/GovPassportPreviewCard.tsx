'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles, 
  Fingerprint,
  Lock,
  Landmark
} from 'lucide-react';

interface GovPassportPreviewCardProps {
  email: string;
  govId: string;
  currentStep: 'landing' | 'email' | 'otp' | 'password' | 'financial-password' | 'result' | 'login';
}

export const GovPassportPreviewCard: React.FC<GovPassportPreviewCardProps> = ({
  email,
  govId,
  currentStep,
}) => {
  const [copied, setCopied] = React.useState(false);

  const displayGovId = govId || (currentStep === 'result' ? 'GOV-4829-7316' : 'GOV-••••-••••');
  const displayEmail = email || (currentStep === 'login' ? 'authenticated.citizen@domain.gov' : 'pending.verification@domain.gov');

  const handleCopy = async () => {
    if (!govId && currentStep !== 'result') return;
    try {
      await navigator.clipboard.writeText(displayGovId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const getStepStatus = () => {
    switch (currentStep) {
      case 'landing':
        return { text: 'AWAITING CITIZEN INITIATION', color: '#5C574F', bg: 'bg-[#5C574F]/10' };
      case 'email':
        return { text: 'VERIFYING EMAIL IDENTITY', color: '#3368A0', bg: 'bg-[#3368A0]/10' };
      case 'otp':
        return { text: 'ATTESTING SECURITY TOKEN', color: '#A8742A', bg: 'bg-[#A8742A]/10' };
      case 'password':
        return { text: 'ENCRYPTING IDENTITY PASSKEY', color: '#3368A0', bg: 'bg-[#3368A0]/10' };
      case 'financial-password':
        return { text: 'SETTING FINANCIAL AUTHORITY', color: '#A8742A', bg: 'bg-[#A8742A]/15' };
      case 'result':
        return { text: 'SOVEREIGN CREDENTIAL ACTIVE', color: '#287A55', bg: 'bg-[#287A55]/15' };
      case 'login':
        return { text: 'CITIZEN AUTHENTICATION', color: '#1E3A5F', bg: 'bg-[#1E3A5F]/10' };
    }
  };

  const status = getStepStatus();

  return (
    <div className="relative w-full">
      {/* Decorative Atmosphere under card */}
      <div className="absolute -inset-2 bg-gradient-to-br from-[#1E3A5F]/10 via-[#A8742A]/8 to-transparent rounded-[36px] blur-xl -z-10 pointer-events-none" />

      {/* Main Plaque Container */}
      <div className="rounded-[32px] bg-white border border-[#3368A0]/20 shadow-2xl p-6 sm:p-8 overflow-hidden relative backdrop-blur-md">
        
        {/* Top Gold & Blue Sovereign Header Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E3A5F] via-[#3368A0] via-[#A8742A] to-[#1E3A5F]" />

        {/* Top Plaque Meta Strip */}
        <div className="flex items-center justify-between gap-2 border-b border-[#3368A0]/15 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1E3A5F] flex items-center justify-center p-1.5 shadow-xs">
              <Image
                src="/assets/brand/currency_symbol.png"
                alt="Emblem"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#A8742A] uppercase block">
                ARTHAX SOVEREIGN AUTHORITY
              </span>
              <span className="font-serif text-sm font-bold text-[#1E3A5F] block leading-none">
                National Identity Credential
              </span>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${status.bg}`} style={{ color: status.color }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: status.color }} />
            <span>{status.text}</span>
          </div>
        </div>

        {/* Dynamic Card Display */}
        <div 
          className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden shadow-lg"
          style={{
            background: 'linear-gradient(145deg, #0A192F 0%, #1E3A5F 55%, #254B7A 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Subtle watermark background on the passport */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-10 pointer-events-none select-none">
            <Image
              src="/assets/brand/navbar_logo.png"
              alt="Watermark"
              width={180}
              height={180}
              className="object-contain filter invert"
            />
          </div>

          {/* Holographic Chip & State Seal */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {/* Gold Chip */}
              <div 
                className="w-10 h-8 rounded-lg flex items-center justify-center shadow-inner"
                style={{
                  background: 'linear-gradient(135deg, #DFB87A 0%, #B88B38 50%, #7A5217 100%)',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                <div className="w-6 h-5 border border-[#533300]/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="border-r border-b border-[#533300]/30" />
                  <div className="border-b border-[#533300]/30" />
                  <div className="border-r border-[#533300]/30" />
                  <div />
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#E9D9BE] uppercase tracking-wider">
                PAC.008 ID Standard
              </span>
            </div>

            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[#E9D9BE]">
              CLASS 1 RECORD
            </span>
          </div>

          {/* Assigned GOV ID */}
          <div className="space-y-1 mb-4">
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest block">
              Sovereign Identity Number (GOV ID)
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-[#DFB87A] drop-shadow-sm">
                {displayGovId}
              </span>
              {(govId || currentStep === 'result') && (
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 flex items-center gap-1.5"
                  aria-label="Copy GOV ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Citizen Details Row */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 text-xs font-mono">
            <div>
              <span className="text-[10px] text-white/50 uppercase tracking-wider block">
                Bound Citizen Anchor
              </span>
              <span className="font-semibold text-white truncate block mt-0.5">
                {displayEmail}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-white/50 uppercase tracking-wider block">
                Attestation Standard
              </span>
              <span className="font-semibold text-[#A8F5BF] block mt-0.5">
                {currentStep === 'result' ? 'Level-3 Verified ✓' : 'Cryptographic Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Security Telemetry & Proof Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-[#3368A0]/10 text-xs font-mono text-[#5C574F]">
          <div className="p-3 rounded-xl bg-[#F2EFE7]/70 border border-[#3368A0]/10">
            <span className="text-[10px] text-[#5C574F] uppercase tracking-wider block mb-1">
              Identity Law
            </span>
            <span className="font-bold text-[#1E3A5F]">1 Email = 1 GOV ID</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F2EFE7]/70 border border-[#3368A0]/10">
            <span className="text-[10px] text-[#5C574F] uppercase tracking-wider block mb-1">
              Passkey Engine
            </span>
            <span className="font-bold text-[#1E3A5F]">Argon2id Salted (0-Tx)</span>
          </div>
        </div>

        {/* Trust Badges Footer */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#5C574F] px-1">
          <div className="flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-[#3368A0]" />
            <span>Bi-directional Vault Isolation</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#287A55] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SHA-256 Ledger Anchor</span>
          </div>
        </div>

      </div>
    </div>
  );
};
