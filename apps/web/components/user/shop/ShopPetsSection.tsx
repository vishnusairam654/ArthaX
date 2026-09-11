'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Eye, Check, ShieldCheck, Zap, TrendingUp, Percent, ArrowLeftRight, Clock, Scale, Mail } from 'lucide-react';
import { ShopItem, RARITY_CONFIG } from './ShopData';

interface ShopPetsSectionProps {
  pets: ShopItem[];
  isMasked?: boolean;
  equippedPetId?: string;
  ownedItemIds: string[];
  onAcquire: (item: ShopItem) => void;
  onInspect: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  onUnequip: (item: ShopItem) => void;
}

export function ShopPetsSection({
  pets,
  isMasked = false,
  equippedPetId,
  ownedItemIds,
  onAcquire,
  onInspect,
  onEquip,
  onUnequip,
}: ShopPetsSectionProps) {
  // Helper to pick matching icon for financial power
  const getPowerIcon = (petId: string) => {
    switch (petId) {
      case 'pet-gaja':
        return <TrendingUp className="w-3.5 h-3.5 text-[#A8742A]" />;
      case 'pet-vrishabha':
        return <Zap className="w-3.5 h-3.5 text-indigo-600" />;
      case 'pet-lopamudra':
        return <Percent className="w-3.5 h-3.5 text-purple-600" />;
      case 'pet-vidya':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
      case 'pet-baka':
        return <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />;
      case 'pet-jala':
        return <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-600" />;
      case 'pet-kurma':
        return <Scale className="w-3.5 h-3.5 text-emerald-600" />;
      case 'pet-marjara':
        return <Mail className="w-3.5 h-3.5 text-violet-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />;
    }
  };

  return (
    <section className="space-y-4" id="section-pets">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-[#A8742A] uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4 text-[#A8742A]" />
            <span>Active Yield Protocol</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#022448] mt-0.5">
            Sovereign Financial Companions
          </h2>
          <p className="font-sans text-xs text-slate-600 mt-0.5">
            Cryptographically bound sovereign companions providing continuous mathematical interest and fee reductions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-sans font-semibold rounded-lg flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Auto-Compound Active
          </span>
        </div>
      </div>

      {/* 8 Companions Architectural Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pets.map((pet) => {
          const isEquipped = equippedPetId === pet.id;
          const isOwned = ownedItemIds.includes(pet.id);
          const rarityMeta = RARITY_CONFIG[pet.rarity];

          return (
            <article
              key={pet.id}
              className={`group bg-white rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between relative border shadow-xs hover:shadow-md ${
                isEquipped
                  ? 'border-[#A8742A] ring-2 ring-[#A8742A]/20 bg-[#FDF8F0]/40'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-1 mb-2.5">
                <span
                  className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${rarityMeta.badgeClass}`}
                >
                  {rarityMeta.name} Tier
                </span>

                {isEquipped ? (
                  <span className="bg-[#A8742A] text-white text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Equipped
                  </span>
                ) : isOwned ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Owned
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-slate-400 font-semibold">
                    {pet.rank}
                  </span>
                )}
              </div>

              {/* Inset Image Box */}
              <div>
                <div className="relative w-full aspect-square bg-gradient-to-b from-[#F4EDE0]/60 to-[#FAF8F5] rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 border border-slate-100">
                  <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur rounded text-[10px] font-sans font-semibold text-slate-600 shadow-xs">
                    {pet.role}
                  </div>
                </div>

                {/* Name & Power */}
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-[#022448] transition-colors">
                    {pet.name}
                  </h3>

                  <div className="bg-[#FAF8F5] border border-slate-200/80 p-2.5 rounded-xl text-xs leading-snug space-y-1">
                    <div className="font-sans font-bold text-slate-800 flex items-center gap-1.5">
                      {getPowerIcon(pet.id)}
                      <span className="text-[11px] font-semibold text-slate-700">Financial Modifier</span>
                    </div>
                    <p className="font-sans text-[11px] text-slate-600">
                      {pet.powerTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Protocol Mint</span>
                  <span className="font-mono font-bold text-[#022448] text-sm">
                    {isMasked ? '•••• ARTH' : `${pet.price.toLocaleString('en-US')} ARTH`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onInspect(pet)}
                    title="Inspect details"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {isEquipped ? (
                    <button
                      type="button"
                      onClick={() => onUnequip(pet)}
                      className="text-xs font-sans font-semibold px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Unequip
                    </button>
                  ) : isOwned ? (
                    <button
                      type="button"
                      onClick={() => onEquip(pet)}
                      className="text-xs font-sans font-semibold px-3 py-1.5 bg-[#A8742A] hover:bg-[#8C5E1F] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Equip
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAcquire(pet)}
                      className="bg-[#022448] hover:bg-[#1E3A5F] text-white text-xs font-sans font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-xs cursor-pointer active:translate-y-0.5"
                    >
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
}
