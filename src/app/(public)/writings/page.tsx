import Image from "next/image";
import { WritingExplorer } from "@/components/public/writing-explorer";
import {
  PublicEmptyState,
  PublicUnavailable,
} from "@/components/public/content-state";
import { getPublicWritingContentRepository } from "@/features/public/content/source-selection";
import { publicMetadata } from "@/lib/public-metadata";
export const dynamic = "force-dynamic";
export const metadata = publicMetadata(
  "Yazılar",
  "Yazılar, düşünceler ve öğrenme notları.",
  "/writings",
);
export default async function WritingsPage() {
  const result = await getPublicWritingContentRepository()
    .listWritings()
    .then((data) => ({ ok: true as const, data }))
    .catch(() => ({ ok: false as const }));
  return (
    <div className="space-y-9">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-8 sm:px-10 lg:grid lg:grid-cols-[1fr_.6fr] lg:items-center lg:py-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            Okuma alanı
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Yazılarım
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
            Düşüncelerimi ve öğrenirken aldığım notları paylaştığım yer.
          </p>
        </div>
        <div className="relative mx-auto mt-6 h-56 w-full max-w-xs sm:h-64 lg:mt-0">
          <Image
            src="/images/portraits/writings-hero.png"
            alt="Ziyaattin Aydın’ın yazı alanındaki stilize portresi"
            fill
            sizes="(max-width: 640px) 80vw, 320px"
            className="object-contain object-bottom"
          />
        </div>
      </section>
      {!result.ok ? (
        <PublicUnavailable href="/writings" />
      ) : result.data.length ? (
        <WritingExplorer writings={result.data} />
      ) : (
        <PublicEmptyState
          title="Henüz yazı paylaşmadım"
          description="Yayınladığım yazıları burada bulabileceksin."
          href="/projects"
          linkLabel="Projelerime göz at"
        />
      )}
    </div>
  );
}
