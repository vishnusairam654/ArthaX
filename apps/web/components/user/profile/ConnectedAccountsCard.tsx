'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Eye, EyeOff, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';

interface ConnectedAccountsCardProps {
  isMasked?: boolean;
}

export function ConnectedAccountsCard({ isMasked: initialMasked = true }: ConnectedAccountsCardProps) {
  const [unmaskedAccounts, setUnmaskedAccounts] = useState<Record<string, boolean>>({});

  const toggleMask = (key: string) => {
    setUnmaskedAccounts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const accounts = [
    {
      id: 'nava',
      bankName: 'NAVA Commercial Bank',
      accountType: 'Primary Sovereign Payroll Account',
      fullNumber: '8491-0024-8821',
      maskedNumber: '•••••••• 8821',
      balance: 52480,
      badge: 'Primary DvP Node',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'samaya',
      bankName: 'SAMAYA Term Deposits',
      accountType: 'Fixed Deposit Time-Lock Vault',
      fullNumber: '8491-9931-4410',
      maskedNumber: '•••••••• 4410',
      balance: 120000,
      badge: 'Active FD Vault',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'tarang',
      bankName: 'TARANG Velocity Bank',
      accountType: 'High-Frequency Retail Clearing Node',
      fullNumber: '8491-1102-1928',
      maskedNumber: '•••••••• 1928',
      balance: 8500,
      badge: 'Sub-200ms Rail',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-[#022448] uppercase tracking-widest font-bold">
            <Building2 className="w-4 h-4 text-[#022448]" />
            <span>Connected Institutional Banking Nodes</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-[#022448] mt-0.5">
            Registered Bank Accounts
          </h2>
          <p className="font-sans text-xs text-slate-600 mt-0.5">
            Architecture invariant: 1 Email &rarr; 1 GOV ID &rarr; 1 ARTHAX User &rarr; Many Commercial Accounts.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">
            Total Multi-Bank Balance
          </span>
          <span className="font-mono text-base font-bold text-[#022448]">
            {initialMasked ? '•••••••• ARTH' : `${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH`}
          </span>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-3">
        {accounts.map((acc) => {
          const isRevealed = Boolean(unmaskedAccounts[acc.id]);

          return (
            <div
              key={acc.id}
              className="bg-[#FAF8F5] border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors hover:bg-[#F4EDE0]/50"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#1E3A5F] shrink-0 shadow-2xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-slate-900 text-sm">{acc.bankName}</h3>
                    <span
                      className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${acc.badgeClass}`}
                    >
                      {acc.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-500 mt-0.5">
                    <span>{acc.accountType}</span>
                    <span>•</span>
                    <span className="text-slate-700">
                      {isRevealed ? acc.fullNumber : acc.maskedNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleMask(acc.id)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                      title={isRevealed ? "Mask Account" : "Reveal Account"}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Liquid Allocation</span>
                <span className="font-mono text-sm font-bold text-[#022448]">
                  {initialMasked && !isRevealed ? '•••••••• ARTH' : `${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans text-slate-500">
        <div className="flex items-center gap-2 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All banking nodes synchronize continuous double-entry ledger finality.</span>
        </div>

        <Link
          href="/user/banks"
          className="font-semibold text-[#022448] hover:text-[#A8742A] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Manage in Bank Accounts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
