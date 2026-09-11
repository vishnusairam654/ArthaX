'use client';

import React from 'react';
import { Shield, Sparkles, Sliders, BookOpen, Layers } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface ShopHeroBannerProps {
  isMasked: boolean;
  onManageVault: () => void;
  onViewRules: () => void;
}

export const ShopHeroBanner: React.FC<ShopHeroBannerProps> = ({
  isMasked,
  onManageVault,
  onViewRules,
}) => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#022448] text-white p-6 md:p-8 shadow-md border border-[#1E3A5F] mb-8">
      {/* Background Decorative Gradient & Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#66A3BF_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#A8742A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
        {/* Headline & Overview */}
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A8742A]/20 border border-[#A8742A]/40 rounded-full text-[#F9BB6A] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#A8742A] animate-pulse" />
            <span>SOVEREIGN ARTIFACT COVENANT • SECTION 18-G</span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-normal tracking-tight text-white">
            Sovereign Artifacts &amp; Financial Modifiers
          </h1>

          <p className="font-sans text-sm md:text-base text-[#F2EFE7]/90 leading-relaxed max-w-2xl">
            Equip authenticated guardian companions and cryptographic identity frames to amplify Fixed Deposit APYs, reduce stock execution fees, and elevate your citizen ledger rank.
          </p>

          {/* Quick Stats / Active Buffs Strip */}
          <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-[#C8DFDB] block text-[10px] uppercase font-mono tracking-wider">
                Equipped Companion
              </span>
              <span className="font-serif font-semibold text-[#F9BB6A] text-sm">Vidya Owl</span>
              <span className="block text-[10px] text-emerald-300 font-mono mt-0.5">
                +0.25% FD Yield Booster
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-[#C8DFDB] block text-[10px] uppercase font-mono tracking-wider">
                Active Frame
              </span>
              <span className="font-serif font-semibold text-white text-sm">Titanium Enclave</span>
              <span className="block text-[10px] text-emerald-300 font-mono mt-0.5">
                -30% Clearing Delay
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-[#C8DFDB] block text-[10px] uppercase font-mono tracking-wider">
                Modifier Slots
              </span>
              <span className="font-mono font-semibold text-white text-sm">1 / 2 Active</span>
              <span className="block text-[10px] text-[#C8DFDB] font-mono mt-0.5">
                1 Slot Unlocked at Tier-2
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-[#C8DFDB] block text-[10px] uppercase font-mono tracking-wider">
                Vault Net Value
              </span>
              <span className="font-mono font-bold text-[#F9BB6A] text-sm">
                <AnimatedMaskedValue value="14,200.00" isMasked={isMasked} currency="ARTH" />
              </span>
              <span className="block text-[10px] text-[#C8DFDB] font-mono mt-0.5">
                4 Total Artifacts
              </span>
            </div>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
          <button
            type="button"
            onClick={onManageVault}
            className="w-full py-2.5 px-4 bg-[#A8742A] hover:bg-[#8D5F22] text-white font-sans font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#F2EFE7]" />
            <span>Manage Equipped Vault</span>
          </button>

          <button
            type="button"
            onClick={onViewRules}
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2 backdrop-blur-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#C8DFDB]" />
            <span>View Modifier Rules</span>
          </button>
        </div>
      </div>
    </section>
  );
};
