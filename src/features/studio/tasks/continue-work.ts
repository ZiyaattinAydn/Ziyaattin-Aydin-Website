import type { StudioTask } from "./task-domain";
import type { TaskProject } from "./task-store";

const statusWeight: Record<string, number> = {
  in_progress: 3, todo: 2, blocked: 1,
};
const priorityWeight: Record<string, number> = {
  urgent: 4, high: 3, medium: 2, low: 1,
};

/**
 * Pick one actionable continuation for each unfinished project. Work already
 * in progress wins; otherwise prefer ready-to-start over waiting-on-others.
 * Priority and last edit break ties, independent of task insertion order.
 */
export function selectResumeTasksPerProject(tasks: StudioTask[], projects: TaskProject[]) {
  const eligible = projects.filter((project) =>
    project.publish_state !== "archived" &&
    (project.status === "active" || project.status === "paused" || project.status === "planned")
  );
  const cards = eligible.flatMap((project) => {
    const candidates = tasks.filter((task) =>
      task.project_id === project.id &&
      task.status !== "done" && task.status !== "archived"
    );
    if (!candidates.length) return [];
    candidates.sort((a, b) =>
      (statusWeight[b.status] ?? 0) - (statusWeight[a.status] ?? 0) ||
      (priorityWeight[b.priority] ?? 0) - (priorityWeight[a.priority] ?? 0) ||
      b.updated_at.localeCompare(a.updated_at) ||
      a.id.localeCompare(b.id)
    );
    return [{ project, task: candidates[0] }];
  });
  return cards.sort((a, b) =>
    (a.project.status === "active" ? 0 : 1) - (b.project.status === "active" ? 0 : 1) ||
    b.task.updated_at.localeCompare(a.task.updated_at) ||
    a.project.title.localeCompare(b.project.title, "tr")
  );
}
