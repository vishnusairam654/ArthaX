'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  RotateCw, 
  ShieldCheck, 
  RefreshCw,
  Activity
} from 'lucide-react';

const HASHES = [
  '0x8F9B...4D82: STAGE 01 VALIDATED (GovID Authenticated)',
  '0x4C1A...77E0: STAGE 02 WHOLESALE DUAL COMMIT (Epoch #4,819)',
  '0x1E09...B991: STAGE 03 ROOT ZERO-DELTA VERIFIED (0.00000000 ARTH)'
];

interface TxStateMeta {
  id: string;
  name: string;
  sub: string;
  iconPath: string;
  color: string;
  badge: string;
}

const TX_STATES: TxStateMeta[] = [
  {
    id: 'validating',
    name: 'Validating',
    sub: 'GOV ID & Financial PIN',
    iconPath: '/assets/icons/pending.png',
    color: 'border-[#3368A0]/30 bg-[#3368A0]/5',
    badge: 'STAGE 1'
  },
  {
    id: 'processing',
    name: 'Processing',
    sub: 'Dual-Bank Balance Lock',
    iconPath: '/assets/icons/processing.png',
    color: 'border-[#A8742A]/30 bg-[#A8742A]/5',
    badge: 'STAGE 2'
  },
  {
    id: 'finalyzing',
    name: 'Finalyzing',
    sub: 'Double-Entry Invariant Check',
    iconPath: '/assets/icons/finalyzing.png',
    color: 'border-[#1E3A5F]/30 bg-[#1E3A5F]/5',
    badge: 'STAGE 3'
  },
  {
    id: 'completed',
    name: 'Completed',
    sub: 'T+0 Ledger Execution',
    iconPath: '/assets/icons/completed.png',
    color: 'border-emerald-500/30 bg-emerald-500/5',
    badge: 'SUCCESS'
  },
  {
    id: 'reversed',
    name: 'Reversed',
    sub: 'Atomic Rollback on Breach',
    iconPath: '/assets/icons/reversed.png',
    color: 'border-[#66A3BF]/30 bg-[#66A3BF]/5',
    badge: 'RECOVERY'
  },
  {
    id: 'failed',
    name: 'Failed',
    sub: 'Signature/Balance Rejection',
    iconPath: '/assets/icons/failed.png',
    color: 'border-[#B5482E]/30 bg-[#B5482E]/5',
    badge: 'ABORT'
  }
];

