'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Building2,
  Lock,
  Landmark,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  MOCK_BANK_CONFIG,
  CENTRAL_BANK_POLICY,
  formatArth,
} from '@/components/bank/BankMockData';

export default function BankSettingsPage() {
  const [config, setConfig] = useState(MOCK_BANK_CONFIG);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess('Bank configuration updated and synchronized with Master Ledger.');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Bank Configuration &amp; Policy</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Operational limits, fee schedules, institutional security, and sovereign mandates
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Bank Operational Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Operational Limits Card */}
            <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3B3278]/8 pb-3">
                <Building2 className="w-4 h-4 text-[#3B3278]" />
                <h2 className="text-sm font-bold text-[#1C1736]">Transaction &amp; Deposit Limits</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Default Daily Transfer Ceiling (ARTH)</label>
                  <input
                    type="number"
                    value={config.defaultDailyLimit}
                    onChange={(e) =>
                      setConfig({ ...config, defaultDailyLimit: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                  <span className="text-[11px] text-[#74777F]">Default limit applied to new customer accounts</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Default Monthly Transfer Ceiling (ARTH)</label>
                  <input
                    type="number"
                    value={config.defaultMonthlyLimit}
                    onChange={(e) =>
                      setConfig({ ...config, defaultMonthlyLimit: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                  <span className="text-[11px] text-[#74777F]">Cumulative monthly regulatory volume cap</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Minimum Savings Balance (ARTH)</label>
                  <input
                    type="number"
                    value={config.minSavingsBalance}
                    onChange={(e) =>
                      setConfig({ ...config, minSavingsBalance: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Minimum Current Balance (ARTH)</label>
                  <input
                    type="number"
                    value={config.minCurrentBalance}
                    onChange={(e) =>
                      setConfig({ ...config, minCurrentBalance: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                </div>
              </div>
            </div>

            {/* Fee Schedule Card */}
            <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3B3278]/8 pb-3">
                <Settings className="w-4 h-4 text-[#3B3278]" />
                <h2 className="text-sm font-bold text-[#1C1736]">Institutional Fee Schedule</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Internal Transfer Fee (ARTH)</label>
                  <input
                    type="number"
                    value={config.transferFeeInternal}
                    onChange={(e) =>
                      setConfig({ ...config, transferFeeInternal: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Inter-Bank CLS Fee (ARTH)</label>
                  <input
                    type="number"
                    value={config.transferFeeInterBank}
                    onChange={(e) =>
                      setConfig({ ...config, transferFeeInterBank: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Loan Underwriting Fee (ARTH)</label>
                  <input
                    type="number"
                    value={config.loanProcessingFee}
                    onChange={(e) =>
                      setConfig({ ...config, loanProcessingFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">FD Premature Liquidation Penalty (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.fdPrematureWithdrawalPenalty}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        fdPrematureWithdrawalPenalty: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                </div>
              </div>
            </div>

            {/* Security & Access Controls */}
            <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3B3278]/8 pb-3">
                <Lock className="w-4 h-4 text-[#3B3278]" />
                <h2 className="text-sm font-bold text-[#1C1736]">Portal Security &amp; Session Isolation</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Inactivity Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={config.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setConfig({ ...config, sessionTimeoutMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1C1736]">Financial Password Min Length</label>
                  <input
                    type="number"
                    value={config.passwordPolicyMinLength}
                    onChange={(e) =>
                      setConfig({ ...config, passwordPolicyMinLength: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#3B3278]/15 font-mono font-bold text-[#1C1736] outline-none focus:border-[#3B3278]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3B3278] text-white hover:bg-[#2D2654] text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Bank Parameters</span>
              </button>
            </div>
          </div>

          {/* Column 3: Central Bank Policy (Read-Only Mandate) */}
          <div className="space-y-4">
            <div className="bg-[#FAFAFF] rounded-2xl border-2 border-[#3B3278]/15 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3B3278]/10 pb-3">
                <Landmark className="w-4 h-4 text-[#3B3278]" />
                <div>
                  <h2 className="text-sm font-bold text-[#1C1736]">Central Bank Policy</h2>
                  <span className="text-[10px] text-[#74777F] uppercase tracking-wider font-mono">
                    Sovereign Mandate (Read-Only)
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[#74777F]">Reserve Requirement:</span>
                  <strong className="text-emerald-700 font-bold">
                    {CENTRAL_BANK_POLICY.reserveRequirement}%
                  </strong>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[#74777F]">Base Interest Rate:</span>
                  <strong className="text-[#3B3278] font-bold">
                    {CENTRAL_BANK_POLICY.baseInterestRate}%
                  </strong>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[#74777F]">Max LTV Ratio:</span>
                  <strong className="text-[#1C1736] font-bold">
                    {CENTRAL_BANK_POLICY.maxLoanToValueRatio}%
                  </strong>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[#74777F]">Transaction Tax:</span>
                  <strong className="text-[#A8742A] font-bold">
                    {CENTRAL_BANK_POLICY.transactionTaxRate}%
                  </strong>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[#74777F]">Settlement Engine:</span>
                  <strong className="text-[#1C1736] text-[11px] font-bold">
                    {CENTRAL_BANK_POLICY.interBankSettlementWindow}
                  </strong>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-[#74777F]">Reporting Schedule:</span>
                  <strong className="text-[#1C1736] font-bold">
                    {CENTRAL_BANK_POLICY.complianceReportingFrequency}
                  </strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Policy updates are dispatched directly by the Central Bank of ARTHAX. Commercial banks must maintain compliant liquidity buffers.
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
