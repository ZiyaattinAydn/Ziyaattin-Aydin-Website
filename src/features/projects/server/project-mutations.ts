import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mapProjectRow,
  projectFailure,
  projectSuccess,
  type CreateProjectInput,
  type ProjectEntity,
  type ProjectMutationResult,
  type ProjectPublishState,
  type ProjectResult,
  type ProjectRow,
  type UpdateProjectInput,
} from "@/features/projects/domain";
import { mapProjectDatabaseError } from "@/features/projects/database-errors";
import { verifyPublicProjectAssets } from "@/features/projects/server/project-publication";
import {
  getProjectMutationContext,
  type ProjectMutationContext,
} from "@/features/projects/mutation-guard";
import {
  prepareProjectTransition,
  validateProjectUpdatePolicy,
} from "@/features/projects/transitions";
import {
  validateCreateProjectInput,
  validateProjectId,
  validateProjectPublishState,
  validateUpdateProjectInput,
} from "@/features/projects/validation";

const PROJECT_SELECT = [
  "id",
  "owner_id",
  "title",
  "slug",
  "summary",
  "problem",
  "approach",
  "highlights",
  "next_steps",
  "status",
  "visibility",
  "publish_state",
  "progress",
  "is_featured",
  "github_url",
  "demo_url",
  "link_approval_state",
  "image_url",
  "image_approval_state",
  "published_at",
  "archived_at",
  "created_at",
  "updated_at",
].join(",");

type AuthorizedOperationContext = ProjectMutationContext & {
  supabase: SupabaseClient;
  expectedVersion?: string;
};

type ProjectInsertPayload = {
  owner_id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  approach: string;
  highlights: string[];
  next_steps: string[];
  status: CreateProjectInput["status"];
  visibility: CreateProjectInput["visibility"];
  publish_state: "draft" | "published";
  progress: number;
  is_featured: boolean;
  github_url: string | null;
  demo_url: string | null;
  link_approval_state: "not_required" | "pending";
  image_url: string | null;
  image_approval_state: "not_required" | "pending";
};

type ProjectUpdatePayload = Partial<
  Omit<ProjectInsertPayload, "owner_id" | "publish_state">
> & {
  publish_state?: ProjectPublishState;
  published_at?: string | null;
};

async function withAuthorizedProjectOperation<T>(
  operation: (
    context: AuthorizedOperationContext,
  ) => Promise<ProjectResult<T>>,
): Promise<ProjectResult<T>> {
  const authorization = await getStudioAuthorization();
  const context = getProjectMutationContext(authorization);

  if (!context.ok) {
    return context;
  }

  const supabase = await createServerSupabaseClient();

  return operation({
    ...context.data,
    supabase,
  });
}

async function readOwnedProject(
  supabase: SupabaseClient,
  ownerId: string,
  projectId: string,
): Promise<ProjectResult<ProjectEntity>> {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", projectId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    return mapProjectDatabaseError(error);
  }

  if (!data) {
    return projectFailure(
      "not_found",
      "Proje bulunamadı.",
    );
  }

  return projectSuccess(
    mapProjectRow(data as unknown as ProjectRow),
  );
}

function createInsertPayload(
  input: CreateProjectInput,
  ownerId: string,
  approval?: { linkApproval: "approved" | "not_required"; imageApproval: "approved" | "not_required" },
): ProjectInsertPayload {
  const hasPublicLink = Boolean(input.githubUrl || input.demoUrl);

  return {
    owner_id: ownerId,
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    problem: input.problem,
    approach: input.approach,
    highlights: input.highlights,
    next_steps: input.nextSteps,
    status: input.status,
    visibility: input.visibility,
    publish_state: approval ? "published" : "draft",
    progress: input.progress,
    is_featured: input.isFeatured,
    github_url: input.githubUrl,
    demo_url: input.demoUrl,
    link_approval_state: approval?.linkApproval ?? (hasPublicLink ? "pending" : "not_required"),
    image_url: input.imageUrl,
    image_approval_state: approval?.imageApproval ?? (input.imageUrl ? "pending" : "not_required"),
  };
}

