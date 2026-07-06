import type { PropsWithChildren } from "react";
import Link from "next/link";

type PublicSectionProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}>;

export function PublicSection({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Tümünü gör",
  children,
}: PublicSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          {eyebrow ? (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h2>
          {description ? <p className="text-sm leading-6 text-[var(--muted)] sm:text-base">{description}</p> : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex w-fit items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] transition hover:border-[var(--accent-dim)]"
          >
            {linkLabel} →
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
