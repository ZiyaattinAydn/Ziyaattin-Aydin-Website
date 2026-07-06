import { Panel } from "@/components/ui/panel";

type StudioEmptyStateProps = {
  title: string;
  description: string;
  nextActions: readonly string[];
};

export function StudioEmptyState({ title, description, nextActions }: StudioEmptyStateProps) {
  return (
    <Panel className="p-6">
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[rgba(18,217,120,0.03)] p-6 sm:p-8">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--accent-dim)] font-mono text-sm text-[var(--accent)]">
          ∅
        </span>
        <h2 className="mt-5 text-2xl font-semibold">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{description}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {nextActions.map((action) => (
            <button
              key={action}
              disabled
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-left text-sm text-[var(--muted)] opacity-80"
              type="button"
            >
              <span className="block font-medium text-[var(--foreground)]">{action}</span>
              <span className="mt-1 block text-xs">Sonraki fazda bağlanacak</span>
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
