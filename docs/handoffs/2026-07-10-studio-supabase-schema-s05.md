# Branch Handoff — Studio Supabase Schema Sprint 05

- Tarih: 2026-07-10
- Çalışma hattı: Pencere 3 — Studio / Supabase SQL
- Branch: `feat/studio-supabase-schema-s05`
- Main başlangıç commit’i: `cf2d3ab`
- Son commit: Yerel worktree’de commit oluşturulduktan sonra güncellenmeli.

## Tamamlanan görevler

- Supabase SQL Editor’da sırayla çalıştırılabilecek dört migration dosyası hazırlandı.
- Owner-only allowlist ve `auth.uid()` tabanlı erişim modeli oluşturuldu.
- Anonymous write için hiçbir grant/policy oluşturulmadı.
- Anonymous read yalnız published/public project, writing ve journey kayıtlarıyla sınırlandı.
- Private task, note, file metadata ve publish queue için anonymous read policy oluşturulmadı.
- Yeni Auth kullanıcılarını owner yapmayan, yalnız pending profile oluşturan trigger hazırlandı.
- Aktif owner/admin profilini doğrulayan, sabit boş `search_path` kullanan security-definer helper hazırlandı.
- `public-assets` ve `private-files` bucket/policy SQL’i hazırlandı.
- Gerçek Auth user veya secret oluşturmayan development seed hazırlandı.
- Veri kaybı ve backup uyarılı destructive rollback hazırlandı.
- Auth/MFA karar önerileri Sprint 06 karar kapısı için güncellendi.
- Tracking belgeleri güncellendi.

## SQL dosyaları ve çalışma sırası

1. `supabase/migrations/202607100001_initial_schema.sql`
2. `supabase/migrations/202607100002_database_functions.sql`
3. `supabase/migrations/202607100003_rls_policies.sql`
4. `supabase/migrations/202607100004_storage_setup.sql`
5. Opsiyonel: `supabase/seed/202607100001_development_seed.sql`
6. Yalnız acil/destructive durumda: `supabase/rollback/202607100001_rollback_sprint_05.sql`

Ana runbook: `supabase/README.md`

## Tablo listesi

- `owner_profiles`
- `projects`
- `writings`
- `journey_items`
- `tasks`
- `notes`
- `files`
- `publish_queue`

## Function ve trigger özeti

- `private.set_updated_at()`
- `private.sync_publish_metadata()`
- `private.is_current_user_owner()`
- `private.handle_new_auth_user()`
- Tüm application tablolarında `updated_at` trigger’ları
- Project/writing/journey/note için publish metadata trigger’ları
- `auth.users` üzerinde pending owner profile trigger’ı

Yeni Auth user:

- `owner_profiles` satırı alır.
- `status = pending` kalır.
- `role = null` kalır.
- Otomatik owner/admin olmaz.

## RLS ve privilege özeti

Anonymous:

- `projects`, `writings`, `journey_items`: yalnız `visibility = public`, `publish_state = published`, `published_at is not null` satırlarını okuyabilir.
- `tasks`, `notes`, `files`, `publish_queue`, `owner_profiles`: okuyamaz.
- Hiçbir application tablosuna insert/update/delete yapamaz.

Authenticated owner/admin:

- Yetki `private.is_current_user_owner()` ve `auth.uid()` eşleşmesiyle doğrulanır.
- Yalnız kendi `owner_id` kayıtlarını yönetebilir.
- `owner_id` başka kullanıcıya değiştirilemez.
- Task/note/file başka owner’a ait projeye bağlanamaz.
- `owner_profiles` role/status client üzerinden değiştirilemez.

Service role:

- Normal Studio CRUD için tasarlanmadı ve client tarafında kullanılmamalı.

## Storage bucket taslağı

### `public-assets`

- Public read
- Owner/admin-only insert/update/delete
- Path: `<owner_uuid>/<domain>/<filename>`
- Baseline limit: 10 MiB
- Baseline MIME: kontrollü image türleri

### `private-files`

- Anonymous read yok
- Owner/admin-only read/insert/update/delete
- Path: `<owner_uuid>/<domain>/<filename>`
- Baseline limit: 50 MiB
- Baseline MIME: PDF, sunum, belge ve kontrollü image türleri

Dosya boyutu ve MIME baseline’ı kullanıcı onayı bekler. Supabase project-wide limit daha kısıtlayıcı olabilir.

## Seed talimatı

