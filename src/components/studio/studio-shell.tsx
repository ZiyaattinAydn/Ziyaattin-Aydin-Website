import Link from "next/link";
import type { PropsWithChildren } from "react";

const items = [
  ["/studio", "Ana Panel"],
  ["/studio/projects", "Projeler"],
  ["/studio/tasks", "Görevler"],
  ["/studio/notes", "Notlar"],
  ["/studio/files", "Dosyalar"],
] as const;

export function StudioShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-[var(--border)] p-6 md:block">
          <Link href="/" className="font-mono text-3xl font-bold text-[var(--accent)]">Z.</Link>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Özel Studio</p>
          <nav className="mt-8 space-y-2">
            {items.map(([href, label]) => (
              <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
