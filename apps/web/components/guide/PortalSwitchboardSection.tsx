'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Store, 
  UserCheck, 
  Layers,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const PortalSwitchboardSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'user' | 'stocks' | 'shop'>('all');

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-[#3368A0]/15" id="switchboard">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 border border-[#A8742A]/30 text-[#A8742A] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>PUBLIC ACCESS NODES</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
            Explore the Portals
          </h2>
          <p className="font-body text-sm text-[#262320]/75 max-w-xl mt-2">
            Access your personal accounts, trade sovereign equities on the central exchange, or explore exclusive avatars and companions in the shop.
          </p>
        </div>

        {/* Segmented Filter Buttons */}
        <div 
          className="inline-flex p-1 rounded-full bg-[#E5E0D4]/70 border border-[#3368A0]/15 shadow-xs" 
          id="portal-filters" 
          role="tablist"
        >
          {[
            { id: 'all', label: 'All Portals (3)' },
            { id: 'user', label: 'User Portal' },
            { id: 'stocks', label: 'Stock Portal' },
            { id: 'shop', label: 'Shop' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              role="tab"
              aria-selected={activeFilter === tab.id}
              className={`px-4 py-1.5 rounded-full text-xs transition duration-200 font-body whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-white text-[#022448] font-semibold shadow-xs'
                  : 'text-[#262320]/70 font-medium hover:text-[#022448]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of the 3 Public Portals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="portal-cards-grid">
        
        {/* ================= PORTAL 01: USER PORTAL ================= */}
        {(activeFilter === 'all' || activeFilter === 'user') && (
          <div 
            className="bg-white rounded-3xl border border-[#3368A0]/20 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#3368A0]"
            data-category="user"
          >
            <div className="space-y-6">
              
              {/* Card Meta Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#262320]/60 font-semibold">
                  PORTAL 01
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border bg-[#3368A0]/10 text-[#3368A0] border-[#3368A0]/20">
                  PERSONAL ACCOUNT
                </span>
              </div>

              {/* Official Portal Emblem Plaque */}
              <div className="p-6 rounded-2xl bg-[#F2EFE7]/80 border border-[#3368A0]/15 flex items-center justify-center relative overflow-hidden group-hover:bg-[#F2EFE7] transition duration-300">
                <div className="relative w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/assets/portals/user.png"
                    alt="User Portal Insignia"
                    width={110}
                    height={110}
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-display text-2xl font-medium text-[#022448] group-hover:text-[#1E3A5F] transition-colors">
                  User Portal
                </h3>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#A8742A] font-bold mt-1 block">
                  Personal Accounts &amp; Assets
                </span>
                <p className="font-body text-xs text-[#262320]/75 leading-relaxed mt-2.5">
                  Your primary citizen financial dashboard. Check your liquid balances, initiate instant transfers, manage fixed deposits, and review system notifications.
                </p>
              </div>

              {/* Feature Showcase: Citizen Mailbox & Assets Preview */}
              <div className="p-3.5 bg-[#F8F9FF] rounded-2xl border border-[#3368A0]/15 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#3368A0]/15 overflow-hidden relative shrink-0 p-1 flex items-center justify-center shadow-2xs">
                    <Image
                      src="/assets/illustrations/empty_mailbox.png"
                      alt="System Mailbox"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div>
                    <span className="font-body text-xs font-semibold text-[#022448] block">
                      Citizen Services Hub
                    </span>
                    <span className="font-mono text-[10px] text-[#262320]/60 block">
                      Mailbox • FDs • Security Settings
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-white border border-[#3368A0]/10 text-center">
                    <span className="text-[9px] uppercase text-[#262320]/50 block">Auth Security</span>
                    <strong className="text-[#022448] text-[11px]">Dual-Password</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#3368A0]/10 text-center">
                    <span className="text-[9px] uppercase text-[#262320]/50 block">Transfers</span>
                    <strong className="text-emerald-700 text-[11px]">Instant (T+0)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-6 mt-6 border-t border-[#3368A0]/15">
              <Link
                href="/user"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-body font-semibold rounded-full bg-[#022448] hover:bg-[#1E3A5F] text-white shadow-xs group-hover:shadow-md transition duration-200 active:scale-97"
              >
                <span>Launch User Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#A8742A]" />
              </Link>
            </div>
          </div>
        )}

        {/* ================= PORTAL 02: STOCK PORTAL ================= */}
        {(activeFilter === 'all' || activeFilter === 'stocks') && (
          <div 
            className="bg-white rounded-3xl border border-[#3368A0]/20 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:border-emerald-600"
            data-category="stocks"
          >
            <div className="space-y-6">
              
              {/* Card Meta Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#262320]/60 font-semibold">
                  PORTAL 02
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border bg-emerald-500/10 text-emerald-800 border-emerald-500/20">
                  CENTRAL EXCHANGE
                </span>
              </div>

              {/* Official Portal Emblem Plaque */}
              <div className="p-6 rounded-2xl bg-[#F2EFE7]/80 border border-[#3368A0]/15 flex items-center justify-center relative overflow-hidden group-hover:bg-[#F2EFE7] transition duration-300">
                <div className="relative w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/assets/portals/stocks.png"
                    alt="Stock Portal Insignia"
                    width={110}
                    height={110}
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-display text-2xl font-medium text-[#022448] group-hover:text-emerald-800 transition-colors">
                  Stock Portal
                </h3>
                <span className="font-mono text-[10px] tracking-wider uppercase text-emerald-700 font-bold mt-1 block">
                  Live Trading &amp; Equities
                </span>
                <p className="font-body text-xs text-[#262320]/75 leading-relaxed mt-2.5">
                  The central sovereign securities market. View real-time order books, execute buy and sell orders, manage your equity portfolio, and track profit-based capital gains taxes.
                </p>
              </div>

              {/* Feature Showcase: Listed Company Banners (from assets/stocks/banner) */}
              <div className="p-3.5 bg-[#F8F9FF] rounded-2xl border border-[#3368A0]/15 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs font-semibold text-[#022448]">
                    Listed Sovereign Companies
                  </span>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    10 Equities Active
                  </span>
                </div>

                {/* Company Banners Grid (Full Portrait Posters in Natural Aspect Ratio) */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center group/b">
                    <div className="w-full aspect-[10/16] rounded-xl overflow-hidden relative border border-[#3368A0]/20 bg-[#071711] shadow-2xs group-hover/b:border-[#A8742A]/50 transition-all">
                      <Image
                        src="/assets/stocks/banner/arka_energy.png"
                        alt="Arka Energy"
                        fill
                        className="object-contain p-0.5 group-hover/b:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#022448] mt-1 tracking-tight">ARKA</span>
                  </div>

                  <div className="flex flex-col items-center group/b">
                    <div className="w-full aspect-[10/16] rounded-xl overflow-hidden relative border border-[#3368A0]/20 bg-[#071711] shadow-2xs group-hover/b:border-[#A8742A]/50 transition-all">
                      <Image
                        src="/assets/stocks/banner/nila_systems.png"
                        alt="Nila Systems"
                        fill
                        className="object-contain p-0.5 group-hover/b:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#022448] mt-1 tracking-tight">NILA</span>
                  </div>

                  <div className="flex flex-col items-center group/b">
                    <div className="w-full aspect-[10/16] rounded-xl overflow-hidden relative border border-[#3368A0]/20 bg-[#071711] shadow-2xs group-hover/b:border-[#A8742A]/50 transition-all">
                      <Image
                        src="/assets/stocks/banner/tarang_mobility.png"
                        alt="Tarang Mobility"
                        fill
                        className="object-contain p-0.5 group-hover/b:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#022448] mt-1 tracking-tight">TARANG</span>
                  </div>

                  <div className="flex flex-col items-center group/b">
                    <div className="w-full aspect-[10/16] rounded-xl overflow-hidden relative border border-[#3368A0]/20 bg-[#071711] shadow-2xs group-hover/b:border-[#A8742A]/50 transition-all">
                      <Image
                        src="/assets/stocks/banner/anvik_industries.png"
                        alt="Anvik Heavy Industries"
                        fill
                        className="object-contain p-0.5 group-hover/b:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#022448] mt-1 tracking-tight">ANVIK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-6 mt-6 border-t border-[#3368A0]/15">
              <Link
                href="/stocks"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-body font-semibold rounded-full bg-[#022448] hover:bg-emerald-800 text-white shadow-xs group-hover:shadow-md transition duration-200 active:scale-97"
              >
                <span>Launch Stock Portal</span>
                <TrendingUp className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#A8742A]" />
              </Link>
            </div>
          </div>
        )}

        {/* ================= PORTAL 03: SHOP ================= */}
        {(activeFilter === 'all' || activeFilter === 'shop') && (
          <div 
            className="bg-white rounded-3xl border border-[#3368A0]/20 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:border-[#A8742A]"
            data-category="shop"
          >
            <div className="space-y-6">
              
              {/* Card Meta Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#262320]/60 font-semibold">
                  PORTAL 03
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border bg-[#A8742A]/10 text-[#A8742A] border-[#A8742A]/30">
                  REWARDS &amp; PREVIEWS
                </span>
              </div>

              {/* Official Portal Emblem Plaque */}
              <div className="p-6 rounded-2xl bg-[#F2EFE7]/80 border border-[#3368A0]/15 flex items-center justify-center relative overflow-hidden group-hover:bg-[#F2EFE7] transition duration-300">
                <div className="relative w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/assets/portals/shop.png"
                    alt="Shop Insignia"
                    width={110}
                    height={110}
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-display text-2xl font-medium text-[#022448] group-hover:text-[#A8742A] transition-colors">
                  Shop
                </h3>
                <span className="font-mono text-[10px] tracking-wider uppercase text-[#A8742A] font-bold mt-1 block">
                  Avatars, Frames &amp; Pet Companions
                </span>
                <p className="font-body text-xs text-[#262320]/75 leading-relaxed mt-2.5">
                  The sovereign prestige store. Purchase certified avatars, rarity-tiered avatar frames, and yield-boosting pet companions using your ARTH ledger balance.
                </p>
              </div>

              {/* Feature Showcase: Real Pet Companions (from assets/shop/pets) */}
              <div className="p-3.5 bg-[#F8F9FF] rounded-2xl border border-[#3368A0]/15 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs font-semibold text-[#022448]">
                    Featured Pet Companions
                  </span>
                  <span className="font-mono text-[10px] text-[#A8742A] font-bold bg-[#A8742A]/10 px-1.5 py-0.5 rounded">
                    Yield Boosters
                  </span>
                </div>

                {/* Pets Row Showcase */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-1.5 rounded-xl bg-white border border-[#3368A0]/15 text-center flex flex-col items-center group/pet hover:border-[#A8742A] transition">
                    <div className="w-10 h-10 relative overflow-hidden rounded-lg">
                      <Image
                        src="/assets/shop/pets/Saver Fox/thumbnail.png"
                        alt="Saver Fox"
                        fill
                        className="object-contain group-hover/pet:scale-110 transition-transform"
                      />
                    </div>
                    <span className="font-body text-[9px] font-semibold text-[#022448] mt-1 truncate max-w-full">
                      Saver Fox
                    </span>
                    <span className="font-mono text-[8px] text-emerald-700 font-bold">+0.85% APY</span>
                  </div>

                  <div className="p-1.5 rounded-xl bg-white border border-[#3368A0]/15 text-center flex flex-col items-center group/pet hover:border-[#A8742A] transition">
                    <div className="w-10 h-10 relative overflow-hidden rounded-lg">
                      <Image
                        src="/assets/shop/pets/Market Bull/thumbnail.png"
                        alt="Market Bull"
                        fill
                        className="object-contain group-hover/pet:scale-110 transition-transform"
                      />
                    </div>
                    <span className="font-body text-[9px] font-semibold text-[#022448] mt-1 truncate max-w-full">
                      Market Bull
                    </span>
                    <span className="font-mono text-[8px] text-emerald-700 font-bold">-10% Fee</span>
                  </div>

                  <div className="p-1.5 rounded-xl bg-white border border-[#3368A0]/15 text-center flex flex-col items-center group/pet hover:border-[#A8742A] transition">
                    <div className="w-10 h-10 relative overflow-hidden rounded-lg">
                      <Image
                        src="/assets/shop/pets/Wealth Elephant/thumbnail.png"
                        alt="Wealth Elephant"
                        fill
                        className="object-contain group-hover/pet:scale-110 transition-transform"
                      />
                    </div>
                    <span className="font-body text-[9px] font-semibold text-[#022448] mt-1 truncate max-w-full">
                      Elephant
                    </span>
                    <span className="font-mono text-[8px] text-[#A8742A] font-bold">Prestige</span>
                  </div>

                  <div className="p-1.5 rounded-xl bg-white border border-[#3368A0]/15 text-center flex flex-col items-center group/pet hover:border-[#A8742A] transition">
                    <div className="w-10 h-10 relative overflow-hidden rounded-lg">
                      <Image
                        src="/assets/shop/pets/Flow Otter/thumbnail.png"
                        alt="Flow Otter"
                        fill
                        className="object-contain group-hover/pet:scale-110 transition-transform"
                      />
                    </div>
                    <span className="font-body text-[9px] font-semibold text-[#022448] mt-1 truncate max-w-full">
                      Flow Otter
                    </span>
                    <span className="font-mono text-[8px] text-emerald-700 font-bold">+Cashback</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-6 mt-6 border-t border-[#3368A0]/15">
              <Link
                href="/user/shop"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-body font-semibold rounded-full bg-[#022448] hover:bg-[#A8742A] text-white shadow-xs group-hover:shadow-md transition duration-200 active:scale-97"
              >
                <span>Enter Shop</span>
                <Store className="w-3.5 h-3.5 text-[#A8742A] group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default PortalSwitchboardSection;
