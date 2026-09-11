'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export function GovFooter() {
  return (
    <footer className="w-full border-t border-[#3368A0]/15 bg-[#1E3A5F] text-white py-12 sm:py-16 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3368A0]/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Authority */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center p-1.5 border border-white/20">
                <Image
                  src="/assets/brand/navbar_logo.png"
                  alt="ARTHAX GOV"
                  width={28}
                  height={28}
                  className="object-contain filter invert brightness-200"
                />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white block leading-none">
                  ARTHAX GOV
                </span>
                <span className="font-mono text-[10px] text-[#DFB87A] uppercase tracking-widest mt-1 block">
                  Government Identity Gateway
                </span>
              </div>
            </div>
            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              Cryptographic root authority for the ARTHAX Sovereign Network. Mandating the single double-entry ledger invariant across all registered commercial banks.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#A8F5BF]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SHA-256 Ledger Anchor Validated</span>
            </div>
          </div>

          {/* Col 2: Network Portals */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-[#DFB87A] uppercase tracking-wider block">
              Network Portals
            </span>
            <ul className="space-y-2 text-xs font-mono text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Central Switchboard</Link>
              </li>
              <li>
                <Link href="/user" className="hover:text-white transition-colors">User Citizen Portal</Link>
              </li>
              <li>
                <Link href="/bank" className="hover:text-white transition-colors">Commercial Banks</Link>
              </li>
              <li>
                <Link href="/stocks" className="hover:text-white transition-colors">Stock Exchange</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">Sovereign Shop</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Protocols */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-[#DFB87A] uppercase tracking-wider block">
              Governance Standards
            </span>
            <ul className="space-y-2 text-xs font-mono text-white/80">
              <li>ISO 7501 Identity</li>
              <li>pacs.008 Payment Standard</li>
              <li>Argon2id Salted Credential</li>
              <li>Dual-Password Protocol</li>
              <li>Monetary Treaty 409-C</li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/60">
          <div>
            © 2026 ARTHAX Sovereign Financial Architecture. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Identity Node: #01</span>
            <span>•</span>
            <span className="text-[#A8F5BF]">System Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
