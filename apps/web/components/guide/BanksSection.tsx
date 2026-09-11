'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Building2, ArrowRight } from 'lucide-react';

interface BankProfile {
  id: string;
  name: string;
  tagline: string;
  purpose: string;
  specialty: string;
  charterId: string;
  fdRate: string;
  logo: string;
  description: string;
  badge: string;
}

const COMMERCIAL_BANKS: BankProfile[] = [
  {
    id: 'nava',
    name: 'Nava Bank',
    tagline: 'Digital-First Sovereign Payroll',
    purpose: 'Salary & Daily Corporate Operations',
    specialty: 'Instant batch payroll disbursement, integrated tax withholding, automated monthly dividend accounts.',
    charterId: 'NV-CHARTER-001',
    fdRate: '6.4% APY',
    logo: '/assets/banks/nava_bank.png',
    description: 'The preferred banking partner for state enterprises and high-velocity digital firms across the ARTHAX territory.',
    badge: 'PAYROLL LEADER',
  },
  {
    id: 'samaya',
    name: 'Samaya Bank',
    tagline: 'Generational Wealth & Long-Term Reserves',
    purpose: 'High-Yield Savings & Family Trusts',
    specialty: 'Compound interest term deposits, sovereign gold bonds integration, multi-generational wealth preservation.',
    charterId: 'SM-CHARTER-002',
    fdRate: '7.8% APY',
    logo: '/assets/banks/samaya_bank.png',
    description: 'Conservative capital curation with the highest reserve capitalization ratio in the central republic.',
    badge: 'WEALTH RESERVE',
  },
  {
    id: 'setu',
    name: 'Setu Bank',
    tagline: 'Infrastructure & Trade Clearing',
    purpose: 'Commercial Wholesale & Supply Chains',
    specialty: 'Escrow clearing for heavy industry, capital goods letters of credit, municipal development financing.',
    charterId: 'ST-CHARTER-003',
    fdRate: '6.9% APY',
    logo: '/assets/banks/setu_bank.png',
    description: 'Architecting the physical and logistical infrastructure of the ARTHAX sovereign economic corridor.',
    badge: 'INFRASTRUCTURE',
  },
  {
    id: 'sthira',
    name: 'Sthira Bank',
    tagline: 'Institutional Vault & Secure Custody',
    purpose: 'Corporate Treasuries & Cold Custody',
    specialty: 'Multi-signature corporate vaults, offline reserve attestations, zero-slippage wholesale settlements.',
    charterId: 'SH-CHARTER-004',
    fdRate: '6.2% APY',
    logo: '/assets/banks/sthira_bank.png',
    description: 'The most fortified institutional custodian, safeguarding corporate liquid reserves with zero lending exposure.',
    badge: 'SECURE VAULT',
  },
  {
    id: 'vayu',
    name: 'Vayu Bank',
    tagline: 'High-Frequency Consumer Transit',
    purpose: 'Micro-Spending & Instant Peer-to-Peer',
    specialty: 'Zero-fee P2P transactions, biometric point-of-sale terminal integration, sub-second micro-loan advances.',
    charterId: 'VY-CHARTER-005',
    fdRate: '5.9% APY',
    logo: '/assets/banks/vayu_bank.png',
    description: 'Lightning-fast retail velocity designed for citizen daily commerce and frictionless marketplace checkout.',
    badge: 'FAST CONSUMER',
  },
];

