'use client';

import React, { useState, useMemo } from 'react';
import {
  Coins,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  User,
} from 'lucide-react';

interface GovFinancialPasswordStepProps {
  onSubmit: (financialPassword: string, displayName?: string) => Promise<void> | void;
  onBack: () => void;
  defaultDisplayName?: string;
}

interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const REQUIREMENTS: PasswordRequirement[] = [
  { label: 'Minimum 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One numeric digit (0-9)', test: (pw) => /\d/.test(pw) },
  { label: 'One special symbol (!@#$...)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export const GovFinancialPasswordStep: React.FC<GovFinancialPasswordStepProps> = ({
  onSubmit,
  onBack,
  defaultDisplayName = '',
}) => {
  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [financialPassword, setFinancialPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metRequirements = useMemo(
    () => REQUIREMENTS.map((req) => ({ ...req, met: req.test(financialPassword) })),
    [financialPassword]
  );

  const allMet = metRequirements.every((r) => r.met);
  const passwordsMatch =
    financialPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allMet) {
      setError('Please satisfy all monetary security requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Financial passwords do not match. Please verify your input.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onSubmit(financialPassword, displayName.trim() || undefined);
    } catch (err: any) {
      setError(err.message || 'Failed to establish monetary credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C574F] hover:text-[#A8742A] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Identity Setup</span>
      </button>

      {/* Step Header: Distinct Gold / Vault Motif for Financial Authority */}
      <div className="flex items-start gap-3.5 mb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
          style={{
            background: 'linear-gradient(135deg, #7B5216 0%, #A8742A 100%)',
          }}
        >
          <Coins className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7B5216] bg-[#A8742A]/15 px-2 py-0.5 rounded-sm">
              Monetary Step-Up Authority
            </span>
            <span className="text-[11px] font-mono text-[#5C574F]">Dual Isolation</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#7B5216] leading-tight mt-1">
            Establish Financial Password
          </h2>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#5C574F] mb-5 pl-[58px]">
        Required for authorising ledger transfers, signing DvP transactions, and opening institutional accounts.
      </p>

      {/* Protocol Guarantee Note */}
      <div className="mb-5 p-3 rounded-xl bg-[#E9D9BE]/40 border border-[#A8742A]/30 flex items-start gap-2.5 text-xs text-[#5C574F]">
        <ShieldCheck className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#7B5216]">Cryptographic Isolation: </span>
          <span>
            This password is never accepted at portal sign-in and uses an independent Argon2id salt. It activates strictly for monetary transactions.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Citizen Display Name Input */}
        <div>
          <label
            htmlFor="citizen-display-name"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
          >
            Citizen Legal Display Name
          </label>
          <div className="relative">
            <input
              id="citizen-display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Sovereign Citizen"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#A8742A]/25 focus:border-[#A8742A] focus:ring-3 focus:ring-[#A8742A]/10 focus:outline-none transition-all shadow-inner"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C574F]">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Financial Password Input */}
        <div>
          <label
            htmlFor="financial-password-input"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#7B5216]"
          >
            Financial Authorization Password
          </label>
          <div className="relative">
            <input
              id="financial-password-input"
              type={showPassword ? 'text' : 'password'}
              value={financialPassword}
              onChange={(e) => {
                setFinancialPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Create monetary passkey"
              autoComplete="off"
              required
              autoFocus
              className="w-full px-4 py-3.5 pr-11 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#A8742A]/30 focus:border-[#A8742A] focus:ring-3 focus:ring-[#A8742A]/15 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#5C574F] hover:text-[#7B5216] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Financial Strength Checklist */}
        {financialPassword.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#E9D9BE]/25 border border-[#A8742A]/20 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#7B5216] font-semibold mb-1">
              Monetary Standard Requirements
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

        {/* Confirm Financial Password Input */}
        <div>
          <label
            htmlFor="financial-password-confirm"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#7B5216]"
          >
            Confirm Financial Password
          </label>
          <div className="relative">
            <input
              id="financial-password-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Re-enter monetary passkey"
              autoComplete="off"
              required
              className="w-full px-4 py-3.5 pr-11 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#A8742A]/30 focus:border-[#A8742A] focus:ring-3 focus:ring-[#A8742A]/15 focus:outline-none transition-all shadow-inner"
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#5C574F] hover:text-[#7B5216] transition-colors"
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
            background: 'linear-gradient(135deg, #7B5216 0%, #A8742A 70%, #90611E 100%)',
          }}
          id="gov-create-financial-password-btn"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Initializing Ledger Accounts…</span>
            </>
          ) : (
            <>
              <span>Activate Sovereign Treasury Profile</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
