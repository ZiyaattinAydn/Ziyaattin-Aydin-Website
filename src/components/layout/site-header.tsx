"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-mono text-3xl font-bold text-[var(--accent)]" aria-label="Ana sayfa">
          Z.
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Ana navigasyon">
          {siteConfig.navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-5 text-sm transition-colors ${active ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--accent)]" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <span className="hidden sm:inline">Palet 2</span>
          <span aria-hidden="true" className="rounded-full border border-[var(--border)] px-3 py-1">●</span>
        </div>
      </div>
    </header>
  );
}
