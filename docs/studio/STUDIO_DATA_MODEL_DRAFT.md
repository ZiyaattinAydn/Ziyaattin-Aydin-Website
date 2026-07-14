# Studio Data Model Draft

> Bu belge Sprint 03 hazırlık çıktısıdır. SQL migration, Supabase schema veya gerçek production veri modeli değildir. Amaç Studio mock workflow'unun ileride Supabase tablolarına taşınırken hangi kavramları koruması gerektiğini görünür kılmaktır.

## Sprint 04 bağlantılı güvenlik ve publish dokümanları

Bu veri modeli hâlâ draft statüsündedir. Gerçek migration değildir ve aşağıdaki Sprint 04 karar dokümanlarıyla birlikte değerlendirilmelidir:

- `docs/studio/STUDIO_AUTH_DECISIONS.md` — Auth, MFA, owner allowlist ve route guard karar matrisi.
- `docs/studio/STUDIO_SECURITY_RLS_PLAN.md` — RLS, Storage, service role ve public/private veri sınırı planı.
- `docs/studio/STUDIO_PUBLISH_FLOW.md` — Studio'dan public-safe içeriğe geçiş workflow'u.
- `docs/content/PUBLIC_CONTENT_MODEL.md` — Public içerik sözleşmesi; Studio sprintinde değiştirilmez.

Model alanları kesinleşmiş migration alanları değildir. Auth, RLS ve publish kararları onaylanmadan tablo, policy veya Storage bucket oluşturulmamalıdır.

## Genel ilkeler

- Studio yalnız Ziyaattin'in private çalışma alanıdır.
- Tüm kayıtlar başlangıçta owner'a aittir; çok kullanıcılı takım modeli bu dokümanda tasarlanmaz.
- Public siteye aktarılabilecek içerikler açıkça `visibility` ve `publish_state` benzeri alanlarla ayrılmalıdır.
- Private kayıtlar public bileşenlere doğrudan sızdırılmamalıdır.
- RLS, route guard ve server/client sınırları netleşmeden gerçek CRUD, upload veya publish işlemi başlatılmamalıdır.
- Bu dokümandaki alan adları taslaktır; migration yazılmadan önce Core + Studio entegrasyon kararı gerekir.

## Ortak alan önerileri

Aşağıdaki alanlar birçok Studio kaydında tekrar edebilir:

| Alan | Amaç | Not |
| --- | --- | --- |
| `id` | Kayıt kimliği | UUID tercih edilebilir; mock tarafta okunabilir string kullanılır. |
| `owner_id` | Kaydın sahibi | Supabase Auth user id ile ilişkilenecek; tek owner olsa bile RLS için gerekli. |
| `title` | Kart/listede görünen başlık | Public'e taşınacak içeriklerde ayrı public title gerekebilir. |
| `status` | Workflow durumu | Proje/görev/dosya tipine göre enum karar bekler. |
| `priority` | Öncelik | Özellikle task ve roadmap akışında kullanılır. |
| `progress` | Yüzde ilerleme | Proje kartlarında UI amaçlı kullanılabilir. |
| `visibility` | Private/public aday ayrımı | `private`, `owner_only`, `public_candidate` gibi enum kararı bekler. |
| `publish_state` | Public aktarım durumu | `private_draft`, `review_needed`, `publish_candidate`, `blocked` gibi enum kararı bekler. |
| `next_action` | Sonraki yapılacak iş | Studio dashboard ve modül kartlarında görünür. |
| `created_at` / `updated_at` | Zaman takibi | Supabase timestamp alanları beklenir. |
| `archived_at` | Arşivleme | Silme yerine soft archive stratejisi değerlendirilmeli. |

## `studio_projects`

### Amaç
Kişisel projelerin Studio içindeki ana kayıtlarını tutar. Public projeler sayfasına aday içeriklerin kaynağı olabilir.

### Mock karşılığı
`src/features/studio/studio-content.ts` içindeki `mockStudioProjects`.

### Olası alanlar
- `id`
- `owner_id`
- `title`
- `slug` veya public slug adayı
- `summary`
- `status`
- `priority`
- `progress`
- `visibility`
- `publish_state`
- `next_action`
- `public_project_id` veya `related_publication_id`
- `created_at`
- `updated_at`
- `archived_at`

### İlişkiler
- Bir proje birçok `studio_tasks` kaydına sahip olabilir.
- Bir proje birçok `studio_notes` ve `studio_files` kaydıyla ilişkilendirilebilir.
- Public siteye çıkacaksa `publish_queue` / `public_publications` ile ilişki kurabilir.

### Visibility / publish durumu
- Varsayılan private olmalı.
- Public'e çıkabilecek kayıtlar yalnız `public_candidate` + review durumu ile işaretlenmeli.
- Gerçek publish işlemi ayrı onay akışına bağlı olmalı.

