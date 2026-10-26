import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudioTask } from "@/features/studio/tasks/task-store";
import { TaskForm, ArchiveTaskForm } from "@/features/studio/tasks/task-form";
import { displayDate, statusNames } from "@/features/studio/tasks/task-domain";
export default async function TaskDetail({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { taskId } = await params;
  const [result, search] = await Promise.all([
    getStudioTask(taskId),
    searchParams,
  ]);
  if (!result.ok) {
    if (result.reason === "not_found") notFound();
    return (
      <p role="alert">
        Görev yüklenemedi. Bağlantını kontrol edip tekrar dene.
      </p>
    );
  }
  const { task, projects } = result;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Görev işlemleri">
        <Link href="/studio/tasks" className="text-sm text-[var(--muted)]">
          ← Görevlere dön
        </Link>
        <Link
          href={task.project_id && projects.some((p) =>
            p.id === task.project_id && p.status !== "archived" && p.publish_state !== "archived"
          ) ? "/studio/tasks/new?project=" + encodeURIComponent(task.project_id) : "/studio/tasks/new"}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-sm font-semibold text-[var(--accent)]"
        >
          + Yeni görev ekle
        </Link>
      </nav>
      <h1 className="break-words text-3xl font-semibold">{task.title}</h1>
      {["created", "updated"].includes(search.notice ?? "") && (
        <p role="status" className="text-[var(--accent)]">
          {search.notice === "created"
            ? "Görev oluşturuldu."
            : "Görev kaydedildi."}
        </p>
      )}
      <dl className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
        <div>
          <dt>Durum</dt>
          <dd>{statusNames[task.status]}</dd>
        </div>
        <div>
          <dt>Tamamlanma</dt>
          <dd>{displayDate(task.completed_at)}</dd>
        </div>
        <div>
          <dt>Oluşturulma</dt>
          <dd>{displayDate(task.created_at)}</dd>
        </div>
        <div>
          <dt>Son güncelleme</dt>
          <dd>{displayDate(task.updated_at)}</dd>
        </div>
      </dl>
      {task.project_id && (
        <Link
          href={"/studio/projects/" + task.project_id}
          className="block text-sm text-[var(--accent)]"
        >
          {projects.find((p) => p.id === task.project_id)?.title ??
            "Projeye git"}
        </Link>
      )}
      {task.status === "archived" ? (
        <section className="space-y-4 rounded-2xl border border-[var(--border)] p-5">
          <p className="whitespace-pre-wrap break-words">
            {task.description || "Açıklama yok."}
          </p>
          <p className="text-sm text-[var(--muted)]">
            Başlangıç: {displayDate(task.starts_at)} · Bitiş:{" "}
            {displayDate(task.due_at)}
          </p>
          <p className="text-sm">Arşivlenme: {displayDate(task.archived_at)}</p>
        </section>
      ) : (
        <>
          <TaskForm task={task} projects={projects} />
          <ArchiveTaskForm task={task} />
        </>
      )}
    </div>
  );
}
