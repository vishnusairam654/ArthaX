'use client';

import React from 'react';
import { Wallet, TrendingUp, Percent, Clock, Lock, BarChart3, AlertCircle } from 'lucide-react';
import { UserFdDto } from '@arthax/types';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface FdPortfolioMetricsProps {
  isMasked: boolean;
  contracts?: UserFdDto[];
}

export const FdPortfolioMetrics: React.FC<FdPortfolioMetricsProps> = ({ isMasked, contracts }) => {
  const hasContracts = contracts !== undefined;
  const activeContracts = hasContracts ? contracts.filter((c) => c.status === 'ACTIVE') : [];

  const totalPrincipalMinor = hasContracts
    ? activeContracts.reduce((sum, c) => sum + Number(c.principalMinor || 0), 0)
    : 24500000;

  const totalAccruedMinor = hasContracts
    ? contracts.reduce((sum, c) => sum + Number(c.accruedInterestMinor || 0), 0)
    : 1482045;

  const weightedApy = totalPrincipalMinor > 0 && hasContracts
    ? activeContracts.reduce((sum, c) => sum + (c.effectiveApy ?? c.apy ?? 7.25) * Number(c.principalMinor || 0), 0) / totalPrincipalMinor
    : hasContracts && activeContracts.length === 0 ? 0 : 7.15;

  const activeCount = hasContracts ? activeContracts.length : 3;

  const totalPrincipalFormatted = (totalPrincipalMinor / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const totalAccruedFormatted = (totalAccruedMinor / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section className="w-full mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Total Term Capital */}
        <div className="bg-white p-5 rounded-2xl border border-[#74777F]/20 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Total Term Capital
              </span>
              <span className="w-8 h-8 rounded-full bg-[#E5EFFF] flex items-center justify-center text-[#1E3A5F]">
                <Wallet className="w-4 h-4" />
              </span>
            </div>

            <div className="pt-1">
              <AnimatedMaskedValue
                value={totalPrincipalFormatted}
                isMasked={isMasked}
                maskString="••••••••"
                className="font-serif text-2xl sm:text-3xl text-[#022448] font-bold tracking-tight"
                suffix={<span className="font-mono text-sm text-[#5C574F] font-medium ml-1.5">ARTH</span>}
              />
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-[#74777F]/10 flex items-center justify-between text-xs">
            <div className="text-[#5C574F]">
              Parity:{' '}
              <strong className="text-[#121C28]">
                {isMasked ? '$•••••• USD' : `$${totalPrincipalFormatted} USD`}
              </strong>
            </div>
            <span className="text-[#287A55] font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              100% Backed
            </span>
          </div>
        </div>

        {/* Metric 2: Interest Accrued All-Time */}
        <div className="bg-white p-5 rounded-2xl border border-[#74777F]/20 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Interest Accrued (All-Time)
              </span>
              <span className="w-8 h-8 rounded-full bg-[#287A55]/10 flex items-center justify-center text-[#287A55]">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>

            <div className="pt-1">
              <AnimatedMaskedValue
                value={`+${totalAccruedFormatted}`}
                isMasked={isMasked}
                maskString="••••••••"
                className="font-serif text-2xl sm:text-3xl text-[#287A55] font-bold tracking-tight"
                suffix={<span className="font-mono text-sm text-[#5C574F] font-medium ml-1.5">ARTH</span>}
              />
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-[#74777F]/10 flex items-center justify-between text-xs">
            <div className="text-[#5C574F]">
              Compounding:{' '}
              <strong className="text-[#121C28]">
                Quarterly ISO 20022
              </strong>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#287A55]/10 text-[#287A55] font-mono text-[10px] font-semibold">
              Real-Time
            </span>
          </div>
        </div>

        {/* Metric 3: Weighted Average Yield */}
        <div className="bg-white p-5 rounded-2xl border border-[#74777F]/20 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Weighted Average Yield
              </span>
              <span className="w-8 h-8 rounded-full bg-[#A8742A]/10 flex items-center justify-center text-[#A8742A]">
                <Percent className="w-4 h-4" />
              </span>
            </div>

            <div className="pt-1 flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl text-[#022448] font-bold tracking-tight">
                {weightedApy > 0 ? `${weightedApy.toFixed(2)}%` : '0.00%'}
              </span>
              <span className="font-mono text-xs text-[#A8742A] font-semibold">
                APY Net
              </span>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-[#74777F]/10 flex items-center justify-between text-xs">
            <div className="text-[#5C574F]">
              Benchmark Delta: <span className="text-[#287A55] font-semibold">+185 bps</span> vs Central Repo
            </div>
            <BarChart3 className="w-4 h-4 text-[#74777F]" />
          </div>
        </div>

        {/* Metric 4: Active Contracts */}
        <div className="bg-white p-5 rounded-2xl border border-[#74777F]/20 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Active Contracts
              </span>
              <span className="w-8 h-8 rounded-full bg-[#E5EFFF] flex items-center justify-center text-[#1E3A5F]">
                <Clock className="w-4 h-4" />
              </span>
            </div>

            <div className="pt-1 flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl text-[#022448] font-bold tracking-tight">
                {activeCount} Active
              </span>
              <span className="font-mono text-xs text-[#5C574F]">
                {hasContracts ? `of ${contracts.length} Total` : '/ 5 Allocations'}
              </span>
            </div>
          </div>

          <div className="pt-2 mt-2 bg-[#E5EFFF]/60 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs border border-[#1E3A5F]/15">
            <div className="flex items-center gap-1.5 text-[#1E3A5F] font-medium text-[11px]">
              <Lock className="w-3.5 h-3.5 text-[#A8742A] shrink-0" />
              <span>
                Escrow Custody: <strong>sys_fd_pool</strong>
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#287A55] font-bold uppercase">SECURED</span>
          </div>
        </div>
      </div>
    </section>
  );
};
