import Link from "next/link";

import { StudioPageHeader } from "@/components/studio/studio-page-header";
import {
  archiveTaskAction,
  changeTaskStatusAction,
  createTaskAction,
} from "@/features/studio/tasks/actions";
import {
  listStudioTasks,
  type StudioTask,
  type TaskStatus,
} from "@/features/studio/tasks/task-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const columns: { status: TaskStatus; label: string }[] = [
  { status: "in_progress", label: "Üzerinde çalışıyorum" },
  { status: "todo", label: "Yapılacak" },
  { status: "blocked", label: "Beklemede" },
  { status: "done", label: "Tamamlandı" },
];

const priorities: Record<StudioTask["priority"], string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  urgent: "Acil",
};

const notices: Record<string, string> = {
  created: "Yeni görev kaydedildi.",
  updated: "Görev durumu güncellendi.",
  archived: "Görev arşivlendi.",
  invalid: "Girilen bilgiler geçersiz. Başlığı, önceliği ve proje seçimini kontrol et.",
  unauthorized: "Bu işlem için geçerli ve MFA doğrulanmış bir Studio oturumu gerekli.",
  database: "İşlem tamamlanamadı. Veritabanı bağlantısını veya erişim izinlerini kontrol et.",
};

function TaskCard({ task, projectName }: { task: StudioTask; projectName?: string }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-lg font-semibold">{task.title}</h3>
        <span className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--accent)]">
          {priorities[task.priority]}
        </span>
      </div>
      {task.description ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
          {task.description}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
        {task.project_id ? (
          <Link href={"/studio/projects/" + task.project_id + "/edit"} className="underline underline-offset-4">
            {projectName ?? "İlişkili proje"}
          </Link>
        ) : (
          <span>Bağımsız görev</span>
        )}
        <span>Güncelleme: {new Date(task.updated_at).toLocaleDateString("tr-TR")}</span>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-[var(--border)] pt-4">
        <form action={changeTaskStatusAction.bind(null, task.id)} className="flex flex-1 flex-wrap items-end gap-2">
          <label className="flex min-w-[170px] flex-1 flex-col gap-1 text-xs text-[var(--muted)]">
            Durum
            <select
              name="status"
              defaultValue={task.status}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
            >
              {columns.map((column) => (
                <option key={column.status} value={column.status}>{column.label}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="rounded-xl border border-[var(--accent-dim)] px-4 py-2 text-sm text-[var(--accent)]">
            Kaydet
          </button>
        </form>
        <form action={archiveTaskAction.bind(null, task.id)}>
          <button type="submit" className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
            Arşivle
          </button>
        </form>
      </div>
    </article>
  );
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const result = await listStudioTasks();
  const { notice } = await searchParams;

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Studio / Görevler"
        title="Kaldığım yerden devam et"
        description="Projelere bağlı veya bağımsız özel görevlerini kaydet, durumlarını güncelle ve tamamlananları arşivle. Gerçek veriler yalnız MFA doğrulanmış owner oturumundan okunur."
        status="Gerçek görev takibi"
      />
      {notice && notices[notice] ? (
        <p role="status" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
          {notices[notice]}
        </p>
      ) : null}

      {!result.ok ? (
        <section role="alert" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-semibold">Görevler şu anda yüklenemiyor</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Supabase erişilemezken örnek görevler gerçek kayıt gibi gösterilmez. Güvenli bağlantı kurulduğunda tekrar deneyebilirsin.
          </p>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <h2 className="text-xl font-semibold">Yeni görev ekle</h2>
            <form action={createTaskAction} className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                Başlık
                <input
                  name="title"
                  required
                  maxLength={160}
                  placeholder="Örn. Demon Slayer diyalog sistemini bitir"
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                İlişkili proje
                <select name="projectId" defaultValue="" className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <option value="">Bağımsız görev</option>
                  {result.projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm md:col-span-2">
                Açıklama / sonraki adım
                <textarea
                  name="description"
                  maxLength={2000}
                  rows={3}
                  placeholder="En son ne yaptım, sırada ne var?"
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                Öncelik
                <select name="priority" defaultValue="medium" className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </label>
              <div className="flex items-end">
                <button type="submit" className="w-full rounded-xl border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.12)] px-5 py-3 font-semibold text-[var(--accent)]">
                  Görev oluştur
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-5 xl:grid-cols-2" aria-label="Görev durumları">
            {columns.map((column) => {
              const tasks = result.tasks.filter((task) => task.status === column.status);
              return (
                <div key={column.status} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{column.label}</h2>
                    <span className="text-sm text-[var(--muted)]">{tasks.length} görev</span>
                  </div>
                  {tasks.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
                      Bu grupta görev yok.
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        projectName={result.projects.find((project) => project.id === task.project_id)?.title}
                      />
                    ))
                  )}
                </div>
              );
            })}
          </section>
          <p className="text-xs text-[var(--muted)]">
            Arşivlenmiş kayıtlar silinmez; aktif görev listesinde gösterilmez. Bu ilk sürümde görev başlığı ve açıklaması kayıttan sonra düzenlenmez.
          </p>
        </>
      )}
    </div>
  );
}
