export function StudioSessionControls() {
  return (
    <div className="fixed right-4 top-4 z-50 flex gap-2">
      <a
        href="/mfa?next=/studio"
        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted)] shadow-lg hover:text-[var(--foreground)]"
      >
        MFA cihazları
      </a>
      <form action="/auth/logout" method="post">
        <button
          type="submit"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted)] shadow-lg hover:text-[var(--foreground)]"
        >
          Güvenli çıkış
        </button>
      </form>
    </div>
  );
}
