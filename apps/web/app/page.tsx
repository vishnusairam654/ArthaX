'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { GuideHeader } from '../components/guide/GuideHeader';
import { HeroSection } from '../components/guide/HeroSection';
import { PortalSwitchboardSection } from '../components/guide/PortalSwitchboardSection';
import { MonetaryTreatySection } from '../components/guide/MonetaryTreatySection';
import { ClsPipelineSection } from '../components/guide/ClsPipelineSection';
import { BanksSection } from '../components/guide/BanksSection';
import { SecurityShowcaseSection } from '../components/guide/SecurityShowcaseSection';
import { FinancialGuidesSection } from '../components/guide/FinancialGuidesSection';
import { FinancialGuidesModal } from '../components/guide/FinancialGuidesModal';
import { FaqSection } from '../components/guide/FaqSection';
import { InstitutionalCtaSection } from '../components/guide/InstitutionalCtaSection';
import { GuideFooter } from '../components/guide/GuideFooter';
import { GovIdModal } from '../components/guide/GovIdModal';

const ArthaxLogo3D = dynamic(() => import('../components/guide/ArthaxLogo3DCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-72 flex items-center justify-center" />,
});

export default function CentralGuidePage() {
  const [isGovModalOpen, setIsGovModalOpen] = useState(false);
  const [connectedGovId, setConnectedGovId] = useState<string | null>(null);

  // Financial Educational Guides state
  const [isGuidesModalOpen, setIsGuidesModalOpen] = useState(false);
  const [selectedGuideTopic, setSelectedGuideTopic] = useState<'banking' | 'taxes' | 'trading'>('banking');

  const handleConnectSuccess = (govId: string) => {
    setConnectedGovId(govId);
  };

  const handleDisconnect = () => {
    setConnectedGovId(null);
  };

  const handleOpenGuideTopic = (topic: 'banking' | 'taxes' | 'trading') => {
    setSelectedGuideTopic(topic);
    setIsGuidesModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] text-[#121C28]">
      {/* 1. Master Navigation & Real-time Ticker Ribbon */}
      <GuideHeader 
        onOpenGovModal={() => setIsGovModalOpen(true)}
        connectedGovId={connectedGovId}
        onDisconnect={handleDisconnect}
        onOpenGuidesModal={(topic) => handleOpenGuideTopic(topic || 'banking')}
      />

      <main className="flex-1">
        {/* 2. Editorial Sovereign Hero Section */}
        <HeroSection onOpenGovModal={() => setIsGovModalOpen(true)} />

        {/* 3. Ecosystem Topology: Public Switchboard (Strictly User, Stocks, Shop) */}
        <PortalSwitchboardSection />

        {/* Pure 3D Logo Display — 2.5x Grand Scale */}
        <section className="w-full py-12 sm:py-16 flex items-center justify-center overflow-hidden" id="logo-3d">
          <div className="w-full max-w-7xl h-[420px] sm:h-[540px] md:h-[620px] flex items-center justify-center">
            <ArthaxLogo3D />
          </div>
        </section>

        {/* 4. Monetary Treaty & Inviolable Laws (Core Ledger Invariants) */}
        <MonetaryTreatySection />

        {/* 5. Settlement Architecture & Verification Flow (CLS Pipeline & Taxonomy Matrix) */}
        <ClsPipelineSection />

        {/* 6. Commercial Tier-One Registry (Five Licensed Commercial Banks) */}
        <BanksSection />

        {/* 7. Sovereign Dual-Credential Security Showcase */}
        <SecurityShowcaseSection />

        {/* 8. Educational Financial Guides (How Banking, Taxes, and Trading Work) */}
        <FinancialGuidesSection onOpenTopic={handleOpenGuideTopic} />

        {/* 9. Architectural Inquiries & FAQs */}
        <FaqSection />

        {/* 10. Institutional Onboarding CTA Banner */}
        <InstitutionalCtaSection onOpenGovModal={() => setIsGovModalOpen(true)} />
      </main>

      {/* 11. Global Institutional Footer */}
      <GuideFooter />

      {/* Interactive GOV ID Identity Modal */}
      <GovIdModal
        isOpen={isGovModalOpen}
        onClose={() => setIsGovModalOpen(false)}
        isConnected={!!connectedGovId}
        onConnectSuccess={handleConnectSuccess}
        onDisconnect={handleDisconnect}
      />

      {/* Interactive Educational Financial Guides Modal */}
      <FinancialGuidesModal
        isOpen={isGuidesModalOpen}
        onClose={() => setIsGuidesModalOpen(false)}
        initialTopic={selectedGuideTopic}
      />
    </div>
  );
}
