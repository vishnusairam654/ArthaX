'use client';

import React, { useState } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';
import { CitizenProfileHero } from '@/components/user/profile/CitizenProfileHero';
import { DualPasswordEnclaveCard } from '@/components/user/profile/DualPasswordEnclaveCard';
import { ConnectedAccountsCard } from '@/components/user/profile/ConnectedAccountsCard';
import { EquippedLoadoutCard } from '@/components/user/profile/EquippedLoadoutCard';
import { CryptographicProofCard } from '@/components/user/profile/CryptographicProofCard';

export default function UserProfilePage() {
  // Invariant Rule 15: Account numbers and balances render masked by default with an explicit click-to-reveal
  const [isMasked, setIsMasked] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header with Telemetry Ribbon and Navigation */}
      <UserPortalHeader
        isMasked={isMasked}
        onToggleMask={() => setIsMasked((prev) => !prev)}
        activeTab="profile"
      />

      {/* 2. Main Financial Profile Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* SECTION 1: Sovereign Citizen Hero Plaque */}
          <CitizenProfileHero isMasked={isMasked} />

          {/* SECTION 2: Dual-Password Isolation Security Enclave */}
          <DualPasswordEnclaveCard />

          {/* SECTION 3: Two-Column Section: Connected Accounts & Equipped Loadout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Connected Commercial Banking Accounts (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <ConnectedAccountsCard isMasked={isMasked} />
              <CryptographicProofCard />
            </div>

            {/* Right Column: Equipped Vault Cosmetics & Yield Boosts (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <EquippedLoadoutCard />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Sovereign Multi-Column Institutional Footer */}
      <UserPortalFooter />
    </div>
  );
}
