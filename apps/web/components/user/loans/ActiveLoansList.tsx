'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  HandCoins,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Percent,
  Sparkles,
  ChevronRight,
  Receipt,
  XCircle,
} from 'lucide-react';
import { UserLoanDto, LoanStatus } from '@arthax/types';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface ActiveLoansListProps {
  isMasked: boolean;
  loans: UserLoanDto[];
  isLoading: boolean;
  onOpenDisburse: (loan: UserLoanDto) => void;
  onOpenPayEmi: (loan: UserLoanDto) => void;
  onOpenForeclose: (loan: UserLoanDto) => void;
  onOpenApplication: () => void;
}

const BANK_META: Record<string, { name: string; color: string; bg: string; logo: string }> = {
  nava: { name: 'Nava Bank', color: '#1E3A5F', bg: '#E5EFFF', logo: '/assets/banks/nava.png' },
  samaya: { name: 'Samaya Bank', color: '#A8742A', bg: '#FAF0E1', logo: '/assets/banks/samaya.png' },
  setu: { name: 'Setu Commercial', color: '#006A6A', bg: '#E0F2F1', logo: '/assets/banks/setu.png' },
  sthira: { name: 'Sthira Trust', color: '#3B3278', bg: '#EDE7F6', logo: '/assets/banks/sthira.png' },
  vayu: { name: 'Vayu Depository', color: '#0284C7', bg: '#E0F2FE', logo: '/assets/banks/vayu.png' },
};

function getStatusBadge(status: LoanStatus) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Active Facility', bg: 'bg-[#10B981]/15', text: 'text-[#065F46]', border: 'border-[#10B981]/30' };
    case 'APPROVED':
      return { label: 'Approved (Ready to Disburse)', bg: 'bg-[#0284C7]/15', text: 'text-[#0369A1]', border: 'border-[#0284C7]/30' };
    case 'SUBMITTED':
      return { label: 'Application Submitted', bg: 'bg-[#F59E0B]/15', text: 'text-[#92400E]', border: 'border-[#F59E0B]/30' };
    case 'UNDER_REVIEW':
      return { label: 'Underwriting Review', bg: 'bg-[#6366F1]/15', text: 'text-[#4338CA]', border: 'border-[#6366F1]/30' };
    case 'PAYMENT_DUE':
      return { label: 'EMI Payment Due', bg: 'bg-[#F97316]/15', text: 'text-[#C2410C]', border: 'border-[#F97316]/30' };
    case 'OVERDUE':
    case 'DELINQUENT':
      return { label: 'Overdue / Delinquent', bg: 'bg-[#B5482E]/15', text: 'text-[#B5482E]', border: 'border-[#B5482E]/30' };
    case 'FORECLOSING':
      return { label: 'Foreclosing Payoff', bg: 'bg-[#8B5CF6]/15', text: 'text-[#6D28D9]', border: 'border-[#8B5CF6]/30' };
    case 'CLOSED':
      return { label: 'Settled & Closed', bg: 'bg-[#64748B]/15', text: 'text-[#334155]', border: 'border-[#64748B]/30' };
    case 'REJECTED':
      return { label: 'Application Rejected', bg: 'bg-[#B5482E]/15', text: 'text-[#B5482E]', border: 'border-[#B5482E]/30' };
    case 'CANCELLED':
      return { label: 'Cancelled', bg: 'bg-[#64748B]/15', text: 'text-[#475569]', border: 'border-[#64748B]/30' };
    default:
      return { label: status, bg: 'bg-[#64748B]/15', text: 'text-[#334155]', border: 'border-[#64748B]/30' };
  }
}

