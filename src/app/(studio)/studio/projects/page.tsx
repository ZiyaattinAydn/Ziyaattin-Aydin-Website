import { StudioModulePage } from "@/components/studio/studio-module-page";
import { studioModules } from "@/features/studio/studio-content";

export default function ProjectsPage() {
  return <StudioModulePage module={studioModules.projects} />;
}
