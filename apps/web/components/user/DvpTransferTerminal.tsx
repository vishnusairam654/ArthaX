'use client';

import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  ShieldAlert, 
  CheckCircle2, 
  BadgeCheck, 
  Fingerprint, 
  Lock, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';

interface DvpTransferTerminalProps {
  isMasked: boolean;
  onSuccessfulTransfer?: (amount: number) => void;
}

export const DvpTransferTerminal: React.FC<DvpTransferTerminalProps> = ({ 
  isMasked,
  onSuccessfulTransfer 
}) => {
  const [transferAmount, setTransferAmount] = useState<string>('12,500.00');
  const [finPin, setFinPin] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'signing' | 'settled'>('idle');
  const [txReceipt, setTxReceipt] = useState<string | null>(null);

  const availableBalance = 185420.00;

  const handlePercentage = (pct: number) => {
    const val = (availableBalance * pct).toFixed(2);
    setTransferAmount(val);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'signing') return;

    setStatus('signing');
    setTimeout(() => {
      setStatus('settled');
      const hash = `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`;
      setTxReceipt(hash);
      if (onSuccessfulTransfer) {
        onSuccessfulTransfer(parseFloat(transferAmount.replace(/,/g, '')) || 12500);
      }
      setFinPin('');
      setTimeout(() => {
        setStatus('idle');
      }, 6000);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 space-y-6" id="transfer-terminal">
      {/* Panel Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#022448]">
              DvP &amp; Inter-Bank Clearing Terminal
            </h2>
          </div>
          <p className="font-sans text-xs text-[#43474E]">
            High-value real-time gross settlement backed by sovereign CLS protocol.
          </p>
        </div>

        <span className="px-3 py-1 bg-[#DBE1FF] text-[#031847] rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 shrink-0">
          <Lock className="w-3.5 h-3.5 text-[#1E3A5F]" />
          pacs.008 Core
        </span>
      </div>

      {/* Interactive Form */}
      <form onSubmit={handleBroadcast} className="space-y-5">
        {/* Source & Recipient Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Account */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-medium text-[#43474E] block">
              Source Institutional Account
            </label>
            <div className="flex items-center justify-between bg-[#F8F9FF] border border-[#74777F]/20 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#022448] flex items-center justify-center text-white text-xs font-bold font-mono shadow-xs">
                  N
                </div>
                <div>
                  <span className="font-sans text-xs font-semibold text-[#121C28] block leading-tight">
                    NAVA Bank Primary
                  </span>
                  <span className="font-mono text-[10px] text-[#74777F]">
                    #001-NAVA-9904
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-[#43474E] inline-flex items-baseline gap-1">
                Avail: <AnimatedMaskedValue value="185,420" isMasked={isMasked} maskString="••••••" /> ARTH
              </span>
            </div>
          </div>

          {/* Recipient Citizen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-sans text-xs font-medium text-[#43474E]">
                Recipient Resident Citizen / GOV ID
              </label>
              <span className="font-sans text-[11px] text-[#10B981] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Citizen
              </span>
            </div>
            <div className="flex items-center bg-[#F8F9FF] border border-[#74777F]/20 px-4 py-3 rounded-xl gap-2.5">
              <BadgeCheck className="w-4 h-4 text-[#A8742A]" />
              <input
                type="text"
                readOnly
                value="#7102-491-VA (Aurelius Vane)"
                className="w-full bg-transparent font-mono text-xs text-[#121C28] font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Transfer Amount and Quick Multipliers */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-[#43474E] block">
            Transfer Amount (ARTH)
          </label>
          <div className="flex items-center bg-[#F8F9FF] border border-[#74777F]/20 px-4 py-2.5 rounded-xl justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <span className="font-serif text-xl font-bold text-[#1E3A5F]">₳</span>
              <input
                type="text"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full bg-transparent font-mono text-lg font-bold text-[#121C28] focus:outline-none"
                placeholder="0.00"
              />
            </div>

            {/* Quick Multipliers */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handlePercentage(0.25)}
                className="px-2.5 py-1 rounded-full bg-[#E5EFFF] hover:bg-[#DBE1FF] text-[#121C28] font-mono text-xs font-medium transition"
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handlePercentage(0.50)}
                className="px-2.5 py-1 rounded-full bg-[#E5EFFF] hover:bg-[#DBE1FF] text-[#121C28] font-mono text-xs font-medium transition"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handlePercentage(1.0)}
                className="px-2.5 py-1 rounded-full bg-[#E5EFFF] hover:bg-[#DBE1FF] text-[#121C28] font-mono text-xs font-medium transition"
              >
                Max
              </button>
            </div>
          </div>
        </div>

        {/* Step-Up Dual Auth Box (Isolated Enclave Visual Treatment per Rule 16 & 17) */}
        <div className="bg-[#FDF8F0] border border-[#DFB87A]/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#A8742A]" />
              <span className="font-sans text-xs font-bold text-[#361F00] uppercase tracking-wider">
                Step-Up Financial Authorization
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#DFB87A]/60 text-[#A8742A] font-mono text-[10px] font-semibold">
              FIPS 140-3 Level 4 HSM
            </span>
          </div>

          <p className="font-sans text-xs text-[#533300]/80">
            Enter citizen enclave PIN to sign zero-divergence DvP execution packet. Financial PIN values are zeroized in memory immediately after signature.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            {/* 6-dot secure input */}
            <div className="relative flex items-center justify-center bg-white border border-[#DFB87A] px-4 py-2.5 rounded-full">
              <input
                type="password"
                maxLength={6}
                autoComplete="off"
                value={finPin}
                onChange={(e) => setFinPin(e.target.value)}
                placeholder="••••••"
                className="w-28 text-center tracking-[0.4em] font-mono text-base text-[#361F00] bg-transparent focus:outline-none placeholder-[#DFB87A]"
              />
            </div>

            {/* Broadcast CTA */}
            <button
              type="submit"
              disabled={status === 'signing'}
              className="flex-1 h-11 px-6 bg-[#022448] hover:bg-[#1E3A5F] text-white rounded-full font-sans text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 active:scale-95"
            >
              {status === 'signing' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#A8742A]" />
                  <span>Signing &amp; Clearing DvP Epoch...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-[#A8742A]" />
                  <span>Sign &amp; Broadcast via CLS Rail</span>
                </>
              )}
            </button>
          </div>

          {/* Success settlement message */}
          {status === 'settled' && (
            <div className="p-3 bg-[#A8F5BF]/40 border border-[#10B981]/50 rounded-xl flex items-center justify-between text-xs font-mono text-[#002110] animate-fadeIn">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ATOMIC DVP CLEARED: {transferAmount} ARTH
              </span>
              <span className="text-[#10B981]">{txReceipt} (T+0 Final)</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
