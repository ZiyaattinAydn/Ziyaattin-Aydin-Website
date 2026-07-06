import type { ComponentPropsWithoutRef } from "react";

type PanelProps = ComponentPropsWithoutRef<"section"> & {
  elevated?: boolean;
};

export function Panel({ className = "", elevated = false, ...props }: PanelProps) {
  return (
    <section
      className={`rounded-2xl border border-[var(--border)] ${
        elevated ? "bg-[var(--surface-elevated)] shadow-[var(--shadow-card)]" : "bg-[var(--surface)] shadow-[var(--shadow-soft)]"
      } ${className}`}
      {...props}
    />
  );
}
