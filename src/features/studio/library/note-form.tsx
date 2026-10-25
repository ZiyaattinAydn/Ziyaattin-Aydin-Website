"use client";
import { useActionState, useState } from "react";
import { saveNote, archiveNote } from "./note-actions";
import { initialLibraryState, type Note, type LibraryProject } from "./domain";
import { taskInputClass as input } from "../tasks/task-styles";
import { useUnsavedChanges } from "./unsaved";
export function NoteForm({
  note,
  projects,
}: {
  note?: Note;
  projects: LibraryProject[];
}) {
  const [state, action, pending] = useActionState(
    saveNote.bind(null, note?.id ?? null),
    initialLibraryState,
  );
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty && !pending);
  return (
    <form
      data-unsaved-editor
      action={action}
      onChange={() => setDirty(true)}
      className="space-y-5"
    >
      <p className="text-sm text-[var(--muted)]">
        Notların yalnız sana görünür. Metin veya Markdown yazabilirsin.
      </p>
      {state.message && (
        <p role="alert" className="text-amber-200">
          {state.message}
        </p>
      )}
      <input type="hidden" name="version" value={note?.updated_at ?? ""} />
      <fieldset
        disabled={pending}
        className="grid min-w-0 gap-5 sm:grid-cols-2"
      >
        <label className="space-y-2 sm:col-span-2">
          Başlık
          <input
            className={input}
            name="title"
            required
            maxLength={200}
            defaultValue={note?.title}
          />
        </label>
        <label className="space-y-2 sm:col-span-2">
          İçerik
          <textarea
            className={`${input} min-h-72 font-mono leading-7`}
            name="content"
            rows={16}
            maxLength={100000}
            defaultValue={note?.content}
          />
        </label>
        <label className="space-y-2">
          Proje
          <select
            className={input}
            name="projectId"
            defaultValue={note?.project_id ?? ""}
          >
            <option value="">Bağımsız not</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          Kategori
          <input
            className={input}
            name="category"
            maxLength={100}
            defaultValue={note?.category ?? ""}
          />
        </label>
        <label className="space-y-2 sm:col-span-2">
          Etiketler
          <input
            className={input}
            name="tags"
            defaultValue={note?.tags.join(", ")}
            aria-describedby="note-tags-help"
          />
          <span id="note-tags-help" className="text-xs text-[var(--muted)]">
            Virgülle ayır. En fazla 20 etiket.
          </span>
        </label>
        <button
          className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-black disabled:opacity-60 sm:col-span-2"
          disabled={pending}
        >
          {pending ? "Kaydediliyor…" : "Notu kaydet"}
        </button>
      </fieldset>
      {dirty && (
        <p role="status" className="text-sm text-amber-200">
          Kaydedilmeyen değişiklikler var.
        </p>
      )}
    </form>
  );
}
export function ArchiveNote({ note }: { note: Note }) {
  const [state, action, pending] = useActionState(
    archiveNote.bind(null, note.id),
    initialLibraryState,
  );
  return (
    <form
      action={action}
      className="space-y-4 rounded-xl border border-[var(--border)] p-5"
    >
      <h2 className="text-lg font-semibold">Notu arşivle</h2>
      <p className="text-sm text-[var(--muted)]">
        Not silinmez. Arşiv filtresinden okumaya devam edebilirsin.
      </p>
      <input type="hidden" name="version" value={note.updated_at} />
      <label className="flex gap-3">
        <input
          type="checkbox"
          name="confirmation"
          value="archive"
          required
          disabled={pending}
        />
        Bu notu arşivlemek istiyorum.
      </label>
      {state.message && <p role="alert">{state.message}</p>}
      <button
        disabled={pending}
        className="rounded-xl border border-[var(--border)] px-4 py-3"
      >
        {pending ? "Arşivleniyor…" : "Arşivle"}
      </button>
    </form>
  );
}
