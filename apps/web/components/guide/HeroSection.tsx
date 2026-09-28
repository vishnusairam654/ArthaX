'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ShieldCheck, ArrowRight, Fingerprint } from 'lucide-react';

const VantaCloudsBackground = dynamic(
  () => import('./VantaCloudsBackground'),
  {
    ssr: false,
    loading: () => (
      <div 
        className="w-full h-full bg-gradient-to-b from-[#82b4cc]/20 via-[#d2e4e0]/15 to-[#F2EFE7]/40" 
        aria-hidden="true" 
      />
    ),
  }
);

interface HeroSectionProps {
  onOpenGovModal?: () => void;
}

export function HeroSection({ onOpenGovModal }: HeroSectionProps) {
  return (
    <section 
      className="w-full relative overflow-hidden bg-[#F2EFE7] border-b border-[#3368A0]/10 pt-16 sm:pt-20" 
      id="hero"
    >
      {/* Vanta.js Clouds WebGL Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <VantaCloudsBackground />
      </div>

      {/* Atmospheric gentle grounding gradient at the bottom base */}
      <div 
        className="absolute inset-x-0 bottom-0 h-28 z-[1] bg-gradient-to-t from-[#F8F9FF] to-transparent pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Main Display Area */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex items-center justify-center px-2 sm:px-4 md:px-8 py-2 md:py-4">
        <div className="w-full relative flex items-center justify-center">
          <Image
            src="/assets/Centrel_guide_hero.png"
            alt="ARTHAX Sovereign Ecosystem Entry Point"
            width={1920}
            height={1080}
            priority
            quality={95}
            className="w-full h-auto max-h-[88vh] object-contain drop-shadow-2xl select-none transition-transform duration-700 hover:scale-[1.01]"
          />
        </div>
      </div>

      {/* Quick Launch Action Ribbon */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 pb-8 -mt-4 sm:-mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/gov"
          id="hero-btn-gov-portal"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-body font-semibold text-[#022448] bg-white/95 hover:bg-white border border-[#A8742A]/40 hover:border-[#A8742A] shadow-[0_4px_12px_rgba(168,116,42,0.14),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_18px_rgba(168,116,42,0.22)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 group"
        >
          <ShieldCheck className="w-4 h-4 text-[#A8742A] shrink-0" />
          <span>Sovereign GOV ID Portal</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#022448]/60 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {onOpenGovModal && (
          <button
            onClick={onOpenGovModal}
            id="hero-btn-connect-gov"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-body font-semibold text-[#262320] bg-white/80 hover:bg-white border border-[#3368A0]/20 hover:border-[#3368A0]/50 shadow-xs hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <Fingerprint className="w-4 h-4 text-[#3368A0] shrink-0" />
            <span>Connect Active GOV ID</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
