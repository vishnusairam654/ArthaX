'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { X, ShieldCheck, Box, Sparkles, Check, CheckCircle2, Lock } from 'lucide-react';
import { ShopItem, RARITY_CONFIG } from './ShopData';

const ShopVault3DCanvas = dynamic(
  () => import('./ShopVault3DCanvas').then((mod) => mod.ShopVault3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-44 bg-slate-900/50 rounded-xl flex items-center justify-center text-xs font-mono text-[#C59A45] animate-pulse">
        Loading 3D Node...
      </div>
    ),
  }
);

interface ShopInspectDrawerProps {
  item: ShopItem | null;
  isOpen: boolean;
  onClose: () => void;
  isOwned?: boolean;
  isEquipped?: boolean;
  isMasked?: boolean;
  onAcquire: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  onUnequip: (item: ShopItem) => void;
}

export function ShopInspectDrawer({
  item,
  isOpen,
  onClose,
  isOwned = false,
  isEquipped = false,
  isMasked = false,
  onAcquire,
  onEquip,
  onUnequip,
}: ShopInspectDrawerProps) {
  const [show3D, setShow3D] = useState(false);

  if (!isOpen || !item) return null;

  const rarityMeta = RARITY_CONFIG[item.rarity];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      {/* Backdrop click to close */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between border-l border-slate-200/80 animate-in slide-in-from-right duration-300">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="font-sans text-[11px] text-[#A8742A] uppercase tracking-widest font-bold block">
                Asset Inspection Ledger
              </span>
              <span className="text-[10px] font-mono text-slate-400">Charter No. 842 Mint Proof</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Asset Inset or 3D view */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#F4EDE0]/50 to-[#FAF8F5] p-4 flex items-center justify-center min-h-[220px] border border-slate-200/80 overflow-hidden">
            {show3D ? (
              <div className="w-full">
                <ShopVault3DCanvas height={220} />
              </div>
            ) : (
              <div className="relative w-44 h-44 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="176px"
                  className="object-contain drop-shadow-lg"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setShow3D(!show3D)}
              className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-sans font-semibold text-[#022448] flex items-center gap-1 border border-slate-200 shadow-xs cursor-pointer hover:bg-white"
            >
              <Box className="w-3.5 h-3.5 text-[#A8742A]" />
              <span>{show3D ? 'Show 2D Image' : 'Inspect 3D Node'}</span>
            </button>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${rarityMeta.badgeClass}`}
              >
                {rarityMeta.name} Tier
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {item.rank || item.accreditation || 'Standard Mint'}
              </span>
            </div>

            <h3 className="font-serif text-xl font-bold text-[#022448]">
              {item.name}
            </h3>

            <p className="font-sans text-xs text-slate-600 leading-relaxed">
              {item.powerDescription || 'Certified sovereign asset with immutable ownership recorded on the ARTHAX central core ledger.'}
            </p>
          </div>

          {/* Perks list */}
          {item.perks && item.perks.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="font-sans text-xs font-semibold text-slate-800">
                Certified Active Perks
              </div>
              <ul className="space-y-1 text-xs font-sans text-slate-600">
                {item.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Smart Contract Attributes Box */}
          <div className="space-y-1.5 pt-1 font-sans">
            <div className="text-xs font-semibold text-[#022448]">
              Smart Contract Escrow Attributes
            </div>
            <div className="p-3 bg-[#FAF8F5] border border-slate-200/80 rounded-xl space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Staking Mod:</span>
                <span className="font-mono font-bold text-[#022448]">Instant Compound</span>
              </div>
              <div className="flex justify-between">
                <span>Transferability:</span>
                <span className="font-mono font-bold text-[#022448]">Unrestricted DvP</span>
              </div>
              <div className="flex justify-between">
                <span>Mint Standard:</span>
                <span className="font-mono font-bold text-[#022448]">ARTH-ERC721-SOV</span>
              </div>
              <div className="flex justify-between">
                <span>Depository Node:</span>
                <span className="font-mono font-bold text-[#A8742A]">SETU #003</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase">Settlement Mint Rate</span>
            <span className="font-mono text-lg font-bold text-[#022448]">
              {isMasked ? '•••• ARTH' : `${item.price.toLocaleString('en-US')} ARTH`}
            </span>
          </div>

          {isEquipped ? (
            <button
              type="button"
              onClick={() => {
                onUnequip(item);
                onClose();
              }}
              className="w-full py-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Unequip from Active Vault
            </button>
          ) : isOwned ? (
            <button
              type="button"
              onClick={() => {
                onEquip(item);
                onClose();
              }}
              className="w-full py-3 bg-[#A8742A] hover:bg-[#8C5E1F] text-white rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer active:translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Equip into Active Vault</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onAcquire(item);
              }}
              className="w-full py-3 bg-[#022448] hover:bg-[#1E3A5F] text-white rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer active:translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#C59A45]" />
              <span>Acquire Into Depository</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
