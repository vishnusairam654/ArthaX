'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Copy, Check, Lock, Sparkles, Scale } from 'lucide-react';
import { RARITY_CONFIG } from './ShopData';

interface ShopRarityGuideSectionProps {
  onVerifyProof?: () => void;
}

export function ShopRarityGuideSection({ onVerifyProof }: ShopRarityGuideSectionProps) {
  const [copiedRoot, setCopiedRoot] = useState(false);
  const merkleRoot = '0x89fd4a71bc993e110298a002bc4501a398f7129';

  const handleCopy = () => {
    navigator.clipboard.writeText(merkleRoot);
    setCopiedRoot(true);
    setTimeout(() => setCopiedRoot(false), 2000);
  };

  return (
    <div className="space-y-6" id="section-rarity-guide">
      {/* 4-Tier Institutional Codification Grid */}
      <div className="bg-[#FAF8F5] border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="font-sans text-[11px] text-[#A8742A] uppercase tracking-widest font-bold">
            Institutional Codification
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#022448]">
            Rarity Guide &amp; Vault Utility Primer
          </h2>
          <p className="font-sans text-xs text-slate-600 leading-relaxed">
            ARTHAX utilizes a four-tier sovereign rarity standard governing both visual prestige and active balance sheet utility modifiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tier 1: Normal */}
          <div className="bg-white rounded-xl p-4 space-y-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-sans text-[10px] font-bold uppercase tracking-wider">
                  Normal
                </span>
                <span className="font-mono text-[10px] text-slate-400 font-semibold">Tier 01</span>
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Slate Foundation</h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Foundational styling and clean architectural geometry. Minted for baseline identification and entry-level marketplace participation.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-100 font-sans">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Yield Utility:</span>
              <span className="text-[11px] text-slate-700">Zero baseline boost; standard 1x network rewards.</span>
            </div>
          </div>

          {/* Tier 2: Rare */}
          <div className="bg-white rounded-xl p-4 space-y-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-sans text-[10px] font-bold uppercase tracking-wider">
                  Rare
                </span>
                <span className="font-mono text-[10px] text-blue-600 font-semibold">Tier 02</span>
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Azure Blue</h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Advanced aesthetics, custom chromatic gradients, and single tier-1 minor perks (+2% rewards or priority queue entry).
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-100 font-sans">
              <span className="text-[10px] text-blue-600 uppercase font-semibold block">Yield Utility:</span>
              <span className="text-[11px] text-slate-700">Zero-gas settlement on select inter-bank clearings.</span>
            </div>
          </div>

          {/* Tier 3: Epic */}
          <div className="bg-white rounded-xl p-4 space-y-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-sans text-[10px] font-bold uppercase tracking-wider">
                  Epic
                </span>
                <span className="font-mono text-[10px] text-purple-600 font-semibold">Tier 03</span>
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Amethyst Violet</h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                Bespoke animation flair, Guilloche filigree highlights, and dual active financial modifiers (+15% cashback, -25% commissions).
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-100 font-sans">
              <span className="text-[10px] text-purple-600 uppercase font-semibold block">Yield Utility:</span>
              <span className="text-[11px] text-slate-700">Active transaction rebates auto-credited daily.</span>
            </div>
          </div>

          {/* Tier 4: Gold */}
          <div className="bg-[#FDF8F0] rounded-xl p-4 space-y-3 border border-[#A8742A]/40 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#A8742A] border border-[#A8742A]/30 font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#A8742A]" />
                  Gold Sovereign
                </span>
                <span className="font-mono text-[10px] text-[#A8742A] font-semibold">Tier 04</span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#022448]">Radiant Gold</h3>
              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                Specular shimmer aura, maximum sovereign utility (+1.25% FD booster, zero trade fees, instant priority settlement).
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#A8742A]/20 font-sans">
              <span className="text-[10px] text-[#A8742A] uppercase font-semibold block">Yield Utility:</span>
              <span className="text-[11px] text-slate-800 font-medium">Instant SETU auto-sweep &amp; sovereign board voting.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proof of Custody Ledger & Merkle Strip */}
      <section className="bg-[#022448] rounded-2xl border border-[#1E3A5F] p-5 text-white space-y-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#C59A45] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#C59A45]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">
                Double-Signed Sovereign Proof of Custody • SETU Depository Node #003
              </h4>
              <p className="text-xs text-[#C8DFDB] font-sans mt-0.5">
                All virtual companions and identity artifacts are minted on the immutable ARTHAX core ledger and backed by Section 18-G Virtual Asset Covenants.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-2.5 py-1 bg-white/10 text-[#C8DFDB] font-mono text-[11px] rounded-lg border border-white/10">
              ISO 20022
            </span>
            <span className="px-2.5 py-1 bg-white/10 text-[#C8DFDB] font-mono text-[11px] rounded-lg border border-white/10">
              Basel-III
            </span>
            <button
              type="button"
              onClick={onVerifyProof}
              className="px-3.5 py-1.5 bg-[#68D391] hover:bg-emerald-400 text-[#022448] font-sans font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#022448]" />
              <span>Verify Merkle Proof</span>
            </button>
          </div>
        </div>

        {/* Merkle Hash Strip */}
        <div className="bg-[#011428] p-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2 text-[#C8DFDB]">
            <span className="text-[#C59A45] font-bold">ZK MERKLE ROOT:</span>
            <span className="text-white select-all">{merkleRoot}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[#C8DFDB] hover:text-white text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copiedRoot ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRoot ? 'Copied to Clipboard' : 'Copy Root'}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
