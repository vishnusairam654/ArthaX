'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  MOCK_COMMERCIAL_BANKS,
  CommercialBankRecord,
  BankRegulatoryStatus,
  DEMO_POLICY_NOTICE,
} from '@/components/central-bank/CentralBankMockData';
import { CentralBankMaskedValue } from '@/components/central-bank/CentralBankMaskedValue';

export default function BankRegistryPage() {
  const [banks, setBanks] = useState<CommercialBankRecord[]>(MOCK_COMMERCIAL_BANKS);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<CommercialBankRecord | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredBanks = banks.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBankAction = (
    bankId: string,
    newStatus: BankRegulatoryStatus,
    actionLabel: string
  ) => {
    setBanks((prev) =>
      prev.map((b) => (b.id === bankId ? { ...b, status: newStatus } : b))
    );
    if (selectedBank && selectedBank.id === bankId) {
      setSelectedBank({ ...selectedBank, status: newStatus });
    }
    setActionNotice(
      `Bank ${bankId.toUpperCase()} status updated to "${newStatus}" (${actionLabel}). Logged in append-only audit register.`
    );
    setTimeout(() => setActionNotice(null), 4500);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              PRUDENTIAL SUPERVISION
            </span>
            <span className="text-[11px] text-[#A8742A] font-mono font-medium">
              [PROVISIONAL DEMO BENCHMARKS]
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Commercial Bank Registry
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5">
            Licensing, statutory charter maintenance, ownership validation, and operational status enforcement for all five licensed depository institutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            5 Institutions Chartered
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Active', 'Pending', 'Suspended', 'Closed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#946726] text-white shadow-xs'
                  : 'text-[#5C574F] hover:text-[#946726] bg-[#F6F8F7]'
              }`}
            >
              {st === 'all' ? 'All Banks (5)' : st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bank name, short code, license #..."
            className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full md:w-72"
          />
        </div>
      </div>

      {/* Commercial Bank Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanks.map((bank) => {
          const isSuspended = bank.status === 'Suspended';
          const isWatchlist = bank.reserveCompliance === 'Watchlist';

          return (
            <div
              key={bank.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                isSuspended
                  ? 'border-[#B5482E]/40'
                  : isWatchlist
                  ? 'border-amber-300'
                  : 'border-[#946726]/15'
              }`}
            >
              <div className="space-y-4">
                {/* Header Card Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#946726]/15 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Image
                        src={bank.logo}
                        alt={bank.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#2A2012]">
                        {bank.name}
                      </h3>
                      <span className="font-mono text-[10px] text-[#74777F] block">
                        {bank.licenseNumber} • Est. {bank.establishedDate}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      bank.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : bank.status === 'Suspended'
                        ? 'bg-red-100 text-[#B5482E] border-red-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {bank.status}
                  </span>
                </div>

                {/* Key Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                    <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                      Deposits
                    </span>
                    <strong className="text-[#2A2012] text-xs">
                      <CentralBankMaskedValue value={bank.totalDeposits} suffix=" ARTH" />
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                    <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                      24h Volume
                    </span>
                    <strong className="text-[#2A2012] text-xs">
                      <CentralBankMaskedValue value={bank.dailyTxVolume} suffix=" ARTH" />
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                    <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                      CRR / SLR [Demo]
                    </span>
                    <strong className="text-[#2A2012] text-xs">
                      {bank.crrRatio.toFixed(1)}% / {bank.slrRatio.toFixed(1)}%
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                    <span className="text-[9px] uppercase tracking-wider text-[#74777F] block">
                      Accounts / Customers
                    </span>
                    <strong className="text-[#2A2012] text-xs">
                      {bank.accountCount.toLocaleString('en-US')} / {bank.customerCount.toLocaleString('en-US')}
                    </strong>
                  </div>
                </div>

                {/* Warning note if present */}
                {bank.recentAuditFlag && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
                    <strong className="font-semibold block text-amber-800">Prudential Flag:</strong>
                    {bank.recentAuditFlag}
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 mt-4 border-t border-[#946726]/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Dossier</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {bank.status === 'Active' ? (
                    <button
                      type="button"
                      onClick={() => handleBankAction(bank.id, 'Suspended', 'Emergency Supervisory Suspension')}
                      className="px-2 py-1 rounded-lg text-[#B5482E] hover:bg-red-50 border border-red-200 transition font-bold cursor-pointer"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBankAction(bank.id, 'Active', 'Supervisory Reinstatement')}
                      className="px-2 py-1 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition font-bold cursor-pointer"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bank Dossier Inspection Modal */}
      {selectedBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#946726] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                  <Image
                    src={selectedBank.logo}
                    alt={selectedBank.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 block">
                    SOVEREIGN CHARTER FILE: {selectedBank.licenseNumber}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-white">
                    {selectedBank.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBank(null)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 space-y-5 overflow-y-auto font-sans text-xs bg-[#FDFBF7]">
              
              {/* Ownership & Leadership */}
              <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 space-y-2 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                  Ownership &amp; Authority
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#5C574F]">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#74777F] block">
                      Governing Director
                    </span>
                    <strong className="text-[#2A2012] text-xs font-sans">
                      {selectedBank.governingDirector}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#74777F] block">
                      Chartered Since
                    </span>
                    <strong className="text-[#2A2012] text-xs font-mono">
                      {selectedBank.establishedDate}
                    </strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] uppercase font-mono text-[#74777F] block">
                      Beneficial Ownership
                    </span>
                    <strong className="text-[#2A2012] text-xs font-sans">
                      {selectedBank.ownership}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Prudential Metrics */}
              <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                    Prudential Ratios &amp; Reserves
                  </h4>
                  <span className="text-[10px] text-[#A8742A] font-mono">
                    [Provisional Demo Values]
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                    <span className="text-[9px] uppercase text-[#74777F] block">Cash Reserve (CRR)</span>
                    <strong className="text-sm text-[#2A2012] font-bold">{selectedBank.crrRatio}%</strong>
                    <span className="text-[9px] text-emerald-700 block">Min 12.0%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                    <span className="text-[9px] uppercase text-[#74777F] block">Statutory Liquidity (SLR)</span>
                    <strong className="text-sm text-[#2A2012] font-bold">{selectedBank.slrRatio}%</strong>
                    <span className="text-[9px] text-emerald-700 block">Min 18.0%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F6F8F7] border border-[#946726]/10">
                    <span className="text-[9px] uppercase text-[#74777F] block">Capital Adequacy (CAR)</span>
                    <strong className="text-sm text-[#2A2012] font-bold">{selectedBank.carRatio}%</strong>
                    <span className="text-[9px] text-emerald-700 block">Min 14.0%</span>
                  </div>
                </div>
              </div>

              {/* Licensed Products */}
              <div className="p-4 bg-white rounded-2xl border border-[#946726]/15 space-y-2 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                  Approved Sovereign Financial Products
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBank.licensedProducts.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded-lg bg-[#946726]/8 text-[#946726] font-mono text-[11px] font-medium border border-[#946726]/15"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Supervisory Actions Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-[#74777F] font-mono">
                  Last Exam Date: <strong>{selectedBank.lastExamDate}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {selectedBank.status === 'Active' ? (
                    <button
                      type="button"
                      onClick={() => handleBankAction(selectedBank.id, 'Suspended', 'Administrative Halt')}
                      className="px-3.5 py-2 rounded-xl bg-[#B5482E] hover:bg-[#9B3C25] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      Suspend Charter
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBankAction(selectedBank.id, 'Active', 'Administrative Restoration')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      Reactivate Charter
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedBank(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#5C574F] text-xs font-semibold cursor-pointer"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