export function BanksSection() {
  const [selectedBank, setSelectedBank] = useState<BankProfile>(COMMERCIAL_BANKS[0]);

  return (
    <section className="py-20 md:py-28 bg-[#F0F4F8] border-b border-[#3368A0]/15 relative" id="banks">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0EBF4] text-[#3368A0] text-xs font-mono font-bold tracking-wider uppercase mb-4 border border-[#3368A0]/15">
            <Building2 className="w-3.5 h-3.5 text-[#3368A0]" />
            <span>SECTION 05 • COMMERCIAL TIER-ONE REGISTRY</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] text-[#022448] font-normal leading-tight tracking-tight">
            Five Licensed Commercial Banks. One Unified Citizen Account.
          </h2>
          <p className="font-body text-base sm:text-lg text-[#5C574F] mt-3.5 leading-relaxed">
            Citizens choose bank accounts based on purpose, not artificial brand segregation. One main session allows
            seamless multi-bank switching without maintaining separate logins.
          </p>
        </div>

        {/* Bank Grid & Detailed Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bank Selection List */}
          <div className="lg:col-span-6 space-y-3.5">
            {COMMERCIAL_BANKS.map((bank) => {
              const isSelected = bank.id === selectedBank.id;
              return (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank)}
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-2 border-[#022448] shadow-md ring-1 ring-[#022448]/20'
                      : 'bg-white/80 border border-[#3368A0]/15 hover:border-[#3368A0]/35 hover:bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="h-11 w-18 sm:h-12 sm:w-20 relative flex-shrink-0 bg-[#F0ECE1]/90 rounded-xl p-1.5 border border-[#3368A0]/10 flex items-center justify-center">
                      <Image
                        src={bank.logo}
                        alt={`${bank.name} logo`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base sm:text-lg font-bold text-[#022448]">{bank.name}</span>
                        <span className="text-[9px] font-mono font-bold text-[#A8742A] bg-[#F6EDE0] border border-[#A8742A]/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
                          {bank.badge}
                        </span>
                      </div>
                      <span className="text-xs text-[#5C574F] font-body block mt-0.5">{bank.purpose}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[9px] font-mono text-[#5C574F]/70 block uppercase tracking-wider">TERM YIELD</span>
                    <span className="text-sm font-mono font-bold text-emerald-700">{bank.fdRate}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Bank Details Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#3368A0]/15 shadow-sm p-7 sm:p-9">
            <div className="flex items-center justify-between pb-6 border-b border-[#3368A0]/10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-24 sm:w-28 relative bg-[#F0ECE1]/90 rounded-xl p-2 border border-[#3368A0]/10 flex items-center justify-center shrink-0">
                  <Image
                    src={selectedBank.logo}
                    alt={`${selectedBank.name} logo`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#022448]">{selectedBank.name}</h3>
                  <span className="font-mono text-xs text-[#5C574F] tracking-wider uppercase">{selectedBank.charterId}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#5C574F]/70 block uppercase tracking-wider">REGULATORY STATUS</span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300/40 px-3 py-1 rounded-full inline-block mt-1 tracking-wider">
                  CHARTERED
                </span>
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#5C574F] uppercase tracking-wider block mb-2">
                  CORE FOCUS & MANDATE
                </span>
                <p className="text-sm text-[#262320]/80 leading-relaxed font-body">{selectedBank.description}</p>
              </div>

              <div className="p-5 bg-[#F0ECE1]/80 rounded-2xl border border-[#3368A0]/10 space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-[#5C574F] uppercase tracking-wider block">
                  PRIMARY PRODUCTS & FEATURES
                </span>
                <p className="text-xs sm:text-sm text-[#262320]/80 leading-relaxed font-body">{selectedBank.specialty}</p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 bg-[#F8F9FF] rounded-xl border border-[#3368A0]/10">
                  <span className="text-[10px] font-mono text-[#5C574F]/70 block uppercase tracking-wider">PURPOSE CATEGORY</span>
                  <span className="text-xs font-bold text-[#022448] block mt-0.5">{selectedBank.purpose}</span>
                </div>
                <div className="p-3.5 bg-[#F8F9FF] rounded-xl border border-[#3368A0]/10">
                  <span className="text-[10px] font-mono text-[#5C574F]/70 block uppercase tracking-wider">FIXED DEPOSIT RATE</span>
                  <span className="text-xs font-mono font-bold text-emerald-700 block mt-0.5">{selectedBank.fdRate}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#5C574F] border-t border-[#3368A0]/10">
                <span className="font-mono text-[11px]">Central Bank Supervised • Double-Entry Backed</span>
                <a
                  href="/user"
                  className="font-semibold text-[#022448] hover:text-[#3368A0] flex items-center gap-1.5 group transition-colors"
                >
                  <span>Open Account in User Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#A8742A]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BanksSection;
