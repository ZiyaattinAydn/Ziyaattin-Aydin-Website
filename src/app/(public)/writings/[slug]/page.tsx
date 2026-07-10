import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/ui/panel";
import { Tag } from "@/components/ui/tag";
import { DetailSection } from "@/components/public/detail-section";
import { PublishStatusNote } from "@/components/public/publish-status-note";
import { WritingCard } from "@/components/public/writing-card";
import { linkApprovalLabels, publishFlowStateLabels, publishStateLabels, visibilityLabels, writings } from "@/data/mock-content";

export default async function WritingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const writing = writings.find((item) => item.slug === slug);

  if (!writing) notFound();

  const relatedWritings = writing.relatedSlugs
    .map((relatedSlug) => writings.find((item) => item.slug === relatedSlug))
    .filter((item): item is (typeof writings)[number] => Boolean(item));

  return (
    <article className="mx-auto max-w-6xl space-y-8 overflow-hidden">
      <Link href="/writings" className="inline-flex text-sm font-semibold text-[var(--accent)]">
        ← Yazılara dön
      </Link>

      <header className="grid gap-6 border-b border-[var(--border)] pb-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-[var(--accent)]">
              {writing.category}
            </span>
            <span>{writing.date}</span>
            <span>·</span>
            <span>{writing.readingTime}</span>
            <span>·</span>
            <span>{publishStateLabels[writing.publishState]}</span>
            <span>·</span>
            <span>{visibilityLabels[writing.visibility]}</span>
            <span>·</span>
            <span>{publishFlowStateLabels[writing.publishFlowState]}</span>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight break-words sm:text-5xl lg:text-6xl">
            {writing.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">{writing.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {writing.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
        <Panel className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
              <Image
                src="/images/portraits/home-hero.png"
                alt="Onaylı ana portreden küçük yazar avatarı"
                fill
                sizes="48px"
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold">Ziyaattin Aydın</p>
              <p className="text-xs leading-5 text-[var(--muted)]">Yazar bilgileri gerçek yayın aşamasında netleşecek.</p>
            </div>
          </div>
        </Panel>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:order-none">
          <Panel className="p-5 lg:sticky lg:top-24">
            <h2 className="font-semibold">İçindekiler</h2>
            <ol className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              {writing.sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="hover:text-[var(--foreground)]">
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </Panel>
        </aside>

        <div className="min-w-0 space-y-8">
          <div className="flex min-h-52 items-end rounded-3xl border border-[var(--border)] bg-[radial-gradient(circle_at_35%_20%,rgba(18,217,120,.22),transparent_55%),#06100c] p-6">
            <p className="font-mono text-sm font-semibold text-[var(--accent)]">{writing.coverLabel}</p>
          </div>

          <DetailSection eyebrow="Yayın notu" title="Bu içerik henüz gerçek yayın değildir" description={writing.placeholderNote}>
            <div className="space-y-4 text-sm leading-6 text-[var(--muted)]">
              <p>Son güncelleme etiketi: {writing.updatedLabel}</p>
              <PublishStatusNote
                publishFlowState={writing.publishFlowState}
                visibility={writing.visibility}
                sourceNote={writing.sourceNote}
                approvalNote={writing.approvalNote}
              />
            </div>
          </DetailSection>

          <DetailSection eyebrow="Kaynak bağlantıları" title="Dış kaynak linkleri doğrulanmadan aktifleşmez">
            {writing.externalLinks.length > 0 ? (
              <div className="space-y-3">
                {writing.externalLinks.map((externalLink) =>
                  externalLink.href ? (
                    <a
                      key={externalLink.label}
                      href={externalLink.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm font-semibold text-[var(--accent)]"
                    >
                      {externalLink.label} →
                    </a>
                  ) : (
                    <div
                      key={externalLink.label}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm text-[var(--muted)]"
                    >
                      <p className="font-semibold text-[var(--foreground)]">{externalLink.label}</p>
                      <p className="mt-2 leading-6">{externalLink.note}</p>
                      <p className="mt-2 text-xs text-[var(--accent)]">{linkApprovalLabels[externalLink.approvalState]}</p>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <span aria-disabled="true" className="inline-flex cursor-not-allowed rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
                Dış kaynak bağlantısı henüz eklenmedi
              </span>
            )}
          </DetailSection>

          <Panel className="p-5 sm:p-8">
            <div className="prose-dark space-y-8">
              {writing.sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2>
                    {index + 1}. {section.title}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.quote ? <blockquote>{section.quote}</blockquote> : null}
                  {section.code ? (
                    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
                      <div className="border-b border-[var(--border)] px-4 py-2 font-mono text-xs text-[var(--muted)]">
                        {section.codeLanguage ?? "Kod"}
                      </div>
                      <pre className="overflow-x-auto p-4">
                        <code>{section.code}</code>
                      </pre>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {relatedWritings.length > 0 ? (
        <section className="space-y-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              İlgili yazılar
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Okumaya devam et</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedWritings.map((relatedWriting) => (
              <WritingCard key={relatedWriting.slug} writing={relatedWriting} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
