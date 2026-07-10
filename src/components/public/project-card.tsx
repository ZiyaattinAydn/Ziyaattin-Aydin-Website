import Link from "next/link";
import type { ProjectSummary } from "@/features/public/content/model";
import { publishStateLabels } from "@/features/public/content/model";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";
import { StatusPill } from "@/components/public/status-pill";
import { PublishStatusNote } from "@/components/public/publish-status-note";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Panel className="group flex h-full min-w-0 flex-col p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent-dim)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3">
          <StatusPill status={project.status} />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              {project.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug text-[var(--foreground)] break-words">
              {project.title}
            </h2>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 font-mono text-sm text-[var(--accent)]">
          %{project.progress}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1">
          {publishStateLabels[project.publishState]}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium leading-6 text-[var(--foreground)]">{project.statusLabel}</p>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{project.description}</p>

      <div className="mt-5" aria-label={`${project.title} ilerleme durumu yüzde ${project.progress}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
          <span>{project.timeframe}</span>
          <span>{project.progress}/100</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((technology) => (
          <Tag key={technology}>{technology}</Tag>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-xs leading-5 text-[var(--muted)]">
          {project.visibilityNote}
        </p>
        <PublishStatusNote
          publishFlowState={project.publishFlowState}
          visibility={project.visibility}
          sourceNote={project.sourceNote}
          approvalNote={project.approvalNote}
          compact
        />
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="mt-5 inline-flex w-fit text-sm font-semibold text-[var(--accent)] transition group-hover:translate-x-0.5"
      >
        Detayı incele →
      </Link>
    </Panel>
  );
}
