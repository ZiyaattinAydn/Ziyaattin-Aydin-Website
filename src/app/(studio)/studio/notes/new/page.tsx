import Link from "next/link";
import { listLibrary } from "@/features/studio/library/server";
import { NoteForm } from "@/features/studio/library/note-form";
export default async function NewNotePage() {
  const r = await listLibrary("notes");
  if (!r.ok)
    return (
      <p role="alert">
        Projeler yüklenemedi. Oturumunu kontrol edip tekrar dene.
      </p>
    );
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link href="/studio/notes" className="text-[var(--muted)]">
        ← Notlar
      </Link>
      <h1 className="text-3xl font-semibold">Yeni not</h1>
      <NoteForm projects={r.projects} />
    </section>
  );
}
