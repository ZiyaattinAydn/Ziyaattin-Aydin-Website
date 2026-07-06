import Link from "next/link";
import type { WritingSummary } from "@/data/mock-content";
import { Panel } from "@/components/ui/panel";

export function WritingCard({ writing }: { writing: WritingSummary }) {
  return (
    <Panel className="group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent-dim)]">
      <div className="flex items-start justify-between gap-4">
        <p className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {writing.category}
        </p>
        <span className="shrink-0 text-xs text-[var(--muted)]">{writing.readingTime}</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold leading-snug">{writing.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">{writing.excerpt}</p>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
        <span>{writing.date}</span>
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
