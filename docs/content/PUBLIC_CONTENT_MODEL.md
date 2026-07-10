# Public Content Model Contract

Sprint 03 kapsamında bu belge, mevcut `src/data/mock-content.ts` mock verileri ile ileride Supabase/PostgreSQL üzerinden gelecek gerçek public içerikler arasındaki sözleşmeyi tanımlar.

Bu sprintte database migration, Supabase client, Auth, Storage veya RLS implementasyonu yapılmaz. Amaç; public site tarafındaki alan adlarını, görünürlük kurallarını ve link güvenliğini Faz 3 kararlarına hazır hâle getirmektir.

## Genel ilkeler

- Public site yalnız `visibility = public` ve uygun `publishState` değerine sahip kayıtları göstermelidir.
- `draft` içerik gerçek production yayınında listelenmemeli; mock/dev ortamında açıkça taslak olduğu belirtilerek kullanılabilir.
- Gerçek demo, GitHub, sosyal, iletişim veya dış kaynak linki bilinmiyorsa alan `null`, `undefined` veya boş liste kalmalıdır.
- Boş link alanları aktif `<a>` veya `Link` gibi render edilmemelidir; pasif açıklama veya `aria-disabled` metin gösterilebilir.
- Portre/görsel alanları yalnız kullanıcı onayı veya Studio tarafında açık `approved` durumu varsa final içerik gibi sunulmalıdır.
- Studio publish akışı hazır olana kadar public içeriklerin kaynağı `mock-content.ts` içinde kalır.

## Ortak yayın alanları

Aşağıdaki alanlar project, writing ve journey kayıtlarında ortak davranış için kullanılabilir:

| Alan | Mock durumu | Gelecek database karşılığı | Public kural |
| --- | --- | --- | --- |
| `visibility` | `public`, `unlisted`, `private` union tipi | enum veya check constraint | Yalnız `public` kayıtlar listelenir; `unlisted` doğrudan slug ile açılabilir kararına ihtiyaç var; `private` asla public render edilmez. |
| `publishState` | `draft`, `review`, `published` union tipi | enum | Production public listelerde `published` beklenir; mock sprintlerde `draft/review` açık etiketle gösterilebilir. |
| `isFeatured` | boolean | boolean | Ana sayfa/öne çıkan bloklarında sıralama için kullanılır. |
| `sourceNote` | kısa açıklama | text | Mock, Studio veya gerçek içerik kaynağını yanıltmadan açıklar. |

## Project

### Mevcut mock alanları

- `slug`
- `title`
- `description`
- `status`
- `statusLabel`
- `progress`
- `category`
- `timeframe`
- `contentState`
- `visibility`
- `publishState`
- `isFeatured`
- `sourceNote`
- `visibilityNote`
- `technologies`
- `summary`
- `problem`
- `approach`
- `highlights`
- `technicalNotes`
- `milestones`
- `learnings`
- `nextSteps`
- `publicNotes`
- `links.demo.href`
- `links.github.href`

### Gelecekteki database alanları

Önerilen temel tablo alanları:

- `id`
- `slug`
- `title`
- `description`
- `status`
- `status_label`
- `progress`
- `category`
- `timeframe`
- `visibility`
- `publish_state`
- `is_featured`
- `source_note`
- `visibility_note`
- `summary`
- `problem`
- `approach`
- `technologies` veya ayrı `project_technologies`
- `highlights`
- `technical_notes`
- `milestones`
- `learnings`
- `next_steps`
- `public_notes`
- `demo_url`
- `github_url`
- `created_at`
- `updated_at`
- `published_at`

### Public görünürlük kuralı

- Liste sayfası yalnız public görünür kayıtları göstermelidir.
- `publishState = draft` veya `review` olan kayıtlar production public listede gösterilmeden önce Studio publish onayı gerektirir.
- Mock ortamda bu kayıtlar görünürse kart ve detay sayfasında taslak/review etiketi gösterilir.

### Link kuralı

- `links.demo.href` veya `links.github.href` boşsa aktif link render edilmez.
- Boş linklerde “Yakında”, “Doğrulama bekliyor” veya benzeri pasif açıklama kullanılır.
- Uydurma URL eklenmez.

### Studio publish ilişkisi

Studio tarafında proje düzenleme formu ileride bu alanları üretebilir. Studio, public siteye sadece seçilen alanları ve onaylı linkleri göndermelidir. Private notlar, gerçek loglar, gizli repo linkleri veya doğrulanmamış görseller public tabloya taşınmamalıdır.

## Writing

### Mevcut mock alanları

