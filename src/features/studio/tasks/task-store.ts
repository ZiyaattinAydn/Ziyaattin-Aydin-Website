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
    const ownerId = authorization.profile.userId;
    const supabase = await createServerSupabaseClient();
    async function fetchRows<T>(table: "tasks" | "projects", columns: string): Promise<T[]> {
      const rows: T[] = [];
      for (let offset = 0; ; offset += 500) {
        const result = await supabase
          .from(table)
          .select(columns)
          .eq("owner_id", ownerId)
          .order("id")
          .range(offset, offset + 499);
        if (result.error) throw new Error("Studio rows unavailable.");
        rows.push(...(result.data as unknown as T[]));
        if (result.data.length < 500) break;
      }
      return rows;
    }
    // Tasks and project names do not depend on each other: run both read chains
    // concurrently, while keeping owner/RLS checks and pagination intact.
    const [tasks, projects] = await Promise.all([
      fetchRows<StudioTask>("tasks", TASK_COLUMNS),
      fetchRows<TaskProject>("projects", "id,title,status,publish_state,created_at,updated_at"),
    ]);
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
  try {
    const authorization = await getStudioAuthorization();
    if (!authorization.ok) return { ok: false as const, reason: "unavailable" };
    const ownerId = authorization.profile.userId;
    const db = await createServerSupabaseClient();
    // A single task detail should not require downloading the whole task list.
    // Check ownership in both queries, and keep project picker pagination.
    const fetchProjects = async (): Promise<TaskProject[]> => {
      const projects: TaskProject[] = [];
      for (let offset = 0; ; offset += 500) {
        const response = await db.from("projects")
          .select("id,title,status,publish_state,created_at,updated_at")
          .eq("owner_id", ownerId)
          .order("id")
          .range(offset, offset + 499);
        if (response.error) throw new Error("Projects unavailable");
        projects.push(...(response.data as TaskProject[]));
        if (response.data.length < 500) break;
      }
      return projects;
    };
    const [record, projects] = await Promise.all([
      db.from("tasks")
        .select(TASK_COLUMNS)
        .eq("id", id)
        .eq("owner_id", ownerId)
        .maybeSingle(),
      fetchProjects(),
    ]);
    if (record.error) return { ok: false as const, reason: "unavailable" };
    if (!record.data) return { ok: false as const, reason: "not_found" };
    return { ok: true as const, task: record.data as StudioTask, projects };
  } catch {
    return { ok: false as const, reason: "unavailable" };
  }
}
