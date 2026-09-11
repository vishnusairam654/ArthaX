'use client';

import React from 'react';
import {
  Check,
  Fingerprint,
  Terminal,
  Handshake,
  Landmark,
  Lock,
  Timer,
} from 'lucide-react';

export const LinearSettlementTrack: React.FC = () => {
  return (
    <section className="rounded-2xl bg-white border border-[#74777F]/20 p-6 md:p-8 shadow-xs mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#74777F]/15 gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[#A8742A] font-semibold">
            Ledger Telemetry Track
          </span>
          <h2 className="font-serif text-xl md:text-2xl text-[#022448] tracking-tight">
            6-Stage Settlement &amp; Consensual Finality
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#74777F]">
          <Timer className="w-4 h-4 text-emerald-600" />
          <span>
            Total Span: <strong className="text-[#121C28]">33.770s</strong> (Finalized at 14:18:35.882 UTC)
          </span>
        </div>
      </div>

      {/* Continuous Linear Track */}
      <div className="relative pl-8 space-y-7 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5EFFF]">
        {/* Stage 1 */}
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-sm text-[#022448]">
                Stage 1: Ingress &amp; Validation
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F8F9FF] font-mono text-[10px] text-[#1E3A5F] border border-[#74777F]/15">
                ENCLAVE-INGRESS
              </span>
            </div>
            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Validated via Sovereign Client Enclave <span className="font-mono text-[#121C28]">#IN-WEST-04</span>. KYC Tier-1 biometric signature verified and resident liquidity reserve verified positive against CLS ledger.
            </p>
          </div>
          <div className="flex flex-col md:text-right font-mono text-xs text-[#74777F]">
            <span className="text-[#121C28] font-medium">14:18:02.112 UTC</span>
            <span className="text-[11px]">Δ 0.000ms • Session #AUTH-9912</span>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Fingerprint className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-sm text-[#022448]">
                Stage 2: Authorization &amp; Double-Sign
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F8F9FF] font-mono text-[10px] text-[#1E3A5F] border border-[#74777F]/15">
                FIPS-ATTESTED
              </span>
            </div>
            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Resident Sovereign PIN accepted. Dual hardware attestation executed using hardware security token (YubiKey FIPS 140-3 Level 4). Elliptic Curve ECDSA P-384 signature sealed.
            </p>
          </div>
          <div className="flex flex-col md:text-right font-mono text-xs text-[#74777F]">
            <span className="text-[#121C28] font-medium">14:18:05.440 UTC</span>
            <span className="text-[11px]">Δ +3.328s • Sig #SIG-89812-EC</span>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-sm text-[#022448]">
                Stage 3: CLS Gateway Ingestion
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F8F9FF] font-mono text-[10px] text-[#1E3A5F] border border-[#74777F]/15">
                ISO-20022
              </span>
            </div>
            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Standard ISO 20022 <span className="font-mono text-[#022448] font-medium">pacs.008.001.08</span> financial credit transfer payload constructed, encrypted via end-to-end TLS 1.3 quantum-resistant cipher suite, and dispatched to interbank CLS gateway.
            </p>
          </div>
          <div className="flex flex-col md:text-right font-mono text-xs text-[#74777F]">
            <span className="text-[#121C28] font-medium">14:18:12.890 UTC</span>
            <span className="text-[11px]">Δ +7.450s • Message #MSG-CLS-0914</span>
          </div>
        </div>

        {/* Stage 4 */}
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Handshake className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-sm text-[#022448]">
                Stage 4: Atomic DvP Delivery vs Payment Handshake
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F2EFE7] text-[#8D5F22] font-mono text-[10px] font-bold">
                SYNCHRONOUS LOCK
              </span>
            </div>
            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Simultaneous bilateral title deed lock in escrow ledger <span className="font-mono text-[#121C28] font-medium">#EQ-2891</span>. 250 common shares of NILA Systems Ltd reserved at depository registry in locked escrow awaiting gross cash confirmation.
            </p>
          </div>
          <div className="flex flex-col md:text-right font-mono text-xs text-[#74777F]">
            <span className="text-[#121C28] font-medium">14:18:24.015 UTC</span>
            <span className="text-[11px]">Δ +11.125s • Escrow #ESC-7718</span>
          </div>
        </div>

        {/* Stage 5 */}
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Landmark className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-sm text-[#022448]">
                Stage 5: Inter-bank Gross Settlement
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F8F9FF] font-mono text-[10px] text-[#1E3A5F] border border-[#74777F]/15">
                RTGS-FINAL
              </span>
            </div>
            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Bilateral netting cleared at Sovereign Central Clearing House. Reserve liquidity debited from NAVA Bank (#001) reserve vault and credited to SETU Bank (#003) institutional omnibus reserve account.
            </p>
          </div>
          <div className="flex flex-col md:text-right font-mono text-xs text-[#74777F]">
            <span className="text-[#121C28] font-medium">14:18:31.500 UTC</span>
            <span className="text-[11px]">Δ +7.485s • Batches #891-B</span>
          </div>
        </div>

        {/* Stage 6 */}
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-[#022448] text-[#F9BB6A] flex items-center justify-center shadow-xs">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-sm text-[#022448]">
                Stage 6: Irreversible Ledger Block (Finality Achieved)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#C8DFDB] text-[#022448] font-mono text-[10px] font-bold">
                IMMUTABLE BLOCK
              </span>
            </div>
            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              Tranche finalized into Block <span className="font-mono text-[#022448] font-semibold">#28,102,512</span>. Merkle inclusion proof calculated; block seal signed by 16 consensus validator enclaves. DvP title release executed simultaneously.
            </p>
          </div>
          <div className="flex flex-col md:text-right font-mono text-xs text-[#74777F]">
            <span className="text-[#022448] font-bold">14:18:35.882 UTC</span>
            <span className="text-emerald-700 font-semibold text-[11px]">
              Δ +4.382s • 380ms Sub-Consensus
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
