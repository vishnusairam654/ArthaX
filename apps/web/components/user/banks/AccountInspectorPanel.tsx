'use client';

import React, { useState } from 'react';
import { 
  Fingerprint, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowDown, 
  ArrowUp,
  Lock,
  ExternalLink
} from 'lucide-react';

interface AccountInspectorPanelProps {
  selectedAccount: string;
  selectedBank: string;
  isMasked: boolean;
}

export const AccountInspectorPanel: React.FC<AccountInspectorPanelProps> = ({
  selectedAccount,
  selectedBank,
  isMasked,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Dynamic Inspector Data
  const getIban = () => {
    if (selectedAccount === 'ARTH-9021-001') return 'arthax.nava.cls.8491-904-in.001';
    if (selectedAccount === 'ARTH-9021-002') return 'arthax.nava.cls.8491-904-in.002';
    if (selectedAccount === 'ARTH-4412-001') return 'arthax.samaya.yield.8491-904-in.001';
    if (selectedAccount === 'ARTH-8831-001') return 'arthax.setu.dvp.8491-904-in.001';
    if (selectedAccount === 'ARTH-1190-001') return 'arthax.sthira.vault.8491-904-in.001';
    if (selectedAccount === 'ARTH-7740-001') return 'arthax.vayu.instant.8491-904-in.001';
    return `arthax.${selectedBank}.cls.8491-904-in.001`;
  };

  const getPurpose = () => {
    if (selectedAccount === 'ARTH-9021-001') return 'Sovereign Salary Deposit';
    if (selectedAccount === 'ARTH-9021-002') return 'Daily Merchant Spending Float';
    if (selectedAccount === 'ARTH-4412-001') return 'Term Wealth Reserve (6.85% APY)';
    if (selectedAccount === 'ARTH-8831-001') return 'DvP Cross-Bank Settlement Rail';
    if (selectedAccount === 'ARTH-1190-001') return 'HSM Multi-Sig Escrow Custody';
    if (selectedAccount === 'ARTH-7740-001') return 'Instant Micro-Transfer Transit';
    return 'Operating Account';
  };

  const iban = getIban();
  const purpose = getPurpose();

  const handleCopy = () => {
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="xl:col-span-4 flex flex-col gap-4">
      <div 
        className="bg-white rounded-2xl p-6 shadow-xs border border-[#74777F]/20 flex flex-col gap-5 sticky top-40"
        id="account-inspector-panel"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-[#1E3A5F]" />
            <span className="font-mono text-xs font-bold text-[#022448] uppercase tracking-wider">
              Account Inspector
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#A8F5BF]/70 text-[#002110] font-mono text-[10px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            Verified Hash
          </span>
        </div>

        {/* Inspected Account Identifiers */}
        <div className="bg-[#F8F9FF] border border-[#74777F]/15 rounded-xl p-4 flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-[#74777F] uppercase tracking-wider font-semibold">
            Full Sovereign IBAN / Hash
          </span>
          <div className="font-mono text-xs text-[#022448] font-semibold break-all bg-white p-2.5 rounded-lg border border-[#74777F]/15 shadow-inner">
            {iban}
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-[#43474E] font-mono">
            <span>Charter: {selectedBank.toUpperCase()} Node</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[#1E3A5F] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Detailed Inspector Attributes */}
        <div className="flex flex-col gap-2.5 text-xs font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
            <span className="text-[#43474E]">Purpose Designation</span>
            <span className="font-semibold text-[#121C28]">{purpose}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
            <span className="text-[#43474E]">Beneficiary</span>
            <span className="font-semibold text-[#121C28]">Ananya Sharma (#8491-904-IN)</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
            <span className="text-[#43474E]">Assigned Officer</span>
            <span className="font-semibold text-[#121C28]">R. Sen (Node Custodian)</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
            <span className="text-[#43474E]">Cryptographic Enclave</span>
            <span className="font-semibold text-[#10B981] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              FIPS 140-3 L4
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#43474E]">High-Value Outflow Policy</span>
            <span className="font-mono text-[10px] text-[#2A1800] bg-[#FFDDB6] px-2 py-0.5 rounded font-semibold">
              Dual-Pass Required &gt;10k
            </span>
          </div>
        </div>

        {/* Recent Ledger Events Snapshot */}
        <div className="mt-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-bold text-[#121C28]">
              Recent Settlement Stream
            </span>
            <span className="font-mono text-[10px] text-[#74777F]">
              Real-Time Sync
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Tx 1 */}
            <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#A8F5BF]/60 text-[#002110] flex items-center justify-center shrink-0">
                  <ArrowDown className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#121C28]">Gov Sovereign Payroll</span>
                  <span className="font-mono text-[10px] text-[#74777F]">TX-98402 • CLS Final</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[#10B981]">
                  {isMasked ? '••••••' : '+45,000.00'}
                </span>
                <div className="font-mono text-[10px] text-[#74777F]">
                  {isMasked ? '••••' : '142,500.00'} ARTH
                </div>
              </div>
            </div>

            {/* Tx 2 */}
            <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#FFDAD6] text-[#93000A] flex items-center justify-center shrink-0">
                  <ArrowUp className="w-3.5 h-3.5 text-[#BA1A1A]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#121C28]">DvP Settlement SETU</span>
                  <span className="font-mono text-[10px] text-[#74777F]">TX-98319 • Interbank</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[#121C28]">
                  {isMasked ? '••••••' : '-6,500.00'}
                </span>
                <div className="font-mono text-[10px] text-[#74777F]">
                  {isMasked ? '••••' : '97,500.00'} ARTH
                </div>
              </div>
            </div>

            {/* Tx 3 */}
            <div className="p-2.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#FFDAD6] text-[#93000A] flex items-center justify-center shrink-0">
                  <ArrowUp className="w-3.5 h-3.5 text-[#BA1A1A]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#121C28]">SAMAYA Term Allocation</span>
                  <span className="font-mono text-[10px] text-[#74777F]">TX-97992 • Auto-Yield</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[#121C28]">
                  {isMasked ? '••••••' : '-2,500.00'}
                </span>
                <div className="font-mono text-[10px] text-[#74777F]">
                  {isMasked ? '••••' : '104,000.00'} ARTH
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Link */}
        <a
          href={`/user/banks/${selectedAccount}`}
          className="w-full py-2.5 px-3 rounded-xl bg-[#022448] hover:bg-[#1E3A5F] text-white font-sans text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <span>Open Full Account Ledger</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Node Verification Footprint */}
        <div className="bg-[#EEF4FF] rounded-xl p-3 flex items-center justify-between text-[#43474E] font-mono text-xs border border-[#74777F]/20">
          <div className="flex items-center gap-1.5 text-[#1E3A5F]">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Cryptographic Proof Valid</span>
          </div>
          <span className="text-[11px] text-[#74777F]">BLOCK: 28,102,510</span>
        </div>
      </div>
    </div>
  );
};
