'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, ShieldCheck, ArrowLeft } from 'lucide-react';

interface GovShellProps {
  children: React.ReactNode;
  currentStep?: 'landing' | 'email' | 'otp' | 'password' | 'result' | 'login';
}

export const GovShell: React.FC<GovShellProps> = ({ children, currentStep = 'landing' }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#F2EFE7] text-[#262320] selection:bg-[#C8DFDB] selection:text-[#1E3A5F]">
      {/* Background Atmosphere & Sovereign Watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        {/* Soft atmospheric gradient pools */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#3368A0]/15 via-[#66A3BF]/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-[#C8DFDB]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-[400px] h-[400px] bg-[#E9D9BE]/30 rounded-full blur-3xl" />

        {/* Subtle Sovereign Watermark in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] opacity-[0.035] select-none pointer-events-none">
          <Image
            src="/assets/brand/navbar_logo.png"
            alt="ARTHAX Watermark"
            width={680}
            height={680}
            className="w-full h-full object-contain filter grayscale"
            priority={false}
          />
        </div>
      </div>

      {/* Sovereign Ribbon Accent Bar */}
      <div
        className="h-[3px] w-full shrink-0 relative z-20"
        style={{
          background:
            'linear-gradient(90deg, #1E3A5F 0%, #3368A0 28%, #A8742A 50%, #3368A0 72%, #1E3A5F 100%)',
        }}
      />

      {/* Sovereign Institutional Header */}
      <header className="w-full border-b border-[#3368A0]/10 bg-white/70 backdrop-blur-md relative z-20 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Seal */}
          <Link
            href="/"
            className="group flex items-center gap-3 no-underline transition-transform hover:opacity-95 active:scale-[0.99]"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#3368A0] p-[1.5px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center p-1.5 overflow-hidden">
                <Image
                  src="/assets/brand/navbar_logo.png"
                  alt="GOV Seal"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-[#1E3A5F] leading-none">
                  GOV
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider bg-[#3368A0]/10 text-[#3368A0] rounded-sm">
                  Official
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#5C574F] mt-0.5">
                Identity Gateway
              </span>
            </div>
          </Link>

          {/* Institutional Telemetry & Hub Link */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E3A5F]/5 border border-[#1E3A5F]/10 text-xs font-mono text-[#5C574F]">
              <span className="w-2 h-2 rounded-full bg-[#287A55] animate-pulse" />
              <span>SHA-256 Authority</span>
              <span className="text-[#5C574F]/40">•</span>
              <span className="text-[#1E3A5F] font-medium">Node #01 Active</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#3368A0] hover:text-[#1E3A5F] bg-white/80 hover:bg-white border border-[#3368A0]/15 px-3 py-1.5 rounded-lg transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Central Guide</span>
              <span className="xs:hidden">Guide</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-[480px]">
          {/* Frosted Sovereign Card */}
          <div
            className="rounded-3xl bg-white/95 border border-[#3368A0]/15 p-6 sm:p-9 shadow-xl relative overflow-hidden backdrop-blur-xl"
            style={{
              boxShadow:
                '0 20px 40px -15px rgba(30, 58, 95, 0.08), 0 0 0 1px rgba(51, 104, 160, 0.08), 0 2px 4px rgba(0, 0, 0, 0.02)',
            }}
          >
            {/* Top Card Accent hairline */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{
                background:
                  'linear-gradient(90deg, #1E3A5F 0%, #3368A0 40%, #A8742A 70%, #1E3A5F 100%)',
              }}
            />

            {children}
          </div>

          {/* Security Assurance Badge below card */}
          <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-mono text-[#5C574F]">
            <ShieldCheck className="w-4 h-4 text-[#287A55]" />
            <span>Encrypted via ARTHAX Monolith • 1 Email = 1 GOV ID</span>
          </div>
        </div>
      </main>

      {/* Sovereign Portal Footer */}
      <footer className="w-full py-5 border-t border-[#3368A0]/10 bg-white/50 backdrop-blur-xs relative z-10 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#5C574F]">
          <div>
            Government Identity Authority • ARTHAX Sovereign Network
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#287A55]">ISO 7501 Compliant</span>
            <span>•</span>
            <Link href="/user" className="hover:text-[#1E3A5F] underline underline-offset-2">
              User Portal
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-[#1E3A5F] underline underline-offset-2">
              System Manifest
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
