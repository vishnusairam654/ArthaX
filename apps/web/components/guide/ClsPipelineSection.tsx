'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';

interface TxStateMeta {
  id: string;
  name: string;
  sub: string;
  iconPath: string;
  badge: string;
}

const TX_STATES: TxStateMeta[] = [
  {
    id: 'validating',
    name: 'Validating',
    sub: 'Checking password & account details',
    iconPath: '/assets/icons/pending.png',
    badge: 'STAGE 1'
  },
  {
    id: 'processing',
    name: 'Processing',
    sub: 'Transferring funds between banks',
    iconPath: '/assets/icons/processing.png',
    badge: 'STAGE 2'
  },
  {
    id: 'finalyzing',
    name: 'Finalizing',
    sub: 'Verifying balances match',
    iconPath: '/assets/icons/finalyzing.png',
    badge: 'STAGE 3'
  },
  {
    id: 'completed',
    name: 'Completed',
    sub: 'Transfer complete and balance updated',
    iconPath: '/assets/icons/completed.png',
    badge: 'SUCCESS'
  },
  {
    id: 'reversed',
    name: 'Reversed',
    sub: 'Funds returned safely if interrupted',
    iconPath: '/assets/icons/reversed.png',
    badge: 'RETURNED'
  },
  {
    id: 'failed',
    name: 'Failed',
    sub: 'Declined due to incorrect details or low funds',
    iconPath: '/assets/icons/failed.png',
    badge: 'DECLINED'
  }
];

export function ClsPipelineSection() {
  const [selectedTxState, setSelectedTxState] = useState<string>('completed');

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-[#3368A0]/15" id="cls-pipeline">
      
      {/* Section Title */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 border border-[#A8742A]/30 text-[#A8742A] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <span>HOW TRANSFERS WORK</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
          How Payments and Transfers Settle
        </h2>
        <p className="font-body text-sm text-[#262320]/75 mt-2">
          Every transfer follows a straightforward 3-step process to ensure your funds move instantly and securely.
        </p>
      </div>

      {/* 3-Step Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-12">
        
        {/* Step 1: Verification */}
        <div className="p-7 rounded-3xl border border-[#3368A0]/20 bg-white shadow-sm flex flex-col justify-between">
          <div>
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
                STEP 1
              </span>
            </div>
            <h4 className="font-display text-lg font-semibold text-[#022448] mb-2">
              Identity &amp; Password Check
            </h4>
            <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-5">
              Your account identity is verified and your Financial Password confirms you approved this transfer.
            </p>
          </div>
          <div className="p-3 bg-[#F2EFE7] rounded-xl font-body text-xs text-[#022448] border border-[#3368A0]/15 flex items-center justify-between font-medium">
            <span>Password Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        </div>

        {/* Step 2: Instant Transfer */}
        <div className="p-7 rounded-3xl border border-[#A8742A]/30 bg-white shadow-sm flex flex-col justify-between">
          <div>
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
                STEP 2
              </span>
            </div>
            <h4 className="font-display text-lg font-semibold text-[#022448] mb-2">
              Direct Bank Clearing
            </h4>
            <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-5">
              Funds are transferred directly between the sender and recipient accounts across our connected banks.
            </p>
          </div>
          <div className="p-3 bg-[#A8742A]/10 rounded-xl font-body text-xs text-[#A8742A] border border-[#A8742A]/30 flex items-center justify-between font-semibold">
            <span>Direct Bank Transfer</span>
            <ArrowRight className="w-4 h-4 text-[#A8742A] shrink-0" />
          </div>
        </div>

        {/* Step 3: Complete */}
        <div className="p-7 rounded-3xl border border-emerald-300/40 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-300/40 flex items-center justify-center p-2 shadow-2xs">
                <Image
                  src="/assets/icons/completed.png"
                  alt="Completed Icon"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 font-mono text-[10px] uppercase font-semibold border border-emerald-500/20">
                STEP 3
              </span>
            </div>
            <h4 className="font-display text-lg font-semibold text-[#022448] mb-2">
              Balances Updated Instantly
            </h4>
            <p className="font-body text-xs text-[#262320]/75 leading-relaxed mb-5">
              Both bank balances update immediately and a receipt is saved to your account history.
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl font-body text-xs text-emerald-800 border border-emerald-300/60 flex items-center justify-between font-semibold">
            <span>Settled Instantly</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        </div>
      </div>

      {/* ================= TRANSACTION STATE MATRIX (6 Clean States) ================= */}
      <div className="bg-white rounded-3xl border border-[#3368A0]/20 shadow-sm p-7 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#3368A0]/15">
          <div>
            <h3 className="font-display text-xl font-medium text-[#022448]">
              Transaction Statuses
            </h3>
            <p className="font-body text-xs text-[#262320]/70 mt-0.5">
              Understand what each status means when viewing your transfers and orders.
            </p>
          </div>
          <span className="px-3 py-1 bg-[#F2EFE7] rounded-full border border-[#3368A0]/15 font-mono text-xs text-[#022448] font-semibold w-fit">
            6 Status Types
          </span>
        </div>

        {/* 6 Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TX_STATES.map((st) => (
            <div
              key={st.id}
              onClick={() => setSelectedTxState(st.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col items-center text-center group ${
                selectedTxState === st.id
                  ? 'border-[#A8742A] bg-[#FDF8F0] shadow-sm -translate-y-0.5'
                  : 'border-[#3368A0]/15 bg-white hover:border-[#3368A0]/30 hover:bg-[#F8F9FF]'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#3368A0]/15 flex items-center justify-center p-2.5 shadow-2xs mb-2.5 group-hover:scale-105 transition-transform duration-200">
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
              <span className="font-body text-[10px] text-[#262320]/70 mt-1 block leading-tight">
                {st.sub}
              </span>
              <span className="mt-2.5 px-2 py-0.5 rounded-full font-mono text-[8px] font-bold tracking-wider uppercase bg-white border border-[#3368A0]/15 text-[#262320]/70">
                {st.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClsPipelineSection;
