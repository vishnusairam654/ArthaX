'use client';

import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Building2,
  Lock,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Gift,
  Coins,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface CitizenDetailsFormData {
  fullName: string;
  profession: string;
  primaryPurpose: string;
  preferredBankId: string;
  govPassword: string;
  financialPassword: string;
}

interface GovDetailsStepProps {
  email: string;
  onSubmit: (data: CitizenDetailsFormData) => Promise<void> | void;
  onBack: () => void;
}

const PROFESSIONS = [
  'Software Engineer / Tech Specialist',
  'Financial Analyst / Asset Manager',
  'Business Owner / Commercial Merchant',
  'Physician / Healthcare Professional',
  'Engineer / Technical Consultant',
  'Academic / Research Scientist',
  'Creative Director / Designer',
  'Legal & Governance Officer',
  'Sovereign Citizen / Investor',
];

const BANKING_PURPOSES = [
  {
    id: 'nava',
    purposeName: 'Salary, Payroll & Living',
    bankName: 'NAVA Bank',
    badge: 'Master Rail',
    badgeColor: 'bg-[#A8F5BF]/70 text-[#002110]',
    description: 'Direct institutional payroll deposits & automated sovereign settlements.',
  },
  {
    id: 'samaya',
    purposeName: 'High-Yield Wealth & Term Vaults',
    bankName: 'SAMAYA Bank',
    badge: '6.85% APY',
    badgeColor: 'bg-[#FFDDB6] text-[#2A1800]',
    description: 'Compounding term deposits & long-term capital preservation.',
  },
  {
    id: 'setu',
    purposeName: 'Commercial Trade & Clearing',
    bankName: 'SETU Bank',
    badge: 'DvP Gateway',
    badgeColor: 'bg-[#DBE1FF] text-[#031847]',
    description: 'Bilateral inter-bank liquidity & cross-border merchant rails.',
  },
  {
    id: 'sthira',
    purposeName: 'Sovereign Custody & Escrow',
    bankName: 'STHIRA Bank',
    badge: 'HSM Vault',
    badgeColor: 'bg-[#DFE9FA] text-[#121C28]',
    description: 'Cold storage security & multi-party cryptographic escrow.',
  },
  {
    id: 'vayu',
    purposeName: 'Daily Liquidity & Micro-Payments',
    bankName: 'VAYU Bank',
    badge: 'Zero Minimum',
    badgeColor: 'bg-[#E0E2EC] text-[#43474E]',
    description: 'Instant zero-threshold micro-transactions and everyday spending.',
  },
];

