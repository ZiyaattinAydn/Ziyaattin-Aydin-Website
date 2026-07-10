<<<<<<< HEAD
# Proje Durumu

Son güncelleme: 2026-07-07

## İşaretler
- `[ ]` Başlamadı
- `[~]` Devam ediyor
- `[x]` Branch içinde tamamlandı
- `[m]` Main'e merge edildi
- `[!]` Blocker / dikkat gerekiyor

## Mevcut Faz

**Faz 2 — Teknik Temel ve Proje İskeleti**

- [x] Proje ana dokümanı PDF olarak hazırlandı
- [x] Next.js + React + TypeScript projesi oluşturuldu
- [x] App Router, Tailwind CSS ve ESLint kuruldu
- [x] Inter ve JetBrains Mono bağlandı
- [x] Palet 2 varsayılan tema token'ları eklendi
- [x] Palet 1 ve Palet 3 alternatif token'ları eklendi
- [x] Public rota iskeletleri oluşturuldu
- [x] Login ve Studio kabuk rotaları oluşturuldu
- [x] Canlı proje takip belgeleri oluşturuldu
- [x] Onaylı tasarım referansları repository'ye eklendi
- [m] Sprint 01 Core Foundation `main`e alındı
- [m] Sprint 01 Public Site `main`e alındı
- [m] Sprint 01 Studio Shell `main`e alındı
- [m] Sprint 01 entegrasyonu ve Studio düzeltmesi `main`e alındı
- [x] Sprint 02 Core Foundation branch içinde tamamlandı
- [!] `npm audit` güncel Next.js bağımlılığında iki orta seviye PostCSS uyarısı gösteriyor; resmi patch takip edilecek
- [x] Yerel bootstrap commit oluşturuldu (`dd8ff0b`)
- [x] Sprint 02 başlangıç `main` commit'i kullanıcı tarafından verilen yerel doğrulama bağlamına göre `62d5227`
- [x] `main` / `origin/main` senkron durumu Sprint 02 başlangıç bağlamına göre güncel
- [!] Sandbox snapshot içinde `.git` metadata bulunmadığı için Git komutları burada tekrar çalıştırılamadı; gerçek worktree'de handoff öncesi `git rev-parse --short HEAD` ile son commit doldurulmalı
- [!] Next.js workspace root uyarısı incelendi; repo içinden `next.config.ts` içinde `turbopack.root: process.cwd()` ayarı eklendi ve build worker sayısı `experimental.cpus: 4` ile sınırlandı. Uyarı devam ederse repo dışındaki `C:\Users\ziyaa\package-lock.json` dosyasının gerekliliği kullanıcı tarafından kontrol edilmeli ve gereksizse silinmeli
- [ ] Vercel preview bağlantısı kurulacak

## Sprint 01 — Core Foundation

- [m] Palet 1, Palet 2 ve Palet 3 token'ları daha düzenli semantik değişkenlerle toparlandı
- [m] Global CSS temel erişilebilirlik, seçim, focus ve responsive overflow kuralları güçlendirildi
- [m] Ortak UI primitive seti genişletildi: `Button`, `LinkButton`, `SectionWrapper`, `EmptyState`, `StatCard`, `StatusBadge`
- [m] Mevcut `Panel`, `Tag` ve `PageIntro` uyumluluğu korunarak küçük geliştirmeler yapıldı
- [m] Public header mobil menü davranışı sade ve erişilebilir şekilde güçlendirildi
- [m] Public footer gerçekliği doğrulanmamış e-posta/GitHub/LinkedIn bilgilerini link olarak uydurmayacak şekilde düzenlendi
- [m] `package-lock.json` içinde özel/internal registry izi aranıp bulunmadı

## Sprint 02 — Core Foundation

