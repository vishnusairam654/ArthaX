'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Search, 
  Wallet, 
  ShieldCheck, 
  CandlestickChart, 
  Building2, 
  FileText, 
  Layers, 
  Receipt, 
  Bookmark, 
  Eye, 
  EyeOff, 
  ExternalLink,
  ChevronRight,
  X,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { AnimatedMaskedValue } from '@/components/user/AnimatedMaskedValue';
import { LISTED_COMPANIES } from './StockData';
import { UniversalPortalSwitcherModal } from '../common/UniversalPortalSwitcherModal';
import { apiGetActivePersona, subscribePortalDataInvalidation } from '@/lib/api';

interface StockPortalHeaderProps {
  isMasked?: boolean;
  onToggleMask?: () => void;
}

export const StockPortalHeader: React.FC<StockPortalHeaderProps> = ({
  isMasked = true,
  onToggleMask,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [internalMasked, setInternalMasked] = useState<boolean>(true);
  const [isSwitcherModalOpen, setIsSwitcherModalOpen] = useState<boolean>(false);
  const [activePersona, setActivePersona] = useState(apiGetActivePersona());
  const activeMasked = onToggleMask ? isMasked : internalMasked;
  const toggleMask = onToggleMask || (() => setInternalMasked(prev => !prev));

  // Sync state on invalidation
  useEffect(() => {
    const unsub = subscribePortalDataInvalidation(() => {
      setActivePersona(apiGetActivePersona());
    });
    return unsub;
  }, []);

  // Search State & Refs
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allCompanies = useMemo(() => Object.values(LISTED_COMPANIES), []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allCompanies.slice(0, 4); // Top 4 trending when empty
    return allCompanies.filter(company => 
      company.symbol.toLowerCase().includes(q) ||
      company.name.toLowerCase().includes(q) ||
      company.isin.toLowerCase().includes(q) ||
      company.sector.toLowerCase().includes(q) ||
      company.category.toLowerCase().includes(q)
    );
  }, [searchQuery, allCompanies]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Global keyboard shortcuts (Alt+K or Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'k') || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 20);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCompany = (symbol: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    searchInputRef.current?.blur();
    router.push(`/stocks/${symbol}`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (searchResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (searchResults.length || 1)) % (searchResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectCompany(searchResults[selectedIndex].symbol);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const navItems = [
    {
      label: 'Market Overview',
      href: '/stocks',
      icon: CandlestickChart,
      exact: true,
    },
    {
      label: 'Companies Directory',
      href: '/stocks/companies',
      badge: '10',
    },
    {
      label: 'Stock Details',
      href: '/stocks/NILA',
      isSymbolRoute: true,
    },
    {
      label: 'Orders & Blotter',
      href: '/stocks/orders',
      dot: true,
    },
    {
      label: 'Portfolio & Allocation',
      href: '/stocks/portfolio',
    },
    {
      label: 'Profit & Tax',
      href: '/stocks/profit-tax',
    },
    {
      label: 'Watchlist & Baskets',
      href: '/stocks/watchlist',
      badge: '4',
    },
  ];

  const isTabActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === '/stocks';
    }
    if (item.isSymbolRoute) {
      return pathname.startsWith('/stocks/') && 
        !['/stocks/companies', '/stocks/orders', '/stocks/portfolio', '/stocks/profit-tax', '/stocks/watchlist'].some(p => pathname.startsWith(p));
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="sticky top-2 sm:top-3 z-40 w-full px-3 sm:px-5 lg:px-6 pointer-events-none my-1.5 sm:my-2 transition-all duration-300">
      <header className="pointer-events-auto max-w-[1720px] mx-auto bg-white/92 backdrop-blur-xl border border-[#173F35]/15 rounded-2xl shadow-[0_4px_24px_-2px_rgba(23,63,53,0.08),0_2px_6px_-1px_rgba(23,63,53,0.04)] transition-[box-shadow,border-color] duration-200 hover:shadow-[0_6px_28px_-2px_rgba(23,63,53,0.11),0_2px_8px_-1px_rgba(23,63,53,0.05)]">
        {/* Main Bar */}
        <div className="h-14 sm:h-15 px-3.5 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Brand Identity & Search */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
            <Link href="/stocks" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-[#173F35] flex items-center justify-center p-1.5 shadow-sm group-hover:bg-[#0d2620] transition-colors">
                <Image
                  src="/assets/brand/favicon.png"
                  alt="ARTHAX Logo"
                  width={26}
                  height={26}
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/assets/brand/navbar_logo.png"
                    alt="ARTHAX"
                    width={112}
                    height={22}
                    className="h-5 w-auto object-contain"
                    priority
                  />
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DCEEE8] text-[#173F35] uppercase tracking-wider font-mono">
                    EXCHANGE
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-semibold tracking-wider text-[#2F7468] uppercase mt-0.5">
                  Capital Markets Execution
                </span>
              </div>
            </Link>

            {/* Perfected Terminal Search Bar */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <div className={`group relative flex items-center h-9 rounded-xl border transition-all duration-200 ${
                isSearchOpen 
                  ? 'bg-white border-[#173F35] ring-2 ring-[#173F35]/15 shadow-sm' 
                  : 'bg-[#FAF9F5] hover:bg-[#F4F2EB] border-[#173F35]/15 hover:border-[#173F35]/30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
              }`}>
                <Search className={`w-3.5 h-3.5 absolute left-3 transition-colors pointer-events-none ${
                  isSearchOpen ? 'text-[#173F35]' : 'text-[#717975] group-hover:text-[#173F35]'
                }`} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search 10 Equities, ISIN, Filings..." 
                  className="w-full pl-9 pr-14 py-1.5 bg-transparent text-xs font-sans font-medium text-[#1A1C18] placeholder:text-[#8E938F] outline-none"
                />
                <div className="absolute right-2.5 flex items-center gap-1">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="p-1 rounded-md text-[#717975] hover:text-[#173F35] hover:bg-[#173F35]/10 transition-colors cursor-pointer"
                      title="Clear search query"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/90 border border-[#173F35]/15 text-[#717975] shadow-xs select-none">
                      <span>ALT</span>+<span>K</span>
                    </kbd>
                  )}
                </div>
              </div>

              {/* Command Palette Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/98 backdrop-blur-xl border border-[#173F35]/15 rounded-2xl shadow-[0_12px_36px_-4px_rgba(23,63,53,0.16),0_4px_12px_-2px_rgba(23,63,53,0.06)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Results Header */}
                  <div className="px-3.5 py-2 bg-[#FAF9F5] border-b border-[#173F35]/10 flex items-center justify-between text-[11px] font-mono text-[#717975]">
                    <div className="flex items-center gap-1.5 text-[#173F35] font-semibold">
                      <Sparkles className="w-3 h-3 text-[#10B981]" />
                      <span>{searchQuery ? `MATCHING EQUITIES (${searchResults.length})` : 'TRENDING ARTHAX EQUITIES'}</span>
                    </div>
                    <span className="text-[10px]">10 Registered Securities</span>
                  </div>

                  {/* Equities List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#173F35]/5 p-1.5">
                    {searchResults.length > 0 ? (
                      searchResults.map((company, index) => {
                        const isSelected = index === selectedIndex;
                        return (
                          <div
                            key={company.symbol}
                            onClick={() => handleSelectCompany(company.symbol)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-150 ${
                              isSelected 
                                ? 'bg-[#DCEEE8]/35 text-[#173F35]' 
                                : 'hover:bg-[#FAF9F5] text-[#1A1C18]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Company Logo / Fallback Monogram */}
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#173F35]/15 bg-white p-0.5 shrink-0 flex items-center justify-center relative">
                                <Image
                                  src={company.logo}
                                  alt={company.name}
                                  width={28}
                                  height={28}
                                  className="object-contain w-full h-full"
                                />
                              </div>

                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-xs text-[#173F35]">
                                    {company.symbol}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-[#DCEEE8] text-[#173F35]">
                                    {company.category}
                                  </span>
                                  <span className="text-xs font-medium truncate text-[#1A1C18]">
                                    {company.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#717975] truncate">
                                  {company.sector} • ISIN: {company.isin}
                                </span>
                              </div>
                            </div>

                            {/* Right: Price and Change pill */}
                            <div className="flex items-center gap-2 shrink-0 pl-2">
                              <div className="flex flex-col items-end">
                                <span className="font-mono font-bold text-xs text-[#1A1C18]">
                                  {company.price.toFixed(2)} ARTH
                                </span>
                                <div className={`flex items-center gap-0.5 text-[10px] font-mono font-semibold ${
                                  company.isPositive ? 'text-[#287A55]' : 'text-[#B5482E]'
                                }`}>
                                  {company.isPositive ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  <span>{company.isPositive ? '+' : ''}{company.changePercent.toFixed(2)}%</span>
                                </div>
                              </div>
                              <ArrowUpRight className={`w-3.5 h-3.5 transition-transform ${
                                isSelected ? 'translate-x-0.5 -translate-y-0.5 text-[#173F35]' : 'text-[#717975]/50'
                              }`} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-1.5">
                        <div className="w-9 h-9 rounded-full bg-[#FAF9F5] border border-[#173F35]/15 flex items-center justify-center text-[#717975]">
                          <Search className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-[#1A1C18]">
                          No equities matching &ldquo;{searchQuery}&rdquo;
                        </span>
                        <span className="text-[10px] text-[#717975] max-w-xs">
                          Try searching by symbol (NILA, ARKA, MERU), full name, or ISIN code.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Direct Shortcuts Strip when empty */}
                  {!searchQuery && (
                    <div className="p-2 bg-[#FAF9F5]/70 border-t border-[#173F35]/10">
                      <div className="text-[10px] font-mono text-[#717975] px-1.5 mb-1.5 font-semibold">
                        DIRECT TRADING SHORTCUTS
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
                        <Link
                          href="/stocks/orders"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#173F35]/10 transition-colors text-[#4A534F] hover:text-[#173F35]"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#2F7468]" />
                          <span className="truncate">Orders &amp; Blotter</span>
                        </Link>
                        <Link
                          href="/stocks/companies"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#173F35]/10 transition-colors text-[#4A534F] hover:text-[#173F35]"
                        >
                          <Building2 className="w-3.5 h-3.5 text-[#2F7468]" />
                          <span className="truncate">Companies Directory</span>
                        </Link>
                        <Link
                          href="/stocks/watchlist"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#173F35]/10 transition-colors text-[#4A534F] hover:text-[#173F35]"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-[#2F7468]" />
                          <span className="truncate">Watchlist &amp; Baskets</span>
                        </Link>
                        <Link
                          href="/stocks/profit-tax"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#173F35]/10 transition-colors text-[#4A534F] hover:text-[#173F35]"
                        >
                          <Receipt className="w-3.5 h-3.5 text-[#2F7468]" />
                          <span className="truncate">Profit &amp; Capital Tax</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Dropdown Footer Helper */}
                  <div className="px-3.5 py-1.5 bg-white border-t border-[#173F35]/10 flex items-center justify-between text-[10px] font-mono text-[#717975]">
                    <span>↑↓ navigate • ↵ select • esc close</span>
                    <span className="text-[#173F35] font-semibold">ARTHAX Equities Exchange</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: DvP Clearing Pill + Mask Toggle + Trader Profile + Cross-Portal Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* DvP Clearing Pool Balance Pill with Click-to-Reveal */}
            <div className="flex items-center gap-2 sm:gap-2.5 bg-[#A8742A]/10 border border-[#A8742A]/25 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-xs">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#A8742A]/20 flex items-center justify-center text-[#A8742A]">
                <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] font-bold text-[#A8742A] uppercase leading-none font-mono">
                  DvP Clearing Pool
                </span>
                <div className="font-mono font-bold text-[11px] sm:text-xs text-[#1A1C18] flex items-baseline gap-1">
                  <AnimatedMaskedValue value={38450.00} isMasked={activeMasked} maskString="••••••" />
                  <span className="text-[#A8742A] font-semibold text-[10px] sm:text-[11px]">ARTH</span>
                </div>
              </div>

              {/* Mask Eye Button */}
              <button
                type="button"
                onClick={toggleMask}
                className="ml-0.5 sm:ml-1 p-1 rounded-md text-[#717975] hover:text-[#173F35] hover:bg-white/60 transition cursor-pointer"
                title={activeMasked ? "Reveal balance" : "Mask balance"}
              >
                {activeMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="h-6 sm:h-7 w-[1px] bg-[#173F35]/10 hidden sm:block"></div>

            {/* Trader Identity Profile */}
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="flex flex-col text-right">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-xs font-semibold text-[#1A1C18]">{activePersona.displayName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2F7468]" />
                </div>
                <span className="text-[10px] text-[#717975] font-mono">{activePersona.govIdNumber}</span>
              </div>
              <div className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-[#173F35] text-white flex items-center justify-center font-serif text-xs font-bold border border-[#2F7468]/30">
                {activePersona.displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>

            <div className="h-6 sm:h-7 w-[1px] bg-[#173F35]/10 hidden md:block"></div>

            {/* Cross-Portal Quick Switcher Button */}
            <button 
              type="button"
              onClick={() => setIsSwitcherModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#173F35]/10 hover:bg-[#173F35]/20 text-[#173F35] font-sans text-xs font-semibold transition-colors cursor-pointer border border-[#173F35]/20"
              title="Open Universal Cross-Portal Switchboard (Alt+P)"
            >
              <Layers className="w-3.5 h-3.5 text-[#A8742A]" />
              <span>Switchboard (Alt+P)</span>
            </button>
          </div>
        </div>

        {/* Secondary Horizontal Navigation Tabs */}
        <div className="w-full bg-[#FAF9F5]/70 backdrop-blur-md border-t border-[#173F35]/10 px-3.5 sm:px-6 rounded-b-2xl">
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1.5 text-xs">
            {navItems.map((item) => {
              const active = isTabActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[#173F35] text-white font-semibold shadow-xs'
                      : 'text-[#4A534F] hover:text-[#173F35] hover:bg-white/80'
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-white text-[#717975] border border-[#173F35]/10'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.dot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Universal Cross-Portal Switchboard Modal */}
      <UniversalPortalSwitcherModal
        isOpen={isSwitcherModalOpen}
        onClose={() => setIsSwitcherModalOpen(false)}
      />
    </div>
  );
};
