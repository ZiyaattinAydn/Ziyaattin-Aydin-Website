"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { finishUpload, updateFile } from "./file-actions";
import { type StoredFile, type LibraryProject } from "./domain";
import { taskInputClass as input } from "../tasks/task-styles";
export function FileControls({
  file,
  projects,
}: {
  file: StoredFile;
  projects: LibraryProject[];
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <div className="space-y-4">
      {file.upload_status === "uploaded" ? (
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href={`/studio/files/${file.id}/content?download=1`}
            className="rounded-xl border border-[var(--border)] px-4 py-3"
          >
            İndir
          </a>
          {(file.mime_type.startsWith("image/") ||
            file.mime_type === "application/pdf" ||
            file.mime_type.startsWith("text/")) && (
            <a
              href={`/studio/files/${file.id}/content`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[var(--border)] px-4 py-3"
            >
              Önizle (yeni sekme)
            </a>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-amber-200">
            Yükleme tamamlanmadı. Aktarım bittiyse tekrar doğrula; dosya hiç
            aktarılmadıysa yeniden yükleyip bu kaydı arşivleyebilirsin.
          </p>
          {file.status === "active" && file.upload_status === "pending" && (
            <button
              disabled={busy}
              className="rounded-xl border border-[var(--border)] p-3 text-sm"
              onClick={async () => {
                setBusy(true);
                try {
                  const r = await finishUpload(file.id);
                  setMessage(r.ok ? "Yükleme tamamlandı." : r.message);
                  router.refresh();
                } catch {
                  setMessage("Doğrulama yapılamadı.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              Yüklemeyi tamamla
            </button>
          )}
        </>
      )}
      {file.status === "active" && (
        <form
          action={async (form) => {
            setBusy(true);
            try {
              const r = await updateFile(file.id, form);
              setMessage(r.message);
              router.refresh();
            } catch {
              setMessage("Kaydedilemedi. Tekrar dene.");
            } finally {
              setBusy(false);
            }
          }}
          className="space-y-3"
        >
          <input type="hidden" name="version" value={file.updated_at} />
          <label className="block text-sm">
            Proje
            <select
              name="projectId"
              defaultValue={file.project_id ?? ""}
              className={input}
              disabled={busy}
            >
              <option value="">Bağımsız dosya</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <button
            disabled={busy}
            className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          >
            {busy ? "Kaydediliyor…" : "Proje bağlantısını kaydet"}
          </button>
          <label className="flex gap-3 text-sm">
            <input
              type="checkbox"
              name="confirmation"
              value="archive"
              disabled={busy}
            />
            Bu dosyayı arşivlemek istiyorum. İçeriği korunur.
          </label>
          <button
            name="archive"
            value="yes"
            disabled={busy}
            className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
          >
            Arşivle
          </button>
        </form>
      )}
      {message && (
        <p role="status" className="text-sm text-amber-200">
          {message}
        </p>
      )}
    </div>
  );
}
