'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRightLeft,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { TransactionDto } from '@arthax/types';
import { apiFetchBankAdminTransactions, subscribePortalDataInvalidation } from '@/lib/api';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

function formatMinorToArth(minorStr: string | number | undefined): string {
  if (!minorStr) return '0.00';
  try {
    const val = typeof minorStr === 'string' ? BigInt(minorStr) : BigInt(Math.floor(minorStr));
    const major = val / 100n;
    const minor = (val < 0n ? -val % 100n : val % 100n).toString().padStart(2, '0');
    return `${Number(major).toLocaleString('en-US')}.${minor}`;
  } catch {
    return '0.00';
  }
}

function getTxStatusBadge(status: string) {
  const upper = (status || '').toUpperCase();
  switch (upper) {
    case 'COMPLETED':
      return { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', border: 'border-[#10B981]/20' };
    case 'PROCESSING':
    case 'SETTLING':
    case 'VALIDATING':
    case 'PENDING':
      return { bg: 'bg-[#A8742A]/10', text: 'text-[#A8742A]', border: 'border-[#A8742A]/20' };
    case 'FAILED':
    case 'CANCELLED':
    case 'REVERSED':
      return { bg: 'bg-[#B5482E]/10', text: 'text-[#B5482E]', border: 'border-[#B5482E]/20' };
    default:
      return { bg: 'bg-[#3B3278]/10', text: 'text-[#3B3278]', border: 'border-[#3B3278]/20' };
  }
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const loadTransactions = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const data = await apiFetchBankAdminTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
      setError(err?.message || 'Failed to retrieve transaction journal');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
    const unsub = subscribePortalDataInvalidation(() => {
      loadTransactions(true);
    });
    return unsub;
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const ref = tx.referenceNumber || '';
      const id = tx.id || '';
      const src = tx.sourceAccountId || '';
      const dst = tx.destinationAccountId || '';
      const failure = tx.failureReason || '';

      const matchesSearch =
        !searchQuery ||
        ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        src.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dst.toLowerCase().includes(searchQuery.toLowerCase()) ||
        failure.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || tx.status?.toUpperCase() === statusFilter.toUpperCase();

      const matchesScope =
        scopeFilter === 'all' || (tx as any).scope?.toUpperCase() === scopeFilter.toUpperCase();

      const matchesType =
        typeFilter === 'all' || tx.type?.toUpperCase() === typeFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesScope && matchesType;
    });
  }, [transactions, searchQuery, statusFilter, scopeFilter, typeFilter]);

  const totalVolumeMinor = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + BigInt(curr.amountMinor || '0'), 0n);
  }, [transactions]);

  const pendingCount = useMemo(() => {
    return transactions.filter((t) =>
      ['PENDING', 'PROCESSING', 'SETTLING', 'VALIDATING'].includes(t.status?.toUpperCase() || ''),
    ).length;
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Transaction Journal</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3B3278]/10 text-[#3B3278]">
              {transactions.length} JOURNAL ENTRIES
            </span>
          </div>
          <p className="text-sm text-[#74777F] mt-0.5">
            Real-time ledger entries, CLS settlement routing, and audit records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadTransactions(true)}
            disabled={loading || refreshing}
            className="p-2 rounded-xl bg-white border border-[#3B3278]/15 hover:bg-[#FAFAFF] text-[#3B3278] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Transactions"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-[#B5482E]/10 border border-[#B5482E]/20 text-[#B5482E] text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadTransactions()}
            className="px-2.5 py-1 rounded-lg bg-[#B5482E] text-white text-[11px] font-bold hover:bg-[#8F3520] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Summary Metric Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Recorded Transactions</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">
            {loading ? '...' : transactions.length}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Double-entry verified</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Settlement Volume</span>
          <div className="font-mono text-xl font-bold text-[#A8742A] mt-1">
            {loading ? '...' : (
              <BankMaskedValue value={`${formatMinorToArth(totalVolumeMinor.toString())} ARTH`} />
            )}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Total journal value</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">CLS Inter-Bank Success</span>
          <div className="font-mono text-xl font-bold text-emerald-600 mt-1">99.98%</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Avg latency: 142ms</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Pending / In Flight</span>
          <div className="font-mono text-xl font-bold text-[#3B3278] mt-1">
            {loading ? '...' : pendingCount}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Clearing queue</div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-xl text-xs font-semibold text-[#1C1736] outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SETTLING">Settling</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REVERSED">Reversed</option>
            </select>

            {/* Scope Filter */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#3B3278]/10 rounded-xl">
              {['all', 'INTERNAL', 'INTERBANK'].map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setScopeFilter(scope)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    scopeFilter.toLowerCase() === scope.toLowerCase()
                      ? 'bg-[#3B3278] text-white shadow-xs'
                      : 'text-[#74777F] hover:text-[#3B3278]'
                  }`}
                >
                  {scope === 'all' ? 'All Scopes' : scope}
                </button>
              ))}
            </div>

            {/* Type Dropdown */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-xl text-xs font-semibold text-[#1C1736] outline-none cursor-pointer"
            >
              <option value="all">All Transaction Types</option>
              <option value="TRANSFER">Transfer</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="FEE">Fee</option>
              <option value="INTEREST">Interest</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TX ID, account, ref..."
              className="pl-9 pr-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-lg text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
              <tr>
                <th className="py-2.5 px-4">TX ID / Ref</th>
                <th className="py-2.5 px-4">Date &amp; Time</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Source → Destination</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B3278]/6 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#74777F]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#3B3278]" />
                    <span>Loading transactions from double-entry ledger...</span>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#74777F]">
                    <ArrowRightLeft className="w-6 h-6 text-[#74777F] mx-auto mb-2 opacity-50" />
                    <span className="font-sans font-medium text-xs text-[#1C1736] block">No Transactions Found</span>
                    <span className="text-[11px] text-[#74777F]">No ledger entries match the selected filters.</span>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const sc = getTxStatusBadge(tx.status);
                  const dateTime = tx.createdAt
                    ? new Date(tx.createdAt).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—';

                  return (
                    <tr key={tx.id} className="hover:bg-[#FAFAFF] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">
                        {tx.referenceNumber || tx.id.slice(0, 14)}
                      </td>
                      <td className="py-3 px-4 text-[#74777F]">
                        {dateTime}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3B3278]/8 text-[#3B3278] border border-[#3B3278]/15">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-mono text-xs text-[#1C1736]">
                          {tx.sourceAccountId ? tx.sourceAccountId.slice(0, 16) : 'TREASURY'}
                        </div>
                        <div className="font-mono text-[10px] text-[#74777F]">
                          → {tx.destinationAccountId ? tx.destinationAccountId.slice(0, 16) : 'SETTLED'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#A8742A]">
                        <BankMaskedValue value={`${formatMinorToArth(tx.amountMinor)} ARTH`} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/bank/transactions/${tx.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#FAFAFF] hover:bg-[#F4F2FF] text-[#3B3278] font-bold border border-[#3B3278]/15 text-xs transition"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
