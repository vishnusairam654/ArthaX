'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Bookmark, 
  Layers, 
  Bell, 
  Download, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Activity, 
  Zap, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { LISTED_COMPANIES, SAMPLE_BASKETS, ThematicBasket } from '@/components/stocks/StockData';
import { CreateBasketModal } from '@/components/stocks/watchlist/CreateBasketModal';

export default function WatchlistAndBasketsPage() {
  const [activeTab, setActiveTab] = useState<'primary' | 'baskets' | 'volatility' | 'dividends'>('primary');
  const [isCreateBasketOpen, setIsCreateBasketOpen] = useState<boolean>(false);
  const [basketsList, setBasketsList] = useState<ThematicBasket[]>(SAMPLE_BASKETS);

  const companiesList = Object.values(LISTED_COMPANIES);

  const handleBasketCreated = (name: string) => {
    const newBasket: ThematicBasket = {
      id: `custom-${Date.now()}`,
      name: name,
      tagline: 'Custom thematic sovereign basket configured by investor',
      cagr3y: '+19.5%',
      risk: 'Moderate',
      minInvestment: 5000,
      assets: [
        { symbol: 'NILA', weight: 35 },
        { symbol: 'ARKA', weight: 35 },
        { symbol: 'VEDA', weight: 30 },
      ],
      description: 'Algorithmically monitored allocation across critical sovereign infrastructure.',
    };
    setBasketsList([newBasket, ...basketsList]);
    setActiveTab('baskets');
  };

  return (
    <div className="space-y-6">
      {/* 1. SURVEILLANCE SUB-HEADER */}
      <div className="bg-white rounded-2xl border border-[#173F35]/12 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#717975]">
          <Link href="/stocks" className="hover:text-[#173F35] transition">Stock Portal</Link>
          <span>/</span>
          <span className="text-[#173F35] font-bold">Watchlist &amp; Sovereign Sector Baskets</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>SETU REGULATED DVP-III</span>
          </div>
          <span className="text-[#717975] hidden sm:inline">•</span>
          <span className="text-[#2F7468] hidden sm:inline">ALGO SURVEILLANCE NODE #04 ACTIVE</span>
        </div>
      </div>

      {/* 2. COMMAND HEADER */}
      <section className="bg-white rounded-2xl border border-[#173F35]/12 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif font-bold text-2xl text-[#173F35]">
                Watchlist &amp; Sector Baskets
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#173F35] text-white text-[10px] font-mono font-bold uppercase">
                LIVE TICKER STREAM
              </span>
            </div>
            <p className="text-xs text-[#4A534F] mt-1 max-w-2xl">
              Custom asset tracking, dynamic volatility triggers, thematic sovereign baskets, and instant DvP execution docks under Continuous Auction Protocol.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateBasketOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#173F35] hover:bg-[#0d2620] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Custom Basket</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Price alert configuration modal opened. 3 active triggers monitoring.')}
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#DCEEE8] border border-[#173F35]/15 text-[#173F35] font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#2F7468]" />
              <span>Price Alerts (3)</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Exporting watchlist CSV payload...')}
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#DCEEE8] border border-[#173F35]/15 text-[#173F35] font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#2F7468]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 mt-4 border-t border-[#173F35]/10 text-xs font-mono">
          {[
            { id: 'primary', label: 'Primary Watchlist (10)' },
            { id: 'baskets', label: 'Thematic Sovereign Baskets (4)' },
            { id: 'volatility', label: 'High Volatility & Breakout (3)' },
            { id: 'dividends', label: 'Dividend Aristocrats (4)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#173F35] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#4A534F] hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. 4-METRIC SUMMARY BAR */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#173F35]/12 shadow-xs">
          <span className="text-[10px] font-mono text-[#717975] uppercase">Aggregated Watchlist Value</span>
          <div className="font-mono font-bold text-2xl text-[#173F35] mt-1">1,248,500.00 ARTH</div>
          <div className="text-xs font-mono text-[#287A55] font-bold mt-1">+2.14% 24h</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#173F35]/12 shadow-xs">
          <span className="text-[10px] font-mono text-[#717975] uppercase">24h Volume Turnover</span>
          <div className="font-mono font-bold text-2xl text-[#1A1C18] mt-1">84.2M ARTH</div>
          <div className="text-xs font-mono text-[#2F7468] font-bold mt-1">Across 10 Instruments</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#173F35]/12 shadow-xs">
          <span className="text-[10px] font-mono text-[#717975] uppercase">Active Volatility Triggers</span>
          <div className="font-mono font-bold text-2xl text-[#A8742A] mt-1">3 Configured</div>
          <div className="text-xs font-mono text-[#717975] mt-1">Threshold: ±3.0% Delta</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#173F35]/12 shadow-xs">
          <span className="text-[10px] font-mono text-[#717975] uppercase">Available DvP Liquidity</span>
          <div className="font-mono font-bold text-2xl text-[#10B981] mt-1">38,450.00 ARTH</div>
          <div className="text-xs font-mono text-[#10B981] font-bold mt-1">Immediate Settlement</div>
        </div>
      </section>

      {/* 4. MAIN TABBED CONTENT */}
      {activeTab === 'baskets' ? (
        /* THEMATIC BASKETS GRID */
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {basketsList.map((basket) => (
            <div
              key={basket.id}
              className="bg-white rounded-2xl border border-[#173F35]/12 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#173F35]">{basket.name}</h3>
                    <p className="text-xs text-[#2F7468] font-semibold mt-0.5">{basket.tagline}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-[#287A55]/10 text-[#287A55] font-mono text-xs font-bold">
                    3Y CAGR: {basket.cagr3y}
                  </span>
                </div>

                <p className="text-xs text-[#4A534F] mt-3 leading-relaxed">
                  {basket.description}
                </p>

                {/* Constituents allocation pills */}
                <div className="mt-4 pt-3 border-t border-[#173F35]/10 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-[#717975]">
                    <span>Constituent Allocation:</span>
                    <span>Min Ticket: {basket.minInvestment} ARTH</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {basket.assets.map((ast) => (
                      <span
                        key={ast.symbol}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#173F35]/10 text-xs font-mono font-semibold text-[#173F35]"
                      >
                        {ast.symbol}: {ast.weight}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Basket Order Action */}
              <button
                type="button"
                onClick={() => alert(`1-Click Basket order launched for "${basket.name}" with minimum allocation of ${basket.minInvestment} ARTH.`)}
                className="w-full py-2.5 rounded-xl bg-[#173F35] hover:bg-[#0d2620] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#A8742A]" />
                <span>EXECUTE 1-CLICK THEMATIC BASKET ORDER</span>
              </button>
            </div>
          ))}
        </section>
      ) : (
        /* WATCHLIST TABLE VIEW */
        <section className="bg-white rounded-2xl border border-[#173F35]/12 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#FAF8F5] text-[#717975] font-mono font-bold border-b border-[#173F35]/10 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4 text-right">Price (ARTH)</th>
                  <th className="py-3 px-4 text-right">24h Net</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                  <th className="py-3 px-4 text-center">52W Range</th>
                  <th className="py-3 px-4 text-right">P/E</th>
                  <th className="py-3 px-4 text-center">Surveillance</th>
                  <th className="py-3 px-4 text-right">Trading Dock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173F35]/10 font-mono">
                {companiesList.map((comp) => (
                  <tr key={comp.symbol} className="hover:bg-[#FAF8F5] transition">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white p-1 border border-[#173F35]/10 flex items-center justify-center shrink-0">
                          <Image
                            src={comp.logo}
                            alt={comp.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[#173F35]">{comp.name}</div>
                          <div className="text-[10px] font-mono text-[#717975]">{comp.symbol} • {comp.isin}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#1A1C18]">
                      {comp.price.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold">
                      <span className={`${comp.isPositive ? 'text-[#287A55]' : 'text-[#B94A43]'}`}>
                        {comp.isPositive ? '+' : ''}{comp.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#1A1C18]">
                      {comp.marketCap}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center gap-1.5 w-32 mx-auto">
                        <span className="text-[9px] text-[#717975]">{comp.low52w.toFixed(0)}</span>
                        <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2F7468]"
                            style={{
                              width: `${((comp.price - comp.low52w) / (comp.high52w - comp.low52w)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[9px] text-[#717975]">{comp.high52w.toFixed(0)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#4A534F]">
                      {comp.pe}x
                    </td>

                    <td className="py-3.5 px-4 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-[#DCEEE8] text-[#173F35] font-bold text-[10px]">
                        ACTIVE
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        href={`/stocks/${comp.symbol}`}
                        className="px-3 py-1.5 rounded-lg bg-[#173F35] hover:bg-[#0d2620] text-white font-bold text-xs transition inline-flex items-center gap-1"
                      >
                        <span>Trade</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Create Custom Basket Modal */}
      <CreateBasketModal
        isOpen={isCreateBasketOpen}
        onClose={() => setIsCreateBasketOpen(false)}
        onCreated={handleBasketCreated}
      />
    </div>
  );
}
