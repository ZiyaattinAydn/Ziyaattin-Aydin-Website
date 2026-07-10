export const studioNavItems = [
  { href: "/studio", label: "Ana Panel", shortLabel: "Panel" },
  { href: "/studio/projects", label: "Projeler", shortLabel: "Projeler" },
  { href: "/studio/tasks", label: "Görevler", shortLabel: "Görevler" },
  { href: "/studio/notes", label: "Notlar", shortLabel: "Notlar" },
  { href: "/studio/files", label: "Dosyalar", shortLabel: "Dosyalar" },
] as const;

export type StudioStatusTone = "success" | "warning" | "info" | "muted";

export type StudioProjectStatus = "Aktif" | "Planlama" | "Beklemede";
export type StudioTaskStatus = "Bugün" | "Yakında" | "Beklemede";
export type StudioPriority = "Yüksek" | "Orta" | "Düşük";
export type StudioVisibility = "private" | "ownerOnly" | "publicCandidate";
export type StudioPublishState = "privateDraft" | "reviewNeeded" | "publishCandidate" | "blocked";

export const studioVisibilityLabels: Record<StudioVisibility, string> = {
  private: "Private mock",
  ownerOnly: "Yalnız owner",
  publicCandidate: "Public adayı",
};

export const studioPublishStateLabels: Record<StudioPublishState, string> = {
  privateDraft: "Private taslak",
  reviewNeeded: "Karar bekliyor",
  publishCandidate: "Yayın adayı",
  blocked: "Bloklu",
};

export const studioDataContractSummary = [
  {
    title: "Mock veri ve güvenlik sözleşmesi",
    meta: "Sprint 04",
    description: "Projeler, görevler, notlar, dosyalar ve publish kuyruğu ileride Supabase tablolarına, RLS planına ve admin-only Studio sınırlarına hizalanacak şekilde işaretlendi.",
  },
  {
    title: "Gerçek backend yok",
    meta: "Auth / DB yok",
    description: "Bu dosya yalnız UI hazırlık verisi taşır; Supabase client, API route, migration, RLS veya Storage işlemi eklenmedi.",
  },
  {
    title: "Publish ve RLS ilişkisi taslak",
    meta: "Karar bekliyor",
    description: "Public siteye aktarılabilecek kayıtlar yalnız mock publishState ve visibility alanlarıyla işaretlenir; RLS/Storage/publish flow gerçek implementasyon değildir.",
  },
] as const;

export const mockStudioProjects = [
  {
    id: "project-personal-website",
    title: "Kişisel Website",
    status: "Aktif" satisfies StudioProjectStatus,
    tone: "success" satisfies StudioStatusTone,
    priority: "Yüksek" satisfies StudioPriority,
    progress: 74,
    updatedAt: "2026-07-10",
    visibility: "publicCandidate" satisfies StudioVisibility,
    publishState: "reviewNeeded" satisfies StudioPublishState,
    dataModelKey: "studio_projects",
    relatedPublication: "publish_queue:public-home-and-projects",
    nextAction: "Public içerik alanları ve Studio kaynak kayıtları için yayın sözleşmesini entegrasyon ekibiyle netleştir.",
    summary: "Public portföy ile private Studio alanını tek Next.js uygulamasında birleştiren ana ürün.",
  },
  {
    id: "project-studio-core",
    title: "Studio Çekirdeği",
    status: "Planlama" satisfies StudioProjectStatus,
    tone: "info" satisfies StudioStatusTone,
    priority: "Yüksek" satisfies StudioPriority,
    progress: 42,
    updatedAt: "2026-07-10",
    visibility: "ownerOnly" satisfies StudioVisibility,
    publishState: "privateDraft" satisfies StudioPublishState,
    dataModelKey: "studio_projects",
    relatedPublication: "none",
    nextAction: "Auth, MFA, route guard, RLS ve owner settings kararları kesinleşince gerçek modül akışlarına geç.",
    summary: "Projeler, görevler, notlar ve dosyalar için mock workflow seviyesindeki özel çalışma alanı.",
  },
  {
    id: "project-publish-workflow",
    title: "İçerik Yayın Akışı",
    status: "Beklemede" satisfies StudioProjectStatus,
    tone: "warning" satisfies StudioStatusTone,
    priority: "Orta" satisfies StudioPriority,
    progress: 24,
    updatedAt: "2026-07-09",
    visibility: "private" satisfies StudioVisibility,
    publishState: "blocked" satisfies StudioPublishState,
    dataModelKey: "publish_queue",
    relatedPublication: "public_publications karar bekliyor",
    nextAction: "Not ve proje kayıtlarının public yazı/proje detayına dönüşme kuralını dokümante et.",
    summary: "Not ve proje kayıtlarının seçili parçalarını public siteye kontrollü taşıyacak gelecek akış.",
  },
] as const;

