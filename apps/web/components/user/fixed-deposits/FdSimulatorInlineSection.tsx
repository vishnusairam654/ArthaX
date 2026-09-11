'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calculator, Lock, ShieldCheck, Fingerprint } from 'lucide-react';

interface FdSimulatorInlineSectionProps {
  onOpenBookingModalWithParams: (params: { bankId: string; principal: number; days: number }) => void;
}

const SIMULATOR_BANKS = [
  { id: 'SAMAYA', name: 'SAMAYA', rate: 7.45, logo: '/assets/banks/samaya_bank.png' },
  { id: 'NAVA', name: 'NAVA', rate: 6.90, logo: '/assets/banks/nava_bank.png' },
  { id: 'SETU', name: 'SETU', rate: 7.20, logo: '/assets/banks/setu_bank.png' },
  { id: 'STHIRA', name: 'STHIRA', rate: 7.10, logo: '/assets/banks/sthira_bank.png' },
  { id: 'VAYU', name: 'VAYU', rate: 6.75, logo: '/assets/banks/vayu_bank.png' },
];

export const FdSimulatorInlineSection: React.FC<FdSimulatorInlineSectionProps> = ({
  onOpenBookingModalWithParams,
}) => {
  const [principal, setPrincipal] = useState<number>(25000);
  const [selectedTenureDays, setSelectedTenureDays] = useState<number>(365);
  const [selectedBank, setSelectedBank] = useState<string>('SAMAYA');

  const activeBankObj = SIMULATOR_BANKS.find((b) => b.id === selectedBank) || SIMULATOR_BANKS[0];
  const grossRate = activeBankObj.rate;
  const residentBonus = 0.35;
  const netRate = Number((grossRate + residentBonus).toFixed(2));
  const estimatedInterest = Number(((principal * netRate * (selectedTenureDays / 365)) / 100).toFixed(2));
  const totalAtMaturity = Number((principal + estimatedInterest).toFixed(2));

  // Compute maturity date label
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + selectedTenureDays);
  const dateFormatted = maturityDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section id="simulator-section" className="w-full mb-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#74777F]/20 shadow-2xs relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 justify-between">
        {/* Left: Interactive Controls */}
        <div className="flex-1 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E5EFFF] text-[#1E3A5F] flex items-center justify-center">
                <Calculator className="w-3.5 h-3.5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Interactive Yield Engine
              </span>
            </div>
            <h2 className="font-serif text-2xl text-[#022448] font-bold tracking-tight">
              Term Deposit Simulator &amp; Booking
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5C574F]">
              Simulate multi-tier sovereign APY across chartered banks with real-time Enclave authorization.
            </p>
          </div>

          <div className="space-y-5">
            {/* Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider">
                  Principal Commitment (ARTH)
                </label>
                <div className="flex items-baseline gap-1 font-mono text-xl font-bold text-[#022448]">
                  <span>{principal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-xs text-[#5C574F] font-normal">ARTH</span>
                </div>
              </div>

              <input
                type="range"
                min={5000}
                max={250000}
                step={5000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-[#E5EFFF] rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
              />

              <div className="flex justify-between font-mono text-[11px] text-[#74777F]">
                <span>5,000 ARTH</span>
                <span>100,000 ARTH</span>
                <span>250,000 ARTH</span>
              </div>
            </div>

            {/* Tenure Buttons */}
            <div className="space-y-2">
              <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider block">
                Tenure Period
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { days: 90, label: '90 Days' },
                  { days: 180, label: '180 Days' },
                  { days: 365, label: '1 Year (365d)' },
                  { days: 1095, label: '3 Years' },
                ].map((item) => {
                  const isSelected = selectedTenureDays === item.days;
                  return (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setSelectedTenureDays(item.days)}
                      className={`py-2 px-3 rounded-xl border text-center font-sans text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#022448] text-white border-[#022448] font-semibold shadow-2xs'
                          : 'bg-[#F8F9FF] text-[#43474E] border-[#74777F]/20 hover:bg-[#E5EFFF]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bank Picker */}
            <div className="space-y-2">
              <label className="font-sans text-xs font-semibold text-[#121C28] uppercase tracking-wider block">
                Chartered Partner Bank
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SIMULATOR_BANKS.map((b) => {
                  const isSelected = selectedBank === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBank(b.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#E5EFFF] border-[#1E3A5F] shadow-2xs'
                          : 'bg-[#F8F9FF] border-[#74777F]/20 hover:bg-[#EEF4FF]'
                      }`}
                    >
                      <Image src={b.logo} alt={b.name} width={24} height={24} className="h-6 w-auto object-contain" />
                      <span className="font-sans text-xs font-semibold text-[#121C28]">{b.name}</span>
                      <span className="font-mono text-[11px] text-[#1E3A5F] font-bold">{b.rate}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Yield Projection Drawer Panel */}
        <div className="lg:w-96 bg-[#F8F9FF] p-6 rounded-2xl border border-[#74777F]/20 flex flex-col justify-between space-y-6 shadow-2xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#74777F]/15">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5C574F] font-semibold">
                Terminal Yield Projection
              </span>
              <span className="px-2 py-0.5 bg-[#287A55]/10 text-[#287A55] font-mono text-[10px] rounded-full font-bold">
                Tier-1 +0.35% Applied
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-sans text-xs text-[#5C574F]">Estimated Total At Maturity</span>
              <div className="font-serif text-3xl text-[#022448] font-bold tracking-tight">
                {totalAtMaturity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                <span className="font-mono text-xs text-[#5C574F] font-normal ml-1.5">ARTH</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-[#5C574F]">Selected Bank APY:</span>
                <span className="text-[#121C28] font-semibold font-mono">
                  {grossRate}% + 0.35% ({netRate}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C574F]">Estimated Net Interest:</span>
                <span className="text-[#287A55] font-semibold font-mono">
                  +{estimatedInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })} ARTH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C574F]">Maturity Date:</span>
                <span className="text-[#121C28] font-medium font-sans">{dateFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C574F]">Sovereign Guarantee:</span>
                <span className="text-[#1E3A5F] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  100% Core Ledger
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-2.5 rounded-xl bg-white border border-[#74777F]/15 flex items-center gap-2 text-[#5C574F] text-[11px]">
              <Lock className="w-3.5 h-3.5 text-[#1E3A5F] shrink-0" />
              <span>Step-up: Fin PIN confirmation required at Enclave</span>
            </div>

            <button
              onClick={() => onOpenBookingModalWithParams({ bankId: selectedBank.toLowerCase(), principal, days: selectedTenureDays })}
              type="button"
              className="w-full py-2.5 px-4 bg-[#022448] hover:bg-[#1E3A5F] text-white rounded-full font-sans text-xs font-medium shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Fingerprint className="w-4 h-4 text-[#A8742A]" />
              <span>Authorize Booking via Financial PIN</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
