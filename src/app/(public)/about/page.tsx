import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { publicProfile } from "@/features/public/content/profile";
import { publicMetadata } from "@/lib/public-metadata";
export const metadata = publicMetadata(
  "Hakkımda",
  "Ziyaattin Aydın’ın kişisel web sitesi ve Kişisel Sistemim hakkında.",
  "/about",
);
export default function AboutPage() {
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
            {publicProfile.headline}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
            {publicProfile.description}
          </p>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Panel className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Kişisel Sistemim
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            Çalışmalarımı tek bir yerde tutmak için geliştirdiğim web sitesi.
            Herkese açık sayfalarda paylaştığım içerikler, özel çalışma alanında
            ise proje ve görev takibim yer alıyor.
          </p>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            Burada tamamlanmış bir özgeçmiş yerine, zamanla büyüyen bir çalışma
            ve paylaşım alanı var.
          </p>
        </Panel>
        <Panel className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Sitede neler var?
          </h2>
          <nav
            aria-label="İçerik bölümleri"
            className="mt-5 divide-y divide-[var(--border)]"
          >
            {[
              {
                href: "/projects",
                label: "Projeler",
                text: "Çalışmaların ayrıntıları",
              },
              {
                href: "/writings",
                label: "Yazılar",
                text: "Yazılar ve notlar",
              },
              {
                href: "/journey",
                label: "Yolculuğum",
                text: "Süreçten paylaşımlar",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:text-[var(--accent)]"
              >
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">
                    {item.text}
                  </span>
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        </Panel>
      </div>
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
          Altyapı
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          Bu siteyi oluşturan araçlar
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {publicProfile.technologies.map((item) => (
            <span
              key={item}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted-strong)]"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
