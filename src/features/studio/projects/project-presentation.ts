import type {
  ProjectPublishState,
  ProjectStatus,
  ProjectVisibility,
} from "@/features/projects/domain";
import type { StudioStatusTone } from "@/features/studio/studio-content";

export const PROJECT_PUBLISH_STATE_LABELS: Record<
  ProjectPublishState,
  string
> = {
  draft: "Taslak",
  review: "İncelemede",
  approved: "Onaylandı",
  published: "Yayında",
  unpublished: "Yayından kaldırıldı",
  archived: "Arşivlendi",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planlandı",
  active: "Aktif",
  paused: "Duraklatıldı",
  completed: "Tamamlandı",
  archived: "Arşiv",
};

export const PROJECT_VISIBILITY_LABELS: Record<ProjectVisibility, string> = {
  private: "Özel",
  hidden: "Gizli",
  public: "Public",
};

export const PROJECT_PUBLISH_STATE_TONES: Record<
  ProjectPublishState,
  StudioStatusTone
> = {
  draft: "muted",
  review: "info",
  approved: "success",
  published: "success",
  unpublished: "warning",
  archived: "muted",
};

export function formatProjectDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Tarih bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}