function createUpdatePayload(
  input: UpdateProjectInput,
  current: ProjectEntity,
): ProjectUpdatePayload {
  const payload: ProjectUpdatePayload = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.slug !== undefined) payload.slug = input.slug;
  if (input.summary !== undefined) payload.summary = input.summary;
  if (input.problem !== undefined) payload.problem = input.problem;
  if (input.approach !== undefined) payload.approach = input.approach;
  if (input.highlights !== undefined) payload.highlights = input.highlights;
  if (input.nextSteps !== undefined) payload.next_steps = input.nextSteps;
  if (input.status !== undefined) payload.status = input.status;
  if (input.visibility !== undefined) payload.visibility = input.visibility;
  if (input.progress !== undefined) payload.progress = input.progress;
  if (input.isFeatured !== undefined) {
    payload.is_featured = input.isFeatured;
  }

  const linkChanged =
    (input.githubUrl !== undefined &&
      input.githubUrl !== current.githubUrl) ||
    (input.demoUrl !== undefined &&
      input.demoUrl !== current.demoUrl);

  if (input.githubUrl !== undefined) {
    payload.github_url = input.githubUrl;
  }

  if (input.demoUrl !== undefined) {
    payload.demo_url = input.demoUrl;
  }

  if (linkChanged) {
    const nextGithubUrl =
      input.githubUrl !== undefined
        ? input.githubUrl
        : current.githubUrl;
    const nextDemoUrl =
      input.demoUrl !== undefined
        ? input.demoUrl
        : current.demoUrl;

    payload.link_approval_state =
      nextGithubUrl || nextDemoUrl
        ? "pending"
        : "not_required";
  }

  if (
    input.imageUrl !== undefined &&
    input.imageUrl !== current.imageUrl
  ) {
    payload.image_url = input.imageUrl;
    payload.image_approval_state = input.imageUrl
      ? "pending"
      : "not_required";
  }

  return payload;
}

async function updateOwnedProjectRow(
  context: AuthorizedOperationContext,
  projectId: string,
  payload: ProjectUpdatePayload,
): Promise<ProjectMutationResult> {
  const { data, error } = await context.supabase
    .from("projects")
    .update(payload)
    .eq("id", projectId)
    .eq("owner_id", context.ownerId)
    .eq("updated_at", context.expectedVersion ?? "")
    .select(PROJECT_SELECT)
    .maybeSingle();

  if (error) {
    return mapProjectDatabaseError(error);
  }

  if (!data) {
    return projectFailure(
      "not_found",
      "Proje bulunamadı.",
    );
  }

  return projectSuccess(
    mapProjectRow(data as unknown as ProjectRow),
  );
}

async function transitionOwnedProject(
  context: AuthorizedOperationContext,
  projectId: string,
  targetState: ProjectPublishState,
): Promise<ProjectMutationResult> {
  const current = await readOwnedProject(
    context.supabase,
    context.ownerId,
    projectId,
  );

  if (!current.ok) {
    return current;
  }

  const transition = prepareProjectTransition(
    current.data,
    targetState,
  );

  if (!transition.ok) {
    return transition;
  }

  const payload: ProjectUpdatePayload = {
    publish_state: transition.data.publishState,
    ...(transition.data.visibility
      ? { visibility: transition.data.visibility }
      : {}),
  };

  return updateOwnedProjectRow({...context, expectedVersion: current.data.updatedAt}, projectId, payload);
}

export async function listOwnerProjects(): Promise<
  ProjectResult<ProjectEntity[]>
> {
  return withAuthorizedProjectOperation(async (context) => {
    const { data, error } = await context.supabase
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("owner_id", context.ownerId)
      .order("updated_at", { ascending: false })
      .order("id", { ascending: true });

    if (error) {
      return mapProjectDatabaseError(error);
    }

    return projectSuccess(
      (data ?? []).map((row: unknown) =>
        mapProjectRow(row as ProjectRow),
      ),
    );
  });
}

