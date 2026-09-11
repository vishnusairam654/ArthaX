'use client';

import React, { useState } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { ResidentBanner } from '@/components/user/ResidentBanner';
import { NetWorthHeroPlaque } from '@/components/user/NetWorthHeroPlaque';
import { ConnectedBanksSection } from '@/components/user/ConnectedBanksSection';
import { DvpTransferTerminal } from '@/components/user/DvpTransferTerminal';
import { AuditLedgerStream } from '@/components/user/AuditLedgerStream';
import { FixedDepositsPreview } from '@/components/user/FixedDepositsPreview';
import { StockHoldingsPreview } from '@/components/user/StockHoldingsPreview';
import { CitizenMilestonesAndMailboxTray } from '@/components/user/CitizenMilestonesAndMailboxTray';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';

export default function UserPortalPage() {
  // Invariant Rule 15: Account numbers and balances render masked by default with an explicit click-to-reveal
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [selectedBank, setSelectedBank] = useState<string>('nava');

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header with Telemetry Ribbon and Navigation */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={handleToggleMask} 
      />

      {/* 2. Main Financial Cockpit Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Top Status Banner */}
          <ResidentBanner />

          {/* SECTION 1: Sovereign Wealth & Asset Allocation Plaque */}
          <NetWorthHeroPlaque 
            isMasked={isMasked} 
            onToggleMask={handleToggleMask} 
          />

          {/* SECTION 2: Connected Banking Nodes (5 Core ARTHAX Banks) */}
          <ConnectedBanksSection 
            isMasked={isMasked} 
            selectedBank={selectedBank} 
            onSelectBank={setSelectedBank} 
          />

          {/* SECTION 3: Two-Column Operational Cockpit */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Transfer Terminal & Audit Ledger */}
            <div className="lg:col-span-7 space-y-8">
              <DvpTransferTerminal isMasked={isMasked} />
              <AuditLedgerStream isMasked={isMasked} />
            </div>

            {/* Right Column (5 cols): Term Deposits & Equities */}
            <div className="lg:col-span-5 space-y-8">
              <FixedDepositsPreview isMasked={isMasked} />
              <StockHoldingsPreview isMasked={isMasked} />
            </div>
          </div>

          {/* SECTION 4: Citizen Milestones, Vault Inventory & Mailbox Tray */}
          <CitizenMilestonesAndMailboxTray isMasked={isMasked} />
        </div>
      </main>

      {/* 3. Global Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
