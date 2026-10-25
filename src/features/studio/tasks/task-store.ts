import "server-only";

import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const taskStatuses = ["todo", "in_progress", "blocked", "done", "archived"] as const;
export const taskPriorities = ["low", "medium", "high", "urgent"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export type StudioTask = {
  id: string;
  project_id: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_at: string | null;
  completed_at: string | null;
  updated_at: string;
};

export type TaskProject = { id: string; title: string };

export type StudioTaskList =
  | { ok: true; tasks: StudioTask[]; projects: TaskProject[] }
  | { ok: false };

const TASK_COLUMNS =
  "id,project_id,title,description,status,priority,due_at,completed_at,updated_at";

/**
 * Read a private, owner-scoped task list. The Studio layout and this function
 * both require active-owner + current AAL2; RLS is an additional boundary.
 * Never fall back to demo data when the database cannot be reached.
 */
export async function listStudioTasks(): Promise<StudioTaskList> {
  const authorization = await getStudioAuthorization();

  if (!authorization.ok) return { ok: false };

  const supabase = await createServerSupabaseClient();
  const ownerId = authorization.profile.userId;

  const [taskResult, projectResult] = await Promise.all([
    supabase
      .from("tasks")
      .select(TASK_COLUMNS)
      .eq("owner_id", ownerId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id,title")
      .eq("owner_id", ownerId)
      .neq("publish_state", "archived")
      .order("title", { ascending: true }),
  ]);

  if (taskResult.error || projectResult.error) return { ok: false };

  return {
    ok: true,
    tasks: (taskResult.data ?? []) as unknown as StudioTask[],
    projects: (projectResult.data ?? []) as TaskProject[],
  };
}
