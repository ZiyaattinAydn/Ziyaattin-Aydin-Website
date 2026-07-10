import Link from "next/link";
import type { WritingSummary } from "@/features/public/content/model";
import { publishStateLabels } from "@/features/public/content/model";
import { Panel } from "@/components/ui/panel";
import { PublishStatusNote } from "@/components/public/publish-status-note";

export function WritingCard({ writing }: { writing: WritingSummary }) {
  return (
    <Panel className="group flex h-full min-w-0 flex-col p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent-dim)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {writing.category}
        </p>
        <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
          {publishStateLabels[writing.publishState]}
        </span>
      </div>
      <h2 className="mt-4 text-xl font-semibold leading-snug break-words">{writing.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">{writing.excerpt}</p>
      <div className="mt-4">
        <PublishStatusNote
          publishFlowState={writing.publishFlowState}
          visibility={writing.visibility}
          sourceNote={writing.sourceNote}
          approvalNote={writing.approvalNote}
          compact
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {writing.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs text-[var(--muted)]">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
        <span>{writing.date}</span>
        <span>{writing.readingTime}</span>
        <Link
          href={`/writings/${writing.slug}`}
          className="text-sm font-semibold text-[var(--accent)] transition group-hover:translate-x-0.5"
        >
          Oku →
        </Link>
      </div>
    </Panel>
  );
}
