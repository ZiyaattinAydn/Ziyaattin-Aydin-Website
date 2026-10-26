import Link from "next/link";
import { notFound } from "next/navigation";
import { getOwnerProject } from "@/features/projects/server/project-mutations";
import { listStudioTasks } from "@/features/studio/tasks/task-store";
import { taskProgress, displayDate } from "@/features/studio/tasks/task-domain";
import { TaskCard } from "@/features/studio/tasks/task-card";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_VISIBILITY_LABELS,
} from "@/features/studio/projects/project-presentation";
export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [result, work] = await Promise.all([
    getOwnerProject(projectId),
    listStudioTasks(),
  ]);
  if (!result.ok) {
    if (
      ["not_found", "validation_failed", "forbidden"].includes(
        result.error.code,
      )
    )
      notFound();
    return (
      <p role="alert">Proje yüklenemedi. Sayfayı yenileyip tekrar dene.</p>
    );
  }
  const p = result.data,
    tasks = work.ok
      ? work.tasks.filter(
          (t) => t.project_id === p.id && t.status !== "archived",
        )
      : [];
  const progress = taskProgress(tasks),
    archived = p.publishState === "archived" || p.status === "archived";
  return (
    <div className="space-y-7">
      <Link href="/studio/projects" className="text-sm text-[var(--muted)]">
        ← Projelere dön
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="min-w-0 break-words text-3xl font-semibold">
          {p.title}
        </h1>
        <Link
          href={"/studio/projects/" + p.id + "/edit"}
          className="rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-sm text-[var(--accent)]"
        >
          {archived ? "Arşiv bilgileri" : "Projeyi düzenle"}
        </Link>
      </div>
      <p className="whitespace-pre-wrap break-words leading-7 text-[var(--muted)]">
        {p.summary || "Henüz açıklama eklenmedi."}
      </p>
      <dl className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-sm text-[var(--muted)]">Durum</dt>
          <dd>{PROJECT_STATUS_LABELS[p.status]}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--muted)]">Görünürlük</dt>
          <dd>{p.publishState === "archived" ? "Arşiv" : PROJECT_VISIBILITY_LABELS[p.publishState === "published" ? "public" : "private"]}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--muted)]">Oluşturulma</dt>
          <dd>{displayDate(p.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--muted)]">Son güncelleme</dt>
          <dd>{displayDate(p.updatedAt)}</dd>
        </div>
      </dl>
      <section className="space-y-4 rounded-2xl border border-[var(--border)] p-5">
        <h2 className="text-xl font-semibold">Görev ilerlemesi</h2>
        {!work.ok ? (
          <p role="alert">Görevler yüklenemedi; ilerleme hesaplanamıyor.</p>
        ) : progress.percent === null ? (
          <p className="text-sm text-[var(--muted)]">
            Bu projede henüz görev yok. İlerleme hesaplanmadı.
          </p>
        ) : (
          <>
            <p>
              {progress.completed} / {progress.total} tamamlandı ·{" "}
              {progress.open} bekleyen iş
            </p>
            <div
              role="progressbar"
              aria-label="Tamamlanan görev oranı"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percent}
              className="h-3 overflow-hidden rounded-full bg-[var(--surface-strong)]"
            >
              <div
                className="h-full bg-[var(--accent)]"
                style={{ width: progress.percent + "%" }}
              />
            </div>
            <p className="text-sm text-[var(--muted)]">
              %{progress.percent} — arşiv dışındaki görevlerin tamamlanma oranı
            </p>
          </>
        )}
      </section>
      {[
        { title: "Problem", body: p.sections.problem },
        { title: "Yaklaşım", body: p.sections.approach },
      ]
        .filter((s) => s.body)
        .map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold">{s.title}</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-[var(--muted)]">
              {s.body}
            </p>
          </section>
        ))}
      {p.sections.highlights.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold">Öne çıkanlar</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-[var(--muted)]">
            {p.sections.highlights.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}
      {(p.githubUrl || p.demoUrl) && (
        <section>
          <h2 className="text-xl font-semibold">Bağlantılar</h2>
          <div className="mt-3 flex flex-wrap gap-5 text-[var(--accent)]">
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            )}
            {p.demoUrl && (
              <a href={p.demoUrl} target="_blank" rel="noopener noreferrer">
                Demo ↗
              </a>
            )}
          </div>
        </section>
      )}
      {!archived && (
        <Link
          href={"/studio/tasks/new?project=" + p.id}
          className="inline-flex rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-sm text-[var(--accent)]"
        >
          Bu projeye görev ekle
        </Link>
      )}
      {work.ok &&
        [
          {
            title: "Bekleyen işler",
            items: tasks.filter((t) => t.status !== "done"),
          },
          {
            title: "Tamamlanan işler",
            items: tasks.filter((t) => t.status === "done"),
          },
        ].map((group) => (
          <section className="space-y-4" key={group.title}>
            <h2 className="text-xl font-semibold">
              {group.title} ({group.items.length})
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {group.items.length ? (
                group.items.map((t) => <TaskCard key={t.id} task={t} />)
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  Bu grupta görev yok.
                </p>
              )}
            </div>
          </section>
        ))}
    </div>
  );
}
