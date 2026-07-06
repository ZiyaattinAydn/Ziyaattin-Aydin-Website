import { Panel } from "@/components/ui/panel";

type StudioMockListItem = {
  title: string;
  meta: string;
  description: string;
};

type StudioMockListProps = {
  title: string;
  description?: string;
  items: readonly StudioMockListItem[];
};

export function StudioMockList({ title, description, items }: StudioMockListProps) {
  return (
    <Panel className="p-5">
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[var(--muted)]">{description}</p> : null}
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Mock</span>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {items.map((item) => (
          <article key={item.title} className="py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-medium">{item.title}</h3>
              <span className="font-mono text-xs text-[var(--accent)]">{item.meta}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
