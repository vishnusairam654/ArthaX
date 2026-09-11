'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  Ban, 
  CheckCircle2, 
  RotateCw, 
  X,
  PhoneCall,
  KeyRound
} from 'lucide-react';

interface EmergencyKillswitchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isStasisActive: boolean;
  onToggleStasis: (active: boolean) => void;
  onNotify: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const EmergencyKillswitchDrawer: React.FC<EmergencyKillswitchDrawerProps> = ({
  isOpen,
  onClose,
  isStasisActive,
  onToggleStasis,
  onNotify
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [agreeTerms1, setAgreeTerms1] = useState(false);
  const [agreeTerms2, setAgreeTerms2] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isFormValid = confirmText === 'FREEZE ACCOUNT' && agreeTerms1 && agreeTerms2;

  const handleEngageFreeze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onToggleStasis(true);
      onClose();
      onNotify('EMERGENCY STASIS ENGAGED. All outbound settlement debits blocked. Open orders cancelled.', 'warning');
    }, 1500);
  };

  const handleDisengageFreeze = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onToggleStasis(false);
      onClose();
      setConfirmText('');
      setAgreeTerms1(false);
      setAgreeTerms2(false);
      onNotify('Protective stasis disengaged. Normal transaction capability restored.', 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl border-2 border-[#B5482E]/40 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#B5482E] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg md:text-xl font-bold">
                {isStasisActive ? 'Account in Protective Stasis' : 'Emergency Sovereign Killswitch'}
              </h3>
              <span className="font-mono text-xs text-[#FFDAD6]">
                Terracotta Protocol • Zero Outbound Movement
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {isStasisActive ? (
            /* Active Stasis State */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#B5482E]/10 text-[#B5482E] mx-auto flex items-center justify-center border border-[#B5482E]/30">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl font-bold text-[#121C28]">
                  Protective Account Lockdown is Active
                </h4>
                <p className="font-sans text-xs text-[#43474E] max-w-md mx-auto leading-relaxed">
                  All interbank debits, DvP order executions, and remote session authentications remain cryptographically blocked. Balances are held safe.
                </p>
              </div>

              <div className="p-4 bg-[#F8F9FF] rounded-2xl border border-[#74777F]/15 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#74777F]">Status:</span>
                  <strong className="text-[#B5482E]">PROTECTIVE_STASIS_ACTIVE</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#74777F]">Frozen Rails:</span>
                  <strong className="text-[#121C28]">CLS, DvP, pacs.008, ATM</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#74777F]">Deposit Acceptance:</span>
                  <strong className="text-emerald-700">Inbound Allowed (Locked)</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDisengageFreeze}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1E3A5F] hover:bg-[#022448] text-white font-sans font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {isProcessing ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? 'Verifying...' : 'Disengage Stasis (Authenticate)'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Engage Killswitch Form */
            <form onSubmit={handleEngageFreeze} className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#FFDAD6]/40 border border-[#B5482E]/20 text-xs font-sans text-[#410002] space-y-2">
                <div className="font-bold font-serif text-sm text-[#93000a] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
                  What happens when you engage Emergency Stasis?
                </div>
                <ul className="list-disc list-inside space-y-1 text-[#410002]/90 leading-relaxed font-sans">
                  <li>Immediately blocks all outbound fund transfers from all connected commercial banks.</li>
                  <li>Cancels all open stock market buy/sell limit orders in the SETU clearing house.</li>
                  <li>Revokes session tokens on all remote devices except this verified terminal.</li>
                  <li>Requires biometric challenge or in-person sovereign verification to unlock.</li>
                </ul>
              </div>

              {/* Checkbox 1 */}
              <label className="flex items-start gap-3 cursor-pointer text-xs font-sans text-[#43474E]">
                <input
                  type="checkbox"
                  checked={agreeTerms1}
                  onChange={(e) => setAgreeTerms1(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#B5482E] focus:ring-[#B5482E]"
                />
                <span>
                  I confirm that I suspect active unauthorized key derivation, stolen credentials, or device compromise.
                </span>
              </label>

              {/* Checkbox 2 */}
              <label className="flex items-start gap-3 cursor-pointer text-xs font-sans text-[#43474E]">
                <input
                  type="checkbox"
                  checked={agreeTerms2}
                  onChange={(e) => setAgreeTerms2(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#B5482E] focus:ring-[#B5482E]"
                />
                <span>
                  I understand that outgoing payments will be immediately rejected and unfreezing may require dual-factor re-attestation.
                </span>
              </label>

              {/* Type Confirmation */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-mono text-[#43474E]">
                  To confirm, type <span className="font-bold text-[#B5482E]">FREEZE ACCOUNT</span> below:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="FREEZE ACCOUNT"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#B5482E]/30 bg-[#F8F9FF] text-xs font-mono text-[#121C28] uppercase focus:outline-none focus:ring-2 focus:ring-[#B5482E]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#74777F]/15">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-sans text-[#74777F] hover:bg-[#EEF4FF] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-[#B5482E] hover:bg-[#93000a] text-white text-xs font-sans font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Freezing Settlement Rails...</span>
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4" />
                      <span>Engage Protective Stasis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
