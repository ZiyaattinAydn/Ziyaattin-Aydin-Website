# Orchestration Continuity — Sprint 06

Tarih: 2026-07-10
Durum: `S06_INTEGRATION_READY_FOR_MAIN_APPROVAL`

## Kaynak ve çalışma ilkesi

Repository, Git geçmişi, feature branch'ler, tracking belgeleri ve handoff dosyaları proje gerçeğinin kaynaklarıdır. Sohbet geçmişi tek başına kaynak kabul edilmez.

History rewrite, force push, kontrolsüz migration tekrarı ve secret değerlerinin repository'ye yazılması yasaktır.

## Beş pencere çalışma modeli

1. **Core geliştirme penceresi:** ortak runtime, Supabase SSR client'ları, environment sınırı, Proxy ve server-side authorization temeli.
2. **Public geliştirme penceresi:** public repository boundary, mock adapter, Supabase adapter ve yayın görünürlüğü politikaları.
3. **Studio geliştirme penceresi:** login, TOTP MFA, AAL2, owner allowlist, logout, migration ve hosted Supabase kabulü.
4. **Integration penceresi:** branch inceleme, güvenlik kapısı, merge, conflict çözümü, birleşik testler ve main onay kapısı.
5. **Orchestration penceresi:** sprint planlama, bağımsız görev promptları, kapsam ayrımı ve context sürekliliği.

## Repository ve branch durumu

- Sprint 06 başlangıç main: `0c9d1bb`
- Integration branch: `integration/sprint-06`
- Integration kod head'i: `260e547`
- Bu belgeyi içeren final integration commit'i: `git rev-parse HEAD` ile doğrulanmalıdır.
- Main merge: kullanıcı açık onayı bekliyor.
- Main push: yapılmadı.

## Sprint özeti

### Sprint 01

Repository temeli, ilk Public yapı, Studio shell ve çalışma modeli oluşturuldu.

### Sprint 02

Core foundation, Public site ve Studio shell sınırları genişletildi.

### Sprint 03

Deployment hazırlığı, Public içerik yapısı ve Studio veri çalışma alanları geliştirildi.

### Sprint 04

Vercel deployment akışı, Public publish planı ve Studio Auth/security planı tamamlandı.

### Sprint 05

Supabase mimarisi, Public database geçiş sözleşmesi ve başlangıç migration/RLS/storage/seed paketi oluşturuldu.

### Sprint 06

Supabase SSR runtime, Public repository adapter sınırı ve Studio Auth/TOTP/AAL2 implementasyonu gerçek development Supabase kabulüyle birleştirildi.

## Sprint 06 branch ve commitleri

### Core

- Branch: `origin/feat/core-supabase-runtime-s06`
- Runtime: `6d51ff3`
- Dokümantasyon: `392144b`
- Final: `02f7c6a`
- Başarı etiketi: `S06_CORE_OK`

### Public

- Branch: `origin/feat/public-supabase-adapter-s06`
- Final: `ac61af6`
- Başarı etiketi: `S06_PUBLIC_OK`

### Studio

- Branch: `origin/feat/studio-auth-mfa-s06`
- Storage limits: `c395508`
- Auth/MFA: `71f22f1`
- Quality fix: `2dcfa8d`
- Hosted kabul: `f080364`
- Başarı etiketi: `S06_STUDIO_OK`

### Integration

- Core merge: `63b578c`
- Public merge: `dd106e6`
- Studio merge: `4991a46`
- Verifier identity-literal düzeltmesi: `260e547`

Merge sırası:

1. Core
2. Public
3. Studio

## Worktree yolları

- Main: `/c/Users/ziyaa/Ziyaattin-Aydin-Website`
- Integration: `/c/Users/ziyaa/Ziyaattin-Aydin-Website-integration`
- Core: `/c/Users/ziyaa/Ziyaattin-Aydin-Website-core`
- Public: `/c/Users/ziyaa/Ziyaattin-Aydin-Website-public`
- Studio: `/c/Users/ziyaa/Ziyaattin-Aydin-Website-studio`
- Core review: `/c/Users/ziyaa/Ziyaattin-Aydin-Website-s06-core-review`
- Public review: `/c/Users/ziyaa/Ziyaattin-Aydin-Website-s06-public-review`

