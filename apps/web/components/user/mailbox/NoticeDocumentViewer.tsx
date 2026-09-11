'use client';

import React, { useState } from 'react';
import {
  Printer,
  Key,
  Archive,
  CheckCircle2,
  Copy,
  Check,
  FileCheck,
  ShieldCheck,
  Building2,
  Terminal,
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';
import { NotificationDto } from '@arthax/types';

interface NoticeDocumentViewerProps {
  selectedId: string;
  isMasked: boolean;
  activeNotice?: NotificationDto | null;
  onArchive?: (id: string) => void;
}

export const NoticeDocumentViewer: React.FC<NoticeDocumentViewerProps> = ({
  selectedId,
  isMasked,
  activeNotice,
  onArchive,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [isArchived, setIsArchived] = useState(activeNotice?.isArchived ?? false);

  const copyMerkle = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Document Viewer Paper Card */}
      <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xs border border-[#74777F]/20 space-y-6 relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute right-4 top-16 opacity-[0.03] pointer-events-none">
          <svg fill="none" height="320" stroke="currentColor" viewBox="0 0 100 100" width="320">
            <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" strokeDasharray="2 2" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" strokeWidth="0.5" />
            <polygon points="50,10 90,80 10,80" strokeWidth="0.5" />
            <polygon points="50,90 90,20 10,20" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Top Bar Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#74777F]/15">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E5EFFF] text-[#022448] font-mono text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              {activeNotice
                ? activeNotice.templateCode
                : selectedId === 'notice-cbn-2025-04b'
                ? 'DIRECTIVE-CBN-2025-04B'
                : selectedId === 'notice-nava-payroll-4401'
                ? 'STATEMENT-NAVA-NY-4401'
                : selectedId === 'notice-sthira-fd-9941'
                ? 'CERTIFICATE-FD-9941-CONF'
                : selectedId === 'notice-security-sentinel-4'
                ? 'AUDIT-SENTINEL-AUTH-04'
                : 'NOTICE-SETU-DVP-2025-98214'}
            </span>
            <div className="text-xs font-mono text-[#74777F] mt-1">
              Received: {activeNotice ? new Date(activeNotice.createdAt).toUTCString() : 'Today at 09:15:32 UTC'} (Event: {activeNotice ? activeNotice.eventId.slice(0, 16) : 'Block #28,102,480'})
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-full bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#1E3A5F] text-xs font-medium flex items-center gap-1 transition-colors border border-[#74777F]/15 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Archival PDF</span>
            </button>

            <button
              type="button"
              onClick={() => copyMerkle(`ZK-PROOF-0x${activeNotice ? activeNotice.id.replace(/-/g, '') : '89fd4a71bc993e110298a002bc4501a398f7129c991a78e12f0004bc7a'}`)}
              className="px-3 py-1.5 rounded-full bg-[#F8F9FF] hover:bg-[#E5EFFF] text-[#1E3A5F] text-xs font-medium flex items-center gap-1 transition-colors border border-[#74777F]/15 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#A8742A]" />
              <span>Export ZK Proof</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const nextState = !isArchived;
                setIsArchived(nextState);
                if (activeNotice) {
                  onArchive?.(activeNotice.id);
                }
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-[#74777F]/15 ${
                isArchived
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-[#F8F9FF] hover:bg-rose-50 text-[#74777F] hover:text-[#BA1A1A]'
              }`}
              title={isArchived ? 'Archived' : 'Archive Notice'}
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Detail Content Based on Selected Item or activeNotice */}
        {activeNotice ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold flex items-center gap-1 ${
                  activeNotice.priority === 'URGENT'
                    ? 'bg-[#FFDAD6] text-[#93000A]'
                    : activeNotice.priority === 'HIGH'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-[#E5EFFF] text-[#1E3A5F]'
                }`}>
                  <FileCheck className="w-3 h-3" /> {activeNotice.category} Notice
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C8DFDB] text-[#022448] font-mono text-[11px] font-semibold">
                  Domain: {activeNotice.sourceDomain}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F2EFE7] text-[#43474E] font-mono text-[11px] font-semibold">
                  Priority: {activeNotice.priority}
                </span>
                {activeNotice.isRead && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Read
                  </span>
                )}
              </div>

              <h2 className="font-serif text-xl md:text-2xl text-[#022448] font-normal">
                {activeNotice.title}
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#43474E] leading-relaxed">
                {activeNotice.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Source Entity</span>
                <div className="font-serif text-sm font-semibold text-[#121C28]">{activeNotice.sourceDomain} Authority</div>
                <div className="font-mono text-xs text-[#74777F]">Type: {activeNotice.sourceType}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Reference Code</span>
                <div className="font-mono text-sm font-bold text-[#022448]">{activeNotice.sourceId}</div>
                <div className="font-mono text-xs text-[#74777F]">Template: {activeNotice.templateCode}:v{activeNotice.templateVersion}</div>
              </div>
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Event Tracking</span>
                <div className="font-mono text-xs text-[#1E3A5F] break-all">{activeNotice.eventId}</div>
              </div>
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Ledger Stasis</span>
                <div className="font-mono text-sm font-bold text-emerald-700">Core Ledger Confirmed</div>
                <div className="font-mono text-xs text-[#74777F]">Double-entry conserved</div>
              </div>
            </div>

            {/* Official Document Body */}
            <div className="p-5 rounded-xl bg-[#F2EFE7]/50 border border-[#74777F]/20 space-y-3 font-sans text-xs leading-relaxed text-[#121C28] whitespace-pre-line">
              <div className="font-mono text-[10px] text-[#74777F] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#74777F]/15 pb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                SOVEREIGN DISPATCH RECORD • CRYPTOGRAPHICALLY ATTESTED
              </div>
              <div className="font-sans leading-relaxed">{activeNotice.content}</div>
            </div>
          </div>
        ) : selectedId === 'notice-cbn-2025-04b' ? (
          /* Directive Detail View */
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono text-[11px] font-semibold flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-rose-700" /> Statutory Regulation
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C8DFDB] text-[#022448] font-mono text-[11px] font-semibold">
                  Basel III Harmonized
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-mono text-[11px] font-semibold">
                  Enclave Sealed
                </span>
              </div>

              <h2 className="font-serif text-xl md:text-2xl text-[#022448] font-normal">
                Sovereign Monetary Directive #2025-04B: Reserve Adjustment
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#43474E] leading-relaxed">
                Central Bank of ARTHAX mandates a systemic +15 bps stasis reserve yield incentive for sovereign depositors maintaining balanced liquidity profiles across chartered commercial institutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Regulatory Body</span>
                <div className="font-serif text-sm font-semibold text-[#121C28]">Central Bank of ARTHAX (CBA)</div>
                <div className="font-mono text-xs text-[#74777F]">Monetary Policy Board #001</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Target Institutions</span>
                <div className="font-serif text-sm font-semibold text-[#022448]">Samaya Bank &amp; Sthira Bank</div>
                <div className="font-mono text-xs text-[#74777F]">Charter Series A &amp; B</div>
              </div>
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Required Stasis Ratio</span>
                <div className="font-mono text-sm font-bold text-[#A8742A]">14.50% Total Reserve</div>
                <div className="font-mono text-xs text-[#74777F]">Rebasing effective Epoch #94</div>
              </div>
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Incentive Yield Delta</span>
                <div className="font-mono text-sm font-bold text-emerald-700">+0.15% APY Auto-Credited</div>
                <div className="font-mono text-xs text-[#74777F]">Direct to Term Reserve pool</div>
              </div>
            </div>
          </div>
        ) : selectedId === 'notice-nava-payroll-4401' ? (
          /* NAVA Payroll View */
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[11px] font-semibold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-700" /> Commercial Statement
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C8DFDB] text-[#022448] font-mono text-[11px] font-semibold">
                  Audited Batch
                </span>
              </div>

              <h2 className="font-serif text-xl md:text-2xl text-[#022448] font-normal">
                Monthly Sovereign Payroll Ledger &amp; Interest Sweep
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#43474E] leading-relaxed">
                Statement of institutional compensation disbursement and automated reserve yield sweep into primary account for the preceding billing cycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Disbursement Account</span>
                <div className="font-serif text-sm font-semibold text-[#121C28]">NAVA Sovereign Payroll</div>
                <div className="font-mono text-xs text-[#74777F]">
                  Acc: <AnimatedMaskedValue value="NAV-9041-0081-33" isMasked={isMasked} />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">Total Stasis Audited</span>
                <div className="font-mono text-sm font-bold text-[#022448]">
                  <AnimatedMaskedValue value="38,450.00" isMasked={isMasked} currency="ARTH" />
                </div>
                <div className="font-mono text-xs text-emerald-700 font-medium">+3.85% APY Annualized</div>
              </div>
            </div>
          </div>
        ) : (
          /* Default: DVP Settlement Receipt & ISO 20022 Manifest */
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C8DFDB] text-[#022448] font-mono text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ISO 20022 Compliant
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D9E3F4] text-[#1E3A5F] font-mono text-[11px] font-semibold">
                  Merkle Verified
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F2EFE7] text-[#43474E] font-mono text-[11px] font-semibold">
                  ZK Double-Signed
                </span>
              </div>

              <h2 className="font-serif text-xl md:text-2xl text-[#022448] font-normal">
                Atomic DvP Settlement Receipt &amp; ISO 20022 Audit Manifest
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#43474E] leading-relaxed">
                Delivery-versus-Payment instantaneous title transfer recorded on sovereign consensus ledger. Settlement is non-repudiable and final under Chartered Articles §14-C.
              </p>
            </div>

            {/* Entity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8F9FF] p-4 rounded-xl border border-[#74777F]/15">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">
                  Beneficiary / Buyer
                </span>
                <div className="font-serif text-sm font-semibold text-[#121C28]">
                  Ananya Sharma
                </div>
                <div className="font-mono text-xs text-[#74777F]">
                  GOV ID #8491-904-IN (Tier-1)
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">
                  Counterparty / Clearing Node
                </span>
                <div className="font-serif text-sm font-semibold text-[#022448]">
                  SETU Primary Equities Enclave
                </div>
                <div className="font-mono text-xs text-[#74777F]">
                  Custodian LEI: 9845003A4820119X
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">
                  Asset Description
                </span>
                <div className="font-serif text-sm font-medium text-[#121C28]">
                  500 Units • NILA Systems Ltd
                </div>
                <div className="font-mono text-xs text-[#74777F]">
                  Ticker: [NILA:SYS] • Class A Ordinary
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">
                  Gross Settlement Value
                </span>
                <div className="font-mono text-sm font-bold text-[#022448]">
                  <AnimatedMaskedValue value="71,250.00" isMasked={isMasked} currency="ARTH" />
                </div>
                <div className="font-mono text-[11px] text-[#74777F]">
                  Parity: 1.0000 ARTH/USD = $71,250.00
                </div>
              </div>
            </div>

            {/* Line Item Breakdown Table */}
            <div className="rounded-xl overflow-hidden bg-white border border-[#74777F]/20">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#F8F9FF] text-[10px] font-mono text-[#74777F] uppercase border-b border-[#74777F]/15">
                  <tr>
                    <th className="py-2.5 px-4">Component</th>
                    <th className="py-2.5 px-4 font-mono">Rate / Qty</th>
                    <th className="py-2.5 px-4 text-right">Debit / Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74777F]/10">
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#121C28]">
                      500 x NILA Equity Securities Allocation
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#43474E]">@ 142.50 ARTH</td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold text-[#022448]">
                      <AnimatedMaskedValue value="-71,250.00" isMasked={isMasked} currency="ARTH" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#121C28]">
                      DvP Clearing Engine Gas &amp; Sovereign Stamp
                    </td>
                    <td className="py-2.5 px-4 font-mono text-emerald-700">Exempt (0.00%)</td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                      0.00 ARTH
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#121C28]">
                      Regulatory Registry Attestation (SETU Depository)
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#1E3A5F]">Pre-paid Sovereign</td>
                    <td className="py-2.5 px-4 text-right font-mono text-[#43474E]">
                      0.00 ARTH
                    </td>
                  </tr>
                  <tr className="bg-[#F8F9FF]/80">
                    <td className="py-3 px-4 font-bold text-[#121C28]">
                      Net Portfolio Liquidity Dispatched
                    </td>
                    <td className="py-3 px-4 font-mono text-[#74777F] text-[11px]">
                      Finality: 340ms
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#022448] text-sm">
                      <AnimatedMaskedValue value="-71,250.00" isMasked={isMasked} currency="ARTH" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cryptographic Ledger Trail Card */}
            <div className="p-4 rounded-xl bg-[#022448] text-white space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#F9BB6A] font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#F9BB6A]" />
                  Cryptographic Consensus Trail
                </span>
                <span className="text-[11px] font-mono text-[#C8DFDB]">
                  Core Ledger Block #28,102,480
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-[#C8DFDB]/80 uppercase">
                  Settlement Hash (SHA-256 Merkle Leaf)
                </div>
                <div className="bg-white/10 p-2 rounded text-[11px] font-mono text-white break-all select-all flex items-center justify-between">
                  <span>0x89fd4a71bc993e110298a002bc4501a398f7129c991a78e12f0004bc7a</span>
                  <button
                    type="button"
                    onClick={() => copyMerkle('0x89fd4a71bc993e110298a002bc4501a398f7129c991a78e12f0004bc7a')}
                    className="ml-2 text-white/60 hover:text-white cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#C8DFDB] font-mono pt-1">
                <span className="flex items-center gap-1 text-[#68D391]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Multi-Sig: 4 of 4 Validated (SAMAYA, STHIRA, NAVA, CBN)
                </span>
                <span>Finality State: CONFIRMED ATOMIC</span>
              </div>
            </div>
          </div>
        )}

        {/* Companion Assistance Callout (Marjara Mail Cat - Screen Continuity) */}
        <div className="p-4 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-xs border border-[#74777F]/15 shrink-0">
              <span className="text-xl">🐱</span>
            </div>
            <div>
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-1.5">
                <span>Marjara Sovereign Mail Dispatch</span>
                <span className="px-1.5 py-0.2 rounded bg-[#1E3A5F] text-white text-[10px] font-mono font-bold">
                  SENTINEL
                </span>
              </div>
              <p className="font-sans text-xs text-[#43474E]">
                Dispatched with Marjara Enclave zero-latency telemetry. Zero SMS surcharge applied under Tier-1 Citizen Companion covenant.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#A8742A] px-2 py-1 rounded bg-[#A8742A]/10 font-medium shrink-0">
            Active Pet
          </span>
        </div>
      </div>

      {/* Double-Signed Sovereign Proof of Custody / SETU Depository Node #003 Banner */}
      <div className="w-full rounded-2xl bg-white p-4 md:p-5 shadow-2xs border border-[#74777F]/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full bg-[#E5EFFF] flex items-center justify-center text-[#022448] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#1E3A5F]" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif text-sm font-semibold text-[#022448]">
                Double-Signed Sovereign Proof of Custody
              </span>
              <span className="text-[#74777F] text-xs font-sans">• SETU Depository Node #003</span>
              <span className="px-2 py-0.2 rounded-full bg-[#F8F9FF] text-[#1E3A5F] text-[10px] font-mono border border-[#74777F]/15">
                ISO 20022
              </span>
              <span className="px-2 py-0.2 rounded-full bg-[#F8F9FF] text-[#1E3A5F] text-[10px] font-mono border border-[#74777F]/15">
                Basel-III
              </span>
            </div>
            <div className="text-xs font-mono text-[#74777F] flex items-center gap-2">
              <span>ZK-Merkle Root:</span>
              <span className="text-[#022448] font-semibold select-all">
                0x89fd4a71bc993e110298a002bc4501a398f7129
              </span>
              <button
                type="button"
                onClick={() => copyMerkle('0x89fd4a71bc993e110298a002bc4501a398f7129')}
                className="text-[#74777F] hover:text-[#022448] transition-colors cursor-pointer"
                title="Copy Root"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => alert('ZK-Merkle Root verified against Block #28,102,480. Status: 100% Valid.')}
            className="px-4 py-2 rounded-xl bg-[#022448] text-white font-sans text-xs font-semibold hover:bg-[#1E3A5F] transition-colors shadow-2xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#68D391]" />
            <span>Verify Merkle Proof</span>
          </button>
        </div>
      </div>
    </div>
  );
};
