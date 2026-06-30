type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
};

export function PageIntro({ eyebrow, title, description, meta }: PageIntroProps) {
  return (
    <div className="max-w-2xl space-y-4">
      {eyebrow ? (
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
        {title}
      </h1>
      <p className="max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">{description}</p>
      {meta ? <p className="text-sm font-medium text-[var(--accent)]">● {meta}</p> : null}
    </div>
  );
}
