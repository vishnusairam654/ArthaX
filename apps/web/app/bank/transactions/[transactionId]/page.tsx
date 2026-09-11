'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  FileText,
  ShieldCheck,
  Building2,
  Share2,
  Ban,
  ArrowRight,
} from 'lucide-react';
import {
  MOCK_TRANSACTIONS,
  formatArth,
  getStatusColor,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function TransactionDetailPage() {
  const params = useParams();
  const transactionId = (params?.transactionId as string) || 'TX-240908-001';

  const tx = MOCK_TRANSACTIONS.find((t) => t.id === transactionId) || MOCK_TRANSACTIONS[0];
  const [currentStatus, setCurrentStatus] = useState(tx.status);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAction = (msg: string, newStatus?: typeof currentStatus) => {
    if (newStatus) setCurrentStatus(newStatus);
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const sc = getStatusColor(currentStatus);

  const stages = ['Validating', 'Authorized', 'Processing', 'Settling', 'Completed'];
  const isFailed = currentStatus === 'Failed' || currentStatus === 'Cancelled';
  const isReversed = currentStatus === 'Reversed';

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#74777F]">
          <Link href="/bank" className="hover:text-[#3B3278] transition">Bank</Link>
          <span>/</span>
          <Link href="/bank/transactions" className="hover:text-[#3B3278] transition">Transactions</Link>
          <span>/</span>
          <span className="font-mono font-bold text-[#1C1736]">{tx.id}</span>
        </div>

        <Link
          href="/bank/transactions"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B3278]/15 bg-white text-xs font-semibold text-[#3B3278] hover:bg-[#FAFAFF] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Transactions</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Transaction Header */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3B3278]/10 text-[#3B3278] flex items-center justify-center border border-[#3B3278]/15">
              <ArrowRightLeft className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-mono font-bold text-2xl text-[#1C1736]">{tx.id}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>
                  {currentStatus}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#3B3278]/10 text-[#3B3278] text-[11px] font-mono font-bold">
                  {tx.scope}
                </span>
              </div>
              <p className="text-xs text-[#74777F] mt-1 font-mono">
                Settlement Ref: <strong className="text-[#1C1736]">{tx.settlementRef}</strong> • Ledger Ref:{' '}
                <strong className="text-[#1C1736]">{tx.ledgerRef}</strong>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {currentStatus === 'Failed' && (
              <button
                onClick={() => handleAction('Settlement retry initiated with CLS Clearing Pool', 'Settling')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3B3278] text-white hover:bg-[#2D2654] text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry Settlement</span>
              </button>
            )}

            {currentStatus === 'Completed' && (
              <button
                onClick={() => handleAction('Reversal request issued to CLS Clearing Core', 'Reversed')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#B5482E]/30 bg-[#B5482E]/10 hover:bg-[#B5482E]/20 text-[#B5482E] text-xs font-bold transition cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Request Reversal</span>
              </button>
            )}

            <button
              onClick={() => handleAction('Audit receipt downloaded')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B3278]/15 bg-white hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>

        {/* Transaction Flow Banner / Amount */}
        <div className="p-4 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#74777F] font-medium">Transaction Amount</span>
            <div className="font-mono text-2xl font-bold text-[#A8742A] mt-0.5">
              <BankMaskedValue value={`${formatArth(tx.amount)} ARTH`} />
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#74777F] font-mono">
            <div>
              <span>Network Fee:</span>{' '}
              <strong className="text-[#1C1736]">{formatArth(tx.fees)} ARTH</strong>
            </div>
            <div>
              <span>Sovereign Tax:</span>{' '}
              <strong className="text-[#1C1736]">{formatArth(tx.tax)} ARTH</strong>
            </div>
            <div>
              <span>Total Debited:</span>{' '}
              <strong className="text-[#A8742A]">
                <BankMaskedValue value={`${formatArth(tx.amount + tx.fees + tx.tax)} ARTH`} />
              </strong>
            </div>
          </div>
        </div>

        {/* Lifecycle Stepper */}
        <div className="p-4 rounded-xl border border-[#3B3278]/10 bg-white">
          <span className="text-xs font-bold text-[#1C1736] block mb-3">Settlement Lifecycle</span>
          {isFailed ? (
            <div className="p-3 bg-[#B5482E]/10 border border-[#B5482E]/20 text-[#B5482E] rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B5482E]" />
              <span>
                Transaction aborted: {tx.failureReason || 'Settlement failed validation criteria.'}
              </span>
            </div>
          ) : isReversed ? (
            <div className="p-3 bg-[#74777F]/10 border border-[#74777F]/20 text-[#43474E] rounded-xl text-xs flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-[#74777F]" />
              <span>Transaction has been reversed and funds returned to the sender account.</span>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {stages.map((stage, idx) => {
                const stageIndex = stages.indexOf(currentStatus);
                const isPast = stageIndex >= idx;
                const isCurrent = currentStatus === stage;
                return (
                  <div
                    key={stage}
                    className={`p-2 rounded-xl border transition ${
                      isCurrent
                        ? 'bg-[#3B3278] text-white border-[#3B3278] font-bold shadow-xs'
                        : isPast
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                        : 'bg-[#FAFAFF] text-[#74777F] border-gray-200'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono opacity-80">Stage 0{idx + 1}</div>
                    <div className="text-xs mt-0.5">{stage}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Double Entry Ledger Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debited Entity */}
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#3B3278]/8 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#B5482E] font-bold">
              Debit Entry (-)
            </span>
            <span className="text-xs font-mono text-[#74777F]">Originating Account</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1C1736]">{tx.senderName}</div>
            <div className="font-mono text-xs text-[#3B3278] mt-0.5">
              <BankMaskedValue value={tx.senderAccount} />
            </div>
          </div>
          <div className="pt-2 border-t border-[#3B3278]/6 text-xs text-[#74777F] space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Gross Debit:</span>
              <span className="font-bold text-[#B5482E]">
                <BankMaskedValue value={`-${formatArth(tx.amount + tx.fees + tx.tax)} ARTH`} />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Timestamp:</span>
              <span>{tx.dateTime}</span>
            </div>
          </div>
        </div>

        {/* Credited Entity */}
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#3B3278]/8 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
              Credit Entry (+)
            </span>
            <span className="text-xs font-mono text-[#74777F]">Beneficiary Account</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#1C1736]">{tx.receiverName}</div>
            <div className="font-mono text-xs text-[#3B3278] mt-0.5">
              <BankMaskedValue value={tx.receiverAccount} />
            </div>
          </div>
          <div className="pt-2 border-t border-[#3B3278]/6 text-xs text-[#74777F] space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Net Credit:</span>
              <span className="font-bold text-emerald-700">
                <BankMaskedValue value={`+${formatArth(tx.amount)} ARTH`} />
              </span>
            </div>
            <div className="flex justify-between">
              <span>Settlement Window:</span>
              <span>CLS T+0 Immediate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invariant Verification Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1C1736]">Double-Entry Invariant Verified</div>
            <div className="text-[11px] text-[#74777F]">
              Σ Debits ({formatArth(tx.amount + tx.fees + tx.tax)}) = Σ Credits ({formatArth(tx.amount)} Beneficiary + {formatArth(tx.fees)} Bank Fee + {formatArth(tx.tax)} Tax Treasury)
            </div>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          INVARIANT PASSED
        </span>
      </div>
    </div>
  );
}
