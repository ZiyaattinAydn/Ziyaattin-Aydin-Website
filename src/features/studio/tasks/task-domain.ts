export const taskStatuses = [
  "todo",
  "in_progress",
  "blocked",
  "done",
  "archived",
] as const;
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
  starts_at: string | null;
  due_at: string | null;
  completed_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};
export const statusNames: Record<TaskStatus, string> = {
  todo: "Yapılacak",
  in_progress: "Devam Ediyor",
  blocked: "Beklemede",
  done: "Tamamlandı",
  archived: "Arşiv",
};
export const priorityNames: Record<TaskPriority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  urgent: "Acil",
};
export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isOpenTask = (task: StudioTask) =>
  task.status !== "done" && task.status !== "archived";

/** Studio calendar dates use Europe/Istanbul consistently on server and browser. */
export function calendarDate(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return part("year") + "-" + part("month") + "-" + part("day");
}
export function displayDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("tr-TR", {
        timeZone: "Europe/Istanbul",
        dateStyle: "medium",
      }).format(new Date(value))
    : "Belirlenmedi";
}
function parseDate(value: string, end: boolean): string | null | false {
  if (!value) return null;
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value < "2000-01-01" ||
    value > "2100-12-31"
  )
    return false;
  const date = new Date(
    value + "T" + (end ? "23:59:59.999" : "00:00:00.000") + "+03:00",
  );
  return calendarDate(date) === value ? date.toISOString() : false;
}
export type TaskValues = {
  title: string;
  description: string;
  project_id: string | null;
  priority: TaskPriority;
  status: Exclude<TaskStatus, "archived">;
  starts_at: string | null;
  due_at: string | null;
};
export function validateTaskForm(
  form: FormData,
): { ok: true; data: TaskValues } | { ok: false; message: string } {
  const read = (key: string) =>
    typeof form.get(key) === "string" ? (form.get(key) as string).trim() : "";
  const title = read("title"),
    description = read("description"),
    priority = read("priority"),
    status = read("status");
  const project = read("projectId"),
    starts = parseDate(read("startsAt"), false),
    due = parseDate(read("dueAt"), true);
  if (
    !title ||
    title.length > 160 ||
    description.length > 2000 ||
    !taskPriorities.includes(priority as TaskPriority) ||
    !taskStatuses.includes(status as TaskStatus) ||
    status === "archived" ||
    (project && !UUID_PATTERN.test(project))
  )
    return {
      ok: false,
      message: "Başlık, açıklama, durum, öncelik ve proje seçimini kontrol et.",
    };
  if (starts === false || due === false || (starts && due && starts > due))
    return {
      ok: false,
      message: "Geçerli tarihler gir. Bitiş tarihi başlangıçtan önce olamaz.",
    };
  return {
    ok: true,
    data: {
      title,
      description,
      priority: priority as TaskPriority,
      status: status as TaskValues["status"],
      project_id: project || null,
      starts_at: starts,
      due_at: due,
    },
  };
}
export function dueState(
  task: StudioTask,
  now = new Date(),
): "overdue" | "upcoming" | null {
  if (!isOpenTask(task) || !task.due_at) return null;
  const due = calendarDate(task.due_at),
    today = calendarDate(now);
  if (due < today) return "overdue";
  return due <= calendarDate(new Date(now.getTime() + 7 * 86400000))
    ? "upcoming"
    : null;
}
export type TaskFilters = {
  q?: string;
  project?: string;
  status?: string;
  priority?: string;
  date?: string;
  from?: string;
  to?: string;
  sort?: string;
};
export function filterTasks(
  tasks: StudioTask[],
  filters: TaskFilters,
  now = new Date(),
): StudioTask[] {
  const query = (filters.q ?? "").trim().toLocaleLowerCase("tr-TR");
  const weights = { low: 0, medium: 1, high: 2, urgent: 3 };
  return tasks
    .filter((task) => {
      if (
        filters.status
          ? task.status !== filters.status
          : task.status === "archived"
      )
        return false;
      if (
        query &&
        !(task.title + " " + task.description)
          .toLocaleLowerCase("tr-TR")
          .includes(query)
      )
        return false;
      if (
        filters.project === "none"
          ? task.project_id !== null
          : filters.project && task.project_id !== filters.project
      )
        return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.date === "undated" && task.due_at) return false;
      if (
        ["overdue", "upcoming"].includes(filters.date ?? "") &&
        dueState(task, now) !== filters.date
      )
        return false;
      const due = task.due_at ? calendarDate(task.due_at) : "";
      if (filters.from && (!due || due < filters.from)) return false;
      if (filters.to && (!due || due > filters.to)) return false;
      return true;
    })
    .sort((a, b) => {
      const tie = a.id.localeCompare(b.id);
      if (filters.sort === "due")
        return (a.due_at ?? "9999").localeCompare(b.due_at ?? "9999") || tie;
      if (filters.sort === "priority")
        return weights[b.priority] - weights[a.priority] || tie;
      if (filters.sort === "title")
        return a.title.localeCompare(b.title, "tr") || tie;
      return b.updated_at.localeCompare(a.updated_at) || tie;
    });
}
export function taskProgress(tasks: StudioTask[]) {
  const relevant = tasks.filter((task) => task.status !== "archived");
  const completed = relevant.filter((task) => task.status === "done").length;
  return {
    total: relevant.length,
    completed,
    open: relevant.length - completed,
    percent: relevant.length
      ? Math.round((completed * 100) / relevant.length)
      : null,
  };
}
