'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'arth-currency',
    question: 'What is ARTH and how is its sovereign purchasing power guaranteed?',
    answer: 'ARTH is the sovereign currency of the ARTHAX economic zone, accounted strictly in integer minor units (1 ARTH = 100 cent-units) with zero floating-point drift. It is underpinned by a 104.2% multi-collateral reserve framework consisting of physical sovereign bullion (54%), sovereign treasury gilts (38.2%), and cash settlement liquidity (7.8%), audited continuously every 400ms.',
    category: 'MONETARY POLICY'
  },
  {
    id: 'dual-password',
    question: 'Why does ARTHAX enforce two separate passwords for every citizen?',
    answer: 'To mathematically eradicate session-hijacking risk. The Government Password authenticates your sovereign identity, profile attestations, and read-only telemetry. The Financial PIN/Key is required strictly at the moment of balance decrement, limit order placement, or vault withdrawal, executed via single-shot ephemeral signatures with 0ms memory persistence.',
    category: 'SECURITY'
  },
  {
    id: 'cls-settlement',
    question: 'How does Continuous Linked Settlement (CLS) eliminate settlement lag?',
    answer: 'Traditional banking relies on batch clearinghouses and fragmented nostro/vostro accounts taking T+2 business days. ARTHAX CLS operates an atomic DvP (Delivery-versus-Payment) engine where debtor and creditor commercial banks post synchronized balance commitments into Central Bank settlement buffers simultaneously, achieving finality in 400ms with zero counterparty risk.',
    category: 'SETTLEMENT ENGINE'
  },
  {
    id: 'unified-identity',
    question: 'How does the unified identity chain connect to multiple commercial banks?',
    answer: 'Under the Treaty 409-C architectural specification, the invariant is: 1 Email → 1 GOV ID → 1 ARTHAX User → Many Bank Accounts. Citizens maintain a single unified credential that seamlessly bridges Nava Bank, Samaya Bank, Setu Bank, Sthira Bank, and Vayu Bank without separate fragmented logins or repetitive KYC cycles.',
    category: 'CITIZEN ACCESS'
  },
  {
    id: 'double-entry-ledger',
    question: 'How is mathematical balance integrity verified across all five banks?',
    answer: 'Every financial event produces a balanced Journal Entry where the sum of debits strictly equals the sum of credits (Σ Debits = Σ Credits). Any transaction attempting to create or destroy currency outside of apex Central Bank monetary expansion is rejected at the protocol level with zero delta tolerance.',
    category: 'CORE INVARIANTS'
  }
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('arth-currency');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 lg:px-8 py-20 border-t border-[#3368A0]/15" id="faq">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 border border-[#A8742A]/30 text-[#A8742A] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#A8742A]" />
          <span>ARCHITECTURAL INQUIRY</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#3368A0] font-normal tracking-tight">
          Frequently Answered Architectural Questions
        </h2>
        <p className="font-body text-sm text-[#262320]/70 mt-2">
          Transparent explanations of ARTHAX sovereign invariants, consensus finality, and citizen protection covenants.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'border-[#3368A0] shadow-md ring-1 ring-[#3368A0]/20' 
                  : 'border-[#3368A0]/15 hover:border-[#3368A0]/30 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-semibold text-[#A8742A] tracking-wider uppercase">
                    {faq.category}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-medium text-[#3368A0]">
                    {faq.question}
                  </h3>
                </div>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen ? 'bg-[#3368A0] text-white rotate-180' : 'bg-[#F2EFE7] text-[#3368A0]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden px-6 ${
                  isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                }`}
              >
                <div className="pt-2 border-t border-[#3368A0]/10 font-body text-xs sm:text-sm text-[#262320]/80 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
