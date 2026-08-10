"use client";

import { useActionState } from "react";

import type {
  WritingFormValues,
  WritingPublishState,
} from "@/features/writings/domain";
import {
  createWritingAction,
  updateWritingAction,
} from "@/features/studio/writings/actions";
import {
  INITIAL_WRITING_ACTION_STATE,
  type WritingActionState,
} from "@/features/studio/writings/action-state";
import {
  WRITING_VISIBILITY_LABELS,
} from "@/features/studio/writings/writing-presentation";
import { WritingSubmitButton } from "@/features/studio/writings/writing-submit-button";

type WritingFormAction = (
  state: WritingActionState,
  formData: FormData,
) => Promise<WritingActionState>;

type WritingFormProps = {
  mode: "create" | "edit";
  initialValues: WritingFormValues;
  writingId?: string;
  publishState?: WritingPublishState;
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

function ActionMessage({ state }: { state: WritingActionState }) {
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

export function WritingForm({
  mode,
  initialValues,
  writingId,
  publishState,
  slugEditable,
  readOnly = false,
}: WritingFormProps) {
  const serverAction: WritingFormAction =
    mode === "create"
      ? createWritingAction
      : updateWritingAction.bind(null, writingId ?? "");

  const [state, formAction] = useActionState(
    serverAction,
    INITIAL_WRITING_ACTION_STATE,
  );

  const publishedVisibilityLocked = publishState === "published";

  return (
    <form action={formAction} className="space-y-8">
      <ActionMessage state={state} />
      <FieldError id="writing-form-error" messages={state.fieldErrors._form} />

      <fieldset disabled={readOnly} className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className={labelClassName}>
            Başlık
            <input
              name="title"
              required
              maxLength={200}
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
              unpublished yazılarda slug server-side olarak kilitlidir.
            </p>
            <FieldError id="slug-error" messages={state.fieldErrors.slug} />
          </label>
        </div>

        <label className={labelClassName}>
          Özet
          <textarea
            name="excerpt"
            rows={3}
            maxLength={800}
            defaultValue={initialValues.excerpt}
            aria-invalid={Boolean(state.fieldErrors.excerpt?.length)}
            aria-describedby={
              state.fieldErrors.excerpt?.length ? "excerpt-error" : undefined
            }
            className={inputClassName}
          />
          <FieldError id="excerpt-error" messages={state.fieldErrors.excerpt} />
        </label>

        <label className={labelClassName}>
          İçerik
          <textarea
            name="content"
            rows={18}
            maxLength={100000}
            defaultValue={initialValues.content}
            aria-invalid={Boolean(state.fieldErrors.content?.length)}
            aria-describedby={
              state.fieldErrors.content?.length ? "content-error" : "content-help"
            }
            className={inputClassName}
          />
          <p id="content-help" className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Düz metin veya JSON section formatı kullanılabilir. Publish için içerik zorunludur.
          </p>
          <FieldError id="content-error" messages={state.fieldErrors.content} />
        </label>

        <div className="grid gap-6 md:grid-cols-3">
          <label className={labelClassName}>
            Kategori
            <input
              name="category"
              maxLength={100}
              defaultValue={initialValues.category}
              placeholder="Yazılım, Yapay Zekâ, Ürün..."
              className={inputClassName}
            />
            <FieldError id="category-error" messages={state.fieldErrors.category} />
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
                {Object.entries(WRITING_VISIBILITY_LABELS).map(
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
            Okuma süresi (dk)
            <input
              name="readingTime"
              type="number"
              min={1}
              max={999}
              step={1}
              defaultValue={initialValues.readingTime ?? ""}
              placeholder="Ör: 5"
              className={inputClassName}
            />
            <FieldError
              id="reading-time-error"
              messages={state.fieldErrors.readingTime}
            />
          </label>
        </div>

        <label className={labelClassName}>
          Etiketler
          <textarea
            name="tags"
            rows={2}
            defaultValue={initialValues.tags.join(", ")}
            aria-describedby="tags-help"
            className={inputClassName}
          />
          <p id="tags-help" className="mt-2 text-xs text-[var(--muted)]">
            Virgül veya satır sonu ile ayırın. En fazla 20 etiket.
          </p>
          <FieldError id="tags-error" messages={state.fieldErrors.tags} />
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <input
            name="isFeatured"
            type="checkbox"
            defaultChecked={initialValues.isFeatured}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
          <span>
            <span className="block text-sm font-medium">Öne çıkan yazı</span>
            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
              Bu bayrak tek başına yazıyı yayınlamaz.
            </span>
          </span>
        </label>

        <div className="space-y-5 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-5">
          <div>
            <h2 className="text-lg font-semibold">Kapak görseli</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Yeni veya değişen görsel approval durumunu pending yapar.
              Pending görsel publish edilemez.
            </p>
          </div>

          <label className={labelClassName}>
            Kapak görsel URL
            <input
              name="coverImageUrl"
              type="url"
              maxLength={2048}
              defaultValue={initialValues.coverImageUrl ?? ""}
              placeholder="https://upcdn.io/12a1y1C/raw/content-submission-form.png"
              className={inputClassName}
            />
            <FieldError
              id="cover-image-url-error"
              messages={state.fieldErrors.coverImageUrl}
            />
          </label>
        </div>
      </fieldset>

      {!readOnly ? (
        <div className="flex flex-wrap items-center gap-3">
          <WritingSubmitButton
            pendingLabel={mode === "create" ? "Oluşturuluyor..." : "Kaydediliyor..."}
          >
            {mode === "create" ? "Taslak oluştur" : "Değişiklikleri kaydet"}
          </WritingSubmitButton>
          <p className="text-xs leading-5 text-[var(--muted)]">
            Owner kimliği, publish state ve approval alanları formdan alınmaz.
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
          Arşivlenmiş yazı read-only durumundadır. Restore henüz yoktur.
        </p>
      )}
    </form>
  );
}
