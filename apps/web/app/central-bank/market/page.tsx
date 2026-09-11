'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Activity,
  PauseCircle,
  PlayCircle,
  X,
  FileSearch,
  Scale,
} from 'lucide-react';
import {
  MOCK_COMPANIES_OVERSIGHT,
  CompanyOversightRecord,
  DEMO_POLICY_NOTICE,
} from '@/components/central-bank/CentralBankMockData';
import { CentralBankMaskedValue } from '@/components/central-bank/CentralBankMaskedValue';

export default function MarketOversightPage() {
  const [companies, setCompanies] = useState<CompanyOversightRecord[]>(MOCK_COMPANIES_OVERSIGHT);
  const [selectedCompany, setSelectedCompany] = useState<CompanyOversightRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredCompanies = companies.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleHalt = (symbol: string) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.symbol === symbol) {
          const isHalted = c.listingStatus === 'Trading Halted';
          const newStatus = isHalted ? 'Active' : 'Trading Halted';
          setActionNotice(
            `Regulatory status for ${symbol} set to "${newStatus}". Surveillance bulletin broadcast to central order books.`
          );
          setTimeout(() => setActionNotice(null), 4000);
          return { ...c, listingStatus: newStatus };
        }
        return c;
      })
    );
  };

  const totalCap = companies.reduce((acc, c) => acc + c.marketCap, 0);
  const totalVol = companies.reduce((acc, c) => acc + c.dailyVolume, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              EQUITIES SURVEILLANCE
            </span>
            <span className="text-[11px] text-[#A8742A] font-mono font-medium">
              [PROVISIONAL DEMO BENCHMARKS]
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Sovereign Equities Market Oversight
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Central surveillance over listed sovereign enterprises, order-book volatility circuit limits, corporate regulatory disclosures, and realized profit-only tax compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Trading Session: REGULAR (T+0)
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Market Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-[10px] text-[#74777F] uppercase block font-medium">
            Total Market Value
          </span>
          <div className="text-xl font-bold font-serif text-[#2A2012] mt-1">
            <CentralBankMaskedValue value={totalCap} suffix=" ARTH" />
          </div>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">6 Listed Equities</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-[10px] text-[#74777F] uppercase block font-medium">
            24h Equities Volume
          </span>
          <div className="text-xl font-bold font-serif text-[#2A2012] mt-1">
            <CentralBankMaskedValue value={totalVol} suffix=" ARTH" />
          </div>
          <span className="text-[10px] text-[#5C574F] mt-0.5 block">Across Sovereign Tickers</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-[10px] text-[#74777F] uppercase block font-medium">
            Market Circuit Breaker
          </span>
          <div className="text-xl font-bold font-serif text-emerald-700 mt-1">
            READY (±5.0%)
          </div>
          <span className="text-[10px] text-[#74777F] mt-0.5 block">No intraday trip</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-[10px] text-[#74777F] uppercase block font-medium">
            Active Inquiries
          </span>
          <div className="text-xl font-bold font-serif text-amber-700 mt-1">
            1 Under Review
          </div>
          <span className="text-[10px] text-amber-700 mt-0.5 block">JVA Biopharm Ticker</span>
        </div>
      </div>

      {/* Listed Companies Surveillance Table */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 overflow-hidden shadow-xs space-y-3">
        <div className="p-5 border-b border-[#946726]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2A2012]">
              Listed Enterprises &amp; Regulatory Standing
            </h3>
            <p className="text-xs text-[#5C574F]">
              Real-time ticker surveillance, regulatory status, and supervisory halt controls
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symbol, enterprise name..."
              className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-[#946726]/10 font-mono text-[10px] text-[#5C574F] uppercase tracking-wider">
              <tr>
                <th className="p-4">Symbol &amp; Enterprise</th>
                <th className="p-4">Market Price</th>
                <th className="p-4">24h Shift</th>
                <th className="p-4">Market Cap</th>
                <th className="p-4">Listing Status</th>
                <th className="p-4">Regulatory Standing</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredCompanies.map((comp) => {
                const isHalted = comp.listingStatus === 'Trading Halted';
                const isSurveillance = comp.listingStatus === 'Under Surveillance';
                const isGain = comp.dailyChangePercent >= 0;

                return (
                  <tr key={comp.symbol} className="hover:bg-[#F6F8F7] transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#946726]/10 flex items-center justify-center font-mono font-bold text-[#946726] text-xs shrink-0">
                        {comp.symbol}
                      </div>
                      <div>
                        <strong className="font-serif font-bold text-[#2A2012] text-sm block">
                          {comp.name}
                        </strong>
                        <span className="font-mono text-[10px] text-[#74777F]">
                          Shares: {comp.sharesOutstanding.toLocaleString('en-US')}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-[#2A2012]">
                      {comp.marketPrice.toFixed(2)} ARTH
                    </td>

                    <td className="p-4 font-mono">
                      <span
                        className={`font-bold ${
                          isGain ? 'text-emerald-700' : 'text-[#B5482E]'
                        }`}
                      >
                        {isGain ? '+' : ''}
                        {comp.dailyChangePercent.toFixed(1)}%
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[#2A2012]">
                      <CentralBankMaskedValue value={comp.marketCap} suffix=" ARTH" />
                    </td>

                    <td className="p-4 font-mono">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isHalted
                            ? 'bg-red-100 text-[#B5482E] border-red-300'
                            : isSurveillance
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {comp.listingStatus}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          comp.regulatoryStanding === 'Fully Compliant'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : comp.regulatoryStanding === 'Inquiry Opened'
                            ? 'bg-red-50 text-[#B5482E] border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {comp.regulatoryStanding}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCompany(comp)}
                          className="px-2.5 py-1 rounded-lg bg-[#946726]/10 hover:bg-[#946726] text-[#946726] hover:text-white transition text-[11px] font-bold cursor-pointer"
                        >
                          Surveillance File
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleHalt(comp.symbol)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition cursor-pointer ${
                            isHalted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-red-50 text-[#B5482E] border-red-300 hover:bg-red-100'
                          }`}
                        >
                          {isHalted ? 'Resume' : 'Halt'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Surveillance Inspection Drawer */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  EQUITIES REGULATORY AUDIT
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {selectedCompany.symbol} — {selectedCompany.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompany(null)}
                className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans bg-[#FDFBF7] overflow-y-auto">
              
              <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <strong className="text-[#2A2012]">{selectedCompany.marketPrice} ARTH</strong>
                </div>
                <div className="flex justify-between">
                  <span>Market Valuation:</span>
                  <strong className="text-[#2A2012]">{selectedCompany.marketCap.toLocaleString('en-US')} ARTH</strong>
                </div>
                <div className="flex justify-between">
                  <span>Free Float:</span>
                  <strong className="text-[#2A2012]">{selectedCompany.freeFloatPercent}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dividend Yield:</span>
                  <strong className="text-emerald-700">{selectedCompany.dividendYield}% p.a.</strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Statutory Filing:</span>
                  <strong className="text-[#946726]">{selectedCompany.lastFilingDate}</strong>
                </div>
              </div>

              {selectedCompany.activeInquiryNote && (
                <div className="p-4 bg-red-50 border border-[#B5482E]/30 text-[#B5482E] rounded-2xl space-y-1">
                  <strong className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Active Surveillance Inquiry
                  </strong>
                  <p className="text-[11px] leading-relaxed">
                    {selectedCompany.activeInquiryNote}
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleHalt(selectedCompany.symbol);
                    setSelectedCompany(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#B5482E] hover:bg-[#9B3C25] text-white text-xs font-bold transition cursor-pointer"
                >
                  {selectedCompany.listingStatus === 'Trading Halted' ? 'Lift Trading Halt' : 'Execute Immediate Trading Halt'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-[#5C574F] text-xs font-semibold cursor-pointer"
                >
                  Close File
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
