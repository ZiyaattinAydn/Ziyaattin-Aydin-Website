export type ProjectStatus = "Devam Ediyor" | "Tamamlandı" | "Planlandı";

export type ProjectLink = {
  label: string;
  href: string | null;
  note: string;
  disabledLabel: string;
};

export type ProjectMilestone = {
  label: string;
  detail: string;
};

export type ProjectSummary = {
  slug: string;
  title: string;
  description: string;
  status: ProjectStatus;
  statusLabel: string;
  progress: number;
  category: string;
  timeframe: string;
  contentState: string;
  visibilityNote: string;
  technologies: string[];
  summary: string;
  problem: string;
  approach: string;
  highlights: string[];
  technicalNotes: string[];
  milestones: ProjectMilestone[];
  learnings: string[];
  nextSteps: string[];
  publicNotes: string[];
  links: ProjectLink[];
};

export type WritingSection = {
  id: string;
  title: string;
  paragraphs: string[];
  quote?: string;
  code?: string;
  codeLanguage?: string;
};

export type WritingSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  updatedLabel: string;
  readingTime: string;
  sortOrder: number;
  coverLabel: string;
  isDraft: boolean;
  placeholderNote: string;
  sections: WritingSection[];
  relatedSlugs: string[];
};

export type JourneyItem = {
  marker: string;
  title: string;
  detail: string;
  lesson: string;
  statusNote: string;
  relatedProjectSlug?: string;
  relatedWritingSlug?: string;
};

