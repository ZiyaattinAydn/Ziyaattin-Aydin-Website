# Public Repository Boundary — Sprint 06

> Bu belge `feat/public-supabase-adapter-s06` branch'indeki gerçek implementasyon sınırını açıklar. Production database cutover yapılmamıştır.

## Amaç

Public route bileşenleri veri kaynağından ayrılmıştır. Route'lar project, writing ve journey içeriklerini yalnız `PublicContentRepository` sözleşmesi üzerinden okur. Böylece mock veri ve gelecekteki Supabase reader aynı Public DTO'larını üretir.

## Katmanlar

- `model.ts`: Public-safe canonical DTO ve durum tipleri.
- `visibility.ts`: `published + public + published_at` görünürlük kapısı ve legacy `unlisted -> hidden` normalizasyonu.
- `approvals.ts`: link ve image/portrait approval filtreleri ile güvenli URL doğrulaması.
- `repository.ts`: liste, detail, featured, related ve profile sorgu sözleşmesi.
- `mock-repository.ts`: mevcut `src/data/mock-content.ts` verisini repository arkasına alan production-safe adapter.
- `supabase-query-reader.ts`: Core hattının sağlayacağı query executor için dependency-free interface.
- `supabase-repository.ts`: explicit select kolonları, açık anonymous filtreleri ve public-safe row mapper.
- `source-policy.ts` / `source-selection.ts`: environment seçimi ve production mock kilidi.

## Mock davranışı

Production bu sprintte bilinçli olarak mock repository kullanır. Mevcut sayfa görünümü ve mock kartları korunur. Legacy mock kayıtların draft/review etiketleri UI'da görünmeye devam eder; repository içindeki ayrı fixture access envelope yalnız mevcut mock sunumu korumak içindir ve database row'larına uygulanmaz.

Mock mapper şu güvenlik kurallarını uygular:

- `unlisted` değeri `hidden` olarak normalize edilir.
- Pending/missing link URL'leri Public DTO'dan kaldırılır.
- Candidate About portrait onaylı image DTO'suna dönüşmez.
- Project/writing image alanları onaylı veri olmadığı için `null` kalır.

## Supabase adapter sınırı

Adapter doğrudan Supabase SDK import etmez ve Core helper kopyalamaz. Integration sonrasında Core hattı `PublicQueryReader` implementasyonu sağlayabilir.

Sorgular:

- `select *` kullanmaz.
- Yalnız explicit public-safe kolonları ister.
- RLS yanında açıkça `visibility = public`, `publish_state = published` ve `published_at IS NOT NULL` filtrelerini taşır.
- Detail sorgusunda slug filtresini aynı public filtrelerle birleştirir.
- Featured sorgusunda `is_featured = true` ekler; featured bayrağı görünürlüğü geçersiz kılmaz.
- Related writings sorgusunda yalnız görünür slug'ları döndürür.

Database response'u doğrudan component props olarak kullanılmaz. Mapper zorunlu alan, state, approval, URL ve writing content doğrulaması yaptıktan sonra Public DTO üretir.

## Veri kaynağı seçimi

Planlanan server-only değişken:

```text
PUBLIC_CONTENT_SOURCE=mock|supabase
```

Kurallar:

- Değişken eksik veya geçersizse `mock`.
- Vercel Production veya normal production runtime bu sprintte her zaman `mock`.
- Supabase yalnız non-production ortamında açıkça seçilebilir.
- Supabase seçilmiş fakat Core query reader bağlanmamışsa server warning yazılır ve configuration-level güvenli mock fallback uygulanır.
- Gerçek Supabase reader aktif olduktan sonra query/database hatası mock'a dönmez; `PublicRepositoryUnavailableError` üretir.
- `.env.example` Public branch sahipliği dışında olduğu için değiştirilmemiştir.

## notFound ve fallback

- Detail repository sonucu `null` ise route tek tip `notFound()` çağırır.
- Slug yokluğu ile draft/private/hidden/unpublished/archived kayıt public kullanıcıya ayrıştırılmaz.
- Liste ve featured sonuçları boşsa erişilebilir nötr empty state render edilir.
- Database error ayrıntısı, tablo adı, policy veya Supabase mesajı client'a aktarılmaz.
- Production'ın mock seçmesi database error fallback değildir; cutover öncesi bilinçli kaynak seçimidir.

## Approval ayrımı

Content publish state, content visibility, link approval, image approval ve portrait approval bağımsız kapılardır. Bir alanın approved olması başka alanı otomatik onaylamaz. About candidate portrait gizlenir; ana sayfadaki sabit onaylı `home-hero.png` değiştirilmez.

## Mevcut şema boşlukları

Integration sırasında şu farklar korunmalıdır:

- Sprint 05 SQL şemasında public profile tablosu yoktur; Supabase profile read bilinçli olarak unavailable bırakılmıştır.
- Projects tablosunda demo ve GitHub için tek `link_approval_state` vardır; link başına approval genişlemesi gelecekte gerekir.
- Mevcut project SQL şeması kategori, technologies, milestones ve bazı detay alanlarını taşımaz; mapper bunları uydurmaz, güvenli boş değer kullanır.
- Writing `content` kolonu JSON section array veya güvenli düz metin olarak map edilir; geçersiz/boş detail content public detail için geçersizdir.
- Slug history/redirect sistemi bu sprintte uygulanmamıştır.

## Test ve doğrulama

Node 22 built-in test runner ile policy testleri şunları kapsar:

- published/public/published_at görünürlüğü,
- draft/private/null published_at reddi,
- legacy visibility normalizasyonu,
- link approval ve URL güvenliği,
- candidate portrait/image reddi,
- production default mock ve explicit preview Supabase seçimi.

Yeni test framework'ü veya npm bağımlılığı eklenmemiştir.
