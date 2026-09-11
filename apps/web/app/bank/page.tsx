'use client';

import React from 'react';
import {
  Landmark,
  Users,
  ArrowRightLeft,
  PiggyBank,
  HandCoins,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCw,
  ChevronRight,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import {
  MOCK_TRANSACTIONS,
  MOCK_OPERATIONS,
  ARTHAX_BANKS,
  formatArth,
  getStatusColor,
  getPriorityColor,
} from '@/components/bank/BankMockData';

export default function BankOverviewPage() {
  const bank = ARTHAX_BANKS['nava'];
  const todayTxs = MOCK_TRANSACTIONS.filter((tx) => tx.dateTime.startsWith('2026-09-08'));
  const todayVolume = todayTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const pendingOps = MOCK_OPERATIONS.filter((op) => op.status === 'Pending').length;
  const escalatedOps = MOCK_OPERATIONS.filter((op) => op.status === 'Escalated').length;

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Operations Overview</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            {bank.name} — Real-time operational dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#10B981]/10 text-[#10B981] text-xs font-bold font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Row 1: Metric Cards (4-column grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assets / Deposits */}
        <div className="bg-white rounded-2xl p-5 border border-[#3B3278]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#3B3278]"></div>
          <div>
            <div className="flex items-center justify-between text-[#74777F] text-xs uppercase font-semibold">
              <span>Total Deposits</span>
              <div className="w-8 h-8 rounded-lg bg-[#3B3278]/10 text-[#3B3278] flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#1C1736]">
                {(bank.totalDeposits / 1_000_000).toFixed(1)}M
              </span>
              <span className="text-[#A8742A] font-bold text-sm">ARTH</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#3B3278]/8 flex items-center justify-between text-xs font-mono">
            <span className="text-[#74777F]">Total Assets</span>
            <span className="font-bold text-[#1C1736]">{(bank.totalAssets / 1_000_000).toFixed(1)}M ARTH</span>
          </div>
        </div>

        {/* Customers & Accounts */}
        <div className="bg-white rounded-2xl p-5 border border-[#3B3278]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]"></div>
          <div>
            <div className="flex items-center justify-between text-[#74777F] text-xs uppercase font-semibold">
              <span>Customers</span>
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#1C1736]">
                {bank.customerCount.toLocaleString('en-US')}
              </span>
              <span className="text-xs font-medium text-[#10B981]">+12 this month</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#3B3278]/8 flex items-center justify-between text-xs font-mono">
            <span className="text-[#74777F]">Active Accounts</span>
            <span className="font-bold text-[#1C1736]">{bank.activeAccounts.toLocaleString('en-US')}</span>
          </div>
        </div>

        {/* Today's Transactions */}
        <div className="bg-white rounded-2xl p-5 border border-[#3B3278]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#A8742A]"></div>
          <div>
            <div className="flex items-center justify-between text-[#74777F] text-xs uppercase font-semibold">
              <span>Today&apos;s Volume</span>
              <div className="w-8 h-8 rounded-lg bg-[#A8742A]/10 text-[#A8742A] flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#1C1736]">
                {formatArth(todayVolume)}
              </span>
              <span className="text-[#A8742A] font-bold text-sm">ARTH</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#3B3278]/8 flex items-center justify-between text-xs font-mono">
            <span className="text-[#74777F]">Transactions Today</span>
            <span className="font-bold text-[#1C1736]">{todayTxs.length}</span>
          </div>
        </div>

        {/* FDs & Loans */}
        <div className="bg-white rounded-2xl p-5 border border-[#3B3278]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E3A5F]"></div>
          <div>
            <div className="flex items-center justify-between text-[#74777F] text-xs uppercase font-semibold">
              <span>FDs &amp; Loans</span>
              <div className="w-8 h-8 rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F] flex items-center justify-center">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#1C1736]">8</span>
              <span className="text-xs font-medium text-[#74777F]">Active FDs</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#3B3278]/8 flex items-center justify-between text-xs font-mono">
            <span className="text-[#74777F]">Loans Outstanding</span>
            <span className="font-bold text-[#B5482E]">6 active</span>
          </div>
        </div>
      </section>

      {/* Row 2: Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (8 cols): Recent Activity Feed */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B3278]" />
                <h2 className="font-serif font-bold text-base text-[#1C1736]">Recent Activity</h2>
              </div>
              <a href="/bank/transactions" className="text-xs font-semibold text-[#3B3278] hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold border-b border-[#3B3278]/8 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Transaction ID</th>
                    <th className="py-2.5 px-4">From → To</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B3278]/6 font-mono">
                  {MOCK_TRANSACTIONS.slice(0, 8).map((tx) => {
                    const statusColor = getStatusColor(tx.status);
                    return (
                      <tr key={tx.id} className="hover:bg-[#FAFAFF] transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#3B3278]">{tx.id}</span>
                        </td>
                        <td className="py-3 px-4 font-sans">
                          <div className="text-[#1C1736] font-medium">{tx.senderName}</div>
                          <div className="text-[10px] text-[#74777F]">→ {tx.receiverName}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3B3278]/8 text-[#3B3278] border border-[#3B3278]/15">
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-bold text-[#A8742A]">{formatArth(tx.amount)}</span>
                          <span className="text-[10px] text-[#74777F] ml-1">ARTH</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-[#74777F] text-[11px]">
                          {tx.dateTime.split(' ')[1]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right (4 cols): Alerts + Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          {/* Operational Alerts */}
          <div className="bg-white rounded-2xl p-4 border border-[#3B3278]/10 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#B5482E]" />
              <h3 className="font-serif font-bold text-sm text-[#1C1736]">Alerts</h3>
              <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#B5482E]/10 text-[#B5482E]">
                {escalatedOps + 2}
              </span>
            </div>
            <div className="space-y-2">
              {MOCK_OPERATIONS.filter((op) => op.priority === 'Critical' || op.priority === 'High')
                .slice(0, 4)
                .map((op) => {
                  const priorityColor = getPriorityColor(op.priority);
                  return (
                    <div
                      key={op.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/6 hover:border-[#3B3278]/15 transition-colors"
                    >
                      <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                        op.priority === 'Critical' ? 'bg-[#B5482E]' : 'bg-[#A8742A]'
                      }`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#1C1736] truncate">
                          {op.title}
                        </div>
                        <div className="text-[10px] text-[#74777F] mt-0.5 line-clamp-1">
                          {op.description}
                        </div>
                      </div>
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold ${priorityColor.bg} ${priorityColor.text}`}>
                        {op.priority}
                      </span>
                    </div>
                  );
                })}
            </div>
            <a
              href="/bank/operations"
              className="mt-3 w-full flex items-center justify-center gap-1 py-2 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/10 text-[#3B3278] text-xs font-bold hover:bg-[#F4F2FF] transition-colors"
            >
              View Operations Queue <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-[#3B3278]/10 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#3B3278]" />
              <h3 className="font-serif font-bold text-sm text-[#1C1736]">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Review Loan', href: '/bank/loans', icon: HandCoins, color: 'text-[#A8742A]' },
                { label: 'Process FD', href: '/bank/fixed-deposits', icon: PiggyBank, color: 'text-[#1E3A5F]' },
                { label: 'Review KYC', href: '/bank/customers', icon: ShieldCheck, color: 'text-[#10B981]' },
                { label: 'View Reports', href: '/bank/reports', icon: TrendingUp, color: 'text-[#3B3278]' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/6 hover:border-[#3B3278]/20 hover:bg-[#F4F2FF] transition-all text-xs font-medium text-[#43474E] hover:text-[#3B3278]"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span>{action.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Revenue Summary Mini */}
          <div className="bg-white rounded-2xl p-4 border border-[#3B3278]/10 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <h3 className="font-serif font-bold text-sm text-[#1C1736]">Revenue (MTD)</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Interest Income', value: '124,800', change: '+8.2%' },
                { label: 'Fee Income', value: '18,400', change: '+3.1%' },
                { label: 'Tax Collected', value: '7,740', change: '+2.4%' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-dashed border-[#3B3278]/8 last:border-0">
                  <span className="text-xs text-[#74777F]">{item.label}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold font-mono text-[#1C1736]">{item.value} <span className="text-[#A8742A]">ARTH</span></span>
                    <span className="text-[10px] font-bold text-[#10B981]">{item.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
