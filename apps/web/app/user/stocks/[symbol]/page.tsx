'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { StockDetailsHeader } from '@/components/user/stocks/details/StockDetailsHeader';
import { StockCandleChart } from '@/components/user/stocks/details/StockCandleChart';
import { StockFundamentalsCard } from '@/components/user/stocks/details/StockFundamentalsCard';
import { StockCompanyScope } from '@/components/user/stocks/details/StockCompanyScope';
import { StockOrderBookLadder } from '@/components/user/stocks/details/StockOrderBookLadder';
import { AtomicTradingDock } from '@/components/user/stocks/details/AtomicTradingDock';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';

interface PageProps {
  params?: { symbol?: string };
}

export default function StockDetailsPage({ params }: PageProps) {
  const routeParams = useParams();
  const rawSymbol = params?.symbol || (routeParams?.symbol as string) || 'NILA';
  const symbol = (Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol).toUpperCase();

  // Rule 15: Masked by default
  const [isMasked, setIsMasked] = useState<boolean>(true);

  const handleToggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] antialiased selection:bg-[#A8742A] selection:text-white flex flex-col justify-between">
      {/* 1. Sovereign Header */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={handleToggleMask} 
        activeTab="stocks"
      />

      {/* 2. Main Workspace */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Header Strip */}
          <StockDetailsHeader symbol={symbol} isMasked={isMasked} />

          {/* 8 cols + 4 cols Two-Column Trading Cockpit */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Interactive Chart, Fundamentals & Scope */}
            <div className="lg:col-span-8 space-y-6">
              <StockCandleChart />
              <StockFundamentalsCard />
              <StockCompanyScope symbol={symbol} />
            </div>

            {/* Right Column (4 cols): Sticky Atomic Trading Dock & Order Book Ladder */}
            <div className="lg:col-span-4 space-y-5">
              <AtomicTradingDock symbol={symbol} isMasked={isMasked} />
              <StockOrderBookLadder />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Global Sovereign Footer */}
      <UserPortalFooter />
    </div>
  );
}
