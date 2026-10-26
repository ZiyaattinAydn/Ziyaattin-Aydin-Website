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
  mode, initialValues, projectId, readOnly = false,
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
  const [previewTitle, setPreviewTitle] = useState(initialValues.title);
  const [previewSubtitle, setPreviewSubtitle] = useState(initialValues.subtitle);
  const [previewSummary, setPreviewSummary] = useState(initialValues.summary);
  useUnsavedChanges(dirty && !pending);


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
            placeholder="Örneğin: Köprüaltı Tattoo" onChange={(event) => setPreviewTitle(event.target.value)} className={inputClassName}/>
          <FieldError id="title-error" messages={state.fieldErrors.title} />
        </label>

        <label className={labelClassName}>
          Kart alt başlığı <span className="text-xs font-normal text-[var(--muted)]">(isteğe bağlı)</span>
          <input name="subtitle" maxLength={160} defaultValue={initialValues.subtitle}
            onChange={(event) => setPreviewSubtitle(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors.subtitle?.length)}
            aria-describedby={state.fieldErrors.subtitle?.length ? "subtitle-error" : "subtitle-help"}
            placeholder="Next.js · TypeScript · Kurumsal Web" className={inputClassName}/>
          <span id="subtitle-help" className="mt-2 block text-xs font-normal text-[var(--muted)]">Proje adının altında küçük satır olarak görünür. Teknoloji ve proje türünü yazabilirsin.</span>
          <FieldError id="subtitle-error" messages={state.fieldErrors.subtitle}/>
        </label>

        <label className={labelClassName}>
          Kısa açıklama
          <textarea name="summary" rows={4} maxLength={600} defaultValue={initialValues.summary} onChange={(event) => setPreviewSummary(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors.summary?.length)}
            aria-describedby={state.fieldErrors.summary?.length ? "summary-error" : undefined}
            placeholder="Bu proje ne hakkında?" className={inputClassName}/>
          <FieldError id="summary-error" messages={state.fieldErrors.summary}/>
        </label>

        <section aria-label="Proje kartı önizlemesi" className="space-y-3">
          <h2 className="text-sm font-semibold">Kart önizlemesi</h2>
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[#080a0a] px-6 py-6 text-white sm:px-7">
            <h3 className="break-words text-2xl font-semibold tracking-tight">{previewTitle.trim() || "Proje adı"}</h3>
            {previewSubtitle.trim() && (
              <p className="mt-2 break-words text-sm leading-6 text-[#aaa]">{previewSubtitle.trim()}</p>
            )}
            <p className="mt-4 whitespace-pre-wrap break-words text-base leading-7 text-[#c3c3c3]">{previewSummary.trim() || "Projenin kısa açıklaması burada görünecek."}</p>
          </div>
          <p className="text-xs leading-5 text-[var(--muted)]">İçerik önizlemesi. Yayınlanan kart, site tasarımına ve kapak görseline uyum sağlar.</p>
        </section>


        <div className="grid gap-6 xl:grid-cols-2">
          <label className={labelClassName}>
            Problem
            <textarea name="problem" rows={7} maxLength={12000}
              defaultValue={initialValues.problem} className={inputClassName}
              aria-invalid={Boolean(state.fieldErrors.problem?.length)}
              aria-describedby={state.fieldErrors.problem?.length ? "problem-error" : undefined}
              placeholder="Bu projeyle hangi sorunu çözüyorsun?"/>
            <FieldError id="problem-error" messages={state.fieldErrors.problem}/>
          </label>
          <label className={labelClassName}>
            Yaklaşım
            <textarea name="approach" rows={7} maxLength={12000}
              defaultValue={initialValues.approach} className={inputClassName}
              aria-invalid={Boolean(state.fieldErrors.approach?.length)}
              aria-describedby={state.fieldErrors.approach?.length ? "approach-error" : undefined}
              placeholder="Nasıl bir çözüm geliştiriyorsun?"/>
            <FieldError id="approach-error" messages={state.fieldErrors.approach}/>
          </label>
        </div>

        <label className={labelClassName}>
          Öne çıkanlar
          <textarea name="highlights" rows={5}
            defaultValue={initialValues.highlights.join("\n")} className={inputClassName}
            aria-invalid={Boolean(state.fieldErrors.highlights?.length)}
            aria-describedby="highlights-help"
            placeholder={"Projede öne çıkan bir özellik\nTamamladığın önemli bir aşama"}/>
          <p id="highlights-help" className="mt-2 text-xs text-[var(--muted)]">
            Her satır ayrı bir madde olarak kaydedilir.
          </p>
          <FieldError id="highlights-error" messages={state.fieldErrors.highlights}/>
        </label>

        <div className="grid gap-5 md:grid-cols-3">
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
            <select name="visibility"
              defaultValue={initialValues.visibility === "hidden" ? "private" : initialValues.visibility}
              aria-describedby="visibility-help"
              className={inputClassName}>
              {Object.entries(PROJECT_VISIBILITY_LABELS)
                .filter(([value]) => value !== "hidden")
                .map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <span id="visibility-help" className="mt-2 block text-xs font-normal leading-5 text-[var(--muted)]">
              Herkese açık seçildiğinde kaydetmek portföyünde yayınlar. Özel seçildiğinde yayından kaldırır.
            </span>
            <FieldError id="visibility-error" messages={state.fieldErrors.visibility}/>
          </label>
          <label className={labelClassName}>
            Kişisel ilerleme tahmini (%)
            <input name="progress" type="number" min={0} max={100} step={1}
              defaultValue={initialValues.progress} className={inputClassName}/>
            <FieldError id="progress-error" messages={state.fieldErrors.progress}/>
          </label>
        </div>


        <label className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <input type="checkbox" name="isFeatured" defaultChecked={initialValues.isFeatured}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"/>
          <span>
            <span className="block text-sm font-medium">Ana sayfada öne çıkar</span>
            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
              Yalnızca herkese açık projelerin ana sayfadaki sıralamasını etkiler.
            </span>
          </span>
        </label>

        <div className="grid gap-5 lg:grid-cols-2">
          <label className={labelClassName}>
            GitHub URL
            <input name="githubUrl" type="url" maxLength={2048}
              defaultValue={initialValues.githubUrl ?? ""}
              placeholder="https://github.com/..." className={inputClassName}/>
            <FieldError id="github-url-error" messages={state.fieldErrors.githubUrl}/>
          </label>
          <label className={labelClassName}>
            Demo URL
            <input name="demoUrl" type="url" maxLength={2048}
              defaultValue={initialValues.demoUrl ?? ""}
              placeholder="https://..." className={inputClassName}/>
            <FieldError id="demo-url-error" messages={state.fieldErrors.demoUrl}/>
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
