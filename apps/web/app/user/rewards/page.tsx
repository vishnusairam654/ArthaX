'use client';

import React, { useState } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { RewardsHeroBanner } from '@/components/user/rewards/RewardsHeroBanner';
import { ActiveBoostersRibbon } from '@/components/user/rewards/ActiveBoostersRibbon';
import { MonetaryMissionsList } from '@/components/user/rewards/MonetaryMissionsList';
import { MeritTiersAndBadges } from '@/components/user/rewards/MeritTiersAndBadges';
import { RewardsAuditLedgerTable } from '@/components/user/rewards/RewardsAuditLedgerTable';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';

export default function RewardsPage() {
  // Rule 15: Masked by default
  const [isMasked, setIsMasked] = useState<boolean>(true);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const handleClaimAll = () => {
    alert('Claimed 4,850.00 ARTH to NAVA Sovereign Payroll #ARTH-9021-001 (ISO 20022 Pacs.008 Settled)');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={handleToggleMask} 
        activeTab="rewards"
      />

      {/* 2. Main Rewards Workspace */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Hero Banner */}
          <RewardsHeroBanner 
            isMasked={isMasked}
            onClaimAll={handleClaimAll}
          />

          {/* Active Boosters Ribbon */}
          <ActiveBoostersRibbon />

          {/* 7 cols Missions + 5 cols Tiers & Badges */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <MonetaryMissionsList />
            </div>
            <div className="lg:col-span-5">
              <MeritTiersAndBadges />
            </div>
          </div>

          {/* Audit Ledger Table */}
          <RewardsAuditLedgerTable isMasked={isMasked} />
        </div>
      </main>

      {/* 3. Global Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