## Supabase development durumu

- Development project: oluşturuldu ve healthy.
- Region: APAC — Southeast Asia (Singapore).
- Migration 001: uygulandı.
- Migration 002: uygulandı.
- Migration 003: uygulandı.
- Storage kurulumu: tamamlandı.
- Development seed: uygulandı.
- Active owner count: 1.
- Owner UUID repository'ye yazılmadı.

Seed kabul kayıtları:

- projects: 1
- writings: 1
- tasks: 1
- notes: 1

## Production Supabase durumu

- Production Supabase project oluşturulmadı.
- Production migration uygulanmadı.
- Development Supabase değerleri Vercel Production environment'a girilmedi.
- Public production kaynak seçimi mock olarak korunuyor.
- Auth ve Studio env yokken fail closed davranıyor.

## Auth, TOTP ve AAL2

- Login yalnız e-posta ve şifre.
- Public signup yok.
- Magic link yok.
- TOTP MFA zorunlu.
- Active owner ve current `aal2` olmadan `/studio/**` açılmaz.
- Server-side Studio layout authorization guard bulunur.
- Client metadata role değerine güvenilmez.
- Authorization kodunda owner e-postası veya UUID hard-code edilmez.
- Güvenli logout uygulanır.
- Recovery code özelliği yoktur.
- Yedek erişim ikinci TOTP faktörü ve kontrollü Dashboard reset runbook'udur.

Manuel kabul sonuçları:

- Yanlış parola reddedildi.
- İlk TOTP enrollment tamamlandı.
- Yanlış TOTP reddedildi.
- Doğru TOTP ile Studio açıldı.
- AAL1 Studio erişimi engellendi.
- Non-owner Studio erişimi engellendi.
- Logout ve geri tuşu testi başarılı.
- İkinci TOTP faktörü eklendi.
- Son verified faktör koruması doğrulandı.

## RLS modeli

Application tabloları:

1. owner_profiles
2. projects
3. writings
4. journey
5. tasks
6. notes
7. files
8. publish_queue

Kabul modeli:

- Anonymous yalnız yayınlanmış ve public içerikleri okuyabilir.
- Anonymous write policy yoktur.
- Draft, private, hidden ve unpublished içerikler görünmez.
- Tasks, notes, files ve publish queue anonymous erişimine kapalıdır.
- Allowlist dışı authenticated kullanıcı Studio tablolarına erişemez.
- Active owner AAL2 owner policy'leri üzerinden çalışır.
- Normal owner işlemleri service role olmadan çalışır.
- RLS enabled ve forced kabulü hosted development projesinde doğrulandı.

## Storage

### public-assets

- Limit: 10 MiB
- MIME: JPEG, PNG, WebP, AVIF
- Public okuma ve owner-only yazma politikası

### private-files

- Limit: 25 MiB
- Owner-only erişim

Hosted Supabase'te `storage.objects` relation owner'ı `supabase_storage_admin` olduğu için SQL Editor üzerinden doğrudan policy oluşturma işlemi owner hatası verdi. Sekiz Storage policy Dashboard Storage Policies arayüzüyle oluşturuldu. Repository runbook'u bu davranışı kaydeder.

## Public kaynak durumu

- Public route'lar doğrudan mock import etmez.
- Ortak repository boundary kullanılır.
- Supabase adapter server-only'dir.
- Explicit public-safe kolon listeleri kullanılır.
- `select *` kullanılmaz.
- Published/public/`published_at` filtreleri uygulanır.
- Draft/private detail sonuçları `notFound()` davranışına gider.
- Onaysız link, görsel ve portrait değerleri public çıktıya girmez.
- Production source bu sprintte mock'tur.
- Database cutover sonraki sprint işidir.

