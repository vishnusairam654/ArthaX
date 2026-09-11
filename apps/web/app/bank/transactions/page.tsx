'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  MOCK_TRANSACTIONS,
  formatArth,
  getStatusColor,
  TransactionStatus,
  TransactionType,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      const matchesSearch =
        !searchQuery ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.senderAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.receiverAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.settlementRef.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchesScope = scopeFilter === 'all' || tx.scope === scopeFilter;
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;

      return matchesSearch && matchesStatus && matchesScope && matchesType;
    });
  }, [searchQuery, statusFilter, scopeFilter, typeFilter]);

  const totalVolume = useMemo(() => {
    return MOCK_TRANSACTIONS.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Transaction Journal</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Real-time ledger entries, CLS settlement routing, and audit records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#3B3278]/15 hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold shadow-xs transition cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Recorded Transactions</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">{MOCK_TRANSACTIONS.length}</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Double-entry verified</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Settlement Volume</span>
          <div className="font-mono text-xl font-bold text-[#A8742A] mt-1">
            <BankMaskedValue value={`${formatArth(totalVolume)} ARTH`} />
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Total journal value</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">CLS Inter-Bank Success</span>
          <div className="font-mono text-xl font-bold text-emerald-600 mt-1">99.2%</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Avg latency: 420ms</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Pending / Settling</span>
          <div className="font-mono text-xl font-bold text-[#3B3278] mt-1">
            {MOCK_TRANSACTIONS.filter((t) => t.status === 'Pending' || t.status === 'Settling' || t.status === 'Validating').length}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">In flight</div>
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
              <option value="Completed">Completed</option>
              <option value="Settling">Settling</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Validating">Validating</option>
              <option value="Failed">Failed</option>
              <option value="Reversed">Reversed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Scope Filter */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#3B3278]/10 rounded-xl">
              {['all', 'Internal', 'Inter-bank'].map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setScopeFilter(scope)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    scopeFilter === scope
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
              <option value="Transfer">Transfer</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
              <option value="Interest">Interest</option>
              <option value="Fee">Fee</option>
              <option value="Loan Disbursement">Loan Disbursement</option>
              <option value="Loan Repayment">Loan Repayment</option>
              <option value="FD Booking">FD Booking</option>
              <option value="FD Maturity">FD Maturity</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TX ID, account, name..."
              className="pl-9 pr-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-lg text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
              <tr>
                <th className="py-2.5 px-4">TX ID</th>
                <th className="py-2.5 px-4">Date &amp; Time</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-center">Scope</th>
                <th className="py-2.5 px-4">Sender</th>
                <th className="py-2.5 px-4">Receiver</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B3278]/6">
              {filteredTransactions.map((tx) => {
                const sc = getStatusColor(tx.status);
                return (
                  <tr key={tx.id} className="hover:bg-[#FAFAFF] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">
                      {tx.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#74777F]">
                      {tx.dateTime}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1C1736]">
                      {tx.type}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          tx.scope === 'Inter-bank'
                            ? 'bg-[#3B3278]/10 text-[#3B3278]'
                            : 'bg-[#74777F]/10 text-[#74777F]'
                        }`}
                      >
                        {tx.scope}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1C1736]">{tx.senderName}</div>
                      <div className="font-mono text-[10px] text-[#74777F]">
                        <BankMaskedValue value={tx.senderAccount} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1C1736]">{tx.receiverName}</div>
                      <div className="font-mono text-[10px] text-[#74777F]">
                        <BankMaskedValue value={tx.receiverAccount} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#A8742A]">
                      <BankMaskedValue value={`${formatArth(tx.amount)} ARTH`} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