export async function getOwnerProject(
  rawProjectId: unknown,
): Promise<ProjectResult<ProjectEntity>> {
  return withAuthorizedProjectOperation(async (context) => {
    const projectId = validateProjectId(rawProjectId);

    if (!projectId.ok) {
      return projectId;
    }

    return readOwnedProject(
      context.supabase,
      context.ownerId,
      projectId.data,
    );
  });
}

export async function createProjectDraft(
  rawInput: unknown,
): Promise<ProjectMutationResult> {
  return withAuthorizedProjectOperation(async (context) => {
    const input = validateCreateProjectInput(rawInput);

    if (!input.ok) {
      return input;
    }

    const publication = input.data.visibility === "public"
      ? await verifyPublicProjectAssets(context.supabase, context.ownerId, input.data)
      : null;
    if (publication && !publication.ok) return publication;

    const payload = createInsertPayload(
      input.data,
      context.ownerId,
      publication?.ok ? publication.data : undefined,
    );

    const { data, error } = await context.supabase
      .from("projects")
      .insert(payload)
      .select(PROJECT_SELECT)
      .single();

    if (error) {
      return mapProjectDatabaseError(error);
    }

    if (!data) {
      return projectFailure(
        "database_error",
        "Proje oluşturulamadı.",
      );
    }

    return projectSuccess(
      mapProjectRow(data as unknown as ProjectRow),
    );
  });
}

export async function updateProject(
  rawProjectId: unknown,
  rawInput: unknown,
): Promise<ProjectMutationResult> {
  return withAuthorizedProjectOperation(async (context) => {
    const projectId = validateProjectId(rawProjectId);

    if (!projectId.ok) {
      return projectId;
    }

    const input = validateUpdateProjectInput(rawInput);

    if (!input.ok) {
      return input;
    }

    const current = await readOwnedProject(
      context.supabase,
      context.ownerId,
      projectId.data,
    );

    if (!current.ok) {
      return current;
    }

    const policy = validateProjectUpdatePolicy(
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

    const nextVisibility = policy.data.visibility ?? current.data.visibility;
    const shouldPublish = (
      policy.data.visibility === "public" ||
      (current.data.publishState === "published" && nextVisibility === "public")
    );

    if (shouldPublish) {
      const publicAssets = await verifyPublicProjectAssets(
        context.supabase,
        context.ownerId,
        {
          summary: policy.data.summary ?? current.data.summary,
          githubUrl: policy.data.githubUrl !== undefined ? policy.data.githubUrl : current.data.githubUrl,
          demoUrl: policy.data.demoUrl !== undefined ? policy.data.demoUrl : current.data.demoUrl,
          imageUrl: policy.data.imageUrl !== undefined ? policy.data.imageUrl : current.data.imageUrl,
        },
      );
      if (!publicAssets.ok) return publicAssets;
      payload.visibility = "public";
      payload.publish_state = "published";
      payload.link_approval_state = publicAssets.data.linkApproval;
      payload.image_approval_state = publicAssets.data.imageApproval;
    } else if (policy.data.visibility !== undefined && current.data.publishState === "published") {
      payload.publish_state = "unpublished";
    }

    return updateOwnedProjectRow(
      {...context, expectedVersion: current.data.updatedAt},
      projectId.data,
      payload,
    );
  });
}

export async function transitionProjectPublishState(
  rawProjectId: unknown,
  rawTargetState: unknown,
): Promise<ProjectMutationResult> {
  return withAuthorizedProjectOperation(async (context) => {
    const projectId = validateProjectId(rawProjectId);

    if (!projectId.ok) {
      return projectId;
    }

    const targetState =
      validateProjectPublishState(rawTargetState);

    if (!targetState.ok) {
      return targetState;
    }

    return transitionOwnedProject(
      context,
      projectId.data,
      targetState.data,
    );
  });
}

export async function archiveProject(
  rawProjectId: unknown,
): Promise<ProjectMutationResult> {
  return withAuthorizedProjectOperation(async (context) => {
    const projectId = validateProjectId(rawProjectId);

    if (!projectId.ok) {
      return projectId;
    }

    return transitionOwnedProject(
      context,
      projectId.data,
      "archived",
    );
  });
}
