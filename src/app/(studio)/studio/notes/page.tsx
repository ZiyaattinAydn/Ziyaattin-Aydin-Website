import { StudioListCard } from "@/components/studio/studio-list-card";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModulePage } from "@/components/studio/studio-module-page";
import { mockStudioNotes, studioModules } from "@/features/studio/studio-content";

const noteWorkflowNotes = [
  {
    title: "Bilgi kütüphanesi iskeleti",
    meta: "Mock",
    description: "Notlar kategori, özet, etiket ve son güncelleme bilgisiyle listelenir.",
  },
  {
    title: "Editör yok",
    meta: "Disabled",
    description: "Markdown veya rich text kararından önce gerçek not oluşturma ve kaydetme akışı eklenmez.",
  },
  {
    title: "Public yazıya dönüşüm",
    meta: "Sonraki faz",
    description: "Seçili notların public yazı taslağına dönüşmesi ileride ayrı yayın workflow'u olarak tasarlanacak.",
  },
] as const;

export default function NotesPage() {
  return (
    <StudioModulePage
      module={studioModules.notes}
      aside={
        <StudioMockList
          title="Not workflow notları"
          description="Bu alan bilgi kütüphanesinin düzen mantığını gösterir."
          items={noteWorkflowNotes}
        />
      }
    >
      <section className="space-y-5" aria-label="Mock not kütüphanesi">
        <div>
          <h2 className="text-2xl font-semibold">Mock bilgi kütüphanesi</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Not kartları gerçek editör veya kayıt sistemi değildir; ileride eklenecek arama, etiket ve yayın akışının ekran hazırlığıdır.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {mockStudioNotes.map((note) => (
            <StudioListCard
              key={note.title}
              eyebrow={note.category}
              title={note.title}
              description={note.summary}
              status="Mock not"
              tone="info"
              tags={note.tags}
              details={[{ label: "Son güncelleme", value: note.updatedAt }]}
              actionLabel="Notu editörde aç"
            />
          ))}
        </div>
      </section>
    </StudioModulePage>
  );
}
