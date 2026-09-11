'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Users,
  AlertTriangle,
  Lock,
  Save,
} from 'lucide-react';
import {
  MOCK_PRODUCTS,
  formatArth,
} from '@/components/bank/BankMockData';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.productId as string) || 'PROD-001';

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  const [isActive, setIsActive] = useState(product.isActive);
  const [feeValue, setFeeValue] = useState(product.fees.toString());
  const [interestValue, setInterestValue] = useState(
    product.interestRate !== undefined ? product.interestRate.toString() : ''
  );
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleSave = () => {
    setActionSuccess('Product parameters updated and logged to audit trail.');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#74777F]">
          <Link href="/bank" className="hover:text-[#3B3278] transition">Bank</Link>
          <span>/</span>
          <Link href="/bank/products" className="hover:text-[#3B3278] transition">Products</Link>
          <span>/</span>
          <span className="font-mono font-bold text-[#1C1736]">{product.id}</span>
        </div>

        <Link
          href="/bank/products"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B3278]/15 bg-white text-xs font-semibold text-[#3B3278] hover:bg-[#FAFAFF] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Product Configuration Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3B3278]/10 text-[#3B3278] flex items-center justify-center border border-[#3B3278]/15">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif font-bold text-2xl text-[#1C1736]">{product.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isActive ? 'Active Instrument' : 'Deactivated'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#3B3278]/10 text-[#3B3278] text-[11px] font-mono font-bold">
                  {product.category}
                </span>
              </div>
              <p className="text-xs text-[#74777F] mt-1 font-mono">
                Product ID: <strong className="text-[#1C1736]">{product.id}</strong> • Enrolled Citizens:{' '}
                <strong className="text-[#1C1736]">{product.customerCount}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'border-[#B5482E]/30 bg-[#B5482E]/10 text-[#B5482E] hover:bg-[#B5482E]/20'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isActive ? 'Deactivate Product' : 'Activate Product'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#3B3278] text-white hover:bg-[#2D2654] text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
          <span className="text-xs font-bold text-[#1C1736] block mb-1">Product Description</span>
          <p className="text-xs text-[#74777F] leading-relaxed">{product.description}</p>
        </div>

        {/* Parameter Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {product.interestRate !== undefined && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1736]">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.05"
                value={interestValue}
                onChange={(e) => setInterestValue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 text-xs font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
              />
              <span className="text-[11px] text-[#74777F]">Benchmark: Central Bank base rate 5.00%</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1C1736]">Standard Transaction / Service Fee (ARTH)</label>
            <input
              type="number"
              value={feeValue}
              onChange={(e) => setFeeValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 text-xs font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
            />
            <span className="text-[11px] text-[#74777F]">Levied per instrument operation</span>
          </div>

          {product.minBalance !== undefined && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1736]">Minimum Account Balance (ARTH)</label>
              <input
                type="text"
                disabled
                value={`${formatArth(product.minBalance)} ARTH`}
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/10 text-xs font-mono text-[#74777F] cursor-not-allowed"
              />
              <span className="text-[11px] text-[#74777F]">Regulatory liquidity floor</span>
            </div>
          )}

          {product.maxLimit !== undefined && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1736]">Maximum Ceiling / Credit Cap (ARTH)</label>
              <input
                type="text"
                disabled
                value={`${formatArth(product.maxLimit)} ARTH`}
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/10 text-xs font-mono text-[#74777F] cursor-not-allowed"
              />
              <span className="text-[11px] text-[#74777F]">Risk containment limit</span>
            </div>
          )}

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-[#1C1736]">Citizen Eligibility Criteria</label>
            <input
              type="text"
              defaultValue={product.eligibility}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 text-xs text-[#1C1736] outline-none focus:border-[#3B3278]"
            />
            <span className="text-[11px] text-[#74777F]">Governed by citizen sovereign verification tier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
