'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Lock, CheckCircle2, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

export interface CompanionEntity {
  id: string;
  name: string;
  tier: string;
  subtitle: string;
  image: string;
  power: string;
  price: number;
  status: 'available' | 'equipped' | 'owned';
}

interface GuardianCompanionsSectionProps {
  isMasked: boolean;
  onAcquire: (item: { id: string; name: string; type: string; price: number; image: string; power: string }) => void;
}

const COMPANIONS: CompanionEntity[] = [
  {
    id: 'comp-elephant',
    name: 'Gaja King Elephant',
    tier: 'Airavata Tier',
    subtitle: 'Institutional Reserve Tier',
    image: '/assets/shop/pets/Wealth Elephant/thumbnail.png',
    power: '+0.50% APY across all Bank Fixed Deposits & +10% Stasis Yield',
    price: 12500,
    status: 'available',
  },
  {
    id: 'comp-turtle',
    name: 'Kurma Scholar Turtle',
    tier: 'Sthira Tier',
    subtitle: 'Liquidity Defense',
    image: '/assets/shop/pets/Tax Tortoise/thumbnail.png',
    power: 'Zero Penalty on Early FD Liquidation (up to 50k ARTH)',
    price: 8200,
    status: 'available',
  },
  {
    id: 'comp-crane',
    name: 'Baka Celestial Crane',
    tier: 'Tarang Tier',
    subtitle: 'High-Velocity DvP',
    image: '/assets/shop/pets/Settlement Crane/thumbnail.png',
    power: 'Sub-200ms Priority CLS Finality & 0% Cross-Bank Wire Stamp',
    price: 9400,
    status: 'available',
  },
  {
    id: 'comp-owl',
    name: 'Vidya Sage Owl (Samaya)',
    tier: 'Samaya Tier',
    subtitle: 'Slot 1 Modifier Attached',
    image: '/assets/shop/pets/Ledger Owl/thumbnail.png',
    power: '+0.25% FD Yield Booster & Real-Time Stock Analytics Feed',
    price: 0,
    status: 'equipped',
  },
  {
    id: 'comp-bull',
    name: 'Vrishabha Apex Bull',
    tier: 'Meru Tier',
    subtitle: 'Equities Accelerator',
    image: '/assets/shop/pets/Market Bull/thumbnail.png',
    power: '-40% Stock Market Trading Fees & Priority Order Matching',
    price: 11000,
    status: 'available',
  },
  {
    id: 'comp-fox',
    name: 'Lopamudra Mystic Fox',
    tier: 'Vault Guardian',
    subtitle: 'Yield Automation',
    image: '/assets/shop/pets/Saver Fox/thumbnail.png',
    power: 'Automated Yield Harvesting & Daily +5 ARTH Civic Bounty',
    price: 7500,
    status: 'available',
  },
  {
    id: 'comp-otter',
    name: 'Jala Playful Otter',
    tier: 'Stream Tier',
    subtitle: 'Cashflow Booster',
    image: '/assets/shop/pets/Flow Otter/thumbnail.png',
    power: '+1.0% Cashback on All Commercial Bank Card Outflows',
    price: 6800,
    status: 'available',
  },
  {
    id: 'comp-cat',
    name: 'Marjara Mail Cat',
    tier: 'Audit Tier',
    subtitle: 'Communication Enclave',
    image: '/assets/shop/pets/Archive Cat/thumbnail.png',
    power: 'Zero-Latency Central Bank Notices & SMS Enclave Dispatch',
    price: 5200,
    status: 'available',
  },
];

