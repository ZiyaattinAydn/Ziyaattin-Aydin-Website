import type { ElementType, ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  as?: ElementType;
  className?: string;
  contentClassName?: string;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  as: Component = "section",
  className = "",
  contentClassName = "",
}: SectionShellProps) {
  return (
    <Component className={`space-y-6 ${className}`}>
      {eyebrow || title || description || actions ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">{eyebrow}</p> : null}
            {title ? <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">{title}</h2> : null}
            {description ? <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className={contentClassName}>{children}</div>
    </Component>
  );
}
