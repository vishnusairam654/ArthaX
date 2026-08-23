import type { PortalKey } from "@arthax/tokens";

const ILLUSTRATIONS: Record<string, string> = {
  no_bank_account: "/illustrations/no_bank_account.png",
  no_transactions: "/illustrations/no_transactions.png",
  no_fd: "/illustrations/no_FD.png",
  no_stocks: "/illustrations/no_stocks.png",
  empty_inventory: "/illustrations/empty_inventory.png",
  empty_mailbox: "/illustrations/empty_mailbox.png",
  not_found: "/illustrations/404_error.png",
};

type EmptyKind = keyof typeof ILLUSTRATIONS;

/**
 * Empty state — illustration layered BEHIND the headline (depth composition),
 * never stacked neatly above it. Copy must be domain-specific, never "No data found".
 */
export function EmptyState({
  kind,
  headline,
  body,
  action,
}: {
  kind: EmptyKind;
  /** Domain-specific line, e.g. "No accounts yet at any of the five banks." */
  headline: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grain relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--hairline)] bg-[var(--surface-raised)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-8 opacity-[0.16] transition-transform duration-[var(--duration-xlong)] ease-[var(--ease-decelerate)] hover:scale-[1.03]"
      >
        <img src={ILLUSTRATIONS[kind]} alt="" className="w-64 select-none" />
      </div>
      <div className="relative max-w-md p-8">
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">
          {headline}
        </h3>
        {body ? (
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{body}</p>
        ) : null}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

export function portalEmptyHint(_portal: PortalKey): string {
  // Portals may specialize copy; kept as an extension point.
  return "";
}
