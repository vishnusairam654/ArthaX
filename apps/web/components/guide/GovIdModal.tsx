'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Lock, 
  Mail,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiLogin, apiSendLoginOtp, apiLoginWithOtp, apiGetActivePersona } from '@/lib/api';

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
  const router = useRouter();
  const activeUser = typeof window !== 'undefined' ? apiGetActivePersona() : null;
  const [step, setStep] = useState<'credentials' | 'otp' | 'connected'>(
    isConnected ? 'connected' : 'credentials'
  );
  const [emailOrGovId, setEmailOrGovId] = useState('');
  const [govPassword, setGovPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [connectedGovId, setConnectedGovId] = useState<string>(
    activeUser?.govIdNumber || 'GOV-INVARIANT'
  );
  const [connectedEmail, setConnectedEmail] = useState<string>(activeUser?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle password-based authentication
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = emailOrGovId.trim();
    if (!identifier) {
      setError('Please enter your sovereign GOV ID or registered email.');
      return;
    }
    if (!govPassword) {
      setError('Please enter your GOV Password.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await apiLogin({
        govIdOrEmail: identifier,
        govPassword,
      });
      setConnectedGovId(res.user.govIdNumber);
      setConnectedEmail(res.user.email);
      setStep('connected');
      onConnectSuccess(`GOV ID: ${res.user.govIdNumber}`);
    } catch (err: any) {
      setError(err.message || 'Authentication challenge failed. Verify credentials in Supabase Auth.');
    } finally {
      setIsLoading(false);
    }
  };

  // Request login OTP code
  const handleRequestOtp = async () => {
    const identifier = emailOrGovId.trim();
    if (!identifier || !identifier.includes('@')) {
      setError('Please enter a valid email address to receive a sovereign OTP.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await apiSendLoginOtp(identifier);
      if (res.code) {
        setDevOtpHint(res.code);
      }
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch sovereign OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify login OTP code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please input the complete 6-digit verification code.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await apiLoginWithOtp(emailOrGovId.trim(), code);
      setConnectedGovId(res.user.govIdNumber);
      setConnectedEmail(res.user.email);
      setStep('connected');
      onConnectSuccess(`GOV ID: ${res.user.govIdNumber}`);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectAction = () => {
    onDisconnect();
    setEmailOrGovId('');
    setGovPassword('');
    setOtp(['', '', '', '', '', '']);
    setStep('credentials');
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

        {/* STEP 1: Enter Credentials */}
        {step === 'credentials' && (
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

            <p className="font-body text-xs text-[#262320]/70 mb-5 leading-relaxed">
              Sign in with your registered sovereign email or GOV ID number. Powered by Supabase Auth and Argon2id isolated verification.
            </p>

            {/* Login Mode Toggle */}
            <div className="flex bg-[#F2EFE7] p-1 rounded-xl mb-4 border border-[#3368A0]/10">
              <button
                type="button"
                onClick={() => { setLoginMode('password'); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-lg transition ${
                  loginMode === 'password'
                    ? 'bg-white text-[#3368A0] shadow-xs'
                    : 'text-[#262320]/60 hover:text-[#262320]'
                }`}
              >
                GOV Password
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('otp'); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-lg transition ${
                  loginMode === 'otp'
                    ? 'bg-white text-[#3368A0] shadow-xs'
                    : 'text-[#262320]/60 hover:text-[#262320]'
                }`}
              >
                Email OTP
              </button>
            </div>

            <form onSubmit={loginMode === 'password' ? handlePasswordLogin : (e) => { e.preventDefault(); handleRequestOtp(); }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#262320]/80 font-semibold mb-1.5">
                  {loginMode === 'password' ? 'Email or GOV ID' : 'Registered Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3368A0]/60" />
                  <input
                    type={loginMode === 'password' ? 'text' : 'email'}
                    value={emailOrGovId}
                    onChange={(e) => setEmailOrGovId(e.target.value)}
                    placeholder={loginMode === 'password' ? 'e.g. GOV-2000-0091 or citizen@example.com' : 'e.g. citizen@example.com'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#3368A0]/20 bg-[#F2EFE7]/50 text-xs font-mono text-[#262320] focus:outline-none focus:border-[#3368A0] focus:ring-1 focus:ring-[#3368A0]"
                    required
                  />
                </div>
              </div>

              {loginMode === 'password' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-mono text-[#262320]/80 font-semibold">
                      Government Password
                    </label>
                    <span className="text-[10px] font-mono text-[#3368A0]">Argon2id Salted</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3368A0]/60" />
                    <input
                      type="password"
                      value={govPassword}
                      onChange={(e) => setGovPassword(e.target.value)}
                      placeholder="Enter GOV password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#3368A0]/20 bg-[#F2EFE7]/50 text-xs font-mono text-[#262320] focus:outline-none focus:border-[#3368A0] focus:ring-1 focus:ring-[#3368A0]"
                      required
                    />
                  </div>
                  <span className="block text-[10px] text-[#262320]/50 mt-1 font-body">
                    * Governs read & navigation access. Never used for money movement.
                  </span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-[#B5482E]/10 border border-[#B5482E]/30 text-[#B5482E] text-xs font-body flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
                      <span>Authenticating Identity...</span>
                    </>
                  ) : (
                    <>
                      <span>{loginMode === 'password' ? 'Verify & Connect GOV ID' : 'Dispatch Ephemeral OTP'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-3.5 border-t border-[#3368A0]/15 flex items-center justify-between text-xs font-body">
              <span className="text-[#262320]/70">New citizen without a GOV ID?</span>
              <a
                href="/gov"
                id="link-modal-gov-portal"
                className="inline-flex items-center gap-1 font-semibold text-[#3368A0] hover:text-[#022448] transition-colors"
              >
                <span>Create GOV ID & Claim 5,000 ARTH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
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
                  Enter Ephemeral Passcode
                </h3>
              </div>
            </div>

            <p className="font-body text-xs text-[#262320]/70 mb-5 leading-relaxed">
              We dispatched an ephemeral verification code to <strong className="text-[#3368A0] font-mono">{emailOrGovId}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const newOtp = [...otp];
                      newOtp[idx] = val;
                      setOtp(newOtp);
                      if (val && idx < 5) {
                        const nextInput = document.getElementById(`otp-input-${idx + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                        const prevInput = document.getElementById(`otp-input-${idx - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-11 h-12 text-center text-base font-mono font-bold rounded-xl border border-[#3368A0]/20 bg-[#F2EFE7]/50 text-[#3368A0] focus:outline-none focus:border-[#3368A0] focus:ring-1 focus:ring-[#3368A0]"
                  />
                ))}
              </div>

              {devOtpHint && (
                <div className="p-3 bg-[#EEF4FF] rounded-xl border border-[#3368A0]/20 text-[11px] font-mono text-[#1E3A5F] flex items-center justify-between">
                  <span>DEV CONSOLE PASSCODE:</span>
                  <span className="font-bold tracking-widest text-[#3368A0]">{devOtpHint}</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-[#B5482E]/10 border border-[#B5482E]/30 text-[#B5482E] text-xs font-body flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep('credentials'); setError(null); }}
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
                <span className="font-bold text-[#3368A0]">{connectedGovId}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono border-b border-[#3368A0]/10 pb-2">
                <span className="text-[#262320]/60">MAPPED CITIZEN:</span>
                <span className="font-semibold text-[#262320]">{connectedEmail || 'Authenticated Sovereign'}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono border-b border-[#3368A0]/10 pb-2">
                <span className="text-[#262320]/60">AUTH PROVIDER:</span>
                <span className="font-semibold text-emerald-700">Supabase Cloud Auth (Active)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono pt-1">
                <span className="text-[#262320]/60">ACCESS SCOPE:</span>
                <span className="font-semibold text-[#A8742A]">All Portals (User, Bank, Stocks, Shop)</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  router.push('/user');
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#3368A0] hover:bg-[#285280] text-white text-xs font-body font-semibold flex items-center justify-center gap-2 transition shadow-md active:scale-98"
              >
                <span>Enter User Sovereign Portal</span>
                <ArrowRight className="w-4 h-4" />
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
