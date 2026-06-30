import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";
import { projects } from "@/data/mock-content";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <Link href="/projects" className="text-sm text-[var(--accent)]">← Projelere dön</Link>
      <section className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="space-y-5"><p className="text-sm text-[var(--accent)]">● {project.status}</p><h1 className="text-5xl font-semibold tracking-tight">{project.title}</h1><p className="text-lg leading-8 text-[var(--muted)]">{project.description} Karmaşık verileri anlaşılır içgörülere dönüştürmek için tasarlandı.</p><div className="flex flex-wrap gap-2">{project.technologies.map((technology) => <Tag key={technology}>{technology}</Tag>)}</div><div className="flex gap-3"><button className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[#021108]">Canlı Önizleme</button><button className="rounded-xl border border-[var(--border)] px-5 py-3">GitHub&apos;da Görüntüle</button></div></div>
        <Panel className="min-h-[330px] bg-[radial-gradient(circle_at_50%_40%,rgba(0,210,110,.2),transparent_55%),var(--surface)] p-8"><div className="h-full rounded-xl border border-[var(--accent-dim)] bg-[linear-gradient(145deg,#07130e,#050708)] p-5"><p className="font-mono text-sm text-[var(--accent)]">dashboard.preview()</p><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{["1.284", "%92.4", "2.4s", "320"].map((value) => <div key={value} className="rounded-lg border border-[var(--border)] p-4"><p className="text-xl font-semibold">{value}</p><p className="mt-1 text-xs text-[var(--muted)]">Örnek metrik</p></div>)}</div><div className="mt-6 h-28 rounded-lg border border-[var(--border)] bg-[linear-gradient(165deg,transparent_45%,rgba(0,210,110,.28)_46%,transparent_49%)]" /></div></Panel>
      </section>
      <div className="grid gap-5 lg:grid-cols-4">{[["Proje Özeti","Ürünün amacı, hedef kitlesi ve oluşturduğu değer."],["Problem","Dağınık veriyi anlamlı ve hızlı bir iş akışına dönüştürme ihtiyacı."],["Yaklaşım","Sade arayüz, güçlü veri modeli ve ölçülebilir kullanıcı deneyimi."],["Süreç & Kilometre Taşları","MVP, entegrasyon, beta geri bildirimi ve iyileştirmeler."]].map(([title, text]) => <Panel key={title} className="p-5"><h2 className="font-semibold text-[var(--accent)]">{title}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{text}</p></Panel>)}</div>
      <div className="grid gap-5 lg:grid-cols-3"><Panel className="p-5"><h2 className="font-semibold">Teknik Kararlar</h2><ul className="mt-4 space-y-2 text-sm text-[var(--muted)]"><li>• App Router ve Server Components</li><li>• TypeScript ile sıkı tip kontrolü</li><li>• RLS odaklı veri güvenliği</li></ul></Panel><Panel className="p-5"><h2 className="font-semibold">Öğrendiklerim</h2><ul className="mt-4 space-y-2 text-sm text-[var(--muted)]"><li>• Performans ölçümü</li><li>• Kullanıcı geri bildirimi</li><li>• Ölçeklenebilir mimari</li></ul></Panel><Panel className="p-5"><h2 className="font-semibold">Sıradaki Adım</h2><ul className="mt-4 space-y-2 text-sm text-[var(--muted)]"><li>• Gelişmiş filtreler</li><li>• Mobil iyileştirme</li><li>• Yeni AI modeli</li></ul></Panel></div>
    </div>
  );
}
