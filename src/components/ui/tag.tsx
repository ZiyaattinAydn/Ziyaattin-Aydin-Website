import type { PropsWithChildren } from "react";

type TagProps = PropsWithChildren<{
  tone?: "neutral" | "accent";
}>;

export function Tag({ children, tone = "neutral" }: TagProps) {
  const toneClass =
    tone === "accent"
      ? "border-[var(--accent-dim)] bg-[var(--accent-soft)] text-[var(--accent)]"
      : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]";

  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${toneClass}`}>{children}</span>;
}
