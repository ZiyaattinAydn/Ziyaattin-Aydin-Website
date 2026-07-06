import { StudioModulePage } from "@/components/studio/studio-module-page";
import { studioModules } from "@/features/studio/studio-content";

export default function TasksPage() {
  return <StudioModulePage module={studioModules.tasks} />;
}
