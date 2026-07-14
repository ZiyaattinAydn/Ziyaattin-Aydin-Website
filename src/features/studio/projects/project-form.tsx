"use client";

import { useActionState } from "react";

import type {
  ProjectFormValues,
  ProjectPublishState,
} from "@/features/projects/domain";
import {
  createProjectAction,
  updateProjectAction,
} from "@/features/studio/projects/actions";
import {
  INITIAL_PROJECT_ACTION_STATE,
  type ProjectActionState,
} from "@/features/studio/projects/action-state";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_VISIBILITY_LABELS,
} from "@/features/studio/projects/project-presentation";
import { ProjectSubmitButton } from "@/features/studio/projects/project-submit-button";

type ProjectFormAction = (
  state: ProjectActionState,
  formData: FormData,
) => Promise<ProjectActionState>;

type ProjectFormProps = {
  mode: "create" | "edit";
  initialValues: ProjectFormValues;
  projectId?: string;
  publishState?: ProjectPublishState;
  slugEditable: boolean;
  readOnly?: boolean;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-60";
const labelClassName =
  "block text-sm font-medium text-[var(--foreground)]";

function FieldError({
  id,
  messages,
}: {
  id: string;
  messages: string[] | undefined;
}) {
  if (!messages?.length) {
    return null;
  }

  return (
    <div id={id} className="mt-2 space-y-1 text-sm text-[#f0c46b]">
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}

function ActionMessage({ state }: { state: ProjectActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <div
      role={state.status === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm ${
        state.status === "error"
          ? "border-[#8a6b2a] bg-[rgba(245,158,11,0.08)] text-[#f0c46b]"
          : "border-[var(--accent-dim)] bg-[rgba(18,217,120,0.08)] text-[var(--accent)]"
      }`}
    >
      {state.message}
    </div>
  );
}

export function ProjectForm({
  mode,
  initialValues,
  projectId,
  publishState,
  slugEditable,
  readOnly = false,
}: ProjectFormProps) {
  const serverAction: ProjectFormAction =
    mode === "create"
      ? createProjectAction
      : updateProjectAction.bind(null, projectId ?? "");

  const [state, formAction] = useActionState(
    serverAction,
    INITIAL_PROJECT_ACTION_STATE,
  );

  const publishedVisibilityLocked = publishState === "published";

  return (
    <form action={formAction} className="space-y-8">
      <ActionMessage state={state} />
      <FieldError id="project-form-error" messages={state.fieldErrors._form} />

      <fieldset disabled={readOnly} className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className={labelClassName}>
            Başlık
            <input
              name="title"
              required
              maxLength={140}
              defaultValue={initialValues.title}
              aria-invalid={Boolean(state.fieldErrors.title?.length)}
              aria-describedby={
                state.fieldErrors.title?.length ? "title-error" : undefined
              }
              className={inputClassName}
            />
            <FieldError id="title-error" messages={state.fieldErrors.title} />
          </label>

          <label className={labelClassName}>
            Slug
            {slugEditable ? (
              <input
                name="slug"
                required
                maxLength={120}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                defaultValue={initialValues.slug}
                aria-invalid={Boolean(state.fieldErrors.slug?.length)}
                aria-describedby={
                  state.fieldErrors.slug?.length ? "slug-error" : "slug-help"
                }
                className={inputClassName}
              />
            ) : (
              <>
                <input type="hidden" name="slug" value={initialValues.slug} />
                <div className={`${inputClassName} opacity-70`}>
                  {initialValues.slug}
                </div>
              </>
            )}
            <p id="slug-help" className="mt-2 text-xs leading-5 text-[var(--muted)]">
              Küçük harf, rakam ve tek tire grupları kullanın. Published veya
              unpublished projelerde slug server-side olarak kilitlidir.
            </p>
            <FieldError id="slug-error" messages={state.fieldErrors.slug} />
          </label>
        </div>

        <label className={labelClassName}>
          Özet
          <textarea
            name="summary"
            rows={4}
            maxLength={600}
            defaultValue={initialValues.summary}
            aria-invalid={Boolean(state.fieldErrors.summary?.length)}
            aria-describedby={
              state.fieldErrors.summary?.length ? "summary-error" : undefined
            }
            className={inputClassName}
          />
          <FieldError id="summary-error" messages={state.fieldErrors.summary} />
        </label>

        <div className="grid gap-6 xl:grid-cols-2">
          <label className={labelClassName}>
            Problem
            <textarea
              name="problem"
              rows={9}
              maxLength={12000}
              defaultValue={initialValues.problem}
              aria-invalid={Boolean(state.fieldErrors.problem?.length)}
              aria-describedby={
                state.fieldErrors.problem?.length ? "problem-error" : undefined
              }
              className={inputClassName}
            />
            <FieldError id="problem-error" messages={state.fieldErrors.problem} />
          </label>

          <label className={labelClassName}>
            Yaklaşım
            <textarea
              name="approach"
              rows={9}
              maxLength={12000}
              defaultValue={initialValues.approach}
              aria-invalid={Boolean(state.fieldErrors.approach?.length)}
              aria-describedby={
                state.fieldErrors.approach?.length ? "approach-error" : undefined
              }
              className={inputClassName}
            />
            <FieldError id="approach-error" messages={state.fieldErrors.approach} />
          </label>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <label className={labelClassName}>
            Öne çıkanlar
            <textarea
              name="highlights"
              rows={7}
              defaultValue={initialValues.highlights.join("\n")}
              aria-invalid={Boolean(state.fieldErrors.highlights?.length)}
              aria-describedby="highlights-help"
              className={inputClassName}
            />
            <p id="highlights-help" className="mt-2 text-xs text-[var(--muted)]">
              Her satır ayrı bir madde olarak kaydedilir.
            </p>
            <FieldError
              id="highlights-error"
              messages={state.fieldErrors.highlights}
            />
          </label>

          <label className={labelClassName}>
            Sonraki adımlar
            <textarea
              name="nextSteps"
              rows={7}
              defaultValue={initialValues.nextSteps.join("\n")}
              aria-invalid={Boolean(state.fieldErrors.nextSteps?.length)}
              aria-describedby="next-steps-help"
              className={inputClassName}
            />
            <p id="next-steps-help" className="mt-2 text-xs text-[var(--muted)]">
              Her satır ayrı bir madde olarak kaydedilir.
            </p>
            <FieldError
              id="next-steps-error"
              messages={state.fieldErrors.nextSteps}
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <label className={labelClassName}>
            Çalışma durumu
            <select
              name="status"
              defaultValue={initialValues.status}
              className={inputClassName}
            >
              {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FieldError id="status-error" messages={state.fieldErrors.status} />
          </label>

          <label className={labelClassName}>
            Görünürlük
            {publishedVisibilityLocked ? (
              <>
                <input type="hidden" name="visibility" value="public" />
                <div className={`${inputClassName} opacity-70`}>
                  Public — published durumda kilitli
                </div>
              </>
            ) : (
              <select
                name="visibility"
                defaultValue={initialValues.visibility}
                className={inputClassName}
              >
                {Object.entries(PROJECT_VISIBILITY_LABELS).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            )}
            <FieldError
              id="visibility-error"
              messages={state.fieldErrors.visibility}
            />
          </label>

          <label className={labelClassName}>
            İlerleme
            <input
              name="progress"
              type="number"
              min={0}
              max={100}
              step={1}
              defaultValue={initialValues.progress}
              className={inputClassName}
            />
            <FieldError
              id="progress-error"
              messages={state.fieldErrors.progress}
            />
          </label>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <input
            name="isFeatured"
            type="checkbox"
            defaultChecked={initialValues.isFeatured}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
          <span>
            <span className="block text-sm font-medium">Öne çıkan proje</span>
            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
              Bu bayrak tek başına projeyi yayınlamaz.
            </span>
          </span>
        </label>

        <div className="space-y-5 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-5">
          <div>
            <h2 className="text-lg font-semibold">Bağlantılar ve görsel</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Yeni veya değişen link/görsel approval durumunu pending yapar.
              Approval UI bu sprintte yoktur; pending içerik publish edilemez.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <label className={labelClassName}>
              GitHub URL
              <input
                name="githubUrl"
                type="url"
                maxLength={2048}
                defaultValue={initialValues.githubUrl ?? ""}
                placeholder="https://github.com/..."
                className={inputClassName}
              />
              <FieldError
                id="github-url-error"
                messages={state.fieldErrors.githubUrl}
              />
            </label>

            <label className={labelClassName}>
              Demo URL
              <input
                name="demoUrl"
                type="url"
                maxLength={2048}
                defaultValue={initialValues.demoUrl ?? ""}
                placeholder="https://..."
                className={inputClassName}
              />
              <FieldError
                id="demo-url-error"
                messages={state.fieldErrors.demoUrl}
              />
            </label>
          </div>

          <label className={labelClassName}>
            Görsel URL
            <input
              name="imageUrl"
              type="url"
              maxLength={2048}
              defaultValue={initialValues.imageUrl ?? ""}
              placeholder="https://..."
              className={inputClassName}
            />
            <FieldError
              id="image-url-error"
              messages={state.fieldErrors.imageUrl}
            />
          </label>
        </div>
      </fieldset>

      {!readOnly ? (
        <div className="flex flex-wrap items-center gap-3">
          <ProjectSubmitButton
            pendingLabel={mode === "create" ? "Oluşturuluyor..." : "Kaydediliyor..."}
          >
            {mode === "create" ? "Taslak oluştur" : "Değişiklikleri kaydet"}
          </ProjectSubmitButton>
          <p className="text-xs leading-5 text-[var(--muted)]">
            Owner kimliği, publish state ve approval alanları formdan alınmaz.
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
          Arşivlenmiş proje read-only durumundadır. Restore bu sprintte yoktur.
        </p>
      )}
    </form>
  );
}
