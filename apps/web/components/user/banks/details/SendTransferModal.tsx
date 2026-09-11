'use client';

import React, { useState } from 'react';
import { X, Send, Lock, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface SendTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMasked: boolean;
  availableBalance: number;
}

export const SendTransferModal: React.FC<SendTransferModalProps> = ({
  isOpen,
  onClose,
  isMasked,
  availableBalance,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [rail, setRail] = useState('cls');
  const [finPin, setFinPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!recipient || !amount || Number(amount) <= 0) {
      alert('Please specify a valid recipient hash and amount.');
      return;
    }
    if (!finPin) {
      alert('Please enter your Financial PIN to authorize the transfer.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setRecipient('');
        setAmount('');
        setFinPin('');
        onClose();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022448]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#74777F]/20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#022448]" />
            <h3 className="font-serif font-semibold text-lg text-[#121C28]">
              Initiate CLS Outflow
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5EFFF] text-[#1E3A5F] flex items-center justify-center hover:bg-[#D9E3F4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#022448]">Transfer Dispatched</h4>
            <p className="text-xs font-sans text-[#43474E] max-w-xs mx-auto">
              Dispatched to Continuous Linked Settlement (CLS) core node. Finality confirmed in block #28,102,514.
            </p>
            <div className="font-mono text-[11px] text-[#A8742A] bg-[#F2EFE7] p-2 rounded-lg">
              CLS Ref: #TX-991204-CLS
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-sans text-xs">
            {/* Source Account Info */}
            <div className="p-3.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center justify-between">
              <span className="text-[#74777F]">Source Account</span>
              <span className="font-serif font-semibold text-[#022448]">
                NAVA Sovereign Payroll (
                <AnimatedMaskedValue
                  value={availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  isMasked={isMasked}
                  currency="ARTH"
                />{' '}
                Avail)
              </span>
            </div>

            {/* Recipient */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#43474E] font-medium block">
                Recipient Sovereign Hash or Node Tag
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. arthax.clearing.treasury.01"
                className="w-full h-11 px-3.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/20 font-mono text-xs text-[#121C28] placeholder:text-[#74777F] focus:outline-hidden focus:border-[#022448]"
              />
            </div>

            {/* Amount & Rail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#43474E] font-medium block">
                  Amount (ARTH)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 px-3.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/20 font-mono text-sm font-bold text-[#121C28] placeholder:text-[#74777F] focus:outline-hidden focus:border-[#022448]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#43474E] font-medium block">
                  Execution Rail
                </label>
                <select
                  value={rail}
                  onChange={(e) => setRail(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/20 font-sans text-xs text-[#121C28] focus:outline-hidden focus:border-[#022448]"
                >
                  <option value="cls">CLS Real-Time (&lt;400ms)</option>
                  <option value="dvp">DvP Conditional Escrow</option>
                  <option value="tax">Statutory Tax Direct</option>
                </select>
              </div>
            </div>

            {/* Notice Note */}
            <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center gap-2 text-[#74777F] text-[11px]">
              <Info className="w-4 h-4 text-[#A8742A] shrink-0" />
              <span>Transfers over 10,000.00 ARTH require secondary enclave authentication key.</span>
            </div>

            {/* Invariant Rules 16 & 17: Financial Password separation, autocomplete off */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-mono text-[#022448] font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#A8742A]" />
                <span>Authorize with Financial PIN</span>
              </label>
              <input
                type="password"
                maxLength={6}
                value={finPin}
                onChange={(e) => setFinPin(e.target.value)}
                autoComplete="off"
                placeholder="••••"
                className="w-full px-4 py-2.5 bg-[#F8F9FF] border border-[#74777F]/30 rounded-xl text-center font-mono tracking-widest text-lg text-[#121C28] focus:outline-hidden focus:border-[#022448]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#43474E] font-semibold text-xs transition-colors cursor-pointer border border-[#74777F]/15"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSend}
                className="flex-1 h-11 rounded-xl bg-[#022448] hover:bg-[#1E3A5F] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#F9BB6A]" />
                <span>{isSubmitting ? 'Signing...' : 'Sign & Dispatch'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
