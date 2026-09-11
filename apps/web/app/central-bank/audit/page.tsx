'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  Eye,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  ChevronRight,
  X,
  FileCheck2,
} from 'lucide-react';
import {
  MOCK_AUDIT_LOGS,
  AuditLogItem,
  AuditSeverity,
} from '@/components/central-bank/CentralBankMockData';

export default function AuditCompliancePage() {
  const [logs, setLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchesSev = severityFilter === 'all' || l.severity === severityFilter;
    const matchesType = eventTypeFilter === 'all' || l.eventType === eventTypeFilter;
    const matchesSearch =
      !searchQuery ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesType && matchesSearch;
  });

  const getSeverityBadge = (sev: AuditSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-100 text-[#B5482E] border-red-300';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'NOTICE':
        return 'bg-blue-100 text-[#946726] border-blue-300';
      case 'INFO':
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              APPEND-ONLY FORENSIC AUDIT
            </span>
            <span className="text-[11px] text-emerald-700 font-mono font-bold">
              • ZERO MUTATION INVARIANT
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            Audit &amp; Regulatory Compliance Register
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            The sovereign system&apos;s ultimate authoritative record. Captures administrative state modifications, settlement overrides, policy activations, and security alerts with full before/after state diffs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit Journal: Tamper-Evident</span>
          </span>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#946726]/15 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity filter */}
          {['all', 'CRITICAL', 'WARNING', 'NOTICE', 'INFO'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                severityFilter === s
                  ? 'bg-[#946726] text-white shadow-xs'
                  : 'text-[#5C574F] hover:text-[#946726] bg-[#F6F8F7]'
              }`}
            >
              {s === 'all' ? 'All Severities' : s}
            </button>
          ))}

          <span className="text-gray-300 hidden sm:inline">|</span>

          {/* Event Type filter */}
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs font-semibold text-[#2A2012] outline-none cursor-pointer"
          >
            <option value="all">All Event Types</option>
            <option value="POLICY_CHANGE">POLICY_CHANGE</option>
            <option value="BANK_ACTION">BANK_ACTION</option>
            <option value="SETTLEMENT_OVERRIDE">SETTLEMENT_OVERRIDE</option>
            <option value="SECURITY_EVENT">SECURITY_EVENT</option>
            <option value="COMPLIANCE_NOTICE">COMPLIANCE_NOTICE</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, actor ID, target..."
            className="pl-9 pr-4 py-1.5 bg-[#F6F8F7] border border-[#946726]/15 rounded-xl text-xs outline-none focus:border-[#946726] focus:ring-2 focus:ring-[#946726]/15 w-full md:w-64"
          />
        </div>
      </div>

      {/* Audit Entries List */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-[#946726]/10 font-mono text-[10px] text-[#5C574F] uppercase tracking-wider">
              <tr>
                <th className="p-4">Entry / Timestamp</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Actor / Role</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Action Summary</th>
                <th className="p-4">Severity</th>
                <th className="p-4 text-right whitespace-nowrap min-w-[120px]">Diff Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-[#F6F8F7] transition">
                  <td className="p-4 font-mono">
                    <strong className="text-[#946726] block">{item.id}</strong>
                    <span className="text-[10px] text-[#74777F]">{item.timestamp}</span>
                  </td>

                  <td className="p-4 font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-[#946726]/8 text-[#946726] font-bold text-[10px]">
                      {item.eventType}
                    </span>
                  </td>

                  <td className="p-4 font-mono">
                    <strong className="text-[#2A2012] block">{item.actorId}</strong>
                    <span className="text-[10px] text-[#74777F]">{item.actorRole}</span>
                  </td>

                  <td className="p-4 font-mono text-xs font-bold text-[#2A2012]">
                    {item.targetEntity}
                  </td>

                  <td className="p-4 text-xs text-[#262320] max-w-md">
                    {item.action}
                  </td>

                  <td className="p-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] hover:bg-[#946726] text-[#7A5217] hover:text-white border border-[#D8C7A5] hover:border-[#946726] font-mono text-[11px] font-bold shadow-2xs hover:shadow-xs transition cursor-pointer active:scale-95"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Diff</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Before / After State Diff Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#946726]/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="p-6 bg-[#946726] text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-white/70 block">
                  FORENSIC STATE DIFF INSPECTOR
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  Audit Entry: {selectedLog.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-full text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans bg-[#FDFBF7] overflow-y-auto">
              
              {/* Metadata strip */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#946726]/15 font-mono text-[11px] grid grid-cols-2 gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] text-[#74777F] uppercase block">Acting Administrator</span>
                  <strong className="text-[#2A2012]">{selectedLog.actorId} ({selectedLog.actorRole})</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#74777F] uppercase block">Target Entity</span>
                  <strong className="text-[#2A2012]">{selectedLog.targetEntity}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#74777F] uppercase block">Network Location / IP</span>
                  <span className="text-[#5C574F]">{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#74777F] uppercase block">Session Signature</span>
                  <span className="text-[#5C574F] truncate block">{selectedLog.sessionHash}</span>
                </div>
              </div>

              {/* Action Description */}
              <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-gray-200">
                <span className="font-mono text-[10px] uppercase text-[#74777F] block">
                  Administrative Directive Description
                </span>
                <p className="text-xs text-[#262320] font-medium mt-0.5">
                  {selectedLog.action}
                </p>
              </div>

              {/* Before vs After JSON Diffs */}
              <div className="space-y-2 font-mono">
                <h4 className="font-serif font-bold text-sm text-[#2A2012]">
                  State Modification Verification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Before State */}
                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-[#B5482E] uppercase block">
                      Prior State (Before)
                    </span>
                    <pre className="text-[10px] text-red-950 p-2 bg-white/80 rounded-lg overflow-x-auto leading-relaxed border border-red-100">
                      {selectedLog.beforeState
                        ? JSON.stringify(selectedLog.beforeState, null, 2)
                        : '// No prior state recorded'}
                    </pre>
                  </div>

                  {/* After State */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Committed State (After)
                    </span>
                    <pre className="text-[10px] text-emerald-950 p-2 bg-white/80 rounded-lg overflow-x-auto leading-relaxed border border-emerald-100">
                      {selectedLog.afterState
                        ? JSON.stringify(selectedLog.afterState, null, 2)
                        : '// No state change recorded'}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl bg-[#946726] text-white text-xs font-bold cursor-pointer"
                >
                  Dismiss Inspector
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
