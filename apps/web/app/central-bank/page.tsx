'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  MOCK_CENTRAL_BANK_STATS,
  MOCK_COMMERCIAL_BANKS,
  MOCK_CLS_QUEUE,
  MOCK_AUDIT_LOGS,
  DEMO_POLICY_NOTICE,
  CommercialBankRecord,
} from '@/components/central-bank/CentralBankMockData';
import { CentralBankMaskedValue } from '@/components/central-bank/CentralBankMaskedValue';

export default function CentralBankOverviewPage() {
  const stats = MOCK_CENTRAL_BANK_STATS;
  const recentAlerts = MOCK_AUDIT_LOGS.slice(0, 4);
  const [selectedBankForAudit, setSelectedBankForAudit] = useState<CommercialBankRecord | null>(null);

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
              [PROVISIONAL DEMO BENCHMARKS]
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
          <Link
            href="/central-bank/settlement"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#946726] text-white hover:bg-[#2A2012] text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live CLS Engine</span>
          </Link>
          <Link
            href="/central-bank/banks"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#946726]/25 text-[#946726] hover:bg-[#946726]/8 text-xs font-bold transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank Registry (5)</span>
          </Link>
        </div>
      </div>

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
              <CentralBankMaskedValue
                value={stats.totalCirculation}
                suffix=" ARTH"
              />
            </div>
            <div className="text-[10px] text-[#A8742A] font-mono mt-1 font-semibold">
              {stats.totalCirculationNote}
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
              <CentralBankMaskedValue
                value={stats.totalCommercialDeposits}
                suffix=" ARTH"
              />
            </div>
            <div className="text-[10px] text-[#5C574F] font-mono mt-1">
              Across 5 Licensed Institutions
            </div>
          </div>
        </div>

        {/* Daily Inter-Bank Volume */}
        <div className="bg-white p-5 rounded-2xl border border-[#946726]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C574F] text-xs font-medium">
            <span>24h Inter-Bank CLS Volume</span>
            <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-emerald-800">
              <CentralBankMaskedValue
                value={stats.interbankSettlementVolume}
                suffix=" ARTH"
              />
            </div>
            <div className="text-[10px] text-emerald-700 font-mono mt-1">
              99.98% First-Pass Real-Time Netting
            </div>
          </div>
        </div>

        {/* Total Sovereign Tax Levied */}
        <div className="bg-white p-5 rounded-2xl border border-[#946726]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C574F] text-xs font-medium">
            <span>Total Sovereign Tax YTD</span>
            <Receipt className="w-4 h-4 text-[#946726]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-[#2A2012]">
              <CentralBankMaskedValue
                value={stats.totalTaxCollectedYTD}
                suffix=" ARTH"
              />
            </div>
            <div className="text-[10px] text-[#5C574F] font-mono mt-1">
              Settlement Fees + Stock Capital Gains
            </div>
          </div>
        </div>

      </div>

      {/* 3. Secondary Pulse Indicators (4 Compact Strips) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777F] uppercase block">Active Banks</span>
            <strong className="text-[#2A2012] text-sm">5 / 5 Operational</strong>
          </div>
          <Building2 className="w-4 h-4 text-[#946726]" />
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777F] uppercase block">Citizen Accounts</span>
            <strong className="text-[#2A2012] text-sm">{stats.totalRegisteredAccounts.toLocaleString('en-US')}</strong>
          </div>
          <Users className="w-4 h-4 text-[#946726]" />
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777F] uppercase block">Equities Market</span>
            <strong className="text-emerald-700 text-sm">Open • 6 Tickers</strong>
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#946726]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#74777F] uppercase block">Ledger Sync</span>
            <strong className="text-emerald-700 text-sm">99.999% Invariant</strong>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* 4. Main Two-Column Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Five Commercial Banks Regulatory Status */}
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
                    <th className="p-3.5">CRR (Demo Min 12%)</th>
                    <th className="p-3.5">SLR (Demo Min 18%)</th>
                    <th className="p-3.5">Total Deposits</th>
                    <th className="p-3.5">SLA Uptime</th>
                    <th className="p-3.5 text-right whitespace-nowrap min-w-[130px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8C7A5]/40 font-sans">
                  {MOCK_COMMERCIAL_BANKS.map((bank) => (
                    <tr key={bank.id} className="hover:bg-[#FAF7EE]/60 transition">
                      <td className="p-3.5 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-white border border-[#D8C7A5] p-0.5 shrink-0 flex items-center justify-center">
                          <Image
                            src={bank.logo}
                            alt={bank.shortName}
                            width={22}
                            height={22}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <strong className="font-serif font-bold text-[#2A2012] block">
                            {bank.shortName}
                          </strong>
                          <span className="font-mono text-[9px] text-[#74777F]">
                            {bank.licenseNumber}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          {bank.status}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono">
                        <span
                          className={`font-bold ${
                            bank.crrRatio < 12.0 ? 'text-[#B5482E]' : 'text-[#2A2012]'
                          }`}
                        >
                          {bank.crrRatio.toFixed(1)}%
                        </span>
                      </td>

                      <td className="p-3.5 font-mono">
                        <span
                          className={`font-bold ${
                            bank.slrRatio < 18.0 ? 'text-[#B5482E]' : 'text-[#2A2012]'
                          }`}
                        >
                          {bank.slrRatio.toFixed(1)}%
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[#2A2012]">
                        <CentralBankMaskedValue
                          value={bank.totalDeposits}
                          suffix=" ARTH"
                        />
                      </td>

                      <td className="p-3.5 font-mono text-emerald-700">
                        {bank.slaUptime30d.toFixed(2)}%
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedBankForAudit(bank)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] shadow-2xs hover:shadow-xs transition-all duration-150 font-mono text-[11px] font-bold whitespace-nowrap group cursor-pointer active:scale-95"
                          title={`Inspect statutory audit dossier for ${bank.shortName}`}
                        >
                          <FileText className="w-3.5 h-3.5 text-[#946726] group-hover:text-white transition-colors shrink-0" />
                          <span className="whitespace-nowrap">Audit File</span>
                          <ChevronRight className="w-3 h-3 text-[#946726]/60 group-hover:text-white/90 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
                All 5 commercial banking institutions meet Tier-1 statutory liquidity standards. STHIRA buffer stabilized after temporary intra-hour settlement replenishment.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Live Settlement Feed & Recent Regulatory Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-[#2A2012] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#946726]" />
              <span>Recent Critical Events</span>
            </h2>
            <Link
              href="/central-bank/audit"
              className="text-xs font-mono font-bold text-[#946726] hover:underline"
            >
              Full Audit Log
            </Link>
          </div>

          {/* Event Stream */}
          <div className="space-y-2.5">
            {recentAlerts.map((log) => {
              const isCrit = log.severity === 'CRITICAL';
              const isWarn = log.severity === 'WARNING';
              return (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-2xl border transition-all text-xs bg-white ${
                    isCrit
                      ? 'border-[#B5482E]/30 shadow-xs'
                      : isWarn
                      ? 'border-amber-300 shadow-xs'
                      : 'border-[#946726]/15'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#74777F] mb-1">
                    <span className="font-bold text-[#946726]">{log.eventType}</span>
                    <span>{log.timestamp.split(' ')[1]}</span>
                  </div>

                  <p className="font-sans text-xs text-[#262320] leading-snug font-medium">
                    {log.action}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#74777F] mt-2 pt-2 border-t border-gray-100">
                    <span>Actor: <strong className="text-[#2A2012]">{log.actorId}</strong></span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        isCrit
                          ? 'bg-red-100 text-[#B5482E]'
                          : isWarn
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Hub Navigation Cards */}
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
                <span className="text-[10px] text-[#74777F]">v2.4.0 Active</span>
              </Link>
              <Link
                href="/central-bank/tax-investment"
                className="p-2.5 bg-white rounded-xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition text-center block"
              >
                <span className="block text-[#2A2012] font-bold">Tax Policies</span>
                <span className="text-[10px] text-[#74777F]">15% Realized</span>
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
                <span className="text-[10px] text-[#74777F]">12 Categories</span>
              </Link>
            </div>
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
            {/* Gilded Sovereign Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-[#946726] via-[#B88B38] to-[#7A5217] text-white border-b border-[#F5E1B2]/30 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-sm border border-[#F5E1B2] flex items-center justify-center shrink-0">
                  <Image
                    src={selectedBankForAudit.logo}
                    alt={selectedBankForAudit.name}
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
                      {selectedBankForAudit.licenseNumber}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white mt-0.5">
                    {selectedBankForAudit.name}
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

            {/* Modal Body (Scrollable with Sovereign Light Gold Scrollbar) */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto font-sans text-xs bg-[#FAF7EE] central-bank-scrollbar">
              
              {/* Compliance Status Banner */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                selectedBankForAudit.reserveCompliance === 'Compliant'
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/90 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 shrink-0 ${
                    selectedBankForAudit.reserveCompliance === 'Compliant' ? 'text-emerald-700' : 'text-amber-700'
                  }`} />
                  <div>
                    <span className="font-bold block text-xs">
                      Supervisory Standing: {selectedBankForAudit.reserveCompliance}
                    </span>
                    <span className="text-[11px] opacity-80">
                      Last Statutory Examination: {selectedBankForAudit.lastExamDate}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                  selectedBankForAudit.reserveCompliance === 'Compliant'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {selectedBankForAudit.status}
                </span>
              </div>

              {/* Prudential Reserve Metrics Grid */}
              <div className="p-4 bg-white rounded-2xl border border-[#D8C7A5] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                    Prudential Ratios &amp; Statutory Buffers
                  </h4>
                  <span className="text-[10px] text-[#946726] font-mono font-semibold">
                    Tier-1 Statutory Standard
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#D8C7A5]">
                    <span className="text-[9px] uppercase text-[#615749] block">Cash Reserve (CRR)</span>
                    <strong className={`text-base font-bold block mt-0.5 ${
                      selectedBankForAudit.crrRatio < 12.0 ? 'text-[#B5482E]' : 'text-[#2A2012]'
                    }`}>
                      {selectedBankForAudit.crrRatio.toFixed(1)}%
                    </strong>
                    <span className="text-[9px] text-[#946726] font-semibold block">Min 12.0%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#D8C7A5]">
                    <span className="text-[9px] uppercase text-[#615749] block">Statutory Liq. (SLR)</span>
                    <strong className={`text-base font-bold block mt-0.5 ${
                      selectedBankForAudit.slrRatio < 18.0 ? 'text-[#B5482E]' : 'text-[#2A2012]'
                    }`}>
                      {selectedBankForAudit.slrRatio.toFixed(1)}%
                    </strong>
                    <span className="text-[9px] text-[#946726] font-semibold block">Min 18.0%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#D8C7A5]">
                    <span className="text-[9px] uppercase text-[#615749] block">Capital Adequacy (CAR)</span>
                    <strong className="text-base font-bold text-[#2A2012] block mt-0.5">
                      {selectedBankForAudit.carRatio.toFixed(1)}%
                    </strong>
                    <span className="text-[9px] text-emerald-700 font-semibold block">Min 14.0%</span>
                  </div>
                </div>
              </div>

              {/* Core Ledger Volume & Operational Integrity */}
              <div className="p-4 bg-white rounded-2xl border border-[#D8C7A5] space-y-2.5 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                  Ledger Volume &amp; Operations
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#D8C7A5]">
                    <span className="text-[9px] font-mono uppercase text-[#615749] block">Deposits</span>
                    <span className="text-xs font-mono font-bold text-[#2A2012] block mt-0.5">
                      <CentralBankMaskedValue value={selectedBankForAudit.totalDeposits} suffix=" ARTH" />
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#D8C7A5]">
                    <span className="text-[9px] font-mono uppercase text-[#615749] block">Daily Volume</span>
                    <span className="text-xs font-mono font-bold text-[#2A2012] block mt-0.5">
                      <CentralBankMaskedValue value={selectedBankForAudit.dailyTxVolume} suffix=" ARTH" />
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#D8C7A5]">
                    <span className="text-[9px] font-mono uppercase text-[#615749] block">30d SLA Uptime</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 block mt-0.5">
                      {selectedBankForAudit.slaUptime30d.toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#D8C7A5]">
                    <span className="text-[9px] font-mono uppercase text-[#615749] block">Failed Tx (24h)</span>
                    <span className="text-xs font-mono font-bold text-[#2A2012] block mt-0.5">
                      {selectedBankForAudit.failedTxRate24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Ownership & Authority */}
              <div className="p-4 bg-white rounded-2xl border border-[#D8C7A5] space-y-2 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                  Ownership &amp; Authority
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#615749] block">
                      Governing Director
                    </span>
                    <strong className="text-[#2A2012] font-semibold">
                      {selectedBankForAudit.governingDirector}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#615749] block">
                      Charter Date
                    </span>
                    <strong className="text-[#2A2012] font-mono">
                      {selectedBankForAudit.establishedDate}
                    </strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-mono uppercase text-[#615749] block">
                      Beneficial Ownership
                    </span>
                    <span className="text-[#2A2012]">
                      {selectedBankForAudit.ownership}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Audit Findings / Flags if any */}
              {selectedBankForAudit.recentAuditFlag && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="font-semibold block text-amber-900">
                      Supervisory Audit Notice:
                    </strong>
                    {selectedBankForAudit.recentAuditFlag}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-[#D8C7A5] flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/central-bank/banks"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#946726] hover:underline"
              >
                <span>Open Full Registry Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedBankForAudit(null)}
                className="px-4 py-2 rounded-full bg-[#946726] hover:bg-[#7A5217] text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                Close Audit File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
