import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModuleCard } from "@/components/studio/studio-module-card";
import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { StudioStatusCard } from "@/components/studio/studio-status-card";
import { dashboardFocusItems, dashboardStats, dashboardTimelineItems, studioModules } from "@/features/studio/studio-content";

const moduleCards = [
  { href: "/studio/projects", ...studioModules.projects },
  { href: "/studio/tasks", ...studioModules.tasks },
  { href: "/studio/notes", ...studioModules.notes },
  { href: "/studio/files", ...studioModules.files },
] as const;

export default function StudioPage() {
  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Özel Çalışma Alanı"
        title="Studio Ana Paneli"
        description="Proje, görev, not ve dosya modüllerinin gerçek backend olmadan düzenli şekilde konumlandırıldığı hazırlık paneli. Buradaki kartlar mock veridir ve güvenlik ya da kayıt sistemi tamamlandı anlamına gelmez."
        status="Sprint 01 shell"
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Studio durum kartları">
        {dashboardStats.map((stat) => (
          <StudioStatusCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <StudioMockList
          title="Odak alanları"
          description="Sprint 01 için kullanıcı deneyimi ve sınır notları."
          items={dashboardFocusItems}
        />
        <StudioMockList
          title="Yaklaşan fazlar"
          description="Gerçek veri akışı bağlanmadan önceki yön haritası."
          items={dashboardTimelineItems}
        />
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Studio modülleri</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Her kart ayrı sayfaya gider; aksiyonlar şimdilik hazırlık seviyesinde.</p>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">CRUD yok · Auth yok · Storage yok</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {moduleCards.map((module) => (
            <StudioModuleCard key={module.href} href={module.href} eyebrow={module.eyebrow} title={module.title} description={module.description} />
          ))}
        </div>
      </section>
    </div>
  );
}
