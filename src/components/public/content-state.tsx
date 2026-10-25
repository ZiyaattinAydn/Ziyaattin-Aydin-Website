import Link from "next/link";
export function PublicEmptyState({
  title,
  description,
  href,
  linkLabel,
  headingLevel = 2,
}: {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-10 sm:px-8">
      <span
        aria-hidden="true"
        className="mb-5 block h-1 w-9 rounded-full bg-[var(--accent)]"
      />
      <Heading className="text-xl font-semibold tracking-tight">
        {title}
      </Heading>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
        {description}
      </p>
      {href && linkLabel && (
        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]"
        >
          {linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
export function PublicUnavailable({ href }: { href: string }) {
  return (
    <section
      role="alert"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
    >
      <h2 className="text-xl font-semibold">İçerik şu anda yüklenemiyor</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        Lütfen biraz sonra tekrar dene.
      </p>
      <a
        href={href}
        className="mt-5 inline-flex rounded-xl border border-[var(--border)] px-4 py-3 text-sm hover:border-[var(--accent-dim)]"
      >
        Yeniden dene
      </a>
    </section>
  );
}
