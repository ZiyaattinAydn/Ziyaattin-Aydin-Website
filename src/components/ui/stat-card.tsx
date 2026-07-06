import type { ReactNode } from "react";
import { Panel } from "./panel";

type StatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, helper, icon, className = "" }: StatCardProps) {
  return (
    <Panel className={`p-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
        </div>
        {icon ? <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-[var(--accent)]">{icon}</div> : null}
      </div>
      {helper ? <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{helper}</p> : null}
    </Panel>
  );
}
