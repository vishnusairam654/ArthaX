'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Settings,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  X,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';
import { BankPrudentialMetricsDto } from '@arthax/types';
import { apiFetchBankPrudentialMetrics, subscribePortalDataInvalidation } from '@/lib/api';
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

const BANK_LOGOS: Record<string, string> = {
  nava: '/assets/banks/nava_bank.png',
  samaya: '/assets/banks/samaya_bank.png',
  setu: '/assets/banks/setu_bank.png',
  sthira: '/assets/banks/sthira_bank.png',
  vayu: '/assets/banks/vayu_bank.png',
};

const BANK_LICENSES: Record<string, string> = {
  nava: 'CB-LIC-2024-001',
  samaya: 'CB-LIC-2024-002',
  setu: 'CB-LIC-2024-003',
  sthira: 'CB-LIC-2024-004',
  vayu: 'CB-LIC-2024-005',
};

export default function BankRegistryPage() {
  const [banks, setBanks] = useState<BankPrudentialMetricsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<BankPrudentialMetricsDto | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadBanks = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const data = await apiFetchBankPrudentialMetrics();
      setBanks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load bank prudential metrics:', err);
      setError(err?.message || 'Failed to retrieve commercial bank prudential supervision data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBanks();
    const unsub = subscribePortalDataInvalidation(() => {
      loadBanks(true);
    });
    return unsub;
  }, [loadBanks]);

  const filteredBanks = useMemo(() => {
    return banks.filter((b) => {
      const matchesStatus =
        statusFilter === 'all' ||
        b.complianceStatus?.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        b.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bankId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [banks, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Bank Registry
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5">
            View and manage all licensed banks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadBanks(true)}
            disabled={loading || refreshing}
            className="p-2.5 rounded-xl bg-white border border-[#946726]/20 hover:bg-[#946726]/8 text-[#946726] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Bank Registry"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {banks.length || 5} Banks
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
            onClick={() => loadBanks()}
            className="px-2.5 py-1 rounded-lg bg-[#B5482E] text-white text-[11px] font-bold hover:bg-[#8F3520] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'COMPLIANT', 'DEFICIT'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-[#946726] text-white shadow-xs'
                  : 'text-[#5C574F] hover:text-[#946726] bg-[#F6F8F7]'
              }`}
            >
              {st === 'all' ? `All Banks (${banks.length})` : st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bank name or ID..."
            className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full md:w-72"
          />
        </div>
      </div>

      {/* Commercial Bank Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-[#74777F]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#946726]" />
            <span>Loading...</span>
          </div>
        ) : filteredBanks.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-[#74777F]">
            <Building2 className="w-8 h-8 text-[#946726] mx-auto mb-2 opacity-50" />
            <span className="font-serif font-bold text-sm text-[#2A2012] block">No Banks Found</span>
            <span className="text-xs text-[#5C574F]">No banks match your filter.</span>
          </div>
        ) : (
          filteredBanks.map((bank) => {
            const isCompliant = bank.complianceStatus === 'COMPLIANT';
            const logoUrl = BANK_LOGOS[bank.bankId] || '/assets/banks/nava_bank.png';
            const licenseNo = BANK_LICENSES[bank.bankId] || `CB-LIC-2024-${bank.bankId.toUpperCase()}`;

            return (
              <div
                key={bank.bankId}
                className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Header Card Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#946726]/15 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Image
                          src={logoUrl}
                          alt={bank.bankName}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#2A2012]">
                          {bank.bankName}
                        </h3>
                        <span className="font-mono text-[10px] text-[#74777F] block">
                          {bank.bankId.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        isCompliant
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-red-100 text-[#B5482E] border-red-300'
                      }`}
                    >
                      {bank.complianceStatus}
                    </span>
                  </div>

                  {/* Key Metrics Breakdown */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                      <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                        Deposits (NDTL)
                      </span>
                      <strong className="text-[#2A2012] text-xs">
                        <CentralBankMaskedValue
                          value={`${formatMinorToArth(bank.ndtlMinor)} ARTH`}
                        />
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                      <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                        CRR Maintained
                      </span>
                      <strong className="text-[#2A2012] text-xs">
                        <CentralBankMaskedValue
                          value={`${formatMinorToArth(bank.crrMaintainedMinor)} ARTH`}
                        />
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                      <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                        CRR / SLR Ratios
                      </span>
                      <strong className="text-[#2A2012] text-xs">
                        {(bank.crrRatioPercent ?? 12.0).toFixed(1)}% / {(bank.slrRatioPercent ?? 18.0).toFixed(1)}%
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                      <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                        Capital Adequacy (CAR)
                      </span>
                      <strong className="text-[#2A2012] text-xs">
                        {(bank.carRatioPercent ?? 16.0).toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="pt-4 mt-4 border-t border-[#946726]/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Selected Bank */}
      {selectedBank && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedBank(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl border border-[#D8C7A5] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-br from-[#946726] via-[#B88B38] to-[#7A5217] text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg">{selectedBank.bankName}</h3>
                <span className="text-[11px] font-mono text-[#F5E1B2]">
                  {selectedBank.bankId.toUpperCase()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBank(null)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3 font-mono text-xs bg-[#FAF7EE]">
              <div className="p-3 bg-white rounded-xl border border-[#D8C7A5] flex justify-between">
                <span className="text-[#74777F]">Total Deposits:</span>
                <span className="font-bold text-[#2A2012]">
                  {formatMinorToArth(selectedBank.ndtlMinor)} ARTH
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#D8C7A5] flex justify-between">
                <span className="text-[#74777F]">CRR Required (12%):</span>
                <span className="font-bold text-[#2A2012]">
                  {formatMinorToArth(selectedBank.crrRequiredMinor)} ARTH
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#D8C7A5] flex justify-between">
                <span className="text-[#74777F]">CRR Held:</span>
                <span className="font-bold text-emerald-700">
                  {formatMinorToArth(selectedBank.crrMaintainedMinor)} ARTH
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#D8C7A5] flex justify-between">
                <span className="text-[#74777F]">Surplus / Deficit:</span>
                <span className="font-bold text-emerald-700">
                  {formatMinorToArth((BigInt(selectedBank.crrMaintainedMinor || '0') - BigInt(selectedBank.crrRequiredMinor || '0')).toString())} ARTH
                </span>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-[#D8C7A5] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBank(null)}
                className="px-4 py-2 rounded-xl bg-[#946726] text-white text-xs font-bold hover:bg-[#2A2012] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
