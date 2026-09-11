'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserCheck, Shield, Lock, Sparkles } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface AvatarsGallerySectionProps {
  isMasked: boolean;
  onAcquireAvatar: (avatar: { id: string; name: string; type: string; price: number; image: string; role: string }) => void;
}

interface AvatarItem {
  id: string;
  name: string;
  role: string;
  gender: 'Female' | 'Male';
  image: string;
  tier: string;
  price: number;
  perk: string;
}

const AVATARS: AvatarItem[] = [
  {
    id: 'av-f-investor',
    name: 'Archon Investor (F)',
    role: 'Capital Allocator',
    gender: 'Female',
    image: '/assets/shop/avatars/Female/Investor.png',
    tier: 'Tier-1 Sovereign',
    price: 4500,
    perk: '+15% Trading Limit Ceiling on SETU Market',
  },
  {
    id: 'av-f-builder',
    name: 'Sovereign Builder (F)',
    role: 'Infrastructure Architect',
    gender: 'Female',
    image: '/assets/shop/avatars/Female/Builder.png',
    tier: 'Tier-1 Sovereign',
    price: 3800,
    perk: 'Zero-gas fee on Smart Contract Attestations',
  },
  {
    id: 'av-f-analyst',
    name: 'Senior Macro Analyst (F)',
    role: 'Economic Forecaster',
    gender: 'Female',
    image: '/assets/shop/avatars/Female/Analyst.png',
    tier: 'Tier-1 Sovereign',
    price: 4200,
    perk: 'Unlocks Real-Time Order Book Depth Matrix',
  },
  {
    id: 'av-f-business',
    name: 'Commercial Executive (F)',
    role: 'Institutional Treasury',
    gender: 'Female',
    image: '/assets/shop/avatars/Female/BussinesWomen.png',
    tier: 'Tier-1 Sovereign',
    price: 4600,
    perk: '+0.10% Instant Cash Sweep APY Rebate',
  },
  {
    id: 'av-f-creator',
    name: 'Ledger Artisan (F)',
    role: 'Cryptographic Minteer',
    gender: 'Female',
    image: '/assets/shop/avatars/Female/Creator.png',
    tier: 'Tier-1 Sovereign',
    price: 3200,
    perk: 'Free Custom Identity Frame Customization',
  },
  {
    id: 'av-f-student',
    name: 'Academy Fellow (F)',
    role: 'Sovereign Scholar',
    gender: 'Female',
    image: '/assets/shop/avatars/Female/Student.png',
    tier: 'Academy Tier',
    price: 1800,
    perk: '+50 XP Milestone Points on Monthly Quests',
  },
];

export const AvatarsGallerySection: React.FC<AvatarsGallerySectionProps> = ({
  isMasked,
  onAcquireAvatar,
}) => {
  return (
    <section className="space-y-4 mb-10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#74777F]/20 pb-3">
        <div>
          <h2 className="font-serif text-lg md:text-xl font-medium text-[#121C28] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#A8742A]" />
            <span>Prestige Avatars &amp; Cryptographic Identities</span>
          </h2>
          <p className="text-xs text-[#43474E] font-sans">
            Chartered persona skins registered with Central Bank KYC Enclave. Attaches unique perks to cross-portal interactions.
          </p>
        </div>

        <span className="text-xs font-mono text-[#022448] bg-[#E5EFFF] px-3 py-1 rounded-full font-semibold">
          6 Available Avatars
        </span>
      </div>

      {/* Avatars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {AVATARS.map((av) => (
          <div
            key={av.id}
            className="bg-white border border-[#74777F]/20 hover:border-[#1E3A5F]/40 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E5EFFF] text-[#022448] font-bold">
                  {av.tier}
                </span>
                <span className="text-[11px] font-sans text-[#74777F]">{av.role}</span>
              </div>

              {/* Avatar Image Frame */}
              <div className="w-full aspect-square bg-gradient-to-b from-[#F8F9FF] to-[#E5EFFF]/50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 border border-[#74777F]/10 relative">
                <Image
                  src={av.image}
                  alt={av.name}
                  width={200}
                  height={200}
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-semibold text-[#121C28] text-sm">{av.name}</h3>
                <div className="bg-[#F8F9FF] border border-[#74777F]/15 text-[#022448] p-2.5 rounded-lg text-xs leading-snug my-2 font-sans">
                  <strong className="text-[#A8742A] block text-[10px] uppercase font-mono mb-0.5">
                    Civic Perk:
                  </strong>
                  {av.perk}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#74777F]/15 mt-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#74777F] block">Minting Fee</span>
                <span className="font-mono font-bold text-[#121C28] text-sm">
                  <AnimatedMaskedValue
                    value={av.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    isMasked={isMasked}
                    currency="ARTH"
                  />
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAcquireAvatar({
                    id: av.id,
                    name: av.name,
                    type: 'Prestige Avatar',
                    price: av.price,
                    image: av.image,
                    role: av.role,
                  })
                }
                className="bg-[#022448] hover:bg-[#1E3A5F] text-white text-xs font-sans font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#F9BB6A]" />
                <span>Mint Identity</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
