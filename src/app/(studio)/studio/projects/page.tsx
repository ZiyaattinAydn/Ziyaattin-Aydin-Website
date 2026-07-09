import { StudioListCard } from "@/components/studio/studio-list-card";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModulePage } from "@/components/studio/studio-module-page";
import { mockStudioProjects, studioModules } from "@/features/studio/studio-content";

const projectWorkflowNotes = [
  {
    title: "Liste görünümü",
    meta: "Mock",
    description: "Projeler başlık, durum, ilerleme, son güncelleme ve sonraki aksiyon bilgisiyle okunur.",
  },
  {
    title: "Gerçek işlem yok",
    meta: "Disabled",
    description: "Düzenle, sil, yayınla ve detay aksiyonları sonraki faz mesajı gösterir; veri değiştirmez.",
  },
  {
    title: "Supabase bekleniyor",
    meta: "Faz 4+",
    description: "Proje kayıtları, public görünürlük ve ilişkilendirmeler gerçek veri modeliyle bağlanacak.",
  },
] as const;

export default function ProjectsPage() {
  return (
    <StudioModulePage
      module={studioModules.projects}
      aside={
        <StudioMockList
          title="Proje workflow notları"
          description="Bu açıklamalar gerçek CRUD değil, gelecek akışın hazırlığıdır."
          items={projectWorkflowNotes}
        />
      }
    >
      <section className="space-y-5" aria-label="Mock proje listesi">
        <div>
          <h2 className="text-2xl font-semibold">Mock proje listesi</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Aşağıdaki kayıtlar database modeli değildir; Studio proje ekranının bilgi yoğunluğunu ve gelecek aksiyon alanlarını test eder.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {mockStudioProjects.map((project) => (
            <StudioListCard
              key={project.title}
              eyebrow="Mock proje"
              title={project.title}
              description={project.summary}
              status={project.status}
              tone={project.tone}
              progress={project.progress}
              details={[
                { label: "Son güncelleme", value: project.updatedAt },
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
