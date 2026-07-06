import type { ReactNode } from "react";
import { Panel } from "./panel";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, icon, className = "" }: EmptyStateProps) {
  return (
    <Panel className={`flex min-h-56 flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon ? <div className="mb-4 text-[var(--accent)]">{icon}</div> : null}
      <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>
      {description ? <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </Panel>
  );
}
