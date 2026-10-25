import Link from "next/link";
import { notFound } from "next/navigation";
import { listLibrary } from "@/features/studio/library/server";
import { ArchiveNote, NoteForm } from "@/features/studio/library/note-form";
import { UUID, type Note } from "@/features/studio/library/domain";
export default async function NotePage({
  params,
  searchParams,
}: {
  params: Promise<{ noteId: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { noteId } = await params;
  if (!UUID.test(noteId)) notFound();
  const r = await listLibrary("notes");
  if (!r.ok)
    return (
      <p role="alert">Not açılamadı. Oturumunu ve bağlantını kontrol et.</p>
    );
  const note = (r.rows as Note[]).find((n) => n.id === noteId);
  if (!note) notFound();
  const saved = (await searchParams).notice === "saved";
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link href="/studio/notes" className="text-[var(--muted)]">
        ← Notlar
      </Link>
      <h1 className="break-words text-3xl font-semibold">{note.title}</h1>
      {saved && (
        <p role="status" className="text-[var(--accent)]">
          Not kaydedildi.
        </p>
      )}
      <p className="text-xs leading-6 text-[var(--muted)]">
        Oluşturma:{" "}
        {new Date(note.created_at).toLocaleString("tr-TR", {
          timeZone: "Europe/Istanbul",
        })}
        <br />
        Son değişiklik:{" "}
        {new Date(note.updated_at).toLocaleString("tr-TR", {
          timeZone: "Europe/Istanbul",
        })}
      </p>
      {note.status === "archived" ? (
        <div className="space-y-4">
          <p>Bu not arşivde.</p>
          <pre className="whitespace-pre-wrap break-words font-sans leading-8">
            {note.content}
          </pre>
        </div>
      ) : (
        <>
          <NoteForm key={note.updated_at} note={note} projects={r.projects} />
          <ArchiveNote note={note} />
        </>
      )}
    </section>
  );
}
