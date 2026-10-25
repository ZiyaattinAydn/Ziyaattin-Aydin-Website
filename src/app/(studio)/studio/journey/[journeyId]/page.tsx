import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudioJourney } from "@/features/studio/journey/server";
import { JourneyForm } from "@/features/studio/journey/journey-form";
import { JourneyWorkflow } from "@/features/studio/journey/journey-workflow";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function JourneyDetailPage({ params }: { params: Promise<{ journeyId: string }> }) {
  const { journeyId } = await params;
  const item = await getStudioJourney(journeyId).catch(() => null);
  if (!item) notFound();
  return <div className="space-y-6">
    <Link className="text-sm text-[var(--accent)]" href="/studio/journey">← Yolculuğuma dön</Link>
    <header className="space-y-2">
      <h1 className="break-words text-3xl font-semibold">{item.title}</h1>
      <p className="text-sm text-[var(--muted)]">Durum: {item.status === "archived" ? "Arşiv" : item.publish_state === "published" ? "Yayında" : "Taslak / Yayında değil"}</p>
    </header>
    <JourneyForm item={item}/>
    <JourneyWorkflow id={item.id} version={item.updated_at}
      publishState={item.publish_state} archived={item.status === "archived"}/>
  </div>;
}
