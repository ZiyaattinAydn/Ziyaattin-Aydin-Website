import { Panel } from "@/components/ui/panel";

type StudioStatusCardProps = {
  label: string;
  value: string;
  helper: string;
  detail: string;
};

export function StudioStatusCard({ label, value, helper, detail }: StudioStatusCardProps) {
  return (
    <Panel className="p-5">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <strong className="font-mono text-3xl text-[var(--foreground)]">{value}</strong>
        <span className="rounded-full border border-[var(--accent-dim)] px-3 py-1 text-[11px] text-[var(--accent)]">
          {helper}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{detail}</p>
    </Panel>
  );
}
