'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Sliders,
  FileDown,
  ArrowRightLeft,
  Calendar,
  User,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  MOCK_ACCOUNTS,
  MOCK_CUSTOMERS,
  MOCK_TRANSACTIONS,
  formatArth,
  getStatusColor,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = (params?.accountId as string) || 'ACC-001';

  const account = MOCK_ACCOUNTS.find((a) => a.id === accountId) || MOCK_ACCOUNTS[0];
  const customer = MOCK_CUSTOMERS.find((c) => c.id === account.customerId);

  const [currentStatus, setCurrentStatus] = useState(account.status);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const accountTransactions = MOCK_TRANSACTIONS.filter(
    (tx) => tx.senderAccount === account.accountNumber || tx.receiverAccount === account.accountNumber
  );

  const handleToggleFreeze = () => {
    if (currentStatus === 'Frozen') {
      setCurrentStatus('Active');
      setActionSuccess('Account unfrozen successfully. Full transaction capabilities restored.');
    } else {
      setCurrentStatus('Frozen');
      setActionSuccess('Account frozen. Inward and outward settlement restricted.');
    }
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const sc = getStatusColor(currentStatus);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#74777F]">
          <Link href="/bank" className="hover:text-[#3B3278] transition">Bank</Link>
          <span>/</span>
          <Link href="/bank/accounts" className="hover:text-[#3B3278] transition">Accounts</Link>
          <span>/</span>
          <span className="font-mono font-bold text-[#1C1736]">{account.id}</span>
        </div>

        <Link
          href="/bank/accounts"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B3278]/15 bg-white text-xs font-semibold text-[#3B3278] hover:bg-[#FAFAFF] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Accounts</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Account Overview Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3B3278]/10 text-[#3B3278] flex items-center justify-center border border-[#3B3278]/15">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-mono font-bold text-2xl text-[#1C1736]">
                  <BankMaskedValue value={account.accountNumber} />
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                  {currentStatus}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#3B3278]/10 text-[#3B3278] text-[11px] font-mono font-bold">
                  {account.type}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-[#74777F]">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> Customer:
                  <Link
                    href={`/bank/customers/${account.customerId}`}
                    className="font-semibold text-[#3B3278] hover:underline ml-0.5"
                  >
                    {account.customerName}
                  </Link>
                </span>
                <span>Purpose: <strong className="text-[#1C1736]">{account.purpose}</strong></span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" /> Opened: {account.createdDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToggleFreeze}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                currentStatus === 'Frozen'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-[#B5482E]/10 border-[#B5482E]/30 text-[#B5482E] hover:bg-[#B5482E]/20'
              }`}
            >
              {currentStatus === 'Frozen' ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unfreeze Account</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Freeze Account</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleAction('Limits updated: Daily limit configured for approval')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B3278]/15 bg-white hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Adjust Limits</span>
            </button>

            <button
              onClick={() => handleAction('Account Statement PDF exported for current period')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B3278]/15 bg-white hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold transition cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Statement</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Metric Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-[#3B3278]/10">
          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Available Balance</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#A8742A]">
              <BankMaskedValue value={`${formatArth(account.balance)} ARTH`} />
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">Primary Ledger Snapshot</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Daily Transfer Limit</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#1C1736]">
              {formatArth(account.dailyLimit)} ARTH
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">CLS Real-time Ceiling</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Monthly Transfer Limit</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#1C1736]">
              {formatArth(account.monthlyLimit)} ARTH
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">Regulatory Cap</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8">
            <span className="text-xs text-[#74777F] font-medium">Total Transactions</span>
            <div className="mt-1 font-mono text-xl font-bold text-[#3B3278]">
              {account.transactionCount}
            </div>
            <div className="text-[11px] text-[#74777F] mt-0.5">Lifetime activity count</div>
          </div>
        </div>
      </div>

      {/* Account Transactions Section */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#3B3278]" />
            <h2 className="text-xs font-bold text-[#1C1736]">Account Transaction Ledger</h2>
          </div>
          <span className="text-[11px] text-[#74777F]">Direct debits and credits</span>
        </div>

        {accountTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#74777F]">
            No recent transactions found for this account in the active journal window.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
                <tr>
                  <th className="py-2.5 px-4">TX ID</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Counterparty</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3B3278]/6">
                {accountTransactions.map((tx) => {
                  const tsc = getStatusColor(tx.status);
                  const isIncoming = tx.receiverAccount === account.accountNumber;
                  return (
                    <tr key={tx.id} className="hover:bg-[#FAFAFF] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">{tx.id}</td>
                      <td className="py-3 px-4 font-mono text-[#74777F]">{tx.dateTime}</td>
                      <td className="py-3 px-4 font-semibold text-[#1C1736]">{tx.type}</td>
                      <td className="py-3 px-4 text-[#74777F]">
                        {isIncoming ? `Received from ${tx.senderName}` : `Sent to ${tx.receiverName}`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tsc.bg} ${tsc.text} border ${tsc.border}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${isIncoming ? 'text-emerald-700' : 'text-[#1C1736]'}`}>
                        <BankMaskedValue value={`${isIncoming ? '+' : '-'}${formatArth(tx.amount)} ARTH`} />
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
    </div>
  );
}
