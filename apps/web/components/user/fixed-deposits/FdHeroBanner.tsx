'use client';

import React from 'react';
import { ShieldCheck, Calculator, Award, PlusCircle } from 'lucide-react';

interface FdHeroBannerProps {
  onOpenCalculator: () => void;
  onOpenCreateDeposit: () => void;
}

export const FdHeroBanner: React.FC<FdHeroBannerProps> = ({
  onOpenCalculator,
  onOpenCreateDeposit,
}) => {
  return (
    <section className="w-full mb-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-[#74777F]/20">
        <div className="space-y-2 max-w-3xl">
          {/* Telemetry Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-mono text-[11px] uppercase tracking-wider font-semibold border border-[#74777F]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              SOVEREIGN CAPITAL PRESERVATION
            </span>
            <span className="text-[#74777F]/40">•</span>
            <span className="font-mono text-[11px] text-[#43474E] tracking-wider uppercase font-medium">
              Monetary Authority Chartered
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl text-[#022448] font-bold tracking-tight">
            Fixed Deposits &amp; Term Reserves
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-sm sm:text-base text-[#43474E] max-w-2xl leading-relaxed">
            Deterministic yield contracts anchored by Central Bank Settlement Enclaves. Capital locked under ISO 20022 compliant escrow with multi-party cryptographic cert issuance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCalculator}
            type="button"
            className="px-4 py-2 bg-[#E5EFFF] hover:bg-[#D9E3F4] text-[#1E3A5F] font-medium text-xs rounded-full shadow-2xs transition-all flex items-center gap-2 cursor-pointer border border-[#74777F]/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calculator className="w-4 h-4 text-[#1E3A5F]" />
            <span>FD Scheme Calculator</span>
          </button>

          <a
            href="#active-deposits"
            className="px-4 py-2 bg-[#F2F3FA] hover:bg-[#E5EFFF] text-[#121C28] font-medium text-xs rounded-full shadow-2xs transition-all flex items-center gap-2 border border-[#74777F]/20"
          >
            <Award className="w-4 h-4 text-[#A8742A]" />
            <span>Audit Certificates <strong className="ml-0.5 text-[#1E3A5F]">(3)</strong></span>
          </a>

          <button
            onClick={onOpenCreateDeposit}
            type="button"
            className="px-4 py-2 bg-[#022448] hover:bg-[#1E3A5F] text-white font-medium text-xs rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-[#A8742A]" />
            <span>+ Create Fixed Deposit</span>
          </button>
        </div>
      </div>
    </section>
  );
};
