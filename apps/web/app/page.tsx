'use client';

import React, { useState } from 'react';
import { GuideHeader } from '../components/guide/GuideHeader';
import { HeroSection } from '../components/guide/HeroSection';
import { SimpleProcessSection } from '../components/guide/SimpleProcessSection';
import { PortalSwitchboardSection } from '../components/guide/PortalSwitchboardSection';
import { BanksSection } from '../components/guide/BanksSection';
import { FaqSection } from '../components/guide/FaqSection';
import { GuideFooter } from '../components/guide/GuideFooter';
import { GovIdModal } from '../components/guide/GovIdModal';

export default function CentralGuidePage() {
  const [isGovModalOpen, setIsGovModalOpen] = useState(false);
  const [connectedGovId, setConnectedGovId] = useState<string | null>(null);

  const handleConnectSuccess = (govId: string) => {
    setConnectedGovId(govId);
  };

  const handleDisconnect = () => {
    setConnectedGovId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] text-[#121C28]">
      {/* 1. Master Navigation */}
      <GuideHeader 
        onOpenGovModal={() => setIsGovModalOpen(true)}
        connectedGovId={connectedGovId}
        onDisconnect={handleDisconnect}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection onOpenGovModal={() => setIsGovModalOpen(true)} />

        {/* 3. Simple Process (3 Easy Steps) */}
        <SimpleProcessSection onOpenGovModal={() => setIsGovModalOpen(true)} />

        {/* 4. Ecosystem Topology: Public Switchboard (User, Stocks, Shop) */}
        <PortalSwitchboardSection />

        {/* 5. Five Partner Commercial Banks */}
        <BanksSection />

        {/* 6. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* 7. Footer */}
      <GuideFooter />

      {/* Interactive GOV ID Identity Modal */}
      <GovIdModal
        isOpen={isGovModalOpen}
        onClose={() => setIsGovModalOpen(false)}
        isConnected={!!connectedGovId}
        onConnectSuccess={handleConnectSuccess}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}
