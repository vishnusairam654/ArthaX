'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, RefreshCw, AlertCircle, ArrowLeft, Shield } from 'lucide-react';

interface GovEmailStepProps {
  onSendOtp: (email: string) => void;
  onBack: () => void;
}

export const GovEmailStep: React.FC<GovEmailStepProps> = ({
  onSendOtp,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Please enter a valid official email address.');
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSendOtp(trimmed);
    }, 700);
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

      {/* Step Header & Visual Pipeline */}
      <div className="flex items-start gap-3.5 mb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #3368A0 100%)',
          }}
        >
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8742A] bg-[#A8742A]/10 px-2 py-0.5 rounded-sm">
              Stage 1 of 3
            </span>
            <span className="text-[11px] font-mono text-[#5C574F]">Identity Link</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3A5F] leading-tight mt-1">
            Email Verification
          </h2>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#5C574F] mb-6 pl-[58px]">
        Provide the official email address to be permanently bound to your GOV&nbsp;ID sovereign registry.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="gov-email-input"
            className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[#262320]"
          >
            Official Email Address
          </label>
          <div className="relative">
            <input
              id="gov-email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="citizen@domain.com"
              required
              autoFocus
              autoComplete="email"
              className="w-full px-4 py-3.5 pl-11 rounded-xl text-sm font-sans text-[#262320] bg-white border border-[#3368A0]/20 focus:border-[#3368A0] focus:ring-3 focus:ring-[#3368A0]/10 focus:outline-none transition-all placeholder:text-[#5C574F]/50 shadow-inner"
            />
            <Mail className="w-4 h-4 text-[#5C574F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Security / Notice info box */}
        <div className="p-3 rounded-xl bg-[#C8DFDB]/25 border border-[#3368A0]/15 flex items-start gap-2.5 text-xs text-[#5C574F]">
          <Shield className="w-4 h-4 text-[#3368A0] shrink-0 mt-0.5" />
          <span>
            A 6-digit cryptographic verification code will be dispatched to this address.
          </span>
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
          id="gov-send-otp-btn"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Dispatching Security Token…</span>
            </>
          ) : (
            <>
              <span>Send Verification Code</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
