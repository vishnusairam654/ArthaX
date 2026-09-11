'use client';

import React from 'react';
import { Sparkles, UserCheck, Shield, Image as ImageIcon, Search, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { ShopCategory, RarityTier } from './ShopData';

interface ShopDepartmentalBarProps {
  activeCategory: ShopCategory;
  onSelectCategory: (category: ShopCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRarity: RarityTier | 'all';
  onSelectRarity: (rarity: RarityTier | 'all') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  ownedCount: number;
}

export function ShopDepartmentalBar({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedRarity,
  onSelectRarity,
  sortBy,
  onSortChange,
  ownedCount,
}: ShopDepartmentalBarProps) {
  return (
    <div className="space-y-6">
      {/* 4 Quick Access Departmental Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-0.5">
            <span className="font-sans text-[11px] text-[#A8742A] uppercase tracking-widest font-bold">
              Treasury Portals
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#022448]">
              Departmental Stores
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 font-sans text-xs text-slate-500">
            <span>Curated Vault Registry</span>
            <CheckCircle2 className="w-4 h-4 text-[#A8742A]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pet Store Card */}
          <div
            onClick={() => onSelectCategory('pets')}
            className={`group bg-white hover:bg-[#FAF8F5] rounded-xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${
              activeCategory === 'pets'
                ? 'border-[#A8742A] ring-2 ring-[#A8742A]/20 bg-[#FDF8F0]'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8F0] text-[#A8742A] border border-[#A8742A]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#A8742A]/30 text-[#A8742A] font-sans text-[11px] font-semibold">
                  8 Breeds Live
                </span>
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#022448] group-hover:text-[#A8742A] transition-colors">
                  Pet Store
                </h3>
                <p className="font-sans text-xs text-slate-600 mt-1 leading-relaxed">
                  Active financial companions granting cashbacks, fee waivers &amp; fixed-deposit yield boosts.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between text-[#022448] group-hover:text-[#A8742A] font-sans text-xs font-semibold">
              <span>Enter Store</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Avatar Store Card */}
          <div
            onClick={() => onSelectCategory('avatars')}
            className={`group bg-white hover:bg-[#FAF8F5] rounded-xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${
              activeCategory === 'avatars'
                ? 'border-[#1E3A5F] ring-2 ring-[#1E3A5F]/20 bg-blue-50/20'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#1E3A5F]/10 text-[#1E3A5F] border border-[#1E3A5F]/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A5F] font-sans text-[11px] font-semibold">
                  16 Personas
                </span>
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#022448] group-hover:text-[#1E3A5F] transition-colors">
                  Avatar Store
                </h3>
                <p className="font-sans text-xs text-slate-600 mt-1 leading-relaxed">
                  Tier-1 Citizen personas, certified executive couture, and national legacy investor portraits.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between text-[#022448] group-hover:text-[#1E3A5F] font-sans text-xs font-semibold">
              <span>Enter Store</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Frame Store Card */}
          <div
            onClick={() => onSelectCategory('frames')}
            className={`group bg-white hover:bg-[#FAF8F5] rounded-xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${
              activeCategory === 'frames'
                ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-sans text-[11px] font-semibold">
                  7 Enclaves
                </span>
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#022448] group-hover:text-purple-700 transition-colors">
                  Frame Store
                </h3>
                <p className="font-sans text-xs text-slate-600 mt-1 leading-relaxed">
                  Prestige guilloche borders, archival filigree safe-rims, and DvP speed verified edges.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between text-[#022448] group-hover:text-purple-700 font-sans text-xs font-semibold">
              <span>Enter Store</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Banner Store Card */}
          <div
            onClick={() => onSelectCategory('banners')}
            className={`group bg-white hover:bg-[#FAF8F5] rounded-xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${
              activeCategory === 'banners'
                ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-sans text-[11px] font-semibold">
                  14 Panoramas
                </span>
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#022448] group-hover:text-emerald-700 transition-colors">
                  Banner Store
                </h3>
                <p className="font-sans text-xs text-slate-600 mt-1 leading-relaxed">
                  Dalal trading floor twilight, central bank vault gilded halls, and sovereign settlement arenas.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between text-[#022448] group-hover:text-emerald-700 font-sans text-xs font-semibold">
              <span>Enter Store</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Category Pills + Search Bar + Rarity Filter + Sort */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3.5 shadow-xs">
        {/* Top Row: Category Tabs & Vault Status */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-sans">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#022448] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Items (45)
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('pets')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'pets'
                  ? 'bg-[#022448] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Financial Pets (8)
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('avatars')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'avatars'
                  ? 'bg-[#022448] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Citizen Personas (16)
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('frames')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'frames'
                  ? 'bg-[#022448] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Prestige Frames (7)
            </button>
            <button
              type="button"
              onClick={() => onSelectCategory('banners')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'banners'
                  ? 'bg-[#022448] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Royal Banners (14)
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSelectCategory('inventory')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeCategory === 'inventory'
                ? 'bg-[#A8742A] text-white shadow-xs'
                : 'bg-[#FDF8F0] border border-[#A8742A]/30 text-[#A8742A] hover:bg-[#F4EDE0]'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Active Vault &amp; Inventory</span>
            <span className="font-bold">({ownedCount} Owned)</span>
          </button>
        </div>

        {/* Bottom Row: Search Bar, Rarity Filters, Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pets, personas, frames, powers..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#FAF8F5] border border-slate-200/80 rounded-xl text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
            />
          </div>

          {/* Rarity & Sort Pills */}
          <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-400 px-2 uppercase">Tier:</span>
              <button
                type="button"
                onClick={() => onSelectRarity('all')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedRarity === 'all'
                    ? 'bg-white text-[#022448] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => onSelectRarity('gold')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedRarity === 'gold'
                    ? 'bg-[#A8742A] text-white shadow-xs'
                    : 'text-[#A8742A] hover:bg-[#FDF8F0]'
                }`}
              >
                Gold
              </button>
              <button
                type="button"
                onClick={() => onSelectRarity('epic')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedRarity === 'epic'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                Epic
              </button>
              <button
                type="button"
                onClick={() => onSelectRarity('rare')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedRarity === 'rare'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Rare
              </button>
              <button
                type="button"
                onClick={() => onSelectRarity('normal')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedRarity === 'normal'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Normal
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl px-2.5 py-1 text-xs font-sans text-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-[#1E3A5F]"
              >
                <option value="rarity">Rarity (Highest)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
