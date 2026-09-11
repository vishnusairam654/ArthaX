'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  HandCoins,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  FileDown,
  CheckCircle2,
  XCircle,
  Percent,
  TrendingDown,
  RotateCw,
} from 'lucide-react';
import {
  MOCK_LOANS,
  formatArth,
  getStatusColor,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function LoanDetailPage() {
  const params = useParams();
  const loanId = (params?.loanId as string) || 'LN-0001';

  const loan = MOCK_LOANS.find((l) => l.id === loanId) || MOCK_LOANS[0];
  const [currentStatus, setCurrentStatus] = useState(loan.status);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAction = (msg: string, newStatus?: typeof currentStatus) => {
    if (newStatus) setCurrentStatus(newStatus);
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const sc = getStatusColor(currentStatus);
  const progressPercent = Math.round((loan.paidInstallments / (loan.totalInstallments || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#74777F]">
          <Link href="/bank" className="hover:text-[#3B3278] transition">Bank</Link>
          <span>/</span>
          <Link href="/bank/loans" className="hover:text-[#3B3278] transition">Loans</Link>
          <span>/</span>
          <span className="font-mono font-bold text-[#1C1736]">{loan.id}</span>
        </div>

        <Link
          href="/bank/loans"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B3278]/15 bg-white text-xs font-semibold text-[#3B3278] hover:bg-[#FAFAFF] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Loans</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Loan Overview Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3B3278]/10 text-[#3B3278] flex items-center justify-center border border-[#3B3278]/15">
              <HandCoins className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-mono font-bold text-2xl text-[#1C1736]">{loan.id}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                  {currentStatus}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#3B3278]/10 text-[#3B3278] text-[11px] font-mono font-bold">
                  {loan.type} Facility
                </span>
              </div>
              <p className="text-xs text-[#74777F] mt-1">
                Citizen Beneficiary:{' '}
                <Link
                  href={`/bank/customers/${loan.customerId}`}
                  className="font-bold text-[#3B3278] hover:underline"
                >
                  {loan.customerName} ({loan.customerId})
                </Link>
                {loan.approvedBy && (
                  <span className="ml-3 font-mono">Approved by: {loan.approvedBy}</span>
                )}
              </p>
            </div>
          </div>

          {/* Underwriting & Operations Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {(currentStatus === 'Application' || currentStatus === 'Under Review') && (
              <>
                <button
                  onClick={() => handleAction('Facility approved. Funds scheduled for disbursement.', 'Approved')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Facility</span>
                </button>
                <button
                  onClick={() => handleAction('Facility underwriting rejected.', 'Rejected')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#B5482E]/30 bg-[#B5482E]/10 hover:bg-[#B5482E]/20 text-[#B5482E] text-xs font-bold transition cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {currentStatus === 'Active' && (
              <button
                onClick={() => handleAction('Manual payment installment recorded successfully.')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3B3278] text-white hover:bg-[#2D2654] text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Record EMI Payment</span>
              </button>
            )}

            <button
              onClick={() => handleAction('Loan agreement documentation exported')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B3278]/15 bg-white hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold transition cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Loan Agreement</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Highlight Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-[#3B3278]/10">
          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Original Principal</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#1C1736]">
              <BankMaskedValue value={`${formatArth(loan.principal)} ARTH`} />
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">Disbursed amount</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Interest Rate</span>
            <div className="mt-1 font-mono text-xl font-bold text-amber-700">
              {loan.interestRate}% p.a.
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">{loan.tenureMonths} Months tenure</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Outstanding Balance</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#B5482E]">
              <BankMaskedValue value={`${formatArth(loan.outstandingBalance)} ARTH`} />
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">Principal remaining</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Monthly Installment (EMI)</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#3B3278]">
              {loan.monthlyEmi > 0 ? `${formatArth(loan.monthlyEmi)} ARTH` : '—'}
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">Auto-debit target account</div>
          </div>
        </div>

        {/* Repayment Progress Strip */}
        <div className="p-4 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/10 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-[#1C1736]">Amortization Progress</span>
            <span className="font-mono text-[#74777F]">
              {loan.paidInstallments} of {loan.totalInstallments} installments paid ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3B3278] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Loan Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
          <div className="p-3 rounded-xl bg-white border border-[#3B3278]/10 space-y-1">
            <span className="text-[#74777F]">Application Date:</span>
            <div className="font-bold text-[#1C1736]">{loan.applicationDate}</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#3B3278]/10 space-y-1">
            <span className="text-[#74777F]">Disbursement Account:</span>
            <div className="font-bold text-[#3B3278]">
              <BankMaskedValue value={loan.targetAccount} />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#3B3278]/10 space-y-1">
            <span className="text-[#74777F]">Disbursement Date:</span>
            <div className="font-bold text-[#1C1736]">{loan.disbursementDate || 'Pending Approval'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
