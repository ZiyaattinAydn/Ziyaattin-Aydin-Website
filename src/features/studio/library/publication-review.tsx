"use client";
import Link from "next/link";
import { useActionState } from "react";
import { approvePublicationMedia } from "./publication-actions";
import { initialLibraryState } from "./domain";
export function PublicationReview({
  kind,
  id,
  version,
  archived,
}: {
  kind: "projects" | "writings";
  id: string;
  version: string;
  archived: boolean;
}) {
  const [state, action, pending] = useActionState(
    approvePublicationMedia.bind(null, kind, id),
    initialLibraryState,
  );
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border)] p-5">
      <h2 className="text-lg font-semibold">Yayın öncesi inceleme</h2>
      <Link
        href={`/studio/${kind}/${id}/preview`}
        className="inline-block rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
      >
        Kaydedilmiş içeriği önizle
      </Link>
      <p className="text-xs leading-6 text-[var(--muted)]">
        Önce formu kaydet. Önizleme yalnız sana görünür. Görselleri ve
        bağlantıları değiştirdiğinde tekrar incele.
      </p>
      {!archived && (
        <form action={action} className="space-y-4">
          <input type="hidden" name="version" value={version} />
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              required
              name="confirmation"
              value="approve"
              disabled={pending}
              className="mt-1"
            />
            Görseli ve bağlantıları kontrol ettim; herkese açık paylaşılmalarını
            onaylıyorum.
          </label>
          {state.message && (
            <p
              role={state.status === "error" ? "alert" : "status"}
              className="text-sm text-amber-200"
            >
              {state.message}
            </p>
          )}
          <button
            disabled={pending}
            className="w-full rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-sm text-[var(--accent)]"
          >
            {pending ? "Kaydediliyor…" : "İncelemeyi tamamla"}
          </button>
        </form>
      )}
    </section>
  );
}
