'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ServerCog,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  KeyRound,
  Lock,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Cpu,
  Layers,
} from 'lucide-react';
import {
  MOCK_SYSTEM_NODES,
  MOCK_CENTRAL_BANK_SETTINGS,
  SystemServiceNode,
} from '@/components/central-bank/CentralBankMockData';
import { EmergencyCircuitBreakerModal } from '@/components/central-bank/EmergencyCircuitBreakerModal';

export default function CentralBankSecurityPage() {
  const [nodes, setNodes] = useState<SystemServiceNode[]>(MOCK_SYSTEM_NODES);
  const [isBreakerActive, setIsBreakerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleToggleBreaker = (reason: string, authCode: string) => {
    setIsBreakerActive(!isBreakerActive);
    setNotification(
      isBreakerActive
        ? 'Emergency circuit breaker deactivated. Standard CLS clearing resumed.'
        : `EMERGENCY CIRCUIT BREAKER ACTIVATED: "${reason}". Logged under Governor PIN.`
    );
    setTimeout(() => setNotification(null), 6000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#946726]/15 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#946726]/10 text-[#946726] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#946726]/20">
              INFRASTRUCTURE SURVEILLANCE
            </span>
            <span className="text-[11px] text-emerald-700 font-mono font-bold">
              • HARDWARE SECURITY MODULE: ACTIVE
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#2A2012] mt-1">
            System Infrastructure &amp; Cryptographic Security
          </h1>
          <p className="text-xs sm:text-sm text-[#5C574F] mt-0.5 max-w-2xl leading-relaxed">
            Continuous operational monitoring of Core Ledger sequencers, CLS clearing nodes, air-gapped HSM keyrings, and central sovereign circuit breakers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>FIPS-140-3 Level 4</span>
          </span>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 border font-mono animate-in fade-in ${
            isBreakerActive
              ? 'bg-red-50 border-[#B5482E]/30 text-[#B5482E]'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Emergency Circuit Breaker Master Control Panel (User Change #4) */}
      <div
        className={`p-6 rounded-3xl border-2 transition-all shadow-md ${
          isBreakerActive
            ? 'bg-red-50/70 border-[#B5482E]'
            : 'bg-white border-[#946726]/20'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isBreakerActive
                    ? 'bg-[#B5482E] text-white'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {isBreakerActive ? 'EMERGENCY HALT ENGAGED' : 'NORMAL CLEARING OPERATION'}
              </span>
              <span className="text-[11px] font-mono text-[#74777F]">
                Sovereign Charter Act 14 Protocol
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl text-[#2A2012]">
              Network-Wide Emergency Circuit Breaker
            </h2>
            <p className="text-xs text-[#5C574F] max-w-2xl leading-relaxed">
              Instantly halts all non-critical inter-bank CLS settlements and equities trading across the sovereign domain. Requires mandatory statutory justification, Governor elevated PIN authorization, and synchronous audit logging.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-mono text-xs font-bold transition shadow-md cursor-pointer shrink-0 ${
              isBreakerActive
                ? 'bg-[#946726] hover:bg-[#2A2012] text-white'
                : 'bg-[#B5482E] hover:bg-[#9B3C25] text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>
              {isBreakerActive ? 'Rescind Circuit Breaker' : 'Engage Emergency Halt'}
            </span>
          </button>
        </div>
      </div>

      {/* Infrastructure Nodes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#2A2012] flex items-center gap-2">
            <ServerCog className="w-4 h-4 text-[#946726]" />
            <span>Sovereign Consensus &amp; Service Nodes</span>
          </h2>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            5 / 5 Clusters Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="bg-white rounded-3xl border border-[#946726]/15 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] text-[#74777F] uppercase">
                    {node.id}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {node.status}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-[#2A2012]">
                  {node.name}
                </h3>
                <p className="text-xs text-[#5C574F] leading-snug">
                  {node.role}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-[#F6F8F7] rounded-xl">
                  <span className="text-[9px] text-[#74777F] block uppercase">Latency</span>
                  <strong className="text-[#946726]">{node.latencyMs} ms</strong>
                </div>
                <div className="p-2 bg-[#F6F8F7] rounded-xl">
                  <span className="text-[9px] text-[#74777F] block uppercase">Uptime</span>
                  <strong className="text-emerald-700">{node.uptimePercent}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Administrative Sessions */}
      <div className="bg-white rounded-3xl border border-[#946726]/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2A2012] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#946726]" />
              <span>Active High-Privilege Administrative Sessions</span>
            </h3>
            <p className="text-xs text-[#5C574F]">
              Authenticated Governor, Chief Auditor, and automated system nodes currently connected
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#946726] bg-[#946726]/5 px-2.5 py-1 rounded-lg border border-[#946726]/15">
            IP Whitelist Enforced
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {MOCK_CENTRAL_BANK_SETTINGS.activeAdminSessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#946726]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-[#2A2012] font-sans text-xs">{sess.adminName}</strong>
                  <span className="px-2 py-0.5 rounded-md bg-[#946726]/8 text-[#946726] text-[10px] font-bold">
                    {sess.role}
                  </span>
                </div>
                <div className="text-[10px] text-[#74777F] flex flex-wrap gap-3">
                  <span>Session: <strong>{sess.id}</strong></span>
                  <span>IP: <strong>{sess.ip}</strong></span>
                  <span>Connected: <strong>{sess.connectedSince}</strong></span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  {sess.device}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyCircuitBreakerModal
        isOpen={isModalOpen}
        isBreakerActive={isBreakerActive}
        onClose={() => setIsModalOpen(false)}
        onToggleBreaker={handleToggleBreaker}
      />

    </div>
  );
}
