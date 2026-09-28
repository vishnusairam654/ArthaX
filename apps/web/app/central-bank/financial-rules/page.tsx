'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { FinancialRuleDto, CreateFinancialRuleInput } from '@arthax/types';
import {
  apiFetchCentralBankRules,
  apiCreateCentralBankRule,
  subscribePortalDataInvalidation,
} from '@/lib/api';

export default function FinancialRulesPage() {
  const [rules, setRules] = useState<FinancialRuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<FinancialRuleDto | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Rule Form State
  const [newKey, setNewKey] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CreateFinancialRuleInput['category']>('Monetary Policy');
  const [newValue, setNewValue] = useState<number>(4.25);
  const [newUnit, setNewUnit] = useState('% APY');
  const [newDesc, setNewDesc] = useState('');
  const [newStatutoryBasis, setNewStatutoryBasis] = useState('Central Banking Act 2026, Section 14');
  const [newFinancialPassword, setNewFinancialPassword] = useState('');

  const loadRules = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const data = await apiFetchCentralBankRules();
      setRules(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load financial rules:', err);
      setError(err?.message || 'Failed to load financial rules');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRules();
    const unsub = subscribePortalDataInvalidation(() => {
      loadRules(true);
    });
    return unsub;
  }, [loadRules]);

  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      const cat = r.category || 'Monetary Policy';
      const matchesCategory = categoryFilter === 'all' || cat === categoryFilter;
      const keyStr = r.key || r.id || '';
      const titleStr = r.title || '';
      const matchesSearch =
        !searchQuery ||
        titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keyStr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [rules, categoryFilter, searchQuery]);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newTitle || !newFinancialPassword) {
      setError('Please provide rule key, title, and your Financial Password.');
      return;
    }

    setSubmitting(true);
    try {
      const input: CreateFinancialRuleInput = {
        key: newKey.trim().toUpperCase(),
        title: newTitle.trim(),
        category: newCategory,
        currentValue: Number(newValue),
        unit: newUnit.trim(),
        description: newDesc.trim() || 'Economic parameter set by central bank.',
        statutoryBasis: newStatutoryBasis.trim() || 'Central Banking Act 2026, Section 14',
        financialPassword: newFinancialPassword,
      };

      const created = await apiCreateCentralBankRule(input);
      setRules((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);
      setNewKey('');
      setNewTitle('');
      setNewDesc('');
      setNewFinancialPassword('');
      setNotification(`Policy statute "${created.title}" successfully gazetted into central policy ledger.`);
      setTimeout(() => setNotification(null), 4500);
    } catch (err: any) {
      setError(err?.message || 'Failed to promulgate financial rule');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Financial Rules
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5">
            Set rates, limits, and reserve requirements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadRules(true)}
            disabled={loading || refreshing}
            className="p-2.5 rounded-xl bg-white border border-[#946726]/20 hover:bg-[#946726]/8 text-[#946726] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Policy Rules"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-[#B5482E]/10 border border-[#B5482E]/20 text-[#B5482E] text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadRules()}
            className="px-2.5 py-1 rounded-lg bg-[#B5482E] text-white text-[11px] font-bold hover:bg-[#8F3520] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Monetary Policy', 'Prudential Requirements', 'Transaction Limits', 'System Controls'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#946726] text-white shadow-xs'
                  : 'text-[#5C574F] hover:text-[#946726] bg-[#F6F8F7]'
              }`}
            >
              {cat === 'all' ? `All Rules (${rules.length})` : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules..."
            className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full md:w-64"
          />
        </div>
      </div>

      {/* Directive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-[#74777F]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#946726]" />
            <span>Loading...</span>
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-[#74777F]">
            <Scale className="w-8 h-8 text-[#946726] mx-auto mb-2 opacity-50" />
            <span className="font-serif font-bold text-sm text-[#2A2012] block">No Rules Found</span>
            <span className="text-xs text-[#5C574F]">No rules match your search.</span>
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider bg-[#946726]/10 text-[#946726] border border-[#946726]/20">
                    {rule.key || rule.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border bg-emerald-100 text-emerald-800 border-emerald-300">
                    ACTIVE
                  </span>
                </div>

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
                    Current Value
                  </span>
                  <div className="text-base font-bold text-[#2A2012] mt-0.5">
                    {rule.currentValue} {rule.unit}
                  </div>
                </div>

                {rule.description && (
                  <p className="text-xs text-[#5C574F] leading-relaxed">
                    {rule.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#946726]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedRule(rule)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#946726]/10 hover:bg-[#946726] text-[#946726] hover:text-white transition text-xs font-bold cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-br from-[#946726] via-[#B88B38] to-[#7A5217] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#F5E1B2] block font-bold">
                  NEW RULE
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  Add Financial Rule
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

            <form onSubmit={handleCreateRule} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-[#2A2012] mb-1">Rule Key</label>
                <input
                  type="text"
                  required
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. POL-SETTLEMENT-FEE"
                  className="w-full p-2.5 rounded-xl border border-[#946726]/20 font-mono text-xs outline-none focus:border-[#946726]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A2012] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Interbank Clearing Service Fee Benchmark"
                  className="w-full p-2.5 rounded-xl border border-[#946726]/20 text-xs outline-none focus:border-[#946726]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2A2012] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CreateFinancialRuleInput['category'])}
                    className="w-full p-2.5 rounded-xl border border-[#946726]/20 text-xs outline-none focus:border-[#946726]"
                  >
                    <option value="Monetary Policy">Monetary Policy</option>
                    <option value="Prudential Requirements">Prudential Requirements</option>
                    <option value="Transaction Limits">Transaction Limits</option>
                    <option value="System Controls">System Controls</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#2A2012] mb-1">Current Value</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#946726]/20 font-mono text-xs outline-none focus:border-[#946726]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2A2012] mb-1">Unit of Measurement</label>
                <input
                  type="text"
                  required
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="e.g. % APY or ARTH"
                  className="w-full p-2.5 rounded-xl border border-[#946726]/20 font-mono text-xs outline-none focus:border-[#946726]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A2012] mb-1">Legal Basis</label>
                <input
                  type="text"
                  required
                  value={newStatutoryBasis}
                  onChange={(e) => setNewStatutoryBasis(e.target.value)}
                  placeholder="e.g. Central Banking Act 2026, Section 14"
                  className="w-full p-2.5 rounded-xl border border-[#946726]/20 text-xs outline-none focus:border-[#946726]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A2012] mb-1">Financial Password (Step-Up Auth)</label>
                <input
                  type="password"
                  required
                  autoComplete="off"
                  value={newFinancialPassword}
                  onChange={(e) => setNewFinancialPassword(e.target.value)}
                  placeholder="Enter financial password"
                  className="w-full p-2.5 rounded-xl border border-[#946726]/20 font-mono text-xs outline-none focus:border-[#946726]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A2012] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What does this rule do?"
                  className="w-full p-2.5 rounded-xl border border-[#946726]/20 text-xs outline-none focus:border-[#946726]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#946726]/20 text-[#5C574F] hover:bg-gray-50 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rule Detail Modal */}
      {selectedRule && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedRule(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-br from-[#946726] via-[#B88B38] to-[#7A5217] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#F5E1B2] block font-bold">
                  RULE DETAILS
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  {selectedRule.key || selectedRule.id} — {selectedRule.title}
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
                <div>Rule Key: <strong>{selectedRule.key || selectedRule.id}</strong></div>
                <div>Category: <strong>{selectedRule.category}</strong></div>
                <div>Value: <strong>{selectedRule.currentValue} {selectedRule.unit}</strong></div>
                <div>Effective: <strong>{selectedRule.effectiveDate || 'Current'}</strong></div>
              </div>

              {selectedRule.description && (
                <div className="p-3 bg-white rounded-xl border border-[#946726]/15">
                  <span className="text-[10px] font-mono text-[#74777F] uppercase block mb-1">
                    Description
                  </span>
                  <p className="text-xs text-[#2A2012] leading-relaxed">
                    {selectedRule.description}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-[#946726]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="px-4 py-2 rounded-xl bg-[#946726] text-white text-xs font-bold hover:bg-[#2A2012] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
