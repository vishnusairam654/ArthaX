'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  PiggyBank,
  Filter,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import {
  MOCK_FIXED_DEPOSITS,
  MOCK_FD_SCHEMES,
  formatArth,
  getStatusColor,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function FixedDepositsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [schemeTab, setSchemeTab] = useState<'fds' | 'schemes'>('fds');

  const filteredFDs = useMemo(() => {
    return MOCK_FIXED_DEPOSITS.filter((fd) => {
      const matchesSearch =
        !searchQuery ||
        fd.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fd.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fd.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fd.certificateRef.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || fd.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalFDValue = useMemo(() => {
    return MOCK_FIXED_DEPOSITS.reduce((acc, curr) => acc + curr.principal, 0);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Fixed Deposits &amp; Term Savings</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Sovereign certificate deposits, yield accrual, and maturity settlements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B3278] text-white text-xs font-bold hover:bg-[#2D2654] transition-colors shadow-sm cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Book New FD</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Total Term Deposits</span>
          <div className="font-mono text-xl font-bold text-[#A8742A] mt-1">
            <BankMaskedValue value={`${formatArth(totalFDValue)} ARTH`} />
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Under custody</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Active Certificates</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">
            {MOCK_FIXED_DEPOSITS.filter((f) => f.status === 'Active').length}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Generating yield</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Average Interest Rate</span>
          <div className="font-mono text-xl font-bold text-emerald-600 mt-1">6.62% p.a.</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Compounded quarterly</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Maturities Next 90d</span>
          <div className="font-mono text-xl font-bold text-[#3B3278] mt-1">2 Certificates</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Est. payout: 75,984 ARTH</div>
        </div>
      </div>

      {/* View Switcher: Customer FDs vs FD Scheme Catalog */}
      <div className="flex items-center gap-2 border-b border-[#3B3278]/15 pb-2">
        <button
          type="button"
          onClick={() => setSchemeTab('fds')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            schemeTab === 'fds'
              ? 'bg-[#3B3278] text-white shadow-xs'
              : 'text-[#74777F] hover:text-[#3B3278]'
          }`}
        >
          Customer Certificates ({MOCK_FIXED_DEPOSITS.length})
        </button>
        <button
          type="button"
          onClick={() => setSchemeTab('schemes')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            schemeTab === 'schemes'
              ? 'bg-[#3B3278] text-white shadow-xs'
              : 'text-[#74777F] hover:text-[#3B3278]'
          }`}
        >
          FD Product Schemes ({MOCK_FD_SCHEMES.length})
        </button>
      </div>

      {/* View 1: Customer FDs Table */}
      {schemeTab === 'fds' && (
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
          {/* Filter Toolbar */}
          <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-xl text-xs font-semibold text-[#1C1736] outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Matured">Matured</option>
                <option value="Premature Withdrawal">Premature Withdrawal</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FD ID, customer, certificate..."
                  className="pl-9 pr-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-lg text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-60"
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
                  <th className="py-2.5 px-4">FD ID</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Scheme</th>
                  <th className="py-2.5 px-4 text-right">Principal</th>
                  <th className="py-2.5 px-4 text-right">Rate</th>
                  <th className="py-2.5 px-4">Maturity Date</th>
                  <th className="py-2.5 px-4 text-right">Maturity Value</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3B3278]/6">
                {filteredFDs.map((fd) => {
                  const sc = getStatusColor(fd.status);
                  return (
                    <tr key={fd.id} className="hover:bg-[#FAFAFF] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">{fd.id}</td>
                      <td className="py-3 px-4 font-sans">
                        <Link
                          href={`/bank/customers/${fd.customerId}`}
                          className="font-semibold text-[#1C1736] hover:underline hover:text-[#3B3278]"
                        >
                          {fd.customerName}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-[#1C1736] font-medium">{fd.schemeName}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#1C1736]">
                        <BankMaskedValue value={`${formatArth(fd.principal)} ARTH`} />
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        {fd.interestRate}%
                      </td>
                      <td className="py-3 px-4 font-mono text-[#74777F]">{fd.maturityDate}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#A8742A]">
                        <BankMaskedValue value={`${formatArth(fd.maturityAmount)} ARTH`} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                          {fd.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/bank/fixed-deposits/${fd.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#FAFAFF] hover:bg-[#F4F2FF] text-[#3B3278] font-bold border border-[#3B3278]/15 text-xs transition"
                        >
                          Certificate
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: FD Scheme Catalog Cards */}
      {schemeTab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_FD_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-4 hover:border-[#3B3278]/30 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#74777F] uppercase">{scheme.id}</span>
                  <h3 className="font-serif font-bold text-lg text-[#1C1736]">{scheme.name}</h3>
                </div>
                <span className="font-mono text-xl font-bold text-emerald-600">
                  {scheme.interestRate}%
                </span>
              </div>

              <div className="text-xs text-[#74777F] space-y-1.5 font-mono pt-2 border-t border-[#3B3278]/8">
                <div className="flex justify-between">
                  <span>Tenure:</span>
                  <strong className="text-[#1C1736]">{scheme.tenureMonths} Months</strong>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Deposit:</span>
                  <strong className="text-[#1C1736]">{formatArth(scheme.minAmount)} ARTH</strong>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Deposit:</span>
                  <strong className="text-[#1C1736]">{formatArth(scheme.maxAmount)} ARTH</strong>
                </div>
                <div className="flex justify-between">
                  <span>Compounding:</span>
                  <strong className="text-[#1C1736]">{scheme.compounding}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    scheme.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {scheme.isActive ? 'Active Scheme' : 'Archived'}
                </span>
                <button className="text-xs font-bold text-[#3B3278] hover:underline cursor-pointer">
                  Edit Scheme
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
