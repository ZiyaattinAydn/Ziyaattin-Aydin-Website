"use client";
import { useActionState } from "react";
import { transitionJourney } from "./actions";
import { initialJourneyState } from "./domain";

function Transition({ id, version, target, title }: {
  id: string; version: string; target: "publish" | "unpublish" | "archive"; title: string;
}) {
  const [state, action, pending] = useActionState(transitionJourney.bind(null, id), initialJourneyState);
  return (
    <form action={action} className="space-y-3 rounded-xl border border-[var(--border)] p-4">
      <input type="hidden" name="version" value={version}/>
      <input type="hidden" name="target" value={target}/>
      <label className="flex items-start gap-3 text-sm">
        <input required type="checkbox" name="confirm" value={target} disabled={pending} className="mt-1"/>
        {target === "publish" ? "İçeriği inceledim; herkese açık yayınlanmasını onaylıyorum." :
          target === "unpublish" ? "İçeriği herkese açık sayfadan kaldır." :
          "Kaydı silmeden arşivle; bu işlem geri alınamaz."}
      </label>
      {state.message && <p role={state.status === "error" ? "alert" : "status"}
        className={state.status === "error" ? "text-amber-200 text-sm" : "text-[var(--accent)] text-sm"}>{state.message}</p>}
      <button disabled={pending}
        className="rounded-lg border border-[var(--accent-dim)] px-4 py-2 text-sm text-[var(--accent)] disabled:opacity-60">
        {pending ? "İşleniyor…" : title}
      </button>
    </form>
  );
}
export function JourneyWorkflow({ id, version, publishState, archived }: {
  id: string; version: string; publishState: string; archived: boolean;
}) {
  if (archived) return <p className="text-sm text-[var(--muted)]">Bu kayıt arşivde; içerik korunuyor.</p>;
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Yayın yönetimi</h2>
      <p className="text-sm text-[var(--muted)]">Form değişikliklerini önce kaydet. Yayınlama açık onay gerektirir.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {publishState === "published" ? (
          <Transition id={id} version={version} target="unpublish" title="Yayından kaldır"/>
        ) : (
          <Transition id={id} version={version} target="publish" title="Yayınla"/>
        )}
        <Transition id={id} version={version} target="archive" title="Arşivle"/>
      </div>
    </section>
  );
}
