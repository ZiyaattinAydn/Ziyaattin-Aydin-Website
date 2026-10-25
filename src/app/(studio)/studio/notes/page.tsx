import Link from "next/link";
import { listLibrary } from "@/features/studio/library/server";
import { filterNotes, type Note } from "@/features/studio/library/domain";
import { taskInputClass as input } from "@/features/studio/tasks/task-styles";
export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [result, filters] = await Promise.all([
    listLibrary("notes"),
    searchParams,
  ]);
  if (!result.ok)
    return (
      <p role="alert">
        Notlar yüklenemedi. Bağlantını ve oturumunu kontrol edip sayfayı yenile.
      </p>
    );
  const notes = result.rows as Note[];
  const visible = filterNotes(notes, filters);
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Notlar</h1>
        <Link
          href="/studio/notes/new"
          className="rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-black"
        >
          Yeni not
        </Link>
      </div>
      {filters.notice && (
        <p role="status" className="text-[var(--accent)]">
          Not arşivlendi.
        </p>
      )}
      <form className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm">
          Ara
          <input
            className={input}
            type="search"
            name="q"
            defaultValue={filters.q}
          />
        </label>
        <label className="text-sm">
          Proje
          <select
            className={input}
            name="project"
            defaultValue={filters.project}
          >
            <option value="">Tüm projeler</option>
            {result.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Kategori
          <select
            className={input}
            name="category"
            defaultValue={filters.category}
          >
            <option value="">Tüm kategoriler</option>
            {[...new Set(notes.map((n) => n.category).filter(Boolean))].map(
              (c) => (
                <option key={c} value={c!}>
                  {c}
                </option>
              ),
            )}
          </select>
        </label>
        <label className="text-sm">
          Etiket
          <select className={input} name="tag" defaultValue={filters.tag}>
            <option value="">Tüm etiketler</option>
            {[...new Set(notes.flatMap((n) => n.tags))].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Durum
          <select className={input} name="status" defaultValue={filters.status}>
            <option value="active">Aktif</option>
            <option value="archived">Arşiv</option>
          </select>
        </label>
        <label className="text-sm">
          Sıralama
          <select className={input} name="sort" defaultValue={filters.sort}>
            <option value="updated">Son değişiklik</option>
            <option value="oldest">İlk oluşturulan</option>
            <option value="title">Başlık</option>
          </select>
        </label>
        <button className="rounded-xl border border-[var(--border)] px-4 py-3">
          Filtrele
        </button>
        <Link
          href="/studio/notes"
          className="self-center p-3 text-sm text-[var(--muted)]"
        >
          Filtreleri temizle
        </Link>
      </form>
      <p className="text-sm text-[var(--muted)]">{visible.length} not</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((n) => (
          <Link
            key={n.id}
            href={`/studio/notes/${n.id}`}
            className="min-w-0 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent-dim)]"
          >
            <h2 className="break-words text-lg font-semibold">{n.title}</h2>
            <p className="line-clamp-2 whitespace-pre-wrap break-words text-sm text-[var(--muted)]">
              {n.content.slice(0, 240)}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {n.category ?? "Kategorisiz"} ·{" "}
              {new Date(n.updated_at).toLocaleString("tr-TR", {
                timeZone: "Europe/Istanbul",
              })}
            </p>
          </Link>
        ))}
      </div>
      {!visible.length && (
        <p className="rounded-2xl border border-[var(--border)] p-8 text-[var(--muted)]">
          Bu filtrelerde not bulunamadı.
        </p>
      )}
    </section>
  );
}