export const GovDetailsStep: React.FC<GovDetailsStepProps> = ({
  email,
  onSubmit,
  onBack,
}) => {
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState(PROFESSIONS[0]);
  const [selectedPurpose, setSelectedPurpose] = useState(BANKING_PURPOSES[0]);
  const [govPassword, setGovPassword] = useState('');
  const [financialPassword, setFinancialPassword] = useState('');
  const [showGovPassword, setShowGovPassword] = useState(false);
  const [showFinancialPassword, setShowFinancialPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please provide your full citizen legal name.');
      return;
    }
    if (govPassword.length < 10) {
      setError('GOV Password must be at least 10 characters with upper, lower, digit, and symbol.');
      return;
    }
    if (financialPassword.length < 8) {
      setError('Financial Password must be at least 8 characters with at least one digit and symbol.');
      return;
    }
    if (govPassword === financialPassword) {
      setError('GOV Password and Financial Password must be different credentials for security isolation.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await onSubmit({
        fullName: fullName.trim(),
        profession,
        primaryPurpose: selectedPurpose.purposeName,
        preferredBankId: selectedPurpose.id,
        govPassword,
        financialPassword,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to complete sovereign registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Back Navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C574F] hover:text-[#1E3A5F] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to OTP Verification</span>
      </button>

      {/* Step Header */}
      <div className="flex items-start gap-3.5 mb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 100%)',
          }}
        >
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8742A] bg-[#A8742A]/10 px-2 py-0.5 rounded-sm">
              Stage 3 of 3
            </span>
            <span className="text-[11px] font-mono text-[#5C574F]">Citizen Registry Profile</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A5F] leading-tight mt-1">
            Citizen Details &amp; Purpose
          </h2>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#5C574F] mb-5 pl-[58px]">
        Provide your official citizen identification details and select your founding banking purpose to claim your initial sovereign grant.
      </p>

      {/* 5,000 ARTH Bonus Callout Card */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#A8742A]/15 via-[#FAF8F5] to-[#A8742A]/10 border border-[#A8742A]/30 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A8742A] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#1E3A5F]">
                Sovereign Creation Bonus
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#A8742A] text-white font-mono text-[10px] font-bold">
                +5,000.00 ARTH
              </span>
            </div>
            <p className="text-[11px] text-[#5C574F] mt-0.5">
              Deposited immediately into your chosen founding bank vault upon account creation.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Legal Name */}
        <div>
          <label
            htmlFor="gov-fullname-input"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 text-[#262320]"
          >
            Full Legal Name
          </label>
          <div className="relative">
            <input
              id="gov-fullname-input"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Vikram Sharma"
              required
              autoFocus
              className="w-full px-4 py-3 pl-10 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-2 focus:ring-[#3368A0]/10 focus:outline-none transition-all placeholder:text-[#5C574F]/40 shadow-inner"
            />
            <User className="w-4 h-4 text-[#5C574F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Profession / Vocation */}
        <div>
          <label
            htmlFor="gov-profession-select"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5 text-[#262320]"
          >
            Profession / Economic Role
          </label>
          <div className="relative">
            <select
              id="gov-profession-select"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-2 focus:ring-[#3368A0]/10 focus:outline-none transition-all shadow-inner appearance-none cursor-pointer"
            >
              {PROFESSIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Briefcase className="w-4 h-4 text-[#5C574F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Primary Banking Purpose Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#262320]">
              Founding Bank &amp; Purpose
            </label>
            <span className="text-[11px] font-mono text-[#A8742A] font-semibold">
              Select 1 of 5 Chartered Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {BANKING_PURPOSES.map((item) => {
              const isSelected = selectedPurpose.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPurpose(item)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#EEF4FF] border-[#1E3A5F] ring-2 ring-[#1E3A5F]/15 shadow-xs'
                      : 'bg-white border-[#74777F]/20 hover:border-[#1E3A5F]/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="font-serif font-bold text-xs text-[#1E3A5F] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#3368A0]" />
                      {item.bankName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="font-sans text-xs font-semibold text-[#121C28] leading-tight mb-1">
                    {item.purposeName}
                  </p>
                  <p className="text-[10px] text-[#5C574F] leading-snug">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Password Credentials (Isolated per Rule 16) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* 1. GOV Password */}
          <div>
            <label
              htmlFor="gov-password-input"
              className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1 text-[#1E3A5F]"
            >
              GOV Password (Identity)
            </label>
            <div className="relative">
              <input
                id="gov-password-input"
                type={showGovPassword ? 'text' : 'password'}
                value={govPassword}
                onChange={(e) => {
                  setGovPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Min 10 chars (A-z, 0-9, !)"
                required
                className="w-full px-3.5 py-2.5 pl-9 pr-9 rounded-xl text-xs font-mono text-[#262320] bg-white border border-[#3368A0]/25 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 outline-none"
              />
              <Lock className="w-3.5 h-3.5 text-[#5C574F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowGovPassword(!showGovPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C574F] hover:text-[#1E3A5F]"
              >
                {showGovPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] text-[#5C574F] mt-1 block">
              For signing into portals and passport view.
            </span>
          </div>

          {/* 2. Financial Password (Distinct Gold Treatment per Rule 16) */}
          <div>
            <label
              htmlFor="financial-password-input"
              className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1 text-[#7A5217]"
            >
              Financial Password (Transfers)
            </label>
            <div className="relative">
              <input
                id="financial-password-input"
                type={showFinancialPassword ? 'text' : 'password'}
                value={financialPassword}
                onChange={(e) => {
                  setFinancialPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Min 8 chars (Digits + symbol)"
                required
                autoComplete="off"
                className="w-full px-3.5 py-2.5 pl-9 pr-9 rounded-xl text-xs font-mono text-[#262320] bg-[#FAF8F5] border-2 border-[#A8742A]/40 focus:border-[#A8742A] focus:ring-2 focus:ring-[#A8742A]/20 outline-none"
              />
              <KeyRound className="w-3.5 h-3.5 text-[#A8742A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowFinancialPassword(!showFinancialPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8742A] hover:text-[#7A5217]"
              >
                {showFinancialPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] text-[#7A5217] mt-1 block font-medium">
              Strictly isolated for money movements &amp; trades.
            </span>
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
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 60%, #A8742A 100%)',
          }}
          id="gov-submit-details-btn"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Minting GOV ID &amp; Provisioning Vault…</span>
            </>
          ) : (
            <>
              <span>Create Sovereign Identity &amp; Claim 5,000 ARTH</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
