'use client';

import React from 'react';
import Image from 'next/image';
import { RefreshCw, Plus, CheckCircle2, Link2 } from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';

interface ConnectedBanksSectionProps {
  isMasked: boolean;
  selectedBank: string;
  onSelectBank: (bankId: string) => void;
}

interface BankItem {
  id: string;
  name: string;
  code: string;
  tag: string;
  tagColor: string;
  purpose: string;
  balance: string;
  meta: string;
  isPrimary?: boolean;
  logo: string;
}

const banks: BankItem[] = [
  {
    id: 'nava',
    name: 'NAVA Bank',
    code: '#001-NAVA',
    tag: 'Primary Node',
    tagColor: 'bg-[#A8F5BF]/80 text-[#002110]',
    purpose: 'Salary & Operating',
    balance: '185,420.00',
    meta: 'CLS Synced',
    isPrimary: true,
    logo: '/assets/banks/nava_bank.png',
  },
  {
    id: 'samaya',
    name: 'SAMAYA Bank',
    code: '#002-SAMY',
    tag: 'Term Vault',
    tagColor: 'bg-[#DBE1FF] text-[#031847]',
    purpose: 'Wealth & Term High APY',
    balance: '82,100.00',
    meta: '6.85% FD Rate',
    logo: '/assets/banks/samaya_bank.png',
  },
  {
    id: 'setu',
    name: 'SETU Bank',
    code: '#003-SETU',
    tag: 'Cross-Border',
    tagColor: 'bg-[#E5EFFF] text-[#121C28]',
    purpose: 'Inter-Bank Clearing',
    balance: '42,600.00',
    meta: 'FX Ready (ISO 20022)',
    logo: '/assets/banks/setu_bank.png',
  },
  {
    id: 'sthira',
    name: 'STHIRA Bank',
    code: '#004-STHR',
    tag: 'Custody',
    tagColor: 'bg-[#E5EFFF] text-[#121C28]',
    purpose: 'Long-Term Escrow',
    balance: '35,000.00',
    meta: '7.20% APY Tier',
    logo: '/assets/banks/sthira_bank.png',
  },
  {
    id: 'vayu',
    name: 'VAYU Bank',
    code: '#005-VAYU',
    tag: 'Zero Balance',
    tagColor: 'bg-[#E0E2EC] text-[#43474E]',
    purpose: 'Instant Daily Liquidity',
    balance: '0.00',
    meta: 'Link Account',
    logo: '/assets/banks/vayu_bank.png',
  },
];

export const ConnectedBanksSection: React.FC<ConnectedBanksSectionProps> = ({
  isMasked,
  selectedBank,
  onSelectBank,
}) => {
  return (
    <section className="space-y-4" id="banks">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#022448]">
            Connected Banking Nodes
          </h2>
          <span className="px-3 py-1 bg-[#DBE1FF] text-[#031847] rounded-full font-mono text-xs font-semibold">
            5 Institutions Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-[#EEF4FF] hover:bg-[#E5EFFF] text-[#121C28] font-sans text-xs font-medium border border-[#74777F]/20 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1E3A5F]" />
            <span>Switch Active Bank</span>
          </button>
          <button 
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-[#022448] text-white hover:bg-[#1E3A5F] font-sans text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Account by Purpose</span>
          </button>
        </div>
      </div>

      {/* Responsive Bank Grid (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {banks.map((bank) => {
          const isSelected = selectedBank === bank.id;

          return (
            <div
              key={bank.id}
              onClick={() => onSelectBank(bank.id)}
              className={`bg-white rounded-2xl p-5 shadow-xs border transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden cursor-pointer group hover:-translate-y-1 hover:shadow-md ${
                isSelected 
                  ? 'border-[#A8742A] ring-2 ring-[#A8742A]/20' 
                  : 'border-[#74777F]/20 hover:border-[#1E3A5F]/40'
              }`}
            >
              {/* Primary Node Top Indicator Line */}
              {bank.isPrimary && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#022448]"></div>
              )}

              <div className="space-y-2">
                {/* Logo & Status Tag */}
                <div className="flex items-center justify-between">
                  <div className="h-8 w-28 flex items-center">
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      loading="eager"
                      className="h-7 w-auto object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${bank.tagColor}`}>
                    {bank.tag}
                  </span>
                </div>

                {/* Account Details */}
                <div className="pt-2">
                  <p className="font-sans text-xs text-[#43474E]">{bank.purpose}</p>
                  <p className="font-mono text-base font-bold text-[#121C28] mt-0.5 flex items-baseline gap-1">
                    <AnimatedMaskedValue 
                      value={bank.balance} 
                      isMasked={isMasked} 
                      maskString="••••••••" 
                    />{' '}
                    <span className="font-sans text-xs font-normal text-[#43474E]">ARTH</span>
                  </p>
                </div>
              </div>

              {/* Bottom Meta Bar */}
              <div className="pt-2 border-t border-[#74777F]/15 flex items-center justify-between text-xs font-mono text-[#43474E]">
                {bank.id === 'nava' ? (
                  <span className="flex items-center gap-1 text-[#10B981] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {bank.meta}
                  </span>
                ) : bank.id === 'vayu' ? (
                  <button 
                    type="button" 
                    className="text-[#1E3A5F] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {bank.meta}
                  </button>
                ) : (
                  <span>{bank.meta}</span>
                )}
                <span className="text-[#74777F]">{bank.code}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
