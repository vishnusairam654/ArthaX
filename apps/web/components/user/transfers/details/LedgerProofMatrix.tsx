'use client';

import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  Copy,
  Check,
  Lock,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface LedgerProofMatrixProps {
  isMasked: boolean;
}

export const LedgerProofMatrix: React.FC<LedgerProofMatrixProps> = ({ isMasked }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedMerkle, setCopiedMerkle] = useState(false);

  const copyText = (text: string, isMerkle: boolean) => {
    navigator.clipboard.writeText(text);
    if (isMerkle) {
      setCopiedMerkle(true);
      setTimeout(() => setCopiedMerkle(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Column 1: Financial & Regulatory Breakdown */}
      <div className="rounded-2xl bg-white border border-[#74777F]/20 p-6 md:p-8 shadow-xs flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#74777F]/15">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#022448]" />
              <h3 className="font-serif font-semibold text-lg text-[#022448] tracking-tight">
                Financial &amp; Regulatory Breakdown
              </h3>
            </div>
            <span className="font-mono text-xs text-[#74777F]">ISO 20022 CLS</span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between py-2 px-1 hover:bg-[#F8F9FF] rounded-lg transition-colors">
              <span className="text-[#43474E]">Base Remittance Quantum</span>
              <span className="font-mono font-semibold text-[#121C28]">
                <AnimatedMaskedValue value="5,000.00" isMasked={isMasked} currency="ARTH" />
              </span>
            </div>

            <div className="flex items-center justify-between py-2 px-1 hover:bg-[#F8F9FF] rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-[#43474E]">Sovereign Resident Charter Fee</span>
                <span className="px-1.5 py-0.5 rounded bg-[#E5EFFF] text-[#022448] font-mono text-[10px] uppercase font-bold">
                  Exempt
                </span>
              </div>
              <span className="font-mono font-semibold text-emerald-700">0.00 ARTH</span>
            </div>

            <div className="flex items-center justify-between py-2 px-1 hover:bg-[#F8F9FF] rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-[#43474E]">Securities Transaction Stamp</span>
                <span className="font-mono text-[10px] text-[#74777F]">(0.01% Statutory)</span>
              </div>
              <span className="font-mono font-semibold text-[#A8742A]">
                <AnimatedMaskedValue value="0.50" isMasked={isMasked} currency="ARTH" />
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 mt-2">
              <span className="font-serif font-bold text-sm text-[#022448]">Net Settled Outflow</span>
              <span className="font-mono text-base font-bold text-[#022448]">
                <AnimatedMaskedValue value="5,000.50" isMasked={isMasked} currency="ARTH" />
              </span>
            </div>
          </div>
        </div>

        {/* Regulatory Specs */}
        <div className="space-y-2 pt-3 bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15 font-sans text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#74777F]">Payment Rail Architecture</span>
            <span className="font-mono text-[#022448] font-semibold">
              ISO 20022 pacs.008.001.08 RTGS
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#74777F]">Settlement Mechanism</span>
            <span className="font-mono text-[#022448] font-medium">
              Atomic DvP (Irrevocable Escrow Lock)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#74777F]">Statutory Compliance Ref</span>
            <span className="font-mono text-[#1E3A5F]">SEBI-RBI-SOV-CIRCULAR-2024/902</span>
          </div>
        </div>
      </div>

      {/* Column 2: Cryptographic Proof & Ledger Architecture */}
      <div className="rounded-2xl bg-white border border-[#74777F]/20 p-6 md:p-8 shadow-xs flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#74777F]/15">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#022448]" />
              <h3 className="font-serif font-semibold text-lg text-[#022448] tracking-tight">
                Cryptographic Proof &amp; Enclave Specs
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Verified Root
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Hash 1 */}
            <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex flex-col gap-1">
              <span className="text-[10px] text-[#74777F] uppercase tracking-wider font-sans font-semibold">
                Ledger Transaction Hash
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[#022448] font-semibold truncate select-all text-xs">
                  tx.cls.20250524.890124.7749b.a9
                </span>
                <button
                  type="button"
                  onClick={() => copyText('tx.cls.20250524.890124.7749b.a9', false)}
                  className="text-[#74777F] hover:text-[#022448] transition-colors p-1 cursor-pointer"
                  title="Copy Hash"
                >
                  {copiedHash ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Hash 2 */}
            <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex flex-col gap-1">
              <span className="text-[10px] text-[#74777F] uppercase tracking-wider font-sans font-semibold">
                Core Merkle Leaf Hash (Block #28,102,512)
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[#022448] font-semibold truncate select-all text-xs">
                  0x4e88c0a1f819972b901a88df32df90a82b99
                </span>
                <button
                  type="button"
                  onClick={() => copyText('0x4e88c0a1f819972b901a88df32df90a82b99', true)}
                  className="text-[#74777F] hover:text-[#022448] transition-colors p-1 cursor-pointer"
                  title="Copy Merkle Hash"
                >
                  {copiedMerkle ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-sans">
              <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex flex-col gap-1">
                <span className="text-[10px] text-[#74777F] uppercase">Enclave Attestation</span>
                <span className="font-serif font-semibold text-xs text-[#022448]">
                  FIPS 140-3 Level 4 HSM
                </span>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Double-Signed
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex flex-col gap-1">
                <span className="text-[10px] text-[#74777F] uppercase">Governing Charter</span>
                <span className="font-serif font-semibold text-xs text-[#022448]">
                  ARTHAX Sovereign Mon. 2024
                </span>
                <span className="text-[11px] text-[#1E3A5F] font-mono">Section 14(a) Finality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Irreversible Block Lock Bar */}
        <div className="bg-[#022448] text-white rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1E3A5F] flex items-center justify-center text-[#F9BB6A]">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-xs leading-tight">
                Irreversible Block Lock
              </span>
              <span className="text-[11px] text-[#C8DFDB] font-mono">
                Dispute Window (60s) Expired • Permanently Sealed
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#C8DFDB] text-[#022448] font-mono text-[10px] font-bold">
            IMMUTABLE
          </span>
        </div>
      </div>
    </section>
  );
};
