'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  ShoppingBag, 
  Landmark, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

const ECOSYSTEM_NODES = [
  {
    title: 'Personal User Portal',
    badge: 'CITIZEN VAULT',
    desc: 'Central liquid balances, inter-bank DvP transfers, fixed deposits, milestone awards, and sovereign mailbox.',
    href: '/user',
    image: '/assets/portals/user.png',
    accent: '#3368A0',
  },
  {
    title: 'Commercial Bank Portal',
    badge: 'TIER-1 BANKING',
    desc: 'Licensed banking operations across Nava, Samaya, Pravah, Vistara, and Kuber commercial institutions.',
    href: '/bank',
    image: '/assets/portals/banks.png',
    accent: '#1E3A5F',
  },
  {
    title: 'Stock Market Exchange',
    badge: 'EQUITY & DVP',
    desc: 'Live continuous order book, real-time equity execution, portfolio performance, and sovereign capital gains.',
    href: '/stocks',
    image: '/assets/portals/stocks.png',
    accent: '#287A55',
  },
  {
    title: 'Sovereign Shop & Wardrobe',
    badge: 'REPUTATION',
    desc: 'Avatar customizations, citizen frames, and titles unlocked via transactional milestone achievements.',
    href: '/shop',
    image: '/assets/portals/shop.png',
    accent: '#A8742A',
  },
  {
    title: 'Central Bank Command',
    badge: 'PRUDENTIAL NODE',
    desc: 'Macroeconomic surveillance, real-time CLS settlement engine queue, and double-entry ledger audit inspection.',
    href: '/central-bank',
    image: '/assets/portals/central_bank.png',
    accent: '#946726',
  },
];

export function GovEcosystemSection() {
  return (
    <section className="w-full py-16 sm:py-20 border-t border-[#3368A0]/10 bg-white/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3368A0]/10 text-[#1E3A5F] text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#287A55]" />
              <span>Unified Cross-Portal Network Access</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E3A5F] tracking-tight leading-tight">
              One GOV ID Unlocks All Nodes
            </h2>
            <p className="text-sm text-[#5C574F] mt-2 max-w-xl">
              Your sovereign identity provides unified, single-sign-on access across the entire ARTHAX monetary ecosystem.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#3368A0] hover:text-[#1E3A5F] bg-[#3368A0]/5 hover:bg-[#3368A0]/10 border border-[#3368A0]/20 px-4 py-2.5 rounded-full transition-all shadow-2xs self-start md:self-auto no-underline"
          >
            <span>Explore Central Switchboard</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ECOSYSTEM_NODES.map((node, idx) => (
            <Link
              key={idx}
              href={node.href}
              className="group rounded-3xl bg-white border border-[#3368A0]/15 p-6 shadow-sm hover:shadow-md hover:border-[#3368A0]/35 transition-all flex flex-col justify-between relative overflow-hidden no-underline"
            >
              <div>
                {/* Visual Image Preview */}
                <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-[#F2EFE7] border border-[#3368A0]/10 mb-5 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src={node.image}
                    alt={node.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[9px] font-mono font-bold text-[#1E3A5F] uppercase tracking-wider">
                    {node.badge}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#1E3A5F] mb-1.5 group-hover:text-[#3368A0] transition-colors flex items-center justify-between">
                  <span>{node.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#5C574F] group-hover:text-[#3368A0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h3>
                <p className="text-xs text-[#5C574F] leading-relaxed">
                  {node.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#3368A0]/10 flex items-center justify-between text-[11px] font-mono text-[#5C574F]">
                <span>Routing Endpoint</span>
                <span className="text-[#3368A0] font-semibold">{node.href}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
