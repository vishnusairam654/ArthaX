'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  History,
  FileEdit,
  Tag,
  AlertCircle,
  Filter,
  Search,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';
import {
  MOCK_FINANCIAL_RULES,
  FinancialRuleRecord,
  PolicyStatus,
  DEMO_POLICY_NOTICE,
} from '@/components/central-bank/CentralBankMockData';

export default function FinancialRulesPage() {
  const [rules, setRules] = useState<FinancialRuleRecord[]>(MOCK_FINANCIAL_RULES);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<FinancialRuleRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Rule Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<FinancialRuleRecord['category']>('Monetary Policy');
  const [newVersion, setNewVersion] = useState('v1.0.0-DRAFT');
  const [newEffectiveDate, setNewEffectiveDate] = useState('2026-12-01');
  const [newValueDesc, setNewValueDesc] = useState('');
  const [newRationale, setNewRationale] = useState('');

  const filteredRules = rules.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.version.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newValueDesc) return;

    const created: FinancialRuleRecord = {
      id: `FR-${Date.now().toString().slice(-3)}`,
      code: `POL-${newTitle.toUpperCase().replace(/\s+/g, '-').slice(0, 10)}`,
      title: newTitle,
      category: newCategory,
      version: newVersion,
      status: 'Draft',
      effectiveDate: newEffectiveDate,
      changedBy: 'Regulatory Policy Drafting Desk',
      changeRationale: newRationale || 'Provisional draft policy formulation.',
      valueDescription: `${newValueDesc} [Provisional Demo Benchmark]`,
      unit: '%',
      isDemoBenchmark: true,
      historyCount: 1,
    };

    setRules([created, ...rules]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewValueDesc('');
    setNewRationale('');
    setNotification(`Draft policy "${created.title}" successfully registered under ${created.version}.`);
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
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              MONETARY POLICY STATUTES
            </span>
            <span className="text-[11px] text-[#A8742A] font-mono font-medium">
              [PROVISIONAL DEMO BENCHMARKS]
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Financial Rules &amp; Prudential Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Statutory monetary policy parameters, reserve mandates (CRR/SLR), transaction velocity ceilings, and prudential capital rules governing all commercial banking participants.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Draft Policy Directive</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Ribbon */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs: Current, Scheduled, Previous, Draft */}
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
              {st === 'all' ? 'All Policies' : st}
            </button>
          ))}

          <span className="text-gray-300 hidden sm:inline">|</span>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs font-semibold text-[#2A2012] outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Monetary Policy">Monetary Policy</option>
            <option value="Reserve Requirement">Reserve Requirement</option>
            <option value="Transaction Limit">Transaction Limit</option>
            <option value="Prudential Rule">Prudential Rule</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, title, version..."
            className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full lg:w-64"
          />
        </div>
      </div>

      {/* Rules Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRules.map((rule) => {
          return (
            <div
              key={rule.id}
              className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs hover:border-[#946726]/40 transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header Strip */}
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
                    Rev #{rule.historyCount}
                  </span>
                </div>

                {/* Title & Value */}
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2A2012]">
                    {rule.title}
                  </h3>
                  <span className="text-[11px] font-mono text-[#74777F]">
                    Category: {rule.category}
                  </span>
                </div>

                <div className="p-3.5 bg-[#F6F8F7] rounded-2xl border border-[#946726]/10 font-mono">
                  <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                    Policy Parameter Benchmark
                  </span>
                  <div className="text-sm font-bold text-[#2A2012] mt-0.5">
                    {rule.valueDescription}
                  </div>
                </div>

                {/* Rationale & Effective Date */}
                <p className="text-xs text-[#5C574F] leading-relaxed">
                  {rule.changeRationale}
                </p>

                <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#74777F]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#946726]" />
                    Effective: <strong>{rule.effectiveDate}</strong>
                  </span>
                  <span className="truncate max-w-[200px]" title={rule.changedBy}>
                    By: {rule.changedBy}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#946726]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedRule(rule)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#946726]/10 hover:bg-[#946726] text-[#946726] hover:text-white transition text-xs font-bold cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Version History</span>
                </button>

                <span className="text-[10px] font-mono text-[#A8742A]">
                  Double-Entry Invariant Checked
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Version History Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  STATUTORY REVISION AUDIT
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  {selectedRule.code} — {selectedRule.title}
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
              <div className="p-3 bg-white rounded-xl border border-[#946726]/15 space-y-1 font-mono text-[11px]">
                <div>Current Version: <strong>{selectedRule.version}</strong></div>
                <div>Status: <strong>{selectedRule.status}</strong></div>
                <div>Effective Date: <strong>{selectedRule.effectiveDate}</strong></div>
                <div>Authorized By: <strong>{selectedRule.changedBy}</strong></div>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                  Immutable Revision Timeline
                </h4>
                <div className="space-y-2.5 font-mono text-[11px] text-[#5C574F] pl-3 border-l-2 border-[#946726]/20">
                  <div>
                    <strong className="text-[#2A2012] block">{selectedRule.version} (Active)</strong>
                    <span className="text-[10px] text-[#74777F]">Enacted {selectedRule.effectiveDate} • {selectedRule.changedBy}</span>
                    <p className="font-sans text-[11px] text-[#262320] mt-0.5">{selectedRule.changeRationale}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <strong className="text-[#74777F] block">v2.3.8 (Superseded)</strong>
                    <span className="text-[10px] text-[#74777F]">Enacted 2025-12-01 • Monetary Policy Committee</span>
                    <p className="font-sans text-[11px] text-[#74777F] mt-0.5">Prior monetary baseline parameter.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRule(null)}
                  className="px-4 py-2 rounded-xl bg-[#946726] text-white text-xs font-bold cursor-pointer"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Draft Policy Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden">
            <div className="p-5 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  NEW DIRECTIVE FORMULATION
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Draft Monetary Policy Parameter
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="p-6 space-y-4 text-xs font-sans bg-[#FDFBF7]">
              <div>
                <label className="block font-bold text-[#946726] mb-1">
                  Policy Directive Title <span className="text-[#B5482E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Supplementary Fixed Deposit Rate Ceiling"
                  className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none focus:border-[#946726]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#946726] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none"
                  >
                    <option value="Monetary Policy">Monetary Policy</option>
                    <option value="Reserve Requirement">Reserve Requirement</option>
                    <option value="Transaction Limit">Transaction Limit</option>
                    <option value="Prudential Rule">Prudential Rule</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#946726] mb-1">Draft Version</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full p-2.5 font-mono bg-white border border-[#946726]/20 rounded-xl outline-none"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#946726] mb-1">
                  Proposed Value Benchmark <span className="text-[#B5482E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newValueDesc}
                  onChange={(e) => setNewValueDesc(e.target.value)}
                  placeholder="e.g. 7.50% p.a. Maximum Benchmark"
                  className="w-full p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#946726] mb-1">Target Effective Date</label>
                <input
                  type="date"
                  value={newEffectiveDate}
                  onChange={(e) => setNewEffectiveDate(e.target.value)}
                  className="w-full p-2.5 font-mono bg-white border border-[#946726]/20 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#946726] mb-1">Regulatory Rationale</label>
                <textarea
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  placeholder="State macroeconomic context and objective of proposed parameter..."
                  className="w-full h-20 p-2.5 bg-white border border-[#946726]/20 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
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
