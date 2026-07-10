import Image from "next/image";
import { Panel } from "@/components/ui/panel";
import { PublishStatusNote } from "@/components/public/publish-status-note";
import { profileContent } from "@/data/mock-content";

export default function AboutPage() {
  return (
    <div className="space-y-8 overflow-hidden">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] px-5 py-8 sm:px-8 lg:grid lg:grid-cols-[1fr_.78fr] lg:items-center lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(18,217,120,.12),transparent_26rem)]" />
        <div className="relative z-10 max-w-2xl">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            {profileContent.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {profileContent.displayName}
          </h1>
          <h2 className="mt-5 text-2xl font-semibold leading-tight sm:text-3xl">
            {profileContent.headline}
          </h2>
          <p className="mt-5 text-base leading-8 text-[var(--muted)] sm:text-lg">
            {profileContent.description}
          </p>
        </div>
        <div className="relative z-10 mt-8 min-h-72 lg:mt-0 lg:h-96">
          <div className="absolute inset-x-5 bottom-0 top-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)]" />
          <Image
            src={profileContent.portrait.src}
            alt={profileContent.portrait.alt}
            fill
            sizes="(max-width:1024px) 100vw, 40vw"
            className="object-contain object-bottom"
          />
          <span className="absolute left-4 top-4 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
            {profileContent.portrait.note}
          </span>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-4">
        {profileContent.focusAreas.map((area) => (
          <Panel key={area.title} className="p-5">
            <h2 className="font-semibold text-[var(--accent)]">{area.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{area.text}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_.85fr]">
        <Panel className="p-5 sm:p-6">
          <h2 className="text-2xl font-semibold">Yaklaşım</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Public tarafta amaç; gereksiz iddia eklemeden, ziyaretçinin projeleri, yazıları ve yolculuk notlarını rahatça okuyabildiği güvenli bir yüzey oluşturmak.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {profileContent.values.map((value) => (
              <span key={value} className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">
                {value}
              </span>
            ))}
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <h2 className="text-2xl font-semibold">Teknoloji alanı</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Bu liste, projenin teknik yönünü ve public sitede kullanılacak araçları özetler; kişisel uzmanlık seviyesi iddiası olarak sunulmaz.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {profileContent.technologies.map((item) => (
              <span key={item} className="rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm">
                {item}
              </span>
            ))}
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <h2 className="text-2xl font-semibold">Onay durumu</h2>
          <div className="mt-4">
            <PublishStatusNote
              publishFlowState={profileContent.publishFlowState}
              visibility="public"
              sourceNote={profileContent.portrait.note}
              approvalNote={profileContent.approvalNote}
            />
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6 lg:col-span-3">
          <h2 className="text-2xl font-semibold">İletişim</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {profileContent.contactNote}
          </p>
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm text-[var(--accent)]">
            {profileContent.contactStateLabel}
          </div>
        </Panel>
      </div>
    </div>
  );
}
