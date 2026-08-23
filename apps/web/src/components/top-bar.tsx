import Link from "next/link";
import type { PortalKey } from "@arthax/tokens";

/**
 * Global chrome — Warm Ivory, hairline rules, no shadows.
 * ARTHAX wordmark (Amarante) is primary; portals are rooms inside it.
 */
export function TopBar({ portal }: { portal: PortalKey }) {
  return (
    <header className="rule-b relative z-10 bg-[var(--surface-base)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center" aria-label="ARTHAX home">
          <img src="/brand/watermark_transparent.png" alt="ARTHAX" className="h-11 w-auto" />
        </Link>
        <span className="-ml-4 hidden text-xs uppercase tracking-[0.22em] text-[var(--text-muted)] sm:inline">
          {labelFor(portal)}
        </span>
        <nav className="flex items-center gap-5" aria-label="Portal navigation">
          <SessionChip />
        </nav>
      </div>
    </header>
  );
}

function labelFor(portal: PortalKey): string {
  const labels: Record<PortalKey, string> = {
    central_guide: "Guide Board",
    central_bank: "Central Bank",
    bank: "Banks",
    user: "My Desk",
    stocks: "Exchange",
    shop: "Bazaar",
  };
  return labels[portal];
}

function SessionChip() {
  // Placeholder identity surface — real session wiring arrives with portal features.
  return (
    <span className="flex h-8 items-center rounded-full border border-[var(--hairline)] px-3 text-xs text-[var(--text-muted)]">
      Sign in
    </span>
  );
}
