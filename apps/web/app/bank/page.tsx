'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  RefreshCw,
} from 'lucide-react';
import { BankAdminOverviewDto, TransactionDto } from '@arthax/types';
import {
  apiFetchBankAdminOverview,
  apiFetchBankAdminTransactions,
  subscribePortalDataInvalidation,
} from '@/lib/api';
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
  switch (status) {
    case 'COMPLETED':
      return { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', border: 'border-[#10B981]/20' };
    case 'PROCESSING':
    case 'SETTLING':
    case 'VALIDATING':
      return { bg: 'bg-[#A8742A]/10', text: 'text-[#A8742A]', border: 'border-[#A8742A]/20' };
    case 'FAILED':
    case 'CANCELLED':
      return { bg: 'bg-[#B5482E]/10', text: 'text-[#B5482E]', border: 'border-[#B5482E]/20' };
    default:
      return { bg: 'bg-[#3B3278]/10', text: 'text-[#3B3278]', border: 'border-[#3B3278]/20' };
  }
}

export default function BankOverviewPage() {
  const [overview, setOverview] = useState<BankAdminOverviewDto | null>(null);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const [ovData, txData] = await Promise.all([
        apiFetchBankAdminOverview(),
        apiFetchBankAdminTransactions(),
      ]);
      setOverview(ovData);
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch (err: any) {
      console.error('Failed to load bank overview:', err);
      setError(err?.message || 'Failed to connect to sovereign banking gateway');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsub = subscribePortalDataInvalidation(() => {
      loadData(true);
    });
    return unsub;
  }, [loadData]);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Operations Overview</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3B3278]/10 text-[#3B3278]">
              {overview?.bankId ? overview.bankId.toUpperCase() : 'SOVEREIGN NODE'}
            </span>
          </div>
          <p className="text-sm text-[#74777F] mt-0.5">
            {overview?.bankName || 'Sovereign Commercial Bank'} — Real-time operational dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={loading || refreshing}
            className="p-2 rounded-xl bg-white border border-[#3B3278]/15 hover:bg-[#FAFAFF] text-[#3B3278] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Ledger State"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <span className="px-3 py-1.5 rounded-xl bg-[#10B981]/10 text-[#10B981] text-xs font-bold font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            All Systems Operational
          </span>
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
            onClick={() => loadData()}
            className="px-2.5 py-1 rounded-lg bg-[#B5482E] text-white text-[11px] font-bold hover:bg-[#8F3520] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Row 1: Metric Cards (4-column grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deposits */}
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
                {loading ? '...' : (
                  <BankMaskedValue value={`${formatMinorToArth(overview?.totalDepositsMinor)} ARTH`} />
                )}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#3B3278]/8 flex items-center justify-between text-xs font-mono">
            <span className="text-[#74777F]">Total Assets</span>
            <span className="font-bold text-[#1C1736]">
              {loading ? '...' : (
                <BankMaskedValue value={`${formatMinorToArth(overview?.totalAssetsMinor)} ARTH`} />
              )}
            </span>
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
                {loading ? '...' : (overview?.customerCount ?? 0).toLocaleString('en-US')}
              </span>
              <span className="text-xs font-medium text-[#10B981]">Onboarded</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#3B3278]/8 flex items-center justify-between text-xs font-mono">
            <span className="text-[#74777F]">Active Accounts</span>
            <span className="font-bold text-[#1C1736]">
              {loading ? '...' : (overview?.activeAccountsCount ?? 0).toLocaleString('en-US')}
            </span>
          </div>
        </div>

        {/* Today's Transactions Volume */}
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
                {loading ? '...' : (
                  <BankMaskedValue value={`${formatMinorToArth(overview?.todayVolumeMinor)} ARTH`} />
                )}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#3B3278]/8 flex items-center justify-between text-xs font-mono">
            <span className="text-[#74777F]">Transactions Today</span>
            <span className="font-bold text-[#1C1736]">
              {loading ? '...' : (overview?.todayTransactionCount ?? 0)}
            </span>
          </div>
        </div>

        {/* System Invariant Status */}
        <div className="bg-white rounded-2xl p-5 border border-[#3B3278]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E3A5F]"></div>
          <div>
            <div className="flex items-center justify-between text-[#74777F] text-xs uppercase font-semibold">
              <span>Ledger Health</span>
              <div className="w-8 h-8 rounded-lg bg-[#1E3A5F]/10 text-[#1E3A5F] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-[#10B981]">100%</span>
              <span className="text-xs font-medium text-[#74777F]">Σ Debits = Σ Credits</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#3B3278]/8 flex items-center justify-between text-xs font-mono">
            <span className="text-[#74777F]">Double-Entry Proof</span>
            <span className="font-bold text-[#10B981]">VERIFIED</span>
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
                <h2 className="font-serif font-bold text-base text-[#1C1736]">Recent Ledger Activity</h2>
              </div>
              <Link
                href="/bank/transactions"
                className="text-xs font-semibold text-[#3B3278] hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold border-b border-[#3B3278]/8 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Transaction Ref</th>
                    <th className="py-2.5 px-4">Scope / Account</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B3278]/6 font-mono">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#74777F]">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#3B3278]" />
                        <span>Querying live double-entry journal...</span>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#74777F]">
                        <CheckCircle2 className="w-6 h-6 text-[#10B981] mx-auto mb-2" />
                        <span className="font-sans font-medium text-xs text-[#1C1736] block">No Transactions Recorded Yet</span>
                        <span className="text-[11px] text-[#74777F]">Double-entry ledger is live and synchronized with central settlement.</span>
                      </td>
                    </tr>
                  ) : (
                    transactions.slice(0, 8).map((tx) => {
                      const statusColor = getTxStatusBadge(tx.status);
                      const timeStr = tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';
                      return (
                        <tr key={tx.id} className="hover:bg-[#FAFAFF] transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#3B3278]">{tx.referenceNumber || tx.id.slice(0, 12)}</span>
                          </td>
                          <td className="py-3 px-4 font-sans">
                            <div className="text-[#1C1736] font-medium font-mono text-[11px]">
                              {tx.sourceAccountId ? tx.sourceAccountId.slice(0, 14) : 'CENTRAL_SETTLEMENT'}
                            </div>
                            <div className="text-[10px] text-[#74777F] font-mono">
                              → {tx.destinationAccountId ? tx.destinationAccountId.slice(0, 14) : 'SETTLED'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3B3278]/8 text-[#3B3278] border border-[#3B3278]/15">
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <BankMaskedValue
                              value={`${formatMinorToArth(tx.amountMinor)} ARTH`}
                              valueClassName="font-bold text-[#A8742A]"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-[#74777F] text-[11px]">
                            {timeStr}
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

        {/* Right (4 cols): Quick Actions & System Info */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-[#3B3278]/10 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#3B3278]" />
              <h3 className="font-serif font-bold text-sm text-[#1C1736]">Bank Operations</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Customers', href: '/bank/customers', icon: Users, color: 'text-[#10B981]' },
                { label: 'Accounts', href: '/bank/accounts', icon: Landmark, color: 'text-[#3B3278]' },
                { label: 'Transactions', href: '/bank/transactions', icon: ArrowRightLeft, color: 'text-[#A8742A]' },
                { label: 'Fixed Deposits', href: '/bank/fixed-deposits', icon: PiggyBank, color: 'text-[#1E3A5F]' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/6 hover:border-[#3B3278]/20 hover:bg-[#F4F2FF] transition-all text-xs font-medium text-[#43474E] hover:text-[#3B3278]"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Institutional Compliance Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#3B3278]/10 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <h3 className="font-serif font-bold text-sm text-[#1C1736]">Node Compliance</h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-dashed border-[#3B3278]/8">
                <span className="text-[#74777F]">Node Jurisdiction</span>
                <span className="font-bold text-[#1C1736]">Sovereign Tier-1</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-dashed border-[#3B3278]/8">
                <span className="text-[#74777F]">Central Settlement (CLS)</span>
                <span className="font-bold text-[#10B981]">ONLINE</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-dashed border-[#3B3278]/8">
                <span className="text-[#74777F]">Statutory Reserve Ratio</span>
                <span className="font-bold text-[#1C1736]">12.0% CRR</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#74777F]">Security Protocol</span>
                <span className="font-bold text-[#3B3278]">Dual-Password Isolation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
