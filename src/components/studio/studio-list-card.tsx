import type { ReactNode } from "react";
import { Panel } from "@/components/ui/panel";
import { StudioStatusPill } from "@/components/studio/studio-status-pill";
import type { StudioStatusTone } from "@/features/studio/studio-content";

type DetailRow = {
  label: string;
  value: string;
};

type StudioListCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
  status?: string;
  tone?: StudioStatusTone;
  progress?: number;
  details?: readonly DetailRow[];
  tags?: readonly string[];
  actionLabel?: string;
  children?: ReactNode;
};

export function StudioListCard({
  title,
  description,
  eyebrow,
  status,
  tone = "muted",
  progress,
  details = [],
  tags = [],
  actionLabel,
  children,
}: StudioListCardProps) {
  return (
    <Panel className="p-5">
      <article className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{eyebrow}</p> : null}
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{title}</h2>
          </div>
          {status ? <StudioStatusPill tone={tone}>{status}</StudioStatusPill> : null}
        </div>

        <p className="text-sm leading-7 text-[var(--muted)]">{description}</p>

        {typeof progress === "number" ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Mock ilerleme</span>
              <span className="font-mono text-[var(--accent)]">%{progress}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        {details.length > 0 ? (
          <dl className="grid gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
            {details.map((detail) => (
              <div key={`${detail.label}-${detail.value}`}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">{detail.label}</dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">{detail.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {children}

        {actionLabel ? (
          <button
            disabled
            type="button"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-left text-sm text-[var(--muted)] opacity-80"
            title="Sonraki fazda bağlanacak"
          >
            <span className="block font-medium text-[var(--foreground)]">{actionLabel}</span>
            <span className="mt-1 block text-xs">Sonraki fazda bağlanacak · gerçek işlem yapmaz</span>
          </button>
        ) : null}
      </article>
    </Panel>
  );
}
