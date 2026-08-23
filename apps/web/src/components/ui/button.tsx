import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const BASE =
  "relative inline-flex items-center justify-center gap-2 font-medium " +
  "transition-[background-color,transform,box-shadow] duration-[var(--duration-short)] " +
  "ease-[var(--ease-standard)] active:scale-[0.98] disabled:pointer-events-none " +
  "disabled:opacity-50 cursor-pointer select-none";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--portal-accent)] text-[var(--text-on-brand)] hover:brightness-110 disabled:opacity-40",
  secondary:
    "bg-transparent text-[var(--portal-accent)] border border-[var(--portal-accent)] " +
    "hover:bg-[color-mix(in_srgb,var(--portal-accent)_8%,transparent)]",
  ghost: "bg-transparent text-[var(--text-primary)] hover:bg-[rgba(37,38,36,0.08)]",
  destructive: "bg-[var(--color-loss)] text-white hover:brightness-110",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-[var(--radius-sm)]",
  md: "h-10 px-5 text-sm rounded-[var(--radius-md)]",
  lg: "h-12 px-7 text-base rounded-[var(--radius-md)]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Shows an inline spinner and blocks interaction while true. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    className = "",
    children,
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
});
