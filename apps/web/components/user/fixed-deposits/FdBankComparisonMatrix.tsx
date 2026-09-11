'use client';

import React from 'react';
import Image from 'next/image';

interface FdBankComparisonMatrixProps {
  onSelectBankForBooking: (bankId: string) => void;
}

const COMPARISON_DATA = [
  {
    id: 'samaya',
    name: 'SAMAYA Bank',
    tagline: 'Sovereign Growth Rails',
    logo: '/assets/banks/samaya_bank.png',
    rate90: '5.20%',
    rate180: '6.10%',
    rate1yr: '7.45%',
    isTopYield: true,
    rate3yr: '7.90%',
    residentBonus: '+0.35% APY',
    minLock: '5,000 ARTH',
    liquidityClause: '0.50% penalty <90d',
  },
  {
    id: 'nava',
    name: 'NAVA Bank',
    tagline: 'Treasury Clearing Unit',
    logo: '/assets/banks/nava_bank.png',
    rate90: '5.15%',
    rate180: '5.95%',
    rate1yr: '6.90%',
    isTopYield: false,
    rate3yr: '7.30%',
    residentBonus: '+0.35% APY',
    minLock: '1,000 ARTH',
    liquidityClause: 'Zero penalty post 30d',
  },
  {
    id: 'setu',
    name: 'SETU Interbank',
    tagline: 'Domestic DvP Depository',
    logo: '/assets/banks/setu_bank.png',
    rate90: '5.30%',
    rate180: '6.20%',
    rate1yr: '7.20%',
    isTopYield: false,
    rate3yr: '7.75%',
    residentBonus: '+0.35% APY',
    minLock: '10,000 ARTH',
    liquidityClause: '1.00% penalty <180d',
  },
  {
    id: 'sthira',
    name: 'STHIRA Custody',
    tagline: 'Multi-Sig Safe Vault',
    logo: '/assets/banks/sthira_bank.png',
    rate90: '5.10%',
    rate180: '6.00%',
    rate1yr: '7.10%',
    isTopYield: false,
    rate3yr: '7.60%',
    residentBonus: '+0.35% APY',
    minLock: '5,000 ARTH',
    liquidityClause: 'Zero penalty post 90d',
  },
  {
    id: 'vayu',
    name: 'VAYU Settlement',
    tagline: 'Ultra-Fast Liquid Rails',
    logo: '/assets/banks/vayu_bank.png',
    rate90: '5.00%',
    rate180: '5.80%',
    rate1yr: '6.75%',
    isTopYield: false,
    rate3yr: '7.20%',
    residentBonus: '+0.35% APY',
    minLock: '500 ARTH',
    liquidityClause: 'Immediate release (0.25% fee)',
  },
];

export const FdBankComparisonMatrix: React.FC<FdBankComparisonMatrixProps> = ({
  onSelectBankForBooking,
}) => {
  return (
    <section className="w-full mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2">
        <div>
          <h2 className="font-serif text-2xl text-[#022448] font-bold tracking-tight">
            Sovereign Bank FD Comparison Matrix
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#5C574F]">
            Direct comparative terms across all 5 Monetary Authority member banks. Updated every block clearance.
          </p>
        </div>
        <span className="font-sans text-xs text-[#5C574F]">
          Senior / Tier-1 Bonus: <strong className="text-[#287A55]">+0.35% included</strong>
        </span>
      </div>

      {/* Ledger Table Container */}
      <div className="w-full overflow-x-auto bg-white rounded-2xl border border-[#74777F]/20 shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FF] border-b border-[#74777F]/15 font-mono text-[11px] text-[#5C574F] uppercase tracking-wider">
              <th className="py-3.5 px-6">Bank &amp; Charter</th>
              <th className="py-3.5 px-4 font-mono text-right">90-Day Rate</th>
              <th className="py-3.5 px-4 font-mono text-right">180-Day Rate</th>
              <th className="py-3.5 px-5 font-mono text-right bg-[#E5EFFF]/60 text-[#022448] font-bold">1-Year Benchmark</th>
              <th className="py-3.5 px-4 font-mono text-right">3-Year Compounding</th>
              <th className="py-3.5 px-4 text-center">Tier-1 Resident Premium</th>
              <th className="py-3.5 px-4 font-mono text-right">Min Lock</th>
              <th className="py-3.5 px-4">Liquidity Clause</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#74777F]/10 font-sans text-xs">
            {COMPARISON_DATA.map((bank) => (
              <tr key={bank.id} className="hover:bg-[#F8F9FF] transition-colors">
                {/* Bank Name */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F8F9FF] p-1 border border-[#74777F]/15 flex items-center justify-center shrink-0">
                      <Image src={bank.logo} alt={bank.name} width={28} height={28} className="object-contain" />
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-xs text-[#022448]">{bank.name}</div>
                      <span className="font-sans text-[11px] text-[#5C574F] block">{bank.tagline}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 font-mono text-right text-[#121C28]">{bank.rate90}</td>
                <td className="py-4 px-4 font-mono text-right text-[#121C28]">{bank.rate180}</td>

                {/* Benchmark Highlight */}
                <td className="py-4 px-5 font-mono text-right bg-[#E5EFFF]/25">
                  <div className="font-bold text-sm text-[#022448]">{bank.rate1yr}</div>
                  {bank.isTopYield && (
                    <span className="font-mono text-[9px] text-[#A8742A] uppercase font-bold tracking-wider">Top Yield</span>
                  )}
                </td>

                <td className="py-4 px-4 font-mono text-right text-[#121C28] font-semibold">{bank.rate3yr}</td>

                <td className="py-4 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-[#287A55]/10 text-[#287A55] font-mono text-[10px] font-semibold">
                    {bank.residentBonus}
                  </span>
                </td>

                <td className="py-4 px-4 font-mono text-right text-[#121C28]">{bank.minLock}</td>

                <td className="py-4 px-4">
                  <span className="text-[#5C574F] text-[11px]">{bank.liquidityClause}</span>
                </td>

                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onSelectBankForBooking(bank.id)}
                    type="button"
                    className="px-3 py-1 bg-[#022448] hover:bg-[#1E3A5F] text-white font-medium text-xs rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    Book FD
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
