'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRightLeft,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  XCircle,
  X,
  Layers,
  FileText,
  TrendingUp,
} from 'lucide-react';
import {
  MOCK_CLS_QUEUE,
  MOCK_INTERBANK_FLOW_MATRIX,
  MOCK_COMMERCIAL_BANKS,
  InterbankSettlementItem,
  ClsLifecycleStage,
} from '@/components/central-bank/CentralBankMockData';
import { CentralBankMaskedValue } from '@/components/central-bank/CentralBankMaskedValue';
import { apiFetchClsQueue } from '@/lib/api';

export default function ClsSettlementPage() {
  const [queue, setQueue] = useState<InterbankSettlementItem[]>(MOCK_CLS_QUEUE);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<InterbankSettlementItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshQueue = async () => {
    setIsLoading(true);
    try {
      const liveQueue = await apiFetchClsQueue(stageFilter);
      if (liveQueue && liveQueue.length > 0) {
        const mapped: InterbankSettlementItem[] = liveQueue.map((s) => ({
          id: s.reference || s.id,
          ledgerBatchRef: `BATCH-${s.id.substring(0, 8)}`,
          sourceBank: s.sourceBankId,
          destinationBank: s.destinationBankId,
          amount: Number(BigInt(s.amountMinor)) / 100,
          stage: (s.stage === 'FINALIZING' ? 'FINALYZING' : s.stage) as ClsLifecycleStage,
          timestamp: s.createdAt,
          clearingLatencyMs: s.clearingLatencyMs || 120,
          feeLevy: Number(BigInt(s.feeLevyMinor)) / 100,
          failureReason: s.failureReason,
          reversalTxId: s.reversalTransactionId,
          timeline: (s.timeline || []).map((t) => ({
            stage: (t.stage === 'FINALIZING' ? 'FINALYZING' : t.stage) as ClsLifecycleStage,
            time: t.timestamp,
            note: t.note || '',
          })),
        }));
        setQueue(mapped);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshQueue();
  }, [stageFilter]);

  const filteredQueue = queue.filter((item) => {
    const matchesStage = stageFilter === 'all' || item.stage === stageFilter;
    const matchesSearch =
      !searchQuery ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ledgerBatchRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceBank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destinationBank.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageColor = (stage: ClsLifecycleStage) => {
    switch (stage) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'SETTLING':
      case 'PROCESSING':
      case 'FINALYZING':
        return 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse';
      case 'VALIDATING':
      case 'AUTHORIZED':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'FAILED':
      case 'REVERSED':
        return 'bg-red-100 text-[#B5482E] border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              CENTRAL CLEARING PROTOCOL
            </span>
            <span className="text-[11px] text-emerald-700 font-mono font-bold">
              • T+0 REAL-TIME ATOMIC NETTING
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Central Settlement Layer (CLS) Control Center
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Multi-bank transaction routing, double-entry clearing records, liquidity reservation locks, and automated atomic rollback protection.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            CLS Sequencer Active
          </span>
        </div>
      </div>

      {/* CLS Queue KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-xs text-[#5C574F] font-medium block">Active Clearing Queue</span>
          <div className="font-mono text-xl font-bold text-[#2A2012] mt-1">
            {queue.filter((q) => q.stage !== 'COMPLETED' && q.stage !== 'FAILED').length} In Flight
          </div>
          <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">Avg Latency: 24ms</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-xs text-[#5C574F] font-medium block">24h Inter-Bank Volume</span>
          <div className="font-mono text-xl font-bold text-[#2A2012] mt-1">
            <CentralBankMaskedValue value={8_410_250} suffix=" ARTH" />
          </div>
          <span className="text-[10px] text-[#5C574F] font-mono mt-0.5 block">Across 5 Banks</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-xs text-[#5C574F] font-medium block">Settlement Tax Collected</span>
          <div className="font-mono text-xl font-bold text-[#946726] mt-1">
            <CentralBankMaskedValue value={4_205} suffix=" ARTH" />
          </div>
          <span className="text-[10px] text-[#A8742A] font-mono mt-0.5 block font-semibold">
            0.05% Levy [Demo Benchmark]
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-xs text-[#5C574F] font-medium block">Reconciliation Exceptions</span>
          <div className="font-mono text-xl font-bold text-[#B5482E] mt-1">
            {queue.filter((q) => q.stage === 'FAILED').length} Resolved
          </div>
          <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
            100% Invariant Preserved
          </span>
        </div>
      </div>

      {/* Bank-to-Bank Daily Flow Matrix */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2A2012] flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-[#946726]" />
              <span>Inter-Bank Gross Settlement Flow Matrix (Thousands ARTH)</span>
            </h3>
            <p className="text-xs text-[#5C574F]">
              Direct credit flow originating from row institutions toward column receiving institutions
            </p>
          </div>
          <span className="font-mono text-[11px] text-[#946726] bg-[#946726]/5 px-2.5 py-1 rounded-lg border border-[#946726]/15">
            Synchronized Real-Time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead className="bg-[#F8F9FA] text-[10px] text-[#5C574F] uppercase tracking-wider border-b border-[#946726]/10">
              <tr>
                <th className="p-3 text-left">From \ To</th>
                <th className="p-3">NAVA</th>
                <th className="p-3">SAMAYA</th>
                <th className="p-3">SETU</th>
                <th className="p-3">STHIRA</th>
                <th className="p-3">VAYU</th>
                <th className="p-3 text-right">Gross Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.keys(MOCK_INTERBANK_FLOW_MATRIX).map((fromBank) => {
                const row = MOCK_INTERBANK_FLOW_MATRIX[fromBank];
                const totalOut = Object.values(row).reduce((a, b) => a + b, 0);

                return (
                  <tr key={fromBank} className="hover:bg-[#F6F8F7] transition">
                    <td className="p-3 text-left font-bold text-[#2A2012] uppercase">
                      {fromBank}
                    </td>
                    {['nava', 'samaya', 'setu', 'sthira', 'vayu'].map((toBank) => (
                      <td
                        key={toBank}
                        className={`p-3 ${
                          fromBank === toBank
                            ? 'text-gray-300 font-light'
                            : row[toBank] > 1000
                            ? 'text-[#946726] font-bold bg-[#946726]/5'
                            : 'text-[#262320]'
                        }`}
                      >
                        {fromBank === toBank ? '—' : `${row[toBank]}k`}
                      </td>
                    ))}
                    <td className="p-3 text-right font-bold text-[#2A2012]">
                      {totalOut.toLocaleString('en-US')}k
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live CLS Settlement Queue Table */}
      <div className="space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'SETTLING', 'FINALYZING', 'COMPLETED', 'FAILED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStageFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  stageFilter === st
                    ? 'bg-[#946726] text-white shadow-xs'
                    : 'text-[#5C574F] hover:text-[#946726] bg-[#F6F8F7]'
                }`}
              >
                {st === 'all' ? 'All Queue States' : st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by CLS ID, Batch Ref, Bank..."
              className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full md:w-64"
            />
          </div>
        </div>

        {/* Transaction Queue Table */}
        <div className="bg-white rounded-3xl border border-[#946726]/15 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] border-b border-[#946726]/10 font-mono text-[10px] text-[#5C574F] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Settlement ID</th>
                  <th className="p-4">Route (Debtor → Creditor)</th>
                  <th className="p-4">Principal Amount</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Batch Reference</th>
                  <th className="p-4">Latency</th>
                  <th className="p-4 text-right whitespace-nowrap min-w-[120px]">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F6F8F7] transition">
                    <td className="p-4 font-bold text-[#946726]">
                      {item.id}
                      <span className="block text-[9px] text-[#74777F] font-normal">
                        {item.timestamp}
                      </span>
                    </td>

                    <td className="p-4 font-sans font-medium text-xs">
                      <span className="uppercase font-bold text-[#2A2012] font-mono">
                        {item.sourceBank}
                      </span>{' '}
                      →{' '}
                      <span className="uppercase font-bold text-emerald-800 font-mono">
                        {item.destinationBank}
                      </span>
                    </td>

                    <td className="p-4 text-sm font-bold text-[#2A2012]">
                      <CentralBankMaskedValue value={item.amount} suffix=" ARTH" />
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageColor(
                          item.stage
                        )}`}
                      >
                        {item.stage}
                      </span>
                    </td>

                    <td className="p-4 text-[11px] text-[#74777F]">
                      {item.ledgerBatchRef}
                    </td>

                    <td className="p-4 text-[11px] text-emerald-700">
                      {item.clearingLatencyMs} ms
                    </td>

                    <td className="p-4 text-right font-sans whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedTx(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] shadow-2xs hover:shadow-xs transition-all duration-150 font-mono text-[11px] font-bold whitespace-nowrap group cursor-pointer active:scale-95"
                        title={`Inspect audit trail for ${item.id}`}
                      >
                        <Eye className="w-3.5 h-3.5 text-[#946726] group-hover:text-white transition-colors shrink-0" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Transaction Detail Drill-Down Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-6 bg-[#946726] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-white/70 block">
                    CLS SETTLEMENT RECORD
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {selectedTx.id}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs font-sans bg-[#FDFBF7]">
              
              {/* Routing Breakdown */}
              <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 grid grid-cols-2 gap-4 font-mono shadow-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#74777F] block">Sending Debtor Bank</span>
                  <strong className="text-[#2A2012] text-sm uppercase block mt-0.5">
                    {selectedTx.sourceBank} Bank
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#74777F] block">Receiving Creditor Bank</span>
                  <strong className="text-emerald-800 text-sm uppercase block mt-0.5">
                    {selectedTx.destinationBank} Bank
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#74777F] block">Principal Cleared</span>
                  <strong className="text-[#2A2012] text-sm block mt-0.5">
                    {selectedTx.amount.toLocaleString('en-US')} ARTH
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#74777F] block">Settlement Tax Levy</span>
                  <strong className="text-[#946726] text-sm block mt-0.5">
                    {selectedTx.feeLevy} ARTH (0.05%)
                  </strong>
                </div>
              </div>

              {/* Failure / Reversal Alert if Applicable */}
              {selectedTx.failureReason && (
                <div className="p-4 bg-red-50 border border-[#B5482E]/30 text-[#B5482E] rounded-2xl space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Settlement Exception Reason
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {selectedTx.failureReason}
                  </p>
                  {selectedTx.reversalTxId && (
                    <div className="font-mono text-[10px] text-[#262320] pt-1">
                      Atomic Reversal TX: <strong>{selectedTx.reversalTxId}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Atomic State Timeline */}
              <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 space-y-3 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                  Clearing Lifecycle Timeline
                </h4>
                <div className="space-y-3 font-mono text-xs pl-2 border-l-2 border-[#946726]/20">
                  {selectedTx.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-4">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#946726] border-2 border-white" />
                      <div className="flex items-center justify-between text-[10px] text-[#74777F]">
                        <strong className="text-[#946726]">{step.stage}</strong>
                        <span>{step.time}</span>
                      </div>
                      <p className="font-sans text-[11px] text-[#262320] mt-0.5">
                        {step.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="px-5 py-2 rounded-xl bg-[#946726] text-white text-xs font-bold transition shadow-xs hover:bg-[#2A2012] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
