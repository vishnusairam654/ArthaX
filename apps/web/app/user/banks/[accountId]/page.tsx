'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { AccountHeroBanner } from '@/components/user/banks/details/AccountHeroBanner';
import { AccountAnalyticsSidebar } from '@/components/user/banks/details/AccountAnalyticsSidebar';
import { AccountLedgerStream } from '@/components/user/banks/details/AccountLedgerStream';
import { DepositQrDrawer } from '@/components/user/banks/details/DepositQrDrawer';
import { SendTransferModal } from '@/components/user/banks/details/SendTransferModal';
import { Landmark, RotateCw, ShieldCheck, Cpu, Database } from 'lucide-react';

interface PageProps {
  params?: { accountId?: string };
}

export default function AccountDetailPage({ params }: PageProps) {
  const routeParams = useParams();
  const rawId = params?.accountId || (routeParams?.accountId as string) || 'ARTH-9021-001';
  const accountId = Array.isArray(rawId) ? rawId[0] : rawId;
  const [isMasked, setIsMasked] = useState(true);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] flex flex-col font-sans">
      {/* Sovereign Portal Header */}
      <UserPortalHeader isMasked={isMasked} onToggleMask={() => setIsMasked((prev) => !prev)} />

      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-sans text-[#74777F]">
              <Link
                href="/user/banks"
                className="hover:text-[#022448] transition-colors flex items-center gap-1 font-medium"
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>My Banks &amp; Accounts</span>
              </Link>
              <span>/</span>
              <span className="text-[#121C28] font-semibold">NAVA Bank</span>
              <span>/</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E5EFFF] text-[#022448] font-mono text-[11px] font-bold">
                NAVA Sovereign Payroll (#{accountId.toUpperCase()})
              </span>
            </div>

            {/* Live Node & Audit Timestamp */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2EFE7] text-[11px] font-mono text-[#43474E] border border-[#74777F]/15">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Enclave PIN: <strong className="text-[#121C28]">FIPS 140-3 L4</strong></span>
              </div>

              <button
                type="button"
                onClick={handleSync}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#E5EFFF] text-[#022448] font-mono text-xs transition-all shadow-2xs border border-[#74777F]/15 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                <span>CLS Sync 380ms</span>
              </button>
            </div>
          </div>

          {/* Primary Account Hero Banner / Visual Anchor */}
          <AccountHeroBanner
            accountId={accountId}
            isMasked={isMasked}
            onOpenTransfer={() => setIsTransferOpen(true)}
            onOpenQr={() => setIsQrOpen(true)}
          />

          {/* Main Multi-Column Analytics & Ledger Stream Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
            {/* Left Column: Stream Filter Controls & Mini Visual Chart (4 Cols) */}
            <div className="lg:col-span-4">
              <AccountAnalyticsSidebar isMasked={isMasked} />
            </div>

            {/* Right Column: Ledger Stream Table (8 Cols) */}
            <div className="lg:col-span-8">
              <AccountLedgerStream isMasked={isMasked} />
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Drawers */}
      <DepositQrDrawer isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      <SendTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        isMasked={isMasked}
        availableBalance={142500}
      />

      {/* Institutional Multi-Column Footer */}
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
