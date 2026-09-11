'use client';

import React from 'react';
import { ShieldCheck, Send, Building2, UserCheck } from 'lucide-react';
import { CounterpartyInfo } from './MasterTransferTerminal';

interface ClearingCounterpartiesPanelProps {
  onSelectCounterparty: (counterparty: CounterpartyInfo) => void;
}

const COUNTERPARTIES: CounterpartyInfo[] = [
  {
    id: 'vikram',
    name: 'Vikram Malhotra',
    govId: '#9102-482-DL',
    node: 'Samaya Wealth Node',
    accountRef: 'arthax.samaya.cls.9102-482-dl.001',
    initials: 'VM',
    isVerified: true
  },
  {
    id: 'nse',
    name: 'NSE Sovereign Custody',
    govId: '#SETU-CUST-8821',
    node: 'SETU Clearing Node',
    accountRef: 'arthax.setu.custody.8821.dvp',
    initials: 'NSE',
    isVerified: true
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    govId: '#7731-902-KA',
    node: 'VAYU Instant Rail',
    accountRef: 'arthax.vayu.cls.7731-902-ka.001',
    initials: 'PN',
    isVerified: true
  },
  {
    id: 'mst',
    name: 'Ministry of Sov Tech',
    govId: '#MST-GOV-991',
    node: 'Tax & Mandatory Node',
    accountRef: 'arthax.gov.sovdvp.991',
    initials: 'MST',
    isVerified: true
  }
];

export const ClearingCounterpartiesPanel: React.FC<ClearingCounterpartiesPanelProps> = ({
  onSelectCounterparty
}) => {
  return (
    <div className="bg-white border border-[#74777F]/20 p-5 sm:p-6 rounded-3xl shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#A8742A]" />
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#022448]">
            Clearing Counterparties
          </h2>
        </div>
        <span className="font-mono text-xs text-[#74777F] px-2.5 py-0.5 rounded-full bg-[#F8F9FF] border border-[#74777F]/15">
          4 Nodes Verified
        </span>
      </div>

      <p className="font-sans text-xs text-[#43474E]">
        Direct cryptographic trust channels established under Sovereign Domestic Clearing Protocol.
      </p>

      <div className="space-y-2 pt-1">
        {COUNTERPARTIES.map((cp) => (
          <div
            key={cp.id}
            className="p-3 bg-[#F8F9FF] hover:bg-[#EEF4FF] border border-[#74777F]/15 hover:border-[#1E3A5F]/30 transition-colors rounded-2xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-xs">
                {cp.initials}
              </div>
              <div className="min-w-0">
                <div className="font-sans text-xs font-semibold text-[#022448] truncate">
                  {cp.name}
                </div>
                <div className="font-mono text-[10px] text-[#74777F] truncate">
                  {cp.node}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectCounterparty(cp)}
              className="px-3 py-1 bg-white hover:bg-[#022448] text-[#022448] hover:text-white border border-[#74777F]/25 rounded-full font-mono text-xs font-semibold transition-colors shrink-0 shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
