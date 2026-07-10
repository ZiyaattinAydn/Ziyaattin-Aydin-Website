import type {
  JourneyItem,
  ProfileContent,
  ProjectSummary,
  WritingSummary,
} from "@/features/public/content/model";

export type PublicRepositorySource = "mock" | "supabase";

export class PublicRepositoryUnavailableError extends Error {
  readonly code = "PUBLIC_CONTENT_UNAVAILABLE";

  constructor() {
    super("Public content is temporarily unavailable.");
    this.name = "PublicRepositoryUnavailableError";
  }
}

export interface PublicContentRepository {
  readonly source: PublicRepositorySource;

  listProjects(): Promise<ProjectSummary[]>;
  getProjectBySlug(slug: string): Promise<ProjectSummary | null>;
  listFeaturedProjects(limit: number): Promise<ProjectSummary[]>;

  listWritings(): Promise<WritingSummary[]>;
  getWritingBySlug(slug: string): Promise<WritingSummary | null>;
  listFeaturedWritings(limit: number): Promise<WritingSummary[]>;
  listRelatedWritings(slugs: readonly string[]): Promise<WritingSummary[]>;

  listJourneyItems(): Promise<JourneyItem[]>;

  getProfile(): Promise<ProfileContent>;
}
