'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  XCircle,
  HandCoins,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Building2,
  Sparkles,
} from 'lucide-react';
import { LoanProductDto, UserLoanDto, BankAccountDto } from '@arthax/types';
import { apiFetchLoanProducts, apiApplyLoan, apiFetchUserAccounts } from '@/lib/api';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanCreated: (loan: UserLoanDto) => void;
  initialProductId?: string;
  initialPrincipal?: number;
  initialTenureMonths?: number;
}

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
  isOpen,
  onClose,
  onLoanCreated,
  initialProductId,
  initialPrincipal,
  initialTenureMonths,
}) => {
  const [products, setProducts] = useState<LoanProductDto[]>([]);
  const [accounts, setAccounts] = useState<BankAccountDto[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId || 'prod_nava_personal');
  const [principal, setPrincipal] = useState<number>(initialPrincipal || 50000);
  const [tenureMonths, setTenureMonths] = useState<number>(initialTenureMonths || 24);
  const [purpose, setPurpose] = useState<string>('Sovereign Business Working Capital Expansion');
  const [disbursementAccountId, setDisbursementAccountId] = useState<string>('');
  const [repaymentAccountId, setRepaymentAccountId] = useState<string>('');

  // Optional Collateral
  const [collateralType, setCollateralType] = useState<string>('NONE');
  const [collateralAssetId, setCollateralAssetId] = useState<string>('');
  const [collateralPledgedValue, setCollateralPledgedValue] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    apiFetchLoanProducts().then(setProducts);
    apiFetchUserAccounts().then((accs) => {
      setAccounts(accs);
      if (accs.length > 0) {
        setDisbursementAccountId(accs[0].id);
        setRepaymentAccountId(accs[0].id);
      }
    });
  }, [isOpen]);

  useEffect(() => {
    if (initialProductId) setSelectedProductId(initialProductId);
    if (initialPrincipal) setPrincipal(initialPrincipal);
    if (initialTenureMonths) setTenureMonths(initialTenureMonths);
  }, [initialProductId, initialPrincipal, initialTenureMonths]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const principalMinor = (BigInt(principal) * 100n).toString();
      const payload: any = {
        bankId: selectedProduct.bankId,
        productId: selectedProduct.id,
        requestedPrincipalMinor: principalMinor,
        tenureMonths,
        purpose,
        disbursementAccountId: disbursementAccountId || accounts[0]?.id || 'acct_ananya_nava_001',
        repaymentAccountId: repaymentAccountId || accounts[0]?.id || 'acct_ananya_nava_001',
      };

      if (collateralType !== 'NONE' && collateralAssetId) {
        payload.collateralType = collateralType;
        payload.collateralAssetId = collateralAssetId;
        payload.collateralPledgedValueMinor = (BigInt(collateralPledgedValue || principal * 1.2) * 100n).toString();
      }

      const newLoan = await apiApplyLoan(payload);
      onLoanCreated(newLoan);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit loan application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minP = selectedProduct ? Number(BigInt(selectedProduct.minPrincipalMinor) / 100n) : 10000;
  const maxP = selectedProduct ? Number(BigInt(selectedProduct.maxPrincipalMinor) / 100n) : 200000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#74777F]/20 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#74777F]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0E1] border border-[#A8742A]/20 flex items-center justify-center text-[#A8742A]">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#121C28]">
                Sovereign Credit Facility Application
              </h3>
              <p className="text-xs text-[#5C574F]">
                Institutional underwriting with Core Ledger double-entry isolation
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Picker */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F] mb-1.5">
              1. Credit Facility Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#74777F]/20 bg-[#FAF8F5] text-xs sm:text-sm font-sans text-[#121C28] focus:outline-hidden focus:border-[#1E3A5F]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.baseInterestRate}% APY • {p.bankId.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Principal & Tenure Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F] mb-1.5">
                Principal Amount (ARTH)
              </label>
              <input
                type="number"
                min={minP}
                max={maxP}
                step={1000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#74777F]/20 bg-[#FAF8F5] text-xs sm:text-sm font-mono font-bold text-[#121C28] focus:outline-hidden focus:border-[#1E3A5F]"
                required
              />
              <span className="text-[10px] text-[#74777F] mt-1 block">
                Allowed: {minP.toLocaleString()} to {maxP.toLocaleString()} ARTH
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F] mb-1.5">
                Tenure (Months)
              </label>
              <input
                type="number"
                min={selectedProduct?.minTenureMonths || 6}
                max={selectedProduct?.maxTenureMonths || 60}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-[#74777F]/20 bg-[#FAF8F5] text-xs sm:text-sm font-mono font-bold text-[#121C28] focus:outline-hidden focus:border-[#1E3A5F]"
                required
              />
              <span className="text-[10px] text-[#74777F] mt-1 block">
                Range: {selectedProduct?.minTenureMonths || 6} to {selectedProduct?.maxTenureMonths || 60} months
              </span>
            </div>
          </div>

          {/* Stated Purpose */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F] mb-1.5">
              Stated Facility Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Clean energy hardware acquisition"
              className="w-full px-3 py-2.5 rounded-xl border border-[#74777F]/20 bg-[#FAF8F5] text-xs sm:text-sm font-sans text-[#121C28] focus:outline-hidden focus:border-[#1E3A5F]"
              required
            />
          </div>

          {/* Account Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F] mb-1.5">
                Disbursement Account
              </label>
              <select
                value={disbursementAccountId}
                onChange={(e) => setDisbursementAccountId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#74777F]/20 bg-[#FAF8F5] text-xs text-[#121C28] focus:outline-hidden focus:border-[#1E3A5F]"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.accountNumber} ({a.bankId.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F] mb-1.5">
                Repayment Auto-Debit Account
              </label>
              <select
                value={repaymentAccountId}
                onChange={(e) => setRepaymentAccountId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#74777F]/20 bg-[#FAF8F5] text-xs text-[#121C28] focus:outline-hidden focus:border-[#1E3A5F]"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.accountNumber} ({a.bankId.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Collateral Section */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#74777F]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C574F]">
                Asset Collateral Pledge (Optional)
              </span>
              <span className="text-[10px] text-[#A8742A] font-semibold">Min 120% Appraisal</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={collateralType}
                onChange={(e) => setCollateralType(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#74777F]/20 bg-white text-xs text-[#121C28]"
              >
                <option value="NONE">No Collateral (Unsecured)</option>
                <option value="FIXED_DEPOSIT">Term Deposit Certificate</option>
                <option value="STOCK_HOLDINGS">Equities Portfolio Holding</option>
                <option value="SOVEREIGN_GUARANTEE">Sovereign Guild Guarantee</option>
              </select>

              {collateralType !== 'NONE' && (
                <input
                  type="text"
                  value={collateralAssetId}
                  onChange={(e) => setCollateralAssetId(e.target.value)}
                  placeholder="Asset ID (e.g. FD-CERT-001)"
                  className="px-3 py-2 rounded-xl border border-[#74777F]/20 bg-white text-xs font-mono text-[#121C28]"
                  required
                />
              )}
            </div>
          </div>

          {/* Submit Actions */}
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#1E3A5F] hover:bg-[#0F1B2B] text-white text-xs sm:text-sm font-bold transition shadow-sm hover:shadow cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting to Underwriter...</span>
              ) : (
                <>
                  <span>Submit Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
