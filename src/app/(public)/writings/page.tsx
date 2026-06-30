import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { writings } from "@/data/mock-content";

export default function WritingsPage() {
  const featured = writings[0];
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] px-6 py-10 sm:px-10 lg:grid lg:grid-cols-[1fr_.8fr] lg:items-center">
        <div className="relative z-10"><p className="font-mono text-sm text-[var(--accent)]">BLOG</p><h1 className="mt-3 text-5xl font-semibold">Yazılarım</h1><p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted)]">Yazılım, yapay zekâ ve teknoloji yolculuğumda öğrendiğim şeyleri, deneyimlerimi ve notlarımı burada paylaşıyorum.</p><div className="mt-7 flex flex-wrap gap-3">{["Tümü", "Yazılım", "Yapay Zekâ", "Deneyimler", "Notlar"].map((item) => <button key={item} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm first:border-[var(--accent)] first:text-[var(--accent)]">{item}</button>)}</div></div>
        <div className="relative mt-8 h-72 lg:mt-0"><Image src="/images/portraits/writings-hero.png" alt="Ziyaattin'in yazılar sayfası portresi" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-contain object-bottom" /></div>
      </section>
      <div><p className="mb-4 text-sm font-semibold text-[var(--accent)]">★ ÖNE ÇIKAN YAZI</p><Panel className="grid gap-6 p-5 md:grid-cols-[300px_1fr]"><div className="min-h-44 rounded-xl border border-[var(--border)] bg-[radial-gradient(circle,rgba(0,220,120,.35),transparent_55%),#06100c]"/><div className="flex flex-col justify-center"><p className="text-sm text-[var(--accent)]">{featured.category}</p><h2 className="mt-2 text-2xl font-semibold">{featured.title}</h2><p className="mt-3 text-[var(--muted)]">{featured.excerpt}</p><Link href={`/writings/${featured.slug}`} className="mt-5 text-[var(--accent)]">Oku →</Link></div></Panel></div>
      <div><div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold text-[var(--accent)]">TÜM YAZILAR</p><button className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">En Yeni⌄</button></div><div className="grid gap-4 lg:grid-cols-3">{writings.concat(writings).map((writing, index) => <Panel key={`${writing.slug}-${index}`} className="p-5"><p className="text-xs font-semibold uppercase text-[var(--accent)]">{writing.category}</p><h2 className="mt-2 text-lg font-semibold">{writing.title}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-[var(--muted)]">{writing.excerpt}</p><div className="mt-5 flex items-center justify-between text-xs text-[var(--muted)]"><span>{writing.date} · {writing.readingTime}</span><Link href={`/writings/${writing.slug}`} className="text-lg text-[var(--accent)]">→</Link></div></Panel>)}</div></div>
    </div>
  );
}
