'use client';

import React, { useState } from 'react';
import { X, Copy, Check, QrCode } from 'lucide-react';

interface DepositQrDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositQrDrawer: React.FC<DepositQrDrawerProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('arthax.nava.cls.8491-904-in.001');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022448]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#74777F]/20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#022448]" />
            <h3 className="font-serif font-semibold text-lg text-[#121C28]">
              Deposit &amp; Inflow QR
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E5EFFF] text-[#1E3A5F] flex items-center justify-center hover:bg-[#D9E3F4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="font-sans text-xs text-[#43474E] leading-relaxed">
          Present this cryptographic envelope to any institutional counterpart or sovereign terminal for direct settlement.
        </p>

        {/* Inline QR SVG Code */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F8F9FF] border border-[#74777F]/15">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-[#74777F]/10">
            <svg className="w-44 h-44" fill="currentColor" viewBox="0 0 200 200">
              <rect fill="white" height="200" width="200" />
              {/* Top Left Finder */}
              <rect fill="#022448" height="50" rx="4" width="50" x="15" y="15" />
              <rect fill="white" height="30" rx="2" width="30" x="25" y="25" />
              <rect fill="#022448" height="14" rx="1" width="14" x="33" y="33" />
              {/* Top Right Finder */}
              <rect fill="#022448" height="50" rx="4" width="50" x="135" y="15" />
              <rect fill="white" height="30" rx="2" width="30" x="145" y="25" />
              <rect fill="#022448" height="14" rx="1" width="14" x="153" y="33" />
              {/* Bottom Left Finder */}
              <rect fill="#022448" height="50" rx="4" width="50" x="15" y="135" />
              <rect fill="white" height="30" rx="2" width="30" x="25" y="145" />
              <rect fill="#022448" height="14" rx="1" width="14" x="33" y="153" />
              {/* Center Data Nodes & Arth Gold Accents */}
              <rect fill="#022448" height="12" width="12" x="75" y="20" />
              <rect fill="#A8742A" height="12" width="12" x="95" y="20" />
              <rect fill="#022448" height="12" width="12" x="115" y="35" />
              <rect fill="#022448" height="12" width="12" x="75" y="55" />
              <rect fill="#022448" height="12" width="12" x="95" y="75" />
              <rect fill="#A8742A" height="12" width="12" x="115" y="95" />
              <rect fill="#022448" height="12" width="12" x="135" y="75" />
              <rect fill="#022448" height="12" width="12" x="75" y="95" />
              <rect fill="#022448" height="12" width="12" x="75" y="135" />
              <rect fill="#022448" height="12" width="12" x="95" y="155" />
              <rect fill="#A8742A" height="12" width="12" x="115" y="135" />
              <rect fill="#022448" height="12" width="12" x="135" y="115" />
              <rect fill="#022448" height="12" width="12" x="155" y="135" />
              <rect fill="#022448" height="12" width="12" x="175" y="155" />
            </svg>
          </div>
          <span className="mt-3 font-mono text-xs text-[#022448] font-bold select-all text-center">
            arthax.nava.cls.8491-904-in.001
          </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 h-10 rounded-xl bg-[#E5EFFF] text-[#022448] font-sans font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#D9E3F4] transition-colors cursor-pointer border border-[#74777F]/15"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'IBAN Copied' : 'Copy Hash'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl bg-[#022448] text-white font-sans font-semibold text-xs hover:bg-[#1E3A5F] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
