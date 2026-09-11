'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface RegisteredEquitiesTableProps {
  isMasked: boolean;
  onOpenTradeForSymbol?: (symbol: string) => void;
}

const EQUITIES = [
  {
    symbol: 'NILA',
    name: 'NILA Systems Ltd',
    tagline: 'Sovereign High-Compute & Network Matrix',
    logo: '/assets/stocks/logo/nila_systems.png',
    sector: 'Technology',
    sectorColor: 'bg-blue-50 text-[#1E3A5F] border-blue-200',
    quantity: 500,
    ingressAvg: '210.00',
    currentPrice: '260.06',
    totalValuation: '130,030.00',
    pnlValue: '+25,030.00',
    pnlPercent: '+23.83%',
    isProfit: true,
    dayShift: '+2.40%',
    dayShiftPositive: true,
  },
  {
    symbol: 'ARKA',
    name: 'ARKA Energy Sovereign',
    tagline: 'Renewable Solar Grids & Hydrogen Storage',
    logo: '/assets/stocks/logo/arka_energy.png',
    sector: 'Utilities',
    sectorColor: 'bg-emerald-50 text-[#1B6D44] border-emerald-200',
    quantity: 1200,
    ingressAvg: '72.50',
    currentPrice: '82.86',
    totalValuation: '99,432.00',
    pnlValue: '+12,432.00',
    pnlPercent: '+14.28%',
    isProfit: true,
    dayShift: '+1.85%',
    dayShiftPositive: true,
  },
  {
    symbol: 'MERU',
    name: 'MERU Capital Reserve',
    tagline: 'Sovereign Debt Syndication & Liquidity',
    logo: '/assets/stocks/logo/meru_capital.png',
    sector: 'Financials',
    sectorColor: 'bg-amber-50 text-[#825A22] border-amber-200',
    quantity: 800,
    ingressAvg: '98.00',
    currentPrice: '105.17',
    totalValuation: '84,136.00',
    pnlValue: '+5,736.00',
    pnlPercent: '+7.32%',
    isProfit: true,
    dayShift: '+0.45%',
    dayShiftPositive: true,
  },
  {
    symbol: 'ANVIK',
    name: 'ANVIK Industries Corp',
    tagline: 'Strategic Alloys & Heavy Fabrication',
    logo: '/assets/stocks/logo/anvik_ind.png',
    sector: 'Engineering',
    sectorColor: 'bg-slate-50 text-[#455F87] border-slate-200',
    quantity: 350,
    ingressAvg: '122.00',
    currentPrice: '131.12',
    totalValuation: '45,892.00',
    pnlValue: '+3,192.00',
    pnlPercent: '+7.47%',
    isProfit: true,
    dayShift: '-0.35%',
    dayShiftPositive: false,
  },
  {
    symbol: 'AROHA',
    name: 'AROHA Foods Sovereign',
    tagline: 'Bio-Preserved Grains & Cold Chain Logistics',
    logo: '/assets/stocks/logo/aroha_foods.png',
    sector: 'Agritech',
    sectorColor: 'bg-yellow-50 text-[#A8742A] border-yellow-200',
    quantity: 600,
    ingressAvg: '34.00',
    currentPrice: '38.25',
    totalValuation: '22,950.00',
    pnlValue: '+2,550.00',
    pnlPercent: '+12.50%',
    isProfit: true,
    dayShift: '+1.10%',
    dayShiftPositive: true,
  },
];

