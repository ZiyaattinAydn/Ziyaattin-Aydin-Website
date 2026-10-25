export default function PublicLoading() {
  return (
    <div role="status" className="space-y-5 py-8">
      <span className="sr-only">Sayfa yükleniyor…</span>
      <div
        aria-hidden="true"
        className="h-3 w-24 rounded bg-[var(--accent-soft)]"
      />
      <div
        aria-hidden="true"
        className="h-10 w-3/4 max-w-lg rounded-xl bg-[var(--surface-strong)]"
      />
      <div
        aria-hidden="true"
        className="h-44 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
      />
    </div>
  );
}
