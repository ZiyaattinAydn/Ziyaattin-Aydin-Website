import "server-only";
import { getStudioAuthorization } from "@/lib/auth/studio-authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UUID_PATTERN, type StudioTask } from "./task-domain";
export type { StudioTask, TaskStatus, TaskPriority } from "./task-domain";
export { taskStatuses, taskPriorities } from "./task-domain";
export type TaskProject = {
  id: string;
  title: string;
  status: string;
  publish_state: string;
  created_at: string;
  updated_at: string;
};
export type StudioTaskList =
  { ok: true; tasks: StudioTask[]; projects: TaskProject[] } | { ok: false };
const TASK_COLUMNS =
  "id,project_id,title,description,status,priority,starts_at,due_at,completed_at,archived_at,created_at,updated_at";
export async function listStudioTasks(): Promise<StudioTaskList> {
  try {
    const authorization = await getStudioAuthorization();
    if (!authorization.ok) return { ok: false };
    const supabase = await createServerSupabaseClient();
    const tasks: StudioTask[] = [],
      projects: TaskProject[] = [];
    // Read stable pages beyond Supabase's default row cap so counters stay accurate.
    for (let offset = 0; ; offset += 500) {
      const result = await supabase
        .from("tasks")
        .select(TASK_COLUMNS)
        .eq("owner_id", authorization.profile.userId)
        .order("id")
        .range(offset, offset + 499);
      if (result.error) return { ok: false };
      tasks.push(...(result.data as unknown as StudioTask[]));
      if (result.data.length < 500) break;
    }
    for (let offset = 0; ; offset += 500) {
      const result = await supabase
        .from("projects")
        .select("id,title,status,publish_state,created_at,updated_at")
        .eq("owner_id", authorization.profile.userId)
        .order("id")
        .range(offset, offset + 499);
      if (result.error) return { ok: false };
      projects.push(...(result.data as TaskProject[]));
      if (result.data.length < 500) break;
    }
    tasks.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    projects.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    return { ok: true, tasks, projects };
  } catch {
    return { ok: false };
  }
}
export async function getStudioTask(id: string) {
  if (!UUID_PATTERN.test(id))
    return { ok: false as const, reason: "not_found" };
  const result = await listStudioTasks();
  if (!result.ok) return { ok: false as const, reason: "unavailable" };
  const task = result.tasks.find((task) => task.id === id);
  return task
    ? { ok: true as const, task, projects: result.projects }
    : { ok: false as const, reason: "not_found" };
}
