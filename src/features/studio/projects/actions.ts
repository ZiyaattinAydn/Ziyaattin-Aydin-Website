"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  archiveProject,
  createProjectDraft,
  transitionProjectPublishState,
  updateProject,
} from "@/features/projects/server/project-mutations";
import {
  projectActionSuccess,
  toProjectActionError,
  type ProjectActionState,
} from "@/features/studio/projects/action-state";

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readNullableText(formData: FormData, name: string): string | null {
  const value = readText(formData, name).trim();
  return value.length > 0 ? value : null;
}

function readList(formData: FormData, name: string): string[] {
  return readText(formData, name)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function readProgress(formData: FormData): number {
  const value = readText(formData, "progress");
  return Number(value);
}

function readProjectInput(formData: FormData) {
  return {
    title: readText(formData, "title"),
    slug: readText(formData, "slug"),
    summary: readText(formData, "summary"),
    problem: readText(formData, "problem"),
    approach: readText(formData, "approach"),
    highlights: readList(formData, "highlights"),
    nextSteps: readList(formData, "nextSteps"),
    status: readText(formData, "status"),
    visibility: readText(formData, "visibility"),
    progress: readProgress(formData),
    isFeatured: formData.get("isFeatured") === "on",
    githubUrl: readNullableText(formData, "githubUrl"),
    demoUrl: readNullableText(formData, "demoUrl"),
    imageUrl: readNullableText(formData, "imageUrl"),
  };
}

function revalidateProjectPaths(projectId: string, slug: string): void {
  revalidatePath("/studio/projects");
  revalidatePath(`/studio/projects/${projectId}/edit`);
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
}

export async function createProjectAction(
  previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  void previousState;

  const result = await createProjectDraft(readProjectInput(formData));

  if (!result.ok) {
    return toProjectActionError(result.error);
  }

  revalidateProjectPaths(result.data.id, result.data.slug);
  redirect(`/studio/projects/${result.data.id}/edit`);
}

export async function updateProjectAction(
  projectId: string,
  previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  void previousState;

  const result = await updateProject(projectId, readProjectInput(formData));

  if (!result.ok) {
    return toProjectActionError(result.error);
  }

  revalidateProjectPaths(result.data.id, result.data.slug);
  return projectActionSuccess("Proje kaydedildi.");
}

export async function transitionProjectAction(
  projectId: string,
  previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  void previousState;

  const result = await transitionProjectPublishState(
    projectId,
    formData.get("targetState"),
  );

  if (!result.ok) {
    return toProjectActionError(result.error);
  }

  revalidateProjectPaths(result.data.id, result.data.slug);
  return projectActionSuccess("Proje yayın durumu güncellendi.");
}

export async function archiveProjectAction(
  projectId: string,
  previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  void previousState;

  if (formData.get("archiveConfirmation") !== "archive") {
    return {
      status: "error",
      message: "Arşivleme için açık onay gereklidir.",
      fieldErrors: {
        _form: ["Onay kutusunu işaretleyin."],
      },
    };
  }

  const result = await archiveProject(projectId);

  if (!result.ok) {
    return toProjectActionError(result.error);
  }

  revalidateProjectPaths(result.data.id, result.data.slug);
  return projectActionSuccess("Proje arşivlendi. Hard delete uygulanmadı.");
}
