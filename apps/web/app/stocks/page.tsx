'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  Bolt, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { LISTED_COMPANIES, ListedCompany } from '@/components/stocks/StockData';
import { InteractiveCandleChart } from '@/components/stocks/trading/InteractiveCandleChart';
import { InteractiveOrderBook } from '@/components/stocks/trading/InteractiveOrderBook';
import { InstitutionalTradingDock } from '@/components/stocks/trading/InstitutionalTradingDock';

export default function StockPortalLiveTradingFloor() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NILA');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const activeCompany: ListedCompany = LISTED_COMPANIES[selectedSymbol] || LISTED_COMPANIES['NILA'];

  const companiesList = Object.values(LISTED_COMPANIES);

  const filteredCompanies = companiesList.filter((comp) => {
    if (categoryFilter === 'All') return true;
    if (categoryFilter === 'Equities') return comp.category === 'Equities';
    if (categoryFilter === 'Infra') return comp.category === 'Infra';
    if (categoryFilter === 'Energy') return comp.category === 'Energy';
    if (categoryFilter === 'Defense') return comp.category === 'Defense';
    if (categoryFilter === 'Health') return comp.category === 'Health';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. MACRO BENCHMARK & TICKER RIBBON */}
      <section className="w-full bg-white rounded-2xl border border-[#173F35]/12 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-5">
          {/* Benchmark Card */}
          <div className="flex flex-wrap items-center gap-5 border-b xl:border-b-0 xl:border-r border-[#173F35]/10 pb-4 xl:pb-0 xl:pr-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#DCEEE8] text-[#173F35] flex items-center justify-center font-bold shadow-xs">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-base text-[#173F35]">ARTHAX 50</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DCEEE8] text-[#173F35] font-mono">
                    BENCHMARK
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono font-bold text-2xl text-[#1A1C18]">3,842.10</span>
                  <span className="font-mono text-xs font-semibold text-[#287A55] flex items-center">
                    +54.20 (+1.43%)
                  </span>
                </div>
              </div>
            </div>

            {/* 52W Range Micro Bar */}
            <div className="flex flex-col gap-1 w-48 pl-2">
              <div className="flex justify-between text-[10px] font-mono text-[#717975]">
                <span>L: 3,790.40</span>
                <span>H: 3,855.80</span>
              </div>
              <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden border border-[#173F35]/10">
                <div className="bg-gradient-to-r from-[#2F7468] to-[#287A55] h-full rounded-full" style={{ width: '82%' }}></div>
              </div>
              <div className="text-[9px] font-mono text-[#717975] text-right">52W: 3,110.00 — 3,920.00</div>
            </div>
          </div>

          {/* Institutional Metrics Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#717975]">Aggregate Mkt Cap</span>
              <span className="font-mono font-bold text-sm text-[#1A1C18]">
                14.82B <span className="text-[#A8742A] text-xs">ARTH</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#717975]">24h Net Turnover</span>
              <span className="font-mono font-bold text-sm text-[#1A1C18]">
                612.4M <span className="text-[#A8742A] text-xs">ARTH</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#717975]">DvP Clearing Finality</span>
              <span className="font-mono font-bold text-sm text-[#287A55] flex items-center gap-1">
                <Bolt className="w-3.5 h-3.5" /> &lt; 8.24 ms
              </span>
            </div>
          </div>

          {/* Top Movers Pill Strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 xl:pt-0 border-t xl:border-t-0 border-[#173F35]/10">
            <span className="text-[11px] font-bold text-[#717975] uppercase tracking-wider whitespace-nowrap">
              Movers:
            </span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#287A55]/10 border border-[#287A55]/20 text-xs whitespace-nowrap">
              <span className="font-bold text-[#173F35]">NILA</span>
              <span className="font-mono font-bold text-[#287A55]">+4.12%</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#287A55]/10 border border-[#287A55]/20 text-xs whitespace-nowrap">
              <span className="font-bold text-[#173F35]">ARKA</span>
              <span className="font-mono font-bold text-[#287A55]">+5.80%</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#287A55]/10 border border-[#287A55]/20 text-xs whitespace-nowrap">
              <span className="font-bold text-[#173F35]">TRNG</span>
              <span className="font-mono font-bold text-[#287A55]">+2.85%</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#287A55]/10 border border-[#287A55]/20 text-xs whitespace-nowrap">
              <span className="font-bold text-[#173F35]">MERU</span>
              <span className="font-mono font-bold text-[#287A55]">+3.20%</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#B94A43]/10 border border-[#B94A43]/20 text-xs whitespace-nowrap">
              <span className="font-bold text-[#B94A43]">KSHT</span>
              <span className="font-mono font-bold text-[#B94A43]">-0.65%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3-COLUMN INSTITUTIONAL TRADING FLOOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUMN 1: Sovereign Equities Directory (Col-span-3) */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#173F35]/12 p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#173F35]/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] text-[#173F35] flex items-center justify-center">
                <Filter className="w-4 h-4" />
              </div>
              <h2 className="font-serif font-bold text-sm text-[#173F35]">Sovereign Directory</h2>
            </div>
            <span className="text-[11px] font-mono text-[#717975]">10 Equities</span>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-xs">
            {['All', 'Equities', 'Infra', 'Energy', 'Defense', 'Health'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#173F35] text-white font-bold shadow-xs'
                    : 'bg-[#FAF8F5] text-[#4A534F] hover:bg-white border border-[#173F35]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Asset Rows List */}
          <div className="flex flex-col gap-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredCompanies.map((comp) => {
              const isSelected = selectedSymbol === comp.symbol;
              return (
                <div
                  key={comp.symbol}
                  onClick={() => setSelectedSymbol(comp.symbol)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#DCEEE8]/50 border-[#2F7468] shadow-xs'
                      : 'hover:bg-[#FAF8F5] border-transparent hover:border-[#173F35]/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white p-1 border border-[#173F35]/10 flex items-center justify-center shrink-0 shadow-xs relative">
                      <Image
                        src={comp.logo}
                        alt={comp.name}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-[#173F35] truncate leading-tight">
                        {comp.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#717975]">
                        {comp.symbol} • {comp.sector}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-xs text-[#1A1C18]">
                      {comp.price.toFixed(2)}
                    </div>
                    <div className={`font-mono text-[11px] font-semibold ${
                      comp.isPositive ? 'text-[#287A55]' : 'text-[#B94A43]'
                    }`}>
                      {comp.isPositive ? '+' : ''}{comp.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#173F35]/10 flex items-center justify-between text-xs text-[#717975]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> L2 Depth Synced
            </span>
            <Link 
              href="/stocks/companies" 
              className="text-[#173F35] hover:text-[#2F7468] font-semibold flex items-center gap-0.5 text-[11px]"
            >
              <span>Full Directory</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </aside>

        {/* COLUMN 2: Candlestick Chart & Order Book (Col-span-6) */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          {/* Active Stock Banner Card */}
          <div className="bg-white rounded-2xl border border-[#173F35]/12 p-4 sm:p-5 shadow-xs flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] p-1.5 border border-[#173F35]/10 shadow-xs flex items-center justify-center">
                  <Image
                    src={activeCompany.logo}
                    alt={activeCompany.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-serif font-bold text-lg sm:text-xl text-[#173F35]">
                      {activeCompany.name}
                    </h1>
                    <span className="px-2 py-0.5 rounded-md bg-[#DCEEE8] text-[#173F35] text-[11px] font-mono font-bold">
                      {activeCompany.symbol}:SYS
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#173F35]/10 text-[#717975] text-[10px] font-mono">
                      {activeCompany.isin}
                    </span>
                    <span className="flex items-center gap-0.5 text-[#2F7468] text-[11px] font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> SEBI Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#717975] mt-0.5">{activeCompany.description}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="font-mono font-bold text-2xl sm:text-3xl text-[#173F35]">
                    {activeCompany.price.toFixed(2)}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#A8742A]">ARTH</span>
                </div>
                <div className={`font-mono text-xs font-semibold flex items-center justify-end ${
                  activeCompany.isPositive ? 'text-[#287A55]' : 'text-[#B94A43]'
                }`}>
                  {activeCompany.isPositive ? '+' : ''}{activeCompany.change.toFixed(2)} ({activeCompany.isPositive ? '+' : ''}{activeCompany.changePercent.toFixed(2)}% 24h)
                </div>
              </div>
            </div>

            {/* Key Financial Metrics Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAF8F5] rounded-xl p-3 border border-[#173F35]/10 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#717975] uppercase font-sans">24h High</span>
                <div className="font-bold text-[#1A1C18]">{activeCompany.high24h.toFixed(2)} ARTH</div>
              </div>
              <div>
                <span className="text-[10px] text-[#717975] uppercase font-sans">24h Low</span>
                <div className="font-bold text-[#1A1C18]">{activeCompany.low24h.toFixed(2)} ARTH</div>
              </div>
              <div>
                <span className="text-[10px] text-[#717975] uppercase font-sans">P/E Ratio</span>
                <div className="font-bold text-[#1A1C18]">{activeCompany.pe}x</div>
              </div>
              <div>
                <span className="text-[10px] text-[#717975] uppercase font-sans">Market Cap</span>
                <div className="font-bold text-[#173F35]">{activeCompany.marketCap}</div>
              </div>
            </div>
          </div>

          {/* Candlestick Chart */}
          <InteractiveCandleChart company={activeCompany} />

          {/* Level-2 Order Book Ladder */}
          <InteractiveOrderBook />
        </section>

        {/* COLUMN 3: Sticky Institutional Trading Dock (Col-span-3) */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          <InstitutionalTradingDock
            symbol={activeCompany.symbol}
            defaultPrice={activeCompany.price}
          />

          {/* Quick Company Scope Snippet */}
          <div className="bg-white rounded-2xl border border-[#173F35]/12 p-4 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between font-serif font-bold text-sm text-[#173F35]">
              <span>Corporate Scope</span>
              <Link 
                href={`/stocks/${activeCompany.symbol}`}
                className="text-xs text-[#2F7468] hover:underline flex items-center gap-1 font-sans"
              >
                <span>Analytics</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-[#4A534F] text-[11px] leading-relaxed">
              {activeCompany.scope}
            </p>
            <div className="pt-2 border-t border-[#173F35]/10 flex items-center justify-between text-[11px] font-mono text-[#717975]">
              <span>ROE: {activeCompany.fundamentals.roe}</span>
              <span>ESG: {activeCompany.fundamentals.esgScore}/100</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
