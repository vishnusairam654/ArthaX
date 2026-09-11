'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  HandCoins,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  MOCK_LOANS,
  formatArth,
  getStatusColor,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function LoansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredLoans = useMemo(() => {
    return MOCK_LOANS.filter((l) => {
      const matchesSearch =
        !searchQuery ||
        l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.targetAccount.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchesType = typeFilter === 'all' || l.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const totalOutstanding = useMemo(() => {
    return MOCK_LOANS.reduce((acc, curr) => acc + curr.outstandingBalance, 0);
  }, []);

  const totalMonthlyEmi = useMemo(() => {
    return MOCK_LOANS.filter((l) => l.status === 'Active' || l.status === 'Overdue').reduce(
      (acc, curr) => acc + curr.monthlyEmi,
      0
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Credit Facilities &amp; Loans</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Credit underwriting, facility approvals, disbursements, and recovery tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B3278] text-white text-xs font-bold hover:bg-[#2D2654] transition-colors shadow-sm cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Total Credit Book</span>
          <div className="font-mono text-xl font-bold text-[#B5482E] mt-1">
            <BankMaskedValue value={`${formatArth(totalOutstanding)} ARTH`} />
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Outstanding principal</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Active Facilities</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">
            {MOCK_LOANS.filter((l) => l.status === 'Active').length}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Performing assets</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Monthly Collections</span>
          <div className="font-mono text-xl font-bold text-emerald-600 mt-1">
            {formatArth(totalMonthlyEmi)} ARTH
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Scheduled EMI cash flow</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Overdue / Delinquent</span>
          <div className="font-mono text-xl font-bold text-[#B5482E] mt-1">
            {MOCK_LOANS.filter((l) => l.status === 'Overdue').length} Facility
          </div>
          <div className="text-[11px] text-[#B5482E] mt-0.5">Recovery queue active</div>
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
              <option value="Active">Active</option>
              <option value="Application">Application</option>
              <option value="Under Review">Under Review</option>
              <option value="Overdue">Overdue</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Type Dropdown */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-xl text-xs font-semibold text-[#1C1736] outline-none cursor-pointer"
            >
              <option value="all">All Loan Types</option>
              <option value="Personal">Personal Loan</option>
              <option value="Business">Business Loan</option>
              <option value="Education">Education Loan</option>
              <option value="Housing">Housing Loan</option>
              <option value="Vehicle">Vehicle Loan</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search loan ID, customer, account..."
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
                <th className="py-2.5 px-4">Loan ID</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-right">Principal</th>
                <th className="py-2.5 px-4 text-right">Rate</th>
                <th className="py-2.5 px-4 text-right">Outstanding</th>
                <th className="py-2.5 px-4 text-right">Monthly EMI</th>
                <th className="py-2.5 px-4 text-center">Installments</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B3278]/6">
              {filteredLoans.map((loan) => {
                const sc = getStatusColor(loan.status);
                return (
                  <tr key={loan.id} className="hover:bg-[#FAFAFF] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">{loan.id}</td>
                    <td className="py-3 px-4 font-sans">
                      <Link
                        href={`/bank/customers/${loan.customerId}`}
                        className="font-semibold text-[#1C1736] hover:underline hover:text-[#3B3278]"
                      >
                        {loan.customerName}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1C1736]">{loan.type}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#1C1736]">
                      <BankMaskedValue value={`${formatArth(loan.principal)} ARTH`} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                      {loan.interestRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#B5482E]">
                      <BankMaskedValue value={`${formatArth(loan.outstandingBalance)} ARTH`} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#74777F]">
                      {loan.monthlyEmi > 0 ? `${formatArth(loan.monthlyEmi)} ARTH` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#74777F]">
                      {loan.paidInstallments} / {loan.totalInstallments}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/bank/loans/${loan.id}`}
                        className="px-2.5 py-1 rounded-lg bg-[#FAFAFF] hover:bg-[#F4F2FF] text-[#3B3278] font-bold border border-[#3B3278]/15 text-xs transition inline-flex items-center gap-1"
                      >
                        <span>Details</span>
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