- [x] Sprint 01 sonrası main başlangıç commit'i `62d5227` olarak kayda geçirildi
- [x] Next.js 16 yerel dokümanlarında Turbopack filesystem root davranışı incelendi
- [x] Workspace root uyarısı için repo içi çözüm olarak `next.config.ts` içinde `turbopack.root` proje köküne sabitlendi ve build worker sayısı `experimental.cpus: 4` ile sınırlandı
- [x] `package-lock.json`, `package.json` ve varsa `.npmrc` içinde özel/internal registry izi arandı; bulunmadı
- [x] Ortak UI primitive setine `ProgressBar` ve `SectionShell` eklendi
- [x] `src/lib/site-config.ts` içinde metadata, navigation, admin entry, contact ve social alanları daha güvenli yapılandırıldı
- [x] Root metadata `siteConfig` ile tutarlı hâle getirildi
- [x] Footer doğrulanmamış contact/social bilgilerini aktif link gibi göstermeyecek şekilde config tabanlı hale getirildi
- [!] `npm config get registry` bu sandbox ortamında `registry option is protected` hatası verdi; gerçek yerel makinede tekrar doğrulanmalı
- [!] Build sırasında workspace root uyarısının gerçek Windows ortamında kaybolup kaybolmadığı yeniden gözlenmeli; repo dışı `C:\Users\ziyaa\package-lock.json` dosyası uyarının muhtemel sebebidir
- [!] `npm run check` bu sandbox ortamında iç build aşamasında zaman aşımına uğradı; `npm run lint`, `npm run typecheck` ve `npm run build` ayrı ayrı başarıyla tamamlandı

## Sonraki Kilometre Taşı

Sprint 02 Core branch entegrasyonundan sonra Public ve Studio Sprint 02 çalışma hatları güncel `main` üzerinden başlatılacak. Vercel kurulmadığı için Faz 2 tamamen kapanmış sayılmamalı.
=======
# Proje Durumu

Son güncelleme: 2026-07-07

## İşaretler
- `[ ]` Başlamadı
- `[~]` Devam ediyor
- `[x]` Branch içinde tamamlandı
- `[m]` Main'e merge edildi
- `[!]` Blocker / dikkat gerekiyor

## Mevcut Faz

**Faz 2 — Teknik Temel ve Proje İskeleti**

- [x] Proje ana dokümanı PDF olarak hazırlandı
- [x] Next.js + React + TypeScript projesi oluşturuldu
- [x] App Router, Tailwind CSS ve ESLint kuruldu
- [x] Inter ve JetBrains Mono bağlandı
- [x] Palet 2 varsayılan tema token'ları eklendi
- [x] Palet 1 ve Palet 3 alternatif token'ları eklendi
- [x] Public rota iskeletleri oluşturuldu
- [x] Login ve Studio kabuk rotaları oluşturuldu
- [x] Canlı proje takip belgeleri oluşturuldu
- [x] Onaylı tasarım referansları repository'ye eklendi
- [m] GitHub repository oluşturuldu ve yerel `main`, `origin/main` ile senkron doğrulandı
- [m] Bootstrap commit `main` branch'ine gönderildi
- [m] Sprint 01 `feat/core-foundation` branch'i entegrasyon sürecine alındı
- [m] Sprint 01 `feat/public-site` branch'i entegrasyon sürecine alındı
- [m] Sprint 01 `feat/studio-shell` branch'i entegrasyon sürecine alındı
- [m] Sprint 01 Core foundation çalışması `main`e merge edildi
- [m] Sprint 01 Public site çalışması `main`e merge edildi
- [m] Sprint 01 Studio shell çalışması `main`e merge edildi
- [m] Sprint 01 entegrasyonunda `npm run lint`, `npm run typecheck` ve `npm run build` kontrolleri başarılı tamamlandı
- [!] `npm audit` güncel Next.js/PostCSS bağımlılıklarında orta seviye uyarılar gösterebilir; `npm audit fix --force` çalıştırılmayacak, resmi patch takip edilecek
- [!] Core branch içinde yanlışlıkla gelen `dasdasd` dosyası ve encoding bozuk `planlama/g#...` kopyaları entegrasyon aşamasında temizlenmiş olmalı
- [ ] Vercel preview / production deployment doğrulaması henüz tamamlanmadı

