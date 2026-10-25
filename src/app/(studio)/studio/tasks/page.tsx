import Link from "next/link";
import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { listStudioTasks } from "@/features/studio/tasks/task-store";
import {
  filterTasks,
  statusNames,
  priorityNames,
  type TaskFilters,
} from "@/features/studio/tasks/task-domain";
import { TaskCard } from "@/features/studio/tasks/task-card";
import { taskInputClass } from "@/features/studio/tasks/task-styles";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [result, raw] = await Promise.all([listStudioTasks(), searchParams]);
  const filters = Object.fromEntries(
    Object.entries(raw).filter(([, value]) => typeof value === "string"),
  ) as TaskFilters;
  const tasks = result.ok ? filterTasks(result.tasks, filters) : [];
  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Studio / Görevler"
        title="Görevlerim"
        description="İşlerini planla, projelerinle ilişkilendir ve kaldığın yerden devam et."
        status="Studio 1.0"
      />
      <Link
        href="/studio/tasks/new"
        className="inline-flex rounded-xl border border-[var(--accent-dim)] px-5 py-3 text-[var(--accent)]"
      >
        Yeni görev
      </Link>
      {raw.notice === "archived" && <p role="status">Görev arşivlendi.</p>}
      {!result.ok ? (
        <p
          role="alert"
          className="rounded-2xl border border-[var(--border)] p-6"
        >
          Görevler yüklenemedi. Bağlantını kontrol edip sayfayı yenile.
        </p>
      ) : (
        <>
          <form className="grid min-w-0 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm">
              <span>Ara</span>
              <input
                name="q"
                type="search"
                defaultValue={filters.q}
                className={taskInputClass}
                placeholder="Başlık veya açıklama"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span>Proje</span>
              <select
                name="project"
                defaultValue={filters.project ?? ""}
                className={taskInputClass}
              >
                <option value="">Tüm projeler</option>
                <option value="none">Bağımsız görevler</option>
                {result.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span>Durum</span>
              <select
                name="status"
                defaultValue={filters.status ?? ""}
                className={taskInputClass}
              >
                <option value="">Arşiv dışındaki tümü</option>
                {Object.entries(statusNames).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span>Öncelik</span>
              <select
                name="priority"
                defaultValue={filters.priority ?? ""}
                className={taskInputClass}
              >
                <option value="">Tümü</option>
                {Object.entries(priorityNames).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span>Tarih durumu</span>
              <select
                name="date"
                defaultValue={filters.date ?? ""}
                className={taskInputClass}
              >
                <option value="">Tümü</option>
                <option value="overdue">Gecikmiş</option>
                <option value="upcoming">Önümüzdeki 7 gün</option>
                <option value="undated">Bitiş tarihi yok</option>
              </select>
            </label>
            <label className="min-w-0 space-y-2 text-sm">
              <span>Bitiş tarihinden</span>
              <input
                name="from"
                type="date"
                defaultValue={filters.from}
                className={taskInputClass}
              />
            </label>
            <label className="min-w-0 space-y-2 text-sm">
              <span>Bitiş tarihine kadar</span>
              <input
                name="to"
                type="date"
                defaultValue={filters.to}
                className={taskInputClass}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span>Sırala</span>
              <select
                name="sort"
                defaultValue={filters.sort ?? "updated"}
                className={taskInputClass}
              >
                <option value="updated">Son güncellenen</option>
                <option value="due">Yakın bitiş tarihi</option>
                <option value="priority">Yüksek öncelik</option>
                <option value="title">Başlık</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-4 sm:col-span-2 xl:col-span-4">
              <button className="rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-sm text-[var(--accent)]">
                Filtrele
              </button>
              <Link href="/studio/tasks" className="px-4 py-3 text-sm">
                Filtreleri temizle
              </Link>
            </div>
          </form>
          <p role="status" className="text-sm text-[var(--muted)]">
            {tasks.length} görev
          </p>
          <section
            aria-label="Görev listesi"
            className="grid gap-4 lg:grid-cols-2"
          >
            {tasks.length ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectName={
                    result.projects.find((p) => p.id === task.project_id)?.title
                  }
                />
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
                Bu filtrelerle eşleşen görev yok.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
