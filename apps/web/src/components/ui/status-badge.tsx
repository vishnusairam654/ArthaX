import type { TransactionState } from "@arthax/types";

/**
 * 9-state machine → 6-icon mapping (resolved in AGENTS.md):
 * VALIDATING + AUTHORIZED → pending.png; PROCESSING + SETTLING → processing.png;
 * COMPLETED/FAILED/REVERSED → own icons; CANCELLED → failed.png variant styling.
 */
const ICON: Record<TransactionState, { src: string; alt: string }> = {
  PENDING: { src: "/icons/pending.png", alt: "Pending" },
  VALIDATING: { src: "/icons/pending.png", alt: "Validating" },
  AUTHORIZED: { src: "/icons/pending.png", alt: "Authorized" },
  PROCESSING: { src: "/icons/processing.png", alt: "Processing" },
  SETTLING: { src: "/icons/processing.png", alt: "Settling" },
  COMPLETED: { src: "/icons/completed.png", alt: "Completed" },
  FAILED: { src: "/icons/failed.png", alt: "Failed" },
  REVERSED: { src: "/icons/reversed.png", alt: "Reversed" },
  CANCELLED: { src: "/icons/failed.png", alt: "Cancelled" },
};

const TONE: Partial<Record<TransactionState, string>> = {
  FAILED: "text-[var(--color-loss)]",
  CANCELLED: "text-[var(--text-muted)] line-through",
  REVERSED: "text-[var(--text-muted)]",
};

export function StatusBadge({
  state,
  size = "sm",
}: {
  state: TransactionState;
  size?: "sm" | "md";
}) {
  const icon = ICON[state];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border border-[var(--hairline)] bg-[var(--surface-raised)] px-2.5 ${
        size === "sm" ? "py-0.5 text-xs" : "py-1 text-sm"
      } ${TONE[state] ?? "text-[var(--text-primary)]"}`}
    >
      <img src={icon.src} alt="" className={size === "sm" ? "size-3.5" : "size-4"} />
      {icon.alt}
    </span>
  );
}
