import Link from "next/link";

import { Panel } from "@/components/ui/panel";
import { StudioStatusPill } from "@/components/studio/studio-status-pill";
import type { ProjectEntity } from "@/features/projects/domain";
import {
  formatProjectDate,
  PROJECT_PUBLISH_STATE_LABELS,
  PROJECT_PUBLISH_STATE_TONES,
  PROJECT_STATUS_LABELS,
  PROJECT_VISIBILITY_LABELS,
} from "@/features/studio/projects/project-presentation";

export function ProjectCard({ project }: { project: ProjectEntity }) {
  return (
    <Panel className="p-5">
      <article className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              {project.slug}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
              {project.title}
            </h2>
          </div>
          <StudioStatusPill
            tone={PROJECT_PUBLISH_STATE_TONES[project.publishState]}
          >
            {PROJECT_PUBLISH_STATE_LABELS[project.publishState]}
          </StudioStatusPill>
        </div>

        <p className="text-sm leading-7 text-[var(--muted)]">
          {project.summary || "Bu proje için henüz özet girilmedi."}
        </p>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
            <span>İlerleme</span>
            <span className="font-mono text-[var(--accent)]">
              %{project.progress}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <dl className="grid gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Çalışma
            </dt>
            <dd className="mt-1 text-sm">
              {PROJECT_STATUS_LABELS[project.status]}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Görünürlük
            </dt>
            <dd className="mt-1 text-sm">
              {PROJECT_VISIBILITY_LABELS[project.visibility]}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Featured
            </dt>
            <dd className="mt-1 text-sm">
              {project.isFeatured ? "Evet" : "Hayır"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
              Güncellendi
            </dt>
            <dd className="mt-1 text-sm">
              {formatProjectDate(project.updatedAt)}
            </dd>
          </div>
        </dl>

        <Link
          href={`/studio/projects/${project.id}/edit`}
          className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-dim)] hover:text-[var(--accent)]"
        >
          {project.publishState === "archived"
            ? "Arşiv kaydını görüntüle"
            : "Projeyi düzenle"}
        </Link>
      </article>
    </Panel>
  );
}
