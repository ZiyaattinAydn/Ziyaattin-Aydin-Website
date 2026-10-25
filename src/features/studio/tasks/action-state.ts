export type TaskActionState = { status: "idle" | "error"; message: string };
export const initialTaskState: TaskActionState = {
  status: "idle",
  message: "",
};
