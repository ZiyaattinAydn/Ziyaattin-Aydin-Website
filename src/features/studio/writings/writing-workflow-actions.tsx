"use client";

import { useActionState } from "react";
import type { WritingPublishState } from "@/features/writings/domain";
import { archiveWritingAction } from "@/features/studio/writings/actions";
import { INITIAL_WRITING_ACTION_STATE } from "@/features/studio/writings/action-state";
import { WritingSubmitButton } from "@/features/studio/writings/writing-submit-button";

export function WritingWorkflowActions({
  writingId, publishState,
}: { writingId: string; publishState: WritingPublishState }) {
  const [state, action] = useActionState(
    archiveWritingAction.bind(null, writingId), INITIAL_WRITING_ACTION_STATE,
  );

  if (publishState === "archived") {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Arşivlendi</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Bu yazı korunuyor ama düzenlenemiyor ve ziyaretçilere görünmüyor.
        </p>
      </section>
    );
  }

  return (
    <form action={action}
      className="space-y-4 rounded-2xl border border-[#8a6b2a] bg-[rgba(245,158,11,0.05)] p-5">
      <div>
        <h2 className="font-semibold text-[#f0c46b]">Yazıyı arşivle</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Arşivlenen yazı silinmez; Studio'da saklanır ve ziyaretçilere görünmez.
        </p>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="archiveConfirmation" value="archive"
          className="mt-1 h-4 w-4 accent-[#f0c46b]"/>
        <span>Bu yazıyı arşivlemek istiyorum.</span>
      </label>
      <WritingSubmitButton pendingLabel="Arşivleniyor..." className="w-full border-[#8a6b2a] bg-[rgba(245,158,11,0.08)] text-[#f0c46b] hover:bg-[rgba(245,158,11,0.14)]">
        Yazıyı arşivle
      </WritingSubmitButton>
      {state.status !== "idle" && state.message && (
        <p role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "text-sm text-[#f0c46b]" : "text-sm text-[var(--accent)]"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
