'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Lock,
} from 'lucide-react';
import {
  MOCK_AUDIT_LOG,
  AuditEntry,
  AuditActionType,
} from '@/components/bank/BankMockData';

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const actionTypes = [
    'all',
    'Admin Action',
    'Account Change',
    'Transaction Action',
    'Loan Decision',
    'FD Action',
    'Login/Session',
    'Config Change',
    'Security Event',
  ];

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOG.filter((entry) => {
      const matchesActionType =
        actionTypeFilter === 'all' || entry.actionType === actionTypeFilter;
      const matchesSeverity =
        severityFilter === 'all' || entry.severity === severityFilter;
      const matchesSearch =
        !searchQuery ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.sessionRef.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesActionType && matchesSeverity && matchesSearch;
    });
  }, [actionTypeFilter, severityFilter, searchQuery]);

  const getSeverityBadge = (severity: 'Info' | 'Warning' | 'Critical') => {
    switch (severity) {
      case 'Critical':
        return 'bg-[#B5482E]/10 text-[#B5482E] border-[#B5482E]/20';
      case 'Warning':
        return 'bg-[#A8742A]/10 text-[#A8742A] border-[#A8742A]/20';
      case 'Info':
        return 'bg-[#3B3278]/10 text-[#3B3278] border-[#3B3278]/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Operational Audit Trail</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Immutable journal of staff actions, security events, underwriting decisions, and config revisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#3B3278]/15 hover:bg-[#FAFAFF] text-[#3B3278] text-xs font-bold shadow-xs transition cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Compliance Log</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Logged Events</span>
          <div className="font-mono text-xl font-bold text-[#1C1736] mt-1">{MOCK_AUDIT_LOG.length}</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Cryptographically signed</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Security Incidents</span>
          <div className="font-mono text-xl font-bold text-[#B5482E] mt-1">
            {MOCK_AUDIT_LOG.filter((l) => l.severity === 'Critical').length} Event
          </div>
          <div className="text-[11px] text-[#B5482E] mt-0.5">Requires audit sign-off</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Operational Warnings</span>
          <div className="font-mono text-xl font-bold text-[#A8742A] mt-1">
            {MOCK_AUDIT_LOG.filter((l) => l.severity === 'Warning').length}
          </div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Review items flagged</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#3B3278]/10 p-4 shadow-xs">
          <span className="text-xs text-[#74777F] font-medium">Retention Policy</span>
          <div className="font-mono text-xl font-bold text-[#3B3278] mt-1">7 Years</div>
          <div className="text-[11px] text-[#74777F] mt-0.5">Basel III compliance</div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl border border-[#3B3278]/10 shadow-xs overflow-hidden">
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-[#3B3278]/8 bg-[#FAFAFF] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-xl text-xs font-semibold text-[#1C1736] outline-none cursor-pointer"
            >
              {actionTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Action Types' : type}
                </option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-xl text-xs font-semibold text-[#1C1736] outline-none cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit ID, staff, target, IP..."
              className="pl-9 pr-3 py-1.5 bg-white border border-[#3B3278]/15 rounded-lg text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFF] text-[#74777F] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#3B3278]/8">
              <tr>
                <th className="py-2.5 px-4">Audit ID</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Target</th>
                <th className="py-2.5 px-4">Operator / Staff</th>
                <th className="py-2.5 px-4">Delta (State Change)</th>
                <th className="py-2.5 px-4 text-center">Severity</th>
                <th className="py-2.5 px-4 font-mono text-right">Session / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3B3278]/6">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#FAFAFF] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#3B3278]">{entry.id}</td>
                  <td className="py-3 px-4 font-mono text-[#74777F]">{entry.timestamp}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#1C1736]">{entry.action}</div>
                    <span className="text-[10px] text-[#74777F] font-mono">{entry.actionType}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="text-[#1C1736] font-bold">{entry.targetId}</span>
                    <span className="text-[10px] text-[#74777F] ml-1">({entry.targetType})</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#1C1736]">{entry.staffName}</div>
                    <div className="text-[10px] font-mono text-[#74777F]">{entry.staffId}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {entry.beforeValue && entry.afterValue ? (
                      <div>
                        <span className="text-[#B5482E] line-through mr-1">{entry.beforeValue}</span>
                        <span className="text-emerald-700 font-bold">{entry.afterValue}</span>
                      </div>
                    ) : (
                      <span className="text-[#74777F]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getSeverityBadge(
                        entry.severity
                      )}`}
                    >
                      {entry.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[10px] text-[#74777F]">
                    <div>{entry.sessionRef}</div>
                    <div>{entry.ipAddress}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