export const ActiveLoansList: React.FC<ActiveLoansListProps> = ({
  isMasked,
  loans,
  isLoading,
  onOpenDisburse,
  onOpenPayEmi,
  onOpenForeclose,
  onOpenApplication,
}) => {
  const [selectedScheduleLoan, setSelectedScheduleLoan] = useState<UserLoanDto | null>(null);

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-[#74777F]/20 p-12 text-center space-y-4 shadow-2xs">
        <div className="w-12 h-12 rounded-full border-4 border-[#1E3A5F] border-t-transparent animate-spin mx-auto" />
        <p className="font-mono text-sm text-[#5C574F]">Loading sovereign credit portfolio...</p>
      </div>
    );
  }

  // Canonical Empty State
  if (loans.length === 0) {
    return (
      <div className="w-full bg-white rounded-3xl border border-[#74777F]/20 p-8 sm:p-12 text-center shadow-2xs relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF0E1] border border-[#A8742A]/20 flex items-center justify-center text-[#A8742A] mx-auto shadow-inner">
            <HandCoins className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-[#121C28]">
              No Active Credit Facilities
            </h3>
            <p className="text-sm text-[#5C574F] font-sans">
              You do not have any open commercial loans or sovereign mortgage facilities. 
              Simulate an installment plan or apply for instant pre-approved credit.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenApplication}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A5F] hover:bg-[#0F1B2B] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer transform active:scale-98"
            >
              <span>Explore Available Loan Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-xl text-[#121C28] flex items-center gap-2">
          <span>Active Credit Facilities &amp; Mortgages</span>
          <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F]">
            {loans.length} {loans.length === 1 ? 'facility' : 'facilities'}
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {loans.map((loan) => {
          const bank = BANK_META[loan.bankId] || {
            name: `${loan.bankId.toUpperCase()} Bank`,
            color: '#1E3A5F',
            bg: '#E5EFFF',
            logo: '/assets/banks/nava.png',
          };
          const statusBadge = getStatusBadge(loan.status);

          const outstandingFormatted = (Number(loan.outstandingPrincipalMinor || 0) / 100).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const principalFormatted = (Number(loan.principalMinor || 0) / 100).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const emiFormatted = (Number(loan.monthlyEmiMinor || 0) / 100).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const paidInstallmentsCount = loan.installments.filter((i) => i.status === 'PAID').length;
          const totalInstallmentsCount = loan.tenureMonths || loan.installments.length || 1;
          const progressPercent = Math.min(100, Math.round((paidInstallmentsCount / totalInstallmentsCount) * 100));

          return (
            <div
              key={loan.id}
              className="bg-white rounded-2xl border border-[#74777F]/20 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all space-y-5"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#74777F]/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: bank.bg, color: bank.color }}
                  >
                    {loan.bankId.toUpperCase().slice(0, 3)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#121C28]">
                        {loan.productName}
                      </span>
                      <span className="font-mono text-xs text-[#5C574F] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#74777F]/20">
                        {loan.contractNumber}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C574F] mt-0.5 font-sans">
                      {bank.name} • Applied on {new Date(loan.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              {/* Facility Financial Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[11px] font-mono text-[#5C574F] uppercase tracking-wider block">
                    Outstanding Principal
                  </span>
                  <div className="mt-1">
                    <AnimatedMaskedValue
                      value={outstandingFormatted}
                      isMasked={isMasked}
                      maskString="••••••••"
                      currency="ARTH"
                      className="font-mono font-bold text-base sm:text-lg text-[#121C28]"
                    />
                  </div>
                  <span className="text-[11px] text-[#74777F]">
                    Sanctioned: {principalFormatted} ARTH
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#5C574F] uppercase tracking-wider block">
                    Monthly EMI
                  </span>
                  <div className="mt-1">
                    <AnimatedMaskedValue
                      value={emiFormatted}
                      isMasked={isMasked}
                      maskString="••••••"
                      currency="ARTH"
                      className="font-mono font-bold text-base sm:text-lg text-[#A8742A]"
                    />
                  </div>
                  <span className="text-[11px] text-[#74777F]">
                    Rate: {loan.interestRate}% APY
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#5C574F] uppercase tracking-wider block">
                    Repayment Progress
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-[#E6E8ED] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1E3A5F] transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#121C28]">
                      {progressPercent}%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#74777F]">
                    {paidInstallmentsCount} of {totalInstallmentsCount} EMIs settled
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#5C574F] uppercase tracking-wider block">
                    Next Due Date
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 font-sans font-semibold text-sm text-[#121C28]">
                    <Calendar className="w-3.5 h-3.5 text-[#A8742A]" />
                    <span>
                      {loan.nextPaymentDueDate
                        ? new Date(loan.nextPaymentDueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : loan.status === 'CLOSED'
                        ? 'Settled'
                        : 'Pending'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#74777F]">
                    {loan.collaterals?.length > 0 ? 'Collateralized' : 'Unsecured'}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#74777F]/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedScheduleLoan(loan)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A5F] hover:text-[#0F1B2B] transition-colors cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#A8742A]" />
                  <span>View Amortization Schedule</span>
                </button>

                <div className="flex items-center gap-2">
                  {loan.status === 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => onOpenDisburse(loan)}
                      className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Disburse Funds</span>
                    </button>
                  )}

                  {(loan.status === 'ACTIVE' || loan.status === 'PAYMENT_DUE' || loan.status === 'OVERDUE') && (
                    <>
                      <button
                        type="button"
                        onClick={() => onOpenPayEmi(loan)}
                        className="px-4 py-2 rounded-xl bg-[#1E3A5F] hover:bg-[#0F1B2B] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <HandCoins className="w-3.5 h-3.5 text-[#F9BB6A]" />
                        <span>Pay Monthly EMI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenForeclose(loan)}
                        className="px-3 py-2 rounded-xl border border-[#B5482E]/30 bg-[#FAF8F5] hover:bg-[#B5482E]/10 text-[#B5482E] text-xs font-semibold transition cursor-pointer"
                      >
                        Early Foreclose
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Amortization Schedule Modal */}
      {selectedScheduleLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#74777F]/20 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#74777F]/15">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#121C28]">
                  Amortization Schedule — {selectedScheduleLoan.contractNumber}
                </h3>
                <p className="text-xs text-[#5C574F]">
                  {selectedScheduleLoan.productName} • {selectedScheduleLoan.tenureMonths} Monthly Installments @ {selectedScheduleLoan.interestRate}% APY
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScheduleLoan(null)}
                className="p-1 rounded-full text-[#74777F] hover:bg-[#FAF8F5] transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-[#74777F]/20 text-[#5C574F] font-mono">
                    <th className="py-2">#</th>
                    <th className="py-2">Due Date</th>
                    <th className="py-2">Principal</th>
                    <th className="py-2">Interest</th>
                    <th className="py-2">Total EMI</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74777F]/10">
                  {selectedScheduleLoan.installments?.map((inst) => (
                    <tr key={inst.installmentNumber} className="hover:bg-[#FAF8F5]/60 transition">
                      <td className="py-2 font-mono font-bold text-[#121C28]">{inst.installmentNumber}</td>
                      <td className="py-2 text-[#5C574F]">{inst.dueDate}</td>
                      <td className="py-2 font-mono">{(Number(inst.principalMinor) / 100).toFixed(2)}</td>
                      <td className="py-2 font-mono text-[#A8742A]">{(Number(inst.interestMinor) / 100).toFixed(2)}</td>
                      <td className="py-2 font-mono font-bold text-[#121C28]">{(Number(inst.totalAmountMinor || inst.totalDueMinor || 0) / 100).toFixed(2)}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inst.status === 'PAID'
                            ? 'bg-[#10B981]/15 text-[#065F46]'
                            : inst.status === 'WAIVED'
                            ? 'bg-[#64748B]/15 text-[#475569]'
                            : 'bg-[#F59E0B]/15 text-[#92400E]'
                        }`}>
                          {inst.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-[#74777F]/15 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedScheduleLoan(null)}
                className="px-5 py-2 rounded-xl bg-[#1E3A5F] text-white text-xs font-bold hover:bg-[#0F1B2B] transition cursor-pointer"
              >
                Close Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
