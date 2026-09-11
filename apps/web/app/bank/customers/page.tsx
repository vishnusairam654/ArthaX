'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Users,
  Filter,
  Download,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { MOCK_CUSTOMERS, formatArth, getStatusColor } from '@/components/bank/BankMockData';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.govId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const statusCounts = {
    all: MOCK_CUSTOMERS.length,
    Active: MOCK_CUSTOMERS.filter((c) => c.status === 'Active').length,
    Suspended: MOCK_CUSTOMERS.filter((c) => c.status === 'Suspended').length,
    'KYC Pending': MOCK_CUSTOMERS.filter((c) => c.status === 'KYC Pending').length,
    Closed: MOCK_CUSTOMERS.filter((c) => c.status === 'Closed').length,
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Customers</h1>
          <p className="text-sm text-[#74777F] mt-0.5">Manage all customers connected to this bank</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B3278] text-white text-xs font-bold hover:bg-[#2D2654] transition-colors shadow-sm cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Customer</span>
        </button>
      </div>

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
                  statusFilter === key
                    ? 'bg-[#3B3278] text-white shadow-xs'
                    : 'text-[#74777F] hover:text-[#3B3278]'
                }`}
              >
                {key === 'all' ? 'All' : key} ({count})
              </button>
            ))}
          </div>

          {/* Search + Export */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers..."
                className="pl-9 pr-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-lg text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-52"
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
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold border-b border-[#3B3278]/8 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Customer ID</th>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">GOV ID</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4">Joined</th>
                <th className="py-2.5 px-4 text-right">Accounts</th>
                <th className="py-2.5 px-4 text-right">Total Balance</th>
                <th className="py-2.5 px-4 text-right">FD Holdings</th>
                <th className="py-2.5 px-4 text-right">Loans</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B3278]/6">
              {filteredCustomers.map((customer) => {
                const sc = getStatusColor(customer.status);
                return (
                  <tr key={customer.id} className="hover:bg-[#FAFAFF] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">{customer.id}</td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-[#1C1736]">{customer.name}</div>
                      <div className="text-[10px] text-[#74777F]">{customer.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#43474E]">{customer.govId}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#74777F] font-mono">{customer.joinedDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#1C1736]">{customer.accountCount}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className="font-bold text-[#A8742A]">{formatArth(customer.totalBalance)}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#1C1736]">
                      {customer.fdHoldings > 0 ? formatArth(customer.fdHoldings) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {customer.loanOutstanding > 0 ? (
                        <span className="text-[#B5482E]">{formatArth(customer.loanOutstanding)}</span>
                      ) : (
                        <span className="text-[#74777F]">—</span>
                      )}
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
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 bg-[#FAFAFF] border-t border-[#3B3278]/8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#74777F]">
          <span>Displaying <strong>{filteredCustomers.length}</strong> of <strong>{MOCK_CUSTOMERS.length}</strong> customers</span>
          <span className="font-mono text-[#3B3278] font-semibold">Page 1 of 1</span>
        </div>
      </div>
    </>
  );
}
