# Ziyaattin Aydın

Kişisel web sitem ve proje takip alanım. Yaptığım işleri bir arada tutmak, üzerinde çalıştığım projeleri takip etmek ve zamanla kendi portföyümü oluşturmak için geliştiriyorum.

## Neler var?

**Web sitesi:** Hakkımda, projeler, yazılar ve kariyer yolculuğu sayfaları.

**Studio:** Sadece benim giriş yapabildiğim yönetim alanı. Proje ve görev takibi çalışıyor; notlar ve dosya yönetimi sırada.

Site henüz tamamlanmadı. Özellikle portföy içeriklerinin bir kısmı örnek verilerden geliyor. Studio'yu ve kişisel sitemi aynı sistemden yönetmek, daha sonra da telefona kurulabilen bir PWA olarak kullanmak istiyorum.

## Kullandığım teknolojiler

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase ve Vercel.

## Yerel kurulum

Node.js 22.x gerekiyor.

```bash
git clone https://github.com/ZiyaattinAydn/Ziyaattin-Aydin-Website.git
cd Ziyaattin-Aydin-Website
npm ci
cp .env.example .env.local
npm run dev
```

Supabase bağlantısı için `.env.local` içindeki geliştirme ortamı değerlerini doldurmak gerekiyor. Anahtarları repoya eklemeyin.

```bash
npm test
npm run check
```

## Proje notları

- [Şu anki durum](docs/PROJECT_STATUS.md)
- [Yapılacaklar](docs/ROADMAP.md)
- [Mimari](docs/ARCHITECTURE.md)
- [Geliştirme düzeni](CONTRIBUTING.md)

Tasarım referansları ve başlangıçta hazırladığım [proje dokümanı](docs/kisisel-sistemim-proje-ana-dokumani.pdf) da depoda duruyor.
