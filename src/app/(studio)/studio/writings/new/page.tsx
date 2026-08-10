import Link from "next/link";

import { StudioPageHeader } from "@/components/studio/studio-page-header";
import { Panel } from "@/components/ui/panel";
import type { WritingFormValues } from "@/features/writings/domain";
import { WritingForm } from "@/features/studio/writings/writing-form";

const INITIAL_WRITING_VALUES: WritingFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [],
  readingTime: null,
  visibility: "private",
  isFeatured: false,
  coverImageUrl: null,
};

export default function NewStudioWritingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link
          href="/studio/writings"
          className="inline-flex text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
        >
          ← Yazılara dön
        </Link>
        <StudioPageHeader
          eyebrow="Studio / Writings / New"
          title="Yeni yazı taslağı"
          description="Form yalnız düzenlenebilir yazı alanlarını gönderir. Owner kimliği, draft state ve approval alanları server-side yönetilir."
          status="Private default"
        />
      </div>

      <Panel className="p-5 sm:p-7">
        <WritingForm
          mode="create"
          initialValues={INITIAL_WRITING_VALUES}
          slugEditable
        />
      </Panel>
    </div>
  );
}
