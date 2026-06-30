import type { ComponentPropsWithoutRef } from "react";

export function Panel({ className = "", ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_80px_rgba(0,0,0,.18)] ${className}`}
      {...props}
    />
  );
}
