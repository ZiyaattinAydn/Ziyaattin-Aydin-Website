## [Unreleased]

### Changed
- Public Sprint 02: mock içerik modeli genişletildi, proje/yazı detayları mock section verilerinden beslendi ve sahte demo/GitHub linkleri pasif/yakında durumuna alındı.

# Changelog

## Unreleased

### Added
- Studio shell için mobilde görünür navigasyon ve aktif route vurgusu
- Studio dashboard için mock durum kartları, odak listeleri ve modül kartları
- Studio projeler, görevler, notlar ve dosyalar sayfaları için modül amacı, V1 kapsamı ve empty state bileşenleri
- Login sayfasında Auth + MFA entegrasyonunun sonraki fazda bağlanacağını açıkça anlatan placeholder deneyimi
- Next.js 16, React 19, TypeScript ve Tailwind CSS tabanlı başlangıç projesi
- Public, auth ve Studio rota iskeletleri
- Palet 1, Palet 2 ve Palet 3 tema token'ları
- Inter ve JetBrains Mono font altyapısı
- Repository içi proje durumu, çalışma hattı, karar, yol haritası ve handoff belgeleri
- Onaylı tasarım referansları ve portre varlıkları
- Core ortak UI primitive'leri: `Button`, `LinkButton`, `SectionWrapper`, `EmptyState`, `StatCard`, `StatusBadge`
- Public proje ve yazı listeleme deneyimi için arama, filtreleme, sıralama ve boş durum bileşenleri
- Public proje/yazı detay sayfaları için genişletilmiş mock içerik modeli
- Studio dashboard ve modül sayfaları için mock içerik, status card, module card, empty state ve scope list bileşenleri
- Sprint 01 entegrasyon handoff kaydı: `docs/handoffs/2026-07-07-integration-sprint-01.md`

### Changed
- Global tema token'ları Palet 2 varsayılan olacak şekilde semantik gruplarla düzenlendi
- Global CSS erişilebilirlik, focus görünürlüğü, selection, overflow ve reduced motion kurallarıyla güçlendirildi
- Public header mobil menü, `aria-current`, `aria-expanded` ve klavye odak durumlarıyla iyileştirildi
- Public footer, doğrulanmamış e-posta/GitHub/LinkedIn bilgilerini gerçek link gibi göstermeyecek şekilde düzenlendi
- Ana sayfa hero, öne çıkan projeler/yazılar, dijital pano ve yolculuk özetiyle genişletildi
- Projeler, yazılar, yolculuğum ve hakkımda sayfaları daha okunabilir mock yayın iskeletine getirildi
- `/login` sayfası gerçek auth uygulanmadan güvenli alan placeholder'ı olarak yeniden düzenlendi
- `/studio` ve alt modül sayfaları backend olmadan anlaşılır mock workflow kabuğuna dönüştürüldü
- Takip belgeleri Sprint 01 entegrasyon durumuna göre güncellendi

### Fixed
- Public tarafında bilinmeyen proje ve yazı slug'ları için `notFound()` davranışı korunarak detay sayfaları genişletildi
- Hakkımda portresi doğrulanmış final portre gibi sunulmayacak şekilde aday/doğrulama bekleyen görsel olarak konumlandırıldı
- Studio linklerinin public ana menüde görünmemesi kararı korundu
- Core branch içinde yanlışlıkla gelen `dasdasd` dosyası ve encoding bozuk planlama kopyaları entegrasyon aşamasında temizlendi

### Verified
- `origin/main` ile yerel `main` senkron durumu entegrasyon öncesi doğrulandı
- `origin/feat/core-foundation`, `origin/feat/public-site` ve `origin/feat/studio-shell` remote branch'leri doğrulandı
- Üç branch için `git diff --check` temiz doğrulandı
- Özel/internal npm registry kalıntısı aranıp bulunmadı
- `.env.example` dışında gizli environment dosyası tespit edilmedi
- Sprint 01 entegrasyonunda `npm run lint`, `npm run typecheck` ve `npm run build` başarılı tamamlandı
