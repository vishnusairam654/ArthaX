'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Store, 
  Mail, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { AnimatedMaskedValue } from './AnimatedMaskedValue';
import { AnimatedProgressBar } from './AnimatedProgressBar';

interface CitizenMilestonesAndMailboxTrayProps {
  isMasked: boolean;
}

export const CitizenMilestonesAndMailboxTray: React.FC<CitizenMilestonesAndMailboxTrayProps> = ({ isMasked }) => {
  const [questClaimed, setQuestClaimed] = useState<boolean>(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Col 1: Citizen Milestones & Daily Quests */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 flex flex-col justify-between space-y-5" id="rewards">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#A8742A]" />
              <h3 className="font-serif text-lg font-semibold text-[#022448]">
                Citizen Milestones
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FFDDB6] text-[#2A1800] font-mono text-xs font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#B5482E]" />
              14d Streak
            </span>
          </div>

          <p className="font-sans text-xs text-[#43474E]">
            Complete daily sovereign operations to earn liquidity multiplier chips and protocol rewards.
          </p>

          <div className="space-y-2.5 pt-1">
            {/* Quest 1 */}
            <div className="p-3 bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold text-[#121C28]">
                  3 DvP Transfers Completed
                </span>
                <span className="font-mono text-[11px] text-[#43474E]">
                  Daily Tier-1 Quest
                </span>
              </div>
              <button
                type="button"
                onClick={() => setQuestClaimed(true)}
                disabled={questClaimed}
                className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold transition ${
                  questClaimed
                    ? 'bg-[#E0E2EC] text-[#74777F] cursor-default'
                    : 'bg-[#10B981] text-white hover:bg-[#059669] shadow-xs active:scale-95'
                }`}
              >
                {questClaimed ? 'Claimed ✓' : 'Claim +50 ARTH'}
              </button>
            </div>

            {/* Quest 2 */}
            <div className="p-3 bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl flex items-center justify-between gap-3 opacity-80">
              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold text-[#121C28]">
                  Open a 90-Day Fixed Deposit
                </span>
                <span className="font-mono text-[11px] text-[#43474E]">
                  Progress: 1 / 1 Complete
                </span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            </div>
          </div>
        </div>

        {/* Level & XP Footer & Gateway Link */}
        <div className="pt-3 border-t border-[#74777F]/15 font-mono text-xs text-[#43474E] space-y-2.5">
          <div className="flex items-center justify-between">
            <span>Sovereign Tier XP</span>
            <span className="font-bold text-[#1E3A5F]">Level 8 Sovereign</span>
          </div>
          <div className="py-0.5">
            <AnimatedProgressBar value={84} variant="gold" height="sm" title="Sovereign XP: 84%" />
          </div>
          <div className="flex justify-between text-[10px] text-[#74777F]">
            <span>4,820 XP</span>
            <span>5,000 XP for Tier 9</span>
          </div>

          <Link
            href="/user/rewards"
            className="w-full mt-2 py-2.5 px-4 rounded-full bg-[#E5EFFF] text-[#121C28] hover:bg-[#DBE1FF] font-sans text-xs font-medium flex items-center justify-between transition shadow-xs cursor-pointer"
          >
            <span>View All Rewards &amp; Badges</span>
            <ArrowRight className="w-4 h-4 text-[#1E3A5F]" />
          </Link>
        </div>
      </div>

      {/* Col 2: Vault & Inventory Snapshot */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 flex flex-col justify-between space-y-5" id="shop">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#1E3A5F]" />
              <h3 className="font-serif text-lg font-semibold text-[#022448]">
                Vault &amp; Inventory
              </h3>
            </div>
            <span className="font-mono text-xs font-semibold text-[#74777F] inline-flex items-baseline gap-1">
              <AnimatedMaskedValue value="31,000" isMasked={isMasked} maskString="••••••" /> ARTH Val
            </span>
          </div>

          <p className="font-sans text-xs text-[#43474E]">
            Equipped avatar artifacts grant passive APY modifiers and protocol privileges to connected accounts.
          </p>

          {/* Equipped Companion Card */}
          <div className="p-3.5 bg-[#F8F9FF] border border-[#74777F]/15 rounded-2xl flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-[#FDF8F0] border border-[#DFB87A] overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-2xs">
              <img
                src="/assets/shop/pets/Saver%20Fox/icon.png"
                alt="Saver Fox Companion"
                loading="eager"
                className="object-contain w-full h-full"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-semibold text-[#121C28]">
                  Fox Sentinel
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1E3A5F] text-white font-mono text-[9px] font-bold">
                  LEGENDARY
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#A8742A]" />
                Active: +0.85% APY Modifier
              </span>
              <span className="font-mono text-[10px] text-[#74777F]">
                Equipped on Samaya Vault #04
              </span>
            </div>
          </div>
        </div>

        {/* Shop Gateway Link */}
        <div className="pt-2">
          <Link
            href="/user/shop"
            className="w-full py-2.5 px-4 rounded-full bg-[#E5EFFF] text-[#121C28] hover:bg-[#DBE1FF] font-sans text-xs font-medium flex items-center justify-between transition shadow-xs cursor-pointer"
          >
            <span>Open Sovereign Shop &amp; Vault Items</span>
            <ArrowRight className="w-4 h-4 text-[#1E3A5F]" />
          </Link>
        </div>
      </div>

      {/* Col 3: Sovereign Mailbox & Alert Center */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#74777F]/20 flex flex-col justify-between space-y-5" id="mailbox">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#1E3A5F]" />
              <h3 className="font-serif text-lg font-semibold text-[#022448]">
                Sovereign Mailbox
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FFDAD6] text-[#93000A] font-mono text-xs font-semibold flex items-center gap-1">
              <Bell className="w-3 h-3" />
              3 Unread
            </span>
          </div>

          <p className="font-sans text-xs text-[#43474E]">
            Official institutional dispatches, rate corridor updates, and settlement alerts.
          </p>

          {/* Notices List */}
          <div className="space-y-2 pt-1">
            {/* Notice 1 */}
            <div className="p-2.5 bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#1E3A5F] mt-1.5 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold text-[#121C28] leading-tight">
                  Central Bank Monetary Directive
                </span>
                <span className="font-mono text-[11px] text-[#43474E] mt-0.5">
                  Base corridor rate maintained @ 6.25%
                </span>
              </div>
            </div>

            {/* Notice 2 */}
            <div className="p-2.5 bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#A8742A] mt-1.5 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold text-[#121C28] leading-tight">
                  FD Maturity Warning: Samaya #04
                </span>
                <span className="font-mono text-[11px] text-[#43474E] mt-0.5">
                  Auto-renewal scheduled in 42 days
                </span>
              </div>
            </div>

            {/* Notice 3 */}
            <div className="p-2.5 bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] mt-1.5 shrink-0"></span>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-semibold text-[#121C28] leading-tight">
                  CLS Settlement Batch Confirmed
                </span>
                <span className="font-mono text-[11px] text-[#43474E] mt-0.5">
                  Zero divergence for Batch #9921-IN
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mailbox Gateway Link */}
        <div className="pt-2">
          <Link
            href="/user/mailbox"
            className="w-full py-2.5 px-4 rounded-full bg-[#E5EFFF] text-[#121C28] hover:bg-[#DBE1FF] font-sans text-xs font-medium flex items-center justify-between transition shadow-xs cursor-pointer"
          >
            <span>View All Dispatches &amp; Mails</span>
            <ExternalLink className="w-4 h-4 text-[#1E3A5F]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
