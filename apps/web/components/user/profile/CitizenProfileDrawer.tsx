'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  User, 
  ShieldCheck, 
  Lock, 
  Store, 
  Mail, 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ShieldAlert, 
  Award, 
  Sparkles,
  Fingerprint
} from 'lucide-react';

interface CitizenProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isMasked?: boolean;
  onToggleMask?: () => void;
}

export function CitizenProfileDrawer({
  isOpen,
  onClose,
  isMasked = true,
  onToggleMask
}: CitizenProfileDrawerProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] p-3 sm:p-5 lg:p-6 flex justify-end items-stretch sm:items-start pointer-events-none">
      {/* 1. SOLID High-Contrast Backdrop Scrim (NO glass theme, NO backdrop-blur) */}
      <div 
        className="fixed inset-0 bg-[#022448]/75 pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. FLOATING & ROUNDED Sovereign Profile Card Surface */}
      <aside 
        className="pointer-events-auto relative z-10 w-full sm:w-[480px] max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] bg-[#FAF8F5] text-[#121C28] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-[0_25px_70px_-10px_rgba(2,36,72,0.55),0_10px_30px_-5px_rgba(168,116,42,0.20),0_0_0_1px_rgba(30,58,95,0.3)] flex flex-col border-2 border-[#1E3A5F] animate-in zoom-in-95 slide-in-from-right-6 duration-300 font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Citizen Sovereign Profile"
      >
        {/* Floating Card Header: Solid Deep Blue with Arth Gold trim & rounded top */}
        <div className="bg-[#022448] text-white p-5 sm:p-6 border-b-2 border-[#A8742A] shrink-0 rounded-t-[26px] sm:rounded-t-[30px]">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#1E3A5F]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-[#A8742A] text-white font-serif text-xs font-bold flex items-center justify-center shadow-xs">
                AX
              </div>
              <span className="font-serif font-bold text-sm tracking-wide text-[#E9D9BE]">
                ARTHAX CITIZEN IDENTITY
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1E3A5F] hover:bg-[#A8742A] text-white transition-all hover:rotate-90 duration-200 flex items-center justify-center cursor-pointer shadow-xs"
              title="Close Profile Panel"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Citizen Identity Plaque */}
          <div className="mt-4 flex items-center gap-4">
            {/* Framed Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#FAF8F5] border-2 border-[#A8742A] shadow-md shrink-0">
              <Image
                src="/assets/shop/avatars/Female/Analyst.png"
                alt="Ananya Sharma"
                fill
                sizes="64px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src="/assets/shop/frames/gold.png"
                  alt="Gold Filigree Frame"
                  fill
                  sizes="64px"
                  className="object-contain scale-110"
                />
              </div>
            </div>

            {/* Resident Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-white truncate">
                  Ananya Sharma
                </h2>
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              </div>
              <p className="font-mono text-xs text-[#C8DFDB] truncate">
                GOV ID: #8491-904-IN
              </p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10B981] text-white shadow-xs">
                  Tier-1 Verified
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#A8742A] text-white shadow-xs">
                  Anchor Level 3
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body (Solid #FAF8F5 canvas, rounded solid cards) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF8F5]">
          {/* Primary Action Button: Solid Arth Gold to full profile page */}
          <Link
            href="/user/profile"
            onClick={onClose}
            className="w-full bg-[#A8742A] hover:bg-[#8F6222] text-white font-serif font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer border border-[#C59A45]"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-[#FAF8F5]" />
              <span className="text-sm">Open Dedicated Profile Page</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Section 1: Dual-Password Isolation Security Status */}
          <div className="bg-white border-2 border-[#1E3A5F]/20 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1E3A5F]" />
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#022448]">
                  Dual-Password Security Enclave
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                HSM Protected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#EEF4FF] p-3 rounded-xl border border-[#1E3A5F]/20 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#022448]">
                  <KeyRound className="w-3.5 h-3.5 text-[#1E3A5F]" />
                  <span>GOV Password</span>
                </div>
                <p className="text-[11px] text-slate-600">Cross-portal login session.</p>
                <span className="inline-block text-[10px] font-mono font-bold text-[#1E3A5F]">
                  ACTIVE SESSION
                </span>
              </div>

              <div className="bg-[#FFF4ED] p-3 rounded-xl border border-[#B5482E]/30 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#B5482E]">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#B5482E]" />
                  <span>Financial PIN</span>
                </div>
                <p className="text-[11px] text-slate-600">Step-up DvP money actions.</p>
                <span className="inline-block text-[10px] font-mono font-bold text-[#B5482E]">
                  STEP-UP ISOLATED
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Registered Bank Accounts Registry */}
          <div className="bg-white border-2 border-[#1E3A5F]/20 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1E3A5F]" />
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#022448]">
                  Registered Bank Accounts
                </span>
              </div>
              {onToggleMask && (
                <button
                  onClick={onToggleMask}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#FAF8F5] border border-slate-300 text-[#1E3A5F] hover:bg-[#EEF4FF] cursor-pointer"
                >
                  {isMasked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{isMasked ? 'Reveal' : 'Mask'}</span>
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-slate-200 hover:border-[#1E3A5F]/30 transition-colors">
                <div>
                  <span className="font-semibold text-slate-900 block">NAVA Commercial Bank</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {isMasked ? '•••••••• 8821' : '8491-0024-8821'}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#022448] text-right">
                  {isMasked ? '•••••••• ARTH' : '52,480.00 ARTH'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-slate-200 hover:border-[#1E3A5F]/30 transition-colors">
                <div>
                  <span className="font-semibold text-slate-900 block">SAMAYA Term Deposits</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {isMasked ? '•••••••• 4410' : '8491-9931-4410'}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#022448] text-right">
                  {isMasked ? '•••••••• ARTH' : '120,000.00 ARTH'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-slate-200 hover:border-[#1E3A5F]/30 transition-colors">
                <div>
                  <span className="font-semibold text-slate-900 block">TARANG Velocity Clearing</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {isMasked ? '•••••••• 1928' : '8491-5502-1928'}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#022448] text-right">
                  {isMasked ? '•••••••• ARTH' : '12,940.00 ARTH'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Equipped Vault Cosmetics & Yield Boosts */}
          <div className="bg-white border-2 border-[#1E3A5F]/20 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A8742A]" />
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#022448]">
                  Equipped Vault Items
                </span>
              </div>
              <Link
                href="/user/shop"
                onClick={onClose}
                className="text-[11px] font-sans font-semibold text-[#A8742A] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Shop Vault</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#A8742A]/40">
                <span className="text-[10px] font-mono text-[#A8742A] font-bold block">FRAME</span>
                <span className="font-semibold text-slate-900">Gold Filigree</span>
                <span className="text-[10px] text-slate-500 block">Gold Tier</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-purple-300">
                <span className="text-[10px] font-mono text-purple-700 font-bold block">PERSONA</span>
                <span className="font-semibold text-slate-900">Executive Analyst</span>
                <span className="text-[10px] text-slate-500 block">Epic Tier</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-blue-300">
                <span className="text-[10px] font-mono text-blue-700 font-bold block">BANNER</span>
                <span className="font-semibold text-slate-900">Apex Gilded Hall</span>
                <span className="text-[10px] text-slate-500 block">Rare Tier</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-emerald-300">
                <span className="text-[10px] font-mono text-emerald-700 font-bold block">PET COMPANION</span>
                <span className="font-semibold text-slate-900">Ledger Owl (Vidya)</span>
                <span className="text-[10px] text-emerald-700 font-bold block">+1.25% FD APY</span>
              </div>
            </div>
          </div>

          {/* Section 4: Quick Sovereign Navigation */}
          <div className="bg-white border-2 border-[#1E3A5F]/20 rounded-2xl p-4 space-y-2.5 shadow-xs hover:shadow-sm transition-shadow">
            <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#022448] block mb-1">
              Direct Quick Links
            </span>

            <div className="grid grid-cols-1 gap-1.5 text-xs font-medium">
              <Link
                href="/user/shop"
                onClick={onClose}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#EEF4FF] text-slate-800 hover:text-[#022448] transition-all hover:translate-x-1 border border-transparent hover:border-[#1E3A5F]/20 cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#A8742A]" />
                <span>Sovereign Vault &amp; Marketplace</span>
              </Link>

              <Link
                href="/user/security"
                onClick={onClose}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#EEF4FF] text-slate-800 hover:text-[#022448] transition-all hover:translate-x-1 border border-transparent hover:border-[#1E3A5F]/20 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#1E3A5F]" />
                <span>Security Enclave &amp; Passwords</span>
              </Link>

              <Link
                href="/user/mailbox"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#EEF4FF] text-slate-800 hover:text-[#022448] transition-all hover:translate-x-1 border border-transparent hover:border-[#1E3A5F]/20 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#1E3A5F]" />
                  <span>Sovereign Mailbox</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">3 New</span>
              </Link>

              <Link
                href="/user/banks"
                onClick={onClose}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#EEF4FF] text-slate-800 hover:text-[#022448] transition-all hover:translate-x-1 border border-transparent hover:border-[#1E3A5F]/20 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#1E3A5F]" />
                <span>Commercial Bank Accounts</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Card Footer: Solid Deep Blue with Telemetry and Switchboard Link & rounded bottom */}
        <div className="bg-[#022448] text-white px-5 py-4 border-t-2 border-[#1E3A5F] flex items-center justify-between text-[11px] font-mono shrink-0 rounded-b-[26px] sm:rounded-b-[30px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#C8DFDB]">Node #003 • Height #28,102,510</span>
          </div>

          <Link
            href="/"
            onClick={onClose}
            className="text-[#E9D9BE] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Central Switchboard</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
