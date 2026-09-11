'use client';

import React from 'react';
import Image from 'next/image';
import { Shield, Sparkles, CheckCircle2, Lock, Check, Layers } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface CitizenLoadoutAndFramesSectionProps {
  isMasked: boolean;
  onAcquireFrame: (frame: { id: string; name: string; type: string; price: number; image: string; rarity: string }) => void;
}

interface FrameItem {
  id: string;
  name: string;
  rarity: 'Gold' | 'Epic' | 'Rare' | 'Normal' | 'Restricted';
  image: string;
  code: string;
  desc: string;
  price: number;
  isOwned?: boolean;
  isEquipped?: boolean;
  isRestricted?: boolean;
}

const FRAMES: FrameItem[] = [
  {
    id: 'frm-leaf',
    name: 'Sovereign Titanium Frame',
    rarity: 'Normal',
    image: '/assets/shop/frames/leaf.png',
    code: '#FRM-902',
    desc: 'Brushed dark-matte titanium bezel with SETU consensus node glyphs.',
    price: 3500,
    isOwned: true,
    isEquipped: true,
  },
  {
    id: 'frm-gold',
    name: 'Reserve Gold Guilloche Frame',
    rarity: 'Gold',
    image: '/assets/shop/frames/gold.png',
    code: '#FRM-883',
    desc: 'Intricate mathematical guilloche patterns mirroring Central Bank bond certificates.',
    price: 4800,
  },
  {
    id: 'frm-aurora',
    name: 'Aurora Borealis Sovereign Frame',
    rarity: 'Epic',
    image: '/assets/shop/frames/Aurora.png',
    code: '#FRM-710',
    desc: 'Spectral luminescence simulating multi-node cryptographic consensus convergence.',
    price: 6500,
  },
  {
    id: 'frm-nova',
    name: 'Nova Quantum Burst Frame',
    rarity: 'Epic',
    image: '/assets/shop/frames/Nova.png',
    code: '#FRM-622',
    desc: 'High-energy flare lattice signifying instant gross settlement execution.',
    price: 6200,
  },
  {
    id: 'frm-orbit',
    name: 'Orbital Stasis Frame',
    rarity: 'Rare',
    image: '/assets/shop/frames/orbit.png',
    code: '#FRM-505',
    desc: 'Concentric kinetic orbital rings calibrated to sovereign ledger epoch cycles.',
    price: 3800,
  },
  {
    id: 'frm-pulse',
    name: 'Pulse Resonance Frame',
    rarity: 'Rare',
    image: '/assets/shop/frames/pluse.png',
    code: '#FRM-419',
    desc: 'Rhythmic electromagnetic waves synchronizing with live Continuous Linked Settlement feeds.',
    price: 3600,
  },
  {
    id: 'frm-vertex',
    name: 'Vertex Geometric Rim',
    rarity: 'Normal',
    image: '/assets/shop/frames/vertex.png',
    code: '#FRM-311',
    desc: 'Minimalist polyhedral tessellation for clear institutional identity display.',
    price: 2200,
  },
  {
    id: 'frm-restricted',
    name: 'Central Bank Auditor Badge Frame',
    rarity: 'Restricted',
    image: '/assets/shop/frames/gold.png',
    code: 'Tier 4 Req',
    desc: 'Reserved exclusively for sovereign citizens who operate or stake SETU full validator nodes.',
    price: 5000,
    isRestricted: true,
  },
];

