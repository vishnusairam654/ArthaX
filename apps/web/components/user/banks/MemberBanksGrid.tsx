'use client';

import React from 'react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';
import { BankAccountDto } from '@arthax/types';

interface MemberBanksGridProps {
  isMasked: boolean;
  selectedBank: string;
  onSelectBank: (bankId: string) => void;
  accounts?: BankAccountDto[];
}

interface MemberBankMeta {
  id: string;
  name: string;
  code: string;
  subtitle: string;
  label: string;
  logo: string;
  isPrimary?: boolean;
}

export const memberBanksMeta: MemberBankMeta[] = [
  {
    id: 'nava',
    name: 'NAVA Bank',
    code: '#001-NAVA',
    subtitle: 'Master Operating Rail',
    label: 'Available Liquidity',
    logo: '/assets/banks/nava_bank.png',
    isPrimary: true,
  },
  {
    id: 'samaya',
    name: 'SAMAYA Bank',
    code: '#002-SAMY',
    subtitle: 'Wealth Term Reserve',
    label: 'Term Capital',
    logo: '/assets/banks/samaya_bank.png',
  },
  {
    id: 'setu',
    name: 'SETU Bank',
    code: '#003-SETU',
    subtitle: 'Cross-Border Gateway',
    label: 'Transit Buffer',
    logo: '/assets/banks/setu_bank.png',
  },
  {
    id: 'sthira',
    name: 'STHIRA Bank',
    code: '#004-STHR',
    subtitle: 'Sovereign Custody',
    label: 'Vault Balance',
    logo: '/assets/banks/sthira_bank.png',
  },
  {
    id: 'vayu',
    name: 'VAYU Bank',
    code: '#005-VAYU',
    subtitle: 'Instant Micro-Transfers',
    label: 'Standby Float',
    logo: '/assets/banks/vayu_bank.png',
  },
];

export const MemberBanksGrid: React.FC<MemberBanksGridProps> = ({
  isMasked,
  selectedBank,
  onSelectBank,
  accounts = [],
}) => {
  const connectedCount = memberBanksMeta.filter((bank) =>
    accounts.some((a) => a.bankId?.toLowerCase() === bank.id.toLowerCase()),
  ).length;

  return (
    <section className="flex flex-col gap-3 mb-8">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-xs font-semibold text-[#022448] uppercase tracking-wider">
          Connected Member Banks ({connectedCount} of 5 Nodes Active)
        </span>
        <span className="font-sans text-xs text-[#74777F]">
          Click any institution to isolate ledgers &amp; clearing controls
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" id="bank-switcher-container">
        {memberBanksMeta.map((bank) => {
          const isSelected = selectedBank === bank.id;
          const bankAccounts = accounts.filter(
            (a) => a.bankId?.toLowerCase() === bank.id.toLowerCase(),
          );
          const isConnected = bankAccounts.length > 0;
          const totalMinor = bankAccounts.reduce(
            (sum, a) => sum + BigInt(a.balanceMinor || '0'),
            0n,
          );
          const balance = (Number(totalMinor) / 100).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const tag = isConnected
            ? bank.isPrimary
              ? 'Primary Node'
              : 'Connected'
            : 'Available';
          const tagColor = isConnected
            ? bank.isPrimary
              ? 'bg-[#022448] text-white'
              : 'bg-[#A8F5BF]/80 text-[#002110]'
            : 'bg-[#E0E2EC] text-[#43474E]';
          const statusText = isConnected ? 'CLS Synced' : 'Not Linked';
          const accountCount = isConnected
            ? `${bankAccounts.length} Acct${bankAccounts.length > 1 ? 's' : ''}`
            : '0 Accts';

          return (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank.id)}
              className={`text-left p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between group hover:shadow-md cursor-pointer ${
                isSelected
                  ? 'bg-white ring-2 ring-[#022448] shadow-md border-transparent'
                  : 'bg-[#F8F9FF] hover:bg-white border border-[#74777F]/20'
              }`}
            >
              {/* Header: Logo & Status Tag */}
              <div className="flex items-start justify-between mb-3">
                <div className="h-8 w-24 flex items-center">
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    loading="eager"
                    className="h-7 w-auto object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${tagColor}`}>
                  {tag}
                </span>
              </div>

              {/* Bank Title & Subtitle */}
              <div>
                <div className={`font-serif text-sm font-bold ${isSelected ? 'text-[#022448]' : 'text-[#121C28]'}`}>
                  {bank.name}
                </div>
                <div className="font-sans text-xs text-[#43474E] truncate">
                  {bank.subtitle}
                </div>

                {/* Balance Wells */}
                <div className="mt-2 pt-2 bg-[#EEF4FF] rounded-xl p-2.5">
                  <div className="font-mono text-[10px] text-[#74777F] uppercase tracking-wider">
                    {bank.label}
                  </div>
                  <div className="font-mono text-sm text-[#121C28] font-bold flex items-baseline gap-1">
                    <AnimatedMaskedValue value={balance} isMasked={isMasked} maskString="••••••••" />{' '}
                    <span className="font-sans text-[10px] font-normal text-[#74777F]">ARTH</span>
                  </div>
                </div>
              </div>

              {/* Bottom Meta */}
              <div className="mt-3 flex items-center justify-between font-mono text-xs text-[#43474E]">
                <span className={`flex items-center gap-1.5 font-medium text-[11px] ${isConnected ? 'text-[#10B981]' : 'text-[#74777F]'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#10B981]' : 'bg-[#74777F]'}`}></span>
                  {statusText}
                </span>
                <span className="text-[#74777F] text-[11px]">{accountCount}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
