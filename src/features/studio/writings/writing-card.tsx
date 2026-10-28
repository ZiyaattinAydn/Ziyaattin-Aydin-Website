import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { StudioStatusPill } from "@/components/studio/studio-status-pill";
import type { WritingEntity } from "@/features/writings/domain";
import {
  formatWritingDate,
  WRITING_PUBLISH_STATE_LABELS,
  WRITING_PUBLISH_STATE_TONES,
  WRITING_VISIBILITY_LABELS,
} from "@/features/studio/writings/writing-presentation";

export function WritingCard({ writing }: { writing: WritingEntity }) {
  return (
    <Panel className="p-5">
      <article className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="break-all font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              {writing.slug}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
              {writing.title}
            </h2>
          </div>
          <div className="shrink-0 self-start">
          <StudioStatusPill
            tone={WRITING_PUBLISH_STATE_TONES[writing.publishState]}
          >
            {WRITING_PUBLISH_STATE_LABELS[writing.publishState]}
          </StudioStatusPill>
          </div>
        </div>

        <p className="text-sm leading-7 text-[var(--muted)]">
          {writing.excerpt || "Bu yazı için henüz özet girilmedi."}
        </p>

        {writing.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {writing.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <dl className="grid gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Kategori
            </dt>
            <dd className="mt-1 text-sm">
              {writing.category || "Genel"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Görünürlük
            </dt>
            <dd className="mt-1 text-sm">
              {WRITING_VISIBILITY_LABELS[writing.visibility]}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Okuma süresi
            </dt>
            <dd className="mt-1 text-sm">
              {writing.readingTime ? `${writing.readingTime} dk` : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Güncellendi
            </dt>
            <dd className="mt-1 text-sm">
              {formatWritingDate(writing.updatedAt)}
            </dd>
          </div>
        </dl>

        <Link
          href={`/studio/writings/${writing.id}/edit`}
          className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-dim)] hover:text-[var(--accent)]"
        >
          {writing.publishState === "archived"
            ? "Arşiv kaydını görüntüle"
            : "Yazıyı düzenle"}
        </Link>
      </article>
    </Panel>
  );
}
