'use client';

import React from 'react';

interface AnimatedMaskedValueProps {
  value: string | number;
  isMasked: boolean;
  maskString?: string;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  currency?: string;
  as?: 'span' | 'div' | 'p';
}

/**
 * AnimatedMaskedValue
 * Provides an ultra-smooth, physical blur-fade and slide reveal animation
 * between sensitive sovereign balances and masked dots (per ARTHAX Rule 15).
 */
export const AnimatedMaskedValue: React.FC<AnimatedMaskedValueProps> = ({
  value,
  isMasked,
  maskString = '••••••••',
  className = '',
  prefix,
  suffix,
  currency,
  as: Component = 'span',
}) => {
  const effectiveSuffix = suffix ?? (currency ? ` ${currency}` : null);
  return (
    <Component className={`relative inline-flex items-baseline overflow-hidden align-baseline ${className}`}>
      {/* Masked Dots Layer */}
      <span
        className={`inline-flex items-baseline transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isMasked
            ? 'relative opacity-100 filter blur-0 translate-y-0 scale-100'
            : 'absolute left-0 top-0 opacity-0 filter blur-xs -translate-y-2 scale-95 pointer-events-none'
        }`}
        aria-hidden={!isMasked}
      >
        {prefix}
        <span className="font-mono tracking-wider">{maskString}</span>
        {effectiveSuffix}
      </span>

      {/* Revealed Value Layer */}
      <span
        className={`inline-flex items-baseline transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          !isMasked
            ? 'relative opacity-100 filter blur-0 translate-y-0 scale-100'
            : 'absolute left-0 top-0 opacity-0 filter blur-xs translate-y-2 scale-95 pointer-events-none'
        }`}
        aria-hidden={isMasked}
      >
        {prefix}
        <span>{value}</span>
        {effectiveSuffix}
      </span>
    </Component>
  );
};
