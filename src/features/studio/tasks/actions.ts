"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UUID_PATTERN, validateTaskForm } from "./task-domain";
import type { TaskActionState } from "./action-state";
const errorState = (message: string): TaskActionState => ({
  status: "error",
  message,
});
const denied = () =>
  errorState(
    "Oturumun doğrulanamadı. Yeniden giriş yapıp doğrulama adımını tamamla.",
  );
function refresh(taskId: string) {
  revalidatePath("/studio");
  revalidatePath("/studio/tasks");
  revalidatePath("/studio/tasks/" + taskId);
  revalidatePath("/studio/projects", "layout");
}
async function saveTask(
  id: string | null,
  form: FormData,
): Promise<TaskActionState> {
  let savedId: string;
  try {
    const authorization = await getStudioAuthorization();
    if (!authorization.ok) return denied();
    if (id && !UUID_PATTERN.test(id)) return errorState("Görev bulunamadı.");
    const parsed = validateTaskForm(form);
    if (!parsed.ok) return errorState(parsed.message);
    const supabase = await createServerSupabaseClient();
    const owner = authorization.profile.userId;
    if (parsed.data.project_id) {
      const { data: project, error } = await supabase
        .from("projects")
        .select("id,status,publish_state")
        .eq("id", parsed.data.project_id)
        .eq("owner_id", owner)
        .maybeSingle();
      if (error || !project) return errorState("Seçilen projeye erişilemiyor.");
      if (
        project.status === "archived" ||
        project.publish_state === "archived"
      ) {
        const current = id
          ? await supabase
              .from("tasks")
              .select("project_id")
              .eq("id", id)
              .eq("owner_id", owner)
              .maybeSingle()
          : null;
        if (current?.data?.project_id !== project.id)
          return errorState("Arşivdeki projeye yeni görev bağlanamaz.");
      }
    }
    // Dates are no longer part of the task editor. Keep previously saved dates
    // on edit instead of wiping them when the hidden fields are absent.
    let values = { ...parsed.data, starts_at: null as string | null, due_at: null as string | null };
    if (id) {
      const existing = await supabase
        .from("tasks")
        .select("starts_at,due_at")
        .eq("id", id)
        .eq("owner_id", owner)
        .eq("updated_at", String(form.get("version") ?? ""))
        .neq("status", "archived")
        .maybeSingle();
      if (existing.error || !existing.data) {
        return errorState("Görev değişmiş olabilir. Sayfayı yenileyip tekrar dene.");
      }
      values = {
        ...parsed.data,
        starts_at: existing.data.starts_at ?? null,
        due_at: existing.data.due_at ?? null,
      };
    }
    const result = id
      ? await supabase
          .from("tasks")
          .update(values)
          .eq("id", id)
          .eq("owner_id", owner)
          .eq("updated_at", String(form.get("version") ?? ""))
          .neq("status", "archived")
          .select("id")
          .maybeSingle()
      : await supabase
          .from("tasks")
          .insert({ ...values, owner_id: owner })
          .select("id")
          .single();
    if (result.error)
      return errorState(
        "Görev kaydedilemedi. Bağlantını kontrol edip tekrar dene.",
      );
    if (!result.data)
      return errorState(
        "Bu görev başka bir ekranda değişmiş olabilir. Sayfayı yenileyip tekrar dene.",
      );
    savedId = result.data.id;
  } catch {
    return errorState(
      "Bağlantı kurulamadı. Girdiğin bilgileri koruyarak tekrar deneyebilirsin.",
    );
  }
  refresh(savedId);
  redirect(
    "/studio/tasks/" + savedId + "?notice=" + (id ? "updated" : "created"),
  );
}
export async function createTaskAction(
  _state: TaskActionState,
  form: FormData,
) {
  return saveTask(null, form);
}
export async function updateTaskAction(
  id: string,
  _state: TaskActionState,
  form: FormData,
) {
  return saveTask(id, form);
}
export async function archiveTaskAction(
  id: string,
  _state: TaskActionState,
  form: FormData,
): Promise<TaskActionState> {
  if (!UUID_PATTERN.test(id) || form.get("confirmation") !== "archive")
    return errorState("Arşivlemek için onay kutusunu işaretle.");
  try {
    const authorization = await getStudioAuthorization();
    if (!authorization.ok) return denied();
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("tasks")
      .update({ status: "archived" })
      .eq("id", id)
      .eq("owner_id", authorization.profile.userId)
      .neq("status", "archived")
      .eq("updated_at", String(form.get("version") ?? ""))
      .select("id")
      .maybeSingle();
    if (error || !data)
      return errorState(
        "Arşivlenemedi. Görev değişmiş olabilir; sayfayı yenileyip tekrar dene.",
      );
  } catch {
    return errorState("Bağlantı kurulamadı. Tekrar dene.");
  }
  refresh(id);
  redirect("/studio/tasks?notice=archived");
}
