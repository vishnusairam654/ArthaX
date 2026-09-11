'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  ArrowDownToLine,
  Eye,
  ShieldCheck,
  X,
  Share2,
} from 'lucide-react';
import {
  MOCK_REGULATORY_REPORTS,
  RegulatoryReportItem,
  ReportCategory,
} from '@/components/central-bank/CentralBankMockData';

const CATEGORIES: ('all' | ReportCategory)[] = [
  'all',
  'Banking',
  'Money Supply',
  'Inter-bank Settlement',
  'Tax',
  'Bank Performance',
  'Market',
  'Compliance',
  'Transactions',
  'Fixed Deposits',
  'Loans',
  'Fees',
];

export default function CentralBankReportsPage() {
  const [reports, setReports] = useState<RegulatoryReportItem[]>(MOCK_REGULATORY_REPORTS);
  const [activeCategory, setActiveCategory] = useState<'all' | ReportCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<RegulatoryReportItem | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredReports = reports.filter((rep) => {
    const matchesCategory = activeCategory === 'all' || rep.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExport = (report: RegulatoryReportItem) => {
    setExportNotice(
      `Report "${report.id}" dispatched for download in ${report.format} format (Signed by Central Authority).`
    );
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              OFFICIAL REGULATORY ARCHIVE
            </span>
            <span className="text-[11px] text-[#A8742A] font-mono font-medium">
              12 AUDITED CATEGORIES
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            System-Wide Reports &amp; Gazettes
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Statutory macroeconomic datasets, money supply audits, inter-bank CLS clearing summaries, prudential stress tests, and tax yield assessments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#946726]/10 text-[#946726] font-mono text-xs font-bold border border-[#946726]/20">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Archive Synchronized</span>
          </span>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Categories Ribbon (All 12 Categories Supported) */}
      <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#946726]/70">
            Filter by Supervisory Scope
          </span>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="pl-9 pr-3 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#946726] text-white font-bold shadow-xs'
                  : 'text-[#5C574F] hover:text-[#946726] bg-[#F6F8F7]'
              }`}
            >
              {cat === 'all' ? 'All Gazettes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Listing Table */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-[#946726]/10 font-mono text-[10px] text-[#5C574F] uppercase tracking-wider">
              <tr>
                <th className="p-4">Report Identifier</th>
                <th className="p-4">Category</th>
                <th className="p-4">Accounting Period</th>
                <th className="p-4">Security Clearance</th>
                <th className="p-4">Format</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-[#F6F8F7] transition">
                  <td className="p-4">
                    <strong className="font-serif font-bold text-sm text-[#2A2012] block">
                      {report.title}
                    </strong>
                    <span className="font-mono text-[10px] text-[#74777F]">
                      {report.id} • Generated {report.generatedAt}
                    </span>
                  </td>

                  <td className="p-4 font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-[#946726]/8 text-[#946726] text-[11px] font-bold">
                      {report.category}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-medium text-[#2A2012]">
                    {report.period}
                  </td>

                  <td className="p-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        report.securityClearance === 'Board Restricted'
                          ? 'bg-red-50 text-[#B5482E] border-red-200'
                          : report.securityClearance === 'Confidential'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {report.securityClearance}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-xs text-[#5C574F]">
                    {report.format} ({(report.fileSizeBytes / 1_000_000).toFixed(1)} MB)
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#2A2012] transition cursor-pointer"
                        title="Inspect Summary"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExport(report)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  REGULATORY REPORT DOSSIER
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {selectedReport.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans bg-[#FDFBF7]">
              <div>
                <h4 className="font-serif font-bold text-base text-[#2A2012]">
                  {selectedReport.title}
                </h4>
                <div className="flex items-center gap-3 font-mono text-[10px] text-[#74777F] mt-1">
                  <span>Scope: {selectedReport.category}</span>
                  <span>•</span>
                  <span>Period: {selectedReport.period}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 space-y-2 shadow-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#74777F] block">
                  Executive Abstract
                </span>
                <p className="text-xs text-[#262320] leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3 bg-[#F6F8F7] rounded-xl border border-gray-200">
                  <span className="text-[9px] uppercase text-[#74777F] block">Security Clearance</span>
                  <strong className="text-[#2A2012] text-xs">{selectedReport.securityClearance}</strong>
                </div>
                <div className="p-3 bg-[#F6F8F7] rounded-xl border border-gray-200">
                  <span className="text-[9px] uppercase text-[#74777F] block">File Size &amp; Format</span>
                  <strong className="text-[#2A2012] text-xs">{selectedReport.format} • {(selectedReport.fileSizeBytes / 1_000_000).toFixed(1)} MB</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleExport(selectedReport);
                    setSelectedReport(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Download Signed {selectedReport.format}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-[#5C574F] text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
