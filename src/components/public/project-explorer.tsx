"use client";

import { useMemo, useState } from "react";
import type { ProjectSummary, ProjectStatus } from "@/features/public/content/model";
import { ProjectCard } from "@/components/public/project-card";
import { Panel } from "@/components/ui/panel";

type SortKey = "featured" | "recent" | "title";
const statusFilters: Array<{ value: "Tümü" | ProjectStatus; label: string }> = [
  { value: "Tümü", label: "Tüm durumlar" },
  { value: "Devam Ediyor", label: "Devam ediyor" },
  { value: "Duraklatıldı", label: "Duraklatıldı" },
  { value: "Tamamlandı", label: "Tamamlandı" },
  { value: "Planlandı", label: "Planlandı" },
];

export function ProjectExplorer({ projects }: { projects: ProjectSummary[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]["value"]>("Tümü");
  const [sort, setSort] = useState<SortKey>("featured");

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    return projects.filter((project) => {
      const haystack = [
        project.title, project.subtitle ?? "", project.description,
        project.statusLabel, project.summary, ...project.technologies,
      ].join(" ").toLocaleLowerCase("tr-TR");
      return (!normalizedQuery || haystack.includes(normalizedQuery)) &&
        (status === "Tümü" || project.status === status);
    }).sort((first, second) => {
      if (sort === "title") return first.title.localeCompare(second.title, "tr");
      if (sort === "recent") return second.timeframe.localeCompare(first.timeframe);
      if (first.isFeatured !== second.isFeatured) return Number(second.isFeatured) - Number(first.isFeatured);
      return projects.indexOf(first) - projects.indexOf(second);
    });
  }, [projects, query, status, sort]);

  function reset() {
    setQuery("");
    setStatus("Tümü");
    setSort("featured");
  }
  const customized = query.trim() !== "" || status !== "Tümü" || sort !== "featured";

  return (
    <section className="space-y-6" aria-labelledby="project-list-heading">
      <Panel className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(190px,230px)] md:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--muted)]">Proje veya teknoloji ara</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Örn. RenTR, React Native, TypeScript"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-dim)]" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--muted)]">Projeleri sırala</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-dim)]">
              <option value="featured">Öne çıkanlar önce</option>
              <option value="recent">En yeni yayınlanan</option>
              <option value="title">İsme göre A-Z</option>
            </select>
          </label>
        </div>
        <div aria-label="Proje durum filtreleri" className="flex flex-wrap gap-2">
          {statusFilters.map(({ value, label }) => (
            <button key={value} type="button" aria-pressed={value === status}
              onClick={() => setStatus(value)}
              className={`rounded-full border px-4 py-2 text-sm transition ${value === status
                ? "border-[var(--accent)] bg-[var(--surface-strong)] text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent-dim)] hover:text-[var(--foreground)]"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <p>Durum düğmesiyle filtrele, arama kutusuna isim veya teknoloji yaz. Seçimler anında uygulanır.</p>
          {customized && <button type="button" onClick={reset}
            className="rounded-lg border border-[var(--border)] px-3 py-2 font-semibold text-[var(--accent)]">
            Filtreleri temizle
          </button>}
        </div>
      </Panel>
      <div>
        <h2 id="project-list-heading" className="text-xl font-semibold">Projeler</h2>
        <p role="status" aria-live="polite" className="mt-1 text-sm text-[var(--muted)]">
          {filteredProjects.length} / {projects.length} proje gösteriliyor
        </p>
      </div>
      {filteredProjects.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => <ProjectCard key={project.slug} project={project}/>)}
        </div>
      ) : (
        <Panel className="p-8 text-center">
          <h3 className="text-lg font-semibold">Eşleşen proje yok</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
            Farklı bir kelime veya durum deneyebilirsin.
          </p>
          <button type="button" onClick={reset} className="mt-4 text-sm font-semibold text-[var(--accent)]">
            Tüm projeleri göster
          </button>
        </Panel>
      )}
    </section>
  );
}
