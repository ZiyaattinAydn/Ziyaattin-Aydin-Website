import { ContentImage } from "@/components/public/content-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";
import { readPublicProject } from "@/features/public/content/public-reads";
import { getProjectActions } from "@/features/public/content/model";
import { PublicUnavailable } from "@/components/public/content-state";
import { publicMetadata } from "@/lib/public-metadata";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const project = await readPublicProject(slug);
    if (!project)
      return {
        title: "Proje bulunamadı",
        robots: { index: false, follow: false },
      };
    return publicMetadata(
      project.title,
      project.description,
      "/projects/" + encodeURIComponent(project.slug),
    );
  } catch {
    return { title: "Proje", robots: { index: false, follow: false } };
  }
}
export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await readPublicProject(slug)
    .then((data) => ({ ok: true as const, data }))
    .catch(() => ({ ok: false as const }));
  if (!result.ok)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Proje</h1>
        <PublicUnavailable href={"/projects/" + encodeURIComponent(slug)} />
      </div>
    );
  const project = result.data;
  if (!project) notFound();
  const links = getProjectActions(project).filter((link) => link.href);
  return (
    <article className="mx-auto max-w-5xl space-y-8 lg:space-y-10">
      <Link
        href="/projects"
        className="inline-flex py-2 text-sm font-semibold text-[var(--accent)]"
      >
        ← Projelere dön
      </Link>
      <header className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
        <p className="text-sm font-medium text-[var(--accent)]">
          {project.statusLabel}
        </p>
        <h1 className="mt-5 break-words text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        {project.subtitle && (
          <p className="mt-3 break-words text-sm font-medium leading-7 text-[var(--muted)] sm:text-base">
            {project.subtitle}
          </p>
        )}
        <p className="mt-6 max-w-3xl break-words text-base leading-8 text-[var(--muted)] sm:text-lg">
          {project.description}
        </p>
        {project.technologies.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <nav
            aria-label="Proje bağlantıları"
            className="mt-7 flex flex-wrap gap-3"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href!}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[var(--accent-dim)] px-4 py-3 text-sm font-semibold text-[var(--accent)]"
              >
                {link.label} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (yeni sekmede)</span>
              </a>
            ))}
          </nav>
        )}
      </header>
      {project.image && <div className="mb-5"><ContentImage src={project.image.src} alt={project.image.alt}/></div>}
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { title: "Problem", text: project.problem },
          { title: "Yaklaşım", text: project.approach },
        ]
          .filter((section) => section.text)
          .map((section) => (
            <Panel key={section.title} className="p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-4 whitespace-pre-wrap break-words text-base leading-8 text-[var(--muted)]">
                {section.text}
              </p>
            </Panel>
          ))}
      </div>
      {[
        { title: "Öne çıkanlar", items: project.highlights },
        { title: "Sıradaki adımlar", items: project.nextSteps },
      ]
        .filter((section) => section.items.length)
        .map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-[var(--border)] p-6 sm:p-8"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-8 text-[var(--muted)]">
              {section.items.map((item, index) => (
                <li className="break-words" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
    </article>
  );
}
