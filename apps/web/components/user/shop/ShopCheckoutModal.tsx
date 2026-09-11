'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, X, AlertTriangle, CheckCircle2, Lock, KeyRound } from 'lucide-react';
import { ShopItem, RARITY_CONFIG } from './ShopData';

interface ShopCheckoutModalProps {
  item: ShopItem | null;
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  isMasked?: boolean;
  onConfirm: (item: ShopItem, sourceAccountId: string, financialPassword: string) => Promise<void> | void;
}

export function ShopCheckoutModal({
  item,
  isOpen,
  onClose,
  availableBalance,
  isMasked = false,
  onConfirm,
}: ShopCheckoutModalProps) {
  const [sourceAccountId, setSourceAccountId] = useState('ARTH-NAVA-001');
  const [financialPassword, setFinancialPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const isAffordable = availableBalance >= item.price;
  const newBalance = Math.max(0, availableBalance - item.price);
  const rarityMeta = RARITY_CONFIG[item.rarity];

  const handleConfirmClick = async () => {
    if (!isAffordable) return;
    if (!financialPassword.trim()) {
      setError('Financial Password is required for step-up sovereign authorization.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onConfirm(item, sourceAccountId, financialPassword.trim());
      setFinancialPassword('');
    } catch (err: any) {
      setError(err.message || 'Purchase settlement failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#022448]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-[#1B1C1A] max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 relative border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FDF8F0] border border-[#A8742A]/20 flex items-center justify-center text-[#A8742A]">
            <Lock className="w-4 h-4 text-[#A8742A]" />
          </div>
          <div>
            <span className="font-sans text-[11px] text-[#A8742A] uppercase tracking-widest font-bold block">
              DvP Escrow Checkout
            </span>
            <span className="text-[10px] font-mono text-slate-400">Charter No. 842 Mint Protocol</span>
          </div>
        </div>

        {/* Item Title & Tier */}
        <div className="space-y-0.5">
          <h3 className="font-serif text-xl font-bold text-[#022448]">
            {item.name}
          </h3>
          <p className="font-sans text-xs text-slate-500">
            {rarityMeta.name} Tier • {item.powerTitle || item.powerDescription || item.role || 'Sovereign Treasury Item'}
          </p>
        </div>

        {/* Item Preview Inset */}
        <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3.5">
          <div className="relative w-16 h-16 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-sans text-[11px] text-slate-500 uppercase">Sovereign Mint Price</div>
            <div className="font-mono text-lg font-bold text-[#022448]">
              {isMasked ? '•••• ARTH' : `${item.price.toLocaleString('en-US')} ARTH`}
            </div>
            <div className="font-sans text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Loss Escrow Protection</span>
            </div>
          </div>
        </div>

        {/* Source Account Selector */}
        <div className="space-y-1 font-sans text-xs">
          <label className="text-slate-600 font-semibold block text-[11px]">
            Funding Bank Account
          </label>
          <select
            value={sourceAccountId}
            onChange={(e) => setSourceAccountId(e.target.value)}
            className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-slate-200/80 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
          >
            <option value="ARTH-NAVA-001">NAVA Savings • ARTH-NAVA-001</option>
            <option value="ARTH-SAMAYA-001">SAMAYA Current • ARTH-SAMAYA-001</option>
            <option value="ARTH-SETU-001">SETU Clearing • ARTH-SETU-001</option>
            <option value="ARTH-STHIRA-001">STHIRA Depository • ARTH-STHIRA-001</option>
            <option value="ARTH-VAYU-001">VAYU Treasury • ARTH-VAYU-001</option>
          </select>
        </div>

        {/* Financial Password (Rule 16 & 17: Step-Up Verification, autocomplete="off") */}
        <div className="space-y-1 font-sans text-xs">
          <label className="text-slate-600 font-semibold flex items-center gap-1.5 text-[11px]">
            <KeyRound className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>Financial Password (Step-Up Sovereign Authorization)</span>
          </label>
          <input
            type="password"
            autoComplete="off"
            required
            value={financialPassword}
            onChange={(e) => {
              setFinancialPassword(e.target.value);
              setError(null);
            }}
            placeholder="••••••••••••"
            className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-slate-200/80 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
          />
        </div>

        {/* Balance Check Strip */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 font-sans text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Current Available Balance:</span>
            <span className="font-mono font-bold text-[#022448]">
              {isMasked ? '•••••••• ARTH' : `${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Balance After Mint:</span>
            <span className="font-mono font-bold text-slate-900">
              {isMasked ? '•••••••• ARTH' : `${newBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Network Settlement Fee:</span>
            <span className="text-[#A8742A] font-semibold">0.00 ARTH (Section 18-G Exempt)</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-sans">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Warning if insufficient balance */}
        {!isAffordable && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-sans">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>
              Insufficient available allocation. Please top-up via NAVA Sovereign Payroll to complete this mint.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-2 font-sans">
          <button
            type="button"
            disabled={!isAffordable || isSubmitting}
            onClick={handleConfirmClick}
            className={`w-full py-3 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
              isAffordable && !isSubmitting
                ? 'bg-[#A8742A] hover:bg-[#8C5E1F] text-white active:translate-y-0.5'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Settling Sovereign Ledger...'
                : `Confirm 1-Click Mint (${isMasked ? '••••' : item.price.toLocaleString('en-US')} ARTH)`}
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-transparent text-slate-500 hover:text-slate-800 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            Cancel &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
}
