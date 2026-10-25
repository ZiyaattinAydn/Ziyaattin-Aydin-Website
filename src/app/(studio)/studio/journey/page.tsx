import Link from "next/link";
import { listStudioJourney } from "@/features/studio/journey/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function StudioJourneyPage() {
  const result = await listStudioJourney();
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Yolculuğum</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Kariyer ve öğrenme zaman çizelgesi kayıtların.</p>
        </div>
        <Link href="/studio/journey/new"
          className="rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-black">Yeni kayıt</Link>
      </header>
      {!result.ok ? <p role="alert" className="text-amber-200">Kayıtlar yüklenemedi. Oturumunu ve bağlantını kontrol et.</p> :
        result.rows.length === 0 ? <p className="rounded-2xl border border-[var(--border)] p-7 text-[var(--muted)]">
          Henüz bir yolculuk kaydı yok. Gerçek deneyimlerini daha sonra özel taslak olarak ekleyebilirsin.
        </p> : (
          <div className="grid gap-4 md:grid-cols-2">
            {result.rows.map((item) => (
              <Link href={"/studio/journey/" + item.id} key={item.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent-dim)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-[var(--muted)]">{item.period_label || item.occurred_on || "Dönem yok"}</span>
                  <span className="text-xs text-[var(--accent)]">{item.status === "archived" ? "Arşiv" : item.publish_state === "published" ? "Yayında" : "Taslak / Yayında değil"}</span>
                </div>
                <h2 className="mt-3 break-words text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 line-clamp-2 break-words text-sm text-[var(--muted)]">{item.summary || "Henüz özet yok."}</p>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
