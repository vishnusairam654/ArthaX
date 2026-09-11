'use client';

import React from 'react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';

interface MemberBanksGridProps {
  isMasked: boolean;
  selectedBank: string;
  onSelectBank: (bankId: string) => void;
}

interface MemberBankData {
  id: string;
  name: string;
  code: string;
  tag: string;
  tagColor: string;
  subtitle: string;
  label: string;
  balance: string;
  statusText: string;
  accountCount: string;
  logo: string;
  isPrimary?: boolean;
}

export const memberBanks: MemberBankData[] = [
  {
    id: 'nava',
    name: 'NAVA Bank',
    code: '#001-NAVA',
    tag: 'Primary Node',
    tagColor: 'bg-[#022448] text-white',
    subtitle: 'Master Operating Rail',
    label: 'Available Liquidity',
    balance: '185,420.00',
    statusText: 'CLS Synced',
    accountCount: '2 Accts',
    logo: '/assets/banks/nava_bank.png',
    isPrimary: true,
  },
  {
    id: 'samaya',
    name: 'SAMAYA Bank',
    code: '#002-SAMY',
    tag: '6.85% APY',
    tagColor: 'bg-[#FFDDB6] text-[#2A1800]',
    subtitle: 'Wealth Term Reserve',
    label: 'Term Capital',
    balance: '82,100.00',
    statusText: 'Yield Active',
    accountCount: '1 Acct',
    logo: '/assets/banks/samaya_bank.png',
  },
  {
    id: 'setu',
    name: 'SETU Bank',
    code: '#003-SETU',
    tag: 'DvP Clearing',
    tagColor: 'bg-[#DBE1FF] text-[#031847]',
    subtitle: 'Cross-Border Gateway',
    label: 'Transit Buffer',
    balance: '42,600.00',
    statusText: 'RTGS Standby',
    accountCount: '1 Acct',
    logo: '/assets/banks/setu_bank.png',
  },
  {
    id: 'sthira',
    name: 'STHIRA Bank',
    code: '#004-STHR',
    tag: 'Escrow Vault',
    tagColor: 'bg-[#DFE9FA] text-[#121C28]',
    subtitle: 'Sovereign Custody',
    label: 'Vault Balance',
    balance: '35,000.00',
    statusText: 'HSM Locked',
    accountCount: '1 Acct',
    logo: '/assets/banks/sthira_bank.png',
  },
  {
    id: 'vayu',
    name: 'VAYU Bank',
    code: '#005-VAYU',
    tag: 'High Freq',
    tagColor: 'bg-[#E0E2EC] text-[#43474E]',
    subtitle: 'Instant Micro-Transfers',
    label: 'Standby Float',
    balance: '0.00',
    statusText: 'Zero-Balance',
    accountCount: '1 Acct',
    logo: '/assets/banks/vayu_bank.png',
  },
];

export const MemberBanksGrid: React.FC<MemberBanksGridProps> = ({
  isMasked,
  selectedBank,
  onSelectBank,
}) => {
  return (
    <section className="flex flex-col gap-3 mb-8">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-xs font-semibold text-[#022448] uppercase tracking-wider">
          Connected Member Banks (5 Nodes Active)
        </span>
        <span className="font-sans text-xs text-[#74777F]">
          Click any institution to isolate ledgers &amp; clearing controls
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" id="bank-switcher-container">
        {memberBanks.map((bank) => {
          const isSelected = selectedBank === bank.id;

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
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${bank.tagColor}`}>
                  {bank.tag}
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
                    <AnimatedMaskedValue value={bank.balance} isMasked={isMasked} maskString="••••••••" />{' '}
                    <span className="font-sans text-[10px] font-normal text-[#74777F]">ARTH</span>
                  </div>
                </div>
              </div>

              {/* Bottom Meta */}
              <div className="mt-3 flex items-center justify-between font-mono text-xs text-[#43474E]">
                <span className="flex items-center gap-1.5 text-[#10B981] font-medium text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${bank.id === 'vayu' ? 'bg-[#74777F]' : 'bg-[#10B981]'}`}></span>
                  {bank.statusText}
                </span>
                <span className="text-[#74777F] text-[11px]">{bank.accountCount}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
