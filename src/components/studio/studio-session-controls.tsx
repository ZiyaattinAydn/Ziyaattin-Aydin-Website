export function StudioSessionControls() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <a
        href="/mfa?next=/studio"
        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted)] shadow-lg hover:text-[var(--foreground)]"
      >
        Güvenlik
      </a>
      <form action="/auth/logout" method="post">
        <button
          type="submit"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted)] shadow-lg hover:text-[var(--foreground)]"
        >
          Çıkış yap
        </button>
      </form>
    </div>
  );
}