- `slug`
- `title`
- `excerpt`
- `category`
- `tags`
- `date`
- `updatedLabel`
- `readingTime`
- `sortOrder`
- `coverLabel`
- `visibility`
- `publishState`
- `isFeatured`
- `isDraft`
- `sourceNote`
- `placeholderNote`
- `sections`
- `relatedSlugs`
- `externalLinks`

### Gelecekteki database alanları

- `id`
- `slug`
- `title`
- `excerpt`
- `category`
- `tags`
- `reading_time_minutes`
- `cover_image_id` veya `cover_label`
- `visibility`
- `publish_state`
- `is_featured`
- `source_note`
- `placeholder_note`
- `sections` veya ayrı `writing_sections`
- `related_writing_ids` veya join tablo
- `external_links`
- `created_at`
- `updated_at`
- `published_at`

### Public görünürlük kuralı

- Gerçek public listede yalnız `visibility = public` ve `publishState = published` kayıtları gösterilmelidir.
- Taslak veya review içerikler preview/studio kontrolü olmadan production public akışında görünmemelidir.
- Mock sprintlerde taslak durum açıkça gösterilebilir.

### Link ve kaynak kuralı

- `externalLinks` boşsa yazı detayında pasif kaynak durumu gösterilir.
- Link objesinde `href` yoksa aktif link render edilmez.
- Dış kaynaklar gerçek ve onaylı olmadan eklenmez.

### Studio publish ilişkisi

Studio yazı editörü ileride section tabanlı içerik, tag, kategori ve dış kaynak listesini yönetebilir. Publish işlemi, taslak içeriğin public alana çıkmasını ayrı bir onay adımıyla yapmalıdır.

## Journey item

### Mevcut mock alanları

- `marker`
- `title`
- `detail`
- `lesson`
- `statusNote`
- `visibility`
- `publishState`
- `isFeatured`
- `sourceNote`
- `relatedProjectSlug`
- `relatedWritingSlug`

### Gelecekteki database alanları

- `id`
- `marker` veya `date_label`
- `title`
- `detail`
- `lesson`
- `status_note`
- `visibility`
- `publish_state`
- `is_featured`
- `source_note`
- `related_project_id`
- `related_writing_id`
- `sort_order`
- `created_at`
- `updated_at`
- `published_at`

### Public görünürlük kuralı

- Gerçek kişisel tarihçe kullanıcı tarafından netleşmeden kesin kronoloji gibi sunulmamalıdır.
- İlgili proje/yazı bağlantıları yalnız var olan public sluglara yönlendirilmelidir.
- Private Studio notları journey public alanına taşınmamalıdır.

### Studio publish ilişkisi

Studio içindeki öğrenme notları veya proje kilometre taşları ileride seçilerek public journey item hâline getirilebilir. Bu dönüşümde kullanıcı onayı ve public-safe metin kontrolü gerekir.

## Profile / about content

### Mevcut mock alanları

- `displayName`
- `eyebrow`
- `headline`
- `description`
- `portrait.src`
- `portrait.alt`
- `portrait.approvalState`
- `portrait.note`
- `focusAreas`
- `values`
- `technologies`
- `contactNote`
- `contactStateLabel`

### Gelecekteki database alanları

- `id`
- `display_name`
- `headline`
- `bio`
- `focus_areas`
- `values`
- `technologies`
- `portrait_asset_id`
- `portrait_approval_state`
- `contact_email`
- `github_url`
- `linkedin_url`
- `social_links`
- `visibility`
- `updated_at`

### Public görünürlük ve onay kuralı

- Hakkımda portresi yalnız `portrait_approval_state = approved` olduğunda final/onaylı gibi sunulmalıdır.
- `about-portrait.png` şu an aday/doğrulama bekleyen portre olarak kalır.
- Gerçek yaş, eğitim, iletişim, sosyal link veya biyografi detayı kullanıcı onayı olmadan eklenmez.
- İletişim ve sosyal linkler Core site config sahipliğiyle uyumlu şekilde yönetilmelidir.

### Studio publish ilişkisi

Profile/about içerikleri Studio’da ayrı bir “public profile” formuyla yönetilebilir. Studio, onaylanmamış portreleri public alanda final kabul etmemeli; gerçek iletişim alanları boşsa public sayfa pasif durum göstermelidir.

## Faz 3 için karar gerektiren noktalar

- `unlisted` içerikler slug ile erişilebilir olacak mı, yoksa tamamen gizli mi kalacak?
- Draft preview Studio içinde mi kalacak, yoksa güvenli preview token ile public route üzerinden mi görüntülenecek?
- Project ve writing section alanları JSONB olarak mı, ayrı tablolar olarak mı tutulacak?
- Görsel/portre onayı Storage metadata içinde mi, yoksa database alanı olarak mı yönetilecek?
- Link doğrulama ve kullanıcı onayı Studio publish formunda zorunlu adım olacak mı?
