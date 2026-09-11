'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Building2,
  PiggyBank,
  HandCoins,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  Mail,
  FileText,
  Lock,
  Plus,
  ExternalLink,
} from 'lucide-react';
import {
  MOCK_CUSTOMERS,
  MOCK_ACCOUNTS,
  MOCK_TRANSACTIONS,
  MOCK_FIXED_DEPOSITS,
  MOCK_LOANS,
  formatArth,
  getStatusColor,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = (params?.customerId as string) || 'CUST-0001';

  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId) || MOCK_CUSTOMERS[0];

  const customerAccounts = MOCK_ACCOUNTS.filter((a) => a.customerId === customer.id);
  const customerFDs = MOCK_FIXED_DEPOSITS.filter((f) => f.customerId === customer.id);
  const customerLoans = MOCK_LOANS.filter((l) => l.customerId === customer.id);
  const customerTransactions = MOCK_TRANSACTIONS.filter(
    (t) => t.senderName === customer.name || t.receiverName === customer.name
  );

  const [activeTab, setActiveTab] = useState<'accounts' | 'fds' | 'loans' | 'transactions'>('accounts');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const sc = getStatusColor(customer.status);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#74777F]">
          <Link href="/bank" className="hover:text-[#3B3278] transition">Bank</Link>
          <span>/</span>
          <Link href="/bank/customers" className="hover:text-[#3B3278] transition">Customers</Link>
          <span>/</span>
          <span className="font-mono font-bold text-[#1C1736]">{customer.id}</span>
        </div>

        <Link
          href="/bank/customers"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B3278]/15 bg-white text-xs font-semibold text-[#3B3278] hover:bg-[#FAFAFF] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customers</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Customer Header Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3B3278]/10 text-[#3B3278] flex items-center justify-center font-serif text-2xl font-bold border border-[#3B3278]/15">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif font-bold text-2xl text-[#1C1736]">{customer.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                  {customer.status}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#3B3278]/10 text-[#3B3278] text-[11px] font-mono font-bold">
                  {customer.tier}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-[#74777F]">
                <span className="font-mono">ID: <strong className="text-[#1C1736]">{customer.id}</strong></span>
                <span className="font-mono">GOV ID: <strong className="text-[#1C1736]">{customer.govId}</strong></span>
                <span className="font-mono">ARTHAX ID: <strong className="text-[#1C1736]">{customer.arthaxUserId}</strong></span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
                <span className="flex items-center gap-1 font-mono"><Calendar className="w-3 h-3" /> Joined: {customer.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAction('Account limit increase request submitted')}
              className="px-3 py-1.5 rounded-xl border border-[#3B3278]/15 bg-white hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold transition cursor-pointer"
            >
              Adjust Limits
            </button>
            <button
              onClick={() => handleAction(`Account status flagged for review for ${customer.name}`)}
              className="px-3 py-1.5 rounded-xl border border-[#B5482E]/20 bg-[#B5482E]/5 hover:bg-[#B5482E]/10 text-[#B5482E] text-xs font-bold transition cursor-pointer"
            >
              Flag Review
            </button>
            <button
              onClick={() => handleAction('Support note saved')}
              className="px-3.5 py-1.5 rounded-xl bg-[#3B3278] text-white hover:bg-[#2D2654] text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#3B3278]/10">
          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Total Balance Across Accounts</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#A8742A]">
              <BankMaskedValue value={`${formatArth(customer.totalBalance)} ARTH`} />
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">{customer.accountCount} active accounts</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Fixed Deposit Holdings</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#1C1736]">
              <BankMaskedValue value={`${formatArth(customer.fdHoldings)} ARTH`} />
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">{customerFDs.length} term certificates</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Outstanding Loan Debt</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#B5482E]">
              <BankMaskedValue value={`${formatArth(customer.loanOutstanding)} ARTH`} />
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">{customerLoans.length} active facilities</div>
          </div>
        </div>
      </div>

      {/* Tabs for Accounts / FDs / Loans / Transactions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#3B3278]/15 pb-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'accounts'
                ? 'bg-[#3B3278] text-white shadow-xs'
                : 'text-[#74777F] hover:text-[#3B3278] hover:bg-[#3B3278]/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Accounts ({customerAccounts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fds')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'fds'
                ? 'bg-[#3B3278] text-white shadow-xs'
                : 'text-[#74777F] hover:text-[#3B3278] hover:bg-[#3B3278]/5'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Fixed Deposits ({customerFDs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('loans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'loans'
                ? 'bg-[#3B3278] text-white shadow-xs'
                : 'text-[#74777F] hover:text-[#3B3278] hover:bg-[#3B3278]/5'
            }`}
          >
            <HandCoins className="w-3.5 h-3.5" />
            <span>Loans ({customerLoans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'transactions'
                ? 'bg-[#3B3278] text-white shadow-xs'
                : 'text-[#74777F] hover:text-[#3B3278] hover:bg-[#3B3278]/5'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Activity &amp; Transactions ({customerTransactions.length})</span>
          </button>
        </div>

        {/* Tab 1: Accounts */}
        {activeTab === 'accounts' && (
          <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C1736]">Linked Accounts</span>
              <span className="text-[11px] text-[#74777F]">All accounts under Sovereign Bank Master Ledger</span>
            </div>
            {customerAccounts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#74777F]">No accounts registered under this customer.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
                    <tr>
                      <th className="py-2.5 px-4">Account Number</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Purpose</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-right">Balance</th>
                      <th className="py-2.5 px-4 text-right">Daily Limit</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3B3278]/6">
                    {customerAccounts.map((acc) => {
                      const asc = getStatusColor(acc.status);
                      return (
                        <tr key={acc.id} className="hover:bg-[#FAFAFF] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">
                            <BankMaskedValue value={acc.accountNumber} />
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#1C1736]">{acc.type}</td>
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
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/bank/accounts/${acc.id}`}
                              className="px-2.5 py-1 rounded-lg bg-[#FAFAFF] hover:bg-[#F4F2FF] text-[#3B3278] font-bold border border-[#3B3278]/15 text-xs transition"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Fixed Deposits */}
        {activeTab === 'fds' && (
          <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C1736]">Term Deposits &amp; Sovereign Certificates</span>
            </div>
            {customerFDs.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#74777F]">No active or historical fixed deposits.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
                    <tr>
                      <th className="py-2.5 px-4">FD ID</th>
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
                    {customerFDs.map((fd) => {
                      const fsc = getStatusColor(fd.status);
                      return (
                        <tr key={fd.id} className="hover:bg-[#FAFAFF] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">{fd.id}</td>
                          <td className="py-3 px-4 font-semibold text-[#1C1736]">{fd.schemeName}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#1C1736]">
                            <BankMaskedValue value={`${formatArth(fd.principal)} ARTH`} />
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">{fd.interestRate}%</td>
                          <td className="py-3 px-4 font-mono text-[#74777F]">{fd.maturityDate}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#A8742A]">
                            <BankMaskedValue value={`${formatArth(fd.maturityAmount)} ARTH`} />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${fsc.bg} ${fsc.text} border ${fsc.border}`}>
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
            )}
          </div>
        )}

        {/* Tab 3: Loans */}
        {activeTab === 'loans' && (
          <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C1736]">Credit Facilities &amp; Advances</span>
            </div>
            {customerLoans.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#74777F]">No active credit facilities or loan accounts.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
                    <tr>
                      <th className="py-2.5 px-4">Loan ID</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4 text-right">Principal</th>
                      <th className="py-2.5 px-4 text-right">Interest</th>
                      <th className="py-2.5 px-4 text-right">Outstanding</th>
                      <th className="py-2.5 px-4 text-right">Monthly EMI</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3B3278]/6">
                    {customerLoans.map((loan) => {
                      const lsc = getStatusColor(loan.status);
                      return (
                        <tr key={loan.id} className="hover:bg-[#FAFAFF] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">{loan.id}</td>
                          <td className="py-3 px-4 font-semibold text-[#1C1736]">{loan.type} Loan</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#1C1736]">
                            <BankMaskedValue value={`${formatArth(loan.principal)} ARTH`} />
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">{loan.interestRate}%</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#B5482E]">
                            <BankMaskedValue value={`${formatArth(loan.outstandingBalance)} ARTH`} />
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-[#74777F]">
                            {formatArth(loan.monthlyEmi)} ARTH
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${lsc.bg} ${lsc.text} border ${lsc.border}`}>
                              {loan.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/bank/loans/${loan.id}`}
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
            )}
          </div>
        )}

        {/* Tab 4: Transactions */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C1736]">Associated Transaction Ledger</span>
            </div>
            {customerTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#74777F]">No recorded transactions for this customer.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
                    <tr>
                      <th className="py-2.5 px-4">TX ID</th>
                      <th className="py-2.5 px-4">Date &amp; Time</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Counterparty</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3B3278]/6">
                    {customerTransactions.map((tx) => {
                      const tsc = getStatusColor(tx.status);
                      const isIncoming = tx.receiverName === customer.name;
                      return (
                        <tr key={tx.id} className="hover:bg-[#FAFAFF] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">{tx.id}</td>
                          <td className="py-3 px-4 font-mono text-[#74777F]">{tx.dateTime}</td>
                          <td className="py-3 px-4 font-semibold text-[#1C1736]">{tx.type}</td>
                          <td className="py-3 px-4 text-[#74777F]">
                            {isIncoming ? `From ${tx.senderName}` : `To ${tx.receiverName}`}
                          </td>
                          <td className={`py-3 px-4 text-right font-mono font-bold ${isIncoming ? 'text-emerald-700' : 'text-[#1C1736]'}`}>
                            <BankMaskedValue value={`${isIncoming ? '+' : '-'}${formatArth(tx.amount)} ARTH`} />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tsc.bg} ${tsc.text} border ${tsc.border}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/bank/transactions/${tx.id}`}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
