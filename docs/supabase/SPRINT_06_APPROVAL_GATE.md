# Sprint 06 User Approval Gate

Durum: **APPROVED / IMPLEMENTATION AUTHORIZED**

- Karar tarihi: 2026-07-10
- Onaylayan: Ziyaattin
- Core runtime commit: `6d51ff3`
- Production migration: ayrı onay gerektirir

| Karar | Onaylanan değer | Durum |
| --- | --- | --- |
| Development Supabase project | Şimdi oluşturulacak | `APPROVED` |
| Environment stratejisi | Development ve Production ayrı project | `APPROVED` |
| Development region | APAC — Southeast Asia (Singapore) | `APPROVED` |
| Owner Auth e-postası | `ziyaattin.aydin35@gmail.com` | `APPROVED` |
| Auth provider | Email/password | `APPROVED` |
| Magic link | İlk sürümde kapalı | `APPROVED` |
| MFA yöntemi | TOTP authenticator | `APPROVED` |
| Studio MFA zorunluluğu | `/studio/**` için current `aal2` | `APPROVED` |
| Owner allowlist | Active `owner_profiles` + Auth UUID | `APPROVED` |
| Client role/e-posta yetkisi | Yetkilendirme kaynağı olamaz | `APPROVED` |
| Session hedefi | Yaklaşık 8 saat; plan desteği ayrıca doğrulanır | `APPROVED` |
| Public bucket | `public-assets` | `APPROVED` |
| Private bucket | `private-files` | `APPROVED` |
| Public dosya limiti | 10 MB | `APPROVED` |
| Private dosya limiti | 25 MB | `APPROVED` |
| Public MIME allowlist | JPEG, PNG, WebP, AVIF | `APPROVED` |
| Development seed | Yalnız development project'te çalıştırılabilir | `APPROVED` |
| Sprint 05 SQL paketi | Development project'te kontrollü sırayla uygulanabilir | `APPROVED` |
| Sprint 06 implementasyonu | Core/Public/Studio hatları başlayabilir | `APPROVED` |
| Production Supabase env | Bu sprintte girilmeyecek | `APPROVED` |
| Production migration | Preview kabulünden sonra ayrı kullanıcı onayı | `PENDING_SEPARATE_APPROVAL` |
| Recovery ayrıntıları | Studio/Auth uygulaması sırasında ayrıca kesinleştirilecek | `DEFERRED` |
| Private MIME allowlist ayrıntıları | Storage uygulaması sırasında ayrıca kesinleştirilecek | `DEFERRED` |

## Uygulama Yetkisi

```text
Decision date: 2026-07-10
Approved by: Ziyaattin
Sprint 06 implementation authorized: yes
SQL non-production application authorized: yes
Development seed authorized: yes
Production migration authorized: no
```

## Core Sprint 06 kapsamı

Core hattı için onaylanan işler:

- Supabase SSR paketleri
- Canonical publishable key environment sözleşmesi
- Browser/server/Proxy client factory'leri
- Cookie tabanlı session refresh temeli
- Next.js 16 Proxy
- Güvenli internal redirect
- Server-side trusted user, active owner ve `aal2` helper'ları
- Env yokken public mock build'in korunması
- Env yokken Auth/Studio fail-closed davranışı

## Core kapsamında yapılmayanlar

- Supabase Dashboard'da project oluşturma
- SQL migration veya seed çalıştırma
- Gerçek env değeri commit etme
- Owner Auth kullanıcısı oluşturma
- Login ve TOTP UI
- Studio route layout entegrasyonu
- CRUD, Storage upload veya Public database cutover
- Production Supabase environment veya migration
