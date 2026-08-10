export const WRITING_VISIBILITIES = [
  "private",
  "hidden",
  "public",
] as const;

export const WRITING_PUBLISH_STATES = [
  "draft",
  "review",
  "approved",
  "published",
  "unpublished",
  "archived",
] as const;

export const WRITING_STATUSES = [
  "draft",
  "active",
  "archived",
] as const;

export const WRITING_APPROVAL_STATES = [
  "not_required",
  "pending",
  "approved",
  "rejected",
] as const;

export type WritingVisibility =
  (typeof WRITING_VISIBILITIES)[number];
export type WritingPublishState =
  (typeof WRITING_PUBLISH_STATES)[number];
export type WritingStatus = (typeof WRITING_STATUSES)[number];
export type WritingApprovalState =
  (typeof WRITING_APPROVAL_STATES)[number];

export type WritingFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: number | null;
  visibility: WritingVisibility;
  isFeatured: boolean;
  coverImageUrl: string | null;
};

export type CreateWritingInput = WritingFormValues;
export type UpdateWritingInput = Partial<WritingFormValues>;

export type WritingRow = {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  tags: string[];
  reading_time: number | null;
  status: WritingStatus;
  visibility: WritingVisibility;
  publish_state: WritingPublishState;
  is_featured: boolean;
  cover_image_url: string | null;
  image_approval_state: WritingApprovalState;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WritingEntity = {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: number | null;
  status: WritingStatus;
  visibility: WritingVisibility;
  publishState: WritingPublishState;
  isFeatured: boolean;
  coverImageUrl: string | null;
  imageApprovalState: WritingApprovalState;
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WritingFieldName =
  | keyof WritingFormValues
  | "writingId"
  | "publishState"
  | "_form";

export type WritingFieldErrors = Partial<
  Record<WritingFieldName, string[]>
>;

export type WritingErrorCode =
  | "configuration_missing"
  | "unauthenticated"
  | "forbidden"
  | "mfa_required"
  | "validation_failed"
  | "not_found"
  | "invalid_transition"
  | "slug_locked"
  | "slug_conflict"
  | "writing_archived"
  | "database_error";

export type WritingDomainError = {
  code: WritingErrorCode;
  message: string;
  fieldErrors?: WritingFieldErrors;
};

export type WritingResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: WritingDomainError;
    };

export type WritingMutationResult<T = WritingEntity> =
  WritingResult<T>;

export function writingSuccess<T>(data: T): WritingResult<T> {
  return {
    ok: true,
    data,
  };
}

export function writingFailure(
  code: WritingErrorCode,
  message: string,
  fieldErrors?: WritingFieldErrors,
): WritingResult<never> {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
  };
}

export function mapWritingRow(row: WritingRow): WritingEntity {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category?.trim() || "",
    tags: row.tags ?? [],
    readingTime: row.reading_time,
    status: row.status,
    visibility: row.visibility,
    publishState: row.publish_state,
    isFeatured: row.is_featured,
    coverImageUrl: row.cover_image_url,
    imageApprovalState: row.image_approval_state,
    publishedAt: row.published_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
