import Link from "next/link";

import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { Panel } from "@/components/ui/panel";
import { listOwnerProjects } from "@/features/projects/server/project-mutations";
import { ProjectCard } from "@/features/studio/projects/project-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function ProjectListError() {
  return (
    <Panel className="p-6">
      <div
        role="alert"
        className="rounded-2xl border border-[#8a6b2a] bg-[rgba(245,158,11,0.06)] p-6"
      >
        <h2 className="text-xl font-semibold text-[#f0c46b]">
          Projeler yüklenemedi
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Güvenli Studio oturumunu doğrulayın ve daha sonra tekrar deneyin.
          Veritabanı veya policy ayrıntıları gösterilmez.
        </p>
      </div>
    </Panel>
  );
}

function EmptyProjects() {
  return (
    <Panel className="p-6">
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[rgba(18,217,120,0.03)] p-8">
        <h2 className="text-2xl font-semibold">Henüz proje taslağı yok</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          İlk proje taslağını oluşturun. Owner kimliği ve draft publish state
          server-side atanır.
        </p>
        <Link
          href="/studio/projects/new"
          className="mt-6 inline-flex rounded-xl border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.1)] px-5 py-3 text-sm font-semibold text-[var(--accent)]"
        >
          İlk taslağı oluştur
        </Link>
      </div>
    </Panel>
  );
}

export default async function StudioProjectsPage() {
  const result = await listOwnerProjects();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <StudioPageHeader
          eyebrow="Studio / Projects"
          title="Gerçek proje yönetimi"
          description="Development Supabase üzerindeki owner projelerini normal cookie-backed session, current AAL2 ve RLS sınırıyla yönetin."
          status="Sprint 07 CRUD"
        />
        <Link
          href="/studio/projects/new"
          className="inline-flex w-fit rounded-xl border border-[var(--accent-dim)] bg-[rgba(18,217,120,0.1)] px-5 py-3 text-sm font-semibold text-[var(--accent)]"
        >
          Yeni proje
        </Link>
      </div>

      {!result.ok ? (
        <ProjectListError />
      ) : result.data.length === 0 ? (
        <EmptyProjects />
      ) : (
        <>
          <section className="space-y-4" aria-labelledby="active-projects-title">
            <div>
              <h2 id="active-projects-title" className="text-2xl font-semibold">
                Aktif kayıtlar
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Draft, review, approved, published ve unpublished projeler.
              </p>
            </div>
            <div className="grid gap-5">
              {result.data
                .filter((project) => project.publishState !== "archived")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </section>

          {result.data.some(
            (project) => project.publishState === "archived",
          ) ? (
            <section className="space-y-4" aria-labelledby="archived-projects-title">
              <div>
                <h2
                  id="archived-projects-title"
                  className="text-2xl font-semibold"
                >
                  Arşiv
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Hard delete uygulanmamış terminal kayıtlar.
                </p>
              </div>
              <div className="grid gap-5">
                {result.data
                  .filter((project) => project.publishState === "archived")
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
