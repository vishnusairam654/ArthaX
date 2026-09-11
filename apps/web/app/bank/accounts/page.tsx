'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Landmark,
  Filter,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_ACCOUNTS, formatArth, getStatusColor } from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter((acc) => {
      const matchesSearch =
        !searchQuery ||
        acc.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || acc.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const totalDeposits = useMemo(() => {
    return MOCK_ACCOUNTS.reduce((acc, curr) => acc + curr.balance, 0);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Bank Accounts</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Real-time deposit accounts under Master Ledger isolation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B3278] text-white text-xs font-bold hover:bg-[#2D2654] transition-colors shadow-sm cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Open Account</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Total Accounts</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">{MOCK_ACCOUNTS.length}</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Across all sovereign tiers</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Total Account Balances</span>
          <div className="font-mono text-xl font-bold text-[#A8742A] mt-1">
            <BankMaskedValue value={`${formatArth(totalDeposits)} ARTH`} />
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Double-entry verified</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Savings Accounts</span>
          <div className="font-mono text-xl font-bold text-[#3B3278] mt-1">
            {MOCK_ACCOUNTS.filter((a) => a.type === 'Savings').length}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Interest-bearing</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Current Accounts</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">
            {MOCK_ACCOUNTS.filter((a) => a.type === 'Current').length}
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
              {['all', 'Savings', 'Current'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    typeFilter === type
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
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Dormant">Dormant</option>
              <option value="Frozen">Frozen</option>
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
                className="pl-9 pr-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-lg text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-56"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#3B3278]/15 hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold shadow-xs transition cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
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
                <th className="py-2.5 px-4">Purpose</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Balance</th>
                <th className="py-2.5 px-4 text-right">Daily Limit</th>
                <th className="py-2.5 px-4 text-center">TX Count</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B3278]/6">
              {filteredAccounts.map((acc) => {
                const asc = getStatusColor(acc.status);
                return (
                  <tr key={acc.id} className="hover:bg-[#FAFAFF] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">
                      <BankMaskedValue value={acc.accountNumber} />
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-[#1C1736]">
                      <Link
                        href={`/bank/customers/${acc.customerId}`}
                        className="hover:underline hover:text-[#3B3278]"
                      >
                        {acc.customerName}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#1C1736] font-medium">{acc.type}</td>
                    <td className="py-3 px-4 text-[#74777F]">{acc.purpose}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${asc.bg} ${asc.text} border ${asc.border}`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#A8742A]">
                      <BankMaskedValue value={`${formatArth(acc.balance)} ARTH`} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#74777F]">
                      {formatArth(acc.dailyLimit)} ARTH
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#1C1736]">
                      {acc.transactionCount}
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
