type StudioPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
};

export function StudioPageHeader({ eyebrow, title, description, status }: StudioPageHeaderProps) {
  return (
    <header className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">{eyebrow}</p>
        {status ? (
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
            {status}
          </span>
        ) : null}
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">{description}</p>
    </header>
  );
}
