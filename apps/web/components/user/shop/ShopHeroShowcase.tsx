'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowRight, ShieldCheck, Box, Eye, Lock, TrendingUp, Zap } from 'lucide-react';
import { ShopItem, FINANCIAL_PETS } from './ShopData';

const ShopVault3DCanvas = dynamic(
  () => import('./ShopVault3DCanvas').then((mod) => mod.ShopVault3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-slate-900/50 rounded-2xl flex items-center justify-center text-xs font-mono text-[#C59A45] animate-pulse">
        Initializing Sovereign 3D Node...
      </div>
    ),
  }
);

interface ShopHeroShowcaseProps {
  isMasked?: boolean;
  availableBalance: number;
  onAcquire: (item: ShopItem) => void;
  onInspect: (item: ShopItem) => void;
  onExplorePets: () => void;
  onOpenInventory: () => void;
}

export function ShopHeroShowcase({
  isMasked = false,
  availableBalance,
  onAcquire,
  onInspect,
  onExplorePets,
  onOpenInventory,
}: ShopHeroShowcaseProps) {
  const [show3D, setShow3D] = useState(false);

  // Spotlight Pet is Wealth Elephant (Rank 1, Gold tier)
  const gajaPet = FINANCIAL_PETS[0];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#022448] via-[#1E3A5F] to-[#0D1726] text-white shadow-xl p-6 sm:p-8 lg:p-10 border border-[#1E3A5F]">
      {/* Subtle Guilloche & Gold Ambient Overlays */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#A8742A]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-[#66A3BF]/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C8DFDB_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: 7 Cols */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 18-G Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#F4EDE0] border border-white/15 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#C59A45]" />
            <span className="uppercase tracking-widest font-bold text-[#E9D9BE]">
              Sovereign Artifact Covenant • Section 18-G
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-white leading-[1.15]">
              The Sovereign Treasury of Virtual Assets &amp; Companions
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#C8DFDB] max-w-2xl leading-relaxed">
              Every minted artifact maintains certified cryptographic custody and active ecosystem utility.
              Financial Pets provide verifiable, real-time yields—unlocking interest boosters, zero-fee inter-bank routing,
              and instant SETU tax harvesting.
            </p>
          </div>

          {/* Ready Allocation Balance & Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 bg-black/25 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#A8742A]/20 flex items-center justify-center text-[#C59A45]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-[#C8DFDB]">
                  Ready Allocation
                </div>
                <div className="font-mono text-base font-bold text-[#FAF8F5] tracking-tight">
                  {isMasked ? '•••••••• ARTH' : `${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onExplorePets}
              className="px-4 py-2.5 bg-[#A8742A] hover:bg-[#8C5E1F] text-[#FAF8F5] rounded-xl font-sans font-semibold text-xs sm:text-sm transition-all shadow-md active:translate-y-0.5 flex items-center gap-2 cursor-pointer border border-[#C59A45]/30"
            >
              <span>Explore 8 Financial Pets</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShow3D(!show3D)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-sans font-medium text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border border-white/10"
            >
              <Box className="w-4 h-4 text-[#C8DFDB]" />
              <span>{show3D ? 'Hide 3D Monolith' : '3D Sovereign Monolith'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenInventory}
              className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-[#C8DFDB] hover:text-white rounded-xl font-sans text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Active Vault</span>
            </button>
          </div>

          {/* Stat Row */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 max-w-xl font-sans">
            <div>
              <div className="font-mono text-xl sm:text-2xl text-white font-semibold">100%</div>
              <div className="text-[11px] text-[#C8DFDB] uppercase tracking-wider">DvP Collateralized</div>
            </div>
            <div>
              <div className="font-mono text-xl sm:text-2xl text-[#C59A45] font-semibold">+1.25%</div>
              <div className="text-[11px] text-[#C8DFDB] uppercase tracking-wider">Max Yield Modifier</div>
            </div>
            <div>
              <div className="font-mono text-xl sm:text-2xl text-white font-semibold">Zero-Loss</div>
              <div className="text-[11px] text-[#C8DFDB] uppercase tracking-wider">Mint Settlement</div>
            </div>
          </div>
        </div>

        {/* Right Column: 5 Cols - Either 3D Canvas or Spotlight Pet Card */}
        <div className="lg:col-span-5">
          {show3D ? (
            <div className="relative bg-[#0d1726]/90 rounded-2xl p-4 border border-[#1E3A5F] shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs text-[#C59A45] font-semibold">SETU Monolith Active Node #003</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShow3D(false)}
                  className="text-xs text-[#C8DFDB] hover:text-white underline cursor-pointer"
                >
                  Show Spotlight Pet
                </button>
              </div>
              <ShopVault3DCanvas height={280} />
              <p className="text-center font-mono text-[11px] text-[#66A3BF] pt-2">
                Drag to inspect continuous linked settlement torus rings
              </p>
            </div>
          ) : (
            <div className="relative bg-white text-[#1B1C1A] rounded-2xl p-5 sm:p-6 shadow-2xl transition-all hover:shadow-[0_16px_40px_rgba(2,36,72,0.25)] border border-[#C59A45]/30">
              {/* Specular Gold Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full bg-[#FDF8F0] text-[#A8742A] border border-[#A8742A]/30 text-xs font-sans font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
                  Gold Sovereign Spotlight
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-medium">ID: #PET-001-GAJA</span>
              </div>

              {/* Pet Inset Showcase Area */}
              <div className="relative rounded-xl bg-gradient-to-b from-[#F4EDE0] to-[#FAF8F5] p-4 overflow-hidden flex items-center justify-center min-h-[200px] border border-slate-200/60">
                <div className="absolute inset-0 bg-[radial-gradient(#A8742A_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-25" />
                <div className="relative w-44 h-44 transition-transform hover:scale-105 duration-300">
                  <Image
                    src={gajaPet.image}
                    alt={gajaPet.name}
                    fill
                    sizes="176px"
                    className="object-contain drop-shadow-xl"
                    priority
                  />
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-sans text-[#A8742A] font-bold border border-[#A8742A]/20 shadow-xs">
                  Rank #01 • Sovereign Airavata
                </div>
              </div>

              {/* Title & Stats */}
              <div className="pt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#022448]">{gajaPet.name}</h3>
                    <p className="font-sans text-xs text-slate-500">{gajaPet.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wide">Market Mint</span>
                    <span className="font-mono text-base font-bold text-[#022448]">
                      {isMasked ? '•••• ARTH' : `${gajaPet.price.toLocaleString('en-US')} ARTH`}
                    </span>
                  </div>
                </div>

                {/* Modifiers Pill Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
                  <div className="p-2 bg-[#F4EDE0]/60 rounded-xl border border-slate-200/60">
                    <div className="text-xs text-[#A8742A] font-bold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#A8742A]" />
                      +1.25% FD Yield
                    </div>
                    <div className="text-[11px] text-slate-600 leading-tight mt-0.5">
                      Applied across all bank FDs
                    </div>
                  </div>
                  <div className="p-2 bg-[#F4EDE0]/60 rounded-xl border border-slate-200/60">
                    <div className="text-xs text-[#1E3A5F] font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#1E3A5F]" />
                      SETU Auto-Sweep
                    </div>
                    <div className="text-[11px] text-slate-600 leading-tight mt-0.5">
                      Instant zero-cost harvesting
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2 font-sans">
                  <button
                    type="button"
                    onClick={() => onAcquire(gajaPet)}
                    className="flex-1 py-2.5 bg-[#022448] hover:bg-[#1E3A5F] text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:translate-y-0.5 cursor-pointer"
                  >
                    Acquire with 1-Click
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspect(gajaPet)}
                    title="Inspect Asset"
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#022448] rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
