import { StudioListCard } from "@/components/studio/studio-list-card";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModulePage } from "@/components/studio/studio-module-page";
import { mockStudioFiles, studioModules } from "@/features/studio/studio-content";

const fileWorkflowNotes = [
  {
    title: "Storage bağlı değil",
    meta: "Supabase Storage sonraki faz",
    description: "Bu sayfa gerçek dosya listelemez, upload yapmaz ve file picker açmaz.",
  },
  {
    title: "Kategoriler hazır",
    meta: "PDF / Sunum / Görsel",
    description: "Dosya türleri ileride bucket ve metadata kararlarına temel olacak şekilde ayrıştırılır.",
  },
  {
    title: "Gizli anahtar yok",
    meta: "Güvenlik sınırı",
    description: "Service role anahtarı veya environment değişkeni eklenmez; client tarafına gizli değer konmaz.",
  },
] as const;

export default function FilesPage() {
  return (
    <StudioModulePage
      module={studioModules.files}
      aside={
        <StudioMockList
          title="Dosya workflow notları"
          description="Dosya yönetimi yalnız hazırlık ve kategori seviyesinde gösterilir."
          items={fileWorkflowNotes}
        />
      }
    >
      <section className="space-y-5" aria-label="Mock dosya alanları">
        <div>
          <h2 className="text-2xl font-semibold">Mock dosya ve depolama listesi</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Aşağıdaki kayıtlar gerçek Storage objesi değildir. Supabase Storage, bucket izinleri, RLS ve önizleme kararları sonraki fazda bağlanacak.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mockStudioFiles.map((file) => (
            <StudioListCard
              key={file.title}
              eyebrow={file.kind}
              title={file.title}
              description={file.description}
              status={file.status}
              tone={file.tone}
              details={[
                { label: "Alan", value: file.location },
                { label: "Boyut", value: file.sizeLabel },
              ]}
              actionLabel="Dosyayı yönet"
            />
          ))}
        </div>
      </section>
    </StudioModulePage>
  );
}
