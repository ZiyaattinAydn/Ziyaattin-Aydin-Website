# Public Database Mapping

> Sprint 05 sözleşme çıktısıdır. Bu belge migration, SQL veya Supabase implementasyonu değildir. Amaç `src/data/mock-content.ts` alanlarını Studio hattında planlanan database kavramlarıyla eşlemek ve Public tüketim sınırını kesinleştirmektir.

## Temel kararlar

- Public kayıtların kalıcı kaynak hedefleri `projects`, `writings`, `journey_items` ve `owner_profiles` tablolarıdır.
- Studio review/publish talebi `publish_queue` üzerinden yönetilebilir; Public route doğrudan `publish_queue` okumaz.
- Anonymous okuma için zorunlu birleşik koşul: `publish_state = published` **ve** `visibility = public`.
- `owner_id`, review notları, private Studio alanları, audit verileri ve publish queue ayrıntıları Public response içine taşınmaz.
- Aşağıdaki kolon adları Studio Sprint 05 SQL hattıyla hizalama hedefidir; kesin migration sözleşmesi değildir.

## Ortak alan eşlemesi

| Mock / sözleşme alanı | Önerilen kolon | Tip | Null? | Public? | Studio düzenler? | Onay? | Fallback | Migration notu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | `id` | `uuid` | Hayır | Hayır | Sistem | Hayır | Yok | Primary key. |
| — | `owner_id` | `uuid` | Hayır | Hayır | Sistem/owner | Hayır | Yok | `auth.users(id)` ilişkisi; response dışı. |
| `visibility` | `visibility` | enum/text | Hayır | Dolaylı | Evet | Evet | Public değilse `notFound()` | Hedef değerler: `public`, `hidden`, `private`. Eski `unlisted`, karar verilene kadar `hidden` kabul edilir. |
| `publishState` / `publishFlowState` | `publish_state` | enum/text | Hayır | Dolaylı | Evet | Evet | Published değilse `notFound()` | Hedef değerler: `draft`, `review`, `approved`, `published`, `unpublished`, `archived`. Tek canonical workflow alanına indirgenir. |
| `isFeatured` | `is_featured` | boolean | Hayır | Evet | Evet | Hayır | `false` | Featured olmak görünürlük sağlamaz. |
| `sourceNote` | `source_note` | text | Evet | Sınırlı | Evet | Evet | UI'da gösterilmez | Production'da internal not olabilir; public response'a yalnız açıkça public-safe ise alınır. |
| `approvalNote` | `approval_note` veya review metadata | text | Evet | Hayır | Evet | Evet | Gösterilmez | Public UI debug/review notu olarak taşınmamalı. |
| — | `created_at` | `timestamptz` | Hayır | Hayır | Sistem | Hayır | Yok | Varsayılan `now()`. |
| — | `updated_at` | `timestamptz` | Hayır | Hayır | Sistem | Hayır | Yok | Trigger ile güncellenebilir. |
| — | `published_at` | `timestamptz` | Evet | Evet | Workflow | Evet | Sıralamada `updated_at` | Yalnız published geçişinde set edilir. |
| — | `archived_at` | `timestamptz` | Evet | Hayır | Workflow | Evet | Yok | Archived geçişinde set edilir. |

## Projects → `projects`

