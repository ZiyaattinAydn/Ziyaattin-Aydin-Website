# Ziyaattin Aydın

Kişisel web sitem ve proje takip alanım. Yaptığım işleri bir arada tutmak, üzerinde çalıştığım projeleri takip etmek ve zamanla kendi portföyümü oluşturmak için geliştiriyorum.

## Neler var?

**Web sitesi:** Hakkımda, projeler, yazılar ve kariyer yolculuğu sayfaları.

**Studio:** Yalnız doğrulanmış hesabımla açılan yönetim alanı. Proje, görev, özel not ve dosyalarımı yönetebilir; proje ve yazıları önizleyip yayınlayabilirim.

Public sayfalar yalnız yayınlanmış içerikleri gösterir; örnek kayıtlar portföye dahil edilmez. Studio’da proje ve görev takibi, PWA manifesti ve uygulama ikonları hazır. Gerçek biyografi ve portföy içerikleri zamanla eklenecek.

Özel dosyalar `private-files` içinde saklanır; indirme ve önizleme her istekte owner ve MFA denetiminden geçer. Proje/yazı görselleri ayrı `public-assets` alanına açık onayla yüklenir: sayfa taslak olsa da bu görsellerin adresleri herkese açıktır. Yükleme, doğrulama ve kayıt adımları ayrıdır; kesilen yükleme Dosyalar ekranından tekrar tamamlanabilir. Arşivleme dosyayı veya notu silmez.

Telefon kontrolü (fiziksel cihazda ayrıca yapılmalı):

1. Android Chrome ve iPhone Safari'de giriş → TOTP → Studio → çıkış akışını dene. Çıkıştan sonra Geri düğmesi özel içerik göstermemeli.
2. Not editöründe yazı yaz, başka sayfaya geçmeyi dene; kaydedilmeyen değişiklik uyarısını kontrol et.
3. Kendi seçtiğin bir dosyayı yükle, önizle ve indir. Aktarım sırasında bağlantıyı kesip yükleme durumunu kontrol et; mevcut verileri değiştirme.
4. Android menüsünden yükle/ana ekrana ekle, iPhone paylaş menüsünden Ana Ekrana Ekle. İkonu ve yeniden açılışı kontrol et.
5. Uygulamayı arka plana alıp tekrar aç; süresi dolmuş oturumda yeniden giriş gerektiğini doğrula. Çevrimdışı düzenleme yoktur; not/dosya içerikleri localStorage, IndexedDB veya service worker önbelleğine yazılmaz.

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
