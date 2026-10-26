import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/public/project-card";
import { WritingCard } from "@/components/public/writing-card";
import { PublicSection } from "@/components/public/public-section";
import { AutoCarousel } from "@/components/public/auto-carousel";
import {
  PublicEmptyState,
  PublicUnavailable,
} from "@/components/public/content-state";
import { getPublicContentRepository } from "@/features/public/content/source-selection";
import { publicMetadata } from "@/lib/public-metadata";
export const dynamic = "force-dynamic";
const homeMetadata = publicMetadata(
  "Ziyaattin Aydın",
  "Ziyaattin Aydın’ın kişisel web sitesi. Projeler, yazılar ve öğrenme yolculuğundan notlar.",
  "/",
);
export const metadata = {
  ...homeMetadata,
  title: { absolute: "Ziyaattin Aydın | Kişisel Web Sitesi" },
};
export default async function HomePage() {
  const repository = getPublicContentRepository();
  const [projects, writings] = await Promise.allSettled([
    repository.listProjects(),
    repository.listWritings(),
  ]);
  return (
    <div className="space-y-14 lg:space-y-20">
      <section className="relative isolate overflow-hidden rounded-3xl border border-[var(--border)] bg-[linear-gradient(115deg,rgba(4,8,10,.98),rgba(4,8,10,.9)_52%,rgba(0,190,100,.08))] px-6 py-10 sm:px-10 lg:grid lg:min-h-[550px] lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(18,217,120,.1),transparent_28rem)]"
        />
        <div className="relative z-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            Kişisel web sitem
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl xl:text-7xl">
            Ziyaattin
            <br />
            Aydın<span className="text-[var(--accent)]">.</span>
          </h1>
          <p className="mt-6 text-xl font-medium leading-snug sm:text-2xl">
            Fikirlerden projelere.
          </p>
          <p className="mt-4 max-w-lg text-base leading-8 text-[var(--muted)]">
            Projelerim, yazılarım ve öğrenme notlarım için kişisel alanım.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110"
            >
              Projeleri keşfet{" "}
              <span aria-hidden="true" className="ml-3">
                ↗
              </span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border-strong)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--accent-dim)]"
            >
              Hakkımda
            </Link>
          </div>
        </div>
        <div className="relative mx-auto mt-8 h-72 w-full max-w-md sm:h-96 lg:mt-0 lg:h-[460px]">
          <div
            aria-hidden="true"
            className="absolute inset-x-4 bottom-0 top-8 rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,217,120,.08),rgba(3,7,10,.22))]"
          />
          <Image
            src="/images/portraits/home-hero.png"
            alt="Ziyaattin Aydın’ın stilize portresi"
            fill
            priority
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 448px, 38vw"
            className="object-contain object-bottom"
          />
        </div>
      </section>
      <PublicSection
        eyebrow="Projeler"
        title="Üzerinde çalıştıklarım"
        description="Paylaştığım çalışmaların fikirleri, süreçleri ve ayrıntıları."
        href="/projects"
        linkLabel="Tüm projeler"
      >
        {projects.status === "rejected" ? (
          <PublicUnavailable href="/" />
        ) : projects.value.length ? (
          <AutoCarousel label="Projeler" items={projects.value.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))} />
        ) : (
          <PublicEmptyState
            headingLevel={3}
            title="Projeler için yeni bir sayfa"
            description="Henüz paylaşılmış proje yok. Çalışmalarımın ayrıntılarını bu bölümde bulabileceksin."
            href="/about"
            linkLabel="Siteyi tanı"
          />
        )}
      </PublicSection>
      <PublicSection
        eyebrow="Yazılar"
        title="Notlar ve düşünceler"
        description="Yazılarımı bir arada bulabileceğin okuma alanı."
        href="/writings"
        linkLabel="Tüm yazılar"
      >
        {writings.status === "rejected" ? (
          <PublicUnavailable href="/" />
        ) : writings.value.length ? (
          <AutoCarousel label="Yazılar" desktopVisible={2} items={writings.value.map((w) => (
            <WritingCard key={w.slug} writing={w} />
          ))} />
        ) : (
          <PublicEmptyState
            headingLevel={3}
            title="Henüz yazı paylaşmadım"
            description="Yayınladığım yazılar burada yer alacak."
          />
        )}
      </PublicSection>
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
            Yolculuğum
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Süreç de sonucun bir parçası.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Öğrenme ve üretme sürecinden paylaşacağım notlar için ayrı bir alan.
          </p>
        </div>
        <Link
          href="/journey"
          className="shrink-0 text-sm font-semibold text-[var(--accent)]"
        >
          Yolculuğuma göz at <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
