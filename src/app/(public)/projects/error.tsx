"use client";

import { Panel } from "@/components/ui/panel";

export default function ProjectsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-8">
      <Panel className="p-8 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Public projeler
        </p>
        <h1 className="mt-3 text-2xl font-semibold">
          Projeler geçici olarak yüklenemiyor
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Kayıtların durumu veya sistem ayrıntıları paylaşılmadan güvenli
          bir hata sınırı gösteriliyor. Bir süre sonra tekrar deneyebilirsin.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--accent-dim)]"
        >
          Tekrar dene
        </button>
      </Panel>
    </div>
  );
}
