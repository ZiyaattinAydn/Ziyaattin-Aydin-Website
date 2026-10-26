import Link from "next/link";
import {
  displayDate,
  dueState,
  priorityNames,
  statusNames,
  type StudioTask,
} from "./task-domain";
export function TaskCard({
  task,
  projectName,
}: {
  task: StudioTask;
  projectName?: string;
}) {
  const due = dueState(task);
  return (
    <article className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      {task.project_id && projectName && (
        <Link
          href={"/studio/projects/" + task.project_id}
          aria-label={projectName + " projesini aç"}
          className="mb-4 inline-flex max-w-full items-center gap-2 rounded-lg border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.08)] px-3 py-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[rgba(18,217,120,0.15)]"
        >
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Proje</span>
          <span className="min-w-0 break-words">{projectName}</span>
          <span aria-hidden="true" className="shrink-0">↗</span>
        </Link>
      )}
      <div className="flex flex-wrap justify-between gap-3">
        <h3 className="min-w-0 flex-1 break-words text-lg font-semibold">
          <Link
            href={"/studio/tasks/" + task.id}
            className="hover:text-[var(--accent)]"
          >
            {task.title}
          </Link>
        </h3>
        <span className="text-sm text-[var(--accent)]">
          {priorityNames[task.priority]}
        </span>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {statusNames[task.status]}
      </p>
      {task.description && (
        <p className="mt-3 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--muted)]">
          {task.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
        {!task.project_id && <span>Bağımsız görev</span>}
        {task.project_id && !projectName && (
          <Link
            className="underline underline-offset-4"
            href={"/studio/projects/" + task.project_id}
          >
            İlişkili proje
          </Link>
        )}
        {task.due_at && <span>Bitiş: {displayDate(task.due_at)}</span>}
        {due && (
          <span
            className={
              due === "overdue" ? "text-amber-200" : "text-[var(--accent)]"
            }
          >
            {due === "overdue" ? "Gecikmiş" : "Yaklaşıyor"}
          </span>
        )}
      </div>
      <Link
        href={"/studio/tasks/" + task.id}
        className="mt-5 inline-flex rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
      >
        {task.status === "archived" ? "Arşiv kaydını aç" : "Görevi aç"}
      </Link>
    </article>
  );
}
