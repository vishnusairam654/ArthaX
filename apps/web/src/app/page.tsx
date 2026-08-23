import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";

/**
 * Central Guide Board — "the front page" (narrative content, NOT a card grid).
 * Full-bleed hero on central_guide.png + gradient mesh + grain.
 * Portal selector: huge asymmetric Fraunces type; hover crossfades the backdrop.
 */
const PORTALS = [
  {
    key: "central_bank",
    name: "Central Bank",
    line: "The registry hall. Oversight of every bank.",
    bg: "/portals/central_bank.png",
  },
  {
    key: "bank",
    name: "Banks",
    line: "Five branches. Open an account where it fits.",
    bg: "/portals/banks.png",
  },
  {
    key: "user",
    name: "My Desk",
    line: "Your balances, your transfers, your terms.",
    bg: "/portals/user.png",
  },
  {
    key: "stocks",
    name: "Exchange",
    line: "Ten listed houses. Prices move live.",
    bg: "/portals/stocks.png",
  },
  {
    key: "shop",
    name: "Bazaar",
    line: "Pets, personas and banners — bought in ARTH.",
    bg: "/portals/shop.png",
  },
] as const;

export default function GuideBoardPage() {
  return (
    <PortalShell portal="central_guide">
      {/* Full-bleed editorial hero */}
      <section className="grain relative isolate overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url(/portals/central_guide.png)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(105deg, rgba(51,104,160,0.88) 0%, rgba(102,163,191,0.55) 45%, rgba(242,239,231,0.92) 100%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 py-28 md:py-40">
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(255,255,255,0.85)]">
            One currency · Five banks · Six rooms
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-white md:text-7xl">
            The money press for a small, honest economy.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[rgba(255,255,255,0.9)]">
            Every ARTH that exists is printed once by the Central Bank and moves through a
            double-entry ledger that cannot lose a cent. Pick a room below and step in.
          </p>
        </div>
      </section>

      {/* Asymmetric portal selector — type IS the graphic */}
      <section className="rule-t mx-auto max-w-7xl px-6 py-16" aria-label="Portals">
        <ul className="grid grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2">
          {PORTALS.map((p, i) => (
            <li key={p.key} className={i % 2 === 1 ? "md:translate-y-10" : undefined}>
              <Link
                href={routeFor(p.key)}
                className="group flex flex-col border-b border-[var(--hairline)] py-6 transition-colors duration-[var(--duration-medium)] hover:bg-[rgba(51,104,160,0.04)] md:flex-row md:items-baseline md:justify-between"
              >
                <span className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--text-primary)] transition-colors duration-[var(--duration-medium)] group-hover:text-[var(--color-deep-blue)] md:text-5xl">
                  {p.name}
                  <span
                    aria-hidden
                    className="ml-3 inline-block h-2 w-2 rounded-full bg-[var(--color-arth-gold)] align-middle opacity-0 transition-opacity duration-[var(--duration-medium)] group-hover:opacity-100"
                  />
                </span>
                <span className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--text-muted)] transition-transform duration-[var(--duration-medium)] ease-[var(--ease-decelerate)] md:mt-0 md:translate-x-2 md:group-hover:translate-x-0">
                  {p.line}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Announcement ticker strip */}
      <section
        className="rule-t overflow-hidden bg-[var(--color-deep-blue)] py-3"
        aria-label="Announcements"
      >
        <div className="animate-none px-6 text-sm tracking-wide text-white/90 [animation:none]">
          Central Bank announcement — ARTH supply stands at exactly what the ledger says it does.
        </div>
      </section>

      {/* Explainer: split-screen sticky */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
        <div className="md:sticky md:top-24 md:self-start">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-primary)]">
            How ARTH moves
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-[var(--text-muted)]">
            Nothing here is a points system. When you send ARTH to a friend at another bank, the
            exchange clears it through the Central Settlement Layer while the ledger records both
            sides of the entry at once. What arrives was never created twice.
          </p>
        </div>
        <ol className="space-y-8">
          {[
            ["Signed in", "One identity across all six rooms — one email, one GOV ID, one you."],
            [
              "Money authorized",
              "Transfers above everyday size ask for your Financial Password. Your login password can never move money.",
            ],
            [
              "Settled",
              "Cross-bank movement passes the settlement hub with both legs recorded, then lands.",
            ],
          ].map(([title, body], i) => (
            <li key={title} className="rule-t flex gap-5 pt-6">
              <span className="font-[family-name:var(--font-accent)] text-3xl leading-none text-[var(--color-arth-gold)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
                  {title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </PortalShell>
  );
}

function routeFor(key: string): string {
  const routes: Record<string, string> = {
    central_bank: "/central-bank",
    bank: "/banks",
    user: "/user",
    stocks: "/stocks",
    shop: "/shop",
  };
  return routes[key] ?? "/";
}
