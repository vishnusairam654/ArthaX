'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { MailboxFilterBar } from '@/components/user/mailbox/MailboxFilterBar';
import { PriorityDispatchHero } from '@/components/user/mailbox/PriorityDispatchHero';
import { DispatchFeedList, MailNoticeItem } from '@/components/user/mailbox/DispatchFeedList';
import { NoticeDocumentViewer } from '@/components/user/mailbox/NoticeDocumentViewer';
import { ShieldCheck, Cpu, Database, Landmark, RefreshCw } from 'lucide-react';
import {
  apiFetchMailbox,
  apiMarkNotificationRead,
  apiMarkAllNotificationsRead,
  apiArchiveNotification,
} from '@/lib/api';
import { NotificationDto } from '@arthax/types';

const INITIAL_NOTICES: MailNoticeItem[] = [
  {
    id: 'notice-cbn-2025-04b',
    category: 'central-bank',
    sender: 'Central Bank Monetary Auth.',
    senderBadge: 'CB',
    tag: 'Unread • Directive',
    tagType: 'danger',
    title: 'Sovereign Directive #2025-04B: Reserve Adjustment',
    preview:
      'Tier-1 citizen accounts holding multi-bank fixed deposits in Samaya Bank & Sthira Bank will receive an automated +0.15% APY...',
    timestamp: 'Today, 11:42 UTC',
    ref: 'Ref: CBN-8491',
    isUnread: true,
  },
  {
    id: 'notice-setu-dvp-98214',
    category: 'dvp',
    sender: 'SETU Depository & Settlement',
    senderBadge: 'ST',
    tag: 'DvP Finality',
    tagType: 'success',
    title: 'Atomic DvP Settlement Receipt #SETU-98214',
    preview:
      'Execution confirmed: 500 NILA Systems Shs credited at 142.50 ARTH. Sovereign zero-fee applied via companion enclave.',
    timestamp: 'Today, 09:15 UTC',
    ref: 'ISO 20022 Verified',
    isUnread: false,
  },
  {
    id: 'notice-nava-payroll-4401',
    category: 'statements',
    sender: 'NAVA Commercial Bank',
    senderBadge: 'NB',
    tag: 'Statement',
    tagType: 'secondary',
    title: 'Monthly Sovereign Payroll Ledger & Interest Sweep',
    preview:
      '38,450.00 ARTH stasis balance audited. Yield distributed directly into Tier-1 liquidity reserve.',
    timestamp: 'Yesterday, 18:30 UTC',
    ref: 'Batch #NY-4401',
    isUnread: true,
  },
  {
    id: 'notice-sthira-fd-9941',
    category: 'statements',
    sender: 'Sthira Bank Corp',
    senderBadge: 'SB',
    tag: 'Fixed Deposit',
    tagType: 'neutral',
    title: 'FD Certificate #FD-9941 Maturity Schedule Confirmation',
    preview:
      'Your 6-month Term Reserve certificate reaches maturity in 45 days. Auto-rollover option currently active.',
    timestamp: 'Mar 24, 2025',
    ref: 'Cert #FD-9941',
    isUnread: false,
  },
  {
    id: 'notice-security-sentinel-4',
    category: 'security',
    sender: 'Security Sentinel',
    senderBadge: 'shield',
    tag: 'Audit',
    tagType: 'neutral',
    title: 'Hardware Key Auth Verified: WebAuthn Token #3',
    preview:
      'Session successfully elevated from IP 142.250.190.46 via HSM FIPS 140-3 cryptographic assertion.',
    timestamp: 'Mar 22, 2025',
    ref: 'Sentinel #4',
    isUnread: false,
  },
];

