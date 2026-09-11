'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Image as ImageIcon, Eye, Check, Sparkles } from 'lucide-react';
import { ShopItem, RARITY_CONFIG } from './ShopData';

interface ShopFramesBannersSectionProps {
  frames: ShopItem[];
  banners: ShopItem[];
  isMasked?: boolean;
  equippedFrameId?: string;
  equippedBannerId?: string;
  ownedItemIds: string[];
  onAcquire: (item: ShopItem) => void;
  onInspect: (item: ShopItem) => void;
  onEquipFrame: (item: ShopItem) => void;
  onUnequipFrame: (item: ShopItem) => void;
  onEquipBanner: (item: ShopItem) => void;
  onUnequipBanner: (item: ShopItem) => void;
}

export function ShopFramesBannersSection({
  frames,
  banners,
  isMasked = false,
  equippedFrameId,
  equippedBannerId,
  ownedItemIds,
  onAcquire,
  onInspect,
  onEquipFrame,
  onUnequipFrame,
  onEquipBanner,
  onUnequipBanner,
}: ShopFramesBannersSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'frames' | 'banners'>('all');

  return (
    <div className="space-y-8" id="section-frames-banners">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-purple-700 uppercase tracking-widest font-bold">
            <Shield className="w-4 h-4 text-purple-700" />
            <span>Aesthetic Adornments &amp; Enclaves</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#022448] mt-0.5">
            Prestige Frames &amp; Royal Banners
          </h2>
          <p className="font-sans text-xs text-slate-600 mt-0.5">
            Archival guilloche borders and panoramic trading floor backdrops certified for citizen profiles.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-slate-200/80 font-sans text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#022448] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All (21)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('frames')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'frames'
                ? 'bg-[#022448] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Frames (7)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-[#022448] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Banners (14)
          </button>
        </div>
      </div>

      {/* Frames Showcase */}
      {(activeTab === 'all' || activeTab === 'frames') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#022448] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#A8742A]" />
              <span>Sovereign Enclave Frames ({frames.length})</span>
            </h3>
            <span className="font-mono text-xs text-slate-400">AGENTS.md Verified Tiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {frames.map((frame) => {
              const isEquipped = equippedFrameId === frame.id;
              const isOwned = ownedItemIds.includes(frame.id);
              const rarityMeta = RARITY_CONFIG[frame.rarity];

              return (
                <article
                  key={frame.id}
                  className={`group bg-white rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between relative border shadow-xs hover:shadow-md ${
                    isEquipped
                      ? 'border-[#A8742A] ring-2 ring-[#A8742A]/20 bg-[#FDF8F0]/30'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <span
                        className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${rarityMeta.badgeClass}`}
                      >
                        {rarityMeta.name} Frame
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
                        <span className="font-mono text-[10px] text-slate-400">
                          {frame.dimensions || '512x512'}
                        </span>
                      )}
                    </div>

                    {/* Frame Visual Display */}
                    <div className="relative rounded-xl bg-gradient-to-b from-[#F4EDE0]/50 to-[#FAF8F5] p-3 flex items-center justify-center min-h-[140px] border border-slate-100 mb-3 overflow-hidden">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <Image
                          src={frame.image}
                          alt={frame.name}
                          fill
                          sizes="112px"
                          className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="w-12 h-12 rounded-full bg-slate-900/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[#A8742A]" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-[#022448] transition-colors">
                        {frame.name}
                      </h4>
                      <p className="font-sans text-xs text-slate-500 leading-snug line-clamp-2">
                        {frame.powerDescription || 'Archival presentation skin bound to citizen identity address.'}
                      </p>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-1.5">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Mint</span>
                      <span className="font-mono font-bold text-[#022448] text-xs">
                        {isMasked ? '•••• ARTH' : `${frame.price.toLocaleString('en-US')} ARTH`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onInspect(frame)}
                        title="Inspect Frame"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isEquipped ? (
                        <button
                          type="button"
                          onClick={() => onUnequipFrame(frame)}
                          className="text-xs font-sans font-semibold px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Unequip
                        </button>
                      ) : isOwned ? (
                        <button
                          type="button"
                          onClick={() => onEquipFrame(frame)}
                          className="text-xs font-sans font-semibold px-3 py-1.5 bg-[#A8742A] hover:bg-[#8C5E1F] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAcquire(frame)}
                          className="bg-[#022448] hover:bg-[#1E3A5F] text-white text-xs font-sans font-semibold px-2.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer active:translate-y-0.5"
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
        </div>
      )}

      {/* Royal Banners Showcase */}
      {(activeTab === 'all' || activeTab === 'banners') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#022448] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Royal Panoramas &amp; Trading Banners ({banners.length})</span>
            </h3>
            <span className="font-mono text-xs text-slate-400">Archival Settlement Backdrops</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {banners.map((banner) => {
              const isEquipped = equippedBannerId === banner.id;
              const isOwned = ownedItemIds.includes(banner.id);
              const rarityMeta = RARITY_CONFIG[banner.rarity];

              return (
                <article
                  key={banner.id}
                  className={`group bg-white rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between relative border shadow-xs hover:shadow-md ${
                    isEquipped
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/15'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <span
                        className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${rarityMeta.badgeClass}`}
                      >
                        {rarityMeta.name} Banner
                      </span>

                      {isEquipped ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Equipped
                        </span>
                      ) : isOwned ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          Owned
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-slate-400">
                          {banner.dimensions || '1920x640'}
                        </span>
                      )}
                    </div>

                    {/* Panoramic Image Container */}
                    <div className="relative rounded-xl overflow-hidden aspect-[21/9] border border-slate-200/80 mb-3 bg-[#022448]">
                      <Image
                        src={banner.image}
                        alt={banner.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 text-[10px] font-sans font-bold text-white/90 drop-shadow">
                        {banner.name}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-[#022448] transition-colors">
                        {banner.name}
                      </h4>
                      <p className="font-sans text-xs text-slate-500 leading-snug line-clamp-2">
                        {banner.powerDescription || 'Archival trading floor twilight and central bank vault gilded halls.'}
                      </p>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-1.5">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Mint</span>
                      <span className="font-mono font-bold text-[#022448] text-xs">
                        {isMasked ? '•••• ARTH' : `${banner.price.toLocaleString('en-US')} ARTH`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onInspect(banner)}
                        title="Inspect Banner"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isEquipped ? (
                        <button
                          type="button"
                          onClick={() => onUnequipBanner(banner)}
                          className="text-xs font-sans font-semibold px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Unequip
                        </button>
                      ) : isOwned ? (
                        <button
                          type="button"
                          onClick={() => onEquipBanner(banner)}
                          className="text-xs font-sans font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAcquire(banner)}
                          className="bg-[#022448] hover:bg-[#1E3A5F] text-white text-xs font-sans font-semibold px-2.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer active:translate-y-0.5"
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
        </div>
      )}
    </div>
  );
}
