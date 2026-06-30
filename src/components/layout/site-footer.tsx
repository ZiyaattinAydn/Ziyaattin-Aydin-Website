import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-6 text-sm text-[var(--muted)]">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© 2026 Ziyaattin. Tüm hakları saklıdır.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/login" className="hover:text-[var(--foreground)]">Yönetici Girişi</Link>
          <a href="mailto:hello@example.com" className="hover:text-[var(--foreground)]">E-posta</a>
          <span>GitHub</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  );
}