## Vercel

Preview environment değişkenleri:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Preview manuel kabul testleri başarılıdır. Preview URL Vercel deployment protection arkasında olabilir.

Production environment'a development Supabase değerleri girilmemiştir. Main merge ve Production deployment kullanıcı onayı bekler.

## Kalite ve audit

Başarılı kapılar:

- `npm ci`
- `npm run test:supabase`
- Public policy testleri: 7/7
- `node scripts/verify-studio-auth.mjs`
- `node scripts/verify-s06-studio-final.mjs`
- `npm run lint`
- `npm run typecheck`
- Supabase env değerleri kaldırılmış production build
- `git diff --check`
- Owner email source scan
- Owner UUID placeholder scan
- Tracked env scan

Audit sonucu:

- 2 moderate
- `postcss < 8.5.10`
- `GHSA-qx2v-qp2m-jg93`
- `npm audit fix --force` uygulanmadı.

## Açık işler

- Kullanıcının main merge onayı
- Main push
- Otomatik Production deployment doğrulaması
- Production Supabase projesinin gelecekte oluşturulması
- Production migration
- Public database cutover
- Geniş Studio CRUD
- PWA
- Audit advisory için güvenli upstream çözümün izlenmesi

## Güvenlik kuralları

- Secret, token, password, TOTP secret ve gerçek owner UUID Git'e yazılmaz.
- Service role normal runtime veya CRUD için kullanılmaz.
- Development Supabase environment değerleri Production'a kopyalanmaz.
- AAL1 veya non-owner Studio erişimi blocker'dır.
- Public signup ve magic link açılamaz.
- Anonymous write policy eklenemez.
- RLS kapatılamaz.
- `npm audit fix --force`, force push ve history rewrite yasaktır.

## Tracking dosyaları

- `docs/PROJECT_STATUS.md`
- `docs/WORKSTREAMS.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`
- `CHANGELOG.md`
- `docs/supabase/SPRINT_06_APPROVAL_GATE.md`
- Sprint 06 feature handoff'ları
- `docs/handoffs/2026-07-10-integration-sprint-06.md`

## Prompt üretme standardı

Yeni görev promptları:

- Tek başına anlaşılabilir olmalı.
- Repository ve worktree yolunu açıkça belirtmeli.
- Branch, başlangıç commit'i ve kapsamı yazmalı.
- Yapılan ve yapılmayan işleri ayırmalı.
- Security blocker'larını belirtmeli.
- Çalıştırılacak doğrulama komutlarını içermeli.
- Tracking ve handoff güncellemelerini zorunlu tutmalı.
- Secret değerlerini istememeli veya raporlamamalı.
- Main merge/push gibi kritik işlemlerde açık kullanıcı onayı istemeli.

## Context handoff protokolü

Bağlam dolarsa:

1. Yeni merge veya destructive işlem başlatılmaz.
2. Working tree güvenli ve anlaşılır durumda bırakılır.
3. Tracking dosyaları güncellenir.
4. Ara handoff oluşturulur.
5. Mevcut branch push edilir.
6. Bağımsız devam promptu hazırlanır.
7. Yeni sohbet Git ve repository belgeleri üzerinden devam eder.

Son integration handoff:

`docs/handoffs/2026-07-10-integration-sprint-06.md`


## Sprint 07 Continuity Güncellemesi — S07_CONTINUITY_UPDATE

- Base main: `a870f02`
- Integration branch: `integration/sprint-07`
- Core: `3a6cd87`
- Public: `ca613c8`
- Studio: `84bf4ac`
- Project domain, Public read ve Studio Projects CRUD birleşti.
- Development Supabase ve Vercel Preview kabulü başarılıdır.
- Production Public source mock kalır.
- Main merge açık kullanıcı onayı bekler.
- Son integration handoff: `docs/handoffs/2026-07-14-integration-sprint-07.md`
