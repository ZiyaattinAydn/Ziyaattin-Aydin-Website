import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { ProjectCard } from "@/components/public/project-card";
import { journeyItems, projects, writings } from "@/data/mock-content";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="relative min-h-[420px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[linear-gradient(115deg,rgba(4,8,10,.98)_0%,rgba(4,8,10,.9)_48%,rgba(0,190,100,.08)_100%)] px-6 py-10 sm:px-10 lg:grid lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-14">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div>
            <p className="text-lg text-[var(--accent)]">Merhaba, ben</p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">Ziyaattin<span className="text-[var(--accent)]">.</span></h1>
          </div>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
            Dijital ürünler geliştiriyor, öğreniyor ve <span className="text-[var(--accent)]">yolculuğumu</span> paylaşıyorum.
          </h2>
          <p className="max-w-xl leading-7 text-[var(--muted)]">Web uygulamaları geliştiriyor, yapay zekâ destekli çözümler üretiyor ve kullanıcı odaklı deneyimler tasarlıyorum.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[#021108]">Projelerimi İncele</Link>
            <Link href="/writings" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 font-semibold">Yazılarımı Oku</Link>
          </div>
          <p className="text-sm text-[var(--muted)]">Birlikte çalışalım: <span className="text-[var(--accent)]">● Uygun</span></p>
        </div>
        <div className="relative mt-8 min-h-[340px] lg:mt-0 lg:h-full">
          <Image src="/images/portraits/home-hero.png" alt="Ziyaattin'in stilize portresi" fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-contain object-bottom" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">● Devam Eden Projeler</h2><Link href="/projects" className="text-sm text-[var(--accent)]">Tümünü Gör →</Link></div>
          <div className="grid gap-4 md:grid-cols-3">{projects.slice(0, 3).map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
        </Panel>
        <Panel className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">● Yazılar</h2><Link href="/writings" className="text-sm text-[var(--accent)]">Tüm Yazılar ({writings.length}) →</Link></div>
          <div className="divide-y divide-[var(--border)]">{writings.map((writing) => <Link key={writing.slug} href={`/writings/${writing.slug}`} className="block py-4"><p className="font-medium">{writing.title}</p><p className="mt-1 text-xs text-[var(--muted)]">{writing.date} · {writing.readingTime} okuma</p></Link>)}</div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <Panel className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">● Projeler</h2><Link href="/projects" className="text-sm text-[var(--accent)]">Tüm Projeler ({projects.length}) →</Link></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{projects.map((project) => <Link key={project.slug} href={`/projects/${project.slug}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4"><p className="font-medium">{project.title}</p><p className="mt-2 text-xs text-[var(--muted)]">{project.description}</p></Link>)}</div></Panel>
        <Panel className="p-5 sm:p-6"><h2 className="font-semibold">● Dijital Pano</h2><div className="mt-5 grid grid-cols-2 gap-3"><Metric value="12+" label="Proje"/><Metric value="8" label="Yazı"/><Metric value="3" label="Aktif Proje"/><Metric value="730+" label="Günlük Öğrenme"/></div></Panel>
      </div>

      <Panel className="p-5 sm:p-6"><h2 className="font-semibold">● Yolculuğumdan Öne Çıkanlar</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{journeyItems.map((item) => <div key={item.year} className="border-t border-[var(--accent-dim)] pt-4"><p className="font-mono text-[var(--accent)]">{item.year}</p><p className="mt-2 text-sm font-medium">{item.title}</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.detail}</p></div>)}</div></Panel>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-center"><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-[var(--muted)]">{label}</p></div>;
}
