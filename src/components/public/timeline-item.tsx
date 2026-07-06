import Link from "next/link";
import type { JourneyItem } from "@/data/mock-content";
import { Panel } from "@/components/ui/panel";

export function TimelineItem({ item }: { item: JourneyItem }) {
  const href = item.relatedProjectSlug
    ? `/projects/${item.relatedProjectSlug}`
    : item.relatedWritingSlug
      ? `/writings/${item.relatedWritingSlug}`
      : undefined;

  return (
    <div className="relative pl-8 before:absolute before:left-2 before:top-2 before:h-full before:w-px before:bg-[var(--border)] last:before:hidden">
      <span className="absolute left-0 top-2 h-4 w-4 rounded-full border border-[var(--accent)] bg-[var(--background)]" />
      <Panel className="p-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{item.marker}</p>
        <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Öğrenilen not</p>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{item.lesson}</p>
        </div>
        {href ? (
          <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]">
            İlgili public kayıt →
          </Link>
        ) : null}
      </Panel>
    </div>
  );
}
