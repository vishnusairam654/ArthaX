'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import {
  MOCK_NOTIFICATIONS,
  getPriorityColor,
  BankNotification,
  NotificationCategory,
} from '@/components/bank/BankMockData';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<BankNotification[]>(MOCK_NOTIFICATIONS);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);

  const categories = [
    'all',
    'Settlement',
    'Loan',
    'FD',
    'Transaction',
    'Central Bank',
    'Customer',
    'Security',
    'System',
  ];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;
      const matchesUnread = !unreadOnly || !n.isRead;
      return matchesCategory && matchesUnread;
    });
  }, [notifications, categoryFilter, unreadOnly]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Alerts &amp; Notifications</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Real-time compliance alerts, settlement exceptions, and system telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#3B3278]/20 bg-white hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#3B3278]/10 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#3B3278] text-white shadow-xs'
                  : 'text-[#74777F] hover:text-[#3B3278] hover:bg-[#3B3278]/5'
              }`}
            >
              {cat === 'all' ? 'All Alerts' : cat}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-[#1C1736] font-semibold cursor-pointer select-none">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="w-4 h-4 rounded text-[#3B3278] border-[#3B3278]/30 focus:ring-[#3B3278] cursor-pointer"
          />
          <span>Unread Only ({unreadCount})</span>
        </label>
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-12 text-center shadow-xs">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#1C1736]">No Notifications</h3>
            <p className="text-xs text-[#74777F] mt-1">
              You are completely caught up on all alerts and notices.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const pc = getPriorityColor(notif.priority);
            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.isRead
                    ? 'border-[#3B3278]/30 bg-[#FAF9FF]'
                    : 'border-[#3B3278]/10 opacity-90'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#3B3278]" />
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${pc.bg} ${pc.text}`}>
                      {notif.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#3B3278]/8 text-[#3B3278] text-[11px] font-mono font-bold">
                      {notif.category}
                    </span>
                    <span className="text-[11px] text-[#74777F] font-mono">{notif.timestamp}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#1C1736]">
                    {notif.title}
                  </h3>
                  <p className="text-xs text-[#74777F] leading-relaxed max-w-3xl">
                    {notif.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(notif.id)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-[#74777F] hover:text-[#1C1736] transition cursor-pointer"
                  >
                    {notif.isRead ? 'Mark Unread' : 'Mark as Read'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
