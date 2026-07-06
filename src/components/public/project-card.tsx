import Link from "next/link";
import type { ProjectSummary } from "@/data/mock-content";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";
import { StatusPill } from "@/components/public/status-pill";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Panel className="group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent-dim)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <StatusPill status={project.status} />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              {project.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug text-[var(--foreground)]">
              {project.title}
            </h2>
          </div>
        </div>
        <span className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 font-mono text-sm text-[var(--accent)]">
          %{project.progress}
        </span>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-[var(--muted)]">{project.description}</p>

      <div className="mt-5" aria-label={`${project.title} ilerleme durumu yüzde ${project.progress}`}>
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
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

      <Link
        href={`/projects/${project.slug}`}
        className="mt-5 inline-flex w-fit text-sm font-semibold text-[var(--accent)] transition group-hover:translate-x-0.5"
      >
        Detayı incele →
      </Link>
    </Panel>
  );
}
