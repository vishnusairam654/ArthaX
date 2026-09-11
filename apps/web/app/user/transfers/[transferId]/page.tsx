'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { TransferQuantumHero } from '@/components/user/transfers/details/TransferQuantumHero';
import { LinearSettlementTrack } from '@/components/user/transfers/details/LinearSettlementTrack';
import { LedgerProofMatrix } from '@/components/user/transfers/details/LedgerProofMatrix';
import { AuditPayloadInspector } from '@/components/user/transfers/details/AuditPayloadInspector';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ShieldCheck,
  Cpu,
  Database,
  Landmark,
  ShieldAlert,
} from 'lucide-react';

interface PageProps {
  params?: { transferId?: string };
}

export default function TransferAuditReceiptPage({ params }: PageProps) {
  const routeParams = useParams();
  const rawId = params?.transferId || (routeParams?.transferId as string) || 'TX-CLS-20250524-890124';
  const transferId = Array.isArray(rawId) ? rawId[0] : rawId;
  const [isMasked, setIsMasked] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyHsm = () => {
    setIsVerified(true);
    alert('HSM Merkle Root verified against consensus block #28,102,512. Merkle path: 100% Valid.');
  };

  const handleDownloadReceipt = () => {
    alert('Downloading ISO pacs.008 cryptographic receipt token (.pacs008)...');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] flex flex-col font-sans">
      {/* Sovereign Portal Header */}
      <UserPortalHeader isMasked={isMasked} onToggleMask={() => setIsMasked((prev) => !prev)} />

      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Breadcrumb & Header Action Bar */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-[#74777F]">
              <Link
                href="/user/transfers"
                className="hover:text-[#022448] transition-colors flex items-center gap-1 font-medium"
              >
                <span>Transfers &amp; DvP</span>
              </Link>
              <span>/</span>
              <span>Audit Ledger</span>
              <span>/</span>
              <span className="text-[#022448] font-semibold">
                Tranche #{transferId.toUpperCase()}
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h1 className="font-serif text-2xl md:text-3xl text-[#022448] tracking-tight">
                Tranche Settlement Verification
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8DFDB] text-[#022448] font-mono text-xs font-semibold tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>CLS SETTLED &amp; FINALIZED</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#E5EFFF] font-mono text-[11px] text-[#1E3A5F] tracking-wider uppercase font-semibold">
                ISO-pacs.008
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/user/transfers"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#E5EFFF] text-[#022448] font-sans font-semibold text-xs transition-colors shadow-2xs border border-[#74777F]/15"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Terminal</span>
            </Link>

            <button
              type="button"
              onClick={handleVerifyHsm}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold text-xs transition-all shadow-2xs cursor-pointer ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-[#E5EFFF] hover:bg-[#D9E3F4] text-[#022448] border border-[#74777F]/15'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isVerified ? 'Merkle Root Validated' : 'Verify HSM Merkle Root'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#022448] hover:bg-[#1E3A5F] text-white font-sans font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#F9BB6A]" />
              <span>Receipt (.pacs008)</span>
            </button>
          </div>
        </section>

        {/* 2. Transaction Hero Section */}
        <TransferQuantumHero transferId={transferId} isMasked={isMasked} />

        {/* 3. Chronological 6-Stage Continuous Linear Settlement Track */}
        <LinearSettlementTrack />

        {/* 4. Detailed Ledger & Remittance Specification Matrix */}
        <LedgerProofMatrix isMasked={isMasked} />

        {/* 5. Interactive Verification Terminal / Payload Inspector */}
        <AuditPayloadInspector />
        </div>
      </main>

      {/* Sovereign Multi-Column Institutional Footer */}
      <footer className="w-full bg-[#F2EFE7] mt-16 pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-t border-[#74777F]/20">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[#43474E]">
            <div className="space-y-3">
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#022448]" />
                <span>Ledger Integrity</span>
              </div>
              <p className="font-sans text-xs leading-relaxed text-[#43474E]">
                Directly coupled with SETU Central Settlement. Real-time stasis balancing across tier-1 multi-bank reserves ensuring 1:1 sovereign parity backing.
              </p>
              <div className="font-mono text-[11px] text-[#1E3A5F]">
                STATE ROOT: 0x48A0...9B72
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#022448]" />
                <span>Settlement Protocol</span>
              </div>
              <ul className="font-sans text-xs space-y-1.5 text-[#43474E]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Continuous Linked Settlement (CLS)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  ISO 20022 Financial Messaging
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Delivery vs Payment (DvP) Real-time
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#022448]" />
                <span>Security Architecture</span>
              </div>
              <p className="font-sans text-xs leading-relaxed text-[#43474E]">
                Multi-party computation (MPC) and Hardware Security Module (HSM) FIPS 140-3 Level 4 enclaves secure biometric authorizations and key issuance.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-medium">
                Biometric Enclave: ACTIVE &amp; ARMED
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#022448]" />
                <span>Node Authority</span>
              </div>
              <div className="font-mono text-xs space-y-1 text-[#43474E]">
                <div>ROOT NODE CERT: <strong className="text-[#121C28]">#8491-X</strong></div>
                <div>VALIDATOR SET: 12 SOVEREIGN INSTITUTIONS</div>
                <div>EPOCH FREQUENCY: 300 SECONDS</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#74777F]/15 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-[#74777F]">
            <div>© 2025 ARTHAX Sovereign Financial System. Immutable Archival Depository Ledger.</div>
            <div className="flex items-center gap-2 text-[#022448]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CLS SETTLEMENT ENGINE SYNCED • UTC 14:48:02 • BLOCK HEIGHT 28,102,510</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