| Mevcut mock alanı | Önerilen database kolonu | Tip | Null? | Public görünür? | Studio düzenler? | Kullanıcı onayı? | Fallback | Migration notu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `slug` | `slug` | text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | Unique, normalize edilmiş ve değişim politikası belirlenmiş olmalı. |
| `title` | `title` | text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | Boş başlık yayınlanamaz. |
| `description` | `description` | text | Hayır | Evet | Evet | Evet | `summary` kısaltılır | Liste kartı kısa açıklaması. |
| `status` | `status` | text/enum | Hayır | Evet | Evet | Evet | `Planlandı` benzeri nötr durum | Ürün iş durumu; publish state değildir. |
| `statusLabel` | `status_label` | text | Evet | Evet | Evet | Evet | `status` kullanılır | Public yardımcı etiket. |
| `progress` | `progress` | smallint | Hayır | Evet | Evet | Evet | `0` | `0–100` constraint. Gerçek metrik olduğu doğrulanmalı. |
| `category` | `category` | text | Evet | Evet | Evet | Evet | `Genel` | İleride kategori tablosuna ayrılabilir. |
| `timeframe` | `timeframe_label` | text | Evet | Evet | Evet | Evet | Gösterilmez | Gerçek tarih iddiası taşımamalı. |
| `contentState` | — | — | — | — | — | — | — | UI yardımcı alanı; canonical `publish_state` ile değiştirilir. |
| `technologies` | `technologies` | text[]/jsonb | Hayır | Evet | Evet | Evet | `[]` | İlk migration için array/jsonb; relation kararı sonraya kalabilir. |
| `summary` | `summary` | text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | Detay sayfası zorunlu public alanı. |
| `problem` | `problem` | text | Evet | Evet | Evet | Evet | Bölüm gizlenir | Boşsa başlık render edilmez. |
| `approach` | `approach` | text | Evet | Evet | Evet | Evet | Bölüm gizlenir | — |
| `highlights` | `highlights` | jsonb/text[] | Hayır | Evet | Evet | Evet | `[]` | Sıralı string listesi. |
| `technicalNotes` | `technical_notes` | jsonb/text[] | Hayır | Evet | Evet | Evet | `[]` | Yalnız public-safe teknik notlar. |
| `milestones` | `milestones` | jsonb | Hayır | Evet | Evet | Evet | `[]` | `{label, detail}` şeması doğrulanmalı. |
| `learnings` | `learnings` | jsonb/text[] | Hayır | Evet | Evet | Evet | `[]` | Gerçek kişisel deneyim iddiası kullanıcı onayı gerektirir. |
| `nextSteps` | `next_steps` | jsonb/text[] | Hayır | Evet | Evet | Evet | `[]` | — |
| `publicNotes` | `public_notes` | jsonb/text[] | Hayır | Evet | Evet | Evet | `[]` | Internal review notlarıyla karıştırılmaz. |
| `visibilityNote` | — | — | — | — | — | — | — | Mock UI açıklaması; production kolonu olmamalı veya `source_note` içinde internal kalmalı. |
| `links.demo.href` | `demo_url` | text | Evet | Koşullu | Evet | Evet | Anchor render edilmez | URL formatı + approval gerekir. |
| `links.github.href` | `github_url` | text | Evet | Koşullu | Evet | Evet | Anchor render edilmez | Private repo URL'si public alana taşınmaz. |
| `links.*.approvalState` | `link_approval_state` | enum/text veya ayrı metadata | Hayır | Dolaylı | Evet | Evet | `missing` | Tek state iki link için yetersizse `demo_link_approval_state` ve `github_link_approval_state` ayrılır. |
| — | `image_url` / `image_asset_id` | text/uuid | Evet | Koşullu | Evet | Evet | Görsel bloğu gizlenir | Storage kararı sonrası kesinleşir. |
| — | `image_approval_state` | enum/text | Hayır | Dolaylı | Evet | Evet | `missing` | Approved değilse görsel final içerik gibi sunulmaz. |

## Writings → `writings`

| Mevcut mock alanı | Önerilen database kolonu | Tip | Null? | Public görünür? | Studio düzenler? | Kullanıcı onayı? | Fallback | Migration notu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `slug` | `slug` | text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | Unique. |
| `title` | `title` | text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | — |
| `excerpt` | `excerpt` | text | Hayır | Evet | Evet | Evet | İlk section'dan güvenli özet | Otomatik özet üretimi ayrı karar. |
| `category` | `category` | text | Evet | Evet | Evet | Evet | `Genel` | — |
| `tags` | `tags` | text[]/jsonb | Hayır | Evet | Evet | Evet | `[]` | — |
| `date` | `published_at` | timestamptz | Evet | Evet | Workflow | Evet | Tarih gösterilmez | Mock `"Mock tarih"` seed edilmez. |
| `updatedLabel` | — | — | — | — | — | — | — | `updated_at` üzerinden UI üretir. |
| `readingTime` | `reading_time_minutes` | smallint | Evet | Evet | Evet/hesaplanan | Hayır | Gösterilmez | String yerine dakika sayısı. |
| `sortOrder` | `sort_order` | integer | Evet | Hayır | Evet | Hayır | `0` | Manuel sıralama gerekiyorsa. |
| `coverLabel` | — | — | — | — | — | — | — | Mock görsel etiketi; gerçek cover alanına taşınmaz. |
| `isDraft` | — | — | — | — | — | — | — | Canonical `publish_state` ile değiştirilir. |
| `placeholderNote` | — | — | — | — | — | — | — | Development-only; production seed'e taşınmaz. |
| `sections` | `content` veya `body` | jsonb/text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | İlk sürümde section JSONB; editor kararı sonrası değişebilir. |
| `relatedSlugs` | relation/join tablo | uuid[]/join | Hayır | Evet | Evet | Evet | `[]` | Slug yerine id ilişkisi tercih edilir. |
| `externalLinks` | `external_links` | jsonb | Hayır | Koşullu | Evet | Evet | `[]` | Her öğe için URL ve approval state gerekir. |
| — | `cover_image_url` / `cover_image_id` | text/uuid | Evet | Koşullu | Evet | Evet | Cover bloğu gizlenir | Approved değilse render edilmez. |
| — | `image_approval_state` | enum/text | Hayır | Dolaylı | Evet | Evet | `missing` | Publish state'ten bağımsızdır. |

## Journey items → `journey_items`

