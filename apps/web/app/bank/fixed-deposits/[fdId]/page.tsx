'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  PiggyBank,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  FileDown,
  RotateCw,
  Landmark,
  CheckCircle2,
} from 'lucide-react';
import {
  MOCK_FIXED_DEPOSITS,
  formatArth,
  getStatusColor,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function FixedDepositDetailPage() {
  const params = useParams();
  const fdId = (params?.fdId as string) || 'FD-0001';

  const fd = MOCK_FIXED_DEPOSITS.find((f) => f.id === fdId) || MOCK_FIXED_DEPOSITS[0];
  const [currentStatus, setCurrentStatus] = useState(fd.status);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAction = (msg: string, newStatus?: typeof currentStatus) => {
    if (newStatus) setCurrentStatus(newStatus);
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const sc = getStatusColor(currentStatus);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#74777F]">
          <Link href="/bank" className="hover:text-[#3B3278] transition">Bank</Link>
          <span>/</span>
          <Link href="/bank/fixed-deposits" className="hover:text-[#3B3278] transition">Fixed Deposits</Link>
          <span>/</span>
          <span className="font-mono font-bold text-[#1C1736]">{fd.id}</span>
        </div>

        <Link
          href="/bank/fixed-deposits"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B3278]/15 bg-white text-xs font-semibold text-[#3B3278] hover:bg-[#FAFAFF] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Fixed Deposits</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Sovereign Deposit Certificate (Plaque Style) */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-[#FDFCF7] rounded-3xl border-2 border-[#A8742A]/25 p-6 md:p-8 shadow-sm">
        {/* Certificate Decorative Border / Seal */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#A8742A]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#A8742A]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#A8742A]/15 text-[#A8742A] flex items-center justify-center border border-[#A8742A]/30">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#A8742A] uppercase tracking-wider">
                  ARTHAX Sovereign Term Certificate
                </span>
                <h1 className="font-serif font-bold text-2xl text-[#1C1736]">{fd.schemeName}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                {currentStatus}
              </span>
              <span className="font-mono text-xs font-bold text-[#74777F] bg-white px-3 py-1 rounded-xl border border-gray-200">
                {fd.certificateRef}
              </span>
            </div>
          </div>

          {/* Certificate Body Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#A8742A]/15 shadow-2xs">
              <span className="text-xs text-[#74777F] font-medium">Principal Deposited</span>
              <div className="font-mono text-2xl font-bold text-[#1C1736] mt-1">
                <BankMaskedValue value={`${formatArth(fd.principal)} ARTH`} />
              </div>
              <div className="text-[11px] text-[#74777F] mt-0.5">Initial placement</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#A8742A]/15 shadow-2xs">
              <span className="text-xs text-[#74777F] font-medium">Interest Yield</span>
              <div className="font-mono text-2xl font-bold text-emerald-600 mt-1">
                {fd.interestRate}% p.a.
              </div>
              <div className="text-[11px] text-[#74777F] mt-0.5">{fd.tenureMonths} Months tenure</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#A8742A]/15 shadow-2xs">
              <span className="text-xs text-[#74777F] font-medium">Accrued to Date</span>
              <div className="font-mono text-2xl font-bold text-[#3B3278] mt-1">
                <BankMaskedValue value={`${formatArth(fd.interestAccrued)} ARTH`} />
              </div>
              <div className="text-[11px] text-[#74777F] mt-0.5">Compounded quarterly</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#A8742A]/10 border border-[#A8742A]/25 shadow-2xs">
              <span className="text-xs text-[#A8742A] font-bold">Estimated Maturity Value</span>
              <div className="font-mono text-2xl font-bold text-[#A8742A] mt-1">
                <BankMaskedValue value={`${formatArth(fd.maturityAmount)} ARTH`} />
              </div>
              <div className="text-[11px] text-[#A8742A]/80 mt-0.5">Upon maturity settlement</div>
            </div>
          </div>

          {/* Detailed Certificate Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-[#A8742A]/15">
            <div className="space-y-2 bg-white/70 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between">
                <span className="text-[#74777F]">Beneficiary Citizen:</span>
                <Link
                  href={`/bank/customers/${fd.customerId}`}
                  className="font-bold text-[#3B3278] hover:underline"
                >
                  {fd.customerName} ({fd.customerId})
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74777F]">Source Funding Account:</span>
                <span className="font-bold text-[#1C1736]">
                  <BankMaskedValue value={fd.sourceAccount} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74777F]">Scheme Identifier:</span>
                <span className="text-[#1C1736]">{fd.schemeId}</span>
              </div>
            </div>

            <div className="space-y-2 bg-white/70 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between">
                <span className="text-[#74777F]">Placement Date:</span>
                <span className="text-[#1C1736]">{fd.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74777F]">Maturity Date:</span>
                <span className="font-bold text-[#A8742A]">{fd.maturityDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#74777F]">Premature Penalty Policy:</span>
                <span className="text-[#B5482E]">1.00% interest haircut</span>
              </div>
            </div>
          </div>

          {/* Operational Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#A8742A]/15">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('Official sovereign certificate PDF downloaded')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B3278] text-white hover:bg-[#2D2654] text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Certificate PDF</span>
              </button>

              {currentStatus === 'Matured' && (
                <button
                  onClick={() => handleAction('Certificate renewed for 12 months under current rate', 'Renewed')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Renew Term Deposit</span>
                </button>
              )}
            </div>

            {currentStatus === 'Active' && (
              <button
                onClick={() => handleAction('Premature withdrawal processed. Principal credited with 1% penalty.', 'Premature Withdrawal')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#B5482E]/30 bg-[#B5482E]/10 hover:bg-[#B5482E]/20 text-[#B5482E] text-xs font-bold transition cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Liquidate / Premature Withdrawal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