export const RegisteredEquitiesTable: React.FC<RegisteredEquitiesTableProps> = ({
  isMasked,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquities = EQUITIES.filter(
    (e) =>
      e.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-white rounded-3xl shadow-2xs border border-[#74777F]/20 overflow-hidden mb-8">
      {/* Table Header & Search Controls */}
      <div className="p-5 sm:p-6 border-b border-[#74777F]/15 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8F9FF]">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#022448]">
            Registered Sovereign Equities
          </h2>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5">
            Direct depository holdings under SETU Node. All trades execute with Delivery vs. Payment atomic settlement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter holdings by ticker / name..."
              className="h-10 pl-9 pr-4 text-xs sm:text-sm rounded-full bg-white border border-[#74777F]/30 focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] w-64 md:w-72 transition-all outline-hidden font-sans"
            />
          </div>

          <button
            type="button"
            className="h-10 px-3.5 rounded-full bg-white hover:bg-[#EEF4FF] text-[#121C28] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#74777F]/20"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            className="h-10 px-3.5 rounded-full bg-white hover:bg-[#EEF4FF] text-[#121C28] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#74777F]/20"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* High-Density Institutional Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="bg-[#F8F9FF] border-b border-[#74777F]/15 font-mono text-[11px] uppercase tracking-wider text-[#5C574F] font-semibold">
              <th className="py-3.5 px-4 pl-6">Ticker &amp; Enterprise</th>
              <th className="py-3.5 px-3">Sector</th>
              <th className="py-3.5 px-3 text-right">Quantity</th>
              <th className="py-3.5 px-3 text-right">Ingress Avg</th>
              <th className="py-3.5 px-3 text-right">Current Price</th>
              <th className="py-3.5 px-4 text-right">Total Valuation</th>
              <th className="py-3.5 px-4 text-right">Unrealized P&amp;L</th>
              <th className="py-3.5 px-3 text-right">24h Shift</th>
              <th className="py-3.5 px-4 pr-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#74777F]/10 text-xs sm:text-sm font-sans">
            {filteredEquities.map((item) => (
              <tr key={item.symbol} className="hover:bg-[#F8F9FF] transition-colors group">
                {/* Enterprise Name & Logo */}
                <td className="py-4 px-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#74777F]/20 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                      <Image
                        src={item.logo}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#022448] text-sm group-hover:text-[#1E3A5F] transition-colors">
                          {item.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#E5EFFF] text-[#1E3A5F] text-[10px] font-bold font-mono">
                          {item.symbol}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5C574F] block">{item.tagline}</span>
                    </div>
                  </div>
                </td>

                {/* Sector */}
                <td className="py-4 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${item.sectorColor}`}>
                    {item.sector}
                  </span>
                </td>

                {/* Quantity */}
                <td className="py-4 px-3 text-right font-mono font-semibold tabular-nums text-[#121C28]">
                  {item.quantity} <span className="text-[11px] font-sans font-normal text-[#74777F]">SHS</span>
                </td>

                {/* Ingress Avg */}
                <td className="py-4 px-3 text-right font-mono tabular-nums text-[#5C574F]">
                  {item.ingressAvg} <span className="text-[11px] font-sans text-[#74777F]">ARTH</span>
                </td>

                {/* Current Price */}
                <td className="py-4 px-3 text-right font-mono font-semibold tabular-nums text-[#121C28]">
                  {item.currentPrice} <span className="text-[11px] font-sans text-[#74777F]">ARTH</span>
                </td>

                {/* Total Valuation */}
                <td className="py-4 px-4 text-right">
                  <AnimatedMaskedValue
                    value={item.totalValuation}
                    isMasked={isMasked}
                    maskString="••••••••"
                    className="font-mono font-bold text-[#022448] text-sm"
                    suffix={<span className="text-[11px] font-sans font-medium text-[#74777F] ml-1">ARTH</span>}
                  />
                </td>

                {/* Unrealized P&L */}
                <td className="py-4 px-4 text-right">
                  <AnimatedMaskedValue
                    value={item.pnlValue}
                    isMasked={isMasked}
                    maskString="••••••"
                    className="font-mono font-bold text-[#287A55]"
                    suffix={<span className="text-[11px] font-sans ml-1 text-[#287A55]">ARTH</span>}
                  />
                  <div className="text-[11px] font-semibold text-[#287A55] font-mono mt-0.5">
                    {item.pnlPercent}
                  </div>
                </td>

                {/* 24h Shift */}
                <td className="py-4 px-3 text-right">
                  {item.dayShiftPositive ? (
                    <span className="inline-flex items-center gap-0.5 font-mono font-semibold text-[#287A55]">
                      <TrendingUp className="w-3.5 h-3.5" /> {item.dayShift}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 font-mono font-semibold text-[#B5482E]">
                      <TrendingDown className="w-3.5 h-3.5" /> {item.dayShift}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-4 px-4 pr-6 text-center">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/user/stocks/${item.symbol}`}
                      className="px-3 py-1 rounded-full bg-[#022448] hover:bg-[#1E3A5F] text-white text-xs font-semibold transition-colors shadow-2xs"
                    >
                      Trade
                    </Link>
                    <Link
                      href={`/user/stocks/${item.symbol}`}
                      className="p-1.5 rounded-full text-[#5C574F] hover:bg-[#E5EFFF] hover:text-[#022448] transition-colors"
                      title="View Order Book &amp; Analytics"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
