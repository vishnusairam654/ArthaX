'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface BankMaskedValueProps {
  value: string;
  maskedPlaceholder?: string;
  className?: string;
  valueClassName?: string;
}

export const BankMaskedValue: React.FC<BankMaskedValueProps> = ({
  value,
  maskedPlaceholder = '••••••••',
  className = '',
  valueClassName = '',
}) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <span className={`inline-flex items-center gap-1.5 group ${className}`}>
      <span className={valueClassName}>
        {revealed ? value : maskedPlaceholder}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setRevealed(!revealed);
        }}
        className="text-[#74777F] hover:text-[#3B3278] transition-colors p-0.5 rounded cursor-pointer"
        title={revealed ? 'Mask value' : 'Click to reveal'}
        aria-label={revealed ? 'Mask value' : 'Click to reveal'}
      >
        {revealed ? (
          <EyeOff className="w-3 h-3 opacity-70 group-hover:opacity-100" />
        ) : (
          <Eye className="w-3 h-3 opacity-60 group-hover:opacity-100" />
        )}
      </button>
    </span>
  );
};
