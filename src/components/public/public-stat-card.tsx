import { Panel } from "@/components/ui/panel";

type PublicStatCardProps = {
  value: string;
  label: string;
  note?: string;
};

export function PublicStatCard({ value, label, note }: PublicStatCardProps) {
  return (
    <Panel className="p-5">
      <p className="font-mono text-3xl font-semibold text-[var(--accent)]">{value}</p>
      <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{label}</p>
      {note ? <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{note}</p> : null}
    </Panel>
  );
}
