## Sprint 07 Public Project Reads — 2026-07-14

### Added

- Core server Supabase client'ını mevcut `PublicQueryReader` sözleşmesine bağlayan server-only reader.
- Project repository request/mapping/visibility/unavailable testleri.
- Hosted development Supabase anonymous read verifier.
- Project route generic unavailable error boundary.
- Development Supabase verification runbook ve Sprint 07 Public handoff.

### Changed

- `/projects` ve `/projects/[slug]` local development/Preview için kontrollü project-only Supabase source kullanabilir.
- Projects list route request-time dynamic çalışır ve database unavailable durumunda ayrıntı sızdırmayan nötr state gösterir.
- Production source ve project env eksikliği mock davranışını korur.
- General Public repository; writings, journey, profile/about ve production için mock-first kalır.

### Security

- Anonymous project read `visibility = public`, `publish_state = published` ve `published_at IS NOT NULL` filtrelerini korur.
- Explicit project kolon listeleri kullanılır; `owner_id`, internal timestamps/notes ve `select *` yoktur.
- Service role kullanılmaz.
- Link URL'leri yalnız approved ve HTTP/HTTPS ise DTO'ya girer.
- Project image alt/public approval şeması tamamlanmadığı için image render edilmez.
- Query/database hata ayrıntıları Public UI'ya taşınmaz.

### Verified

- Hosted development anonymous project verifier: `PUBLIC_PROJECT_HOSTED_READ_OK`.
- Published/public project list ve detail okunabildi.
- Draft/private negative slug public read sınırının dışında kaldı.
- Verification kaydı hard delete edilmeden `archived + private` durumuna getirildi.
- Cleanup sonrası anonymous project sorgusu boş döndü.
- Public policy tests: 8/8.
- Project repository tests: 14/14.
- `npm run test:supabase`, lint ve typecheck başarılı.
- Gerçek `.env.local` geçici olarak kaldırılarak env'siz production build başarılı.
- Audit sonucu bilinen 2 moderate `next` / dolaylı `postcss` advisory'sidir; force fix uygulanmadı.
- Secret, tracked env, `select *` ve scope taramaları temiz.

### Deferred to Integration

- Vercel Preview Supabase source ve project list/detail kabulü, branch'ler birleştirildikten sonra Integration aşamasında çalıştırılacak.
- Public implementation commit'i origin branch'e pushlandı.

### Not Applied

- Production Supabase veya Public production cutover
- Project mutation veya Studio UI
- Writings/journey/profile cutover
- Storage, hard delete, slug history, PWA veya package upgrade

## Sprint 06 Integration — 2026-07-10

Marker: `S06_INTEGRATION_CHANGELOG`

- Core Supabase runtime, Public repository adapter ve Studio Auth/TOTP/AAL2 branch'leri kontrollü sırayla birleştirildi.
- Tracking conflict'leri Core, Public ve Studio kayıtları korunarak çözüldü.
- Hosted development Supabase kabul sonuçları integration kayıtlarına işlendi.
- Public policy testleri 7/7, Studio verifier'ları, lint, typecheck ve env'siz production build başarılıdır.
- Owner identity literal'i verifier betiklerinden kaldırıldı.
- Audit sonucu bilinen 2 moderate advisory'dir; breaking `npm audit fix --force` uygulanmadı.
- Integration branch main onay kapısına hazırdır.

## Sprint 06 Public — 2026-07-10

### Added

- Public projects, writings, journey ve profile için ortak repository interface'i.
- Mevcut mock veriyi repository arkasına alan adapter.
- Core-owned client için dependency-free `PublicQueryReader` sınırı.
- Explicit select listeleri ve public-safe Supabase row mapper.
- Visibility, approval, source selection ve URL güvenliği policy testleri.
- Public repository implementasyon sözleşmesi ve branch handoff kaydı.

### Changed

- Public route ve component'lerin doğrudan mock veri import'ları kaldırıldı.
- Detail lookup repository üzerinden yapılarak görünmeyen kayıtlar tek `notFound()` sınırına taşındı.
- Candidate About portrait production render verisinden çıkarıldı.
- Empty list/featured durumları nötr ve erişilebilir fallback ile ele alındı.
- Production content source Sprint 06 boyunca mock'a sabitlendi.

### Security

- Anonymous adapter filtreleri `visibility = public`, `publish_state = published` ve `published_at IS NOT NULL` olarak açıkça uygulandı.
- `select *` kullanılmadı.
- Onaysız/geçersiz link ve asset URL'leri Public DTO'ya taşınmıyor.
- Database hata ayrıntıları client'a yansıtılmıyor.
- Gerçek secret, Supabase URL/key veya JWT eklenmedi.

### Verified

