import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mapWritingRow,
  writingFailure,
  writingSuccess,
  type CreateWritingInput,
  type WritingEntity,
  type WritingMutationResult,
  type WritingPublishState,
  type WritingResult,
  type WritingRow,
  type UpdateWritingInput,
} from "@/features/writings/domain";
import {
  mapWritingDatabaseError,
} from "@/features/writings/database-errors";
import {
  getWritingMutationContext,
  type WritingMutationContext,
} from "@/features/writings/mutation-guard";
import {
  prepareWritingTransition,
  validateWritingUpdatePolicy,
} from "@/features/writings/transitions";
import {
  validateCreateWritingInput,
  validateWritingId,
  validateWritingPublishState,
  validateUpdateWritingInput,
} from "@/features/writings/validation";

const WRITING_SELECT = [
  "id",
  "owner_id",
  "title",
  "slug",
  "excerpt",
  "content",
  "category",
  "tags",
  "reading_time",
  "status",
  "visibility",
  "publish_state",
  "is_featured",
  "cover_image_url",
  "image_approval_state",
  "published_at",
  "archived_at",
  "created_at",
  "updated_at",
].join(",");

type AuthorizedOperationContext = WritingMutationContext & {
  supabase: SupabaseClient;
};

type WritingInsertPayload = {
  owner_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  tags: string[];
  reading_time: number | null;
  status: "draft";
  visibility: CreateWritingInput["visibility"];
  publish_state: "draft";
  is_featured: boolean;
  cover_image_url: string | null;
  image_approval_state: "not_required" | "pending";
};

type WritingUpdatePayload = Partial<
  Omit<WritingInsertPayload, "owner_id" | "publish_state" | "status">
> & {
  publish_state?: WritingPublishState;
};

async function withAuthorizedWritingOperation<T>(
  operation: (
    context: AuthorizedOperationContext,
  ) => Promise<WritingResult<T>>,
): Promise<WritingResult<T>> {
  const authorization = await getStudioAuthorization();
  const context = getWritingMutationContext(authorization);

  if (!context.ok) {
    return context;
  }

  const supabase = await createServerSupabaseClient();

  return operation({
    ...context.data,
    supabase,
  });
}

async function readOwnedWriting(
  supabase: SupabaseClient,
  ownerId: string,
  writingId: string,
): Promise<WritingResult<WritingEntity>> {
  const { data, error } = await supabase
    .from("writings")
    .select(WRITING_SELECT)
    .eq("id", writingId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    return mapWritingDatabaseError(error);
  }

  if (!data) {
    return writingFailure(
      "not_found",
      "Yazı bulunamadı.",
    );
  }

  return writingSuccess(
    mapWritingRow(data as unknown as WritingRow),
  );
}

function createInsertPayload(
  input: CreateWritingInput,
  ownerId: string,
): WritingInsertPayload {
  return {
    owner_id: ownerId,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category.trim() || null,
    tags: input.tags,
    reading_time: input.readingTime,
    status: "draft",
    visibility: input.visibility,
    publish_state: "draft",
    is_featured: input.isFeatured,
    cover_image_url: input.coverImageUrl,
    image_approval_state: input.coverImageUrl
      ? "pending"
      : "not_required",
  };
}

function createUpdatePayload(
  input: UpdateWritingInput,
  current: WritingEntity,
): WritingUpdatePayload {
  const payload: WritingUpdatePayload = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.slug !== undefined) payload.slug = input.slug;
  if (input.excerpt !== undefined) payload.excerpt = input.excerpt;
  if (input.content !== undefined) payload.content = input.content;
  if (input.category !== undefined) {
    payload.category = input.category.trim() || null;
  }
  if (input.tags !== undefined) payload.tags = input.tags;
  if (input.readingTime !== undefined) {
    payload.reading_time = input.readingTime;
  }
  if (input.visibility !== undefined) payload.visibility = input.visibility;
  if (input.isFeatured !== undefined) {
    payload.is_featured = input.isFeatured;
  }

  if (
    input.coverImageUrl !== undefined &&
    input.coverImageUrl !== current.coverImageUrl
  ) {
    payload.cover_image_url = input.coverImageUrl;
    payload.image_approval_state = input.coverImageUrl
      ? "pending"
      : "not_required";
  }

  return payload;
}

