"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ARTH currency display — masked by default (AGENTS.md rule 15).
 * Reveal plays a short digit-scramble rather than a plain swap.
 */
export function CurrencyDisplay({
  minor,
  size = "md",
  masked: initiallyMasked = true,
}: {
  /** Amount in ARTH minor units, as string (JSON-safe bigint). */
  minor: string;
  size?: "md" | "xl";
  masked?: boolean;
}) {
  const [masked, setMasked] = useState(initiallyMasked);
  const [display, setDisplay] = useState<string>("••••••");
  const raf = useRef<number>(0);

  const units = Number(BigInt(minor)) / 100;
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(units);

  // Digit-scramble reveal.
  useEffect(() => {
    if (!masked) {
      const target = formatted;
      const start = performance.now();
      const DURATION = 450;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const settled = Math.floor(target.length * t);
        let out = target.slice(0, settled);
        for (let i = settled; i < target.length; i++) {
          out += /\d/.test(target[i]!) ? String(Math.floor(Math.random() * 10)) : target[i];
        }
        setDisplay(out);
        if (t < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf.current);
    }
    setDisplay("••••••");
  }, [masked, formatted]);

  return (
    <span
      className={`inline-flex items-baseline gap-2 ${
        size === "xl"
          ? "font-[family-name:var(--font-display)] text-6xl md:text-8xl tracking-tight text-[var(--currency-accent)]"
          : "font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]"
      }`}
    >
      <span
        className={size === "xl" ? "tabular-nums" : "tabular-nums"}
        aria-label={masked ? "Balance hidden" : `${formatted} ARTH`}
      >
        {display}
      </span>
      {size === "xl" ? (
        <button
          type="button"
          onClick={() => setMasked((m) => !m)}
          aria-pressed={!masked}
          className="self-center rounded-[var(--radius-full)] border border-[var(--hairline)] px-3 py-1 text-xs uppercase tracking-widest text-[var(--text-muted)] transition-colors duration-[var(--duration-short)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          {masked ? "Reveal" : "Hide"}
        </button>
      ) : null}
    </span>
  );
}
