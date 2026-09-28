'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Coins, BarChart3, Plus, ArrowRight } from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';
import { AnimatedProgressBar } from './AnimatedProgressBar';
import { apiFetchUserFds, subscribePortalDataInvalidation } from '@/lib/api';
import { UserFdDto } from '@arthax/types';

interface FixedDepositsPreviewProps {
  isMasked: boolean;
}

export const FixedDepositsPreview: React.FC<FixedDepositsPreviewProps> = ({ isMasked }) => {
  const [fds, setFds] = useState<UserFdDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadFds = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetchUserFds();
      if (Array.isArray(data)) {
        setFds(data.filter((f) => f.status === 'ACTIVE'));
      } else {
        setFds([]);
      }
    } catch {
      setFds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFds();
    const unsub = subscribePortalDataInvalidation(loadFds);
    return () => unsub();
  }, [loadFds]);

  const lockedMinor = fds.reduce((sum, f) => sum + BigInt(f.principalMinor || 0), 0n);
  const lockedArth = Number(lockedMinor) / 100;
  const lockedArthStr = lockedArth.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 space-y-5" id="fixed-deposits">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[#74777F]">
            Term Deposits
          </span>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#022448]">
              Fixed Deposits (FD) Vaults
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="font-sans text-xs text-[#74777F]">Locked Value</span>
          <p className="font-mono text-base font-bold text-[#121C28] flex items-baseline justify-end gap-1">
            <AnimatedMaskedValue value={lockedArthStr} isMasked={isMasked} maskString="••••••••" />{' '}
            <span className="text-xs font-normal text-[#43474E]">ARTH</span>
          </p>
        </div>
      </div>

      {/* FD Cards or Real Empty State */}
      {isLoading ? (
        <div className="py-8 text-center font-mono text-xs text-[#74777F]">
          Querying active term deposit contracts...
        </div>
      ) : fds.length === 0 ? (
        <div className="py-8 px-5 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15 text-center space-y-2">
          <Coins className="w-7 h-7 text-[#74777F]/40 mx-auto" />
          <p className="font-sans text-xs font-semibold text-[#121C28]">No Active Fixed Deposits</p>
          <p className="font-mono text-[11px] text-[#74777F] max-w-xs mx-auto">
            Lock idle liquid ARTH into sovereign term vaults across NAVA or SAMAYA to earn protocol-backed yield.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fds.map((fd) => {
            const principalArth = (Number(fd.principalMinor) / 100).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            const accruedArth = (Number(fd.accruedInterestMinor || 0) / 100).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            const apyPct = (Number(fd.apy || 0)).toFixed(2);
            return (
              <div
                key={fd.id}
                className="bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl p-4 space-y-2 hover:border-[#1E3A5F]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-semibold text-[#121C28]">
                    {fd.bankId?.toUpperCase()} Term #{fd.depositNumber || fd.id.slice(0, 8)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-mono text-[10px] font-bold">
                    {apyPct}% APY
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#43474E] font-mono pt-1">
                  <span className="inline-flex items-baseline gap-1">
                    Principal: <AnimatedMaskedValue value={principalArth} isMasked={isMasked} maskString="••••••" /> ARTH
                  </span>
                  <span className="font-semibold text-[#121C28]">Tenure: {fd.tenureDays}d</span>
                </div>

                <div className="flex items-center justify-between font-mono text-xs pt-1">
                  <span className="text-[#74777F]">Accrued to date</span>
                  <span className="text-[#10B981] font-semibold">
                    <AnimatedMaskedValue value={`+${accruedArth} ARTH`} isMasked={isMasked} maskString="••••" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1">
        <button 
          type="button" 
          className="text-[#1E3A5F] font-sans text-xs font-semibold hover:underline flex items-center gap-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Compare Bank Rates</span>
        </button>
        <button 
          type="button" 
          className="px-4 py-2 bg-[#022448] text-white rounded-full font-sans text-xs font-medium hover:bg-[#1E3A5F] transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Fixed Deposit</span>
        </button>
      </div>
    </div>
  );
};