export const GuardianCompanionsSection: React.FC<GuardianCompanionsSectionProps> = ({
  isMasked,
  onAcquire,
}) => {
  const [items, setItems] = useState<CompanionEntity[]>(COMPANIONS);
  const [sortBy, setSortBy] = useState('multiplier');

  const handleToggleEquip = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'equipped' ? 'owned' : 'equipped',
          };
        }
        return item;
      })
    );
  };

  return (
    <section className="space-y-4 mb-10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#74777F]/20 pb-3">
        <div>
          <h2 className="font-serif text-lg md:text-xl font-medium text-[#121C28] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#A8742A]" />
            <span>Guardian Companions &amp; Active Yield Modifiers</span>
          </h2>
          <p className="text-xs text-[#43474E] font-sans">
            Cryptographically bound sovereign companions providing continuous mathematical interest and fee reductions
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#43474E]">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-mono bg-white border border-[#74777F]/20 rounded-lg py-1 px-2.5 text-[#121C28] focus:outline-hidden focus:border-[#1E3A5F]"
          >
            <option value="multiplier">Highest Yield Multiplier</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
            <option value="rarity">Rarity Tier</option>
          </select>
        </div>
      </div>

      {/* 8 Companions Architectural Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((comp) => {
          const isEquipped = comp.status === 'equipped';

          return (
            <article
              key={comp.id}
              className={`rounded-2xl p-4 transition-all flex flex-col justify-between relative group ${
                isEquipped
                  ? 'bg-[#F2EFE7]/50 border-2 border-[#A8742A] shadow-md'
                  : 'bg-white border border-[#74777F]/20 hover:border-[#1E3A5F]/40 shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Rarity Tier Pill */}
              <div className="absolute top-3 right-3 z-10">
                {isEquipped ? (
                  <span className="bg-[#A8742A] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
                    Equipped Active
                  </span>
                ) : (
                  <span className="bg-[#E5EFFF] text-[#022448] text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#74777F]/15">
                    {comp.tier}
                  </span>
                )}
              </div>

              <div>
                {/* Companion Artwork Container */}
                <div className="w-full aspect-square bg-gradient-to-b from-[#F8F9FF] to-[#E5EFFF]/40 rounded-xl overflow-hidden flex items-center justify-center p-4 mb-3 border border-[#74777F]/10 relative">
                  <Image
                    src={comp.image}
                    alt={comp.name}
                    width={180}
                    height={180}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider block">
                    {comp.subtitle}
                  </span>
                  <h3 className="font-serif font-semibold text-[#121C28] text-sm">
                    {comp.name}
                  </h3>

                  <div className="bg-[#F8F9FF] border border-[#74777F]/15 text-[#022448] p-2.5 rounded-lg text-xs leading-snug my-2 font-sans">
                    <strong className="text-[#A8742A] block text-[10px] uppercase font-mono mb-0.5">
                      Active Power:
                    </strong>
                    {comp.power}
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-3 border-t border-[#74777F]/15 mt-2 flex items-center justify-between">
                {isEquipped ? (
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold block">
                      CURRENTLY ACTIVE
                    </span>
                    <span className="font-mono text-xs text-[#43474E]">[SLOT 1 / 2]</span>
                  </div>
                ) : comp.status === 'owned' ? (
                  <div>
                    <span className="text-[10px] font-mono text-[#1E3A5F] font-semibold block">
                      IN CITIZEN VAULT
                    </span>
                    <span className="font-mono text-xs text-[#74777F]">Ready to Equip</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] font-mono text-[#74777F] block">Protocol Price</span>
                    <span className="font-mono font-bold text-[#121C28] text-sm">
                      <AnimatedMaskedValue
                        value={comp.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        isMasked={isMasked}
                        currency="ARTH"
                      />
                    </span>
                  </div>
                )}

                <div>
                  {isEquipped ? (
                    <button
                      type="button"
                      onClick={() => handleToggleEquip(comp.id)}
                      className="bg-white hover:bg-rose-50 text-[#BA1A1A] border border-[#74777F]/20 text-xs font-sans font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Unequip
                    </button>
                  ) : comp.status === 'owned' ? (
                    <button
                      type="button"
                      onClick={() => handleToggleEquip(comp.id)}
                      className="bg-[#022448] hover:bg-[#1E3A5F] text-white text-xs font-sans font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Equip
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onAcquire({
                          id: comp.id,
                          name: comp.name,
                          type: 'Guardian Companion',
                          price: comp.price,
                          image: comp.image,
                          power: comp.power,
                        })
                      }
                      className="bg-[#022448] hover:bg-[#1E3A5F] text-white text-xs font-sans font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Lock className="w-3 h-3 text-[#F9BB6A]" />
                      <span>Acquire</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
