'use client';

import React, { useState, useMemo } from 'react';
import {
  Lock,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface GovPasswordStepProps {
  onCreatePassword: (password: string) => Promise<void> | void;
  onBack: () => void;
}

interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const REQUIREMENTS: PasswordRequirement[] = [
  { label: 'Minimum 10 characters', test: (pw) => pw.length >= 10 },
  { label: 'One uppercase letter (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One numeric digit (0-9)', test: (pw) => /\d/.test(pw) },
  { label: 'One special symbol (!@#$...)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export const GovPasswordStep: React.FC<GovPasswordStepProps> = ({
  onCreatePassword,
  onBack,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metRequirements = useMemo(
    () => REQUIREMENTS.map((req) => ({ ...req, met: req.test(password) })),
    [password]
  );

  const allMet = metRequirements.every((r) => r.met);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allMet) {
      setError('Please satisfy all password security requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match. Please verify your input.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onCreatePassword(password);
    } catch (err: any) {
      setError(err.message || 'Failed to establish sovereign password.');
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
        <span>Return to OTP</span>
      </button>

      {/* Step Header */}
      <div className="flex items-start gap-3.5 mb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 100%)',
          }}
        >
          <Lock className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8742A] bg-[#A8742A]/10 px-2 py-0.5 rounded-sm">
              Stage 3 of 3
            </span>
            <span className="text-[11px] font-mono text-[#5C574F]">Credentials</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A5F] leading-tight mt-1">
            Create GOV Password
          </h2>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#5C574F] mb-5 pl-[58px]">
        This password establishes your identity authority access.
      </p>

      {/* Dual Password Isolation Note */}
      <div className="mb-5 p-3 rounded-xl bg-[#E9D9BE]/30 border border-[#A8742A]/25 flex items-start gap-2.5 text-xs text-[#5C574F]">
        <ShieldAlert className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#1E3A5F]">Dual-Password Isolation: </span>
          <span>
            This GOV Password is for identity authentication only. A separate Financial Password is used for monetary actions.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Input */}
        <div>
          <label
            htmlFor="gov-password-input"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
          >
            New GOV Password
          </label>
          <div className="relative">
            <input
              id="gov-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Create strong passkey"
              autoComplete="new-password"
              required
              autoFocus
              className="w-full px-4 py-3.5 pr-11 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-3 focus:ring-[#3368A0]/10 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#5C574F] hover:text-[#1E3A5F] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Strength Checklist */}
        {password.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#C8DFDB]/20 border border-[#3368A0]/10 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#5C574F] font-semibold mb-1">
              Security Standard Checklist
            </div>
            {metRequirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: req.met ? '#287A55' : 'rgba(92, 87, 79, 0.15)',
                  }}
                >
                  {req.met && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span style={{ color: req.met ? '#287A55' : '#5C574F' }}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Confirm Password Input */}
        <div>
          <label
            htmlFor="gov-password-confirm"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
          >
            Confirm GOV Password
          </label>
          <div className="relative">
            <input
              id="gov-password-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Re-enter passkey"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3.5 pr-11 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-3 focus:ring-[#3368A0]/10 focus:outline-none transition-all shadow-inner"
              style={{
                borderColor:
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? '#287A55'
                      : '#B5482E'
                    : undefined,
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#5C574F] hover:text-[#1E3A5F] transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <span className="block text-[11px] font-mono mt-1.5 text-[#B5482E]">
              Passwords do not match
            </span>
          )}
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
          disabled={isLoading || !allMet || !passwordsMatch}
          className="group w-full py-3.5 px-5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md mt-2"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 70%, #2A588B 100%)',
          }}
          id="gov-create-password-btn"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating Sovereign GOV ID…</span>
            </>
          ) : (
            <>
              <span>Generate GOV ID</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
