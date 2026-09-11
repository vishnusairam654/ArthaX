'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FileText, 
  RefreshCw, 
  TrendingUp, 
  Clock, 
  Sparkles,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { UserFdDto } from '@arthax/types';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface ActiveFdContractsListProps {
  isMasked: boolean;
  contracts?: UserFdDto[];
  isLoading?: boolean;
  onOpenEarlyLiquidation: (fdId: string) => void;
  onOpenRenewModal: (fdId: string) => void;
  onOpenBookingModal?: () => void;
}

const BANK_NAMES: Record<string, string> = {
  samaya: 'SAMAYA Sovereign Bank',
  nava: 'NAVA Commercial Bank',
  setu: 'SETU Interbank Core',
  sthira: 'STHIRA Custody Bank',
  vayu: 'VAYU Settlement Node',
};

const BANK_LOGOS: Record<string, string> = {
  samaya: '/assets/banks/samaya_bank.png',
  nava: '/assets/banks/nava_bank.png',
  setu: '/assets/banks/setu_bank.png',
  sthira: '/assets/banks/sthira_bank.png',
  vayu: '/assets/banks/vayu_bank.png',
};

export const ActiveFdContractsList: React.FC<ActiveFdContractsListProps> = ({
  isMasked,
  contracts = [],
  isLoading = false,
  onOpenEarlyLiquidation,
  onOpenRenewModal,
  onOpenBookingModal,
}) => {
  const activeContracts = contracts.filter((c) => c.status === 'ACTIVE');
  const autoRenewCount = contracts.filter((c) => c.status === 'ACTIVE' && c.autoRenew).length;

  return (
    <section id="active-deposits" className="w-full mb-8 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="font-serif text-2xl text-[#022448] font-bold tracking-tight">
            Active Fixed Deposits
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#5C574F]">
            {contracts.length > 0 
              ? `${activeContracts.length} live sovereign term contracts verified on Core Ledger.`
              : 'Institutional term deposit contracts anchored to the Sovereign System Pool.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {contracts.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-[#E5EFFF] font-mono text-xs text-[#1E3A5F] font-medium border border-[#74777F]/20">
              Auto-Renewal Mandates: <strong className="text-[#121C28]">{autoRenewCount} Scheduled</strong>
            </span>
          )}
          {onOpenBookingModal && (
            <button
              onClick={onOpenBookingModal}
              type="button"
              className="px-3.5 py-1.5 rounded-full bg-[#1E3A5F] hover:bg-[#022448] text-white font-sans text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Deposit</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-12 border border-[#74777F]/20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1E3A5F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-sans text-xs text-[#5C574F]">Synchronizing sovereign deposit contracts with Core Ledger...</p>
        </div>
      )}

      {/* Empty State: Canonical /assets/illustrations/no_FD.png per Invariants */}
      {!isLoading && contracts.length === 0 && (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#74777F]/20 shadow-2xs text-center space-y-6">
          <div className="mx-auto w-48 h-48 sm:w-56 sm:h-56 relative flex items-center justify-center">
            <Image
              src="/assets/illustrations/no_FD.png"
              alt="No Sovereign Fixed Deposits"
              width={224}
              height={224}
              className="object-contain drop-shadow-sm max-h-56 w-auto"
              priority
            />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl text-[#022448] font-bold">
              No Sovereign Deposits Active
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5C574F] leading-relaxed">
              Deploy reserve capital into institutional term certificates with guaranteed quarterly compounding yield across the five chartered commercial banks.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={onOpenBookingModal}
              type="button"
              className="px-6 py-2.5 rounded-full bg-[#1E3A5F] hover:bg-[#022448] text-white font-sans text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book First Fixed Deposit</span>
            </button>
          </div>
        </div>
      )}

      {/* Dynamic List of Fixed Deposit Contracts */}
      {!isLoading && contracts.map((contract) => {
        const bankKey = (contract.bankId || 'samaya').toLowerCase();
        const bankName = BANK_NAMES[bankKey] || 'Chartered Commercial Bank';
        const bankLogo = BANK_LOGOS[bankKey] || '/assets/banks/samaya_bank.png';

        const startDate = new Date(contract.startDate).getTime();
        const maturityDate = new Date(contract.maturityDate).getTime();
        const now = Date.now();
        const totalDuration = Math.max(1, maturityDate - startDate);
        const elapsedDuration = Math.min(totalDuration, Math.max(0, now - startDate));
        const progressPct = Math.min(100, Math.round((elapsedDuration / totalDuration) * 100));
        const daysRemaining = Math.max(0, Math.ceil((maturityDate - now) / (1000 * 60 * 60 * 24)));

        const isExpiringSoon = contract.status === 'ACTIVE' && daysRemaining <= 30;
        const isMatured = contract.status === 'MATURED' || (contract.status === 'ACTIVE' && daysRemaining === 0);
        const isClosed = contract.status === 'BROKEN';

        const principalFormatted = (Number(contract.principalMinor) / 100).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const accruedFormatted = (Number(contract.accruedInterestMinor || 0) / 100).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const maturityFormatted = (Number(contract.maturityPayoutMinor || contract.maturityAmountMinor || 0) / 100).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const formattedMaturityDate = new Date(contract.maturityDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        return (
          <div
            key={contract.id}
            className={`bg-white rounded-2xl p-6 border shadow-2xs hover:shadow-xs transition-all space-y-5 relative ${
              isExpiringSoon
                ? 'border-[#B5482E]/30'
                : 'border-[#74777F]/20'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center justify-center p-2 shrink-0 shadow-2xs">
                  <Image 
                    src={bankLogo} 
                    alt={`${bankName} Emblem`} 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-lg text-[#022448] font-bold tracking-tight">
                      {bankName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2F3FA] text-[#5C574F] font-mono text-xs border border-[#74777F]/15">
                      #{contract.depositNumber || contract.certificateNumber}
                    </span>

                    {/* Status Pill */}
                    {contract.status === 'ACTIVE' && !isExpiringSoon && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#287A55]/10 text-[#287A55] font-mono text-xs font-semibold flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#287A55] animate-pulse"></span>
                        Active &amp; Accruing
                      </span>
                    )}

                    {isExpiringSoon && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#B5482E]/10 text-[#B5482E] font-mono text-xs font-semibold flex items-center gap-1.5 border border-[#B5482E]/20">
                        <Clock className="w-3.5 h-3.5" />
                        Maturity in {daysRemaining}d
                      </span>
                    )}

                    {isMatured && contract.status !== 'BROKEN' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#A8742A]/10 text-[#A8742A] font-mono text-xs font-semibold flex items-center gap-1.5 border border-[#A8742A]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Matured
                      </span>
                    )}

                    {isClosed && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#74777F]/10 text-[#5C574F] font-mono text-xs font-semibold flex items-center gap-1.5">
                        Liquidated / Broken
                      </span>
                    )}

                    {/* Pet Booster Pill */}
                    {(contract.petBoosterApy ?? 0) > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#A8742A]/15 text-[#A8742A] font-mono text-[11px] font-bold flex items-center gap-1 border border-[#A8742A]/30">
                        <Sparkles className="w-3 h-3" />
                        +{(contract.petBoosterApy ?? 0).toFixed(2)}% Pet Booster
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-[#5C574F]">
                    Quarterly Compounding • Sovereign System Pool Custody ({contract.tenureDays ?? 365} Days Horizon)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
                <Link
                  href={`/user/fixed-deposits/${contract.depositNumber || contract.certificateNumber || contract.id}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#F2F3FA] hover:bg-[#E5EFFF] text-[#1E3A5F] font-medium text-xs transition-colors flex items-center gap-1.5 border border-[#74777F]/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Certificate</span>
                </Link>

                {contract.status === 'ACTIVE' && (
                  <>
                    <button
                      onClick={() => onOpenRenewModal(contract.id)}
                      type="button"
                      className={`px-3.5 py-1.5 rounded-full font-medium text-xs transition-colors flex items-center gap-1.5 border cursor-pointer ${
                        contract.autoRenew
                          ? 'bg-[#022448] text-white hover:bg-[#1E3A5F] border-[#022448]'
                          : 'bg-[#E5EFFF] hover:bg-[#D9E3F4] text-[#1E3A5F] border-[#74777F]/20'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{contract.autoRenew ? 'Auto-Renew Active' : 'Renew Mandate'}</span>
                    </button>

                    <button
                      onClick={() => onOpenEarlyLiquidation(contract.id)}
                      type="button"
                      className="px-3.5 py-1.5 rounded-full bg-[#F8F9FF] hover:bg-[#B5482E]/10 hover:text-[#B5482E] text-[#5C574F] font-medium text-xs transition-colors border border-[#74777F]/20 cursor-pointer"
                    >
                      Early Liquidation
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Financial Metrics Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-[#F8F9FF] rounded-xl border border-[#74777F]/10">
              <div className="space-y-0.5">
                <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
                  Locked Principal
                </span>
                <AnimatedMaskedValue
                  value={principalFormatted}
                  isMasked={isMasked}
                  maskString="••••••••"
                  className="font-mono text-sm sm:text-base text-[#121C28] font-bold"
                  suffix={<span className="text-xs font-normal text-[#5C574F] ml-1">ARTH</span>}
                />
                <span className="font-mono text-[10px] text-[#74777F] block">sys_fd_pool escrow</span>
              </div>

              <div className="space-y-0.5">
                <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
                  Effective APY
                </span>
                <div className="font-serif text-sm sm:text-base text-[#287A55] font-bold flex items-center gap-1">
                  {(contract.effectiveApy ?? contract.apy ?? 7.25).toFixed(2)}%
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="font-sans text-[10px] text-[#5C574F] block">Quarterly Compounded</span>
              </div>

              <div className="space-y-0.5">
                <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
                  Accrued to Date
                </span>
                <AnimatedMaskedValue
                  value={`+${accruedFormatted}`}
                  isMasked={isMasked}
                  maskString="••••••"
                  className="font-mono text-sm sm:text-base text-[#287A55] font-bold"
                  suffix={<span className="text-xs font-normal text-[#5C574F] ml-1">ARTH</span>}
                />
                <span className="font-sans text-[10px] text-[#74777F] block">Daily ledger accrual</span>
              </div>

              <div className="space-y-0.5">
                <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
                  Maturity Payout
                </span>
                <AnimatedMaskedValue
                  value={maturityFormatted}
                  isMasked={isMasked}
                  maskString="••••••••"
                  className="font-mono text-sm sm:text-base text-[#022448] font-bold"
                  suffix={<span className="text-xs font-normal text-[#5C574F] ml-1">ARTH</span>}
                />
                <span className="font-sans text-[10px] text-[#74777F] block">Guaranteed terminal value</span>
              </div>

              <div className="space-y-0.5 col-span-2 md:col-span-1">
                <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
                  Maturity Horizon
                </span>
                <div className={`font-sans text-sm font-semibold ${isExpiringSoon ? 'text-[#B5482E]' : 'text-[#121C28]'}`}>
                  {formattedMaturityDate}
                </div>
                <span className={`font-mono text-[10px] block ${isExpiringSoon ? 'text-[#B5482E] font-bold' : 'text-[#1E3A5F]'}`}>
                  {daysRemaining} days remaining
                </span>
              </div>
            </div>

            {/* Linear Tenure Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs text-[#5C574F]">
                <span>Contract Progress ({progressPct}% Elapsed)</span>
                <span className="text-[11px] text-[#74777F]">Cert Hash: {contract.certificateHash?.slice(0, 10)}...</span>
              </div>
              <div className="w-full bg-[#E5EFFF] h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isExpiringSoon ? 'bg-[#B5482E]' : 'bg-[#1E3A5F]'
                  }`} 
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
