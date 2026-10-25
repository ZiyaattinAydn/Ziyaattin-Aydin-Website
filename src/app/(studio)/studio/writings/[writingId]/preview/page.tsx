import { PublicationPreview } from "@/features/studio/library/publication-preview";
export default async function WritingPreviewPage({params}:{params:Promise<{writingId:string}>}) {return <PublicationPreview kind="writings" id={(await params).writingId}/>;}
