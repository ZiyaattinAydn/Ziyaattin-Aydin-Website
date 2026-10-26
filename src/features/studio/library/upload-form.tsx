"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { prepareUpload, finishUpload } from "./file-actions";
import {
  FILE_TYPES,
  IMAGE_TYPES,
  validateUpload,
  type LibraryProject,
} from "./domain";
import { taskInputClass as input } from "../tasks/task-styles";
import { useUnsavedChanges } from "./unsaved";
export function UploadForm({
  projects = [],
  image = false,
  streamlinedPublicImage = false,
  onUploaded,
}: {
  projects?: LibraryProject[];
  image?: boolean;
  streamlinedPublicImage?: boolean;
  onUploaded?: (url: string) => void;
}) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState<string | null>(null);
  useUnsavedChanges(busy);
  async function upload(form: FormData) {
    setBusy(true);
    setMessage("");
    try {
      const file = ref.current?.files?.[0];
      if (!file) throw new Error("Bir dosya seç.");
      // Some mobile pickers omit a MIME type for Markdown/text files.
      const type =
        file.type ||
        (/\.(md|markdown)$/i.test(file.name)
          ? "text/markdown"
          : /\.txt$/i.test(file.name)
            ? "text/plain"
            : "");
      validateUpload(file.name, type, file.size, image);
      const ready = await prepareUpload({
        name: file.name,
        type,
        size: file.size,
        projectId: String(form.get("projectId") ?? "") || null,
        image,
        publicConsent: image && streamlinedPublicImage ? true : form.get("publicConsent") === "yes",
      });
      if (!ready.ok) throw new Error(ready.message);
      setRetry(ready.id);
      const client = createBrowserSupabaseClient();
      // Bytes go directly to Storage: no Vercel/Server Action request body limit.
      const uploaded = await client.storage
        .from(ready.bucket)
        .upload(ready.path, file, {
          contentType: type,
          upsert: false,
          cacheControl: image ? "3600" : "0",
        });
      if (uploaded.error)
        throw new Error(
          "Dosya aktarılamadı. Bağlantını ve oturumunu kontrol et. Yarım kalan kaydı Dosyalar ekranında görebilirsin.",
        );
      const done = await finishUpload(ready.id);
      if (!done.ok) throw new Error(done.message);
      setRetry(null);
      if (done.url) onUploaded?.(done.url);
      setMessage(
        image
          ? "Görsel yüklendi. Kayda bağlamak için formu kaydet."
          : "Dosya yüklendi.",
      );
      if (ref.current) ref.current.value = "";
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Yükleme tamamlanamadı.");
    } finally {
      setBusy(false);
    }
  }
  async function resume() {
    if (!retry) return;
    setBusy(true);
    try {
      const r = await finishUpload(retry);
      setMessage(r.ok ? "Yükleme tamamlandı." : r.message);
      if (r.ok) {
        setRetry(null);
        if (r.url) onUploaded?.(r.url);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] p-4">
      <div className="space-y-3">
        <label className="block text-sm">
          {image ? "Görsel seç" : "Dosya seç"}
          <input
            ref={ref}
            type="file"
            disabled={busy}
            accept={(image ? IMAGE_TYPES : FILE_TYPES).join(",")}
            className={`${input} mt-2 file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--surface)] file:p-2`}
          />
        </label>
        <p className="text-xs leading-6 text-[var(--muted)]">
          {image
            ? "JPEG, PNG, WebP veya AVIF · En fazla 10 MB"
            : "PDF, Word, PowerPoint, metin, Markdown veya görsel · En fazla 25 MB. Dosyalar yalnız sana görünür."}
        </p>
        {!image && (
          <label className="block text-sm">
            Proje
            <select
              name="uploadProject"
              className={input}
              disabled={busy}
              defaultValue=""
              id="upload-project"
            >
              <option value="">Bağımsız dosya</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
        )}
        {image && streamlinedPublicImage && (
          <p className="text-xs leading-6 text-[var(--muted)]">
            Kapak görseli herkese açık bir bağlantıda saklanır; proje özel olsa bile bağlantıyı bilenler görseli görebilir. Özel belge yükleme.
          </p>
        )}
        {image && !streamlinedPublicImage && (
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              id="public-image-consent"
              disabled={busy}
              className="mt-1"
            />
            Bu görselin bağlantıyı bilen herkesçe görülebileceğini onaylıyorum.
            Özel belge yüklemeyeceğim.
          </label>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={(e) => {
            const box = e.currentTarget.parentElement!;
            const f = new FormData();
            f.set(
              "projectId",
              box.querySelector<HTMLSelectElement>("select")?.value ?? "",
            );
            if (
              box.querySelector<HTMLInputElement>('input[type="checkbox"]')
                ?.checked
            )
              f.set("publicConsent", "yes");
            void upload(f);
          }}
          className="rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-sm text-[var(--accent)] disabled:opacity-60"
        >
          {busy ? "Yükleniyor ve doğrulanıyor…" : "Yükle"}
        </button>
      </div>
      {message && (
        <p role="status" className="text-sm leading-6 text-amber-200">
          {message}
        </p>
      )}
      {retry && (
        <button
          type="button"
          disabled={busy}
          onClick={resume}
          className="rounded-xl border border-[var(--border)] p-3 text-sm"
        >
          Aktarılan dosyayı tekrar doğrula
        </button>
      )}
    </div>
  );
}
