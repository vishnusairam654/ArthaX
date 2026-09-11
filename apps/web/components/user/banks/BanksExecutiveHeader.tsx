'use client';

import React from 'react';
import { 
  Building2, 
  Wallet, 
  CheckCircle2, 
  Receipt, 
  ArrowRightLeft, 
  PlusCircle, 
  Network,
  TrendingUp,
  Zap
} from 'lucide-react';
import { AnimatedMaskedValue } from '../AnimatedMaskedValue';
import { AnimatedProgressBar } from '../AnimatedProgressBar';

interface BanksExecutiveHeaderProps {
  isMasked: boolean;
  onOpenCreateModal: () => void;
  onOpenLinkModal: () => void;
}

export const BanksExecutiveHeader: React.FC<BanksExecutiveHeaderProps> = ({
  isMasked,
  onOpenCreateModal,
  onOpenLinkModal,
}) => {
  return (
    <section className="flex flex-col gap-6 mb-8">
      {/* Top Title & CTAs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <div className="flex items-center gap-2 text-[#4C5D8E] font-mono text-xs tracking-wider uppercase font-semibold">
            <Building2 className="w-4 h-4 text-[#A8742A]" />
            <span>Inter-Bank Topology • Multi-Charter Protocol</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
            My Banks &amp; Accounts
          </h1>
          <p className="font-sans text-sm text-[#43474E] leading-relaxed">
            Manage institutional multi-bank connectivity, operational account purposes, and real-time CLS settlement limits across the ARTHAX sovereign banking grid.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="h-10 px-5 rounded-full bg-[#DBE1FF] text-[#031847] hover:bg-[#B4C5FD] font-sans text-xs font-semibold transition-all flex items-center gap-2 shadow-xs active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#1E3A5F]" />
            <span>Create Account</span>
          </button>
          <button
            type="button"
            onClick={onOpenLinkModal}
            className="h-10 px-5 rounded-full bg-[#022448] text-white hover:bg-[#1E3A5F] font-sans text-xs font-semibold transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Network className="w-4 h-4 text-[#A8742A]" />
            <span>+ Link New Bank Node</span>
          </button>
        </div>
      </div>

      {/* Aggregate Telemetry Metrics Shelf (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Liquid Capital */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[#43474E] font-mono text-xs">
            <span className="uppercase tracking-wider">Total Liquid Banking Capital</span>
            <Wallet className="w-4 h-4 text-[#1E3A5F]" />
          </div>

          <div className="my-3">
            <div className="font-serif text-2xl font-semibold text-[#022448] tracking-tight flex items-baseline gap-1">
              <AnimatedMaskedValue value="520,720.00" isMasked={isMasked} maskString="••••••••" />{' '}
              <span className="font-sans text-xs font-semibold text-[#A8742A]">ARTH</span>
            </div>
            <span className="font-mono text-xs text-[#10B981] flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Reserve Backed
            </span>
          </div>

          <div className="py-0.5">
            <AnimatedProgressBar value={82} variant="primary" height="sm" title="System Reserve Utilization: 82%" />
          </div>
        </div>

        {/* Card 2: Connected Charters */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#43474E] font-mono text-xs">
            <span className="uppercase tracking-wider">Connected Charters</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>

          <div className="my-3">
            <div className="font-serif text-2xl font-semibold text-[#121C28] tracking-tight">
              5 <span className="font-sans text-sm text-[#74777F] font-normal">of 5 Active</span>
            </div>
            <span className="font-mono text-xs text-[#43474E] flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              All Nodes Real-Time Syncing
            </span>
          </div>

          <div className="text-[#74777F] font-mono text-xs">CLS Tier-1 Cross-Settlement</div>
        </div>

        {/* Card 3: Operational Ledgers */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#43474E] font-mono text-xs">
            <span className="uppercase tracking-wider">Operational Ledgers</span>
            <Receipt className="w-4 h-4 text-[#1E3A5F]" />
          </div>

          <div className="my-3">
            <div className="font-serif text-2xl font-semibold text-[#121C28] tracking-tight">
              7 <span className="font-sans text-sm text-[#74777F] font-normal">Accounts</span>
            </div>
            <span className="font-mono text-xs text-[#43474E] mt-1 block">
              2 Payroll • 3 Treasury • 2 Transit
            </span>
          </div>

          <div className="text-[#74777F] font-mono text-xs">Dual-Auth Escrow Standard</div>
        </div>

        {/* Card 4: 24h Net Volume */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#74777F]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#43474E] font-mono text-xs">
            <span className="uppercase tracking-wider">24h Inter-Bank Net Volume</span>
            <ArrowRightLeft className="w-4 h-4 text-[#4C5D8E]" />
          </div>

          <div className="my-3">
            <div className="font-serif text-2xl font-semibold text-[#022448] tracking-tight">
              {isMasked ? '••••••' : '48,250.00'}{' '}
              <span className="font-sans text-xs font-semibold text-[#A8742A]">ARTH</span>
            </div>
            <span className="font-mono text-xs text-[#10B981] flex items-center gap-1 mt-1 font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#10B981]" /> Sub-second DvP Clearing
            </span>
          </div>

          <div className="text-[#74777F] font-mono text-xs">Gross Settlement 100% Clean</div>
        </div>
      </div>
    </section>
  );
};
