'use client';

import React, { useState } from 'react';
import { History, CheckCircle2, Copy, Check } from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';

interface RewardsAuditLedgerTableProps {
  isMasked: boolean;
}

const REWARD_EVENTS = [
  {
    epoch: 'Epoch #93',
    date: '28 May 2025, 14:00 UTC',
    activity: 'Quarterly Reserve Maintenance Bonus',
    destination: 'NAVA Payroll #ARTH-9021-001',
    amount: '+450.00',
    hash: '0x9fa12b8ce49102c4',
    status: 'Settled to Balance',
  },
  {
    epoch: 'Epoch #92',
    date: '21 May 2025, 09:30 UTC',
    activity: 'Atomic Trading DvP Execution Rebate',
    destination: 'NAVA Payroll #ARTH-9021-001',
    amount: '+75.00',
    hash: '0x88bb401af298e109',
    status: 'Settled to Balance',
  },
  {
    epoch: 'Epoch #91',
    date: '14 May 2025, 18:45 UTC',
    activity: 'Double-Sign ZK Audit Verification',
    destination: 'NAVA Payroll #ARTH-9021-001',
    amount: '+25.00',
    hash: '0x3344cc9912aa8f00',
    status: 'Settled to Balance',
  },
  {
    epoch: 'Epoch #90',
    date: '07 May 2025, 12:15 UTC',
    activity: 'Sovereign Citizen Cashback Yield Harvest',
    destination: 'NAVA Payroll #ARTH-9021-001',
    amount: '+120.00',
    hash: '0x6611ee22bb553311',
    status: 'Settled to Balance',
  },
];

export const RewardsAuditLedgerTable: React.FC<RewardsAuditLedgerTableProps> = ({ isMasked }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <section id="reward-ledger" className="bg-white rounded-2xl p-6 sm:p-7 border border-[#74777F]/20 shadow-2xs space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#74777F]/15">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-serif text-xl text-[#022448] font-bold">
              Sovereign Reward Distribution &amp; Redemption Ledger
            </h2>
          </div>
          <p className="font-sans text-xs text-[#5C574F] mt-0.5">
            Cryptographically stamped civic bounties and automated yield harvest events.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-[#E5EFFF] text-[#1E3A5F] font-bold">
            All Epochs (4)
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[#F8F9FF] border-b border-[#74777F]/15 font-mono text-[11px] text-[#5C574F] uppercase tracking-wider">
              <th className="py-3 px-4">Epoch &amp; Timestamp</th>
              <th className="py-3 px-4">Activity Description</th>
              <th className="py-3 px-4">Destination Vault</th>
              <th className="py-3 px-4">Bounty Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Proof Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#74777F]/10 font-sans text-xs">
            {REWARD_EVENTS.map((event, idx) => (
              <tr key={idx} className="hover:bg-[#F8F9FF] transition-colors">
                <td className="py-3.5 px-4 font-mono text-[#121C28]">
                  <div className="font-semibold text-[#022448]">{event.epoch}</div>
                  <div className="text-[11px] text-[#74777F]">{event.date}</div>
                </td>
                <td className="py-3.5 px-4 font-medium text-[#121C28]">
                  {event.activity}
                </td>
                <td className="py-3.5 px-4 font-mono text-[#5C574F]">
                  {event.destination}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#287A55]">
                  <AnimatedMaskedValue
                    value={event.amount}
                    isMasked={isMasked}
                    maskString="••••••"
                    className="font-mono font-bold text-[#287A55]"
                    suffix={<span className="text-[10px] ml-1 text-[#5C574F]">ARTH</span>}
                  />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#287A55]/10 text-[#287A55] font-mono text-[10px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {event.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  <button
                    onClick={() => handleCopy(event.hash)}
                    type="button"
                    className="inline-flex items-center gap-1 text-[#1E3A5F] hover:text-[#022448] p-1 cursor-pointer"
                  >
                    <span>{event.hash}</span>
                    {copiedHash === event.hash ? (
                      <Check className="w-3.5 h-3.5 text-[#287A55]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
