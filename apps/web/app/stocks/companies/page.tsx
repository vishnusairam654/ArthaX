'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Table as TableIcon, 
  LayoutGrid, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { LISTED_COMPANIES, ListedCompany } from '@/components/stocks/StockData';

export default function CompaniesDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'bento'>('table');
  const [sortBy, setSortBy] = useState<string>('marketCap');

  const companiesList = Object.values(LISTED_COMPANIES);

  const filteredCompanies = companiesList
    .filter((comp) => {
      const matchesSearch = 
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.isin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.sector.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSector = 
        sectorFilter === 'All' ? true : comp.category.toLowerCase().includes(sectorFilter.toLowerCase());

      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      if (sortBy === 'marketCap') return b.marketCapNum - a.marketCapNum;
      if (sortBy === 'priceDelta') return b.changePercent - a.changePercent;
      if (sortBy === 'pe') return a.pe - b.pe;
      if (sortBy === 'divYield') return b.divYield - a.divYield;
      if (sortBy === 'volume') return b.volume24hNum - a.volume24hNum;
      return 0;
    });

  const filings = [
    {
      id: 'ISO-20022-NILA-Q4',
      company: 'NILA Systems Ltd',
      symbol: 'NILA',
      filingType: 'Form 10-K Annual Statutory Audit',
      date: '28 Feb 2025',
      merkleRoot: '0x9a8f...312c',
      status: 'VERIFIED',
    },
    {
      id: 'ISO-20022-ARKA-REV',
      company: 'Arka Energy Sovereign',
      symbol: 'ARKA',
      filingType: 'Green Hydrogen Concession Disclosures',
      date: '21 Feb 2025',
      merkleRoot: '0x1b4e...99fa',
      status: 'VERIFIED',
    },
    {
      id: 'ISO-20022-MERU-DVP',
      company: 'Meru Capital Reserve',
      symbol: 'MERU',
      filingType: 'Bilateral Liquidity Syndication Blotter',
      date: '14 Feb 2025',
      merkleRoot: '0x88c1...e042',
      status: 'VERIFIED',
    },
    {
      id: 'ISO-20022-VEDA-PAT',
      company: 'Veda Health Sciences',
      symbol: 'VEDA',
      filingType: 'Genomic Biological Countermeasure Patents',
      date: '05 Feb 2025',
      merkleRoot: '0x44d3...c910',
      status: 'VERIFIED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. MACRO REGISTRY STATS OVERVIEW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#173F35]/12 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#717975] mb-2 text-xs font-semibold uppercase tracking-wider">
            <span>Total Listed Market Cap</span>
            <Building2 className="w-4 h-4 text-[#2F7468]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">14.82B</span>
            <span className="text-xs font-bold text-[#A8742A] font-mono">ARTH</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#717975] mt-2 pt-2 border-t border-[#173F35]/10">
            <span>24h Aggregate Delta:</span>
            <span className="font-mono text-[#287A55] font-bold">+1.84%</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#173F35]/12 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#717975] mb-2 text-xs font-semibold uppercase tracking-wider">
            <span>Active Registered Equities</span>
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">10</span>
            <span className="text-xs font-medium text-[#717975]">Sovereign Equities</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#717975] mt-2 pt-2 border-t border-[#173F35]/10">
            <span>Compliance Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-[#DCEEE8] text-[#173F35] font-bold text-[10px]">
              100% AUDITED
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#173F35]/12 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#717975] mb-2 text-xs font-semibold uppercase tracking-wider">
            <span>ISO-20022 Filings</span>
            <FileText className="w-4 h-4 text-[#66A3BF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#173F35]">124</span>
            <span className="text-xs font-medium text-[#717975]">Cryptographic Disclosures</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#717975] mt-2 pt-2 border-t border-[#173F35]/10">
            <span>Merkle Block Proof:</span>
            <span className="font-mono text-[#2F7468] font-semibold">#28.1M</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#173F35]/12 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#717975] mb-2 text-xs font-semibold uppercase tracking-wider">
            <span>DvP Liquidity Cleared</span>
            <TrendingUp className="w-4 h-4 text-[#A8742A]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2F7468]">842.6M</span>
            <span className="text-xs font-bold text-[#A8742A] font-mono">ARTH</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#717975] mt-2 pt-2 border-t border-[#173F35]/10">
            <span>Stasis Rail:</span>
            <span className="font-mono text-[#10B981] font-semibold">ENFORCED</span>
          </div>
        </div>
      </section>

      {/* 2. FILTER RAIL & CONTROLS WORKSPACE */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#173F35]/12 shadow-xs space-y-4">
        {/* Sector Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          {[
            { id: 'All', label: 'All Sectors (10)' },
            { id: 'Tech', label: 'Space & Telemetry (1)' },
            { id: 'Energy', label: 'Clean Energy (1)' },
            { id: 'Infra', label: 'Rail & Ports Infra (3)' },
            { id: 'Health', label: 'Genomics & Life Sci (1)' },
            { id: 'Banking', label: 'Reserve Banking (1)' },
            { id: 'Defense', label: 'Heavy Defense Alloys (1)' },
            { id: 'Equities', label: 'Agritech & Retail (2)' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSectorFilter(sec.id)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${
                sectorFilter === sec.id
                  ? 'bg-[#173F35] text-white font-bold shadow-xs'
                  : 'bg-[#FAF8F5] text-[#4A534F] hover:bg-gray-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Search, Sort & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#173F35]/10">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#717975]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter directory by company name, statutory ticker, ISIN, or sector..."
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#173F35]/15 rounded-xl text-xs sm:text-sm text-[#1A1C18] placeholder:text-[#717975] focus:outline-none focus:border-[#2F7468]"
              />
            </div>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF8F5] border border-[#173F35]/15 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1C18] cursor-pointer focus:outline-none focus:border-[#2F7468]"
              >
                <option value="marketCap">Sort: Market Cap (Desc)</option>
                <option value="priceDelta">Sort: 24h Price Delta (%)</option>
                <option value="pe">Sort: P/E Ratio (Asc)</option>
                <option value="divYield">Sort: Dividend Yield (Desc)</option>
                <option value="volume">Sort: 24h Volume</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#173F35]/10">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#173F35] shadow-xs'
                    : 'text-[#717975] hover:text-[#173F35]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-[#2F7468]" />
                <span>Ledger View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('bento')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'bento'
                    ? 'bg-white text-[#173F35] shadow-xs'
                    : 'text-[#717975] hover:text-[#173F35]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#2F7468]" />
                <span>Bento Matrix</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert('Exporting full equities registry XBRL payload...')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#DCEEE8] border border-[#173F35]/15 text-[#173F35] text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#2F7468]" />
              <span className="hidden sm:inline">Export (.XBRL)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. VIEW 1: DENSE INSTITUTIONAL COMPANIES LEDGER TABLE */}
      {viewMode === 'table' ? (
        <section className="bg-white rounded-2xl border border-[#173F35]/12 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#173F35]/10 text-[#717975] text-[11px] font-mono font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Company &amp; Identification</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-right">Share Price</th>
                  <th className="py-3 px-4 text-right">24h Net</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                  <th className="py-3 px-4 text-right">P/E &amp; EPS</th>
                  <th className="py-3 px-4 text-right">Div Yield</th>
                  <th className="py-3 px-4 text-right">24h Volume</th>
                  <th className="py-3 px-4 text-center">7D Trend</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Trading Desk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173F35]/10 font-mono">
                {filteredCompanies.map((comp) => (
                  <tr key={comp.symbol} className="hover:bg-[#FAF8F5] transition-colors group">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#173F35]/10 shadow-xs flex items-center justify-center p-1 shrink-0 relative">
                          <Image
                            src={comp.logo}
                            alt={comp.name}
                            width={30}
                            height={30}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-sm text-[#173F35] group-hover:text-[#2F7468] transition truncate">
                              {comp.name}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#173F35] text-white rounded">
                              {comp.symbol}
                            </span>
                          </div>
                          <span className="text-[#717975] text-[10px] font-mono mt-0.5">
                            {comp.isin}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-sans text-xs text-[#4A534F]">
                      {comp.sector}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#1A1C18]">
                      {comp.price.toFixed(2)} <span className="text-[#A8742A] text-[10px]">ARTH</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold">
                      <span className={`inline-flex items-center gap-0.5 ${
                        comp.isPositive ? 'text-[#287A55]' : 'text-[#B94A43]'
                      }`}>
                        {comp.isPositive ? '+' : ''}{comp.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#1A1C18] font-medium">
                      {comp.marketCap}
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#4A534F]">
                      <div>{comp.pe}x</div>
                      <div className="text-[10px] text-[#717975]">EPS: {comp.eps}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#287A55] font-semibold">
                      {comp.divYield}%
                    </td>

                    <td className="py-3.5 px-4 text-right text-[#4A534F]">
                      {comp.volume24h}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <svg className="w-16 h-5 mx-auto" viewBox="0 0 70 20">
                        <path
                          d={`M 0 ${comp.isPositive ? 16 : 4} L 15 12 L 30 14 L 45 8 L 70 ${comp.isPositive ? 3 : 17}`}
                          fill="none"
                          stroke={comp.isPositive ? '#287A55' : '#B94A43'}
                          strokeWidth="2"
                        />
                      </svg>
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-[#DCEEE8] text-[#173F35] font-bold text-[10px] whitespace-nowrap">
                        {comp.stasisStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <Link
                        href={`/stocks/${comp.symbol}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#173F35] hover:bg-[#0d2620] text-white font-bold text-xs shadow-xs transition"
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
      ) : (
        /* 3. VIEW 2: BENTO MATRIX VIEW */
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((comp) => (
            <div
              key={comp.symbol}
              className="bg-white rounded-2xl border border-[#173F35]/12 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Mini Sovereign Portrait Poster (Natural Aspect Ratio, Uncropped) */}
                    <Link
                      href={`/stocks/${comp.symbol}`}
                      className="w-14 shrink-0 aspect-[10/16] rounded-xl overflow-hidden relative border border-[#173F35]/20 bg-[#071711] shadow-2xs hover:border-[#A8742A]/60 hover:scale-105 transition-all group/p"
                      title={`View ${comp.name} Sovereign Poster`}
                    >
                      <Image
                        src={comp.banner}
                        alt={`${comp.name} Poster`}
                        fill
                        className="object-contain p-0.5"
                      />
                    </Link>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-serif font-bold text-base text-[#173F35] truncate">{comp.name}</h3>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#173F35] text-white rounded shrink-0">
                          {comp.symbol}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#717975] font-sans block mt-0.5">{comp.sector}</span>
                      <span className="text-[10px] font-mono text-[#717975] block mt-0.5">{comp.isin}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#4A534F] mt-3 line-clamp-2 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              {/* Price & Sparkline */}
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#173F35]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#717975] font-mono uppercase">Current Price</span>
                  <div className="font-mono font-bold text-lg text-[#173F35]">
                    {comp.price.toFixed(2)} <span className="text-xs text-[#A8742A]">ARTH</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-mono text-xs font-bold ${
                    comp.isPositive ? 'text-[#287A55]' : 'text-[#B94A43]'
                  }`}>
                    {comp.isPositive ? '+' : ''}{comp.changePercent.toFixed(2)}%
                  </span>
                  <div className="text-[10px] text-[#717975] font-mono">Vol: {comp.volume24h}</div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 text-center text-xs font-mono border-t border-[#173F35]/10 pt-3">
                <div>
                  <span className="text-[10px] text-[#717975]">P/E</span>
                  <div className="font-bold text-[#1A1C18]">{comp.pe}x</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#717975]">Div Yield</span>
                  <div className="font-bold text-[#287A55]">{comp.divYield}%</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#717975]">Mkt Cap</span>
                  <div className="font-bold text-[#173F35]">{comp.marketCap}</div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/stocks/${comp.symbol}`}
                className="w-full py-2.5 rounded-xl bg-[#173F35] hover:bg-[#0d2620] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <span>Launch Analytics &amp; Trading Dock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </section>
      )}

      {/* 4. INSTITUTIONAL FILINGS & STATUTORY DISCLOSURES */}
      <section className="bg-white rounded-2xl border border-[#173F35]/12 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#173F35]/10 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#173F35]">
              Institutional Filings &amp; Regulatory Disclosures
            </h3>
            <p className="text-xs text-[#717975]">
              ISO-20022 verified cryptographic disclosure records under SEBI &amp; SETU oversight.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#DCEEE8] text-[#173F35] font-mono text-xs font-bold">
            CONTINUOUS BLOCK STAMP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filings.map((f) => (
            <div
              key={f.id}
              className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#173F35]/10 flex items-center justify-between hover:border-[#173F35]/30 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#173F35]/10 text-[#173F35] flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4 text-[#2F7468]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#173F35]">{f.company}</span>
                    <span className="text-[10px] font-mono px-1 bg-[#173F35] text-white rounded">
                      {f.symbol}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#4A534F]">{f.filingType}</div>
                  <div className="text-[10px] font-mono text-[#717975] mt-0.5">
                    Filed: {f.date} • Proof: {f.merkleRoot}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Downloading verified XML document for ${f.id}...`)}
                className="p-2 rounded-lg bg-white hover:bg-[#DCEEE8] border border-[#173F35]/15 text-[#173F35] transition cursor-pointer"
                title="Download ISO-20022 XML"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
