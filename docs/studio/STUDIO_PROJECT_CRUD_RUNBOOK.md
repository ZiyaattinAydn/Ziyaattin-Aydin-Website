# Studio Projects CRUD Runbook — Sprint 07

Tarih: 2026-07-14
Branch: `feat/studio-project-crud-s07`
Durum: Branch içinde tamamlandı.

## Amaç

Development Supabase üzerinde çalışan ilk gerçek Studio Projects dikey
dilimini işletmek ve doğrulamak.

Bu akış yalnız active owner + current AAL2 oturumunda kullanılabilir.

## Route'lar

- `/studio/projects`
- `/studio/projects/new`
- `/studio/projects/[projectId]/edit`

## Ön koşullar

- Supabase development project healthy olmalıdır.
- Normal owner kullanıcı session'ı kullanılmalıdır.
- Owner profile active owner/admin olmalıdır.
- Current assurance level `aal2` olmalıdır.
- RLS açık kalmalıdır.
- Service role kullanılmamalıdır.

## Mimari sınır

Studio route ve component'leri doğrudan keyfi Supabase mutation yazmaz.

Tüm işlemler Core Sprint 07 server mutation sınırından geçer:

- `listOwnerProjects`
- `getOwnerProject`
- `createProjectDraft`
- `updateProject`
- `transitionProjectPublishState`
- `archiveProject`

Her Core operation şu güvenlik sırasını uygular:

1. Supabase configuration
2. Trusted server user
3. Active owner/admin
4. Current AAL2
5. Typed validation
6. Mutation/transition policy
7. Normal cookie-backed Supabase session
8. RLS

## Liste

`/studio/projects` gerçek development Supabase kayıtlarını server-side okur.

Davranış:

- Active kayıtlar ve archived kayıtlar açık biçimde ayrılır.
- Seed project görünür.
- Mock project verisi gerçek kayıt gibi gösterilmez.
- Empty ve generic error durumları vardır.
- Supabase internal hata ayrıntıları gösterilmez.

## Create

Yeni kayıt varsayılan olarak draft oluşturulur.

Client yalnız izinli project alanlarını gönderir.

Client şunları gönderemez:

- `owner_id`
- `id`
- `publish_state`
- approval sonuçları
- timestamp alanları

Owner ilişkisi server tarafında trusted session üzerinden belirlenir.

Duplicate slug güvenli `slug_conflict` kullanıcı mesajına dönüşür.

Başarılı create sonrasında yalnız güvenli internal route'a yönlendirme yapılır.

## Edit

Edit route project UUID'sini ve kaydı server-side doğrular.

Kayıt bulunamaması ile yetkisiz kayıt ayrıntısı kullanıcıya ayrıştırılmaz.

Kullanılabilen içerik alanları:

- title
- slug
- summary
- problem
- approach
- highlights
- next steps
- status
- visibility
- progress
- featured
- GitHub URL
- demo URL
- image URL

Boş string ve null normalizasyonu Core validation sözleşmesine göre yapılır.

## Publish-state

Canonical state'ler:

- `draft`
- `review`
- `approved`
- `published`
- `unpublished`
- `archived`

İzinli geçişler:

| Mevcut | Hedef |
|---|---|
| draft | review, archived |
| review | draft, approved, archived |
| approved | review, published, archived |
| published | unpublished, archived |
| unpublished | published, archived |
| archived | terminal |

UI yalnız izinli hedefleri gösterir.

Server mevcut state ve hedef state'i tekrar doğrular.

Published için:

- title zorunlu
- slug zorunlu
- summary zorunlu
- visibility public
- link/image değeri varsa approval koşulu
- `published_at` database trigger tarafından yönetilir

Publish queue bu sprintte kullanılmaz.

## Slug kilidi

Slug yalnız draft ve review kayıtlarında değiştirilebilir.

Şu state'lerde slug kilitlidir:

- approved
- published
- unpublished

Slug history ve redirect sistemi eklenene kadar bu kural korunur.

UI kilidi tek güvenlik katmanı değildir; Core mutation server-side reddeder.

## Archive

Hard delete yoktur.

Archive işlemi:

- kullanıcıdan açık confirmation ister
- active owner + current AAL2 kontrolünden geçer
- state'i `archived` yapar
- visibility değerini private yapar
- public görünürlüğü sona erdirir
- project row'unu ve child ilişkilerini korur

Restore UI bu sprintte yoktur.

## Güvenli hata mesajları

UI'da gösterilebilen durumlar:

- zorunlu alan
- geçersiz slug
- geçersiz URL
- slug kullanımda
- izin verilmeyen state geçişi
- MFA gerekli
- yetkisiz işlem
- genel kayıt hatası

Gösterilmeyen bilgiler:

- SQL
- policy adı
- table/schema adı
- UUID
- token
- Supabase internal hata mesajı
- database constraint ayrıntısı

## Cache ve revalidation

Başarılı mutation sonrasında gerektiğinde:

- `/studio/projects`
- ilgili Studio edit route
- `/projects`
- ilgili public project slug route

revalidate edilir.

External redirect değeri kabul edilmez.

Production Public source bu sprintte mock kalır.

## Local acceptance

Başarılı sonuçlar:

- gerçek env'siz build
- project list
- draft create
- validation
- duplicate slug
- edit
- izinli state transition'lar
- published slug lock
- archive confirmation
- archive
- raw error gizleme
- logout protection
- AAL1 projects guard
- non-owner projects guard

## Preview acceptance

Vercel Preview üzerinde başarılı sonuçlar:

- Preview Ready
- login + TOTP
- project list
- draft create
- validation
- duplicate slug
- edit
- draft → review → approved → published
- published slug lock
- archive confirmation
- archive
- raw error gizleme
- logout protection
- AAL1 guard
- non-owner guard

Preview development Supabase environment kullanır.

Production environment değiştirilmemiştir.

Preview URL repository'ye sabitlenmez.

## Secret ve environment kuralları

Commit edilmemesi gerekenler:

- Supabase URL'nin gerçek değeri
- publishable key'nin gerçek değeri
- service-role/secret key
- database password
- owner UUID
- TOTP secret
- access/refresh token
- `.env.local`

Yeni environment değişkeni eklenmemiştir.

## Kapsam dışı

- Production Supabase
- Public production database cutover
- Files/Storage UI
- Tasks CRUD
- Notes CRUD
- Writings CRUD
- Publish queue UI
- Hard delete
- Restore UI
- Slug history
- PWA
- Audit advisory force upgrade

## Entegrasyon kontrolü

Integration merge sırası:

1. Core
2. Public
3. Studio

Integration, main merge ve push öncesinde kullanıcıdan açık onay istemelidir.
