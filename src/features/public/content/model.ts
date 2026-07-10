export type ProjectStatus = "Devam Ediyor" | "Tamamlandı" | "Planlandı";

export type PublicVisibility = "private" | "hidden" | "public";

export type PublishState =
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "unpublished"
  | "archived";

export type PublishFlowState =
  | "content-draft"
  | "review-required"
  | "approved"
  | "published"
  | "archived";

export type ApprovalState =
  | "missing"
  | "not_required"
  | "candidate"
  | "pending"
  | "approved"
  | "rejected";

export type ProjectLinkTarget = {
  label: string;
  href: string | null;
  note: string;
  disabledLabel: string;
  approvalState: ApprovalState;
};

export type ProjectLinks = {
  demo: ProjectLinkTarget;
  github: ProjectLinkTarget;
};

export type WritingExternalLink = {
  label: string;
  href: string | null;
  note: string;
  approvalState: ApprovalState;
};

export type ApprovedPublicImage = {
  src: string;
  alt: string;
  note?: string;
};

export type ProjectMilestone = {
  label: string;
  detail: string;
};

export type ProjectSummary = {
  slug: string;
  title: string;
  description: string;
  status: ProjectStatus;
  statusLabel: string;
  progress: number;
  category: string;
  timeframe: string;
  contentState: string;
  visibility: PublicVisibility;
  publishState: PublishState;
  publishFlowState: PublishFlowState;
  isFeatured: boolean;
  sourceNote: string;
  approvalNote: string;
  visibilityNote: string;
  technologies: string[];
  summary: string;
  problem: string;
  approach: string;
  highlights: string[];
  technicalNotes: string[];
  milestones: ProjectMilestone[];
  learnings: string[];
  nextSteps: string[];
  publicNotes: string[];
  links: ProjectLinks;
  image: ApprovedPublicImage | null;
};

export type WritingSection = {
  id: string;
  title: string;
  paragraphs: string[];
  quote?: string;
  code?: string;
  codeLanguage?: string;
};

export type WritingSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  updatedLabel: string;
  readingTime: string;
  sortOrder: number;
  coverLabel: string;
  visibility: PublicVisibility;
  publishState: PublishState;
  publishFlowState: PublishFlowState;
  isFeatured: boolean;
  isDraft: boolean;
  sourceNote: string;
  approvalNote: string;
  placeholderNote: string;
  sections: WritingSection[];
  relatedSlugs: string[];
  externalLinks: WritingExternalLink[];
  coverImage: ApprovedPublicImage | null;
};

export type JourneyItem = {
  marker: string;
  title: string;
  detail: string;
  lesson: string;
  statusNote: string;
  visibility: PublicVisibility;
  publishState: PublishState;
  publishFlowState: PublishFlowState;
  isFeatured: boolean;
  sourceNote: string;
  approvalNote: string;
  relatedProjectSlug?: string;
  relatedWritingSlug?: string;
};

export type ProfileContent = {
  displayName: string;
  eyebrow: string;
  headline: string;
  description: string;
  portrait: ApprovedPublicImage | null;
  portraitApprovalState: ApprovalState;
  portraitNote: string;
  focusAreas: Array<{ title: string; text: string }>;
  values: string[];
  technologies: string[];
  publishFlowState: PublishFlowState;
  approvalNote: string;
  contactNote: string;
  contactStateLabel: string;
};

export const publishStateLabels: Record<PublishState, string> = {
  draft: "Taslak",
  review: "İnceleme bekliyor",
  approved: "Onaylandı",
  published: "Yayında",
  unpublished: "Yayından kaldırıldı",
  archived: "Arşiv",
};

export const visibilityLabels: Record<PublicVisibility, string> = {
  private: "Private",
  hidden: "Gizli",
  public: "Public görünür",
};

export const publishFlowStateLabels: Record<PublishFlowState, string> = {
  "content-draft": "Mock içerik",
  "review-required": "Kullanıcı onayı bekliyor",
  approved: "Yayın hazırlığı",
  published: "Yayında",
  archived: "Arşiv",
};

export const linkApprovalLabels: Record<ApprovalState, string> = {
  missing: "Link yok",
  not_required: "Onay gerekmiyor",
  candidate: "Aday",
  pending: "Onay bekliyor",
  approved: "Onaylı link",
  rejected: "Reddedildi",
};

export function getProjectActions(
  project: ProjectSummary,
): ProjectLinkTarget[] {
  return [project.links.demo, project.links.github];
}
