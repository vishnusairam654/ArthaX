'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  MOCK_REPORT_CATEGORIES,
  ReportSummary,
} from '@/components/bank/BankMockData';

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('deposits');
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeCategory =
    MOCK_REPORT_CATEGORIES.find((c) => c.id === selectedCategory) || MOCK_REPORT_CATEGORIES[0];

  const handleExport = (format: string) => {
    setActionNotice(`${activeCategory.name} report exported as ${format} successfully.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Financial Reports &amp; Analytics</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Operational summaries, liquidity metrics, CLS volume, and compliance logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B3278] text-white text-xs font-bold hover:bg-[#2D2654] transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement (PDF)</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Category Tabs & Time Horizon Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#3B3278]/10 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {MOCK_REPORT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#3B3278] text-white shadow-xs'
                  : 'text-[#74777F] hover:text-[#3B3278] hover:bg-[#3B3278]/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#FAFAFF] border border-[#3B3278]/10 rounded-xl">
          {['7d', '30d', '90d', 'ytd'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase font-mono transition cursor-pointer ${
                timeRange === t
                  ? 'bg-[#3B3278] text-white shadow-xs'
                  : 'text-[#74777F] hover:text-[#3B3278]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Strip for Selected Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCategory.metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-2"
          >
            <span className="text-xs text-[#74777F] font-medium">{metric.label}</span>
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-2xl font-bold text-[#1C1736]">{metric.value}</div>
              {metric.change && (
                <div
                  className={`flex items-center gap-0.5 text-xs font-mono font-bold ${
                    metric.isPositive ? 'text-emerald-600' : 'text-[#B5482E]'
                  }`}
                >
                  {metric.isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{metric.change}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Breakdown Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#3B3278]/8 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#3B3278]" />
            <h2 className="text-sm font-bold text-[#1C1736]">
              {activeCategory.name} Distribution &amp; Flow Analysis
            </h2>
          </div>
          <span className="text-xs text-[#74777F] font-mono">
            Window: {timeRange.toUpperCase()}
          </span>
        </div>

        {/* Progress Breakdown Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#1C1736]">Tier-1 Sovereign Reserve Ratio</span>
              <span className="font-mono text-[#3B3278] font-bold">78.4% (Compliant)</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#3B3278] rounded-full" style={{ width: '78.4%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#1C1736]">CLS Inter-bank Clearing Finality</span>
              <span className="font-mono text-emerald-600 font-bold">99.2% (Under 500ms)</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.2%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#1C1736]">Capital Adequacy vs Central Bank Threshold</span>
              <span className="font-mono text-[#A8742A] font-bold">14.8% (Min 8.5%)</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#A8742A] rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
        </div>

        {/* Regulatory Compliance Footnote */}
        <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8 text-xs text-[#74777F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sovereign Central Bank Automated Reporting Pipeline Active</span>
          </div>
          <span className="font-mono text-[11px] text-[#3B3278] font-bold">ISO 20022 Verified</span>
        </div>
      </div>
    </div>
  );
}
