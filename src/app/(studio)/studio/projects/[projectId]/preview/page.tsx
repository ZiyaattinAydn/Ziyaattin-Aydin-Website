import { PublicationPreview } from "@/features/studio/library/publication-preview";
export default async function ProjectPreviewPage({params}:{params:Promise<{projectId:string}>}) {return <PublicationPreview kind="projects" id={(await params).projectId}/>;}
