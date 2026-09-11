'use client';

import React, { useState } from 'react';
import { BankPortalTelemetryBar } from '@/components/bank/BankPortalTelemetryBar';
import { BankPortalSidebar } from '@/components/bank/BankPortalSidebar';
import { BankPortalFooter } from '@/components/bank/BankPortalFooter';

export default function BankPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeBank, setActiveBank] = useState<string>('nava');

  return (
    <div className="h-screen w-screen bg-[#F9F8FF] text-[#121C28] antialiased flex flex-col overflow-hidden selection:bg-[#3B3278] selection:text-white">
      {/* 1. Top Operational Telemetry Rail (Shrink-0, Floated Island) */}
      <div className="shrink-0 z-40 p-2.5 sm:p-3 sm:pb-1 lg:px-4 lg:pt-3.5 lg:pb-1.5">
        <BankPortalTelemetryBar />
      </div>

      {/* 2. Main Content Area with Floated Sidebar & Workspace */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative px-2.5 pb-2.5 pt-1 sm:px-3 sm:pb-3 sm:pt-1 lg:px-4 lg:pb-3.5 lg:pt-1.5 gap-2.5 sm:gap-3.5">
        {/* Persistent Floated Left Sidebar */}
        <BankPortalSidebar
          activeBank={activeBank}
          onSwitchBank={setActiveBank}
        />

        {/* Main Workspace with Rounded Container */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0 relative bg-white/85 backdrop-blur-xs border border-[#3B3278]/10 rounded-3xl shadow-sm shadow-[#3B3278]/5 overflow-hidden">
          <main className="flex-1 p-4 sm:p-5 lg:p-6">
            <div className="max-w-[1480px] mx-auto space-y-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <BankPortalFooter />
        </div>
      </div>
    </div>
  );
}
