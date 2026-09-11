'use client';

import React from 'react';
import { ShieldCheck, Building2, Lock } from 'lucide-react';

export const UserPortalFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#EEF4FF] border-t border-[#74777F]/20 mt-16 text-xs text-[#43474E] px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto py-12 space-y-10">
        {/* Compliance Inscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1E3A5F]" />
              <span className="font-serif text-sm font-semibold text-[#022448]">
                Core Ledger Integrity
              </span>
            </div>
            <p className="font-sans leading-relaxed text-[#43474E]">
              Authenticated against block height #28,102,510. Zero divergence recorded across domestic commercial settlement nodes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1E3A5F]" />
              <span className="font-serif text-sm font-semibold text-[#022448]">
                ISO 20022 Clearing
              </span>
            </div>
            <p className="font-sans leading-relaxed text-[#43474E]">
              Transactions resolved via pacs.008 real-time institutional rails with deterministic delivery vs. payment finality.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1E3A5F]" />
              <span className="font-serif text-sm font-semibold text-[#022448]">
                Encrypted Resident Session
              </span>
            </div>
            <p className="font-sans leading-relaxed text-[#43474E]">
              Hardware Security Module (HSM) enclave authenticated. Session strictly isolated under Sovereign Citizen Protection Act.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#74777F]/15 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#74777F]">
          <p>© 2025 ARTHAX Sovereign Monetary Authority. Personal Citizen Finance Cockpit.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#10B981] font-semibold">TLS 1.3 Active</span>
            <span>•</span>
            <span>Enclave Node: IN-WEST-04</span>
            <span>•</span>
            <span>Audited by CERT-IN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