async function updateOwnedWritingRow(
  context: AuthorizedOperationContext,
  writingId: string,
  payload: WritingUpdatePayload,
): Promise<WritingMutationResult> {
  const { data, error } = await context.supabase
    .from("writings")
    .update(payload)
    .eq("id", writingId)
    .eq("owner_id", context.ownerId)
    .select(WRITING_SELECT)
    .maybeSingle();

  if (error) {
    return mapWritingDatabaseError(error);
  }

  if (!data) {
    return writingFailure(
      "not_found",
      "Yazı bulunamadı.",
    );
  }

  return writingSuccess(
    mapWritingRow(data as unknown as WritingRow),
  );
}

async function transitionOwnedWriting(
  context: AuthorizedOperationContext,
  writingId: string,
  targetState: WritingPublishState,
): Promise<WritingMutationResult> {
  const current = await readOwnedWriting(
    context.supabase,
    context.ownerId,
    writingId,
  );

  if (!current.ok) {
    return current;
  }

  const transition = prepareWritingTransition(
    current.data,
    targetState,
  );

  if (!transition.ok) {
    return transition;
  }

  const payload: WritingUpdatePayload = {
    publish_state: transition.data.publishState,
    ...(transition.data.visibility
      ? { visibility: transition.data.visibility }
      : {}),
  };

  return updateOwnedWritingRow(context, writingId, payload);
}

export async function listOwnerWritings(): Promise<
  WritingResult<WritingEntity[]>
> {
  return withAuthorizedWritingOperation(async (context) => {
    const { data, error } = await context.supabase
      .from("writings")
      .select(WRITING_SELECT)
      .eq("owner_id", context.ownerId)
      .order("updated_at", { ascending: false })
      .order("id", { ascending: true });

    if (error) {
      return mapWritingDatabaseError(error);
    }

    return writingSuccess(
      (data ?? []).map((row: unknown) =>
        mapWritingRow(row as WritingRow),
      ),
    );
  });
}

export async function getOwnerWriting(
  rawWritingId: unknown,
): Promise<WritingResult<WritingEntity>> {
  return withAuthorizedWritingOperation(async (context) => {
    const writingId = validateWritingId(rawWritingId);

    if (!writingId.ok) {
      return writingId;
    }

    return readOwnedWriting(
      context.supabase,
      context.ownerId,
      writingId.data,
    );
  });
}

export async function createWritingDraft(
  rawInput: unknown,
): Promise<WritingMutationResult> {
  return withAuthorizedWritingOperation(async (context) => {
    const input = validateCreateWritingInput(rawInput);

    if (!input.ok) {
      return input;
    }

    const payload = createInsertPayload(
      input.data,
      context.ownerId,
    );

    const { data, error } = await context.supabase
      .from("writings")
      .insert(payload)
      .select(WRITING_SELECT)
      .single();

    if (error) {
      return mapWritingDatabaseError(error);
    }

    if (!data) {
      return writingFailure(
        "database_error",
        "Yazı oluşturulamadı.",
      );
    }

    return writingSuccess(
      mapWritingRow(data as unknown as WritingRow),
    );
  });
}

export async function updateWriting(
  rawWritingId: unknown,
  rawInput: unknown,
): Promise<WritingMutationResult> {
  return withAuthorizedWritingOperation(async (context) => {
    const writingId = validateWritingId(rawWritingId);

    if (!writingId.ok) {
      return writingId;
    }

    const input = validateUpdateWritingInput(rawInput);

    if (!input.ok) {
      return input;
    }

    const current = await readOwnedWriting(
      context.supabase,
      context.ownerId,
      writingId.data,
    );

    if (!current.ok) {
      return current;
    }

    const policy = validateWritingUpdatePolicy(
      current.data,
      input.data,
    );

    if (!policy.ok) {
      return policy;
    }

    const payload = createUpdatePayload(
      policy.data,
      current.data,
    );

    return updateOwnedWritingRow(
      context,
      writingId.data,
      payload,
    );
  });
}

export async function transitionWritingPublishState(
  rawWritingId: unknown,
  rawTargetState: unknown,
): Promise<WritingMutationResult> {
  return withAuthorizedWritingOperation(async (context) => {
    const writingId = validateWritingId(rawWritingId);

    if (!writingId.ok) {
      return writingId;
    }

    const targetState =
      validateWritingPublishState(rawTargetState);

    if (!targetState.ok) {
      return targetState;
    }

    return transitionOwnedWriting(
      context,
      writingId.data,
      targetState.data,
    );
  });
}

export async function archiveWriting(
  rawWritingId: unknown,
): Promise<WritingMutationResult> {
  return withAuthorizedWritingOperation(async (context) => {
    const writingId = validateWritingId(rawWritingId);

    if (!writingId.ok) {
      return writingId;
    }

    return transitionOwnedWriting(
      context,
      writingId.data,
      "archived",
    );
  });
}
