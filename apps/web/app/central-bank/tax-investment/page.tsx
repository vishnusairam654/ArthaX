'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ReceiptText,
  Scale,
  Calendar,
  History,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Info,
  Search,
  Filter,
  X,
  TrendingUp,
  Percent,
} from 'lucide-react';
import {
  MOCK_TAX_RULES,
  TaxRuleRecord,
  PolicyStatus,
  DEMO_POLICY_NOTICE,
} from '@/components/central-bank/CentralBankMockData';

export default function TaxInvestmentPage() {
  const [rules, setRules] = useState<TaxRuleRecord[]>(MOCK_TAX_RULES);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<TaxRuleRecord | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Draft form state
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('TAX-NEW-DIRECTIVE');
  const [category, setCategory] = useState<TaxRuleRecord['category']>('Settlement Tax');
  const [rateDesc, setRateDesc] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('2027-01-01');
  const [rationale, setRationale] = useState('');

  const filteredRules = rules.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rateDesc) return;

    const newRule: TaxRuleRecord = {
      id: `TR-${Date.now().toString().slice(-3)}`,
      code: code.toUpperCase(),
      title,
      category,
      version: 'v1.0.0-DRAFT',
      status: 'Draft',
      effectiveDate,
      changedBy: 'Sovereign Revenue Taskforce',
      changeRationale: rationale || 'Preliminary tax policy proposal.',
      rateDescription: `${rateDesc} [Provisional Demo Value]`,
      thresholdOrRate: rateDesc,
      isDemoBenchmark: true,
      notes: 'Currently in committee review; not enforceable until gazetted.',
    };

    setRules([newRule, ...rules]);
    setIsDraftModalOpen(false);
    setTitle('');
    setRateDesc('');
    setRationale('');
    setNotification(`Draft tax directive "${newRule.title}" staged successfully.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const getStatusBadge = (status: PolicyStatus) => {
    switch (status) {
      case 'Current':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Previous':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Draft':
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              FISCAL &amp; INVESTMENT CODE
            </span>
            <span className="text-[11px] text-[#A8742A] font-mono font-medium">
              [PROVISIONAL DEMO BENCHMARKS]
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            System-Wide Tax &amp; Investment Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Centralized governance of transactional levies, equities capital gains taxation, dividend withholding mandates, and market-wide investment circuit limits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDraftModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Stage Tax Proposal</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Core Rule Principle Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 shadow-xs space-y-1">
          <span className="text-[10px] text-[#74777F] uppercase block">Profit-Only Realization</span>
          <strong className="text-sm font-bold text-[#2A2012] block">15.00% Net Trade Profit</strong>
          <p className="text-[11px] font-sans text-[#5C574F] leading-snug">
            Taxes strictly net realized capital gains. Zero tax on holding duration or loss-making exits.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 shadow-xs space-y-1">
          <span className="text-[10px] text-[#74777F] uppercase block">CLS Settlement Friction Fee</span>
          <strong className="text-sm font-bold text-[#2A2012] block">0.05% Inter-Bank Wire</strong>
          <p className="text-[11px] font-sans text-[#5C574F] leading-snug">
            Sub-basis-point levy allocated to immutable ledger infrastructure and cryptographic HSM operations.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 shadow-xs space-y-1">
          <span className="text-[10px] text-[#74777F] uppercase block">Long-Term Patient Horizon</span>
          <strong className="text-sm font-bold text-[#2A2012] block">365-Day Threshold</strong>
          <p className="text-[11px] font-sans text-[#5C574F] leading-snug">
            Positions held beyond 1 full calendar year enjoy a 66% tax concession (rate collapses to 5.0%).
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Current', 'Scheduled', 'Draft', 'Previous'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#946726] text-white shadow-xs'
                  : 'text-[#5C574F] hover:text-[#946726] bg-[#F6F8F7]'
              }`}
            >
              {st === 'all' ? 'All Rules' : st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tax rules by code, title..."
            className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs hover:border-[#946726]/40 transition flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#946726]">
                    {rule.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#946726]/8 text-[#946726] font-mono text-[10px] font-bold">
                    {rule.version}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(
                      rule.status
                    )}`}
                  >
                    {rule.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#74777F]">
                  {rule.category}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#2A2012]">
                  {rule.title}
                </h3>
              </div>

              <div className="p-3.5 bg-[#F6F8F7] rounded-2xl border border-[#946726]/10 font-mono">
                <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                  Mandated Rate / Formula
                </span>
                <div className="text-sm font-bold text-[#2A2012] mt-0.5">
                  {rule.rateDescription}
                </div>
              </div>

              <p className="text-xs text-[#5C574F] leading-relaxed">
                {rule.changeRationale}
              </p>

              <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-[#5C574F] font-mono leading-tight">
                <strong>Statutory Note:</strong> {rule.notes}
              </div>

              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#74777F]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#946726]" />
                  Effective: <strong>{rule.effectiveDate}</strong>
                </span>
                <span className="truncate max-w-[180px]" title={rule.changedBy}>
                  Enacted By: {rule.changedBy}
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#946726]/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRule(rule)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#946726]/10 hover:bg-[#946726] text-[#946726] hover:text-white transition text-xs font-bold cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit Trail &amp; Predecessor</span>
              </button>

              <span className="text-[10px] font-mono text-[#A8742A]">
                Immature Gains Exempt
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rule Audit Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  STATUTORY TAX RULE AUDIT
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  {selectedRule.code} ({selectedRule.version})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans bg-[#FDFBF7]">
              <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 space-y-1.5 font-mono text-[11px]">
                <div>Rule Code: <strong>{selectedRule.code}</strong></div>
                <div>Status: <strong>{selectedRule.status}</strong></div>
                <div>Enacted Date: <strong>{selectedRule.effectiveDate}</strong></div>
                <div>Legislative Origin: <strong>{selectedRule.changedBy}</strong></div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                  Regulatory Compliance Details
                </h4>
                <p className="text-xs text-[#5C574F] leading-relaxed">
                  {selectedRule.notes}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRule(null)}
                  className="px-4 py-2 rounded-xl bg-[#946726] text-white text-xs font-bold cursor-pointer"
                >
                  Close Audit File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage Draft Tax Proposal Modal */}
      {isDraftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  LEGISLATIVE REVENUE AMENDMENT
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Stage Draft Tax Directive
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDraftModalOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="p-6 space-y-4 text-xs font-sans bg-[#FDFBF7]">
              <div>
                <label className="block font-bold text-[#946726] mb-1">
                  Tax Rule Title <span className="text-[#B5482E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sovereign Bond Coupon Withholding Exemption"
                  className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#946726] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none"
                  >
                    <option value="Settlement Tax">Settlement Tax</option>
                    <option value="Capital Gains">Capital Gains</option>
                    <option value="Holding Horizon">Holding Horizon</option>
                    <option value="Withholding">Withholding</option>
                    <option value="Investment Limit">Investment Limit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#946726] mb-1">Rule Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 font-mono bg-white border border-[#946726]/20 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#946726] mb-1">
                  Proposed Levy Rate / Bracket <span className="text-[#B5482E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rateDesc}
                  onChange={(e) => setRateDesc(e.target.value)}
                  placeholder="e.g. 5.00% with zero threshold deduction"
                  className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#946726] mb-1">Target Effective Date</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full p-2.5 font-mono bg-white border border-[#946726]/20 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#946726] mb-1">Fiscal Rationale</label>
                <textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="State the economic impact and justification..."
                  className="w-full h-20 p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-4 py-2 text-[#74777F] hover:text-[#262320]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#946726] hover:bg-[#2A2012] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Stage Draft Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
