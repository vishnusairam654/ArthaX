'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Landmark,
  Filter,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { BankAccountDto, BankAccountStatus } from '@arthax/types';
import { apiFetchBankAdminAccounts, subscribePortalDataInvalidation } from '@/lib/api';
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

function getStatusBadge(status: string) {
  const upper = (status || '').toUpperCase();
  switch (upper) {
    case 'ACTIVE':
      return { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', border: 'border-[#10B981]/20' };
    case 'SUSPENDED':
    case 'DORMANT':
      return { bg: 'bg-[#A8742A]/10', text: 'text-[#A8742A]', border: 'border-[#A8742A]/20' };
    case 'FROZEN':
    case 'CLOSED':
      return { bg: 'bg-[#B5482E]/10', text: 'text-[#B5482E]', border: 'border-[#B5482E]/20' };
    default:
      return { bg: 'bg-[#3B3278]/10', text: 'text-[#3B3278]', border: 'border-[#3B3278]/20' };
  }
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<BankAccountDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadAccounts = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const data = await apiFetchBankAdminAccounts();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load accounts:', err);
      setError(err?.message || 'Failed to retrieve institutional bank accounts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
    const unsub = subscribePortalDataInvalidation(() => {
      loadAccounts(true);
    });
    return unsub;
  }, [loadAccounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const accNum = acc.accountNumber || '';
      const custId = acc.customerId || '';
      const purpose = acc.purpose || '';
      const id = acc.id || '';

      const matchesSearch =
        !searchQuery ||
        accNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
        custId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        typeFilter === 'all' || acc.type?.toUpperCase() === typeFilter.toUpperCase();

      const matchesStatus =
        statusFilter === 'all' || acc.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, searchQuery, typeFilter, statusFilter]);

  const totalDepositsMinor = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + BigInt(curr.balanceMinor || '0'), 0n);
  }, [accounts]);

  const savingsCount = useMemo(() => {
    return accounts.filter((a) => a.type?.toUpperCase() === 'SAVINGS').length;
  }, [accounts]);

  const checkingCount = useMemo(() => {
    return accounts.filter((a) => a.type?.toUpperCase() === 'CHECKING' || a.type?.toUpperCase() === 'CURRENT').length;
  }, [accounts]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Bank Accounts</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3B3278]/10 text-[#3B3278]">
              {accounts.length} ACCOUNTS
            </span>
          </div>
          <p className="text-sm text-[#74777F] mt-0.5">
            Real-time deposit accounts under Master Ledger isolation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadAccounts(true)}
            disabled={loading || refreshing}
            className="p-2 rounded-xl bg-white border border-[#3B3278]/15 hover:bg-[#FAFAFF] text-[#3B3278] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Accounts"
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
            onClick={() => loadAccounts()}
            className="px-2.5 py-1 rounded-lg bg-[#B5482E] text-white text-[11px] font-bold hover:bg-[#8F3520] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Total Accounts</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">
            {loading ? '...' : accounts.length}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Across all sovereign tiers</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Total Account Balances</span>
          <div className="font-mono text-xl font-bold text-[#A8742A] mt-1">
            {loading ? '...' : (
              <BankMaskedValue value={`${formatMinorToArth(totalDepositsMinor.toString())} ARTH`} />
            )}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Double-entry verified</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Savings Accounts</span>
          <div className="font-mono text-xl font-bold text-[#3B3278] mt-1">
            {loading ? '...' : savingsCount}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Interest-bearing</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Current Accounts</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">
            {loading ? '...' : checkingCount}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Commercial settlement</div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Type selector */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#3B3278]/10 rounded-xl">
              {['all', 'SAVINGS', 'CHECKING'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    typeFilter.toLowerCase() === type.toLowerCase()
                      ? 'bg-[#3B3278] text-white shadow-xs'
                      : 'text-[#74777F] hover:text-[#3B3278]'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>

            {/* Status selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-xl text-xs font-semibold text-[#1C1736] outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="FROZEN">Frozen</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search account or customer..."
                className="pl-9 pr-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-lg text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-60"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
              <tr>
                <th className="py-2.5 px-4">Account Number</th>
                <th className="py-2.5 px-4">Customer Name</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Balance</th>
                <th className="py-2.5 px-4 text-right">Daily Limit</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B3278]/6">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#74777F]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#3B3278]" />
                    <span>Loading accounts from sovereign ledger...</span>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#74777F]">
                    <Landmark className="w-6 h-6 text-[#74777F] mx-auto mb-2 opacity-50" />
                    <span className="font-sans font-medium text-xs text-[#1C1736] block">No Accounts Found</span>
                    <span className="text-[11px] text-[#74777F]">No accounts match the current filter criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const asc = getStatusBadge(acc.status);
                  return (
                    <tr key={acc.id} className="hover:bg-[#FAFAFF] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">
                        <BankMaskedValue value={acc.accountNumber} />
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-[#1C1736]">
                        <Link
                          href={`/bank/customers/${acc.customerId}`}
                          className="hover:underline hover:text-[#3B3278] font-mono text-[11px]"
                        >
                          {acc.customerId.slice(0, 16)}
                        </Link>
                        <div className="text-[10px] text-[#74777F] font-normal">
                          {acc.purpose || 'Institutional'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#1C1736] font-medium font-mono text-[11px]">
                        {acc.type}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${asc.bg} ${asc.text} border ${asc.border}`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#A8742A]">
                        <BankMaskedValue value={`${formatMinorToArth(acc.balanceMinor)} ARTH`} />
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#74777F]">
                        <BankMaskedValue value={`${formatMinorToArth(acc.dailyLimitMinor)} ARTH`} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/bank/accounts/${acc.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#FAFAFF] hover:bg-[#F4F2FF] text-[#3B3278] font-bold border border-[#3B3278]/15 text-xs transition inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
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