export const mockStudioTasks = [
  {
    id: "task-s04-auth-rls-plan",
    title: "Studio Auth/RLS karar matrisini dokümante et",
    status: "Bugün" satisfies StudioTaskStatus,
    priority: "Yüksek" satisfies StudioPriority,
    tone: "success" satisfies StudioStatusTone,
    dueLabel: "Sprint 04",
    owner: "Pencere 3",
    workstream: "Studio",
    relatedProjectId: "project-studio-core",
    visibility: "ownerOnly" satisfies StudioVisibility,
    publishState: "privateDraft" satisfies StudioPublishState,
    dataModelKey: "studio_tasks",
    nextAction: "Auth decision matrix, RLS/Storage planı ve Studio publish flow dokümanlarını entegrasyon için hazırla.",
    description: "Admin-only erişim, owner allowlist, RLS/Storage sınırları ve publish flow adımlarını gerçek implementasyon yapmadan netleştir.",
  },
  {
    id: "task-s04-disabled-actions",
    title: "Sonraki faz aksiyonlarını güvenli göster",
    status: "Bugün" satisfies StudioTaskStatus,
    priority: "Orta" satisfies StudioPriority,
    tone: "success" satisfies StudioStatusTone,
    dueLabel: "Sprint 04",
    owner: "Pencere 3",
    workstream: "Studio UI",
    relatedProjectId: "project-studio-core",
    visibility: "ownerOnly" satisfies StudioVisibility,
    publishState: "privateDraft" satisfies StudioPublishState,
    dataModelKey: "studio_tasks",
    nextAction: "Butonların gerçek işlem yapmadığını ve backend beklediğini açıkça koru.",
    description: "Oluştur, düzenle, sil, yükle ve yayınla aksiyonlarının sonraki fazda bağlanacağını kullanıcıya açıkça göster.",
  },
  {
    id: "task-s04-auth-decisions",
    title: "Supabase Auth + MFA kararlarını bekle",
    status: "Yakında" satisfies StudioTaskStatus,
    priority: "Yüksek" satisfies StudioPriority,
    tone: "info" satisfies StudioStatusTone,
    dueLabel: "Faz 3",
    owner: "Core + Studio",
    workstream: "Auth hazırlığı",
    relatedProjectId: "project-studio-core",
    visibility: "ownerOnly" satisfies StudioVisibility,
    publishState: "blocked" satisfies StudioPublishState,
    dataModelKey: "user_profile / owner_settings",
    nextAction: "MFA yöntemi, route guard stratejisi ve session davranışı için karar bekle.",
    description: "Gerçek route koruması, session kontrolü ve MFA adımı tasarlanmadan Studio güvenli kabul edilmeyecek.",
  },
  {
    id: "task-note-editor-decision",
    title: "Not editörü yaklaşımını seç",
    status: "Yakında" satisfies StudioTaskStatus,
    priority: "Orta" satisfies StudioPriority,
    tone: "info" satisfies StudioStatusTone,
    dueLabel: "Faz 5",
    owner: "Studio",
    workstream: "Bilgi kütüphanesi",
    relatedProjectId: "project-publish-workflow",
    visibility: "private" satisfies StudioVisibility,
    publishState: "reviewNeeded" satisfies StudioPublishState,
    dataModelKey: "studio_notes",
    nextAction: "Markdown/rich text kararı ve public yazıya dönüşme kurallarını belirle.",
    description: "Markdown veya rich text editör kararı verilmeden not yazma/kaydetme akışı eklenmeyecek.",
  },
  {
    id: "task-storage-rls-plan",
    title: "Storage bucket ve RLS planı",
    status: "Beklemede" satisfies StudioTaskStatus,
    priority: "Orta" satisfies StudioPriority,
    tone: "warning" satisfies StudioStatusTone,
    dueLabel: "Faz 6",
    owner: "Studio + Core",
    workstream: "Dosya sistemi",
    relatedProjectId: "project-publish-workflow",
    visibility: "ownerOnly" satisfies StudioVisibility,
    publishState: "blocked" satisfies StudioPublishState,
    dataModelKey: "studio_files",
    nextAction: "Bucket adı, path stratejisi, private/public dosya ayrımı ve RLS politikasını karar dokümanına taşı.",
    description: "Dosya yükleme, silme, önizleme ve private erişim kararları Storage fazına bırakıldı.",
  },
] as const;

