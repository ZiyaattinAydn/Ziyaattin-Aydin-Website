# Supabase SQL Paketi — Sprint 05

> Durum: **Hazırlandı, uygulanmadı.** Bu klasördeki SQL hiçbir gerçek Supabase projesinde Sprint 05 kapsamında çalıştırılmamıştır.

Bu paket, Kişisel Sistemim / Studio için owner-only yönetim modeli, anonymous public read sınırı, RLS, Storage bucket politikaları, development seed ve destructive rollback talimatlarını içerir.

## Çalıştırma sırası

Zorunlu migration dosyalarını Supabase Dashboard → SQL Editor içinde **ayrı ayrı** ve aşağıdaki sırayla çalıştır:

1. `migrations/202607100001_initial_schema.sql`
2. `migrations/202607100002_database_functions.sql`
3. `migrations/202607100003_rls_policies.sql`
4. `migrations/202607100004_storage_setup.sql`

İsteğe bağlı:

5. `seed/202607100001_development_seed.sql` — yalnız development/preview ortamında

Acil ve destructive geri alma:

- `rollback/202607100001_rollback_sprint_05.sql`

Migration dosyaları tek seferliktir. Başarılı bir çalıştırmadan sonra aynı dosyayı yeniden çalıştırmak yerine yeni bir forward migration hazırlanmalıdır. Her dosya transaction kullanır; bir statement hata verirse o dosyanın transaction’ı commit edilmemelidir.

## Dosyaların amacı

| Dosya | Amaç | Zorunlu mu? |
| --- | --- | --- |
| `202607100001_initial_schema.sql` | Enum/type, tablolar, foreign key, constraint ve indexler | Evet |
| `202607100002_database_functions.sql` | `updated_at`, publish metadata, owner helper ve pending Auth profile trigger’ları | Evet |
| `202607100003_rls_policies.sql` | SQL privilege + RLS politikaları | Evet |
| `202607100004_storage_setup.sql` | `public-assets`, `private-files` ve `storage.objects` politikaları | Evet |
| `202607100001_development_seed.sql` | Güvenli mock development verisi | Hayır |
| `202607100001_rollback_sprint_05.sql` | Sprint 05 nesnelerini destructive kaldırma | Yalnız acil durumda |

## Owner hesabı hazırlığı

Bu paket `auth.users` içine kullanıcı eklemez ve hiçbir kullanıcıyı otomatik owner yapmaz.

1. Kullanıcı onayından sonra Supabase Auth üzerinden gerçek owner hesabını oluştur.
2. SQL Editor’da gerçek UUID’yi bul:

```sql
select id, email, created_at
from auth.users
order by created_at;
```

3. `202607100002_database_functions.sql` daha önce çalıştıysa yeni Auth kullanıcısı için `owner_profiles` içinde `pending` satırı oluşur.
4. UUID ve e-posta doğru kullanıcıya ait olduğu elle doğrulandıktan sonra yalnız trusted SQL Editor oturumunda aktivasyon yap:

```sql
update public.owner_profiles
set
  role = 'owner'::public.studio_role,
  status = 'active'::public.owner_profile_status,
  activated_at = now()
where user_id = '<REAL_OWNER_UUID>'::uuid;
```

5. Tek owner beklentisini doğrula:

```sql
select user_id, role, status, activated_at
from public.owner_profiles
where status = 'active';
```

Client metadata, JWT içine client tarafından yazılan role veya formdan gelen `owner_id` yetki kaynağı değildir. RLS helper yalnız `auth.uid()` ile eşleşen aktif allowlist satırını doğrular.

## Şema özeti

Tablolar:

- `owner_profiles`
- `projects`
- `writings`
- `journey_items`
- `tasks`
- `notes`
- `files`
- `publish_queue`

Owner ilişkileri `owner_profiles.user_id → auth.users.id` üzerinden kurulur. Proje sahipliği silinmeye karşı `restrict` davranışı kullanır; yanlışlıkla Auth kullanıcısı silinerek tüm içeriklerin cascade ile kaybolması engellenir.

## Anonymous ve owner erişim özeti

Anonymous:

- `projects`: yalnız `visibility = public` ve `publish_state = published`
- `writings`: yalnız `visibility = public` ve `publish_state = published`
- `journey_items`: yalnız `visibility = public` ve `publish_state = published`
- `tasks`, `notes`, `files`, `publish_queue`, `owner_profiles`: erişim yok
- Hiçbir application tablosuna anonymous insert/update/delete yetkisi yok

Authenticated ama allowlist dışı kullanıcı:

- Public kayıtları authenticated public-read policy üzerinden okuyabilir.
- Private Studio kayıtlarını okuyamaz veya değiştiremez.

Aktif owner/admin:

- Yalnız `owner_id = auth.uid()` olan kayıtları yönetebilir.
- `owner_id` alanını başka kullanıcıya taşıyamaz.
- Task/note/file ilişkisinde başka kullanıcıya ait projeyi seçemez.
- `owner_profiles` role/status değerlerini client üzerinden değiştiremez.

