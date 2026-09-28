'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Receipt, 
  ArrowUpRight, 
  ArrowDownLeft, 
  LineChart, 
  Sparkles, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { apiFetchUserAccounts, apiFetchAccountTransactions } from '@/lib/api';
import { TransactionDto } from '@arthax/types';

interface AuditLedgerStreamProps {
  isMasked: boolean;
}

interface TransactionDisplayItem {
  id: string;
  title: string;
  meta: string;
  amount: string;
  isPositive: boolean;
  statusText: string;
  iconType: 'dvp' | 'yield' | 'stock' | 'shop';
  iconAsset?: string;
}

export const AuditLedgerStream: React.FC<AuditLedgerStreamProps> = ({ isMasked }) => {
  const [realTransactions, setRealTransactions] = useState<TransactionDisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const accounts = await apiFetchUserAccounts();
      if (!accounts || accounts.length === 0) {
        setRealTransactions([]);
        return;
      }

      const allTxs: TransactionDto[] = [];
      for (const acct of accounts.slice(0, 5)) {
        try {
          const txs = await apiFetchAccountTransactions(acct.id);
          if (Array.isArray(txs)) {
            allTxs.push(...txs);
          }
        } catch {
          // ignore per-account errors
        }
      }

      if (allTxs.length > 0) {
        // Sort descending by date
        const userAccountIds = new Set(accounts.map((a) => a.id));
        const mapped: TransactionDisplayItem[] = allTxs.map((tx) => {
          const amt = Number(BigInt(tx.amountMinor)) / 100;
          const isPositive = tx.type === 'REWARD' || (tx.destinationAccountId ? userAccountIds.has(tx.destinationAccountId) : false);
          return {
            id: tx.id,
            title: tx.type === 'REWARD' ? `Sovereign Creation Bonus (${tx.referenceNumber})` : `${tx.type.replace(/_/g, ' ')} Transfer (${tx.referenceNumber})`,
            meta: `Scope: ${tx.scope} • Status: ${tx.status} • ${new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            amount: `${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            isPositive,
            statusText: tx.status,
            iconType: 'dvp',
            iconAsset: '/assets/icons/completed.png',
          };
        });
        setRealTransactions(mapped);
      } else {
        setRealTransactions([]);
      }
    } catch {
      setRealTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    const handleInvalidation = () => {
      fetchTransactions();
    };
    window.addEventListener('arthax_portal_data_invalidated', handleInvalidation);
    return () => {
      window.removeEventListener('arthax_portal_data_invalidated', handleInvalidation);
    };
  }, [fetchTransactions]);

  const displayList = realTransactions;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 space-y-5" id="ledger">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[#1E3A5F]" />
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#022448]">
            Audit Ledger Stream
          </h2>
        </div>
        <span className="font-mono text-xs text-[#74777F]">
          {realTransactions.length > 0 ? 'Live PostgreSQL Stream' : 'Zero-Divergence Ledger'}
        </span>
      </div>

      {/* Transactions List or Real Empty State */}
      {isLoading ? (
        <div className="py-8 text-center font-mono text-xs text-[#74777F]">
          Streaming immutable transactions from ledger...
        </div>
      ) : displayList.length === 0 ? (
        <div className="py-10 px-6 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15 text-center space-y-2">
          <Receipt className="w-8 h-8 text-[#74777F]/40 mx-auto" />
          <p className="font-sans text-sm font-semibold text-[#121C28]">No Recorded Transactions</p>
          <p className="font-mono text-xs text-[#74777F] max-w-sm mx-auto">
            Your ledger activity is fresh. Completed DvP transfers, deposit settlements, and interest distributions will stream here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
        {displayList.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15 hover:bg-[#EEF4FF] hover:border-[#1E3A5F]/30 transition-all duration-200"
          >
            {/* Left: Icon & Description */}
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                tx.isPositive 
                  ? 'bg-[#A8F5BF]/60 text-[#002110]' 
                  : 'bg-[#DBE1FF] text-[#022448]'
              }`}>
                {tx.iconType === 'dvp' && <ArrowUpRight className="w-4 h-4" />}
                {tx.iconType === 'yield' && <ArrowDownLeft className="w-4 h-4 text-[#10B981]" />}
                {tx.iconType === 'stock' && <LineChart className="w-4 h-4 text-[#4C5D8E]" />}
                {tx.iconType === 'shop' && <Sparkles className="w-4 h-4 text-[#A8742A]" />}
              </div>

              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold text-[#121C28]">
                  {tx.title}
                </span>
                <span className="font-mono text-[11px] text-[#43474E] mt-0.5">
                  {tx.meta}
                </span>
              </div>
            </div>

            {/* Right: Amount & Status */}
            <div className="flex items-center gap-3 text-right shrink-0">
              <div className="flex flex-col">
                <span className={`font-mono text-xs font-bold ${
                  tx.isPositive ? 'text-[#10B981]' : 'text-[#121C28]'
                }`}>
                  {isMasked ? '••••••' : `${tx.isPositive ? '+' : '-'}${tx.amount}`} ARTH
                </span>
                <span className="font-mono text-[10px] text-[#10B981] font-semibold flex items-center justify-end gap-1">
                  {tx.statusText}
                </span>
              </div>

              {tx.iconAsset ? (
                <div className="w-5 h-5 relative shrink-0">
                  <Image 
                    src={tx.iconAsset} 
                    alt="Settled" 
                    width={20} 
                    height={20} 
                    className="object-contain"
                  />
                </div>
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Footer Link */}
      <div className="pt-2 border-t border-[#74777F]/15 flex items-center justify-between text-xs font-mono text-[#43474E]">
        <span>Showing {displayList.length} Recorded Entries</span>
        <a href="#full-ledger" className="text-[#1E3A5F] hover:underline flex items-center gap-1 font-semibold">
          <span>Explore Complete Ledger</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
