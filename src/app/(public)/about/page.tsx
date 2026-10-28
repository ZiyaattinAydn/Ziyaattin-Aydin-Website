import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { publicProfile } from "@/features/public/content/profile";
import { readPublishedSiteProfile } from "@/features/public/content/published-profile";
import { publicMetadata } from "@/lib/public-metadata";

export const metadata = publicMetadata(
  "Hakkımda",
  "Ziyaattin Aydın’ın kişisel web sitesi ve Kişisel Sistemim hakkında.",
  "/about",
);
export const dynamic = "force-dynamic";

const sections = [
  { href: "/projects", label: "Projeler", text: "Çalışmaların ayrıntıları" },
  { href: "/writings", label: "Yazılar", text: "Yazılar ve notlar" },
  { href: "/journey", label: "Yolculuğum", text: "Süreçten paylaşımlar" },
];

export default async function AboutPage() {
  const approved = await readPublishedSiteProfile();

  return (
    <div className="space-y-10 lg:space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(18,217,120,.1),transparent_25rem)]"
        />
        <div className="relative max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            Hakkımda
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {publicProfile.displayName}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 sm:text-2xl">
            {approved?.headline ?? publicProfile.headline}
          </p>
          <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-8 text-[var(--muted)]">
            {approved?.description ?? publicProfile.description}
          </p>
        </div>
      </section>

      <section aria-label="Kişisel sistemim ve site rehberi" className="grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-5">
        <Panel className="relative h-full overflow-hidden p-6 sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(18,217,120,.07),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight">Kişisel Sistemim</h2>
            <p className="mt-4 max-w-prose text-base leading-8 text-[var(--muted)]">
              Çalışmalarımı tek bir yerde tutmak için geliştirdiğim web sitesi.
              Herkese açık sayfalarda paylaştığım içerikler, özel çalışma alanında
              ise proje ve görev takibim yer alıyor.
            </p>
            <p className="mt-4 max-w-prose text-base leading-8 text-[var(--muted)]">
              Bu alan, paylaştığım çalışmalarla birlikte zamanla büyüyor.
            </p>
          </div>
        </Panel>

        <div className="grid min-w-0 gap-4">
          <Panel className="p-5 sm:p-6">
            <h2 className="text-xl font-semibold tracking-tight">Sitede neler var?</h2>
            <nav aria-label="İçerik bölümleri" className="mt-4 divide-y divide-[var(--border)]">
              {sections.map((item) => (
                <Link key={item.href} href={item.href}
                  className="group flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 focus-visible:text-[var(--accent)] hover:text-[var(--accent)]">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{item.text}</span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-[var(--muted)] transition group-hover:text-[var(--accent)]">↗</span>
                </Link>
              ))}
            </nav>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Altyapı</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">Bu siteyi oluşturan araçlar</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {publicProfile.technologies.map((item) => (
                <span key={item}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-xs text-[var(--muted-strong)]">
                  {item}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
