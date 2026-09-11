import type { Metadata } from 'next';
import { StockPortalTelemetryBar } from '@/components/stocks/StockPortalTelemetryBar';
import { StockPortalHeader } from '@/components/stocks/StockPortalHeader';
import { StockPortalFooter } from '@/components/stocks/StockPortalFooter';

export const metadata: Metadata = {
  title: 'ARTHAX Stock Portal — Capital Markets Execution & Continuous Auction',
  description: 'The centralized capital markets execution floor of the ARTHAX sovereign ecosystem. Trade equities, manage order blotters, track capital gains tax, and inspect cryptographic DvP settlement receipts.',
};

export default function StockPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A1C18] antialiased flex flex-col justify-between selection:bg-[#DCEEE8] selection:text-[#173F35]">
      {/* 1. Top Macro Institutional Telemetry Rail */}
      <StockPortalTelemetryBar />

      {/* 2. Main Sticky Header & Navigation Tabs */}
      <StockPortalHeader />

      {/* 3. Main Workspace Container */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto p-3.5 sm:p-5 lg:p-6 flex flex-col gap-6">
        {children}
      </main>

      {/* 4. Global Institutional Footer */}
      <StockPortalFooter />
    </div>
  );
}
