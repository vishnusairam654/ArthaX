'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Sparkles, UserCheck, Image as ImageIcon, Lock, Check, ArrowRightLeft, TrendingUp, Zap, Percent, RefreshCw } from 'lucide-react';
import { ShopItem, EquippedLoadout, FINANCIAL_PETS, CITIZEN_AVATARS, SOVEREIGN_FRAMES, SOVEREIGN_BANNERS, RARITY_CONFIG } from './ShopData';

interface ShopActiveVaultSectionProps {
  loadout: EquippedLoadout;
  ownedItemIds: string[];
  isMasked?: boolean;
  onEquipItem: (item: ShopItem) => void;
  onUnequipItem: (item: ShopItem) => void;
  onNavigateCategory: (category: 'pets' | 'avatars' | 'frames' | 'banners') => void;
}

export function ShopActiveVaultSection({
  loadout,
  ownedItemIds,
  isMasked = false,
  onEquipItem,
  onUnequipItem,
  onNavigateCategory,
}: ShopActiveVaultSectionProps) {
  const [inventoryCategory, setInventoryCategory] = useState<'all' | 'pets' | 'avatars' | 'frames' | 'banners'>('all');

  // Look up equipped items
  const equippedFrame = SOVEREIGN_FRAMES.find((f) => f.id === loadout.frameId) || SOVEREIGN_FRAMES[0];
  const equippedAvatar = CITIZEN_AVATARS.find((a) => a.id === loadout.avatarId) || CITIZEN_AVATARS[0];
  const equippedBanner = SOVEREIGN_BANNERS.find((b) => b.id === loadout.bannerId) || SOVEREIGN_BANNERS[0];
  const equippedPet = FINANCIAL_PETS.find((p) => p.id === loadout.petId) || FINANCIAL_PETS[3];

  // Combine all items to find all owned items
  const allItems: ShopItem[] = [
    ...FINANCIAL_PETS,
    ...CITIZEN_AVATARS,
    ...SOVEREIGN_FRAMES,
    ...SOVEREIGN_BANNERS,
  ];

  const ownedItems = allItems.filter((item) => ownedItemIds.includes(item.id));

  const filteredOwnedItems = ownedItems.filter((item) => {
    if (inventoryCategory === 'pets') return item.category === 'pet';
    if (inventoryCategory === 'avatars') return item.category === 'avatar';
    if (inventoryCategory === 'frames') return item.category === 'frame';
    if (inventoryCategory === 'banners') return item.category === 'banner';
    return true;
  });

  // Calculate total Vault Net Asset Value (NAV)
  const totalNav = ownedItems.reduce((sum, item) => sum + item.price, 0);

  // Dynamic yields based on equipped pet
  let activeFdYield = '+0.25% FD APY';
  let activeSecondaryPower = 'Continuous Ledger Stasis';

  if (equippedPet?.id === 'pet-gaja') {
    activeFdYield = '+1.25% Sovereign FD APY';
    activeSecondaryPower = 'SETU Auto-Sweep Daemon';
  } else if (equippedPet?.id === 'pet-vrishabha') {
    activeFdYield = '-50% Equities Brokerage';
    activeSecondaryPower = 'Instant Depth Queue';
  } else if (equippedPet?.id === 'pet-lopamudra') {
    activeFdYield = '+15% DvP Transfer Cashback';
    activeSecondaryPower = 'Daily Micro-Reward Sweep';
  } else if (equippedPet?.id === 'pet-vidya') {
    activeFdYield = '+0.25% FD Yield Booster';
    activeSecondaryPower = 'Real-Time Stock Analytics Feed';
  } else if (equippedPet?.id === 'pet-baka') {
    activeFdYield = 'Zero Gas on Interbank Clears';
    activeSecondaryPower = 'Sub-200ms Finality';
  } else if (equippedPet?.id === 'pet-jala') {
    activeFdYield = '+1.0% Outflow Cashback';
    activeSecondaryPower = 'Commercial Card Rebates';
  } else if (equippedPet?.id === 'pet-kurma') {
    activeFdYield = 'Zero Early Liquidation Penalty';
    activeSecondaryPower = 'FD Principal Immunity';
  } else if (equippedPet?.id === 'pet-marjara') {
    activeFdYield = 'Zero-Latency CB SMS Enclave';
    activeSecondaryPower = 'Consensus Inscriptions';
  }

  return (
    <section className="space-y-6" id="section-vault">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-[#A8742A] uppercase tracking-widest font-bold">
            <Lock className="w-4 h-4 text-[#A8742A]" />
            <span>Cryptographic Custody Engine</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#022448] mt-0.5">
            Active Vault &amp; Resident Loadout
          </h2>
          <p className="font-sans text-xs text-slate-600 mt-0.5">
            Live configuration attached to the Settlement Engine. Modifiers compound automatically at epoch boundaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Vault Net Asset Value</span>
            <span className="font-mono text-sm font-bold text-[#022448]">
              {isMasked ? '•••••••• ARTH' : `${totalNav.toLocaleString('en-US')} ARTH`}
            </span>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold rounded-lg flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SETU SYNCED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 5 Cols - Visual Loadout Stack & Yield Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A8742A]" />
              <span>Equipped Sovereign Loadout</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">4 Sockets Active</span>
          </div>

          {/* Sockets Stack */}
          <div className="space-y-3">
            {/* Slot 1: Cryptographic Frame */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/80">
              <div className="flex items-center space-x-3">
                <div className="relative w-11 h-11 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src={equippedFrame.image}
                    alt={equippedFrame.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Cryptographic Frame</span>
                  <span className="font-serif font-semibold text-slate-900 text-xs line-clamp-1">
                    {equippedFrame.name}
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-medium">
                    Active • Tier {equippedFrame.rarity.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateCategory('frames')}
                className="text-xs text-[#022448] hover:text-[#A8742A] font-semibold underline cursor-pointer"
              >
                Swap
              </button>
            </div>

            {/* Slot 2: Citizen Persona */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/80">
              <div className="flex items-center space-x-3">
                <div className="relative w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src={equippedAvatar.image}
                    alt={equippedAvatar.name}
                    width={36}
                    height={36}
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Citizen Identity</span>
                  <span className="font-serif font-semibold text-slate-900 text-xs line-clamp-1">
                    {equippedAvatar.name}
                  </span>
                  <span className="block text-[10px] text-blue-700 font-medium">
                    {equippedAvatar.accreditation || equippedAvatar.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateCategory('avatars')}
                className="text-xs text-[#022448] hover:text-[#A8742A] font-semibold underline cursor-pointer"
              >
                Swap
              </button>
            </div>

            {/* Slot 3: Enclave Backdrop / Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/80">
              <div className="flex items-center space-x-3">
                <div className="relative w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src={equippedBanner.image}
                    alt={equippedBanner.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Enclave Backdrop</span>
                  <span className="font-serif font-semibold text-slate-900 text-xs line-clamp-1">
                    {equippedBanner.name}
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-medium">
                    Prestige Ledger Silk
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateCategory('banners')}
                className="text-xs text-[#022448] hover:text-[#A8742A] font-semibold underline cursor-pointer"
              >
                Swap
              </button>
            </div>

            {/* Slot 4: Financial Pet Companion */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDF8F0] border border-[#A8742A]/30">
              <div className="flex items-center space-x-3">
                <div className="relative w-11 h-11 rounded-lg bg-white border border-[#A8742A]/30 flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src={equippedPet.image}
                    alt={equippedPet.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#A8742A] block uppercase font-bold">
                    Companion Slot #1
                  </span>
                  <span className="font-serif font-semibold text-slate-900 text-xs line-clamp-1">
                    {equippedPet.name}
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-mono font-semibold">
                    {equippedPet.powerTitle}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateCategory('pets')}
                className="text-xs text-[#A8742A] hover:text-[#8C5E1F] font-semibold underline cursor-pointer"
              >
                Swap
              </button>
            </div>
          </div>

          {/* Cumulative Real-Time Yield Calculation Card */}
          <div className="p-4 bg-[#022448] text-white rounded-xl space-y-2 border border-[#1E3A5F] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#C8DFDB]">
                Total Active Compound Boost
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="text-xs font-semibold text-[#E9D9BE] font-mono flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-white/10 rounded-md">{activeFdYield}</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-md">{activeSecondaryPower}</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-md">Zero Wire Fees</span>
            </div>

            <p className="font-sans text-[11px] text-[#C8DFDB] leading-relaxed pt-1">
              All modifiers calculate at epoch boundary (UTC 00:00:00). Directly disbursed into NAVA Sovereign Payroll.
            </p>
          </div>
        </div>

        {/* Right Column: 7 Cols - Owned Inventory Browser */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-base">
                Depository Inventory ({ownedItems.length} Items Owned)
              </h3>
              <p className="font-sans text-xs text-slate-500">
                Manage and toggle your authenticated sovereign artifacts
              </p>
            </div>

            {/* Inventory Category Filter */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-slate-200/80 font-sans text-xs">
              <button
                type="button"
                onClick={() => setInventoryCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  inventoryCategory === 'all'
                    ? 'bg-[#022448] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setInventoryCategory('pets')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  inventoryCategory === 'pets'
                    ? 'bg-[#022448] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pets
              </button>
              <button
                type="button"
                onClick={() => setInventoryCategory('avatars')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  inventoryCategory === 'avatars'
                    ? 'bg-[#022448] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Personas
              </button>
              <button
                type="button"
                onClick={() => setInventoryCategory('frames')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  inventoryCategory === 'frames'
                    ? 'bg-[#022448] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Frames
              </button>
              <button
                type="button"
                onClick={() => setInventoryCategory('banners')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  inventoryCategory === 'banners'
                    ? 'bg-[#022448] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Banners
              </button>
            </div>
          </div>

          {/* Owned Items Grid */}
          {filteredOwnedItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Lock className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-sans text-sm">No items owned in this category yet.</p>
              <button
                type="button"
                onClick={() => onNavigateCategory(inventoryCategory === 'all' ? 'pets' : inventoryCategory)}
                className="font-sans text-xs text-[#022448] hover:underline font-semibold"
              >
                Browse Marketplace to Acquire &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredOwnedItems.map((item) => {
                const isEquipped =
                  loadout.frameId === item.id ||
                  loadout.avatarId === item.id ||
                  loadout.bannerId === item.id ||
                  loadout.petId === item.id;

                const rarityMeta = RARITY_CONFIG[item.rarity];

                return (
                  <div
                    key={item.id}
                    className={`border rounded-xl p-3.5 transition-all flex flex-col justify-between ${
                      isEquipped
                        ? 'border-[#A8742A] bg-[#FDF8F0]/30 shadow-xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${rarityMeta.badgeClass}`}
                        >
                          {item.category.toUpperCase()} • {rarityMeta.name}
                        </span>

                        {isEquipped ? (
                          <span className="text-[10px] font-bold text-[#A8742A] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            Equipped
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">
                            Owned
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200/60">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={44}
                            height={44}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 text-xs line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="font-sans text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.powerTitle || item.powerDescription || item.role || 'Cryptographic Asset'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#022448]">
                        {isMasked ? '•••• ARTH' : `${item.price.toLocaleString('en-US')} ARTH`}
                      </span>

                      {isEquipped ? (
                        <button
                          type="button"
                          onClick={() => onUnequipItem(item)}
                          className="text-[11px] font-sans font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 transition-colors cursor-pointer"
                        >
                          Unequip
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onEquipItem(item)}
                          className="text-[11px] font-sans font-semibold px-3 py-1 rounded-lg bg-[#022448] hover:bg-[#1E3A5F] text-white transition-colors cursor-pointer shadow-xs"
                        >
                          Equip
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
