import { StudioListCard } from "@/components/studio/studio-list-card";
import { StudioMockList } from "@/components/studio/studio-mock-list";
import { StudioModulePage } from "@/components/studio/studio-module-page";
import { mockStudioFiles, studioModules, studioPublishStateLabels, studioVisibilityLabels } from "@/features/studio/studio-content";

const fileWorkflowNotes = [
  {
    title: "Storage bağlı değil",
    meta: "Supabase Storage/RLS sonraki faz",
    description: "Bu sayfa gerçek dosya listelemez, upload yapmaz, file picker açmaz ve delete işlemi çalıştırmaz.",
  },
  {
    title: "studio_files taslağı",
    meta: "Future DB mapping",
    description: "Dosyalar storageBucket, linkedEntity, visibility ve publishState alanlarıyla bucket/path/RLS kararına hazırlanır.",
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
      status="studio_files mock"
      aside={
        <StudioMockList
          title="Dosya workflow notları"
          description="Dosya yönetimi yalnız hazırlık, kategori ve Storage/RLS sözleşmesi seviyesinde gösterilir."
          items={fileWorkflowNotes}
        />
      }
    >
      <section className="space-y-5" aria-label="Mock dosya alanları">
        <div>
          <h2 className="text-2xl font-semibold">Mock dosya ve depolama listesi</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Aşağıdaki kayıtlar gerçek Storage objesi değildir. Supabase Storage, bucket izinleri, RLS, path stratejisi ve önizleme kararları sonraki fazda bağlanacak.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mockStudioFiles.map((file) => (
            <StudioListCard
              key={file.id}
              eyebrow={file.kind}
              title={file.title}
              description={file.description}
              status={studioPublishStateLabels[file.publishState]}
              tone={file.tone}
              details={[
                { label: "Alan", value: file.location },
                { label: "Boyut", value: file.sizeLabel },
                { label: "Bucket", value: file.storageBucket },
                { label: "Görünürlük", value: studioVisibilityLabels[file.visibility] },
                { label: "İlişkili kayıt", value: file.linkedEntity },
              ]}
              actionLabel="Dosyayı yönet"
            />
          ))}
        </div>
      </section>
    </StudioModulePage>
  );
}
