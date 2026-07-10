"use client";

import Link from "next/link";
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
      <div className="mx-auto grid min-h-screen max-w-[1600px] md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[var(--border)] bg-[rgba(3,7,10,0.72)] p-6 md:block">
          <Link href="/" className="font-mono text-3xl font-bold text-[var(--accent)]">
            Z.
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Özel Studio</p>
          <p className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs leading-6 text-[var(--muted)]">
            Bu kabuk gerçek auth uygulaması değildir. Supabase Auth ve MFA sonraki güvenlik fazında bağlanacak.
          </p>
          <nav className="mt-8 space-y-2" aria-label="Studio masaüstü navigasyonu">
            {studioNavItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
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
              <Link href="/studio" className="font-mono text-2xl font-bold text-[var(--accent)]">
                Z. Studio
              </Link>
              <Link href="/login" className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">
                Login
              </Link>
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Studio mobil navigasyonu">
              {studioNavItems.map((item) => {
                const active = isActiveRoute(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
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

          <main className="p-4 sm:p-6 lg:p-10">
            <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[rgba(18,217,120,0.04)] px-4 py-3 text-xs leading-6 text-[var(--muted)] sm:text-sm">
              <strong className="text-[var(--foreground)]">Studio Sprint 04:</strong> Bu ekranlar Auth/MFA/RLS karar planı ve mock workflow hazırlığıdır; gerçek login,
              MFA, route guard, database, CRUD, publish ve storage henüz uygulanmadı.
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
