'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Users,
  Filter,
  Download,
  ChevronRight,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { BankCustomerDto } from '@arthax/types';
import { apiFetchBankAdminCustomers, subscribePortalDataInvalidation } from '@/lib/api';
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
    case 'KYC_PENDING':
      return { bg: 'bg-[#A8742A]/10', text: 'text-[#A8742A]', border: 'border-[#A8742A]/20' };
    case 'LOCKED':
    case 'CLOSED':
      return { bg: 'bg-[#B5482E]/10', text: 'text-[#B5482E]', border: 'border-[#B5482E]/20' };
    default:
      return { bg: 'bg-[#3B3278]/10', text: 'text-[#3B3278]', border: 'border-[#3B3278]/20' };
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<BankCustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadCustomers = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const data = await apiFetchBankAdminCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load customers:', err);
      setError(err?.message || 'Failed to retrieve registered customers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
    const unsub = subscribePortalDataInvalidation(() => {
      loadCustomers(true);
    });
    return unsub;
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const num = c.customerNumber || c.id || '';
      const uid = c.userId || '';
      const tier = c.tier || '';

      const matchesSearch =
        !searchQuery ||
        num.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || c.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: customers.length,
      Active: customers.filter((c) => c.status?.toUpperCase() === 'ACTIVE').length,
      Suspended: customers.filter((c) => c.status?.toUpperCase() === 'SUSPENDED').length,
      Locked: customers.filter((c) => c.status?.toUpperCase() === 'LOCKED').length,
    };
  }, [customers]);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Customers</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3B3278]/10 text-[#3B3278]">
              {customers.length} REGISTERED
            </span>
          </div>
          <p className="text-sm text-[#74777F] mt-0.5">Manage all customers connected to this bank</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadCustomers(true)}
            disabled={loading || refreshing}
            className="p-2 rounded-xl bg-white border border-[#3B3278]/15 hover:bg-[#FAFAFF] text-[#3B3278] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Customers"
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
            onClick={() => loadCustomers()}
            className="px-2.5 py-1 rounded-lg bg-[#B5482E] text-white text-[11px] font-bold hover:bg-[#8F3520] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
        {/* Filter Ribbon */}
        <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-white border border-[#3B3278]/10 rounded-xl">
            {Object.entries(statusCounts).map(([key, count]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  statusFilter.toLowerCase() === key.toLowerCase()
                    ? 'bg-[#3B3278] text-white shadow-xs'
                    : 'text-[#74777F] hover:text-[#3B3278]'
                }`}
              >
                {key === 'all' ? 'All' : key} ({count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="pl-9 pr-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-lg text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-60"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold border-b border-[#3B3278]/8 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Customer ID</th>
                <th className="py-2.5 px-4">Name / Email</th>
                <th className="py-2.5 px-4">GOV ID</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4">Joined</th>
                <th className="py-2.5 px-4 text-right">Accounts</th>
                <th className="py-2.5 px-4 text-right">Total Balance</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B3278]/6">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#74777F]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#3B3278]" />
                    <span>Loading registered customers...</span>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#74777F]">
                    <Users className="w-6 h-6 text-[#74777F] mx-auto mb-2 opacity-50" />
                    <span className="font-sans font-medium text-xs text-[#1C1736] block">No Customers Match Filter</span>
                    <span className="text-[11px] text-[#74777F]">Try adjusting your search query or status filter.</span>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const sc = getStatusBadge(customer.status);
                  const totalBalanceMinor = (customer.accounts || []).reduce(
                    (acc, a) => acc + BigInt(a.balanceMinor || '0'),
                    0n,
                  );
                  const joinedDate = customer.joinedAt
                    ? new Date(customer.joinedAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
                    : '—';

                  return (
                    <tr key={customer.id} className="hover:bg-[#FAFAFF] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">
                        {customer.customerNumber || customer.id.slice(0, 14)}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-semibold text-[#1C1736] font-mono text-xs">
                          {customer.userId.slice(0, 18)}
                        </div>
                        <div className="text-[10px] text-[#74777F]">
                          Tier: {customer.tier || 'STANDARD'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#43474E] text-[11px]">
                        {customer.tier || 'TIER-1'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#74777F] font-mono">{joinedDate}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#1C1736]">
                        {customer.accounts?.length ?? 0}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        <BankMaskedValue
                          value={`${formatMinorToArth(totalBalanceMinor.toString())} ARTH`}
                          valueClassName="font-bold text-[#A8742A]"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/bank/customers/${customer.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#FAFAFF] hover:bg-[#F4F2FF] text-[#3B3278] font-bold border border-[#3B3278]/15 text-xs transition"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 bg-[#FAFAFF] border-t border-[#3B3278]/8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#74777F]">
          <span>Displaying <strong>{filteredCustomers.length}</strong> of <strong>{customers.length}</strong> registered customers</span>
          <span className="font-mono text-[#3B3278] font-semibold">Page 1 of 1</span>
        </div>
      </div>
    </>
  );
}
