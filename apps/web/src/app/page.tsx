import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { LedgerCurrent } from "@/components/ledger-current";

/**
 * Central Guide Board — "the front page".
 * Customer-facing rooms only: Banks (primary), Exchange, Bazaar.
 * Text over imagery always sits on a glass panel.
 */

const PORTALS = [
  {
    key: "bank",
    name: "Banks",
    line: "Five banks, five temperaments. Open accounts, park fixed deposits, take a loan — this is where your money lives.",
    bg: "/portals/banks.png",
    span: "md:col-span-2 md:row-span-2",
    tint: "rgba(37,38,36,0.55)",
    primary: true,
  },
  {
    key: "stocks",
    name: "Exchange",
    line: "Ten listed houses, prices that breathe.",
    bg: "/portals/stocks.png",
    span: "",
    tint: "rgba(102,163,191,0.72)",
    primary: false,
  },
  {
    key: "shop",
    name: "Bazaar",
    line: "Pets, personas & banners — bought in ARTH.",
    bg: "/portals/shop.png",
    span: "",
    tint: "rgba(168,116,42,0.74)",
    primary: false,
  },
] as const;

export default function GuideBoardPage() {
  return (
    <PortalShell portal="central_guide">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="grain relative isolate flex min-h-[92vh] items-center overflow-hidden bg-[#1e3f63]">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url(/portals/central_guide.png)" }}
        />
        <LedgerCurrent />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(100deg, rgba(30,63,99,0.92) 0%, rgba(51,104,160,0.55) 48%, rgba(242,239,231,0.95) 100%)",
          }}
        />
        <div className="mx-auto w-full max-w-7xl px-6 py-28">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-white">
            <img src="/brand/currency_symbol.png" alt="" className="size-4" />
            One currency · Five banks · One exchange
          </span>
          <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.02] tracking-tight text-white [text-shadow:0_2px_32px_rgba(15,35,58,0.45)] md:text-8xl">
            The money press for a small,{" "}
            <em className="not-italic text-[var(--color-arth-gold-soft)]">honest</em> economy.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Every ARTH is printed once by the Central Bank and moves through a double-entry ledger
            that cannot lose a cent. Start with a bank account — the rest follows.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/banks"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-arth-gold)] px-9 py-3.5 text-base font-semibold text-white shadow-[var(--elevation-3)] transition-all duration-[var(--duration-short)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:bg-[#b98433] hover:shadow-[var(--elevation-4)] active:scale-[0.98]"
            >
              Open a bank account
              <svg
                viewBox="0 0 16 16"
                className="size-4 fill-none stroke-current stroke-2"
                aria-hidden
              >
                <path
                  d="M2 8h11M9 3.5 13.5 8 9 12.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/stocks"
              className="inline-flex items-center rounded-full border-2 border-white/60 px-8 py-3 text-base font-medium text-white transition-colors duration-[var(--duration-short)] hover:border-white hover:bg-white/10"
            >
              Visit the exchange
            </Link>
          </div>

          {/* Stat chips — glass over imagery */}
          <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-lg)] bg-white/15 backdrop-blur-sm">
            {[
              ["1", "currency — ARTH"],
              ["5", "licensed banks"],
              ["10", "listed companies"],
            ].map(([n, l]) => (
              <div key={l} className="bg-[rgba(30,63,99,0.45)] px-6 py-4 backdrop-blur-md">
                <dt className="font-[family-name:var(--font-display)] text-3xl font-bold text-white">
                  {n}
                </dt>
                <dd className="mt-0.5 text-xs uppercase tracking-widest text-white/70">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── PORTAL SELECTOR — Banks first and largest ────────── */}
      <section className="bg-[var(--surface-base)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-primary)]">
              Where to today?
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              one session · every room
            </span>
          </div>

          <div className="mt-8 grid auto-rows-[230px] grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {PORTALS.map((p) => (
              <Link
                key={p.key}
                href={routeFor(p.key)}
                className={`group relative isolate overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--elevation-2)] transition-all duration-[var(--duration-medium)] ease-[var(--ease-standard)] hover:-translate-y-1.5 hover:shadow-[var(--elevation-4)] focus-visible:-translate-y-1.5 ${p.span}`}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-[var(--duration-xlong)] ease-[var(--ease-decelerate)] group-hover:scale-105"
                  style={{ backgroundImage: `url(${p.bg})` }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10"
                  style={{ background: `linear-gradient(180deg, transparent 25%, ${p.tint} 100%)` }}
                />
                <div className="flex h-full flex-col justify-end p-6">
                  {/* Glass panel under the text */}
                  <div className="glass rounded-[var(--radius-md)] p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white md:text-3xl">
                        {p.name}
                      </h3>
                      {p.primary ? (
                        <span className="shrink-0 rounded-full bg-[var(--color-arth-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                          Start here
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-sm leading-snug text-white/90">{p.line}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW ARTH MOVES — sage band, numbered steps ───────── */}
      <section className="grain relative bg-[var(--color-sage-mint)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#4a6a67]">How it works</p>
          <h2 className="mt-2 max-w-2xl font-[family-name:var(--font-display)] text-4xl tracking-tight text-[var(--text-primary)]">
            What happens when you press “send”
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "You sign the intent",
                b: "One identity everywhere. Money actions re-confirm with your Financial Password — your login password can never move a cent.",
                icon: "/icons/lock_icon.png",
              },
              {
                n: "02",
                t: "The ledger balances both sides",
                b: "Debits equal credits, always. Cross-bank transfers clear through the settlement hub while both legs are written at once.",
                icon: "/icons/processing.png",
              },
              {
                n: "03",
                t: "It lands, receipt attached",
                b: "Status you can watch: pending → settling → completed. A document-style confirmation is yours to keep.",
                icon: "/icons/completed.png",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="relative rounded-[var(--radius-lg)] bg-[var(--surface-raised)] p-7 shadow-[var(--elevation-1)] transition-shadow duration-[var(--duration-medium)] hover:shadow-[var(--elevation-3)]"
              >
                <span className="absolute right-6 top-5 font-[family-name:var(--font-accent)] text-4xl text-[var(--color-sage-mint)]">
                  {s.n}
                </span>
                <img src={s.icon} alt="" className="size-10" />
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── ANNOUNCEMENT TICKER ──────────────────────────────── */}
      <section
        className="overflow-hidden bg-[var(--color-charcoal)] py-4"
        aria-label="Announcements"
      >
        <div className="ticker-track flex whitespace-nowrap text-sm tracking-wide text-[var(--color-warm-ivory)]">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {[
                "Central Bank: ARTH supply matches the ledger, entry by entry",
                "Five banks licensed — Nava · Samaya · Setu · Sthira · Vayu",
                "Ten houses listed on the Exchange",
                "Settlement hub open around the clock",
              ].map((t) => (
                <span key={t} className="mx-8 inline-flex items-center gap-3">
                  <img src="/brand/currency_symbol.png" alt="" className="size-4 opacity-80" />
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ── BANKS STRIP ──────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-primary)]">
            Five banks, five temperaments
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { logo: "/banks/nava_bank.png", n: "Nava", m: "New money energy" },
              { logo: "/banks/samaya_bank.png", n: "Samaya", m: "Patience pays" },
              { logo: "/banks/setu_bank.png", n: "Setu", m: "The connector" },
              { logo: "/banks/sthira_bank.png", n: "Sthira", m: "Holds steady" },
              { logo: "/banks/vayu_bank.png", n: "Vayu", m: "Moves fast" },
            ].map((b) => (
              <li key={b.n}>
                <Link
                  href="/banks"
                  className="group block rounded-[var(--radius-md)] border border-[var(--hairline)] bg-[var(--surface-raised)] p-5 shadow-[var(--elevation-1)] transition-all duration-[var(--duration-medium)] hover:-translate-y-1 hover:shadow-[var(--elevation-2)]"
                >
                  <img src={b.logo} alt={`${b.n} Bank`} className="h-12 object-contain" />
                  <p className="mt-3 font-[family-name:var(--font-display)] text-lg text-[var(--text-primary)]">
                    {b.n}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{b.m}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PortalShell>
  );
}

function routeFor(key: string): string {
  const routes: Record<string, string> = {
    bank: "/banks",
    stocks: "/stocks",
    shop: "/shop",
  };
  return routes[key] ?? "/";
}
