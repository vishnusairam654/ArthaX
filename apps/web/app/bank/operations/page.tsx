'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Inbox,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  User,
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RotateCw,
  XCircle,
} from 'lucide-react';
import {
  MOCK_OPERATIONS,
  getPriorityColor,
  OperationPriority,
  OperationType,
  OperationItem,
} from '@/components/bank/BankMockData';

export default function OperationsPage() {
  const [items, setItems] = useState<OperationItem[]>(MOCK_OPERATIONS);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.customerName && item.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesPriority && matchesType && matchesSearch;
    });
  }, [items, priorityFilter, typeFilter, searchQuery]);

  const handleResolve = (id: string, actionName: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActionNotice(`Operation item ${id} was ${actionName}. Audit logged.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const criticalCount = items.filter((i) => i.priority === 'Critical').length;
  const highCount = items.filter((i) => i.priority === 'High').length;
  const pendingCount = items.filter((i) => i.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Operations Work Queue</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Pending institutional tasks, approval workflows, KYC reviews, and settlement exceptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B3278]/10 text-[#3B3278] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Queue • {items.length} Active Tasks
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Workload Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Pending Approvals</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">{pendingCount}</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Awaiting staff action</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Critical Priority</span>
          <div className="font-mono text-xl font-bold text-[#B5482E] mt-1">{criticalCount}</div>
          <div className="text-[11px] text-[#B5482E] mt-0.5">Requires immediate action</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">High Priority</span>
          <div className="font-mono text-xl font-bold text-[#A8742A] mt-1">{highCount}</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">SLAs expiring soon</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Avg Resolution Time</span>
          <div className="font-mono text-xl font-bold text-emerald-600 mt-1">18 mins</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Within compliance target</div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#3B3278]/10 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority selector */}
          <div className="flex items-center gap-1 p-1 bg-[#FAFAFF] border border-[#3B3278]/10 rounded-xl">
            {['all', 'Critical', 'High', 'Normal', 'Low'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-[#3B3278] text-white shadow-xs'
                    : 'text-[#74777F] hover:text-[#3B3278]'
                }`}
              >
                {p === 'all' ? 'All Priorities' : p}
              </button>
            ))}
          </div>

          {/* Type selector */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAFAFF] border border-[#3B3278]/15 rounded-xl text-xs font-semibold text-[#1C1736] outline-none cursor-pointer"
          >
            <option value="all">All Task Types</option>
            <option value="Loan Approval">Loan Approval</option>
            <option value="Transaction Exception">Transaction Exception</option>
            <option value="KYC Review">KYC Review</option>
            <option value="FD Processing">FD Processing</option>
            <option value="Customer Request">Customer Request</option>
            <option value="Limit Change">Limit Change</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, refs..."
            className="pl-9 pr-3 py-1.5 bg-[#FAFAFF] border border-[#3B3278]/15 rounded-xl text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-64"
          />
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-12 text-center shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#1C1736]">Queue Clear</h3>
            <p className="text-xs text-[#74777F] mt-1">
              No operational items matching your filter criteria.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const pc = getPriorityColor(item.priority);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-[#3B3278]/30 transition"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${pc.bg} ${pc.text}`}>
                      {item.priority} Priority
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#3B3278]/8 text-[#3B3278] text-[11px] font-mono font-bold">
                      {item.type}
                    </span>
                    <span className="font-mono text-xs text-[#74777F]">{item.id}</span>
                    <span className="text-[11px] text-[#74777F] font-mono">• {item.createdAt}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#1C1736]">{item.title}</h3>
                  <p className="text-xs text-[#74777F] leading-relaxed max-w-3xl">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#74777F] font-mono pt-1">
                    {item.customerName && (
                      <span>
                        Customer:{' '}
                        <strong className="text-[#1C1736] font-sans">{item.customerName}</strong>
                      </span>
                    )}
                    <span>
                      Ref ID: <strong className="text-[#3B3278]">{item.referenceId}</strong>
                    </span>
                    <span>
                      Assignee: <strong className="text-[#1C1736] font-sans">{item.assignee}</strong>
                    </span>
                  </div>
                </div>

                {/* Queue Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center">
                  <button
                    onClick={() => handleResolve(item.id, 'approved')}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#3B3278] text-white hover:bg-[#2D2654] text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleResolve(item.id, 'dismissed')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#74777F] hover:text-[#1C1736] text-xs font-bold transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
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
