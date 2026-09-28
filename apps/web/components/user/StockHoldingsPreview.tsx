'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { TrendingUp, ArrowRight, LineChart } from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';
import { apiFetchUserPortfolio, subscribePortalDataInvalidation } from '@/lib/api';
import { UserPortfolioSummaryDto, PortfolioHoldingDto } from '@arthax/types';

interface StockHoldingsPreviewProps {
  isMasked: boolean;
}

export const StockHoldingsPreview: React.FC<StockHoldingsPreviewProps> = ({ isMasked }) => {
  const [portfolio, setPortfolio] = useState<UserPortfolioSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadPortfolio = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetchUserPortfolio();
      setPortfolio(data);
    } catch {
      setPortfolio({
        totalInvestedMinor: '0',
        currentValueMinor: '0',
        totalUnrealizedProfitLossMinor: '0',
        totalReturnPercent: 0,
        holdings: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
    const unsub = subscribePortalDataInvalidation(loadPortfolio);
    return () => unsub();
  }, [loadPortfolio]);

  const holdings = portfolio?.holdings || [];
  const investedArth = (Number(BigInt(portfolio?.totalInvestedMinor || '0')) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const valueArth = (Number(BigInt(portfolio?.currentValueMinor || '0')) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const pnlArth = (Number(BigInt(portfolio?.totalUnrealizedProfitLossMinor || '0')) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const returnPct = (portfolio?.totalReturnPercent || 0).toFixed(2);
  const isPnlPositive = (portfolio?.totalReturnPercent || 0) >= 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 space-y-5" id="stock-portfolio">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#74777F]">
            Equity Portal
          </span>
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#022448]">
              Sovereign Stock Holdings
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="font-sans text-xs text-[#74777F]">Unrealized P/L</span>
          <p className={`font-mono text-xs sm:text-sm font-bold ${isPnlPositive ? 'text-[#10B981]' : 'text-[#B5482E]'}`}>
            <AnimatedMaskedValue value={`${isPnlPositive ? '+' : ''}${pnlArth} ARTH`} isMasked={isMasked} maskString="••••••" /> ({isPnlPositive ? '+' : ''}{returnPct}%)
          </p>
        </div>
      </div>

      {/* Capital Allocation Strip */}
      <div className="grid grid-cols-2 gap-3 bg-[#F8F9FF] border border-[#74777F]/15 p-3 rounded-2xl font-mono text-xs">
        <div>
          <span className="text-[#74777F] block">Invested Capital</span>
          <div className="font-bold text-[#121C28] mt-0.5 flex items-baseline gap-1">
            <AnimatedMaskedValue value={investedArth} isMasked={isMasked} maskString="••••••••" /> ARTH
          </div>
        </div>
        <div>
          <span className="text-[#74777F] block">Market Valuation</span>
          <div className="font-bold text-[#1E3A5F] mt-0.5 flex items-baseline gap-1">
            <AnimatedMaskedValue value={valueArth} isMasked={isMasked} maskString="••••••••" /> ARTH
          </div>
        </div>
      </div>

      {/* Stock Cards List or Real Empty State */}
      {isLoading ? (
        <div className="py-8 text-center font-mono text-xs text-[#74777F]">
          Querying sovereign equity portfolio...
        </div>
      ) : holdings.length === 0 ? (
        <div className="py-8 px-5 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15 text-center space-y-2">
          <LineChart className="w-7 h-7 text-[#74777F]/40 mx-auto" />
          <p className="font-sans text-xs font-semibold text-[#121C28]">No Equity Holdings</p>
          <p className="font-mono text-[11px] text-[#74777F] max-w-xs mx-auto">
            You hold 0 equity shares. Sovereign market participants can deploy capital via the trading floor.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {holdings.map((h: PortfolioHoldingDto) => {
            const hVal = (Number(BigInt(h.currentValueMinor)) / 100).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            const hGain = (h.unrealizedProfitLossPercent || 0).toFixed(1);
            const isGainPos = (h.unrealizedProfitLossPercent || 0) >= 0;
            return (
              <div
                key={h.symbol}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 hover:bg-[#EEF4FF] hover:border-[#1E3A5F]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#74777F]/20 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs font-mono font-bold text-xs text-[#022448]">
                    {h.symbol.slice(0, 4)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-semibold text-[#121C28]">
                      {h.symbol}
                    </span>
                    <span className="font-mono text-[11px] text-[#43474E]">
                      {h.shares} Shares Held
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-[#121C28] flex items-baseline justify-end gap-1">
                    <AnimatedMaskedValue value={hVal} isMasked={isMasked} maskString="••••••" /> ARTH
                  </div>
                  <span className={`font-mono text-[11px] font-semibold ${isGainPos ? 'text-[#10B981]' : 'text-[#B5482E]'}`}>
                    {isGainPos ? '+' : ''}{hGain}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action to Stock Portal */}
      <a
        href="/stocks"
        className="w-full py-2.5 px-4 rounded-full bg-[#DBE1FF] text-[#031847] hover:bg-[#B4C5FD] font-sans text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
      >
        <span>Launch Full Stock Portal Trading Terminal</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};
