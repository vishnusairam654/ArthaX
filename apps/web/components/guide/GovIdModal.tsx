'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Building, 
  Lock, 
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface GovIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onConnectSuccess: (govId: string) => void;
  onDisconnect: () => void;
}

export const GovIdModal: React.FC<GovIdModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  onConnectSuccess,
  onDisconnect
}) => {
  const [step, setStep] = useState<'email' | 'otp' | 'connected'>(isConnected ? 'connected' : 'email');
  const [email, setEmail] = useState('sovereign.citizen@arthax.gov');
  const [govPassword, setGovPassword] = useState('••••••••••••••');
  const [otp, setOtp] = useState(['4', '8', '1', '9', '0', '2']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid institutional or citizen email.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      setStep('connected');
      onConnectSuccess('GOV ID: #8491-LX (VERIFIED)');
    }, 800);
  };

  const handleDisconnectAction = () => {
    onDisconnect();
    setStep('email');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#262320]/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-[#3368A0]/20 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#3368A0] via-[#A8742A] to-[#3368A0]" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#262320]/50 hover:text-[#262320] hover:bg-[#F2EFE7] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Enter Email & GOV Password */}
        {step === 'email' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#3368A0]/10 text-[#3368A0] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#A8742A] uppercase font-semibold tracking-wider">
                  SOVEREIGN IDENTITY VERIFICATION
                </span>
                <h3 className="font-display text-xl text-[#3368A0] font-medium">
                  Connect Sovereign GOV ID
                </h3>
              </div>
            </div>

            <p className="font-body text-xs text-[#262320]/70 mb-6 leading-relaxed">
              Under ARTHAX Monetary Treaty 409-C, 1 Email maps to 1 GOV ID, unlocking unified cross-portal access across all five commercial banks and market nodes.
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#262320]/80 font-semibold mb-1.5">
                  Citizen Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@arthax.gov"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#3368A0]/20 bg-[#F2EFE7]/50 text-xs font-mono text-[#262320] focus:outline-none focus:border-[#3368A0] focus:ring-1 focus:ring-[#3368A0]"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-mono text-[#262320]/80 font-semibold">
                    Government Password
                  </label>
                  <span className="text-[10px] font-mono text-[#3368A0]">Argon2id Salted</span>
                </div>
                <input
                  type="password"
                  value={govPassword}
                  onChange={(e) => setGovPassword(e.target.value)}
                  placeholder="Enter GOV password"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#3368A0]/20 bg-[#F2EFE7]/50 text-xs font-mono text-[#262320] focus:outline-none focus:border-[#3368A0] focus:ring-1 focus:ring-[#3368A0]"
                  required
                />
                <span className="block text-[10px] text-[#262320]/50 mt-1 font-body">
                  * Note: Governs identity read-only access. Never used for money movement.
                </span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[#B5482E]/10 border border-[#B5482E]/30 text-[#B5482E] text-xs font-body flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#3368A0] hover:bg-[#285280] text-white text-xs font-body font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validating Sovereign Identity...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Ephemeral OTP Challenge</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Ephemeral OTP Challenge */}
        {step === 'otp' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#A8742A]/10 text-[#A8742A] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#A8742A] uppercase font-semibold tracking-wider">
                  STEP-UP ATTESTATION
                </span>
                <h3 className="font-display text-xl text-[#3368A0] font-medium">
                  Enter Single-Use Challenge Code
                </h3>
              </div>
            </div>

            <p className="font-body text-xs text-[#262320]/70 mb-5 leading-relaxed">
              We dispatched an ephemeral cryptographic verification challenge to <strong className="text-[#3368A0] font-mono">{email}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-11 h-12 text-center text-base font-mono font-bold rounded-xl border border-[#3368A0]/20 bg-[#F2EFE7]/50 text-[#3368A0] focus:outline-none focus:border-[#3368A0] focus:ring-1 focus:ring-[#3368A0]"
                  />
                ))}
              </div>

              <div className="p-3 bg-[#F2EFE7] rounded-xl border border-[#3368A0]/10 text-[11px] font-mono text-[#262320]/70 flex items-center justify-between">
                <span>SIMULATED CHALLENGE:</span>
                <span className="text-[#3368A0] font-bold">481902</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-1/3 py-3 px-4 rounded-xl border border-[#3368A0]/20 text-[#262320]/70 text-xs font-body font-medium hover:bg-[#F2EFE7] transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-3 px-4 rounded-xl bg-[#3368A0] hover:bg-[#285280] text-white text-xs font-body font-semibold flex items-center justify-center gap-2 transition shadow-md active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Anchor Session</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Connected Sovereign Status Plaque */}
        {step === 'connected' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-emerald-700 uppercase font-semibold tracking-wider">
                  SOVEREIGN SESSION ANCHORED
                </span>
                <h3 className="font-display text-xl text-[#3368A0] font-medium">
                  Identity Active Across Portals
                </h3>
              </div>
            </div>

            {/* Credential Passport Plaque */}
            <div className="p-5 rounded-2xl bg-[#F2EFE7] border border-[#3368A0]/20 space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs font-mono border-b border-[#3368A0]/10 pb-2">
                <span className="text-[#262320]/60">GOV ID:</span>
                <span className="font-bold text-[#3368A0]">#8491-904-LX</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono border-b border-[#3368A0]/10 pb-2">
                <span className="text-[#262320]/60">MAPPED CITIZEN:</span>
                <span className="font-semibold text-[#262320]">sovereign.citizen@arthax.gov</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono border-b border-[#3368A0]/10 pb-2">
                <span className="text-[#262320]/60">LINKED ACCOUNTS:</span>
                <span className="font-semibold text-[#A8742A]">2 Commercial Banks (Nava, Samaya)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono pt-1">
                <span className="text-[#262320]/60">SESSION TTL:</span>
                <span className="font-semibold text-emerald-700">07:59:42 (ARGON2ID AUTH)</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-[#3368A0] hover:bg-[#285280] text-white text-xs font-body font-semibold flex items-center justify-center gap-2 transition shadow-md active:scale-98"
              >
                <span>Return to Central Guide Board</span>
              </button>

              <button
                onClick={handleDisconnectAction}
                className="w-full py-2.5 px-4 rounded-xl border border-[#B5482E]/30 text-[#B5482E] text-xs font-body font-medium hover:bg-[#B5482E]/5 transition flex items-center justify-center gap-1.5"
              >
                <span>Terminate Sovereign Session</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
