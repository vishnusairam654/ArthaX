import React from 'react';

/**
 * Accessible Skip to Content component (WCAG 2.1 AA requirement).
 * Hidden visually until focused via keyboard Tab navigation.
 */
export function SkipToContent({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-to-content"
      aria-label="Skip navigation and jump to main content"
    >
      Skip to main content
    </a>
  );
}
