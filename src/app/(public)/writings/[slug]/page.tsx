import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/panel";
import { writings } from "@/data/mock-content";

export default async function WritingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const writing = writings.find((item) => item.slug === slug);
  if (!writing) notFound();
  return (
    <article className="mx-auto max-w-5xl">
      <Link href="/writings" className="text-sm text-[var(--accent)]">← Yazılara dön</Link>
      <header className="mt-8 border-b border-[var(--border)] pb-8"><p className="text-sm text-[var(--accent)]">{writing.category}</p><h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-tight">{writing.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">{writing.excerpt}</p><p className="mt-5 text-sm text-[var(--muted)]">{writing.date} · {writing.readingTime} okuma</p></header>
      <div className="grid gap-8 py-8 lg:grid-cols-[220px_1fr]"><aside><Panel className="sticky top-24 p-5"><h2 className="font-semibold">İçindekiler</h2><ol className="mt-4 space-y-3 text-sm text-[var(--muted)]"><li>1. Yeni bir dönem</li><li>2. Neler değişiyor?</li><li>3. Yeni yetkinlikler</li><li>4. Sonuç</li></ol></Panel></aside><div className="prose-dark space-y-7"><h2>1. Dönüşüm gerçek: araçlar değişiyor</h2><p>Yazılım geliştirme araçları daha hızlı, daha erişilebilir ve daha güçlü hâle geliyor. Bu değişim geliştiricinin rolünü ortadan kaldırmak yerine odağını doğru problemi anlamaya taşıyor.</p><blockquote>Yapay zekâ kod yazabilir. Ama ne yazılması gerektiğini hâlâ insan belirler.</blockquote><h2>2. Yeni yetkinlikler: problem çözme</h2><p>Değerli olan yalnızca hızlı kod üretmek değil; doğru bağlamı kurmak, kullanıcı ihtiyacını anlamak ve sürdürülebilir bir çözüm geliştirmektir.</p><pre><code>{`function buildValue(problem: string) {\n  return understand(problem)\n    .design()\n    .ship()\n    .learn();\n}`}</code></pre></div></div>
    </article>
  );
}
