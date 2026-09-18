'use client';

import React from 'react';
import { HandCoins, Calendar, Award, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { UserLoanDto } from '@arthax/types';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface LoansMetricsOverviewProps {
  isMasked: boolean;
  loans: UserLoanDto[];
}

export const LoansMetricsOverview: React.FC<LoansMetricsOverviewProps> = ({ isMasked, loans }) => {
  const activeLoans = loans.filter((l) => l.status === 'ACTIVE' || l.status === 'PAYMENT_DUE' || l.status === 'OVERDUE');

  const totalOutstandingMinor = activeLoans.reduce(
    (sum, l) => sum + Number(l.outstandingPrincipalMinor || 0),
    0,
  );

  const totalMonthlyEmiMinor = activeLoans.reduce(
    (sum, l) => sum + Number(l.monthlyEmiMinor || 0),
    0,
  );

  // Derive next payment due date from closest active loan
  const nextDueDate = activeLoans.length > 0 && activeLoans[0].nextPaymentDueDate
    ? new Date(activeLoans[0].nextPaymentDueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No Dues Pending';

  const totalOutstandingFormatted = (totalOutstandingMinor / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const totalMonthlyEmiFormatted = (totalMonthlyEmiMinor / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Total Outstanding Principal */}
        <div className="bg-white p-5 rounded-2xl border border-[#74777F]/20 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Outstanding Principal
              </span>
              <span className="w-8 h-8 rounded-full bg-[#E5EFFF] flex items-center justify-center text-[#1E3A5F]">
                <HandCoins className="w-4 h-4" />
              </span>
            </div>

            <div className="pt-1">
              <AnimatedMaskedValue
                value={totalOutstandingFormatted}
                isMasked={isMasked}
                maskString="••••••••"
                currency="ARTH"
                className="font-mono font-bold text-2xl text-[#121C28]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#74777F]/10 flex items-center justify-between text-xs text-[#5C574F]">
            <span>{activeLoans.length} active credit {activeLoans.length === 1 ? 'facility' : 'facilities'}</span>
            <span className="text-[#10B981] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ledger verified
            </span>
          </div>
        </div>

        {/* Metric 2: Monthly EMI Obligation */}
        <div className="bg-white p-5 rounded-2xl border border-[#74777F]/20 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Next Monthly EMI
              </span>
              <span className="w-8 h-8 rounded-full bg-[#FAF0E1] flex items-center justify-center text-[#A8742A]">
                <Calendar className="w-4 h-4" />
              </span>
            </div>

            <div className="pt-1">
              <AnimatedMaskedValue
                value={totalMonthlyEmiFormatted}
                isMasked={isMasked}
                maskString="••••••"
                currency="ARTH"
                className="font-mono font-bold text-2xl text-[#A8742A]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#74777F]/10 flex items-center justify-between text-xs text-[#5C574F]">
            <span>Due: {nextDueDate}</span>
            <span className="text-[#43474E] font-medium">Auto-debit enabled</span>
          </div>
        </div>

        {/* Metric 3: Sovereign Credit Score */}
        <div className="bg-white p-5 rounded-2xl border border-[#74777F]/20 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Sovereign Credit Score
              </span>
              <span className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#137333]">
                <Award className="w-4 h-4" />
              </span>
            </div>

            <div className="pt-1 flex items-baseline gap-2">
              <span className="font-mono font-bold text-2xl text-[#121C28]">785</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#137333]/10 text-[#137333]">
                TIER 1 • EXCELLENT
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#74777F]/10 flex items-center justify-between text-xs text-[#5C574F]">
            <span>DTI Ratio: 18.4% (Max 50%)</span>
            <span className="text-[#10B981] font-medium">Prime Tier</span>
          </div>
        </div>

        {/* Metric 4: Pre-Approved Borrowing Power */}
        <div className="bg-white p-5 rounded-2xl border border-[#74777F]/20 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Borrowing Capacity
              </span>
              <span className="w-8 h-8 rounded-full bg-[#EDE7F6] flex items-center justify-center text-[#3B3278]">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>

            <div className="pt-1">
              <AnimatedMaskedValue
                value="500,000.00"
                isMasked={isMasked}
                maskString="••••••••"
                currency="ARTH"
                className="font-mono font-bold text-2xl text-[#3B3278]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#74777F]/10 flex items-center justify-between text-xs text-[#5C574F]">
            <span>Sanction Cap: 500k ARTH</span>
            <span className="text-[#3B3278] font-semibold">Pre-Underwritten</span>
          </div>
        </div>
      </div>
    </section>
  );
};
