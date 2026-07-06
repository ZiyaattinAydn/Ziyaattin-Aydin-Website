import type { PropsWithChildren } from "react";

type StatusBadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

type StatusBadgeProps = PropsWithChildren<{
  tone?: StatusBadgeTone;
}>;

const toneClasses: Record<StatusBadgeTone, string> = {
  neutral: "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted-strong)]",
  accent: "border-[var(--accent-dim)] bg-[var(--accent-soft)] text-[var(--accent)]",
  success: "border-[color-mix(in_srgb,var(--success)_42%,transparent)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-[var(--success)]",
  warning: "border-[color-mix(in_srgb,var(--warning)_42%,transparent)] bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] text-[var(--warning)]",
  danger: "border-[color-mix(in_srgb,var(--danger)_42%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]",
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>{children}</span>;
}
