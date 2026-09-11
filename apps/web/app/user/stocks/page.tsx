'use client';

import React, { useState } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { StockPortfolioHero } from '@/components/user/stocks/StockPortfolioHero';
import { SectorAllocationStrip } from '@/components/user/stocks/SectorAllocationStrip';
import { RegisteredEquitiesTable } from '@/components/user/stocks/RegisteredEquitiesTable';
import { DepositoryEnclaveStatus } from '@/components/user/stocks/DepositoryEnclaveStatus';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';

export default function StockPortfolioPage() {
  // Invariant Rule 15: Masked by default
  const [isMasked, setIsMasked] = useState<boolean>(true);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header with Active Tab Highlight */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={handleToggleMask} 
        activeTab="stocks"
      />

      {/* 2. Main Stock Portfolio Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Section 1: Valuation Hero */}
          <StockPortfolioHero 
            isMasked={isMasked}
            onOpenTradeModal={() => {}}
          />

          {/* Section 2: Sector Allocation & Prudential Weighting Strip */}
          <SectorAllocationStrip isMasked={isMasked} />

          {/* Section 3: Registered Sovereign Equities Holdings Table */}
          <RegisteredEquitiesTable isMasked={isMasked} />

          {/* Section 4: Depository Enclave & Clearing Status */}
          <DepositoryEnclaveStatus />
        </div>
      </main>

      {/* 3. Global Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