- Dosya: `supabase/seed/202607100001_development_seed.sql`
- Yalnız development/preview ortamı içindir.
- `REPLACE_WITH_OWNER_UUID` gerçek owner UUID ile değiştirilmelidir.
- Placeholder, geçersiz UUID, auth.users içinde olmayan UUID veya aktif olmayan owner profile güvenli exception üretir.
- Auth user oluşturmaz.
- Secret, gerçek URL, iletişim/sosyal link veya portre içermez.
- Deterministic ID + `ON CONFLICT DO NOTHING` kullanır.

## Rollback riski

- Dosya: `supabase/rollback/202607100001_rollback_sprint_05.sql`
- Tüm Sprint 05 application tablo verilerini siler.
- Önce database + Storage backup gerekir.
- Bucket’larda object varsa exception ile durur.
- Production’da açık kullanıcı onayı olmadan çalıştırılmamalıdır.
- Rutin migration adımı değildir.

## Değiştirilen ana dosyalar

- `supabase/README.md`
- `supabase/migrations/202607100001_initial_schema.sql`
- `supabase/migrations/202607100002_database_functions.sql`
- `supabase/migrations/202607100003_rls_policies.sql`
- `supabase/migrations/202607100004_storage_setup.sql`
- `supabase/seed/202607100001_development_seed.sql`
- `supabase/rollback/202607100001_rollback_sprint_05.sql`
- `docs/studio/STUDIO_AUTH_DECISIONS.md`
- `docs/studio/STUDIO_DATA_MODEL_DRAFT.md`
- `docs/PROJECT_STATUS.md`
- `docs/WORKSTREAMS.md`
- `CHANGELOG.md`
- `docs/handoffs/2026-07-10-studio-supabase-schema-s05.md`

## Eklenen bağımlılıklar

- Yok

## Yeni environment değişkenleri

- Yok

## Kontroller

Sandbox statik kontrolleri:

- [x] Beklenen SQL dosya yapısı mevcut.
- [x] Her migration ve rollback transaction sınırı içeriyor.
- [x] Initial schema foreign key hedefleri tablo sırasına uygun.
- [x] Tüm application tabloları için RLS enable + force komutları mevcut.
- [x] Anonymous write grant/policy bulunmuyor.
- [x] Anonymous private task/note/file/publish queue read policy bulunmuyor.
- [x] Owner kontrolü `auth.uid()` + aktif owner profile ile yapılıyor.
- [x] Yeni Auth user otomatik owner yapılmıyor.
- [x] Seed `auth.users` insert etmiyor.
- [x] Gerçek owner UUID, project URL veya secret yok.
- [x] Destructive table/type drop yalnız rollback dosyasında.
- [x] SQL gerçek Supabase projesinde çalıştırılmadı.

Yerel worktree’de zorunlu:

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm audit`

Supabase CLI yeni bağımlılık olarak eklenmedi. SQL gerçek proje üzerinde bu sprintte çalıştırılmamalıdır.

## SQL’in uygulanma durumu

- Supabase project created: **Hayır / bu branch tarafından yapılmadı**
- SQL applied: **Hayır**
- Owner UUID activated: **Hayır**
- RLS live-tested: **Hayır**
- Storage buckets created: **Hayır**
- Auth/MFA implemented: **Hayır**

## Kullanıcı onayı bekleyen kararlar

- Ana Auth yöntemi: email/password veya magic link
- TOTP MFA zorunluluğu
- Gerçek owner e-postası ve owner UUID aktivasyonu
- Session timeout
- Remember me
- Recovery yöntemi
- Public/private bucket boyut limitleri
- İzin verilen MIME türleri
- Development seed çalıştırılması
- SQL paketinin gerçek Supabase projesinde çalıştırılması
- Sprint 06 Auth + route guard implementasyon başlangıcı

## Merge sırasında dikkat

- Core/Public Sprint 05 content contract ile `publish_state`, `visibility`, approval ve slug isimleri karşılaştırılmalı.
- `docs/content/**` bu branch’te değiştirilmedi.
- `.env.example`, package dosyaları ve source Auth/CRUD kodu değiştirilmemeli.
- Secret taraması yapılmalı.
- SQL çalışma sırası korunmalı.
- SQL’in uygulanmadığı tracking ayrımı korunmalı.
- Integration branch üzerinde `npm ci`, lint, typecheck, build ve audit çalıştırılmalı.
- `npm audit fix --force` çalıştırılmamalı.
