'use client';

import React from 'react';
import Link from 'next/image';
import NextLink from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, Zap, Box } from 'lucide-react';

export function EquippedLoadoutCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-[#A8742A] uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4 text-[#A8742A]" />
            <span>Sovereign Identity Skins</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-[#022448] mt-0.5">
            Equipped Vault &amp; Active Modifiers
          </h2>
          <p className="font-sans text-xs text-slate-600 mt-0.5">
            Active cosmetic presentation layers and yield multipliers bound to your citizen identity address.
          </p>
        </div>

        <NextLink
          href="/user/shop"
          className="px-3 py-1.5 bg-[#FDF8F0] border border-[#A8742A]/30 text-[#A8742A] hover:bg-[#F4EDE0] text-xs font-semibold rounded-full flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <span>Vault &amp; Shop</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </NextLink>
      </div>

      {/* 4 Equipped Slots Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Slot 1: Active Frame */}
        <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Active Frame
            </span>
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <Image
                src="/assets/shop/frames/gold.png"
                alt="Gold Frame"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <div className="text-center">
              <h4 className="font-serif font-bold text-slate-900 text-xs">Sovereign Gold Filigree</h4>
              <span className="text-[10px] font-sans text-[#A8742A] font-semibold">Tier Gold • Specular Shimmer</span>
            </div>
          </div>
        </div>

        {/* Slot 2: Active Persona */}
        <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Active Persona
            </span>
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border border-slate-200">
              <Image
                src="/assets/shop/avatars/Female/Analyst.png"
                alt="Analyst"
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </div>
            <div className="text-center">
              <h4 className="font-serif font-bold text-slate-900 text-xs">Executive Analyst</h4>
              <span className="text-[10px] font-sans text-blue-700 font-semibold">Corporate Escrow Signatory</span>
            </div>
          </div>
        </div>

        {/* Slot 3: Active Banner */}
        <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Active Panorama
            </span>
            <div className="relative w-full h-16 rounded-lg overflow-hidden border border-slate-200">
              <Image
                src="/assets/shop/banners/gold_1.png"
                alt="Central Bank Apex"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <h4 className="font-serif font-bold text-slate-900 text-xs">Apex Gilded Hall</h4>
              <span className="text-[10px] font-sans text-emerald-700 font-semibold">National Bullion Vista</span>
            </div>
          </div>
        </div>

        {/* Slot 4: Active Pet Companion */}
        <div className="bg-[#FDF8F0] border border-[#A8742A]/30 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#A8742A] uppercase tracking-wider block font-bold">
              Active Companion
            </span>
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <Image
                src="/assets/shop/pets/Ledger Owl/main_image.png"
                alt="Ledger Owl"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <div className="text-center">
              <h4 className="font-serif font-bold text-[#022448] text-xs">Ledger Owl (&quot;Vidya&quot;)</h4>
              <span className="text-[10px] font-mono text-emerald-700 font-bold block">+0.25% FD Yield Booster</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cumulative Real-Time Yield Banner */}
      <div className="p-4 bg-[#022448] text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-[#1E3A5F]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#E9D9BE]">
              TOTAL ACTIVE COMPOUND MODIFIERS
            </span>
          </div>
          <div className="font-mono text-xs text-[#C8DFDB] flex flex-wrap gap-2 pt-0.5">
            <span className="px-2 py-0.5 bg-white/10 rounded">+0.25% FD APY</span>
            <span className="px-2 py-0.5 bg-white/10 rounded">Level-2 Trading Feed</span>
            <span className="px-2 py-0.5 bg-white/10 rounded">Zero Wire Fees</span>
          </div>
        </div>

        <NextLink
          href="/user/shop"
          className="px-4 py-2 bg-[#A8742A] hover:bg-[#8C5E1F] text-white rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
        >
          Equip Other Items
        </NextLink>
      </div>
    </div>
  );
}
