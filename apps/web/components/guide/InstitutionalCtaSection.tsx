'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface InstitutionalCtaSectionProps {
  onOpenGovModal?: () => void;
}

export const InstitutionalCtaSection: React.FC<InstitutionalCtaSectionProps> = ({ onOpenGovModal }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-20" id="institutional">
      <div className="rounded-3xl bg-[#022448] text-white p-8 lg:p-14 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group border border-[#3368A0]/30">
        <div className="space-y-3.5 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#A8742A] font-semibold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            <UserCheck className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>GET STARTED</span>
          </div>

          <h3 className="font-display text-3xl sm:text-4xl font-normal leading-tight text-white">
            Ready to experience seamless, modern banking?
          </h3>

          <p className="font-body text-sm text-slate-300 leading-relaxed max-w-xl">
            Open your account today to access all 5 partner banks, trade equities on the central exchange, and transfer funds instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto relative z-10 shrink-0">
          <Link
            href="/gov"
            id="cta-btn-gov-portal"
            className="w-full sm:w-auto text-center px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-body font-medium text-xs rounded-full border border-white/20 transition active:scale-95 flex items-center justify-center gap-2 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>GOV Portal</span>
          </Link>
          <a
            href="/user"
            className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#A8742A] hover:bg-[#936421] text-white font-body font-medium text-xs rounded-full shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Enter User Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          {onOpenGovModal && (
            <button
              onClick={onOpenGovModal}
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-white hover:bg-[#F2EFE7] text-[#022448] font-body font-medium text-xs rounded-full transition active:scale-95 shadow-sm cursor-pointer"
            >
              Connect GOV ID
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstitutionalCtaSection;
