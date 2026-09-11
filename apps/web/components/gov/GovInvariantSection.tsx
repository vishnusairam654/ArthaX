'use client';

import React from 'react';
import { Mail, ShieldCheck, UserCheck, ArrowRight, CheckCircle2, Lock, Landmark } from 'lucide-react';

export function GovInvariantSection() {
  return (
    <section className="w-full py-16 sm:py-20 border-t border-[#3368A0]/10 bg-white/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3368A0]/10 text-[#1E3A5F] text-xs font-mono mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8742A]" />
            <span>Monetary Architecture Treaty 409-C</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E3A5F] tracking-tight leading-tight mb-3">
            The Inviolable 1:1:1 Identity Invariant
          </h2>
          <p className="text-sm text-[#5C574F] leading-relaxed">
            In ARTHAX, identity and balances are never fragmented. A single citizen email anchors a single sovereign GOV&nbsp;ID, which commands one unified double-entry ledger across all portals.
          </p>
        </div>

        {/* 3-Column Architecture Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Node 1: Email Anchor */}
          <div className="rounded-3xl bg-white border border-[#3368A0]/15 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#3368A0]" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#3368A0]/10 text-[#3368A0] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] font-bold text-[#A8742A] uppercase tracking-wider block mb-1">
                LAYER 01 • CITIZEN ATTESTATION
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1E3A5F] mb-2">
                1 Verified Email
              </h3>
              <p className="text-xs leading-relaxed text-[#5C574F]">
                The cryptographic root email address. One citizen cannot register duplicate identities under conflicting addresses.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#3368A0]/10 flex items-center justify-between text-xs font-mono text-[#1E3A5F]">
              <span>Uniqueness Check</span>
              <span className="text-[#287A55] font-semibold">Strict 1:1 Bound ✓</span>
            </div>
          </div>

          {/* Node 2: Sovereign GOV ID */}
          <div className="rounded-3xl bg-gradient-to-b from-[#1E3A5F] to-[#2A486F] text-white p-6 sm:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#DFB87A]" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#DFB87A] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-white/15">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] font-bold text-[#DFB87A] uppercase tracking-wider block mb-1">
                LAYER 02 • SOVEREIGN AUTHORITY
              </span>
              <h3 className="font-serif text-xl font-bold text-white mb-2">
                1 GOV ID Passkey
              </h3>
              <p className="text-xs leading-relaxed text-white/80">
                The master public identifier for the citizen. Read-only session authority across commercial banks, investments, and central vault.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs font-mono text-[#DFB87A]">
              <span>Format Standard</span>
              <span className="font-bold">GOV-XXXX-XXXX</span>
            </div>
          </div>

          {/* Node 3: ARTHAX User & Double-Entry Ledger */}
          <div className="rounded-3xl bg-white border border-[#3368A0]/15 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#287A55]" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#287A55]/10 text-[#287A55] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] font-bold text-[#A8742A] uppercase tracking-wider block mb-1">
                LAYER 03 • CORE LEDGER
              </span>
              <h3 className="font-serif text-xl font-bold text-[#1E3A5F] mb-2">
                1 ARTHAX User
              </h3>
              <p className="text-xs leading-relaxed text-[#5C574F]">
                Commands all commercial bank accounts (Nava, Samaya, Pravah, Vistara, Kuber), stock holdings, and integer minor-unit balances.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#3368A0]/10 flex items-center justify-between text-xs font-mono text-[#1E3A5F]">
              <span>Double-Entry Rule</span>
              <span className="text-[#287A55] font-semibold">Σ Debits = Σ Credits</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
