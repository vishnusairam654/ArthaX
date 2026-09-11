'use client';

import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Globe, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ActiveSession {
  id: string;
  device: string;
  client: string;
  ip: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
  tokenLeaf: string;
  portalsBound: string[];
}

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-node-01',
    device: 'Windows 11 Workstation',
    client: 'Chrome 124.0 • Sovereign Web',
    ip: '103.21.244.18',
    location: 'Mumbai, MH, IN',
    isCurrent: true,
    lastActive: 'Active Now',
    tokenLeaf: '0x9a8f10b2...4e12',
    portalsBound: ['User Cockpit', 'Bank Portal', 'Stock Terminal', 'Shop Vault']
  },
  {
    id: 'sess-node-02',
    device: 'Apple iPhone 16 Pro',
    client: 'ARTHAX Citizen Native Enclave v2.4',
    ip: '103.21.244.18',
    location: 'Mumbai, MH, IN',
    isCurrent: false,
    lastActive: '18 minutes ago',
    tokenLeaf: '0x71dc553a...b39a',
    portalsBound: ['User Cockpit', 'Shop Vault']
  },
  {
    id: 'sess-node-03',
    device: 'MacBook Pro 16" M3',
    client: 'Safari 17.4 • Enterprise Node',
    ip: '49.36.128.91',
    location: 'Bengaluru, KA, IN',
    isCurrent: false,
    lastActive: '2 days ago',
    tokenLeaf: '0x33b879ef...9811',
    portalsBound: ['User Cockpit', 'Bank Portal', 'Stock Terminal']
  }
];

interface ActiveSessionsAndAuditTableProps {
  onNotify: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ActiveSessionsAndAuditTable: React.FC<ActiveSessionsAndAuditTableProps> = ({ onNotify }) => {
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const handleTerminateSession = (id: string, device: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    onNotify(`Session terminated on ${device}. Cryptographic token invalidated.`, 'info');
  };

  const handleRevokeAllOther = () => {
    setIsRevokingAll(true);
    setTimeout(() => {
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setIsRevokingAll(false);
      onNotify('All remote sessions revoked. Session salt rotated across all 4 portals.', 'success');
    }, 1000);
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#022448]">
              Active Sessions &amp; Node Authorizations
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#EEF4FF] text-[#1E3A5F] border border-[#74777F]/20 font-semibold">
              Unified Single Session
            </span>
          </div>
          <p className="font-sans text-xs md:text-sm text-[#43474E]">
            All authenticated devices accessing your sovereign citizen profile. Terminating a session revokes access across User, Bank, Stocks, and Shop portals.
          </p>
        </div>

        {sessions.length > 1 && (
          <button
            onClick={handleRevokeAllOther}
            disabled={isRevokingAll}
            className="px-4 py-2 rounded-xl bg-[#EEF4FF] hover:bg-[#ffdad6] text-[#ba1a1a] text-xs font-sans font-semibold transition border border-[#ba1a1a]/20 flex items-center gap-1.5 shrink-0 disabled:opacity-60 shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isRevokingAll ? 'Revoking Tokens...' : 'Revoke All Other Sessions'}</span>
          </button>
        )}
      </div>

      {/* Session Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
              session.isCurrent
                ? 'bg-white border-[#1E3A5F]/40 ring-1 ring-[#1E3A5F]/20'
                : 'bg-white border-[#74777F]/20 hover:border-[#74777F]/40'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    session.isCurrent ? 'bg-[#1E3A5F] text-white' : 'bg-[#EEF4FF] text-[#1E3A5F]'
                  }`}>
                    {session.device.includes('iPhone') ? (
                      <Smartphone className="w-4 h-4" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#022448]">
                      {session.device}
                    </h4>
                    <span className="font-sans text-[11px] text-[#74777F]">
                      {session.client}
                    </span>
                  </div>
                </div>

                {session.isCurrent && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#A8F5BF]/60 text-[#002110] font-bold">
                    THIS DEVICE
                  </span>
                )}
              </div>

              {/* Node Details */}
              <div className="space-y-1.5 text-xs font-mono bg-[#F8F9FF] p-3 rounded-xl border border-[#74777F]/15">
                <div className="flex items-center justify-between text-[#43474E]">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#74777F]" />
                    IP Address:
                  </span>
                  <strong className="text-[#121C28]">{session.ip}</strong>
                </div>
                <div className="flex items-center justify-between text-[#43474E]">
                  <span>Location:</span>
                  <strong className="text-[#121C28]">{session.location}</strong>
                </div>
                <div className="flex items-center justify-between text-[#43474E]">
                  <span>Token Leaf:</span>
                  <span className="text-[#1E3A5F] font-semibold">{session.tokenLeaf}</span>
                </div>
              </div>

              {/* Bound Portals */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#74777F] uppercase tracking-wider">
                  Bound Portals:
                </span>
                <div className="flex flex-wrap gap-1">
                  {session.portalsBound.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#EEF4FF] text-[#1E3A5F]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#74777F]/15 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#74777F] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {session.lastActive}
              </span>

              {!session.isCurrent && (
                <button
                  onClick={() => handleTerminateSession(session.id, session.device)}
                  className="px-3 py-1 rounded-lg text-xs font-sans text-[#BA1A1A] hover:bg-[#FFDAD6] transition flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Terminate</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
