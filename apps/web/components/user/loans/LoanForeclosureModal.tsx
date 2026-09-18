'use client';

import React, { useState } from 'react';
import { XCircle, Lock, AlertTriangle, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserLoanDto } from '@arthax/types';
import { apiForecloseLoan } from '@/lib/api';

interface LoanForeclosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: UserLoanDto | null;
  onForeclosureSuccess: () => void;
}

export const LoanForeclosureModal: React.FC<LoanForeclosureModalProps> = ({
  isOpen,
  onClose,
  loan,
  onForeclosureSuccess,
}) => {
  const [financialPassword, setFinancialPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !loan) return null;

  const outstandingMinor = BigInt(loan.outstandingPrincipalMinor || 0);
  const penaltyMinor = (outstandingMinor * 2n) / 100n; // 2% statutory foreclosure fee
  const totalPayoffMinor = outstandingMinor + penaltyMinor;

  const outstandingFormatted = (Number(outstandingMinor) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const penaltyFormatted = (Number(penaltyMinor) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const totalPayoffFormatted = (Number(totalPayoffMinor) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleForeclose = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      await apiForecloseLoan(
        loan.id,
        {
          financialPassword,
          sourceAccountId: loan.repaymentAccountId,
        },
        `idem_foreclose_web_${Date.now()}`,
      );
      onForeclosureSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to foreclose credit facility');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#74777F]/20 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#74777F]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#B5482E]/10 border border-[#B5482E]/20 flex items-center justify-center text-[#B5482E]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121C28]">
                Early Facility Foreclosure
              </h3>
              <p className="text-xs text-[#5C574F]">
                Full payoff quote for {loan.contractNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#74777F] hover:bg-[#FAF8F5] transition cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#B5482E]/10 border border-[#B5482E]/20 text-[#B5482E] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Payoff Quote Box */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#74777F]/15 p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#5C574F]">Outstanding Principal:</span>
            <span className="font-mono font-bold text-[#121C28]">{outstandingFormatted} ARTH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5C574F]">Statutory Early Closure Fee (2.0%):</span>
            <span className="font-mono font-semibold text-[#A8742A]">{penaltyFormatted} ARTH</span>
          </div>
          <div className="pt-2 border-t border-[#74777F]/10 flex items-center justify-between text-sm">
            <span className="font-bold text-[#121C28]">Total Full Payoff Due:</span>
            <span className="font-mono font-bold text-base text-[#B5482E]">{totalPayoffFormatted} ARTH</span>
          </div>
          <div className="pt-1 text-[11px] text-[#74777F] leading-tight">
            * Upon payoff, all future scheduled installments will be marked WAIVED, and any pledged collateral liens will be immediately released.
          </div>
        </div>

        <form onSubmit={handleForeclose} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F] mb-1.5">
              Enter Financial Password (Step-Up)
            </label>
            <div className="relative">
              <input
                type="password"
                value={financialPassword}
                onChange={(e) => setFinancialPassword(e.target.value)}
                autoComplete="off"
                placeholder="Enter Argon2id Financial Password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#74777F]/20 bg-[#FAF8F5] text-xs sm:text-sm font-mono text-[#121C28] focus:outline-hidden focus:border-[#1E3A5F]"
                required
              />
              <Lock className="w-4 h-4 text-[#74777F] absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#74777F]/20 text-xs font-semibold text-[#5C574F] hover:bg-[#FAF8F5] transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-[#B5482E] hover:bg-[#8F3520] text-white text-xs sm:text-sm font-bold transition shadow-sm hover:shadow cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <span>Processing Foreclosure...</span> : <span>Confirm Full Payoff</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
