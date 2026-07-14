export const PROJECT_VISIBILITIES = [
  "private",
  "hidden",
  "public",
] as const;

export const PROJECT_PUBLISH_STATES = [
  "draft",
  "review",
  "approved",
  "published",
  "unpublished",
  "archived",
] as const;

export const PROJECT_STATUSES = [
  "planned",
  "active",
  "paused",
  "completed",
  "archived",
] as const;

export const PROJECT_APPROVAL_STATES = [
  "not_required",
  "pending",
  "approved",
  "rejected",
] as const;

export type ProjectVisibility =
  (typeof PROJECT_VISIBILITIES)[number];
export type ProjectPublishState =
  (typeof PROJECT_PUBLISH_STATES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectApprovalState =
  (typeof PROJECT_APPROVAL_STATES)[number];

export type ProjectSections = {
  problem: string;
  approach: string;
  highlights: string[];
  nextSteps: string[];
};

export type ProjectFormValues = ProjectSections & {
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  progress: number;
  isFeatured: boolean;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
};

export type CreateProjectInput = ProjectFormValues;
export type UpdateProjectInput = Partial<ProjectFormValues>;

export type ProjectRow = {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  approach: string;
  highlights: string[];
  next_steps: string[];
  status: ProjectStatus;
  visibility: ProjectVisibility;
  publish_state: ProjectPublishState;
  progress: number;
  is_featured: boolean;
  github_url: string | null;
  demo_url: string | null;
  link_approval_state: ProjectApprovalState;
  image_url: string | null;
  image_approval_state: ProjectApprovalState;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectEntity = {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  summary: string;
  sections: ProjectSections;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  publishState: ProjectPublishState;
  progress: number;
  isFeatured: boolean;
  githubUrl: string | null;
  demoUrl: string | null;
  linkApprovalState: ProjectApprovalState;
  imageUrl: string | null;
  imageApprovalState: ProjectApprovalState;
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFieldName =
  | keyof ProjectFormValues
  | "projectId"
  | "publishState"
  | "_form";

export type ProjectFieldErrors = Partial<
  Record<ProjectFieldName, string[]>
>;

export type ProjectErrorCode =
  | "configuration_missing"
  | "unauthenticated"
  | "forbidden"
  | "mfa_required"
  | "validation_failed"
  | "not_found"
  | "invalid_transition"
  | "slug_locked"
  | "slug_conflict"
  | "project_archived"
  | "database_error";

export type ProjectDomainError = {
  code: ProjectErrorCode;
  message: string;
  fieldErrors?: ProjectFieldErrors;
};

export type ProjectResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: ProjectDomainError;
    };

export type ProjectMutationResult<T = ProjectEntity> =
  ProjectResult<T>;

export function projectSuccess<T>(data: T): ProjectResult<T> {
  return {
    ok: true,
    data,
  };
}

export function projectFailure(
  code: ProjectErrorCode,
  message: string,
  fieldErrors?: ProjectFieldErrors,
): ProjectResult<never> {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
  };
}

export function mapProjectRow(row: ProjectRow): ProjectEntity {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    sections: {
      problem: row.problem,
      approach: row.approach,
      highlights: row.highlights,
      nextSteps: row.next_steps,
    },
    status: row.status,
    visibility: row.visibility,
    publishState: row.publish_state,
    progress: row.progress,
    isFeatured: row.is_featured,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    linkApprovalState: row.link_approval_state,
    imageUrl: row.image_url,
    imageApprovalState: row.image_approval_state,
    publishedAt: row.published_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
