import Link from "next/link";
import type { ProjectSummary } from "@/data/mock-content";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Panel className="group p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent-dim)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--accent)]">{project.status}</p>
          <h2 className="mt-2 text-xl font-semibold">{project.title}</h2>
        </div>
        <span className="font-mono text-sm text-[var(--muted)]">%{project.progress}</span>
      </div>
      <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">{project.description}</p>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${project.progress}%` }} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.map((technology) => <Tag key={technology}>{technology}</Tag>)}
      </div>
      <Link href={`/projects/${project.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]">
        İncele →
      </Link>
    </Panel>
  );
}
