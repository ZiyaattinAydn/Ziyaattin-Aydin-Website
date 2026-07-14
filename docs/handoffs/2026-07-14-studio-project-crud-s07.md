# Studio Sprint 07 Handoff — Projects CRUD

Tarih: 2026-07-14
Çalışma hattı: Pencere 3 — Studio
Başarı etiketi: `S07_STUDIO_OK`

## Git

- Branch: `feat/studio-project-crud-s07`
- Başlangıç main: `a870f02`
- Core final commit: `3a6cd87`
- Core implementation commit: `47525fd`
- Core merge commit: `ffbe5fb`
- Studio implementation commit: `729e556`
- Final documentation commit: bu handoff'u içeren commit
- Push hedefi: `origin/feat/studio-project-crud-s07`

## Teslim edilen dikey dilim

Active owner + current AAL2 altında gerçek development Supabase Projects
yönetimi uygulanmıştır.

Route'lar:

- `/studio/projects`
- `/studio/projects/new`
- `/studio/projects/[projectId]/edit`

Özellikler:

- server-side project list
- seed project görünürlüğü
- draft create
- project edit
- typed field validation
- duplicate slug güvenli mesajı
- publish-state controls
- server-side state transition doğrulaması
- published/unpublished slug kilidi
- açık confirmation ile archive
- loading/pending/disabled durumları
- responsive ve erişilebilir formlar
- güvenli hata sunumu
- mutation sonrası cache/path revalidation

## Core kullanımı

Studio Core dosyalarını kopyalamamıştır.

Şu Core server operation'ları kullanılır:

- `listOwnerProjects`
- `getOwnerProject`
- `createProjectDraft`
- `updateProject`
- `transitionProjectPublishState`
- `archiveProject`

Client input'u doğrudan Supabase mutation'a aktarılmaz.

## Güvenlik

- Her read/mutation active owner + current AAL2 doğrular.
- Proxy tek güvenlik katmanı değildir.
- Normal cookie-backed owner session kullanılır.
- RLS açıktır ve nihai database sınırıdır.
- Service role kullanılmaz.
- Client `owner_id` gönderemez.
- Owner e-postası veya UUID source authorization içinde hard-code edilmez.
- Hard delete servisi veya `.delete()` çağrısı yoktur.
- Published/unpublished slug değişikliği server-side engellenir.
- Raw Supabase/PostgreSQL hatası UI'ya çıkmaz.
- External redirect kabul edilmez.
- Production Public source mock kalır.

## Project list

- Gerçek Supabase kayıtları server-side okunur.
- Development seed project görünür.
- Active ve archived kayıtlar ayrılır.
- Mock Studio project kayıtları gerçek veri olarak gösterilmez.
- Empty/error durumları güvenli şekilde gösterilir.

## Create

- Yeni project draft olarak oluşturulur.
- Güvenli visibility varsayılanı kullanılır.
- Owner ilişkisi trusted server session'dan gelir.
- Duplicate slug güvenli kullanıcı mesajına dönüşür.
- Double-submit/pending koruması vardır.
- Başarı sonrası güvenli internal yönlendirme uygulanır.

## Edit

- Project ID server-side UUID validation'dan geçer.
- Mevcut row owner session ve RLS ile okunur.
- Database-managed alanlar client'tan kabul edilmez.
- Null/empty normalization Core sözleşmesini kullanır.
- Draft/review slug değişikliği mümkündür.
- Approved/published/unpublished slug kilitlidir.

## State transition

Uygulanan canonical state'ler:

- draft
- review
- approved
- published
- unpublished
- archived

UI yalnız izinli hedefleri gösterir.

Server transition policy'yi yeniden doğrular.

Published geçişinde zorunlu content, public visibility ve approval koşulları
korunur.

Publish queue eklenmemiştir.

## Archive

- Hard delete yoktur.
- Açık confirmation vardır.
- Archive row'u database'de korur.
- Visibility private olur.
- Public görünürlük sona erer.
- Child kayıtlar silinmez.
- Restore UI eklenmemiştir.

