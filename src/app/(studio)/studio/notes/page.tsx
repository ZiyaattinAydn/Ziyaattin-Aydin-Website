import { StudioListCard } from "@/components/studio/studio-list-card";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModulePage } from "@/components/studio/studio-module-page";
import { mockStudioNotes, studioModules, studioPublishStateLabels, studioVisibilityLabels } from "@/features/studio/studio-content";

const noteWorkflowNotes = [
  {
    title: "studio_notes taslağı",
    meta: "Future DB mapping",
    description: "Notlar category, tags, visibility, publishState ve sourceTarget alanlarıyla bilgi kütüphanesi modeline hazırlanır.",
  },
  {
    title: "Editör yok",
    meta: "Disabled",
    description: "Markdown veya rich text kararından önce gerçek not oluşturma ve kaydetme akışı eklenmez.",
  },
  {
    title: "Public yazıya dönüşüm",
    meta: "publish_queue",
    description: "Seçili notların public yazı taslağına dönüşmesi ileride ayrı yayın workflow'u olarak tasarlanacak.",
  },
] as const;

export default function NotesPage() {
  return (
    <StudioModulePage
      module={studioModules.notes}
      status="studio_notes mock"
      aside={
        <StudioMockList
          title="Not workflow notları"
          description="Bu alan bilgi kütüphanesinin düzen mantığını ve publish ihtimalini gösterir."
          items={noteWorkflowNotes}
        />
      }
    >
      <section className="space-y-5" aria-label="Mock not kütüphanesi">
        <div>
          <h2 className="text-2xl font-semibold">Mock bilgi kütüphanesi</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Not kartları gerçek editör veya kayıt sistemi değildir. Visibility ve publishState alanları yalnız ileride yazıya dönüşebilecek notların nasıl işaretleneceğini anlatır.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {mockStudioNotes.map((note) => (
            <StudioListCard
              key={note.id}
              eyebrow={note.category}
              title={note.title}
              description={note.summary}
              status={studioPublishStateLabels[note.publishState]}
              tone={note.publishState === "blocked" ? "warning" : "info"}
              tags={note.tags}
              details={[
                { label: "Son güncelleme", value: note.updatedAt },
                { label: "Görünürlük", value: studioVisibilityLabels[note.visibility] },
                { label: "Model", value: note.dataModelKey },
                { label: "Kaynak/Hedef", value: note.sourceTarget },
              ]}
              actionLabel="Notu editörde aç"
            />
          ))}
        </div>
      </section>
    </StudioModulePage>
  );
}
