'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Landmark,
  ArrowRightLeft,
  PiggyBank,
  HandCoins,
  Package,
  ClipboardList,
  BarChart3,
  Bell,
  Settings,
  FileSearch,
  ChevronDown,
  Check,
  ShieldCheck,
  PanelLeftClose,
  PanelLeft,
  Layers,
} from 'lucide-react';
import { ARTHAX_BANKS, BankIdentity, ACTIVE_STAFF } from './BankMockData';
import { UniversalPortalSwitcherModal } from '../common/UniversalPortalSwitcherModal';
import { apiGetActivePersona, subscribePortalDataInvalidation } from '@/lib/api';

interface BankPortalSidebarProps {
  activeBank: string;
  onSwitchBank: (bankId: string) => void;
}

const NAV_ITEMS = [
  { label: 'Overview', href: '/bank', icon: LayoutDashboard, exact: true },
  { label: 'Customers', href: '/bank/customers', icon: Users },
  { label: 'Accounts', href: '/bank/accounts', icon: Landmark },
  { label: 'Transactions', href: '/bank/transactions', icon: ArrowRightLeft },
  { label: 'Fixed Deposits', href: '/bank/fixed-deposits', icon: PiggyBank },
  { label: 'Loans', href: '/bank/loans', icon: HandCoins },
  { label: 'Products', href: '/bank/products', icon: Package },
  { label: 'Operations', href: '/bank/operations', icon: ClipboardList, badge: '6' },
  { label: 'Reports', href: '/bank/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/bank/notifications', icon: Bell, dot: true },
  { label: 'Settings', href: '/bank/settings', icon: Settings },
  { label: 'Audit / Activity', href: '/bank/audit', icon: FileSearch },
];