## Dependencies

Yeni npm bağımlılığı eklenmemiştir.

## Environment

Yeni environment değişkeni eklenmemiştir.

Local ve Preview mevcut development değişkenlerini kullanır:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Service role eklenmemiştir.

`.env.local` tracked değildir.

Production environment değiştirilmemiştir.

Production Supabase oluşturulmamış ve kullanılmamıştır.

## Automated testler

Başarılı sonuçlar:

- `npm run test:supabase`
- `npm run test:projects` — 43 assertion
- `npm run test:studio-projects` — 25 assertion
- `node scripts/verify-studio-auth.mjs`
- `node scripts/verify-s06-studio-final.mjs`
- `node scripts/verify-s07-studio-final.mjs`
- `npm run lint`
- `npm run typecheck`
- gerçek env'siz `npm run build`
- `git diff --check`

Lint'te Core verifier içindeki kullanılmayan `domain` değişkeni için bir warning
bulunmaktadır. Error değildir ve kalite komutu başarılıdır. Studio
implementasyonundan kaynaklanmamaktadır.

## Local manual acceptance

- true envless build: başarılı
- project list: başarılı
- create draft: başarılı
- validation: başarılı
- duplicate slug: başarılı
- edit: başarılı
- state transitions: başarılı
- published slug lock: başarılı
- archive confirmation: başarılı
- archive: başarılı
- raw error hidden: başarılı
- logout protection: başarılı
- AAL1 projects guard: başarılı
- non-owner projects guard: başarılı

## Preview manual acceptance

- Preview Ready: başarılı
- project list: başarılı
- create: başarılı
- validation: başarılı
- duplicate slug: başarılı
- edit: başarılı
- state transitions: başarılı
- published slug lock: başarılı
- archive confirmation: başarılı
- archive: başarılı
- raw error hidden: başarılı
- logout protection: başarılı
- AAL1 guard: başarılı
- non-owner guard: başarılı
- Production env unchanged: doğrulandı

Preview URL Vercel Dashboard'da doğrulandı; repository'ye sabitlenmedi.

## Development Supabase

- Development project kullanıldı.
- Region: Southeast Asia (Singapore).
- Normal owner session + RLS kullanıldı.
- Active owner + AAL2 kabul testleri geçti.
- Acceptance kayıtları archive ile korundu.
- Yeni migration uygulanmadı.
- Production Supabase'e dokunulmadı.

## Secret taraması

- Gerçek Supabase URL/key yok.
- Service-role/secret key yok.
- Owner e-postası source içinde yok.
- Owner UUID yok.
- TOTP secret yok.
- Client `owner_id` alanı yok.
- Hard delete çağrısı yok.
- `.env.local` tracked değil.

## Build

Next.js production build gerçek env'siz durumda başarılıdır.

Public mock davranışı korunur.

Auth/Studio environment yokken fail-closed davranışı korunur.

## Audit

- 2 moderate vulnerability
- `postcss <8.5.10`
- Advisory: `GHSA-qx2v-qp2m-jg93`
- `npm audit fix --force` çalıştırılmadı
- Force çözüm kırıcı Next.js downgrade önerdiği için uygulanmadı

## Yapılmayanlar

- Public production database cutover
- Production Supabase
- Production migration
- Files/Storage UI
- Tasks, notes ve writings CRUD
- Publish queue UI
- Hard delete
- Restore UI
- Slug history/redirect
- PWA
- Push notification
- Service role
- Package force upgrade

## Blockerlar

Yok.

## Integration notları

- Merge sırası Core → Public → Studio olmalıdır.
- Core ancestry korunmalıdır.
- Public production source mock kalmalıdır.
- Studio server actions Core mutation sınırını kullanmaya devam etmelidir.
- Tracking conflict'leri semantik çözülmelidir.
- Hard delete veya service-role tabanlı çözüm eklenmemelidir.
- Main merge ve push öncesinde açık kullanıcı onayı alınmalıdır.

## Sonuç

`S07_STUDIO_OK`
