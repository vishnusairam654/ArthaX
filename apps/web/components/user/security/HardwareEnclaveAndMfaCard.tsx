'use client';

import React, { useState } from 'react';
import { 
  Key, 
  Smartphone, 
  Shield, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Lock, 
  CheckCircle2, 
  RotateCw,
  ExternalLink,
  Download,
  AlertTriangle
} from 'lucide-react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';

interface HardwareEnclaveAndMfaCardProps {
  onNotify: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const MNEMONIC_WORDS = [
  'sovereign', 'ledger', 'merkle', 'monetary',
  'settlement', 'reserve', 'anchor', 'parity',
  'enclave', 'crypto', 'shield', 'civic',
  'stasis', 'oracle', 'protocol', 'depository',
  'atomic', 'vault', 'balance', 'zenith',
  'cert', 'matrix', 'beacon', 'sovereignty'
];

export const HardwareEnclaveAndMfaCard: React.FC<HardwareEnclaveAndMfaCardProps> = ({ onNotify }) => {
  const [isMnemonicRevealed, setIsMnemonicRevealed] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pinVerificationInput, setPinVerificationInput] = useState('');
  const [hasCopiedFingerprint, setHasCopiedFingerprint] = useState(false);
  const [isHardwareAttesting, setIsHardwareAttesting] = useState(false);
  const [isClockSyncing, setIsClockSyncing] = useState(false);

  const handleTestHardwareChallenge = () => {
    setIsHardwareAttesting(true);
    setTimeout(() => {
      setIsHardwareAttesting(false);
      onNotify('WebAuthn FIDO2 Challenge successful. ECDSA P-384 signature verified by HSM.', 'success');
    }, 1200);
  };

  const handleClockSync = () => {
    setIsClockSyncing(true);
    setTimeout(() => {
      setIsClockSyncing(false);
      onNotify('TOTP time skew recalibrated to Central Bank Atomic Clock (0.00ms drift).', 'success');
    }, 1000);
  };

