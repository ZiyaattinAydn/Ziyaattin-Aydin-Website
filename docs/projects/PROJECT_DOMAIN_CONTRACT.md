# Sprint 07 Project Domain Contract

Durum: `feat/core-project-domain-s07` branch'i içinde uygulanmıştır.

## Kaynak gerçekliği

Bu sözleşme `supabase/migrations/202607100001_initial_schema.sql` içindeki
`public.projects` tablosuna dayanır. Sprint 07 Core herhangi bir schema
migration eklemez.

Gerçek kolonlar:

- `id`, `owner_id`
- `title`, `slug`, `summary`
- `problem`, `approach`, `highlights`, `next_steps`
- `status`, `visibility`, `publish_state`
- `progress`, `is_featured`
- `github_url`, `demo_url`, `link_approval_state`
- `image_url`, `image_approval_state`
- `published_at`, `archived_at`, `created_at`, `updated_at`

Projects tablosunda JSONB section kolonu yoktur. Kontrollü section modeli
mevcut `problem`, `approach`, `highlights` ve `next_steps` kolonları üzerinden
kurulmuştur. Migration'da olmayan alan eklenmemiştir.

## Client ve database alan ayrımı

Client yalnız şu alanları gönderebilir:

- title, slug, summary
- problem, approach, highlights, nextSteps
- status, visibility, progress, isFeatured
- githubUrl, demoUrl, imageUrl

Client şunları gönderemez:

- `id`, `owner_id`
- `publish_state`
- approval sonuçları
- publication/archive timestamp'leri
- created/updated timestamp'leri

Unknown veya database-managed alanlar validation hatasıyla reddedilir.

## Teknik validation limitleri

Aşağıdaki değerler database product constraint'i değil, Sprint 07
server-side savunma limitleridir:

| Alan | Teknik limit |
| --- | --- |
| Title | 140 karakter |
| Slug | 120 karakter |
| Summary | 600 karakter |
| Problem / approach | 12.000 karakter |
| Highlights / next steps | En fazla 40 öğe |
| Liste öğesi | 500 karakter |
| URL | 2.048 karakter |

Slug SQL constraint ile aynı canonical formu kullanır:
`^[a-z0-9]+(-[a-z0-9]+)*$`.

URL alanları boş/null veya yalnız HTTP/HTTPS olabilir. Progress tam sayı ve
0–100 aralığındadır.

## Publish-state geçişleri

| Mevcut | İzinli hedefler |
| --- | --- |
| draft | review, archived |
| review | draft, approved, archived |
| approved | review, published, archived |
| published | unpublished, archived |
| unpublished | published, archived |
| archived | yok |

Publish için title, slug ve summary zorunludur. Değer taşıyan public
link/görsel kendi approval state'inde `approved` değilse publish reddedilir.

`published` geçişi visibility değerini `public` yapar. `unpublished` geçişi
visibility değerini `hidden` yapar. Archive visibility değerini `private`
yapar. `published_at` ve `archived_at` mevcut database trigger'ları tarafından
yönetilir.

## Slug ve archive

- Slug yalnız `draft` ve `review` durumlarında değiştirilebilir.
- `approved`, `published` ve `unpublished` kayıtların slug'ı slug history
  gelene kadar kilitlidir.
- Archive terminal Sprint 07 durumudur; restore eklenmemiştir.
- Hard delete servisi veya `.delete()` çağrısı yoktur.
- Archive kayıt satırını korur ve foreign key ilişkilerini silmez.

## Mutation güvenliği

Her server operation:

1. Supabase runtime configuration
2. trusted server user
3. active owner/admin profile
4. current AAL2
5. typed server validation
6. transition/update policy
7. normal owner session Supabase client
8. RLS owner policy

sırasından geçer.

Service role kullanılmaz. Database hata detayları UI'ya dönmez.
PostgreSQL `23505` hatası güvenli `slug_conflict` domain hatasına çevrilir.

## Studio entegrasyonu

Studio branch şu server-only API'leri kullanabilir:

- `listOwnerProjects`
- `getOwnerProject`
- `createProjectDraft`
- `updateProject`
- `transitionProjectPublishState`
- `archiveProject`

Server Action katmanı mutation sonucuna göre kendi `revalidatePath` ve güvenli
redirect davranışını uygulamalıdır. Client input'u doğrudan Supabase'e
gönderilmemelidir.
