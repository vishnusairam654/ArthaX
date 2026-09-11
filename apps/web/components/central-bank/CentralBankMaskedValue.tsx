'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface CentralBankMaskedValueProps {
  value: string | number;
  prefix?: string;
  suffix?: string;
  className?: string;
  maskPlaceholder?: string;
}

export const CentralBankMaskedValue: React.FC<CentralBankMaskedValueProps> = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
  maskPlaceholder = '••••••••',
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : value;

  return (
    <span className={`inline-flex items-center gap-1.5 group select-none ${className}`}>
      <span className="font-mono">
        {isRevealed ? (
          <>
            {prefix}
            {formattedValue}
            {suffix}
          </>
        ) : (
          <>
            {prefix}
            <span className="tracking-wider opacity-70">{maskPlaceholder}</span>
            {suffix}
          </>
        )}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsRevealed(!isRevealed);
        }}
        title={isRevealed ? 'Mask figure (Prudential Privacy)' : 'Reveal figure (Authorized View)'}
        aria-label={isRevealed ? 'Mask figure' : 'Reveal figure'}
        className="opacity-40 hover:opacity-100 group-hover:opacity-80 transition-opacity p-0.5 rounded text-inherit cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#946726]"
      >
        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </span>
  );
};
