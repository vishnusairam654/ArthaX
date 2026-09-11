'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Coins,
  ShieldCheck,
  Building2,
  Users,
  Landmark,
  Flame,
  PlusCircle,
  History,
  FileCheck2,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  MOCK_CURRENCY_SUPPLY,
  MOCK_MONETARY_EVENTS,
  DEMO_POLICY_NOTICE,
} from '@/components/central-bank/CentralBankMockData';
import { CentralBankMaskedValue } from '@/components/central-bank/CentralBankMaskedValue';

export default function CurrencyArthPage() {
  const supply = MOCK_CURRENCY_SUPPLY;
  const events = MOCK_MONETARY_EVENTS;
  const [showActionModal, setShowActionModal] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              MONETARY SUPPLY COMMAND
            </span>
            <span className="text-[11px] text-[#A8742A] font-mono font-medium">
              [PROVISIONAL DEMO BENCHMARKS]
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            ARTH Sovereign Monetary Authority
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Central issuance control, monetary velocity telemetry, vault reserve allocations, and deflationary fee burn accounting. Single double-entry ledger invariant: Σ Debits == Σ Credits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowActionModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#946726] hover:bg-[#2A2012] text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#DFB87A]" />
            <span>Mint / Burn Authority</span>
          </button>
        </div>
      </div>

      {/* Main Monetary Aggregate Card */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#946726]/10">
          <div>
            <span className="text-xs text-[#5C574F] font-medium block">
              M0 Sovereign Currency In Circulation
            </span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#2A2012] mt-1 flex items-center gap-2">
              <CentralBankMaskedValue value={supply.totalIssuedM0} suffix=" ARTH" />
            </div>
            <span className="text-xs text-[#A8742A] font-mono font-semibold block mt-1">
              Fixed Demonstration Supply Cap • 1 ARTH = 1.0000 Unit Invariant
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#946726]/15 text-center">
              <span className="text-[10px] text-[#74777F] uppercase block">Velocity (M1)</span>
              <strong className="text-sm text-[#2A2012]">{supply.velocityOfMoneyM1}x p.a.</strong>
            </div>
            <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#946726]/15 text-center">
              <span className="text-[10px] text-[#74777F] uppercase block">Deflationary Burn YTD</span>
              <strong className="text-sm text-[#B5482E]">{supply.burnedOrRetiredYTD.toLocaleString('en-US')} ARTH</strong>
            </div>
          </div>
        </div>

        {/* Currency Distribution Breakdown Strip */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-sm text-[#2A2012]">
            Macro Distribution Across the ARTHAX Ecosystem
          </h3>
          
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
            <div
              title="Bank Statutory Reserves: 32.1%"
              className="h-full bg-[#946726] hover:opacity-90 transition"
              style={{ width: '32.1%' }}
            />
            <div
              title="Citizen Liquid Wallets: 28.4%"
              className="h-full bg-emerald-700 hover:opacity-90 transition"
              style={{ width: '28.4%' }}
            />
            <div
              title="Bank Operational Liquidity: 26.6%"
              className="h-full bg-[#B88B38] hover:opacity-90 transition"
              style={{ width: '26.6%' }}
            />
            <div
              title="Sovereign Treasury Vault: 12.9%"
              className="h-full bg-[#A8742A] hover:opacity-90 transition"
              style={{ width: '12.9%' }}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 font-mono text-xs">
            
            <div className="p-3 rounded-xl bg-[#F6F8F7] border border-[#946726]/15 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-[#946726]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#946726]" />
                <span className="font-sans font-bold">Bank Reserves</span>
              </div>
              <strong className="text-sm text-[#2A2012] block">
                <CentralBankMaskedValue value={supply.bankStatutoryReserves} suffix=" ARTH" />
              </strong>
              <span className="text-[10px] text-[#74777F]">32.1% • Mandated Safety Buffer</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F8F7] border border-emerald-300/40 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700" />
                <span className="font-sans font-bold">Citizen Wallets</span>
              </div>
              <strong className="text-sm text-[#2A2012] block">
                <CentralBankMaskedValue value={supply.citizenLiquidWallets} suffix=" ARTH" />
              </strong>
              <span className="text-[10px] text-[#74777F]">28.4% • 12,346 Active Accounts</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F8F7] border border-[#946726]/15 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-[#B88B38]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#B88B38]" />
                <span className="font-sans font-bold">Bank Operations</span>
              </div>
              <strong className="text-sm text-[#2A2012] block">
                <CentralBankMaskedValue value={supply.bankOperationalLiquidity} suffix=" ARTH" />
              </strong>
              <span className="text-[10px] text-[#74777F]">26.6% • Commercial Clearing Pool</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F8F7] border border-[#A8742A]/30 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-[#A8742A]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#A8742A]" />
                <span className="font-sans font-bold">Treasury Vault</span>
              </div>
              <strong className="text-sm text-[#2A2012] block">
                <CentralBankMaskedValue value={supply.sovereignTreasuryVault} suffix=" ARTH" />
              </strong>
              <span className="text-[10px] text-[#74777F]">12.9% • Central Reserve Facility</span>
            </div>

          </div>
        </div>
      </div>

      {/* Immutable Monetary Issuance & Burn Log */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2A2012] flex items-center gap-2">
              <History className="w-4 h-4 text-[#946726]" />
              <span>Sovereign Monetary Ledger Transactions</span>
            </h3>
            <span className="text-xs text-[#5C574F]">
              Cryptographically ratified minting, retirement, and reserve expansion actions
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Append-Only Verified
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {events.map((evt) => {
            const isBurn = evt.type === 'Retirement (Burn)';
            const isMint = evt.type === 'Issuance (Mint)';
            return (
              <div
                key={evt.id}
                className="p-4 rounded-2xl border border-[#946726]/10 bg-[#FAF9F6] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:border-[#946726]/30 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        isBurn
                          ? 'bg-red-100 text-[#B5482E] border-red-200'
                          : isMint
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-blue-100 text-[#946726] border-blue-200'
                      }`}
                    >
                      {evt.type}
                    </span>
                    <strong className="text-[#2A2012] font-sans text-xs">{evt.id}</strong>
                    <span className="text-[#74777F] text-[11px]">• {evt.timestamp}</span>
                  </div>

                  <p className="font-sans text-xs text-[#262320] leading-snug">
                    {evt.legalDecree}
                  </p>

                  <div className="text-[10px] text-[#74777F] flex flex-wrap gap-3 pt-0.5">
                    <span>Target: <strong className="text-[#2A2012]">{evt.targetAccount}</strong></span>
                    <span>Block: <strong className="text-[#946726]">{evt.blockRef}</strong></span>
                    <span>Signers: <strong className="text-[#2A2012]">{evt.authorizedBy}</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-base font-bold font-serif ${
                      isBurn ? 'text-[#B5482E]' : 'text-emerald-800'
                    }`}
                  >
                    {isBurn ? '-' : '+'}
                    {evt.amount.toLocaleString('en-US')} ARTH
                  </span>
                  <span className="block text-[10px] text-[#74777F]">
                    Ledger State Synchronized
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mint / Burn Authority Modal */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#946726]/20 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#946726]/10 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#A8742A]" />
                <h3 className="font-serif font-bold text-base text-[#2A2012]">
                  Sovereign Minting Quorum Protected
                </h3>
              </div>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5C574F] leading-relaxed">
              Currency expansion and retirement directives require a <strong>5 of 7 Governor Board Quorum</strong> with air-gapped cryptographic HSM hardware keys.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-mono">
              Quorum Status: <strong>Awaiting Formal Legislative Session</strong>. No pending issuance motions active.
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 rounded-xl bg-[#946726] text-white text-xs font-bold"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