export const mockStudioNotes = [
  {
    id: "note-auth-boundary",
    title: "Auth sınırı notu",
    category: "Güvenlik",
    updatedAt: "2026-07-10",
    visibility: "ownerOnly" satisfies StudioVisibility,
    publishState: "blocked" satisfies StudioPublishState,
    dataModelKey: "studio_notes",
    sourceTarget: "STUDIO_AUTH_DECISIONS.md / STUDIO_SECURITY_RLS_PLAN.md",
    summary: "Studio şu an yalnız UI kabuğudur; gizli URL güvenlik değildir ve gerçek koruma Auth + MFA + RLS ile sağlanacak.",
    tags: ["auth", "mfa", "rls"],
  },
  {
    id: "note-studio-information-architecture",
    title: "Studio bilgi mimarisi",
    category: "Ürün",
    updatedAt: "2026-07-10",
    visibility: "ownerOnly" satisfies StudioVisibility,
    publishState: "privateDraft" satisfies StudioPublishState,
    dataModelKey: "studio_notes",
    sourceTarget: "STUDIO_DATA_MODEL_DRAFT.md",
    summary: "Projeler, görevler, notlar ve dosyalar ayrı modüller olarak tasarlandı; gerçek veri modeli sonraki fazlarda netleşecek.",
    tags: ["studio", "modül", "mock"],
  },
  {
    id: "note-public-publishing",
    title: "Public yayın fikri",
    category: "İçerik",
    updatedAt: "2026-07-09",
    visibility: "publicCandidate" satisfies StudioVisibility,
    publishState: "reviewNeeded" satisfies StudioPublishState,
    dataModelKey: "publish_queue",
    sourceTarget: "public_publications karar bekliyor",
    summary: "Studio notlarından seçili içeriklerin yazı veya proje detayına dönüşmesi için ileride kontrollü yayın akışı kurulabilir.",
    tags: ["public", "yayın", "içerik"],
  },
  {
    id: "note-handoff-checklist",
    title: "Handoff kontrol listesi",
    category: "Operasyon",
    updatedAt: "2026-07-09",
    visibility: "private" satisfies StudioVisibility,
    publishState: "privateDraft" satisfies StudioPublishState,
    dataModelKey: "studio_notes",
    sourceTarget: "docs/handoffs/",
    summary: "Branch, son commit, kalite kontrolleri, değişen dosyalar ve bilinçli eksikler her teslimde açık yazılmalı.",
    tags: ["handoff", "kontrol", "sprint"],
  },
] as const;

export const mockStudioFiles = [
  {
    id: "file-project-master-doc",
    title: "Proje ana dokümanı",
    kind: "PDF",
    status: "Hazırlık" as const,
    tone: "info" satisfies StudioStatusTone,
    sizeLabel: "Mevcut doküman",
    location: "docs/",
    storageBucket: "Karar bekliyor",
    visibility: "ownerOnly" satisfies StudioVisibility,
    publishState: "privateDraft" satisfies StudioPublishState,
    dataModelKey: "studio_files",
    linkedEntity: "project-personal-website",
    description: "Repository içindeki proje dokümanı referans alınır; Storage üzerinden yükleme henüz yok.",
  },
  {
    id: "file-public-design-references",
    title: "Public tasarım referansları",
    kind: "Görsel",
    status: "Onaylı referans" as const,
    tone: "success" satisfies StudioStatusTone,
    sizeLabel: "Yerel asset",
    location: "docs/reference-designs/",
    storageBucket: "Public asset değil; repo referansı",
    visibility: "publicCandidate" satisfies StudioVisibility,
    publishState: "reviewNeeded" satisfies StudioPublishState,
    dataModelKey: "studio_files",
    linkedEntity: "project-personal-website",
    description: "Onaylı tasarım görselleri korunur; Studio dosya yöneticisi henüz gerçek asset yönetimi yapmaz.",
  },
  {
    id: "file-presentation-archive",
    title: "Sunum arşivi alanı",
    kind: "Sunum",
    status: "Sonraki faz" as const,
    tone: "warning" satisfies StudioStatusTone,
    sizeLabel: "Storage bekliyor",
    location: "Supabase Storage planı",
    storageBucket: "studio-private-files önerisi",
    visibility: "private" satisfies StudioVisibility,
    publishState: "blocked" satisfies StudioPublishState,
    dataModelKey: "studio_files",
    linkedEntity: "publish_queue karar bekliyor",
    description: "PPT/PDF sunumları ileride bucket ve izin modeli netleştiğinde yönetilecek.",
  },
] as const;

