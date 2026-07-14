import Link from "next/link";
import { notFound } from "next/navigation";

import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { StudioStatusPill } from "@/components/studio/studio-status-pill";
import { Panel } from "@/components/ui/panel";
import type { ProjectFormValues } from "@/features/projects/domain";
import { getOwnerProject } from "@/features/projects/server/project-mutations";
import {
  canChangeProjectSlug,
  getAllowedProjectTransitions,
} from "@/features/projects/transitions";
import { ProjectForm } from "@/features/studio/projects/project-form";
import {
  PROJECT_PUBLISH_STATE_LABELS,
  PROJECT_PUBLISH_STATE_TONES,
} from "@/features/studio/projects/project-presentation";
import { ProjectWorkflowActions } from "@/features/studio/projects/project-workflow-actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EditStudioProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

function ProjectReadError() {
  return (
    <Panel className="p-6">
      <div
        role="alert"
        className="rounded-2xl border border-[#8a6b2a] bg-[rgba(245,158,11,0.06)] p-6"
      >
        <h2 className="text-xl font-semibold text-[#f0c46b]">
          Proje açılamadı
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Güvenli Studio oturumunu doğrulayın ve tekrar deneyin. Ham database
          veya authorization ayrıntısı gösterilmez.
        </p>
      </div>
    </Panel>
  );
}

export default async function EditStudioProjectPage({
  params,
}: EditStudioProjectPageProps) {
  const { projectId } = await params;
  const result = await getOwnerProject(projectId);

  if (!result.ok) {
    if (
      result.error.code === "not_found" ||
      result.error.code === "forbidden"
    ) {
      notFound();
    }

    return (
      <div className="space-y-8">
        <Link
          href="/studio/projects"
          className="inline-flex text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          ← Projelere dön
        </Link>
        <ProjectReadError />
      </div>
    );
  }

  const project = result.data;
  const formValues: ProjectFormValues = {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    problem: project.sections.problem,
    approach: project.sections.approach,
    highlights: project.sections.highlights,
    nextSteps: project.sections.nextSteps,
    status: project.status,
    visibility: project.visibility,
    progress: project.progress,
    isFeatured: project.isFeatured,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    imageUrl: project.imageUrl,
  };

  const allowedTransitions = getAllowedProjectTransitions(
    project.publishState,
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link
          href="/studio/projects"
          className="inline-flex text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          ← Projelere dön
        </Link>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <StudioPageHeader
            eyebrow="Studio / Projects / Edit"
            title={project.title}
            description="Alan güncellemeleri ve publish workflow yalnız Core domain mutation sınırları üzerinden çalışır."
            status={project.slug}
          />
          <StudioStatusPill
            tone={PROJECT_PUBLISH_STATE_TONES[project.publishState]}
          >
            {PROJECT_PUBLISH_STATE_LABELS[project.publishState]}
          </StudioStatusPill>
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-5 sm:p-7">
          <ProjectForm
            mode="edit"
            projectId={project.id}
            initialValues={formValues}
            publishState={project.publishState}
            slugEditable={canChangeProjectSlug(project.publishState)}
            readOnly={project.publishState === "archived"}
          />
        </Panel>

        <div className="space-y-5">
          <ProjectWorkflowActions
            projectId={project.id}
            publishState={project.publishState}
            allowedTransitions={allowedTransitions}
          />

          <Panel className="p-5">
            <h2 className="text-lg font-semibold">Approval görünümü</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--muted)]">Link approval</dt>
                <dd className="font-mono">{project.linkApprovalState}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[var(--muted)]">Image approval</dt>
                <dd className="font-mono">{project.imageApprovalState}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
              Approval state düzenleme UI’ı bu sprintte yoktur. Pending link
              veya görsel publish geçişini server-side engeller.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
