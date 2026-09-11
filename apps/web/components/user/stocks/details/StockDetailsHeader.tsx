'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface StockDetailsHeaderProps {
  symbol: string;
  isMasked: boolean;
}

const STOCK_LOOKUP: Record<string, {
  name: string;
  logo: string;
  isin: string;
  sector: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  low52: string;
  high52: string;
  turnover: string;
  beta: string;
}> = {
  NILA: {
    name: 'NILA Systems Ltd',
    logo: '/assets/stocks/logo/nila_systems.png',
    isin: 'INE094J01018',
    sector: 'Technology & Space Mesh',
    price: '260.06',
    change: '+6.12',
    changePercent: '+2.40%',
    isPositive: true,
    low52: '180.20',
    high52: '275.50',
    turnover: '142.5M ARTH',
    beta: '0.88',
  },
  ARKA: {
    name: 'ARKA Energy Sovereign',
    logo: '/assets/stocks/logo/arka_energy.png',
    isin: 'INE122K01024',
    sector: 'Renewable Solar & Hydrogen',
    price: '82.86',
    change: '+1.50',
    changePercent: '+1.85%',
    isPositive: true,
    low52: '58.00',
    high52: '92.40',
    turnover: '88.2M ARTH',
    beta: '0.92',
  },
  MERU: {
    name: 'MERU Capital Reserve',
    logo: '/assets/stocks/logo/meru_capital.png',
    isin: 'INE338M01019',
    sector: 'Financials & Sovereign Debt',
    price: '105.17',
    change: '+0.47',
    changePercent: '+0.45%',
    isPositive: true,
    low52: '85.50',
    high52: '118.00',
    turnover: '112.0M ARTH',
    beta: '0.74',
  },
  ANVIK: {
    name: 'ANVIK Industries Corp',
    logo: '/assets/stocks/logo/anvik_ind.png',
    isin: 'INE771A01033',
    sector: 'Heavy Engineering & Alloys',
    price: '131.12',
    change: '-0.46',
    changePercent: '-0.35%',
    isPositive: false,
    low52: '110.00',
    high52: '148.50',
    turnover: '64.5M ARTH',
    beta: '1.05',
  },
  AROHA: {
    name: 'AROHA Foods Sovereign',
    logo: '/assets/stocks/logo/aroha_foods.png',
    isin: 'INE440F01021',
    sector: 'Agritech & Food Logistics',
    price: '38.25',
    change: '+0.42',
    changePercent: '+1.10%',
    isPositive: true,
    low52: '28.00',
    high52: '44.20',
    turnover: '31.8M ARTH',
    beta: '0.62',
  },
};

export const StockDetailsHeader: React.FC<StockDetailsHeaderProps> = ({ symbol, isMasked }) => {
  const stock = STOCK_LOOKUP[symbol.toUpperCase()] || STOCK_LOOKUP['NILA'];

  return (
    <div className="space-y-4">
      {/* Return link and Statutory Notice Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <Link
          href="/user/stocks"
          className="inline-flex items-center gap-1.5 text-[#1E3A5F] hover:text-[#022448] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Stock Portfolio</span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-[11px] text-[#5C574F]">
          <span className="px-2 py-0.5 rounded bg-[#022448] text-white font-bold tracking-wider uppercase">
            STATUTORY TERMINAL
          </span>
          <span>INSTRUMENT: <strong className="text-[#022448]">{symbol.toUpperCase()}:SYS</strong></span>
          <span>• ISIN: {stock.isin}</span>
          <span className="text-[#287A55] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> SETU DvP Verified
          </span>
        </div>
      </div>

      {/* Main Stock Header Card */}
      <div className="bg-white rounded-2xl border border-[#74777F]/20 p-5 lg:p-6 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        {/* Left: Enterprise Logo, Title, Badges */}
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F8F9FF] border border-[#74777F]/20 p-2 flex items-center justify-center shrink-0 shadow-2xs">
            <Image
              src={stock.logo}
              alt={stock.name}
              width={64}
              height={64}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-[#022448] font-bold tracking-tight">
                {stock.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#E5EFFF] text-[#1E3A5F]">
                {symbol.toUpperCase()}:SYS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#287A55]/10 text-[#287A55] text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SEBI Core Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C574F]">
              <span className="font-semibold text-[#1E3A5F]">{stock.sector}</span>
              <span>•</span>
              <span>Depository Node #003</span>
              <span>•</span>
              <span className="font-mono text-[11px] bg-[#F8F9FF] px-2 py-0.5 rounded border border-[#74777F]/15">
                Benchmark: ARTHAX 50
              </span>
            </div>
          </div>
        </div>

        {/* Center / Mid Price Module */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-6 bg-[#F8F9FF] border border-[#74777F]/15 px-5 py-3.5 rounded-xl">
          {/* Spot Price */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5C574F]">
              SPOT CLEARING PRICE
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-[#022448] tracking-tight">
                {stock.price}
              </span>
              <span className="font-mono text-xs font-bold text-[#A8742A]">ARTH</span>
            </div>

            <div
              className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full w-fit mt-0.5 ${
                stock.isPositive
                  ? 'bg-[#287A55]/10 text-[#287A55]'
                  : 'bg-[#B5482E]/10 text-[#B5482E]'
              }`}
            >
              {stock.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{stock.change} ({stock.changePercent} 24h)</span>
            </div>
          </div>

          {/* 52-Week Range */}
          <div className="hidden md:flex flex-col w-48 gap-1.5 text-xs">
            <div className="flex justify-between font-mono text-[11px] text-[#5C574F]">
              <span>52W L: <strong className="text-[#121C28]">{stock.low52}</strong></span>
              <span>52W H: <strong className="text-[#121C28]">{stock.high52}</strong></span>
            </div>
            <div className="w-full h-2 bg-[#E5EFFF] rounded-full overflow-hidden relative">
              <div className="absolute left-[30%] right-[20%] h-full bg-[#1E3A5F]/40 rounded-full" />
              <div className="absolute left-[65%] top-[-2px] w-3 h-3 rounded-full bg-[#1E3A5F] ring-2 ring-white shadow-xs" />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-[#74777F]">
              <span>24h VWAP: {stock.price}</span>
            </div>
          </div>

          {/* Turnover & Risk */}
          <div className="hidden sm:flex flex-col text-right text-xs">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5C574F]">
              24H TURNOVER
            </span>
            <span className="text-sm font-bold font-mono text-[#022448]">{stock.turnover}</span>
            <span className="text-[#5C574F] text-[11px] mt-0.5">
              Beta: <strong className="text-[#1E3A5F] font-mono font-bold">{stock.beta}</strong> (Low Risk)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
