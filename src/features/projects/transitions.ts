import {
  projectFailure,
  projectSuccess,
  type ProjectEntity,
  type ProjectPublishState,
  type ProjectResult,
  type ProjectVisibility,
  type UpdateProjectInput,
} from "@/features/projects/domain";
import {
  isCanonicalProjectSlug,
} from "@/features/projects/validation";

const ALLOWED_TRANSITIONS: Readonly<
  Record<ProjectPublishState, readonly ProjectPublishState[]>
> = {
  draft: ["review", "archived"],
  review: ["draft", "approved", "archived"],
  approved: ["review", "published", "archived"],
  published: ["unpublished", "archived"],
  unpublished: ["published", "archived"],
  archived: [],
};

export type ProjectTransitionPlan = {
  publishState: ProjectPublishState;
  visibility?: ProjectVisibility;
};

export function getAllowedProjectTransitions(
  state: ProjectPublishState,
): readonly ProjectPublishState[] {
  return ALLOWED_TRANSITIONS[state];
}

export function canTransitionProjectState(
  current: ProjectPublishState,
  target: ProjectPublishState,
): boolean {
  return ALLOWED_TRANSITIONS[current].includes(target);
}

export function canChangeProjectSlug(
  state: ProjectPublishState,
): boolean {
  return state === "draft" || state === "review";
}

export function validateProjectUpdatePolicy(
  current: ProjectEntity,
  update: UpdateProjectInput,
): ProjectResult<UpdateProjectInput> {
  if (current.publishState === "archived") {
    return projectFailure(
      "project_archived",
      "Arşivlenmiş proje bu sprintte düzenlenemez.",
    );
  }

  if (
    update.slug !== undefined &&
    update.slug !== current.slug &&
    !canChangeProjectSlug(current.publishState)
  ) {
    return projectFailure(
      "slug_locked",
      "Bu proje yayın geçmişine sahip olduğu için slug değiştirilemez.",
      {
        slug: [
          "Slug yalnız draft veya review durumundaki projelerde değiştirilebilir.",
        ],
      },
    );
  }

  const nextTitle = update.title ?? current.title;
  const nextSummary = update.summary ?? current.summary;
  const nextVisibility = update.visibility ?? current.visibility;

  if (!nextTitle.trim()) {
    return projectFailure(
      "validation_failed",
      "Yayınlanan proje başlıksız bırakılamaz.",
      {
        title: ["Başlık boş olamaz."],
      },
    );
  }

  if (
    current.publishState === "published" &&
    !nextSummary.trim()
  ) {
    return projectFailure(
      "validation_failed",
      "Yayınlanan proje özetsiz bırakılamaz.",
      {
        summary: ["Published proje için özet zorunludur."],
      },
    );
  }

  if (
    current.publishState === "published" &&
    nextVisibility !== "public"
  ) {
    return projectFailure(
      "invalid_transition",
      "Published proje public görünürlükte kalmalıdır; önce unpublish yapılmalıdır.",
      {
        visibility: [
          "Published durumdayken görünürlük private veya hidden yapılamaz.",
        ],
      },
    );
  }

  return projectSuccess(update);
}

function validatePublishRequirements(
  project: ProjectEntity,
): ProjectResult<ProjectEntity> {
  const fieldErrors: Record<string, string[]> = {};

  if (!project.title.trim()) {
    fieldErrors.title = ["Publish için başlık zorunludur."];
  }

  if (!project.summary.trim()) {
    fieldErrors.summary = ["Publish için özet zorunludur."];
  }

  if (!isCanonicalProjectSlug(project.slug)) {
    fieldErrors.slug = ["Publish için canonical slug zorunludur."];
  }

  if (
    (project.githubUrl || project.demoUrl) &&
    project.linkApprovalState !== "approved"
  ) {
    fieldErrors._form = [
      "Public bağlantılar publish öncesinde approved olmalıdır.",
    ];
  }

  if (
    project.imageUrl &&
    project.imageApprovalState !== "approved"
  ) {
    fieldErrors.imageUrl = [
      "Public görsel publish öncesinde approved olmalıdır.",
    ];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return projectFailure(
      "validation_failed",
      "Proje publish gereksinimlerini karşılamıyor.",
      fieldErrors,
    );
  }

  return projectSuccess(project);
}

export function prepareProjectTransition(
  project: ProjectEntity,
  target: ProjectPublishState,
): ProjectResult<ProjectTransitionPlan> {
  if (!canTransitionProjectState(project.publishState, target)) {
    return projectFailure(
      "invalid_transition",
      `${project.publishState} durumundan ${target} durumuna geçişe izin verilmiyor.`,
      {
        publishState: ["İzinli server-side geçişlerden biri seçilmelidir."],
      },
    );
  }

  if (target === "published") {
    const publishable = validatePublishRequirements(project);

    if (!publishable.ok) {
      return publishable;
    }

    return projectSuccess({
      publishState: "published",
      visibility: "public",
    });
  }

  if (target === "unpublished") {
    return projectSuccess({
      publishState: "unpublished",
      visibility: "hidden",
    });
  }

  if (target === "archived") {
    return projectSuccess({
      publishState: "archived",
      visibility: "private",
    });
  }

  return projectSuccess({
    publishState: target,
  });
}
