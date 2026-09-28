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
    question: 'What is ARTH currency?',
    answer: 'ARTH is the standard currency used for all bank balances, stock trading, and shop purchases. Everything on the platform is priced in ARTH, so you never have to convert to secondary tokens or points.',
    category: 'CURRENCY'
  },
  {
    id: 'dual-password',
    question: 'Why are there two separate passwords?',
    answer: 'To keep your money completely safe. Your Government Password is used for everyday sign-in, browsing dashboards, and viewing messages. Your Financial Password is required only when you authorize an outgoing transfer, trade stocks, or buy shop items.',
    category: 'SECURITY'
  },
  {
    id: 'cls-settlement',
    question: 'How fast do transfers settle between banks?',
    answer: 'Transfers settle instantly. When you send money to another account or across partner banks, the sender and recipient balances update together immediately with no multi-day waiting periods.',
    category: 'TRANSFERS'
  },
  {
    id: 'unified-identity',
    question: 'Can I use multiple banks with one account?',
    answer: 'Yes. With your single account login, you can open and manage accounts across all 5 licensed partner banks (Nava, Samaya, Setu, Sthira, and Vayu) without creating separate usernames or passwords.',
    category: 'ACCOUNTS'
  },
  {
    id: 'double-entry-ledger',
    question: 'How does the platform ensure balance accuracy?',
    answer: 'Every financial transfer is recorded in balance: the amount deducted from the sender exactly equals the amount added to the recipient. No money can be created or lost in transit.',
    category: 'RELIABILITY'
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
          <span>HELP &amp; FAQS</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="font-body text-sm text-[#262320]/70 mt-2">
          Clear answers about how accounts, security, and payments work.
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
                className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-semibold text-[#A8742A] tracking-wider uppercase">
                    {faq.category}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-medium text-[#022448]">
                    {faq.question}
                  </h3>
                </div>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen ? 'bg-[#022448] text-white rotate-180' : 'bg-[#F2EFE7] text-[#022448]'
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

export default FaqSection;
