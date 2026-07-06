import { StudioModulePage } from "@/components/studio/studio-module-page";
import { studioModules } from "@/features/studio/studio-content";

export default function NotesPage() {
  return <StudioModulePage module={studioModules.notes} />;
}
