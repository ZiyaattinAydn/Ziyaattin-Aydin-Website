"use client";

import { useMemo, useState } from "react";
import type { WritingSummary } from "@/data/mock-content";
import { WritingCard } from "@/components/public/writing-card";
import { Panel } from "@/components/ui/panel";

type SortKey = "newest" | "oldest" | "title";

export function WritingExplorer({ writings }: { writings: WritingSummary[] }) {
  const [category, setCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const categories = useMemo(
    () => ["Tümü", ...Array.from(new Set(writings.map((writing) => writing.category)))],
    [writings],
  );

  const filteredWritings = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    return writings
      .filter((writing) => {
        const matchesCategory = category === "Tümü" || writing.category === category;
        const matchesQuery = normalizedQuery
          ? [writing.title, writing.excerpt, writing.category, ...writing.tags]
              .join(" ")
              .toLocaleLowerCase("tr-TR")
              .includes(normalizedQuery)
          : true;
        return matchesCategory && matchesQuery;
      })
      .sort((first, second) => {
        if (sort === "oldest") return first.sortOrder - second.sortOrder;
        if (sort === "title") return first.title.localeCompare(second.title, "tr");
        return second.sortOrder - first.sortOrder;
      });
  }, [category, query, sort, writings]);

  return (
    <section className="space-y-5" aria-labelledby="writing-list-heading">
      <Panel className="p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--muted)]">Yazılarda ara</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Başlık, kategori veya konu"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-dim)]"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--muted)]">Sıralama</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-dim)] lg:w-48"
            >
              <option value="newest">En yeni mock</option>
              <option value="oldest">En eski mock</option>
              <option value="title">Başlık A-Z</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" aria-label="Yazı kategori filtreleri">
          {categories.map((item) => {
            const active = item === category;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
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

      <div>
        <h2 id="writing-list-heading" className="text-xl font-semibold">
          Tüm public yazı taslakları
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {filteredWritings.length} sonuç gösteriliyor. Tarihler ve içerikler geçici mock/taslak veridir.
        </p>
      </div>

      {filteredWritings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredWritings.map((writing) => (
            <WritingCard key={writing.slug} writing={writing} />
          ))}
        </div>
      ) : (
        <Panel className="p-8 text-center">
          <h3 className="text-lg font-semibold">Yazı bulunamadı</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
            Arama veya kategori filtresini değiştirerek tekrar deneyebilirsin.
          </p>
        </Panel>
      )}
    </section>
  );
}
