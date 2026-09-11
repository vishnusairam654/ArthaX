'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  Info,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  MOCK_COMMERCIAL_BANKS,
  DEMO_POLICY_NOTICE,
} from '@/components/central-bank/CentralBankMockData';
import { CentralBankMaskedValue } from '@/components/central-bank/CentralBankMaskedValue';

export default function BankMonitoringPage() {
  const [selectedMetric, setSelectedMetric] = useState<'crr' | 'slr' | 'car' | 'failedTx'>('crr');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              ANALYTICAL SURVEILLANCE
            </span>
            <span className="text-[11px] text-[#A8742A] font-mono font-medium">
              [PROVISIONAL DEMO BENCHMARKS]
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Commercial Bank Monitoring &amp; Risk Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Continuous prudential surveillance across liquidity reserves, settlement failure ratios, risk-weighted capital buffers, and inter-institutional systemic exposure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold">
            Systemic Risk: LOW (0.14)
          </span>
        </div>
      </div>

      {/* Prudential Mandate Metric Selector Ribbons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <button
          type="button"
          onClick={() => setSelectedMetric('crr')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'crr'
              ? 'bg-white border-[#946726] shadow-md ring-2 ring-[#946726]/10'
              : 'bg-white border-[#946726]/15 hover:border-[#946726]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#5C574F]">
            <span>Cash Reserve Ratio (CRR)</span>
            <span className="text-[10px] font-mono font-bold text-[#A8742A]">Min 12.0%</span>
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-[#2A2012]">
            12.48% <span className="text-xs font-normal text-emerald-700 font-sans">Avg System</span>
          </div>
          <div className="text-[10px] text-[#74777F] font-mono mt-1">
            4 of 5 compliant • 1 on watchlist
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMetric('slr')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'slr'
              ? 'bg-white border-[#946726] shadow-md ring-2 ring-[#946726]/10'
              : 'bg-white border-[#946726]/15 hover:border-[#946726]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#5C574F]">
            <span>Statutory Liquidity (SLR)</span>
            <span className="text-[10px] font-mono font-bold text-[#A8742A]">Min 18.0%</span>
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-[#2A2012]">
            18.94% <span className="text-xs font-normal text-emerald-700 font-sans">Avg System</span>
          </div>
          <div className="text-[10px] text-[#74777F] font-mono mt-1">
            Strong sovereign bond coverage
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMetric('car')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'car'
              ? 'bg-white border-[#946726] shadow-md ring-2 ring-[#946726]/10'
              : 'bg-white border-[#946726]/15 hover:border-[#946726]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#5C574F]">
            <span>Capital Adequacy (CAR)</span>
            <span className="text-[10px] font-mono font-bold text-[#A8742A]">Min 14.0%</span>
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-[#2A2012]">
            15.60% <span className="text-xs font-normal text-emerald-700 font-sans">Avg System</span>
          </div>
          <div className="text-[10px] text-[#74777F] font-mono mt-1">
            Tier-1 capital headroom secure
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMetric('failedTx')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedMetric === 'failedTx'
              ? 'bg-white border-[#946726] shadow-md ring-2 ring-[#946726]/10'
              : 'bg-white border-[#946726]/15 hover:border-[#946726]/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#5C574F]">
            <span>24h Failed Settlement Rate</span>
            <span className="text-[10px] font-mono font-bold text-[#A8742A]">Max 0.10%</span>
          </div>
          <div className="mt-2 font-mono text-xl font-bold text-emerald-800">
            0.054% <span className="text-xs font-normal text-emerald-700 font-sans">Nominal</span>
          </div>
          <div className="text-[10px] text-[#74777F] font-mono mt-1">
            No atomic rollbacks unhandled
          </div>
        </button>

      </div>

      {/* Comparative Analytical Matrix */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#946726]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2A2012]">
              Institutional Comparison &amp; Prudential Ratios
            </h3>
            <span className="text-xs text-[#74777F]">
              Comparative telemetry across all 5 commercial banking licensees
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-[#FAF9F6] border border-[#946726]/15 text-[11px] font-mono text-[#946726]">
            Benchmark Cycle: T+0 Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-[#946726]/10 font-mono text-[10px] text-[#5C574F] uppercase tracking-wider">
              <tr>
                <th className="p-4">Bank</th>
                <th className="p-4">CRR (Min 12%)</th>
                <th className="p-4">SLR (Min 18%)</th>
                <th className="p-4">CAR (Min 14%)</th>
                <th className="p-4">Liquidity Buffer</th>
                <th className="p-4">Failed Rate (24h)</th>
                <th className="p-4">Compliance Status</th>
                <th className="p-4">Risk Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#946726]/10 font-sans">
              {MOCK_COMMERCIAL_BANKS.map((bank) => (
                <tr key={bank.id} className="hover:bg-[#F6F8F7] transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#946726]/15 p-1 flex items-center justify-center shrink-0">
                      <Image
                        src={bank.logo}
                        alt={bank.shortName}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <strong className="font-serif font-bold text-[#2A2012] block">
                        {bank.name}
                      </strong>
                      <span className="text-[10px] font-mono text-[#74777F]">
                        {bank.shortName}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          bank.crrRatio < 12.0 ? 'text-[#B5482E]' : 'text-[#2A2012]'
                        }`}
                      >
                        {bank.crrRatio.toFixed(1)}%
                      </span>
                      {bank.crrRatio < 12.0 && (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#B5482E]" />
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-[#2A2012]">
                    {bank.slrRatio.toFixed(1)}%
                  </td>

                  <td className="p-4 font-mono font-bold text-[#2A2012]">
                    {bank.carRatio.toFixed(1)}%
                  </td>

                  <td className="p-4 font-mono text-[#2A2012]">
                    <CentralBankMaskedValue value={bank.liquidityBuffer} suffix=" ARTH" />
                  </td>

                  <td className="p-4 font-mono">
                    <span
                      className={`${
                        bank.failedTxRate24h > 0.1 ? 'text-[#B5482E] font-bold' : 'text-emerald-700'
                      }`}
                    >
                      {bank.failedTxRate24h.toFixed(2)}%
                    </span>
                  </td>

                  <td className="p-4 font-mono">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        bank.reserveCompliance === 'Compliant'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {bank.reserveCompliance}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-[#2A2012] font-bold border border-gray-200">
                      {bank.id === 'sthira' ? 'Tier-B (Watch)' : 'Tier-A (Prime)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Trend & Liquidity Velocity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#2A2012] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#946726]" />
              <span>30-Day Liquidity Buffer Stability</span>
            </h3>
            <span className="text-[10px] font-mono text-[#74777F]">
              Rolling 30-Day Mean
            </span>
          </div>

          <p className="text-xs text-[#5C574F] leading-relaxed">
            Composite liquidity buffer reserves held at the Central Bank relative to gross settlement clearing obligations.
          </p>

          {/* Graphical Representation Bar */}
          <div className="space-y-3 pt-2">
            {[
              { label: 'NAVA Bank', val: 94, buffer: '3.5M ARTH', status: 'Healthy' },
              { label: 'SETU Bank', val: 91, buffer: '3.1M ARTH', status: 'Healthy' },
              { label: 'VAYU Bank', val: 88, buffer: '2.95M ARTH', status: 'Healthy' },
              { label: 'SAMAYA Bank', val: 82, buffer: '2.6M ARTH', status: 'Healthy' },
              { label: 'STHIRA Bank', val: 68, buffer: '1.85M ARTH', status: 'Attention' },
            ].map((row) => (
              <div key={row.label} className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <strong className="text-[#2A2012] font-sans">{row.label}</strong>
                  <span className="text-[#74777F]">{row.buffer}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      row.val < 75 ? 'bg-[#B5482E]' : 'bg-[#946726]'
                    }`}
                    style={{ width: `${row.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#2A2012] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#946726]" />
              <span>Supervisory Action Protocol</span>
            </h3>
            <span className="text-[10px] font-mono text-[#74777F]">
              Standard Operating Matrix
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-[#5C574F]">
            <div className="p-3 rounded-xl bg-[#F6F8F7] border border-[#946726]/10 space-y-1">
              <strong className="text-[#2A2012] block font-sans">Level 1: Watchlist &amp; Enhanced Telemetry</strong>
              <p className="text-[11px] leading-relaxed">
                Triggered when CRR drops between 11.5% and 12.0%. Commercial bank must post intra-day liquidity report every 60 minutes until restored.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <strong className="text-amber-900 block font-sans">Level 2: Mandatory Capital Escrow Injection</strong>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Triggered when CRR touches &lt; 11.5% for &gt; 4 consecutive hours. Central Bank freezes outward inter-bank wire authority until reserve buffer is topped up.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-1">
              <strong className="text-[#B5482E] block font-sans">Level 3: Charter Suspension &amp; Conservatorship</strong>
              <p className="text-[11px] text-red-800 leading-relaxed">
                Triggered upon persistent insolvency or unhandled settlement shortfall. Central Bank assumes administrative control.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
