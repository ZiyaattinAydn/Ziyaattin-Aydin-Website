"use client";

import { useActionState } from "react";
import type { ProjectPublishState } from "@/features/projects/domain";
import { archiveProjectAction } from "@/features/studio/projects/actions";
import {
  INITIAL_PROJECT_ACTION_STATE,
  type ProjectActionState,
} from "@/features/studio/projects/action-state";
import { ProjectSubmitButton } from "@/features/studio/projects/project-submit-button";

type BoundProjectAction = (
  state: ProjectActionState,
  formData: FormData,
) => Promise<ProjectActionState>;

export function ProjectWorkflowActions({
  projectId,
  publishState,
}: {
  projectId: string;
  publishState: ProjectPublishState;
}) {
  const action: BoundProjectAction = archiveProjectAction.bind(null, projectId);
  const [state, formAction] = useActionState(action, INITIAL_PROJECT_ACTION_STATE);

  if (publishState === "archived") {
    return (
      <section className="rounded-2xl border border-[var(--border)] p-5 text-sm text-[var(--muted)]">
        Bu proje arşivlendi. Görevleri ve proje kaydı korundu.
      </section>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-[#8a6b2a] bg-[rgba(245,158,11,0.05)] p-5">
      <div>
        <h2 className="text-lg font-semibold text-[#f0c46b]">Projeyi arşivle</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Arşivlenen proje ve bağlı görevler silinmez; proje düzenlenemez.
          Bu işlem, portföy görünürlüğünden ayrıdır.
        </p>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" required name="archiveConfirmation" value="archive"
          className="mt-1 h-4 w-4 accent-[#f0c46b]"/>
        <span>Bu projeyi arşivlemek istiyorum.</span>
      </label>
      <ProjectSubmitButton pendingLabel="Arşivleniyor..." className="w-full border-[#8a6b2a] bg-[rgba(245,158,11,0.08)] text-[#f0c46b]">
        Projeyi arşivle
      </ProjectSubmitButton>
      {state.message ? <p role={state.status === "error" ? "alert" : "status"}
        className="text-sm text-[#f0c46b]">{state.message}</p> : null}
    </form>
  );
}
