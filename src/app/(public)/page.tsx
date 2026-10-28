import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/public/project-card";
import { WritingCard } from "@/components/public/writing-card";
import { JourneyPreviewCard } from "@/components/public/journey-preview-card";
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
  const [projects, writings, journey] = await Promise.allSettled([
    repository.listProjects(),
    repository.listWritings(),
    repository.listJourneyItems(),
  ]);
  return (
    <div className="space-y-14 lg:space-y-20">
      <section className="relative isolate min-w-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[linear-gradient(115deg,rgba(4,8,10,.98),rgba(4,8,10,.9)_52%,rgba(0,190,100,.08))] px-4 py-8 min-[380px]:px-6 sm:px-10 sm:py-10 lg:grid lg:min-h-[550px] lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(18,217,120,.1),transparent_28rem)]"
        />
        <div className="relative z-10 min-w-0 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            Kişisel web sitem
          </p>
          <h1 className="mt-5 text-[clamp(2.15rem,9vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.04em] sm:mt-6 sm:text-6xl xl:text-7xl">
            Ziyaattin
            <br />
            Aydın<span className="text-[var(--accent)]">.</span>
          </h1>
          <p className="mt-5 text-lg font-medium leading-snug sm:mt-6 sm:text-2xl">
            Fikirlerden projelere.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
            Projelerim, yazılarım ve öğrenme notlarım için kişisel alanım.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
            <Link
              href="/projects"
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110 min-[380px]:flex-none sm:px-5"
            >
              Projeleri keşfet{" "}
              <span aria-hidden="true" className="ml-3">
                ↗
              </span>
            </Link>
            <Link
              href="/about"
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-xl border border-[var(--border-strong)] px-4 py-3 text-sm font-semibold transition hover:border-[var(--accent-dim)] min-[380px]:flex-none sm:px-5"
            >
              Hakkımda
            </Link>
          </div>
        </div>
        <div className="relative mx-auto mt-8 aspect-[6/5] w-full max-w-[380px] overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] sm:aspect-auto sm:h-96 sm:max-w-md lg:mt-0 lg:h-[460px] lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(18,217,120,.08),rgba(3,7,10,.22))] lg:inset-x-4 lg:bottom-0 lg:top-8 lg:rounded-[2rem] lg:border lg:border-[var(--border)]"
          />
          <Image
            src="/images/portraits/home-hero.png"
            alt="Ziyaattin Aydın’ın stilize portresi"
            fill
            priority
            sizes="(max-width: 640px) calc(100vw - 4rem), (max-width: 1024px) 448px, 38vw"
            className="object-cover object-[center_26%] sm:object-contain sm:object-bottom"
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
      <PublicSection
        eyebrow="Yolculuğum"
        title="Süreç de sonucun bir parçası."
        description="İlk pinpon oyunumdan bugüne öğrenirken ve üretirken biriktirdiklerim."
        href="/journey"
        linkLabel="Tüm yolculuğum"
      >
        {journey.status === "rejected" ? (
          <PublicUnavailable href="/journey" />
        ) : journey.value.length ? (
          <AutoCarousel label="Yolculuğum" items={journey.value.map((item, index) => (
            <JourneyPreviewCard key={item.slug ?? index} item={item} />
          ))} />
        ) : (
          <PublicEmptyState
            headingLevel={3}
            title="Yolculuğum yakında burada"
            description="Öğrenirken ve üretirken biriktirdiğim dönüm noktalarını burada bulabileceksin."
            href="/journey"
            linkLabel="Yolculuğum"
          />
        )}
      </PublicSection>
    </div>
  );
}
