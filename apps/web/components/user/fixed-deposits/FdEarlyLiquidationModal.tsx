'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Lock, 
  Wallet, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { UserFdDto } from '@arthax/types';
import { apiBreakFd } from '@/lib/api';

interface FdEarlyLiquidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: UserFdDto | null;
  onLiquidationSuccess?: () => void;
}

export const FdEarlyLiquidationModal: React.FC<FdEarlyLiquidationModalProps> = ({
  isOpen,
  onClose,
  contract,
  onLiquidationSuccess,
}) => {
  const [financialPassword, setFinancialPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    grossPayoutMinor: number;
    penaltyDeductedMinor: number;
    netPayoutMinor: number;
  } | null>(null);

  if (!isOpen || !contract) return null;

  const principal = Number(contract.principalMinor) / 100;
  const penaltyRate = contract.preclosurePenaltyRate || 0.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialPassword || financialPassword.length < 4) {
      setError('Financial Password must be at least 4 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await apiBreakFd(contract.id, {
        financialPassword,
      });

      if (res) {
        setResult(res);
        if (onLiquidationSuccess) {
          onLiquidationSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Liquidation request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFinancialPassword('');
    setError('');
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl border border-[#74777F]/20 shadow-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#74777F]/15 bg-[#F8F9FF]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#B5482E]/10 text-[#B5482E] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg text-[#022448] font-bold">
                Early Contract Liquidation
              </h2>
              <span className="font-mono text-[10px] text-[#5C574F] uppercase tracking-wider block">
                #{contract.depositNumber || contract.certificateNumber} • Central Bank Penalty Schedule
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-[#74777F] hover:bg-[#E5EFFF] hover:text-[#121C28] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-[#B5482E]/5 rounded-xl border border-[#B5482E]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#B5482E]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Preclosure Penalty Warning</span>
                </div>
                <p className="text-xs text-[#5C574F] leading-relaxed">
                  Liquidating this term certificate prior to scheduled maturity forfeits yield down to{' '}
                  <strong className="text-[#121C28]">
                    max(0, {(contract.effectiveApy ?? contract.apy ?? 7.25).toFixed(2)}% - {penaltyRate.toFixed(2)}%) APY
                  </strong>{' '}
                  over elapsed tenure. Statutory minimum lock-in period is {contract.lockInDays ?? 30} days.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F8F9FF] rounded-xl border border-[#74777F]/10 text-xs font-mono">
                <div>
                  <span className="text-[#5C574F] block">Locked Principal:</span>
                  <span className="font-bold text-[#121C28]">{principal.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH</span>
                </div>
                <div>
                  <span className="text-[#5C574F] block">Penalty Rate:</span>
                  <span className="font-bold text-[#B5482E]">-{penaltyRate.toFixed(2)}% APY</span>
                </div>
              </div>

              {/* Financial Password Input */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider block">
                  Authorize with Financial Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#74777F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    autoComplete="off"
                    value={financialPassword}
                    onChange={(e) => setFinancialPassword(e.target.value)}
                    placeholder="Enter Financial Password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#74777F]/30 bg-[#F8F9FF] font-mono text-sm tracking-widest focus:outline-hidden focus:border-[#B5482E] focus:ring-1 focus:ring-[#B5482E]"
                    required
                  />
                </div>
                {error && (
                  <p className="text-xs text-[#B5482E] flex items-center gap-1 font-mono pt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 bg-[#F2F3FA] hover:bg-[#E5EFFF] text-[#5C574F] font-medium text-xs rounded-full border border-[#74777F]/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#B5482E] hover:bg-[#8F3520] disabled:opacity-50 text-white font-medium text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing Liquidation...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confirm Liquidation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#287A55]/10 text-[#287A55] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg text-[#022448] font-bold">
                  Deposit Liquidated Successfully
                </h3>
                <p className="font-sans text-xs text-[#5C574F]">
                  Principal and recalculated net yield credited back to your account via Core Ledger DvP settlement.
                </p>
              </div>

              <div className="p-4 bg-[#F8F9FF] rounded-xl border border-[#74777F]/20 text-xs font-mono space-y-2 max-w-sm mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Gross Payout:</span>
                  <span className="text-[#121C28] font-semibold">
                    {(result.grossPayoutMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C574F]">Penalty Deducted:</span>
                  <span className="text-[#B5482E] font-semibold">
                    -{(result.penaltyDeductedMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#74777F]/10 font-bold">
                  <span className="text-[#121C28]">Net Liquidated ARTH:</span>
                  <span className="text-[#287A55]">
                    {(result.netPayoutMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                type="button"
                className="px-6 py-2.5 bg-[#022448] hover:bg-[#1E3A5F] text-white font-medium text-xs rounded-full shadow-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
