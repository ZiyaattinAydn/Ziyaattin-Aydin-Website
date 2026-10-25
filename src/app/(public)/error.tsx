"use client";
export default function PublicError({ reset }: { reset: () => void }) {
  return (
    <section
      role="alert"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
    >
      <h1 className="text-2xl font-semibold">Sayfa yüklenemedi</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
        Bir süre sonra tekrar deneyebilirsin.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl border border-[var(--accent-dim)] px-5 py-3 text-sm text-[var(--accent)]"
      >
        Tekrar dene
      </button>
    </section>
  );
}
