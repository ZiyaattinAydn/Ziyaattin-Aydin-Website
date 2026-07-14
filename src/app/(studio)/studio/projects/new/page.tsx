import Link from "next/link";

import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { Panel } from "@/components/ui/panel";
import type { ProjectFormValues } from "@/features/projects/domain";
import { ProjectForm } from "@/features/studio/projects/project-form";

const INITIAL_PROJECT_VALUES: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  problem: "",
  approach: "",
  highlights: [],
  nextSteps: [],
  status: "planned",
  visibility: "private",
  progress: 0,
  isFeatured: false,
  githubUrl: null,
  demoUrl: null,
  imageUrl: null,
};

export default function NewStudioProjectPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link
          href="/studio/projects"
          className="inline-flex text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          ← Projelere dön
        </Link>
        <StudioPageHeader
          eyebrow="Studio / Projects / New"
          title="Yeni proje taslağı"
          description="Form yalnız düzenlenebilir proje alanlarını gönderir. Owner kimliği, draft state ve approval alanları server-side yönetilir."
          status="Private default"
        />
      </div>

      <Panel className="p-5 sm:p-7">
        <ProjectForm
          mode="create"
          initialValues={INITIAL_PROJECT_VALUES}
          slugEditable
        />
      </Panel>
    </div>
  );
}
