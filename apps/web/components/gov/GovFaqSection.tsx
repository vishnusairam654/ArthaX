'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, KeyRound, Building2, UserCheck } from 'lucide-react';

const FAQS = [
  {
    q: 'Why does ARTHAX enforce exactly 1 Email to 1 GOV ID to 1 User?',
    a: 'Under Monetary Treaty 409-C, double-entry ledgers require strict non-repudiation and capital reserve accountability. A 1:1:1 invariant prevents artificial multi-accounting, balance manipulation, and tax obfuscation across commercial banks.',
  },
  {
    q: 'Is my GOV Password used to sign money transfers or stock trades?',
    a: 'No. The GOV Password is an identity authentication credential only. It grants read-only session authorization. All financial movements (transfers, equity orders, fixed deposits) strictly require your separate Financial Password.',
  },
  {
    q: 'What happens after I receive my GOV ID?',
    a: 'Your GOV ID is immediately active on the sovereign registry. You can proceed directly to the User Portal (/user) to open commercial bank accounts with Nava, Samaya, Pravah, Vistara, or Kuber.',
  },
  {
    q: 'Can I change my registered email after GOV ID issuance?',
    a: 'Email modification requires sovereign multi-signature re-attestation through the Central Bank security protocol to protect your double-entry ledger balance from account takeover.',
  },
];

export function GovFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full py-16 sm:py-20 border-t border-[#3368A0]/10 bg-[#F8F9FF] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3368A0]/10 text-[#1E3A5F] text-xs font-mono mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#3368A0]" />
            <span>Institutional Documentation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E3A5F] tracking-tight leading-tight mb-3">
            Frequently Asked Inquiries
          </h2>
          <p className="text-sm text-[#5C574F]">
            Essential operational knowledge regarding ARTHAX Government Identity Authority protocols.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#3368A0]/15 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors hover:bg-[#F2EFE7]/40"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#1E3A5F]">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#3368A0]/10 text-[#3368A0] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#3368A0] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5C574F] leading-relaxed border-t border-[#3368A0]/10 font-sans animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
