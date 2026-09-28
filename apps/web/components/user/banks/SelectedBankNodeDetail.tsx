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
  Coins, 
  TrendingUp, 
  Lock, 
  Zap, 
  ArrowRight,
  PlusCircle,
  Clock
} from 'lucide-react';
import { AnimatedProgressBar } from '../AnimatedProgressBar';
import { BankAccountDto } from '@arthax/types';

interface SelectedBankNodeDetailProps {
  selectedBank: string;
  selectedAccount: string;
  onSelectAccount: (accountId: string) => void;
  isMasked: boolean;
  onInspectLedger: (accountId: string) => void;
  accounts?: BankAccountDto[];
  onOpenAccountModal?: (bankId: string) => void;
}

interface BankCharterDetail {
  id: string;
  name: string;
  isoCode: string;
  tagline: string;
  emptyDescription: string;
  badge: string;
  badgeColor: string;
  perk: string;
  routingCode: string;
}

const BANK_CHARTERS: Record<string, BankCharterDetail> = {
  nava: {
    id: 'nava',
    name: 'NAVA Bank',
    isoCode: '#NAVA',
    tagline: 'Primary Payroll Settlement Partner • Central Clearing Direct Enclave • Tier-1 Statutory Reserve',
    emptyDescription: 'NAVA Bank hosts primary sovereign salary inflows and master daily operating rails. Open a NAVA account to establish direct payroll settlement.',
    badge: 'Master Rail',
    badgeColor: 'bg-[#A8F5BF]/70 text-[#002110]',
    perk: 'Direct Sovereign Rail',
    routingCode: 'CLS-NAVA-IN-01',
  },
  samaya: {
    id: 'samaya',
    name: 'SAMAYA Bank',
    isoCode: '#SAMY',
    tagline: 'Wealth Term Reserve • Central Bank Liquidity Compounder • Tier-1 Yield Custodian',
    emptyDescription: 'SAMAYA Bank offers sovereign term wealth deposits earning compounding yield at 6.85% APY with statutory central backing.',
    badge: '6.85% APY',
    badgeColor: 'bg-[#FFDDB6] text-[#2A1800]',
    perk: 'Compounding Term Yield',
    routingCode: 'CLS-SAMAYA-YD-01',
  },
  setu: {
    id: 'setu',
    name: 'SETU Bank',
    isoCode: '#SETU',
    tagline: 'Cross-Border Gateway • Delivery-versus-Payment Rail • Gross Inter-Bank Settlement Enclave',
    emptyDescription: 'SETU Bank operates specialized Delivery-versus-Payment (DvP) rails and cross-border transit liquidity clearing.',
    badge: 'DvP Rail',
    badgeColor: 'bg-[#DBE1FF] text-[#031847]',
    perk: 'Inter-Bank DvP Clearing',
    routingCode: 'CLS-SETU-DVP-01',
  },
  sthira: {
    id: 'sthira',
    name: 'STHIRA Bank',
    isoCode: '#STHR',
    tagline: 'Sovereign Custody • Multi-Sig Escrow Vault • FIPS 140-3 L4 HSM Cold Storage Enclave',
    emptyDescription: 'STHIRA Bank safeguards high-value reserves in cold multi-signature escrow vaults designed for sovereign asset preservation.',
    badge: 'HSM Vault',
    badgeColor: 'bg-[#DFE9FA] text-[#121C28]',
    perk: 'Cold Multisig Custody',
    routingCode: 'CLS-STHIRA-VLT-01',
  },
  vayu: {
    id: 'vayu',
    name: 'VAYU Bank',
    isoCode: '#VAYU',
    tagline: 'High-Frequency Rail • Sub-second Micro-Settlements • Contactless POS Routing Enclave',
    emptyDescription: 'VAYU Bank enables zero-delay micro-transfers and instant POS settlements with automated liquidity sweep protocols.',
    badge: 'High Freq',
    badgeColor: 'bg-[#E0E2EC] text-[#43474E]',
    perk: 'Sub-Second Micro Rail',
    routingCode: 'CLS-VAYU-INST-01',
  },
};

