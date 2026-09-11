'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Activity,
  ArrowLeftRight,
  Scale,
  ReceiptText,
  Coins,
  TrendingUp,
  FileSpreadsheet,
  Megaphone,
  ShieldAlert,
  ServerCog,
  Settings,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
  Lock,
  Layers,
} from 'lucide-react';
import { UniversalPortalSwitcherModal } from '../common/UniversalPortalSwitcherModal';
import { apiGetActivePersona, subscribePortalDataInvalidation } from '@/lib/api';

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    badge?: string;
    badgeColor?: string;
  }[];
}

const NAV_GROUPS: NavSection[] = [
  {
    title: 'Macro Governance',
    items: [
      { label: 'Overview', href: '/central-bank', icon: LayoutDashboard, exact: true },
      { label: 'Bank Registry', href: '/central-bank/banks', icon: Building2 },
      { label: 'Bank Monitoring', href: '/central-bank/monitoring', icon: Activity },
    ],
  },
  {
    title: 'Monetary & Settlement',
    items: [
      {
        label: 'CLS / Settlement',
        href: '/central-bank/settlement',
        icon: ArrowLeftRight,
        badge: 'Live',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      },
      { label: 'Financial Rules', href: '/central-bank/financial-rules', icon: Scale },
      { label: 'Tax & Investment', href: '/central-bank/tax-investment', icon: ReceiptText },
      { label: 'ARTH / Currency', href: '/central-bank/currency', icon: Coins },
      { label: 'Market Oversight', href: '/central-bank/market', icon: TrendingUp },
    ],
  },
  {
    title: 'Oversight & Admin',
    items: [
      { label: 'Reports', href: '/central-bank/reports', icon: FileSpreadsheet },
      { label: 'Announcements', href: '/central-bank/announcements', icon: Megaphone },
      {
        label: 'Audit & Compliance',
        href: '/central-bank/audit',
        icon: ShieldAlert,
        badge: 'Log',
        badgeColor: 'bg-[#946726]/10 text-[#946726] border-[#946726]/20',
      },
      { label: 'System / Security', href: '/central-bank/security', icon: ServerCog },
      { label: 'Settings', href: '/central-bank/settings', icon: Settings },
    ],
  },
];

interface CentralBankSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const CentralBankSidebar: React.FC<CentralBankSidebarProps> = ({
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isSwitcherModalOpen, setIsSwitcherModalOpen] = useState(false);
  const [activePersona, setActivePersona] = useState(apiGetActivePersona());

  React.useEffect(() => {
    const unsub = subscribePortalDataInvalidation(() => {
      setActivePersona(apiGetActivePersona());
    });
    return unsub;
  }, []);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 74 : 272 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="shrink-0 h-full bg-[#FFFFFF] border border-[#D8C7A5] rounded-3xl shadow-sm shadow-[#946726]/5 flex flex-col justify-between z-30 relative select-none overflow-hidden"
    >
      {/* Top Section: Sovereign Seal & Title */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-3.5 pt-4 pb-3 border-b border-[#D8C7A5]/70 shrink-0 bg-[#FAF7EE]">
          <div className="flex items-center justify-between">
            <Link
              href="/central-bank"
              className={`flex items-center gap-3 group ${isCollapsed ? 'justify-center w-full' : ''}`}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#946726] via-[#B88B38] to-[#7A5217] p-1 border border-[#F5E1B2] shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/assets/portals/central_bank.png"
                  alt="Central Bank of ARTHAX"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
                    className="flex flex-col min-w-0"
                  >
                    <span className="font-serif font-bold text-sm text-[#2A2012] leading-tight truncate">
                      Central Bank
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#946726] font-extrabold truncate mt-0.5">
                      SOVEREIGN AUTHORITY
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {!isCollapsed && (
              <button
                type="button"
                onClick={toggleCollapse}
                title="Collapse Navigation"
                className="p-1.5 rounded-full text-[#74777F] hover:text-[#946726] hover:bg-[#946726]/10 active:scale-95 transition cursor-pointer"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {isCollapsed && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={toggleCollapse}
                title="Expand Navigation"
                className="p-1.5 rounded-full text-[#74777F] hover:text-[#946726] hover:bg-[#946726]/10 active:scale-95 transition cursor-pointer"
              >
                <PanelLeft className="w-4 h-4 mx-auto" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Groupings (13 Items) with Central Bank Animated Scrollbar */}
        <nav className="p-2.5 space-y-4 overflow-y-auto flex-1 min-h-0 central-bank-scrollbar bg-white">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-3.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C682D] block mb-1"
                  >
                    {group.title}
                  </motion.span>
                )}
              </AnimatePresence>

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-medium transition-colors duration-150 group cursor-pointer ${
                      active
                        ? 'text-white font-semibold'
                        : 'text-[#4A3D2A] hover:text-[#7A5217] hover:bg-[#946726]/8'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    {/* Material 3 Active Pill Container with Fluid Framer-Motion Layout Animation */}
                    {active && (
                      <motion.div
                        layoutId="cb-active-nav-indicator"
                        className="absolute inset-0 bg-[#946726] rounded-full shadow-sm shadow-[#946726]/30"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}

                    <Icon
                      className={`relative z-10 w-4 h-4 shrink-0 transition-colors duration-150 ${
                        active
                          ? 'text-white'
                          : 'text-[#946726]/80 group-hover:text-[#7A5217]'
                      }`}
                    />

                    {!isCollapsed && (
                      <span className="relative z-10 truncate flex-1 font-sans">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`relative z-10 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          active
                            ? 'bg-white/20 text-white border-white/30'
                            : item.badgeColor || 'bg-amber-100/70 text-[#7A5217] border-[#D8C7A5]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile & Institutional Status */}
      <div className="p-3 border-t border-[#D8C7A5]/70 bg-[#FAF7EE]">
        <AnimatePresence initial={false} mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-governor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-2"
            >
              <div className="p-2.5 rounded-2xl bg-white border border-[#D8C7A5] shadow-xs hover:border-[#946726]/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#946726]/15 flex items-center justify-center text-[#7A5217] font-serif font-bold text-xs shrink-0">
                    <Lock className="w-4 h-4 text-[#946726]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-serif font-bold text-xs text-[#2A2012] block truncate">
                      Dr. Alistair Vance
                    </span>
                    <span className="font-mono text-[9px] text-[#74777F] block truncate">
                      Sovereign Governor
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#615749] font-mono px-1">
                <span>Security: Level 4</span>
                <button
                  type="button"
                  onClick={() => setIsSwitcherModalOpen(true)}
                  className="text-[#946726] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  title="Open Universal Cross-Portal Switchboard (Alt+P)"
                >
                  <span>Switchboard</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-governor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex justify-center"
            >
              <button
                type="button"
                onClick={() => setIsSwitcherModalOpen(true)}
                title="Dr. Alistair Vance, Sovereign Governor — Switchboard"
                className="w-9 h-9 rounded-xl bg-[#946726]/15 flex items-center justify-center text-[#946726] hover:bg-[#946726]/25 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#946726]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Universal Cross-Portal Switchboard Modal */}
      <UniversalPortalSwitcherModal
        isOpen={isSwitcherModalOpen}
        onClose={() => setIsSwitcherModalOpen(false)}
      />
    </motion.aside>
  );
};
