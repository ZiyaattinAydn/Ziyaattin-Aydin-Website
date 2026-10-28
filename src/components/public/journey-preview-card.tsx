import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import type { JourneyItem } from "@/features/public/content/model";

/** Compact homepage summary. The long narrative stays on /journey. */
export function JourneyPreviewCard({ item }: { item: JourneyItem }) {
  const href = item.slug ? `/journey#${item.slug}` : "/journey";
  return (
    <Panel className="flex h-full min-w-0 flex-col p-4 sm:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
        {item.marker}
      </p>
      <h3 className="mt-3 break-words text-xl font-semibold leading-snug tracking-tight">
        {item.title}
      </h3>
      <p className="mt-3 line-clamp-4 break-words text-sm leading-7 text-[var(--muted)]">
        {item.detail}
      </p>
      <div className="mt-auto border-t border-[var(--border)] pt-5">
        <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline">
          Hikâyeyi oku <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Panel>
  );
}
