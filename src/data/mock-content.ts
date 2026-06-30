export type ProjectStatus = "Devam Ediyor" | "Tamamlandı" | "Planlandı";

export type ProjectSummary = {
  slug: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  technologies: string[];
};

export const projects: ProjectSummary[] = [
  {
    slug: "next-ai-dashboard",
    title: "Next AI Dashboard",
    description: "Yapay zekâ destekli veri analizi ve görselleştirme platformu.",
    status: "Devam Ediyor",
    progress: 68,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "flowfit",
    title: "Flowfit",
    description: "Akıllı planlama ve takip deneyimi sunan mobil ürün fikri.",
    status: "Devam Ediyor",
    progress: 54,
    technologies: ["React Native", "Supabase", "TypeScript"],
  },
  {
    slug: "trace-analytics",
    title: "Trace Analytics",
    description: "Gerçek zamanlı log analizi ve sistem izleme aracı.",
    status: "Devam Ediyor",
    progress: 72,
    technologies: ["Next.js", "PostgreSQL", "WebSocket"],
  },
  {
    slug: "orbit-dashboard",
    title: "Orbit Dashboard",
    description: "Modern yönetim paneli bileşenleri ve analiz ekranları.",
    status: "Tamamlandı",
    progress: 100,
    technologies: ["React", "Tailwind CSS", "Chart.js"],
  },
];

export const writings = [
  {
    slug: "yapay-zeka-caginda-yazilim-gelistirici-olmak",
    title: "Yapay Zekâ Çağında Yazılım Geliştirici Olmak",
    excerpt: "Araçlar değişirken geliştiricinin değer üretme biçimini yeniden düşünmek.",
    category: "Yapay Zekâ",
    date: "15 Mayıs 2024",
    readingTime: "6 dk",
  },
  {
    slug: "modern-web-performans-ipuclari",
    title: "Modern Web Uygulamalarında Performans İpuçları",
    excerpt: "Gerçek projelerden ölçüm, optimizasyon ve kullanıcı deneyimi notları.",
    category: "Yazılım",
    date: "28 Nisan 2024",
    readingTime: "8 dk",
  },
  {
    slug: "minimal-tasarimin-gucu",
    title: "Minimal Tasarımın Gücü",
    excerpt: "Daha az arayüzle daha anlaşılır ürün deneyimleri tasarlamak.",
    category: "Ürün",
    date: "14 Nisan 2024",
    readingTime: "5 dk",
  },
];

export const journeyItems = [
  { year: "2019", title: "Yolculuğuma başladım", detail: "Web geliştirmeye merak saldım." },
  { year: "2021", title: "İlk ürünümü yayımladım", detail: "Gerçek kullanıcı geri bildirimleri aldım." },
  { year: "2022", title: "Kendi sistemlerimi kurdum", detail: "Ürün odaklı düşünmeye başladım." },
  { year: "2024", title: "Yapay zekâ odaklı üretim", detail: "Daha akıllı çözümlere yöneldim." },
  { year: "2025", title: "Bağımsız üretime devam", detail: "Projelerimi ve öğrendiklerimi paylaşıyorum." },
];