### RLS ihtiyacı
- `owner_id = auth.uid()` benzeri owner kuralı gerektirir.
- Public endpoint veya public data view ayrıca ayrılmadan private tablo public client'a açılmamalıdır.

### Studio ekranındaki kullanımı
- `/studio/projects` listesi.
- `/studio` dashboard öne çıkan proje kartı.
- İleride proje detay, roadmap, publish hazırlığı ve file/note ilişkilendirme ekranları.

## `studio_tasks`

### Amaç
Sprint işleri, daily task'ler, blocker'lar ve workstream takiplerini yönetir.

### Mock karşılığı
`src/features/studio/studio-content.ts` içindeki `mockStudioTasks`.

### Olası alanlar
- `id`
- `owner_id`
- `project_id`
- `title`
- `description`
- `status`
- `priority`
- `workstream`
- `due_date` veya `due_label`
- `next_action`
- `visibility`
- `publish_state`
- `created_at`
- `updated_at`
- `completed_at`
- `archived_at`

### İlişkiler
- Opsiyonel olarak `studio_projects.id` ile ilişkilidir.
- Sprint/roadmap modeli ayrıca açılırsa task -> sprint ilişkisi değerlendirilebilir.
- Handoff veya karar dokümanına referans metadata alanı gerekebilir.

### Visibility / publish durumu
- Görevler varsayılan olarak private kalmalı.
- Public siteye doğrudan yayınlanması beklenmez; yalnız public içerik hazırlığına kaynak olabilir.

### RLS ihtiyacı
- Task listesi private çalışma verisi olduğu için owner bazlı RLS şarttır.
- Tamamlandı/archived işlemleri yalnız owner tarafından yapılmalı.

### Studio ekranındaki kullanımı
- `/studio/tasks` durum kolonları.
- `/studio` bugün görünen görevler.
- İleride kanban/list görünümü ve filtreler.

## `studio_notes`

### Amaç
Karar kayıtları, öğrenme notları, içerik fikirleri, kaynaklar ve public yazıya dönüşebilecek taslakları tutar.

### Mock karşılığı
`src/features/studio/studio-content.ts` içindeki `mockStudioNotes`.

### Olası alanlar
- `id`
- `owner_id`
- `project_id`
- `title`
- `category`
- `summary`
- `body_markdown` veya editör kararı sonrası içerik alanı
- `tags`
- `visibility`
- `publish_state`
- `source_target`
- `created_at`
- `updated_at`
- `archived_at`

### İlişkiler
- Opsiyonel olarak `studio_projects` ile ilişkilendirilebilir.
- Public yazıya dönüşecek notlar `publish_queue` ile ilişkilendirilebilir.
- Dosya referansları gerekiyorsa `studio_files` ile many-to-many ilişki ayrıca değerlendirilmeli.

### Visibility / publish durumu
- Varsayılan private draft olmalı.
- Public yazıya dönüşecek notlar explicit review durumuna alınmalı.
- Public'e dönüşüm tek tıkla değil, ayrı publish queue/onay akışıyla yapılmalı.

### RLS ihtiyacı
- Not gövdeleri private bilgi içerebileceği için sıkı owner RLS gerekir.
- Public yazıya dönüşecek içerik ayrı public tablo/view'a taşınmadan public okunabilir yapılmamalıdır.

### Studio ekranındaki kullanımı
- `/studio/notes` bilgi kütüphanesi kartları.
- İleride not editörü, arama, etiket filtreleri ve yazıya dönüştürme akışı.

## `studio_files`

### Amaç
PDF, sunum, görsel, proje çıktısı ve ileride Supabase Storage objelerinin metadata kayıtlarını tutar.

### Mock karşılığı
`src/features/studio/studio-content.ts` içindeki `mockStudioFiles`.

### Olası alanlar
- `id`
- `owner_id`
- `project_id`
- `title`
- `kind`
- `description`
- `storage_bucket`
- `storage_path`
- `mime_type`
- `size_bytes`
- `visibility`
- `publish_state`
- `linked_entity_type`
- `linked_entity_id`
- `created_at`
- `updated_at`
- `deleted_at`

### İlişkiler
- Opsiyonel olarak proje, not veya public publication ile ilişkilendirilebilir.
- Storage object path bilgisi tablo metadata'sında tutulabilir.

### Visibility / publish durumu
- Varsayılan private olmalı.
- Public varlıklar private bucket'tan otomatik sunulmamalı; public asset stratejisi ayrıca kararlaştırılmalı.
- Onaylı public görsellerin hangi bucket/path ile sunulacağı ayrı karar ister.

### RLS ihtiyacı
- Storage bucket ve metadata tablosu birlikte RLS ile korunmalı.
- Delete/upload işlemleri client üzerinden yapılacaksa signed URL veya server action stratejisi ayrıca değerlendirilmeli.

