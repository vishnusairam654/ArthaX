'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, ExternalLink, Globe } from 'lucide-react';

export const GuideFooter: React.FC = () => {
  const [utcTime, setUtcTime] = useState<string>('UTC 00:00:00');
  const [blockHeight, setBlockHeight] = useState<number>(28102537);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = 'UTC ' + now.toUTCString().split(' ')[4];
      setUtcTime(timeStr);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const blockTimer = setInterval(() => {
      setBlockHeight((prev) => prev + 1);
    }, 12000);
    return () => clearInterval(blockTimer);
  }, []);

  return (
    <footer className="bg-white border-t border-[#3368A0]/20 pt-16 pb-12 text-[#262320]/80 text-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#3368A0]/15">
          {/* Identity Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#3368A0] flex items-center justify-center p-1.5 shadow-sm">
                <Image
                  src="/assets/brand/currency_symbol.png"
                  alt="ARTHAX Insignia"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-bold tracking-wider text-[#3368A0]">
                  ARTHAX
                </span>
                <span className="font-mono text-[9px] font-semibold text-[#A8742A] uppercase tracking-wider bg-[#A8742A]/10 px-1.5 py-0.5 rounded">
                  SOV.NET
                </span>
              </div>
            </div>

            <p className="font-body text-xs leading-relaxed text-[#262320]/70">
              Sovereign Digital Fiscal Network and Central Ledger Protocol. Governed by multi-signatory monetary stabilization covenants and tier-one reserve anchoring under Charter 409-C.
            </p>

            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#262320]/70 bg-[#F2EFE7] px-3.5 py-1.5 rounded-full border border-[#3368A0]/15">
              <ShieldCheck className="w-4 h-4 text-[#A8742A]" />
              <span>Root Node Trust Cert #8491-X</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#262320]/50 font-semibold block">
                Public Documentation
              </span>
              <ul className="space-y-2 font-body text-xs">
                <li>
                  <a href="#hero" className="hover:text-[#3368A0] transition-colors">
                    Manifesto &amp; Invariants
                  </a>
                </li>
                <li>
                  <a href="#switchboard" className="hover:text-[#3368A0] transition-colors">
                    Public Switchboard
                  </a>
                </li>
                <li>
                  <a href="#ledger-engine" className="hover:text-[#3368A0] transition-colors">
                    Monetary Treaty
                  </a>
                </li>
                <li>
                  <a href="#cls-pipeline" className="hover:text-[#3368A0] transition-colors">
                    CLS Settlement Engine
                  </a>
                </li>
                <li>
                  <a href="#banks" className="hover:text-[#3368A0] transition-colors">
                    Licensed Commercial Banks
                  </a>
                </li>
                <li>
                  <a href="#guides" className="hover:text-[#3368A0] transition-colors">
                    Financial Educational Guides
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#3368A0] transition-colors">
                    Architectural FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#262320]/50 font-semibold block">
                Public Portals
              </span>
              <ul className="space-y-2 font-body text-xs">
                <li>
                  <a href="/user" className="hover:text-[#3368A0] transition-colors font-medium">
                    User Portal
                  </a>
                </li>
                <li>
                  <a href="/stocks" className="hover:text-[#3368A0] transition-colors font-medium">
                    Stock Portal
                  </a>
                </li>
                <li>
                  <a href="/user/shop" className="hover:text-[#3368A0] transition-colors font-medium">
                    Shop
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#262320]/50 font-semibold block">
                Regulatory Compliance
              </span>
              <p className="font-body text-xs leading-relaxed text-[#262320]/70">
                All transactions executed via atomic delivery-versus-payment (DvP) adhering to Basel III liquidity accords and ISO 20022 messaging standards.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#3368A0]">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Epoch #4,819 Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Status Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#262320]/60">
          <div>
            © 2025 ARTHAX Sovereign Financial System. Immutable Double-Entry Archival Ledger.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#262320]/80">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              BLOCK HEIGHT <span className="font-semibold text-[#3368A0]" suppressHydrationWarning>{blockHeight.toLocaleString('en-US')}</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-[#A8742A]" suppressHydrationWarning>{utcTime}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
