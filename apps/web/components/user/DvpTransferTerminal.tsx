'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowRightLeft, 
  ShieldAlert, 
  CheckCircle2, 
  BadgeCheck, 
  Fingerprint, 
  Lock, 
  RefreshCw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';
import { apiFetchUserAccounts, apiExecuteTransfer, dispatchPortalDataInvalidation } from '@/lib/api';
import { BankAccountDto } from '@arthax/types';

interface DvpTransferTerminalProps {
  isMasked: boolean;
  onSuccessfulTransfer?: (amount: number) => void;
}

export const DvpTransferTerminal: React.FC<DvpTransferTerminalProps> = ({ 
  isMasked,
  onSuccessfulTransfer 
}) => {
  const [accounts, setAccounts] = useState<BankAccountDto[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [destinationAccountNumber, setDestinationAccountNumber] = useState<string>('ARTH-NAVA-002');
  const [transferAmount, setTransferAmount] = useState<string>('500.00');
  const [finPin, setFinPin] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'signing' | 'settled'>('idle');
  const [txReceipt, setTxReceipt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      const data = await apiFetchUserAccounts();
      setAccounts(data);
      if (data.length > 0 && !selectedAccountId) {
        setSelectedAccountId(data[0].id);
      }
    } catch {
      // Fallback
    }
  }, [selectedAccountId]);

  useEffect(() => {
    loadAccounts();
    const handleInvalidation = () => {
      loadAccounts();
    };
    window.addEventListener('arthax_portal_data_invalidated', handleInvalidation);
    return () => {
      window.removeEventListener('arthax_portal_data_invalidated', handleInvalidation);
    };
  }, [loadAccounts]);

  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];
  const availableBalanceMinor = activeAccount ? BigInt(activeAccount.balanceMinor) : 0n;
  const availableBalance = Number(availableBalanceMinor) / 100;

  const handlePercentage = (pct: number) => {
    const val = (availableBalance * pct).toFixed(2);
    setTransferAmount(val);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'signing') return;
    if (!activeAccount) {
      setError('No active source account found.');
      return;
    }
    if (!finPin) {
      setError('Please enter your Financial Password for step-up authorization.');
      return;
    }

    const cleanAmount = parseFloat(transferAmount.replace(/,/g, ''));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    const amountMinor = (BigInt(Math.round(cleanAmount * 100))).toString();

    setError(null);
    setStatus('signing');

    try {
      const res = await apiExecuteTransfer({
        sourceAccountId: activeAccount.id,
        destinationAccountNumber: destinationAccountNumber.trim(),
        amountMinor,
        financialPassword: finPin,
        memo: 'DvP Real-time Gross Settlement',
      });

      setStatus('settled');
      setTxReceipt(res.transaction.id);
      setFinPin('');
      dispatchPortalDataInvalidation();

      if (onSuccessfulTransfer) {
        onSuccessfulTransfer(cleanAmount);
      }

      setTimeout(() => {
        setStatus('idle');
      }, 7000);
    } catch (err: any) {
      setError(err.message || 'Transfer failed. Check credentials and balance.');
      setStatus('idle');
    }
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

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-[#B5482E]/10 border border-[#B5482E]/25 text-[#B5482E] text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
                  {activeAccount?.bankId ? activeAccount.bankId.charAt(0).toUpperCase() : 'N'}
                </div>
                <div>
                  <span className="font-sans text-xs font-semibold text-[#121C28] block leading-tight">
                    {activeAccount?.bankId ? `${activeAccount.bankId.toUpperCase()} Bank` : 'NAVA Bank Primary'}
                  </span>
                  <span className="font-mono text-[10px] text-[#74777F]">
                    {activeAccount ? activeAccount.accountNumber : '#001-NAVA-9904'}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs text-[#43474E] inline-flex items-baseline gap-1">
                Avail: <AnimatedMaskedValue value={availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} isMasked={isMasked} maskString="••••••" /> ARTH
              </span>
            </div>
          </div>

          {/* Recipient Citizen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-sans text-xs font-medium text-[#43474E]">
                Recipient ARTH Account Number
              </label>
              <span className="font-sans text-[11px] text-[#10B981] flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Protocol Target
              </span>
            </div>
            <div className="flex items-center bg-[#F8F9FF] border border-[#74777F]/20 px-4 py-3 rounded-xl gap-2.5">
              <BadgeCheck className="w-4 h-4 text-[#A8742A]" />
              <input
                type="text"
                value={destinationAccountNumber}
                onChange={(e) => setDestinationAccountNumber(e.target.value)}
                placeholder="ARTH-NAVA-002"
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
              Argon2id Enclave
            </span>
          </div>

          <p className="font-sans text-xs text-[#533300]/80">
            Enter your Financial Password to authorize double-entry ledger execution. Financial credentials are never logged and use autocomplete="off".
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            {/* Secure Financial Password Input */}
            <div className="relative flex items-center justify-center bg-white border border-[#DFB87A] px-4 py-2.5 rounded-full">
              <input
                type="password"
                autoComplete="off"
                value={finPin}
                onChange={(e) => {
                  setFinPin(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Financial Passkey"
                className="w-48 text-center font-sans text-sm text-[#361F00] bg-transparent focus:outline-none placeholder-[#DFB87A]"
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
                  <span>Posting Ledger Transaction to PostgreSQL…</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-[#A8742A]" />
                  <span>Authorize &amp; Commit to Ledger</span>
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
              <span className="text-[#10B981] truncate max-w-[200px]">ID: {txReceipt}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
