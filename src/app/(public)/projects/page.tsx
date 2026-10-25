import { ProjectExplorer } from "@/components/public/project-explorer";
import { PageIntro } from "@/components/ui/page-intro";
import {
  PublicEmptyState,
  PublicUnavailable,
} from "@/components/public/content-state";
import { getPublicProjectContentRepository } from "@/features/public/content/source-selection";
import { publicMetadata } from "@/lib/public-metadata";
export const dynamic = "force-dynamic";
export const metadata = publicMetadata(
  "Projeler",
  "Paylaştığım projeler, geliştirme süreçleri ve çalışma ayrıntıları.",
  "/projects",
);
export default async function ProjectsPage() {
  let projects;
  try {
    projects = await getPublicProjectContentRepository().listProjects();
  } catch {
    return (
      <div className="space-y-8">
        <PageIntro
          eyebrow="Çalışmalar"
          title="Projelerim"
          description="Fikirler, süreçler ve ortaya çıkan çalışmalar."
        />
        <PublicUnavailable href="/projects" />
      </div>
    );
  }
  return (
    <div className="space-y-9">
      <PageIntro
        eyebrow="Çalışmalar"
        title="Projelerim"
        description="Fikirler, süreçler ve ortaya çıkan çalışmalar."
      />
      {projects.length ? (
        <ProjectExplorer projects={projects} />
      ) : (
        <PublicEmptyState
          title="Henüz paylaşılmış proje yok"
          description="Projelerimin ayrıntıları yayınlandığında bu sayfada yer alacak."
          href="/about"
          linkLabel="Hakkımda"
        />
      )}
    </div>
  );
}
