'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  Bell, 
  ChevronDown, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  Building2, 
  ArrowRightLeft, 
  Coins, 
  TrendingUp, 
  Award, 
  Store, 
  Mail, 
  Sliders, 
  ExternalLink,
  User,
  LogOut,
  Sparkles,
  Layers
} from 'lucide-react';
import { CitizenProfileDrawer } from './profile/CitizenProfileDrawer';
import { UniversalPortalSwitcherModal } from '../common/UniversalPortalSwitcherModal';
import { apiFetchUnreadNoticeCount, apiGetActivePersona, subscribePortalDataInvalidation } from '@/lib/api';

interface UserPortalHeaderProps {
  isMasked: boolean;
  onToggleMask: () => void;
  activeTab?: string;
}

export const UserPortalHeader: React.FC<UserPortalHeaderProps> = ({ 
  isMasked, 
  onToggleMask, 
  activeTab 
}) => {
  const pathname = usePathname();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSwitcherModalOpen, setIsSwitcherModalOpen] = useState(false);
  const [activePersona, setActivePersona] = useState(apiGetActivePersona());
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic unread notices count & invalidation listener
  useEffect(() => {
    let isMounted = true;
    apiFetchUnreadNoticeCount().then((count) => {
      if (isMounted) setUnreadCount(count);
    });
    const unsub = subscribePortalDataInvalidation(() => {
      if (isMounted) {
        setActivePersona(apiGetActivePersona());
        apiFetchUnreadNoticeCount().then(setUnreadCount).catch(() => {});
      }
    });
    return () => {
      isMounted = false;
      unsub();
    };
  }, [pathname]);

  // Alt+P global shortcut for Universal Switchboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsSwitcherModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTab = useMemo(() => {
    if (pathname) {
      if (pathname.startsWith('/user/profile')) return 'profile';
      if (pathname.startsWith('/user/security')) return 'security';
      if (pathname.startsWith('/user/mailbox')) return 'mailbox';
      if (pathname.startsWith('/user/shop')) return 'shop';
      if (pathname.startsWith('/user/rewards')) return 'rewards';
      if (pathname.startsWith('/user/stocks')) return 'stocks';
      if (pathname.startsWith('/user/fixed-deposits')) return 'fixed-deposits';
      if (pathname.startsWith('/user/transfers')) return 'transfers-and-dvp';
      if (pathname.startsWith('/user/banks')) return 'my-banks-and-accounts';
      if (pathname === '/user' || pathname === '/user/') return 'overview';
    }
    if (activeTab) return activeTab;
    return 'overview';
  }, [activeTab, pathname]);

  return (
    <>
      <div className="fixed top-2.5 sm:top-3.5 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
        <header className="pointer-events-auto max-w-[1440px] mx-auto bg-[#F8F9FF] border-2 border-[#1E3A5F]/20 rounded-[26px] sm:rounded-[30px] shadow-[0_14px_40px_-8px_rgba(18,28,40,0.15),0_4px_14px_-2px_rgba(18,28,40,0.06)] transition-[box-shadow,border-color] duration-200 hover:shadow-[0_18px_48px_-6px_rgba(18,28,40,0.20)]">
          {/* Tier 1: Real-time Macroeconomic & Security Telemetry Bar */}
          <div className="bg-[#E6E8ED] border-b border-[#1E3A5F]/15 px-3 sm:px-5 lg:px-6 rounded-t-[24px] sm:rounded-t-[28px]">
          <div className="h-7 flex items-center justify-between font-mono text-[11px] text-[#43474E]">
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto whitespace-nowrap no-scrollbar py-0.5">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                <span className="text-[#121C28] font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider">CORE TELEMETRY</span>
              </span>
              <span className="text-[#74777F]/60">|</span>
              <span>ARTH/USD <strong className="text-[#121C28] font-bold">$1.0002</strong></span>
              <span className="text-[#74777F]/40">•</span>
              <span>24h Yield <strong className="text-[#10B981] font-semibold">+124.80 ARTH</strong></span>
              <span className="text-[#74777F]/40">•</span>
              <span>CLS Finality <strong className="text-[#121C28] font-semibold">380ms</strong></span>
              <span className="text-[#74777F]/40">•</span>
              <span>Core Ledger <strong className="text-[#1E3A5F] font-bold">#28,102,510</strong></span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-[11px]">
              <button 
                type="button"
                onClick={() => setIsSwitcherModalOpen(true)}
                className="text-[#1E3A5F] hover:text-[#022448] flex items-center gap-1.5 font-sans font-semibold transition-colors cursor-pointer bg-[#1E3A5F]/8 hover:bg-[#1E3A5F]/15 px-2.5 py-0.5 rounded-full"
                title="Open Universal Cross-Portal Switchboard (Alt+P)"
              >
                <Layers className="w-3.5 h-3.5 text-[#A8742A]" />
                <span>Switchboard (Alt+P)</span>
              </button>
              <span className="text-[#74777F]/40">|</span>
              <span className="flex items-center gap-1.5 text-[#43474E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>ISO 20022 Encrypted</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tier 2: Resident Identity Bar & Enclave Controls */}
        <div className="px-3.5 sm:px-6 py-2 flex flex-col justify-between gap-1.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo Presentation */}
          <div className="flex items-center gap-6">
            <Link href="/user" className="flex items-center gap-3 group" title="ARTHAX User Portal">
              <div className="h-10 w-10 rounded-2xl bg-[#022448] border border-[#1E3A5F] flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 group-hover:border-[#A8742A] transition-all">
                <Image
                  src="/assets/brand/favicon.png"
                  alt="ARTHAX Logo"
                  width={26}
                  height={26}
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>
              <Image
                src="/assets/brand/navbar_logo.png"
                alt="ARTHAX"
                width={160}
                height={36}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>

            {/* Resident Badge: Opens Citizen Profile Drawer */}
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(true)}
              className={`hidden xl:flex items-center px-3.5 py-1.5 rounded-full border border-[#1E3A5F]/20 gap-3 transition-colors cursor-pointer ${
                currentTab === 'profile' || isProfileMenuOpen ? 'bg-[#E5EFFF] ring-2 ring-[#1E3A5F]' : 'bg-[#EEF4FF] hover:bg-[#E5EFFF]'
              }`}
              title="Open Citizen Sovereign Profile Panel"
            >
              <div className="flex flex-col text-left">
                <span className="font-sans text-xs font-semibold text-[#121C28] leading-none">{activePersona.displayName}</span>
                <span className="font-mono text-[10px] text-[#5C574F]">GOV ID: {activePersona.govIdNumber}</span>
              </div>
              <span className="px-2.5 py-0.5 bg-[#10B981] text-white rounded-full font-mono text-[10px] font-bold flex items-center gap-1 shadow-xs">
                <Fingerprint className="w-3 h-3 text-white" />
                Tier-1 Verified
              </span>
              <span className="px-2 py-0.5 bg-[#1E3A5F] text-white rounded-full font-mono text-[10px] font-semibold">
                Active Session
              </span>
            </button>
          </div>

          {/* Action Array: Privacy Mask Toggle + Enclave Status + Notifications + Avatar */}
          <div className="flex items-center gap-3">
            {/* Privacy Mask Toggle */}
            <button
              onClick={onToggleMask}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition border ${
                isMasked 
                  ? 'bg-[#A8742A]/10 border-[#A8742A]/30 text-[#A8742A] hover:bg-[#A8742A]/20' 
                  : 'bg-[#EEF4FF] border-[#74777F]/25 text-[#1E3A5F] hover:bg-[#E5EFFF]'
              }`}
              title={isMasked ? "Click to reveal balances" : "Click to mask sensitive balances"}
            >
              {isMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isMasked ? "Balances Masked" : "Balances Visible"}</span>
            </button>

            {/* Security Enclave Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#E5EFFF] px-3 py-1.5 rounded-full font-mono text-xs text-[#43474E] border border-[#74777F]/20">
              <Lock className="w-3.5 h-3.5 text-[#1E3A5F]" />
              <span>Tier-B Fin PIN: <strong className="text-[#121C28]">Enclave Ready</strong></span>
            </div>

            {/* Notifications with Unread Dot */}
            <Link 
              href="/user/mailbox"
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                currentTab === 'mailbox'
                  ? 'bg-[#1E3A5F] text-white shadow-xs'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
              aria-label={`${unreadCount} Unread Notifications`}
              title="Sovereign Institutional Mailbox"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                  currentTab === 'mailbox' ? 'bg-[#FFDDB6] ring-1 ring-white' : 'bg-[#BA1A1A]'
                }`} />
              )}
            </Link>

            {/* Citizen Profile Avatar Button */}
            <div className="flex items-center pl-1 border-l border-[#74777F]/25">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(true)}
                className={`flex items-center gap-1.5 p-1 rounded-full transition-all cursor-pointer ${
                  currentTab === 'profile' || isProfileMenuOpen
                    ? 'bg-[#E5EFFF] ring-2 ring-[#1E3A5F]'
                    : 'hover:bg-[#E5EFFF]'
                }`}
                title="Open Citizen Profile Panel (Ananya Sharma)"
                aria-expanded={isProfileMenuOpen}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#A8742A] shadow-xs relative bg-[#FAF8F5]">
                  <Image 
                    src="/assets/shop/avatars/Female/Analyst.png" 
                    alt="Ananya Sharma Avatar"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <ChevronDown className={`w-4 h-4 text-[#1E3A5F] transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>
        </div>

        {/* Tier 3: Portal Horizontal Sub-Navigation Tab Bar */}
        <div className="relative mt-0.5">
          <nav 
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 pt-0.5 whitespace-nowrap no-scrollbar font-sans text-xs"
          >
            <Link 
              href="/user" 
              data-active={currentTab === 'overview'}
              className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 cursor-pointer ${
                currentTab === 'overview'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#1E3A5F]'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              Overview
            </Link>
            <Link 
              href="/user/profile" 
              data-active={currentTab === 'profile'}
              className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#1E3A5F]'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen Profile</span>
            </Link>
            <Link 
              href="/user/banks" 
              data-active={currentTab === 'my-banks-and-accounts'}
              className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'my-banks-and-accounts'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#1E3A5F]'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>My Banks &amp; Accounts</span>
            </Link>
            <Link 
              href="/user/transfers" 
              data-active={currentTab === 'transfers-and-dvp'}
              className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'transfers-and-dvp'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#1E3A5F]'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transfers &amp; DvP</span>
            </Link>
            <Link 
              href="/user/fixed-deposits" 
              data-active={currentTab === 'fixed-deposits'}
              className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'fixed-deposits'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#1E3A5F]'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Fixed Deposits</span>
            </Link>
            <Link 
              href="/user/stocks" 
              data-active={currentTab === 'stocks'}
              className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'stocks'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#1E3A5F]'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Stock Portfolio</span>
            </Link>
            <Link 
              href="/user/rewards" 
              data-active={currentTab === 'rewards'}
              className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'rewards'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#1E3A5F]'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Rewards</span>
            </Link>
            <Link 
              href="/user/shop" 
              data-active={currentTab === 'shop'}
              className={`px-3.5 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'shop'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#A8742A]/60'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              {currentTab === 'shop' && (
                <span className="w-2 h-2 rounded-full bg-[#F9BB6A] animate-pulse" />
              )}
              <Store className="w-3.5 h-3.5" />
              <span className="font-semibold">Shop &amp; Vault</span>
            </Link>
            <Link 
              href="/user/mailbox" 
              data-active={currentTab === 'mailbox'}
              className={`px-3.5 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'mailbox'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#A8742A]/60'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              {currentTab === 'mailbox' && (
                <span className="w-2 h-2 rounded-full bg-[#F9BB6A] animate-pulse" />
              )}
              <Mail className="w-3.5 h-3.5" />
              <span className="font-semibold">Mailbox</span>
              {unreadCount > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  currentTab === 'mailbox' ? 'bg-[#FFDDB6] text-[#2A1800]' : 'bg-[#BA1A1A] text-white'
                }`}>
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link 
              href="/user/security" 
              data-active={currentTab === 'security'}
              className={`px-3.5 py-1.5 rounded-full font-medium transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'security'
                  ? 'bg-[#1E3A5F] text-white shadow-xs ring-1 ring-[#1E3A5F]'
                  : 'text-[#43474E] hover:bg-[#E5EFFF] hover:text-[#121C28]'
              }`}
            >
              {currentTab === 'security' && (
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              )}
              <Sliders className="w-3.5 h-3.5" />
              <span className={currentTab === 'security' ? 'font-semibold' : ''}>Security &amp; Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  </div>

  {/* Dedicated Citizen Profile Drawer: Solid, rich colors, zero glass theme, 100% visible */}
  <CitizenProfileDrawer
    isOpen={isProfileMenuOpen}
    onClose={() => setIsProfileMenuOpen(false)}
    isMasked={isMasked}
    onToggleMask={onToggleMask}
  />

  {/* Universal Cross-Portal Switchboard Modal */}
  <UniversalPortalSwitcherModal
    isOpen={isSwitcherModalOpen}
    onClose={() => setIsSwitcherModalOpen(false)}
  />
</>
);
};