export const projects: ProjectSummary[] = [
  {
    slug: "next-ai-dashboard",
    title: "Next AI Dashboard",
    description: "Yapay zekâ destekli veri analizi ve görselleştirme fikri için geçici public proje kaydı.",
    status: "Devam Ediyor",
    statusLabel: "Mock geliştirme akışı",
    progress: 68,
    category: "Yapay Zekâ",
    timeframe: "Sprint mock kaydı",
    contentState: "Public taslak",
    visibilityNote: "Gerçek demo, GitHub veya ürün bağlantısı kullanıcı onayından sonra aktifleşecek.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    summary:
      "Bu kayıt, ileride Studio içinden public siteye yayımlanacak gerçek proje içeriğinin nasıl görüneceğini test etmek için tutuluyor.",
    problem:
      "Karmaşık verileri tek bakışta anlaşılır hâle getiren, sade ve güvenilir bir dashboard deneyimi kurgulamak gerekiyor.",
    approach:
      "Önce küçük bir mock veri modeliyle sayfa mimarisi, kart düzeni ve detay anlatımı netleştiriliyor; gerçek entegrasyon sonraki fazlara bırakılıyor.",
    highlights: [
      "Liste ve detay sayfası aynı mock modelden beslenir.",
      "Public bağlantılar doğrulanmadan aktif link gibi gösterilmez.",
      "Progress değeri gerçek ürün metriği değil, arayüz davranışını test eden örnek veridir.",
    ],
    technicalNotes: [
      "Detay sayfasında gerçek link uydurmadan yalnız public-safe bilgiler gösterilecek.",
      "Kartlar mobilde tek sütuna düşecek ve yatay taşma üretmeyecek.",
      "Studio publish modeli netleşince bu yapı gerçek veri alanlarıyla eşlenecek.",
    ],
    milestones: [
      { label: "İskelet", detail: "Liste ve detay sayfası okunabilir hâle getirildi." },
      { label: "Mock model", detail: "Problem, yaklaşım, kararlar ve sonraki adımlar alanları ayrıldı." },
      { label: "Gerçek veri", detail: "Studio yayın akışı hazır olduğunda gerçek içerikle değiştirilecek." },
    ],
    learnings: [
      "Public detay sayfasında link yoksa buton yerine açıklama göstermek daha güvenli.",
      "Mock içerik ile gerçek başarı iddiası arasındaki ayrım arayüzde açık olmalı.",
    ],
    nextSteps: [
      "Gerçek demo ve GitHub bağlantısı kullanıcı tarafından onaylandığında eklemek.",
      "Studio tarafındaki publish alanları netleşince mock modeli gerçek modele yaklaştırmak.",
      "Proje galerisi için yalnız public işaretli medya alanı eklemek.",
    ],
    publicNotes: [
      "Bu proje kaydı gerçek link veya canlı ürün iddiası içermez.",
      "Metinler Sprint 02 için geçici örnek içeriktir.",
    ],
    links: [
      {
        label: "Canlı Önizleme",
        href: null,
        note: "Henüz public/demo bağlantısı tanımlanmadı.",
        disabledLabel: "Yakında",
      },
      {
        label: "GitHub",
        href: null,
        note: "Repository bağlantısı kullanıcı onayından sonra eklenecek.",
        disabledLabel: "Doğrulama bekliyor",
      },
    ],
  },
  {
    slug: "flowfit",
    title: "Flowfit",
    description: "Akıllı planlama ve takip deneyimi için tasarlanan mobil ürün fikri.",
    status: "Planlandı",
    statusLabel: "Keşif ve kapsam aşaması",
    progress: 32,
    category: "Mobil Ürün",
    timeframe: "Mock keşif aşaması",
    contentState: "Fikir taslağı",
    visibilityNote: "Mağaza, demo veya kaynak kod bağlantısı gerçek ürün olmadan eklenmeyecek.",
    technologies: ["React Native", "Supabase", "TypeScript"],
    summary:
      "Flowfit, kişisel planlama ve alışkanlık takibi akışını daha sade bir mobil deneyime dönüştürme fikrini temsil eden placeholder projedir.",
    problem:
      "Planlama uygulamaları çoğu zaman fazla karmaşık kalıyor; kullanıcı hızlıca ne yapacağını ve nerede kaldığını görmek istiyor.",
    approach:
      "Önce çekirdek ekranlar ve bilgi mimarisi üzerinden ilerleyen, sonra gerçek kullanıcı senaryolarıyla genişleyen bir yapı planlanıyor.",
    highlights: [
      "Mobil öncelikli public anlatım test ediliyor.",
      "Özellik listesi tamamlanmış ürün gibi değil, plan notu gibi sunuluyor.",
      "Gerçek ekran görüntüsü olmadan galeri veya mağaza linki gösterilmiyor.",
    ],
    technicalNotes: [
      "Mobil öncelikli tasarım dili korunacak.",
      "Kimlik doğrulama ve veri saklama sonraki fazlarda değerlendirilecek.",
      "Public sayfada yalnız ürün fikri ve geliştirme notları gösterilecek.",
    ],
    milestones: [
      { label: "Keşif", detail: "Problem alanı ve hedef akışlar mock olarak yazıldı." },
      { label: "MVP", detail: "Ekran öncelikleri ve veri modeli sonraki sprintlerde netleşecek." },
      { label: "Yayın", detail: "Canlı mağaza linkleri gerçek ürün olmadan eklenmeyecek." },
    ],
    learnings: [
      "Mobil ürünlerde kapsamı küçük tutmak sürdürülebilirliği artırır.",
      "Public anlatımda planlanan özellik ile tamamlanmış özellik ayrımı net olmalı.",
    ],
    nextSteps: [
      "Temel kullanıcı akışını kartlar hâlinde belgelemek.",
      "Gerçek ekran görselleri hazır olana kadar mock galeri göstermemek.",
    ],
    publicNotes: ["Bu kayıt planlama aşamasını göstermek için mock seviyesinde tutuluyor."],
    links: [
      {
        label: "Ürün Linki",
        href: null,
        note: "Henüz yayınlanmış public ürün bağlantısı yok.",
        disabledLabel: "Yayınlanmadı",
      },
      {
        label: "Kaynak Kod",
        href: null,
        note: "Public repository bilgisi tanımlanmadı.",
        disabledLabel: "Beklemede",
      },
    ],
  },
  {
    slug: "trace-analytics",
    title: "Trace Analytics",
    description: "Log analizi ve sistem izleme ekranları için public arayüz denemesi.",
    status: "Devam Ediyor",
    statusLabel: "Arayüz prototipi",
    progress: 54,
    category: "Sistem Tasarımı",
    timeframe: "Mock prototip",
    contentState: "Public-safe anlatım",
    visibilityNote: "Gerçek sistem metrikleri, loglar veya private veri public sayfaya taşınmayacak.",
    technologies: ["Next.js", "PostgreSQL", "WebSocket"],
    summary:
      "Trace Analytics, sistem olaylarını okunabilir kartlara ve zaman çizelgelerine dönüştüren bir arayüz fikrini anlatmak için kullanılıyor.",
    problem:
      "Teknik log kayıtları geliştirici dışındaki kişiler için hızlıca anlaşılabilir değildir.",
    approach:
      "Kritik olayları sade kartlar, filtrelenebilir durumlar ve özet panellerle anlatan bir deneyim tasarlanıyor.",
    highlights: [
      "Gerçek veri bağlantısı kurulmadan yalnız arayüz dili test edilir.",
      "Private log içeriği yerine temsili açıklama alanları kullanılır.",
      "Detay sayfası teknik notları kısa listelerle görünür kılar.",
    ],
    technicalNotes: [
      "Gerçek zamanlı veri akışı bu sprintte kurulmadı.",
      "Mock veriler public sayfa davranışını test etmek için yeterli tutuldu.",
      "Filtre ve sıralama deneyimi public component içinde izole edildi.",
    ],
    milestones: [
      { label: "Liste", detail: "Public proje kartlarında durum, kategori ve progress görünür oldu." },
      { label: "Detay", detail: "Teknik kararlar ve öğrenilenler ayrı bloklara taşındı." },
      { label: "Entegrasyon", detail: "Gerçek veri bağlantısı Studio/Supabase fazından sonra planlanacak." },
    ],
    learnings: [
      "Teknik içeriği sade başlıklarla bölmek okunabilirliği artırır.",
      "Mock metrikler gerçek izleme verisi gibi sunulmamalı.",
    ],
    nextSteps: [
      "Örnek olay kartları için public-safe veri modeli eklemek.",
      "Gerçek görsel veya ekran görüntüsü yalnız onaylandığında kullanmak.",
    ],
    publicNotes: ["Ekrandaki metrikler gerçek sistem verisi değildir."],
    links: [
      {
        label: "Demo",
        href: null,
        note: "Demo URL henüz paylaşılmadı.",
        disabledLabel: "Yakında",
      },
      {
        label: "GitHub",
        href: null,
        note: "Public kaynak bağlantısı henüz yok.",
        disabledLabel: "Doğrulama bekliyor",
      },
    ],
  },
  {
    slug: "orbit-dashboard",
    title: "Orbit Dashboard",
    description: "Yönetim paneli bileşenlerini ve analiz kartlarını deneyen tamamlanmış mock çalışma.",
    status: "Tamamlandı",
    statusLabel: "Mock kapanış kaydı",
    progress: 100,
    category: "Web",
    timeframe: "Mock tamamlandı",
    contentState: "Örnek sunum",
    visibilityNote: "Tamamlandı etiketi gerçek müşteri işi veya canlı ürün iddiası değildir.",
    technologies: ["React", "Tailwind CSS", "Chart.js"],
    summary:
      "Orbit Dashboard, public proje kartlarının tamamlanmış iş durumunu nasıl göstereceğini test etmek için kullanılan örnek kayıttır.",
    problem:
      "Admin panellerinde yoğun bilgiyi düzenli ve hızlı taranabilir bir yapıya taşımak gerekir.",
    approach:
      "Kart tabanlı grid, kısa metrikler ve sade etiketlerle bilgi yoğunluğu kontrol altında tutuldu.",
    highlights: [
      "Tamamlandı durumu progress değeriyle tutarlı görünür.",
      "Gerçek grafik bağımlılığı eklenmeden layout davranışı test edilir.",
      "Link alanları doğrulanmış bilgi yoksa pasif kalır.",
    ],
    technicalNotes: [
      "Tamamlandı durumu progress değeriyle birlikte gösteriliyor.",
      "Gerçek grafik bağımlılığı eklenmedi; görsel anlatım CSS bloklarıyla sınırlı.",
      "Public detay sayfası mock içerik notunu koruyor.",
    ],
    milestones: [
      { label: "Kartlar", detail: "Durum ve teknoloji etiketleri okunabilir hâle getirildi." },
      { label: "Detay", detail: "Özet, problem ve yaklaşım alanları ayrıştırıldı." },
      { label: "Kapanış", detail: "Gerçek link tanımlanana kadar link alanları pasif bırakıldı." },
    ],
    learnings: [
      "Tamamlanmış görünen mock projelerde gerçek kanıt/link uydurmamak gerekir.",
      "Detay sayfasında kısa bloklar uzun paragraflardan daha rahat okunuyor.",
    ],
    nextSteps: [
      "Gerçek proje ekran görüntüsü varsa public-safe galeriye eklemek.",
      "Canlı link bilgisi doğrulanırsa bağlantı alanını aktif yapmak.",
    ],
    publicNotes: ["Bu tamamlandı durumu gerçek müşteri işi iddiası değildir; mock sunum verisidir."],
    links: [
      {
        label: "Canlı Önizleme",
        href: null,
        note: "Doğrulanmış link bulunmuyor.",
        disabledLabel: "Pasif",
      },
      {
        label: "Kaynak",
        href: null,
        note: "Public kaynak kod bağlantısı eklenmedi.",
        disabledLabel: "Beklemede",
      },
    ],
  },
];

