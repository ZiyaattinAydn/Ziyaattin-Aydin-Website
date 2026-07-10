import { StudioListCard } from "@/components/studio/studio-list-card";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModulePage } from "@/components/studio/studio-module-page";
import { mockStudioProjects, studioModules, studioPublishStateLabels, studioVisibilityLabels } from "@/features/studio/studio-content";

const projectWorkflowNotes = [
  {
    title: "studio_projects taslağı",
    meta: "Future DB mapping",
    description: "Her mock proje id, status, progress, visibility, publishState ve nextAction alanlarıyla gelecek tabloya hazırlanır.",
  },
  {
    title: "Public publish ilişkisi",
    meta: "publish_queue",
    description: "Public siteye taşınabilecek parçalar yalnız mock publishState ile işaretlenir; gerçek yayın aksiyonu yoktur.",
  },
  {
    title: "Gerçek işlem yok",
    meta: "Disabled",
    description: "Düzenle, sil, yayınla ve detay aksiyonları sonraki faz mesajı gösterir; veri değiştirmez.",
  },
] as const;

export default function ProjectsPage() {
  return (
    <StudioModulePage
      module={studioModules.projects}
      status="studio_projects mock"
      aside={
        <StudioMockList
          title="Proje workflow notları"
          description="Bu açıklamalar gerçek CRUD değil, gelecek Supabase ilişkisinin hazırlığıdır."
          items={projectWorkflowNotes}
        />
      }
    >
      <section className="space-y-5" aria-label="Mock proje listesi">
        <div>
          <h2 className="text-2xl font-semibold">Mock proje listesi</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Aşağıdaki kayıtlar migration veya database modeli değildir; Studio proje ekranının public publish ilişkisini, görünürlük kararını ve gelecek aksiyon alanlarını test eder.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {mockStudioProjects.map((project) => (
            <StudioListCard
              key={project.id}
              eyebrow={project.dataModelKey}
              title={project.title}
              description={project.summary}
              status={studioPublishStateLabels[project.publishState]}
              tone={project.tone}
              progress={project.progress}
              details={[
                { label: "Durum", value: project.status },
                { label: "Öncelik", value: project.priority },
                { label: "Son güncelleme", value: project.updatedAt },
                { label: "Görünürlük", value: studioVisibilityLabels[project.visibility] },
                { label: "Publish ilişkisi", value: project.relatedPublication },
                { label: "Sonraki aksiyon", value: project.nextAction },
              ]}
              actionLabel="Proje detayını düzenle"
            />
          ))}
        </div>
      </section>
    </StudioModulePage>
  );
}
