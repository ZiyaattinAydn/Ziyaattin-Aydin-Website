export const studioNavItems = [
  { href: "/studio", label: "Ana Panel", shortLabel: "Panel" },
  { href: "/studio/projects", label: "Projeler", shortLabel: "Projeler" },
  { href: "/studio/tasks", label: "Görevler", shortLabel: "Görevler" },
  { href: "/studio/notes", label: "Notlar", shortLabel: "Notlar" },
  { href: "/studio/files", label: "Dosyalar", shortLabel: "Dosyalar" },
] as const;

export const dashboardStats = [
  {
    label: "Aktif proje alanları",
    value: "3",
    helper: "Mock hazırlık verisi",
    detail: "Public site, içerik sistemi ve Studio çekirdeği için izleme kartları.",
  },
  {
    label: "Bugünün görev grubu",
    value: "5",
    helper: "Gerçek görev kaydı değil",
    detail: "Sprint planı, kontrol listesi ve handoff adımlarını temsil eder.",
  },
  {
    label: "Son not bölümü",
    value: "4",
    helper: "Not altyapısı bekleniyor",
    detail: "Karar, fikir, kaynak ve öğrenme notları için örnek ayrım.",
  },
  {
    label: "Dosya alanları",
    value: "0 GB",
    helper: "Storage bağlı değil",
    detail: "PDF, sunum ve görseller için gelecek modül yeri.",
  },
] as const;

export const dashboardFocusItems = [
  {
    title: "Sprint 01 kapsamı",
    meta: "Shell / UI",
    description: "Studio modülleri gerçek veri olmadan okunabilir bilgi mimarisine kavuşuyor.",
  },
  {
    title: "Auth sınırı",
    meta: "Sonraki faz",
    description: "Supabase Auth, MFA ve korumalı route mantığı bu sprintte uygulanmıyor.",
  },
  {
    title: "Mobil kullanım",
    meta: "Navigasyon",
    description: "Studio içinde mobil kullanıcıyı yönsüz bırakmayan kompakt link yapısı hazırlanıyor.",
  },
] as const;

export const dashboardTimelineItems = [
  {
    title: "Studio kabuğu",
    meta: "Şimdi",
    description: "Dashboard, modül sayfaları, empty state ve yönlendirme metinleri.",
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
    emptyTitle: "Henüz gerçek proje kaydı yok",
    emptyDescription:
      "Bu sprintte yalnız modül iskeleti hazırlanıyor. Gerçek proje CRUD akışı Supabase kararları netleştiğinde bağlanacak.",
    nextActions: [
      "Proje oluşturma formu",
      "Proje detay ekranı",
      "Public görünürlük kontrolü",
    ],
    previewItems: [
      {
        title: "Kişisel Website",
        meta: "Mock aktif proje",
        description: "Public site ve Studio kabuğunu aynı uygulamada birleştiren ana ürün.",
      },
      {
        title: "İçerik yayın akışı",
        meta: "Mock plan",
        description: "Yazı, proje ve notların public alana kontrollü aktarımı için gelecek çalışma.",
      },
      {
        title: "Studio çekirdeği",
        meta: "Mock hazırlık",
        description: "Projeler, görevler, notlar ve dosyalar için özel çalışma alanı.",
      },
    ],
  },
  tasks: {
    eyebrow: "Görev ve yol haritası",
    title: "Görevler",
    description:
      "Sprint işleri, günlük yapılacaklar, blocker notları ve ilerleyen fazlarda kanban benzeri görev akışı için ayrılan alan.",
    v1Scope: [
      "Görev listesi ve öncelik bilgisi",
      "Bugün / bu hafta ayrımı",
      "Blocker ve handoff takip notları",
    ],
    emptyTitle: "Görevler mock seviyede",
    emptyDescription:
      "Şu an görünen görevler gerçek database kaydı değildir. CRUD, filtre ve kanban kararları sonraki sprintlerde eklenecek.",
    nextActions: [
      "Görev oluşturma",
      "Durum ve öncelik filtresi",
      "Kanban / liste görünümü kararı",
    ],
    previewItems: [
      {
        title: "Login placeholder metnini netleştir",
        meta: "Mock bugün",
        description: "Gerçek auth olmadığı ve MFA'nın sonraki fazda bağlanacağı açıkça anlatılır.",
      },
      {
        title: "Mobil Studio navigasyonu",
        meta: "Mock bugün",
        description: "Sidebar kaybolduğunda erişilebilir modül linkleri görünür kalır.",
      },
      {
        title: "Handoff güncellemesi",
        meta: "Mock kapanış",
        description: "Sprint çıktısı ve bilinçli eksikler entegrasyon ekibine aktarılır.",
      },
    ],
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
      "Bu sayfa not kütüphanesinin yönünü gösterir. Gerçek editör, kayıt ve arama altyapısı sonraki fazda eklenecek.",
    nextActions: [
      "Markdown veya rich text kararının verilmesi",
      "Etiket ve kategori modeli",
      "Nottan yazıya yayın akışı",
    ],
    previewItems: [
      {
        title: "Karar notları",
        meta: "Mock kategori",
        description: "Teknik ve ürün kararlarının kısa gerekçeleriyle saklanacağı alan.",
      },
      {
        title: "İçerik fikirleri",
        meta: "Mock kategori",
        description: "Yazı, video ve proje anlatımı için ham fikirlerin toplanacağı alan.",
      },
      {
        title: "Kaynaklar",
        meta: "Mock kategori",
        description: "Doküman, link ve araştırma notlarının birleştirileceği bölüm.",
      },
    ],
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
    emptyTitle: "Storage entegrasyonu yok",
    emptyDescription:
      "Bu sprintte upload, silme veya gerçek dosya listeleme yapılmaz. Service role veya gizli anahtar kullanılmaz.",
    nextActions: [
      "Storage bucket kararları",
      "Yükleme izinleri ve RLS planı",
      "Dosya önizleme deneyimi",
    ],
    previewItems: [
      {
        title: "PDF arşivi",
        meta: "Mock klasör",
        description: "Proje raporları ve okunabilir doküman çıktıları için ayrılacak alan.",
      },
      {
        title: "Sunumlar",
        meta: "Mock klasör",
        description: "Portföy, okul veya müşteri sunumlarının saklanacağı gelecek bölüm.",
      },
      {
        title: "Görseller",
        meta: "Mock klasör",
        description: "Onaylı portreler ve public içerikle ilişkili görseller için kontrollü arşiv.",
      },
    ],
  },
} as const;
