'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Coins,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { MOCK_CENTRAL_BANK_STATS } from './CentralBankMockData';
import { EmergencyCircuitBreakerModal } from './EmergencyCircuitBreakerModal';
import { CentralBankMaskedValue } from './CentralBankMaskedValue';

export const CentralBankTelemetryBar: React.FC = () => {
  const [epoch, setEpoch] = useState(MOCK_CENTRAL_BANK_STATS.currentEpoch);
  const [isBreakerActive, setIsBreakerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveUtc, setLiveUtc] = useState<string>('');

  // Live ticking UTC time and simulated epoch progression
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveUtc(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);

    const epochTimer = setInterval(() => {
      setEpoch((prev) => prev + 1);
    }, 25000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(epochTimer);
    };
  }, []);

  const handleToggleBreaker = () => {
    setIsBreakerActive(!isBreakerActive);
  };

  return (
    <>
      <header
        role="banner"
        className="w-full bg-[#FAF7EE] text-[#1E293B] border border-[#D8C7A5] rounded-2xl shadow-xs select-none overflow-hidden transition-all"
      >
        {/* ====================================================================
            LEVEL 1: PRIMARY SOVEREIGN IDENTITY & CORE MONETARY TELEMETRY
            ==================================================================== */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-4 border-b border-[#E3D8C0]">
          
          {/* Institution Identity (Visually Dominant Hierarchy) */}
          <Link
            href="/central-bank"
            className="flex items-center gap-3.5 group cursor-pointer shrink-0"
          >
            {/* Emblem */}
            <div className="w-10 h-10 rounded-xl bg-[#0E3844] p-1 border border-[#A8742A]/40 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#A8742A] transition-colors">
              <Image
                src="/assets/portals/central_bank.png"
                alt="Central Bank of ARTHAX Sovereign Seal"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
            </div>

            {/* Institution Typography */}
            <div className="flex flex-col">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#7A6237] font-semibold leading-none mb-1">
                Sovereign Monetary Authority
              </span>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-[#0E3844] leading-tight tracking-tight group-hover:text-[#0A2831] transition-colors">
                Central Bank of ARTHAX
              </h1>
            </div>
          </Link>

          {/* Consolidated Financial Infrastructure Telemetry Group */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-0.5">
            
            {/* 1. Official Ledger Invariant Verification Status */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0F6F2] border border-[#BFD9C7] text-[#144733] font-mono text-[11px] shrink-0 shadow-2xs"
              title="Statutory double-entry ledger balance: sum(debits) = sum(credits)"
            >
              <ShieldCheck className="w-4 h-4 text-[#1B6A4C] shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-tight">
                <span className="font-bold tracking-tight">Σ Debits = Σ Credits</span>
                <span className="text-[10px] text-[#2D7354] uppercase tracking-wider font-semibold">
                  Verified
                </span>
              </div>
            </div>

            {/* Subtle Vertical Divider */}
            <div className="h-7 w-px bg-[#D8C7A5]/70 hidden md:block shrink-0" />

            {/* 2. Live CLS Real-Time Telemetry Readout */}
            <div className="flex items-center gap-2 font-mono shrink-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isBreakerActive
                    ? 'bg-[#B5482E] animate-ping'
                    : 'bg-emerald-600 animate-pulse'
                }`}
              />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase tracking-wider text-[#7A6237] font-semibold mb-0.5">
                  CLS Infrastructure
                </span>
                <span className="text-xs font-bold text-[#0E3844] tracking-tight">
                  {isBreakerActive ? 'HALTED · DISENGAGED' : 'REAL-TIME · T+0'}
                </span>
              </div>
            </div>

            {/* Subtle Vertical Divider */}
            <div className="h-7 w-px bg-[#D8C7A5]/70 hidden lg:block shrink-0" />

            {/* 3. CRR / SLR Compliance Readout */}
            <div className="hidden lg:flex flex-col font-mono leading-none shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-[#7A6237] font-semibold mb-0.5">
                Statutory Ratios
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#0E3844]">
                <span className="font-bold">CRR 12% · SLR 18%</span>
                <span className="text-[9px] font-sans font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  COMPLIANT
                </span>
              </div>
            </div>

            {/* Subtle Vertical Divider */}
            <div className="h-7 w-px bg-[#D8C7A5]/70 hidden xl:block shrink-0" />

            {/* 4. ARTH Circulation / Reserve Metric */}
            <div className="hidden xl:flex flex-col font-mono leading-none shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-[#7A6237] font-semibold mb-0.5">
                M0 Monetary Base
              </span>
              <div className="flex items-center gap-1 text-xs text-[#0E3844] font-bold">
                <CentralBankMaskedValue
                  value={MOCK_CENTRAL_BANK_STATS.totalCirculation}
                  suffix=" ARTH"
                  className="text-[#0E3844]"
                />
              </div>
            </div>

          </div>

        </div>

        {/* ====================================================================
            LEVEL 2: OPERATIONAL COMMAND, GOVERNANCE & EMERGENCY CONTROLS
            ==================================================================== */}
        <div className="px-4 sm:px-6 py-2 bg-[#F6F1E3] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Left: UTC Time, Epoch & Enclave Security */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-[11px] text-[#4A5568]">
            {/* UTC Clock */}
            <div className="flex items-center gap-1.5 text-[#0E3844]">
              <Clock className="w-3.5 h-3.5 text-[#7A6237] shrink-0" />
              <span className="font-bold text-[#0E3844] tracking-tight">{liveUtc || 'UTC TIME'}</span>
            </div>

            <span className="text-[#D8C7A5]">·</span>

            {/* Technical Epoch */}
            <div className="flex items-center gap-1">
              <span className="text-[#7A6237] font-semibold">EPOCH</span>
              <span className="font-bold text-[#0E3844]">#{epoch}</span>
            </div>

            <span className="text-[#D8C7A5] hidden sm:inline">·</span>

            {/* Sovereign Enclave Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-[#4A5568]">
              <Lock className="w-3 h-3 text-[#0E3844] shrink-0" />
              <span className="tracking-tight text-[#0E3844] font-medium">HSM ENCLAVE ACTIVE</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[#0E3844]/10 text-[#0E3844] font-bold">
                SEC-L4
              </span>
            </div>
          </div>

          {/* Right: Administrator Identity, Circuit Breaker & Directory Shortcut */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Current Administrator Identity (Vishnu Sai Ram, no prefix/suffix) */}
            <div className="flex items-center gap-2 font-sans text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="font-semibold text-[#0E3844] tracking-tight">
                Vishnu Sai Ram
              </span>
              <span className="font-mono text-[10px] text-[#7A6237] bg-white border border-[#D8C7A5] px-1.5 py-0.2 rounded font-bold shadow-2xs">
                Governor · L4
              </span>
            </div>

            <span className="text-[#D8C7A5] hidden sm:inline">|</span>

            {/* Emergency Circuit Breaker (Serious, Restrained Terracotta Accent) */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95 shadow-2xs cursor-pointer ${
                isBreakerActive
                  ? 'bg-[#B5482E] text-white border border-[#8A2E1A] animate-pulse'
                  : 'bg-white hover:bg-[#B5482E] text-[#B5482E] hover:text-white border border-[#B5482E]/40 hover:border-[#B5482E]'
              }`}
              title="Initiate emergency settlement isolation protocol"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="tracking-wide">
                {isBreakerActive ? 'CIRCUIT BREAKER ENGAGED' : 'CIRCUIT BREAKER'}
              </span>
            </button>

            {/* Meaningful External Link to Ecosystem Directory */}
            <Link
              href="/"
              title="Return to Public Sovereign Switchboard"
              className="p-1.5 rounded-lg text-[#7A6237] hover:text-[#0E3844] hover:bg-[#0E3844]/8 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

          </div>

        </div>
      </header>

      {/* Multi-Step Emergency Circuit Breaker Protocol Modal */}
      <EmergencyCircuitBreakerModal
        isOpen={isModalOpen}
        isBreakerActive={isBreakerActive}
        onClose={() => setIsModalOpen(false)}
        onToggleBreaker={handleToggleBreaker}
      />
    </>
  );
};

