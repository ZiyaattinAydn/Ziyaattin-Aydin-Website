# Studio Supabase Development Runbook — Sprint 06

## Ortam

- Project: ziyaattin-aydin-website-dev
- Region: APAC — Southeast Asia (Singapore)
- Development ve production ayrı project olarak tutulur.
- Production project ve Production Vercel env bu sprintte değiştirilmez.
- Secret değerler sohbet, Git, source code, log veya dokümana yazılmaz.

## Environment

Local .env.local ve yalnız Vercel Preview:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NEXT_PUBLIC_SITE_URL

SUPABASE_SERVICE_ROLE_KEY normal Auth/Studio runtime env'sine eklenmez.

## Auth Dashboard baseline

- Email/password: enabled
- Public signup: disabled
- Manual linking: disabled
- Anonymous sign-in: disabled
- TOTP: enabled
- SMS MFA: disabled
- AAL1 session duration limit: enabled
- Recovery code UI: yok

## Migration sırası ve development sonucu

1. 202607100001_initial_schema.sql — başarılı
2. 202607100002_database_functions.sql — başarılı
3. 202607100003_rls_policies.sql — başarılı
4. 202607100004_storage_setup.sql — hosted-compatible bucket setup

Hosted Supabase SQL Editor, storage.objects relation sahibi olmadığı için
policy DDL'si SQLSTATE 42501 ile reddedildi. Managed role/ownership değiştirilmedi.
İki bucket migration ile, sekiz policy ise
docs/studio/STUDIO_STORAGE_POLICY_RUNBOOK.md üzerinden Dashboard'da kuruldu.

## Owner aktivasyonu

- Auth Dashboard'dan e-posta/şifre owner hesabı oluşturuldu.
- Auto confirm uygulandı.
- Trigger pending owner_profiles satırı oluşturdu.
- Trusted SQL ile yalnız hedef profil role=owner, status=active yapıldı.
- Active owner/admin count = 1 doğrulandı.
- Gerçek UUID repository'ye yazılmadı.

## Development seed

Seed tam bir active owner/admin profilini server-side çözer.
UUID veya owner e-postası repository'ye yazılmaz.

Doğrulanan deterministic satırlar:

- projects: 1
- writings: 1
- tasks: 1
- notes: 1

## Local Auth/MFA kabulü

- Yanlış parola reddedildi ve generic hata gösterildi.
- İlk TOTP enrollment tamamlandı.
- Yanlış TOTP reddedildi.
- Doğru TOTP current AAL2 oluşturdu.
- AAL1 ile doğrudan /studio erişimi /mfa'ya yönlendirildi.
- AAL2 ile Studio açıldı.
- Logout session'ı temizleyip /login'e döndürdü.
- Geri tuşu ve doğrudan Studio URL private içerik göstermedi.
- İkinci verified TOTP faktörü eklendi.
- Son verified faktörü kaldırma koruması doğrulandı.
- Allowlist dışı authenticated kullanıcı Studio'ya alınmadı.

## RLS kabul matrisi

Anonymous:

- projects/writings/journey SELECT privilege: true/true/true
- tasks/notes/files/publish_queue SELECT privilege: false/false/false/false
- Görünür seed satırları projects/writings/journey: 0/1/0

Allowlist dışı authenticated AAL2:

- is_current_user_owner: false
- projects/writings/tasks/notes/files/publish_queue: 0/1/0/0/0/0

Active owner AAL2:

- is_current_user_owner: true
- owner_profiles/projects/writings/tasks/notes/files/publish_queue:
  1/1/1/1/1/0/0

## Vercel Preview

Yalnız Preview environment'a development URL, publishable key ve Preview site
URL girildi. Deployment yeniden oluşturuldu ve şu testler geçti:

- login
- yanlış TOTP
- doğru TOTP ve Studio
- logout
- direct Studio guard

Production env boş bırakıldı ve production mock davranışı korunur.

## Session hedefi

Yaklaşık sekiz saatlik mutlak Studio session hedefi Free plan/Dashboard
desteğiyle uygulanamadı. Uydurma session API eklenmedi.

Uygulanan güvenlik:

- Dashboard AAL1 süresi 15 dakika ile sınırlandı.
- Her korumalı Studio request'inde trusted user + active owner + current AAL2
  server-side kontrolü devam eder.
- Production plan kararı sırasında time-box ve inactivity timeout yeniden
  değerlendirilecektir.
