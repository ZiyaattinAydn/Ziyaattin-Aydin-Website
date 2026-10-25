import { listLibrary } from "@/features/studio/library/server";
import { type StoredFile } from "@/features/studio/library/domain";
import { UploadForm } from "@/features/studio/library/upload-form";
import { FileControls } from "@/features/studio/library/file-controls";
import { taskInputClass as input } from "@/features/studio/tasks/task-styles";
export default async function FilesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [r, f] = await Promise.all([listLibrary("files"), searchParams]);
  if (!r.ok)
    return (
      <p role="alert">
        Dosyalar yüklenemedi. Oturumunu ve bağlantını kontrol et.
      </p>
    );
  const files = (r.rows as StoredFile[])
    .filter(
      (x) =>
        x.status === (f.status === "archived" ? "archived" : "active") &&
        (!f.project || x.project_id === f.project) &&
        (!f.q ||
          x.original_name
            .toLocaleLowerCase("tr")
            .includes(f.q.toLocaleLowerCase("tr"))) &&
        (!f.kind ||
          (f.kind === "public"
            ? x.storage_bucket === "public-assets"
            : x.storage_bucket === "private-files")),
    )
    .sort((a, b) =>
      f.sort === "name"
        ? a.original_name.localeCompare(b.original_name, "tr")
        : f.sort === "size"
          ? b.size_bytes - a.size_bytes
          : b.created_at.localeCompare(a.created_at),
    );
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Dosyalar</h1>
      <UploadForm projects={r.projects} />
      <form className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm">
          Ara
          <input type="search" name="q" defaultValue={f.q} className={input} />
        </label>
        <label className="text-sm">
          Proje
          <select name="project" defaultValue={f.project} className={input}>
            <option value="">Tüm projeler</option>
            {r.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Durum
          <select name="status" defaultValue={f.status} className={input}>
            <option value="active">Aktif</option>
            <option value="archived">Arşiv</option>
          </select>
        </label>
        <label className="text-sm">
          Erişim
          <select name="kind" defaultValue={f.kind} className={input}>
            <option value="">Tümü</option>
            <option value="private">Özel dosyalar</option>
            <option value="public">Public görseller</option>
          </select>
        </label>
        <label className="text-sm">
          Sıralama
          <select name="sort" defaultValue={f.sort} className={input}>
            <option value="date">En yeni</option>
            <option value="name">Dosya adı</option>
            <option value="size">Boyut</option>
          </select>
        </label>
        <button className="self-end rounded-xl border border-[var(--border)] px-4 py-3">
          Filtrele
        </button>
      </form>
      <p className="text-sm text-[var(--muted)]">{files.length} dosya</p>
      <div className="grid gap-5 xl:grid-cols-2">
        {files.map((file) => (
          <article
            key={file.id + file.updated_at}
            className="min-w-0 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <h2 className="break-words text-lg font-semibold">
              {file.original_name}
            </h2>
            <p className="break-words text-xs leading-6 text-[var(--muted)]">
              {file.mime_type} ·{" "}
              {(Number(file.size_bytes) / 1024 / 1024).toLocaleString("tr-TR", {
                maximumFractionDigits: 2,
              })}{" "}
              MB
              <br />
              {file.storage_bucket === "public-assets"
                ? "Herkese açık görsel"
                : "Özel dosya"}{" "}
              ·{" "}
              {new Date(file.created_at).toLocaleDateString("tr-TR", {
                timeZone: "Europe/Istanbul",
              })}
            </p>
            <FileControls file={file} projects={r.projects} />
          </article>
        ))}
      </div>
      {!files.length && (
        <p className="rounded-xl border border-[var(--border)] p-8 text-[var(--muted)]">
          Bu filtrelerde dosya bulunamadı.
        </p>
      )}
    </section>
  );
}