### Studio ekranındaki kullanımı
- `/studio/files` dosya/depolama hazırlık listesi.
- İleride upload, preview, kategori, ilişkilendirme ve silme akışı.

## `publish_queue` veya `public_publications`

### Amaç
Studio içindeki private kayıtların public siteye kontrollü taşınma sürecini temsil eder.

### Mock karşılığı
`src/features/studio/studio-content.ts` içindeki `mockPublishQueue`.

### Olası alanlar
- `id`
- `owner_id`
- `source_type`
- `source_id`
- `target_route`
- `target_type`
- `title`
- `state`
- `review_note`
- `published_slug`
- `published_at`
- `created_at`
- `updated_at`

### İlişkiler
- Kaynak `studio_projects`, `studio_notes` veya `studio_files` olabilir.
- Public içerik tabloları ayrı tasarlanırsa `public_project_id` / `public_post_id` gibi alanlar eklenebilir.

### Visibility / publish durumu
- Publish queue private tarafta yönetilir.
- Public'e çıkan veri ayrı public-safe alanlara dönüştürülmeden public route tarafından okunmamalıdır.
- Review ve onay davranışı kullanıcı kararı bekler.

### RLS ihtiyacı
- Queue private olmalı; yalnız owner erişmeli.
- Public route'lar queue tablosunu değil, temizlenmiş public içerik kaynağını okumalıdır.

### Studio ekranındaki kullanımı
- `/studio` dashboard publish adayı kartı.
- `/studio/projects` ve `/studio/notes` içinde public candidate açıklamaları.
- İleride yayın editörü ve onay ekranı.

## `user_profile` / `owner_settings`

### Amaç
Studio owner ayarları, kimlik doğrulama tercihleri, public profil kararları ve publish varsayılanlarını tutar.

### Mock karşılığı
Şu an doğrudan mock kayıt yoktur; login placeholder ve auth karar dokümanı bu alanı bekleyen karar olarak işaretler.

### Olası alanlar
- `id`
- `auth_user_id`
- `display_name`
- `public_contact_enabled`
- `social_links_reviewed_at`
- `default_visibility`
- `mfa_required`
- `session_timeout_minutes`
- `created_at`
- `updated_at`

### İlişkiler
- Supabase Auth user ile bire bir ilişki.
- Public profil bilgileri ayrı public-safe modelle ayrılabilir.

### Visibility / publish durumu
- Owner settings private kalmalıdır.
- Public profil alanları kullanıcı onayı olmadan aktif edilmemelidir.

### RLS ihtiyacı
- Owner settings yalnız owner tarafından okunup yazılmalıdır.
- Public profil için ayrı view veya public table gerekiyorsa minimum alan paylaşımı yapılmalıdır.

### Studio ekranındaki kullanımı
- Gelecek `/studio/settings` ekranı.
- Login/session davranışı ve public profil yayın tercihleri.

## Açık kararlar

- Public içerik için ayrı tablo mu, yoksa publish edilmiş kayıtların public-safe view'ı mı kullanılacak?
- `publish_queue` tek tablo mu olacak, yoksa proje/yazı/dosya için ayrı queue yapısı mı kurulacak?
- Not editörü Markdown mı, rich text mi olacak?
- Storage bucket private/public ayrımı nasıl yapılacak?
- Soft delete mi, archive modeli mi kullanılacak?
- Owner settings hangi fazda ve hangi route altında açılacak?

## Sprint 05 yürütülebilir SQL eşlemesi

- Initial schema: `supabase/migrations/202607100001_initial_schema.sql`
- Function ve trigger'lar: `supabase/migrations/202607100002_database_functions.sql`
- RLS politikaları: `supabase/migrations/202607100003_rls_policies.sql`
- Storage bucket ve policy'leri: `supabase/migrations/202607100004_storage_setup.sql`
- Development seed: `supabase/seed/202607100001_development_seed.sql`
- Destructive rollback: `supabase/rollback/202607100001_rollback_sprint_05.sql`

Sprint 05 SQL isimleri, bu draft'taki `studio_*` kavramsal adlarını uygulama tarafında daha kısa public schema tablo adlarına (`projects`, `tasks`, `notes`, `files`) dönüştürür. Entegrasyon sırasında Core/Public content mapping ile kolon isimleri ayrıca karşılaştırılmalıdır.

<!-- S07_STUDIO_PROJECT_MODEL_STATUS -->
## Sprint 07 Projects uygulama durumu

Bu belgedeki eski `studio_projects` taslağının Projects bölümü Sprint 07
itibarıyla gerçek `public.projects` migration şemasına bağlanmıştır.

Kullanılan gerçek içerik kolonları:

- title
- slug
- summary
- problem
- approach
- highlights
- next_steps
- status
- visibility
- publish_state
- progress
- is_featured
- github_url
- demo_url
- image_url

Tasks, notes, files ve publish queue bölümleri hâlâ gelecekteki geliştirme
kapsamındadır.