export const CitizenLoadoutAndFramesSection: React.FC<CitizenLoadoutAndFramesSectionProps> = ({
  isMasked,
  onAcquireFrame,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-10">
      {/* Left Column: Equipped Citizen Loadout (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-[#74777F]/20 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="border-b border-[#74777F]/15 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-semibold text-[#121C28] text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A8742A]" />
              <span>Equipped Citizen Loadout</span>
            </h3>
            <p className="text-xs text-[#43474E] font-sans">
              Live configuration active on the Settlement Engine
            </p>
          </div>
          <span className="px-2 py-0.5 bg-[#C8DFDB] text-[#022448] text-[10px] font-mono font-bold rounded">
            SYNCED
          </span>
        </div>

        {/* Visual Slot Stack */}
        <div className="space-y-3 font-sans">
          {/* Slot 1: Frame */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#E5EFFF] border border-[#74777F]/15 flex items-center justify-center text-[#1E3A5F] font-bold text-sm">
                🪞
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#74777F] block uppercase">
                  Cryptographic Frame
                </span>
                <span className="font-serif font-semibold text-[#121C28] text-xs">
                  Sovereign Titanium Frame
                </span>
                <span className="block text-[10px] text-emerald-700 font-mono font-medium">
                  Equipped (#FRM-902)
                </span>
              </div>
            </div>
            <button className="text-xs text-[#1E3A5F] hover:text-[#022448] font-medium underline cursor-pointer">
              Swap
            </button>
          </div>

          {/* Slot 2: Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#E5EFFF] border border-[#74777F]/15 flex items-center justify-center text-[#1E3A5F] font-bold text-sm">
                🛡️
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#74777F] block uppercase">
                  Identity Ribbon
                </span>
                <span className="font-serif font-semibold text-[#121C28] text-xs">
                  Tier-1 Citizen Vanguard
                </span>
                <span className="block text-[10px] text-[#1E3A5F] font-mono font-medium">
                  Rank Merit: Level 3 Anchor
                </span>
              </div>
            </div>
            <button className="text-xs text-[#1E3A5F] hover:text-[#022448] font-medium underline cursor-pointer">
              Details
            </button>
          </div>

          {/* Slot 3: Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#F2EFE7] border border-[#A8742A]/20 flex items-center justify-center text-[#A8742A] font-bold text-sm">
                🚩
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#74777F] block uppercase">
                  Enclave Backdrop
                </span>
                <span className="font-serif font-semibold text-[#121C28] text-xs">
                  Apex Meridian Silk
                </span>
                <span className="block text-[10px] text-[#A8742A] font-mono font-medium">
                  Prestige Ledger Accent
                </span>
              </div>
            </div>
            <button className="text-xs text-[#1E3A5F] hover:text-[#022448] font-medium underline cursor-pointer">
              Swap
            </button>
          </div>

          {/* Slot 4: Companion */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F2EFE7]/80 border border-[#A8742A]/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#A8742A]/30 overflow-hidden flex items-center justify-center p-1">
                <Image
                  src="/assets/shop/pets/Ledger Owl/thumbnail.png"
                  alt="Vidya Owl"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#8D5F22] block uppercase font-bold">
                  Companion Slot #1
                </span>
                <span className="font-serif font-semibold text-[#121C28] text-xs">
                  Vidya Sage Owl
                </span>
                <span className="block text-[10px] text-emerald-700 font-semibold font-mono">
                  +0.25% FD Yield Modifier
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#A8742A] text-white text-[10px] font-mono font-bold rounded">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Cumulative Real-Time Yield Boost Card */}
        <div className="p-4 bg-[#022448] text-white rounded-xl space-y-2 border border-[#1E3A5F]">
          <div className="text-[10px] font-mono uppercase text-[#C8DFDB]">
            Total Active Compound Boost
          </div>
          <div className="text-xs font-semibold text-[#F9BB6A] font-mono flex flex-wrap gap-2">
            <span>+0.25% FD APY</span> • <span>-40% DvP Surcharge</span> • <span>Zero Wire Fees</span>
          </div>
          <p className="text-[11px] text-[#F2EFE7]/80 leading-relaxed font-sans">
            All modifiers calculate at epoch boundary (UTC 00:00:00). Directly disbursed into NAVA Sovereign Payroll.
          </p>
        </div>
      </div>

      {/* Right Column: Enclave Frames Marketplace (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-[#74777F]/20 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="border-b border-[#74777F]/15 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-semibold text-[#121C28] text-base">
              Enclave Frames &amp; Cryptographic Skins
            </h3>
            <p className="text-xs text-[#43474E] font-sans">
              Immutable presentation layers minted to your sovereign identity address
            </p>
          </div>
          <span className="text-xs font-mono text-[#A8742A] font-medium">
            Shop Season: Cycle 24/28
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {FRAMES.map((frame) => {
            const isEquipped = frame.isEquipped;
            const isRestricted = frame.isRestricted;

            return (
              <div
                key={frame.id}
                className={`border rounded-xl p-3.5 flex flex-col justify-between transition-colors ${
                  isEquipped
                    ? 'bg-[#F8F9FF] border-[#022448]/30'
                    : isRestricted
                    ? 'bg-[#F8F9FF]/60 border-[#74777F]/15 opacity-75'
                    : 'bg-white border-[#74777F]/20 hover:border-[#A8742A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        frame.rarity === 'Gold'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : frame.rarity === 'Epic'
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : frame.rarity === 'Rare'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : frame.rarity === 'Restricted'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {frame.rarity.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-[#74777F]">{frame.code}</span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#022448] to-[#1E3A5F] p-1 flex items-center justify-center shrink-0 shadow-2xs">
                      <Image
                        src={frame.image}
                        alt={frame.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-[#121C28] text-xs">
                        {frame.name}
                      </h4>
                      <p className="text-[11px] text-[#43474E] line-clamp-2 leading-tight mt-0.5">
                        {frame.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-[#74777F]/15 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#121C28]">
                    <AnimatedMaskedValue
                      value={frame.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      isMasked={isMasked}
                      currency="ARTH"
                    />
                  </span>

                  {isEquipped ? (
                    <span className="text-[11px] font-mono font-semibold bg-[#C8DFDB] text-[#022448] px-2.5 py-1 rounded">
                      Equipped
                    </span>
                  ) : isRestricted ? (
                    <span className="text-[11px] font-sans font-semibold bg-[#74777F]/10 text-[#74777F] px-2 py-1 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Tier 4 Req</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onAcquireFrame({
                          id: frame.id,
                          name: frame.name,
                          type: 'Cryptographic Frame',
                          price: frame.price,
                          image: frame.image,
                          rarity: frame.rarity,
                        })
                      }
                      className="text-[11px] font-sans font-semibold bg-[#022448] hover:bg-[#1E3A5F] text-white px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Acquire
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
