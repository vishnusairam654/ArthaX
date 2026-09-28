'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Coins,
  Building2,
  Users,
  Landmark,
  ArrowRightLeft,
  Activity,
  TrendingUp,
  Receipt,
  AlertOctagon,
  BellRing,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  CentralBankOverviewDto,
  MonetarySupplyDto,
  BankPrudentialMetricsDto,
} from '@arthax/types';
import {
  apiFetchCentralBankOverview,
  apiFetchMonetarySupply,
  apiFetchBankPrudentialMetrics,
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

const BANK_LOGOS: Record<string, string> = {
  nava: '/assets/banks/nava_bank.png',
  samaya: '/assets/banks/samaya_bank.png',
  setu: '/assets/banks/setu_bank.png',
  sthira: '/assets/banks/sthira_bank.png',
  vayu: '/assets/banks/vayu_bank.png',
};

export default function CentralBankOverviewPage() {
  const [overview, setOverview] = useState<CentralBankOverviewDto | null>(null);
  const [monetary, setMonetary] = useState<MonetarySupplyDto | null>(null);
  const [prudentialBanks, setPrudentialBanks] = useState<BankPrudentialMetricsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBankForAudit, setSelectedBankForAudit] = useState<BankPrudentialMetricsDto | null>(null);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const [ovData, monData, banksData] = await Promise.all([
        apiFetchCentralBankOverview(),
        apiFetchMonetarySupply(),
        apiFetchBankPrudentialMetrics(),
      ]);
      setOverview(ovData);
      setMonetary(monData);
      setPrudentialBanks(Array.isArray(banksData) ? banksData : []);
    } catch (err: any) {
      console.error('Failed to load central bank data:', err);
      setError(err?.message || 'Failed to connect to sovereign monetary authority gateway');
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

  // Compute total commercial deposits across banks
  const totalCommercialDepositsMinor = prudentialBanks.reduce(
    (sum, b) => sum + BigInt(b.ndtlMinor || '0'),
    0n,
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Sovereign Authority Badge */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              CENTRAL COMMAND CENTER
            </span>
            <span className="text-[11px] text-[#A8742A] font-mono font-medium">
              [LIVE MONETARY SURVEILLANCE]
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2A2012]">
            Sovereign Monetary Command
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] max-w-2xl leading-relaxed">
            Centralized macroeconomic surveillance, commercial bank prudential oversight, real-time CLS settlement routing, and double-entry ledger audit verification.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={loading || refreshing}
            className="p-2.5 rounded-xl bg-white border border-[#946726]/20 hover:bg-[#946726]/8 text-[#946726] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Central Bank State"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/central-bank/settlement"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#946726] text-white hover:bg-[#2A2012] text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live CLS Engine</span>
          </Link>
          <Link
            href="/central-bank/banks"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#946726]/25 text-[#946726] hover:bg-[#946726]/8 text-xs font-bold transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank Registry ({prudentialBanks.length || 5})</span>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
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

      {/* 2. Key Macroeconomic Metrics Grid (Masked Balances per Rule 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Circulation */}
        <div className="bg-white p-5 rounded-2xl border border-[#946726]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C574F] text-xs font-medium">
            <span>Total ARTH in Circulation</span>
            <Coins className="w-4 h-4 text-[#A8742A]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-[#2A2012]">
              {loading ? '...' : (
                <CentralBankMaskedValue
                  value={formatMinorToArth(monetary?.inCirculationMinor || overview?.m0SupplyMinor)}
                  suffix=" ARTH"
                />
              )}
            </div>
            <div className="text-[10px] text-[#A8742A] font-mono mt-1 font-semibold">
              M0 Base Money Supply
            </div>
          </div>
        </div>

        {/* Commercial Deposits */}
        <div className="bg-white p-5 rounded-2xl border border-[#946726]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C574F] text-xs font-medium">
            <span>Commercial Deposits</span>
            <Landmark className="w-4 h-4 text-[#946726]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-[#2A2012]">
              {loading ? '...' : (
                <CentralBankMaskedValue
                  value={formatMinorToArth(totalCommercialDepositsMinor.toString() || overview?.m1SupplyMinor)}
                  suffix=" ARTH"
                />
              )}
            </div>
            <div className="text-[10px] text-[#5C574F] font-mono mt-1">
              Across {prudentialBanks.length || 5} Licensed Institutions
            </div>
          </div>
        </div>

        {/* Daily Inter-Bank Volume */}
        <div className="bg-white p-5 rounded-2xl border border-[#946726]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C574F] text-xs font-medium">
            <span>CLS Settlement Health</span>
            <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-emerald-800">
              {loading ? '...' : `${(overview?.clsSettlementHealthPercent ?? 99.98).toFixed(2)}%`}
            </div>
            <div className="text-[10px] text-emerald-700 font-mono mt-1">
              Avg Clearing Latency: {overview?.avgClearingLatencyMs ?? 142}ms
            </div>
          </div>
        </div>

        {/* Central Treasury Reserves */}
        <div className="bg-white p-5 rounded-2xl border border-[#946726]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C574F] text-xs font-medium">
            <span>Central Treasury Reserves</span>
            <Receipt className="w-4 h-4 text-[#946726]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-[#2A2012]">
              {loading ? '...' : (
                <CentralBankMaskedValue
                  value={formatMinorToArth(monetary?.centralTreasuryMinor || '1000000000000')}
                  suffix=" ARTH"
                />
              )}
            </div>
            <div className="text-[10px] text-[#5C574F] font-mono mt-1">
              Sovereign Reserves Backing
            </div>
          </div>
        </div>
      </div>

      {/* 3. Secondary Pulse Indicators (4 Compact Strips) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777F] uppercase block">Active Banks</span>
            <strong className="text-[#2A2012] text-sm">
              {prudentialBanks.length || overview?.activeCommercialBanks || 5} / 5 Operational
            </strong>
          </div>
          <Building2 className="w-4 h-4 text-[#946726]" />
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777F] uppercase block">Base Policy Rate</span>
            <strong className="text-[#2A2012] text-sm">
              {(overview?.basePolicyRateApy ?? 4.25).toFixed(2)}% APY
            </strong>
          </div>
          <Activity className="w-4 h-4 text-[#946726]" />
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777F] uppercase block">Statutory CRR</span>
            <strong className="text-emerald-700 text-sm">
              {(overview?.statutoryReserveRatioPercent ?? 12.0).toFixed(1)}% Required
            </strong>
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777F] uppercase block">Ledger Invariant</span>
            <strong className="text-emerald-700 text-sm">
              {overview?.ledgerInvariantSatisfied ? '100% Satisfied' : 'Pending Verification'}
            </strong>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* 4. Main Two-Column Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Commercial Banks Regulatory Status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-[#2A2012] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#946726]" />
              <span>Licensed Commercial Banks Overview</span>
            </h2>
            <Link
              href="/central-bank/banks"
              className="text-xs font-mono font-bold text-[#946726] hover:underline flex items-center gap-1"
            >
              <span>Manage Registry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#D8C7A5] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7EE] border-b border-[#D8C7A5] text-[10px] font-mono uppercase tracking-wider text-[#615749]">
                  <tr>
                    <th className="p-3.5">Commercial Bank</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">CRR Maintained</th>
                    <th className="p-3.5">Total Deposits</th>
                    <th className="p-3.5">Accounts</th>
                    <th className="p-3.5 text-right whitespace-nowrap min-w-[130px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C7A5]/40 font-sans">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#74777F]">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#946726]" />
                        <span>Querying prudential supervisory ledger...</span>
                      </td>
                    </tr>
                  ) : prudentialBanks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#74777F]">
                        <Building2 className="w-6 h-6 text-[#946726] mx-auto mb-2 opacity-50" />
                        <span>No commercial banks returned by regulatory registry.</span>
                      </td>
                    </tr>
                  ) : (
                    prudentialBanks.map((bank) => {
                      const logoUrl = BANK_LOGOS[bank.bankId] || '/assets/banks/nava_bank.png';
                      const isCompliant = bank.complianceStatus === 'COMPLIANT';

                      return (
                        <tr key={bank.bankId} className="hover:bg-[#FAF7EE]/60 transition">
                          <td className="p-3.5 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-white border border-[#D8C7A5] p-0.5 shrink-0 flex items-center justify-center">
                              <Image
                                src={logoUrl}
                                alt={bank.bankName}
                                width={22}
                                height={22}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <strong className="font-serif font-bold text-[#2A2012] block">
                                {bank.bankName}
                              </strong>
                              <span className="font-mono text-[9px] text-[#74777F]">
                                BANK-ID: {bank.bankId.toUpperCase()}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              isCompliant
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-[#B5482E]/10 text-[#B5482E] border border-[#B5482E]/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isCompliant ? 'bg-emerald-600' : 'bg-[#B5482E]'}`} />
                              {bank.complianceStatus}
                            </span>
                          </td>

                          <td className="p-3.5 font-mono">
                            <span className="font-bold text-[#2A2012]">
                              {(bank.crrRatioPercent ?? 12.0).toFixed(1)}%
                            </span>
                          </td>

                          <td className="p-3.5 font-mono text-[#2A2012]">
                            <CentralBankMaskedValue
                              value={`${formatMinorToArth(bank.ndtlMinor)} ARTH`}
                            />
                          </td>

                          <td className="p-3.5 font-mono text-[#2A2012]">
                            {(bank.carRatioPercent ?? 16.0).toFixed(1)}% CAR
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedBankForAudit(bank)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] shadow-2xs hover:shadow-xs transition-all duration-150 font-mono text-[11px] font-bold whitespace-nowrap group cursor-pointer active:scale-95"
                              title={`Inspect statutory audit dossier for ${bank.bankName}`}
                            >
                              <FileText className="w-3.5 h-3.5 text-[#946726] group-hover:text-white transition-colors shrink-0" />
                              <span className="whitespace-nowrap">Audit File</span>
                              <ChevronRight className="w-3 h-3 text-[#946726]/60 group-hover:text-white/90 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Notice on Bank Monitoring */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-serif font-bold">
                Macro-Prudential Health Nominal
              </strong>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                All licensed commercial banking institutions satisfy double-entry statutory reserve mandates. Liquidity ratios are continuously monitored by the sovereign settlement gateway.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Workflows & Hub Nav */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-[#2A2012] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#946726]" />
              <span>Sovereign Operations</span>
            </h2>
            <Link
              href="/central-bank/audit"
              className="text-xs font-mono font-bold text-[#946726] hover:underline"
            >
              Full Audit Log
            </Link>
          </div>

          {/* Regulatory Workflows */}
          <div className="p-4 bg-[#FAF9F6] border border-[#946726]/15 rounded-2xl space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#946726]/70 block">
              REGULATORY WORKFLOWS
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <Link
                href="/central-bank/financial-rules"
                className="p-2.5 bg-white rounded-xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition text-center block"
              >
                <span className="block text-[#2A2012] font-bold">Policy Rules</span>
                <span className="text-[10px] text-[#74777F]">Benchmark APY</span>
              </Link>
              <Link
                href="/central-bank/tax-investment"
                className="p-2.5 bg-white rounded-xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition text-center block"
              >
                <span className="block text-[#2A2012] font-bold">Tax Policies</span>
                <span className="text-[10px] text-[#74777F]">Capital Gains</span>
              </Link>
              <Link
                href="/central-bank/announcements"
                className="p-2.5 bg-white rounded-xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition text-center block"
              >
                <span className="block text-[#2A2012] font-bold">Announce</span>
                <span className="text-[10px] text-[#74777F]">Dispatch Mailbox</span>
              </Link>
              <Link
                href="/central-bank/reports"
                className="p-2.5 bg-white rounded-xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition text-center block"
              >
                <span className="block text-[#2A2012] font-bold">Reports</span>
                <span className="text-[10px] text-[#74777F]">Supervisory</span>
              </Link>
            </div>
          </div>

          {/* Invariant Assurance Plaque */}
          <div className="p-4 bg-white border border-[#D8C7A5] rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <strong className="text-xs text-[#2A2012] font-serif">Double-Entry Assurance</strong>
            </div>
            <p className="text-[11px] text-[#5C574F] leading-relaxed">
              Every journal entry across the sovereign network maintains zero-sum conservation. M0 issuance is restricted to two-man rule authorization.
            </p>
          </div>
        </div>
      </div>

      {/* Sovereign Bank Audit Dossier Modal */}
      {selectedBankForAudit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedBankForAudit(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#D8C7A5] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-[#946726] via-[#B88B38] to-[#7A5217] text-white border-b border-[#F5E1B2]/30 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-sm border border-[#F5E1B2] flex items-center justify-center shrink-0">
                  <Image
                    src={BANK_LOGOS[selectedBankForAudit.bankId] || '/assets/banks/nava_bank.png'}
                    alt={selectedBankForAudit.bankName}
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#F5E1B2] font-bold">
                      STATUTORY AUDIT DOSSIER
                    </span>
                    <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                      {selectedBankForAudit.bankId.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white mt-0.5">
                    {selectedBankForAudit.bankName}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBankForAudit(null)}
                aria-label="Close dossier"
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 active:scale-95 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto font-sans text-xs bg-[#FAF7EE]">
              {/* Compliance Status Banner */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                selectedBankForAudit.complianceStatus === 'COMPLIANT'
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-red-50/90 border-red-200 text-red-900'
              }`}>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block text-xs font-bold">
                      Prudential Status: {selectedBankForAudit.complianceStatus}
                    </strong>
                    <span className="text-[11px] text-[#5C574F]">
                      Statutory Cash Reserve Ratio requirement met under Central Bank supervision.
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#D8C7A5]">
                  <span className="text-[10px] text-[#74777F] uppercase block">Net Demand & Time Liabilities</span>
                  <CentralBankMaskedValue
                    value={`${formatMinorToArth(selectedBankForAudit.ndtlMinor)} ARTH`}
                    valueClassName="font-bold text-[#2A2012] text-sm mt-0.5 block"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D8C7A5]">
                  <span className="text-[10px] text-[#74777F] uppercase block">CRR Maintained</span>
                  <CentralBankMaskedValue
                    value={`${formatMinorToArth(selectedBankForAudit.crrMaintainedMinor)} ARTH`}
                    valueClassName="font-bold text-[#2A2012] text-sm mt-0.5 block"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D8C7A5]">
                  <span className="text-[10px] text-[#74777F] uppercase block">Required CRR</span>
                  <CentralBankMaskedValue
                    value={`${formatMinorToArth(selectedBankForAudit.crrRequiredMinor)} ARTH`}
                    valueClassName="font-bold text-[#2A2012] text-sm mt-0.5 block"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#D8C7A5]">
                  <span className="text-[10px] text-[#74777F] uppercase block">Capital Adequacy Ratio</span>
                  <strong className="font-bold text-[#2A2012] text-sm mt-0.5 block">
                    {(selectedBankForAudit.carRatioPercent ?? 16.0).toFixed(1)}% CAR
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-[#D8C7A5] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBankForAudit(null)}
                className="px-4 py-2 rounded-xl bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] text-xs font-bold transition cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
