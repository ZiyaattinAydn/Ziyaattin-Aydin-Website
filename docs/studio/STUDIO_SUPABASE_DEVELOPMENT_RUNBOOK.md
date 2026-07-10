# Studio Supabase Development Runbook — Sprint 06

## Proje

- Ayrı development projesi
- Önerilen ad: `ziyaattin-aydin-website-dev`
- Region: APAC — Southeast Asia (Singapore)
- Production projesi ve Production Vercel env bu sprintte değiştirilmez.

Secret değerler sohbet, Git, source code, log veya ekran görüntüsüne eklenmez.

## Environment

Local `.env.local` ve yalnız Vercel Preview environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

`SUPABASE_SERVICE_ROLE_KEY` uygulama runtime env’sine eklenmez.

## Migration sırası

SQL Editor’da dosyalar ayrı ayrı ve kesin sırayla çalıştırılır:

1. `supabase/migrations/202607100001_initial_schema.sql`
2. `supabase/migrations/202607100002_database_functions.sql`
3. `supabase/migrations/202607100003_rls_policies.sql`
4. `supabase/migrations/202607100004_storage_setup.sql`

Bir dosya hata verirse sonraki dosyaya geçilmez. Rastgele SQL değişikliği yapılmaz.

## Owner aktivasyonu

Auth Dashboard’dan owner e-posta/şifre kullanıcısı oluşturulur. Trigger pending
`owner_profiles` satırı üretir. Gerçek UUID sohbet veya repository’ye yazılmadan
SQL Editor çalışma kopyasında şu alanlar kontrollü biçimde güncellenir:

- `role = 'owner'`
- `status = 'active'`
- `activated_at = now()`

Yalnız hedef UUID satırı güncellenmeli ve başka active owner bulunmadığı
doğrulanmalıdır.

## Development seed

`supabase/seed/202607100001_development_seed.sql` dosyasındaki
`REPLACE_WITH_OWNER_UUID` yalnız SQL Editor çalışma kopyasında gerçek owner UUID
ile değiştirilir. Repository dosyası değiştirilmez. Seed yalnız development
projesinde çalıştırılır.

## Auth ayarları

- Email/password açık
- Public signup kapalı
- Magic link ürün akışında kullanılmıyor
- TOTP MFA açık
- Recovery code UI yok
- Studio current AAL2 olmadan kapalı

## Yaklaşık sekiz saatlik session hedefi

Uygulama her korumalı istekte server-side AAL2 kontrolü yapar. Supabase planı veya
Dashboard mevcut oturum süresi ayarını tam sekiz saate sabitlemiyorsa özel/uydurma
session API eklenmez. JWT/session ayarı Dashboard’da desteklenen en yakın güvenli
değere çekilir ve kalan sınırlama deployment kaydına yazılır.