function mapNotificationToNoticeItem(n: NotificationDto): MailNoticeItem {
  let category: MailNoticeItem['category'] = 'statements';
  let sender = 'ARTHAX Sovereign Network';
  let senderBadge = 'AX';
  let tag = `${n.category} Notice`;
  let tagType: MailNoticeItem['tagType'] = 'secondary';

  if (n.category === 'POLICY' || n.sourceDomain === 'CENTRAL_BANK') {
    category = 'central-bank';
    sender = 'Central Bank Monetary Auth.';
    senderBadge = 'CB';
    tag = n.priority === 'URGENT' || n.priority === 'HIGH' ? 'Directive' : 'Policy Notice';
    tagType = 'danger';
  } else if (n.category === 'SETTLEMENT' || n.sourceDomain === 'CLS') {
    category = 'dvp';
    sender = 'SETU Depository & Settlement';
    senderBadge = 'ST';
    tag = 'DvP Finality';
    tagType = 'success';
  } else if (n.category === 'SECURITY' || n.sourceDomain === 'SECURITY') {
    category = 'security';
    sender = 'Security Sentinel';
    senderBadge = 'shield';
    tag = 'Security Audit';
    tagType = 'neutral';
  } else if (n.category === 'STOCK' || n.sourceDomain === 'STOCKS') {
    category = 'dvp';
    sender = 'Sovereign Equities Exchange';
    senderBadge = 'EQ';
    tag = 'Trade Executed';
    tagType = 'success';
  } else if (n.category === 'SHOP' || n.sourceDomain === 'SHOP') {
    category = 'statements';
    sender = 'Sovereign Emporium';
    senderBadge = 'SH';
    tag = 'Vault Receipt';
    tagType = 'secondary';
  } else if (n.category === 'TRANSFER' || n.sourceDomain === 'BANKING') {
    category = 'statements';
    sender = (n.metadata as any)?.sourceBank
      ? `${(n.metadata as any).sourceBank} Commercial Bank`
      : 'Commercial Banking';
    senderBadge = 'NB';
    tag = n.sourceType === 'TRANSFER_RECEIVED' ? 'Credit Notice' : 'Debit Notice';
    tagType = 'secondary';
  }

  return {
    id: n.id,
    category,
    sender,
    senderBadge,
    tag: n.isRead ? tag : `Unread • ${tag}`,
    tagType,
    title: n.title,
    preview: n.summary,
    timestamp: new Date(n.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    ref: `Ref: ${n.sourceId.slice(0, 16)}`,
    isUnread: !n.isRead,
  };
}

export default function MailboxPage() {
  const [isMasked, setIsMasked] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNoticeId, setSelectedNoticeId] = useState('notice-setu-dvp-98214');
  const [notices, setNotices] = useState<MailNoticeItem[]>(INITIAL_NOTICES);
  const [apiNotices, setApiNotices] = useState<NotificationDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load authoritative mailbox from API Gateway
  const loadMailbox = useCallback(async () => {
    setIsLoading(true);
    try {
      const summary = await apiFetchMailbox();
      if (summary && summary.items && summary.items.length > 0) {
        setApiNotices(summary.items);
        const mapped = summary.items.map(mapNotificationToNoticeItem);
        setNotices(mapped);
        if (mapped.length > 0 && !mapped.some((m) => m.id === selectedNoticeId)) {
          setSelectedNoticeId(mapped[0].id);
        }
      }
    } catch {
      // Retain fallback initial notices
    } finally {
      setIsLoading(false);
    }
  }, [selectedNoticeId]);

  useEffect(() => {
    loadMailbox();
  }, [loadMailbox]);

  const handleMarkAllRead = async () => {
    setNotices((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    setApiNotices((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await apiMarkAllNotificationsRead();
    } catch {
      // Fallback
    }
  };

  const handleSelectNotice = async (id: string) => {
    setSelectedNoticeId(id);
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
    setApiNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await apiMarkNotificationRead(id);
    } catch {
      // Fallback
    }
  };

  const handleArchiveNotice = async (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    setApiNotices((prev) => prev.filter((n) => n.id !== id));
    try {
      await apiArchiveNotification(id);
    } catch {
      // Fallback
    }
  };

  // Find currently selected notice object
  const activeNotice = useMemo(() => {
    return apiNotices.find((n) => n.id === selectedNoticeId) || null;
  }, [apiNotices, selectedNoticeId]);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      if (selectedCategory !== 'all' && notice.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          notice.title.toLowerCase().includes(q) ||
          notice.sender.toLowerCase().includes(q) ||
          notice.ref.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notices, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#121C28] flex flex-col font-sans">
      {/* Sovereign Portal Header */}
      <UserPortalHeader
        isMasked={isMasked}
        onToggleMask={() => setIsMasked((prev) => !prev)}
        activeTab="mailbox"
      />

      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Priority Dispatch Hero Banner */}
          <PriorityDispatchHero
            onViewMemo={() => {
              const directive = notices.find((n) => n.category === 'central-bank');
              if (directive) {
                handleSelectNotice(directive.id);
              } else {
                setSelectedNoticeId('notice-cbn-2025-04b');
              }
            }}
          />

          {/* Sub-Navigation Filter & Mailbox Controls */}
          <MailboxFilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onMarkAllRead={handleMarkAllRead}
          />

          {/* Master-Detail Split Grid or Authentic Empty State */}
          {filteredNotices.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Dispatch Feed Stream (5 cols) */}
              <div className="lg:col-span-5">
                <DispatchFeedList
                  notices={filteredNotices}
                  selectedId={selectedNoticeId}
                  onSelectNotice={handleSelectNotice}
                />
              </div>

              {/* Right Column: Full Document Detail Viewer (7 cols) */}
              <div className="lg:col-span-7">
                <NoticeDocumentViewer
                  selectedId={selectedNoticeId}
                  isMasked={isMasked}
                  activeNotice={activeNotice}
                  onArchive={handleArchiveNotice}
                />
              </div>
            </div>
          ) : (
            /* Authentic Empty State using /assets/illustrations/empty_mailbox.png */
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-[#74777F]/20 space-y-4 shadow-xs">
              <div className="w-48 h-48 relative">
                <Image
                  src="/assets/illustrations/empty_mailbox.png"
                  alt="Empty Mailbox"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="font-serif text-xl text-[#022448] font-medium">
                  Sovereign Mailbox Clear
                </h3>
                <p className="font-sans text-xs text-[#43474E] leading-relaxed">
                  No active notices match your current filter parameters. All institutional directives, clearing receipts, and audit logs have been reconciled.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                  loadMailbox();
                }}
                className="px-4 py-2 rounded-full bg-[#1E3A5F] text-white font-sans text-xs font-semibold hover:bg-[#022448] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Mailbox Filters</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Sovereign Multi-Column Institutional Footer */}
      <footer className="w-full bg-[#F2EFE7] mt-16 pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-t border-[#74777F]/20">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[#43474E]">
            <div className="space-y-3">
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#022448]" />
                <span>Ledger Integrity</span>
              </div>
              <p className="font-sans text-xs leading-relaxed text-[#43474E]">
                Directly coupled with SETU Central Settlement. Real-time stasis balancing across tier-1 multi-bank reserves ensuring 1:1 sovereign parity backing.
              </p>
              <div className="font-mono text-[11px] text-[#1E3A5F]">
                STATE ROOT: 0x48A0...9B72
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#022448]" />
                <span>Settlement Protocol</span>
              </div>
              <ul className="font-sans text-xs space-y-1.5 text-[#43474E]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Continuous Linked Settlement (CLS)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  ISO 20022 Financial Messaging
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Delivery vs Payment (DvP) Real-time
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#022448]" />
                <span>Security Architecture</span>
              </div>
              <p className="font-sans text-xs leading-relaxed text-[#43474E]">
                Multi-party computation (MPC) and Hardware Security Module (HSM) FIPS 140-3 Level 4 enclaves secure biometric authorizations and key issuance.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-medium">
                Biometric Enclave: ACTIVE &amp; ARMED
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-serif text-sm font-semibold text-[#022448] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#022448]" />
                <span>Node Authority</span>
              </div>
              <div className="font-mono text-xs space-y-1 text-[#43474E]">
                <div>ROOT NODE CERT: <strong className="text-[#121C28]">#8491-X</strong></div>
                <div>VALIDATOR SET: 12 SOVEREIGN INSTITUTIONS</div>
                <div>EPOCH FREQUENCY: 300 SECONDS</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#74777F]/15 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-[#74777F]">
            <div>© 2025 ARTHAX Sovereign Financial System. Immutable Archival Depository Ledger.</div>
            <div className="flex items-center gap-2 text-[#022448]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CLS SETTLEMENT ENGINE SYNCED • UTC 14:48:02 • BLOCK HEIGHT 28,102,510</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
