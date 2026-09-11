'use client';

import React from 'react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';
import { PlusCircle, Wallet } from 'lucide-react';

export type ShopCategory = 'all' | 'companions' | 'avatars' | 'frames' | 'inventory';

interface ShopCategoryBarProps {
  activeCategory: ShopCategory;
  onSelectCategory: (cat: ShopCategory) => void;
  isMasked: boolean;
  onTopUp: () => void;
}

export const ShopCategoryBar: React.FC<ShopCategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
  isMasked,
  onTopUp,
}) => {
  return (
    <div className="w-full bg-white border border-[#74777F]/20 rounded-2xl p-3.5 shadow-2xs mb-8">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar text-xs font-sans">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#022448] text-white shadow-2xs'
                : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
            }`}
          >
            ● All Items
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('companions')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              activeCategory === 'companions'
                ? 'bg-[#022448] text-white shadow-2xs'
                : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
            }`}
          >
            Guardian Companions (Modifiers)
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('avatars')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              activeCategory === 'avatars'
                ? 'bg-[#022448] text-white shadow-2xs'
                : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
            }`}
          >
            Prestige Avatars &amp; Identities
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('frames')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              activeCategory === 'frames'
                ? 'bg-[#022448] text-white shadow-2xs'
                : 'bg-[#F8F9FF] text-[#43474E] hover:bg-[#E5EFFF]'
            }`}
          >
            Sovereign Enclave Frames
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('inventory')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              activeCategory === 'inventory'
                ? 'bg-[#A8742A] text-white shadow-2xs'
                : 'bg-[#F2EFE7] border border-[#A8742A]/30 text-[#8D5F22] hover:bg-[#A8742A]/15'
            }`}
          >
            My Active Vault <span className="font-bold font-mono ml-1">(4 Owned)</span>
          </button>
        </div>

        {/* Citizen ARTH Balance Chip */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-[#F2EFE7] to-[#E5EFFF] border border-[#A8742A]/30 px-3.5 py-1.5 rounded-xl shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <Wallet className="w-3.5 h-3.5 text-[#A8742A]" />
            <span className="text-[#43474E] font-sans">Available to Spend:</span>
            <span className="font-mono font-bold text-[#022448]">
              <AnimatedMaskedValue value="38,450.00" isMasked={isMasked} currency="ARTH" />
            </span>
          </div>

          <button
            type="button"
            onClick={onTopUp}
            className="text-[11px] font-sans font-semibold bg-[#A8742A] hover:bg-[#8D5F22] text-white px-2.5 py-1 rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Top-up via NAVA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
