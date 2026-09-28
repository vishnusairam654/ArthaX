'use client';

import React, { useState } from 'react';
import {
  LogIn,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { apiLogin, apiSendLoginOtp, apiLoginWithOtp } from '@/lib/api';

interface GovLoginStepProps {
  onBack: () => void;
  onLoginSuccess: (govId: string, email: string) => void;
}

type LoginMode = 'password' | 'otp';

export const GovLoginStep: React.FC<GovLoginStepProps> = ({
  onBack,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<LoginMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please input your registered email address.');
      return;
    }
    if (!password) {
      setError('Please input your GOV Password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const authRes = await apiLogin({
        govIdOrEmail: email.trim(),
        govPassword: password,
      });
      onLoginSuccess(authRes.user.govIdNumber, authRes.user.email);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dispatch Login OTP
  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address first.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await apiSendLoginOtp(email.trim());
      setOtpSent(true);
      if (res.code) {
        setDevOtp(res.code);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch login verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Login OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please input your registered email address.');
      return;
    }
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const authRes = await apiLoginWithOtp(email.trim(), otpCode.trim());
      onLoginSuccess(authRes.user.govIdNumber, authRes.user.email);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired login passcode.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C574F] hover:text-[#1E3A5F] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Gateway</span>
      </button>

      {/* Step Header */}
      <div className="flex items-start gap-3.5 mb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 100%)',
          }}
        >
          <LogIn className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3368A0] bg-[#3368A0]/10 px-2 py-0.5 rounded-sm">
              Sovereign Session
            </span>
            <span className="text-[11px] font-mono text-[#5C574F]">Citizen Sign In</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A5F] leading-tight mt-1">
            Sign In to Identity
          </h2>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#5C574F] mb-5 pl-[58px]">
        Authenticate using your registered email and your password or a one-time login passcode.
      </p>

      {/* Tab Switcher: Password vs OTP */}
      <div className="flex p-1 rounded-xl bg-[#F2EFE7] border border-[#3368A0]/15 mb-5">
        <button
          type="button"
          onClick={() => {
            setMode('password');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            mode === 'password'
              ? 'bg-white text-[#1E3A5F] shadow-xs'
              : 'text-[#5C574F] hover:text-[#1E3A5F]'
          }`}
        >
          Email + Password
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('otp');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
            mode === 'otp'
              ? 'bg-white text-[#1E3A5F] shadow-xs'
              : 'text-[#5C574F] hover:text-[#1E3A5F]'
          }`}
        >
          Email + OTP Passcode
        </button>
      </div>

      {mode === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="gov-login-email"
              className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
            >
              Registered Email Address
            </label>
            <div className="relative">
              <input
                id="gov-login-email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="citizen@domain.com (or GOV-XXXX-XXXX)"
                required
                autoFocus
                className="w-full px-4 py-3.5 pl-10 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-2 focus:ring-[#3368A0]/10 focus:outline-none transition-all placeholder:text-[#5C574F]/40 shadow-inner"
              />
              <Mail className="w-4 h-4 text-[#5C574F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="gov-login-password"
              className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
            >
              Sovereign GOV Password
            </label>
            <div className="relative">
              <input
                id="gov-login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Your sovereign passkey"
                required
                className="w-full px-4 py-3.5 pl-10 pr-10 rounded-xl text-sm font-mono text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-2 focus:ring-[#3368A0]/10 focus:outline-none transition-all placeholder:text-[#5C574F]/40 shadow-inner"
              />
              <KeyRound className="w-4 h-4 text-[#5C574F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C574F] hover:text-[#1E3A5F] p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-xs bg-[#B5482E]/10 border border-[#B5482E]/25 text-[#B5482E]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="group w-full py-3.5 px-5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md mt-2"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 70%, #2A588B 100%)',
            }}
            id="gov-login-submit-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials…</span>
              </>
            ) : (
              <>
                <span>Sign In to Sovereign Portals</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="gov-otp-email"
              className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
            >
              Registered Email Address
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="gov-otp-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="citizen@domain.com"
                  required
                  className="w-full px-4 py-3.5 pl-10 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-2 focus:ring-[#3368A0]/10 focus:outline-none transition-all placeholder:text-[#5C574F]/40 shadow-inner"
                />
                <Mail className="w-4 h-4 text-[#5C574F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading || !email.includes('@')}
                className="px-4 py-3 rounded-xl bg-[#1E3A5F] text-white text-xs font-mono font-semibold hover:bg-[#3368A0] disabled:opacity-50 transition-all shrink-0"
              >
                {otpSent ? 'Resend' : 'Send Code'}
              </button>
            </div>
          </div>

          {/* OTP Input (Shown once sent) */}
          {otpSent && (
            <div>
              <label
                htmlFor="gov-otp-code-input"
                className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
              >
                6-Digit Login Passcode
              </label>
              <input
                id="gov-otp-code-input"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  if (error) setError(null);
                }}
                placeholder="123456"
                required
                className="w-full px-4 py-3.5 text-center font-mono text-xl tracking-widest font-bold text-[#1E3A5F] bg-white border border-[#3368A0]/25 rounded-xl focus:border-[#1E3A5F] outline-none"
              />

              {devOtp && (
                <div className="mt-2 p-2.5 rounded-lg bg-[#A8742A]/10 border border-[#A8742A]/20 flex items-center justify-between text-xs font-mono text-[#5C574F]">
                  <span>Code: <strong className="text-[#1E3A5F]">{devOtp}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(devOtp)}
                    className="text-[11px] text-[#3368A0] bg-white px-2 py-0.5 rounded border border-[#3368A0]/20"
                  >
                    Auto-fill
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-xs bg-[#B5482E]/10 border border-[#B5482E]/25 text-[#B5482E]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading || !otpSent}
            className="group w-full py-3.5 px-5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md mt-2"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 70%, #2A588B 100%)',
            }}
            id="gov-otp-login-submit-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Passcode…</span>
              </>
            ) : (
              <>
                <span>Verify &amp; Enter Portals</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
