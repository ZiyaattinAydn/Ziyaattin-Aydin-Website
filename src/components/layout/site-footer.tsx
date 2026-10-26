import Link from "next/link";
import { siteConfig, type SiteExternalLink } from "@/lib/site-config";
import { readPublishedSiteProfile } from "@/features/public/content/published-profile";
export async function SiteFooter() {
  const profile = await readPublishedSiteProfile();
  const links = (
    [
      ...siteConfig.contactLinks,
      ...siteConfig.socialLinks,
    ] as SiteExternalLink[]
  ).filter((item) => item.status === "verified" && item.href);
  const publishedLinks = [
    profile?.email ? { label: "E-posta", href: "mailto:" + profile.email } : null,
    profile?.githubUrl ? { label: "GitHub", href: profile.githubUrl } : null,
    profile?.linkedinUrl ? { label: "LinkedIn", href: profile.linkedinUrl } : null,
  ].filter((item): item is { label: string; href: string } => Boolean(item));
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
          {publishedLinks.map((item) => <a key={item.label} href={item.href}
            className="hover:text-[var(--foreground)]"
            rel={item.href.startsWith("https:") ? "noopener noreferrer" : undefined}
            target={item.href.startsWith("https:") ? "_blank" : undefined}>{item.label}</a>)}
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
