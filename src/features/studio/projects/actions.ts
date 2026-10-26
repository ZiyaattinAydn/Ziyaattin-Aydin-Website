"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { projectSlugFromTitle } from "./project-slug";

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

// Only the fields shown in the streamlined form are editable here.
// Omitted legacy/portfolio fields are preserved on updates.
function readProjectInput(formData: FormData) {
  return {
    title: readText(formData, "title"),
    summary: readText(formData, "summary"),
    status: readText(formData, "status"),
    visibility: readText(formData, "visibility"),
    imageUrl: readNullableText(formData, "imageUrl"),
  };
}

function revalidateProjectPaths(projectId: string, slug: string): void {
  revalidatePath("/", "layout");
  revalidatePath("/studio");
  revalidatePath(`/studio/projects/${projectId}`);
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

  const input = readProjectInput(formData);
  const baseSlug = projectSlugFromTitle(input.title);

  // Rely on the database unique index; retry with a numeric suffix if another
  // project already owns the generated address (also safe under concurrency).
  for (let suffix = 1; suffix <= 30; suffix += 1) {
    const slug = suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`;
    const result = await createProjectDraft({ ...input, slug });

    if (result.ok) {
      revalidateProjectPaths(result.data.id, result.data.slug);
      redirect(`/studio/projects/${result.data.id}/edit`);
    }

    if (result.error.code !== "slug_conflict") {
      return toProjectActionError(result.error);
    }
  }

  return {
    status: "error",
    message: "Bu proje adı için kullanılabilir bir adres oluşturulamadı.",
    fieldErrors: { title: ["Başlığı biraz daha farklı yazmayı dene."] },
  };
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
  return projectActionSuccess(
    "Proje arşivlendi. Kayıt ve bağlı görevler korundu.",
  );
}