export const mockPublishQueue = [
  {
    id: "publish-home-projects-copy",
    sourceType: "studio_projects",
    sourceId: "project-personal-website",
    targetRoute: "/projects",
    state: "reviewNeeded" satisfies StudioPublishState,
    visibility: "publicCandidate" satisfies StudioVisibility,
    title: "Kişisel Website proje özeti",
    nextAction: "Public içerik şeması ve onay akışı netleşmeden yayınlanmayacak.",
  },
  {
    id: "publish-note-to-writing-draft",
    sourceType: "studio_notes",
    sourceId: "note-public-publishing",
    targetRoute: "/writings/[slug]",
    state: "blocked" satisfies StudioPublishState,
    visibility: "publicCandidate" satisfies StudioVisibility,
    title: "Nottan yazıya dönüşüm denemesi",
    nextAction: "Yazı editörü ve publish_queue modeli karar bekliyor.",
  },
] as const;

export const mockStudioActivities = [
  {
    title: "Studio Sprint 02 main'e entegre edildi",
    meta: "Başlangıç: e77d2d1",
    description: "S03 çalışması mock workflow'u veri modeli taslağına ve Supabase hazırlık kararlarına hizalamak için başlatıldı.",
  },
  {
    title: "Mock veri ve güvenlik sözleşmesi genişletildi",
    meta: "Future DB mapping",
    description: "id, visibility, publishState, dataModelKey ve ilişki alanları gerçek DB implementasyonu olmadan eklendi.",
  },
  {
    title: "Auth kararları dokümante edildi",
    meta: "Karar bekliyor",
    description: "MFA yöntemi, route guard stratejisi, session timeout ve recovery davranışları sonraki faza bırakıldı.",
  },
] as const;

export const dashboardStats = [
  {
    label: "Aktif mock proje",
    value: String(mockStudioProjects.filter((project) => project.status === "Aktif").length),
    helper: "Hazırlık verisi",
    detail: "Gerçek database kaydı değildir; proje workflow ekranlarının nasıl görüneceğini anlatır.",
  },
  {
    label: "Açık görev",
    value: String(mockStudioTasks.length),
    helper: "CRUD yok",
    detail: "Bugün, yakında ve beklemede ayrımı statiktir; görev oluşturma sonraki fazda bağlanacak.",
  },
  {
    label: "Publish adayı",
    value: String(mockPublishQueue.length),
    helper: "Yayın yok",
    detail: "Public publish ilişkisi yalnız mock queue olarak gösterilir; public siteye veri aktarımı yapılmaz.",
  },
  {
    label: "Dosya alanı",
    value: "0 GB",
    helper: "Storage yok",
    detail: "PDF, sunum ve görsel alanları Supabase Storage bağlanana kadar yalnız hazırlık görünümüdür.",
  },
] as const;

export const dashboardFocusItems = [
  {
    title: "Data model draft",
    meta: "docs/studio",
    description: "Studio mock verisinin studio_projects, studio_tasks, studio_notes, studio_files ve publish_queue karşılıkları dokümante edildi.",
  },
  {
    title: "Backend sınırı",
    meta: "Sonraki faz",
    description: "Supabase Auth, PostgreSQL, Storage, RLS ve gerçek CRUD bu sprintte bilinçli olarak uygulanmaz.",
  },
  {
    title: "Mobil kullanım",
    meta: "Shell korunuyor",
    description: "Studio içinde mobil navigasyon görünür kalır; public header veya footer kullanılmaz.",
  },
] as const;

