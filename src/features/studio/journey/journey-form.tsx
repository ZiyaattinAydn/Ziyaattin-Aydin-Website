"use client";
import { useActionState, useState } from "react";
import { createJourney, updateJourney } from "./actions";
import { initialJourneyState, type JourneyInput, type JourneyRow, type JourneyState } from "./domain";
import { useUnsavedChanges } from "@/features/studio/library/unsaved";
import { taskInputClass } from "@/features/studio/tasks/task-styles";

export function JourneyForm({ item }: { item?: JourneyRow }) {
  const [dirty, setDirty] = useState(false);
  const published = item?.publish_state === "published";
  const archived = item?.status === "archived";
  const handler = item ? updateJourney.bind(null, item.id) : createJourney;
  const [state, action, pending] = useActionState(
    async (previous: JourneyState, form: FormData) => {
      const result = await handler(previous, form);
      if (result.status === "success") setDirty(false);
      return result;
    }, initialJourneyState,
  );
  useUnsavedChanges(dirty && !pending);
  const values: JourneyInput = item ?? {
    title: "", slug: "", period_label: null, summary: "", content: "",
    occurred_on: null, sort_order: 0,
  };
  return (
    <form action={action} data-unsaved-editor onChange={() => setDirty(true)}
      className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      {state.message && <p role={state.status === "error" ? "alert" : "status"}
        className={state.status === "error" ? "text-amber-200" : "text-[var(--accent)]"}>{state.message}</p>}
      {(published || archived) && (
        <p className="rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted)]">
          {archived ? "Arşivlenmiş kayıt salt okunur." :
            "Yayınlanan içerik kazara değişmesin diye düzenleme kilitli. Önce yayından kaldır."}
        </p>
      )}
      {item && <input type="hidden" name="version" value={item.updated_at}/>}
      <fieldset disabled={pending || published || archived} className="space-y-5">
        <label className="block text-sm font-medium">Başlık
          <input name="title" required maxLength={160} defaultValue={values.title}
            className={taskInputClass + " mt-2"} />
          <span className="mt-2 block text-xs font-normal text-[var(--muted)]">
            Bağlantı yeni kayıtlarda başlıktan otomatik oluşturulur. Mevcut kayıtların adresi korunur.
          </span>
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm font-medium">Dönem
            <input name="period_label" maxLength={100} defaultValue={values.period_label ?? ""}
              className={taskInputClass + " mt-2"} placeholder="2025 – 2026"/>
          </label>
          <label className="block text-sm font-medium">Tarih (isteğe bağlı)
            <input name="occurred_on" type="date" defaultValue={values.occurred_on ?? ""}
              className={taskInputClass + " mt-2"}/>
          </label>
          <label className="block text-sm font-medium">Sıralama
            <input name="sort_order" type="number" min={-100000} max={100000}
              defaultValue={values.sort_order} className={taskInputClass + " mt-2"}/>
          </label>
        </div>
        <label className="block text-sm font-medium">Kısa özet (yayın için gerekli)
          <textarea name="summary" rows={4} maxLength={800}
            defaultValue={values.summary} className={taskInputClass + " mt-2"}/>
        </label>
        <label className="block text-sm font-medium">Detay / öğrendiklerim
          <textarea name="content" rows={10} maxLength={20000}
            defaultValue={values.content} className={taskInputClass + " mt-2"}/>
        </label>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--muted)]">Yeni kayıtlar özel taslak olarak kaydedilir. Kendi onayın olmadan yayınlanmaz.</p>
          {!archived && !published && (
            <button disabled={pending}
              className="shrink-0 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black disabled:opacity-60">
              {pending ? "Kaydediliyor…" : item ? "Değişiklikleri kaydet" : "Taslak oluştur"}
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