export const writings: WritingSummary[] = [
  {
    slug: "yapay-zeka-caginda-yazilim-gelistirici-olmak",
    title: "Yapay Zekâ Çağında Yazılım Geliştirici Olmak",
    excerpt: "Araçlar değişirken geliştiricinin değer üretme biçimini yeniden düşünmek için geçici makale taslağı.",
    category: "Yapay Zekâ",
    tags: ["AI", "Yazılım", "Ürün düşüncesi"],
    date: "Mock tarih",
    updatedLabel: "Sprint 02 taslak güncellemesi",
    readingTime: "6 dk",
    sortOrder: 3,
    coverLabel: "AI / DEV",
    isDraft: true,
    placeholderNote: "Bu yazı gerçek yayınlanmış blog içeriği değil; makale düzenini test eden mock taslaktır.",
    sections: [
      {
        id: "donusum",
        title: "Araçlar değişirken rolü yeniden okumak",
        paragraphs: [
          "Bu yazı, ileride gerçek içerikle değiştirilecek mock bir public yazı örneğidir. Amaç, yazı detay sayfasının okunabilirliğini ve içerik bloklarını test etmektir.",
          "Yapay zekâ destekli araçlar kod üretimini hızlandırabilir; buna rağmen ürünün neden var olduğunu, hangi problemi çözdüğünü ve nasıl sürdürülebilir kalacağını hâlâ geliştirici belirler.",
        ],
        quote: "Mock içerik: Buradaki yorumlar gerçek deneyim iddiası değil, sayfa yapısını test eden geçici metinlerdir.",
      },
      {
        id: "yetkinlikler",
        title: "Yeni yetkinlik: bağlam kurmak",
        paragraphs: [
          "Bir fikri değere dönüştürmek; problemi parçalara ayırmayı, doğru kısıtları seçmeyi ve kullanıcıya net bir akış sunmayı gerektirir.",
          "Bu yüzden public yazı şablonu uzun satırları sınırlayan, kod bloklarını taşırmayan ve mobilde okunabilir kalan bir makale düzeniyle hazırlanır.",
        ],
        codeLanguage: "TypeScript",
        code: "const value = understand(problem)\n  .designSmall()\n  .shipSafely()\n  .learnAgain();",
      },
      {
        id: "sonuc",
        title: "Sonuç",
        paragraphs: [
          "Gerçek yazılar Studio yayın akışı hazırlandığında bu mock alanların yerine geçecek. Şimdilik hedef, ziyaretçinin sayfada neyi nerede bulacağını rahatça anlamasıdır.",
        ],
      },
    ],
    relatedSlugs: ["modern-web-performans-ipuclari", "minimal-tasarimin-gucu"],
  },
  {
    slug: "modern-web-performans-ipuclari",
    title: "Modern Web Uygulamalarında Performans İpuçları",
    excerpt: "Ölçüm, sadeleştirme ve kullanıcı deneyimi odağında hazırlanmış geçici performans notları.",
    category: "Yazılım",
    tags: ["Web", "Performans", "UX"],
    date: "Mock tarih",
    updatedLabel: "Sprint 02 taslak güncellemesi",
    readingTime: "8 dk",
    sortOrder: 2,
    coverLabel: "WEB / PERF",
    isDraft: true,
    placeholderNote: "Performans örnekleri gerçek ölçüm sonucu değil, yazı detay sayfasının yapısını test eden geçici içeriktir.",
    sections: [
      {
        id: "olcum",
        title: "Önce neyi ölçtüğünü bil",
        paragraphs: [
          "Performans iyileştirmesi, yalnızca daha az kod yazmak değildir. Önce darboğazın nerede olduğunu görmek ve kullanıcı etkisini anlamak gerekir.",
          "Bu mock yazı, detay sayfasında başlık, paragraf, kod ve ilgili yazılar düzeninin nasıl görüneceğini göstermek için tutulur.",
        ],
      },
      {
        id: "sadelik",
        title: "Sade arayüz daha hızlı anlaşılır",
        paragraphs: [
          "Gereksiz hareket, ağır görsel ve karmaşık grid kararları özellikle mobil deneyimde hissedilir. Bu public sprintte kontrollü hover ve sade kart yapısı tercih edildi.",
        ],
        codeLanguage: "TypeScript",
        code: "const page = keepLayoutSimple({\n  content: 'readable',\n  motion: 'controlled',\n});",
      },
      {
        id: "sonuc",
        title: "Sonuç",
        paragraphs: ["Gerçek performans notları eklendiğinde bu alan ölçüm sonuçları ve örneklerle genişletilebilir."],
      },
    ],
    relatedSlugs: ["yapay-zeka-caginda-yazilim-gelistirici-olmak", "minimal-tasarimin-gucu"],
  },
  {
    slug: "minimal-tasarimin-gucu",
    title: "Minimal Tasarımın Gücü",
    excerpt: "Daha az arayüzle daha anlaşılır ürün deneyimleri tasarlamaya dair mock ürün yazısı.",
    category: "Ürün",
    tags: ["Tasarım", "Okunabilirlik", "Ürün"],
    date: "Mock tarih",
    updatedLabel: "Sprint 02 taslak güncellemesi",
    readingTime: "5 dk",
    sortOrder: 1,
    coverLabel: "UX / MIN",
    isDraft: true,
    placeholderNote: "Bu içerik gerçek kişisel deneyim iddiası taşımaz; ürün yazısı düzenini test eden mock metindir.",
    sections: [
      {
        id: "odak",
        title: "Odak, tasarımın en güçlü parçasıdır",
        paragraphs: [
          "Minimal tasarım boş bırakılmış ekran değildir; ziyaretçinin neye bakacağını, neyi okuyacağını ve nereye gideceğini netleştiren kararlardır.",
          "Bu yazı da gerçek kişisel deneyim iddiası taşımadan, public makale düzenini test eden geçici bir içeriktir.",
        ],
      },
      {
        id: "hiyerarsi",
        title: "Hiyerarşi kurmak",
        paragraphs: ["Başlık, açıklama, meta bilgi ve aksiyonlar arasındaki mesafe doğru kurulduğunda sayfa daha sakin ve güvenilir hissettirir."],
        quote: "Az öğe kullanmak değil, doğru öğeyi doğru yerde kullanmak önemlidir.",
      },
      {
        id: "sonuc",
        title: "Sonuç",
        paragraphs: ["Public site gerçek içerikle büyüdükçe bu sade yapı korunduğu sürece sayfalar okunabilir kalır."],
      },
    ],
    relatedSlugs: ["modern-web-performans-ipuclari", "yapay-zeka-caginda-yazilim-gelistirici-olmak"],
  },
];

