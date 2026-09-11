'use client';

import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { UserFdDto, FdRolloverInstruction } from '@arthax/types';
import { apiToggleFdAutoRenew } from '@/lib/api';

interface FdRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: UserFdDto | null;
  onRenewalUpdated?: (updated: UserFdDto) => void;
}

export const FdRenewalModal: React.FC<FdRenewalModalProps> = ({
  isOpen,
  onClose,
  contract,
  onRenewalUpdated,
}) => {
  const [autoRenew, setAutoRenew] = useState<boolean>(contract?.autoRenew ?? true);
  const [rolloverInstruction, setRolloverInstruction] = useState<FdRolloverInstruction>(
    contract?.rolloverInstruction ?? 'PRINCIPAL_AND_INTEREST'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (contract) {
      setAutoRenew(contract.autoRenew ?? true);
      setRolloverInstruction(contract.rolloverInstruction ?? 'PRINCIPAL_AND_INTEREST');
      setError('');
      setSuccess(false);
    }
  }, [contract]);

  if (!isOpen || !contract) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const updated = await apiToggleFdAutoRenew(contract.id, {
        autoRenew,
        rolloverInstruction,
      });

      if (updated) {
        setSuccess(true);
        if (onRenewalUpdated) {
          onRenewalUpdated(updated);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update auto-renewal mandate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl border border-[#74777F]/20 shadow-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#74777F]/15 bg-[#F8F9FF]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#E5EFFF] text-[#1E3A5F] flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg text-[#022448] font-bold">
                Renewal Mandate Options
              </h2>
              <span className="font-mono text-[10px] text-[#5C574F] uppercase tracking-wider block">
                #{contract.depositNumber || contract.certificateNumber}
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
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3.5 bg-[#F8F9FF] rounded-xl border border-[#74777F]/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                    className="w-4 h-4 rounded border-[#74777F]/40 text-[#1E3A5F] focus:ring-[#1E3A5F]"
                  />
                  <div>
                    <span className="font-sans text-xs font-semibold text-[#121C28] block">
                      Enable Auto-Renewal at Maturity
                    </span>
                    <span className="font-sans text-[11px] text-[#5C574F]">
                      Contract will automatically rollover on {new Date(contract.maturityDate).toLocaleDateString()}
                    </span>
                  </div>
                </label>

                {autoRenew && (
                  <div className="p-4 bg-[#E5EFFF]/40 rounded-xl border border-[#1E3A5F]/20 space-y-2.5">
                    <span className="font-sans text-xs font-semibold text-[#022448] block">
                      Rollover Payout Scheme
                    </span>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="rollover"
                        value="PRINCIPAL_AND_INTEREST"
                        checked={rolloverInstruction === 'PRINCIPAL_AND_INTEREST'}
                        onChange={() => setRolloverInstruction('PRINCIPAL_AND_INTEREST')}
                        className="mt-0.5 text-[#1E3A5F]"
                      />
                      <div className="text-xs">
                        <span className="font-medium text-[#121C28] block">Rollover Principal + Accrued Yield</span>
                        <span className="text-[#5C574F] text-[11px]">Compounds entire terminal balance into the renewed contract</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                      <input
                        type="radio"
                        name="rollover"
                        value="PRINCIPAL_ONLY"
                        checked={rolloverInstruction === 'PRINCIPAL_ONLY'}
                        onChange={() => setRolloverInstruction('PRINCIPAL_ONLY')}
                        className="mt-0.5 text-[#1E3A5F]"
                      />
                      <div className="text-xs">
                        <span className="font-medium text-[#121C28] block">Rollover Principal Only</span>
                        <span className="text-[#5C574F] text-[11px]">Credits accrued yield to your liquid account, rolling only principal</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-xs text-[#B5482E] flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}

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
                  className="flex-1 py-2.5 bg-[#022448] hover:bg-[#1E3A5F] disabled:opacity-50 text-white font-medium text-xs rounded-full shadow-xs transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Mandate'}
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
                  Mandate Updated Successfully
                </h3>
                <p className="font-sans text-xs text-[#5C574F]">
                  Your auto-renewal and rollover instructions have been recorded on Core Ledger.
                </p>
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
