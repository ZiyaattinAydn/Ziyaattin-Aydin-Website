# Studio Security and RLS Plan

> Bu belge Sprint 04 güvenlik planıdır. SQL policy, migration, Supabase client, Storage bucket veya middleware implementasyonu değildir.

## Amaç

Studio'nun ileride Supabase'e bağlandığında yalnız owner tarafından erişilebilir kalması, private çalışma verilerinin public siteye sızmaması ve publish flow'un kontrollü bir public-safe veri sınırıyla ilerlemesi için güvenlik ilkelerini netleştirmek.

## Temel güvenlik ilkeleri

- Studio private alandır; güvenlik gizli URL ile sağlanmaz.
- Gerçek koruma Supabase Auth + MFA + owner allowlist + RLS + server-side route guard kombinasyonuyla sağlanmalıdır.
- Private tablolar public route'lardan doğrudan okunmamalıdır.
- Client bundle'a service role key veya gizli admin token konmamalıdır.
- Storage metadata ve bucket erişimi birlikte düşünülmelidir; yalnız UI'da disabled buton göstermek güvenlik değildir.
- Publish queue private kalır; public route yalnız onaylanmış ve temizlenmiş public içerik kaynağını okur.

## Owner-only access yaklaşımı

İlk gerçek implementasyon için önerilen model:

1. Supabase Auth içinde tek owner hesabı hazırlanır.
2. Public sign-up kapatılır.
3. Server tarafında owner allowlist kontrolü yapılır.
4. RLS policy'leri `owner_id = auth.uid()` benzeri bir kuralı temel alır.
5. MFA tamamlanmadan Studio verisi okunmaz veya yazılmaz.
6. Owner settings tablosu, owner kimliğini ve güvenlik tercihlerini yönetmek için ayrı ele alınır.

Bu akış plan seviyesindedir; policy kodu bu sprintte yazılmaz.

## Public read / private write ayrımı

| Veri tipi | Private kaynak | Public okuma stratejisi | Yazma yetkisi | Not |
| --- | --- | --- | --- | --- |
| Studio projeleri | `studio_projects` | Doğrudan public okunmaz | Owner-only | Public proje içeriği ayrı public-safe kaynağa taşınmalı. |
| Studio görevleri | `studio_tasks` | Public okunmaz | Owner-only | Görevler çalışma verisidir. |
| Studio notları | `studio_notes` | Doğrudan public okunmaz | Owner-only | Public yazıya dönüşecek notlar publish queue'dan geçmeli. |
| Studio dosyaları | `studio_files` + private bucket | Public asset ayrı bucket/path kararıyla sunulur | Owner-only | Private dosyalar public URL'e çevrilmemeli. |
| Publish queue | `publish_queue` | Public okunmaz | Owner-only | Onaylanmış çıktı public content contract'a aktarılır. |
| Public içerik | Public-safe tablo/dosya/build çıktısı | Public read olabilir | Owner veya build pipeline | Private field içermemeli. |

## Tablo bazlı RLS ihtiyaçları

### `studio_projects`

- Owner dışı select/insert/update/delete kapalı olmalı.
- Public'e çıkabilecek kayıtlar bile private tabloda owner-only kalmalı.
- Soft archive tercih edilirse archived kayıtlar da owner-only kalmalı.

### `studio_tasks`

- Task kayıtları private çalışma verisidir.
- Public route veya anonim client tarafından okunmamalıdır.
- Status/priority/update işlemleri yalnız owner tarafından yapılmalıdır.

### `studio_notes`

- Not gövdeleri özel düşünce, kaynak veya taslak içerebilir; sıkı owner-only RLS gerekir.
- Public yazıya dönüşecek içerikler önce publish review aşamasından geçmelidir.
- Private not gövdesinden public-safe excerpt üretimi ayrı karar gerektirir.

### `studio_files`

- Metadata tablosu owner-only olmalıdır.
- `storage_bucket` ve `storage_path` alanları public URL kabul edilmemelidir.
- Private dosya silme/yükleme işlemleri audit ve recovery ihtiyacı açısından ayrıca planlanmalıdır.

### `publish_queue` / `public_publications`

- Queue private olmalı; yalnız owner erişmelidir.
- Public'e taşınacak final kayıtlar private source id'leri, internal notes veya review notları içermemelidir.
- Rollback/unpublish aksiyonları audit trail gerektirebilir.

### `owner_settings` / `user_profile`

- Owner ayarları private olmalıdır.
- Public profil alanları ile private güvenlik tercihleri aynı response içinde karıştırılmamalıdır.
- Sosyal link, iletişim ve portre onayı kullanıcı onayı olmadan public aktif edilmemelidir.

## Storage bucket ayrımı

Önerilen taslak ayrım:

| Bucket tipi | Amaç | Erişim | Not |
| --- | --- | --- | --- |
| Private Studio files | PDF, sunum, çalışma dosyası, kaynak | Owner-only / signed access | Varsayılan dosya alanı. |
| Public assets | Onaylı public görsel/dosya | Public read olabilir | Yalnız image/link approval sonrası. |
| Temporary uploads | Upload hazırlık veya dönüştürme | Kısa ömürlü / owner-only | Cleanup stratejisi gerekir. |

Bu bucket adları kesin değildir; gerçek Supabase kurulumunda isimlendirme ve lifecycle kuralları ayrıca seçilir.

## Service role key ve client güvenliği

- Service role key hiçbir client component, browser bundle veya public env içinde kullanılmaz.
- `NEXT_PUBLIC_*` değişkenleri private secret taşımaz.
- Admin yetkili işlemler gerekiyorsa server-side boundary, route handler/server action ve denetimli auth check gerektirir.
- Client tarafı yalnız izin verilen owner session ile kısıtlı API çağrısı yapmalıdır.
- Hata mesajları secret, bucket path veya policy detaylarını sızdırmamalıdır.

## Publish queue güvenliği

Publish flow için güvenlik sınırı:

1. Studio kaydı private kalır.
2. Owner kaydı publish candidate olarak işaretler.
3. Review aşamasında public title, slug, excerpt, image ve linkler temizlenir.
4. Approval sonrası public-safe hedefe aktarılır.
5. Public route private source tabloyu değil, yalnız public-safe kaynağı okur.
6. Unpublish/rollback aksiyonları private queue ve public-safe hedef arasında tutarlı yapılır.

Bu akış gerçek publish implementasyonu değildir; yalnız güvenlik planıdır.

## Test ve doğrulama beklentileri

Gerçek implementasyon başladığında en az şu kontroller gerekecek:

- Anonim kullanıcı `/studio/**` verisi okuyamıyor.
- Auth olmuş ama allowlist dışı kullanıcı Studio verisi okuyamıyor.
- MFA tamamlanmamış owner Studio verisi okuyamıyor.
- Public route private Studio tablo veya bucket okumuyor.
- Private dosya public URL ile erişilemiyor.
- Public asset yalnız image/link approval sonrası sunuluyor.
- Service role key client bundle'da bulunmuyor.

## Bu sprintte yapılmayanlar

- SQL policy yazılmadı.
- Migration yazılmadı.
- Supabase client/import eklenmedi.
- Storage bucket oluşturulmadı.
- Middleware veya route guard eklenmedi.
- Gerçek upload/delete/publish/CRUD işlemi eklenmedi.
