import type {
  WritingPublishState,
  WritingVisibility,
} from "@/features/writings/domain";
import type { StudioStatusTone } from "@/features/studio/studio-content";

export const WRITING_PUBLISH_STATE_LABELS: Record<
  WritingPublishState,
  string
> = {
  draft: "Taslak",
  review: "İncelemede",
  approved: "Onaylandı",
  published: "Yayında",
  unpublished: "Yayından kaldırıldı",
  archived: "Arşivlendi",
};

export const WRITING_VISIBILITY_LABELS: Record<WritingVisibility, string> = {
  private: "Özel",
  hidden: "Gizli",
  public: "Public",
};

export const WRITING_PUBLISH_STATE_TONES: Record<
  WritingPublishState,
  StudioStatusTone
> = {
  draft: "muted",
  review: "info",
  approved: "success",
  published: "success",
  unpublished: "warning",
  archived: "muted",
};

export function formatWritingDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Tarih bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}
