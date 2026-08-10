import {
  writingFailure,
  writingSuccess,
  type WritingEntity,
  type WritingPublishState,
  type WritingVisibility,
  type WritingResult,
  type UpdateWritingInput,
} from "@/features/writings/domain";
import {
  isCanonicalWritingSlug,
} from "@/features/writings/validation";

const ALLOWED_TRANSITIONS: Readonly<
  Record<WritingPublishState, readonly WritingPublishState[]>
> = {
  draft: ["review", "archived"],
  review: ["draft", "approved", "archived"],
  approved: ["review", "published", "archived"],
  published: ["unpublished", "archived"],
  unpublished: ["published", "archived"],
  archived: [],
};

export type WritingTransitionPlan = {
  publishState: WritingPublishState;
  visibility?: WritingVisibility;
};

export function getAllowedWritingTransitions(
  state: WritingPublishState,
): readonly WritingPublishState[] {
  return ALLOWED_TRANSITIONS[state];
}

export function canTransitionWritingState(
  current: WritingPublishState,
  target: WritingPublishState,
): boolean {
  return ALLOWED_TRANSITIONS[current].includes(target);
}

export function canChangeWritingSlug(
  state: WritingPublishState,
): boolean {
  return state === "draft" || state === "review";
}

export function validateWritingUpdatePolicy(
  current: WritingEntity,
  update: UpdateWritingInput,
): WritingResult<UpdateWritingInput> {
  if (current.publishState === "archived") {
    return writingFailure(
      "writing_archived",
      "Arşivlenmiş yazı düzenlenemez.",
    );
  }

  if (
    update.slug !== undefined &&
    update.slug !== current.slug &&
    !canChangeWritingSlug(current.publishState)
  ) {
    return writingFailure(
      "slug_locked",
      "Bu yazı yayın geçmişine sahip olduğu için slug değiştirilemez.",
      {
        slug: [
          "Slug yalnız draft veya review durumundaki yazılarda değiştirilebilir.",
        ],
      },
    );
  }

  const nextTitle = update.title ?? current.title;
  const nextExcerpt = update.excerpt ?? current.excerpt;
  const nextVisibility = update.visibility ?? current.visibility;

  if (!nextTitle.trim()) {
    return writingFailure(
      "validation_failed",
      "Yayınlanan yazı başlıksız bırakılamaz.",
      {
        title: ["Başlık boş olamaz."],
      },
    );
  }

  if (
    current.publishState === "published" &&
    !nextExcerpt.trim()
  ) {
    return writingFailure(
      "validation_failed",
      "Yayınlanan yazı özetsiz bırakılamaz.",
      {
        excerpt: ["Published yazı için özet zorunludur."],
      },
    );
  }

  if (
    current.publishState === "published" &&
    nextVisibility !== "public"
  ) {
    return writingFailure(
      "invalid_transition",
      "Published yazı public görünürlükte kalmalıdır; önce unpublish yapılmalıdır.",
      {
        visibility: [
          "Published durumdayken görünürlük private veya hidden yapılamaz.",
        ],
      },
    );
  }

  return writingSuccess(update);
}

function validatePublishRequirements(
  writing: WritingEntity,
): WritingResult<WritingEntity> {
  const fieldErrors: Record<string, string[]> = {};

  if (!writing.title.trim()) {
    fieldErrors.title = ["Publish için başlık zorunludur."];
  }

  if (!writing.excerpt.trim()) {
    fieldErrors.excerpt = ["Publish için özet zorunludur."];
  }

  if (!writing.content.trim()) {
    fieldErrors.content = ["Publish için içerik zorunludur."];
  }

  if (!isCanonicalWritingSlug(writing.slug)) {
    fieldErrors.slug = ["Publish için canonical slug zorunludur."];
  }

  if (
    writing.coverImageUrl &&
    writing.imageApprovalState !== "approved"
  ) {
    fieldErrors.coverImageUrl = [
      "Public kapak görseli publish öncesinde approved olmalıdır.",
    ];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return writingFailure(
      "validation_failed",
      "Yazı publish gereksinimlerini karşılamıyor.",
      fieldErrors,
    );
  }

  return writingSuccess(writing);
}

export function prepareWritingTransition(
  writing: WritingEntity,
  target: WritingPublishState,
): WritingResult<WritingTransitionPlan> {
  if (!canTransitionWritingState(writing.publishState, target)) {
    return writingFailure(
      "invalid_transition",
      `${writing.publishState} durumundan ${target} durumuna geçişe izin verilmiyor.`,
      {
        publishState: ["İzinli server-side geçişlerden biri seçilmelidir."],
      },
    );
  }

  if (target === "published") {
    const publishable = validatePublishRequirements(writing);

    if (!publishable.ok) {
      return publishable;
    }

    return writingSuccess({
      publishState: "published",
      visibility: "public",
    });
  }

  if (target === "unpublished") {
    return writingSuccess({
      publishState: "unpublished",
      visibility: "hidden",
    });
  }

  if (target === "archived") {
    return writingSuccess({
      publishState: "archived",
      visibility: "private",
    });
  }

  return writingSuccess({
    publishState: target,
  });
}
