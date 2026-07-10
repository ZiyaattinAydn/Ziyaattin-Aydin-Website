import { PageIntro } from "@/components/ui/page-intro";
import { ProjectExplorer } from "@/components/public/project-explorer";
import { getPublicContentRepository } from "@/features/public/content/source-selection";

export default async function ProjectsPage() {
  const repository = getPublicContentRepository();
  const projects = await repository.listProjects();

  const activeProjects = projects.filter((project) => project.status === "Devam Ediyor").length;
  const completedProjects = projects.filter((project) => project.status === "Tamamlandı").length;
  return (
    <div className="space-y-8 overflow-hidden">
      <PageIntro
        eyebrow="Public projeler"
        title="Projelerim"
        description="Fikirden ürüne uzanan çalışmalar için public liste deneyimi. İçerikler kullanıcı onayı, link onayı ve Studio publish flow netleşene kadar mock/placeholder seviyesinde tutulur."
        meta={`${projects.length} mock kayıt · ${activeProjects} devam eden · ${completedProjects} tamamlandı`}
      />
      <ProjectExplorer projects={projects} />
    </div>
  );
}
