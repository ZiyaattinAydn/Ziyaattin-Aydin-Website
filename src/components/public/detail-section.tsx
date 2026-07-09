import type { PropsWithChildren } from "react";
import { Panel } from "@/components/ui/panel";

type DetailSectionProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  items?: string[];
}>;

export function DetailSection({ eyebrow, title, description, items, children }: DetailSectionProps) {
  return (
    <Panel className="p-5 sm:p-6">
      {eyebrow ? (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--foreground)]">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p> : null}
      {items?.length ? (
        <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </Panel>
  );
}