export const BankPortalSidebar: React.FC<BankPortalSidebarProps> = ({
  activeBank,
  onSwitchBank,
}) => {
  const pathname = usePathname();
  const [isBankSwitcherOpen, setIsBankSwitcherOpen] = useState(false);
  const [isSwitcherModalOpen, setIsSwitcherModalOpen] = useState(false);
  const [activePersona, setActivePersona] = useState(apiGetActivePersona());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribePortalDataInvalidation(() => {
      setActivePersona(apiGetActivePersona());
    });
    return unsub;
  }, []);

  const bank: BankIdentity = ARTHAX_BANKS[activeBank] || ARTHAX_BANKS['nava'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setIsBankSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 264 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="shrink-0 h-full bg-white border border-[#3B3278]/12 rounded-3xl shadow-sm shadow-[#3B3278]/5 flex flex-col justify-between select-none z-30 relative overflow-hidden"
    >
      {/* Top: Bank Identity + Switcher */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-3 pt-4 pb-3 shrink-0">
          {/* Bank Logo & Switcher */}
          <div ref={switcherRef} className="relative">
            <button
              type="button"
              onClick={() => !isCollapsed && setIsBankSwitcherOpen(!isBankSwitcherOpen)}
              className={`w-full flex items-center gap-2.5 p-2 rounded-2xl border border-[#3B3278]/10 hover:border-[#3B3278]/25 bg-[#F9F8FF] hover:bg-[#F4F2FF] active:scale-[0.99] transition-all cursor-pointer group ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#3B3278]/15 bg-white p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                <Image
                  src={bank.logo}
                  alt={bank.name}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-1 items-center justify-between min-w-0"
                  >
                    <div className="flex flex-col items-start flex-1 min-w-0 pr-1">
                      <span className="font-serif font-bold text-sm text-[#1C1736] leading-tight truncate w-full text-left">
                        {bank.shortName}
                      </span>
                      <span className="text-[10px] text-[#74777F] font-medium truncate w-full text-left">
                        {bank.tagline}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#74777F] group-hover:text-[#3B3278] transition-transform shrink-0 ${
                        isBankSwitcherOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Bank Switcher Dropdown */}
            {isBankSwitcherOpen && !isCollapsed && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-[#3B3278]/15 rounded-2xl shadow-[0_8px_24px_-4px_rgba(59,50,120,0.12)] overflow-hidden">
                <div className="px-3 py-2 bg-[#F9F8FF] border-b border-[#3B3278]/10">
                  <span className="text-[10px] font-mono font-bold text-[#3B3278] uppercase tracking-wider">
                    Switch Active Bank
                  </span>
                </div>
                <div className="py-1">
                  {Object.values(ARTHAX_BANKS).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        onSwitchBank(b.id);
                        setIsBankSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#F9F8FF] transition-colors cursor-pointer ${
                        b.id === activeBank ? 'bg-[#F4F2FF]' : ''
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#3B3278]/10 p-0.5 shrink-0 bg-white flex items-center justify-center">
                        <Image
                          src={b.logo}
                          alt={b.name}
                          width={20}
                          height={20}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-semibold text-xs truncate">{b.name}</span>
                        <span className="text-[10px] text-[#74777F]">
                          {b.customerCount.toLocaleString('en-US')} customers
                        </span>
                      </div>
                      {b.id === activeBank && (
                        <Check className="w-4 h-4 text-[#3B3278] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 border-t border-[#3B3278]/8 shrink-0"></div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.label}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-full text-xs font-medium transition-colors duration-150 group cursor-pointer ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-[#43474E] hover:text-[#3B3278] hover:bg-[#F4F2FF]'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                {/* M3 Active Pill Container with Framer-Motion Layout Animation */}
                {active && (
                  <motion.div
                    layoutId="bank-active-nav-indicator"
                    className="absolute inset-0 bg-[#3B3278] rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                <item.icon
                  className={`relative z-10 w-4 h-4 shrink-0 transition-colors duration-150 ${
                    active ? 'text-white' : 'text-[#3B3278]/70 group-hover:text-[#3B3278]'
                  }`}
                />
                {!isCollapsed && (
                  <>
                    <span className="relative z-10 flex-1 truncate font-sans">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-[#B5482E]/10 text-[#B5482E]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.dot && (
                      <span className="relative z-10 w-2 h-2 rounded-full bg-[#B5482E] animate-pulse shrink-0"></span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Staff identity + Collapse toggle */}
      <div className="border-t border-[#3B3278]/8 px-2.5 py-3 space-y-2 bg-[#FBFBFF]">
        {/* Staff Identity */}
        <AnimatePresence initial={false} mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-staff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-2xl bg-white border border-[#3B3278]/10 shadow-xs"
            >
              <div className="w-8 h-8 rounded-full bg-[#3B3278] text-white flex items-center justify-center font-serif text-xs font-bold shrink-0">
                {ACTIVE_STAFF.initials}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-[#1C1736] truncate">
                    {ACTIVE_STAFF.name}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3B3278] shrink-0" />
                </div>
                <span className="text-[10px] text-[#74777F] truncate">
                  {ACTIVE_STAFF.role}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-staff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex justify-center"
            >
              <div
                className="w-8 h-8 rounded-full bg-[#3B3278] text-white flex items-center justify-center font-serif text-xs font-bold"
                title={`${ACTIVE_STAFF.name} · ${ACTIVE_STAFF.role}`}
              >
                {ACTIVE_STAFF.initials}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Universal Switchboard Trigger */}
        <button
          type="button"
          onClick={() => setIsSwitcherModalOpen(true)}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[#3B3278] bg-[#F3F0FA] hover:bg-[#EBE6F7] active:scale-95 transition-all text-xs font-semibold cursor-pointer border border-[#3B3278]/20 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Open Universal Cross-Portal Switchboard (Alt+P)"
        >
          <Layers className="w-4 h-4 text-[#A8742A] shrink-0" />
          {!isCollapsed && <span>Switchboard (Alt+P)</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[#74777F] hover:text-[#3B3278] hover:bg-[#F4F2FF] active:scale-95 transition-all text-xs cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Universal Cross-Portal Switchboard Modal */}
      <UniversalPortalSwitcherModal
        isOpen={isSwitcherModalOpen}
        onClose={() => setIsSwitcherModalOpen(false)}
      />
    </motion.aside>
  );
};
