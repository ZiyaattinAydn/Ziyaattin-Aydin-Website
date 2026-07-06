import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,black)] py-7 text-sm text-[var(--muted)]">
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-medium text-[var(--foreground)]">© 2026 {siteConfig.owner}. Tüm hakları saklıdır.</p>
            <p className="mt-2 max-w-xl leading-6">Public site ve özel Studio aynı ürün çatısı altında geliştiriliyor.</p>
          </div>

          <div className="flex flex-wrap gap-3 sm:justify-end">
            <FooterPlaceholder label="E-posta" />
            <FooterPlaceholder label="GitHub" />
            <FooterPlaceholder label="LinkedIn" />
            <Link
              href="/login"
              className="rounded-full border border-[var(--border)] px-3 py-1.5 transition hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
            >
              Yönetici Girişi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterPlaceholder({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted)]" title="Gerçek bağlantı doğrulandıktan sonra eklenecek">
      {label} yakında
    </span>
  );
}