export const journeyItems: JourneyItem[] = [
  {
    marker: "Aşama 01",
    title: "Merak ve keşif",
    detail: "Gerçek zaman çizelgesi kullanıcı tarafından netleşene kadar bu alan mock yolculuk verisi olarak tutulur.",
    lesson: "Öğrenme yolculuğunu küçük ve takip edilebilir parçalara bölmek.",
    statusNote: "Gerçek tarih bekliyor",
    relatedWritingSlug: "minimal-tasarimin-gucu",
  },
  {
    marker: "Aşama 02",
    title: "İlk ürün iskeletleri",
    detail: "Public site; proje, yazı ve yolculuk kayıtlarını düzenli gösterecek temel yüzeyi hazırlar.",
    lesson: "İskelet doğru kurulursa gerçek içerik eklemek daha güvenli olur.",
    statusNote: "Mock kayıt",
    relatedProjectSlug: "orbit-dashboard",
  },
  {
    marker: "Aşama 03",
    title: "Sistemli çalışma",
    detail: "Studio ve public site ayrımı, hangi içeriğin dışarı açılacağını kontrollü yönetmek için planlanır.",
    lesson: "Public görünen bilgi ile private çalışma notlarını ayırmak gerekir.",
    statusNote: "Yayın akışı planı",
    relatedProjectSlug: "next-ai-dashboard",
  },
  {
    marker: "Aşama 04",
    title: "Yayınlanabilir anlatım",
    detail: "Projeler ve yazılar, gerçek link uydurmadan, yalnız onaylı bilgilerle public sayfaya taşınacak.",
    lesson: "Eksik bilgiyi gizlemek yerine placeholder olduğunu açıkça söylemek güven verir.",
    statusNote: "Doğrulama bekliyor",
    relatedWritingSlug: "yapay-zeka-caginda-yazilim-gelistirici-olmak",
  },
];
