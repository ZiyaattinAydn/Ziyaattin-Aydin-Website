import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { ProjectCard } from "@/components/public/project-card";
import { PublicSection } from "@/components/public/public-section";
import { PublicStatCard } from "@/components/public/public-stat-card";
import { TimelineCard } from "@/components/public/timeline-card";
import { WritingCard } from "@/components/public/writing-card";
import { journeyItems, projects, writings } from "@/data/mock-content";

const activeProjectCount = projects.filter((project) => project.status === "Devam Ediyor").length;
const completedProjectCount = projects.filter((project) => project.status === "Tamamlandı").length;
const draftWritingCount = writings.filter((writing) => writing.publishState === "draft").length;

export default function HomePage() {
  const featuredProjects = projects.filter((project) => project.isFeatured).slice(0, 3);
  const featuredWritings = writings.filter((writing) => writing.isFeatured).slice(0, 2);

  return (
    <div className="space-y-10 overflow-hidden">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[linear-gradient(115deg,rgba(4,8,10,.98)_0%,rgba(4,8,10,.9)_52%,rgba(0,190,100,.08)_100%)] px-5 py-8 sm:px-8 lg:grid lg:min-h-[560px] lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-12 xl:px-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(18,217,120,.12),transparent_28rem)]" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            Public site · Sprint 03 yayın sözleşmesi
          </div>
          <div>
            <p className="text-base text-[var(--accent)] sm:text-lg">Merhaba, ben</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Ziyaattin<span className="text-[var(--accent)]">.</span>
            </h1>
          </div>
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Öğrenme, üretme ve dijital sistem kurma yolculuğunu sade bir public yüzeyde topluyorum.
          </h2>
          <p className="max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Bu public sürüm; proje, yazı ve yolculuk alanlarını ileride Studio publish akışına bağlanacak güvenli mock içerik sözleşmesiyle gösterir. Gerçek bağlantılar ve kişisel detaylar kullanıcı onayından sonra eklenecek.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/projects"
              className="inline-flex justify-center rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[#021108] transition hover:opacity-90"
            >
              Projeleri İncele
            </Link>
            <Link
              href="/writings"
              className="inline-flex justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 font-semibold transition hover:border-[var(--accent-dim)]"
            >
              Yazıları Oku
            </Link>
          </div>
          <p className="text-sm leading-6 text-[var(--muted)]">
            Not: Sayaçlar ve içerikler şu anda gerçek veri değil, public deneyimi test eden mock alanlardır.
          </p>
        </div>
        <div className="relative z-10 mt-8 min-h-[320px] sm:min-h-[420px] lg:mt-0 lg:h-full">
          <div className="absolute inset-x-4 bottom-0 top-8 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,217,120,.08),rgba(3,7,10,.22))]" />
          <Image
            src="/images/portraits/home-hero.png"
            alt="Ziyaattin'in onaylı ana sayfa stilize portresi"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-contain object-bottom"
          />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PublicStatCard value={String(projects.length)} label="Mock public proje" note="Gerçek proje sayısı iddiası değildir." />
        <PublicStatCard value={String(activeProjectCount)} label="Devam eden kayıt" note="Mock status alanından hesaplanır." />
        <PublicStatCard value={String(completedProjectCount)} label="Tamamlanan mock" note="Gerçek müşteri işi iddiası taşımaz." />
        <PublicStatCard value={String(draftWritingCount)} label="Taslak yazı" note="Gerçek publish/database başlamadı." />
      </div>

      <PublicSection
        eyebrow="Projeler"
        title="Öne çıkan public proje kayıtları"
        description="Kartlar; durum, ilerleme, kategori ve teknoloji etiketlerini gerçek link uydurmadan gösterir. Link yoksa detay sayfasında pasif bilgi görünür."
        href="/projects"
        linkLabel="Tüm projeler"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </PublicSection>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <PublicSection
          eyebrow="Yazılar"
          title="Okunabilir yazı taslakları"
          description="Yazı alanı şimdilik mock içerikle çalışır; kategori, tarih ve okuma süresi gerçek yayın verisi değildir."
          href="/writings"
          linkLabel="Tüm yazılar"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {featuredWritings.map((writing) => (
              <WritingCard key={writing.slug} writing={writing} />
            ))}
          </div>
        </PublicSection>

        <Panel className="p-5 sm:p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Dijital pano
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Public durum özeti</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Bu pano, ileride Studio verilerinden beslenecek alanların yerleşimini test eder. Şimdilik tüm değerler mock içerikten türetilir.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <MiniStat label="Aktif kategori" value="Mock" />
            <MiniStat label="Yayın modu" value="Public-safe" />
            <MiniStat label="Veri kaynağı" value="Mock" />
            <MiniStat label="Link durumu" value="Pasif" />
          </div>
        </Panel>
      </div>

      <PublicSection
        eyebrow="Yolculuk"
        title="Kısa yolculuk özeti"
        description="Gerçek kişisel tarihçe netleşene kadar aşamalar geçici anlatım blokları olarak tutulur."
        href="/journey"
        linkLabel="Yolculuğu gör"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {journeyItems.map((item) => (
            <TimelineCard key={item.marker} item={item} compact />
          ))}
        </div>
      </PublicSection>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
      <p className="font-semibold text-[var(--foreground)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
