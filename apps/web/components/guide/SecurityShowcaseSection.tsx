'use client';

import React from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export const SecurityShowcaseSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-[#3368A0]/15" id="security">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A8742A]/10 border border-[#A8742A]/30 text-[#A8742A] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
          <span>ACCOUNT SECURITY</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#022448] font-normal tracking-tight">
          Dual-Password Protection
        </h2>
        <p className="font-body text-sm text-[#262320]/75 mt-2">
          Your account uses two separate passwords to keep your funds secure: one for browsing and signing in, and one exclusively for approving financial actions.
        </p>
      </div>

      {/* Two-Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Government Password */}
        <div className="bg-white rounded-3xl border border-[#3368A0]/20 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-full bg-[#3368A0]/10 text-[#3368A0] font-mono text-xs font-semibold">
              STEP 1 • SIGN-IN &amp; BROWSING
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#3368A0]/10 flex items-center justify-center text-[#3368A0]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <h3 className="font-display text-2xl text-[#022448] font-medium mb-1">
            Government Password
          </h3>

          <p className="font-body text-sm text-[#262320]/75 leading-relaxed mb-6 mt-2">
            Used to sign in to your ARTHAX account and view your dashboards, profile, and messages safely.
          </p>

          <div className="space-y-3.5 pt-2 font-body text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="text-[#262320]">
                Signs in to the User Portal, Stock Portal, and Shop
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="text-[#262320]">
                Accesses your account overview, mailbox, and notifications
              </span>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-4 h-4 text-[#B5482E] shrink-0 mt-0.5" />
              <span className="text-[#B5482E] font-medium">
                Cannot authorize money transfers, stock trades, or shop purchases
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Financial Password */}
        <div className="bg-white rounded-3xl border border-[#A8742A]/30 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-full bg-[#A8742A]/10 text-[#A8742A] border border-[#A8742A]/30 font-mono text-xs font-semibold">
              STEP 2 • FINANCIAL APPROVAL
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#A8742A]/10 flex items-center justify-center text-[#A8742A]">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>

          <h3 className="font-display text-2xl text-[#022448] font-medium mb-1">
            Financial Password
          </h3>

          <p className="font-body text-sm text-[#262320]/75 leading-relaxed mb-6 mt-2">
            A separate, high-security password prompted only when you want to move money or execute a transaction.
          </p>

          <div className="space-y-3.5 pt-2 font-body text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
              <span className="text-[#262320] font-medium">
                Required to confirm any outgoing money transfer
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
              <span className="text-[#262320]">
                Required to place stock buy/sell orders and open fixed deposits
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#A8742A] shrink-0 mt-0.5" />
              <span className="text-[#262320]">
                Keeps your funds safe even if your browser session remains open
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
