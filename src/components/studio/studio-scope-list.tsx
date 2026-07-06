import { Panel } from "@/components/ui/panel";

type StudioScopeListProps = {
  title: string;
  items: readonly string[];
};

export function StudioScopeList({ title, items }: StudioScopeListProps) {
  return (
    <Panel className="p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
