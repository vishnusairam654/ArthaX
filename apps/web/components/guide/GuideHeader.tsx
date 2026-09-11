'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Fingerprint, 
  CheckCircle2, 
  LogOut, 
  Menu, 
  X, 
  BookOpen
} from 'lucide-react';

interface GuideHeaderProps {
  onOpenGovModal: () => void;
  connectedGovId?: string | null;
  onDisconnect?: () => void;
  onOpenGuidesModal?: (topic?: 'banking' | 'taxes' | 'trading') => void;
}

export function GuideHeader({ 
  onOpenGovModal, 
  connectedGovId, 
  onDisconnect,
  onOpenGuidesModal 
}: GuideHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic scroll elevation listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div 
        className={`max-w-6xl mx-auto rounded-full pointer-events-auto transition-all duration-300 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border ${
          isScrolled 
            ? 'bg-[#F2EFE7]/95 backdrop-blur-xl border-[#3368A0]/25 shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]' 
            : 'bg-[#F2EFE7]/85 backdrop-blur-lg border-[#3368A0]/15 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
        }`}
      >
        {/* ================= LEFT: FINANCIAL GUIDES BUTTON ================= */}
        <div className="flex-1 flex items-center justify-start">
          {onOpenGuidesModal && (
            <button
              onClick={() => onOpenGuidesModal('banking')}
              id="btn-nav-guides"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-body font-semibold text-[#022448] bg-gradient-to-b from-white via-white to-[#F6F3EC] hover:to-white rounded-full border border-[#3368A0]/25 hover:border-[#3368A0]/50 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.09),0_2px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3368A0] whitespace-nowrap cursor-pointer select-none"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#3368A0] shrink-0" />
              <span className="hidden sm:inline">Financial Guides</span>
              <span className="sm:hidden">Guides</span>
            </button>
          )}
        </div>

        {/* ================= CENTER: NAVBAR LOGO ================= */}
        <div className="shrink-0 flex items-center justify-center px-2 sm:px-4">
          <a
            href="#hero"
            aria-label="ARTHAX Sovereign Network Home"
            className="flex items-center group transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3368A0] rounded-lg"
          >
            <Image
              src="/assets/brand/navbar_logo.png"
              alt="ARTHAX"
              width={140}
              height={28}
              className="h-6 sm:h-7 md:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-104 drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              priority
            />
          </a>
        </div>

        {/* ================= RIGHT: REMAINING ACTIONS ================= */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          
          {/* Identity & GOV ID Authentication State */}
          {connectedGovId ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-b from-white to-[#F0FAF5] border border-emerald-500/35 rounded-full p-1 pl-3 shadow-[0_2px_4px_rgba(16,185,129,0.08),0_1px_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-800 whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hidden md:inline">GOV ID:</span>
                <span>#8491-LX</span>
                <span className="hidden lg:inline px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/15 text-emerald-700 font-bold border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>
              {onDisconnect && (
                <button
                  onClick={onDisconnect}
                  title="Disconnect Sovereign ID"
                  aria-label="Disconnect GOV ID"
                  className="p-1.5 rounded-full text-[#B5482E] hover:bg-[#B5482E]/10 active:scale-95 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5482E] cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenGovModal}
              id="btn-gov-id"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-body font-semibold text-[#262320] bg-gradient-to-b from-white via-white to-[#F6F3EC] hover:to-white rounded-full border border-[#3368A0]/25 hover:border-[#3368A0]/50 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.95)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.09),0_2px_3px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3368A0] whitespace-nowrap cursor-pointer select-none"
            >
              <Fingerprint className="w-4 h-4 text-[#A8742A] shrink-0" />
              <span className="hidden md:inline">Connect GOV ID</span>
              <span className="md:hidden">GOV ID</span>
            </button>
          )}

          {/* Primary Ecosystem Entrance: Citizen Vault */}
          <Link
            href="/user"
            id="btn-console"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-body font-semibold text-white bg-gradient-to-b from-[#16365C] to-[#022448] hover:from-[#1E4370] hover:to-[#032C59] rounded-full border border-[#A8742A]/40 hover:border-[#A8742A]/80 shadow-[0_3px_6px_rgba(2,36,72,0.25),0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_14px_rgba(2,36,72,0.32),0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_2px_rgba(2,36,72,0.3),inset_0_2px_4px_rgba(0,0,0,0.25)] transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#022448] whitespace-nowrap select-none"
          >
            <span className="hidden sm:inline">Enter User Portal</span>
            <span className="sm:hidden">Portal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 text-[#A8742A] shrink-0" />
          </Link>

          {/* Responsive Mobile Navigation Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
            className="sm:hidden p-2 rounded-full bg-gradient-to-b from-white to-[#F6F3EC] text-[#022448] border border-[#3368A0]/20 shadow-[0_2px_4px_rgba(0,0,0,0.06)] active:translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3368A0] cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ================= RESPONSIVE MOBILE DRAWER ================= */}
      {isMobileMenuOpen && (
        <div 
          className="sm:hidden mt-2 max-w-6xl mx-auto p-4 bg-white/95 backdrop-blur-2xl rounded-2xl border border-[#3368A0]/20 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto"
          id="mobile-guide-menu"
        >
          {/* Mobile Educational Guides */}
          {onOpenGuidesModal && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenGuidesModal('banking');
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-body font-semibold text-[#022448] bg-gradient-to-b from-white to-[#F6F3EC] rounded-xl border border-[#3368A0]/25 shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#3368A0]" />
              <span>Explore Financial Guides (Banking, Taxes, Trading)</span>
            </button>
          )}

          {/* Mobile Primary Actions */}
          <div className="pt-2 border-t border-[#3368A0]/10 flex flex-col gap-2">
            {!connectedGovId && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenGovModal();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-body font-semibold text-[#262320] bg-gradient-to-b from-white to-[#F6F3EC] rounded-xl border border-[#3368A0]/25 shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-[#A8742A]" />
                <span>Connect Sovereign GOV ID</span>
              </button>
            )}

            <Link
              href="/user"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-body font-semibold text-white bg-gradient-to-b from-[#16365C] to-[#022448] rounded-xl border border-[#A8742A]/40 shadow-[0_3px_6px_rgba(2,36,72,0.25)] active:translate-y-0.5 transition-all"
            >
              <span>Enter User Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A8742A]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default GuideHeader;
