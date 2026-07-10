# Branch Handoff — Integration Sprint 05

- Tarih: 2026-07-10
- Çalışma hattı: Pencere 4 — Entegrasyon
- Branch: `integration/sprint-05`
- Başlangıç main commit'i: `cf2d3ab`

## Merge Edilen Branch'ler

- Core: `feat/core-supabase-architecture-s05` — `82ee3a5`
- Public: `feat/public-data-transition-s05` — `411ffee`
- Studio: `feat/studio-supabase-schema-s05` — `4e688fa`

## Integration Commit'leri

- `6518a4e` — Core Supabase architecture entegrasyonu
- `edacc88` — Public database transition contract entegrasyonu
- `11d1a28` — Studio Supabase schema package entegrasyonu
- `5d35c10` — Public ve SQL content state uyumluluğu

## SQL Dosyaları

Çalıştırma sırası:

1. `supabase/migrations/202607100001_initial_schema.sql`
2. `supabase/migrations/202607100002_database_functions.sql`
3. `supabase/migrations/202607100003_rls_policies.sql`
4. `supabase/migrations/202607100004_storage_setup.sql`

Ek dosyalar:

- Development seed: `supabase/seed/202607100001_development_seed.sql`
- Destructive rollback: `supabase/rollback/202607100001_rollback_sprint_05.sql`
- Runbook: `supabase/README.md`

## Tablo Listesi

- `owner_profiles`
- `projects`
- `writings`
- `journey_items`
- `tasks`
- `notes`
- `files`
- `publish_queue`

## Canonical Durumlar

Visibility:

- `private`
- `hidden`
- `public`

Publish state:

- `draft`
- `review`
- `approved`
- `published`
- `unpublished`
- `archived`

Approval state:

- `not_required`
- `pending`
- `approved`
- `rejected`

## RLS Özeti

- Bütün application tablolarında RLS enabled ve forced.
- Anonymous write yetkisi veya policy'si yok.
- Anonymous yalnız `projects`, `writings` ve `journey_items` tablolarında `published + public + published_at` kayıtlarını okuyabilir.
- `tasks`, `notes`, `files`, `publish_queue` ve owner private verileri anonymous erişime kapalı.
- Owner CRUD kontrolleri `auth.uid()` ve kontrollü active owner/admin allowlist ile yapılır.
- Client metadata veya client tarafından gönderilen role değerine güvenilmez.
- Yeni Auth kullanıcısı pending profile alır; otomatik owner/admin olmaz.
- Service role normal Studio CRUD modelinde kullanılmaz.

## Storage Planı

- Public bucket: `public-assets`
- Private bucket: `private-files`
- Object path: `<owner_uuid>/<domain>/<filename>`
- Public bucket read açıktır; write/update/delete owner-only path policy ile korunur.
- Private bucket read/write/update/delete owner-only policy ile korunur.
- Taslak limitler kullanıcı karar kapısını beklemektedir.

## Seed Planı

- Seed yalnız development/preview için hazırlanmıştır.
- Auth kullanıcısı oluşturmaz.
- Gerçek owner UUID içermez.
- `REPLACE_WITH_OWNER_UUID` placeholder'ı değiştirilmeden çalışmaz.
- Owner UUID'nin `auth.users` içinde bulunmasını ve profile'ın active owner/admin olmasını doğrular.
- Gerçek link, contact/social URL veya portrait içermez.

## Rollback Planı

- Rollback destructive olarak açıkça işaretlenmiştir.
- Veri kaybı uyarısı içerir.
- Production üzerinde açık kullanıcı onayı ve backup olmadan çalıştırılmamalıdır.
- Storage bucket'larında object varsa rollback durur.
- Normal migration dosyalarında destructive SQL bulunmaz.

## Secret Denetimi

- Gerçek Supabase URL bulunmadı.
- Gerçek anon/publishable key bulunmadı.
- Gerçek service role key bulunmadı.
- Gerçek JWT bulunmadı.
- Gerçek owner UUID bulunmadı.
- `.env.local` veya production env dosyası track edilmiyor.
- `.env.example` yalnız boş placeholder içeriyor.
- `supabase.co` eşleşmeleri resmi dokümantasyon bağlantılarıdır.
- `eyJ` benzeri package-lock eşleşmesi integrity hash'idir; JWT değildir.

## Eklenen Bağımlılıklar

- Yeni dependency eklenmedi.
- Supabase npm paketi eklenmedi.

## Yeni Environment Değişkenleri

- Yeni environment değişkeni eklenmedi.
- Mevcut Supabase placeholder adları boş kalmaya devam ediyor.

## SQL Uygulama Durumu

- SQL gerçek Supabase projesine uygulanmadı.
- Supabase projesi oluşturulmadı.
- Storage bucket oluşturulmadı.
- Auth kullanıcısı oluşturulmadı.
- RLS gerçek projede uygulanmadı veya test edilmedi.

## Source Implementasyon Durumu

- Gerçek Supabase client eklenmedi.
- Auth implementasyonu eklenmedi.
- MFA implementasyonu eklenmedi.
- Middleware eklenmedi.
- Route guard eklenmedi.
- CRUD, upload, delete veya publish implementasyonu eklenmedi.
- Production uygulaması mock davranışını koruyor.

## Kullanıcı Onayı Bekleyen Kararlar

Ayrıntılar:

- `docs/supabase/SPRINT_05_FINAL_DECISION_GATE.md`

Durum:

- `USER_APPROVAL_REQUIRED`
- Sprint 05 merge edilebilir.
- Sprint 06 başlayamaz.
- SQL çalıştırılamaz.

## Sprint 06 Blockerları

- Supabase proje oluşturma onayı
- Region seçimi
- Auth yöntemi
- Magic link kararı
- TOTP MFA kararı
- Owner e-posta ve allowlist kararı
- Session timeout
- Recovery yöntemi
- Storage bucket limitleri ve MIME allowlist
- Development seed onayı
- SQL uygulama onayı
- Auth + route guard implementasyon onayı
- Profile/contact/social/portrait şema kararları

## Vercel Beklentisi

- Feature branch push'ları Preview Deployment oluşturmalı.
- Main merge sonrasında Production Deployment otomatik tetiklenmeli.
- Source commit son main commit'iyle eşleşmeli.
- Production status `Ready` olmalı.
- Production URL:
  `https://ziyaattin-aydin-website.vercel.app`
- Gerçek environment değeri eklenmediği için uygulama mock davranışını korumalı.
