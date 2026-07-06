import { PageIntro } from "@/components/ui/page-intro";
import { Panel } from "@/components/ui/panel";
import { TimelineItem } from "@/components/public/timeline-item";
import { journeyItems } from "@/data/mock-content";

export default function JourneyPage() {
  return (
    <div className="space-y-8 overflow-hidden">
      <PageIntro
        eyebrow="Yolculuğum"
        title="Üretim sürecini görünür kılan public zaman çizelgesi."
        description="Gerçek kişisel tarihçe ve dönüm noktaları kullanıcı tarafından netleşene kadar bu sayfa mock aşamalarla public deneyimi test eder."
        meta={`${journeyItems.length} mock aşama`}
      />

      <section className="grid gap-6 lg:grid-cols-[1fr_.75fr] lg:items-start">
        <div className="space-y-5">
          {journeyItems.map((item) => (
            <TimelineItem key={item.marker} item={item} />
          ))}
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
              <li>• Aşamalar gerçek kronoloji değil, public layout için geçici içeriktir.</li>
              <li>• İlgili proje/yazı bağlantıları yalnız mevcut mock sluglara gider.</li>
            </ul>
          </Panel>
        </div>
      </section>
    </div>
  );
}
