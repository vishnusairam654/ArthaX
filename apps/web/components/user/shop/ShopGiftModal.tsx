'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Gift, X, Send, ShieldCheck, AlertTriangle, KeyRound } from 'lucide-react';
import { ShopItem } from './ShopData';

interface ShopGiftModalProps {
  item: ShopItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (
    item: ShopItem,
    recipient: string,
    note: string,
    sourceAccountId: string,
    financialPassword: string,
  ) => Promise<void> | void;
}

export function ShopGiftModal({
  item,
  isOpen,
  onClose,
  onSendGift,
}: ShopGiftModalProps) {
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [sourceAccountId, setSourceAccountId] = useState('ARTH-NAVA-001');
  const [financialPassword, setFinancialPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      setError('Recipient citizen identifier is required.');
      return;
    }
    if (!financialPassword.trim()) {
      setError('Financial Password is required for step-up sovereign authorization.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSendGift(item, recipient.trim(), note.trim(), sourceAccountId, financialPassword.trim());
      setRecipient('');
      setNote('');
      setFinancialPassword('');
    } catch (err: any) {
      setError(err.message || 'Gift settlement failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#022448]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-[#1B1C1A] max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-4 relative border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#A8742A]">
            <Gift className="w-4 h-4 text-[#A8742A]" />
          </div>
          <div>
            <span className="font-sans text-[11px] text-[#A8742A] uppercase tracking-widest font-bold block">
              Transfer / Gift Protocol
            </span>
            <span className="text-[10px] font-mono text-slate-400">SETU Bilateral Settlement</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <h3 className="font-serif text-xl font-bold text-[#022448]">
            Gift Artifact to Citizen
          </h3>
          <p className="font-sans text-xs text-slate-500">
            Granting: <strong className="text-slate-800">{item.name}</strong> •{' '}
            <span className="font-mono text-[#A8742A] font-bold">{item.price.toLocaleString('en-US')} ARTH</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-sans text-xs">
          {/* Recipient Input */}
          <div className="space-y-1">
            <label className="text-slate-600 font-semibold block text-[11px]">
              Recipient Citizen GOV ID or Verified Email
            </label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                setError(null);
              }}
              placeholder="e.g. GOV-8419-2041 or citizen@arthax.gov"
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-slate-200/80 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
            />
          </div>

          {/* Funding Account */}
          <div className="space-y-1">
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

          {/* Financial Password (Rule 16 & 17) */}
          <div className="space-y-1">
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

          {/* Dedication Note */}
          <div className="space-y-1">
            <label className="text-slate-600 font-semibold block text-[11px]">
              Dedication Note (Encrypted in Sovereign Audit Ledger)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. In appreciation of sovereign syndicate advisory"
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-slate-200/80 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-sans">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-[#FAF8F5] border border-slate-200/80 rounded-xl flex items-center gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Escrow delivery guarantees instant atomic settlement to recipient vault.</span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#022448] hover:bg-[#1E3A5F] text-white rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Settling Gift via CLS...' : 'Execute Sovereign Gift Transfer'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-transparent text-slate-500 hover:text-slate-800 text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
