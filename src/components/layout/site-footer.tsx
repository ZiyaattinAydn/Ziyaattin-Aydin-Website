import Link from "next/link";
import { siteConfig, type SiteExternalLink } from "@/lib/site-config";
export function SiteFooter() {
  const links = (
    [
      ...siteConfig.contactLinks,
      ...siteConfig.socialLinks,
    ] as SiteExternalLink[]
  ).filter((item) => item.status === "verified" && item.href);
  return (
    <footer className="mt-8 border-t border-[var(--border)] bg-[var(--background)] py-8 sm:py-10">
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <Link href="/" className="text-base font-semibold tracking-tight">
            Ziyaattin Aydın<span className="text-[var(--accent)]">.</span>
          </Link>
          <p className="mt-2 text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} · Kişisel web sitesi
          </p>
        </div>
        <nav
          aria-label="Alt navigasyon"
          className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-[var(--muted)]"
        >
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href!}
              className="hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://github.com/ZiyaattinAydn/Ziyaattin-Aydin-Website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--foreground)]"
          >
            Kaynak kodu <span aria-hidden="true">↗</span>
            <span className="sr-only"> (yeni sekmede)</span>
          </a>
          <Link href="/about" className="hover:text-[var(--foreground)]">
            Hakkımda
          </Link>
          <Link
            href={siteConfig.adminEntry.href}
            className="text-xs hover:text-[var(--foreground)]"
          >
            Studio
          </Link>
        </nav>
      </div>
    </footer>
  );
}
