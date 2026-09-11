'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  X,
  Lock,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Building2,
  Landmark,
  TrendingUp,
  Store,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Fingerprint,
} from 'lucide-react';
import {
  apiGetActivePersona,
  apiSwitchDemoPersona,
  apiGetMaskPreference,
  apiSetMaskPreference,
  subscribePortalDataInvalidation,
  DEMO_PERSONAS,
} from '@/lib/api';
import { DemoPersonaDto, UserRole } from '@arthax/types';

interface UniversalPortalSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PortalNode {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  accentColor: string;
  bgLight: string;
  borderAccent: string;
  icon: React.ComponentType<{ className?: string }>;
  roleRequirement?: UserRole[];
  restrictedNote?: string;
  badge: string;
  shortcuts?: { label: string; href: string }[];
}

export const UniversalPortalSwitcherModal: React.FC<UniversalPortalSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const [activePersona, setActivePersona] = useState<DemoPersonaDto>(apiGetActivePersona());
  const [isMasked, setIsMasked] = useState<boolean>(apiGetMaskPreference());
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  // Sync state with global invalidation bus
  useEffect(() => {
    const unsub = subscribePortalDataInvalidation(() => {
      setActivePersona(apiGetActivePersona());
      setIsMasked(apiGetMaskPreference());
    });
    return unsub;
  }, []);

  // Keyboard shortcut listener: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handlePersonaSelect = async (personaId: 'citizen' | 'bank_officer' | 'governor') => {
    if (activePersona.id === personaId || isSwitching) return;
    setIsSwitching(true);
    try {
      await apiSwitchDemoPersona(personaId);
      setActivePersona(apiGetActivePersona());
    } finally {
      setIsSwitching(false);
    }
  };

  const handleToggleMask = () => {
    const next = !isMasked;
    setIsMasked(next);
    apiSetMaskPreference(next);
  };

  const portals: PortalNode[] = useMemo(() => [
    {
      id: 'guide',
      name: 'Central Guide & Protocol Hub',
      subtitle: 'Public Architecture, CLS Pipeline, Monetary Manifesto',
      href: '/',
      accentColor: '#022448',
      bgLight: '#F2EFE7',
      borderAccent: '#3368A0',
      icon: Compass,
      badge: 'Public Architecture',
      shortcuts: [
        { label: 'Ledger Treaty', href: '/#ledger-engine' },
        { label: 'CLS Pipeline', href: '/#cls-pipeline' },
        { label: 'Bank Registry', href: '/#banks' },
      ],
    },
    {
      id: 'gov',
      name: 'GOV Identity Gateway',
      subtitle: 'Citizen Registration, OTP Verification, Tier-1 Credentials',
      href: '/gov',
      accentColor: '#287A55',
      bgLight: '#E8F5EE',
      borderAccent: '#287A55',
      icon: Fingerprint,
      badge: 'Identity Gateway',
      shortcuts: [
        { label: 'Verify Identity', href: '/gov' },
        { label: 'Dual-Password', href: '/gov#dual-password' },
      ],
    },
    {
      id: 'user',
      name: 'User Financial Portal',
      subtitle: 'Personal Accounts, Transfers, Term Deposits & Mailbox',
      href: '/user',
      accentColor: '#1E3A5F',
      bgLight: '#EEF4FF',
      borderAccent: '#1E3A5F',
      icon: User,
      badge: 'Citizen Treasury',
      shortcuts: [
        { label: 'Accounts', href: '/user/banks' },
        { label: 'Transfers', href: '/user/transfers' },
        { label: 'Fixed Deposits', href: '/user/fixed-deposits' },
        { label: 'Mailbox', href: '/user/mailbox' },
      ],
    },
    {
      id: 'stocks',
      name: 'Equities & Stock Exchange',
      subtitle: 'Sovereign Equities, Order Book Blotter, Portfolio & 15% CGT',
      href: '/stocks',
      accentColor: '#173F35',
      bgLight: '#E6F4F0',
      borderAccent: '#173F35',
      icon: TrendingUp,
      badge: 'Sovereign Exchange',
      shortcuts: [
        { label: 'Live Orders', href: '/stocks/orders' },
        { label: 'Portfolio', href: '/stocks/portfolio' },
        { label: '15% Profit Tax', href: '/stocks/profit-tax' },
        { label: 'Watchlist', href: '/stocks/watchlist' },
      ],
    },
    {
      id: 'shop',
      name: 'Virtual Economy & Relics',
      subtitle: 'Pet Companions, Profile Frames, Avatars & Yield Boosters',
      href: '/user/shop',
      accentColor: '#A8742A',
      bgLight: '#FAF3E8',
      borderAccent: '#A8742A',
      icon: Store,
      badge: 'Virtual Economy',
      shortcuts: [
        { label: 'Pet Store', href: '/user/shop' },
        { label: 'Active Relics', href: '/user/shop' },
      ],
    },
    {
      id: 'bank',
      name: 'Commercial Bank Operations',
      subtitle: 'Licensed Depository Operations, Customer Accounts, Loans & FDs',
      href: '/bank',
      accentColor: '#3B3278',
      bgLight: '#F3F0FA',
      borderAccent: '#3B3278',
      icon: Building2,
      roleRequirement: ['BANK_ADMIN', 'CENTRAL_BANK_ADMIN'],
      restrictedNote: 'Restricted: Depository Branch Staff Only',
      badge: 'Commercial Depository',
      shortcuts: [
        { label: 'Customers', href: '/bank/customers' },
        { label: 'Accounts', href: '/bank/accounts' },
        { label: 'Term Deposits', href: '/bank/fixed-deposits' },
        { label: 'Work Queue', href: '/bank/operations' },
      ],
    },
    {
      id: 'central-bank',
      name: 'Central Bank Administrative System',
      subtitle: 'Monetary Policy, CLS Clearing, Reserve Monitoring & Audit',
      href: '/central-bank',
      accentColor: '#946726',
      bgLight: '#FAF5EA',
      borderAccent: '#946726',
      icon: Landmark,
      roleRequirement: ['CENTRAL_BANK_ADMIN'],
      restrictedNote: 'Restricted: Central Bank Regulatory Authority Only',
      badge: 'Sovereign Authority',
      shortcuts: [
        { label: 'CLS Clearing', href: '/central-bank/settlement' },
        { label: 'Bank Monitoring', href: '/central-bank/monitoring' },
        { label: 'Financial Rules', href: '/central-bank/financial-rules' },
        { label: 'Audit Log', href: '/central-bank/audit' },
      ],
    },
  ], []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-[#022448]/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        className="relative z-10 w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#FAF8F5] text-[#121C28] rounded-[28px] sm:rounded-[32px] border-2 border-[#1E3A5F]/25 shadow-[0_24px_64px_-12px_rgba(2,36,72,0.4),0_8px_24px_-4px_rgba(168,116,42,0.15)] overflow-hidden font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="ARTHAX Universal Cross-Portal Switchboard"
      >
        {/* Tier 1: Modal Header with Institutional Seal */}
        <div className="bg-[#022448] text-white px-6 py-4 border-b-2 border-[#A8742A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#A8742A] text-white font-serif text-sm font-bold flex items-center justify-center shadow-xs">
              AX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-wide text-[#E9D9BE]">
                  ARTHAX UNIVERSAL SWITCHBOARD
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#1E3A5F] px-2 py-0.5 rounded-full text-[#C8DFDB] font-semibold">
                  World Integration
                </span>
              </div>
              <p className="text-[11px] font-sans text-neutral-300">
                Institutional Cross-Portal Switchboard &amp; Synchronized Session Mesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Global Mask Toggle */}
            <button
              type="button"
              onClick={handleToggleMask}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition border cursor-pointer ${
                isMasked
                  ? 'bg-[#A8742A]/20 border-[#A8742A]/40 text-[#FFDDB6] hover:bg-[#A8742A]/30'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title={isMasked ? 'Reveal balances across all portals' : 'Mask balances across all portals'}
            >
              {isMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{isMasked ? 'Balances Masked' : 'Balances Visible'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1E3A5F] hover:bg-[#A8742A] text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="Close switchboard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tier 2: Demo Persona Selector Strip (Backend Authorized) */}
        <div className="bg-[#EEF4FF] border-b border-[#1E3A5F]/15 px-6 py-3 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#43474E]">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-semibold text-[#121C28]">Active Session Authority:</span>
            <span className="font-mono text-[#5C574F]">
              {activePersona.displayName} ({activePersona.role})
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-[#74777F] mr-1">Switch Persona:</span>
            {(['citizen', 'bank_officer', 'governor'] as const).map((pid) => {
              const persona = DEMO_PERSONAS[pid];
              const isSelected = activePersona.id === pid;
              return (
                <button
                  key={pid}
                  type="button"
                  disabled={isSwitching}
                  onClick={() => handlePersonaSelect(pid)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1E3A5F] text-white shadow-xs font-bold'
                      : 'bg-white hover:bg-neutral-100 text-[#1E3A5F] border border-[#1E3A5F]/20'
                  }`}
                >
                  <span>{persona.displayName.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75">({persona.role.replace('_ADMIN', '')})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 3: Portal Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(92vh-150px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portals.map((portal) => {
              const isCurrent =
                (portal.href === '/' && pathname === '/') ||
                (portal.href !== '/' && pathname.startsWith(portal.href));

              // Check role permission
              const hasRole = !portal.roleRequirement || portal.roleRequirement.includes(activePersona.role);

              return (
                <div
                  key={portal.id}
                  className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                    hasRole
                      ? 'bg-white hover:shadow-md hover:-translate-y-0.5'
                      : 'bg-neutral-50/75 opacity-70 border-dashed border-neutral-300'
                  } ${
                    isCurrent
                      ? 'ring-2 ring-[#A8742A] border-[#A8742A] shadow-xs'
                      : 'border-neutral-200'
                  }`}
                >
                  <div className="p-5 space-y-3">
                    {/* Header: Icon + Badge + Lock */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: portal.accentColor }}
                      >
                        <portal.icon className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#A8742A] text-white">
                            Current Node
                          </span>
                        )}
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border"
                          style={{
                            backgroundColor: portal.bgLight,
                            borderColor: `${portal.borderAccent}40`,
                            color: portal.accentColor,
                          }}
                        >
                          {portal.badge}
                        </span>
                        {!hasRole && (
                          <span className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#121C28] leading-tight">
                        {portal.name}
                      </h3>
                      <p className="font-sans text-xs text-[#5C574F] mt-1 leading-relaxed">
                        {portal.subtitle}
                      </p>
                    </div>

                    {/* Restriction Advisory */}
                    {!hasRole && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5 font-mono">
                        <Lock className="w-3 h-3 text-amber-700 shrink-0" />
                        <span className="truncate">{portal.restrictedNote}</span>
                      </div>
                    )}

                    {/* Direct Shortcuts Strip */}
                    {hasRole && portal.shortcuts && (
                      <div className="pt-2 border-t border-neutral-100">
                        <div className="flex flex-wrap gap-1">
                          {portal.shortcuts.map((sc) => (
                            <Link
                              key={sc.href}
                              href={sc.href}
                              onClick={onClose}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#F2EFE7] hover:bg-[#E5E0D4] text-[#1E3A5F] transition"
                            >
                              {sc.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                    {hasRole ? (
                      <Link
                        href={portal.href}
                        onClick={onClose}
                        className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition active:scale-98 shadow-xs"
                        style={{ backgroundColor: portal.accentColor }}
                      >
                        <span>Launch {portal.badge}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-xl text-xs font-mono text-center text-neutral-500 bg-neutral-100 flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Role Not Authorized</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier 4: Footer Help Ribbon */}
        <div className="bg-[#FAF8F5] border-t border-[#1E3A5F]/15 px-6 py-2.5 flex items-center justify-between text-[11px] font-mono text-[#5C574F] shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Single Double-Entry Ledger Active • 1 GOV ID : 1 Resident : Many Bank Nodes</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>Press ESC or click outside to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalPortalSwitcherModal;
