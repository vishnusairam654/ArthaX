'use client';

import React, { useState, useEffect } from 'react';

export interface ProgressSegment {
  id: string;
  label?: string;
  value: number; // Percentage e.g. 40.9
  gradient?: string; // Tailwind gradient or color classes
  tooltip?: string;
  glowColor?: string;
}

interface AnimatedProgressBarProps {
  value?: number; // For single bar (0 to 100)
  segments?: ProgressSegment[]; // For multi-segment spectrum bars
  variant?: 'primary' | 'gold' | 'secondary' | 'markets' | 'emerald' | 'amber';
  height?: 'xs' | 'sm' | 'md' | 'lg'; // xs: 4px, sm: 6px, md: 8px, lg: 12px
  showPulseBead?: boolean;
  className?: string;
  trackClassName?: string;
  title?: string;
}

const variantGradients = {
  primary: 'bg-gradient-to-r from-[#022448] via-[#1E3A5F] to-[#3368A0]',
  gold: 'bg-gradient-to-r from-[#8A5D1E] via-[#A8742A] to-[#DFB87A]',
  secondary: 'bg-gradient-to-r from-[#304169] via-[#4C5D8E] to-[#7B9CD6]',
  markets: 'bg-gradient-to-r from-[#1E3A5F] via-[#455F87] to-[#66A3BF]',
  emerald: 'bg-gradient-to-r from-[#065F46] via-[#10B981] to-[#34D399]',
  amber: 'bg-gradient-to-r from-[#B45309] via-[#F59E0B] to-[#FBBF24]',
};

const variantBeads = {
  primary: 'bg-[#ADC8F5] shadow-[0_0_8px_rgba(173,200,245,0.8)]',
  gold: 'bg-[#FDF8F0] shadow-[0_0_8px_rgba(223,184,122,0.9)]',
  secondary: 'bg-[#DBE1FF] shadow-[0_0_8px_rgba(219,225,255,0.8)]',
  markets: 'bg-[#C8DFDB] shadow-[0_0_8px_rgba(200,223,219,0.8)]',
  emerald: 'bg-[#A8F5BF] shadow-[0_0_8px_rgba(168,245,191,0.9)]',
  amber: 'bg-[#FEF3C7] shadow-[0_0_8px_rgba(254,243,199,0.9)]',
};

const heightClasses = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value = 0,
  segments,
  variant = 'primary',
  height = 'sm',
  showPulseBead = true,
  className = '',
  trackClassName = '',
  title,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger smooth fill expansion on mount
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const trackHeight = heightClasses[height];

  // MULTI-SEGMENT SPECTRUM BAR (e.g. Asset Class Allocation)
  if (segments && segments.length > 0) {
    return (
      <div 
        className={`w-full ${trackHeight} rounded-full bg-[#E0E2EC]/80 p-[1.5px] border border-[#74777F]/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] flex gap-0.5 relative overflow-hidden group ${trackClassName} ${className}`}
        title={title}
      >
        {/* Global Live Shimmer Stream across all segments */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 rounded-full">
          <div className="w-full h-full animate-progress-stream bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {segments.map((seg, idx) => {
          const widthPercent = mounted ? Math.max(0, Math.min(100, seg.value)) : 0;
          const isFirst = idx === 0;
          const isLast = idx === segments.length - 1;

          return (
            <div
              key={seg.id || idx}
              className={`h-full relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${seg.gradient || variantGradients[variant]} ${
                isFirst ? 'rounded-l-full' : ''
              } ${isLast ? 'rounded-r-full' : ''} hover:brightness-110`}
              style={{ width: `${widthPercent}%` }}
              title={seg.tooltip || `${seg.label || seg.id}: ${seg.value}%`}
            >
              {/* Internal subtle top highlight reflection */}
              <div className="absolute inset-x-0 top-0 h-[30%] bg-white/25 rounded-t-full pointer-events-none" />
            </div>
          );
        })}
      </div>
    );
  }

  // SINGLE ANIMATED PROGRESS BAR
  const targetWidth = mounted ? Math.max(0, Math.min(100, value)) : 0;
  const gradientClass = variantGradients[variant];
  const beadClass = variantBeads[variant];

  return (
    <div 
      className={`w-full ${trackHeight} rounded-full bg-[#E0E2EC]/80 border border-[#74777F]/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] relative overflow-hidden ${trackClassName} ${className}`}
      title={title || `${value}%`}
    >
      {/* Animated Fill Bar */}
      <div
        className={`h-full rounded-full relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] ${gradientClass}`}
        style={{ width: `${targetWidth}%` }}
      >
        {/* Living Liquid Telemetry Shimmer Stream */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
          <div className="w-full h-full animate-progress-stream bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        </div>

        {/* Top Gloss Highlight */}
        <div className="absolute inset-x-0 top-0 h-[35%] bg-white/25 rounded-t-full pointer-events-none" />

        {/* Glowing Pulse Bead at Leading Edge */}
        {showPulseBead && targetWidth > 2 && (
          <span 
            className={`absolute top-1/2 right-0.5 -translate-y-1/2 w-1.5 h-1.5 rounded-full animate-pulse-bead pointer-events-none ${beadClass}`}
          />
        )}
      </div>
    </div>
  );
};
