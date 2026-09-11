'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { FdHeroBanner } from '@/components/user/fixed-deposits/FdHeroBanner';
import { FdPortfolioMetrics } from '@/components/user/fixed-deposits/FdPortfolioMetrics';
import { ActiveFdContractsList } from '@/components/user/fixed-deposits/ActiveFdContractsList';
import { FdBankComparisonMatrix } from '@/components/user/fixed-deposits/FdBankComparisonMatrix';
import { FdSimulatorInlineSection } from '@/components/user/fixed-deposits/FdSimulatorInlineSection';
import { FdCalculatorModal } from '@/components/user/fixed-deposits/FdCalculatorModal';
import { FdEarlyLiquidationModal } from '@/components/user/fixed-deposits/FdEarlyLiquidationModal';
import { FdRenewalModal } from '@/components/user/fixed-deposits/FdRenewalModal';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';
import { UserFdDto } from '@arthax/types';
import { apiFetchUserFds } from '@/lib/api';

export default function FixedDepositsPage() {
  // Invariant Rule 15: Masked balances by default with explicit toggle
  const [isMasked, setIsMasked] = useState<boolean>(true);
  
  // Contracts state
  const [contracts, setContracts] = useState<UserFdDto[]>([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState<boolean>(true);

  // Modals state
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState<boolean>(false);
  const [isLiquidationModalOpen, setIsLiquidationModalOpen] = useState<boolean>(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState<boolean>(false);
  const [selectedContract, setSelectedContract] = useState<UserFdDto | null>(null);

  // Booking default params
  const [bookingParams, setBookingParams] = useState<{
    bankId?: string;
    principal?: number;
    days?: number;
  }>({});

  const fetchContracts = useCallback(async () => {
    setIsLoadingContracts(true);
    try {
      const data = await apiFetchUserFds();
      setContracts(data);
    } catch {
      // Fallback
    } finally {
      setIsLoadingContracts(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const handleOpenCalculator = () => {
    setBookingParams({});
    setIsCalculatorModalOpen(true);
  };

  const handleSelectBankForBooking = (bankId: string) => {
    setBookingParams({ bankId });
    setIsCalculatorModalOpen(true);
  };

  const handleOpenBookingWithParams = (params: { bankId: string; principal: number; days: number }) => {
    setBookingParams(params);
    setIsCalculatorModalOpen(true);
  };

  const handleOpenEarlyLiquidation = (id: string) => {
    const found = contracts.find((c) => c.id === id || c.certificateNumber === id || c.depositNumber === id);
    if (found) {
      setSelectedContract(found);
      setIsLiquidationModalOpen(true);
    }
  };

  const handleOpenRenewModal = (id: string) => {
    const found = contracts.find((c) => c.id === id || c.certificateNumber === id || c.depositNumber === id);
    if (found) {
      setSelectedContract(found);
      setIsRenewalModalOpen(true);
    }
  };

  const handleDepositCreated = (newDeposit: UserFdDto) => {
    setContracts((prev) => [newDeposit, ...prev]);
    fetchContracts();
  };

  const handleLiquidationSuccess = () => {
    fetchContracts();
  };

  const handleRenewalUpdated = (updated: UserFdDto) => {
    setContracts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    fetchContracts();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header with Active Tab Highlight */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={handleToggleMask} 
        activeTab="fixed-deposits"
      />

      {/* 2. Main Fixed Deposits Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Section 1: Editorial Context Banner & Command Header */}
          <FdHeroBanner 
            onOpenCalculator={handleOpenCalculator}
            onOpenCreateDeposit={handleOpenCalculator}
          />

          {/* Section 2: Aggregated FD Portfolio Metrics (Bento-style institutional anchors) */}
          <FdPortfolioMetrics isMasked={isMasked} contracts={contracts} />

          {/* Section 3: Active Fixed Deposits List (High Craft, Institutional Ledger Cards & Canonical Empty State) */}
          <ActiveFdContractsList 
            isMasked={isMasked}
            contracts={contracts}
            isLoading={isLoadingContracts}
            onOpenEarlyLiquidation={handleOpenEarlyLiquidation}
            onOpenRenewModal={handleOpenRenewModal}
            onOpenBookingModal={handleOpenCalculator}
          />

          {/* Section 4: Interactive Quick Term Deposit Simulator / Creation Module */}
          <FdSimulatorInlineSection 
            onOpenBookingModalWithParams={handleOpenBookingWithParams}
          />

          {/* Section 5: Sovereign Bank FD Comparison Matrix */}
          <FdBankComparisonMatrix 
            onSelectBankForBooking={handleSelectBankForBooking}
          />
        </div>
      </main>

      {/* 3. Interactive Deposit Booking Modal */}
      <FdCalculatorModal 
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        onDepositCreated={handleDepositCreated}
        defaultBankId={bookingParams.bankId}
        defaultPrincipal={bookingParams.principal}
        defaultDays={bookingParams.days}
      />

      {/* 4. Early Liquidation Modal with Step-Up Password Auth */}
      <FdEarlyLiquidationModal
        isOpen={isLiquidationModalOpen}
        onClose={() => {
          setIsLiquidationModalOpen(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
        onLiquidationSuccess={handleLiquidationSuccess}
      />

      {/* 5. Auto-Renewal & Rollover Mandate Modal */}
      <FdRenewalModal
        isOpen={isRenewalModalOpen}
        onClose={() => {
          setIsRenewalModalOpen(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
        onRenewalUpdated={handleRenewalUpdated}
      />

      {/* 6. Global Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
