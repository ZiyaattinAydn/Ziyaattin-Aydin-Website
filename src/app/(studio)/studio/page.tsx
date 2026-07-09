import { StudioListCard } from "@/components/studio/studio-list-card";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModuleCard } from "@/components/studio/studio-module-card";
import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { StudioScopeList } from "@/components/studio/studio-scope-list";
import { StudioStatusCard } from "@/components/studio/studio-status-card";
import {
  dashboardFocusItems,
  dashboardStats,
  dashboardTimelineItems,
  mockStudioActivities,
  mockStudioProjects,
  mockStudioTasks,
  studioModules,
} from "@/features/studio/studio-content";

const moduleCards = [
  { href: "/studio/projects", ...studioModules.projects },
  { href: "/studio/tasks", ...studioModules.tasks },
  { href: "/studio/notes", ...studioModules.notes },
  { href: "/studio/files", ...studioModules.files },
] as const;

const todayTasks = mockStudioTasks.filter((task) => task.status === "Bugün");
const activeProject = mockStudioProjects[0];

export default function StudioPage() {
  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Özel Çalışma Alanı"
        title="Studio Ana Paneli"
        description="Proje, görev, not ve dosya modüllerinin gerçek backend olmadan mock workflow seviyesinde konumlandırıldığı hazırlık paneli. Buradaki sayılar ve listeler mock veridir; Auth, database veya storage tamamlandı anlamına gelmez."
        status="Sprint 02 mock workflow"
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Studio durum kartları">
        {dashboardStats.map((stat) => (
          <StudioStatusCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <StudioListCard
          eyebrow="Öne çıkan mock proje"
          title={activeProject.title}
          description={activeProject.summary}
          status={activeProject.status}
          tone={activeProject.tone}
          progress={activeProject.progress}
          details={[
            { label: "Son güncelleme", value: activeProject.updatedAt },
            { label: "Sonraki aksiyon", value: activeProject.nextAction },
          ]}
          actionLabel="Proje detayını aç"
        />

        <StudioMockList
          title="Son aktiviteler"
          description="Gerçek audit log değildir; sprint hazırlık akışını anlatır."
          items={mockStudioActivities}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <StudioScopeList
          title="Bugün görünen mock görevler"
          items={todayTasks.map((task) => `${task.title} — ${task.priority} öncelik`)}
        />
        <StudioMockList
          title="Backend bağlantısı sonraki fazda"
          description="Bu sprintte yalnız UI ve mock veri ayrımı netleşir."
          items={dashboardFocusItems}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <StudioMockList
          title="Yaklaşan fazlar"
          description="Gerçek veri akışı bağlanmadan önceki yön haritası."
          items={dashboardTimelineItems}
        />
        <StudioListCard
          eyebrow="Sınır notu"
          title="Mock veri gerçek kayıt değildir"
          description="Dashboard kartları, aktivite listesi, görev ayrımı ve dosya özetleri yalnız Studio deneyimini test etmek için kullanılır. Kullanıcı oturumu, database kaydı, storage alanı veya public yayın işlemi yapılmaz."
          status="Auth yok"
          tone="warning"
          actionLabel="Güvenlik fazı kararlarını bekle"
        />
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Studio modülleri</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Her kart ayrı sayfaya gider; listeler ve aksiyonlar şimdilik hazırlık seviyesindedir.</p>
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
