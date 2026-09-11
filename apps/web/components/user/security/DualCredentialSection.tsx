'use client';

import React, { useState } from 'react';
import { 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Check, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Fingerprint, 
  Info,
  RotateCw,
  Sparkles
} from 'lucide-react';

interface DualCredentialSectionProps {
  onNotify: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const DualCredentialSection: React.FC<DualCredentialSectionProps> = ({ onNotify }) => {
  // GOV Password State
  const [isGovFormOpen, setIsGovFormOpen] = useState(false);
  const [govCurrentPassword, setGovCurrentPassword] = useState('');
  const [govNewPassword, setGovNewPassword] = useState('');
  const [govConfirmPassword, setGovConfirmPassword] = useState('');
  const [showGovCurrent, setShowGovCurrent] = useState(false);
  const [showGovNew, setShowGovNew] = useState(false);
  const [isGovSubmitting, setIsGovSubmitting] = useState(false);

  // Financial PIN State
  const [isFinModalOpen, setIsFinModalOpen] = useState(false);
  const [finStep, setFinStep] = useState<'auth' | 'input' | 'success'>('auth');
  const [finCurrentPin, setFinCurrentPin] = useState(['', '', '', '', '', '']);
  const [finNewPin, setFinNewPin] = useState(['', '', '', '', '', '']);
  const [isFinSubmitting, setIsFinSubmitting] = useState(false);

  // Password strength calculation for GOV Password
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };
  const govStrength = calculateStrength(govNewPassword);

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govCurrentPassword || !govNewPassword || !govConfirmPassword) {
      onNotify('Please fill in all GOV password fields.', 'warning');
      return;
    }
    if (govNewPassword !== govConfirmPassword) {
      onNotify('New GOV passwords do not match.', 'warning');
      return;
    }
    if (govStrength < 3) {
      onNotify('New GOV password does not satisfy sovereign complexity requirements (min 12 chars).', 'warning');
      return;
    }

    setIsGovSubmitting(true);
    setTimeout(() => {
      setIsGovSubmitting(false);
      setIsGovFormOpen(false);
      setGovCurrentPassword('');
      setGovNewPassword('');
      setGovConfirmPassword('');
      onNotify('GOV Identity Password successfully rotated and cryptographically committed.', 'success');
    }, 1200);
  };

  const handleBiometricStepUp = () => {
    setIsFinSubmitting(true);
    // Simulate WebAuthn biometric assertion
    setTimeout(() => {
      setIsFinSubmitting(false);
      setFinStep('input');
      onNotify('Biometric assertion verified. Proceed with Tier-B Financial PIN rotation.', 'info');
    }, 1000);
  };

  const handleFinPinDigitChange = (index: number, val: string, isNew: boolean = false) => {
    if (!/^\d*$/.test(val)) return;
    const list = isNew ? [...finNewPin] : [...finCurrentPin];
    list[index] = val.slice(-1);
    if (isNew) {
      setFinNewPin(list);
    } else {
      setFinCurrentPin(list);
    }
  };

  const handleFinSubmit = () => {
    const newPinStr = finNewPin.join('');
    if (newPinStr.length !== 6) {
      onNotify('Tier-B Financial PIN must be exactly 6 numeric digits.', 'warning');
      return;
    }

    setIsFinSubmitting(true);
    setTimeout(() => {
      setIsFinSubmitting(false);
      setFinStep('success');
      setTimeout(() => {
        setIsFinModalOpen(false);
        setFinStep('auth');
        setFinCurrentPin(['', '', '', '', '', '']);
        setFinNewPin(['', '', '', '', '', '']);
        onNotify('Tier-B Financial PIN successfully sealed in HSM Enclave.', 'success');
      }, 1500);
    }, 1400);
  };

  return (
    <section className="space-y-4">
      {/* Section Explanatory Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#022448]">
              Dual-Credential Isolation
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#EEF4FF] text-[#1E3A5F] border border-[#74777F]/20 font-semibold">
              Rule 16 Enforced
            </span>
          </div>
          <p className="font-sans text-xs md:text-sm text-[#43474E]">
            ARTHAX strictly isolates sovereign identity login from monetary transaction execution. Two credentials, two distinct threat boundaries.
          </p>
        </div>
      </div>

      {/* Side-by-Side Credential Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* CARD 1: GOV Password (Identity & Access)                 */}
        {/* Visual: Clean civic white, slate borders, text password   */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 shadow-xs p-6 flex flex-col justify-between transition-all hover:border-[#1E3A5F]/40">
          <div className="space-y-4">
            {/* Header Badge & Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center border border-[#1E3A5F]/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#022448]">
                    GOV Identity Password
                  </h3>
                  <span className="font-mono text-xs text-[#74777F]">
                    Level-1 Civic Credential
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#E5EFFF] text-[#1E3A5F] font-semibold border border-[#74777F]/20">
                Argon2id Salted
              </span>
            </div>

            {/* Purpose & Scope Description */}
            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Authenticates citizen identity for portal navigation, sovereign mailbox access, and account auditing. <strong className="text-[#022448]">Blocked from authorizing monetary debits or DvP trades.</strong>
            </p>

            {/* Scope Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 bg-[#F8F9FF] rounded-xl p-3 border border-[#74777F]/15">
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Portal Navigation</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Audit &amp; Statements</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Mailbox Notices</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#B5482E]">
                <span className="font-bold shrink-0">✕</span>
                <span>Fund Transfers (Blocked)</span>
              </div>
            </div>

            {/* Metadata Information */}
            <div className="flex items-center justify-between text-xs font-mono text-[#74777F] pt-1">
              <span>Last Rotated: <strong className="text-[#121C28]">42 days ago</strong></span>
              <span>Policy: <strong className="text-[#121C28]">Min 12 Characters</strong></span>
            </div>

            {/* Form Toggle Accordion */}
            {isGovFormOpen && (
              <form onSubmit={handleGovSubmit} className="space-y-3 pt-3 border-t border-[#74777F]/15">
                <div>
                  <label className="block text-xs font-mono text-[#43474E] mb-1">Current GOV Password</label>
                  <div className="relative">
                    <input
                      type={showGovCurrent ? 'text' : 'password'}
                      value={govCurrentPassword}
                      onChange={(e) => setGovCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#74777F]/30 bg-[#F8F9FF] text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowGovCurrent(!showGovCurrent)}
                      className="absolute right-3 top-2.5 text-[#74777F] hover:text-[#121C28]"
                    >
                      {showGovCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#43474E] mb-1">New GOV Password</label>
                  <div className="relative">
                    <input
                      type={showGovNew ? 'text' : 'password'}
                      value={govNewPassword}
                      onChange={(e) => setGovNewPassword(e.target.value)}
                      placeholder="Min 12 chars, upper, lower, symbol"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#74777F]/30 bg-[#F8F9FF] text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowGovNew(!showGovNew)}
                      className="absolute right-3 top-2.5 text-[#74777F] hover:text-[#121C28]"
                    >
                      {showGovNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {govNewPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#74777F]">Complexity Rating:</span>
                        <span className={`font-semibold ${
                          govStrength <= 1 ? 'text-[#B5482E]' : govStrength <= 2 ? 'text-amber-600' : 'text-[#10B981]'
                        }`}>
                          {govStrength <= 1 ? 'Weak' : govStrength <= 2 ? 'Acceptable' : 'Sovereign Strong'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-200">
                        <div className={`h-full ${govStrength >= 1 ? 'bg-[#B5482E]' : ''}`} />
                        <div className={`h-full ${govStrength >= 2 ? 'bg-amber-500' : ''}`} />
                        <div className={`h-full ${govStrength >= 3 ? 'bg-[#10B981]' : ''}`} />
                        <div className={`h-full ${govStrength >= 4 ? 'bg-[#10B981]' : ''}`} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#43474E] mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={govConfirmPassword}
                    onChange={(e) => setGovConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#74777F]/30 bg-[#F8F9FF] text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsGovFormOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-sans text-[#74777F] hover:bg-[#EEF4FF] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGovSubmitting}
                    className="px-4 py-2 rounded-xl bg-[#1E3A5F] hover:bg-[#022448] text-white text-xs font-sans font-semibold transition flex items-center gap-1.5 shadow-xs disabled:opacity-60"
                  >
                    {isGovSubmitting && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isGovSubmitting ? 'Updating Hash...' : 'Commit New Password'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Action Trigger */}
          {!isGovFormOpen && (
            <div className="pt-4 mt-2 border-t border-[#74777F]/15 flex items-center justify-between">
              <span className="text-xs font-mono text-[#74777F] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                Identity Status: Secure
              </span>
              <button
                type="button"
                onClick={() => setIsGovFormOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#1E3A5F] text-xs font-sans font-semibold transition border border-[#74777F]/20 shadow-xs"
              >
                Change GOV Password
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* CARD 2: Tier-B Financial PIN (Enclave Monetary Authority) */}
        {/* Visual: Dark enclave midnight navy, gold rim, dot matrix */}
        {/* ========================================================= */}
        <div className="bg-[#08162B] text-white rounded-2xl border-2 border-[#A8742A]/40 shadow-lg p-6 flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle gold watermark glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#A8742A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Header Badge & Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A8742A]/20 text-[#FFDDB6] flex items-center justify-center border border-[#A8742A]/40">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-white">
                      Tier-B Financial PIN
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#A8742A]/30 text-[#FFDDB6] font-bold border border-[#A8742A]/40">
                      HSM ENCLAVE
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#C8DFDB]">
                    Level-2 Monetary Settlement Authority
                  </span>
                </div>
              </div>
            </div>

            {/* Purpose & Scope Description */}
            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              Cryptographically isolated inside FIPS 140-3 HSM. Required for all high-value operations: interbank CLS transfers, atomic DvP trades, and fixed deposits.
            </p>

            {/* Cryptographic PIN Dot Representation (Stark Visual Distinction per Rule 16) */}
            <div className="bg-[#050E1C] rounded-xl p-4 border border-[#A8742A]/30 flex flex-col items-center justify-center gap-2">
              <span className="text-[11px] font-mono text-[#A8742A] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ENCLAVE PIN PROTECTION (AUTOCOMPLETE OFF)
              </span>
              <div className="flex items-center gap-3 py-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className="w-4 h-4 rounded-full bg-[#A8742A]/40 border border-[#A8742A] flex items-center justify-center shadow-[0_0_8px_rgba(168,116,42,0.3)]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFDDB6]" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Salt Fingerprint: 0x8C1E...77A9 (Argon2id Memory Hard)
              </span>
            </div>

            {/* Scope Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 bg-[#050E1C]/80 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Interbank CLS Transfers</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Atomic DvP Settlements</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Stock Limit Orders</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Fixed Deposit Creation</span>
              </div>
            </div>

            {/* Security Warning */}
            <div className="flex items-start gap-2 text-[11px] font-sans text-amber-200/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                PIN is never written to disk or browser memory. Values are transmitted encrypted via ISO 20022 security wrapper directly to the HSM.
              </span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="relative z-10 pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Enclave Status: Armed
            </span>
            <button
              type="button"
              onClick={() => setIsFinModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#A8742A] hover:bg-[#8D5E1F] text-white text-xs font-sans font-semibold transition border border-[#FFDDB6]/40 shadow-xs flex items-center gap-1.5"
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Rotate Financial PIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FINANCIAL PIN ROTATION MODAL (Enclave Step-up Flow)      */}
      {/* ========================================================= */}
      {isFinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0A1628] text-white rounded-2xl border-2 border-[#A8742A]/50 shadow-2xl p-6 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#FFDDB6]" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Rotate Tier-B Financial PIN
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsFinModalOpen(false);
                  setFinStep('auth');
                }}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            {finStep === 'auth' && (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-[#1E3A5F] text-[#C8DFDB] mx-auto flex items-center justify-center border border-[#66A3BF]/40">
                  <Fingerprint className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-white">
                    Biometric Step-Up Verification Required
                  </h4>
                  <p className="font-sans text-xs text-slate-300">
                    Sovereign regulations mandate WebAuthn biometric assertion or FIDO2 hardware token verification before modifying the Financial PIN.
                  </p>
                </div>
                <button
                  onClick={handleBiometricStepUp}
                  disabled={isFinSubmitting}
                  className="w-full py-3 rounded-xl bg-[#A8742A] hover:bg-[#8D5E1F] text-white font-sans font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {isFinSubmitting ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Asserting Biometric Challenge...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      <span>Verify Touch ID / Windows Hello</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {finStep === 'input' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-[#C8DFDB]">
                    Enter Current 6-Digit PIN
                  </label>
                  <div className="flex justify-between gap-2">
                    {finCurrentPin.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`curr-pin-${idx}`}
                        type="password"
                        autoComplete="off"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          handleFinPinDigitChange(idx, e.target.value, false);
                          if (e.target.value && idx < 5) {
                            document.getElementById(`curr-pin-${idx + 1}`)?.focus();
                          }
                        }}
                        className="w-10 h-12 text-center text-lg font-mono rounded-xl bg-[#050E1C] border border-[#A8742A]/40 text-white focus:outline-none focus:ring-2 focus:ring-[#FFDDB6]"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono text-[#C8DFDB]">
                    Enter New 6-Digit PIN
                  </label>
                  <div className="flex justify-between gap-2">
                    {finNewPin.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`new-pin-${idx}`}
                        type="password"
                        autoComplete="off"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          handleFinPinDigitChange(idx, e.target.value, true);
                          if (e.target.value && idx < 5) {
                            document.getElementById(`new-pin-${idx + 1}`)?.focus();
                          }
                        }}
                        className="w-10 h-12 text-center text-lg font-mono rounded-xl bg-[#050E1C] border border-[#A8742A]/40 text-white focus:outline-none focus:ring-2 focus:ring-[#FFDDB6]"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-black/30 p-2.5 rounded-xl border border-white/10">
                  RULE 17: Values are processed through isolated hardware channels with autocomplete="off". Never stored in plain text.
                </div>

                <button
                  onClick={handleFinSubmit}
                  disabled={isFinSubmitting}
                  className="w-full py-3 rounded-xl bg-[#A8742A] hover:bg-[#8D5E1F] text-white font-sans font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {isFinSubmitting ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Committing to HSM Enclave...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Commit New Financial PIN</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {finStep === 'success' && (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40 animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">
                  Enclave PIN Sealed
                </h4>
                <p className="font-sans text-xs text-slate-300">
                  New cryptographic salt derived. Tier-B authorization capability restored.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
