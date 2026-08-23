"use client";

import { useEffect, useRef } from "react";

/**
 * Sheet/Modal — radius-xl, elevation-2, enters decelerating / exits accelerating.
 * The step-up Financial Password variant keeps entrance quick (friction by design).
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  variant = "dialog",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "dialog" | "bottom-sheet" | "step-up";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const radius =
    variant === "bottom-sheet"
      ? "rounded-t-[var(--radius-xl)]"
      : variant === "step-up"
        ? "rounded-[var(--radius-lg)]"
        : "rounded-[var(--radius-xl)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-[rgba(37,38,36,0.4)] animate-[sheet-fade_var(--duration-medium)_var(--ease-decelerate)]"
        onClick={onClose}
      />
      <div
        ref={ref}
        tabIndex={-1}
        className={`relative w-full max-w-md border border-[var(--hairline)] bg-[var(--surface-base)] p-6 shadow-[var(--elevation-2)] outline-none ${radius} ${variant === "bottom-sheet" ? "sm:mb-0 mb-0" : ""}`}
        style={{ animation: "sheet-rise var(--duration-long) var(--ease-decelerate)" }}
      >
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
      <style>{`
        @keyframes sheet-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sheet-rise {
          from { opacity: 0; transform: translateY(16px) scale(0.98) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  );
}
