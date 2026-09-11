'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Wallet, 
  Building2, 
  Clock, 
  FileCheck, 
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';

interface TransferAuditReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  isMasked?: boolean;
}

export const TransferAuditReceiptModal: React.FC<TransferAuditReceiptModalProps> = ({
  isOpen,
  onClose,
  txHash = 'TX-CLS-20250524-890124',
  isMasked = false
}) => {
  const [isVerifyingMerkle, setIsVerifyingMerkle] = useState<boolean>(false);
  const [merkleVerified, setMerkleVerified] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerifyMerkle = () => {
    setIsVerifyingMerkle(true);
    setTimeout(() => {
      setIsVerifyingMerkle(false);
      setMerkleVerified(true);
    }, 1200);
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(txHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadReceipt = () => {
    setDownloadToast('Generating ISO 20022 pacs.008 cryptographic XML receipt...');
    setTimeout(() => {
      setDownloadToast('Receipt pacs.008.001.08 downloaded successfully.');
      setTimeout(() => setDownloadToast(null), 3500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#022448]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-[#F8F9FF] border border-[#74777F]/25 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6 p-5 sm:p-8"
        role="dialog" 
        aria-modal="true"
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-[#EEF4FF] border border-[#74777F]/20 text-[#43474E] hover:text-[#022448] transition-colors shadow-xs cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Header & Breadcrumbs */}
        <div className="space-y-2 border-b border-[#74777F]/20 pb-5">
          <div className="flex items-center gap-2 font-mono text-xs text-[#74777F]">
            <span>Transfers &amp; DvP</span>
            <span>/</span>
            <span>Audit Ledger</span>
            <span>/</span>
            <span className="text-[#022448] font-bold">{txHash}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#022448] tracking-tight">
                Tranche Settlement Verification
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="px-3 py-1 bg-[#A8F5BF]/60 text-[#002110] border border-[#10B981]/30 rounded-full font-mono text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  CLS SETTLED &amp; FINALIZED
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#EEF4FF] border border-[#74777F]/20 font-mono text-[11px] text-[#1E3A5F] uppercase tracking-wider font-semibold">
                  ISO-pacs.008
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="font-mono text-xs text-[#43474E] hover:text-[#022448] flex items-center gap-1 cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons Array */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleVerifyMerkle}
                disabled={isVerifyingMerkle}
                className={`px-3.5 py-2 rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 border transition-all shadow-xs cursor-pointer ${
                  merkleVerified 
                    ? 'bg-[#A8F5BF]/60 border-[#10B981] text-[#002110]'
                    : 'bg-[#dbe1ff] hover:bg-[#c9d4ff] border-[#1E3A5F]/20 text-[#031847]'
                }`}
              >
                {isVerifyingMerkle ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#A8742A]" />
                    <span>Verifying...</span>
                  </>
                ) : merkleVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Merkle Root Validated</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A5F]" />
                    <span>Verify HSM Merkle Root</span>
                  </>
                )}
              </button>

              <a
                href={`/user/transfers/${txHash}`}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-[#EEF4FF] text-[#022448] font-sans text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#74777F]/20 shadow-2xs cursor-pointer"
              >
                <span>Full Ledger View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="px-3.5 py-2 rounded-full bg-[#022448] hover:bg-[#1E3A5F] text-white font-sans text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#A8742A]" />
                <span>Receipt (.pacs008)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Download Toast Notification */}
        {downloadToast && (
          <div className="p-3 bg-[#EEF4FF] border border-[#1E3A5F]/30 rounded-xl text-xs font-mono text-[#022448] flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-[#A8742A]" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* 2. Transaction Hero Section with Quantum & Route Card */}
        <div className="bg-white border border-[#74777F]/20 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="font-sans text-[11px] uppercase tracking-wider text-[#74777F] font-semibold">
                Settlement Remittance Quantum
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl text-[#022448] font-bold tabular-nums">
                  <AnimatedMaskedValue value="5,000.00" isMasked={isMasked} maskString="••••••" />
                </span>
                <span className="font-sans text-xl font-bold text-[#A8742A]">ARTH</span>
                <span className="font-mono text-xs text-[#74777F] ml-2">
                  ($5,001.00 USD equivalent at block stamp)
                </span>
              </div>
              <div className="font-sans text-xs text-[#43474E] pt-1">
                DvP Tranche Settlement — <strong className="text-[#022448]">NILA Systems Equity Allocation</strong>
                <span className="font-mono text-[11px] text-[#74777F] ml-2 bg-[#F8F9FF] px-2 py-0.5 rounded border border-[#74777F]/15">
                  Mandate #SETU-EQ-2025-0814
                </span>
              </div>
            </div>

            <div className="bg-[#F8F9FF] border border-[#74777F]/15 p-3 rounded-xl font-mono text-xs space-y-1 min-w-[220px]">
              <div className="flex justify-between text-[#74777F]">
                <span>CLS Real-Time Rail:</span>
                <span className="text-[#10B981] font-semibold">380ms Finality</span>
              </div>
              <div className="font-sans font-bold text-[#022448]">RTGS DvP Atomic</div>
              <div className="flex justify-between text-[#74777F]">
                <span>Proof Protocol:</span>
                <span className="text-[#A8742A] font-semibold">ZK-STARK FIPS-140</span>
              </div>
            </div>
          </div>

          {/* Counterparty Route Card (Debited -> Credited) */}
          <div className="p-4 bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Debited Source */}
            <div className="md:col-span-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#74777F]/20 flex items-center justify-center text-[#ba1a1a] shadow-xs">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#ba1a1a] font-semibold">
                  Source Debited
                </div>
                <div className="font-serif text-sm font-bold text-[#022448]">
                  NAVA Sovereign Payroll
                </div>
                <div className="font-mono text-[10px] text-[#74777F]">
                  #ARTH-9021-001 • Node: IN-MUMBAI-01
                </div>
              </div>
            </div>

            {/* Flow Indicator */}
            <div className="md:col-span-2 flex flex-col items-center justify-center py-2 md:py-0">
              <div className="w-full flex items-center justify-center relative">
                <div className="h-0.5 w-full bg-[#74777F]/20"></div>
                <div className="absolute px-2.5 py-0.5 rounded-full bg-[#022448] text-white font-mono text-[10px] flex items-center gap-1 shadow-xs">
                  <Lock className="w-2.5 h-2.5" />
                  <span>DvP Swap</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[#74777F] mt-1.5">
                Escrow #EQ-2891
              </span>
            </div>

            {/* Credited Destination */}
            <div className="md:col-span-5 flex items-center gap-3 md:justify-end md:text-right">
              <div className="order-2 md:order-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#10B981] font-semibold">
                  Destination Credited
                </div>
                <div className="font-serif text-sm font-bold text-[#022448]">
                  NSE Sovereign Custody
                </div>
                <div className="font-mono text-[10px] text-[#74777F]">
                  #SETU-CUST-8821 • Node: SETU-CLEARING-09
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white border border-[#74777F]/20 flex items-center justify-center text-[#10B981] shadow-xs order-1 md:order-2">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Chronological 6-Stage Continuous Linear Settlement Track */}
        <div className="bg-white border border-[#74777F]/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#74777F]/15 pb-3 gap-2">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#A8742A] font-semibold block">
                Ledger Telemetry Track
              </span>
              <h3 className="font-serif text-lg font-bold text-[#022448]">
                6-Stage Settlement &amp; Consensual Finality
              </h3>
            </div>
            <div className="font-mono text-xs text-[#74777F] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Span: <strong className="text-[#022448]">33.770s</strong> (Finalized at 14:18:35 UTC)</span>
            </div>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dbe1ff]">
            {/* Stage 1 */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <div className="font-serif text-sm font-bold text-[#022448]">
                  Stage 1: Ingress &amp; Format Validation
                </div>
                <p className="font-sans text-xs text-[#43474E]">
                  ISO 20022 pacs.008 schema validation executed against ISO enclave dictionary. Nonce verified.
                </p>
                <div className="font-mono text-[10px] text-[#74777F]">
                  Timestamp: 14:18:02.112 UTC • Latency: 12ms
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <div className="font-serif text-sm font-bold text-[#022448]">
                  Stage 2: Counterparty KYC &amp; Key Resolution
                </div>
                <p className="font-sans text-xs text-[#43474E]">
                  Cert-IN identity confirmed for Vikram Malhotra &amp; NSE Custody. Zero sanctions infraction recorded.
                </p>
                <div className="font-mono text-[10px] text-[#74777F]">
                  Timestamp: 14:18:05.440 UTC • Latency: 48ms
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <div className="font-serif text-sm font-bold text-[#022448]">
                  Stage 3: HSM Resident PIN Authorization
                </div>
                <p className="font-sans text-xs text-[#43474E]">
                  FIPS 140-3 Enclave signed with resident financial PIN. Key payload zeroized in ephemeral cache.
                </p>
                <div className="font-mono text-[10px] text-[#74777F]">
                  Timestamp: 14:18:14.890 UTC • Latency: 110ms
                </div>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <div className="font-serif text-sm font-bold text-[#022448]">
                  Stage 4: CLS Inter-Bank Rail Clearing
                </div>
                <p className="font-sans text-xs text-[#43474E]">
                  Bilateral reserve sweep routed through domestic settlement pool between NAVA Bank and SETU Depository.
                </p>
                <div className="font-mono text-[10px] text-[#74777F]">
                  Timestamp: 14:18:22.310 UTC • Latency: 380ms
                </div>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <div className="font-serif text-sm font-bold text-[#022448]">
                  Stage 5: Atomic Delivery vs Payment (DvP) Lock
                </div>
                <p className="font-sans text-xs text-[#43474E]">
                  Delivery condition satisfied simultaneously with ARTH debit. Escrow released to NSE Sovereign Custody.
                </p>
                <div className="font-mono text-[10px] text-[#74777F]">
                  Timestamp: 14:18:31.902 UTC • Latency: 44ms
                </div>
              </div>
            </div>

            {/* Stage 6 */}
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <div className="font-serif text-sm font-bold text-[#022448]">
                  Stage 6: Core Ledger Block Commit
                </div>
                <p className="font-sans text-xs text-[#43474E]">
                  Committed to block height #28,102,510. Zero divergence verified across all 5 federated domestic nodes.
                </p>
                <div className="font-mono text-[10px] text-[#74777F]">
                  Timestamp: 14:18:35.882 UTC • Finality: Irreversible
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#022448] hover:bg-[#1E3A5F] text-white font-sans text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Return to Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
