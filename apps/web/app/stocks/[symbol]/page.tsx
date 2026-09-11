'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Clock, 
  Building2, 
  Activity, 
  FileText, 
  Layers, 
  ChevronRight,
  Award,
  Maximize2,
  X
} from 'lucide-react';
import { LISTED_COMPANIES, ListedCompany } from '@/components/stocks/StockData';
import { InteractiveCandleChart } from '@/components/stocks/trading/InteractiveCandleChart';
import { InteractiveOrderBook } from '@/components/stocks/trading/InteractiveOrderBook';
import { InstitutionalTradingDock } from '@/components/stocks/trading/InstitutionalTradingDock';

export default function StockDetailsDeepDivePage() {
  const params = useParams();
  const rawSymbol = (params?.symbol as string) || 'NILA';
  const symbol = (Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol).toUpperCase();

  const company: ListedCompany = LISTED_COMPANIES[symbol] || LISTED_COMPANIES['NILA'];
  const [isPosterModalOpen, setIsPosterModalOpen] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* 1. BREADCRUMB & BACK NAVIGATION */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#717975]">
          <Link href="/stocks" className="hover:text-[#173F35] transition">Stock Portal</Link>
          <span>/</span>
          <Link href="/stocks/companies" className="hover:text-[#173F35] transition">Companies</Link>
          <span>/</span>
          <span className="text-[#173F35] font-bold">{company.symbol}</span>
        </div>

        <Link
          href="/stocks/companies"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#173F35] hover:text-[#2F7468] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {/* 2. CORPORATE HERO SHOWCASE & PORTRAIT POSTER PEDESTAL (100% Uncropped Artwork) */}
      <section className="bg-white rounded-3xl border border-[#173F35]/15 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Full Portrait Corporate Poster Showcase (Zero Crop, Natural Portrait Aspect) */}
          <div className="w-full sm:w-72 md:w-80 lg:w-[320px] shrink-0 mx-auto lg:mx-0 flex flex-col items-center">
            <div 
              onClick={() => setIsPosterModalOpen(true)}
              className="group cursor-pointer relative w-full aspect-[10/16] rounded-2xl overflow-hidden shadow-lg border border-[#173F35]/25 bg-[#05140E] transition-all duration-300 hover:shadow-xl hover:border-[#A8742A]/60 flex items-center justify-center p-1.5"
            >
              <Image
                src={company.banner}
                alt={`${company.name} Corporate Poster`}
                fill
                priority
                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 320px"
              />

              {/* Floating Tier Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#E8EDEA] font-mono text-[10px] font-bold border border-white/20 shadow-xs">
                  {company.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#173F35]/80 backdrop-blur-md text-emerald-300 font-mono text-[9px] font-semibold border border-emerald-500/30">
                  SEBI Tier-1
                </span>
              </div>

              {/* Hover Inspection Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#173F35] font-sans font-bold text-xs shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5 text-[#A8742A]" />
                  <span>Inspect Sovereign Poster</span>
                </span>
              </div>
            </div>

            {/* Sub-Poster Verification Pill */}
            <div className="w-full mt-3 flex items-center justify-between px-2 text-[11px] font-mono text-[#717975]">
              <span className="flex items-center gap-1 text-[#2F7468]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F7468]" />
                <span>Statutory Issue Poster</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="text-[#A8742A] hover:underline font-bold text-[11px] flex items-center gap-0.5"
              >
                <span>Zoom</span>
                <Maximize2 className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Executive Corporate Dossier, Real-Time Pricing & Fundamental Cockpit */}
          <div className="flex-1 flex flex-col justify-between self-stretch space-y-6 w-full">
            
            {/* Top Identity Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-[#173F35]/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] p-2 border border-[#173F35]/15 shadow-xs flex items-center justify-center shrink-0">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#173F35]">
                      {company.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#DCEEE8] text-[#173F35] font-mono text-xs font-bold border border-[#173F35]/15">
                      {company.symbol}:SYS
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#173F35]/15 text-[#717975] font-mono text-[11px]">
                      {company.isin}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs font-mono">
                    <span className="text-[#2F7468] font-semibold">{company.sector} Sector</span>
                    <span className="text-[#717975]">•</span>
                    <span className="text-[#A8742A] font-bold">Continuous Auction T+0 CLS</span>
                    <span className="text-[#717975]">•</span>
                    <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                      {company.stasisStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Sovereign Price Plaque */}
              <div className="bg-[#FAF8F5] px-6 py-3.5 rounded-2xl border border-[#173F35]/15 shrink-0 sm:text-right shadow-2xs">
                <span className="text-[10px] text-[#717975] uppercase font-mono tracking-wider block">
                  Current Market Quotation
                </span>
                <div className="flex items-baseline sm:justify-end gap-1.5 mt-0.5">
                  <span className="font-mono font-bold text-3xl sm:text-4xl text-[#173F35]">
                    {company.price.toFixed(2)}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#A8742A]">ARTH</span>
                </div>
                <div className={`font-mono text-xs font-bold flex items-center sm:justify-end mt-0.5 ${
                  company.isPositive ? 'text-[#287A55]' : 'text-[#B94A43]'
                }`}>
                  {company.isPositive ? '+' : ''}{company.change.toFixed(2)} ({company.isPositive ? '+' : ''}{company.changePercent.toFixed(2)}% 24h)
                </div>
              </div>
            </div>

            {/* Corporate Narrative & Scope Summary */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8742A]">
                Executive Overview &amp; Mandate
              </span>
              <p className="text-xs sm:text-sm text-[#4A534F] leading-relaxed">
                {company.description}
              </p>
              <p className="text-xs text-[#717975] italic leading-relaxed">
                {company.scope}
              </p>
            </div>

            {/* Fundamental Market Statistics Grid (6-cell Responsive Bento) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#173F35]/10 font-mono">
                <span className="text-[10px] text-[#717975] uppercase font-sans block">Market Capitalization</span>
                <div className="font-bold text-[#173F35] text-sm mt-0.5">{company.marketCap}</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#173F35]/10 font-mono">
                <span className="text-[10px] text-[#717975] uppercase font-sans block">24h Trading Volume</span>
                <div className="font-bold text-[#1A1C18] text-sm mt-0.5">{company.volume24h}</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#173F35]/10 font-mono">
                <span className="text-[10px] text-[#717975] uppercase font-sans block">P/E Multiple</span>
                <div className="font-bold text-[#1A1C18] text-sm mt-0.5">{company.pe}x</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#173F35]/10 font-mono">
                <span className="text-[10px] text-[#717975] uppercase font-sans block">Dividend Yield</span>
                <div className="font-bold text-[#287A55] text-sm mt-0.5">{company.divYield}%</div>
              </div>
            </div>

            {/* 24h Range Bar & Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#173F35]/10">
              <div className="flex-1 max-w-sm">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#717975] mb-1">
                  <span>24h L: {company.low24h.toFixed(2)}</span>
                  <span className="font-bold text-[#173F35]">{company.price.toFixed(2)} ARTH</span>
                  <span>24h H: {company.high24h.toFixed(2)}</span>
                </div>
                <div className="w-full h-1.5 bg-[#E8EDEA] rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2F7468] to-[#173F35] rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((company.price - company.low24h) / (company.high24h - company.low24h || 1)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Fast Scroll to Order Dock Button */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('trading-dock');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#173F35] hover:bg-[#0D241C] text-white font-body text-xs font-bold shadow-xs hover:shadow-md transition active:scale-98"
                >
                  Place Order for {company.symbol}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TWO-COLUMN ANALYTICAL WORKSPACE (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Chart + Fundamentals + Corporate Scope (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Technical Candlestick Chart */}
          <InteractiveCandleChart company={company} />

          {/* Institutional Fundamentals & Financial Statements Card */}
          <div className="bg-white rounded-2xl border border-[#173F35]/12 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#173F35]/10 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#173F35]">
                  Audited Financial Statements &amp; Capital Structure
                </h3>
                <p className="text-xs text-[#717975]">
                  Certified under Section 18-C statutory accounting standards.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#DCEEE8] text-[#173F35] font-mono text-xs font-bold">
                FY24-25 Q4
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10">
                <span className="text-[10px] text-[#717975] uppercase font-sans">Annual Revenue</span>
                <div className="font-bold text-sm text-[#1A1C18] mt-0.5">{company.fundamentals.revenue}</div>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10">
                <span className="text-[10px] text-[#717975] uppercase font-sans">Net Income</span>
                <div className="font-bold text-sm text-[#287A55] mt-0.5">{company.fundamentals.netIncome}</div>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10">
                <span className="text-[10px] text-[#717975] uppercase font-sans">Operating Margin</span>
                <div className="font-bold text-sm text-[#1A1C18] mt-0.5">{company.fundamentals.operatingMargin}</div>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10">
                <span className="text-[10px] text-[#717975] uppercase font-sans">Free Cash Flow</span>
                <div className="font-bold text-sm text-[#1A1C18] mt-0.5">{company.fundamentals.freeCashFlow}</div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10">
                <span className="text-[10px] text-[#717975] uppercase font-sans">Total Assets</span>
                <div className="font-bold text-sm text-[#1A1C18] mt-0.5">{company.fundamentals.totalAssets}</div>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10">
                <span className="text-[10px] text-[#717975] uppercase font-sans">Total Debt</span>
                <div className="font-bold text-sm text-[#B94A43] mt-0.5">{company.fundamentals.totalDebt}</div>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10">
                <span className="text-[10px] text-[#717975] uppercase font-sans">Return on Equity (ROE)</span>
                <div className="font-bold text-sm text-[#10B981] mt-0.5">{company.fundamentals.roe}</div>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10">
                <span className="text-[10px] text-[#717975] uppercase font-sans">ESG Sovereign Score</span>
                <div className="font-bold text-sm text-[#2F7468] mt-0.5">{company.fundamentals.esgScore} / 100</div>
              </div>
            </div>
          </div>

          {/* Corporate Scope & Regulatory Concessions */}
          <div className="bg-white rounded-2xl border border-[#173F35]/12 p-5 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-base text-[#173F35]">
              Operations Scope &amp; Statutory Concessions
            </h3>
            <p className="text-xs text-[#4A534F] leading-relaxed">
              {company.scope}
            </p>
            <div className="pt-2 border-t border-[#173F35]/10 flex items-center justify-between text-xs text-[#717975] font-mono">
              <span>Bilateral Title Registration: SETU Depository</span>
              <span className="text-[#2F7468] font-bold">100% Reserve Backed</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dedicated Trading Dock & Order Book (4 cols) */}
        <div className="lg:col-span-4 space-y-5" id="trading-dock">
          <InstitutionalTradingDock
            symbol={company.symbol}
            defaultPrice={company.price}
          />

          <InteractiveOrderBook />
        </div>
      </div>

      {/* 4. FULL-SCREEN SOVEREIGN POSTER LIGHTBOX INSPECTION MODAL */}
      {isPosterModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsPosterModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Controls */}
            <div className="w-full flex items-center justify-between pb-3 text-white font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#A8742A] tracking-wider uppercase">
                  {company.name}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/70">Official Sovereign Issue Prospectus Poster</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image Frame - 100% Complete Uncropped View */}
            <div className="relative w-full aspect-[972/1619] max-h-[82vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#030B07] flex items-center justify-center">
              <Image
                src={company.banner}
                alt={`${company.name} Full Sovereign Poster`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 90vw, 800px"
                priority
              />
            </div>

            {/* Bottom Modal Metadata */}
            <div className="w-full flex items-center justify-between pt-3 text-[11px] font-mono text-white/60">
              <span>ISIN: {company.isin} • Symbol: {company.symbol}</span>
              <span className="text-emerald-400 font-bold">SEBI Tier-1 Reg. #AX-STK-{company.symbol}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

