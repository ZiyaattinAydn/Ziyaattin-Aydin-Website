# Public Sprint 07 Handoff — Development Project Reads

- Tarih: 2026-07-14
- Çalışma hattı: Pencere 2 — Public Site
- Branch: `feat/public-project-read-s07`
- Base main: `a870f02`
- Core önkoşulu: `origin/feat/core-project-domain-s07@3a6cd87`
- Implementation commit: `fc78b41`
- Final commit: bu kapanış commit'i; teslim çıktısında `git rev-parse --short HEAD` ile doğrulanacak
- Push: başarılı; origin branch ile senkron
- Durum: `S07_PUBLIC_OK`

## Değişen ana dosyalar

- `src/features/public/content/source-policy.ts`
- `src/features/public/content/source-selection.ts`
- `src/features/public/content/supabase-server-query-reader.ts`
- `src/features/public/content/public-content.policy.test.mjs`
- `src/features/public/content/public-project-repository.test.mjs`
- `src/app/(public)/projects/page.tsx`
- `src/app/(public)/projects/[slug]/page.tsx`
- `src/app/(public)/projects/error.tsx`
- `scripts/ts-alias-loader.mjs`
- `scripts/verify-public-project-reads.mjs`
- `docs/content/PUBLIC_SUPABASE_DEVELOPMENT_VERIFICATION.md`
- Public contract, tracking ve changelog belgeleri

## Supabase read doğrulaması

- Existing explicit project list/detail request'leri Core server client factory'ye bağlandı.
- Anonymous filtreler request ve mapper katmanında korunur.
- Production zorunlu mock'tur.
- Local development ve Preview yalnız mevcut source/env sözleşmesi tam ise development reader kullanır.
- Writings, journey ve profile/about bu sprintte mock kalır.

## Source selection sonucu

- Production: mock
- Development/Preview + `PUBLIC_CONTENT_SOURCE=supabase` + iki public env: Supabase projects
- Eksik env: mock + generic server warning
- Aktif reader query hatası: mock fallback yok, unavailable error

## Test kapsamı

- Published/public list ve detail
- Draft/review/approved/unpublished/archived
- Hidden/private
- `published_at = null`
- Unapproved GitHub/demo
- Project image suppression
- Empty list
- Database unavailable
- Production source mock guard

## Environment

Mevcut isimler dışında yeni env eklenmedi:

- `PUBLIC_CONTENT_SOURCE`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Gerçek değerler bu belgeye veya Git'e eklenmez.

## Yapılmayanlar

- Production Supabase
- Production Public database cutover
- Project mutation veya Studio UI
- Writings/journey/profile database cutover
- Files/Storage UI
- Publish queue
- Hard delete
- Slug history
- PWA
- Package upgrade veya audit force fix

## Integration notları

- Merge sırası Core → Public → Studio → Integration korunmalıdır.
- Public branch Core mutation kodunu merge etmedi.
- Integration Core reader/client sınırı ile Public project wiring'i birlikte test etmelidir.
- Production source mock guard tekrar doğrulanmalıdır.
- Main merge ve push öncesinde kullanıcıdan açık onay istenmelidir.

## Doğrulama sonuçları

- Hosted verifier: `PUBLIC_PROJECT_HOSTED_READ_OK`
- Görünür project sayısı: 1
- Doğrulanan published slug: `public-project-read-verification-s07`
- Doğrulanan hidden slug: `studio-supabase-hazirligi`
- Cleanup: verification kaydı `archived + private`; hard delete yok
- Cleanup sonrası anonymous project sorgusu: boş sonuç
- Public policy tests: 8/8
- Project repository tests: 14/14
- `npm run test:supabase`: başarılı
- `npm run lint`: başarılı
- `npm run typecheck`: başarılı
- Gerçek env'siz `npm run build`: başarılı
- `npm audit`: bilinen 2 moderate advisory; force fix uygulanmadı
- Secret/select/tracked-env/scope taramaları: temiz

## Integration'a devredilen kabul

- Vercel Preview project list/detail doğrulaması, Core → Public → Studio birleşiminden sonra Integration tarafından yapılacak.
- Public branch için kalan blocker yok.

## Başarı etiketi

`S07_PUBLIC_OK`

Yerel kalite kapıları, repository policy testleri, hosted development read kabulü, archive cleanup ve push senkronu başarılıdır. Vercel Preview kabulü Integration aşamasına devredilmiştir.
