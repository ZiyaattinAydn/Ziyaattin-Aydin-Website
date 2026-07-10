import type {
  PublishState,
  PublicVisibility,
} from "@/features/public/content/model";

export type PublicAccessState = {
  visibility: PublicVisibility;
  publishState: PublishState;
  publishedAt: string | null;
};

export type PublicRecord<T> = {
  content: T;
  access: PublicAccessState;
};

export function normalizeVisibility(value: unknown): PublicVisibility {
  if (value === "public" || value === "private" || value === "hidden") {
    return value;
  }

  if (value === "unlisted") {
    return "hidden";
  }

  return "private";
}

export function normalizePublishState(value: unknown): PublishState {
  if (
    value === "draft" ||
    value === "review" ||
    value === "approved" ||
    value === "published" ||
    value === "unpublished" ||
    value === "archived"
  ) {
    return value;
  }

  return "draft";
}

export function isPubliclyReadable(access: PublicAccessState): boolean {
  return (
    access.publishState === "published" &&
    access.visibility === "public" &&
    typeof access.publishedAt === "string" &&
    access.publishedAt.trim().length > 0
  );
}

export function getVisibleRecords<T>(
  records: ReadonlyArray<PublicRecord<T>>,
): T[] {
  return records
    .filter((record) => isPubliclyReadable(record.access))
    .map((record) => record.content);
}

export function getVisibleRecordBy<T>(
  records: ReadonlyArray<PublicRecord<T>>,
  predicate: (content: T) => boolean,
): T | null {
  const record = records.find(
    (candidate) =>
      isPubliclyReadable(candidate.access) &&
      predicate(candidate.content),
  );

  return record?.content ?? null;
}
