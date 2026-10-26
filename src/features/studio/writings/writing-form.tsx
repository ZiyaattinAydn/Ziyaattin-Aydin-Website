"use client";

import { useActionState, useState } from "react";
import { UploadForm } from "@/features/studio/library/upload-form";
import { useUnsavedChanges } from "@/features/studio/library/unsaved";
import type { WritingFormValues } from "@/features/writings/domain";
import { createWritingAction, updateWritingAction } from "@/features/studio/writings/actions";
import { INITIAL_WRITING_ACTION_STATE, type WritingActionState } from "@/features/studio/writings/action-state";
import { WritingSubmitButton } from "@/features/studio/writings/writing-submit-button";

type WritingFormAction = (state: WritingActionState, formData: FormData) => Promise<WritingActionState>;
type Props = { mode: "create" | "edit"; initialValues: WritingFormValues; writingId?: string; readOnly?: boolean };

const input = "mt-2 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-60";
const label = "block text-sm font-medium text-[var(--foreground)]";

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  return messages?.length ? (
    <div id={id} role="alert" className="mt-2 space-y-1 text-sm text-[#f0c46b]">
      {messages.map((message) => <p key={message}>{message}</p>)}
    </div>
  ) : null;
}

export function WritingForm({ mode, initialValues, writingId, readOnly = false }: Props) {
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(initialValues.coverImageUrl ?? "");
  const [previewTitle, setPreviewTitle] = useState(initialValues.title);
  const [previewExcerpt, setPreviewExcerpt] = useState(initialValues.excerpt);
  const [previewContent, setPreviewContent] = useState(initialValues.content);
  const [visibility, setVisibility] = useState(initialValues.visibility === "public" ? "public" : "private");

  const action: WritingFormAction = mode === "create"
    ? createWritingAction
    : updateWritingAction.bind(null, writingId ?? "");

  const [state, formAction, pending] = useActionState(
    async (previous: WritingActionState, data: FormData) => {
      const result = await action(previous, data);
      if (result.status === "success") setDirty(false);
      return result;
    },
    INITIAL_WRITING_ACTION_STATE,
  );

  const estimatedMinutes = Math.max(1, Math.ceil(previewContent.trim().split(/\s+/).filter(Boolean).length / 200));
  useUnsavedChanges(dirty && !pending);

  return (
    <form data-unsaved-editor action={formAction} onChange={() => setDirty(true)} className="space-y-7">
      {state.status !== "idle" && state.message && (
        <p role={state.status === "error" ? "alert" : "status"}
          className={`rounded-xl border p-4 text-sm ${state.status === "error"
            ? "border-[#8a6b2a] text-[#f0c46b]"
            : "border-[var(--accent-dim)] text-[var(--accent)]"}`}>{state.message}</p>
      )}
      <FieldError id="writing-form-error" messages={state.fieldErrors._form} />

      <fieldset disabled={readOnly || pending} className="space-y-6">
        <label className={label}>
          Başlık *
          <input name="title" required maxLength={200} defaultValue={initialValues.title}
            onChange={(event) => setPreviewTitle(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors.title?.length)}
            className={input} placeholder="Örn. Yetişmeye Çalışırken Kaçırdığımız Hayat"/>
          <FieldError id="title-error" messages={state.fieldErrors.title}/>
          <span className="mt-2 block text-xs font-normal text-[var(--muted)]">Yazının bağlantısı bu başlıktan otomatik oluşturulur.</span>
        </label>

        <label className={label}>
          Kısa açıklama *
          <textarea name="excerpt" required rows={3} maxLength={800}
            defaultValue={initialValues.excerpt}
            onChange={(event) => setPreviewExcerpt(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors.excerpt?.length)}
            className={input} placeholder="Yazının ne anlattığını birkaç cümleyle özetle."/>
          <FieldError id="excerpt-error" messages={state.fieldErrors.excerpt}/>
        </label>

        <label className={label}>
          Yazı içeriği *
          <textarea name="content" required rows={20} maxLength={100000}
            defaultValue={initialValues.content}
            onChange={(event) => setPreviewContent(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors.content?.length)}
            aria-describedby="writing-content-help"
            className={input + " min-h-96 resize-y font-sans leading-7"}
            placeholder="Yazını buraya yapıştır veya yazmaya başla. Paragraflar arasında boş satır bırakabilirsin."/>
          <span id="writing-content-help" className="mt-2 block text-xs font-normal text-[var(--muted)]">
            Paragraflar arasında boş satır bırak. İçerik düz metin olarak gösterilir; özel biçimlendirme kodu gerekmez.
            {" "}{previewContent.length.toLocaleString("tr-TR")} karakter · yaklaşık {estimatedMinutes} dk okuma
          </span>
          <FieldError id="content-error" messages={state.fieldErrors.content}/>
        </label>

        <section aria-label="Yazı önizlemesi" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[var(--accent)]">Yazı önizlemesi</h2>
          <h3 className="mt-4 break-words text-2xl font-semibold tracking-tight">
            {previewTitle.trim() || "Yazının başlığı"}
          </h3>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[var(--muted)]">
            {previewExcerpt.trim() || "Kısa açıklama burada görünecek."}
          </p>
          <p className="mt-5 line-clamp-5 whitespace-pre-wrap break-words border-t border-[var(--border)] pt-4 text-sm leading-7 text-[var(--muted-strong)]">
            {previewContent.trim() || "Yazının başlangıcı burada görünecek."}
          </p>
          <p className="mt-3 text-xs text-[var(--muted)]">Bu, hızlı metin önizlemesidir; yayın sonrası sayfa düzeni farklı olabilir.</p>
        </section>

        <div className="grid gap-5 md:grid-cols-3">
          <label className={label}>
            Kategori
            <input name="category" maxLength={100} defaultValue={initialValues.category}
              placeholder="Örn. Kişisel Deneme" className={input}/>
            <FieldError id="category-error" messages={state.fieldErrors.category}/>
          </label>
          <label className={label}>
            Görünürlük
            <select name="visibility" value={visibility}
              onChange={(event) => setVisibility(event.target.value as "private" | "public")}
              className={input}>
              <option value="private">Özel</option>
              <option value="public">Herkese açık</option>
            </select>
            <p className="mt-2 text-xs font-normal leading-5 text-[var(--muted)]">
              {visibility === "public"
                ? "Kaydettiğinde yazı ziyaretçilere yayınlanır."
                : "Yalnız Studio'da görünür; istediğinde yayınlayabilirsin."}
            </p>
            <FieldError id="visibility-error" messages={state.fieldErrors.visibility}/>
          </label>
          <label className={label}>
            Okuma süresi (dk)
            <input name="readingTime" type="number" min={1} max={999} step={1}
              defaultValue={initialValues.readingTime ?? ""}
              placeholder={String(estimatedMinutes)}
              className={input}/>
            <p className="mt-2 text-xs font-normal text-[var(--muted)]">İsteğe bağlı. Yaklaşık {estimatedMinutes} dakika.</p>
            <FieldError id="reading-time-error" messages={state.fieldErrors.readingTime}/>
          </label>
        </div>

        <label className={label}>
          Etiketler
          <textarea name="tags" rows={2} defaultValue={initialValues.tags.join(", ")}
            className={input} placeholder="yaşam, üretkenlik, zaman"/>
          <p className="mt-2 text-xs font-normal text-[var(--muted)]">Virgülle ayır; en fazla 20 etiket.</p>
          <FieldError id="tags-error" messages={state.fieldErrors.tags}/>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <input name="isFeatured" type="checkbox" defaultChecked={initialValues.isFeatured}
            className="mt-1 h-4 w-4 accent-[var(--accent)]"/>
          <span>
            <span className="block text-sm font-medium">Ana sayfada öne çıkar</span>
            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
              Öne çıkarma tercihi yalnızca herkese açık yazılar için görünür.
            </span>
          </span>
        </label>

        <section className="space-y-3 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-5">
          <h2 className="text-lg font-semibold">Kapak görseli <span className="text-sm font-normal text-[var(--muted)]">(isteğe bağlı)</span></h2>
          <p className="text-xs leading-6 text-[var(--muted)]">
            Görsel herkese açık bir bağlantıda saklanır. Özel yazıda da bağlantıyı bilen biri görseli görebilir; kişisel belge yükleme.
          </p>
          {!readOnly && (
            <UploadForm image streamlinedPublicImage
              onBusyChange={setUploading}
              onUploaded={(url) => { setCoverImageUrl(url); setDirty(true); }}/>
          )}
          <input type="hidden" name="coverImageUrl" value={coverImageUrl}/>
          {coverImageUrl && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-3">
              <p className="text-xs text-[var(--accent)]">✓ Kapak görseli seçildi.</p>
              {!readOnly && (
                <button type="button" onClick={() => { setCoverImageUrl(""); setDirty(true); }}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
                  Görseli kaldır
                </button>
              )}
            </div>
          )}
          <FieldError id="cover-image-url-error" messages={state.fieldErrors.coverImageUrl}/>
          {uploading && <p role="status" className="text-sm text-amber-200">Yükleme tamamlanmadan yazıyı kaydetme.</p>}
        </section>
      </fieldset>

      {!readOnly ? (
        <div className="flex flex-wrap items-center gap-3">
          <WritingSubmitButton disabled={uploading}
            pendingLabel={mode === "create" ? "Oluşturuluyor..." : "Kaydediliyor..."}>
            {mode === "create" ? "Yazıyı oluştur" : "Değişiklikleri kaydet"}
          </WritingSubmitButton>
          <p className="text-xs leading-5 text-[var(--muted)]">
            {visibility === "public" ? "Kaydettiğinde yayınlanacak." : "Özel olarak kaydedilecek."}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
          Arşivlenmiş yazı yalnızca okunabilir.
        </p>
      )}
    </form>
  );
}
