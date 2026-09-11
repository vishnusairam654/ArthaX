'use client';

import React from 'react';
import { FileCheck, ShieldCheck, Copy, Check } from 'lucide-react';

interface FdCertificateSpecsProps {
  depositId: string;
}

export const FdCertificateSpecs: React.FC<FdCertificateSpecsProps> = ({ depositId }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#74777F]/20 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#1E3A5F]" />
          <h2 className="font-serif text-xl text-[#022448] font-bold">
            Sovereign Certificate Specifications
          </h2>
        </div>
        <span className="font-mono text-xs text-[#5C574F] bg-[#F2F3FA] px-2.5 py-1 rounded-full border border-[#74777F]/15">
          ISO 20022 CLS Core Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Spec 1 */}
        <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15 space-y-1">
          <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
            Chartered Member Bank
          </span>
          <div className="font-sans font-semibold text-xs text-[#022448]">SAMAYA Sovereign Bank</div>
          <span className="font-mono text-[10px] text-[#74777F] block">
            Member Node #002 • RTGS Settlement Gateway
          </span>
        </div>

        {/* Spec 2 */}
        <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15 space-y-1">
          <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
            Vault Path &amp; Ledger Address
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-[#121C28] truncate">
              arthax.samaya.fd.8491-904-8812
            </span>
            <button
              onClick={() => handleCopy('arthax.samaya.fd.8491-904-8812')}
              className="text-[#1E3A5F] hover:text-[#022448] shrink-0 p-1"
              title="Copy ledger address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#287A55]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="font-mono text-[10px] text-[#74777F] block">
            Direct Ledger Address • Immutable Enclave
          </span>
        </div>

        {/* Spec 3 */}
        <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15 space-y-1">
          <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
            Compounding Frequency
          </span>
          <div className="font-sans font-semibold text-xs text-[#022448]">Daily Accrual / Quarterly Capitalized</div>
          <span className="font-mono text-[10px] text-[#74777F] block">
            Continuous Ledger Settlement at 23:59:59 UTC
          </span>
        </div>

        {/* Spec 4 */}
        <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15 space-y-1">
          <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
            Auto-Renewal Mandate
          </span>
          <div className="font-sans font-semibold text-xs text-[#1E3A5F]">Auto-Roll Principal Only</div>
          <span className="font-sans text-[11px] text-[#5C574F] block">
            Interest swept to NAVA Payroll <strong className="font-mono text-[10px]">#ARTH-9021-001</strong>
          </span>
        </div>

        {/* Spec 5: Indemnity */}
        <div className="bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15 sm:col-span-2 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-[#5C574F] uppercase tracking-wider block">
              Statutory Indemnity &amp; Reserve Backing
            </span>
            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Backed 1:1 by Sovereign Gold Reserves &amp; ISO 20022 Interbank Liquidity Swaps. Fully protected under Section 14-A of the ARTHAX Sovereign Monetary Constitution against default or bail-in events.
            </p>
          </div>
          <ShieldCheck className="w-8 h-8 text-[#287A55] shrink-0 mt-1" />
        </div>
      </div>
    </div>
  );
};