  const handleConfirmReveal = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinVerificationInput.length < 6) {
      onNotify('Please enter your 6-digit Financial PIN.', 'warning');
      return;
    }
    setIsConfirmModalOpen(false);
    setIsMnemonicRevealed(true);
    setPinVerificationInput('');
    onNotify('Master Recovery Mnemonic revealed for 60 seconds.', 'info');

    // Auto re-mask after 60 seconds for security
    setTimeout(() => {
      setIsMnemonicRevealed(false);
    }, 60000);
  };

  const handleCopyFingerprint = () => {
    navigator.clipboard.writeText('SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
    setHasCopiedFingerprint(true);
    setTimeout(() => setHasCopiedFingerprint(false), 2000);
    onNotify('Root fingerprint copied to clipboard.', 'success');
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#022448]">
              Multi-Factor &amp; Hardware Enclave
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#E5EFFF] text-[#1E3A5F] border border-[#74777F]/20 font-semibold">
              FIDO2 / WebAuthn
            </span>
          </div>
          <p className="font-sans text-xs md:text-sm text-[#43474E]">
            Hardware security tokens, biometric authenticator engines, and masked cryptographic master recovery roots.
          </p>
        </div>
      </div>

      {/* Grid of MFA Mechanisms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Item 1: FIDO2 / WebAuthn Hardware Token */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#1E3A5F]/40 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center border border-[#1E3A5F]/20">
                <Key className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#A8F5BF]/60 text-[#002110] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                PRIMARY
              </span>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-[#022448]">
                FIDO2 Hardware Key &amp; Biometrics
              </h3>
              <p className="font-sans text-xs text-[#74777F] mt-0.5">
                Physical hardware token &amp; Apple Secure Enclave
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono bg-[#F8F9FF] p-3 rounded-xl border border-[#74777F]/15">
              <div className="flex items-center justify-between text-[#43474E]">
                <span>Registered Token:</span>
                <strong className="text-[#121C28]">YubiKey 5C NFC</strong>
              </div>
              <div className="flex items-center justify-between text-[#43474E]">
                <span>Biometric Node:</span>
                <strong className="text-[#121C28]">Touch ID / Hello</strong>
              </div>
              <div className="flex items-center justify-between text-[#43474E]">
                <span>Attestation:</span>
                <span className="text-[#10B981] font-semibold">ECDSA P-384</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#74777F]/15 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#74777F]">
              Last attested 4h ago
            </span>
            <button
              onClick={handleTestHardwareChallenge}
              disabled={isHardwareAttesting}
              className="px-3 py-1.5 rounded-xl bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#1E3A5F] text-xs font-sans font-semibold transition flex items-center gap-1 border border-[#74777F]/20 shadow-xs disabled:opacity-60"
            >
              {isHardwareAttesting ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{isHardwareAttesting ? 'Challenging...' : 'Test Challenge'}</span>
            </button>
          </div>
        </div>

        {/* Item 2: TOTP Mobile Authenticator */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#1E3A5F]/40 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center border border-[#1E3A5F]/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#E5EFFF] text-[#1E3A5F] font-semibold">
                BACKUP
              </span>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-[#022448]">
                TOTP Mobile Authenticator
              </h3>
              <p className="font-sans text-xs text-[#74777F] mt-0.5">
                RFC 6238 Time-based One-Time Passcode
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono bg-[#F8F9FF] p-3 rounded-xl border border-[#74777F]/15">
              <div className="flex items-center justify-between text-[#43474E]">
                <span>App Provider:</span>
                <strong className="text-[#121C28]">Google / Aegis / 1Pass</strong>
              </div>
              <div className="flex items-center justify-between text-[#43474E]">
                <span>Time Skew:</span>
                <strong className="text-[#10B981]">0.00s Synced</strong>
              </div>
              <div className="flex items-center justify-between text-[#43474E]">
                <span>Algorithm:</span>
                <strong className="text-[#121C28]">HMAC-SHA256 (6-digit)</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#74777F]/15 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#74777F]">
              Synced with NIST Clock
            </span>
            <button
              onClick={handleClockSync}
              disabled={isClockSyncing}
              className="px-3 py-1.5 rounded-xl bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#1E3A5F] text-xs font-sans font-semibold transition flex items-center gap-1 border border-[#74777F]/20 shadow-xs disabled:opacity-60"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isClockSyncing ? 'animate-spin' : ''}`} />
              <span>{isClockSyncing ? 'Syncing...' : 'Sync Clock'}</span>
            </button>
          </div>
        </div>

        {/* Item 3: Sovereign Master Recovery Root (Rule 15: Masked by Default) */}
        <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#1E3A5F]/40 transition-all md:col-span-2 lg:col-span-1">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#A8742A]/15 text-[#A8742A] flex items-center justify-center border border-[#A8742A]/30">
                <Shield className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#A8742A]/20 text-[#A8742A] font-bold border border-[#A8742A]/30">
                RECOVERY ROOT
              </span>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-[#022448]">
                Master Recovery Mnemonic
              </h3>
              <p className="font-sans text-xs text-[#74777F] mt-0.5">
                24-Word Cryptographic Root (Masked per Rule 15)
              </p>
            </div>

            {/* Masked status box */}
            <div className="p-3 bg-[#F8F9FF] rounded-xl border border-[#74777F]/15 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#43474E]">Identity Entropy:</span>
                <span className="text-[#10B981] font-semibold">256-bit Sealed</span>
              </div>
              <div className="text-xs font-mono text-[#74777F] truncate">
                Fingerprint:{' '}
                <AnimatedMaskedValue
                  value="0x7f83b1657ff1fc53b92dc181..."
                  isMasked={!isMnemonicRevealed}
                  className="text-[#1E3A5F] font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#74777F]/15 flex items-center justify-between">
            <button
              onClick={handleCopyFingerprint}
              className="text-[11px] font-mono text-[#1E3A5F] hover:underline flex items-center gap-1"
            >
              {hasCopiedFingerprint ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedFingerprint ? 'Copied' : 'Copy Hash'}</span>
            </button>

            {isMnemonicRevealed ? (
              <button
                onClick={() => setIsMnemonicRevealed(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#121C28] text-xs font-sans font-semibold transition flex items-center gap-1"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mask Words</span>
              </button>
            ) : (
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#A8742A] hover:bg-[#8D5E1F] text-white text-xs font-sans font-semibold transition flex items-center gap-1 shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal 24 Words</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Revealed Mnemonic Card (when activated) */}
      {isMnemonicRevealed && (
        <div className="bg-[#0A1628] text-white rounded-2xl border-2 border-[#A8742A]/40 p-6 space-y-4 animate-fade-in shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#FFDDB6]" />
              <div>
                <h3 className="font-serif text-base font-bold text-white">
                  Sovereign 24-Word Master Cryptographic Root
                </h3>
                <p className="font-mono text-xs text-amber-300">
                  ⚠️ Auto-masking in 60s. Never disclose these words to anyone.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMnemonicRevealed(false)}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-sans font-medium text-white transition self-start sm:self-auto"
            >
              Hide Immediately
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {MNEMONIC_WORDS.map((word, index) => (
              <div
                key={index}
                className="px-3 py-2 rounded-xl bg-[#050E1C] border border-white/10 text-xs font-mono flex items-center justify-between"
              >
                <span className="text-slate-500">{index + 1}.</span>
                <span className="text-[#FFDDB6] font-semibold">{word}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal to Reveal Mnemonic */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#74777F]/20 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#74777F]/15 pb-3">
              <div className="flex items-center gap-2 text-[#BA1A1A]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-[#121C28]">
                  Sovereign Seed Verification
                </h3>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-[#74777F] hover:text-[#121C28] text-xs font-mono"
              >
                ✕ Cancel
              </button>
            </div>

            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Revealing your master recovery seed exposes the sovereign root key of your identity and all multi-bank accounts. Ensure no cameras or shoulder surfers are present.
            </p>

            <form onSubmit={handleConfirmReveal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#43474E] mb-1">
                  Enter Tier-B Financial PIN to Authorize
                </label>
                <input
                  type="password"
                  autoComplete="off"
                  maxLength={6}
                  value={pinVerificationInput}
                  onChange={(e) => setPinVerificationInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#74777F]/30 bg-[#F8F9FF] text-center text-lg font-mono tracking-widest text-[#121C28] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-sans text-[#74777F] hover:bg-[#EEF4FF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1E3A5F] hover:bg-[#022448] text-white text-xs font-sans font-semibold shadow-xs"
                >
                  Confirm &amp; Reveal Words
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
