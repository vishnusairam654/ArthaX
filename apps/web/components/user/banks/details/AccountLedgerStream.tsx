'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  Wifi,
  Lock,
  PiggyBank,
  CheckCircle2,
  Shield,
  Filter,
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface AccountLedgerStreamProps {
  isMasked: boolean;
}

type FilterType = 'all' | 'inflow' | 'outflow' | 'escrow';

interface LedgerRecord {
  id: string;
  type: 'inflow' | 'outflow' | 'escrow';
  title: string;
  timestamp: string;
  ref: string;
  counterparty: string;
  nodeTag: string;
  amount: number;
  balance: number;
  status: string;
  blockHeight: string;
}

const RECORDS: LedgerRecord[] = [
  {
    id: 'tx-1',
    type: 'inflow',
    title: 'Sovereign Direct Payroll',
    timestamp: '24 May 2025 • 00:01 UTC',
    ref: '#SAL-90214',
    counterparty: 'Min. of Sovereign Technology',
    nodeTag: 'rbi.gov.cls.0091',
    amount: 30000,
    balance: 142500,
    status: 'CLS Settled',
    blockHeight: '#28,102,490',
  },
  {
    id: 'tx-2',
    type: 'outflow',
    title: 'DvP Equity Allocation',
    timestamp: '23 May 2025 • 14:20 UTC',
    ref: 'Tranche #8821',
    counterparty: 'NSE Sovereign Custody',
    nodeTag: 'nse.clearing.cls.441',
    amount: -5000,
    balance: 112500,
    status: 'Finalized',
    blockHeight: '#28,099,102',
  },
  {
    id: 'tx-3',
    type: 'outflow',
    title: 'Sovereign Grid Utilities',
    timestamp: '21 May 2025 • 09:12 UTC',
    ref: 'Recurring Direct-Debit',
    counterparty: 'BSNL BharatNet Core',
    nodeTag: 'util.in.cls.3900',
    amount: -240,
    balance: 117500,
    status: 'CLS Settled',
    blockHeight: '#28,074,800',
  },
  {
    id: 'tx-4',
    type: 'escrow',
    title: 'Statutory Reserve Lock',
    timestamp: '15 May 2025 • 11:00 UTC',
    ref: 'Tier-B Escrow',
    counterparty: 'Reserve Enclave Contract',
    nodeTag: 'escrow.nava.vault',
    amount: 5000,
    balance: 117740,
    status: 'Locked Reserve',
    blockHeight: '#27,990,114',
  },
  {
    id: 'tx-5',
    type: 'inflow',
    title: 'Yield & Sovereign Dividend',
    timestamp: '12 May 2025 • 04:30 UTC',
    ref: 'Automated Distribution',
    counterparty: 'Bharat Asset Management',
    nodeTag: 'bam.yield.cls.118',
    amount: 1250,
    balance: 122740,
    status: 'CLS Settled',
    blockHeight: '#27,942,002',
  },
];

