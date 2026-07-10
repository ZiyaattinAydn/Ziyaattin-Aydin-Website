import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";
import { DetailSection } from "@/components/public/detail-section";
import { StatusPill } from "@/components/public/status-pill";
import { getProjectActions, projects, publishStateLabels, visibilityLabels } from "@/data/mock-content";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <div className="space-y-8 overflow-hidden">
      <Link href="/projects" className="inline-flex text-sm font-semibold text-[var(--accent)]">
        ← Projelere dön
      </Link>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.82fr)] lg:items-stretch">
        <Panel className="min-w-0 p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={project.status} />
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
              {project.category}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
              {project.contentState}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
              {publishStateLabels[project.publishState]}
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight break-words sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-4 text-base font-medium leading-7 text-[var(--foreground)] sm:text-lg">{project.statusLabel}</p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <Tag key={technology}>{technology}</Tag>
            ))}
          </div>

          <div className="mt-8" aria-label={`${project.title} public ilerleme yüzdesi ${project.progress}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
              <span>{project.timeframe}</span>
              <span className="font-mono text-[var(--accent)]">%{project.progress}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </Panel>

        <Panel className="flex min-w-0 flex-col justify-between overflow-hidden p-5 sm:p-6">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Public bağlantılar
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Doğrulanmış link yoksa pasif kalır</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{project.visibilityNote}</p>
            <p className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 text-xs leading-5 text-[var(--muted)]">
              {visibilityLabels[project.visibility]} · {project.sourceNote}
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {getProjectActions(project).map((link) => (
              <div key={link.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-semibold">{link.label}</p>
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]">
                    {link.disabledLabel}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{link.note}</p>
                {link.href ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)]"
                  >
                    Bağlantıya git →
                  </a>
                ) : (
                  <span aria-disabled="true" className="mt-3 inline-flex cursor-not-allowed text-sm font-semibold text-[var(--muted)]">
                    Aktif bağlantı yok
                  </span>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <DetailSection eyebrow="Özet" title="Projenin public anlatımı" description={project.summary} />
        <DetailSection eyebrow="Problem" title="Çözülmek istenen ihtiyaç" description={project.problem} />
        <DetailSection eyebrow="Yaklaşım" title="Nasıl ele alınıyor?" description={project.approach} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel className="p-5 sm:p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Süreç
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Kilometre taşları</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {project.milestones.map((milestone) => (
              <div key={milestone.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="font-semibold text-[var(--accent)]">{milestone.label}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{milestone.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <DetailSection eyebrow="Görünürlük" title="Public notlar" items={project.publicNotes} />
      </section>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        <DetailSection eyebrow="Öne çıkanlar" title="Kısa notlar" items={project.highlights} />
        <DetailSection eyebrow="Teknik" title="Teknik notlar" items={project.technicalNotes} />
        <DetailSection eyebrow="Öğrenme" title="Öğrendiklerim" items={project.learnings} />
        <DetailSection eyebrow="Devam" title="Sıradaki adımlar" items={project.nextSteps} />
      </div>
    </div>
  );
}
