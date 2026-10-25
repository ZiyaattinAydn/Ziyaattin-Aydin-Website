"use client";

import { useActionState } from "react";

import type { WritingPublishState } from "@/features/writings/domain";
import {
  archiveWritingAction,
  transitionWritingAction,
} from "@/features/studio/writings/actions";
import {
  INITIAL_WRITING_ACTION_STATE,
  type WritingActionState,
} from "@/features/studio/writings/action-state";
import {
  WRITING_PUBLISH_STATE_LABELS,
} from "@/features/studio/writings/writing-presentation";
import { WritingSubmitButton } from "@/features/studio/writings/writing-submit-button";

type BoundWritingAction = (
  state: WritingActionState,
  formData: FormData,
) => Promise<WritingActionState>;

function WorkflowMessage({ state }: { state: WritingActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={
        state.status === "error"
          ? "text-sm text-[#f0c46b]"
          : "text-sm text-[var(--accent)]"
      }
    >
      {state.message}
    </p>
  );
}

function TransitionForm({
  writingId,
  targetState,
}: {
  writingId: string;
  targetState: WritingPublishState;
}) {
  const action: BoundWritingAction = transitionWritingAction.bind(
    null,
    writingId,
  );
  const [state, formAction] = useActionState(
    action,
    INITIAL_WRITING_ACTION_STATE,
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="targetState" value={targetState} />
      <WritingSubmitButton
        pendingLabel="Durum güncelleniyor..."
        className="w-full"
      >
        {WRITING_PUBLISH_STATE_LABELS[targetState]} durumuna geçir
      </WritingSubmitButton>
      <WorkflowMessage state={state} />
    </form>
  );
}

function ArchiveForm({ writingId }: { writingId: string }) {
  const action: BoundWritingAction = archiveWritingAction.bind(null, writingId);
  const [state, formAction] = useActionState(
    action,
    INITIAL_WRITING_ACTION_STATE,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-[#8a6b2a] bg-[rgba(245,158,11,0.05)] p-5"
    >
      <div>
        <h3 className="font-semibold text-[#f0c46b]">Yazıyı arşivle</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Yazı silinmez; içeriği arşivde korunur ve Public sayfalardan kaldırılır.
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="archiveConfirmation"
          value="archive"
          className="mt-1 h-4 w-4 accent-[#f0c46b]"
        />
        <span>Bu yazıyı arşivlemek istiyorum.</span>
      </label>

      <WritingSubmitButton
        pendingLabel="Arşivleniyor..."
        className="w-full border-[#8a6b2a] bg-[rgba(245,158,11,0.08)] text-[#f0c46b] hover:bg-[rgba(245,158,11,0.14)]"
      >
        Yazıyı arşivle
      </WritingSubmitButton>

      <WorkflowMessage state={state} />
    </form>
  );
}

type WritingWorkflowActionsProps = {
  writingId: string;
  publishState: WritingPublishState;
  allowedTransitions: readonly WritingPublishState[];
};

export function WritingWorkflowActions({
  writingId,
  publishState,
  allowedTransitions,
}: WritingWorkflowActionsProps) {
  if (publishState === "archived") {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Yayın durumu</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Bu yazı arşivde; içeriğini okumaya devam edebilirsin.
        </p>
      </section>
    );
  }

  const workflowTransitions = allowedTransitions.filter(
    (targetState) => targetState !== "archived",
  );

  return (
    <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div>
        <h2 className="text-lg font-semibold">Yayın durumu</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Taslağını kaydet, önizle ve incelemeyi tamamladıktan sonra yayınla.
        </p>
      </div>

      {workflowTransitions.length > 0 ? (
        <div className="grid gap-3">
          {workflowTransitions.map((targetState) => (
            <TransitionForm
              key={targetState}
              writingId={writingId}
              targetState={targetState}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          Kullanılabilir normal durum geçişi yok.
        </p>
      )}

      <ArchiveForm writingId={writingId} />
    </section>
  );
}
