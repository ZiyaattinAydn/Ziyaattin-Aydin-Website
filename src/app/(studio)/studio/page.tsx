import Link from "next/link";
import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { listStudioTasks } from "@/features/studio/tasks/task-store";
import { dueState, isOpenTask } from "@/features/studio/tasks/task-domain";
import { TaskCard } from "@/features/studio/tasks/task-card";
import { TaskForm } from "@/features/studio/tasks/task-form";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function StudioPage() {
  const result = await listStudioTasks();
  if (!result.ok)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Çalışma merkezim</h1>
        <p role="alert">
          Çalışma verileri yüklenemedi. Bağlantını kontrol edip sayfayı yenile.
        </p>
      </div>
    );
  const open = result.tasks.filter(isOpenTask),
    now = new Date();
  const recent = result.projects
    .filter((p) => p.publish_state !== "archived" && p.status !== "archived")
    .map((p) => ({
      ...p,
      activity: result.tasks
        .filter((t) => t.project_id === p.id)
        .reduce(
          (latest, t) => (t.updated_at > latest ? t.updated_at : latest),
          p.updated_at,
        ),
    }))
    .sort((a, b) => b.activity.localeCompare(a.activity));
  const upcoming = open
    .filter((t) => dueState(t, now) === "upcoming")
    .sort((a, b) => a.due_at!.localeCompare(b.due_at!));
  const stats = [
    {
      label: "Aktif proje",
      value: result.projects.filter(
        (p) => p.status === "active" && p.publish_state !== "archived",
      ).length,
      href: "/studio/projects",
    },
    { label: "Açık görev", value: open.length, href: "/studio/tasks" },
    {
      label: "Tamamlanan görev",
      value: result.tasks.filter((t) => t.status === "done").length,
      href: "/studio/tasks?status=done",
    },
    {
      label: "Gecikmiş görev",
      value: open.filter((t) => dueState(t, now) === "overdue").length,
      href: "/studio/tasks?date=overdue",
    },
  ];
  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Özel çalışma alanı"
        title="Çalışma merkezim"
        description="Projelerin, açık işlerin ve sıradaki adımların bir arada."
        status="Studio"
      />
      <section
        aria-label="Çalışma özeti"
        className="grid grid-cols-2 gap-4 xl:grid-cols-4"
      >
        {stats.map((s) => (
          <Link
            href={s.href}
            key={s.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <p className="text-sm text-[var(--muted)]">{s.label}</p>
            <p className="mt-3 text-4xl font-semibold">{s.value}</p>
          </Link>
        ))}
      </section>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Kaldığım yerden devam et</h2>
          <Link href="/studio/tasks" className="text-sm text-[var(--accent)]">
            Tüm görevler →
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {open.length ? (
            open
              .slice(0, 4)
              .map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  projectName={
                    result.projects.find((p) => p.id === t.project_id)?.title
                  }
                />
              ))
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Açık görev yok. Yeni bir görevle başlayabilirsin.
            </p>
          )}
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-xl font-semibold">Son çalışılan projeler</h2>
          {recent.length ? (
            recent.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={"/studio/projects/" + p.id}
                className="block break-words rounded-xl border border-[var(--border)] p-4 hover:text-[var(--accent)]"
              >
                {p.title}
              </Link>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">Henüz proje yok.</p>
          )}
          <div className="flex flex-wrap gap-5 text-sm text-[var(--accent)]">
            <Link href="/studio/projects">Tüm projeler →</Link>
            <Link href="/studio/projects/new">Yeni proje</Link>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Yaklaşan görevler</h2>
          {upcoming.length ? (
            upcoming.slice(0, 4).map((t) => <TaskCard key={t.id} task={t} />)
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Önümüzdeki 7 gün içinde bitecek açık görev yok.
            </p>
          )}
        </section>
      </div>
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <h2 className="mb-5 text-2xl font-semibold">Hızlı görev oluştur</h2>
        <TaskForm projects={result.projects} />
      </section>
    </div>
  );
}
