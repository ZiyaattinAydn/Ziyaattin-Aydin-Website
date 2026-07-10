import { PageIntro } from "@/components/ui/page-intro";
import { Panel } from "@/components/ui/panel";
import { TimelineCard } from "@/components/public/timeline-card";
import { getPublicContentRepository } from "@/features/public/content/source-selection";

export default async function JourneyPage() {
  const repository = getPublicContentRepository();
  const journeyItems = await repository.listJourneyItems();
  return (
    <div className="space-y-8 overflow-hidden">
      <PageIntro
        eyebrow="Yolculuğum"
        title="Üretim sürecini görünür kılan public zaman çizelgesi."
        description="Gerçek kişisel tarihçe ve dönüm noktaları kullanıcı tarafından netleşene kadar bu sayfa mock aşamalarla public publish sözleşmesini test eder."
        meta={`${journeyItems.length} mock aşama`}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_.75fr] lg:items-start">
        <div className="space-y-5">
          {journeyItems.length > 0 ? (
            journeyItems.map((item) => (
              <div
                key={item.marker}
                className="relative pl-6 before:absolute before:left-2 before:top-6 before:h-full before:w-px before:bg-[var(--border)] last:before:hidden sm:pl-8"
              >
                <span className="absolute left-0 top-6 h-4 w-4 rounded-full border border-[var(--accent)] bg-[var(--background)]" />
                <TimelineCard item={item} />
              </div>
            ))
          ) : (
            <Panel className="p-8 text-center">
              <h2 className="text-lg font-semibold">Henüz yayınlanmış yolculuk kaydı yok</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Yeni public kayıtlar yayınlandığında burada görünecek.
              </p>
            </Panel>
          )}
        </div>

        <div className="space-y-5 lg:sticky lg:top-24">
          <Panel className="p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Bu sayfanın amacı</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Yolculuk sayfası, ileride gerçek öğrenme notlarını, proje kırılımlarını ve yazılarla bağlantılı dönüm noktalarını gösterecek.
            </p>
          </Panel>
          <Panel className="p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Kapsam notu</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              <li>• Yaş, okul, iş veya kişisel başarı gibi doğrulanmamış yeni bilgi eklenmedi.</li>
              <li>• Aşamalar gerçek kronoloji değil; publishState, publishFlowState, visibility ve sourceNote alanlarını test eden geçici içeriktir.</li>
              <li>• İlgili proje/yazı bağlantıları yalnız mevcut mock sluglara gider.</li>
            </ul>
          </Panel>
        </div>
      </section>
    </div>
  );
}
