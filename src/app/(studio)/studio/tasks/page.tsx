import { StudioListCard } from "@/components/studio/studio-list-card";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModulePage } from "@/components/studio/studio-module-page";
import {
  mockStudioTasks,
  studioModules,
  studioPublishStateLabels,
  studioVisibilityLabels,
  type StudioTaskStatus,
} from "@/features/studio/studio-content";

const taskColumns = ["Bugün", "Yakında", "Beklemede"] as const satisfies readonly StudioTaskStatus[];

const taskWorkflowNotes = [
  {
    title: "studio_tasks taslağı",
    meta: "Future DB mapping",
    description: "Görevler id, relatedProjectId, workstream, status, priority ve nextAction alanlarıyla gelecek task tablosuna hizalanır.",
  },
  {
    title: "Sprint/workstream ilişkisi",
    meta: "Mock",
    description: "Bu sprintte yalnız owner/workstream bilgisi gösterilir; gerçek sprint tablosu, kanban veya tamamlandı aksiyonu yoktur.",
  },
  {
    title: "Kanban beklemede",
    meta: "Sonraki faz",
    description: "Kanban/list görünümü kararı gerçek veri modeli netleştiğinde tekrar ele alınacak.",
  },
] as const;

export default function TasksPage() {
  return (
    <StudioModulePage
      module={studioModules.tasks}
      status="studio_tasks mock"
      aside={
        <StudioMockList
          title="Görev ve güvenlik workflow notları"
          description="Bu liste gerçek task CRUD yerine ekran ve veri ilişkisini anlatır."
          items={taskWorkflowNotes}
        />
      }
    >
      <section className="space-y-5" aria-label="Mock görev grupları">
        <div>
          <h2 className="text-2xl font-semibold">Mock görev akışı</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Görevler bugün, yakında ve beklemede olarak gruplanır. Workstream ve relatedProjectId alanları gelecek Supabase ilişkisini gösterir; bu statik görünüm database veya görev güncellemesi yapmaz.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {taskColumns.map((column) => (
            <div key={column} className="space-y-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h3 className="font-mono text-sm uppercase tracking-[0.16em] text-[var(--accent)]">{column}</h3>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {mockStudioTasks.filter((task) => task.status === column).length} mock görev · gerçek kanban yok
                </p>
              </div>
              {mockStudioTasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <StudioListCard
                    key={task.id}
                    eyebrow={task.workstream}
                    title={task.title}
                    description={task.description}
                    status={task.priority}
                    tone={task.tone}
                    details={[
                      { label: "Durum", value: task.status },
                      { label: "Zaman", value: task.dueLabel },
                      { label: "Owner", value: task.owner },
                      { label: "Proje ilişkisi", value: task.relatedProjectId },
                      { label: "Görünürlük", value: studioVisibilityLabels[task.visibility] },
                      { label: "Publish", value: studioPublishStateLabels[task.publishState] },
                      { label: "Sonraki aksiyon", value: task.nextAction },
                    ]}
                    actionLabel="Görevi güncelle"
                  />
                ))}
            </div>
          ))}
        </div>
      </section>
    </StudioModulePage>
  );
}
