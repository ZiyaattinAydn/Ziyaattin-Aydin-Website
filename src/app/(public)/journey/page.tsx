import { PageIntro } from "@/components/ui/page-intro";
import { TimelineCard } from "@/components/public/timeline-card";
import {
  PublicEmptyState,
  PublicUnavailable,
} from "@/components/public/content-state";
import { getPublicContentRepository } from "@/features/public/content/source-selection";
import { publicMetadata } from "@/lib/public-metadata";
export const dynamic = "force-dynamic";
export const metadata = publicMetadata(
  "Yolculuğum",
  "Öğrenme ve üretme yolculuğundan paylaşılan notlar ve dönüm noktaları.",
  "/journey",
);
export default async function JourneyPage() {
  const result = await getPublicContentRepository()
    .listJourneyItems()
    .then((data) => ({ ok: true as const, data }))
    .catch(() => ({ ok: false as const }));
  return (
    <div className="space-y-9">
      <PageIntro
        eyebrow="Süreç"
        title="Yolculuğum"
        description="Öğrenirken, denerken ve üretirken biriken notlar."
      />
      {!result.ok ? (
        <PublicUnavailable href="/journey" />
      ) : result.data.length ? (
        <section
          aria-label="Zaman çizelgesi"
          className="mx-auto max-w-4xl space-y-6"
        >
          {result.data.map((item, index) => (
            <div
              key={index}
              className="relative border-l border-[var(--border)] pl-6 before:absolute before:-left-1 before:top-7 before:h-2 before:w-2 before:rounded-full before:bg-[var(--accent)]"
            >
              <TimelineCard item={item} />
            </div>
          ))}
        </section>
      ) : (
        <PublicEmptyState
          title="Zaman çizelgesi henüz boş"
          description="Yolculuğumdan paylaşacağım notlar ve dönüm noktaları burada yer alacak."
          href="/about"
          linkLabel="Hakkımda"
        />
      )}
    </div>
  );
}
