'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  FileText, 
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { SAMPLE_TAX_RECORDS, LISTED_COMPANIES } from '@/components/stocks/StockData';
import { TaxLossSimulatorModal } from '@/components/stocks/tax/TaxLossSimulatorModal';

export default function ProfitAndTaxLedgerPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [periodFilter, setPeriodFilter] = useState<'all' | 'stcg' | 'ltcg'>('all');

  const filteredRecords = SAMPLE_TAX_RECORDS.filter((rec) => {
    if (periodFilter === 'all') return true;
    if (periodFilter === 'stcg') return rec.holdingPeriod.includes('STCG');
    if (periodFilter === 'ltcg') return rec.holdingPeriod.includes('LTCG');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. SECTION 18-C COMPLIANT HEADER */}
      <section className="bg-white border border-[#173F35]/12 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-4 ring-[#10B981]/20"></span>
              <h1 className="font-serif text-2xl font-bold text-[#173F35]">Profit &amp; Tax Ledger</h1>
              <span className="text-[11px] font-mono font-bold bg-[#DCEEE8] text-[#173F35] border border-[#2F7468]/20 px-2 py-0.5 rounded">
                SECTION 18-C COMPLIANT
              </span>
            </div>
            <p className="text-xs text-[#4A534F] max-w-3xl leading-relaxed">
              Real-time capital gains accounting, automated Section 18-C tax withholding on net realized profit, STCG/LTCG fiscal categorization, and tax-loss harvesting blotter with cryptographic state proofs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <div className="bg-[#FAF8F5] border border-[#173F35]/10 px-3 py-1.5 rounded-lg text-[#1A1C18]">
              <span className="text-[#717975]">FISCAL YEAR:</span> <strong className="text-[#173F35] font-bold">2024-25 Q4</strong>
            </div>
            <div className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>MERKLE ROOT: #994,102,840</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUMMARY METRIC CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Net Realized Gains */}
        <div className="bg-white border border-[#173F35]/12 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#717975] mb-2 text-xs font-mono font-bold uppercase">
              <span>Net Realized Gains</span>
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1A1C18]">+32,180.00</span>
              <span className="text-xs font-bold text-[#A8742A] font-mono">ARTH</span>
            </div>
            <div className="mt-2 text-[11px] text-[#10B981] font-mono font-bold">
              +18.4% vs FY23
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#173F35]/10 text-[10px] text-[#717975] flex justify-between font-mono">
            <span>Gross: 38,940.00</span>
            <span className="text-[#B94A43] font-medium">Offset: -6,760.00</span>
          </div>
        </div>

        {/* Metric 2: Estimated Tax Liability */}
        <div className="bg-white border border-[#173F35]/12 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#717975] mb-2 text-xs font-mono font-bold uppercase">
              <span>Estimated Tax Liability</span>
              <div className="w-8 h-8 rounded-lg bg-[#A8742A]/15 text-[#A8742A] flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1A1C18]">4,385.00</span>
              <span className="text-xs font-bold text-[#A8742A] font-mono">ARTH</span>
            </div>
            <div className="mt-2 text-[11px] text-[#A8742A] font-mono font-semibold">
              15% STCG / 10% LTCG
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#173F35]/10 text-[10px] text-[#717975] flex justify-between font-mono">
            <span>STCG: 2,865.00</span>
            <span>LTCG: 1,520.00</span>
          </div>
        </div>

        {/* Metric 3: Automated Withholdings */}
        <div className="bg-white border border-[#173F35]/12 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#717975] mb-2 text-xs font-mono font-bold uppercase">
              <span>SETU Tax Withheld</span>
              <div className="w-8 h-8 rounded-lg bg-[#2F7468]/15 text-[#2F7468] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1A1C18]">3,861.60</span>
              <span className="text-xs font-bold text-[#A8742A] font-mono">ARTH</span>
            </div>
            <div className="mt-2 text-[11px] text-[#10B981] font-mono font-semibold">
              88.1% SETTLED &amp; REMITTED
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#173F35]/10 text-[10px] text-[#717975] flex justify-between font-mono">
            <span>Pending Remittance:</span>
            <span className="font-bold text-[#A8742A]">523.40 ARTH</span>
          </div>
        </div>

        {/* Metric 4: Tax-Loss Harvesting Potential */}
        <div className="bg-white border border-[#173F35]/12 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#717975] mb-2 text-xs font-mono font-bold uppercase">
              <span>Harvesting Potential</span>
              <div className="w-8 h-8 rounded-lg bg-[#66A3BF]/20 text-[#173F35] flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1A1C18]">2,480.00</span>
              <span className="text-xs font-bold text-[#A8742A] font-mono">ARTH</span>
            </div>
            <div className="mt-2 text-[11px] text-[#2F7468] font-mono font-bold">
              ~372.00 ARTH Tax Savings
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#173F35]/10 flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#717975]">Unrealized Offsets</span>
            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              className="font-bold text-[#173F35] hover:underline cursor-pointer"
            >
              Simulate →
            </button>
          </div>
        </div>
      </section>

      {/* 3. REALIZED CAPITAL GAINS BLOTTER */}
      <section className="bg-white border border-[#173F35]/12 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#173F35]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#173F35]">
              Realized Capital Gains Trade Blotter
            </h3>
            <p className="text-xs text-[#717975]">
              Full audit log of realized positions and exact statutory withholdings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#173F35]/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setPeriodFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  periodFilter === 'all' ? 'bg-[#173F35] text-white shadow-xs' : 'text-[#717975]'
                }`}
              >
                All (5)
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('stcg')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  periodFilter === 'stcg' ? 'bg-[#173F35] text-white shadow-xs' : 'text-[#717975]'
                }`}
              >
                STCG (15%)
              </button>
              <button
                type="button"
                onClick={() => setPeriodFilter('ltcg')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  periodFilter === 'ltcg' ? 'bg-[#173F35] text-white shadow-xs' : 'text-[#717975]'
                }`}
              >
                LTCG (10%)
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert('Exporting Section 18-C tax summary packet...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#DCEEE8] border border-[#173F35]/15 text-[#173F35] text-xs font-bold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tax Packet</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#FAF8F5] text-[#717975] font-mono font-bold border-b border-[#173F35]/10 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Trade ID &amp; Date</th>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4">Fiscal Category</th>
                <th className="py-3 px-4 text-right">Shares</th>
                <th className="py-3 px-4 text-right">Cost Basis</th>
                <th className="py-3 px-4 text-right">Proceeds</th>
                <th className="py-3 px-4 text-right">Net Profit / (Loss)</th>
                <th className="py-3 px-4 text-right">Tax Withheld</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173F35]/10 font-mono">
              {filteredRecords.map((rec) => {
                const isProfitable = rec.netProfit >= 0;
                return (
                  <tr key={rec.id} className="hover:bg-[#FAF8F5] transition">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-[#173F35]">{rec.id}</div>
                      <div className="text-[10px] text-[#717975]">{rec.executionDate}</div>
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-[#1A1C18]">{rec.companyName}</div>
                      <div className="text-[10px] font-mono text-[#717975]">{rec.symbol}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#173F35]/15 text-[#173F35] text-[10px] font-bold">
                        {rec.holdingPeriod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#1A1C18]">
                      {rec.qty}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {rec.costBasis.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#1A1C18]">
                      {rec.realizedProceeds.toLocaleString('en-US')}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-bold ${
                        isProfitable ? 'text-[#287A55]' : 'text-[#B94A43]'
                      }`}>
                        {isProfitable ? '+' : ''}{rec.netProfit.toFixed(2)} ARTH
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#A8742A]">
                      {rec.taxWithheld.toFixed(2)} ARTH
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{rec.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tax-Loss Harvesting Simulator Modal */}
      <TaxLossSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
}
