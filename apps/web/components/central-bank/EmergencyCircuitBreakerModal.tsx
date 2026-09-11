'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  KeyRound,
  FileCheck2,
  X,
  Lock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface EmergencyCircuitBreakerModalProps {
  isOpen: boolean;
  isBreakerActive: boolean;
  onClose: () => void;
  onToggleBreaker: (reason: string, authCode: string) => void;
}

export const EmergencyCircuitBreakerModal: React.FC<EmergencyCircuitBreakerModalProps> = ({
  isOpen,
  isBreakerActive,
  onClose,
  onToggleBreaker,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [statutoryReason, setStatutoryReason] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [statutoryChecked, setStatutoryChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProceedToAuth = () => {
    if (statutoryReason.trim().length < 15) {
      setErrorMsg('Mandatory statutory justification must be at least 15 characters long.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleExecute = () => {
    if (!statutoryChecked) {
      setErrorMsg('You must formally acknowledge personal sovereign liability.');
      return;
    }
    if (authCode.trim().length < 6) {
      setErrorMsg('Valid Governor elevated credential code required (min 6 characters).');
      return;
    }
    setErrorMsg(null);
    onToggleBreaker(statutoryReason, authCode);
    setStep(3);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setStatutoryReason('');
    setAuthCode('');
    setStatutoryChecked(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: [0, 0, 0, 1] }}
            className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-[#B5482E]/30 shadow-2xl overflow-hidden"
          >
            {/* Header Ribbon */}
            <div className="bg-[#B5482E] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/25">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/70 block">
                    STATUTORY SOVEREIGN PROTOCOL
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white leading-tight">
                    {isBreakerActive
                      ? 'Deactivate System Emergency Circuit Breaker'
                      : 'Activate System Emergency Circuit Breaker'}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleResetAndClose}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body with M3 Stepped Motion */}
            <div className="p-6 space-y-5 bg-[#FDFBF7]">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-[#B5482E]/30 text-[#B5482E] rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* STEP 1: Reason and Justification */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-amber-50 border border-[#A8742A]/25 rounded-2xl text-xs text-[#262320] space-y-1.5 leading-relaxed">
                      <div className="font-bold text-[#A8742A] flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Prudential Notice — Sovereign Charter Act 14
                      </div>
                      <p>
                        Engaging the Circuit Breaker suspends all non-critical inter-bank CLS settlements and halts equities trading. An immutable, broadcast alert will be immediately written to the append-only ledger audit trail.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold text-[#2A2012] uppercase">
                        Statutory Rationale for System Halt (Mandatory)
                      </label>
                      <textarea
                        value={statutoryReason}
                        onChange={(e) => setStatutoryReason(e.target.value)}
                        placeholder="Provide detailed statutory grounds (e.g., liquidity contagion, suspected cryptographic ledger breach, unscheduled systemic run)..."
                        rows={3}
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:border-[#B5482E] focus:ring-1 focus:ring-[#B5482E] focus:outline-hidden bg-white leading-relaxed font-sans"
                      />
                      <span className="text-[10px] text-[#74777F] font-mono block text-right">
                        {statutoryReason.length} characters (min 15)
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleResetAndClose}
                        className="px-4 py-2 text-xs font-medium text-[#74777F] hover:text-[#262320] active:scale-95 transition cursor-pointer"
                      >
                        Abort Action
                      </button>
                      <button
                        type="button"
                        onClick={handleProceedToAuth}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B5482E] hover:bg-[#9B3C25] text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
                      >
                        <span>Proceed to Governor Authorization</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Governor Authorization & Affirmation */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-red-50 border border-[#B5482E]/25 rounded-2xl text-xs text-[#262320] space-y-2">
                      <div className="font-bold text-[#B5482E] flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4" />
                        Executive Governor Affirmation Required
                      </div>
                      <p className="text-[11px] text-[#5C574F] leading-relaxed">
                        Reason Recorded:{' '}
                        <span className="italic font-medium text-[#262320]">
                          &ldquo;{statutoryReason}&rdquo;
                        </span>
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold text-[#2A2012] uppercase">
                        Elevated Governor Authorization Credential
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          autoComplete="off"
                          value={authCode}
                          onChange={(e) => setAuthCode(e.target.value)}
                          placeholder="Enter 6+ digit Sovereign Override Key..."
                          className="w-full text-xs p-3 pl-9 rounded-xl border border-gray-300 focus:border-[#B5482E] focus:ring-1 focus:ring-[#B5482E] focus:outline-hidden bg-white font-mono"
                        />
                        <Lock className="w-4 h-4 text-[#74777F] absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-[10px] text-[#74777F] font-mono">
                        Demo bypass credential: <span className="font-bold">GOV-SOVEREIGN-99</span>
                      </p>
                    </div>

                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={statutoryChecked}
                        onChange={(e) => setStatutoryChecked(e.target.checked)}
                        className="mt-0.5 rounded text-[#B5482E] focus:ring-[#B5482E]"
                      />
                      <span className="text-[11px] text-[#43474E] leading-snug">
                        I solemnly affirm that this directive is executed in strict accordance with the Sovereign Monetary Charter and will be logged under personal cryptographic accountability.
                      </span>
                    </label>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-3 py-2 text-xs font-medium text-[#74777F] hover:text-[#262320] active:scale-95 transition cursor-pointer"
                      >
                        Back to Justification
                      </button>
                      <button
                        type="button"
                        onClick={handleExecute}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B5482E] hover:bg-[#9B3C25] text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {isBreakerActive ? 'Confirm Deactivation' : 'Execute Emergency Halt'}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Execution Result Confirmation */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22, ease: [0, 0, 0, 1] }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#946726]">
                        {isBreakerActive ? 'Circuit Breaker Rescinded' : 'Emergency Halt Dispatched'}
                      </h4>
                      <p className="text-xs text-[#74777F] max-w-sm mx-auto mt-1">
                        The action has been committed to the immutable Core Ledger audit sequence under entry #AUD-2026-BREAKER-EXEC.
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-[#946726]/15 text-left font-mono text-[11px] text-[#262320] max-w-sm mx-auto space-y-1">
                      <div>Status: <span className="font-bold text-[#B5482E]">{isBreakerActive ? 'RESTRICTED CLEARING RESUMED' : 'HALT ACTIVE'}</span></div>
                      <div>Hash: <span className="text-[#946726]">0x7c4e...19b2</span></div>
                      <div>Broadcast: <span className="text-emerald-700">5 Banks & Exchange Notified</span></div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="px-6 py-2.5 rounded-full bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold active:scale-95 transition shadow-xs cursor-pointer"
                    >
                      Return to Security Console
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
