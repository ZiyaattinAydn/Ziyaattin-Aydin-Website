import Link from "next/link";
import { JourneyForm } from "@/features/studio/journey/journey-form";
export default function NewJourneyPage() {
  return <div className="space-y-6">
    <Link className="text-sm text-[var(--accent)]" href="/studio/journey">← Yolculuğuma dön</Link>
    <h1 className="text-3xl font-semibold">Yeni yolculuk kaydı</h1>
    <JourneyForm/>
  </div>;
}
