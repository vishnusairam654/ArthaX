'use client';

import React, { useState } from 'react';
import { AlertCircle, Key, PenTool, Eye, CheckCircle2, FileText } from 'lucide-react';

interface PriorityDispatchHeroProps {
  onViewMemo: () => void;
}

export const PriorityDispatchHero: React.FC<PriorityDispatchHeroProps> = ({ onViewMemo }) => {
  const [isSigned, setIsSigned] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#021B36] via-[#1E3A5F] to-[#092244] text-white p-6 md:p-8 shadow-md border-l-4 border-[#A8742A] mb-8">
      {/* Background Watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
        <FileText className="w-64 h-64 text-white" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-4xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A8742A] text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-xs">
              <AlertCircle className="w-3.5 h-3.5 text-[#F8F9FF]" />
              PRIORITY 1 HIGH • MANDATORY DIRECTIVE
            </span>
            <span className="text-[#C8DFDB] font-mono text-xs">
              Notice Ref: #CBN-8491-2025
            </span>
            <span className="text-[#F9BB6A] text-xs font-sans">
              • Effective: Epoch #94 (In 4 Days)
            </span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl text-white font-normal tracking-tight">
            Central Bank of ARTHAX • Sovereign Monetary Directive #2025-04B
          </h1>

          <p className="font-sans text-sm md:text-base text-[#F2EFE7]/90 leading-relaxed max-w-3xl">
            Annual Stasis Reserve Ratio adjustment for Q2 2025 confirmed at{' '}
            <strong className="text-[#F9BB6A] font-semibold">14.50%</strong>. Tier-1 citizen accounts holding multi-bank fixed deposits in{' '}
            <span className="underline decoration-[#A8742A]/60">Samaya Bank</span> &amp;{' '}
            <span className="underline decoration-[#A8742A]/60">Sthira Bank</span> will receive an automated{' '}
            <strong className="text-[#68D391] font-semibold">+0.15% APY</strong> protocol rebasing starting Epoch #94.
          </p>

          <div className="flex items-center gap-4 text-[#C8DFDB] text-xs font-mono pt-1">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#A8742A]" />
              Enclave Signature: 0x9FA8...7B11
            </span>
            <span className="opacity-40">•</span>
            <span>Mandate Class: Basel III Sovereign Harmonization</span>
          </div>
        </div>

        <div className="flex sm:flex-col items-stretch sm:items-end gap-3 shrink-0">
          {isSigned ? (
            <div className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Signed via Enclave</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsSigned(true)}
              className="px-5 py-2.5 rounded-xl bg-[#A8742A] text-white font-sans text-xs font-semibold hover:bg-[#8D5F22] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>Acknowledge &amp; Sign</span>
            </button>
          )}

          <button
            type="button"
            onClick={onViewMemo}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-medium transition-colors flex items-center justify-center gap-1.5 backdrop-blur-xs cursor-pointer border border-white/10"
          >
            <Eye className="w-4 h-4" />
            <span>View Full Memo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