export const SelectedBankNodeDetail: React.FC<SelectedBankNodeDetailProps> = ({
  selectedBank,
  selectedAccount,
  onSelectAccount,
  isMasked,
  onInspectLedger,
  accounts = [],
  onOpenAccountModal,
}) => {
  const currentBank = BANK_CHARTERS[selectedBank.toLowerCase()] || BANK_CHARTERS.nava;

  const bankAccounts = accounts.filter(
    (a) => a.bankId?.toLowerCase() === selectedBank.toLowerCase(),
  );

  const otherAccounts = accounts.filter(
    (a) => a.bankId?.toLowerCase() !== selectedBank.toLowerCase(),
  );

  const unlinkedBanks = Object.values(BANK_CHARTERS).filter(
    (b) => b.id !== selectedBank.toLowerCase() && !accounts.some((a) => a.bankId?.toLowerCase() === b.id),
  );

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
                {currentBank.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-mono text-[10px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                Chartered Sovereign Node
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#DBE1FF] text-[#031847] font-mono text-[10px] font-semibold">
                ISO 20022 {currentBank.isoCode}
              </span>
            </div>
            <span className="font-sans text-xs text-[#43474E] mt-1">
              {currentBank.tagline}
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
              {bankAccounts.length} Managed Ledger{bankAccounts.length === 1 ? '' : 's'}
            </span>
          </div>
          {bankAccounts.length > 0 && (
            <button 
              type="button"
              onClick={() => onOpenAccountModal?.(selectedBank)}
              className="text-[#1E3A5F] font-sans text-xs font-semibold hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Open Another Account</span>
            </button>
          )}
        </div>

        {/* Dynamic accounts or empty state */}
        {bankAccounts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-dashed border-[#74777F]/30 text-center flex flex-col items-center justify-center gap-4 py-12 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] border border-[#74777F]/20 flex items-center justify-center text-[#1E3A5F]">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="max-w-md">
              <h4 className="font-serif text-lg font-bold text-[#022448]">
                No Operating Account at {currentBank.name} Yet
              </h4>
              <p className="font-sans text-xs text-[#43474E] mt-1.5 leading-relaxed">
                {currentBank.emptyDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenAccountModal?.(selectedBank)}
              className="mt-2 px-6 py-2.5 rounded-full bg-[#022448] text-white hover:bg-[#1E3A5F] font-sans text-xs font-semibold transition shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#A8742A]" />
              <span>Open {currentBank.name} Account</span>
            </button>
          </div>
        ) : (
          bankAccounts.map((acct) => {
            const balanceArth = (Number(BigInt(acct.balanceMinor || '0')) / 100).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            const isSelected = selectedAccount === acct.accountNumber;

            return (
              <div 
                key={acct.id}
                onClick={() => onSelectAccount(acct.accountNumber)}
                className={`bg-white rounded-2xl p-6 shadow-xs transition-all duration-200 cursor-pointer border ${
                  isSelected
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
                          {currentBank.name} {acct.type === 'SAVINGS' ? 'Treasury Savings' : 'Operational Clearing'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-mono text-[10px] font-semibold">
                          {acct.type}
                        </span>
                        <span className="font-mono text-xs text-[#74777F]">
                          #{acct.accountNumber}
                        </span>
                      </div>
                      <span className="font-sans text-xs text-[#43474E] mt-1">
                        {acct.purpose || currentBank.perk} • Automated Sovereign Settlement Linked
                      </span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right shrink-0">
                    <div className="font-mono text-[11px] text-[#74777F] uppercase tracking-wider">
                      Available Balance
                    </div>
                    <div className="font-serif text-2xl font-bold text-[#022448] tracking-tight">
                      {isMasked ? '••••••••' : balanceArth}{' '}
                      <span className="font-sans text-xs font-semibold text-[#A8742A]">ARTH</span>
                    </div>
                    <span className="font-mono text-xs text-[#74777F]">
                      Locked Reserve: {isMasked ? '••••••' : '0.00'} ARTH
                    </span>
                  </div>
                </div>

                {/* Outflow Gauge & Details */}
                <div className="bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-mono text-xs text-[#43474E] mb-1.5">
                      <span>Daily Sovereign Outflow Limit</span>
                      <span className="font-semibold text-[#121C28]">
                        {isMasked ? '••••' : '0.00'} / {isMasked ? '•••••' : '50,000.00'} ARTH (0% Utilized)
                      </span>
                    </div>
                    <div className="py-0.5">
                      <AnimatedProgressBar value={0} variant="primary" height="md" title="Outflow Limit: 0% Utilized" />
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
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Routing: {currentBank.routingCode}
                    </span>
                    <span className="hidden sm:inline text-[#74777F]">
                      • Real-Time CLS Double-Entry Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectLedger(acct.accountNumber);
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#121C28] font-sans text-xs font-semibold transition border border-[#74777F]/20 cursor-pointer"
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
            );
          })
        )}
      </div>

      {/* Secondary Multi-Bank Charters Section */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#022448]">
              {otherAccounts.length > 0 ? 'Other Sovereign Bank Accounts' : 'Available Chartered Institutions to Connect'}
            </h3>
            <p className="font-sans text-xs text-[#74777F]">
              {otherAccounts.length > 0 
                ? 'Accounts provisioned under other institutional clearing nodes'
                : 'Connect additional chartered banking nodes based on your financial purpose'}
            </p>
          </div>
          <span className="font-mono text-xs text-[#74777F]">
            {otherAccounts.length > 0 ? `${otherAccounts.length} Active Across Other Nodes` : `${unlinkedBanks.length} Nodes Available`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherAccounts.length > 0 ? (
            otherAccounts.map((acct) => {
              const bMeta = BANK_CHARTERS[acct.bankId?.toLowerCase()] || BANK_CHARTERS.nava;
              const bBal = (Number(BigInt(acct.balanceMinor || '0')) / 100).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

              return (
                <div 
                  key={acct.id}
                  className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-serif text-sm font-bold text-[#121C28]">
                            {bMeta.name}
                          </div>
                          <div className="font-mono text-xs text-[#74777F]">#{acct.accountNumber}</div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${bMeta.badgeColor}`}>
                        {bMeta.badge}
                      </span>
                    </div>

                    <div className="my-3">
                      <div className="font-mono text-xs text-[#74777F]">{acct.purpose || bMeta.perk}</div>
                      <div className="font-serif text-xl font-bold text-[#022448] mt-0.5">
                        {isMasked ? '••••••••' : bBal}{' '}
                        <span className="font-sans text-xs text-[#A8742A]">ARTH</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#74777F]/15 font-sans text-xs">
                    <span className="text-[#43474E]">{bMeta.perk}</span>
                    <button 
                      type="button" 
                      onClick={() => onInspectLedger(acct.accountNumber)}
                      className="text-[#1E3A5F] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            unlinkedBanks.map((bank) => (
              <div 
                key={bank.id}
                className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 hover:border-[#1E3A5F]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-serif text-sm font-bold text-[#121C28]">
                          {bank.name}
                        </div>
                        <div className="font-mono text-xs text-[#74777F]">{bank.isoCode}</div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${bank.badgeColor}`}>
                      {bank.badge}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="font-sans text-xs text-[#43474E] leading-relaxed">
                      {bank.perk}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#74777F]/15 font-sans text-xs">
                  <span className="text-[#74777F]">Ready to Connect</span>
                  <button 
                    type="button" 
                    onClick={() => onOpenAccountModal?.(bank.id)}
                    className="text-[#1E3A5F] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Connect Node</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
