"use client";

import Link from "next/link";
import { StudioSessionControls } from "./studio-session-controls";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { studioNavItems } from "@/features/studio/studio-content";

function isActiveRoute(pathname: string, href: string) {
  if (href === "/studio") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function StudioShell({ children }: PropsWithChildren) {
  const pathname = usePathname() ?? "";

  return (
    <div className="min-h-screen bg-code-grid text-[var(--foreground)]">
      <a
        href="#studio-content"
        className="sr-only focus:not-sr-only focus:block focus:p-4"
      >
        İçeriğe geç
      </a>
      <div className="mx-auto grid min-h-screen max-w-[1600px] md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[var(--border)] bg-[rgba(3,7,10,0.72)] p-6 md:block">
          <Link
            href="/"
            className="font-mono text-3xl font-bold text-[var(--accent)]"
          >
            Z.
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Özel Studio
          </p>
          <nav
            className="mt-8 space-y-2"
            aria-label="Studio masaüstü navigasyonu"
          >
            {studioNavItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl border px-4 py-3 text-sm transition-colors ${
                    active
                      ? "border-[var(--accent-dim)] bg-[rgba(18,217,120,0.08)] text-[var(--foreground)]"
                      : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(3,7,10,0.9)] px-4 py-4 backdrop-blur md:hidden">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/studio"
                className="font-mono text-2xl font-bold text-[var(--accent)]"
              >
                Z. Studio
              </Link>
              <StudioSessionControls />
            </div>
            <nav
              className="mt-4 flex gap-2 overflow-x-auto pb-1"
              aria-label="Studio mobil navigasyonu"
            >
              {studioNavItems.map((item) => {
                const active = isActiveRoute(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 rounded-full border px-3 py-2 text-xs ${
                      active
                        ? "border-[var(--accent-dim)] bg-[rgba(18,217,120,0.1)] text-[var(--foreground)]"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
                    }`}
                  >
                    {item.shortLabel}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main id="studio-content" className="p-4 sm:p-6 lg:p-10">
            <div className="mb-6 hidden md:block">
              <StudioSessionControls />
            </div>
            {children}
            <details className="mt-8 rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted)]">
              <summary className="cursor-pointer">
                Telefonda ana ekrana ekle
              </summary>
              <p className="mt-3 leading-7">
                Android: Tarayıcı menüsünden Uygulamayı yükle veya Ana ekrana
                ekle. iPhone: Safari paylaş menüsünden Ana Ekrana Ekle. Studio
                için internet bağlantısı gerekir.
              </p>
            </details>
          </main>
        </div>
      </div>
    </div>
  );
}
