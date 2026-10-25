import Link from "next/link";

import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { listStudioTasks } from "@/features/studio/tasks/task-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const statusNames: Record<string, string> = {
  todo: "Yapılacak",
  in_progress: "Üzerinde çalışıyorum",
  blocked: "Beklemede",
  done: "Tamamlandı",
};

const priorityNames: Record<string, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  urgent: "Acil",
};

export default async function StudioPage() {
  const result = await listStudioTasks();
  const activeTasks = result.ok
    ? result.tasks.filter((task) => task.status !== "done" && task.status !== "archived")
    : [];
  const inProgress = activeTasks.filter((task) => task.status === "in_progress").length;
  const blocked = activeTasks.filter((task) => task.status === "blocked").length;

  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Özel Çalışma Alanı"
        title="Çalışma merkezim"
        description="Yarım bıraktığın işleri, projelerini ve sıradaki adımlarını tek yerden takip et. Bu panel örnek sayı göstermez; yalnız kayıtlı ve erişilebilir görevleri kullanır."
        status="Studio / Takip"
      />
      {!result.ok ? (
        <section role="alert" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-xl font-semibold">Çalışma verilerine ulaşılamıyor</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Supabase bağlantısı veya güvenli oturum doğrulanmadığı için kişisel verileri yükleyemiyoruz. Veriler boşmuş gibi gösterilmiyor.
          </p>
        </section>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Gerçek çalışma istatistikleri">
            {[
              { label: "Aktif proje", value: result.projects.length },
              { label: "Açık görev", value: activeTasks.length },
              { label: "Devam eden", value: inProgress },
              { label: "Bekleyen", value: blocked },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                <p className="mt-3 text-4xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Kaldığım yerden devam et</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">Son güncellenen açık işler</p>
              </div>
              <Link href="/studio/tasks" className="rounded-xl border border-[var(--accent-dim)] px-4 py-2 text-sm text-[var(--accent)]">
                Tüm görevler / Yeni görev
              </Link>
            </div>
            {activeTasks.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
                Açık görev yok. Bir proje seçip ilk yapılacak işi ekleyebilirsin.
              </p>
            ) : (
              <div className="mt-6 grid gap-3">
                {activeTasks.slice(0, 6).map((task) => {
                  const project = result.projects.find((item) => item.id === task.project_id);
                  return (
                    <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-4">
                      <div className="min-w-0">
                        <p className="font-semibold">{task.title}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {project?.title ?? "Bağımsız görev"} · {statusNames[task.status]} · {priorityNames[task.priority]} öncelik
                        </p>
                        {task.description ? (
                          <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{task.description}</p>
                        ) : null}
                      </div>
                      <Link href="/studio/tasks" className="text-sm font-semibold text-[var(--accent)]">
                        Devam et
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { href: "/studio/projects", title: "Projeler", description: "Projeleri düzenle ve ilerlemeyi güncelle" },
          { href: "/studio/tasks", title: "Görevler", description: "Gerçek görev oluştur, tamamla veya arşivle" },
          { href: "/studio/notes", title: "Notlar", description: "Not kütüphanesi henüz mock aşamasında" },
          { href: "/studio/files", title: "Dosyalar", description: "Dosya yönetimi henüz mock aşamasında" },
        ].map((module) => (
          <Link key={module.href} href={module.href} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent-dim)]">
            <h2 className="text-lg font-semibold">{module.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{module.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
