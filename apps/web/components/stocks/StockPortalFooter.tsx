'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Activity, Scale } from 'lucide-react';

export const StockPortalFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#112822] text-[#82AA9D] border-t border-[#1C3E34] text-xs font-sans mt-auto">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[#1C3E34] pb-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-base">ARTHAX Equities Exchange</span>
              <span className="px-2 py-0.5 rounded bg-[#173F35] text-[#DCEEE8] font-mono text-[10px] font-semibold uppercase">
                SETU Chartered
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#82AA9D]">
              Continuous double-auction exchange executing sovereign equities and gilts under the Central Settlement Layer (CLS). Every transaction enforces simultaneous Bilateral Title Escrow and Delivery-versus-Payment (DvP-III) finality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <div className="bg-[#173F35] border border-[#1C3E34] px-3 py-2 rounded-xl text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <div>
                <div className="text-[9px] text-[#82AA9D] uppercase">Depository Protocol</div>
                <div className="font-semibold">SETU Enclave T+0</div>
              </div>
            </div>

            <div className="bg-[#173F35] border border-[#1C3E34] px-3 py-2 rounded-xl text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#A8742A]" />
              <div>
                <div className="text-[9px] text-[#82AA9D] uppercase">Tax Governance</div>
                <div className="font-semibold">Section 18-C Realized</div>
              </div>
            </div>

            <div className="bg-[#173F35] border border-[#1C3E34] px-3 py-2 rounded-xl text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#66A3BF]" />
              <div>
                <div className="text-[9px] text-[#82AA9D] uppercase">Disclosures</div>
                <div className="font-semibold">ISO-20022 XML Validated</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#717975]">
          <div>
            © 2025–2026 ARTHAX Sovereign Financial System. All capital markets operate strictly in ARTH currency.
          </div>
          <div className="flex items-center gap-4 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Central Guide</Link>
            <span>•</span>
            <Link href="/user" className="hover:text-white transition-colors">User Portal</Link>
            <span>•</span>
            <Link href="/stocks/profit-tax" className="hover:text-white transition-colors">Section 18-C Tax</Link>
            <span>•</span>
            <Link href="/stocks/orders" className="hover:text-white transition-colors">Audit Blotter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
