import { MarkdownContent } from "@/features/writings/markdown-content";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOwnerProject } from "@/features/projects/server/project-mutations";
import { getOwnerWriting } from "@/features/writings/server/writing-mutations";
import { ContentImage } from "@/components/public/content-image";
import { publicImageUrl } from "@/lib/public-image";
import { getApprovedPublicUrl } from "@/features/public/content/approvals";
import { parseWritingSections } from "@/features/public/content/supabase-repository";
export async function PublicationPreview({
  kind,
  id,
}: {
  kind: "projects" | "writings";
  id: string;
}) {
  if (kind === "projects") {
    const r = await getOwnerProject(id);
    if (!r.ok) {
      if (r.error.code === "not_found" || r.error.code === "validation_failed")
        notFound();
      return (
        <p role="alert">
          Önizleme açılamadı. Oturumunu ve bağlantını kontrol et.
        </p>
      );
    }
    const p = r.data;
    const image = publicImageUrl(p.imageUrl);
    return (
      <section className="mx-auto max-w-4xl space-y-7">
        <PreviewBack href={`/studio/projects/${id}/edit`} />
        <article className="space-y-6">
          <h1 className="break-words text-4xl font-semibold">{p.title}</h1>
          <p className="whitespace-pre-wrap break-words leading-8 text-[var(--muted)]">
            {p.summary}
          </p>
          {image && <ContentImage src={image} alt={p.title} />}
          <div className="flex flex-wrap gap-4">
            {[p.githubUrl, p.demoUrl]
              .filter(
                (v): v is string =>
                  !!v && !!getApprovedPublicUrl(v, "approved"),
              )
              .map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-[var(--accent)]"
                >
                  {url} ↗
                </a>
              ))}
          </div>
          {[
            { title: "Problem", text: p.sections.problem },
            { title: "Yaklaşım", text: p.sections.approach },
          ]
            .filter((s) => s.text)
            .map((s) => (
              <section key={s.title}>
                <h2 className="text-2xl font-semibold">{s.title}</h2>
                <p className="mt-4 whitespace-pre-wrap break-words leading-8">
                  {s.text}
                </p>
              </section>
            ))}
          {[
            { title: "Öne çıkanlar", items: p.sections.highlights },
            { title: "Sıradaki adımlar", items: p.sections.nextSteps },
          ]
            .filter((s) => s.items.length)
            .map((s) => (
              <section key={s.title}>
                <h2 className="text-2xl font-semibold">{s.title}</h2>
                <ul className="mt-4 list-disc space-y-3 pl-5">
                  {s.items.map((v, i) => (
                    <li className="break-words" key={i}>
                      {v}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </article>
      </section>
    );
  }
  const r = await getOwnerWriting(id);
  if (!r.ok) {
    if (r.error.code === "not_found" || r.error.code === "validation_failed")
      notFound();
    return (
      <p role="alert">
        Önizleme açılamadı. Oturumunu ve bağlantını kontrol et.
      </p>
    );
  }
  const w = r.data;
  const image = publicImageUrl(w.coverImageUrl);
  const sections = parseWritingSections(w.content);
  return (
    <section className="mx-auto max-w-4xl space-y-7">
      <PreviewBack href={`/studio/writings/${id}/edit`} />
      <article className="space-y-6">
        <h1 className="break-words text-4xl font-semibold">{w.title}</h1>
        <p className="whitespace-pre-wrap break-words leading-8 text-[var(--muted)]">
          {w.excerpt}
        </p>
        {image && <ContentImage src={image} alt={w.title} />}
        <div className="prose-dark min-w-0 space-y-8">
          {sections?.map((s) => (
            <section key={s.id} className="space-y-4">
              {s.id !== "content" && <h2 className="break-words">{s.title}</h2>}
              <MarkdownContent content={s.paragraphs.join("\n\n")}/>
              {s.quote && <blockquote>{s.quote}</blockquote>}
              {s.code && (
                <pre>
                  <code>{s.code}</code>
                </pre>
              )}
            </section>
          )) ?? (
            <p role="alert">
              İçerik biçimi okunamadı. Düz metin kullanabilir veya geçerli bölüm
              verisi girebilirsin.
            </p>
          )}
        </div>
      </article>
    </section>
  );
}
function PreviewBack({ href }: { href: string }) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--accent-dim)] p-4">
      <Link href={href} className="text-sm text-[var(--accent)]">
        ← Düzenlemeye dön
      </Link>
      <p className="text-sm">
        Özel önizleme · Yalnız kaydedilmiş içerik gösterilir. Bu ekran içeriği
        yayınlamaz.
      </p>
    </div>
  );
}
