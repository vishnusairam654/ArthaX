'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { FdCertificateHero } from '@/components/user/fixed-deposits/details/FdCertificateHero';
import { FdCertificateSpecs } from '@/components/user/fixed-deposits/details/FdCertificateSpecs';
import { FdEarlyLiquidationDrawer } from '@/components/user/fixed-deposits/details/FdEarlyLiquidationDrawer';
import { FdPayoutLedgerTable } from '@/components/user/fixed-deposits/details/FdPayoutLedgerTable';
import { FdEarlyLiquidationModal } from '@/components/user/fixed-deposits/FdEarlyLiquidationModal';
import { FdRenewalModal } from '@/components/user/fixed-deposits/FdRenewalModal';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';
import { UserFdDto } from '@arthax/types';
import { apiFetchUserFd } from '@/lib/api';

interface PageProps {
  params?: { depositId?: string };
}

export default function FdCertificateDetailsPage({ params }: PageProps) {
  const routeParams = useParams();
  const rawId = params?.depositId || (routeParams?.depositId as string) || 'FD-SAM-2024-8812';
  const depositId = Array.isArray(rawId) ? rawId[0] : rawId;

  // Rule 15: Masked by default
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [contract, setContract] = useState<UserFdDto | null>(null);
  const [isLiquidationModalOpen, setIsLiquidationModalOpen] = useState<boolean>(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (depositId) {
      apiFetchUserFd(depositId).then((data) => {
        if (data) setContract(data);
      });
    }
  }, [depositId]);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const handleLiquidationSuccess = () => {
    if (depositId) {
      apiFetchUserFd(depositId).then((data) => {
        if (data) setContract(data);
      });
    }
  };

  const handleRenewalUpdated = (updated: UserFdDto) => {
    setContract(updated);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={handleToggleMask} 
        activeTab="fixed-deposits"
      />

      {/* 2. Main Certificate Ledger Canvas */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Primary Hero Banner */}
          <FdCertificateHero 
            depositId={depositId}
            isMasked={isMasked}
            onOpenLiquidationModal={() => setIsLiquidationModalOpen(true)}
            onOpenMandateModal={() => setIsRenewalModalOpen(true)}
          />

          {/* Middle Split: 7 cols Specifications + 5 cols Liquidation Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <FdCertificateSpecs depositId={depositId} />
            </div>
            <div className="lg:col-span-5">
              <FdEarlyLiquidationDrawer 
                isMasked={isMasked}
                onRequestLiquidation={() => setIsLiquidationModalOpen(true)}
              />
            </div>
          </div>

          {/* Bottom Table: Scheduled Interest Payouts & Audit Log */}
          <FdPayoutLedgerTable isMasked={isMasked} />
        </div>
      </main>

      {/* 3. Early Liquidation Modal */}
      <FdEarlyLiquidationModal
        isOpen={isLiquidationModalOpen}
        onClose={() => setIsLiquidationModalOpen(false)}
        contract={contract}
        onLiquidationSuccess={handleLiquidationSuccess}
      />

      {/* 4. Auto-Renewal & Rollover Mandate Modal */}
      <FdRenewalModal
        isOpen={isRenewalModalOpen}
        onClose={() => setIsRenewalModalOpen(false)}
        contract={contract}
        onRenewalUpdated={handleRenewalUpdated}
      />

      {/* 5. Global Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