- `npm ci`: başarılı; package dosyaları değişmedi.
- Node built-in policy tests: 7/7 başarılı.
- `npm run lint`: başarılı.
- `npm run typecheck`: başarılı.
- `npm run build`: başarılı; 14/14 static page üretildi ve dynamic detail rotaları korundu.
- Doğrudan Public route/component mock import kontrolü temiz.
- `select *` kontrolü temiz.
- Secret taraması yalnız boş placeholder, dokümantasyon, package-lock integrity ve binary eşleşmeleri gösterdi.
- Yeni dependency eklenmedi.

### Known Audit Status

- `npm audit`: 2 moderate vulnerability.
- Etkilenen zincir mevcut `next` → dolaylı `postcss` bağımlılığıdır.
- Önerilen `npm audit fix --force`, breaking `next@9.3.3` değişimi yaptığı için uygulanmadı.

### Pending

- Branch push sonrası Vercel Preview Deployment

### Not Applied

- Production Supabase cutover yapılmadı.
- Gerçek environment değeri eklenmedi.
- Core Supabase helper/client kopyalanmadı veya merge edilmedi.
- SQL, Auth, MFA, Studio CRUD, publish editor ve slug history uygulanmadı.


## Sprint 06 Core Supabase Runtime — 2026-07-10

### Added

- `@supabase/supabase-js@2.110.2` ve `@supabase/ssr@0.12.0`.
- Lazy Supabase environment validation ve generic fail-closed configuration error.
- Browser, request-scoped server ve Proxy cookie refresh client factory'leri.
- Next.js 16 `src/proxy.ts` ile `/login` ve `/studio/**` erken yönlendirme/session refresh sınırı.
- Güvenli internal redirect helper'ı.
- Trusted Auth user, active owner profile ve current `aal2` Studio authorization helper'ları.
- Environment, redirect, AAL, owner ve browser secret-boundary kontrolleri için `test:supabase`.

### Changed

- Canonical public key environment adı `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` oldu.
- Public mock build Supabase env olmadan çalışmaya devam eder.
- Auth ve Studio rotaları Supabase env eksikken fail closed davranır.
- Sprint 06 karar kapısı Singapore development region ve ayrık development/production modeliyle onaylandı.

### Verified

- `npm ci`
- `npm run test:supabase`
- `npm run lint`
- `npm run typecheck`
- Supabase env olmadan `npm run build`
- Gerçek Supabase URL, key, JWT, password veya owner UUID repository'ye eklenmedi.

### Known Issues

- `npm audit` iki moderate vulnerability gösteriyor.
- Advisory: `GHSA-qx2v-qp2m-jg93`.
- Önerilen force fix Next.js'i kırıcı biçimde geriye düşürdüğü için `npm audit fix --force` çalıştırılmadı.

### Not Applied

- Supabase Dashboard project oluşturma
- SQL migration ve development seed
- Owner Auth kullanıcı oluşturma
- Login/TOTP UI ve Studio layout entegrasyonu
- CRUD, Storage upload ve Public database cutover
- Production Supabase environment veya migration

## Sprint 05 Integration — 2026-07-10

### Added

- Supabase mimari, environment, server/client boundary, session/guard ve migration runbook belgeleri.
- Public database mapping, visibility, query, fallback, approval ve mock migration sözleşmeleri.
- Initial schema, database function/trigger, RLS ve Storage migration paketi.
- Development seed template ve veri kaybı uyarılı destructive rollback.
- Sprint 05 final kullanıcı karar kapısı ve integration handoff kaydı.

### Changed

- Canonical visibility değerleri `private`, `hidden`, `public` olarak hizalandı.
- Canonical publish state değerleri `draft`, `review`, `approved`, `published`, `unpublished`, `archived` olarak hizalandı.
- Eski `unlisted` public davranışı `hidden` olarak normalize edildi.
- Anonymous public read sözleşmesi yalnız `published + public` kayıtlarla sınırlandı.

### Security

- Tüm application tabloları için RLS tasarlandı.
- Anonymous write yetkisi oluşturulmadı.
- Owner erişimi `auth.uid()` ve active allowlist ile sınırlandı.
- Yeni Auth kullanıcılarının otomatik owner yapılması engellendi.
- Service role normal CRUD kapsamı dışında bırakıldı.
- Seed gerçek owner UUID veya Auth user oluşturmaz.
- Normal migration destructive SQL içermez.

### Not Applied

- Supabase projesi oluşturulmadı.
- SQL gerçek Supabase projesinde çalıştırılmadı.
- Auth, MFA, middleware, route guard, CRUD ve Storage implementasyonu başlatılmadı.
- Gerçek secret veya environment değeri eklenmedi.

### Blocked

- SQL uygulama ve Sprint 06 başlangıcı kullanıcı karar kapısını bekliyor.

## Sprint 04 Integration — 2026-07-07

### Added

