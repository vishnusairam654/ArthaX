'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  ArrowRightLeft,
  Scale,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Megaphone,
  FileSpreadsheet,
  Lock,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  BankPrudentialMetricsDto,
} from '@arthax/types';
import {
  apiFetchBankPrudentialMetrics,
  subscribePortalDataInvalidation,
} from '@/lib/api';

const BANK_LOGOS: Record<string, string> = {
  nava: '/assets/banks/nava_bank.png',
  samaya: '/assets/banks/samaya_bank.png',
  setu: '/assets/banks/setu_bank.png',
  sthira: '/assets/banks/sthira_bank.png',
  vayu: '/assets/banks/vayu_bank.png',
};

const BANK_DESCRIPTIONS: Record<string, string> = {
  nava: 'Retail & commercial banking services across citizen accounts.',
  samaya: 'Corporate treasury and high-volume business settlement partner.',
  setu: 'Inter-district branch network and citizen payroll deposits.',
  sthira: 'Long-term savings, fixed deposit schemes, and lending services.',
  vayu: 'Digital-first mobile transfers and instant payment gateway.',
};

export default function CentralBankOverviewPage() {
  const [banks, setBanks] = useState<BankPrudentialMetricsDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankPrudentialMetricsDto | null>(null);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const banksData = await apiFetchBankPrudentialMetrics();
      setBanks(Array.isArray(banksData) ? banksData : []);
    } catch (err: any) {
      console.error('Failed to load central bank data:', err);
      setError(err?.message || 'Failed to connect to central bank service');
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

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div className="space-y-1">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2A2012]">
            Central Bank Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F]">
            How the central bank works and manages the financial system.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={loading || refreshing}
            className="p-2.5 rounded-xl bg-white border border-[#946726]/20 hover:bg-[#946726]/8 text-[#946726] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>System Active</span>
          </div>
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
            className="px-3 py-1 rounded-lg bg-[#B5482E] text-white text-xs font-bold hover:bg-[#8F3520] transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. The 4-Step Process Section */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#2A2012]">
            How the System Works
          </h2>
          <p className="text-xs sm:text-sm text-[#5C574F]">
            The Central Bank runs the network in 4 simple steps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-3xl border border-[#946726]/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#946726]/40 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-[#946726]/10 text-[#946726] font-mono text-[11px] font-bold">
                  Step 1
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FAF7EE] flex items-center justify-center text-[#946726]">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#2A2012]">
                  Supervise Banks
                </h3>
                <p className="text-xs text-[#5C574F] mt-1.5 leading-relaxed">
                  Licenses commercial banks and confirms each bank keeps safe cash reserves to protect citizen deposits.
                </p>
              </div>
            </div>

            <Link
              href="/central-bank/banks"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] text-xs font-bold transition group cursor-pointer"
            >
              <span>View Banks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-3xl border border-[#946726]/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#946726]/40 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-[#946726]/10 text-[#946726] font-mono text-[11px] font-bold">
                  Step 2
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FAF7EE] flex items-center justify-center text-emerald-700">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#2A2012]">
                  Settle Transfers
                </h3>
                <p className="text-xs text-[#5C574F] mt-1.5 leading-relaxed">
                  When money moves between customers at different banks, the Central Bank clears and settles every transfer safely.
                </p>
              </div>
            </div>

            <Link
              href="/central-bank/settlement"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] text-xs font-bold transition group cursor-pointer"
            >
              <span>View Settlements</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-3xl border border-[#946726]/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#946726]/40 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-[#946726]/10 text-[#946726] font-mono text-[11px] font-bold">
                  Step 3
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FAF7EE] flex items-center justify-center text-[#946726]">
                  <Scale className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#2A2012]">
                  Set Rules & Rates
                </h3>
                <p className="text-xs text-[#5C574F] mt-1.5 leading-relaxed">
                  Controls benchmark interest rates, daily transaction limits, and tax rules to keep the financial system stable.
                </p>
              </div>
            </div>

            <Link
              href="/central-bank/financial-rules"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] text-xs font-bold transition group cursor-pointer"
            >
              <span>Manage Rules</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-3xl border border-[#946726]/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#946726]/40 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-[#946726]/10 text-[#946726] font-mono text-[11px] font-bold">
                  Step 4
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FAF7EE] flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#2A2012]">
                  Audit & Protect
                </h3>
                <p className="text-xs text-[#5C574F] mt-1.5 leading-relaxed">
                  Verifies that all money balances, keeps a record of every action, and provides emergency protection controls.
                </p>
              </div>
            </div>

            <Link
              href="/central-bank/audit"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] text-xs font-bold transition group cursor-pointer"
            >
              <span>View Audit Log</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Connected Banks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#2A2012]">
              Connected Banks
            </h2>
            <p className="text-xs sm:text-sm text-[#5C574F]">
              Commercial banks currently connected and operating on the system.
            </p>
          </div>

          <Link
            href="/central-bank/banks"
            className="text-xs font-bold text-[#946726] hover:underline flex items-center gap-1"
          >
            <span>All Banks ({banks.length || 5})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full bg-white p-8 rounded-3xl border border-[#946726]/15 text-center text-[#74777F]">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#946726]" />
              <span>Loading banks...</span>
            </div>
          ) : banks.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-3xl border border-[#946726]/15 text-center text-[#74777F]">
              <Building2 className="w-6 h-6 text-[#946726] mx-auto mb-2 opacity-50" />
              <span>No banks connected.</span>
            </div>
          ) : (
            banks.map((bank) => {
              const logoUrl = BANK_LOGOS[bank.bankId] || '/assets/banks/nava_bank.png';
              const isCompliant = bank.complianceStatus === 'COMPLIANT';
              const description = BANK_DESCRIPTIONS[bank.bankId] || 'Licensed commercial banking institution.';

              return (
                <div
                  key={bank.bankId}
                  className="bg-white p-5 rounded-3xl border border-[#946726]/15 shadow-xs hover:border-[#946726]/40 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#D8C7A5] p-1 flex items-center justify-center shrink-0">
                        <Image
                          src={logoUrl}
                          alt={bank.bankName}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        isCompliant
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-[#B5482E] border border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompliant ? 'bg-emerald-600' : 'bg-[#B5482E]'}`} />
                        <span>{isCompliant ? 'Active' : 'Needs Review'}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-base text-[#2A2012]">
                        {bank.bankName}
                      </h3>
                      <p className="text-xs text-[#5C574F] mt-1 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className="inline-flex items-center justify-between w-full px-4 py-2 rounded-xl bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] text-xs font-bold transition group cursor-pointer"
                  >
                    <span>View Bank</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Common Tasks & Operations */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#2A2012]">
            Other Actions
          </h2>
          <p className="text-xs sm:text-sm text-[#5C574F]">
            Quick access to notices, reports, security, and settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/central-bank/announcements"
            className="p-4 bg-white rounded-2xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition block group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FAF7EE] text-[#946726] flex items-center justify-center mb-2 group-hover:bg-[#946726] group-hover:text-white transition">
              <Megaphone className="w-4 h-4" />
            </div>
            <strong className="block text-sm font-bold text-[#2A2012]">Announcements</strong>
            <span className="text-xs text-[#5C574F] block mt-0.5">Post news and notices to citizens.</span>
          </Link>

          <Link
            href="/central-bank/reports"
            className="p-4 bg-white rounded-2xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition block group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FAF7EE] text-[#946726] flex items-center justify-center mb-2 group-hover:bg-[#946726] group-hover:text-white transition">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <strong className="block text-sm font-bold text-[#2A2012]">Reports</strong>
            <span className="text-xs text-[#5C574F] block mt-0.5">View and download statements.</span>
          </Link>

          <Link
            href="/central-bank/security"
            className="p-4 bg-white rounded-2xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition block group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FAF7EE] text-[#946726] flex items-center justify-center mb-2 group-hover:bg-[#946726] group-hover:text-white transition">
              <Lock className="w-4 h-4" />
            </div>
            <strong className="block text-sm font-bold text-[#2A2012]">Security Controls</strong>
            <span className="text-xs text-[#5C574F] block mt-0.5">Emergency switch and system status.</span>
          </Link>

          <Link
            href="/central-bank/settings"
            className="p-4 bg-white rounded-2xl border border-[#946726]/15 hover:border-[#946726] hover:shadow-xs transition block group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FAF7EE] text-[#946726] flex items-center justify-center mb-2 group-hover:bg-[#946726] group-hover:text-white transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <strong className="block text-sm font-bold text-[#2A2012]">Settings</strong>
            <span className="text-xs text-[#5C574F] block mt-0.5">Manage permissions and passwords.</span>
          </Link>
        </div>
      </div>

      {/* 5. Simple Bank Details Modal */}
      {selectedBank && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedBank(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#D8C7A5] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-[#946726] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                  <Image
                    src={BANK_LOGOS[selectedBank.bankId] || '/assets/banks/nava_bank.png'}
                    alt={selectedBank.bankName}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-bold block">
                    Bank Overview
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {selectedBank.bankName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBank(null)}
                aria-label="Close"
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-sans bg-[#FAF7EE]">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Status: <strong>Active & Connected to Central Network</strong>
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#D8C7A5] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#74777F] block">
                  About this Bank
                </span>
                <p className="text-xs text-[#2A2012] leading-relaxed">
                  {BANK_DESCRIPTIONS[selectedBank.bankId] || 'Licensed commercial banking partner in the network.'}
                </p>
                <p className="text-xs text-[#5C574F] leading-relaxed">
                  This bank safely handles citizen accounts, holds required reserves with the Central Bank, and routes inter-bank payments through the central settlement engine.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/central-bank/banks"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <span>Open Full Bank Registry</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedBank(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-[#5C574F] hover:bg-white text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
