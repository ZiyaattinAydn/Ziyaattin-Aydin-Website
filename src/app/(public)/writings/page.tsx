import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { WritingExplorer } from "@/components/public/writing-explorer";
import { publishStateLabels, visibilityLabels, writings } from "@/data/mock-content";

export default function WritingsPage() {
  const featured = writings.find((writing) => writing.isFeatured) ?? writings[0];

  return (
    <div className="space-y-8 overflow-hidden">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] px-5 py-8 sm:px-8 lg:grid lg:grid-cols-[1fr_.72fr] lg:items-center lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(18,217,120,.12),transparent_26rem)]" />
        <div className="relative z-10 max-w-2xl">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Yazılar · Mock yayın alanı
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Yazılarım</h1>
          <p className="mt-5 text-base leading-8 text-[var(--muted)] sm:text-lg">
            Yazılım, yapay zekâ, ürün ve öğrenme notları için okunabilir public makale alanı. Bu sprintteki metinler gerçek yayın değil, sayfa deneyimini test eden geçici taslak içeriktir.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1">
              {writings.length} mock yazı
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1">
              Filtre + arama
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1">
              Mobil okunabilirlik
            </span>
          </div>
        </div>
        <div className="relative z-10 mt-8 h-72 lg:mt-0 lg:h-96">
          <Image
            src="/images/portraits/writings-hero.png"
            alt="Yazılar sayfası için aday görsel"
            fill
            sizes="(max-width:1024px) 100vw, 40vw"
            className="object-contain object-bottom"
          />
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Öne çıkan yazı</p>
        <Panel className="grid gap-6 p-5 md:grid-cols-[minmax(0,280px)_1fr] md:p-6">
          <div className="flex min-h-44 items-end rounded-2xl border border-[var(--border)] bg-[radial-gradient(circle_at_40%_20%,rgba(18,217,120,.24),transparent_55%),#06100c] p-5">
            <p className="font-mono text-sm font-semibold text-[var(--accent)]">{featured.coverLabel}</p>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm text-[var(--accent)]">{featured.category}</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{featured.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">{featured.excerpt}</p>
            <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-xs leading-5 text-[var(--muted)]">
              {featured.sourceNote}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {featured.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-xs text-[var(--muted)]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readingTime}</span>
              <span>·</span>
              <span>{publishStateLabels[featured.publishState]}</span>
              <span>·</span>
              <span>{visibilityLabels[featured.visibility]}</span>
              <Link href={`/writings/${featured.slug}`} className="font-semibold text-[var(--accent)]">
                Oku →
              </Link>
            </div>
          </div>
        </Panel>
      </section>

      <WritingExplorer writings={writings} />
    </div>
  );
}
