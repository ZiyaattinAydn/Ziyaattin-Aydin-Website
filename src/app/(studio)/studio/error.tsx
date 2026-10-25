"use client";
export default function StudioError({ reset }: { reset: () => void }) {
  return (
    <section
      role="alert"
      className="space-y-4 rounded-2xl border border-[var(--border)] p-6"
    >
      <h2 className="text-xl font-semibold">Bu sayfa yüklenemedi</h2>
      <p className="text-sm text-[var(--muted)]">
        Bağlantını kontrol et. Sorun sürerse yeniden giriş yap.
      </p>
      <button
        onClick={reset}
        className="rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-sm text-[var(--accent)]"
      >
        Tekrar dene
      </button>
    </section>
  );
}
