"use client";
import { useActionState, useState, type ChangeEvent } from "react";
import {
  createTaskAction,
  updateTaskAction,
  archiveTaskAction,
} from "./actions";
import { initialTaskState } from "./action-state";
import {
  priorityNames,
  statusNames,
  type StudioTask,
} from "./task-domain";
import type { TaskProject } from "./task-store";
import { taskInputClass } from "./task-styles";
export function TaskForm({
  task,
  projects,
  projectId = "",
}: {
  task?: StudioTask;
  projects: TaskProject[];
  projectId?: string;
}) {
  const [state, action, pending] = useActionState(
    task ? updateTaskAction.bind(null, task.id) : createTaskAction,
    initialTaskState,
  );
  const [values, setValues] = useState(() => ({
    title: task?.title ?? "",
    description: task?.description ?? "",
    projectId: task?.project_id ?? projectId,
    priority: task?.priority ?? "medium",
    status: task?.status ?? "todo",
  }));
  function changeValue(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }
  const options = projects.filter(
    (p) =>
      (p.status !== "archived" && p.publish_state !== "archived") ||
      p.id === task?.project_id,
  );
  return (
    <form action={action} className="space-y-5">
      {state.message && (
        <p
          role="alert"
          className="rounded-xl border border-amber-500/40 p-4 text-sm text-amber-200"
        >
          {state.message}
        </p>
      )}
      {task && <input type="hidden" name="version" value={task.updated_at} />}
      <fieldset
        disabled={pending}
        className="grid min-w-0 gap-4 sm:grid-cols-2"
      >
        <label className="space-y-2 text-sm sm:col-span-2">
          <span>Başlık</span>
          <input
            name="title"
            required
            maxLength={160}
            value={values.title}
            onChange={changeValue}
            className={taskInputClass}
          />
        </label>
        <label className="space-y-2 text-sm sm:col-span-2">
          <span>Açıklama / sıradaki adım</span>
          <textarea
            name="description"
            rows={4}
            maxLength={2000}
            value={values.description}
            onChange={changeValue}
            className={taskInputClass}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Proje</span>
          <select
            name="projectId"
            value={values.projectId}
            onChange={changeValue}
            className={taskInputClass}
          >
            <option value="">Bağımsız görev</option>
            {options.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
                {p.publish_state === "archived" || p.status === "archived"
                  ? " (Arşiv)"
                  : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span>Öncelik</span>
          <select
            name="priority"
            value={values.priority}
            onChange={changeValue}
            className={taskInputClass}
          >
            {Object.entries(priorityNames).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span>Durum</span>
          <select
            name="status"
            value={values.status}
            onChange={changeValue}
            className={taskInputClass}
          >
            {Object.entries(statusNames)
              .filter(([value]) => value !== "archived")
              .map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
          </select>
        </label>
        <p className="self-center text-xs leading-6 text-[var(--muted)]">
          Tamamlanan bir görevi yeniden açmak için durumunu değiştirip kaydet.
        </p>
        <button
          disabled={pending}
          type="submit"
          className="rounded-xl border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.1)] px-5 py-3 font-semibold text-[var(--accent)] disabled:opacity-60 sm:col-span-2"
        >
          {pending
            ? "Kaydediliyor…"
            : task
              ? "Değişiklikleri kaydet"
              : "Görev oluştur"}
        </button>
      </fieldset>
    </form>
  );
}
export function ArchiveTaskForm({ task }: { task: StudioTask }) {
  const [state, action, pending] = useActionState(
    archiveTaskAction.bind(null, task.id),
    initialTaskState,
  );
  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-[var(--border)] p-5"
    >
      <h2 className="text-lg font-semibold">Görevi arşivle</h2>
      <p className="text-sm text-[var(--muted)]">
        Görev silinmez; arşiv filtresinden görüntülenebilir. Arşivdeki görevler
        düzenlenemez.
      </p>
      <input type="hidden" name="version" value={task.updated_at} />
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          required
          name="confirmation"
          value="archive"
          disabled={pending}
        />
        Bu görevi arşivlemek istiyorum.
      </label>
      {state.message && (
        <p role="alert" className="text-sm text-amber-200">
          {state.message}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Arşivleniyor…" : "Arşivle"}
      </button>
    </form>
  );
}
