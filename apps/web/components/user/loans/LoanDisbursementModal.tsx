'use client';

import React, { useState } from 'react';
import { XCircle, Lock, ShieldCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { UserLoanDto } from '@arthax/types';
import { apiDisburseLoan } from '@/lib/api';

interface LoanDisbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: UserLoanDto | null;
  onDisbursementSuccess: () => void;
}

export const LoanDisbursementModal: React.FC<LoanDisbursementModalProps> = ({
  isOpen,
  onClose,
  loan,
  onDisbursementSuccess,
}) => {
  const [financialPassword, setFinancialPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !loan) return null;

  const principalFormatted = (Number(loan.principalMinor || 0) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleDisburse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      await apiDisburseLoan(
        loan.id,
        {
          financialPassword,
          disbursementAccountId: loan.disbursementAccountId,
        },
        `idem_disb_web_${Date.now()}`,
      );
      onDisbursementSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to disburse loan funds');
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
            <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] border border-[#0284C7]/20 flex items-center justify-center text-[#0284C7]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121C28]">
                Disburse Credit Facility
              </h3>
              <p className="text-xs text-[#5C574F]">
                Step-up authorization for ledger-backed disbursement
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

        {/* Facility Summary Box */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#74777F]/15 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#5C574F]">Facility Contract:</span>
            <span className="font-mono font-bold text-[#121C28]">{loan.contractNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5C574F]">Disbursement Amount:</span>
            <span className="font-mono font-bold text-sm text-[#10B981]">{principalFormatted} ARTH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5C574F]">Receiving Account:</span>
            <span className="font-mono text-[#121C28]">{loan.disbursementAccountId}</span>
          </div>
        </div>

        <form onSubmit={handleDisburse} className="space-y-4">
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
            <span className="text-[10px] text-[#74777F] mt-1 block">
              Disbursement is executed through Core Ledger: sys_loan_pool &rarr; Customer Account.
            </span>
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
              className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold transition shadow-sm hover:shadow cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <span>Disbursing Funds...</span> : <span>Confirm &amp; Disburse</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
