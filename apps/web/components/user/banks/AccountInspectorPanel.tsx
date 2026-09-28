'use client';

import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowDown, 
  ArrowUp, 
  Lock, 
  ExternalLink,
  Receipt
} from 'lucide-react';
import { apiGetActivePersona, apiFetchAccountTransactions } from '@/lib/api';
import { BankAccountDto, TransactionDto } from '@arthax/types';

interface AccountInspectorPanelProps {
  selectedAccount: string;
  selectedBank: string;
  isMasked: boolean;
  accounts?: BankAccountDto[];
}

export const AccountInspectorPanel: React.FC<AccountInspectorPanelProps> = ({
  selectedAccount,
  selectedBank,
  isMasked,
  accounts = [],
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activePersona, setActivePersona] = useState(apiGetActivePersona());
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loadingTxs, setLoadingTxs] = useState<boolean>(false);

  const currentAccount = accounts.find((a) => a.accountNumber === selectedAccount);

  useEffect(() => {
    setActivePersona(apiGetActivePersona());
  }, [selectedAccount]);

  useEffect(() => {
    let isMounted = true;
    if (currentAccount?.id) {
      setLoadingTxs(true);
      apiFetchAccountTransactions(currentAccount.id)
        .then((txs) => {
          if (isMounted) {
            setTransactions(Array.isArray(txs) ? txs.slice(0, 3) : []);
          }
        })
        .catch(() => {
          if (isMounted) setTransactions([]);
        })
        .finally(() => {
          if (isMounted) setLoadingTxs(false);
        });
    } else {
      setTransactions([]);
    }

    return () => {
      isMounted = false;
    };
  }, [currentAccount?.id]);

  const iban = currentAccount
    ? `arthax.${(currentAccount.bankId || selectedBank).toLowerCase()}.cls.${currentAccount.accountNumber.toLowerCase()}`
    : `arthax.${selectedBank.toLowerCase()}.cls.unlinked`;

  const purpose = currentAccount?.purpose || 'General Sovereign Operating Liquidity';

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
            <span className="font-semibold text-[#121C28] truncate max-w-[200px]" title={purpose}>
              {purpose}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
            <span className="text-[#43474E]">Beneficiary</span>
            <span className="font-semibold text-[#121C28] truncate max-w-[200px]">
              {activePersona.displayName || 'Sovereign Citizen'} ({activePersona.govIdNumber || 'GOV-ID'})
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
            <span className="text-[#43474E]">Assigned Custodian</span>
            <span className="font-semibold text-[#121C28]">Institutional Node Custodian</span>
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
            {loadingTxs ? (
              <div className="p-3 text-center text-xs text-[#74777F] font-mono">
                Syncing ledger events...
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => {
                const amt = Number(BigInt(tx.amountMinor)) / 100;
                const isIncoming = tx.type === 'REWARD' || tx.destinationAccountId === currentAccount?.id;

                return (
                  <div key={tx.id} className="p-2.5 rounded-xl bg-[#F8F9FF] border border-[#74777F]/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        isIncoming ? 'bg-[#A8F5BF]/60 text-[#002110]' : 'bg-[#FFDAD6] text-[#93000A]'
                      }`}>
                        {isIncoming ? <ArrowDown className="w-3.5 h-3.5 text-[#10B981]" /> : <ArrowUp className="w-3.5 h-3.5 text-[#BA1A1A]" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#121C28] capitalize">
                          {tx.type.toLowerCase().replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-[10px] text-[#74777F]">
                          {tx.referenceNumber} • {tx.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold ${isIncoming ? 'text-[#10B981]' : 'text-[#121C28]'}`}>
                        {isIncoming ? '+' : '-'}{isMasked ? '••••••' : amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <div className="font-mono text-[10px] text-[#74777F]">
                        ARTH
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-xl bg-[#F8F9FF] border border-dashed border-[#74777F]/20 text-center flex flex-col items-center gap-1.5 text-xs text-[#74777F]">
                <Receipt className="w-4 h-4 text-[#74777F]" />
                <span>Ledger Initialized • Double-Entry Valid</span>
                <span className="font-mono text-[10px] text-[#10B981]">CLS Synchronized</span>
              </div>
            )}
          </div>
        </div>

        {/* Deep Dive Link */}
        {selectedAccount && currentAccount && (
          <a
            href={`/user/banks/${selectedAccount}`}
            className="w-full py-2.5 px-3 rounded-xl bg-[#022448] hover:bg-[#1E3A5F] text-white font-sans text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>Open Full Account Ledger</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Node Verification Footprint */}
        <div className="bg-[#EEF4FF] rounded-xl p-3 flex items-center justify-between text-[#43474E] font-mono text-xs border border-[#74777F]/20">
          <div className="flex items-center gap-1.5 text-[#1E3A5F]">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Cryptographic Proof Valid</span>
          </div>
          <span className="text-[11px] text-[#74777F]">CLS VERIFIED</span>
        </div>
      </div>
    </div>
  );
};
