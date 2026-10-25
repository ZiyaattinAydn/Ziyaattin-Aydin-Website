import { ContentImage } from "@/components/public/content-image";
import Link from "next/link";
import type { ProjectSummary } from "@/features/public/content/model";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";
export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Panel className="group flex h-full min-w-0 flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-dim)]">
      {project.image && <div className="mb-5"><ContentImage src={project.image.src} alt={project.image.alt}/></div>}
      <p className="text-xs font-medium text-[var(--accent)]">
        {project.statusLabel}
      </p>
      <h3 className="mt-4 break-words text-2xl font-semibold leading-snug tracking-tight">
        <Link
          href={"/projects/" + project.slug}
          className="hover:text-[var(--accent)]"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-4 flex-1 break-words text-sm leading-7 text-[var(--muted)]">
        {project.description}
      </p>
      {project.technologies.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <Tag key={technology}>{technology}</Tag>
          ))}
        </div>
      )}
      <Link
        href={"/projects/" + project.slug}
        className="mt-6 inline-flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5 text-sm font-semibold"
      >
        Projeyi incele
        <span
          aria-hidden="true"
          className="text-[var(--accent)] transition-transform group-hover:translate-x-1"
        >
          ↗
        </span>
      </Link>
    </Panel>
  );
}