export function ClsPipelineSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedTxState, setSelectedTxState] = useState<string>('completed');

  const handleSimulateEpoch = () => {
    setActiveStep((prev) => (prev + 1) % 3);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-[#3368A0]/15" id="cls-pipeline">
      
      {/* Section Title */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 border border-[#A8742A]/30 text-[#A8742A] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <span>ATOMIC SETTLEMENT SPECIFICATION</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
          How Continuous Linked Settlement (CLS) Operates
        </h2>
        <p className="font-body text-sm text-[#262320]/75 mt-2">
          Eliminating counterparty risk through a three-stage mathematical consensus pipeline. Click any step below to simulate live cryptographic attestation.
        </p>
      </div>

      {/* Horizontal 3-Stage Atomic Step Diagram featuring Real Icon Assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-8">
        
        {/* Stage 1: Validation */}
        <div
          onClick={() => setActiveStep(0)}
          className={`p-7 rounded-3xl border transition-all duration-300 relative cursor-pointer ${
            activeStep === 0
              ? 'bg-white border-[#A8742A] shadow-xl -translate-y-1 ring-1 ring-[#A8742A]/30'
              : 'bg-white/80 border-[#3368A0]/20 hover:border-[#3368A0]/40 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EFE7] border border-[#3368A0]/15 flex items-center justify-center p-2 shadow-2xs">
              <Image
                src="/assets/icons/pending.png"
                alt="Validating Icon"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E5E0D4] font-mono text-[10px] text-[#262320]/70 uppercase font-semibold">
              STAGE 01
            </span>
          </div>
          <h4 className="font-display text-lg font-semibold text-[#022448] mb-2">
            Dual Sovereign Signatory
          </h4>
          <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-5">
            Citizen Gov ID authenticates the payload request. For any balance decrement, the isolated Financial PIN generates a single-use transaction proof.
          </p>
          <div className="p-3 bg-[#F2EFE7] rounded-xl font-mono text-[11px] text-[#262320]/80 border border-[#3368A0]/15 flex items-center justify-between">
            <code>AUTH: [GovID && FinPIN] → VALID</code>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        </div>

        {/* Stage 2: Wholesale Commitment */}
        <div
          onClick={() => setActiveStep(1)}
          className={`p-7 rounded-3xl border transition-all duration-300 relative cursor-pointer ${
            activeStep === 1
              ? 'bg-white border-[#A8742A] shadow-xl -translate-y-1 ring-1 ring-[#A8742A]/30'
              : 'bg-white/80 border-[#3368A0]/20 hover:border-[#3368A0]/40 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EFE7] border border-[#A8742A]/20 flex items-center justify-center p-2 shadow-2xs">
              <Image
                src="/assets/icons/processing.png"
                alt="Processing Icon"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#A8742A]/10 text-[#A8742A] font-mono text-[10px] uppercase font-semibold border border-[#A8742A]/30">
              STAGE 02
            </span>
          </div>
          <h4 className="font-display text-lg font-semibold text-[#022448] mb-2">
            Wholesale CLS Commitment
          </h4>
          <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-5">
            Debtor and Creditor commercial balances are staged into synchronized settlement buffers simultaneously to prevent partial fills.
          </p>
          <div className="p-3 bg-[#A8742A]/10 rounded-xl font-mono text-[11px] text-[#A8742A] border border-[#A8742A]/30 flex items-center justify-between font-semibold">
            <code>CLS: ATOMIC DUAL COMMIT (#4,819)</code>
            <RotateCw className="w-4 h-4 text-[#A8742A] shrink-0" />
          </div>
        </div>

        {/* Stage 3: Zero-Delta Finality */}
        <div
          onClick={() => setActiveStep(2)}
          className={`p-7 rounded-3xl border transition-all duration-300 relative cursor-pointer ${
            activeStep === 2
              ? 'bg-white border-[#A8742A] shadow-xl -translate-y-1 ring-1 ring-[#A8742A]/30'
              : 'bg-white/80 border-[#3368A0]/20 hover:border-[#3368A0]/40 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-300/40 flex items-center justify-center p-2 shadow-2xs">
              <Image
                src="/assets/icons/finalyzing.png"
                alt="Finalyzing Icon"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 font-mono text-[10px] uppercase font-semibold border border-emerald-500/20">
              STAGE 03
            </span>
          </div>
          <h4 className="font-display text-lg font-semibold text-[#022448] mb-2">
            Immutable Root Consensus
          </h4>
          <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-5">
            Double-entry checksum verification ensures zero currency drift across all ledgers: Σ(Debits) − Σ(Credits) = 0.00000000 ARTH.
          </p>
          <div className="p-3 bg-emerald-50 rounded-xl font-mono text-[11px] text-emerald-800 border border-emerald-300/60 flex items-center justify-between font-semibold">
            <code>ZERO_DELTA: 0.00000000 ARTH</code>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        </div>
      </div>

      {/* Interactive Live Consensus Telemetry Simulation Bar */}
      <div className="p-4 mb-14 rounded-2xl bg-[#F2EFE7] border border-[#3368A0]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8742A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A8742A]" />
          </span>
          <span className="text-[#262320]/60">Active Consensus Proof:</span>
          <span className="font-semibold text-[#022448] tracking-tight transition-all duration-300">
            {HASHES[activeStep]}
          </span>
        </div>
        <button
          onClick={handleSimulateEpoch}
          className="px-4 py-1.5 rounded-full bg-white border border-[#3368A0]/20 text-[#022448] font-body font-semibold hover:bg-white hover:border-[#A8742A]/50 shadow-xs text-[11px] transition active:scale-95 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#A8742A]" />
          <span>Simulate DvP Epoch</span>
        </button>
      </div>

      {/* ================= TRANSACTION STATE MATRIX (Using All 6 Icon Assets) ================= */}
      <div className="bg-white rounded-3xl border border-[#3368A0]/20 shadow-md p-7 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#3368A0]/15">
          <div>
            <h3 className="font-display text-xl font-medium text-[#022448]">
              Transaction State Lifecycle
            </h3>
            <p className="font-body text-xs text-[#262320]/70 mt-0.5">
              Official cryptographic lifecycle states governing all ARTH transfers, trades, and shop purchases.
            </p>
          </div>
          <span className="px-3 py-1 bg-[#F2EFE7] rounded-full border border-[#3368A0]/15 font-mono text-xs text-[#022448] font-semibold w-fit">
            6 Official Protocol States
          </span>
        </div>

        {/* 6 Icons Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TX_STATES.map((st) => (
            <div
              key={st.id}
              onClick={() => setSelectedTxState(st.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center text-center group ${
                selectedTxState === st.id
                  ? 'border-[#A8742A] bg-[#FDF8F0] shadow-md -translate-y-1'
                  : 'border-[#3368A0]/15 bg-white hover:border-[#3368A0]/30 hover:bg-[#F8F9FF]'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#3368A0]/15 flex items-center justify-center p-2.5 shadow-2xs mb-2.5 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={st.iconPath}
                  alt={`${st.name} State`}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <span className="font-display text-sm font-semibold text-[#022448] block">
                {st.name}
              </span>
              <span className="font-mono text-[9px] text-[#262320]/60 mt-0.5 block leading-tight">
                {st.sub}
              </span>
              <span className="mt-2.5 px-2 py-0.5 rounded-full font-mono text-[8px] font-bold tracking-wider uppercase bg-white border border-[#3368A0]/15 text-[#262320]/70">
                {st.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SYSTEM TAXONOMY COMPARISON MATRIX ================= */}
      <div className="mt-12 bg-white rounded-3xl border border-[#3368A0]/20 shadow-md overflow-hidden">
        <div className="px-7 py-5 bg-[#F2EFE7]/80 border-b border-[#3368A0]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#022448]">
              System Taxonomy Comparison
            </h3>
            <p className="font-body text-xs text-[#262320]/70 mt-0.5">
              Legacy correspondent banking vs. ARTHAX Sovereign Double-Entry Matrix
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-white rounded-full border border-[#3368A0]/15 font-mono text-xs text-[#022448] font-medium shadow-2xs w-fit">
            T+2 vs. T+0 Settlement
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs">
            <thead>
              <tr className="bg-[#F8F9FF] border-b border-[#3368A0]/15 text-[#262320]/60 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-7">Dimension</th>
                <th className="py-3.5 px-7">Legacy Siloed Financial System</th>
                <th className="py-3.5 px-7 text-[#022448] font-bold">ARTHAX Sovereign Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3368A0]/10 text-[#262320]/80">
              <tr className="hover:bg-[#F2EFE7]/40 transition duration-150">
                <td className="py-4 px-7 font-medium text-[#022448] font-mono">Settlement Horizon</td>
                <td className="py-4 px-7">T+2 Business Days (Batch SWIFT / Clearinghouse)</td>
                <td className="py-4 px-7 font-semibold text-emerald-700 bg-emerald-50/50">Sub-second Atomic DvP Settlement (400ms)</td>
              </tr>
              <tr className="hover:bg-[#F2EFE7]/40 transition duration-150">
                <td className="py-4 px-7 font-medium text-[#022448] font-mono">Book Reconciliation</td>
                <td className="py-4 px-7">Fragmented Nostro / Vostro accounts across intermediaries</td>
                <td className="py-4 px-7 font-semibold text-[#022448] bg-[#3368A0]/5">Single Shared Double-Entry Root Tree</td>
              </tr>
              <tr className="hover:bg-[#F2EFE7]/40 transition duration-150">
                <td className="py-4 px-7 font-medium text-[#022448] font-mono">Reserve Verifiability</td>
                <td className="py-4 px-7">Quarterly audited self-disclosures with lag</td>
                <td className="py-4 px-7 font-semibold text-[#A8742A] bg-[#A8742A]/5">Continuous Cryptographic Attestation (104.2% Reserve)</td>
              </tr>
              <tr className="hover:bg-[#F2EFE7]/40 transition duration-150">
                <td className="py-4 px-7 font-medium text-[#022448] font-mono">Identity Custody</td>
                <td className="py-4 px-7">Dispersed 3rd party bureaus, centralized single passwords</td>
                <td className="py-4 px-7 font-semibold text-[#022448] bg-[#3368A0]/5">Sovereign Dual-Credential (Gov Password + Hardware Financial PIN)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ClsPipelineSection;
