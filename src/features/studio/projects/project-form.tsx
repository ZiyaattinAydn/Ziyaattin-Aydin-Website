"use client";

import { useActionState, useState } from "react";
import { UploadForm } from "@/features/studio/library/upload-form";
import { useUnsavedChanges } from "@/features/studio/library/unsaved";
import type { ProjectFormValues, ProjectPublishState } from "@/features/projects/domain";
import { createProjectAction, updateProjectAction } from "@/features/studio/projects/actions";
import { INITIAL_PROJECT_ACTION_STATE, type ProjectActionState } from "@/features/studio/projects/action-state";
import { PROJECT_STATUS_LABELS, PROJECT_VISIBILITY_LABELS } from "@/features/studio/projects/project-presentation";
import { ProjectSubmitButton } from "@/features/studio/projects/project-submit-button";

type ProjectFormAction = (state: ProjectActionState, formData: FormData) => Promise<ProjectActionState>;
type ProjectFormProps = {
  mode: "create" | "edit";
  initialValues: ProjectFormValues;
  projectId?: string;
  publishState?: ProjectPublishState;
  readOnly?: boolean;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-60";
const labelClassName = "block text-sm font-medium text-[var(--foreground)]";

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  return messages?.length ? (
    <div id={id} className="mt-2 space-y-1 text-sm text-[#f0c46b]">
      {messages.map((message) => <p key={message}>{message}</p>)}
    </div>
  ) : null;
}

export function ProjectForm({
  mode, initialValues, projectId, publishState, readOnly = false,
}: ProjectFormProps) {
  const [dirty, setDirty] = useState(false);
  const serverAction: ProjectFormAction = mode === "create"
    ? createProjectAction
    : updateProjectAction.bind(null, projectId ?? "");
  const [state, formAction, pending] = useActionState(
    async (previous: ProjectActionState, form: FormData) => {
      const result = await serverAction(previous, form);
      if (result.status === "success") setDirty(false);
      return result;
    },
    INITIAL_PROJECT_ACTION_STATE,
  );
  const [imageValue, setImageValue] = useState(initialValues.imageUrl ?? "");
  useUnsavedChanges(dirty && !pending);
  const publishedVisibilityLocked = publishState === "published";

  return (
    <form data-unsaved-editor action={formAction} onChange={() => setDirty(true)} className="space-y-7">
      {state.status !== "idle" && state.message ? (
        <p role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "text-sm text-[#f0c46b]" : "text-sm text-[var(--accent)]"}>
          {state.message}
        </p>
      ) : null}
      <FieldError id="project-form-error" messages={state.fieldErrors._form} />

      <fieldset disabled={readOnly || pending} className="space-y-6">
        <label className={labelClassName}>
          Proje adı <span aria-hidden="true">*</span>
          <input name="title" required maxLength={140} defaultValue={initialValues.title}
            aria-invalid={Boolean(state.fieldErrors.title?.length)}
            aria-describedby={state.fieldErrors.title?.length ? "title-error" : undefined}
            placeholder="Örneğin: Köprüaltı Tattoo" className={inputClassName}/>
          <FieldError id="title-error" messages={state.fieldErrors.title} />
        </label>

        <label className={labelClassName}>
          Kısa açıklama
          <textarea name="summary" rows={4} maxLength={600} defaultValue={initialValues.summary}
            aria-invalid={Boolean(state.fieldErrors.summary?.length)}
            aria-describedby={state.fieldErrors.summary?.length ? "summary-error" : undefined}
            placeholder="Bu proje ne hakkında?" className={inputClassName}/>
          <FieldError id="summary-error" messages={state.fieldErrors.summary}/>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClassName}>
            Çalışma durumu
            <select name="status" defaultValue={initialValues.status} className={inputClassName}>
              {Object.entries(PROJECT_STATUS_LABELS)
                .filter(([value]) => value !== "archived" || readOnly)
                .map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <FieldError id="status-error" messages={state.fieldErrors.status}/>
          </label>
          <label className={labelClassName}>
            Görünürlük
            {publishedVisibilityLocked ? (
              <>
                <input type="hidden" name="visibility" value="public"/>
                <div className={`${inputClassName} opacity-70`}>Herkese açık — yayında olduğu için kilitli</div>
              </>
            ) : (
              <select name="visibility"
                defaultValue={initialValues.visibility === "hidden" ? "private" : initialValues.visibility}
                className={inputClassName}>
                {Object.entries(PROJECT_VISIBILITY_LABELS)
                  .filter(([value]) => value !== "hidden")
                  .map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            )}
            <FieldError id="visibility-error" messages={state.fieldErrors.visibility}/>
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-5">
          <h2 className="text-lg font-semibold">Kapak görseli <span className="text-sm font-normal text-[var(--muted)]">(isteğe bağlı)</span></h2>
          {!readOnly ? (
            <UploadForm image streamlinedPublicImage onUploaded={(url) => {
              setImageValue(url);
              setDirty(true);
            }}/>
          ) : null}
          <input type="hidden" name="imageUrl" value={imageValue}/>
          {imageValue ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[var(--muted)]">Kapak görseli seçildi.</p>
              {!readOnly ? <button type="button" onClick={() => {
                setImageValue("");
                setDirty(true);
              }} className="text-sm text-[#f0c46b] hover:underline">Kapak görselini projeden kaldır</button> : null}
            </div>
          ) : null}
          <FieldError id="image-url-error" messages={state.fieldErrors.imageUrl}/>
        </div>
      </fieldset>

      {!readOnly ? (
        <div className="flex flex-wrap items-center gap-3">
          <ProjectSubmitButton pendingLabel={mode === "create" ? "Oluşturuluyor..." : "Kaydediliyor..."}>
            {mode === "create" ? "Projeyi oluştur" : "Değişiklikleri kaydet"}
          </ProjectSubmitButton>
          <p className="text-xs leading-5 text-[var(--muted)]">
            Projenin adresi otomatik oluşturulur. Görevleri proje detayından ekleyebilirsin.
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">Arşivlenmiş proje yalnız okunabilir.</p>
      )}
    </form>
  );
}
