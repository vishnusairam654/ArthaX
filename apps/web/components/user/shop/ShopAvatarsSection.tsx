'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserCheck, Gift, Eye, Check } from 'lucide-react';
import { ShopItem, RARITY_CONFIG } from './ShopData';

interface ShopAvatarsSectionProps {
  avatars: ShopItem[];
  isMasked?: boolean;
  equippedAvatarId?: string;
  ownedItemIds: string[];
  onAcquire: (item: ShopItem) => void;
  onInspect: (item: ShopItem) => void;
  onGift: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  onUnequip: (item: ShopItem) => void;
}

export function ShopAvatarsSection({
  avatars,
  isMasked = false,
  equippedAvatarId,
  ownedItemIds,
  onAcquire,
  onInspect,
  onGift,
  onEquip,
  onUnequip,
}: ShopAvatarsSectionProps) {
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');

  const filteredAvatars = avatars.filter((av) => {
    if (genderFilter === 'female') return av.gender === 'female';
    if (genderFilter === 'male') return av.gender === 'male';
    return true;
  });

  return (
    <section className="space-y-4" id="section-avatars">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-[#1E3A5F] uppercase tracking-widest font-bold">
            <UserCheck className="w-4 h-4 text-[#1E3A5F]" />
            <span>Verified Citizen Persona Mint</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#022448] mt-0.5">
            Citizen Personas &amp; Diplomatic Identities
          </h2>
          <p className="font-sans text-xs text-slate-600 mt-0.5">
            Certified executive couture and sovereign investor portraits registered on the national mint standard.
          </p>
        </div>

        {/* Gender Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-slate-200/80 font-sans text-xs">
          <button
            type="button"
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              genderFilter === 'all'
                ? 'bg-[#022448] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All (16)
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('female')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              genderFilter === 'female'
                ? 'bg-[#022448] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Female (8)
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('male')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              genderFilter === 'male'
                ? 'bg-[#022448] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Male (8)
          </button>
        </div>
      </div>

      {/* Avatars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredAvatars.map((avatar) => {
          const isEquipped = equippedAvatarId === avatar.id;
          const isOwned = ownedItemIds.includes(avatar.id);
          const rarityMeta = RARITY_CONFIG[avatar.rarity];

          return (
            <article
              key={avatar.id}
              className={`group bg-white rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between relative border shadow-xs hover:shadow-md ${
                isEquipped
                  ? 'border-[#1E3A5F] ring-2 ring-[#1E3A5F]/20 bg-blue-50/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header Tag & ID */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span
                    className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${rarityMeta.badgeClass}`}
                  >
                    {rarityMeta.name} Persona
                  </span>

                  {isEquipped ? (
                    <span className="bg-[#1E3A5F] text-white text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  ) : isOwned ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Owned
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {avatar.gender}
                    </span>
                  )}
                </div>

                {/* Aspect 4/5 Image Inset Box */}
                <div className="relative rounded-xl bg-gradient-to-b from-[#F4EDE0]/50 to-[#FAF8F5] overflow-hidden aspect-[4/5] flex items-center justify-center border border-slate-100 mb-3">
                  <Image
                    src={avatar.image}
                    alt={avatar.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022448]/75 via-transparent to-transparent pointer-events-none" />

                  {/* Attire Specification Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="font-sans text-[10px] uppercase tracking-wider text-[#C59A45] font-bold block">
                      Attire Spec
                    </span>
                    <p className="font-sans text-[11px] text-white/95 leading-tight line-clamp-2">
                      {avatar.attireSpec || 'Bespoke sovereign attire & diplomatic insignias'}
                    </p>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-[#022448] transition-colors">
                    {avatar.name}
                  </h3>
                  <p className="font-sans text-xs text-slate-500 leading-snug">
                    {avatar.accreditation || avatar.role}
                  </p>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-1.5">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Mint Price</span>
                  <span className="font-mono font-bold text-[#022448] text-sm">
                    {isMasked ? '•••• ARTH' : `${avatar.price.toLocaleString('en-US')} ARTH`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onInspect(avatar)}
                    title="Inspect details"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onGift(avatar)}
                    title="Gift to Citizen"
                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#A8742A] transition-colors cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                  </button>

                  {isEquipped ? (
                    <button
                      type="button"
                      onClick={() => onUnequip(avatar)}
                      className="text-xs font-sans font-semibold px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Unequip
                    </button>
                  ) : isOwned ? (
                    <button
                      type="button"
                      onClick={() => onEquip(avatar)}
                      className="text-xs font-sans font-semibold px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#022448] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Equip
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAcquire(avatar)}
                      className="bg-[#022448] hover:bg-[#1E3A5F] text-white text-xs font-sans font-semibold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer active:translate-y-0.5"
                    >
                      Acquire
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