| Mevcut mock alanı | Önerilen database kolonu | Tip | Null? | Public görünür? | Studio düzenler? | Kullanıcı onayı? | Fallback | Migration notu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| — | `id` | uuid | Hayır | Hayır | Sistem | Hayır | Yok | Mock modelde id eklenmesi gelecekte yararlı olur. |
| `marker` | `marker` veya `date_label` | text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | Gerçek tarih değilse açık label. |
| `title` | `title` | text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | — |
| `detail` | `detail` | text | Hayır | Evet | Evet | Evet | Kayıt dışlanır | — |
| `lesson` | `lesson` | text | Evet | Evet | Evet | Evet | Bölüm gizlenir | Kişisel deneyim iddiası onaylı olmalı. |
| `statusNote` | `status_note` | text | Evet | Evet | Evet | Evet | Gösterilmez | — |
| `relatedProjectSlug` | `related_project_id` | uuid | Evet | Evet | Evet | Evet | Link gizlenir | Public görünür project'e FK. |
| `relatedWritingSlug` | `related_writing_id` | uuid | Evet | Evet | Evet | Evet | Link gizlenir | Public görünür writing'e FK. |
| — | `sort_order` | integer | Hayır | Hayır | Evet | Hayır | `0` | Liste sıralamasının canonical alanı. |

## Profile/About → `owner_profiles`

| Mevcut mock alanı | Önerilen database kolonu | Tip | Null? | Public görünür? | Studio düzenler? | Kullanıcı onayı? | Fallback | Migration notu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `displayName` | `display_name` | text | Hayır | Evet | Evet | Evet | Site sahibi adı config'ten | Tek owner olsa da kullanıcı onayı korunur. |
| `eyebrow` | `public_eyebrow` | text | Evet | Evet | Evet | Evet | Gizlenir | — |
| `headline` | `public_headline` | text | Evet | Evet | Evet | Evet | Nötr placeholder | — |
| `description` | `public_bio` | text | Evet | Evet | Evet | Evet | Nötr içerik veya bölüm gizleme | Gerçek yaş/eğitim/başarı otomatik eklenmez. |
| `focusAreas` | `focus_areas` | jsonb | Hayır | Evet | Evet | Evet | `[]` | `{title,text}` şeması. |
| `values` | `values` | text[]/jsonb | Hayır | Evet | Evet | Evet | `[]` | — |
| `technologies` | `technologies` | text[]/jsonb | Hayır | Evet | Evet | Evet | `[]` | Uzmanlık iddiası olarak yorumlanmamalı. |
| `portrait.src` | `portrait_url` / `portrait_asset_id` | text/uuid | Evet | Koşullu | Evet | Evet | About portresi render edilmez | Ana sayfa `home-hero.png` bu alandan değiştirilmez. |
| `portrait.alt` | `portrait_alt` | text | Evet | Koşullu | Evet | Evet | Nötr alt | Görsel varsa zorunlu olmalı. |
| `portrait.approvalState` | `portrait_approval_state` | enum/text | Hayır | Dolaylı | Evet | Evet | `candidate` | Yalnız `approved` final portrait render eder. |
| `contactNote` | — | — | — | — | — | — | — | Mock açıklama production verisine taşınmaz. |
| `contactStateLabel` | — | — | — | — | — | — | — | UI türetilir. |
| — | `contact_email` | text | Evet | Koşullu | Evet | Evet | Gösterilmez | Link approval ayrı tutulur. |
| — | `github_url` | text | Evet | Koşullu | Evet | Evet | Anchor render edilmez | Core site config ile tek kaynak kararı gerekir. |
| — | `linkedin_url` | text | Evet | Koşullu | Evet | Evet | Anchor render edilmez | — |
| — | `social_links` | jsonb | Hayır | Koşullu | Evet | Evet | `[]` | Her link ayrı approval state taşımalı. |
| — | `link_approval_state` | jsonb/enum | Hayır | Dolaylı | Evet | Evet | `missing` | Publish state link onayı değildir. |

## `publish_queue` ile ilişki

Public route'lar `publish_queue` tablosunu doğrudan sorgulamaz. Queue kaydı şu alanları taşıyabilir:

- `entity_type`
- `entity_id`
- `requested_by`
- `review_state`
- `reviewed_by`
- `requested_at`
- `reviewed_at`
- `rejection_reason`

Queue yalnız Studio/owner erişimindedir. Onay tamamlandığında canonical content tablosundaki `publish_state`, `visibility`, approval alanları ve `published_at` kontrollü biçimde güncellenir. Public sorgu yalnız canonical tabloyu okur.

## Açık migration kararları

- Project ve writing içindeki sıralı bloklar JSONB mi yoksa ilişkisel alt tablolar mı olacak?
- Link approval tek kolon mu, link başına ayrı kolon/metadata mı olacak?
- `owner_profiles` public profil ile private owner settings'i aynı tabloda mı, ayrı tablolarda mı tutacak?
- Eski `unlisted` değeri database geçişinde `hidden` olarak normalize edilir; anonymous erişim sağlamaz.
- Slug değişiklikleri redirect geçmişi gerektirecek mi?
- Public-safe view veya materialized view kullanılacak mı?

Bu kararlar Studio SQL branch'i ve entegrasyon incelemesi tamamlanmadan kesinleştirilmemelidir.
