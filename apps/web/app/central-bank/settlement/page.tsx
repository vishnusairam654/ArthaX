'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  ClsQueueSummaryDto,
  InterbankBilateralFlowDto,
  SettlementDto,
} from '@arthax/types';
import {
  apiFetchClsOverview,
  apiFetchClsMatrix,
  apiFetchClsQueue,
  apiTriggerClsBatch,
  subscribePortalDataInvalidation,
} from '@/lib/api';
import { CentralBankMaskedValue } from '@/components/central-bank/CentralBankMaskedValue';

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

export default function ClsSettlementPage() {
  const [overview, setOverview] = useState<ClsQueueSummaryDto | null>(null);
  const [matrix, setMatrix] = useState<InterbankBilateralFlowDto[]>([]);
  const [queue, setQueue] = useState<SettlementDto[]>([]);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<SettlementDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [batchSettling, setBatchSettling] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadAll = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const [ov, mat, q] = await Promise.all([
        apiFetchClsOverview(),
        apiFetchClsMatrix(),
        apiFetchClsQueue(stageFilter === 'all' ? undefined : stageFilter),
      ]);
      setOverview(ov);
      setMatrix(Array.isArray(mat) ? mat : []);
      setQueue(Array.isArray(q) ? q : []);
    } catch (err: any) {
      console.error('Failed to load CLS data:', err);
      setError(err?.message || 'Failed to query Central Clearing Protocol');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [stageFilter]);

  useEffect(() => {
    loadAll();
    const unsub = subscribePortalDataInvalidation(() => {
      loadAll(true);
    });
    return unsub;
  }, [loadAll]);

  const handleTriggerBatch = async () => {
    setBatchSettling(true);
    try {
      const res = await apiTriggerClsBatch(50);
      setActionNotice(`CLS batch settled: ${res.successfulCount} transactions finalized atomically (Batch ID: ${res.batchId}).`);
      await loadAll(true);
      setTimeout(() => setActionNotice(null), 5000);
    } catch (err: any) {
      setError(err?.message || 'Batch settlement execution failed');
    } finally {
      setBatchSettling(false);
    }
  };

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const matchesStage = stageFilter === 'all' || item.stage === stageFilter;
      const ref = item.reference || item.id || '';
      const src = item.sourceBankId || '';
      const dst = item.destinationBankId || '';
      const matchesSearch =
        !searchQuery ||
        ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        src.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dst.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [queue, stageFilter, searchQuery]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'SETTLING':
      case 'PROCESSING':
      case 'FINALYZING':
      case 'FINALIZING':
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

  const banksList = ['nava', 'samaya', 'setu', 'sthira', 'vayu'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Settlement
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5">
            Route, clear, and settle transactions between banks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadAll(true)}
            disabled={loading || refreshing}
            className="p-2.5 rounded-xl bg-white border border-[#946726]/20 hover:bg-[#946726]/8 text-[#946726] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh CLS State"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleTriggerBatch}
            disabled={batchSettling}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 text-amber-300 ${batchSettling ? 'animate-spin' : ''}`} />
            <span>{batchSettling ? 'Settling...' : 'Run Batch'}</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-[#B5482E]/10 border border-[#B5482E]/20 text-[#B5482E] text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadAll()}
            className="px-2.5 py-1 rounded-lg bg-[#B5482E] text-white text-[11px] font-bold hover:bg-[#8F3520] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* CLS Queue KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-xs text-[#5C574F] font-medium block">Queue</span>
          <div className="font-mono text-xl font-bold text-[#2A2012] mt-1">
            {loading ? '...' : `${(overview?.pendingCount ?? 0) + (overview?.processingCount ?? 0) + (overview?.settlingCount ?? 0)} Active`}
          </div>
          <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
            Avg Latency: {overview?.avgClearingLatencyMs ?? 142}ms
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-xs text-[#5C574F] font-medium block">24h Volume</span>
          <div className="font-mono text-xl font-bold text-[#2A2012] mt-1">
            {loading ? '...' : (
              <CentralBankMaskedValue
                value={`${formatMinorToArth(overview?.totalClearingVolumeMinor)} ARTH`}
              />
            )}
          </div>
          <span className="text-[10px] text-[#5C574F] font-mono mt-0.5 block">Across 5 Banks</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-xs text-[#5C574F] font-medium block">Finalized 24h</span>
          <div className="font-mono text-xl font-bold text-emerald-700 mt-1">
            {loading ? '...' : (overview?.completedCount24h ?? 0)} Settled
          </div>
          <span className="text-[10px] text-[#A8742A] font-mono mt-0.5 block font-semibold">
            Verified
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <span className="text-xs text-[#5C574F] font-medium block">Failed (24h)</span>
          <div className="font-mono text-xl font-bold text-[#B5482E] mt-1">
            {loading ? '...' : (overview?.failedCount24h ?? 0)}
          </div>
          <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
            Ledger Intact
          </span>
        </div>
      </div>

      {/* Bank-to-Bank Daily Flow Matrix */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2A2012] flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-[#946726]" />
              <span>Bank-to-Bank Flows</span>
            </h3>
            <p className="text-xs text-[#5C574F]">
              Settlement flows between banks
            </p>
          </div>
          <span className="font-mono text-[11px] text-[#946726] bg-[#946726]/5 px-2.5 py-1 rounded-lg border border-[#946726]/15">
            Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead className="bg-[#F8F9FA] text-[10px] text-[#5C574F] uppercase tracking-wider border-b border-[#946726]/10">
              <tr>
                <th className="p-3 text-left">From \ To</th>
                {banksList.map((b) => (
                  <th key={b} className="p-3 uppercase">{b}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banksList.map((fromBank) => (
                <tr key={fromBank} className="hover:bg-[#F6F8F7] transition">
                  <td className="p-3 text-left font-bold text-[#2A2012] uppercase">
                    {fromBank}
                  </td>
                  {banksList.map((toBank) => {
                    if (fromBank === toBank) {
                      return <td key={toBank} className="p-3 text-gray-300">—</td>;
                    }
                    const flow = matrix.find(
                      (m) => m.sourceBankId === fromBank && m.destinationBankId === toBank,
                    );
                    const amountStr = flow ? `${formatMinorToArth(flow.totalVolumeMinor)}` : '0.00';
                    return (
                      <td
                        key={toBank}
                        className={`p-3 ${flow && BigInt(flow.totalVolumeMinor || '0') > 0n ? 'text-[#946726] font-bold bg-[#946726]/5' : 'text-[#74777F]'}`}
                      >
                        {amountStr}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live CLS Settlement Queue Table */}
      <div className="space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'SETTLING', 'PROCESSING', 'COMPLETED', 'FAILED'].map((st) => (
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
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, bank ID..."
              className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full md:w-64"
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="bg-white rounded-3xl border border-[#946726]/15 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF7EE] border-b border-[#D8C7A5] text-[10px] uppercase tracking-wider text-[#615749]">
                <tr>
                  <th className="p-3.5">CLS Ref</th>
                  <th className="p-3.5">Routing (From → To)</th>
                  <th className="p-3.5 text-right">Settlement Amount</th>
                  <th className="p-3.5 text-center">Lifecycle Stage</th>
                  <th className="p-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#74777F]">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#946726]" />
                      <span>Loading...</span>
                    </td>
                  </tr>
                ) : filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#74777F]">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <span className="font-serif font-bold text-xs text-[#2A2012] block">Queue Empty</span>
                      <span className="text-[11px] text-[#5C574F]">All settlements are complete.</span>
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF7EE]/50 transition">
                      <td className="p-3.5 font-bold text-[#946726]">
                        {item.reference || item.id.substring(0, 16)}
                      </td>
                      <td className="p-3.5 font-sans">
                        <strong className="text-[#2A2012] font-mono uppercase">{item.sourceBankId}</strong>
                        <span className="text-[#74777F] mx-2 font-mono">→</span>
                        <strong className="text-[#2A2012] font-mono uppercase">{item.destinationBankId}</strong>
                      </td>
                      <td className="p-3.5 text-right font-bold text-[#2A2012]">
                        <CentralBankMaskedValue
                          value={`${formatMinorToArth(item.amountMinor)} ARTH`}
                        />
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStageColor(
                            item.stage,
                          )}`}
                        >
                          {item.stage}
                        </span>
                      </td>
                      <td className="p-3.5 text-right text-[#74777F] text-[11px]">
                        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
