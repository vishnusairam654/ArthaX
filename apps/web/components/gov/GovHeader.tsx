'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Building2, 
  Coins, 
  TrendingUp, 
  ShoppingBag,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface GovHeaderProps {
  connectedGovId?: string | null;
}

export function GovHeader({ connectedGovId }: GovHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div 
        className={`max-w-6xl mx-auto rounded-full pointer-events-auto transition-all duration-300 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border ${
          isScrolled 
            ? 'bg-[#F2EFE7]/95 backdrop-blur-xl border-[#3368A0]/25 shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]' 
            : 'bg-[#F2EFE7]/85 backdrop-blur-lg border-[#3368A0]/15 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
        }`}
      >
        {/* LEFT: Central Guide Link */}
        <div className="flex-1 flex items-center justify-start gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-body font-semibold text-[#022448] bg-gradient-to-b from-white via-white to-[#F6F3EC] hover:to-white rounded-full border border-[#3368A0]/25 hover:border-[#3368A0]/50 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] hover:-translate-y-0.5 transition-all duration-200 no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#3368A0] shrink-0" />
            <span className="hidden sm:inline">Central Guide</span>
            <span className="sm:hidden">Guide</span>
          </Link>

          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3368A0]/10 text-[#1E3A5F] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#287A55] animate-pulse" />
            <span>Authority Root</span>
          </span>
        </div>

        {/* CENTER: ARTHAX LOGO */}
        <div className="shrink-0 flex items-center justify-center px-2 sm:px-4">
          <Link
            href="/gov"
            aria-label="ARTHAX Government Identity Gateway"
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-90 no-underline"
          >
            <Image
              src="/assets/brand/navbar_logo.png"
              alt="ARTHAX"
              width={130}
              height={26}
              className="h-6 sm:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-104 drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              priority
            />
            <span className="px-2 py-0.5 rounded-md bg-[#1E3A5F] text-white font-mono text-[10px] font-bold uppercase tracking-wider hidden xs:inline-block">
              GOV ID
            </span>
          </Link>
        </div>

        {/* RIGHT: PORTAL DIRECTORY DROPDOWN OR QUICK LINKS */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/user"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium text-[#1E3A5F] hover:text-[#3368A0] bg-white/80 hover:bg-white rounded-full border border-[#3368A0]/20 transition-all shadow-2xs no-underline"
          >
            <span className="hidden sm:inline">User Portal</span>
            <span className="sm:hidden">User</span>
            <ExternalLink className="w-3 h-3 text-[#5C574F]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
