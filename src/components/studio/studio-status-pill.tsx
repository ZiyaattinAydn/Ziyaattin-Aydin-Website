import type { StudioStatusTone } from "@/features/studio/studio-content";

type StudioStatusPillProps = {
  children: string;
  tone?: StudioStatusTone;
};

const toneClassNames: Record<StudioStatusTone, string> = {
  success: "border-[var(--accent-dim)] bg-[rgba(18,217,120,0.08)] text-[var(--accent)]",
  warning: "border-[#8a6b2a] bg-[rgba(245,158,11,0.08)] text-[#f0c46b]",
  info: "border-[#2f6f8f] bg-[rgba(56,189,248,0.08)] text-[#8bd3f7]",
  muted: "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]",
};

export function StudioStatusPill({ children, tone = "muted" }: StudioStatusPillProps) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${toneClassNames[tone]}`}>
      {children}
    </span>
  );
}
