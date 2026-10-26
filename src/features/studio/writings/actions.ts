"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writingSlugFromTitle } from "./writing-slug";

import {
  archiveWriting,
  createWritingDraft,
  transitionWritingPublishState,
  updateWriting,
} from "@/features/writings/server/writing-mutations";
import {
  writingActionSuccess,
  toWritingActionError,
  type WritingActionState,
} from "@/features/studio/writings/action-state";

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readNullableText(formData: FormData, name: string): string | null {
  const value = readText(formData, name).trim();
  return value.length > 0 ? value : null;
}

function readTagList(formData: FormData): string[] {
  return readText(formData, "tags")
    .split(/[,\r\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function readReadingTime(formData: FormData): number | null {
  const value = readText(formData, "readingTime").trim();
  if (!value) return null;
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : null;
}

function readWritingInput(formData: FormData) {
  return {
    title: readText(formData, "title"),
    excerpt: readText(formData, "excerpt"),
    content: readText(formData, "content"),
    category: readText(formData, "category"),
    tags: readTagList(formData),
    readingTime: readReadingTime(formData),
    visibility: readText(formData, "visibility"),
    isFeatured: formData.get("isFeatured") === "on",
    coverImageUrl: readNullableText(formData, "coverImageUrl"),
  };
}

function revalidateWritingPaths(writingId: string, slug: string): void {
  revalidatePath("/", "layout");
  revalidatePath("/studio/writings");
  revalidatePath(`/studio/writings/${writingId}/edit`);
  revalidatePath("/writings");
  revalidatePath(`/writings/${slug}`);
}

export async function createWritingAction(
  previousState: WritingActionState,
  formData: FormData,
): Promise<WritingActionState> {
  void previousState;

  const input = readWritingInput(formData);
  const baseSlug = writingSlugFromTitle(input.title);

  // The unique database index handles duplicate titles and concurrent creates.
  for (let suffix = 1; suffix <= 30; suffix += 1) {
    const slug = suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`;
    const result = await createWritingDraft({ ...input, slug });

    if (result.ok) {
      revalidateWritingPaths(result.data.id, result.data.slug);
      redirect(`/studio/writings/${result.data.id}/edit`);
    }
    if (result.error.code !== "slug_conflict") {
      return toWritingActionError(result.error);
    }
  }

  return {
    status: "error",
    message: "Bu başlık için kullanılabilir bir bağlantı oluşturulamadı.",
    fieldErrors: { title: ["Başlığı biraz değiştirip tekrar dene."] },
  };
}

export async function updateWritingAction(
  writingId: string,
  previousState: WritingActionState,
  formData: FormData,
): Promise<WritingActionState> {
  void previousState;

  const result = await updateWriting(writingId, readWritingInput(formData));

  if (!result.ok) {
    return toWritingActionError(result.error);
  }

  revalidateWritingPaths(result.data.id, result.data.slug);
  return writingActionSuccess(result.data.publishState === "published"
    ? "Yazı kaydedildi ve yayınlandı."
    : "Yazı kaydedildi; yalnız Studio\u0027da görünüyor.");
}

export async function transitionWritingAction(
  writingId: string,
  previousState: WritingActionState,
  formData: FormData,
): Promise<WritingActionState> {
  void previousState;

  const result = await transitionWritingPublishState(
    writingId,
    formData.get("targetState"),
  );

  if (!result.ok) {
    return toWritingActionError(result.error);
  }

  revalidateWritingPaths(result.data.id, result.data.slug);
  return writingActionSuccess("Yazı yayın durumu güncellendi.");
}

export async function archiveWritingAction(
  writingId: string,
  previousState: WritingActionState,
  formData: FormData,
): Promise<WritingActionState> {
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

  const result = await archiveWriting(writingId);

  if (!result.ok) {
    return toWritingActionError(result.error);
  }

  revalidateWritingPaths(result.data.id, result.data.slug);
  return writingActionSuccess("Yazı arşivlendi; içeriği korundu.");
}
