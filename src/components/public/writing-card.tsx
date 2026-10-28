import { ContentImage } from "@/components/public/content-image";
import Link from "next/link";
import type { WritingSummary } from "@/features/public/content/model";
import { Panel } from "@/components/ui/panel";
export function WritingCard({ writing }: { writing: WritingSummary }) {
  return (
    <Panel className="group flex h-full min-w-0 flex-col p-4 sm:p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-dim)]">
      {writing.coverImage && <div className="mb-5"><ContentImage src={writing.coverImage.src} alt={writing.coverImage.alt}/></div>}
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--accent)]">
        {writing.category}
      </p>
      <h3 className="mt-3 break-words text-xl font-semibold sm:mt-4 sm:text-2xl leading-snug tracking-tight">
        <Link
          href={"/writings/" + writing.slug}
          className="hover:text-[var(--accent)]"
        >
          {writing.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-5 flex-1 break-words text-sm leading-7 text-[var(--muted)] sm:mt-4 sm:line-clamp-none">
        {writing.excerpt}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)]">
        <span>
          {writing.date}
          {writing.readingTime ? " · " + writing.readingTime : ""}
        </span>
        <Link
          href={"/writings/" + writing.slug}
          className="text-sm font-semibold text-[var(--accent)]"
        >
          Yazıyı oku <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Panel>
  );
}
