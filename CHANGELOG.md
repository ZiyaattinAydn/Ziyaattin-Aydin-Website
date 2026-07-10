## Sprint 02 Integration — 2026-07-07

### Added
- Core Sprint 02: `ProgressBar` ve `SectionShell` ortak UI primitive'leri eklendi.
- Studio Sprint 02: mock workflow için `StudioListCard` ve `StudioStatusPill` bileşenleri eklendi.
- Sprint 02 entegrasyon handoff kaydı eklendi: `docs/handoffs/2026-07-07-integration-sprint-02.md`.

### Changed
- Core Sprint 02: `next.config.ts` içinde Turbopack root ayarı proje köküne sabitlendi ve build worker sayısı `experimental.cpus: 4` ile sınırlandı.
- Core Sprint 02: `siteConfig`, layout metadata ve footer doğrulanmamış linkleri aktif göstermeyecek şekilde düzenlendi.
- Public Sprint 02: mock içerik modeli genişletildi; proje ve yazı detay sayfaları mock section verilerinden beslenecek şekilde iyileştirildi.
- Studio Sprint 02: dashboard, proje, görev, not ve dosya modülleri mock workflow verileriyle geliştirildi.

### Fixed
- Workspace root / multiple lockfile build uyarısı integration build çıktısında görünmeyecek şekilde düzeltildi.
- Public branch'teki tracking dosyası whitespace / line-ending uyarıları integration branch üzerinde temizlendi.

### Verified
- `npm run lint`, `npm run typecheck` ve `npm run build` Sprint 02 integration branch üzerinde başarılı tamamlandı.
- Yeni bağımlılık ve yeni environment değişkeni eklenmedi.
- Secret/internal registry kontrolünde `.env.example` dışında gizli dosya ve özel registry kalıntısı bulunmadı.

<<<<<<< HEAD
# Changelog

## Unreleased

### Added
- Vercel Preview / Production doğrulama checklist'i eklendi: `docs/deployment/VERCEL_CHECKLIST.md`
- Environment değişken sözleşmesi eklendi: `docs/deployment/ENVIRONMENT.md`
- `.env.example` içine güvenli placeholder deployment ve Supabase hazırlık değişkenleri eklendi
- Faz 3 öncesi Supabase Auth, MFA, route guard, Storage, RLS ve public publish karar başlıkları karar kaydına eklendi
- Core UI primitive setine `ProgressBar` ve `SectionShell` eklendi
- Next.js 16, React 19, TypeScript ve Tailwind CSS tabanlı başlangıç projesi
- Public, auth ve Studio rota iskeletleri
- Palet 1, Palet 2 ve Palet 3 tema token'ları
- Inter ve JetBrains Mono font altyapısı
- Repository içi proje durumu, çalışma hattı, karar, yol haritası ve handoff belgeleri
- Onaylı tasarım referansları ve portre varlıkları
- Core ortak UI primitive'leri: `Button`, `LinkButton`, `SectionWrapper`, `EmptyState`, `StatCard`, `StatusBadge`
- UI primitive barrel export dosyası: `src/components/ui/index.ts`

### Changed
- Project tracking belgeleri Sprint 03 Core deployment hazırlığına göre güncellendi
- Faz 2 durumu Vercel gerçek doğrulaması beklediği için açık şekilde `[~]` bırakıldı
- `.env.example` service role key'in client tarafında kullanılmaması gerektiğini belirtecek şekilde güçlendirildi
- `siteConfig` metadata, navigation, admin entry, contact ve social alanlarıyla daha güvenli yapılandırıldı
- Root metadata `siteConfig` ile tutarlı hâle getirildi
- Footer doğrulanmamış contact/social bilgilerini aktif link gibi göstermeyecek şekilde config tabanlı hale getirildi
- Next.js workspace root uyarısı için `next.config.ts` içinde Turbopack root proje köküne sabitlendi
- Yerel build worker sayısı `experimental.cpus: 4` ile sınırlandı
- Global tema token'ları Palet 2 varsayılan kalacak şekilde daha okunabilir semantik gruplara ayrıldı
- Global focus, selection, overflow ve reduced-motion kuralları güçlendirildi
- Public header mobil menü ve aktif sayfa erişilebilirliği iyileştirildi
- Public footer doğrulanmamış kişisel linkleri placeholder olarak gösterecek şekilde sadeleştirildi
- `Panel` ve `Tag` bileşenleri geriye uyumlu kalacak şekilde küçük varyant/tone desteği aldı

### Verified
- Sprint 03 başlangıç main commit'i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `e77d2d1` olarak kayda geçirildi
- `npm run lint`, `npm run typecheck` ve `npm run build` bu snapshot üzerinde başarıyla çalıştı
- Build çıktısında workspace root / multiple lockfile uyarısı görünmedi; ilk build için build cache uyarısı ve telemetry bilgilendirmesi görüldü
- `package-lock.json` içinde özel/internal registry izi bulunmadı
- Sprint 02 başlangıç main commit’i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `62d5227` olarak kayda geçirildi
- Next.js 16 yerel dokümanlarında `turbopack.root` davranışı kontrol edildi

### Known Issues
<<<<<<< Updated upstream
- Workspace root uyarısı gerçek Windows ortamında tekrar gözlenmeli; uyarı devam ederse repo dışındaki `C:\Users\ziyaa\package-lock.json` dosyasının gereksiz olup olmadığı kontrol edilmeli
- Snapshot içinde `.git` metadata bulunmadığı için GitHub remote, `main` ↔ `origin/main` senkronu ve gerçek son commit doğrulanamadı
- Bu ortamda `npm config get registry` protected registry hatası verdi
- `npm run check` bu ortamda build aşamasında zaman aşımına uğradı; alt komutlar ayrı ayrı başarılı
=======
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
>>>>>>> origin/feat/public-site-s02
=======
- Vercel Preview / Production gerçek URL üzerinden henüz doğrulanmadıysa deployment tamamlandı sayılmamalı
- `npm audit` iki orta seviye uyarı göstermeye devam ediyor: `next` ve dolaylı `postcss` (`GHSA-qx2v-qp2m-jg93`). `npm audit fix --force` çalıştırılmadı
- Supabase Auth, MFA, PostgreSQL, Storage, RLS ve gerçek route guard henüz başlamadı
- Public ve Studio hâlâ mock veriyle çalışıyor
- Hakkımda portresi ve gerçek iletişim/sosyal linkler kullanıcı onayı olmadan aktif edilmeyecek
- Snapshot içinde `.git` metadata bulunmadığı için GitHub remote, `main` ↔ `origin/main` senkronu ve gerçek son commit sandbox içinde doğrulanamadı
>>>>>>> Stashed changes
