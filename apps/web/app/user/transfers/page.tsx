'use client';

import React, { useState } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { TransfersHeroHeader } from '@/components/user/transfers/TransfersHeroHeader';
import { SettlementPipelineTracker } from '@/components/user/transfers/SettlementPipelineTracker';
import { MasterTransferTerminal, CounterpartyInfo } from '@/components/user/transfers/MasterTransferTerminal';
import { ClearingCounterpartiesPanel } from '@/components/user/transfers/ClearingCounterpartiesPanel';
import { ActiveInFlightDvpCard } from '@/components/user/transfers/ActiveInFlightDvpCard';
import { SovereignLimitsWidget } from '@/components/user/transfers/SovereignLimitsWidget';
import { TransferAuditReceiptModal } from '@/components/user/transfers/TransferAuditReceiptModal';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';

export default function TransfersAndDvpPage() {
  // Balance privacy mask state per Rule 15: Masked by default
  const [isMasked, setIsMasked] = useState<boolean>(true);

  // Transfer Terminal state
  const [activeStage, setActiveStage] = useState<number>(4);
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const [selectedCounterparty, setSelectedCounterparty] = useState<CounterpartyInfo | null>(null);

  // In-flight & Audit Receipt Modal states
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [inspectedTxHash, setInspectedTxHash] = useState<string>('TX-CLS-20250524-890124');

  // Outflow & Balance state
  const [availableOutflow, setAvailableOutflow] = useState<number>(142500.00);
  const [dailySpent, setDailySpent] = useState<number>(41000.00);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const handleSuccessfulTransfer = (amount: number, recipientName: string, hash: string) => {
    setIsSettling(true);
    setActiveStage(5);

    // Update balances
    setAvailableOutflow((prev) => Math.max(0, prev - amount));
    setDailySpent((prev) => prev + amount);

    setTimeout(() => {
      setActiveStage(6);
      setIsSettling(false);
      setInspectedTxHash(hash);
    }, 2000);
  };

  const handleOpenAuditModal = (hash: string) => {
    setInspectedTxHash(hash);
    setIsAuditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header with Active Tab Highlight */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={handleToggleMask} 
        activeTab="transfers-and-dvp"
      />

      {/* 2. Main Transfers & DvP Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Section 1: Page Header & Sovereign Macro Context */}
          <TransfersHeroHeader 
            isMasked={isMasked}
            availableBalance={availableOutflow}
            maxTxLimit={25000.00}
            activeAccountName="NAVA Sovereign Payroll"
            activeAccountCode="#ARTH-9021-001"
          />

          {/* Section 2: Architectural Transaction Journey Pipeline */}
          <SettlementPipelineTracker 
            currentStage={activeStage}
            isSettling={isSettling}
          />

          {/* Section 3: Two-Column Master Grid (8 cols + 4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Master Transfer Terminal */}
            <div className="lg:col-span-8">
              <MasterTransferTerminal 
                isMasked={isMasked}
                onSuccessfulTransfer={handleSuccessfulTransfer}
                onOpenAuditReceipt={handleOpenAuditModal}
                selectedCounterpartyExternal={selectedCounterparty}
              />
            </div>

            {/* Right Column (4 cols): Counterparties, In-Flight Watcher & Limits */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Domestic Clearing Counterparties */}
              <ClearingCounterpartiesPanel 
                onSelectCounterparty={(cp) => setSelectedCounterparty(cp)}
              />

              {/* Active In-Flight DvP Watcher */}
              <ActiveInFlightDvpCard 
                isMasked={isMasked}
                txHash={inspectedTxHash}
                amount={5000.00}
                progressPercent={activeStage === 6 ? 100 : activeStage === 5 ? 83 : 66}
                stageLabel={activeStage === 6 ? 'Stage 6 of 6' : activeStage === 5 ? 'Stage 5 of 6' : 'Stage 4 of 6'}
                onOpenAuditTrail={handleOpenAuditModal}
              />

              {/* Sovereign Limits & Circuit Breakers */}
              <SovereignLimitsWidget 
                isMasked={isMasked}
                dailyUsed={dailySpent}
                dailyLimit={50000.00}
                singleTxCap={25000.00}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Screen 08 Detailed Transfer Audit Receipt Modal */}
      <TransferAuditReceiptModal 
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        txHash={inspectedTxHash}
        isMasked={isMasked}
      />

      {/* 4. Global Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
