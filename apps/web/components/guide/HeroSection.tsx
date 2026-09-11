'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

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
    </section>
  );
}

export default HeroSection;
