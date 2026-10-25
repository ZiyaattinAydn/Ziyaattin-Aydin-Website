import Link from "next/link";
import { listStudioTasks } from "@/features/studio/tasks/task-store";
import { TaskForm } from "@/features/studio/tasks/task-form";
export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const [result, params] = await Promise.all([listStudioTasks(), searchParams]);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/studio/tasks" className="text-sm text-[var(--muted)]">
        ← Görevlere dön
      </Link>
      <h1 className="text-3xl font-semibold">Yeni görev</h1>
      {result.ok ? (
        <TaskForm projects={result.projects} projectId={params.project} />
      ) : (
        <p role="alert">Projeler yüklenemedi. Sayfayı yenileyip tekrar dene.</p>
      )}
    </div>
  );
}