## Storage modeli

### `public-assets`

- Public download açıktır.
- Upload/update/delete yalnız aktif owner/admin için açıktır.
- Zorunlu path başlangıcı: `<owner_uuid>/...`
- Önerilen kullanım: onaylanmış public proje/yazı görselleri
- Onaysız portre, private belge veya internal dosya bu bucket’a konmamalıdır.

### `private-files`

- Anonymous read yoktur.
- Download/list/upload/update/delete yalnız aktif owner/admin için açıktır.
- Zorunlu path başlangıcı: `<owner_uuid>/...`
- Önerilen kullanım: PDF, sunum, private proje dosyaları ve hazırlık görselleri

Bucket baseline limitleri:

- `public-assets`: 10 MiB, image MIME türleri
- `private-files`: 50 MiB, belge/sunum ve kontrollü image MIME türleri

Supabase project-wide Storage limiti veya Dashboard ayarı daha kısıtlayıcı olabilir. Üretime geçmeden önce dosya boyutu ve MIME listesi kullanıcı tarafından onaylanmalıdır.

## SQL sonuçlarını doğrulama

### Tablolar

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'owner_profiles',
    'projects',
    'writings',
    'journey_items',
    'tasks',
    'notes',
    'files',
    'publish_queue'
  )
order by table_name;
```

### RLS

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'owner_profiles',
    'projects',
    'writings',
    'journey_items',
    'tasks',
    'notes',
    'files',
    'publish_queue'
  )
order by tablename;
```

```sql
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;
```

### Bucket’lar

```sql
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('public-assets', 'private-files')
order by id;
```

### Owner helper

Authenticated owner oturumu ile helper `true`; allowlist dışı kullanıcı veya anonymous bağlamda `false` dönmelidir:

```sql
select private.is_current_user_owner();
```

## RLS test senaryoları

Uygulama başlamadan önce ayrı test hesapları ve Supabase API/SQL test yöntemleriyle en az şu senaryolar doğrulanmalıdır:

1. Anonymous published/public project okur.
2. Anonymous draft veya private project okuyamaz.
3. Anonymous task, note, file metadata veya publish queue okuyamaz.
4. Anonymous hiçbir application tablosuna yazamaz.
5. Authenticated ama pending/disabled kullanıcı Studio private verisi okuyamaz.
6. Authenticated ama allowlist dışı kullanıcı insert/update/delete yapamaz.
7. Aktif owner kendi kaydını okuyup yazabilir.
8. Owner başka UUID ile `owner_id` insert/update yapamaz.
9. Owner başka path prefix’ine Storage upload/update/delete yapamaz.
10. `private-files` public URL veya anonymous JWT ile okunamaz.
11. `public-assets` read çalışır; write yalnız owner için çalışır.
12. Yeni Auth kullanıcısı `pending` profile alır ama owner yetkisi kazanmaz.

## Seed kullanımı

Seed opsiyoneldir ve production için değildir.

- Dosyadaki `REPLACE_WITH_OWNER_UUID` metnini gerçek owner Auth UUID’siyle değiştir.
- Placeholder değiştirilmezse seed güvenli exception ile durur.
- UUID `auth.users` içinde yoksa veya owner profile aktif değilse durur.
- Auth user oluşturmaz.
- Gerçek GitHub/demo/contact/social link veya portre eklemez.
- Deterministic ID + `ON CONFLICT DO NOTHING` kullandığı için tekrar çalıştırma mevcut seed satırlarını overwrite etmez.

Seed’den sonra anonymous public-read testi için örnek writing kaydı kullanılabilir. Private proje, task ve note anonymous bağlamda görünmemelidir.

## Rollback riski

Rollback:

- Storage policy’lerini kaldırır.
- Boşsa Sprint 05 bucket’larını siler.
- RLS policy’lerini, trigger’ları ve function’ları kaldırır.
- Tüm Sprint 05 application tablolarını ve içindeki verileri siler.
- Enum/type yapılarını kaldırır.

Bucket’larda object varsa rollback güvenli exception ile durur. Önce backup ve kontrollü object export/delete gerekir. Rollback production’da açık kullanıcı onayı olmadan çalıştırılmamalıdır.

## Bu sprintte uygulanmayanlar

- Supabase projesi oluşturulmadı.
- SQL dosyaları gerçek Supabase projesinde çalıştırılmadı.
- Gerçek owner UUID repository’ye eklenmedi.
- Auth/MFA ekranı veya route guard uygulanmadı.
- Supabase client/import eklenmedi.
- Gerçek CRUD/upload/delete/publish başlamadı.
- RLS canlı ortamda test edilmedi.

SQL ancak Sprint 05 entegrasyon güvenlik denetimi ve kullanıcı karar kapısından sonra uygulanmalıdır.
