import { PortalShell } from "@/components/portal-shell";

/**
 * Placeholder shells for feature portals — each already wears its accent
 * personality via data-portal. Feature screens land in Phases 5–9.
 */
function Shell({
  portal,
  title,
  line,
}: {
  portal: Parameters<typeof PortalShell>[0]["portal"];
  title: string;
  line: string;
}) {
  return (
    <PortalShell portal={portal}>
      <section className="grain relative isolate overflow-hidden border-b border-[var(--hairline)]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--text-primary)] md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-[var(--text-muted)]">{line}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="rule-t pt-8 text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Opens in the next phase — the room is furnished, the desks arrive shortly.
        </p>
      </section>
    </PortalShell>
  );
}

export function BankPortalPage() {
  return (
    <Shell
      portal="bank"
      title="Five banks, five temperaments."
      line="Nava is new money, Samaya keeps time, Setu builds bridges, Sthira holds steady and Vayu moves fast. Accounts open here in Phase 5."
    />
  );
}

export function CentralBankPortalPage() {
  return (
    <Shell
      portal="central_bank"
      title="The registry hall."
      line="Every bank answers to this desk. Registry, approvals and monetary policy arrive with Phase 5."
    />
  );
}

export function UserPortalPage() {
  return (
    <Shell
      portal="user"
      title="Your desk."
      line="Balances across every bank, transfers that settle for real. The desk assembles in Phase 6."
    />
  );
}

export function StockPortalPage() {
  return (
    <Shell
      portal="stocks"
      title="The exchange floor."
      line="Ten listed houses, prices that breathe, gains taxed only on profit. Trading opens in Phase 7."
    />
  );
}

export function ShopPortalPage() {
  return (
    <Shell
      portal="shop"
      title="The bazaar."
      line="Pets with honest powers, personas and banners in four rarities — all bought in ARTH. Doors open in Phase 8."
    />
  );
}