export const AccountLedgerStream: React.FC<AccountLedgerStreamProps> = ({ isMasked }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredRecords = useMemo(() => {
    return RECORDS.filter((rec) => {
      if (filter !== 'all' && rec.type !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          rec.title.toLowerCase().includes(q) ||
          rec.counterparty.toLowerCase().includes(q) ||
          rec.nodeTag.toLowerCase().includes(q) ||
          rec.ref.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter and Query Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#74777F]/20 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs font-sans">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-[#022448] text-white shadow-2xs'
                : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
            }`}
          >
            All Records
          </button>
          <button
            type="button"
            onClick={() => setFilter('inflow')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              filter === 'inflow'
                ? 'bg-[#022448] text-white shadow-2xs'
                : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
            }`}
          >
            Inflows (Credits)
          </button>
          <button
            type="button"
            onClick={() => setFilter('outflow')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              filter === 'outflow'
                ? 'bg-[#022448] text-white shadow-2xs'
                : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
            }`}
          >
            Outflows (Debits)
          </button>
          <button
            type="button"
            onClick={() => setFilter('escrow')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              filter === 'escrow'
                ? 'bg-[#022448] text-white shadow-2xs'
                : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
            }`}
          >
            Escrow &amp; Locks
          </button>
        </div>

        {/* Search & Month Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memo or hash..."
              className="w-full h-9 pl-9 pr-3 rounded-full bg-[#F8F9FF] border border-[#74777F]/20 text-xs font-sans text-[#121C28] placeholder:text-[#74777F] focus:outline-hidden focus:border-[#022448]"
            />
          </div>

          <button
            type="button"
            className="h-9 px-3 rounded-full bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#022448] text-xs font-sans flex items-center gap-1.5 border border-[#74777F]/15 shrink-0 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#1E3A5F]" />
            <span className="hidden md:inline font-medium">May 2025</span>
          </button>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="rounded-2xl bg-white border border-[#74777F]/20 shadow-2xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-[#F8F9FF] text-[#74777F] font-mono text-[10px] uppercase border-b border-[#74777F]/15">
                <th className="py-3 px-4 font-semibold">Timestamp &amp; Memo</th>
                <th className="py-3 px-4 font-semibold">Counterparty / Node</th>
                <th className="py-3 px-4 font-semibold text-right">Amount (ARTH)</th>
                <th className="py-3 px-4 font-semibold text-right">Balance</th>
                <th className="py-3 px-4 font-semibold text-center">Status / CLS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#74777F]/10">
              {filteredRecords.map((rec) => {
                const isInflow = rec.type === 'inflow';
                const isEscrow = rec.type === 'escrow';

                return (
                  <tr
                    key={rec.id}
                    className="hover:bg-[#F8F9FF] transition-colors cursor-pointer"
                  >
                    {/* Timestamp & Memo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isInflow
                              ? 'bg-emerald-100 text-emerald-700'
                              : isEscrow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#E5EFFF] text-[#022448]'
                          }`}
                        >
                          {isInflow ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : isEscrow ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-[#121C28] text-xs leading-snug">
                            {rec.title}
                          </p>
                          <p className="font-mono text-[10px] text-[#74777F] mt-0.5">
                            {rec.timestamp} • {rec.ref}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Counterparty / Node */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#121C28]">{rec.counterparty}</p>
                      <p className="font-mono text-[10px] text-[#74777F] mt-0.5">{rec.nodeTag}</p>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-xs">
                      <span
                        className={
                          isInflow
                            ? 'text-emerald-700'
                            : isEscrow
                            ? 'text-[#A8742A]'
                            : 'text-[#B5482E]'
                        }
                      >
                        {isEscrow ? '[' : isInflow ? '+' : ''}
                        <AnimatedMaskedValue
                          value={Math.abs(rec.amount).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                          isMasked={isMasked}
                          currency="ARTH"
                        />
                        {isEscrow ? ']' : ''}
                      </span>
                    </td>

                    {/* Running Balance */}
                    <td className="py-3.5 px-4 text-right font-mono text-[#121C28]">
                      <AnimatedMaskedValue
                        value={rec.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        isMasked={isMasked}
                        currency="ARTH"
                      />
                    </td>

                    {/* Status / CLS */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C8DFDB] text-[#022448] font-mono text-[10px] font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {rec.status}
                      </span>
                      <span className="block font-mono text-[10px] text-[#74777F] mt-0.5">
                        {rec.blockHeight}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="py-12 px-4 text-center">
            <Filter className="w-8 h-8 text-[#74777F] mx-auto mb-2 opacity-50" />
            <h4 className="font-serif font-semibold text-sm text-[#121C28]">
              No ledger records matched your query
            </h4>
            <p className="font-sans text-xs text-[#74777F] mt-1 max-w-sm mx-auto">
              Try adjusting the filter categories or clearing your search term to review historical ledger states.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                setSearch('');
              }}
              className="mt-3 px-3 py-1 rounded-full bg-[#E5EFFF] text-[#022448] font-sans text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Table Pagination & Ledger Verification Rail */}
        <div className="p-3.5 bg-[#F8F9FF] border-t border-[#74777F]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#74777F]">
          <div className="flex items-center gap-2">
            <span>Showing 1-{filteredRecords.length} of 148 Entries</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#022448] font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#1E3A5F]" />
              Hardware Enclave Hash Validated
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded bg-white border border-[#74777F]/15 hover:bg-[#E5EFFF] text-[#121C28] disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <span className="px-2 font-bold text-[#022448]">{page}</span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1 rounded bg-white border border-[#74777F]/15 hover:bg-[#E5EFFF] text-[#121C28] cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
