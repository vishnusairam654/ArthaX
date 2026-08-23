import { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Supporting copy under the field — write domain-specific hints, not filler. */
  hint?: string;
  error?: string;
}

/**
 * Text input on paper: hairline border, radius-sm, focus ring in portal accent.
 * Never ships without a visible label — placeholders are not labels.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className = "", id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={
          `h-11 rounded-[var(--radius-sm)] border bg-[var(--surface-raised)] px-3 text-base ` +
          `transition-colors duration-[var(--duration-short)] placeholder:text-[var(--text-muted)]/60 ` +
          (error
            ? "border-[var(--color-loss)] focus:border-[var(--color-loss)]"
            : "border-[var(--hairline)] focus:border-[var(--portal-accent)]") +
          ` ${className}`
        }
        {...rest}
      />
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--text-muted)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-[var(--color-loss)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
