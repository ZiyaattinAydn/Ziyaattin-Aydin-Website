import { PageIntro } from "@/components/ui/page-intro";
import { ProjectCard } from "@/components/public/project-card";
import { projects } from "@/data/mock-content";

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      <PageIntro title="Projelerim" description="Fikirden ürüne uzanan yolculuğumda geliştirdiğim çalışmalar. Aktif projelerim ve tamamladığım ürünler burada." meta={`${projects.length} Proje`} />
      <div className="flex flex-wrap gap-3">{["Tümü", "Devam Eden", "Tamamlanan", "Yapay Zekâ", "Web", "Sistem Tasarımı"].map((item) => <button key={item} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted)] first:border-[var(--accent)] first:text-[var(--accent)]">● {item}</button>)}</div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{projects.concat(projects.slice(0, 2)).map((project, index) => <ProjectCard key={`${project.slug}-${index}`} project={project} />)}</div>
    </div>
  );
}
