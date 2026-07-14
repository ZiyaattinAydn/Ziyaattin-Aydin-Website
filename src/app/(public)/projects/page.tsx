import { ProjectExplorer } from "@/components/public/project-explorer";
import { PageIntro } from "@/components/ui/page-intro";
import { Panel } from "@/components/ui/panel";
import type {
  ProjectSummary,
} from "@/features/public/content/model";
import {
  PublicRepositoryUnavailableError,
  type PublicRepositorySource,
} from "@/features/public/content/repository";
import {
  getPublicProjectContentRepository,
} from "@/features/public/content/source-selection";

export const dynamic = "force-dynamic";

type ProjectsPageLoadResult =
  | {
      status: "ready";
      projects: ProjectSummary[];
      source: PublicRepositorySource;
    }
  | {
      status: "unavailable";
    };

async function loadProjectsPageData(): Promise<ProjectsPageLoadResult> {
  const repository = getPublicProjectContentRepository();

  try {
    return {
      status: "ready",
      projects: await repository.listProjects(),
      source: repository.source,
    };
  } catch (error) {
    if (!(error instanceof PublicRepositoryUnavailableError)) {
      throw error;
    }

    return {
      status: "unavailable",
    };
  }
}

export default async function ProjectsPage() {
  const result = await loadProjectsPageData();

  if (result.status === "unavailable") {
    return (
      <div className="space-y-8 overflow-hidden">
        <PageIntro
          eyebrow="Public projeler"
          title="Projelerim"
          description="Public proje verisi güvenli server sınırı üzerinden okunur."
          meta="İçerik kaynağı geçici olarak kullanılamıyor"
        />
        <Panel className="p-8 text-center">
          <h2 className="text-xl font-semibold">
            Projeler geçici olarak yüklenemiyor
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Database hata ayrıntıları veya görünmeyen kayıtların varlığı
            paylaşılmıyor. Daha sonra tekrar deneyebilirsin.
          </p>
        </Panel>
      </div>
    );
  }

  const activeProjects = result.projects.filter(
    (project) => project.status === "Devam Ediyor",
  ).length;
  const completedProjects = result.projects.filter(
    (project) => project.status === "Tamamlandı",
  ).length;
  const sourceLabel =
    result.source === "supabase"
      ? "development Supabase"
      : "mock";

  return (
    <div className="space-y-8 overflow-hidden">
      <PageIntro
        eyebrow="Public projeler"
        title="Projelerim"
        description={
          result.source === "supabase"
            ? "Development Supabase üzerinde yalnız published, public ve yayın tarihi bulunan proje kayıtları gösterilir."
            : "Production ve yapılandırılmamış ortamlar güvenli mock proje kaynağını kullanır."
        }
        meta={`${result.projects.length} ${sourceLabel} kayıt · ${activeProjects} devam eden · ${completedProjects} tamamlandı`}
      />
      <ProjectExplorer projects={result.projects} />
    </div>
  );
}
