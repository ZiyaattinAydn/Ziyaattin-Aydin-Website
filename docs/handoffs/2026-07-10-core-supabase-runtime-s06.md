# Core Sprint 06 Handoff — Supabase Runtime Foundation

- Tarih: 2026-07-10
- Çalışma hattı: Pencere 1 — Core Foundation
- Branch: `feat/core-supabase-runtime-s06`
- Başlangıç main commit'i: `0c9d1bb`
- Runtime foundation commit'i: `6d51ff3`
- Dokümantasyon commit'i: `392144b`
- Push durumu: `origin/feat/core-supabase-runtime-s06` üzerine pushlandı
- Başarı etiketi: `S06_CORE_OK`

## Tamamlanan işler

- `@supabase/supabase-js@2.110.2`
- `@supabase/ssr@0.12.0`
- Canonical env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`
- Lazy environment validation; module import sırasında build düşürmüyor
- Browser client: `src/lib/supabase/client.ts`
- Server client: `src/lib/supabase/server.ts`
- Proxy refresh client: `src/lib/supabase/proxy.ts`
- Next.js 16 Proxy: `src/proxy.ts`
- Server-only service-role presence sınırı: `src/lib/supabase/server-environment.ts`
- Güvenli redirect: `src/lib/auth/safe-redirect.ts`
- Saf AAL/owner kuralları: `src/lib/auth/studio-authorization-rules.ts`
- Trusted user/owner/MFA helper: `src/lib/auth/studio-authorization.ts`
- Runtime doğrulama: `scripts/verify-supabase-runtime.mjs`

## Runtime davranışı

- Public mock sayfalar Supabase env olmadan build olur.
- `/login` ve `/studio/**` env eksikken generic 503 ile fail closed olur.
- Studio route session yoksa Proxy güvenli `/login?next=...` yönlendirmesi üretir.
- Proxy yalnız session refresh ve erken redirect katmanıdır.
- Nihai Studio authorization server-side helper ve RLS ile tekrar yapılmalıdır.
- Yalnız current `aal2` Studio için yeterlidir.
- Owner profile aynı Auth UUID'ye bağlı, active ve owner/admin olmalıdır.
- Client metadata veya owner e-postası authorization için kullanılmaz.
- Service role normal Auth veya CRUD akışında kullanılmaz.

## Cookie sınırı

- Next.js 16 `cookies()` async kullanılır.
- Server Component cookie okuyabilir.
- Cookie yazma desteklenmeyen render bağlamında güvenli biçimde atlanır.
- Writable refresh Proxy, Server Function veya Route Handler üzerinden yapılır.
- Proxy response cookie'leri redirect response'a taşınır.

## Test sonucu

Başarılı:

- `npm ci`
- `npm run test:supabase`
- `npm run lint`
- `npm run typecheck`
- Supabase env kaldırılmış durumda `npm run build`

Build çıktısı:

- Public mock rotaları üretildi.
- `ƒ Proxy (Middleware)` kaydı görüldü.
- Supabase env eksikliği build'i düşürmedi.

## Audit

- Sonuç: 2 moderate
- Advisory: `GHSA-qx2v-qp2m-jg93`
- Kaynak: Next.js içindeki PostCSS
- `npm audit fix --force` çalıştırılmadı.
- Force fix'in Next.js'i kırıcı biçimde `9.3.3` sürümüne düşürmesi nedeniyle kabul edilmedi.

## Secret denetimi

- Gerçek Supabase URL: yok
- Gerçek publishable key: yok
- Gerçek service-role key: yok
- Gerçek JWT: yok
- Password: yok
- Owner UUID: yok
- Owner e-postası yalnız karar/onay belgesinde bulunabilir; kaynak authorization kodunda hard-code edilmez
- `supabase.co` eşleşmeleri resmî doküman bağlantıları veya test placeholder'ıdır
- `eyJ` eşleşmesi package integrity hash'idir; JWT değildir

## Kullanıcı kararları

Onaylandı:

- Development project
- APAC — Southeast Asia (Singapore)
- Development/Production ayrı project
- Email/password
- Magic link kapalı
- TOTP zorunlu
- Studio current `aal2`
- Active owner profile allowlist
- Yaklaşık 8 saat session hedefi
- `public-assets` / `private-files`
- Public 10 MB / private 25 MB
- Public JPEG/PNG/WebP/AVIF
- Development seed
- Development SQL uygulaması
- Sprint 06 implementasyonu

Production migration ayrı kullanıcı onayı bekler.

## Studio hattına entegrasyon notları

- Studio server layout, `getStudioAuthorization()` çağırmadan içerik render etmemelidir.
- `configuration_missing` güvenli unavailable ekranı veya yönlendirmesi üretmelidir.
- `unauthenticated` login'e yönlendirilmelidir.
- `unauthorized` generic denied davranışı göstermeli ve Studio veri sorgusuna geçmemelidir.
- `mfa_required` TOTP challenge/enrollment akışına yönlendirilmelidir.
- Her Server Action ve Route Handler authorization helper'ı tekrar çağırmalıdır.
- Normal Studio sorguları user session + RLS kullanmalıdır.
- Service role normal CRUD'a eklenmemelidir.
- Login UI browser client factory'sini kullanabilir; secret import edemez.

## Yapılmayan işler

- Supabase Dashboard project oluşturma
- Migration/seed çalıştırma
- Gerçek env değeri commit etme
- Owner Auth hesabı oluşturma
- Login formu
- TOTP QR/enrollment/challenge UI
- Studio server layout entegrasyonu
- CRUD
- Storage upload
- Public database cutover
- Production Supabase env veya migration
- PWA
- Force push/history rewrite
- `zz` commit mesajı değiştirme

## Vercel

- Branch push automatic Preview Deployment tetiklemelidir.
- Preview env henüz girilmediyse build başarılı kalır.
- Auth ve Studio fail closed kalır.
- Bu durum blocker değil: `runtime env pending`.
- Production Supabase env bu sprintte eklenmez.

## Blockerlar

Core source implementasyonu için blocker yok.

Runtime doğrulama için bekleyen dış işlemler:

- Development Supabase project oluşturma
- Local/Vercel Preview gerçek env değerleri
- SQL migration ve seed
- Owner Auth + TOTP kurulumu
- Studio UI/layout entegrasyonu
- Preview runtime kabul testi
