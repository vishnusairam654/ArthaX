'use client';

import React, { useState } from 'react';
import { Receipt, CheckCircle2, Clock, Copy, Check, Filter } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface FdPayoutLedgerTableProps {
  isMasked: boolean;
}

const TRANCHES = [
  {
    tranche: 'Q1 2025 Tranche',
    date: '14 Feb 2025',
    yieldAmount: '+1,845.00',
    status: 'Cleared (pacs.008)',
    statusType: 'cleared',
    destination: 'NAVA Payroll #ARTH-9021-001',
    hash: 'TX-SAM-8812-01-CLS',
  },
  {
    tranche: 'Q2 2025 Tranche',
    date: '14 May 2025',
    yieldAmount: '+1,872.50',
    status: 'Cleared (pacs.008)',
    statusType: 'cleared',
    destination: 'NAVA Payroll #ARTH-9021-001',
    hash: 'TX-SAM-8812-02-CLS',
  },
  {
    tranche: 'Q3 2025 Tranche',
    date: '14 Aug 2025',
    yieldAmount: '+1,895.20',
    status: 'Scheduled',
    statusType: 'scheduled',
    destination: 'NAVA Payroll #ARTH-9021-001',
    hash: 'Pending Execution',
  },
  {
    tranche: 'Q4 2025 Maturity Tranche',
    date: '14 Nov 2025',
    yieldAmount: '+1,920.00',
    status: 'Maturity Sweep',
    statusType: 'scheduled',
    destination: 'Primary Sovereign Vault',
    hash: 'Pending Execution',
  },
];

export const FdPayoutLedgerTable: React.FC<FdPayoutLedgerTableProps> = ({ isMasked }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#74777F]/20 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#74777F]/15">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-serif text-xl text-[#022448] font-bold">
              Interest Payout &amp; Ledger Audit Log
            </h2>
          </div>
          <p className="font-sans text-xs text-[#5C574F] mt-0.5">
            Real-time schedule of quarterly capitalized yield tranches and automated sweep destinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-sans text-xs text-[#5C574F]">Filter:</span>
          <span className="px-3 py-1 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-mono text-xs font-semibold border border-[#74777F]/15">
            All Quarters (4)
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FF] border-b border-[#74777F]/15 font-mono text-[11px] text-[#5C574F] uppercase tracking-wider">
              <th className="py-3 px-4">Period / Tranche</th>
              <th className="py-3 px-4">Scheduled Date</th>
              <th className="py-3 px-4">Yield Payout</th>
              <th className="py-3 px-4">Status &amp; Settlement</th>
              <th className="py-3 px-4">Destination Vault</th>
              <th className="py-3 px-4 text-right">CLS Hash Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#74777F]/10 font-sans text-xs">
            {TRANCHES.map((t, idx) => (
              <tr key={idx} className="hover:bg-[#F8F9FF] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#022448]">
                  {t.tranche}
                </td>
                <td className="py-3.5 px-4 text-[#121C28] font-mono">
                  {t.date}
                </td>
                <td className="py-3.5 px-4">
                  <AnimatedMaskedValue
                    value={t.yieldAmount}
                    isMasked={isMasked}
                    maskString="••••••"
                    className="font-mono font-bold text-[#287A55]"
                    suffix={<span className="text-[11px] font-normal text-[#5C574F] ml-1">ARTH</span>}
                  />
                </td>
                <td className="py-3.5 px-4">
                  {t.statusType === 'cleared' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#287A55]/10 text-[#287A55] font-mono text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      {t.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-mono text-[11px] font-medium">
                      <Clock className="w-3 h-3" />
                      {t.status}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#5C574F]">
                  {t.destination}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {t.statusType === 'cleared' ? (
                    <button
                      onClick={() => handleCopyHash(t.hash)}
                      type="button"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-[#1E3A5F] hover:text-[#022448] p-1 transition-colors cursor-pointer"
                    >
                      <span>#{t.hash.slice(0, 14)}</span>
                      {copiedHash === t.hash ? (
                        <Check className="w-3.5 h-3.5 text-[#287A55]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    <span className="font-mono text-xs text-[#74777F] italic">{t.hash}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
