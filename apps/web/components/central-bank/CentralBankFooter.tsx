'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Scale, FileText, ExternalLink } from 'lucide-react';

export const CentralBankFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#D8C7A5]/70 bg-[#FAF7EE] text-[#615749] text-xs font-mono">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#946726] via-[#B88B38] to-[#7A5217] p-1 flex items-center justify-center border border-[#F5E1B2] shrink-0 shadow-xs">
              <Image
                src="/assets/portals/central_bank.png"
                alt="Central Bank of ARTHAX"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-xs text-[#2A2012] block">
                Central Bank of ARTHAX
              </span>
              <span className="text-[10px] text-[#8C682D] block">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Ledger Status */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#5C451F] bg-white/80 px-3.5 py-1.5 rounded-full border border-[#D8C7A5] shadow-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ledger Balanced (Debits = Credits)</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-[11px]">
            <Link
              href="/central-bank/audit"
              className="text-[#946726] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Audit Trail</span>
            </Link>
            <span className="text-[#D8C7A5]">|</span>
            <Link
              href="/central-bank/security"
              className="text-[#946726] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Security</span>
            </Link>
            <span className="text-[#D8C7A5]">|</span>
            <Link
              href="/"
              className="text-[#946726] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Home</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};
