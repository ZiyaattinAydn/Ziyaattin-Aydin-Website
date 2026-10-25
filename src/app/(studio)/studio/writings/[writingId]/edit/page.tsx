import { PublicationReview } from "@/features/studio/library/publication-review";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { StudioStatusPill } from "@/components/studio/studio-status-pill";
import { Panel } from "@/components/ui/panel";
import type { WritingFormValues } from "@/features/writings/domain";
import { getOwnerWriting } from "@/features/writings/server/writing-mutations";
import {
  canChangeWritingSlug,
  getAllowedWritingTransitions,
} from "@/features/writings/transitions";
import { WritingForm } from "@/features/studio/writings/writing-form";
import {
  WRITING_PUBLISH_STATE_LABELS,
  WRITING_PUBLISH_STATE_TONES,
} from "@/features/studio/writings/writing-presentation";
import { WritingWorkflowActions } from "@/features/studio/writings/writing-workflow-actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EditStudioWritingPageProps = {
  params: Promise<{
    writingId: string;
  }>;
};

function WritingReadError() {
  return (
    <Panel className="p-6">
      <div
        role="alert"
        className="rounded-2xl border border-[#8a6b2a] bg-[rgba(245,158,11,0.06)] p-6"
      >
        <h2 className="text-xl font-semibold text-[#f0c46b]">
          Yazı açılamadı
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Güvenli Studio oturumunu doğrulayın ve tekrar deneyin. Bağlantını kontrol edip sayfayı yenile.
        </p>
      </div>
    </Panel>
  );
}

export default async function EditStudioWritingPage({
  params,
}: EditStudioWritingPageProps) {
  const { writingId } = await params;
  const result = await getOwnerWriting(writingId);

  if (!result.ok) {
    if (
      result.error.code === "not_found" ||
      result.error.code === "forbidden"
    ) {
      notFound();
    }

    return (
      <div className="space-y-8">
        <Link
          href="/studio/writings"
          className="inline-flex text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          ← Yazılara dön
        </Link>
        <WritingReadError />
      </div>
    );
  }

  const writing = result.data;
  const formValues: WritingFormValues = {
    title: writing.title,
    slug: writing.slug,
    excerpt: writing.excerpt,
    content: writing.content,
    category: writing.category,
    tags: writing.tags,
    readingTime: writing.readingTime,
    visibility: writing.visibility,
    isFeatured: writing.isFeatured,
    coverImageUrl: writing.coverImageUrl,
  };

  const allowedTransitions = getAllowedWritingTransitions(
    writing.publishState,
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link
          href="/studio/writings"
          className="inline-flex text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          ← Yazılara dön
        </Link>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <StudioPageHeader
            eyebrow="Studio / Writings / Edit"
            title={writing.title}
            description="Yazının içeriğini, görselini ve yayın durumunu yönet."
            status={writing.slug}
          />
          <StudioStatusPill
            tone={WRITING_PUBLISH_STATE_TONES[writing.publishState]}
          >
            {WRITING_PUBLISH_STATE_LABELS[writing.publishState]}
          </StudioStatusPill>
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-5 sm:p-7">
          <WritingForm
            key={writing.updatedAt}
            mode="edit"
            writingId={writing.id}
            initialValues={formValues}
            publishState={writing.publishState}
            slugEditable={canChangeWritingSlug(writing.publishState)}
            readOnly={writing.publishState === "archived"}
          />
        </Panel>

        <div className="space-y-5">
          <WritingWorkflowActions
            writingId={writing.id}
            publishState={writing.publishState}
            allowedTransitions={allowedTransitions}
          />

          <PublicationReview kind="writings" id={writing.id} version={writing.updatedAt} archived={writing.publishState === "archived"}/>
        </div>
      </div>
    </div>
  );
}
