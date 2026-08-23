import type { PortalKey } from "@arthax/tokens";
import { TopBar } from "./top-bar";

/**
 * PortalShell — one shell, six personalities via data-portal accent variables.
 * Layout: top bar + content well; footer hairline with gazette colophon.
 */
export function PortalShell({
  portal,
  children,
}: {
  portal: PortalKey;
  children: React.ReactNode;
}) {
  return (
    <div data-portal={portal} className="flex min-h-screen flex-col">
      <TopBar portal={portal} />
      <main className="flex-1">{children}</main>
      <footer className="rule-t mt-auto bg-[var(--surface-base)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-[var(--text-muted)]">
          <span>ARTHAX — a simulated financial ecosystem. All currency is ARTH.</span>
          <span className="font-[family-name:var(--font-accent)] tracking-wide">A</span>
        </div>
      </footer>
    </div>
  );
}
