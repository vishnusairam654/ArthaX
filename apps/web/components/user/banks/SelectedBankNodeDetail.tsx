'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  Download, 
  MoreVertical, 
  ArrowUpDown, 
  Send, 
  Eye,
  TrendingUp,
  Coins,
  Shield,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';
import { AnimatedProgressBar } from '../AnimatedProgressBar';

interface SelectedBankNodeDetailProps {
  selectedBank: string;
  selectedAccount: string;
  onSelectAccount: (accountId: string) => void;
  isMasked: boolean;
  onInspectLedger: (accountId: string) => void;
}

export const SelectedBankNodeDetail: React.FC<SelectedBankNodeDetailProps> = ({
  selectedBank,
  selectedAccount,
  onSelectAccount,
  isMasked,
  onInspectLedger,
}) => {
  return (
    <div className="xl:col-span-8 flex flex-col gap-6">
      {/* Primary Charter Identity Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#74777F]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] border border-[#74777F]/20 flex items-center justify-center p-2 shadow-inner shrink-0">
            <Building2 className="w-8 h-8 text-[#1E3A5F]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-2xl font-bold text-[#022448] tracking-tight">
                {selectedBank === 'nava' && 'NAVA Bank'}
                {selectedBank === 'samaya' && 'SAMAYA Bank'}
                {selectedBank === 'setu' && 'SETU Bank'}
                {selectedBank === 'sthira' && 'STHIRA Bank'}
                {selectedBank === 'vayu' && 'VAYU Bank'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-mono text-[10px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                Chartered Sovereign Node
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#DBE1FF] text-[#031847] font-mono text-[10px] font-semibold">
                ISO 20022 #{selectedBank.toUpperCase()}
              </span>
            </div>
            <span className="font-sans text-xs text-[#43474E] mt-1">
              Primary Payroll Settlement Partner • Central Clearing Direct Enclave • Tier-1 Statutory Reserve
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button 
            type="button"
            className="px-3 py-1.5 rounded-full bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#121C28] font-sans text-xs font-medium border border-[#74777F]/20 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-[#1E3A5F]" /> Settings
          </button>
          <button 
            type="button"
            className="px-3 py-1.5 rounded-full bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#121C28] font-sans text-xs font-medium border border-[#74777F]/20 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#1E3A5F]" /> Tax Proof
          </button>
          <button 
            type="button"
            className="p-1.5 rounded-full hover:bg-[#EEF4FF] text-[#74777F] transition"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account List Under Selected Bank */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-[#022448]">
              Active Operating Accounts
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E5EFFF] text-[#121C28] font-mono text-xs">
              2 Managed Ledgers
            </span>
          </div>
          <button 
            type="button"
            className="text-[#1E3A5F] font-sans text-xs font-semibold hover:underline flex items-center gap-1"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by Balance</span>
          </button>
        </div>

        {/* Account Card 1: Sovereign Payroll */}
        <div 
          onClick={() => onSelectAccount('ARTH-9021-001')}
          className={`bg-white rounded-2xl p-6 shadow-xs transition-all duration-200 cursor-pointer border ${
            selectedAccount === 'ARTH-9021-001'
              ? 'border-[#022448] ring-2 ring-[#022448]/20'
              : 'border-[#74777F]/20 hover:border-[#1E3A5F]/40'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#A8F5BF]/60 text-[#002110] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <Coins className="w-6 h-6 text-[#10B981]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-base font-bold text-[#121C28]">
                    NAVA Sovereign Payroll
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-mono text-[10px] font-semibold">
                    Salary &amp; Direct Inflow
                  </span>
                  <span className="font-mono text-xs text-[#74777F]">
                    #ARTH-9021-001
                  </span>
                </div>
                <span className="font-sans text-xs text-[#43474E] mt-1">
                  Primary governmental deposit vault • Automated Sovereign Provident Reserve linked
                </span>
              </div>
            </div>

            <div className="text-left lg:text-right shrink-0">
              <div className="font-mono text-[11px] text-[#74777F] uppercase tracking-wider">
                Available Balance
              </div>
              <div className="font-serif text-2xl font-bold text-[#022448] tracking-tight">
                {isMasked ? '••••••••' : '142,500.00'}{' '}
                <span className="font-sans text-xs font-semibold text-[#A8742A]">ARTH</span>
              </div>
              <span className="font-mono text-xs text-[#74777F]">
                Locked Reserve: {isMasked ? '••••••' : '5,000.00'} ARTH
              </span>
            </div>
          </div>

          {/* Outflow Gauge & Details */}
          <div className="bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between font-mono text-xs text-[#43474E] mb-1.5">
                <span>Daily Sovereign Outflow Limit</span>
                <span className="font-semibold text-[#121C28]">
                  {isMasked ? '••••' : '9,000.00'} / {isMasked ? '•••••' : '50,000.00'} ARTH (18% Utilized)
                </span>
              </div>
              <div className="py-0.5">
                <AnimatedProgressBar value={18} variant="primary" height="md" title="Outflow Limit: 18% Utilized" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#10B981] font-mono text-xs whitespace-nowrap">
              <ShieldCheck className="w-4 h-4" />
              <span>CLS Sub-Second Finality</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 font-mono text-xs text-[#43474E]">
              <span className="flex items-center gap-1 text-[#10B981] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Routing: CLS-NAVA-IN-01
              </span>
              <span className="hidden sm:inline text-[#74777F]">
                • Last Inflow: +45,000 ARTH (Yesterday)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectLedger('ARTH-9021-001');
                }}
                className="px-4 py-1.5 rounded-full bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#121C28] font-sans text-xs font-semibold transition border border-[#74777F]/20"
              >
                Inspect Ledger
              </button>
              <Link 
                href="/user#transfer-terminal"
                className="px-4 py-1.5 rounded-full bg-[#022448] text-white hover:bg-[#1E3A5F] font-sans text-xs font-semibold transition flex items-center gap-1 shadow-2xs"
              >
                <Send className="w-3 h-3" />
                <span>Transfer Out</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Account Card 2: Daily Operational Float */}
        <div 
          onClick={() => onSelectAccount('ARTH-9021-002')}
          className={`bg-white rounded-2xl p-6 shadow-xs transition-all duration-200 cursor-pointer border ${
            selectedAccount === 'ARTH-9021-002'
              ? 'border-[#022448] ring-2 ring-[#022448]/20'
              : 'border-[#74777F]/20 hover:border-[#1E3A5F]/40'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#DBE1FF] text-[#031847] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <Zap className="w-6 h-6 text-[#1E3A5F]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-base font-bold text-[#121C28]">
                    NAVA Daily Operational Float
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DBE1FF] text-[#031847] font-mono text-[10px] font-semibold">
                    Daily Spending &amp; Merchant Rail
                  </span>
                  <span className="font-mono text-xs text-[#74777F]">
                    #ARTH-9021-002
                  </span>
                </div>
                <span className="font-sans text-xs text-[#43474E] mt-1">
                  POS &amp; Micro-Settlement pool • Real-time cryptographic tap clearance enabled
                </span>
              </div>
            </div>

            <div className="text-left lg:text-right shrink-0">
              <div className="font-mono text-[11px] text-[#74777F] uppercase tracking-wider">
                Available Balance
              </div>
              <div className="font-serif text-2xl font-bold text-[#022448] tracking-tight">
                {isMasked ? '••••••••' : '37,920.00'}{' '}
                <span className="font-sans text-xs font-semibold text-[#A8742A]">ARTH</span>
              </div>
              <span className="font-mono text-xs text-[#74777F]">
                Unsettled Float: 0.00 ARTH
              </span>
            </div>
          </div>

          {/* Outflow Gauge & Details */}
          <div className="bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between font-mono text-xs text-[#43474E] mb-1.5">
                <span>Daily Merchant Outflow Limit</span>
                <span className="font-semibold text-[#121C28]">
                  {isMasked ? '••••' : '1,450.00'} / {isMasked ? '•••••' : '10,000.00'} ARTH (14.5% Utilized)
                </span>
              </div>
              <div className="py-0.5">
                <AnimatedProgressBar value={14.5} variant="secondary" height="md" title="Outflow Limit: 14.5% Utilized" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#43474E] font-mono text-xs whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Contactless Auth Ready</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 font-mono text-xs text-[#43474E]">
              <span className="flex items-center gap-1 text-[#10B981] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Routing: CLS-NAVA-MER-02
              </span>
              <span className="hidden sm:inline text-[#74777F]">
                • 14 transactions cleared today
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onInspectLedger('ARTH-9021-002');
                }}
                className="px-4 py-1.5 rounded-full bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#121C28] font-sans text-xs font-semibold transition border border-[#74777F]/20"
              >
                Inspect Ledger
              </button>
              <Link 
                href="/user#transfer-terminal"
                className="px-4 py-1.5 rounded-full bg-[#022448] text-white hover:bg-[#1E3A5F] font-sans text-xs font-semibold transition flex items-center gap-1 shadow-2xs"
              >
                <Send className="w-3 h-3" />
                <span>Transfer Out</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Multi-Bank Charters Grid (The other 4 accounts) */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#022448]">
              Other Sovereign Bank Accounts
            </h3>
            <p className="font-sans text-xs text-[#74777F]">
              Accounts hosted under secondary institutional clearing nodes
            </p>
          </div>
          <span className="font-mono text-xs text-[#74777F]">
            4 Active Across 4 Nodes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SAMAYA Account */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFDDB6] text-[#2A1800] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#A8742A]" />
                  </div>
                  <div>
                    <div className="font-serif text-sm font-bold text-[#121C28]">
                      SAMAYA Sovereign Treasury
                    </div>
                    <div className="font-mono text-xs text-[#74777F]">#ARTH-4412-001</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFDDB6] text-[#2A1800] font-mono text-[10px] font-bold">
                  6.85% APY
                </span>
              </div>

              <div className="my-3">
                <div className="font-mono text-xs text-[#74777F]">Compounding Term Reserve</div>
                <div className="font-serif text-xl font-bold text-[#022448] mt-0.5">
                  {isMasked ? '••••••••' : '82,100.00'}{' '}
                  <span className="font-sans text-xs text-[#A8742A]">ARTH</span>
                </div>
                <div className="font-mono text-xs text-[#10B981] mt-1 font-medium">
                  +465.12 ARTH accruing this cycle
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#74777F]/15 font-sans text-xs">
              <span className="text-[#43474E]">Lock Tier: 90-Day Sovereign</span>
              <button 
                type="button" 
                onClick={() => onInspectLedger('ARTH-4412-001')}
                className="text-[#1E3A5F] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Manage Yield</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SETU Account */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#DBE1FF] text-[#031847] flex items-center justify-center">
                    <ArrowUpDown className="w-4 h-4 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <div className="font-serif text-sm font-bold text-[#121C28]">
                      SETU Settlement Node
                    </div>
                    <div className="font-mono text-xs text-[#74777F]">#ARTH-8831-001</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DBE1FF] text-[#031847] font-mono text-[10px] font-semibold">
                  DvP Rail
                </span>
              </div>

              <div className="my-3">
                <div className="font-mono text-xs text-[#74777F]">Cross-Institution Transit Clearing</div>
                <div className="font-serif text-xl font-bold text-[#022448] mt-0.5">
                  {isMasked ? '••••••••' : '42,600.00'}{' '}
                  <span className="font-sans text-xs text-[#A8742A]">ARTH</span>
                </div>
                <div className="font-mono text-xs text-[#43474E] mt-1">Direct RTGS Liquidity Line</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#74777F]/15 font-sans text-xs">
              <span className="text-[#43474E]">CLS Gateway Active</span>
              <button 
                type="button" 
                onClick={() => onInspectLedger('ARTH-8831-001')}
                className="text-[#1E3A5F] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Configure DvP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* STHIRA Account */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#DFE9FA] text-[#121C28] flex items-center justify-center">
                    <Lock className="w-4 h-4 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <div className="font-serif text-sm font-bold text-[#121C28]">
                      STHIRA Safe Escrow
                    </div>
                    <div className="font-mono text-xs text-[#74777F]">#ARTH-1190-001</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DFE9FA] text-[#121C28] font-mono text-[10px] font-semibold">
                  HSM Escrow
                </span>
              </div>

              <div className="my-3">
                <div className="font-mono text-xs text-[#74777F]">Long-Term Collateral Custody</div>
                <div className="font-serif text-xl font-bold text-[#022448] mt-0.5">
                  {isMasked ? '••••••••' : '35,000.00'}{' '}
                  <span className="font-sans text-xs text-[#A8742A]">ARTH</span>
                </div>
                <div className="font-mono text-xs text-[#43474E] mt-1">Multisig 2-of-3 Sovereign Enclave</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#74777F]/15 font-sans text-xs">
              <span className="text-[#43474E]">Cold Vault Invariant</span>
              <button 
                type="button" 
                onClick={() => onInspectLedger('ARTH-1190-001')}
                className="text-[#1E3A5F] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Vault Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* VAYU Account */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E0E2EC] text-[#43474E] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#74777F]" />
                  </div>
                  <div>
                    <div className="font-serif text-sm font-bold text-[#121C28]">
                      VAYU Instant Rail
                    </div>
                    <div className="font-mono text-xs text-[#74777F]">#ARTH-7740-001</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E0E2EC] text-[#43474E] font-mono text-[10px]">
                  Standby
                </span>
              </div>

              <div className="my-3">
                <div className="font-mono text-xs text-[#74777F]">Zero-Balance Micro-Payment Router</div>
                <div className="font-serif text-xl font-bold text-[#022448] mt-0.5">
                  0.00 <span className="font-sans text-xs text-[#A8742A]">ARTH</span>
                </div>
                <div className="font-mono text-xs text-[#74777F] mt-1">Auto-Swept on Settlement Inflows</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#74777F]/15 font-sans text-xs">
              <span className="text-[#74777F]">Zero-Float Route</span>
              <button 
                type="button" 
                onClick={() => onInspectLedger('ARTH-7740-001')}
                className="text-[#1E3A5F] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Activate Rail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
