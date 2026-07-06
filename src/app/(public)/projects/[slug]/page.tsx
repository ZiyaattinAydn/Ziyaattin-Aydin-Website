import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";
import { StatusPill } from "@/components/public/status-pill";
import { projects } from "@/data/mock-content";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <div className="space-y-8 overflow-hidden">
      <Link href="/projects" className="inline-flex text-sm font-semibold text-[var(--accent)]">
        ← Projelere dön
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1fr_.85fr] lg:items-stretch">
        <Panel className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={project.status} />
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
              {project.category}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
              Mock içerik
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{project.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <Tag key={technology}>{technology}</Tag>
            ))}
          </div>

          <div className="mt-8" aria-label={`${project.title} public ilerleme yüzdesi ${project.progress}`}>
            <div className="flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
              <span>{project.timeframe}</span>
              <span className="font-mono text-[var(--accent)]">%{project.progress}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </Panel>

        <Panel className="flex flex-col justify-between overflow-hidden p-5 sm:p-6">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Public bağlantılar
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Linkler doğrulanınca aktifleşecek</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Gerçek GitHub, demo veya canlı ürün bağlantısı bilinmediği için bu sprintte link uydurulmadı.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {project.links.map((link) => (
              <div key={link.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="font-semibold">{link.label}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{link.note}</p>
                {link.href ? (
                  <Link href={link.href} className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)]">
                    Bağlantıya git →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <InfoPanel title="Özet" text={project.summary} />
        <InfoPanel title="Problem" text={project.problem} />
        <InfoPanel title="Yaklaşım / Çözüm" text={project.approach} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel className="p-5 sm:p-6">
          <h2 className="text-2xl font-semibold">Süreç ve kilometre taşları</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {project.milestones.map((milestone) => (
              <div key={milestone.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="font-semibold text-[var(--accent)]">{milestone.label}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{milestone.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <h2 className="text-2xl font-semibold">Public notlar</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {project.publicNotes.map((note) => (
              <li key={note} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3">
                {note}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <ListPanel title="Teknik kararlar" items={project.technicalDecisions} />
        <ListPanel title="Öğrenilenler" items={project.learnings} />
        <ListPanel title="Sıradaki adımlar" items={project.nextSteps} />
      </div>
    </div>
  );
}

function InfoPanel({ title, text }: { title: string; text: string }) {
  return (
    <Panel className="p-5 sm:p-6">
      <h2 className="font-semibold text-[var(--accent)]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
    </Panel>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel className="p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
