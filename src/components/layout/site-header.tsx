"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
export function SiteHeader() {
  const pathname = usePathname(),
    [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname,
    button = useRef<HTMLButtonElement>(null),
    header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPath(null);
        button.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (header.current && !header.current.contains(event.target as Node))
        setOpenPath(null);
    }
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [menuOpen]);
  function navLink(
    item: (typeof siteConfig.navigation)[number],
    mobile = false,
  ) {
    const active =
      item.href === "/"
        ? pathname === "/"
        : pathname.startsWith(item.href + "/") || pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpenPath(null)}
        className={
          mobile
            ? "rounded-xl px-4 py-3 text-sm " +
              (active
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]")
            : "border-b-2 py-6 text-sm transition-colors " +
              (active
                ? "border-[var(--accent)] text-[var(--foreground)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]")
        }
      >
        {item.label}
      </Link>
    );
  }
  return (
    <header
      ref={header}
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur-xl"
    >
      <a
        href="#public-content"
        className="sr-only rounded-xl bg-[var(--background)] text-[var(--accent)] focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:px-4 focus:py-3"
      >
        İçeriğe geç
      </a>
      <div className="mx-auto flex min-h-[76px] max-w-[var(--container-max)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setOpenPath(null)}
          className="font-mono text-3xl font-bold text-[var(--accent)]"
          aria-label="Ziyaattin Aydın — ana sayfa"
        >
          Z.
        </Link>
        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Ana navigasyon"
        >
          {siteConfig.navigation.map((item) => navLink(item))}
        </nav>
        <button
          ref={button}
          type="button"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-public-navigation"
          onClick={() => setOpenPath(menuOpen ? null : pathname)}
        >
          {menuOpen ? "Kapat" : "Menü"}
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-public-navigation"
          className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-[var(--border)] p-4 md:hidden"
          aria-label="Mobil ana navigasyon"
        >
          <div className="mx-auto grid max-w-[var(--container-max)] gap-1">
            {siteConfig.navigation.map((item) => navLink(item, true))}
          </div>
        </nav>
      )}
    </header>
  );
}