export const dashboardTimelineItems = [
  {
    title: "Studio workflow sözleşmesi",
    meta: "Şimdi",
    description: "Mock data alanları, disabled aksiyonlar, publish ilişkisi ve dokümantasyon.",
  },
  {
    title: "Auth + MFA kararları",
    meta: "Faz 3",
    description: "Yalnız yetkili hesabın giriş yapacağı gerçek güvenlik katmanı için karar bekleyen noktalar.",
  },
  {
    title: "Veri çekirdeği",
    meta: "Faz 4+",
    description: "Projeler, görevler, notlar ve dosyalar için Supabase tabanlı kayıtlar ve RLS.",
  },
] as const;

export const studioModules = {
  projects: {
    eyebrow: "Proje yönetimi",
    title: "Projeler",
    description:
      "Kişisel projelerin durumunu, fazlarını, public yayına çıkacak parçalarını ve geliştirme notlarını takip edecek Studio modülü.",
    v1Scope: [
      "Proje kartları, durum ve faz takibi",
      "Public siteye seçilecek proje özeti",
      "Roadmap, handoff ve kaynak bağlantıları",
      "studio_projects -> publish_queue ilişkisi için hazırlık alanları",
    ],
    emptyTitle: "Gerçek proje CRUD henüz yok",
    emptyDescription:
      "Aşağıdaki liste mock hazırlık verisidir. Proje oluşturma, düzenleme, silme ve public yayın kontrolleri Supabase kararları netleştiğinde bağlanacak.",
    nextActions: ["Proje oluştur", "Projeyi düzenle", "Public yayına hazırla"],
  },
  tasks: {
    eyebrow: "Görev ve yol haritası",
    title: "Görevler",
    description:
      "Sprint işleri, günlük yapılacaklar, blocker notları ve ilerleyen fazlarda kanban benzeri görev akışı için ayrılan alan.",
    v1Scope: [
      "Görev listesi, durum ve öncelik bilgisi",
      "Bugün / yakında / beklemede ayrımı",
      "Blocker ve handoff takip notları",
      "studio_tasks -> studio_projects / sprint ilişkisi için hazırlık alanları",
    ],
    emptyTitle: "Gerçek görev yönetimi bağlı değil",
    emptyDescription:
      "Bu sayfadaki görevler statiktir. Görev oluşturma, filtreleme, sürükle-bırak kanban ve tamamlandı işaretleri sonraki faza bırakıldı.",
    nextActions: ["Görev oluştur", "Kanban görünümü", "Öncelik filtresi"],
  },
  notes: {
    eyebrow: "Bilgi kütüphanesi",
    title: "Notlar",
    description:
      "Karar kayıtları, öğrenme notları, içerik fikirleri ve proje araştırmalarını düzenli tutacak kişisel bilgi alanı.",
    v1Scope: [
      "Not kategorileri ve hızlı arama zemini",
      "Karar / fikir / kaynak ayrımı",
      "Public yazıya dönüşebilecek not işaretleri",
      "studio_notes -> publish_queue ilişkisi için hazırlık alanları",
    ],
    emptyTitle: "Not editörü henüz bağlı değil",
    emptyDescription:
      "Bu sayfa not kütüphanesinin yönünü gösterir. Gerçek editör, kayıt, arama ve etiket modeli sonraki fazda eklenecek.",
    nextActions: ["Yeni not yaz", "Etiket modeli", "Nottan yazıya aktar"],
  },
  files: {
    eyebrow: "Dosya ve arşiv",
    title: "Dosyalar",
    description:
      "PDF, sunum, görsel ve proje çıktılarının ileride Supabase Storage ile yönetileceği güvenli dosya alanı.",
    v1Scope: [
      "Dosya türü ve klasör mantığı",
      "PDF / sunum / görsel ayrımı",
      "Public içerikle ilişkilendirilecek dosyalar",
      "studio_files -> Storage bucket/path/RLS ilişkisi için hazırlık alanları",
    ],
    emptyTitle: "Supabase Storage entegrasyonu yok",
    emptyDescription:
      "Bu sprintte upload, file picker, silme veya gerçek dosya listeleme yapılmaz. Storage bucket, RLS ve izin kararları sonraki fazda ele alınacak.",
    nextActions: ["Dosya yükle", "Bucket/RLS planı", "Önizleme deneyimi"],
  },
} as const;
