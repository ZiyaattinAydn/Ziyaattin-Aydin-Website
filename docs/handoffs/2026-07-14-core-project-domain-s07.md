# Core Sprint 07 Handoff — Secure Project Domain Mutations

- Tarih: 2026-07-14
- Çalışma hattı: Pencere 1 — Core Foundation
- Branch: `feat/core-project-domain-s07`
- Başlangıç main commit'i: `a870f02`
- Implementation commit: `47525fd`
- Push durumu: `origin/feat/core-project-domain-s07 üzerine ilk push başarılı`
- Preview sonucu: `Feature branch push tetiklendi; Vercel Dashboard sonucu henüz doğrulanmadı`
- Başarı etiketi: `S07_CORE_OK`

## Değişen dosyalar

- `src/features/projects/domain.ts`
- `src/features/projects/validation.ts`
- `src/features/projects/transitions.ts`
- `src/features/projects/database-errors.ts`
- `src/features/projects/mutation-guard.ts`
- `src/features/projects/index.ts`
- `src/features/projects/server/project-mutations.ts`
- `scripts/verify-project-domain.mjs`
- `docs/projects/PROJECT_DOMAIN_CONTRACT.md`
- Sprint 07 tracking ve changelog kayıtları
- `package.json` test script'i

## Domain sözleşmesi

Migration gerçeği kullanıldı. Projects JSONB section alanı varsayılmadı;
`problem`, `approach`, `highlights` ve `next_steps` kontrollü section modeli
olarak map edildi. Database row, form values, create/update input ve mutation
result türleri ayrıldı.

Client `owner_id`, timestamps, publish metadata veya approval sonucu
gönderemez. Unknown alanlar reddedilir.

## Validation

- Title zorunlu; max 140
- Slug canonical; max 120
- Summary max 600
- Problem/approach max 12.000
- Highlights/next steps max 40 öğe, öğe max 500
- Progress integer 0–100
- Canonical status, visibility ve publish-state
- URL yalnız boş/null veya HTTP/HTTPS
- Boş string/null normalizasyonu tutarlı
- Project ID UUID validation

Bu limitler Sprint 07 application guardrail'ıdır; yeni database product
constraint'i değildir.

## Publish transition

- draft → review / archived
- review → draft / approved / archived
- approved → review / published / archived
- published → unpublished / archived
- unpublished → published / archived
- archived → terminal

Publish title/slug/summary gerektirir. Değer taşıyan link ve image approval
state'i approved değilse publish reddedilir. Published visibility public,
unpublished hidden, archive private yapılır. Timestamp'ler mevcut trigger'a
bırakılır.

## Slug ve archive

Slug yalnız draft/review durumunda değişebilir. Approved, published ve
unpublished kayıtlar slug history gelene kadar kilitlidir. Hard delete yoktur.
Archive row ve ilişkileri korur; restore bu sprintte eklenmemiştir.

## Mutation güvenliği

Her read/mutation `getStudioAuthorization()` ve current AAL2 sonrasında normal
cookie-backed owner Supabase client ile çalışır. Query/update owner ID ile
daraltılır ve RLS son otoritedir. Service role kullanılmaz.

Hazırlanan server sınırları:

- owner project list/read
- create draft
- update
- publish-state transition
- archive

Raw Supabase/PostgreSQL hata mesajı dönmez. `23505` güvenli `slug_conflict`
hatasına map edilir.

## Eklenen bağımlılıklar

Yok.

## Environment

Yeni environment değişkeni yok. Env'siz production build ve Auth/Studio
fail-closed davranışı korunur.

## Secret durumu

- Gerçek Supabase URL/key/JWT/password yok
- Gerçek owner UUID yok
- Owner e-postası source authorization alanında yok
- Service role project runtime yolunda yok
- `.env.local` tracked değil

## Test sonuçları

- `npm ci`: `başarılı`
- `npm run test:supabase`: `başarılı`
- `npm run test:projects`: `başarılı — 43 assertion`
- `npm run lint`: `başarılı`
- `npm run typecheck`: `başarılı`
- Env'siz `npm run build`: `başarılı`
- Secret scan: `başarılı; gerçek secret/owner UUID/.env.local/hard delete yok`

## Audit

`2 moderate — postcss <8.5.10 / GHSA-qx2v-qp2m-jg93; breaking npm audit fix --force uygulanmadı.`

`npm audit fix --force` çalıştırılmadı.

## Preview

Feature push automatic Vercel Preview tetiklemelidir. Core branch tek başına
Studio CRUD UI sağlamaz. Production Public source mock kalır.

## Yapılmayan işler

- Studio Projects UI/Server Actions
- Public production database cutover
- Production Supabase
- Files/Storage UI
- Tasks, notes, writings CRUD
- Publish queue UI
- Hard delete
- Slug history/redirect
- Restore
- PWA
- Audit advisory force upgrade
- Schema migration

## Studio entegrasyon notları

- Core branch tamamlandıktan sonra Studio branch'e merge edilmelidir.
- Studio formu domain validator ve mutation result modelini kullanmalıdır.
- Server Actions yalnız server mutation servislerini çağırmalıdır.
- Başarılı mutation sonrasında `/studio/projects`, `/projects` ve ilgili slug
  path'leri ihtiyaca göre revalidate edilmelidir.
- `mfa_required`, `forbidden`, `validation_failed`, `slug_conflict` ve
  `invalid_transition` generic UI durumlarına map edilmelidir.
- Raw database error veya client-supplied owner ID kullanılmamalıdır.

## Blockerlar

Yok. Mevcut schema ve RLS Sprint 07 Core hedefini destekliyor.
