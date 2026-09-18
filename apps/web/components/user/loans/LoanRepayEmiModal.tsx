'use client';

import React, { useState } from 'react';
import { XCircle, Lock, HandCoins, AlertCircle, Calendar } from 'lucide-react';
import { UserLoanDto } from '@arthax/types';
import { apiPayLoanEmi } from '@/lib/api';

interface LoanRepayEmiModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: UserLoanDto | null;
  onPaymentSuccess: () => void;
}

export const LoanRepayEmiModal: React.FC<LoanRepayEmiModalProps> = ({
  isOpen,
  onClose,
  loan,
  onPaymentSuccess,
}) => {
  const [financialPassword, setFinancialPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !loan) return null;

  // Find next unpaid installment
  const nextInstallment = loan.installments.find((i) => i.status !== 'PAID') || loan.installments[0];

  const emiFormatted = nextInstallment
    ? (Number(nextInstallment.totalAmountMinor || nextInstallment.totalDueMinor || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : (Number(loan.monthlyEmiMinor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const principalPortionFormatted = nextInstallment
    ? (Number(nextInstallment.principalMinor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const interestPortionFormatted = nextInstallment
    ? (Number(nextInstallment.interestMinor) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const handlePayEmi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nextInstallment) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      await apiPayLoanEmi(
        loan.id,
        {
          financialPassword,
          installmentNumber: nextInstallment.installmentNumber,
          sourceAccountId: loan.repaymentAccountId,
        },
        `idem_emi_web_${Date.now()}`,
      );
      onPaymentSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process installment payment');
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
            <div className="w-10 h-10 rounded-xl bg-[#FAF0E1] border border-[#A8742A]/20 flex items-center justify-center text-[#A8742A]">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121C28]">
                Pay Monthly Installment
              </h3>
              <p className="text-xs text-[#5C574F]">
                Installment #{nextInstallment?.installmentNumber || 1} • {loan.contractNumber}
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

        {/* Breakdown Box */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#74777F]/15 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#5C574F]">Total Installment Due:</span>
            <span className="font-mono font-bold text-base text-[#121C28]">{emiFormatted} ARTH</span>
          </div>
          <div className="flex items-center justify-between text-[#5C574F]">
            <span>&bull; Principal Reduction (sys_loan_pool):</span>
            <span className="font-mono font-semibold text-[#121C28]">{principalPortionFormatted} ARTH</span>
          </div>
          <div className="flex items-center justify-between text-[#5C574F]">
            <span>&bull; Interest Income (sys_bank_interest):</span>
            <span className="font-mono font-semibold text-[#A8742A]">{interestPortionFormatted} ARTH</span>
          </div>
          <div className="pt-2 border-t border-[#74777F]/10 flex items-center justify-between text-[#74777F]">
            <span>Source Repayment Account:</span>
            <span className="font-mono text-[#121C28]">{loan.repaymentAccountId}</span>
          </div>
        </div>

        <form onSubmit={handlePayEmi} className="space-y-4">
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
              className="px-6 py-2.5 rounded-xl bg-[#1E3A5F] hover:bg-[#0F1B2B] text-white text-xs sm:text-sm font-bold transition shadow-sm hover:shadow cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <span>Processing Payment...</span> : <span>Confirm &amp; Pay EMI</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
