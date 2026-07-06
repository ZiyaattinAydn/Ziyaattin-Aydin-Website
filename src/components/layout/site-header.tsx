"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-[var(--container-max)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-mono text-3xl font-bold text-[var(--accent)] transition hover:brightness-110"
          aria-label="Ana sayfa"
        >
          Z.
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Ana navigasyon">
          {siteConfig.navigation.map((item) => (
            <NavigationLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-sm text-[var(--muted)] sm:flex" aria-label="Varsayılan tema Palet 2">
            <span>Palet 2</span>
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_18px_var(--accent-dim)]" />
          </div>

          <button
            type="button"
            className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-public-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? "Kapat" : "Menü"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-public-navigation" className="border-t border-[var(--border)] px-4 pb-4 pt-2 md:hidden" aria-label="Mobil ana navigasyon">
          <div className="mx-auto grid max-w-[var(--container-max)] gap-2">
            {siteConfig.navigation.map((item) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
                mobile
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

type NavigationLinkProps = {
  href: string;
  label: string;
  pathname: string;
  mobile?: boolean;
  onClick?: () => void;
};

function NavigationLink({ href, label, pathname, mobile = false, onClick }: NavigationLinkProps) {
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={
        mobile
          ? `rounded-xl px-4 py-3 text-sm transition ${
              active
                ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            }`
          : `relative py-5 text-sm transition-colors ${
              active ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`
      }
    >
      {label}
      {!mobile && active ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--accent)]" aria-hidden="true" /> : null}
    </Link>
  );
}
