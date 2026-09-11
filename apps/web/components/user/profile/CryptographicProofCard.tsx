'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Copy, Check, Download, ExternalLink, QrCode } from 'lucide-react';

export function CryptographicProofCard() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const publicKey = '0x89fd4a71bc993e110298a002bc4501a398f7129';

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleVerify = () => {
    setIsVerified(true);
    setTimeout(() => setIsVerified(false), 3000);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-[#022448] uppercase tracking-widest font-bold">
            <ShieldCheck className="w-4 h-4 text-[#022448]" />
            <span>National Depository Settlement Rails</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-[#022448] mt-0.5">
            Sovereign Ledger Verification &amp; Merkle Root
          </h2>
          <p className="font-sans text-xs text-slate-600 mt-0.5">
            Cryptographic attestations verifying uncompromised citizen identity and depository ownership.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleVerify}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isVerified ? 'Attestation Verified: OK' : 'Verify Merkle Attestation'}</span>
          </button>
        </div>
      </div>

      {/* Metadata Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#FAF8F5] border border-slate-200/80 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">SETU Node Node</span>
          <span className="text-[#022448] font-bold block">#003 (IN-WEST-04)</span>
          <span className="text-[11px] text-emerald-700">Consensus Active</span>
        </div>

        <div className="bg-[#FAF8F5] border border-slate-200/80 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ledger Block Height</span>
          <span className="text-[#022448] font-bold block">#28,102,510</span>
          <span className="text-[11px] text-slate-500">Epoch Finalized</span>
        </div>

        <div className="bg-[#FAF8F5] border border-slate-200/80 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Compliance Standard</span>
          <span className="text-[#022448] font-bold block">ISO 20022 / Basel-III</span>
          <span className="text-[11px] text-slate-500">Zero Divergence</span>
        </div>

        <div className="bg-[#FAF8F5] border border-slate-200/80 p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hardware Enclave</span>
          <span className="text-[#022448] font-bold block">HSM FIPS 140-3</span>
          <span className="text-[11px] text-[#A8742A] font-semibold">Armed &amp; Isolated</span>
        </div>
      </div>

      {/* Public Key Strip */}
      <div className="bg-[#022448] text-white p-4 rounded-xl border border-[#1E3A5F] space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#C8DFDB] uppercase">
            Sovereign Citizen Public Settlement Key
          </span>
          <span className="text-[11px] text-[#E9D9BE]">ARTHAX-ED25519-SOV</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#011428] p-2.5 rounded-lg border border-white/10">
          <span className="text-[#F4EDE0] select-all break-all">{publicKey}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[#C8DFDB] hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-[11px] shrink-0"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
