import Link from "next/link";

export function StudioSessionControls() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link
        href="/"
        className="rounded-xl border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.08)] px-3 py-2 text-xs font-semibold text-[var(--accent)] shadow-lg hover:bg-[rgba(18,217,120,0.15)]"
      >
        Siteyi görüntüle ↗
      </Link>
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