## Sprint 01 Entegrasyon Özeti

- Entegrasyon branch'i: `integration/sprint-01`
- Main başlangıç commit'i: `b7255e3`
- Merge sırası:
  1. `feat/core-foundation` (`c27a25d`)
  2. `feat/public-site` (`0c8acac`)
  3. `feat/studio-shell` (`80ef1a1`)
- Public ana menüde Studio görünmemeli; footer'daki küçük yönetici girişi kabul edilebilir.
- Hakkımda portresi doğrulanmış final portre gibi sunulmamalı; aday/doğrulama bekleyen görsel olarak kalmalı.
- Studio hâlâ mock/private çalışma alanı kabuğudur; gerçek Supabase Auth, MFA, PostgreSQL ve Storage sonraki fazlara bırakıldı.

## Studio Sprint 01 — Private Studio Shell

- [x] `/login` placeholder deneyimi Auth + MFA sınırını daha açık anlatacak şekilde iyileştirildi
- [x] `/studio` dashboard mock durum kartları, odak listeleri ve modül kartlarıyla netleştirildi
- [x] `/studio/projects`, `/studio/tasks`, `/studio/notes`, `/studio/files` sayfaları modül amacı, V1 kapsamı, empty state ve sonraki faz aksiyonlarıyla ayrıştırıldı
- [x] Studio shell için masaüstü sidebar korunurken mobil navigasyon görünür hâle getirildi
- [!] Supabase Auth, MFA, database, storage, RLS ve gerçek korumalı route akışı bilinçli olarak uygulanmadı

## Sonraki Kilometre Taşı

Sprint 02 öncesinde orkestrasyon penceresi güncel `main`, bu durum dosyası, `docs/WORKSTREAMS.md`, `CHANGELOG.md` ve son handoff kayıtlarını okuyarak yeni iş paketlerini dağıtacak.

## Public Sprint 02 — 2026-07-07

- [x] Public içerik modeli daha genişletilebilir mock alanlarla düzenlendi.
- [x] Proje ve yazı detay sayfaları mock içerikten beslenen okunabilir bölümlere ayrıldı.
- [x] Gerçek olmayan demo/GitHub/contact linkleri aktif gerçek link gibi sunulmadı.
- [x] Public liste ve detay sayfalarında responsive okunabilirlik iyileştirildi.
>>>>>>> origin/feat/public-site-s02

## Sprint 02 Entegrasyon Özeti

- [m] Sprint 02 Core foundation çalışması `integration/sprint-02` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 02 Public site çalışması `integration/sprint-02` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 02 Studio shell çalışması `integration/sprint-02` üzerinden main'e alınmaya hazırlandı.
- [m] Sprint 02 entegrasyonunda `npm run lint`, `npm run typecheck` ve `npm run build` kontrolleri başarılı tamamlandı.
- [m] Next.js workspace root / multiple lockfile uyarısı Core Sprint 02 sonrası integration build çıktısında görünmedi.
- [!] Vercel preview / production deployment doğrulaması henüz tamamlanmadı.
- [ ] Faz 3 Auth/Supabase/MFA/PostgreSQL/Storage gerçek implementasyonu henüz başlamadı.

## Public Sprint 03 Çıktısı

- [x] Public içerik yayın sözleşmesi `docs/content/PUBLIC_CONTENT_MODEL.md` içinde belgelendi.
- [x] Project, writing, journey ve profile/about içerik tipleri için mock alanlar, gelecekteki database alanları, görünürlük ve Studio publish ilişkisi netleştirildi.
- [x] Public mock içeriklerde `visibility`, `publishState`, `isFeatured`, `sourceNote`, `links.demo` ve `links.github` alanları düzenlendi.
- [x] Gerçek olmayan demo/GitHub/dış kaynak linkleri aktif bağlantı gibi render edilmedi.
- [x] Hakkımda portresi aday/doğrulama bekleyen portre olarak kaldı.
- [!] Gerçek database, Supabase publish akışı ve production içerik yayını bu sprintte başlamadı.
