type ProgressBarTone = "accent" | "success" | "warning" | "danger";

type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  helper?: string;
  tone?: ProgressBarTone;
  className?: string;
};

const toneClasses: Record<ProgressBarTone, string> = {
  accent: "bg-[var(--accent)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-[var(--danger)]",
};

export function ProgressBar({ value, max = 100, label, helper, tone = "accent", className = "" }: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100;
  const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));
  const roundedPercentage = Math.round(percentage);

  return (
    <div className={className}>
      {label || helper ? (
        <div className="mb-2 flex items-end justify-between gap-4 text-sm">
          {label ? <span className="font-medium text-[var(--foreground)]">{label}</span> : <span />}
          {helper ? <span className="text-xs text-[var(--muted)]">{helper}</span> : null}
        </div>
      ) : null}
      <div
        className="h-2 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-strong)]"
        role="progressbar"
        aria-valuenow={roundedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "İlerleme"}
      >
        <div className={`h-full rounded-full ${toneClasses[tone]}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
