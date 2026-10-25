"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  taskPriorities,
  taskStatuses,
  type TaskPriority,
  type TaskStatus,
} from "@/features/studio/tasks/task-store";

const TASK_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validPriority(value: string): value is TaskPriority {
  return (taskPriorities as readonly string[]).includes(value);
}

function validStatus(value: string): value is TaskStatus {
  return (taskStatuses as readonly string[]).includes(value);
}

function refreshAndRedirect(notice: string): never {
  revalidatePath("/studio/tasks");
  revalidatePath("/studio");
  redirect("/studio/tasks?notice=" + encodeURIComponent(notice));
}

/** These actions do not accept owner_id, completed_at or archived_at from the client. */
export async function createTaskAction(formData: FormData): Promise<void> {
  const authorization = await getStudioAuthorization();
  if (!authorization.ok) refreshAndRedirect("unauthorized");

  const title = field(formData, "title");
  const description = field(formData, "description");
  const priority = field(formData, "priority");
  const rawProjectId = field(formData, "projectId");

  if (
    title.length < 1 ||
    title.length > 160 ||
    description.length > 2000 ||
    !validPriority(priority) ||
    (rawProjectId !== "" && !TASK_ID_PATTERN.test(rawProjectId))
  ) {
    refreshAndRedirect("invalid");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("tasks").insert({
    owner_id: authorization.profile.userId,
    project_id: rawProjectId || null,
    title,
    description,
    status: "todo",
    priority,
  });

  // RLS also prevents linking a project owned by another account.
  if (error) refreshAndRedirect("database");
  refreshAndRedirect("created");
}

export async function changeTaskStatusAction(
  taskId: string,
  formData: FormData,
): Promise<void> {
  const authorization = await getStudioAuthorization();
  if (!authorization.ok) refreshAndRedirect("unauthorized");

  const target = field(formData, "status");
  if (
    !TASK_ID_PATTERN.test(taskId) ||
    !validStatus(target) ||
    target === "archived"
  ) {
    refreshAndRedirect("invalid");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({
      status: target,
      completed_at: target === "done" ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .eq("owner_id", authorization.profile.userId)
    .neq("status", "archived")
    .select("id")
    .maybeSingle();

  if (error || !data) refreshAndRedirect("database");
  refreshAndRedirect("updated");
}

export async function archiveTaskAction(taskId: string): Promise<void> {
  const authorization = await getStudioAuthorization();
  if (!authorization.ok) refreshAndRedirect("unauthorized");
  if (!TASK_ID_PATTERN.test(taskId)) refreshAndRedirect("invalid");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("owner_id", authorization.profile.userId)
    .neq("status", "archived")
    .select("id")
    .maybeSingle();

  if (error || !data) refreshAndRedirect("database");
  refreshAndRedirect("archived");
}
