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

export const mockStudioProjects = [
  {
    title: "Kişisel Website",
    status: "Aktif" satisfies StudioProjectStatus,
    tone: "success" satisfies StudioStatusTone,
    progress: 62,
    updatedAt: "2026-07-07",
    nextAction: "Public ve Studio branch çıktıları entegre edildikten sonra içerik modelini netleştir.",
    summary: "Public portföy ile private Studio alanını tek Next.js uygulamasında birleştiren ana ürün.",
  },
  {
    title: "Studio Çekirdeği",
    status: "Planlama" satisfies StudioProjectStatus,
    tone: "info" satisfies StudioStatusTone,
    progress: 34,
    updatedAt: "2026-07-07",
    nextAction: "Auth, MFA ve veri modeli kararları kesinleşince gerçek modül akışlarına geç.",
    summary: "Projeler, görevler, notlar ve dosyalar için mock workflow seviyesindeki özel çalışma alanı.",
  },
  {
    title: "İçerik Yayın Akışı",
    status: "Beklemede" satisfies StudioProjectStatus,
    tone: "warning" satisfies StudioStatusTone,
    progress: 18,
    updatedAt: "2026-07-06",
    nextAction: "Public yazı/proje içeriklerinin Studio’dan yayınlanma kuralını sonraki fazda tasarla.",
    summary: "Not ve proje kayıtlarının seçili parçalarını public siteye kontrollü taşıyacak gelecek akış.",
  },
] as const;

export const mockStudioTasks = [
  {
    title: "Studio S02 mock workflow ekranlarını gözden geçir",
    status: "Bugün" satisfies StudioTaskStatus,
    priority: "Yüksek" satisfies StudioPriority,
    tone: "success" satisfies StudioStatusTone,
    dueLabel: "Bugün",
    owner: "Pencere 3",
    description: "Dashboard, projeler, görevler, notlar ve dosyalar sayfalarının gerçek backend olmadan anlaşılır kalmasını kontrol et.",
  },
  {
    title: "Disabled aksiyon metinlerini netleştir",
    status: "Bugün" satisfies StudioTaskStatus,
    priority: "Orta" satisfies StudioPriority,
    tone: "success" satisfies StudioStatusTone,
    dueLabel: "Bugün",
    owner: "Pencere 3",
    description: "Oluştur, düzenle, sil, yükle ve yayınla aksiyonlarının sonraki fazda bağlanacağını kullanıcıya açıkça göster.",
  },
  {
    title: "Supabase Auth + MFA kararlarını bekle",
    status: "Yakında" satisfies StudioTaskStatus,
    priority: "Yüksek" satisfies StudioPriority,
    tone: "info" satisfies StudioStatusTone,
    dueLabel: "Faz 3",
    owner: "Core + Studio",
    description: "Gerçek route koruması, session kontrolü ve MFA adımı tasarlanmadan Studio güvenli kabul edilmeyecek.",
  },
  {
    title: "Not editörü yaklaşımını seç",
    status: "Yakında" satisfies StudioTaskStatus,
    priority: "Orta" satisfies StudioPriority,
    tone: "info" satisfies StudioStatusTone,
    dueLabel: "Faz 5",
    owner: "Studio",
    description: "Markdown veya rich text editör kararı verilmeden not yazma/kaydetme akışı eklenmeyecek.",
  },
  {
    title: "Storage bucket ve RLS planı",
    status: "Beklemede" satisfies StudioTaskStatus,
    priority: "Orta" satisfies StudioPriority,
    tone: "warning" satisfies StudioStatusTone,
    dueLabel: "Faz 6",
    owner: "Studio + Core",
    description: "Dosya yükleme, silme, önizleme ve private erişim kararları Storage fazına bırakıldı.",
  },
] as const;

