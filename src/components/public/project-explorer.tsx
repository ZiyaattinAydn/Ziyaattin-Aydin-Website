"use client";

import { useMemo, useState } from "react";
import type { ProjectSummary, ProjectStatus } from "@/data/mock-content";
import { ProjectCard } from "@/components/public/project-card";
import { Panel } from "@/components/ui/panel";

type SortKey = "featured" | "progress-desc" | "progress-asc" | "title";
const statusFilters: Array<"Tümü" | ProjectStatus> = ["Tümü", "Devam Ediyor", "Tamamlandı", "Planlandı"];

export function ProjectExplorer({ projects }: { projects: ProjectSummary[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("Tümü");
  const [category, setCategory] = useState("Tümü");
  const [sort, setSort] = useState<SortKey>("featured");

  const categories = useMemo(
    () => ["Tümü", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    return projects
      .filter((project) => {
        const matchesQuery = normalizedQuery
          ? [
              project.title,
              project.description,
              project.category,
              project.statusLabel,
              project.summary,
              project.sourceNote,
              project.publishState,
              ...project.technologies,
            ]
              .join(" ")
              .toLocaleLowerCase("tr-TR")
              .includes(normalizedQuery)
          : true;
        const matchesStatus = status === "Tümü" || project.status === status;
        const matchesCategory = category === "Tümü" || project.category === category;
        return matchesQuery && matchesStatus && matchesCategory;
      })
      .sort((first, second) => {
        if (sort === "progress-desc") return second.progress - first.progress;
        if (sort === "progress-asc") return first.progress - second.progress;
        if (sort === "title") return first.title.localeCompare(second.title, "tr");
        if (first.isFeatured !== second.isFeatured) return Number(second.isFeatured) - Number(first.isFeatured);
        return projects.indexOf(first) - projects.indexOf(second);
      });
  }, [category, projects, query, sort, status]);

  return (
    <section className="space-y-6" aria-labelledby="project-list-heading">
      <Panel className="p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--muted)]">Projelerde ara</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Başlık, teknoloji veya kategori"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-dim)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--muted)]">Kategori</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-dim)] lg:w-48"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--muted)]">Sıralama</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-dim)] lg:w-48"
            >
              <option value="featured">Varsayılan</option>
              <option value="progress-desc">İlerleme: yüksekten düşüğe</option>
              <option value="progress-asc">İlerleme: düşükten yükseğe</option>
              <option value="title">Başlık A-Z</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" aria-label="Proje durum filtreleri">
          {statusFilters.map((item) => {
            const active = item === status;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-[var(--accent)] bg-[var(--surface-strong)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent-dim)] hover:text-[var(--foreground)]"
                }`}
              >
                ● {item}
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="project-list-heading" className="text-xl font-semibold">
            Public proje kayıtları
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {filteredProjects.length} sonuç gösteriliyor. İçerikler Sprint 03 için mock/placeholder seviyesindedir; publish ve görünürlük alanları gerçek veriye hazırlık amacı taşır.
          </p>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <Panel className="p-8 text-center">
          <h3 className="text-lg font-semibold">Sonuç bulunamadı</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
            Arama veya filtreleri değiştirerek tekrar deneyebilirsin. Gerçek public içerikler eklendikçe bu alan genişleyecek.
          </p>
        </Panel>
      )}
    </section>
  );
}
