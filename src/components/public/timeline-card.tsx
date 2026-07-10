import Link from "next/link";
import type { JourneyItem } from "@/data/mock-content";
import { publishStateLabels } from "@/data/mock-content";
import { Panel } from "@/components/ui/panel";
import { PublishStatusNote } from "@/components/public/publish-status-note";

type TimelineCardProps = {
  item: JourneyItem;
  compact?: boolean;
};

export function TimelineCard({ item, compact = false }: TimelineCardProps) {
  const href = item.relatedProjectSlug
    ? `/projects/${item.relatedProjectSlug}`
    : item.relatedWritingSlug
      ? `/writings/${item.relatedWritingSlug}`
      : undefined;

  return (
    <Panel className={`h-full p-5 ${compact ? "" : "sm:p-6"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{item.marker}</p>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs text-[var(--muted)]">
          {item.statusNote}
        </span>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs text-[var(--muted)]">
          {publishStateLabels[item.publishState]}
        </span>
      </div>
      <h2 className="mt-3 text-xl font-semibold leading-snug">{item.title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
      <div className="mt-3">
        <PublishStatusNote
          publishFlowState={item.publishFlowState}
          visibility={item.visibility}
          sourceNote={item.sourceNote}
          approvalNote={item.approvalNote}
          compact={compact}
        />
      </div>
      {!compact ? (
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Öğrenilen not</p>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{item.lesson}</p>
        </div>
      ) : null}
      {href ? (
        <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]">
          İlgili public kayıt →
        </Link>
      ) : null}
    </Panel>
  );
}
