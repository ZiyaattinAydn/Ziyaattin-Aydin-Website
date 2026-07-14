"use client";

import { useActionState } from "react";

import type { ProjectPublishState } from "@/features/projects/domain";
import {
  archiveProjectAction,
  transitionProjectAction,
} from "@/features/studio/projects/actions";
import {
  INITIAL_PROJECT_ACTION_STATE,
  type ProjectActionState,
} from "@/features/studio/projects/action-state";
import {
  PROJECT_PUBLISH_STATE_LABELS,
} from "@/features/studio/projects/project-presentation";
import { ProjectSubmitButton } from "@/features/studio/projects/project-submit-button";

type BoundProjectAction = (
  state: ProjectActionState,
  formData: FormData,
) => Promise<ProjectActionState>;

function WorkflowMessage({ state }: { state: ProjectActionState }) {
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
  projectId,
  targetState,
}: {
  projectId: string;
  targetState: ProjectPublishState;
}) {
  const action: BoundProjectAction = transitionProjectAction.bind(
    null,
    projectId,
  );
  const [state, formAction] = useActionState(
    action,
    INITIAL_PROJECT_ACTION_STATE,
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="targetState" value={targetState} />
      <ProjectSubmitButton
        pendingLabel="Durum güncelleniyor..."
        className="w-full"
      >
        {PROJECT_PUBLISH_STATE_LABELS[targetState]} durumuna geçir
      </ProjectSubmitButton>
      <WorkflowMessage state={state} />
    </form>
  );
}

function ArchiveForm({ projectId }: { projectId: string }) {
  const action: BoundProjectAction = archiveProjectAction.bind(null, projectId);
  const [state, formAction] = useActionState(
    action,
    INITIAL_PROJECT_ACTION_STATE,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-[#8a6b2a] bg-[rgba(245,158,11,0.05)] p-5"
    >
      <div>
        <h3 className="font-semibold text-[#f0c46b]">Projeyi arşivle</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Bu işlem satırı ve ilişkileri korur; hard delete yapmaz. Sprint 07
          içinde restore yoktur.
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="archiveConfirmation"
          value="archive"
          className="mt-1 h-4 w-4 accent-[#f0c46b]"
        />
        <span>Projeyi terminal archived durumuna taşımayı onaylıyorum.</span>
      </label>

      <ProjectSubmitButton
        pendingLabel="Arşivleniyor..."
        className="w-full border-[#8a6b2a] bg-[rgba(245,158,11,0.08)] text-[#f0c46b] hover:bg-[rgba(245,158,11,0.14)]"
      >
        Projeyi arşivle
      </ProjectSubmitButton>

      <WorkflowMessage state={state} />
    </form>
  );
}

type ProjectWorkflowActionsProps = {
  projectId: string;
  publishState: ProjectPublishState;
  allowedTransitions: readonly ProjectPublishState[];
};

export function ProjectWorkflowActions({
  projectId,
  publishState,
  allowedTransitions,
}: ProjectWorkflowActionsProps) {
  if (publishState === "archived") {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-semibold">Workflow</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Archived terminal durumudur. Bu sprintte düzenleme, transition veya
          restore işlemi yoktur.
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
        <h2 className="text-lg font-semibold">Publish workflow</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Yalnız Core domain sözleşmesinin izin verdiği server-side geçişler
          gösterilir ve tekrar server-side doğrulanır.
        </p>
      </div>

      {workflowTransitions.length > 0 ? (
        <div className="grid gap-3">
          {workflowTransitions.map((targetState) => (
            <TransitionForm
              key={targetState}
              projectId={projectId}
              targetState={targetState}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          Kullanılabilir normal durum geçişi yok.
        </p>
      )}

      <ArchiveForm projectId={projectId} />
    </section>
  );
}
