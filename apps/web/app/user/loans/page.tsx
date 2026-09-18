'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { LoansHeroBanner } from '@/components/user/loans/LoansHeroBanner';
import { LoansMetricsOverview } from '@/components/user/loans/LoansMetricsOverview';
import { ActiveLoansList } from '@/components/user/loans/ActiveLoansList';
import { LoanSimulatorInline } from '@/components/user/loans/LoanSimulatorInline';
import { LoanApplicationModal } from '@/components/user/loans/LoanApplicationModal';
import { LoanDisbursementModal } from '@/components/user/loans/LoanDisbursementModal';
import { LoanRepayEmiModal } from '@/components/user/loans/LoanRepayEmiModal';
import { LoanForeclosureModal } from '@/components/user/loans/LoanForeclosureModal';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';
import { UserLoanDto } from '@arthax/types';
import { apiFetchMyLoans } from '@/lib/api';

export default function LoansPage() {
  // Invariant Rule 15: Balances masked by default with explicit user toggle
  const [isMasked, setIsMasked] = useState<boolean>(true);

  // Loans state
  const [loans, setLoans] = useState<UserLoanDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState<boolean>(false);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState<boolean>(false);
  const [isPayEmiModalOpen, setIsPayEmiModalOpen] = useState<boolean>(false);
  const [isForecloseModalOpen, setIsForecloseModalOpen] = useState<boolean>(false);
  const [selectedLoan, setSelectedLoan] = useState<UserLoanDto | null>(null);

  // Pre-populated application parameters from simulator
  const [appInitialParams, setAppInitialParams] = useState<{
    productId?: string;
    principal?: number;
    tenureMonths?: number;
  }>({});

  const fetchLoans = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetchMyLoans();
      setLoans(data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const handleOpenApplication = () => {
    setAppInitialParams({});
    setIsAppModalOpen(true);
  };

  const handleOpenApplicationWithParams = (params: {
    productId: string;
    principal: number;
    tenureMonths: number;
  }) => {
    setAppInitialParams(params);
    setIsAppModalOpen(true);
  };

  const handleOpenDisburse = (loan: UserLoanDto) => {
    setSelectedLoan(loan);
    setIsDisburseModalOpen(true);
  };

  const handleOpenPayEmi = (loan: UserLoanDto) => {
    setSelectedLoan(loan);
    setIsPayEmiModalOpen(true);
  };

  const handleOpenForeclose = (loan: UserLoanDto) => {
    setSelectedLoan(loan);
    setIsForecloseModalOpen(true);
  };

  const handleLoanCreated = (newLoan: UserLoanDto) => {
    setLoans((prev) => [newLoan, ...prev]);
    fetchLoans();
  };

  const handleActionSuccess = () => {
    fetchLoans();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header with Active Loans Tab Highlight */}
      <UserPortalHeader
        isMasked={isMasked}
        onToggleMask={handleToggleMask}
        activeTab="loans"
      />

      {/* 2. Main Credit & Loans Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Hero Banner & Sovereign Lending Manifesto */}
          <LoansHeroBanner
            onOpenCalculator={() => {
              const simElement = document.getElementById('loan-simulator-section');
              if (simElement) {
                simElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onOpenApplication={handleOpenApplication}
          />

          {/* Aggregated Credit & Borrowing Portfolio Metrics */}
          <LoansMetricsOverview isMasked={isMasked} loans={loans} />

          {/* Active Credit Facilities List & Canonical Empty State */}
          <ActiveLoansList
            isMasked={isMasked}
            loans={loans}
            isLoading={isLoading}
            onOpenDisburse={handleOpenDisburse}
            onOpenPayEmi={handleOpenPayEmi}
            onOpenForeclose={handleOpenForeclose}
            onOpenApplication={handleOpenApplication}
          />

          {/* Interactive Reducing-Balance Simulator */}
          <div id="loan-simulator-section">
            <LoanSimulatorInline
              onOpenApplicationWithParams={handleOpenApplicationWithParams}
            />
          </div>
        </div>
      </main>

      {/* 3. Modals */}
      <LoanApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onLoanCreated={handleLoanCreated}
        initialProductId={appInitialParams.productId}
        initialPrincipal={appInitialParams.principal}
        initialTenureMonths={appInitialParams.tenureMonths}
      />

      <LoanDisbursementModal
        isOpen={isDisburseModalOpen}
        onClose={() => {
          setIsDisburseModalOpen(false);
          setSelectedLoan(null);
        }}
        loan={selectedLoan}
        onDisbursementSuccess={handleActionSuccess}
      />

      <LoanRepayEmiModal
        isOpen={isPayEmiModalOpen}
        onClose={() => {
          setIsPayEmiModalOpen(false);
          setSelectedLoan(null);
        }}
        loan={selectedLoan}
        onPaymentSuccess={handleActionSuccess}
      />

      <LoanForeclosureModal
        isOpen={isForecloseModalOpen}
        onClose={() => {
          setIsForecloseModalOpen(false);
          setSelectedLoan(null);
        }}
        loan={selectedLoan}
        onForeclosureSuccess={handleActionSuccess}
      />

      {/* 4. Global Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
