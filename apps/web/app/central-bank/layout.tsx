'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CentralBankTelemetryBar } from '@/components/central-bank/CentralBankTelemetryBar';
import { CentralBankSidebar } from '@/components/central-bank/CentralBankSidebar';
import { CentralBankFooter } from '@/components/central-bank/CentralBankFooter';

export default function CentralBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (mainScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = mainScrollRef.current;
      const total = scrollHeight - clientHeight;
      const pct = total > 0 ? (scrollTop / total) * 100 : 0;
      setScrollProgress(pct);
    }
  };

  useEffect(() => {
    // Check initial scroll progress
    handleScroll();
  }, []);

  return (
    <div className="h-screen w-screen bg-[#FAF7EE] text-[#2A2012] antialiased flex flex-col overflow-hidden selection:bg-[#946726] selection:text-white">
      {/* 1. Top Sovereign Regulatory Telemetry Bar (Shrink-0, Floated Island) */}
      <div className="shrink-0 z-40 p-2.5 sm:p-3 sm:pb-1 lg:px-4 lg:pt-3.5 lg:pb-1.5">
        <CentralBankTelemetryBar />
      </div>

      {/* 2. Workspace below Telemetry Bar: Floated & Rounded with balanced gaps */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative px-2.5 pb-2.5 pt-1 sm:px-3 sm:pb-3 sm:pt-1 lg:px-4 lg:pb-3.5 lg:pt-1.5 gap-2.5 sm:gap-3.5">
        {/* Persistent Floated Institutional Sidebar */}
        <CentralBankSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content Workspace with Bespoke Animated Scrollbar & Scroll Progress Line */}
        <div
          ref={mainScrollRef}
          onScroll={handleScroll}
          className="flex-1 flex flex-col overflow-y-auto min-h-0 central-bank-scrollbar relative bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#D8C7A5] rounded-3xl shadow-sm shadow-[#946726]/5 overflow-hidden"
        >
          {/* Top Animated Scroll Line: Tracks scroll depth with Sovereign Light Gold Shimmer */}
          <div className="sticky top-0 left-0 right-0 z-30 h-[3.5px] bg-[#946726]/15 overflow-hidden shrink-0 pointer-events-none">
            <motion.div
              className="h-full relative central-bank-scroll-progress shadow-[0_0_12px_rgba(184,139,56,0.6)]"
              animate={{ width: `${Math.max(scrollProgress, 2.5)}%` }}
              transition={{ ease: [0.2, 0, 0, 1], duration: 0.12 }}
            >
              {/* Animated Liquid Shimmer Stream */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-full animate-progress-stream bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>
              {/* Glowing Radiant Leading Bead */}
              <span className="absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#F5E1B2] border border-[#946726] shadow-[0_0_12px_rgba(245,225,178,1)] animate-pulse" />
            </motion.div>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-7">
            <div className="max-w-[1520px] mx-auto space-y-6">
              {children}
            </div>
          </main>

          {/* Institutional Regulatory Footer */}
          <CentralBankFooter />
        </div>
      </div>
    </div>
  );
}
