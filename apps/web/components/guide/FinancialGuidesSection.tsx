'use client';

import React from 'react';
import { BookOpen, Building2, Receipt, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

interface FinancialGuidesSectionProps {
  onOpenTopic: (topic: 'banking' | 'taxes' | 'trading') => void;
}

export function FinancialGuidesSection({ onOpenTopic }: FinancialGuidesSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-[#3368A0]/15" id="guides">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 border border-[#A8742A]/30 text-[#A8742A] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#A8742A]" />
            <span>SOVEREIGN FINANCIAL CURRICULUM</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
            Educational Financial Guides
          </h2>
          <p className="font-body text-sm text-[#262320]/75 max-w-xl mt-2 leading-relaxed">
            Understand how commercial banking, settlement taxes, and equities trading operate under the ARTHAX double-entry monetary protocol.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF8F0] border border-[#A8742A]/30 font-mono text-xs text-[#A8742A] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
          <span>Interactive Curriculum</span>
        </div>
      </div>

      {/* Three Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Banking */}
        <div className="bg-white rounded-3xl border border-[#3368A0]/20 p-7 shadow-sm hover:shadow-xl hover:border-[#3368A0] transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#022448]/10 text-[#022448] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Building2 className="w-6 h-6 text-[#022448]" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#3368A0] bg-[#3368A0]/10 px-2.5 py-1 rounded-full">
                GUIDE 01
              </span>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-[#022448] group-hover:text-[#1E3A5F] transition-colors">
                How Banking Works
              </h3>
              <span className="font-mono text-[11px] text-[#A8742A] font-bold block mt-0.5">
                Unified Identity &amp; 5 Banks
              </span>
            </div>

            <p className="font-body text-xs text-[#262320]/75 leading-relaxed">
              Learn how the single identity invariant (1 GOV ID ➔ 5 Banks) functions, how fixed deposits earn compound yields, and how credit is underwritten without cross-bank friction.
            </p>

            <div className="p-3 bg-[#F2EFE7]/80 rounded-xl font-mono text-[11px] text-[#022448] border border-[#3368A0]/10">
              1 Session ➔ Nava, Samaya, Setu, Sthira, Vayu
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#3368A0]/15">
            <button
              onClick={() => onOpenTopic('banking')}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#022448] hover:bg-[#1E3A5F] text-white font-body text-xs font-semibold shadow-xs group-hover:shadow-md transition duration-200 active:scale-97"
            >
              <span>Explore Banking Guide</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A8742A] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 2: Taxes */}
        <div className="bg-white rounded-3xl border border-[#3368A0]/20 p-7 shadow-sm hover:shadow-xl hover:border-[#A8742A] transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#A8742A]/10 text-[#A8742A] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Receipt className="w-6 h-6 text-[#A8742A]" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#A8742A] bg-[#A8742A]/10 px-2.5 py-1 rounded-full">
                GUIDE 02
              </span>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-[#022448] group-hover:text-[#A8742A] transition-colors">
                How System Taxes Work
              </h3>
              <span className="font-mono text-[11px] text-[#A8742A] font-bold block mt-0.5">
                CLS Levy &amp; Net Capital Gains
              </span>
            </div>

            <p className="font-body text-xs text-[#262320]/75 leading-relaxed">
              Understand the 0.05% settlement micro-levy, why stock taxes apply strictly to net profit (never losses), and how the 365-day patient capital exemption rewards long-term holders.
            </p>

            <div className="p-3 bg-[#F2EFE7]/80 rounded-xl font-mono text-[11px] text-[#022448] border border-[#3368A0]/10">
              Tax on Realized Gain Only • Zero Volume Churn Tax
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#3368A0]/15">
            <button
              onClick={() => onOpenTopic('taxes')}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#022448] hover:bg-[#A8742A] text-white font-body text-xs font-semibold shadow-xs group-hover:shadow-md transition duration-200 active:scale-97"
            >
              <span>Explore Tax Rules</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A8742A] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Card 3: Trading */}
        <div className="bg-white rounded-3xl border border-[#3368A0]/20 p-7 shadow-sm hover:shadow-xl hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                GUIDE 03
              </span>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-[#022448] group-hover:text-emerald-800 transition-colors">
                How Stock Trading Works
              </h3>
              <span className="font-mono text-[11px] text-emerald-700 font-bold block mt-0.5">
                Atomic DvP &amp; Order Matching
              </span>
            </div>

            <p className="font-body text-xs text-[#262320]/75 leading-relaxed">
              Discover how delivery-versus-payment (DvP) eliminates counterparty settlement delay (400ms finality), how limit books execute, and why unbacked synthetic shorts are banned.
            </p>

            <div className="p-3 bg-[#F2EFE7]/80 rounded-xl font-mono text-[11px] text-[#022448] border border-[#3368A0]/10">
              Sub-400ms DvP • Zero Synthetic Leverage
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#3368A0]/15">
            <button
              onClick={() => onOpenTopic('trading')}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#022448] hover:bg-emerald-800 text-white font-body text-xs font-semibold shadow-xs group-hover:shadow-md transition duration-200 active:scale-97"
            >
              <span>Explore Equities Guide</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A8742A] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default FinancialGuidesSection;
