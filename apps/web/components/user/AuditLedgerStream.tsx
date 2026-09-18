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

const DEFAULT_TRANSACTIONS: TransactionDisplayItem[] = [
  {
    id: 'tx-1',
    title: 'Inter-bank DvP transfer to Samaya Term',
    meta: 'pacs.008.001.09 • Block #28,102,488 • Today 11:24 IST',
    amount: '-12,450.00',
    isPositive: false,
    statusText: 'CLS Settled',
    iconType: 'dvp',
    iconAsset: '/assets/icons/completed.png',
  },
  {
    id: 'tx-2',
    title: 'Central Bank Quarterly Staking Yield',
    meta: 'Automated Distribution • Epoch #941 • Today 06:00 IST',
    amount: '+124.80',
    isPositive: true,
    statusText: 'Accrued',
    iconType: 'yield',
    iconAsset: '/assets/icons/completed.png',
  },
  {
    id: 'tx-3',
    title: 'Stock Equity Acquisition (NILA Systems 40 Shs)',
    meta: 'Exchange Fill @ 205.00 • Order ID #NX-88219',
    amount: '-8,200.00',
    isPositive: false,
    statusText: 'Settled T+0',
    iconType: 'stock',
  },
  {
    id: 'tx-4',
    title: 'Shop Relic Acquisition (The Yield Griffin Companion)',
    meta: 'Citizen Vault Inventory Item #RELIC-04',
    amount: '-500.00',
    isPositive: false,
    statusText: 'Verified',
    iconType: 'shop',
  },
];

export const AuditLedgerStream: React.FC<AuditLedgerStreamProps> = ({ isMasked }) => {
  const [realTransactions, setRealTransactions] = useState<TransactionDisplayItem[]>([]);

  const fetchTransactions = useCallback(async () => {
    try {
      const accounts = await apiFetchUserAccounts();
      if (!accounts || accounts.length === 0) return;

      const allTxs: TransactionDto[] = [];
      for (const acct of accounts.slice(0, 3)) {
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
        // Map to display items
        const mapped: TransactionDisplayItem[] = allTxs.map((tx) => {
          const amt = Number(BigInt(tx.amountMinor)) / 100;
          return {
            id: tx.id,
            title: `${tx.type.replace(/_/g, ' ')} Transfer (${tx.referenceNumber})`,
            meta: `Scope: ${tx.scope} • Status: ${tx.status} • ${new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            amount: `${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            isPositive: false,
            statusText: tx.status,
            iconType: 'dvp',
            iconAsset: '/assets/icons/completed.png',
          };
        });
        setRealTransactions(mapped);
      }
    } catch {
      // Fallback to default entries
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

  const displayList = realTransactions.length > 0
    ? [...realTransactions, ...DEFAULT_TRANSACTIONS.slice(0, Math.max(0, 4 - realTransactions.length))]
    : DEFAULT_TRANSACTIONS;

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
          {realTransactions.length > 0 ? 'Live PostgreSQL Stream' : 'Immutable Chain Receipt'}
        </span>
      </div>

      {/* Transactions List */}
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
