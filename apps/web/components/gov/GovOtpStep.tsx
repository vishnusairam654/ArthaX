'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  KeyRound,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

interface GovOtpStepProps {
  email: string;
  onVerify: (code: string) => Promise<void> | void;
  onResendOtp?: () => Promise<void> | void;
  onBack: () => void;
  devCode?: string;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export const GovOtpStep: React.FC<GovOtpStepProps> = ({
  email,
  onVerify,
  onResendOtp,
  onBack,
  devCode,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [copiedDemo, setCopiedDemo] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, '').slice(-1);
      const newDigits = [...digits];
      newDigits[index] = digit;
      setDigits(newDigits);
      if (error) setError(null);
      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, error]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, OTP_LENGTH);
      if (!pasted) return;
      const newDigits = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);
      const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
    },
    [digits]
  );

  const autoFillCode = () => {
    if (!devCode) return;
    const chars = devCode.split('');
    setDigits(chars);
    setError(null);
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please input all 6 verification digits.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onVerify(code);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(RESEND_COOLDOWN);
    setDigits(Array(OTP_LENGTH).fill(''));
    if (onResendOtp) {
      try {
        await onResendOtp();
      } catch (err: any) {
        setError(err.message || 'Failed to resend code');
      }
    }
    inputRefs.current[0]?.focus();
  };

  // Mask email for display: first char + dots + domain
  const maskedEmail = (() => {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    return `${local[0]}${'•'.repeat(Math.min(local.length - 1, 4))}@${domain}`;
  })();

  return (
    <div>
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C574F] hover:text-[#1E3A5F] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Change Email</span>
      </button>

      {/* Step Header */}
      <div className="flex items-start gap-3.5 mb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
          style={{
            background: 'linear-gradient(135deg, #A8742A 0%, #7A5217 100%)',
          }}
        >
          <KeyRound className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8742A] bg-[#A8742A]/10 px-2 py-0.5 rounded-sm">
              Stage 2 of 3
            </span>
            <span className="text-[11px] font-mono text-[#5C574F]">Security Token</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A5F] leading-tight mt-1">
            Input One-Time Code
          </h2>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#5C574F] mb-6 pl-[58px]">
        We have transmitted a 6-digit cryptographic passcode to{' '}
        <span className="font-mono font-bold text-[#1E3A5F]">{maskedEmail}</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OTP Input Slots */}
        <div className="flex justify-between gap-1.5 sm:gap-2">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold text-[#1E3A5F] bg-white rounded-xl border border-[#3368A0]/25 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/15 outline-none transition-all shadow-2xs"
              autoComplete="one-time-code"
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        {/* Dev OTP Box if available */}
        {devCode && (
          <div className="p-3 rounded-xl bg-[#A8742A]/10 border border-[#A8742A]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A8742A] animate-pulse" />
              <span className="text-xs font-mono text-[#5C574F]">
                Verification Code: <strong className="text-[#1E3A5F]">{devCode}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={autoFillCode}
              className="text-[11px] font-mono text-[#3368A0] hover:text-[#1E3A5F] bg-white px-2 py-1 rounded-md border border-[#3368A0]/20 active:scale-95 transition-all"
            >
              {copiedDemo ? 'Filled ✓' : 'Auto-fill'}
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl text-xs bg-[#B5482E]/10 border border-[#B5482E]/25 text-[#B5482E]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dual Actions: Resend & Verify */}
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            disabled={resendCooldown > 0}
            onClick={handleResend}
            className="flex-1 py-3 px-3 rounded-2xl text-xs font-mono font-medium text-[#1E3A5F] bg-white hover:bg-[#3368A0]/5 border border-[#3368A0]/20 disabled:text-[#5C574F]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="group flex-[2] py-3.5 px-4 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 70%, #2A588B 100%)',
            }}
            id="gov-verify-otp-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Hash…</span>
              </>
            ) : (
              <>
                <span>Verify Token</span>
                <ShieldCheck className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