export const mockStudioNotes = [
  {
    title: "Auth sınırı notu",
    category: "Güvenlik",
    updatedAt: "2026-07-07",
    summary: "Studio şu an yalnız UI kabuğudur; gizli URL güvenlik değildir ve gerçek koruma Auth + MFA + RLS ile sağlanacak.",
    tags: ["auth", "mfa", "rls"],
  },
  {
    title: "Studio bilgi mimarisi",
    category: "Ürün",
    updatedAt: "2026-07-07",
    summary: "Projeler, görevler, notlar ve dosyalar ayrı modüller olarak tasarlandı; gerçek veri modeli sonraki fazlarda netleşecek.",
    tags: ["studio", "modül", "mock"],
  },
  {
    title: "Public yayın fikri",
    category: "İçerik",
    updatedAt: "2026-07-06",
    summary: "Studio notlarından seçili içeriklerin yazı veya proje detayına dönüşmesi için ileride kontrollü yayın akışı kurulabilir.",
    tags: ["public", "yayın", "içerik"],
  },
  {
    title: "Handoff kontrol listesi",
    category: "Operasyon",
    updatedAt: "2026-07-06",
    summary: "Branch, son commit, kalite kontrolleri, değişen dosyalar ve bilinçli eksikler her teslimde açık yazılmalı.",
    tags: ["handoff", "kontrol", "sprint"],
  },
] as const;

export const mockStudioFiles = [
  {
    title: "Proje ana dokümanı",
    kind: "PDF",
    status: "Hazırlık" as const,
    tone: "info" satisfies StudioStatusTone,
    sizeLabel: "Mevcut doküman",
    location: "docs/",
    description: "Repository içindeki proje dokümanı referans alınır; Storage üzerinden yükleme henüz yok.",
  },
  {
    title: "Public tasarım referansları",
    kind: "Görsel",
    status: "Onaylı referans" as const,
    tone: "success" satisfies StudioStatusTone,
    sizeLabel: "Yerel asset",
    location: "docs/reference-designs/",
    description: "Onaylı tasarım görselleri korunur; Studio dosya yöneticisi henüz gerçek asset yönetimi yapmaz.",
  },
  {
    title: "Sunum arşivi alanı",
    kind: "Sunum",
    status: "Sonraki faz" as const,
    tone: "warning" satisfies StudioStatusTone,
    sizeLabel: "Storage bekliyor",
    location: "Supabase Storage planı",
    description: "PPT/PDF sunumları ileride bucket ve izin modeli netleştiğinde yönetilecek.",
  },
] as const;

export const mockStudioActivities = [
  {
    title: "Studio Sprint 01 main'e entegre edildi",
    meta: "Başlangıç: 62d5227",
    description: "S02 geliştirmesi Sprint 01 kabuğu üzerine mock workflow katmanı eklemek için başlatıldı.",
  },
  {
    title: "Mock veri kapsamı ayrıştırıldı",
    meta: "Hazırlık verisi",
    description: "Projeler, görevler, notlar, dosyalar ve aktiviteler gerçek DB modeli iddiası olmadan listelendi.",
  },
  {
    title: "Sonraki faz aksiyonları pasif tutuldu",
    meta: "CRUD yok",
    description: "Oluşturma, düzenleme, silme, yayınlama ve upload işlemleri bilinçli olarak disabled bırakıldı.",
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
    label: "Bilgi notu",
    value: String(mockStudioNotes.length),
    helper: "Mock kütüphane",
    detail: "Karar, ürün, içerik ve operasyon notlarının örnek kategorilerini gösterir.",
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
    title: "Mock workflow seviyesi",
    meta: "Sprint 02",
    description: "Studio modülleri artık boş placeholder yerine kullanılabilir statik listeler ve durum ayrımları gösterir.",
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
    title: "Studio mock workflow",
    meta: "Şimdi",
    description: "Dashboard, modül listeleri, disabled aksiyonlar ve sonraki faz mesajları.",
  },
  {
    title: "Auth + MFA",
    meta: "Faz 3",
    description: "Yalnız yetkili hesabın giriş yapacağı gerçek güvenlik katmanı.",
  },
  {
    title: "Veri çekirdeği",
    meta: "Faz 4+",
    description: "Projeler, görevler, notlar ve dosyalar için Supabase tabanlı kayıtlar.",
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
    ],
    emptyTitle: "Supabase Storage entegrasyonu yok",
    emptyDescription:
      "Bu sprintte upload, file picker, silme veya gerçek dosya listeleme yapılmaz. Storage bucket, RLS ve izin kararları sonraki fazda ele alınacak.",
    nextActions: ["Dosya yükle", "Bucket/RLS planı", "Önizleme deneyimi"],
  },
} as const;
