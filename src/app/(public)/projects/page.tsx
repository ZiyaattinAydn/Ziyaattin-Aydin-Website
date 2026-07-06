import { PageIntro } from "@/components/ui/page-intro";
import { ProjectExplorer } from "@/components/public/project-explorer";
import { projects } from "@/data/mock-content";

const activeProjects = projects.filter((project) => project.status === "Devam Ediyor").length;
const completedProjects = projects.filter((project) => project.status === "Tamamlandı").length;

export default function ProjectsPage() {
  return (
    <div className="space-y-8 overflow-hidden">
      <PageIntro
        eyebrow="Public projeler"
        title="Projelerim"
        description="Fikirden ürüne uzanan çalışmalar için ilk kullanılabilir public liste deneyimi. İçerikler kullanıcı tarafından netleşene kadar mock seviyesinde tutulur."
        meta={`${projects.length} mock kayıt · ${activeProjects} devam eden · ${completedProjects} tamamlandı`}
      />
      <ProjectExplorer projects={projects} />
    </div>
  );
}
