'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ShieldX, KeyRound, ArrowRight, RefreshCw } from 'lucide-react';
import { apiGetMe, apiLogout } from '@/lib/api';
import { AuthSessionPayload, UserRole } from '@arthax/types';

interface PortalAuthGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

type GuardStatus = 'CHECKING' | 'AUTHORIZED' | 'UNAUTHENTICATED' | 'FORBIDDEN';

export const PortalAuthGuard: React.FC<PortalAuthGuardProps> = ({ requiredRole, children }) => {
  const [status, setStatus] = useState<GuardStatus>('CHECKING');
  const [session, setSession] = useState<AuthSessionPayload | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const evaluateAuth = async () => {
    setStatus('CHECKING');
    setErrorMsg('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('arthax_token') || localStorage.getItem('auth_token') : null;
    if (!token) {
      setStatus('UNAUTHENTICATED');
      return;
    }

    try {
      const claims = await apiGetMe();
      setSession(claims);

      if (claims.role === requiredRole) {
        setStatus('AUTHORIZED');
      } else {
        setStatus('FORBIDDEN');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Session verification failed');
      setStatus('UNAUTHENTICATED');
    }
  };

  useEffect(() => {
    evaluateAuth();

    const handleInvalidate = () => {
      evaluateAuth();
    };

    window.addEventListener('arthax:invalidate-cache', handleInvalidate);
    window.addEventListener('storage', handleInvalidate);

    return () => {
      window.removeEventListener('arthax:invalidate-cache', handleInvalidate);
      window.removeEventListener('storage', handleInvalidate);
    };
  }, [requiredRole]);

  // 1. Loading State (Rule 13)
  if (status === 'CHECKING') {
    return (
      <div className="min-h-screen bg-[#F2EFE7] flex flex-col items-center justify-center p-6 text-[#262320]">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#3368A0]/10 border border-[#3368A0]/20 flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6 text-[#3368A0]" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1E3A5F]">
            Verifying Sovereign Authority
          </h2>
          <p className="font-sans text-xs text-[#5C574F]">
            Validating cryptographic enclave session against the central ledger authority...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (401)
  if (status === 'UNAUTHENTICATED') {
    return (
      <div className="min-h-screen bg-[#F2EFE7] flex flex-col items-center justify-center p-6 text-[#262320]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#3368A0]/20 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#B5482E]" />
          
          <div className="w-14 h-14 rounded-2xl bg-[#B5482E]/10 border border-[#B5482E]/25 flex items-center justify-center mb-5">
            <ShieldAlert className="w-7 h-7 text-[#B5482E]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5482E]/10 text-[#B5482E] text-xs font-mono mb-3">
            <span>401 • UNAUTHORIZED</span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#1E3A5F] mb-2">
            Sovereign Session Required
          </h1>

          <p className="font-sans text-xs text-[#5C574F] leading-relaxed mb-6">
            Access to this sovereign financial node requires an active authenticated session. {errorMsg && <span className="block mt-1 font-mono text-[#B5482E]">{errorMsg}</span>}
          </p>

          <Link
            href="/gov"
            className="w-full py-3.5 px-5 rounded-xl text-sm font-sans font-semibold text-white flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all no-underline"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 100%)',
            }}
          >
            <span>Authenticate via Government Gateway</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // 3. Forbidden State (403 - Rule 14: Never render unauthorized controls into DOM)
  if (status === 'FORBIDDEN') {
    const roleTitles: Record<UserRole, string> = {
      USER: 'Sovereign Citizen (USER)',
      BANK_ADMIN: 'Commercial Bank Officer (BANK_ADMIN)',
      CENTRAL_BANK_ADMIN: 'Central Monetary Governor (CENTRAL_BANK_ADMIN)',
    };

    return (
      <div className="min-h-screen bg-[#F2EFE7] flex flex-col items-center justify-center p-6 text-[#262320]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#B5482E]/30 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#B5482E]" />
          
          <div className="w-14 h-14 rounded-2xl bg-[#B5482E]/10 border border-[#B5482E]/30 flex items-center justify-center mb-5">
            <ShieldX className="w-7 h-7 text-[#B5482E]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5482E]/10 text-[#B5482E] text-xs font-mono mb-3">
            <span>403 • FORBIDDEN</span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#1E3A5F] mb-2">
            Portal Access Restricted
          </h1>

          <p className="font-sans text-xs text-[#5C574F] leading-relaxed mb-4">
            Your current sovereign credential carries the role <strong className="font-mono text-[#1E3A5F]">{session?.role || 'UNKNOWN'}</strong>.
            This portal requires <strong className="font-mono text-[#1E3A5F]">{roleTitles[requiredRole]}</strong> authority.
          </p>

          <div className="w-full p-3 rounded-xl bg-[#F2EFE7] border border-[#3368A0]/15 text-left text-[11px] font-mono text-[#5C574F] mb-6 space-y-1">
            <div className="flex justify-between">
              <span>Required Clearance:</span>
              <span className="font-bold text-[#1E3A5F]">{requiredRole}</span>
            </div>
            <div className="flex justify-between">
              <span>Assigned Identity:</span>
              <span className="font-bold text-[#1E3A5F]">{session?.govId || 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span>Directive:</span>
              <span className="text-[#B5482E]">Cross-Portal Boundary Invariant</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <Link
              href={session?.role === 'USER' ? '/user' : session?.role === 'BANK_ADMIN' ? '/bank' : session?.role === 'CENTRAL_BANK_ADMIN' ? '/central-bank' : '/gov'}
              className="w-full py-3 px-4 rounded-xl text-xs font-sans font-semibold text-white flex items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-95 transition-all no-underline"
              style={{
                background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 100%)',
              }}
            >
              <span>Return to Your Authorized Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => apiLogout().then(() => setStatus('UNAUTHENTICATED'))}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-medium text-[#5C574F] hover:bg-[#F2EFE7] transition border border-[#3368A0]/15"
            >
              Switch Sovereign Session (Sign Out)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized State (Rule 14: Render protected DOM only when authorized)
  return <>{children}</>;
};
