'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, CheckCircle2, ShieldAlert, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

export interface AcquisitionItem {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  power?: string;
  role?: string;
  rarity?: string;
}

interface ShopAcquisitionDrawerProps {
  item: AcquisitionItem | null;
  isOpen: boolean;
  onClose: () => void;
  isMasked: boolean;
  availableBalance: number;
  onSuccess: (item: AcquisitionItem) => void;
}

export const ShopAcquisitionDrawer: React.FC<ShopAcquisitionDrawerProps> = ({
  item,
  isOpen,
  onClose,
  isMasked,
  availableBalance,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [autoEquip, setAutoEquip] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const isAffordable = availableBalance >= item.price;

  const handleConfirm = () => {
    if (!pin) {
      alert('Please enter your 4-digit Financial PIN to authorize sovereign debit.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(item);
        setIsSuccess(false);
        setPin('');
        onClose();
      }, 1600);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022448]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#74777F]/20 relative">
        {/* Header */}
        <div className="p-6 border-b border-[#74777F]/15 flex items-center justify-between bg-[#F8F9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#022448] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-[#F9BB6A]" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-[#121C28] text-base">
                Sovereign Vault Acquisition
              </h3>
              <p className="text-xs font-mono text-[#74777F]">Item Type: {item.type}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5EFFF] hover:bg-[#D9E3F4] text-[#1E3A5F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#022448]">Acquisition Successful</h4>
            <p className="text-xs font-sans text-[#43474E] max-w-xs mx-auto">
              <strong className="text-[#121C28]">{item.name}</strong> has been transferred to your sovereign identity address and recorded in Core Ledger Block #28,102,512.
            </p>
            <div className="font-mono text-[11px] text-[#A8742A] bg-[#F2EFE7] p-2 rounded-lg break-all">
              Tx: 0x98cf...41a0
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Item Card Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15">
              <div className="w-16 h-16 rounded-xl bg-white border border-[#74777F]/15 overflow-hidden flex items-center justify-center shrink-0 p-2">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E5EFFF] text-[#022448] font-semibold">
                  {item.rarity || item.type}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#121C28]">{item.name}</h4>
                <p className="text-xs text-[#43474E] line-clamp-1">{item.power || item.role || item.type}</p>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="space-y-2 border-t border-b border-[#74777F]/15 py-3 text-xs font-sans">
              <div className="flex items-center justify-between text-[#43474E]">
                <span>Purchase Price</span>
                <span className="font-mono font-bold text-[#121C28]">
                  <AnimatedMaskedValue
                    value={item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    isMasked={isMasked}
                    currency="ARTH"
                  />
                </span>
              </div>
              <div className="flex items-center justify-between text-[#43474E]">
                <span>Available ARTH Liquidity</span>
                <span className="font-mono font-medium text-[#1E3A5F]">
                  <AnimatedMaskedValue
                    value={availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    isMasked={isMasked}
                    currency="ARTH"
                  />
                </span>
              </div>
              <div className="flex items-center justify-between text-[#43474E] pt-1 border-t border-[#74777F]/10">
                <span className="font-medium text-[#121C28]">Remaining Balance After Debit</span>
                <span className="font-mono font-bold text-emerald-700">
                  <AnimatedMaskedValue
                    value={(availableBalance - item.price).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                    isMasked={isMasked}
                    currency="ARTH"
                  />
                </span>
              </div>
            </div>

            {/* Auto-Equip Option */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 cursor-pointer">
              <input
                type="checkbox"
                checked={autoEquip}
                onChange={(e) => setAutoEquip(e.target.checked)}
                className="w-4 h-4 rounded text-[#022448] focus:ring-[#1E3A5F]"
              />
              <div className="text-xs">
                <span className="font-medium text-[#121C28] block">
                  Equip to Active Vault Slot Immediately
                </span>
                <span className="text-[#74777F]">
                  Instantly activates financial APY modifiers on your commercial bank accounts.
                </span>
              </div>
            </label>

            {/* Invariant Rule 16 & 17: Financial Password isolation, autocomplete off */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#022448] font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#A8742A]" />
                <span>Authorize with Financial PIN</span>
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoComplete="off"
                placeholder="••••"
                className="w-full px-4 py-2.5 bg-[#F8F9FF] border border-[#74777F]/30 rounded-xl text-center font-mono tracking-widest text-lg text-[#121C28] focus:outline-hidden focus:border-[#022448]"
              />
              <p className="text-[10px] text-[#74777F] font-mono">
                Hardware Enclave Protected. Financial PIN is never transmitted unencrypted.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 text-xs font-semibold text-[#43474E] hover:bg-[#F8F9FF] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isAffordable || isSubmitting}
                onClick={handleConfirm}
                className={`w-2/3 py-2.5 px-4 rounded-xl font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isAffordable
                    ? 'bg-[#022448] hover:bg-[#1E3A5F] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span>Minting on Ledger...</span>
                ) : (
                  <>
                    <span>Confirm Sovereign Acquisition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
