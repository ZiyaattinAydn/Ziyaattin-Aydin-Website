import type { JourneyItem } from "@/features/public/content/model";
import { Panel } from "@/components/ui/panel";
export function TimelineCard({
  item,
  compact = false,
}: {
  item: JourneyItem;
  compact?: boolean;
}) {
  return (
    <Panel className="p-6 sm:p-8">
      <p className="font-mono text-xs tracking-[0.14em] text-[var(--accent)]">
        {item.marker}
      </p>
      <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
        {item.title}
      </h2>
      <p className="mt-4 whitespace-pre-wrap break-words text-base leading-8 text-[var(--muted)]">
        {item.detail}
      </p>
      {!compact && item.lesson && (
        <p className="mt-5 whitespace-pre-wrap break-words border-t border-[var(--border)] pt-5 text-sm leading-7 text-[var(--muted)]">
          {item.lesson}
        </p>
      )}
    </Panel>
  );
}
