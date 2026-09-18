'use client';

import React, { useState } from 'react';
import {
  LogIn,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Shield,
} from 'lucide-react';
import { apiLogin } from '@/lib/api';

interface GovLoginStepProps {
  onBack: () => void;
  onLoginSuccess: (govId: string, email: string) => void;
}

export const GovLoginStep: React.FC<GovLoginStepProps> = ({
  onBack,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError('Please input your GOV ID or registered email address.');
      return;
    }
    if (!password) {
      setError('Please input your GOV Password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const authRes = await apiLogin({
        govIdOrEmail: identifier.trim(),
        govPassword: password,
      });
      onLoginSuccess(authRes.user.govIdNumber, authRes.user.email);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C574F] hover:text-[#1E3A5F] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Gateway</span>
      </button>

      {/* Step Header */}
      <div className="flex items-start gap-3.5 mb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 100%)',
          }}
        >
          <LogIn className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3368A0] bg-[#3368A0]/10 px-2 py-0.5 rounded-sm">
              Authentication
            </span>
            <span className="text-[11px] font-mono text-[#5C574F]">Existing Citizen</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A5F] leading-tight mt-1">
            Sign In to Identity
          </h2>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#5C574F] mb-6 pl-[58px]">
        Authenticate with your registered GOV&nbsp;ID or email and passkey.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identifier Input */}
        <div>
          <label
            htmlFor="gov-login-identifier"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
          >
            GOV ID or Registered Email
          </label>
          <input
            id="gov-login-identifier"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (error) setError(null);
            }}
            placeholder="GOV-XXXX-XXXX or citizen@domain.com"
            required
            autoFocus
            autoComplete="username"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-3 focus:ring-[#3368A0]/10 focus:outline-none transition-all shadow-inner"
          />
        </div>

        {/* GOV Password Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="gov-login-password"
              className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#262320]"
            >
              GOV Password
            </label>
            <span className="text-[11px] font-mono text-[#3368A0]">
              Identity credential
            </span>
          </div>
          <div className="relative">
            <input
              id="gov-login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your GOV password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3.5 pr-11 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-3 focus:ring-[#3368A0]/10 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#5C574F] hover:text-[#1E3A5F] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl text-xs bg-[#B5482E]/10 border border-[#B5482E]/25 text-[#B5482E]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full py-3.5 px-5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md mt-2"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 70%, #2A588B 100%)',
          }}
          id="gov-sign-in-btn"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Authenticating Credential…</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Create */}
      <div className="mt-6 pt-5 border-t border-[#3368A0]/10 text-center">
        <button
          onClick={onBack}
          className="text-xs font-mono text-[#5C574F] hover:text-[#1E3A5F] transition-colors"
        >
          Don't have a GOV ID? <strong className="text-[#3368A0] underline">Create one now</strong>
        </button>
      </div>
    </div>
  );
};