- GitHub → Vercel automatic deployment verification kaydı.
- Public publish flow planı.
- Studio Security/RLS planı.
- Studio publish flow planı.
- Sprint 04 integration handoff kaydı.

### Changed

- Node.js runtime `22.x` olarak sabitlendi.
- Vercel deployment modeli feature push → Preview ve main push → Production akışına göre güncellendi.
- Public mock content publish state, approval ve link approval alanlarıyla genişletildi.
- Studio Auth/MFA karar matrisi ve data model referansları güncellendi.

### Verified

- Feature branch push → automatic Preview Deployment başarılı.
- Preview runtime Node.js 22.x.
- `npm ci`, `npm run lint`, `npm run typecheck` ve `npm run build` başarılı.
- Workspace root / multiple lockfile uyarısı görünmedi.
- Yeni environment değeri veya gerçek secret eklenmedi.
- Manuel `vercel --prod` kullanılmadı.
- Gerçek Supabase/Auth/Storage/RLS/CRUD implementasyonu yapılmadı.

### Known Issues

- Production Deployment main push sonrasında doğrulanmalıdır.
- `npm audit` 2 moderate vulnerability göstermeye devam ediyor.
- `npm audit fix --force` çalıştırılmamalıdır.

## Sprint 03 Integration — 2026-07-07

### Added
- Core Sprint 03: Vercel checklist ve environment contract dokümanları eklendi.
- Public Sprint 03: public content contract dokümanı eklendi.
- Studio Sprint 03: Studio data model draft ve auth decision dokümanları eklendi.
- Sprint 03 entegrasyon handoff kaydı eklendi: `docs/handoffs/2026-07-07-integration-sprint-03.md`.

### Changed
- Public mock içerikler publish/görünürlük/link güvenliği kararlarına hazırlanacak şekilde genişletildi.
- Studio mock workflow verisi future DB mapping ve publish queue hazırlığına daha uygun hâle getirildi.
- Deployment, environment, public publish ve Studio workflow kararları gerçek implementasyon başlamadan önce dokümante edildi.

### Verified
- `npm run lint`, `npm run typecheck` ve `npm run build` Sprint 03 integration branch üzerinde başarılı tamamlandı.
- `npm audit` çalıştırıldı; 2 moderate vulnerability bilinen izleme notu olarak kaldı.
- Yeni bağımlılık ve yeni environment değişkeni eklenmedi.
- Gerçek secret, middleware, SQL migration, Supabase/Auth/Storage/CRUD implementasyonu eklenmedi.
- `npm audit fix --force` çalıştırılmadı.

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
- Workspace root uyarısı gerçek Windows ortamında tekrar gözlenmeli; uyarı devam ederse repo dışındaki `C:\Users\ziyaa\package-lock.json` dosyasının gereksiz olup olmadığı kontrol edilmeli
- Snapshot içinde `.git` metadata bulunmadığı için GitHub remote, `main` ↔ `origin/main` senkronu ve gerçek son commit doğrulanamadı
- Bu ortamda `npm config get registry` protected registry hatası verdi
- `npm run check` bu ortamda build aşamasında zaman aşımına uğradı; alt komutlar ayrı ayrı başarılı

## 2026-07-10 — Studio Auth/MFA — S06_STUDIO_CHANGELOG

- Gerçek Supabase email/password login eklendi.
- Active owner allowlist ve server-side current AAL2 Studio guard eklendi.
- TOTP enrollment, challenge, ikinci faktör yönetimi ve güvenli logout eklendi.
- MFA recovery/reset ve development Supabase runbook’ları eklendi.



## 2026-07-10 — Studio Auth/MFA Development Acceptance — S06_STUDIO_OK

### Applied

- Singapore development Supabase project oluşturuldu.
- Schema, functions, RLS, iki Storage bucket ve sekiz Storage policy uygulandı.
- Tek active owner hesabı ve development seed doğrulandı.
- Preview environment development Supabase project'e bağlandı.

### Verified

- Password login, generic wrong-password davranışı
- TOTP enrollment, wrong-code rejection ve AAL2 challenge
- AAL1 Studio guard, AAL2 Studio access ve logout
- Allowlist dışı kullanıcı reddi
- İkinci TOTP ve son-factor protection
- Anonymous, outsider ve owner RLS matrisi
- Vercel Preview login/MFA/Studio/logout/direct URL

### Changed

- Hosted Storage relation-owner sınırı için 004 migration bucket-only yapıldı.
- Sekiz hosted Storage policy için Dashboard runbook eklendi.
- Development seed UUID placeholder yerine unique active owner çözümüne geçti.

### Known limitations

- Production Supabase project/env/migration uygulanmadı.
- Free plan/Dashboard yaklaşık 8 saat session time-box sağlamadı.
- npm audit iki moderate GHSA-qx2v-qp2m-jg93 uyarısını sürdürüyor.
