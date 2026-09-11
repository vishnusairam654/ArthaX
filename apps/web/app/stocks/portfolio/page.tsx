'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Wallet,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { LISTED_COMPANIES } from '@/components/stocks/StockData';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

export default function StockPortfolioPage() {
  // Rule 15: Masked by default
  const [isMasked, setIsMasked] = useState<boolean>(true);

  const toggleMask = () => setIsMasked(prev => !prev);

  const holdings = [
    {
      symbol: 'NILA',
      name: 'NILA Systems Ltd',
      shares: 450,
      avgPrice: 118.40,
      currentPrice: 142.50,
      totalInvestment: 53280.00,
      currentValuation: 64125.00,
      unrealizedPnl: 10845.00,
      unrealizedPercent: 20.35,
      isPositive: true,
      dividendsAccrued: 652.50,
    },
    {
      symbol: 'ARKA',
      name: 'Arka Energy Sovereign',
      shares: 300,
      avgPrice: 142.00,
      currentPrice: 164.80,
      totalInvestment: 42600.00,
      currentValuation: 49440.00,
      unrealizedPnl: 6840.00,
      unrealizedPercent: 16.06,
      isPositive: true,
      dividendsAccrued: 890.00,
    },
    {
      symbol: 'MERU',
      name: 'Meru Capital Reserve',
      shares: 40,
      avgPrice: 480.00,
      currentPrice: 512.00,
      totalInvestment: 19200.00,
      currentValuation: 20480.00,
      unrealizedPnl: 1280.00,
      unrealizedPercent: 6.67,
      isPositive: true,
      dividendsAccrued: 696.00,
    },
    {
      symbol: 'TRNG',
      name: 'Tarang Mobility Ltd',
      shares: 200,
      avgPrice: 85.00,
      currentPrice: 89.20,
      totalInvestment: 17000.00,
      currentValuation: 17840.00,
      unrealizedPnl: 840.00,
      unrealizedPercent: 4.94,
      isPositive: true,
      dividendsAccrued: 306.00,
    },
    {
      symbol: 'KSHT',
      name: 'Kshiti Infra Ports',
      shares: 60,
      avgPrice: 355.00,
      currentPrice: 340.50,
      totalInvestment: 21300.00,
      currentValuation: 20430.00,
      unrealizedPnl: -870.00,
      unrealizedPercent: -4.08,
      isPositive: false,
      dividendsAccrued: 450.00,
    },
  ];

  const totalPortfolioValuation = holdings.reduce((acc, h) => acc + h.currentValuation, 0);
  const totalCostBasis = holdings.reduce((acc, h) => acc + h.totalInvestment, 0);
  const totalPnl = totalPortfolioValuation - totalCostBasis;
  const totalPnlPercent = ((totalPnl / totalCostBasis) * 100);

  return (
    <div className="space-y-6">
      {/* 1. VALUATION & CAPITAL ALLOCATION HERO */}
      <section className="bg-white rounded-2xl border border-[#173F35]/12 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#173F35]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#173F35] text-white flex items-center justify-center font-bold shadow-xs">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-xl text-[#173F35]">
                  Portfolio Valuation &amp; Capital Allocation
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#DCEEE8] text-[#173F35] font-mono text-[10px] font-bold">
                  DVP SETTLED
                </span>
              </div>
              <p className="text-xs text-[#717975]">
                Sovereign securities title deeds registered under SETU Central Depository Enclave.
              </p>
            </div>
          </div>

          {/* Privacy Eye Toggle (Rule 15) */}
          <button
            type="button"
            onClick={toggleMask}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition border ${
              isMasked 
                ? 'bg-[#A8742A]/10 border-[#A8742A]/30 text-[#A8742A] hover:bg-[#A8742A]/20' 
                : 'bg-[#FAF8F5] border-[#173F35]/20 text-[#173F35] hover:bg-gray-100'
            }`}
          >
            {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isMasked ? "Balances Masked" : "Balances Visible"}</span>
          </button>
        </div>

        {/* Valuation Numbers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#173F35]/10">
            <span className="text-[10px] font-mono text-[#717975] uppercase">Aggregate Equities Value</span>
            <div className="font-mono font-bold text-2xl text-[#173F35] mt-1 flex items-baseline gap-1">
              <AnimatedMaskedValue value={totalPortfolioValuation} isMasked={isMasked} maskString="••••••••" />
              <span className="text-xs text-[#A8742A]">ARTH</span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#173F35]/10">
            <span className="text-[10px] font-mono text-[#717975] uppercase">Total Unrealized Gains</span>
            <div className="font-mono font-bold text-2xl text-[#287A55] mt-1 flex items-baseline gap-1">
              +<AnimatedMaskedValue value={totalPnl} isMasked={isMasked} maskString="••••••" />
              <span className="text-xs">ARTH (+{totalPnlPercent.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#173F35]/10">
            <span className="text-[10px] font-mono text-[#717975] uppercase">Day's Realized Gain</span>
            <div className="font-mono font-bold text-2xl text-[#287A55] mt-1 flex items-baseline gap-1">
              +<AnimatedMaskedValue value={2150.00} isMasked={isMasked} maskString="••••••" />
              <span className="text-xs">ARTH (+1.52%)</span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#173F35]/10">
            <span className="text-[10px] font-mono text-[#717975] uppercase">Available DvP Cash Pool</span>
            <div className="font-mono font-bold text-2xl text-[#1A1C18] mt-1 flex items-baseline gap-1">
              <AnimatedMaskedValue value={38450.00} isMasked={isMasked} maskString="••••••" />
              <span className="text-xs text-[#A8742A]">ARTH</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTOR ALLOCATION & PRUDENTIAL WEIGHTING STRIP */}
      <section className="bg-white rounded-2xl border border-[#173F35]/12 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-base text-[#173F35]">
              Prudential Sector Allocation
            </h3>
            <span className="px-2 py-0.5 rounded bg-[#DCEEE8] text-[#173F35] font-mono text-[10px] font-bold">
              MAX 35% CAP
            </span>
          </div>
          <span className="text-xs font-mono text-[#2F7468] font-semibold">
            All Sectors within Regulatory Risk Limits
          </span>
        </div>

        {/* Multi-Segment Weighted Bar */}
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden flex">
          <div className="h-full bg-[#173F35]" style={{ width: '37%' }} title="Tech & Space Mesh: 37%" />
          <div className="h-full bg-[#287A55]" style={{ width: '28%' }} title="Clean Energy: 28%" />
          <div className="h-full bg-[#A8742A]" style={{ width: '12%' }} title="Merchant Banking: 12%" />
          <div className="h-full bg-[#2F7468]" style={{ width: '11%' }} title="Electric Rail: 11%" />
          <div className="h-full bg-[#66A3BF]" style={{ width: '12%' }} title="Maritime Ports: 12%" />
        </div>

        {/* Sector Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#173F35]"></span>
            <span>Tech: 37%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#287A55]"></span>
            <span>Energy: 28%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8742A]"></span>
            <span>Banking: 12%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F7468]"></span>
            <span>Rail: 11%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#66A3BF]"></span>
            <span>Ports: 12%</span>
          </div>
        </div>
      </section>

      {/* 3. REGISTERED EQUITIES HOLDINGS TABLE */}
      <section className="bg-white rounded-2xl border border-[#173F35]/12 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#173F35]/10 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#173F35]">
            Registered Sovereign Holdings Ledger
          </h3>
          <span className="text-xs font-mono text-[#717975]">
            {holdings.length} Securities Held
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#FAF8F5] text-[#717975] font-mono font-bold border-b border-[#173F35]/10 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4 text-right">Shares Held</th>
                <th className="py-3 px-4 text-right">Avg Buy Price</th>
                <th className="py-3 px-4 text-right">Market Price</th>
                <th className="py-3 px-4 text-right">Total Cost Basis</th>
                <th className="py-3 px-4 text-right">Current Valuation</th>
                <th className="py-3 px-4 text-right">Unrealized P&amp;L</th>
                <th className="py-3 px-4 text-right">Dividends</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173F35]/10 font-mono">
              {holdings.map((h) => {
                const comp = LISTED_COMPANIES[h.symbol];
                return (
                  <tr key={h.symbol} className="hover:bg-[#FAF8F5] transition">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        {comp && (
                          <div className="w-8 h-8 rounded-lg bg-white p-1 border border-[#173F35]/10 flex items-center justify-center shrink-0">
                            <Image
                              src={comp.logo}
                              alt={h.symbol}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[#173F35]">{h.name}</div>
                          <div className="text-[10px] font-mono text-[#717975]">{h.symbol}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#1A1C18]">
                      {h.shares}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {h.avgPrice.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#173F35]">
                      {h.currentPrice.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <AnimatedMaskedValue value={h.totalInvestment} isMasked={isMasked} maskString="••••••" />
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#1A1C18]">
                      <AnimatedMaskedValue value={h.currentValuation} isMasked={isMasked} maskString="••••••" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className={`font-bold ${h.isPositive ? 'text-[#287A55]' : 'text-[#B94A43]'}`}>
                        {h.isPositive ? '+' : ''}
                        <AnimatedMaskedValue value={h.unrealizedPnl} isMasked={isMasked} maskString="••••••" />
                      </div>
                      <div className={`text-[10px] ${h.isPositive ? 'text-[#287A55]' : 'text-[#B94A43]'}`}>
                        {h.isPositive ? '+' : ''}{h.unrealizedPercent.toFixed(2)}%
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#287A55]">
                      <AnimatedMaskedValue value={h.dividendsAccrued} isMasked={isMasked} maskString="••••" />
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        href={`/stocks/${h.symbol}`}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#DCEEE8] text-[#173F35] font-bold border border-[#173F35]/15 text-xs transition"
                      >
                        Trade
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. DEPOSITORY ENCLAVE & CLEARING GUARANTEE */}
      <section className="bg-[#112822] text-[#DCEEE8] rounded-2xl p-5 border border-[#1C3E34] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#173F35] text-[#10B981] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">SETU Central Depository Certified</div>
            <div className="text-[#82AA9D] text-[11px]">
              Certificate #SETU-DEP-9941 • 100% Reserve Title Segregation Enforced
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-[#10B981] font-bold">ALL TITLE DEEDS IMMUTABLE</span>
        </div>
      </section>
    </div>
  );
}
