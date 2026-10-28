import { MarkdownContent } from "@/features/writings/markdown-content";
import { ContentImage } from "@/components/public/content-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readPublicWriting } from "@/features/public/content/public-reads";
import { PublicUnavailable } from "@/components/public/content-state";
import { publicMetadata } from "@/lib/public-metadata";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const writing = await readPublicWriting(slug);
    if (!writing)
      return {
        title: "Yazı bulunamadı",
        robots: { index: false, follow: false },
      };
    const metadata = publicMetadata(
      writing.title,
      writing.excerpt,
      "/writings/" + encodeURIComponent(writing.slug),
    );
    return {
      ...metadata,
      openGraph: {
        ...metadata.openGraph,
        type: "article",
        publishedTime: writing.date,
        modifiedTime: writing.updatedLabel,
      },
    };
  } catch {
    return { title: "Yazı", robots: { index: false, follow: false } };
  }
}
export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await readPublicWriting(slug)
    .then((data) => ({ ok: true as const, data }))
    .catch(() => ({ ok: false as const }));
  if (!result.ok)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Yazı</h1>
        <PublicUnavailable href={"/writings/" + encodeURIComponent(slug)} />
      </div>
    );
  const writing = result.data;
  if (!writing) notFound();
  return (
    <article className="mx-auto max-w-5xl space-y-8">
      <Link
        href="/writings"
        className="inline-flex py-2 text-sm font-semibold text-[var(--accent)]"
      >
        ← Yazılara dön
      </Link>
      <header className="border-b border-[var(--border)] pb-8 sm:pb-10">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          {writing.category}
        </p>
        <h1 className="mt-5 max-w-4xl break-words text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {writing.title}
        </h1>
        <p className="mt-6 max-w-3xl break-words text-base leading-8 text-[var(--muted)] sm:text-lg">
          {writing.excerpt}
        </p>
        <p className="mt-5 text-sm text-[var(--muted)]">
          {writing.date}
          {writing.readingTime ? " · " + writing.readingTime : ""}
        </p>
      </header>
      {writing.coverImage && <div className="mb-5"><ContentImage src={writing.coverImage.src} alt={writing.coverImage.alt}/></div>}
      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside>
          <nav
            aria-label="İçindekiler"
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:sticky lg:top-24"
          >
            <h2 className="font-semibold">İçindekiler</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {writing.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={"#" + encodeURIComponent(section.id)}
                    className="hover:text-[var(--accent)]"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <div className="prose-dark min-w-0 space-y-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          {writing.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 space-y-4"
            >
              {section.id !== "content" && <h2 className="break-words">{section.title}</h2>}
              <MarkdownContent content={section.paragraphs.join("\n\n")}/>
              {section.quote && <blockquote>{section.quote}</blockquote>}
              {section.code && (
                <pre>
                  <code>{section.code}</code>
                </pre>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
