'use client';

import React, { useState } from 'react';
import { UserPortalHeader } from '@/components/user/UserPortalHeader';
import { UserPortalFooter } from '@/components/user/UserPortalFooter';
import { SecurityHeroBanner } from '@/components/user/security/SecurityHeroBanner';
import { DualCredentialSection } from '@/components/user/security/DualCredentialSection';
import { HardwareEnclaveAndMfaCard } from '@/components/user/security/HardwareEnclaveAndMfaCard';
import { ActiveSessionsAndAuditTable } from '@/components/user/security/ActiveSessionsAndAuditTable';
import { SecurityPreferencesAndThresholds } from '@/components/user/security/SecurityPreferencesAndThresholds';
import { EmergencyKillswitchDrawer } from '@/components/user/security/EmergencyKillswitchDrawer';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  Download, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export default function SecurityAndSettingsPage() {
  const [isMasked, setIsMasked] = useState(true);
  const [isKillswitchOpen, setIsKillswitchOpen] = useState(false);
  const [isStasisActive, setIsStasisActive] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] text-[#121C28]">
      {/* Sovereign User Portal Fixed Header */}
      <UserPortalHeader 
        isMasked={isMasked} 
        onToggleMask={() => setIsMasked(!isMasked)} 
        activeTab="security"
      />

      {/* Main Content Area: Proper pt-36 sm:pt-40 clearance for fixed header */}
      <main className="w-full pt-36 sm:pt-40 pb-16 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Top Hero Banner */}
        <SecurityHeroBanner 
          onOpenKillswitch={() => setIsKillswitchOpen(true)}
          onExportAuditProof={() => setIsAuditModalOpen(true)}
          isStasisActive={isStasisActive}
        />

        {/* Dual-Credential Isolation (Rule 16 Compliant) */}
        <DualCredentialSection onNotify={addNotification} />

        {/* Multi-Factor Authentication & Enclaves */}
        <HardwareEnclaveAndMfaCard onNotify={addNotification} />

        {/* Active Sessions & Node Authorizations */}
        <ActiveSessionsAndAuditTable onNotify={addNotification} />

        {/* Risk Thresholds & Privacy Policies */}
        <SecurityPreferencesAndThresholds onNotify={addNotification} />
        </div>
      </main>

      {/* Sovereign Emergency Killswitch Modal */}
      <EmergencyKillswitchDrawer
        isOpen={isKillswitchOpen}
        onClose={() => setIsKillswitchOpen(false)}
        isStasisActive={isStasisActive}
        onToggleStasis={setIsStasisActive}
        onNotify={addNotification}
      />

      {/* Cryptographic Audit Proof Export Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#74777F]/20 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#74777F]/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#1E3A5F] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#121C28]">
                    Cryptographic Security Attestation Proof
                  </h3>
                  <span className="font-mono text-xs text-[#74777F]">
                    Standard ISO 27001 / FIPS 140-3 Attestation
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-[#74777F] hover:text-[#121C28] text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <p className="font-sans text-xs text-[#43474E] leading-relaxed">
              This proof contains a tamper-evident zero-knowledge signature certifying your identity attestation level, active hardware key fingerprints, and sovereign reserve boundaries.
            </p>

            <div className="p-4 bg-[#F8F9FF] rounded-xl border border-[#74777F]/15 font-mono text-xs space-y-1.5 text-[#43474E]">
              <div className="flex justify-between">
                <span>Citizen ID:</span>
                <strong className="text-[#121C28]">#8491-904-IN</strong>
              </div>
              <div className="flex justify-between">
                <span>Enclave HSM Attestation:</span>
                <strong className="text-emerald-700">VERIFIED_SEALED</strong>
              </div>
              <div className="flex justify-between">
                <span>Ledger Root Block:</span>
                <strong className="text-[#1E3A5F]">#28,102,510</strong>
              </div>
              <div className="flex justify-between">
                <span>SHA-256 Checksum:</span>
                <span className="text-[#121C28]">8f19...c392</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-sans text-[#74777F] hover:bg-[#EEF4FF]"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setIsAuditModalOpen(false);
                  addNotification('Attestation proof generated and downloaded.', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-[#1E3A5F] hover:bg-[#022448] text-white text-xs font-sans font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Signed Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-xs font-sans flex items-start gap-3 transition-all animate-slide-up ${
              toast.type === 'success'
                ? 'bg-[#002110] text-[#A8F5BF] border-emerald-500/40'
                : toast.type === 'warning'
                ? 'bg-[#410002] text-[#FFDAD6] border-[#BA1A1A]/40'
                : 'bg-[#031847] text-[#DBE1FF] border-[#66A3BF]/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 shrink-0 text-[#FFDAD6] mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-[#66A3BF] mt-0.5" />}

            <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Sovereign Portal Institutional Footer */}
      <UserPortalFooter />
    </div>
  );
}
